/**
 * Simulator Context for centralized state management
 * Manages all simulator state, settings, and operations
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { DEFAULT_SETTINGS, MATERIAL_TYPES, ITEM_TYPES } from '../utils/constants';
import { useLocalStorage, useAutoSave } from '../hooks/useLocalStorage';
import { parsePotential, parseTEC, parseProficiency, deepClone } from '../utils/helpers';

// Initial state structure
const initialState = {
  // Settings
  settings: {
    itemType: ITEM_TYPES.WEAPON,
    startingPot: DEFAULT_SETTINGS.STARTING_POT,
    recipePot: 46,
    tec: DEFAULT_SETTINGS.TEC,
    proficiency: DEFAULT_SETTINGS.PROFICIENCY,
    matReduction: DEFAULT_SETTINGS.MAT_REDUCTION
  },
  
  // Current simulation state
  simulation: {
    isActive: false,
    currentPot: 0,
    futurePot: 0,
    finished: false,
    slots: Array(8).fill(null).map((_, index) => ({
      id: index,
      statName: null,
      statData: null,
      currentStat: 0,
      futureStat: 0,
      currentSteps: 0,
      futureSteps: 0,
      isNewStat: true
    }))
  },

  // Material costs tracking
  materials: {
    [MATERIAL_TYPES.METAL]: 0,
    [MATERIAL_TYPES.CLOTH]: 0,
    [MATERIAL_TYPES.BEAST]: 0,
    [MATERIAL_TYPES.WOOD]: 0,
    [MATERIAL_TYPES.MEDICINE]: 0,
    [MATERIAL_TYPES.MANA]: 0
  },

  // Step-by-step materials for current step
  stepMaterials: {
    [MATERIAL_TYPES.METAL]: 0,
    [MATERIAL_TYPES.CLOTH]: 0,
    [MATERIAL_TYPES.BEAST]: 0,
    [MATERIAL_TYPES.WOOD]: 0,
    [MATERIAL_TYPES.MEDICINE]: 0,
    [MATERIAL_TYPES.MANA]: 0
  },

  // Maximum materials used in any single step
  maxMaterials: 0,

  // Formula and history
  formula: {
    steps: [],
    condensedSteps: [],
    redoQueue: []
  },

  // UI state
  ui: {
    notifications: [],
    isLoading: false,
    error: null
  }
};

// Action types
const ActionTypes = {
  // Settings actions
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  RESET_SETTINGS: 'RESET_SETTINGS',
  
  // Simulation actions
  START_SIMULATION: 'START_SIMULATION',
  STOP_SIMULATION: 'STOP_SIMULATION',
  UPDATE_SLOT: 'UPDATE_SLOT',
  CONFIRM_STEP: 'CONFIRM_STEP',
  UNDO_STEP: 'UNDO_STEP',
  REDO_STEP: 'REDO_STEP',
  REPEAT_STEP: 'REPEAT_STEP',
  
  // Material actions
  UPDATE_MATERIALS: 'UPDATE_MATERIALS',
  RESET_MATERIALS: 'RESET_MATERIALS',
  
  // Formula actions
  ADD_FORMULA_STEP: 'ADD_FORMULA_STEP',
  UPDATE_FORMULA: 'UPDATE_FORMULA',
  CLEAR_FORMULA: 'CLEAR_FORMULA',
  
  // UI actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  
  // Data actions
  LOAD_STATE: 'LOAD_STATE',
  RESET_STATE: 'RESET_STATE'
};

// Reducer function
function simulatorReducer(state, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };

    case ActionTypes.RESET_SETTINGS:
      return {
        ...state,
        settings: {
          itemType: ITEM_TYPES.WEAPON,
          startingPot: DEFAULT_SETTINGS.STARTING_POT,
          recipePot: 46,
          tec: DEFAULT_SETTINGS.TEC,
          proficiency: DEFAULT_SETTINGS.PROFICIENCY,
          matReduction: DEFAULT_SETTINGS.MAT_REDUCTION
        }
      };

    case ActionTypes.START_SIMULATION:
      return {
        ...state,
        simulation: {
          ...state.simulation,
          isActive: true,
          currentPot: state.settings.startingPot,
          futurePot: state.settings.startingPot,
          finished: false
        }
      };

    case ActionTypes.STOP_SIMULATION:
      return {
        ...state,
        simulation: {
          ...initialState.simulation,
          slots: Array(8).fill(null).map((_, index) => ({
            id: index,
            statName: null,
            statData: null,
            currentStat: 0,
            futureStat: 0,
            currentSteps: 0,
            futureSteps: 0,
            isNewStat: true
          }))
        }
      };

    case ActionTypes.UPDATE_SLOT:
      const { slotId, updates } = action.payload;
      return {
        ...state,
        simulation: {
          ...state.simulation,
          slots: state.simulation.slots.map(slot =>
            slot.id === slotId
              ? { ...slot, ...updates }
              : slot
          )
        }
      };

    case ActionTypes.UPDATE_MATERIALS:
      return {
        ...state,
        materials: {
          ...state.materials,
          ...action.payload
        }
      };

    case ActionTypes.RESET_MATERIALS:
      return {
        ...state,
        materials: { ...initialState.materials },
        stepMaterials: { ...initialState.stepMaterials },
        maxMaterials: 0
      };

    case ActionTypes.ADD_FORMULA_STEP:
      return {
        ...state,
        formula: {
          ...state.formula,
          steps: [...state.formula.steps, action.payload],
          redoQueue: [] // Clear redo queue when adding new step
        }
      };

    case ActionTypes.UPDATE_FORMULA:
      return {
        ...state,
        formula: {
          ...state.formula,
          ...action.payload
        }
      };

    case ActionTypes.CLEAR_FORMULA:
      return {
        ...state,
        formula: {
          steps: [],
          condensedSteps: [],
          redoQueue: []
        }
      };

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        ui: {
          ...state.ui,
          isLoading: action.payload
        }
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        ui: {
          ...state.ui,
          error: action.payload
        }
      };

    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, action.payload]
        }
      };

    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(
            (_, index) => index !== action.payload
          )
        }
      };

    case ActionTypes.LOAD_STATE:
      return {
        ...state,
        ...action.payload
      };

    case ActionTypes.RESET_STATE:
      return { ...initialState };

    default:
      return state;
  }
}

// Create context
const SimulatorContext = createContext();

// Context provider component
export function SimulatorProvider({ children }) {
  const [state, dispatch] = useReducer(simulatorReducer, initialState);
  const { saveInstanceData, loadInstanceData, saveSettings, loadSettings } = useLocalStorage();

  // Action creators
  const updateSettings = useCallback((settings) => {
    dispatch({ type: ActionTypes.UPDATE_SETTINGS, payload: settings });
    saveSettings(settings);
  }, [saveSettings]);

  const startSimulation = useCallback(() => {
    const { startingPot, recipePot, itemType } = state.settings;
    
    if (!startingPot || startingPot < 1) {
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          id: Date.now(),
          type: 'error',
          message: '❌ Silakan masukkan POT awal yang valid!'
        }
      });
      return false;
    }

    if (!recipePot || recipePot < 1) {
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          id: Date.now(),
          type: 'error',
          message: '❌ Silakan masukkan POT resep yang valid!'
        }
      });
      return false;
    }

    dispatch({ type: ActionTypes.START_SIMULATION });
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: {
        id: Date.now(),
        type: 'success',
        message: '✅ Simulasi berhasil dimulai!'
      }
    });
    return true;
  }, [state.settings]);

  const stopSimulation = useCallback(() => {
    dispatch({ type: ActionTypes.STOP_SIMULATION });
    dispatch({ type: ActionTypes.RESET_MATERIALS });
    dispatch({ type: ActionTypes.CLEAR_FORMULA });
  }, []);

  const updateSlot = useCallback((slotId, updates) => {
    dispatch({
      type: ActionTypes.UPDATE_SLOT,
      payload: { slotId, updates }
    });
  }, []);

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: { ...notification, id }
    });

    // Auto-remove notification after 3 seconds
    setTimeout(() => {
      dispatch({
        type: ActionTypes.REMOVE_NOTIFICATION,
        payload: id
      });
    }, 3000);
  }, []);

  const removeNotification = useCallback((index) => {
    dispatch({
      type: ActionTypes.REMOVE_NOTIFICATION,
      payload: index
    });
  }, []);

  // Auto-save functionality
  const saveCurrentState = useCallback(() => {
    if (state.simulation.isActive) {
      const dataToSave = {
        settings: state.settings,
        simulation: state.simulation,
        materials: state.materials,
        formula: state.formula
      };
      saveInstanceData(dataToSave);
    }
  }, [state, saveInstanceData]);

  // Use auto-save hook
  useAutoSave(saveCurrentState, 30000, state.simulation.isActive);

  // Load saved data on mount
  useEffect(() => {
    const savedSettings = loadSettings();
    if (savedSettings) {
      dispatch({
        type: ActionTypes.UPDATE_SETTINGS,
        payload: savedSettings
      });
    }

    const savedData = loadInstanceData();
    if (savedData) {
      dispatch({
        type: ActionTypes.LOAD_STATE,
        payload: savedData
      });
    }
  }, [loadSettings, loadInstanceData]);

  // Context value
  const value = {
    state,
    actions: {
      updateSettings,
      startSimulation,
      stopSimulation,
      updateSlot,
      addNotification,
      removeNotification,
      saveCurrentState
    },
    ActionTypes
  };

  return (
    <SimulatorContext.Provider value={value}>
      {children}
    </SimulatorContext.Provider>
  );
}

// Custom hook to use simulator context
export function useSimulator() {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
}

export default SimulatorContext;