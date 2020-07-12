var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const bodyParser = require("body-parser");
const cors = require("cors");

// const http = require("http");
// const socketIo = require("socket.io");

const Twit = require("twit");
const pg = require("pg");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const session = require("express-session");

const postgresConfig = require("./config/postgresConfig");
const API_KEYS = require("./config/api_keys");

// const dbFunctions = require("./database/dbFuncIndex");

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var usersRouter = require("./routes/users");
var tweetsRouter = require("./routes/tweet");
var messageRouter = require("./routes/message");
// const saveCustomer = require("./database/saveCustomer");

// For webhooks
const { Autohook } = require("twitter-autohook");
// const twitterWebhooks = require("twitter-webhooks");

var app = express();

// Global data for database connections
global.db = {};
global.app = app;

// require after app is defined
const socket = require("./init/socketConnections");

/**
 * POSTGRESQL SERVER CONNECTION
 */
// const pgClient = new Client(postgresConfig.localPGConfig);
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
pg.defaults.ssl = true;
const pgClient = new pg.Client(postgresConfig.herokuPGConfig);
global.db.pgClient = pgClient;
pgClient.connect();

/**
 * AUTHENTICATION INITIALIZATION
 */
passport.use(
  new TwitterStrategy(
    {
      consumerKey: API_KEYS.CONSUMER_KEY,
      consumerSecret: API_KEYS.CONSUMER_SECRET,
      // callbackURL: "http://jagz.com:3001/home",
      // callbackURL: "http://jagz.com:3000/twitter/callback",
      callbackURL: "https://client-helpdesk.herokuapp.com/home",
      proxy: true,
    },
    function (token, tokenSecret, profile, cb) {
      console.log(profile);
      cb(null, profile);
    }
  )
);

passport.serializeUser(function (user, callback) {
  callback(null, user);
});

passport.deserializeUser(function (obj, callback) {
  callback(null, obj);
});

// global.passport = passport;

/**
 * TWITTER API CLIENT INITIALIAZTION
 */
// Creating Twitter connection
var twitterAPIClient = new Twit({
  consumer_key: API_KEYS.CONSUMER_KEY,
  consumer_secret: API_KEYS.CONSUMER_SECRET,
  access_token: API_KEYS.ACCESS_TOKEN,
  access_token_secret: API_KEYS.ACCESS_TOKEN_SECRET,
  // timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
});
// Saving twitter API client data in global
global.twitterAPIClient = twitterAPIClient;

// streaming tweets for specific handle
// const handleStream = twitterAPIClient.stream("statuses/filter", {
//   track: "@Jagrutee2",
// });

// handleStream.on("tweet", function (tweet) {
//   console.log(tweet.text);
//   socket.broadcast.emit("tweet", { tweet: tweet });
//   // dbFunctions.saveCustomer(tweet.user);
//   // dbFunctions.saveTweet(tweet);
// });

// const msgStream = twitterAPIClient.stream("direct_messages");
// handleStream.on("direct_message", function (directMsg) {
//   console.log(directMsg);
//   userSocket.emit("message", { message: directMsg });
// });

app.set("port", process.env.PORT || 3000);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: "whatever", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

var corsOption = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["x-auth-token"],
};
app.use(cors(corsOption));

// to parse json
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// ROUTES to define APIs
app.use("/", indexRouter);
// app.use("/apis/auth", authRouter);
app.use("/apis/user", usersRouter);
app.use("/apis/tweets", tweetsRouter);
app.use("/apis/message", messageRouter);

/* twitter login API. */
app.get("/twitter/login", passport.authenticate("twitter"));

// app.get(
//   "/twitter/callback",
//   passport.authenticate("twitter", {
//     failureRedirect: "/",
//   }),
//   function (req, res) {
//     console.log(req);
//     // res.redirect("/");

//     res.setHeader("x-auth-token", req.token);
//     res.redirect("http://jagz.com:3001/home");
//   }
// );

const EventEmitter = require("events");
class AuthEmitter extends EventEmitter {}
const authEmitter = new AuthEmitter();

global.authEmitter = authEmitter;

authEmitter.on("get_oauth", (data) => {
  console.log("an event occurred!", data);
  (async hook => {
    const webhook = new Autohook({
      token: API_KEYS.ACCESS_TOKEN,
      token_secret: API_KEYS.ACCESS_TOKEN_SECRET,
      consumer_key: API_KEYS.CONSUMER_KEY,
      consumer_secret: API_KEYS.CONSUMER_SECRET,
      env: 'dev',
      port: 1337
    });

    try {

      // Removes existing webhooks
      await webhook.removeWebhooks();

      // Listens to incoming activity
      webhook.on('event', event => {
        // Direct Message Event
        if (event.direct_message_events && event.direct_message_events.length > 0) {
          socket.broadcast.emit('message', {
            message: event.direct_message_events
          });
        }

        // Tweet Event
        if (event.tweet_create_events && event.tweet_create_events.length > 0) {
          socket.broadcast.emit('tweet', {
            tweet: event.tweet_create_events
          });
        }
      });

      // Starts a server and adds a new webhook
      await webhook.start();

      // Subscribes to a user's activity
      await webhook.subscribe(data);
    } catch (err) {
      console.log('Error in webhook:: ', err);
    }
  })();
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

console.log("Server running on port", app.get("port"));

module.exports = app;
