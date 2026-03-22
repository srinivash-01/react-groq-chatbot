import { useState, useRef, useEffect } from 'react'

export default function InputBar({ onSend, onStop, streaming, disabled, onOpenKey }) {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px'
  }, [text])

  const handleSend = () => {
    if (streaming) {
      onStop()
      return
    }
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {disabled && (
          <div style={styles.keyWarning}>
            <span>No API key — </span>
            <button style={styles.keyLink} onClick={onOpenKey}>
              add your OpenAI key
            </button>
          </div>
        )}

        <div style={styles.inputRow}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder={
              disabled
                ? 'Add your API key to start chatting…'
                : 'Message AI assistant… (Enter to send, Shift+Enter for new line)'
            }
            style={styles.textarea}
            rows={1}
            disabled={disabled && !streaming}
          />

          <button
            style={{
              ...styles.sendBtn,
              background: streaming ? '#7f1d1d' : text.trim() ? '#2563eb' : '#1e1e1e',
              color: streaming ? '#fca5a5' : text.trim() ? '#fff' : '#555',
            }}
            onClick={handleSend}
            title={streaming ? 'Stop' : 'Send'}
          >
            {streaming ? '■' : '↑'}
          </button>
        </div>

        <div style={styles.hint}>
          {streaming
            ? 'Generating… press ■ to stop'
            : 'Enter ↵ send  ·  Shift+Enter new line'}
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    borderTop: '1px solid #1e1e1e',
    background: '#0f0f0f',
    padding: '12px 20px 16px',
  },
  container: {
    maxWidth: 760,
    margin: '0 auto',
  },
  keyWarning: {
    fontSize: 12,
    color: '#f59e0b',
    marginBottom: 8,
    textAlign: 'center',
  },
  keyLink: {
    background: 'none',
    border: 'none',
    color: '#60a5fa',
    cursor: 'pointer',
    fontSize: 12,
    textDecoration: 'underline',
    padding: 0,
  },
  inputRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-end',
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: 12,
    padding: '10px 12px',
  },
  textarea: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#e5e5e5',
    fontSize: 14,
    lineHeight: 1.6,
    fontFamily: 'inherit',
    maxHeight: 200,
    overflowY: 'auto',
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    flexShrink: 0,
    transition: 'background 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontSize: 11,
    color: '#444',
    textAlign: 'center',
    marginTop: 8,
  },
}
