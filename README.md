# Jelajah 🌍 — Travel Assistant Chatbot

Final Project — Aplikasi Web Interaktif (Hacktiv8)

Chatbot travel assistant dengan backend Node.js + Express
dan frontend Vanilla JavaScript. "Jelajah" membantu pengguna merencanakan perjalanan: itinerary,
rekomendasi kuliner/destinasi, estimasi budget, dan tips traveling — dengan gaya bahasa santai dan
ramah (pakai emoji).

## ✨ Fitur

- **Percakapan multi-turn dengan memory** — riwayat chat disimpan (localStorage di browser +
  dikirim penuh ke Gemini setiap request) supaya rekomendasi lanjutan tetap nyambung dengan konteks
  sebelumnya.
- **Quick suggestions ("stamps")** — tombol cepat untuk pertanyaan populer (itinerary hemat,
  kuliner lokal, solo trip, dll).
- **System instruction custom** — persona "Jelajah" yang santai & fokus di topik travel.
- **Parameter kreatif** — `temperature: 0.9`, `top_p: 0.95`, `top_k: 40` supaya rekomendasi terasa
  variatif tapi tetap relevan.
- **Reset percakapan** — mulai obrolan baru kapan saja.

## 🗂️ Struktur Proyek

```
gemini-travel-chatbot/
├── index.js              # Backend Express integration
├── package.json
├── .env.example           # Contoh environment variable
├── .gitignore
└── public/
    ├── index.html          # UI chatbot (tema boarding pass)
    ├── style.css
    └── script.js           # Logic frontend (fetch, memory, quick actions)
```

## 🚀 Cara Menjalankan

### 1. Persiapan
- Node.js v18+
- API key dari provider (opsional/sesuaikan)

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variable
Salin `.env.example` menjadi `.env`, lalu isi API key kamu:
```
API_KEY=your_api_key_here
PORT=3000
```

### 4. Jalankan server
```bash
npm start
```

### 5. Buka di browser
```
http://localhost:3000
```

## 🔌 API Endpoint

**POST** `/api/chat`

Request body:
```json
{
  "conversation": [
    { "role": "user", "text": "Rencanain trip hemat ke Bali dong" },
    { "role": "model", "text": "Wah seru! Mau berapa hari nih..." },
    { "role": "user", "text": "3 hari aja" }
  ]
}
```

Response:
```json
{ "result": "Oke siap! Ini itinerary 3 hari di Bali buat kamu..." }
```

## 📤 Mengumpulkan Proyek ke GitHub

```bash
git init
git add .
git commit -m "Implementasi Jelajah - Travel Assistant Chatbot"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

Setelah push, salin URL repository dan submit ke form pengumpulan tugas.

## 🛠️ Tech Stack
- Backend: Node.js, Express
- Frontend: HTML, CSS, Vanilla JavaScript (tanpa framework)
