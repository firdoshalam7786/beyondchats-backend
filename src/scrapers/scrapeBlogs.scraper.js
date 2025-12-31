const puppeteer = require("puppeteer");
const Article = require("../models/article.model.js");

async function scrapeOldBlogs() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const collectedLinks = new Set();

  //Blogs first page open (pagination numbers yahin milte hain)
  await page.goto("https://beyondchats.com/blogs/", {
    waitUntil: "networkidle2"
  });

  //Last page number detect
  const lastPageNumber = await page.evaluate(() => {
    const nums = Array.from(document.querySelectorAll("a"))
      .map(a => parseInt(a.textContent))
      .filter(n => !isNaN(n));
    return Math.max(...nums);
  });

  //Last page se peeche jaate hue blogs collect karo
  for (let p = lastPageNumber; p >= 1 && collectedLinks.size < 5; p--) {
    await page.goto(
      p === 1
        ? "https://beyondchats.com/blogs/"
        : `https://beyondchats.com/blogs/page/${p}/`,
      { waitUntil: "networkidle2" }
    );

    const links = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("a[href^='https://beyondchats.com/blogs/']")
      )
        .map(a => a.href)
        .filter(link => link !== "https://beyondchats.com/blogs/");
    });

    links.forEach(l => collectedLinks.add(l));
  }

  const blogLinks = Array.from(collectedLinks).slice(0, 5);

  //Scrape & save
  for (const link of blogLinks) {
    const exists = await Article.findOne({ sourceUrl: link });
    if (exists) {
    //   console.log("Skipping duplicate:", link);
      continue;
    }

    await page.goto(link, { waitUntil: "networkidle2" });

    const data = await page.evaluate(() => ({
      title: document.querySelector("h1")?.innerText || "",
      content: document.querySelector("article")?.innerText || ""
    }));

    if (data.title && data.content) {
      await Article.create({
        title: data.title,
        content: data.content,
        sourceUrl: link
      });

      console.log("Saved:", data.title);
    }
  }

  await browser.close();
}

module.exports = scrapeOldBlogs;
