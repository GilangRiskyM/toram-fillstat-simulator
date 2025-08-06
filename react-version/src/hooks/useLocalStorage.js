import { useState, useEffect, useCallback } from 'react';

// Hook for localStorage integration
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = useCallback((newValue) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  const removeStoredValue = useCallback(() => {
    try {
      setValue(defaultValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  return [value, setStoredValue, removeStoredValue];
}

// Hook for auto-save functionality
export function useAutoSave(saveFunction, interval = 30000) {
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);

  useEffect(() => {
    if (!isAutoSaveEnabled || !saveFunction) return;

    const intervalId = setInterval(() => {
      try {
        saveFunction();
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, interval);

    return () => clearInterval(intervalId);
  }, [saveFunction, interval, isAutoSaveEnabled]);

  return {
    isAutoSaveEnabled,
    setIsAutoSaveEnabled,
    saveNow: saveFunction
  };
}

// Hook for managing settings
export function useSettings() {
  const [settings, setSettings] = useLocalStorage('toram_fillstat_settings', {
    tec: 255,
    proficiency: 0,
    matReduction: false
  });

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, [setSettings]);

  const resetSettings = useCallback(() => {
    setSettings({
      tec: 255,
      proficiency: 0,
      matReduction: false
    });
  }, [setSettings]);

  return {
    settings,
    updateSetting,
    resetSettings,
    tec: settings.tec,
    proficiency: settings.proficiency,
    matReduction: settings.matReduction
  };
}

// Hook for workspace data persistence
export function useWorkspaceStorage() {
  const [workspaceData, setWorkspaceData] = useLocalStorage('toram_workspace_data', {});

  const saveWorkspace = useCallback((workspaceId, snapshot) => {
    setWorkspaceData(prev => ({
      ...prev,
      [workspaceId]: snapshot
    }));
  }, [setWorkspaceData]);

  const loadWorkspace = useCallback((workspaceId) => {
    return workspaceData[workspaceId] || null;
  }, [workspaceData]);

  const removeWorkspace = useCallback((workspaceId) => {
    setWorkspaceData(prev => {
      const newData = { ...prev };
      delete newData[workspaceId];
      return newData;
    });
  }, [setWorkspaceData]);

  const saveAllWorkspaces = useCallback((workspacesMap) => {
    const dataToSave = {};
    for (const [id, engine] of Object.entries(workspacesMap)) {
      if (engine && engine.getSnapshot) {
        dataToSave[id] = engine.getSnapshot();
      }
    }
    setWorkspaceData(dataToSave);
  }, [setWorkspaceData]);

  const clearAllWorkspaces = useCallback(() => {
    setWorkspaceData({});
  }, [setWorkspaceData]);

  return {
    workspaceData,
    saveWorkspace,
    loadWorkspace,
    removeWorkspace,
    saveAllWorkspaces,
    clearAllWorkspaces,
    hasStoredWorkspaces: Object.keys(workspaceData).length > 0
  };
}