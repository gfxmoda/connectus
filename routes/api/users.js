const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// @route      GET api/users/test
// @desc       Tests users route
// @access     Public
router.get("/test", (req, res) => res.json({ msg: "Users works" }));

// Load user model
const User = require("../../models/User");

// @route      POST api/users/register
// @desc       Registers a user
// @access     Public
router.post("/register", (req, res) => {
  // Destructuring errors and invalid function from the validatorRegisterInput function in register.js validation file
  const { errors, isValid } = validateRegisterInput(req.body);

  // check the validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "This email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", // rating
        d: "mm", // default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(newUser.password, salt, (error, hash) => {
          if (error) throw error;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((error) => console.log(error));
        });
      });
    }
  });
});

// @route      GET api/users/login
// @desc       Login User/ Returning the JWT (json web token)
// @access     Public
router.post("/login", (req, res) => {
  // Destructuring errors and invalid function from the validatorRegisterInput function in register.js validation file
  const { errors, isValid } = validateLoginInput(req.body);

  // check the validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // find user by email
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        errors.email = "User not found";
        return res.status(404).json(errors);
      }

      // check password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // generate the token

          // create the jwt paylod
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          };

          // sign the token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 3600,
            },
            (error, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          errors.password = "Password incorrect";
          return res.status(400).json(errors);
        }
      });
    })
    .catch();
});

// @route      GET api/users/current
// @desc       Return current User
// @access     Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
    });
  }
);

module.exports = router;
