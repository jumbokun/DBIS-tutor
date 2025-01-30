/**
 * ChatBox.jsx
 * Uses react-markdown to display assistant messages as well-structured Markdown.
 */

import React, { useState, useEffect } from 'react';
import {
  FaUserCircle,
  FaRobot,
  FaPaperPlane,
  FaRedo,
  FaVolumeUp,
  FaCopy
} from 'react-icons/fa';

// NEW: for nice Markdown rendering
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import { sendMessageToBackend } from '../services/api'; 

export default function ChatBox({ darkMode }) {
  // Sample conversation
  const [messages, setMessages] = useState([
    {
      // Use lowercase "assistant" for consistent checks
      role: 'assistant',
      content: "Hello! I'm DBIS-Tutor. **How can I help you?**\n\n- Feel free to ask a question\n- Or say `hello`!",
      avatar: null,
      timestamp: '2025-01-28 23:42'
    },
  ]);

  const [inputText, setInputText] = useState('');

  // Resizable chat box
  const [height, setHeight] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(400);

  // Handle mouse down on the resize bar
  const handleMouseDown = (e) => {
    setIsResizing(true);
    setStartY(e.clientY);
    setStartHeight(height);
  };

  // Mouse move => adjust height
  const handleMouseMove = (e) => {
    if (!isResizing) return;
    const newHeight = startHeight - (e.clientY - startY);
    if (newHeight < 100) setHeight(100);
    else if (newHeight > 800) setHeight(800);
    else setHeight(newHeight);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Send a message
  async function handleSend() {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    // Clear input immediately
    setInputText('');

    // Add user message
    const userMessageObj = {
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleString()
    };
    setMessages(prev => [...prev, userMessageObj]);

    // Call backend
    try {
      const assistantReply = await sendMessageToBackend(trimmed);

      // Add assistant message (which may contain Markdown)
      const assistantMsgObj = {
        role: 'assistant',
        content: assistantReply,
        timestamp: new Date().toLocaleString()
      };
      setMessages(prev => [...prev, assistantMsgObj]);
    } catch (err) {
      console.error('Error calling backend:', err);
      // Optionally show an error bubble
      const errorMsg = {
        role: 'assistant',
        content: "**[Error]** Couldn't fetch response. Please try again.",
        timestamp: new Date().toLocaleString()
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  }

  // Container style
  const containerStyle = {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    height: `${height}px`,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    background: darkMode ? '#2a2a2a' : 'rgba(255,255,255,0.9)',
    color: darkMode ? '#fff' : '#000'
  };

  const handleStyle = {
    background: darkMode ? '#444' : '#ddd',
    cursor: 'row-resize',
    height: '10px',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px'
  };

  return (
    <div style={containerStyle}>
      {/* Resize handle */}
      <div style={handleStyle} onMouseDown={handleMouseDown}></div>

      {/* Message list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} darkMode={darkMode} />
        ))}
      </div>

      {/* Input bar */}
      <div style={{
        display: 'flex',
        padding: '8px',
        borderTop: darkMode ? '1px solid #555' : '1px solid #ccc'
      }}>
        <input
          style={{
            flex: 1,
            borderRadius: '4px',
            border: darkMode ? '1px solid #666' : '1px solid #ccc',
            padding: '6px',
            background: darkMode ? '#333' : '#fff',
            color: darkMode ? '#eee' : '#000'
          }}
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
        />
        <button
          style={{
            marginLeft: '8px',
            padding: '6px',
            background: darkMode ? '#333' : '#fff',
            border: darkMode ? '1px solid #666' : '1px solid #ccc',
            color: darkMode ? '#eee' : '#000',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={handleSend}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

/** Single message bubble */
function MessageBubble({ message, darkMode }) {
  const isAssistant = (message.role === 'assistant');

  let avatarIcon = null;
  if (message.avatar) {
    avatarIcon = <img src={message.avatar} alt="avatar" style={styles.avatarImg} />;
  } else {
    avatarIcon = isAssistant
      ? <FaRobot style={{ ...styles.avatarIcon, color: darkMode ? 'lime' : 'green' }} />
      : <FaUserCircle style={{ ...styles.avatarIcon, color: darkMode ? '#bbb' : 'blue' }} />;
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '10px',
      justifyContent: isAssistant ? 'flex-start' : 'flex-end'
    }}>
      {isAssistant && <div style={{ marginRight: '8px' }}>{avatarIcon}</div>}

      <div style={{
        ...styles.bubble,
        backgroundColor: isAssistant
          ? (darkMode ? '#333944' : '#e6f7ff')
          : (darkMode ? '#3a3a3a' : '#fff2e8'),
        color: darkMode ? '#fff' : '#000',
        order: isAssistant ? '1' : '2'
      }}>
        <div style={{ marginBottom: '4px', fontSize: '0.85rem', opacity: 0.7 }}>
          {message.timestamp}
        </div>

        {/* If assistant, parse as Markdown using react-markdown */}
        {isAssistant ? (
          <div style={{ marginBottom: '4px' }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <div style={{ marginBottom: '4px' }}>
            {message.content}
          </div>
        )}

        {isAssistant && (
          <div style={styles.actionBar}>
            <button style={getActionBtnStyle(darkMode)} title="Regenerate"><FaRedo /></button>
            <button style={getActionBtnStyle(darkMode)} title="Generate Audio"><FaVolumeUp /></button>
            <button style={getActionBtnStyle(darkMode)} title="Copy"><FaCopy /></button>
          </div>
        )}
      </div>

      {!isAssistant && <div style={{ marginLeft: '8px' }}>{avatarIcon}</div>}
    </div>
  );
}

function getActionBtnStyle(darkMode) {
  return {
    background: darkMode ? '#333' : '#fff',
    border: darkMode ? '1px solid #666' : '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: darkMode ? '#eee' : '#000'
  };
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
  }
};
