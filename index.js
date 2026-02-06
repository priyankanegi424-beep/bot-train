const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/test", async (req, res) => {
  try {
    const r = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          { role: "user", content: "hello bhai" }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ reply: r.data.choices[0].message.content });
  } catch (e) {
    res.json({ error: e.message });
  }
});

app.listen(10000, () => console.log("Groq test running"));
