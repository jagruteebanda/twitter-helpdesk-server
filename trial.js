// var request = require("request");

// var options = { method: 'GET',
//   url: 'https://api.twitter.com/1.1/direct_messages/events/list.json',
//   headers: 
//    { 'postman-token': '30c6ca2c-d3ab-b560-2a66-146cf668134e',
//      'cache-control': 'no-cache',
//      host: 'api.twitter.com',
//      'content-length': '76',
//      'user-agent': 'OAuth gem v0.4.4',
//      connection: 'close',
//      accept: '*/*',
//      'content-type': 'application/x-www-form-urlencoded',
//      authorization: `OAuth oauth_consumer_key=\\"8BAo7UZE2sH3EZWDjqGA2GPl1\\",oauth_token=\\"1280422772561244160-8KeZDqoqw1SMOgnNgTEF8LnLxSr3iv\\",oauth_signature_method=\\"HMAC-SHA1\\",oauth_timestamp=\\"${+new Date()}\\",oauth_nonce=\\"mCVbQ9\\",oauth_version=\\"1.0\\",oauth_signature=\\"%2FuYW9Kh%2FXeVEc%2F953n9fKYtyHq4%3D\\"` } };

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(body);
// });

const Twit = require("twit");
const API_KEYS = require("./config/api_keys");

var twitterAPIClient = new Twit({
  consumer_key: API_KEYS.CONSUMER_KEY,
  consumer_secret: API_KEYS.CONSUMER_SECRET,
  access_token: API_KEYS.ACCESS_TOKEN,
  access_token_secret: API_KEYS.ACCESS_TOKEN_SECRET,
  // timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
});


const handleStream = twitterAPIClient.stream("statuses/filter", {
  track: "@Jagz22925494"
});

// userSocket.emit('heelo', 'hello');

handleStream.on("tweet", function (tweet) {
  console.log(tweet.text);
//   // userSocket.emit("tweet", { tweet: tweet });
//   // dbFunctions.saveCustomer(tweet.user);
//   // dbFunctions.saveTweet(tweet);
});

// const stream = twitterAPIClient.stream("user");
handleStream.on("direct_message", function (directMsg) {
  console.log(directMsg);
});

twitterAPIClient.get('direct_messages/events/list', { q: '@Jagrutee2' }, (err, data, response) => {
  console.log(data);
})