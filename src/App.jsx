import { useState, useRef, useEffect } from 'react'
import ChatWindow from './components/ChatWindow'
import InputBar from './components/InputBar'
import Sidebar from './components/Sidebar'
import SystemPromptModal from './components/SystemPromptModal'

const DEFAULT_SYSTEM_PROMPT =
  'You are a helpful, friendly, and knowledgeable AI assistant. Answer questions clearly and concisely.'

export default function App() {
  const [conversations, setConversations] = useState([
    { id: 1, title: 'New Chat', messages: [] },
  ])
  const [activeId, setActiveId] = useState(1)
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT)
  const [showSystemModal, setShowSystemModal] = useState(false)
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem('openai_key') || ''
  )
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const abortRef = useRef(null)

  const activeConv = conversations.find((c) => c.id === activeId)

  const setMessages = (msgs) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeId) return c
        // Auto-title from first user message
        const title =
          c.title === 'New Chat' && msgs.length > 0 && msgs[0].role === 'user'
            ? msgs[0].content.slice(0, 36) + (msgs[0].content.length > 36 ? '…' : '')
            : c.title
        return { ...c, messages: msgs, title }
      })
    )
  }

  const newChat = () => {
    const id = Date.now()
    setConversations((prev) => [
      ...prev,
      { id, title: 'New Chat', messages: [] },
    ])
    setActiveId(id)
  }

  const deleteConv = (id) => {
    setConversations((prev) => {
      const remaining = prev.filter((c) => c.id !== id)
      if (remaining.length === 0) {
        const fresh = { id: Date.now(), title: 'New Chat', messages: [] }
        setActiveId(fresh.id)
        return [fresh]
      }
      if (id === activeId) setActiveId(remaining[remaining.length - 1].id)
      return remaining
    })
  }

  const saveKey = (key) => {
    localStorage.setItem('openai_key', key)
    setApiKey(key)
    setShowKeyInput(false)
  }

  const sendMessage = async (text) => {
    if (!text.trim() || streaming) return

    if (!apiKey) {
      setShowKeyInput(true)
      return
    }

    const userMsg = { role: 'user', content: text }
    const updatedMessages = [...activeConv.messages, userMsg]
    setMessages(updatedMessages)

    const assistantMsg = { role: 'assistant', content: '' }
    setMessages([...updatedMessages, assistantMsg])
    setStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          stream: true,
          messages: [
            { role: 'system', content: systemPrompt },
            ...updatedMessages,
          ],
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error?.message || 'API error')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter((l) => l.trim())

        for (const line of lines) {
          if (line === 'data: [DONE]') continue
          if (!line.startsWith('data: ')) continue

          try {
            const data = JSON.parse(line.slice(6))
            const delta = data.choices?.[0]?.delta?.content || ''
            fullContent += delta

            setConversations((prev) =>
              prev.map((c) => {
                if (c.id !== activeId) return c
                const msgs = [...c.messages]
                msgs[msgs.length - 1] = {
                  role: 'assistant',
                  content: fullContent,
                }
                return { ...c, messages: msgs }
              })
            )
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeId) return c
          const msgs = [...c.messages]
          msgs[msgs.length - 1] = {
            role: 'assistant',
            content: `⚠️ Error: ${err.message}`,
          }
          return { ...c, messages: msgs }
        })
      )
    } finally {
      setStreaming(false)
      abortRef.current = null
    }
  }

  const stopStream = () => {
    abortRef.current?.abort()
    setStreaming(false)
  }

  return (
    <div style={styles.app}>
      {/* SIDEBAR */}
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={newChat}
        onDelete={deleteConv}
        onOpenSystemPrompt={() => setShowSystemModal(true)}
        onOpenKey={() => setShowKeyInput(true)}
        apiKey={apiKey}
      />

      {/* MAIN */}
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.headerTitle}>
            {activeConv?.title || 'New Chat'}
          </span>
          <div style={styles.headerActions}>
            <button
              style={styles.headerBtn}
              onClick={() => setShowSystemModal(true)}
              title="Edit system prompt"
            >
              ⚙ System Prompt
            </button>
          </div>
        </div>

        {/* Chat */}
        <ChatWindow
          messages={activeConv?.messages || []}
          streaming={streaming}
        />

        {/* Input */}
        <InputBar
          onSend={sendMessage}
          onStop={stopStream}
          streaming={streaming}
          disabled={!apiKey}
          onOpenKey={() => setShowKeyInput(true)}
        />
      </div>

      {/* MODALS */}
      {showSystemModal && (
        <SystemPromptModal
          value={systemPrompt}
          onSave={(v) => {
            setSystemPrompt(v)
            setShowSystemModal(false)
          }}
          onClose={() => setShowSystemModal(false)}
        />
      )}

      {showKeyInput && (
        <ApiKeyModal
          current={apiKey}
          onSave={saveKey}
          onClose={() => setShowKeyInput(false)}
        />
      )}
    </div>
  )
}

function ApiKeyModal({ current, onSave, onClose }) {
  const [val, setVal] = useState(current)
  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <h3 style={{ marginBottom: 12, fontSize: 16 }}>OpenAI API Key</h3>
        <p style={{ fontSize: 13, color: '#999', marginBottom: 14 }}>
          Get your key from{' '}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#60a5fa' }}
          >
            platform.openai.com/api-keys
          </a>
          . Stored only in your browser.
        </p>
        <input
          type="password"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="sk-..."
          style={inputStyle}
          onKeyDown={(e) => e.key === 'Enter' && onSave(val)}
          autoFocus
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button style={btnPrimary} onClick={() => onSave(val)}>
            Save Key
          </button>
          <button style={btnSecondary} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  app: {
    display: 'flex',
    height: '100vh',
    background: '#0f0f0f',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '12px 20px',
    borderBottom: '1px solid #1e1e1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#141414',
    minHeight: 52,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#ccc',
    maxWidth: 300,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  headerActions: {
    display: 'flex',
    gap: 8,
  },
  headerBtn: {
    background: 'transparent',
    border: '1px solid #333',
    color: '#888',
    padding: '5px 12px',
    borderRadius: 6,
    fontSize: 12,
    cursor: 'pointer',
  },
}

const modalOverlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
}
const modalBox = {
  background: '#1a1a1a',
  border: '1px solid #2a2a2a',
  borderRadius: 12,
  padding: 24,
  width: 420,
  maxWidth: '90vw',
}
const inputStyle = {
  width: '100%',
  background: '#111',
  border: '1px solid #333',
  borderRadius: 8,
  color: '#e5e5e5',
  padding: '10px 12px',
  fontSize: 14,
  outline: 'none',
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
