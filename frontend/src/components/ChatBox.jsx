/**
 * ChatBox.jsx
 * A bottom-pinned, resizable chat box with avatar icons and icon-only buttons.
 * 
 * Key features:
 *  - Draggable top bar to resize the chat box height
 *  - Default user and assistant avatars from react-icons
 *  - Send button as an icon (paper plane)
 *  - Assistant action buttons also icons
 */

import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaRobot, FaPaperPlane, FaRedo, FaVolumeUp, FaCopy } from 'react-icons/fa';

export default function ChatBox() {
  // Initial sample conversation
  const [messages, setMessages] = useState([
    {
      role: 'Assistant',
      content: "Hello! I'm DBIS-Tutor. How can I help you?",
      avatar: null  // We'll use a default assistant icon if null
    },
    {
      role: 'User',
      content: "I'm interested in the new knowledge graph course. Could you please help me?",
      avatar: null  // We'll use a default user icon if null
    },
    {
      role: 'Assistant',
      content: "Sure, glad to do so. What's the question?",
      avatar: null
    }
  ]);

  // The text input
  const [inputText, setInputText] = useState('');

  // Resizable chat box state
  const [height, setHeight] = useState(250);      // default height in px
  const [isResizing, setIsResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(250);

  // Mouse handlers for resizing
  const handleMouseDown = (e) => {
    setIsResizing(true);
    setStartY(e.clientY);
    setStartHeight(height);
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    // Calculate new height by dragging the top bar
    const newHeight = startHeight - (e.clientY - startY);
    // You can clamp the min/max as desired:
    if (newHeight < 100) {
      setHeight(100);
    } else if (newHeight > 600) {
      setHeight(600);
    } else {
      setHeight(newHeight);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Attach global mousemove/mouseup listeners only when isResizing = true
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Send a user message
  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    // Add user message
    setMessages([...messages, { role: 'User', content: trimmed, avatar: null }]);
    setInputText('');

    // (Optional) You might then call your backend for a response.
    // For now, we just do local demonstration.
  };

  return (
    <div style={{ 
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      // Use dynamic height so the user can resize
      height: `${height}px`,
      background: 'rgba(255,255,255,0.9)',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* A draggable top bar */}
      <div
        style={{
          background: '#ddd',
          cursor: 'row-resize',
          height: '10px',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px'
        }}
        onMouseDown={handleMouseDown}
      ></div>

      {/* The main chat area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
      </div>

      {/* The input row */}
      <div style={{ display: 'flex', padding: '8px', borderTop: '1px solid #ccc' }}>
        <input
          style={{
            flex: 1,
            borderRadius: '4px',
            border: '1px solid #ccc',
            padding: '6px'
          }}
          placeholder="Type your message..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        />
        <button
          style={{
            marginLeft: '8px',
            padding: '6px',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={handleSend}
        >
          {/* Icon-only send button */}
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

/**
 * Single message bubble component.
 * If role=Assistant, we show the "Regenerate", "Generate Audio", and "Copy" icons.
 * If avatar is null, we assign a default icon from react-icons.
 */
function MessageBubble({ message }) {
  const isAssistant = message.role === 'Assistant';

  // Decide on avatar icon if none was provided
  let avatarIcon = null;
  if (message.avatar) {
    // If you had a real image URL, you'd show an <img src={message.avatar} ... />
    // but let's assume we always do icons for now
    avatarIcon = <img src={message.avatar} alt="avatar" style={styles.avatarImg} />;
  } else {
    // No avatar => pick default icon
    avatarIcon = isAssistant 
      ? <FaRobot style={{ ...styles.avatarIcon, color: 'green' }} />
      : <FaUserCircle style={{ ...styles.avatarIcon, color: 'blue' }} />;
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '10px',
      justifyContent: isAssistant ? 'flex-start' : 'flex-end'
    }}>
      {/* If assistant, avatar on the left; if user, avatar on the right */}
      {isAssistant && (
        <div style={{ marginRight: '8px' }}>
          {avatarIcon}
        </div>
      )}

      {/* Speech bubble */}
      <div style={{
        ...styles.bubble,
        backgroundColor: isAssistant ? '#e6f7ff' : '#fff2e8',
        order: isAssistant ? '1' : '2'
      }}>
        {message.content}
        {isAssistant && (
          <div style={styles.actionBar}>
            {/* Icon-only action buttons */}
            <button style={styles.actionBtn} title="Regenerate"><FaRedo /></button>
            <button style={styles.actionBtn} title="Generate Audio"><FaVolumeUp /></button>
            <button style={styles.actionBtn} title="Copy"><FaCopy /></button>
          </div>
        )}
      </div>

      {/* If user, put avatar on the right side */}
      {!isAssistant && (
        <div style={{ marginLeft: '8px' }}>
          {avatarIcon}
        </div>
      )}
    </div>
  );
}

const styles = {
  avatarIcon: {
    width: '40px',
    height: '40px'
  },
  avatarImg: {
    width: '40px',
    height: '40px',
    borderRadius: '50%'
  },
  bubble: {
    maxWidth: '60%',
    borderRadius: '8px',
    padding: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  actionBar: {
    marginTop: '6px',
    display: 'flex',
    gap: '4px'
  },
  actionBtn: {
    background: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center'
  }
};
