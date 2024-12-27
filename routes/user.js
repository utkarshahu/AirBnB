const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

//MERGING SIGNUPRENDER & SIGNUP
router.route("/signup").get( wrapAsync(userController.renderSignup))
.post( wrapAsync(userController.signup));

// MERGING LOGINRENDER AND LOGIN
router.route("/login").get(userController.renderLogin)
.post( saveRedirectUrl, // Save the redirect URL before login
  passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
  }),
  userController.login
);

// logout
router.get("/logout",userController.logout);

module.exports = router;