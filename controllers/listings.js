const Listing = require("../models/listing");
const maptilerClient = require("@maptiler/client");
const { listingSchema } = require("../schema.js");
let mapToken = process.env.MAP_TOKEN;
maptilerClient.config.apiKey = mapToken;

module.exports.index = async (req, res, next) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  console.log(req.user);

  res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist !");
    res.redirect("/listings");
  }
  res.render("listings/show", { listing });
  console.log(listing);
};

module.exports.createListings = async (req, res, next) => {



  const query = req.body.listing.location;

  if (!query) {
    req.flash("error", "Location is required.");
    return res.redirect("/listings/new");
  }

  const result = await maptilerClient.geocoding.forward(query);

  if (!result || !result.features || result.features.length === 0) {
    req.flash(
      "error",
      "Unable to find the location. Please refine your input."
    );
    return res.redirect("/listings/new");
  }
  



  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = result.features[1].geometry;
  await newListing.save();
  req.flash("success", "New listing Created");
  console.log(newListing.geometry);
  res.redirect("/listings");
};

module.exports.editForm = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  req.flash("success", " Edit Listing ");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist !");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListings = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Update Listing ");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListings = async (req, res, next) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id); // Assign the deleted listing here
  console.log(deletedListing); // Log the deleted listing object (if needed)
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
