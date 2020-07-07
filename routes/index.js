var express = require('express');
// const app = express();
var router = express.Router();

// const server = require('http').Server(app);
// const socketIo = require("socket.io");

// const API_KEYS = require('../config/api_keys');

// var T = new Twit({
//   consumer_key: API_KEYS.CONSUMER_KEY,
//   consumer_secret: API_KEYS.CONSUMER_SECRET,
//   access_token: API_KEYS.ACCESS_TOKEN,
//   access_token_secret: API_KEYS.ACCESS_TOKEN_SECRET,
//   timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
// });


// socketIo.on('connection', function (socket) {

//   T.get('search/tweets', { q: '#coding', count: 100 }, function (err, data, response) {
//     var tweetArray = [];
//     for (let index = 0; index < data.statuses.length; index++) {
//       const tweet = data.statuses[index];
//       var tweetbody = {
//         'text': tweet.text,
//         'userScreenName': "@" + tweet.user.screen_name,
//         'userImage': tweet.user.profile_image_url_https,
//         'userDescription': tweet.user.description,
//       }
//       try {
//         if (tweet.entities.media[0].media_url_https) {
//           tweetbody['image'] = tweet.entities.media[0].media_url_https;
//         }
//       } catch (err) { }
//       tweetArray.push(tweetbody);
//     }
//     socketIo.emit('allTweet', tweetArray)
//   })

//   var stream = T.stream('statuses/filter', { track: '#coding', language: 'en' })

//   stream.on('tweet', function (tweet) {
//     socketIo.emit('tweet', { 'tweet': tweet });
//   })
// });


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
