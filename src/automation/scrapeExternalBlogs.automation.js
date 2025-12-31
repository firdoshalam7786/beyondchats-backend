const puppeteer = require("puppeteer");

async function scrapeExternalContent(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle2" });
    return await page.evaluate(() => document.body.innerText || "");
  } catch (err) {
    console.error("Failed to scrape:", url);
    return "";
  } finally {
    await browser.close();
  }
}

module.exports = scrapeExternalContent;
