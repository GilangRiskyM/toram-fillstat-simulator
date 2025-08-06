/**
 * Custom hook for localStorage management
 * Provides persistent storage with auto-save functionality
 */

import { useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

export function useLocalStorage() {
  /**
   * Save data to localStorage with error handling
   * @param {string} key - Storage key
   * @param {any} data - Data to save
   */
  const saveToStorage = useCallback((key, data) => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, []);

  /**
   * Load data from localStorage with error handling
   * @param {string} key - Storage key
   * @returns {any|null} Loaded data or null if not found/error
   */
  const loadFromStorage = useCallback((key) => {
    try {
      const serializedData = localStorage.getItem(key);
      if (!serializedData) return null;
      return JSON.parse(serializedData);
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }, []);

  /**
   * Remove data from localStorage
   * @param {string} key - Storage key
   */
  const removeFromStorage = useCallback((key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }, []);

  /**
   * Save simulator instance data
   * @param {Object} instanceData - Simulator instance data
   */
  const saveInstanceData = useCallback((instanceData) => {
    saveToStorage(STORAGE_KEYS.INSTANCE_DATA, instanceData);
  }, [saveToStorage]);

  /**
   * Load simulator instance data
   * @returns {Object|null} Instance data or null
   */
  const loadInstanceData = useCallback(() => {
    return loadFromStorage(STORAGE_KEYS.INSTANCE_DATA);
  }, [loadFromStorage]);

  /**
   * Save extra settings (TEC, proficiency, etc.)
   * @param {Object} settings - Settings object
   */
  const saveSettings = useCallback((settings) => {
    saveToStorage(STORAGE_KEYS.EXTRA_SETTINGS, settings);
  }, [saveToStorage]);

  /**
   * Load extra settings
   * @returns {Object|null} Settings object or null
   */
  const loadSettings = useCallback(() => {
    return loadFromStorage(STORAGE_KEYS.EXTRA_SETTINGS);
  }, [loadFromStorage]);

  /**
   * Clear all simulator data from localStorage
   */
  const clearAllData = useCallback(() => {
    removeFromStorage(STORAGE_KEYS.INSTANCE_DATA);
    removeFromStorage(STORAGE_KEYS.EXTRA_SETTINGS);
  }, [removeFromStorage]);

  /**
   * Check if localStorage is available
   * @returns {boolean} True if localStorage is available
   */
  const isStorageAvailable = useCallback(() => {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  return {
    saveToStorage,
    loadFromStorage,
    removeFromStorage,
    saveInstanceData,
    loadInstanceData,
    saveSettings,
    loadSettings,
    clearAllData,
    isStorageAvailable
  };
}

/**
 * Hook for auto-save functionality
 * @param {Function} saveFunction - Function to call for saving
 * @param {number} interval - Auto-save interval in milliseconds
 * @param {boolean} enabled - Whether auto-save is enabled
 */
export function useAutoSave(saveFunction, interval = 30000, enabled = true) {
  useEffect(() => {
    if (!enabled || typeof saveFunction !== 'function') {
      return;
    }

    const autoSaveInterval = setInterval(() => {
      try {
        saveFunction();
        console.log('Auto-save completed');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, interval);

    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [saveFunction, interval, enabled]);
}

const LocalStorageExport = { useLocalStorage, useAutoSave };

export default LocalStorageExport;