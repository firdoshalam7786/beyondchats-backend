const express = require("express");
const router = express.Router();
const scrapeOldBlogs = require("../scrapers/scrapeBlogs.scraper.js");

router.get("/scrape-blogs", async (req, res) => {
  try {
    await scrapeOldBlogs();
    res.json({ message: "Blogs scraped successfully" });
  } catch (error) {
    res.status(500).json({ error: "Scraping failed" });
  }
});

module.exports = router;
