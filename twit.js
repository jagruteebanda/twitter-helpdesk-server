// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// const Twit = require('twit');
// const http = require("http");
// const socketIo = require("socket.io");
// const { Client } = require('pg');

// const postgresConfig = require('./config/postgresConfig');
// const API_KEYS = require('./config/api_keys');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// // ROUTES to define APIs
// app.use('/', indexRouter);
// // app.use('/users', usersRouter);

// // Global data for database connections
// global.db = {};

// /**
//  * POSTGRESQL SERVER CONNECTION 
//  */
// const pgClient = new Client(postgresConfig.localPGConfig);
// global.db.pgClient = pgClient;
// pgClient.connect();

// /**
//  * TWITTER API CLIENT INITIALIAZTION
//  */
// // Creating Twitter connection
// var twitterAPIClient = new Twit({
//   consumer_key: API_KEYS.CONSUMER_KEY,
//   consumer_secret: API_KEYS.CONSUMER_SECRET,
//   access_token: API_KEYS.ACCESS_TOKEN,
//   access_token_secret: API_KEYS.ACCESS_TOKEN_SECRET,
//   timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
// });
// // Saving twitter API client data in global
// global.twitterAPIClient = twitterAPIClient;


/**
 * INGESTION PORT CONNECTIONS
 */
// Specify ingestion socket port
// const ingestionPort = process.env.IPORT || 5001;
// Creating ingestion server
// const ingestionServer = http.createServer(app);
// Socket connection for ingestion
// const receiver = socketIo(ingestionServer);
// receiver.on("connection", socket => {
//   console.log('Connected to ingestion client');
//   socket.on("disconnect", () => console.log("Client disconnected"));
// });
// Ingestion server listening to Ingestion port
// ingestionServer.listen(ingestionPort, () => console.log(`Listening on port ${ingestionPort}`));


// /**
//  * BROADCAST PORT CONNECTIONS
//  */
// // Specify broadcast socket port
// const broadcastPort = process.env.BPORT || 5002;
// // Creating broadcast server
// const broadcastServer = http.createServer(app);
// // Socket connection for broadcast
// const broadcast = socketIo(broadcastServer);
// broadcast.on("connection", userSocket => {
//   console.log('Connected to broadcast client');
//   global.userSocket = userSocket;
//   userSocket.on("disconnect", () => console.log("Client disconnected"));
// });
// // Ingestion server listening to Broadcast port
// broadcastServer.listen(broadcastPort, () => console.log(`Listening on port ${broadcastPort}`));


// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
const request = require('request');
const API_KEYS = require('./config/api_keys');

request.post(
  {
    url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
    oauth: {
      consumer_key: API_KEYS.CONSUMER_KEY,
      consumer_secret: API_KEYS.CONSUMER_SECRET,
      token: 'Am7eNAAAAAABFyd_AAABcz56Txc',
    },
    form: { oauth_verifier: 'mWvovQPGkmSonxMseSmIYp2lxIuMzUCN' },
  },
  function (err, r, body) {
    // if (err) {
    //   return res.send(500, { message: err.message });
    // }
    console.log(err);
    const bodyString =
      '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
    const parsedBody = JSON.parse(bodyString);
    console.log('body: ', parsedBody);
    // req.body["oauth_token"] = parsedBody.oauth_token;
    // req.body["oauth_token_secret"] = parsedBody.oauth_token_secret;
    // req.body["user_id"] = parsedBody.user_id;

  }
);
