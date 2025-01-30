/**
 * ChatHistoryPopup.jsx
 * A unified dark-theme pop-up style, similar to SillyTavern's.
 * Same structure as RolesPopup, but for chat history logic.
 */

import React, { useState } from 'react';

export default function ChatHistoryPopup({
  chatList,
  setChatList,
  onClose
}) {
  const [selectedChatIds, setSelectedChatIds] = useState([]);
  const [newChatTitle, setNewChatTitle] = useState('');

  function handleAddChat() {
    if (!newChatTitle.trim()) return;
    const newId = Date.now();
    const newChat = { id: newId, title: newChatTitle.trim(), messages: [] };
    setChatList([...chatList, newChat]);
    setNewChatTitle('');
  }

  function handleDeleteSelected() {
    if (selectedChatIds.length === 0) return;
    const updated = chatList.filter(c => !selectedChatIds.includes(c.id));
    setChatList(updated);
    setSelectedChatIds([]);
  }

  function toggleChatSelection(chatId) {
    if (selectedChatIds.includes(chatId)) {
      setSelectedChatIds(selectedChatIds.filter(id => id !== chatId));
    } else {
      setSelectedChatIds([...selectedChatIds, chatId]);
    }
  }

  function handleExport() {
    const dataStr = JSON.stringify(chatList, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'chatHistory.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const importedData = JSON.parse(ev.target.result);
        setChatList(importedData);
      } catch (err) {
        console.error('Failed to parse file.', err);
      }
    };
    reader.readAsText(file);
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <div style={styles.header}>
          <h2 style={styles.title}>Chat History</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>

        <div style={styles.body}>
          {/* Add new chat */}
          <div style={{ marginBottom: '12px' }}>
            <input
              type="text"
              style={styles.input}
              placeholder="New chat title"
              value={newChatTitle}
              onChange={e => setNewChatTitle(e.target.value)}
            />
            <button style={styles.actionBtn} onClick={handleAddChat}>
              Add Chat
            </button>
          </div>

          {/* Chat list with checkboxes */}
          <div style={{ marginBottom: '12px', maxHeight: '100px', overflowY: 'auto' }}>
            {chatList.map(chat => (
              <div key={chat.id} style={{ marginBottom: '6px' }}>
                <input
                  type="checkbox"
                  checked={selectedChatIds.includes(chat.id)}
                  onChange={() => toggleChatSelection(chat.id)}
                  style={{ marginRight: '6px' }}
                />
                <label>{chat.title}</label>
              </div>
            ))}
          </div>

          {/* Delete selected */}
          <button style={{ ...styles.actionBtn, marginBottom: '12px' }} onClick={handleDeleteSelected}>
            Delete Selected
          </button>

          {/* Import / Export */}
          <div style={{ marginBottom: '12px' }}>
            <button style={styles.actionBtn} onClick={handleExport}>Export</button>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'inline-block', marginLeft: '10px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  },
  popup: {
    background: '#2e2e2e',
    color: '#fff',
    width: '400px',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  header: {
    background: '#444',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    margin: 0,
    fontSize: '1.2rem'
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '1.3rem',
    cursor: 'pointer'
  },
  body: {
    padding: '12px'
  },
  input: {
    padding: '6px',
    marginRight: '6px',
    borderRadius: '4px',
    border: '1px solid #666',
    background: '#3a3a3a',
    color: '#fff'
  },
  actionBtn: {
    padding: '6px 12px',
    border: '1px solid #666',
    background: '#555',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};
