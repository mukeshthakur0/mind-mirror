import express from "express";
import axios from "axios";
import Journal from "../models/Journal.js";

const router = express.Router();

router.post("/chatbot", async (req, res) => {
  const { userId, message } = req.body;

  try {
    // 1. Get ALL journals of this user
    const journals = await Journal.find({ userId });

    const journalText = journals
      .map(j => `${j.date}: ${j.content}`)
      .join("\n\n");

    // 2. Send journals + user question to OpenAI
    const prompt = `
You are a mental health assistant. 
Here are the user's past journal entries:

${journalText}

User's question: ${message}

Give a helpful, empathetic and meaningful response.
`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI Chatbot failed" });
  }
});

export default router;
