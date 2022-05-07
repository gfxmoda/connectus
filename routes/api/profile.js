const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
// const key = require('../../config/keys');

// load validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// load profile model
const Profile = require("../../models/Profile");

// load user model
const User = require("../../models/User");

// @route      GET api/profile/test
// @desc       Tests profile route
// @access     Public
router.get("/test", (req, res) => res.json({ msg: "Profile works" }));

// @route      GET api/profile
// @desc       Gets current users profile
// @access     Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then((profile) => {
        if (!profile) {
          errors.profile = "There is no profile for this user";
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch((error) => res.status(404).json(error));
  }
);

// @route      GET api/profile/all
// @desc       Get all
// @access     Public
router.get("/all", (req, res) => {
  const errors = {}; // That line was missing - Fixed
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then((profiles) => {
      if (!profiles) {
        errors.profiles = "There are no profiles";
        return res.status(404).json(errors);
      }

      res.json(profiles); // or res.json(profile) <= directly without mentioning the response status
    })
    .catch((error) =>
      res
        .status(404)
        .json({ profiles: "MDB_ERR_ALL_PROFILE: There are no profiles" })
    );
});

// @route      GET api/profile/handle/:handle
// @desc       Get profile by handle
// @access     Public
router.get("/handle/:handle", (req, res) => {
  const errors = {}; // That line was missing - Fixed
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        console.log(profile);
        errors.profile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile); // or res.json(profile) <= directly without mentioning the response status
    })
    .catch((error) =>
      res
        .status(404)
        .json({ profile: "MDB_ERR_HANDLE: There is no profile for this user" })
    );
});

// @route      GET api/profile/user/:user_id <=<=<=<=
// @desc       Get profile by user_id
// @access     Public
router.get("/user/:user_id", (req, res) => {
  const errors = {}; // That line was missing - Fixed
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.profile = "There is no profile for this user (id)";
        return res.status(404).json(errors);
      }

      res.status(200).json(profile); // or res.json(profile) <= directly without mentioning the response status
    })
    .catch((error) =>
      res
        .status(404)
        .json({ profile: "MDB_ERR_ID: There is no profile for this user" })
    );
});

// @route      POST api/profile
// @desc       Create or edit user profile <=<=<=
// @access     Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // check validation
    if (!isValid) {
      // return any erros with 400 status
      return res.status(400).json(errors);
    }

    // get feilds
    const profileFeilds = {};
    profileFeilds.user = req.user.id;
    if (req.body.handle) profileFeilds.handle = req.body.handle;
    if (req.body.company) profileFeilds.company = req.body.company;
    if (req.body.website) profileFeilds.website = req.body.website;
    if (req.body.location) profileFeilds.location = req.body.location;
    if (req.body.bio) profileFeilds.bio = req.body.bio;
    if (req.body.status) profileFeilds.status = req.body.status;
    if (req.body.githubusername)
      profileFeilds.githubusername = req.body.githubusername;

    // skills - has to be split into array
    if (typeof req.body.skills !== "undefined") {
      profileFeilds.skills = req.body.skills.split(",");
    }

    // social is on its own object
    profileFeilds.social = {};
    // when the user provides a request, its body won't include the social is a parent to any of Yt, Tw, Fb
    // So it will be attached to the requrest body itself then once it's validated, we will assign the right peice of object to it
    // which is the profileFeilds.social.{...} <= Yt, Tw, Fb, etc...
    if (req.body.youtube) profileFeilds.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFeilds.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFeilds.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFeilds.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFeilds.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        // means this is an update request
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFeilds },
          { new: true }
        ).then((profile) => res.json(profile));
      } else {
        // means create a new one
        // check if the handle exists
        Profile.findOne({ handle: profileFeilds.handle }).then((profile) => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }

          // save the profile
          new Profile(profileFeilds)
            .save()
            .then((profile) => res.json(profile));
        });
      }
    });
  }
);

// @route      POST api/profile/experience
// @desc       Add experience to profile
// @access     Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // check validation
    if (!isValid) {
      // return any erros with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      // add to experience array
      profile.experience.unshift(newExp);

      profile.save().then((profile) => res.json(profile));
    });
  }
);

// @route      DELETE api/profile/experience/:exp_id
// @desc       Delete experience from profile
// @access     Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Get remove index => using map
        const removeIndex = profile.experience
          .map((item) => item.id)
          .indexOf(req.params.exp_id);

        // splice out of array
        profile.experience.splice(removeIndex, 1);

        // save
        profile.save().then((profile) => res.json(profile));
      })
      .catch((error) => res.status(404).json(error));
  }
);

// @route      POST api/profile/education
// @desc       Add education to profile
// @access     Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // check validation
    if (!isValid) {
      // return any erros with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        feildofstudy: req.body.feildofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      // add to experience array
      profile.education.unshift(newEdu);

      profile.save().then((profile) => res.json(profile));
    });
  }
);

// @route      DELETE api/profile/education/:edu_id
// @desc       Delete education from profile
// @access     Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Get remove index => using map
        const removeIndex = profile.education
          .map((item) => item.id)
          .indexOf(req.params.edu_id);

        // splice out of array
        profile.education.splice(removeIndex, 1);

        // save
        profile.save().then((profile) => res.json(profile));
      })
      .catch((error) => res.status(404).json(error));
  }
);

// @route      DELETE api/profile
// @desc       Delete user and profile
// @access     Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
