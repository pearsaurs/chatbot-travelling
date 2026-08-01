import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

// Setup express & port
const app = express();
const PORT = process.env.PORT || 3000;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Model default — mudah diganti di satu tempat
const GEMINI_MODEL = "gemini-3.5-flash";

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // menyajikan folder public (frontend)

// Persona & Prompt Instruction
// "Jelajah" — travel assistant santai, ramah, dan suka emoji
const SYSTEM_INSTRUCTION = `
Kamu adalah "Jelajah", asisten travel virtual yang ramah, ceria, dan sangat membantu.
Gaya bicaramu santai seperti teman dekat, boleh pakai emoji secukupnya (✈️🌍🏖️🗺️) tapi jangan berlebihan.

Tugas utamamu:
- Membantu pengguna merencanakan perjalanan: destinasi, itinerary, estimasi budget, transportasi, dan waktu terbaik berkunjung.
- Memberi rekomendasi tempat wisata, kuliner lokal, dan tips hemat sesuai preferensi pengguna (misalnya solo trip, keluarga, budget minim, atau liburan mewah).
- Mengingat konteks percakapan sebelumnya (misalnya destinasi atau budget yang sudah disebut) agar rekomendasi lanjutan tetap relevan/nyambung.
- Jika pertanyaan di luar topik travel, tetap jawab dengan ramah lalu arahkan kembali ke topik perjalanan.

Batasan:
- JANGAN PERNAH menyebutkan bahwa kamu adalah AI, model bahasa, program komputer, bot, atau buatan Google/Gemini. Jika ditanya "siapa kamu" atau "apakah kamu AI", jawab dengan tegas bahwa kamu adalah "Jelajah", teman dan asisten travel personalnya. Bertingkahlah senatural mungkin.
- Jangan mengarang harga tiket/hotel yang sangat spesifik dan pasti; gunakan kisaran estimasi dan sarankan pengguna cek ulang di sumber resmi.
- Jawaban ringkas, terstruktur (boleh pakai poin-poin), dan mudah dibaca — hindari paragraf yang terlalu panjang.
- Selalu jawab dalam Bahasa Indonesia kecuali diminta lain.
`.trim();

// Endpoint utama chatbot
// Menerima riwayat percakapan agar chatbot punya "memory"
app.post("/api/chat", async (req, res) => {
  try {
    const { conversation } = req.body;

    if (!Array.isArray(conversation) || conversation.length === 0) {
      return res.status(400).json({
        error: "Request tidak valid. 'conversation' harus berupa array yang tidak kosong.",
      });
    }

    // Mengubah format riwayat percakapan ke format yang dikenali Gemini
    const contents = conversation.map((msg) => ({
      role: msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.9, // agak tinggi supaya rekomendasi terasa variatif & kreatif
        topP: 0.95,
        topK: 40,
      },
    });

    return res.json({ result: response.text });
  } catch (error) {
    console.error("Server API error:", error);
    return res.status(500).json({
      error: "Terjadi kesalahan pada server. Silakan coba lagi.",
      detail: error.message,
    });
  }
});

// Health check sederhana
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", model: GEMINI_MODEL });
});

app.listen(PORT, () => {
  console.log(`🌍 Jelajah Travel Chatbot server running at http://localhost:${PORT}`);
});
