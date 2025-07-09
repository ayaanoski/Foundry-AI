
# 🧠 FOUNDRY.AI

FOUNDRY.AI is a bold, AI-powered branding tool that helps creators, startups, and marketers generate high-quality ad copy **and** a complete brand kit in seconds — all using cutting-edge **IO.net AI Agents**.

> "Forge your voice. Define your brand."

---

## 🚀 Features

- ✍️ **Ad Copy Generator**
  - Facebook/Google Ad Headlines
  - Instagram Captions
  - Cold Outreach Emails
  - Landing Page Copy

- 🎨 **Brand Kit Builder**
  - Tagline Suggestions
  - Voice & Tone Definition
  - Target Audience Summary
  - Theme & Moodboard Ideas
  - Color Palette (with HEX)
  - AI-Powered Marketing Strategies

- 🌌 **Interactive UI**
  - Dark theme only (Black & White aesthetic)
  - Dynamic animated background (Vanta.js / Canvas-based)
  - Responsive layout with animated cards

- ⚙️ **Powered by IO.net**
  - Real-time output from autonomous IO Agents

---

## 🛠️ Tech Stack

- **React.js + Vite**
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **IO.net Agents API**
- Optional: `react-toastify` for toasts, `particles.js` or `vanta.js` for backgrounds

---

🧠 Agent Behavior:
The IO.net agent used here is a creative LLM agent fine-tuned for:

Short-form and long-form copywriting

Brand strategy analysis

Marketing tone recognition

Color theory and brand identity construction

It can parse vague product inputs and output highly contextual:

Ad headlines tailored for performance

Taglines that fit a brand’s voice

Full brand kits with visual strategy

🌍 Why IO.net?
Unlike traditional LLM APIs, IO.net provides:

🧬 Distributed, GPU-accelerated inference (scales fast)

💸 Affordable model execution (cheaper than closed SaaS APIs)

🧩 Custom agent logic (behavioral tuning & memory control)

🔓 No vendor lock-in — you control the agent lifecycle

⚡ Impact on Foundry.AI:
Every ad and branding suggestion is generated in real time — no templates or mockups

Responses adapt to subtle tone changes in the input

Users receive personalized, production-ready content within seconds

Creative ideation and marketing workflows are accelerated by 10x+

"IO.net doesn't just power the engine — it is the creative intelligence behind FOUNDRY.AI."

---

## 📁 Folder Structure

```
foundry-ai/
├── public/
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── Hero.jsx
│   │   ├── GeneratorForm.jsx
│   │   ├── OutputCard.jsx
│   │   └── DynamicBackground.jsx
│   ├── App.jsx
│   ├── api/
│   │   └── generate.js
│   └── utils/
│       └── formatPrompt.js
├── .env
└── README.md
```

---

## 🧪 Setup Instructions

1. **Clone the Repository:**

```bash
git clone https://github.com/yourusername/foundry-ai.git
cd foundry-ai
```

2. **Install Dependencies:**

```bash
npm install
```

3. **Configure Environment Variables:**

Create a `.env` file in the root:

```env
VITE_IO_INTELLIGENCE_API_KEY=your_api_key
VITE_IO_MODEL_ID=any_model
```

> 🔒 Never share your API keys publicly.

4. **Run the App Locally:**

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🧠 Prompt Examples

```text
🔹 Copy Mode:
Generate a Facebook ad headline for a product called "EcoSpoon" – a biodegradable spoon for eco-friendly cafes.

🔹 Brand Kit Mode:
Generate a full brand kit for "LumenPads" — a line of reusable light-reflecting notebooks for artists.
```

---

## ✨ Demo : https://foundry-ai-dun.vercel.app


---

## 📦 License

MIT License — feel free to use, fork, and contribute.

---

## 👨‍💻 Author

Built by [Ayaan Adil](https://github.com/ayaanoski) — powered by imagination, IO.net agents, and way too much dark theme.

---

## 💬 Feedback / Contributions

Pull requests and feedback are welcome!

For ideas, bugs, or feature requests:  
📬 DM me on [LinkedIn](https://www.linkedin.com/in/ayaan-adil-371137268/) or open an issue.
