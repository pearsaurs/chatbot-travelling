const chatBox = document.getElementById("chat-box");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const stampsWrap = document.getElementById("stamps");
const resetBtn = document.getElementById("reset-btn");
const mobileResetBtn = document.getElementById("mobile-reset-btn");

const STORAGE_KEY = "jelajah_conversation";

// Inisialisasi percakapan dari localStorage
let conversation = loadConversation();
renderExistingConversation();

function loadConversation() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveConversation() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversation));
}

function renderExistingConversation() {
  if (conversation.length === 0) {
    appendMessage(
      "model",
      "Halo! Aku **Jelajah** 🌍 siap bantu rencanain liburan kamu — dari itinerary, budget, sampai rekomendasi tempat makan.\n\nMau jalan-jalan ke mana nih? ✈️"
    );
  } else {
    conversation.forEach((msg) => {
      appendMessage(msg.role === "model" ? "model" : "user", msg.text);
    });
  }
}

// Fungsi untuk menampilkan pesan ke layar
function appendMessage(type, text) {
  const container = document.createElement("div");
  container.className = `msg-container ${type}`;
  
  const bubble = document.createElement("div");
  bubble.className = `msg ${type}`;
  
  if (type === "model") {
    // Gunakan marked.js untuk merender markdown menjadi HTML
    // DOMPurify sebaiknya digunakan untuk production, tapi untuk demo ini aman jika output dari Gemini
    bubble.innerHTML = marked.parse(text);
  } else {
    bubble.textContent = text;
  }
  
  container.appendChild(bubble);
  chatBox.appendChild(container);
  chatBox.scrollTop = chatBox.scrollHeight;
  return container;
}

function appendThinking() {
  const container = document.createElement("div");
  container.className = `msg-container model`;
  
  const bubble = document.createElement("div");
  bubble.className = "msg thinking";
  bubble.innerHTML = `Mikir <span class="dot-flash"><span></span><span></span></span>`;
  
  container.appendChild(bubble);
  chatBox.appendChild(container);
  chatBox.scrollTop = chatBox.scrollHeight;
  return container;
}

// Kirim pesan ke backend API
async function sendMessage(userMessage) {
  appendMessage("user", userMessage);
  conversation.push({ role: "user", text: userMessage });
  saveConversation();

  const thinkingContainer = appendThinking();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation }),
    });

    if (!res.ok) throw new Error("Failed to get response from server.");

    const data = await res.json();
    const reply = data.result || "Maaf, tidak ada respon.";

    thinkingContainer.remove();
    appendMessage("model", reply);
    conversation.push({ role: "model", text: reply });
    saveConversation();
  } catch (err) {
    console.error(err);
    thinkingContainer.remove();
    appendMessage("model", "Waduh, gagal terhubung ke server. Coba lagi ya 🙏");
  }
}

// Handle form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;
  input.value = "";
  sendMessage(message);
});

// Handle quick suggestions (stamps)
stampsWrap.addEventListener("click", (e) => {
  const btn = e.target.closest(".stamp");
  if (!btn) return;
  const prompt = btn.dataset.prompt;
  sendMessage(prompt);
});

// Fungsi untuk mereset percakapan
function resetChat() {
  conversation = [];
  localStorage.removeItem(STORAGE_KEY);
  chatBox.innerHTML = "";
  renderExistingConversation();
}

if (resetBtn) resetBtn.addEventListener("click", resetChat);
if (mobileResetBtn) mobileResetBtn.addEventListener("click", resetChat);
