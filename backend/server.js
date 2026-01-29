import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});


app.get("/ping", (req, res) => res.json({ ok: true }));


if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing. Put it in backend/.env");
  
}


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


app.post("/chat", async (req, res) => {
  try {
    const { message, studentData } = req.body || {};

    const systemPrompt = `
You are a Smart Campus AI assistant.
Answer ONLY using the provided student data.
If data is missing, say you don't have it.
Be friendly, clear, and short.

Student Data:
${JSON.stringify(studentData ?? {}, null, 2)}
`.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message || "" },
      ],
      temperature: 0.4,
    });

    res.json({ reply: completion.choices?.[0]?.message?.content || "No reply." });
  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "AI error", details: err?.message || String(err) });
  }
});


app.listen(4000, () => {
  console.log("🚀 AI Server running on http://127.0.0.1:4000");
});
