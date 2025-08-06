import { toramRound } from './mathUtils.js';

// Success rate calculation utilities
export function calculateSuccessRate(currentPot, futurePot, recipePot) {
  const prevPot = currentPot > recipePot ? currentPot : recipePot;
  let successRate = 160 + (futurePot * 230) / prevPot;
  
  if (successRate > 100) successRate = 100;
  if (successRate < 0) successRate = 0;
  
  return toramRound(successRate);
}

// Success rate color classification
export function getSuccessRateClass(rate) {
  if (rate >= 80) return 'high';
  if (rate >= 60) return 'medium';
  return 'low';
}

// Material cost calculations
export function calculateMaterialCost(baseCost, currentSteps, futureSteps, costReduction) {
  const change = currentSteps < futureSteps ? 1 : -1;
  let cost = 0;
  
  for (
    let i = currentSteps + change;
    change > 0 ? i <= futureSteps : i >= futureSteps;
    i += change
  ) {
    cost += baseCost * Math.pow(i, 2);
  }
  
  return cost * costReduction;
}

// Cost reduction from proficiency and passive
export function calculateCostReduction(proficiency, hasMatReduction) {
  let percent = 100 - (Math.floor(proficiency / 10) + Math.floor(proficiency / 50));
  if (hasMatReduction) percent *= 0.9;
  return 0.01 * percent;
}

// TEC-based potential return calculation
export function calculatePotentialReturn(tec) {
  const potentialReturn = 5 + tec / 10;
  const bonusPotentialReturn = potentialReturn / 4;
  return { potentialReturn, bonusPotentialReturn };
}

// Format material display name
export function formatMaterialName(materialKey) {
  const materialNames = {
    Metal: "Metal / Logam",
    Cloth: "Cloth / Kain", 
    Beast: "Beast / Fauna",
    Wood: "Wood / Kayu",
    Medicine: "Medicine / Obat",
    Mana: "Mana"
  };
  
  return materialNames[materialKey] || materialKey;
}

// Format cost display
export function formatCostDisplay(cost, materialType) {
  return `(${toramRound(cost)} ${materialType})`;
}

// Validate stat input
export function validateStatInput(value, statData, maxStat) {
  if (!statData) return { isValid: true, message: '' };
  
  const numValue = parseInt(value) || 0;
  
  if (Math.abs(numValue) > maxStat) {
    return { 
      isValid: false, 
      message: `Maximum value is ${maxStat}` 
    };
  }
  
  if (numValue < 0 && statData.nonega) {
    return { 
      isValid: false, 
      message: 'Negative values not allowed for this stat' 
    };
  }
  
  return { isValid: true, message: '' };
}

// Get color for stat input validation
export function getStatInputColor(isValid, futureSteps) {
  if (!isValid) return 'red';
  if (futureSteps >= 0) return 'black';
  return 'gray';
}

// Format step display text
export function formatStepText(changes) {
  return changes.map(change => {
    const { statName, delta } = change;
    const sign = delta > 0 ? '+' : '';
    return `${statName} ${sign}${delta}`;
  }).join(' ');
}

// Calculate category penalty
export function calculateCategoryPenalty(slots, penaltyData) {
  const categories = {};
  
  for (let slot of slots) {
    if (!slot.statName || (slot.newStat && !slot.futureSteps)) continue;
    if (!categories[slot.statData.cat]) categories[slot.statData.cat] = 0;
    categories[slot.statData.cat]++;
  }
  
  let penaltyValues = Object.keys(categories)
    .map((c) => categories[c])
    .map((repeats) => penaltyData[repeats] || 0);
  
  if (!penaltyValues.length) return 1;
  
  let penalty = penaltyValues.reduce((a, b) => a + b);
  return 1 + 0.01 * penalty;
}

// Format potential display
export function formatPotentialDisplay(futurePot, currentPot) {
  return `Potential: ${futurePot} / ${currentPot}`;
}

// Format settings display
export function formatSettingsDisplay(tec, proficiency, matReduction) {
  const settings = [];
  
  if (tec !== 255) settings.push(`${tec} TEC`);
  if (proficiency > 0) settings.push(`${proficiency} proficiency`);
  if (matReduction) settings.push('10% mat reduction');
  
  return settings.length > 0 ? `(${settings.join(' / ')})` : '';
}

// Auto-fill helper
export function calculateAutoFill(currentSteps, currentPot, stepPot, maxSteps = 20) {
  let targetSteps = currentSteps;
  const isExtended = currentSteps >= 20;
  const maxAllowed = isExtended ? 28 : 20;
  
  while (currentPot > stepPot && targetSteps < maxAllowed) {
    targetSteps++;
  }
  
  return targetSteps;
}

// Keyboard shortcut helpers
export function handleStatKeyboard(key, currentValue, statData, maxSteps) {
  switch (key.toLowerCase()) {
    case 'a': // All/Max
      return maxSteps;
    case 'd': // Min  
      return -maxSteps;
    case 'q': // Up one step
    case 'arrowup':
      return currentValue + 1;
    case 'w': // Down one step
    case 'arrowdown':
      return currentValue - 1;
    default:
      return currentValue;
  }
}

// Export all calculation utilities
export default {
  calculateSuccessRate,
  getSuccessRateClass,
  calculateMaterialCost,
  calculateCostReduction,
  calculatePotentialReturn,
  formatMaterialName,
  formatCostDisplay,
  validateStatInput,
  getStatInputColor,
  formatStepText,
  calculateCategoryPenalty,
  formatPotentialDisplay,
  formatSettingsDisplay,
  calculateAutoFill,
  handleStatKeyboard
};