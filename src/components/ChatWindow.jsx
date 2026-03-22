import { useEffect, useRef } from 'react'

export default function ChatWindow({ messages, streaming }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>✦</div>
        <h2 style={styles.emptyTitle}>How can I help you today?</h2>
        <p style={styles.emptySubtitle}>
          Ask me anything — code, ideas, writing, analysis.
        </p>
      </div>
    )
  }

  return (
    <div style={styles.window}>
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg}
            isStreaming={streaming && i === messages.length - 1 && msg.role === 'assistant'}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

function MessageBubble({ message, isStreaming }) {
  const isUser = message.role === 'user'

  return (
    <div style={{ ...styles.row, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      {!isUser && (
        <div style={styles.avatar}>✦</div>
      )}

      <div
        style={{
          ...styles.bubble,
          ...(isUser ? styles.userBubble : styles.aiBubble),
        }}
      >
        <MessageContent content={message.content} />
        {isStreaming && message.content === '' && (
          <span style={styles.typingDot}>●</span>
        )}
        {isStreaming && message.content !== '' && (
          <span style={styles.cursor}>▌</span>
        )}
      </div>

      {isUser && (
        <div style={{ ...styles.avatar, background: '#1d4ed8' }}>U</div>
      )}
    </div>
  )
}

function MessageContent({ content }) {
  if (!content) return null

  // Simple code block rendering
  const parts = content.split(/(```[\s\S]*?```)/g)

  return (
    <div style={styles.content}>
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const lines = part.slice(3).split('\n')
          const lang = lines[0]
          const code = lines.slice(1, -1).join('\n')
          return (
            <pre key={i} style={styles.codeBlock}>
              {lang && <div style={styles.codeLang}>{lang}</div>}
              <code style={{ fontFamily: 'monospace', fontSize: 13 }}>{code}</code>
            </pre>
          )
        }
        // Render inline code
        const inlineParts = part.split(/(`[^`]+`)/g)
        return (
          <span key={i}>
            {inlineParts.map((ip, j) => {
              if (ip.startsWith('`') && ip.endsWith('`')) {
                return (
                  <code key={j} style={styles.inlineCode}>
                    {ip.slice(1, -1)}
                  </code>
                )
              }
              return <span key={j}>{ip}</span>
            })}
          </span>
        )
      })}
    </div>
  )
}

const styles = {
  window: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 0 8px',
  },
  messages: {
    maxWidth: 760,
    margin: '0 auto',
    padding: '20px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  row: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#1e40af',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 600,
    color: '#e5e5e5',
    flexShrink: 0,
    marginTop: 2,
  },
  bubble: {
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.65,
    wordBreak: 'break-word',
  },
  userBubble: {
    background: '#1d4ed8',
    color: '#fff',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    background: '#1a1a1a',
    color: '#e5e5e5',
    border: '1px solid #2a2a2a',
    borderBottomLeftRadius: 4,
  },
  content: {
    whiteSpace: 'pre-wrap',
  },
  codeBlock: {
    background: '#111',
    border: '1px solid #2a2a2a',
    borderRadius: 8,
    padding: 14,
    overflowX: 'auto',
    margin: '8px 0',
    fontSize: 13,
    lineHeight: 1.5,
    color: '#e5e5e5',
  },
  codeLang: {
    color: '#60a5fa',
    fontSize: 11,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inlineCode: {
    background: '#2a2a2a',
    borderRadius: 4,
    padding: '1px 5px',
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#f59e0b',
  },
  cursor: {
    display: 'inline',
    color: '#60a5fa',
    animation: 'blink 1s step-end infinite',
  },
  typingDot: {
    color: '#555',
    fontSize: 10,
    animation: 'pulse 1s ease-in-out infinite',
  },
  empty: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 40,
    color: '#666',
  },
  emptyIcon: {
    fontSize: 40,
    color: '#1d4ed8',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 600,
    color: '#ccc',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
}
