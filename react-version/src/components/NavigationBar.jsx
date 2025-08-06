import React, { useState } from 'react';

const NavigationBar = ({ 
  statEngines, 
  currentEngineId, 
  onSelectEngine, 
  onRemoveEngine, 
  onDuplicateEngine, 
  onRenameEngine 
}) => {
  const [isRenaming, setIsRenaming] = useState(null);
  const [newName, setNewName] = useState('');

  const handleRename = (engineId) => {
    setIsRenaming(engineId);
    setNewName(engineId);
  };

  const handleRenameSubmit = (oldId) => {
    if (newName && newName !== oldId) {
      const success = onRenameEngine(oldId, newName);
      if (!success) {
        alert('Nama workspace sudah digunakan!');
        return;
      }
    }
    setIsRenaming(null);
    setNewName('');
  };

  const handleRenameCancel = () => {
    setIsRenaming(null);
    setNewName('');
  };

  const handleDuplicate = () => {
    const newId = onDuplicateEngine();
    if (newId) {
      // Optional: Show notification
      console.log(`Workspace duplicated as: ${newId}`);
    }
  };

  const workspaceEntries = Object.entries(statEngines);

  if (workspaceEntries.length === 0) {
    return null;
  }

  return (
    <div className="navigation-bar">
      <div className="workspace-tabs">
        {workspaceEntries.map(([engineId, engine]) => {
          const isCurrent = engineId === currentEngineId;
          const isFinished = engine.finished;
          
          return (
            <div 
              key={engineId} 
              className={`workspace-tab ${isCurrent ? 'active' : ''} ${isFinished ? 'finished' : ''}`}
            >
              {isRenaming === engineId ? (
                <div className="rename-input">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={() => handleRenameSubmit(engineId)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleRenameSubmit(engineId);
                      } else if (e.key === 'Escape') {
                        handleRenameCancel();
                      }
                    }}
                    autoFocus
                    maxLength={20}
                  />
                </div>
              ) : (
                <>
                  <button
                    className="tab-button"
                    onClick={() => onSelectEngine(engineId)}
                    title={`${engineId} - ${engine.type === 'w' ? 'Weapon' : 'Armor'} - Success Rate: ${engine.getSuccessRate()}%`}
                  >
                    <span className="tab-name">{engineId}</span>
                    {isFinished && <span className="finished-indicator">✓</span>}
                    <span className="tab-info">
                      {engine.type === 'w' ? '⚔️' : '🛡️'} {engine.getSuccessRate()}%
                    </span>
                  </button>
                  <button
                    className="tab-close"
                    onClick={() => onRemoveEngine(engineId)}
                    title="Close workspace"
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="workspace-controls">
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => handleRename(currentEngineId)}
          disabled={!currentEngineId}
          title="Rename current workspace"
        >
          ✏️ Rename
        </button>
        <button
          className="btn btn-sm btn-secondary"
          onClick={handleDuplicate}
          disabled={!currentEngineId}
          title="Duplicate current workspace"
        >
          📋 Duplicate
        </button>
      </div>

      {/* Workspace summary */}
      <div className="workspace-summary">
        <small>
          {workspaceEntries.length} workspace{workspaceEntries.length !== 1 ? 's' : ''} • {' '}
          {workspaceEntries.filter(([, engine]) => engine.finished).length} completed
        </small>
      </div>
    </div>
  );
};

export default NavigationBar;