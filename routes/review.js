const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const Review = require("../models/review.js");
const reviewController = require("../controllers/review.js");
const Listing = require("../models/listing.js");


  
                                //REVIEWS 
//post route

router.post("/",isLoggedIn,validateReview ,wrapAsync(reviewController.indexReview));

// Detele Review

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));


module.exports = router;