# 🧠 PromptSmith IDE

**PromptSmith IDE** is a web-based IDE designed for professional-grade prompt engineering. It helps developers craft, debug, and **secure** prompts for LLMs by combining a powerful editor, real-time injection analysis, and best-practice linting.

---

## 🚀 Features

- 🧰 **Live Prompt Editor** – VSCode-like editing with syntax highlighting and templates
- 🛡️ **Prompt Injection Detection** – Real-time analysis of common injection vectors
- 🧪 **Prompt Linting Engine** – Catch anti-patterns like overlong system prompts, bad temperature usage, missing delimiters, etc.
- 🔄 **Multi-Model Support** – Test prompts across OpenAI, Claude, and more (planned)
- 📊 **Prompt Metrics** – View cost, token usage, risk level, entropy (coming soon)
- 📁 **Versioned Prompt Storage** – Save, fork, and share prompts (optional login)
- 💻 **Open Source** – Built with Next.js + FastAPI + Tailwind + Pydantic

---

## 🧱 Tech Stack

| Layer        | Technology        |
|--------------|-------------------|
| Frontend     | Next.js 14, React, Tailwind CSS, Monaco Editor |
| Backend      | FastAPI, Pydantic, async LLM API clients |
| Storage      | Supabase / PostgreSQL (for saved prompts) |
| Auth (opt)   | Supabase Auth / Clerk / custom JWT |
| Deployment   | Vercel (Frontend) + Render/Fly.io (Backend) |

---
