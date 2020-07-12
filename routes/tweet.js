var express = require("express");
var router = express.Router();
const request = require("request");
const API_KEYS = require("../config/api_keys");

// const tweetsList = require("../responsedata/tweetsList"); // static data

/* GET home page. */
router.post("/list", function (req, res, next) {
  // console.log(req.body.userHandle);
  if (req.body.userHandle) {
    global.twitterAPIClient.get(
      "search/tweets",
      { q: `${req.body.userHandle}`, count: 100 },
      function (err, data, response) {
        if (err) {
          res.send({
            code: 200,
            err,
          });
        }
        res.send({
          code: 200,
          data: {
            tweets: data.statuses,
          },
        });
      }
    );
  } else {
    request.post(
      {
        url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
        oauth: {
          consumer_key: API_KEYS.CONSUMER_KEY,
          consumer_secret: API_KEYS.CONSUMER_SECRET,
          token: req.body.oauth_token,
        },
        form: { oauth_verifier: req.body.oauth_verifier },
      },
      (err, r, body) => {
        if (err) {
          return res.send({
            code: 500,
            err,
          });
        }
        const bodyString =
          '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        const parsedBody = JSON.parse(bodyString);
        console.log("body: ", parsedBody);

        global.authEmitter.emit('get_oauth', {
          user_id: parsedBody.user_id,
          oauth_token: parsedBody.oauth_token,
          oauth_token_secret: parsedBody.oauth_token_secret
        });

        global.twitterAPIClient.get(
          "search/tweets",
          { q: `${parsedBody["screen_name"]}`, count: 20 },
          function (err, data, response) {
            if (err) {
              res.send({
                code: 200,
                err,
              });
            }
            res.send({
              code: 200,
              data: {
                twitterUserData: {
                  userId: parsedBody.user_id,
                  userHandle: parsedBody.screen_name
                },
                tweets: data.statuses,
              },
            });
          }
        );
      }
    );
  }
});

module.exports = router;
