/**
 * App.jsx
 * Manages dark mode state, passes it to ChatBox,
 * includes the new button in the Sidebar.
 */

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import RolesPopup from './components/RolesPopup';
import ChatHistoryPopup from './components/ChatHistoryPopup';
import ChatBox from './components/ChatBox';

const pageStyle = {
  position: 'relative',
  width: '100vw',
  height: '100vh',
  background: 'url("/background.jpg") no-repeat center center fixed',
  backgroundSize: 'cover'
};

export default function App() {
  // Popups
  const [showRolesPopup, setShowRolesPopup] = useState(false);
  const [showChatHistoryPopup, setShowChatHistoryPopup] = useState(false);

  // Roles
  const [roles, setRoles] = useState([
    { id: 1, name: 'Default Role', preset: 'This is a default preset.' }
  ]);

  // Chat history
  const [chatList, setChatList] = useState([
    { id: 101, title: 'Chat 1', messages: [] },
    { id: 102, title: 'Chat 2', messages: [] }
  ]);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  const handleShowSettings = () => {
    alert('Settings clicked (no functionality yet).');
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div style={pageStyle}>
      <Sidebar
        onShowRoles={() => setShowRolesPopup(true)}
        onShowHistory={() => setShowChatHistoryPopup(true)}
        onShowSettings={handleShowSettings}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {showRolesPopup && (
        <RolesPopup
          roles={roles}
          setRoles={setRoles}
          onClose={() => setShowRolesPopup(false)}
        />
      )}

      {showChatHistoryPopup && (
        <ChatHistoryPopup
          chatList={chatList}
          setChatList={setChatList}
          onClose={() => setShowChatHistoryPopup(false)}
        />
      )}

      {/* Bottom ChatBox. 
          Pass darkMode boolean to ChatBox so it can switch styles. */}
      <ChatBox darkMode={darkMode} />
    </div>
  );
}
