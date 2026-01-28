import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Log requests (helps debugging)
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

// ✅ Health check
app.get("/ping", (req, res) => res.json({ ok: true }));

// ✅ Make sure the key is actually loaded
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing. Put it in backend/.env");
  // Don't exit; keep server alive for /ping debugging
}

// ✅ OpenAI client (create after dotenv.config())
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Chat endpoint
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

// ✅ Use port 4000 (since 3000 was being hijacked earlier)
app.listen(4000, () => {
  console.log("🚀 AI Server running on http://127.0.0.1:4000");
});
