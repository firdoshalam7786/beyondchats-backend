const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function rewriteArticle(original, ref1, ref2) {
  if (!original || !ref1 || !ref2) return null;

  const prompt = `
You are a professional content editor.

Task:
Rewrite and improve the ORIGINAL ARTICLE using insights from the two REFERENCE ARTICLES.
- Do NOT copy sentences.
- Improve clarity, structure, and readability.
- Keep the topic same.
- Add headings and bullet points where useful.

ORIGINAL ARTICLE:
${original}

REFERENCE ARTICLE 1:
${ref1.slice(0, 3000)}

REFERENCE ARTICLE 2:
${ref2.slice(0, 3000)}

Return ONLY the rewritten article content.
`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("LLM rewrite failed");
    return null;
  }
}

module.exports = rewriteArticle;
