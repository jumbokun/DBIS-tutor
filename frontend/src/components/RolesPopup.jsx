/**
 * RolesPopup.jsx
 * Allows users to:
 *  - Add a new role
 *  - Select existing roles and delete them
 *  - For a selected role, set a "preset" string that is saved to the backend
 *    (In this demo, we just store it locally in state.)
 */

import React, { useState } from 'react';

export default function RolesPopup({ roles, setRoles, onClose }) {
  /**
   * props:
   *  - roles: array of { id, name, preset }
   *  - setRoles: function to update roles in parent component
   *  - onClose: callback to close the popup
   */

  const [newRoleName, setNewRoleName] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  function handleAddRole() {
    if (!newRoleName.trim()) return;
    const newId = Date.now(); // For demo only. In a real app, the backend might generate IDs.
    const newRole = { id: newId, name: newRoleName.trim(), preset: '' };
    setRoles([...roles, newRole]);
    setNewRoleName('');
  }

  function handleDeleteRole() {
    // Only delete if a role is selected
    if (!selectedRoleId) return;
    const updatedRoles = roles.filter(r => r.id !== selectedRoleId);
    setRoles(updatedRoles);
    setSelectedRoleId(null);
  }

  function handlePresetChange(e) {
    // Real-time edit the preset of the selected role
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
    <div style={styles.popupOverlay}>
      <div style={styles.popupContent}>
        <h2>Role Management</h2>

        {/* Add new role */}
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="New role name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
          />
          <button onClick={handleAddRole}>Add Role</button>
        </div>

        {/* Role list for selection */}
        <div style={{ marginBottom: '10px', maxHeight: '100px', overflowY: 'auto' }}>
          {roles.map(role => (
            <div key={role.id}>
              <input
                type="radio"
                checked={role.id === selectedRoleId}
                onChange={() => setSelectedRoleId(role.id)}
              />
              <label>{role.name}</label>
            </div>
          ))}
        </div>

        {/* Delete selected role */}
        <button style={{ marginBottom: '10px' }} onClick={handleDeleteRole}>
          Delete Selected Role
        </button>

        {/* Preset editing for the selected role */}
        {selectedRole && (
          <div style={{ marginBottom: '10px' }}>
            <h4>Preset for {selectedRole.name}</h4>
            <textarea
              rows={3}
              value={selectedRole.preset}
              onChange={handlePresetChange}
              placeholder="Enter the preset text..."
            />
          </div>
        )}

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
