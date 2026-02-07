const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");

// ================= OLLAMA CONFIG =================
const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "llama3";

// ================= WHATSAPP CLIENT =================
const client = new Client({
  authStrategy: new LocalAuth(), // login saved rahega
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

// QR code
client.on("qr", (qr) => {
  console.log("Scan this QR with WhatsApp:");
  qrcode.generate(qr, { small: true });
});

// Ready
client.on("ready", () => {
  console.log("WhatsApp bot is READY 🚀");
});

// ================= MESSAGE HANDLER =================
client.on("message", async (msg) => {
  try {
    // Ignore groups
    if (msg.from.includes("@g.us")) return;

    const userMessage = msg.body;
    if (!userMessage) return;

    console.log("Incoming:", userMessage);

    // Ollama call
    const response = await axios.post(OLLAMA_URL, {
      model: MODEL,
      prompt: `
Tum ek normal, friendly assistant ho.
Short Hinglish replies do.

User: ${userMessage}
`,
      stream: false,
    });

    const reply =
      response.data.response || "thoda busy hu, baad me baat karte 😅";

    await msg.reply(reply);

  } catch (err) {
    console.error("Error:", err.message);
    await msg.reply("network thoda slow hai 😅");
  }
});

// Start client
client.initialize();
