if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
}

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const { sampleListings } = require("./data.js");

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/airbnbClone";

// NOTE: set OWNER_ID below to a real User's _id (create a user via /signup first)
// so that seeded listings have a valid owner and can be edited/deleted in the UI.
const OWNER_ID = process.env.SEED_OWNER_ID || null;

async function initDB() {
  await mongoose.connect(dbUrl);
  await Listing.deleteMany({});

  const listingsWithOwner = sampleListings.map((obj) => ({
    ...obj,
    owner: OWNER_ID,
  }));

  await Listing.insertMany(listingsWithOwner);
  console.log(`Inserted ${listingsWithOwner.length} sample listings.`);
  await mongoose.connection.close();
}

initDB().catch((err) => console.log(err));
