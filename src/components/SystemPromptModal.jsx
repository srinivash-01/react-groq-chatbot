import { useState } from 'react'

const PRESETS = [
  {
    label: 'Helpful Assistant',
    value: 'You are a helpful, friendly, and knowledgeable AI assistant. Answer questions clearly and concisely.',
  },
  {
    label: 'Senior React Developer',
    value: 'You are a senior React developer with 8+ years of experience. Give expert-level code advice, best practices, and detailed technical explanations. Always include code examples.',
  },
  {
    label: 'Code Reviewer',
    value: 'You are a strict code reviewer. Review code for bugs, performance issues, security vulnerabilities, and readability. Be direct and specific.',
  },
  {
    label: 'Interview Coach',
    value: 'You are a technical interview coach for software developer roles. Help practice coding questions, system design, and behavioral questions. Give feedback on answers.',
  },
  {
    label: 'Writing Assistant',
    value: 'You are a professional writing assistant. Help write, edit, and improve text. Be concise, clear, and professional.',
  },
]

export default function SystemPromptModal({ value, onSave, onClose }) {
  const [text, setText] = useState(value)

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={header}>
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>System Prompt</h3>
          <button style={closeBtn} onClick={onClose}>✕</button>
        </div>

        <p style={desc}>
          The system prompt defines how the AI behaves in this conversation.
          Change it to give the assistant a specific role or personality.
        </p>

        {/* Presets */}
        <div style={presetRow}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              style={{
                ...presetBtn,
                ...(text === p.value ? presetBtnActive : {}),
              }}
              onClick={() => setText(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Editor */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={textarea}
          rows={6}
          placeholder="Enter system prompt…"
          autoFocus
        />

        <div style={actions}>
          <button style={btnPrimary} onClick={() => onSave(text)}>
            Save &amp; Apply
          </button>
          <button style={btnSecondary} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.75)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
}
const modal = {
  background: '#1a1a1a',
  border: '1px solid #2a2a2a',
  borderRadius: 14,
  padding: 24,
  width: 520,
  maxWidth: '92vw',
  maxHeight: '90vh',
  overflowY: 'auto',
}
const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
}
const closeBtn = {
  background: 'none',
  border: 'none',
  color: '#666',
  fontSize: 16,
  cursor: 'pointer',
  padding: '2px 6px',
}
const desc = {
  fontSize: 13,
  color: '#777',
  marginBottom: 14,
  lineHeight: 1.5,
}
const presetRow = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  marginBottom: 14,
}
const presetBtn = {
  background: '#111',
  border: '1px solid #2a2a2a',
  color: '#888',
  borderRadius: 6,
  padding: '5px 10px',
  fontSize: 12,
  cursor: 'pointer',
}
const presetBtnActive = {
  background: '#1e3a8a',
  border: '1px solid #2563eb',
  color: '#93c5fd',
}
const textarea = {
  width: '100%',
  background: '#111',
  border: '1px solid #2a2a2a',
  borderRadius: 8,
  color: '#e5e5e5',
  padding: '12px',
  fontSize: 13,
  lineHeight: 1.6,
  fontFamily: 'inherit',
  outline: 'none',
  resize: 'vertical',
}
const actions = {
  display: 'flex',
  gap: 8,
  marginTop: 14,
}
const btnPrimary = {
  flex: 1,
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 0',
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
}
const btnSecondary = {
  flex: 1,
  background: 'transparent',
  color: '#888',
  border: '1px solid #333',
  borderRadius: 8,
  padding: '10px 0',
  fontSize: 14,
  cursor: 'pointer',
}
