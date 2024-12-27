const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const { reviewSchema } = require("./schema.js");

// Middleware to check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Save intended URL in session
        req.flash("error", "Please log in first.");
        return res.redirect("/login");
    }
    next();
};

// Middleware to save redirect URL
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Pass it to locals
        delete req.session.redirectUrl; // Clear the session value
    } 
    next();
};


// isowner
module.exports.isOwner = async (req, res, next) =>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
              req.flash("error", "Listing not found.");
              return res.redirect('/listings');
          }
   if (!res.locals.currentUser || !listing.owner._id.equals(res.locals.currentUser._id)){
      req.flash("error", "You don't have permission to edit the listing!");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

// module.exports.isOwner=async(req, res, next)=>{
//   let {id}=req.params;
//   let listing=await Listing.findById(id);
//   if (!listing) {
//         req.flash("error", "Listing not found.");
//         return res.redirect('/listings');
//   }
//   if (!res.locals.currentUser || !listing.owner._id.equals(res.locals.currentUser._id)) {
//         req.flash("error", "You do not have permission to do that.");
//         return res.redirect(`/listings/${id}`);
//   }
//   next();
// }


module.exports.validateListing = (req,res,next) =>{
    let {error} =listingSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  };

  
module.exports.validateReview = (req,res,next) =>{
    console.log(req.params.id);
    let {error} =reviewSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    };
  };

// isownerofrevie
module.exports.isReviewAuthor = async (req, res, next) =>{
  let {id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currentUser._id)){
    req.flash("error", "You are not author of the listing!");
     return res.redirect(`/listings/${id}`);
  }
  next();
}

