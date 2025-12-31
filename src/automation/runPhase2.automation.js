require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const axios = require("axios");
const fetchOriginals = require("./fetchOriginals.automation.js");
const googleSearch = require("./googleSearch.automation.js");
const scrapeExternal = require("./scrapeExternalBlogs.automation.js");
const rewriteArticle = require("./llmRewrite.automation.js");

async function runPhase2() {
  console.log("🚀 Phase-2 started");
  console.log("🔑 OpenAI key loaded:", !!process.env.OPENAI_API_KEY);

  const originals = await fetchOriginals();
  console.log("📄 Original articles found:", originals.length);

  for (const article of originals) {
    console.log("\n==============================");
    console.log("📝 Processing article:", article.title);

    try {
      // 1️⃣ Google Search
      const links = await googleSearch(article.title);
      console.log("🔗 Google links:", links);

      if (!links || links.length < 2) {
        console.log("⚠️ Not enough external links, skipping");
        continue;
      }

      // 2️⃣ External Scraping
      console.log("🌐 Scraping external blog 1");
      const ref1 = await scrapeExternal(links[0]);

      console.log("🌐 Scraping external blog 2");
      const ref2 = await scrapeExternal(links[1]);

      if (!ref1 || !ref2) {
        console.log("⚠️ External content empty, skipping");
        continue;
      }

      // 3️⃣ LLM Rewrite
      console.log("🧠 Sending content to LLM...");
      const updatedContent = await rewriteArticle(
        article.content,
        ref1,
        ref2
      );

      if (!updatedContent) {
        console.log("❌ LLM returned empty response, skipping");
        continue;
      }

      console.log("✅ LLM content generated");

      const finalContent = `
${updatedContent}

---

### References
1. ${links[0]}
2. ${links[1]}
`;

      // 4️⃣ Save to DB via API
      console.log("💾 Saving updated article to DB...");
      const res = await axios.post("http://localhost:5001/articles", {
        title: article.title + " (Updated)",
        content: finalContent,
        sourceUrl: article.sourceUrl + "?updated=true",
        isUpdated: true,
        references: links,
      });

      console.log("🎉 Updated article saved with ID:", res.data._id);
    } catch (err) {
  console.error("❌ Failed to save article");
  console.error("Status:", err.response?.status);
  console.error("Data:", err.response?.data);
    }
  }

  console.log("\n✅ Phase-2 completed");
}

runPhase2();
