# react-ai-chat

A chat app I built using React and Groq API. Works like ChatGPT — streaming responses, multiple chats, system prompt editor.

## What it does

- Chat with AI — responses stream word by word
- Multiple conversations in the sidebar
- Edit the system prompt to change how the AI behaves
- API key saved in browser — no backend, no server
- Stop the response mid-way
- Code blocks are formatted properly in replies

## Tech used

- React 18
- Vite
- Groq API (free — no billing needed)
- Deployed on Vercel

## How to run

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## API Key

I used Groq instead of OpenAI — it's completely free.

Get your key here → https://console.groq.com/keys

Once you have it, click **Add API Key** in the sidebar and paste it. It saves in your browser.

## Deploy

Push to GitHub → connect to https://vercel.com → it deploys automatically.

## Folder structure

```
src/
├── App.jsx
├── index.css
├── main.jsx
└── components/
    ├── ChatWindow.jsx
    ├── InputBar.jsx
    ├── Sidebar.jsx
    └── SystemPromptModal.jsx
```
