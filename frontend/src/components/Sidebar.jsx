/**
 * Sidebar.jsx
 * Adds a fourth icon button for Dark Mode toggle.
 */

import React from 'react';
import { FaUserFriends, FaHistory, FaCog, FaMoon } from 'react-icons/fa';

export default function Sidebar({
  onShowRoles,
  onShowHistory,
  onShowSettings,
  onToggleDarkMode
}) {
  return (
    <div style={styles.sidebarContainer}>
      <button style={styles.iconButton} onClick={onShowRoles}>
        <FaUserFriends size={24} color="#fff" />
      </button>

      <button style={styles.iconButton} onClick={onShowHistory}>
        <FaHistory size={24} color="#fff" />
      </button>

      <button style={styles.iconButton} onClick={onShowSettings}>
        <FaCog size={24} color="#fff" />
      </button>

      {/* New: Dark Mode toggle */}
      <button style={styles.iconButton} onClick={onToggleDarkMode}>
        <FaMoon size={24} color="#fff" />
      </button>
    </div>
  );
}

const styles = {
  sidebarContainer: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#333',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
    padding: '8px 0',
    width: '60px'
  },
  iconButton: {
    background: 'transparent',
    border: 'none',
    margin: '10px 0',
    cursor: 'pointer'
  }
};
