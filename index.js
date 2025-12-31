require("./src/scrapers/scrapeBlogs.scraper")();

require("dotenv").config();
const app = require("./src/app.js");
const connectDB = require("./src/config/db.js");

connectDB();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("OpenAI Key Loaded:", !!process.env.OPENAI_API_KEY);

});
