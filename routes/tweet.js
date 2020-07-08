var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/get', function (req, res, next) {
  let tweets = [
    {
      user: {
        profile_image_url:
          "http://pbs.twimg.com/profile_images/1268287767966072834/HdqRqVJR_normal.jpg",
        name: "Mbah Enow",
      },
      text: "Hello there! May I ask a favor?",
    },
    {
      user: {
        profile_image_url:
          "http://pbs.twimg.com/profile_images/1268287767966072834/HdqRqVJR_normal.jpg",
        name: "Mbah sjhskjdf",
      },
      text: "Hello there! May I ask a favor?",
    },
  ];
  res.send({
    code: 200,
    data: tweets
  })
});

module.exports = router;
