/**
 * RolesPopup.jsx
 * A unified dark-theme pop-up style, similar to SillyTavern's.
 * You can tweak colors and transitions as desired.
 */

import React, { useState } from 'react';

export default function RolesPopup({ roles, setRoles, onClose }) {
  const [newRoleName, setNewRoleName] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  function handleAddRole() {
    if (!newRoleName.trim()) return;
    const newId = Date.now();
    const newRole = { id: newId, name: newRoleName.trim(), preset: '' };
    setRoles([...roles, newRole]);
    setNewRoleName('');
  }

  function handleDeleteRole() {
    if (!selectedRoleId) return;
    const updated = roles.filter(r => r.id !== selectedRoleId);
    setRoles(updated);
    setSelectedRoleId(null);
  }

  function handlePresetChange(e) {
    const updated = roles.map(r => {
      if (r.id === selectedRoleId) {
        return { ...r, preset: e.target.value };
      }
      return r;
    });
    setRoles(updated);
  }

  const selectedRole = roles.find(r => r.id === selectedRoleId);

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <div style={styles.header}>
          <h2 style={styles.title}>Role Management</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>

        <div style={styles.body}>
          {/* Add new role */}
          <div style={{ marginBottom: '12px' }}>
            <input
              type="text"
              style={styles.input}
              placeholder="New role name"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
            <button style={styles.actionBtn} onClick={handleAddRole}>
              Add Role
            </button>
          </div>

          {/* Role list for selection */}
          <div style={{ marginBottom: '12px', maxHeight: '100px', overflowY: 'auto' }}>
            {roles.map(role => (
              <div key={role.id} style={{ marginBottom: '6px' }}>
                <input
                  type="radio"
                  checked={role.id === selectedRoleId}
                  onChange={() => setSelectedRoleId(role.id)}
                  style={{ marginRight: '6px' }}
                />
                <label>{role.name}</label>
              </div>
            ))}
          </div>

          {/* Delete selected role */}
          <button style={{ ...styles.actionBtn, marginBottom: '12px' }} onClick={handleDeleteRole}>
            Delete Selected Role
          </button>

          {/* Preset for the selected role */}
          {selectedRole && (
            <div style={{ marginBottom: '12px' }}>
              <h4>Preset for {selectedRole.name}</h4>
              <textarea
                rows={3}
                style={styles.textarea}
                value={selectedRole.preset}
                onChange={handlePresetChange}
                placeholder="Enter the preset text..."
              />
            </div>
          )}
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
    // optional fade in:
    // animation: 'fadeIn 0.3s',
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
  },
  textarea: {
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #666',
    background: '#3a3a3a',
    color: '#fff',
    padding: '6px'
  }
};
