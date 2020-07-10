var express = require('express');
var router = express.Router();

const tweetsList = require('../responsedata/tweetsList'); // static data

/* GET home page. */
router.get('/get', function (req, res, next) {
  global.twitterAPIClient.get('search/tweets', { q: '@Jagrutee2 since:2020-07-01', count: 100 }, function(err, data, response) {
    res.send({
      code: 200,
      // data: tweetsList,
      data: data.statuses
    });
  });
  
});

module.exports = router;
