var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const bodyParser = require("body-parser");
const cors = require("cors");

const Twit = require("twit");
const http = require("http");
const socketIo = require("socket.io");
const pg = require("pg");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const session = require("express-session");

const postgresConfig = require("./config/postgresConfig");
const API_KEYS = require("./config/api_keys");

const dbFunctions = require("./databaseFunctions/dbFuncIndex");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var tweetsRouter = require("./routes/tweet");
var messageRouter = require("./routes/message");
const saveCustomer = require("./databaseFunctions/saveCustomer");

var app = express();

// Global data for database connections
global.db = {};

/**
 * POSTGRESQL SERVER CONNECTION
 */
// const pgClient = new Client(postgresConfig.localPGConfig);
// const pgClient = new Client(postgresConfig.herokuPGConfig);
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
pg.defaults.ssl = true;
const pgClient = new pg.Client(postgresConfig.herokuPGConfig);
// const pgClient = new pg.Pool(postgresConfig.herokuPGConfig);
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
      callbackURL: "https://client-helpdesk.herokuapp.com/home",
      proxy: true,
    },
    function (token, tokenSecret, profile, cb) {
      // console.log(profile);
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

/**
 * BROADCAST PORT CONNECTIONS
 */
// Specify broadcast socket port
const broadcastPort = process.env.BPORT || 5002;
// Creating broadcast server
const broadcastServer = http.createServer(app);
// Socket connection for broadcast
const broadcast = socketIo(broadcastServer);
broadcast.on("connection", (userSocket) => {
  console.log("Connected to broadcast client");
  global.userSocket = userSocket;

  // streaming tweets for specific handle
  const handleStream = twitterAPIClient.stream("statuses/filter", {
    track: "@Jagrutee2"
  });

  userSocket.emit('heelo', 'hello');

  handleStream.on("tweet", function (tweet) {
    console.log(tweet.text);
    userSocket.emit("tweet", { tweet: tweet });
    // dbFunctions.saveCustomer(tweet.user);
    // dbFunctions.saveTweet(tweet);
  });

  // const stream = twitterAPIClient.stream("user");
  // handleStream.on("direct_message", function (directMsg) {
  //   console.log(directMsg);
  // });

  userSocket.on("disconnect", () => console.log("Client disconnected"));
});
// Ingestion server listening to Broadcast port
broadcastServer.listen(broadcastPort, () =>
  console.log(`Listening on port ${broadcastPort}`)
);

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
app.use(cors());

// to parse json
app.use(bodyParser.json());

// ROUTES to define APIs
app.use("/", indexRouter);
app.use("/apis/user", usersRouter);
app.use("/apis/tweets", tweetsRouter);
app.use("/apis/message", messageRouter);

/* twitter login API. */
app.get("/twitter/login", passport.authenticate("twitter"));

app.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/",
  }),
  function (req, res) {
    res.redirect("/");
    // res.redirect('http://jagz.com:3001/home');
  }
);

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

module.exports = app;
