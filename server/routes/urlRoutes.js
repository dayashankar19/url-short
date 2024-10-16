const express = require("express");
const router = express.Router();
const shortid = require("shortid");
const Url = require("../models/urlModel");
const baseURL = process.env.BASE_URL || "http://localhost:5000";

// Route to generate short URL
router.post("/shorten", async (req, res) => {
  const { longURL, customAlias, expirationTime } = req.body;

  // Create short URL alias
  const shortURL = customAlias || shortid.generate();

  // Check if the custom alias is already taken
  let existingURL = await Url.findOne({ shortURL });
  if (existingURL) return res.status(400).json({ msg: "Alias already taken" });

  // Set default expiration time to 7 days (in seconds)
  const defaultExpirationTime = 7 * 24 * 60 * 60; // 7 days in seconds
  const expirationDate = expirationTime
    ? new Date(Date.now() + expirationTime * 1000)
    : new Date(Date.now() + defaultExpirationTime * 1000); // Default to 7 days if not provided

  const newUrl = new Url({ longURL, shortURL, expirationDate });
  await newUrl.save();

  res.json({ shortURL: `${baseURL}/${shortURL}` });
});

// Route to redirect to the original URL
router.get("/:shortURL", async (req, res) => {
  const { shortURL } = req.params;

  // Retrieve URL from the database
  const urlRecord = await Url.findOne({ shortURL });
  if (!urlRecord) return res.status(404).json({ msg: "URL not found" });

  // Check for expiration
  if (urlRecord.expirationDate && new Date() > urlRecord.expirationDate) {
    return res.status(410).json({ msg: "URL has expired" });
  }

  // Increment click count
  urlRecord.clicks += 1;
  await urlRecord.save();

  res.redirect(urlRecord.longURL);
});

// Route to get analytics (optional)
router.get("/analytics/:shortURL", async (req, res) => {
  const { shortURL } = req.params;

  const urlRecord = await Url.findOne({ shortURL });
  if (!urlRecord) return res.status(404).json({ msg: "URL not found" });

  res.json({ clicks: urlRecord.clicks });
});

module.exports = router;
