/**
 * ChatHistoryPopup.jsx
 * Allows users to:
 *  - Add a new chat
 *  - Delete selected chats
 *  - Import / Export chat data
 * For simplicity, we store chat data in parent's state. 
 * A real app might fetch from or send to a backend.
 */

import React, { useState } from 'react';

export default function ChatHistoryPopup({
  chatList,
  setChatList,
  onClose
}) {
  /**
   * props:
   *  - chatList: array of { id, title, messages? }
   *  - setChatList: function to update chatList in parent
   *  - onClose: callback to close the popup
   */

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
    // This example simply converts chatList to JSON
    const dataStr = JSON.stringify(chatList, null, 2);
    // You can create a blob download
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and auto-click
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chatHistory.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleImport(event) {
    // For demonstration: read a JSON file and parse it
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        // Merge or overwrite existing chatList as needed
        setChatList(importedData);
      } catch (err) {
        console.error('Failed to parse file.', err);
      }
    };
    reader.readAsText(file);
  }

  return (
    <div style={styles.popupOverlay}>
      <div style={styles.popupContent}>
        <h2>Chat History</h2>
        
        {/* Add new chat */}
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="New chat title"
            value={newChatTitle}
            onChange={e => setNewChatTitle(e.target.value)}
          />
          <button onClick={handleAddChat}>Add Chat</button>
        </div>

        {/* Chat list with checkboxes for selection */}
        <div style={{ marginBottom: '10px', maxHeight: '100px', overflowY: 'auto' }}>
          {chatList.map(chat => (
            <div key={chat.id}>
              <input
                type="checkbox"
                checked={selectedChatIds.includes(chat.id)}
                onChange={() => toggleChatSelection(chat.id)}
              />
              <label>{chat.title}</label>
            </div>
          ))}
        </div>

        {/* Delete selected chats */}
        <button style={{ marginBottom: '10px' }} onClick={handleDeleteSelected}>
          Delete Selected
        </button>

        {/* Import / Export buttons */}
        <div style={{ marginBottom: '10px' }}>
          <button onClick={handleExport}>Export</button>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'inline-block', marginLeft: '10px' }}
          />
        </div>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

const styles = {
  popupOverlay: {
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100vw', 
    height: '100vh', 
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  popupContent: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    minWidth: '300px'
  }
};
