// Calculation utilities ported from t4stat.js
import { PENALTY_DATA, STAT_OPTIONS } from './constants';
import type { StatOption } from './constants';
import { Calc } from './math';

export interface StatDetails {
  itemType: 'w' | 'a';
  startingPot: number;
  recipePot: number;
  tec: number;
  proficiency: number;
  matReduction: boolean;
}

export interface SlotData {
  optionIndex: number;
  value: number;
  steps: number;
}

export interface MaterialCosts {
  Metal: number;
  Cloth: number;
  Beast: number;
  Wood: number;
  Medicine: number;
  Mana: number;
}

// Utility function for Toram's rounding behavior
export function toramRound(value: number): number {
  return Math.round(value * 100) / 100;
}

// Calculate penalty based on stat categories used
export function calculatePenalty(slots: SlotData[]): number {
  const categories: { [key: string]: number } = {};
  
  for (const slot of slots) {
    if (slot.optionIndex === 0 || slot.value === 0) continue;
    
    const option = STAT_OPTIONS[slot.optionIndex - 1];
    if (!option) continue;
    
    if (!categories[option.cat]) categories[option.cat] = 0;
    categories[option.cat]++;
  }
  
  const penaltyValues = Object.keys(categories)
    .map(c => categories[c])
    .map(repeats => PENALTY_DATA[repeats] || 0);
    
  if (!penaltyValues.length) return 1;
  
  const penalty = penaltyValues.reduce((a, b) => a + b, 0);
  return 1 + 0.01 * penalty;
}

// Calculate material cost reduction
export function getCostReduction(proficiency: number, matReduction: boolean): number {
  let percent = 100 - (Math.floor(proficiency / 10) + Math.floor(proficiency / 50));
  if (matReduction) percent *= 0.9;
  return 0.01 * percent;
}

// Calculate success rate
export function getSuccessRate(currentPot: number, futurePot: number, recipePot: number): number {
  const prevPot = currentPot > recipePot ? currentPot : recipePot;
  
  let successRate = 160 + (futurePot * 230) / prevPot;
  if (successRate > 100) successRate = 100;
  if (successRate < 0) successRate = 0;
  
  return toramRound(successRate);
}

// Calculate potential change for a single slot
export function getPotentialChange(option: StatOption, value: number): number {
  if (!option || value === 0) return 0;
  
  const potentialPerStep = option.pot;
  const steps = calculateStepsFromValue(option, value);
  
  return potentialPerStep * steps;
}

// Calculate number of steps needed for a given value
export function calculateStepsFromValue(option: StatOption, value: number): number {
  if (!option || value === 0) return 0;
  
  // For percentage stats, usually 1 step = 1 value
  if (option.name.includes('%')) {
    return value;
  }
  
  // For stats with step multipliers
  if (option.step) {
    return Math.ceil(value / option.step);
  }
  
  // For stats with bonus calculations
  if (option.bonus) {
    return Math.ceil(value / option.bonus);
  }
  
  return value;
}

// Calculate material cost for a stat
export function calculateMaterialCost(option: StatOption, value: number, costReduction: number): number {
  if (!option || value === 0) return 0;
  
  const steps = calculateStepsFromValue(option, value);
  const baseCost = typeof option.cost === 'string' ? parseFloat(option.cost) : option.cost;
  
  return Math.ceil(baseCost * steps * costReduction);
}

// Calculate total material costs for all slots
export function calculateTotalMaterialCosts(
  slots: SlotData[], 
  proficiency: number, 
  matReduction: boolean
): MaterialCosts & { maxPerStep: number } {
  const costs: MaterialCosts = {
    Metal: 0,
    Cloth: 0,
    Beast: 0,
    Wood: 0,
    Medicine: 0,
    Mana: 0,
  };
  
  const costReduction = getCostReduction(proficiency, matReduction);
  let maxPerStep = 0;
  
  for (const slot of slots) {
    if (slot.optionIndex === 0 || slot.value === 0) continue;
    
    const option = STAT_OPTIONS[slot.optionIndex - 1];
    if (!option) continue;
    
    const materialCost = calculateMaterialCost(option, slot.value, costReduction);
    
    // Add to material type
    if (option.mat in costs) {
      costs[option.mat as keyof MaterialCosts] += materialCost;
    }
    
    // Track max per step
    maxPerStep = Math.max(maxPerStep, materialCost);
  }
  
  return { ...costs, maxPerStep };
}

// Calculate future potential
export function calculateFuturePotential(
  currentPot: number,
  slots: SlotData[]
): number {
  let deltaPot = 0;
  
  for (const slot of slots) {
    if (slot.optionIndex === 0 || slot.value === 0) continue;
    
    const option = STAT_OPTIONS[slot.optionIndex - 1];
    if (!option) continue;
    
    deltaPot += getPotentialChange(option, slot.value);
  }
  
  const penalty = calculatePenalty(slots);
  return currentPot + toramRound(penalty * deltaPot);
}

// Get filtered stat options based on item type
export function getFilteredStatOptions(itemType: 'w' | 'a'): StatOption[] {
  return STAT_OPTIONS.filter(option => 
    option.type === 'u' || option.type === itemType || option.type === 'e'
  );
}

// Group stat options by category
export function getGroupedStatOptions(itemType: 'w' | 'a'): { [key: string]: StatOption[] } {
  const filteredOptions = getFilteredStatOptions(itemType);
  const groups: { [key: string]: StatOption[] } = {};
  
  filteredOptions.forEach(option => {
    if (!groups[option.cat]) {
      groups[option.cat] = [];
    }
    groups[option.cat].push(option);
  });
  
  return groups;
}