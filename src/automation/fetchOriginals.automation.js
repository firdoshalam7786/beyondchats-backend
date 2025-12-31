const axios = require("axios");

async function fetchOriginalArticles() {
  try {
    const res = await axios.get("http://localhost:5001/articles");
    return res.data.filter(a => a.isUpdated === false);
  } catch (err) {
    console.error("Failed to fetch original articles");
    return res.data;

  }
}

module.exports = fetchOriginalArticles;
