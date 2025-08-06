import { useState, useCallback } from 'react';
import { DEFAULT_WEAPON_RECIPE_POT, DEFAULT_ARMOR_RECIPE_POT } from '../utils/constants';
import { 
  calculateFuturePotential, 
  calculateTotalMaterialCosts, 
  getSuccessRate,
  calculateMaterialCost,
  getCostReduction
} from '../utils/calculations';

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
      successRate: getSuccessRate(prev.startingPot, prev.startingPot, prev.recipePot),
      formulaSteps: [],
      history: [],
      historyIndex: -1,
    }));
  }, [state.startingPot, state.recipePot]);

  const recalculateStats = useCallback((newSlots: StatSlot[], currentPot: number, recipePot: number, proficiency: number, matReduction: boolean) => {
    // Convert slots to calculation format
    const slotData = newSlots.map(slot => ({
      optionIndex: slot.optionIndex,
      value: slot.value,
      steps: 0, // Will be calculated in calculations.ts
    }));

    // Calculate future potential
    const futurePot = calculateFuturePotential(currentPot, slotData);
    
    // Calculate success rate
    const successRate = getSuccessRate(currentPot, futurePot, recipePot);
    
    // Calculate material costs
    const materialCosts = calculateTotalMaterialCosts(slotData, proficiency, matReduction);
    
    return { futurePot, successRate, materialCosts };
  }, []);

  const updateSlot = useCallback((slotIndex: number, optionIndex: number, value: number) => {
    setState(prev => {
      const newSlots = [...prev.slots];
      newSlots[slotIndex] = {
        optionIndex,
        value,
        materialCost: 0, // Will be calculated below
      };
      
      // Recalculate all stats
      const { futurePot, successRate, materialCosts } = recalculateStats(
        newSlots, 
        prev.currentPot, 
        prev.recipePot, 
        prev.proficiency, 
        prev.matReduction
      );
      
      return {
        ...prev,
        slots: newSlots,
        futurePot,
        successRate,
        materialCosts,
      };
    });
  }, [recalculateStats]);

  const confirm = useCallback(() => {
    setState(prev => {
      // Save current state to history
      const newHistory = [...prev.history.slice(0, prev.historyIndex + 1), {
        slots: [...prev.slots],
        currentPot: prev.currentPot,
        futurePot: prev.futurePot,
        materialCosts: { ...prev.materialCosts },
        formulaSteps: [...prev.formulaSteps],
      }];
      
      // Create step description
      const activeSlots = prev.slots.filter(slot => slot.optionIndex > 0 && slot.value > 0);
      const stepText = activeSlots.length > 0 
        ? `Applied ${activeSlots.length} stat(s)`
        : 'No changes';
      
      const newStep: FormulaStep = {
        text: stepText,
        pot_after: prev.futurePot,
        repeat: 1,
      };
      
      return {
        ...prev,
        currentPot: prev.futurePot,
        formulaSteps: [...prev.formulaSteps, newStep],
        history: newHistory,
        historyIndex: newHistory.length - 1,
        // Reset slots for next step
        slots: initialSlots,
        materialCosts: initialMaterialCosts,
      };
    });
  }, []);

  const repeat = useCallback(() => {
    // TODO: Implement repeat logic based on last step
    console.log('Repeat step');
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex <= 0) return prev;
      
      const previousState = prev.history[prev.historyIndex - 1];
      return {
        ...prev,
        ...previousState,
        historyIndex: prev.historyIndex - 1,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;
      
      const nextState = prev.history[prev.historyIndex + 1];
      return {
        ...prev,
        ...nextState,
        historyIndex: prev.historyIndex + 1,
      };
    });
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