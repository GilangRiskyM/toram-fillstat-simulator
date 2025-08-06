import { useState, useCallback } from 'react';
import { DEFAULT_WEAPON_RECIPE_POT, DEFAULT_ARMOR_RECIPE_POT } from '../utils/constants';

type ItemType = 'w' | 'a';

interface StatSlot {
  optionIndex: number;
  value: number;
  materialCost: number;
}

interface MaterialCosts {
  Metal: number;
  Cloth: number;
  Beast: number;
  Wood: number;
  Medicine: number;
  Mana: number;
  maxPerStep: number;
}

interface FormulaStep {
  text: string;
  pot_after: number;
  repeat?: number;
}

interface SimulatorState {
  // Basic settings
  itemType: ItemType;
  startingPot: number;
  recipePot: number;
  tec: number;
  proficiency: number;
  matReduction: boolean;
  
  // Simulation state
  isSimulationActive: boolean;
  slots: StatSlot[];
  currentPot: number;
  futurePot: number;
  successRate: number;
  materialCosts: MaterialCosts;
  formulaSteps: FormulaStep[];
  
  // History for undo/redo
  history: any[];
  historyIndex: number;
}

const initialMaterialCosts: MaterialCosts = {
  Metal: 0,
  Cloth: 0,
  Beast: 0,
  Wood: 0,
  Medicine: 0,
  Mana: 0,
  maxPerStep: 0,
};

const initialSlots: StatSlot[] = Array.from({ length: 8 }, () => ({
  optionIndex: 0,
  value: 0,
  materialCost: 0,
}));

const initialState: SimulatorState = {
  itemType: 'w',
  startingPot: 0,
  recipePot: DEFAULT_WEAPON_RECIPE_POT,
  tec: 255,
  proficiency: 0,
  matReduction: false,
  isSimulationActive: false,
  slots: initialSlots,
  currentPot: 0,
  futurePot: 0,
  successRate: 0,
  materialCosts: initialMaterialCosts,
  formulaSteps: [],
  history: [],
  historyIndex: -1,
};

export const useSimulator = () => {
  const [state, setState] = useState<SimulatorState>(initialState);

  const updateBasicSettings = useCallback((updates: Partial<Pick<SimulatorState, 
    'itemType' | 'startingPot' | 'recipePot' | 'tec' | 'proficiency' | 'matReduction'>>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const startSimulation = useCallback(() => {
    if (!state.startingPot || !state.recipePot) return;
    
    setState(prev => ({
      ...prev,
      isSimulationActive: true,
      currentPot: prev.startingPot,
      futurePot: prev.startingPot,
      successRate: 100, // Initial success rate
      formulaSteps: [],
      history: [],
      historyIndex: -1,
    }));
  }, [state.startingPot, state.recipePot]);

  const updateSlot = useCallback((slotIndex: number, optionIndex: number, value: number) => {
    setState(prev => {
      const newSlots = [...prev.slots];
      newSlots[slotIndex] = {
        optionIndex,
        value,
        materialCost: 0, // TODO: Calculate based on option and value
      };
      
      // TODO: Recalculate success rate and material costs
      return {
        ...prev,
        slots: newSlots,
      };
    });
  }, []);

  const confirm = useCallback(() => {
    // TODO: Implement confirm logic
    console.log('Confirm step');
  }, []);

  const repeat = useCallback(() => {
    // TODO: Implement repeat logic
    console.log('Repeat step');
  }, []);

  const undo = useCallback(() => {
    // TODO: Implement undo logic
    console.log('Undo step');
  }, []);

  const redo = useCallback(() => {
    // TODO: Implement redo logic
    console.log('Redo step');
  }, []);

  const exportState = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'toram-simulator-state.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importState = useCallback((newState: any) => {
    setState(newState);
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    updateBasicSettings,
    startSimulation,
    updateSlot,
    confirm,
    repeat,
    undo,
    redo,
    exportState,
    importState,
    resetState,
  };
};