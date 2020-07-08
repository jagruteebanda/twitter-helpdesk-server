var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/get', function (req, res, next) {
  global.twitterAPIClient.get('search/tweets', { q: '#JDChaavi since:2020-07-01', count: 100 }, function(err, data, response) {
    res.send({
      code: 200,
      data: data.statuses
    });
  })
  
});

module.exports = router;
