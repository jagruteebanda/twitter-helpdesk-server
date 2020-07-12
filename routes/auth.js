const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const request = require("request");

const API_KEYS = require("../config/api_keys");

const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;

passport.use(
  new TwitterStrategy(
    {
      consumerKey: API_KEYS.CONSUMER_KEY,
      consumerSecret: API_KEYS.CONSUMER_SECRET,
      // callbackURL: "http://localhost:3001/home",
      callbackURL: "http://localhost:3000/apis/auth/twitter/login",
      // callbackURL: "https://client-helpdesk.herokuapp.com/home",
      proxy: true,
    },
    function (token, tokenSecret, profile, cb) {
      // console.log(profile);
      cb(null, profile);
    }
  )
);

var generateToken = function (req, res, next) {
  req.token = createToken(req.auth);
  return next();
};

var sendToken = function (req, res) {
  res.setHeader('x-auth-token', req.token);
  return res.status(200).send(JSON.stringify(req.user));
};

const createToken = function (auth) {
  return jwt.sign(
    {
      id: auth.id,
    },
    "my-secret",
    {
      expiresIn: 60 * 120,
    }
  );
};

const authenticate = expressJwt({
  secret: "my-secret",
  algorithms: ["HS256"],
  requestProperty: "auth",
  getToken: function (req) {
    if (req.headers["x-auth-token"]) {
      return req.headers["x-auth-token"];
    }
    return null;
  },
});

router.route("/twitter/callback").post(function (req, res) {
  request.post(
    {
      url: "https://api.twitter.com/oauth/request_token",
      oauth: {
        oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
        consumer_key: API_KEYS.CONSUMER_KEY,
        consumer_secret: API_KEYS.CONSUMER_SECRET,
      },
    },
    function (err, r, body) {
      if (err) {
        return res.send(500, { message: e.message });
      }

      var jsonStr =
        '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      res.send(JSON.parse(jsonStr));
    }
  );
});

router.route("/twitter/login").post(
  (req, res, next) => {
    request.post(
      {
        url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
        oauth: {
          consumer_key: API_KEYS.CONSUMER_KEY,
          consumer_secret: API_KEYS.CONSUMER_SECRET,
          token: req.query.oauth_token,
        },
        form: { oauth_verifier: req.query.oauth_verifier },
      },
      function (err, r, body) {
        if (err) {
          return res.send(500, { message: err.message });
        }

        const bodyString =
          '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        const parsedBody = JSON.parse(bodyString);

        req.body["oauth_token"] = parsedBody.oauth_token;
        req.body["oauth_token_secret"] = parsedBody.oauth_token_secret;
        req.body["user_id"] = parsedBody.user_id;

        next();
      }
    );
  },
  passport.authenticate("twitter-token", { session: false }),
  function (req, res, next) {
    if (!req.user) {
      return res.send(401, "User Not Authenticated");
    }

    // prepare token for API
    req.auth = {
      id: req.user.id,
    };

    return next();
  },
  generateToken,
  sendToken
);

module.exports = router;
