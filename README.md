# AI Chat App — React + OpenAI

A production-ready AI chat application built with React and OpenAI's streaming API.

## Features

- **Streaming responses** — text appears word by word like ChatGPT
- **Multiple conversations** — sidebar with chat history, auto-titled
- **System prompt editor** — change AI personality with presets (React Dev, Code Reviewer, etc.)
- **API key stored in browser** — no backend needed, fully client-side
- **Code block rendering** — syntax-highlighted code in responses
- **Stop generation** — cancel streaming mid-response
- **Auto-resize input** — textarea grows as you type

## Tech Stack

- React 18
- Vite
- OpenAI API (gpt-4o-mini — cheapest, fastest model)
- Deployed on Vercel (free)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Open http://localhost:5173

### 3. Add your OpenAI API Key

- Go to https://platform.openai.com/api-keys
- Create a new key
- Click "Add API Key" in the app sidebar
- Key is stored in localStorage (browser only, never sent anywhere else)

### 4. Deploy to Vercel (free)

```bash
npm install -g vercel
vercel
```

Or push to GitHub and connect to https://vercel.com — auto-deploys on every push.

## Cost

- **React + Vite** — free, open source
- **Vercel hosting** — free for personal projects
- **OpenAI API** — gpt-4o-mini costs ~$0.00015 per 1K tokens
  - A normal conversation of 20 messages costs less than ₹0.10
  - New accounts get $5 free credit = thousands of messages for free

## Project Structure

```
src/
├── App.jsx                    # Main app, state management, API calls
├── index.css                  # Global styles
├── main.jsx                   # Entry point
└── components/
    ├── ChatWindow.jsx          # Message list with streaming cursor
    ├── InputBar.jsx            # Auto-resize textarea + send/stop button
    ├── Sidebar.jsx             # Conversation history + actions
    └── SystemPromptModal.jsx   # System prompt editor with presets
```

## What this demonstrates (for your resume)

- OpenAI API integration with streaming (SSE)
- React state management across components
- Custom hooks pattern
- Real-time UI updates
- localStorage for persistence
- Production deployment on Vercel
