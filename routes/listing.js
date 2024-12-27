const express = require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const listingsController = require("../controllers/listings.js");
const Listing = require("../models/listing.js");
const passport = require("passport");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage})

  

// MERGING INDEX & CREATE
router.route("/")
.get(wrapAsync(listingsController.index))
.post(isLoggedIn ,upload.single('listing[image]'),validateListing,wrapAsync(listingsController.createListings));


//NEW
router.get("/new", isLoggedIn , listingsController.renderNewForm);

// // MERGING SHOW UPDATE & DELETE ROUTEA 
// router.route("/:id").get(wrapAsync(listingsController.showListings))
// .put(isLoggedIn, isOwner,validateListing,upload.single('listing[image]'),wrapAsync(listingsController.updateForm))
// .delete(isLoggedIn,  isOwner,wrapAsync(listingsController.deleteListings));


router.route('/:id')
      .get(wrapAsync(listingsController.showListings))
      .put( isOwner, isLoggedIn, validateListing, upload.single('listing[image]'), wrapAsync(listingsController.updateForm))
      .delete( isOwner, isLoggedIn, wrapAsync(listingsController.deleteListings))


//EDIT  
router.get("/:id/edit",isLoggedIn , isOwner,wrapAsync(listingsController.editForm))
  

  module.exports = router;









