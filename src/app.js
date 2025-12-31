const express = require("express");
const cors = require("cors");
const articleRoutes = require("./routes/articleRoutes.route.js")
const scraperRoutes = require("./routes/scraper.route.js");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/articles", articleRoutes);
app.use("/admin", scraperRoutes);

app.get("/", (req, res) => {
  res.send("Backend API is running");
});

module.exports = app;