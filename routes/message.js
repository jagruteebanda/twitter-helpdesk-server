var express = require("express");
var router = express.Router();
const request = require("request");

const messageList = require("../responsedata/messageList"); // static data

/* GET MESSAGES. */
router.get("/list", function (req, res, next) {
  twitterAPIClient.get(
    "direct_messages/events/list",
    { q: "@Jagrutee2" },
    (err, data, response) => {
      if (err)
        res.send({
          code: 406,
          error: err,
        });
      if (data)
        res.send({
          code: 200,
          data: data,
        });
    }
  );
});

/* POST MESSAGES. */
router.post("/send", function (req, res, next) {
  console.log(req.body);
  twitterAPIClient.post(
    "direct_messages/events/new",
    { event: req.body },
    (err, data, response) => {
      if (err)
        res.send({
          code: 200,
          error: err,
        });
      if (data)
        res.send({
          code: 200,
          data: data,
        });
    }
  );
});

module.exports = router;
