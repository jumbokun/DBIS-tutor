import React from 'react'

export default function HistoryPanel({ conversations, onSelectConversation, onClose }) {
  return (
    <div style={styles.panel}>
      <h3>History</h3>
      <div style={{ marginBottom: '8px' }}>
        {conversations.map(conv => (
          <button
            key={conv.id}
            style={styles.convBtn}
            onClick={() => {
              onSelectConversation(conv)
              onClose()
            }}
          >
            Conversation {conv.id}
          </button>
        ))}
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  )
}

const styles = {
  panel: {
    position: 'absolute',
    top: '60px',
    right: '20px',
    width: '220px',
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    padding: '10px',
    borderRadius: '8px'
  },
  convBtn: {
    display: 'block',
    width: '100%',
    marginBottom: '6px',
    padding: '6px',
    background: '#ccc',
    border: 'none',
    cursor: 'pointer'
  }
}
