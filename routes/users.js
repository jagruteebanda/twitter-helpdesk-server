var express = require('express');
var router = express.Router();
const User = require('../databaseFunctions/User/indexUser');

/* Login API. */
router.post('/login', function (req, res, next) {
  console.log(req.body);
  User.find(req.body, (error, result) => {
    if (error) {
      res.send({
        code: 406,
        message: 'error',
        error
      });
    }
    if (result) {
      res.send({
        code: 200,
        message: 'login successfully'
      });
    }
  });
});

/* Register API. */
router.post('/register', function (req, res, next) {
  if (req.body) {
    User.create(req.body,(error, result) => {
      if (error) {
        res.send({
          code: 406,
          message: 'error',
          error
        })
      }
      if (result) {
        res.send({
          code: 200,
          message: 'registered successfully',
          data: result
        });
      }
    });
  }
});


module.exports = router;
