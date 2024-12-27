
const mongoose = require("mongoose");
const initData =require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{console.log("Connection Sucessfull")})
.catch(err => console.log(err));//s6

async function main(){
    await mongoose.connect(MONGO_URL);
};

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"676addf158e840f09b51a29a"}))
    await Listing.insertMany(initData.data);
    console.log("Data was Initialize");
};

initDB();