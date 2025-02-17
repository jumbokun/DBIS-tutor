import React, { useState } from 'react';
// import Live2DBox from './components/Live2DBox'; // 引入您的 Live2DBox 组件
import ChatBox from './components/ChatBox';
import RolesPopup from './components/RolesPopup';
import ChatHistoryPopup from './components/ChatHistoryPopup';
import './index.css';
import { FaUserFriends, FaHistory, FaCog, FaMoon, FaSun } from 'react-icons/fa';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function App() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);
  const DarkModeIcon = darkMode ? FaSun : FaMoon;

  // Show/Hide popups
  const [showRolesPopup, setShowRolesPopup] = useState(false);
  const [showChatHistoryPopup, setShowChatHistoryPopup] = useState(false);

  // Example data for roles and chat history
  const [roles, setRoles] = useState([
    { id: 1, name: 'Sakana', preset: 'A cheeky, light-hearted assistant that you can talk to about DBIS...' },
    { id: 2, name: 'Seraphina', preset: 'A roleplay bot focusing on advanced knowledge graph expansions.' },
  ]);

  const [chatList, setChatList] = useState([
    { id: 101, title: 'Chat 1', messages: [] },
    { id: 102, title: 'Chat 2', messages: [] },
  ]);

  // Sidebar auto-hide horizontally
  const [sidebarHovered, setSidebarHovered] = useState(false);

  // Handlers
  const handleToggleDarkMode = () => setDarkMode(!darkMode);
  const handleShowSettings = () => alert('Settings clicked (no functionality yet).');

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          background: `url("/background.jpg") center center fixed`,
          backgroundSize: 'cover',
          overflow: 'hidden',
        }}
      >
        {/* live2dmodel */}
      {/* <div>
      <Live2DBox modelPath="/live2d-model/hijiki/runtime/hijiki.model3.json" />
      </div> */}

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
            borderBottomRightRadius: '8px',
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

        {/* BOTTOM CHATBOX */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '1500px',
            minWidth: '600px',
            minHeight: '800px',
            marginBottom: '10px',
          }}
        >
          <ChatBox darkMode={darkMode} />
        </div>

        {/* Roles Popup */}
        {showRolesPopup && (
          <RolesPopup roles={roles} setRoles={setRoles} onClose={() => setShowRolesPopup(false)} />
        )}

        {/* Chat History Popup */}
        {showChatHistoryPopup && (
          <ChatHistoryPopup chatList={chatList} setChatList={setChatList} onClose={() => setShowChatHistoryPopup(false)} />
        )}
      </div>
    </DndProvider>
  );
}

const styles = {
  sidebarButtons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '10px',
  },
  iconButton: {
    background: 'transparent',
    border: 'none',
    marginBottom: '20px',
    cursor: 'pointer',
  },
};
