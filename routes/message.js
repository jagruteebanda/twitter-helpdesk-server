var express = require("express");
var router = express.Router();
const request = require("request");

const messageList = require('../responsedata/messageList'); // static data

/* GET home page. */
router.get("/list", function (req, res, next) {

  // var options = {
  //   method: "GET",
  //   url: "https://api.twitter.com/1.1/direct_messages/events/list.json",
  //   headers: {
  //     "postman-token": "ddc20345-0096-98e1-e897-e111434c22b7",
  //     "cache-control": "no-cache",
  //     host: "api.twitter.com",
  //     "content-length": "76",
  //     "user-agent": "OAuth gem v0.4.4",
  //     connection: "close",
  //     accept: "*/*",
  //     "content-type": "application/x-www-form-urlencoded",
  //     authorization:
  //       'OAuth oauth_consumer_key=\\"8BAo7UZE2sH3EZWDjqGA2GPl1\\",oauth_token=\\"1280422772561244160-8KeZDqoqw1SMOgnNgTEF8LnLxSr3iv\\",oauth_signature_method=\\"HMAC-SHA1\\",oauth_timestamp=\\"1594296582\\",oauth_nonce=\\"o1Teg0\\",oauth_version=\\"1.0\\",oauth_signature=\\"mRuGAoIZWtvVDPHdcYeaGwuKyoU%3D\\"',
  //   },
  // };

  // request(options, function (error, response, body) {
  //   if (error) {
  //     console.log(error);
  //     res.send({
  //       code: 406,
  //       error,
  //     });
  //   }
  //   if (body) {
  //     console.log(body);
  //     res.send({
  //       code: 200,
  //       data: body,
  //     });
  //   }
  //   res.send({
  //     code: 200,
  //     message: 'No data'
  //   })
  // });

  twitterAPIClient.get('direct_messages/events/list', { q: '@Jagrutee2' }, (err, data, response) => {
    // console.log(data);
    res.send({
      code: 200,
      data: data
    });
  });

});

module.exports = router;
