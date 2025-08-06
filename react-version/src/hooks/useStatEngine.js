import { useState, useCallback, useRef } from 'react';
import { StatEngine } from '../utils/statEngine.js';

// Main hook for the stat engine
export function useStatEngine() {
  const [statEngines, setStatEngines] = useState({});
  const [currentEngineId, setCurrentEngineId] = useState(null);
  const engineIdCounter = useRef(1);

  // Get new workspace ID
  const getNewWorkspaceId = useCallback(() => {
    let id = engineIdCounter.current;
    while (statEngines[`Stat_${id}`]) {
      id++;
    }
    engineIdCounter.current = id + 1;
    return `Stat_${id}`;
  }, [statEngines]);

  // Create new stat engine
  const createEngine = useCallback((details, workspaceId = null) => {
    const id = workspaceId || getNewWorkspaceId();
    const engine = new StatEngine(details);
    
    setStatEngines(prev => ({
      ...prev,
      [id]: engine
    }));
    
    setCurrentEngineId(id);
    return { id, engine };
  }, [getNewWorkspaceId]);

  // Remove stat engine
  const removeEngine = useCallback((engineId) => {
    setStatEngines(prev => {
      const newEngines = { ...prev };
      delete newEngines[engineId];
      return newEngines;
    });
    
    if (currentEngineId === engineId) {
      setCurrentEngineId(null);
    }
  }, [currentEngineId]);

  // Set current engine
  const setCurrentEngine = useCallback((engineId) => {
    if (statEngines[engineId]) {
      setCurrentEngineId(engineId);
    }
  }, [statEngines]);

  // Get current engine
  const getCurrentEngine = useCallback(() => {
    return currentEngineId ? statEngines[currentEngineId] : null;
  }, [statEngines, currentEngineId]);

  // Update current engine
  const updateCurrentEngine = useCallback((updateFn) => {
    if (!currentEngineId || !statEngines[currentEngineId]) return;
    
    setStatEngines(prev => {
      const newEngines = { ...prev };
      const currentEngine = newEngines[currentEngineId];
      updateFn(currentEngine);
      return newEngines;
    });
  }, [currentEngineId, statEngines]);

  // Duplicate current engine
  const duplicateCurrentEngine = useCallback(() => {
    const currentEngine = getCurrentEngine();
    if (!currentEngine) return null;
    
    const snapshot = currentEngine.getSnapshot();
    const newId = getNewWorkspaceId();
    const duplicatedEngine = new StatEngine(currentEngine.details);
    duplicatedEngine.autoLoad(snapshot);
    
    setStatEngines(prev => ({
      ...prev,
      [`Copy of ${currentEngineId}`]: duplicatedEngine
    }));
    
    return `Copy of ${currentEngineId}`;
  }, [getCurrentEngine, getNewWorkspaceId, currentEngineId]);

  // Rename workspace
  const renameWorkspace = useCallback((oldId, newId) => {
    if (statEngines[newId]) return false; // Name already exists
    
    setStatEngines(prev => {
      const newEngines = { ...prev };
      newEngines[newId] = newEngines[oldId];
      delete newEngines[oldId];
      return newEngines;
    });
    
    if (currentEngineId === oldId) {
      setCurrentEngineId(newId);
    }
    
    return true;
  }, [statEngines, currentEngineId]);

  // Reset all engines
  const resetAll = useCallback(() => {
    setStatEngines({});
    setCurrentEngineId(null);
    engineIdCounter.current = 1;
  }, []);

  return {
    statEngines,
    currentEngineId,
    currentEngine: getCurrentEngine(),
    createEngine,
    removeEngine,
    setCurrentEngine,
    updateCurrentEngine,
    duplicateCurrentEngine,
    renameWorkspace,
    resetAll,
    hasEngines: Object.keys(statEngines).length > 0
  };
}