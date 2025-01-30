import React, { useState } from 'react';
import ChatBox from './components/ChatBox';
import RolesPopup from './components/RolesPopup';
import ChatHistoryPopup from './components/ChatHistoryPopup';
import './index.css'
import { FaUserFriends, FaHistory, FaCog, FaMoon, FaSun } from 'react-icons/fa';

export default function App() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);
  const DarkModeIcon = darkMode ? FaSun : FaMoon;

  // Show/Hide popups
  const [showRolesPopup, setShowRolesPopup] = useState(false);
  const [showChatHistoryPopup, setShowChatHistoryPopup] = useState(false);

  // Example data for roles and chat history
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Sakana',
      preset: "A cheeky, light-hearted assistant that you can talk to about DBIS..."
    },
    {
      id: 2,
      name: 'Seraphina',
      preset: "A roleplay bot focusing on advanced knowledge graph expansions."
    }
  ]);
  const [chatList, setChatList] = useState([
    { id: 101, title: 'Chat 1', messages: [] },
    { id: 102, title: 'Chat 2', messages: [] }
  ]);

  // Sidebar auto-hide horizontally
  const [sidebarHovered, setSidebarHovered] = useState(false);

  // Handlers
  const handleToggleDarkMode = () => setDarkMode(!darkMode);
  const handleShowSettings = () => alert('Settings clicked (no functionality yet).');

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: `url("/background.jpg") center center fixed`,
        backgroundSize: 'cover',
        overflow: 'hidden'
      }}
    >
      {/* Dark overlay or color if you want to dim the BG in dark mode */}
      {/* (Optional) 
      {darkMode && (
        <div style={{
          position:'absolute',
          top:0, left:0, width:'100%', height:'100%',
          background:'rgba(0,0,0,0.4)'
        }} />
      )} */}

      {/* LEFT-CENTER SIDEBAR */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: `translateY(-50%) ${sidebarHovered ? 'translateX(0)' : 'translateX(-40px)'}`,
          width: '60px',
          backgroundColor: '#333',
          transition: 'transform 0.5s ease',
          borderTopRightRadius: '8px',
          borderBottomRightRadius: '8px'
        }}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        {/* Buttons */}
        <div style={styles.sidebarButtons}>
          <button style={styles.iconButton} onClick={() => setShowRolesPopup(true)}>
            <FaUserFriends size={24} color="#fff" />
          </button>
          <button style={styles.iconButton} onClick={() => setShowChatHistoryPopup(true)}>
            <FaHistory size={24} color="#fff" />
          </button>
          <button style={styles.iconButton} onClick={handleShowSettings}>
            <FaCog size={24} color="#fff" />
          </button>
          <button style={styles.iconButton} onClick={handleToggleDarkMode}>
            <DarkModeIcon size={24} color="#fff" />
          </button>
        </div>
      </div>

      {/* BOTTOM CHATBOX (centered horizontally) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          /* Increase width percentage so it's wider by default */
          width: '90%',

          /* Increase maxWidth so it can expand more on large monitors */
          maxWidth: '1500px',

          /* Keep a sensible minWidth to avoid crowding on very small screens */
          minWidth: '600px',

          minHeight: '800px',
          /* Adjust as desired to keep consistent spacing/padding */
          marginBottom: '10px'
        }}
      >
        <ChatBox darkMode={darkMode} />
      </div>

      {/* Roles Popup */}
      {showRolesPopup && (
        <RolesPopup
          roles={roles}
          setRoles={setRoles}
          onClose={() => setShowRolesPopup(false)}
        />
      )}

      {/* Chat History Popup */}
      {showChatHistoryPopup && (
        <ChatHistoryPopup
          chatList={chatList}
          setChatList={setChatList}
          onClose={() => setShowChatHistoryPopup(false)}
        />
      )}
    </div>
  );
}

const styles = {
  sidebarButtons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '10px'
  },
  iconButton: {
    background: 'transparent',
    border: 'none',
    marginBottom: '20px',
    cursor: 'pointer'
  }
};
