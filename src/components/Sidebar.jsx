export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onOpenSystemPrompt,
  onOpenKey,
  apiKey,
}) {
  return (
    <div style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <span style={styles.logoIcon}>✦</span>
        <span style={styles.logoText}>AI Chat</span>
      </div>

      {/* New chat button */}
      <button style={styles.newBtn} onClick={onNew}>
        + New Chat
      </button>

      {/* Conversations */}
      <div style={styles.convList}>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            style={{
              ...styles.convItem,
              ...(conv.id === activeId ? styles.convItemActive : {}),
            }}
            onClick={() => onSelect(conv.id)}
          >
            <span style={styles.convTitle}>{conv.title}</span>
            <button
              style={styles.deleteBtn}
              onClick={(e) => {
                e.stopPropagation()
                onDelete(conv.id)
              }}
              title="Delete"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Bottom actions */}
      <div style={styles.bottom}>
        <button style={styles.bottomBtn} onClick={onOpenSystemPrompt}>
          ⚙ System Prompt
        </button>
        <button
          style={{
            ...styles.bottomBtn,
            color: apiKey ? '#4ade80' : '#f87171',
          }}
          onClick={onOpenKey}
        >
          {apiKey ? '🔑 Key saved' : '🔑 Add API Key'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  sidebar: {
    width: 240,
    background: '#111',
    borderRight: '1px solid #1e1e1e',
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 10px',
    overflow: 'hidden',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '4px 6px 16px',
  },
  logoIcon: {
    fontSize: 18,
    color: '#60a5fa',
  },
  logoText: {
    fontSize: 16,
    fontWeight: 600,
    color: '#e5e5e5',
  },
  newBtn: {
    background: '#1e1e1e',
    border: '1px dashed #333',
    color: '#aaa',
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: 13,
    cursor: 'pointer',
    textAlign: 'left',
    marginBottom: 10,
  },
  convList: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  convItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 10px',
    borderRadius: 7,
    cursor: 'pointer',
    color: '#999',
    fontSize: 13,
    userSelect: 'none',
  },
  convItemActive: {
    background: '#1e1e1e',
    color: '#e5e5e5',
  },
  convTitle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
  },
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    color: '#555',
    fontSize: 10,
    padding: '2px 4px',
    borderRadius: 4,
    cursor: 'pointer',
    opacity: 0,
    flexShrink: 0,
    marginLeft: 4,
  },
  bottom: {
    borderTop: '1px solid #1e1e1e',
    paddingTop: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  bottomBtn: {
    background: 'transparent',
    border: 'none',
    color: '#666',
    fontSize: 12,
    padding: '7px 8px',
    borderRadius: 6,
    cursor: 'pointer',
    textAlign: 'left',
  },
}
