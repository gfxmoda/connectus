const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Post = require("../../models/Post"); // Post Model
const Profile = require("../../models/Profile"); // Profile Model -> Will be user for DELETE requests <=

// Validation
const validatePostInput = require("../../validation/post");

// @route      GET api/posts/all
// @desc       Get all posts
// @access     Public
router.get("/", (req, res) => {
  const errors = {};
  Post.find()
    .sort({ date: -1 })
    .then((posts) => {
      if (!posts) {
        errors.post = "There are no posts";
        return res.status(404).json(errors);
      }

      res.json(posts);
    })
    .catch((error) =>
      res
        .status(404)
        .json({ profiles: "MDB_ERR_ALL_PROFILE: There are no posts" })
    );
});

// @route      GET api/posts/:id
// @desc       Get post by id
// @access     Public
router.get("/:id", (req, res) => {
  const errors = {};
  Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        errors.post = "There is no post for this id";
        return res.status(404).json(errors);
      }

      res.json(post);
    })
    .catch((error) =>
      res
        .status(404)
        .json({ profiles: "MDB_ERR_ALL_PROFILE: There is no post for this id" })
    );
});

// @route      POST api/posts
// @desc       Create post
// @access     Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    });

    newPost.save().then((post) => res.json(post));
  }
);

// @route      POST api/posts/like/:id
// @desc       Like post
// @access     Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length > 0
          ) {
            // means this particular user has already liked this post
            // Then, he won't be authorized to do that again
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this post" });
          }

          // add the user id to the likes array
          post.likes.unshift({ user: req.user.id });

          // save this to the database
          post.save().then((post) => res.json(post));
        })
        .catch((error) =>
          res.status(404).json({ postnotfound: "No post found" })
        );
    });
  }
);

// @route      POST api/posts/unlike/:id
// @desc       Unlike post
// @access     Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length === 0
          ) {
            // means this particular user hasn't liked this post yet
            // Then, he won't be authorized to unlike the post.
            return res
              .status(400)
              .json({ notliked: "You have not yet liked this post" });
          }

          // get the remove index
          const removeIndex = post.likes
            .map((item) => item.user.toString())
            .indexOf(req.user.id);

          // splice it out of the array
          post.likes.splice(removeIndex, 1);

          // save
          post.save().then((post) => res.json(post));
        })
        .catch((error) =>
          res.status(404).json({ postnotfound: "No post found" })
        );
    });
  }
);

// @route      POST api/posts/comment/:id         //=> btw, the (:id) => refers to the post id itself
// @desc       Add a comment to a post
// @access     Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body); // post validation function can be reused as comment validation as well
    // (req.body) parameter that's been passed to the validation function refers to the comment body not the post body

    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then((post) => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id,
        };

        // add to comments array
        post.comments.unshift(newComment);

        // save
        post.save().then((post) => res.json(post));
      })
      .catch((error) =>
        res.status(404).json({ postnotfound: "No posts found" })
      );
  }
);

// @route      DELETE api/posts/comment/:id/:comment_id          => First (id) refers to the user
// @desc       Delete a comment from post
// @access     Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then((post) => {
        // check to see if the comment exists
        if (
          post.comments.filter(
            (comment) => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          // means the comment we are deleting doesn't actually exist (because the new filter array length is 0)
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exists" });
        }

        // get the remove index
        const removeIndex = post.comments
          .map((item) => item._id.toString())
          .indexOf(req.params.comment_id);

        // splice it out from the array
        post.comments.splice(removeIndex, 1);

        post.save().then((post) => res.json(post));
      })
      .catch((error) =>
        res.status(404).json({ postnotfound: "No posts found" })
      );
  }
);

// @route      DELETE api/posts/:id
// @desc       Delete post
// @access     Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }) // by finding a profile not a post because the profile (aka the user) is the one wrote this post
      .then((profile) => {
        Post.findById(req.params.id)
          .then((post) => {
            // check for post owner
            if (post.user.toString() != req.user.id) {
              return res
                .status(401)
                .json({ notauthorized: "User not authorized" }); // authorization issue
            }

            // delete if he is the rightful owner of the post
            post.remove().then(() => res.json({ success: true }));
          })
          .catch((error) =>
            res.status(404).json({ postnotfound: "No post found" })
          );
      });
  }
);

module.exports = router;
