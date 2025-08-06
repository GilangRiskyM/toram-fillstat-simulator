import React, { useEffect } from 'react';
import { useStatEngine } from '../hooks/useStatEngine.js';
import { useLocalStorage, useSettings, useWorkspaceStorage, useAutoSave } from '../hooks/useLocalStorage.js';
import SimulatorForm from './SimulatorForm.jsx';
import SlotManager from './SlotManager.jsx';
import MaterialTracker from './MaterialTracker.jsx';
import FormulaDisplay from './FormulaDisplay.jsx';
import NavigationBar from './NavigationBar.jsx';
import { StatEngine } from '../utils/statEngine.js';
import '../styles/App.css';

const App = () => {
  const {
    statEngines,
    currentEngineId,
    currentEngine,
    createEngine,
    removeEngine,
    setCurrentEngine,
    updateCurrentEngine,
    duplicateCurrentEngine,
    renameWorkspace,
    resetAll,
    hasEngines
  } = useStatEngine();

  const { settings, updateSetting } = useSettings();
  const { saveAllWorkspaces, workspaceData, clearAllWorkspaces } = useWorkspaceStorage();

  // Auto-save functionality
  const { isAutoSaveEnabled, setIsAutoSaveEnabled } = useAutoSave(
    () => {
      if (hasEngines) {
        saveAllWorkspaces(statEngines);
      }
    },
    30000 // 30 seconds
  );

  // Load workspaces from storage on startup
  useEffect(() => {
    if (Object.keys(workspaceData).length > 0) {
      Object.entries(workspaceData).forEach(([workspaceId, snapshot]) => {
        try {
          // Create engine with minimal details first
          const details = snapshot.settings || {
            weapArm: 'w',
            startingPot: 99,
            recipePot: 46,
            tec: 255,
            proficiency: 0,
            matReduction: false
          };
          
          const { engine } = createEngine(details, workspaceId);
          engine.autoLoad(snapshot);
        } catch (error) {
          console.error(`Failed to load workspace ${workspaceId}:`, error);
        }
      });
    }
  }, []); // Only run on mount

  // Handle starting new simulation
  const handleStartSimulation = (formData) => {
    try {
      const details = {
        weapArm: formData.itemType,
        startingPot: parseInt(formData.startingPot),
        recipePot: parseInt(formData.recipePot),
        tec: settings.tec,
        proficiency: settings.proficiency,
        matReduction: settings.matReduction
      };

      const { id, engine } = createEngine(details);
      
      // Show success notification
      showNotification('✅ Simulasi berhasil dimulai!', 'success');
      
      return { success: true, engineId: id };
    } catch (error) {
      console.error('Error starting simulation:', error);
      showNotification('❌ Terjadi error saat memulai simulasi', 'error');
      return { success: false, error: error.message };
    }
  };

  // Handle slot updates
  const handleSlotUpdate = (slotIndex, statDataId, statValue) => {
    if (!currentEngine) return;
    
    updateCurrentEngine((engine) => {
      const slot = engine.slots[slotIndex];
      slot.updateSlot(statDataId, parseInt(statValue) || 0);
      engine.updatePotential();
    });
  };

  // Handle confirm step
  const handleConfirm = () => {
    if (!currentEngine) return;
    
    updateCurrentEngine((engine) => {
      engine.confirm();
    });
  };

  // Handle undo
  const handleUndo = () => {
    if (!currentEngine) return;
    
    updateCurrentEngine((engine) => {
      engine.undo();
    });
  };

  // Handle redo
  const handleRedo = () => {
    if (!currentEngine) return;
    
    updateCurrentEngine((engine) => {
      engine.redo();
    });
  };

  // Handle repeat
  const handleRepeat = () => {
    if (!currentEngine) return;
    
    updateCurrentEngine((engine) => {
      engine.repeat();
    });
  };

  // Notification system
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>🗡️ Toram Fill Stats Simulator 🛡️</h1>
          
          <div className="disclaimer">
            ⚠️ Ini hanyalah simulasi saja, bisa terjadi perbedaan di dalam game.
          </div>
        </header>

        {/* Navigation Bar for multiple workspaces */}
        {hasEngines && (
          <NavigationBar
            statEngines={statEngines}
            currentEngineId={currentEngineId}
            onSelectEngine={setCurrentEngine}
            onRemoveEngine={removeEngine}
            onDuplicateEngine={duplicateCurrentEngine}
            onRenameEngine={renameWorkspace}
          />
        )}

        {/* Settings and Auto-save controls */}
        <div className="settings-bar">
          <div className="settings-group">
            <label>
              <input
                type="checkbox"
                checked={isAutoSaveEnabled}
                onChange={(e) => setIsAutoSaveEnabled(e.target.checked)}
              />
              Auto-save every 30s
            </label>
          </div>
          <div className="settings-group">
            <button
              className="btn btn-secondary"
              onClick={() => saveAllWorkspaces(statEngines)}
              disabled={!hasEngines}
            >
              💾 Save Now
            </button>
          </div>
        </div>

        {/* Main Simulator Form */}
        <SimulatorForm
          settings={settings}
          onUpdateSetting={updateSetting}
          onStartSimulation={handleStartSimulation}
          hasActiveSimulation={!!currentEngine}
        />

        {/* Main Workspace */}
        {currentEngine && (
          <div className="workspace">
            <div className="workspace-left">
              <SlotManager
                engine={currentEngine}
                onSlotUpdate={handleSlotUpdate}
              />
            </div>

            <div className="workspace-right">
              <div className="potential-display">
                Potential: {currentEngine.futurePot} / {currentEngine.pot}
              </div>

              <div className={`success-rate success-rate-${
                currentEngine.getSuccessRate() >= 80 ? 'high' :
                currentEngine.getSuccessRate() >= 60 ? 'medium' : 'low'
              }`}>
                Success Rate: {currentEngine.getSuccessRate()}%
              </div>

              <div className="controls">
                <button
                  className="btn btn-primary"
                  onClick={handleConfirm}
                  disabled={currentEngine.pot === currentEngine.futurePot || currentEngine.finished}
                >
                  ✅ Confirm
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleRepeat}
                  disabled={!currentEngine.steps.formula.length || currentEngine.finished}
                >
                  🔄 Repeat
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleUndo}
                  disabled={!currentEngine.steps.formula.length}
                >
                  ↶ Undo
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleRedo}
                  disabled={!currentEngine.steps.redoQueue.length}
                >
                  ↷ Redo
                </button>
              </div>

              <FormulaDisplay engine={currentEngine} />
              <MaterialTracker engine={currentEngine} />
            </div>
          </div>
        )}

        {/* Debug Panel */}
        {currentEngine && process.env.NODE_ENV === 'development' && (
          <div className="debug-panel">
            <h4>🔍 Debug Info</h4>
            <pre>
              {JSON.stringify({
                currentPot: currentEngine.pot,
                futurePot: currentEngine.futurePot,
                stepsCount: currentEngine.steps.formula.length,
                finished: currentEngine.finished,
                successRate: currentEngine.getSuccessRate()
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;