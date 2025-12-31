const puppeteer = require("puppeteer");

async function googleSearch(query) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // 🔥 DuckDuckGo HTML version (scraping-friendly)
    const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(
      query
    )}`;

    await page.goto(searchUrl, { waitUntil: "networkidle2" });

    await page.waitForSelector("a.result__a", { timeout: 5000 });

    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a.result__a"))
        .map(a => a.href)
        .filter(
          link =>
            link.startsWith("http") &&
            !link.includes("beyondchats.com")
        )
        .slice(0, 2);
    });

    return links;
  } catch (err) {
    console.error("Search engine scraping failed");
    return [];
  } finally {
    await browser.close();
  }
}

module.exports = googleSearch;
