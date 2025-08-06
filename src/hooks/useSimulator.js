/**
 * Custom hook for complex fill stats simulation logic
 * Migrated from t4stat.js Slot, Stat, and Formula classes
 */

import { useCallback } from 'react';
import { useSimulator } from '../context/SimulatorContext';
import { Calc } from '../utils/math';
import { OPTIONS } from '../utils/statOptions';
import { 
  MAX_STEPS, 
  BONUS_STEPS, 
  PENALTY_DATA
} from '../utils/constants';
import { toramRound, deepClone } from '../utils/helpers';

export function useSimulatorLogic() {
  const { state, actions } = useSimulator();

  /**
   * Calculate penalty based on stat categories
   */
  const calculatePenalty = useCallback(() => {
    const categories = {};
    
    for (let slot of state.simulation.slots) {
      if (!slot.statName || (slot.isNewStat && !slot.futureSteps)) continue;
      if (!categories[slot.statData?.cat]) categories[slot.statData.cat] = 0;
      categories[slot.statData.cat]++;
    }
    
    const penaltyValues = Object.keys(categories)
      .map(c => categories[c])
      .map(repeats => PENALTY_DATA[repeats]);
    
    if (!penaltyValues.length) return 1;
    
    const penalty = penaltyValues.reduce((a, b) => a + b);
    return 1 + 0.01 * penalty;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.simulation.slots]);

  /**
   * Calculate cost reduction based on proficiency and material reduction
   */
  const getCostReduction = useCallback(() => {
    const { proficiency, matReduction } = state.settings;
    let percent = 100 - (Math.floor(proficiency / 10) + Math.floor(proficiency / 50));
    if (matReduction) percent *= 0.9;
    return 0.01 * percent;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.settings.proficiency, state.settings.matReduction]);

  /**
   * Calculate success rate based on potential
   */
  const getSuccessRate = useCallback(() => {
    if (typeof state.simulation.finished === "number") {
      return state.simulation.finished;
    }
    
    const { recipePot } = state.settings;
    const { currentPot, futurePot } = state.simulation;
    
    const prevPot = currentPot > recipePot ? currentPot : recipePot;
    let successRate = 160 + (futurePot * 230) / prevPot;
    
    if (successRate > 100) successRate = 100;
    if (successRate < 0) successRate = 0;
    
    return toramRound(successRate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.simulation.finished, 
    state.simulation.currentPot, 
    state.simulation.futurePot, 
    state.settings.recipePot
  ]);

  /**
   * Convert stat value to steps for a given stat data
   */
  const statToSteps = useCallback((value, statData) => {
    if (!statData) return 0;
    
    const inputIsNegative = value < 0 ? -1 : 1;
    const stepMax = 100 / statData.pot;
    const changePerStep = statData.step || 1;
    const maxNormalStep = stepMax > MAX_STEPS ? MAX_STEPS : stepMax;
    const maxNormalValue = statData.max
      ? statData.max
      : stepMax > MAX_STEPS
      ? MAX_STEPS * changePerStep
      : stepMax * changePerStep;
    
    let futureSteps;
    
    if (Math.abs(value) > maxNormalValue) {
      const overstep = statData.bonus || changePerStep;
      futureSteps = (maxNormalStep + (Math.abs(value) - maxNormalValue) / overstep) * inputIsNegative;
    } else {
      futureSteps = value / changePerStep;
    }
    
    return toramRound(futureSteps);
  }, []);

  /**
   * Convert steps to stat value for a given stat data
   */
  const stepsToStat = useCallback((value, statData) => {
    if (!statData) return 0;
    
    const isNegative = value < 0;
    value = Math.abs(value);
    const stepMax = 100 / statData.pot;
    const changePerStep = statData.step || 1;
    const maxNormalValue = statData.max
      ? statData.max / changePerStep
      : stepMax > MAX_STEPS
      ? MAX_STEPS
      : stepMax;

    if (value < maxNormalValue) {
      value = value * (statData.step || 1);
    } else {
      const bonus = statData.bonus || statData.step || 1;
      value = maxNormalValue * (statData.step || 1) + (value - maxNormalValue) * bonus;
    }

    if (isNegative) value *= -1;
    return value;
  }, []);

  /**
   * Calculate bonus steps for a stat
   */
  const calcBonusSteps = useCallback((statData) => {
    if (!statData) return 0;
    const bonusSteps = Math.floor(BONUS_STEPS * (statData.bonusratio || 1));
    const reduction = statData.bonusdeduction || 0;
    return bonusSteps - reduction;
  }, []);

  /**
   * Get maximum stat value
   */
  const getMaxStat = useCallback((statData, isNega = false) => {
    if (!statData) return 0;
    
    const stepMax = 100 / statData.pot;
    const bonusSteps = calcBonusSteps(statData);
    const customMax = (statData.max || 0) * (statData.step || 1);
    const baseMax = stepMax > MAX_STEPS ? MAX_STEPS : stepMax;
    const maxBaseStat = (statData.step || 1) * baseMax;
    const bonusMax = (statData.bonus || 0) * bonusSteps;

    if (statData.bonus) {
      let value = (customMax || maxBaseStat) + bonusMax;
      if (isNega && statData.max_only) return customMax || maxBaseStat;
      return value;
    } else if (customMax) {
      return customMax;
    } else {
      return baseMax * (statData.step || 1);
    }
  }, [calcBonusSteps]);

  /**
   * Calculate cost for stat change
   */
  const calculateCost = useCallback((currentSteps, futureSteps, statData) => {
    if (!statData) return 0;
    
    const baseCost = parseFloat(statData.cost);
    const change = currentSteps < futureSteps ? 1 : -1;
    const costReduction = getCostReduction();

    let cost = 0;
    for (
      let i = currentSteps + change;
      change > 0 ? i <= futureSteps : i >= futureSteps;
      i += change
    ) {
      cost += baseCost * Math.pow(i, 2);
    }

    return cost * costReduction;
  }, [getCostReduction]);

  /**
   * Calculate potential change for a slot
   */
  const getPotentialChange = useCallback((slot) => {
    if (!slot.statData || slot.currentSteps === slot.futureSteps) return 0;
    
    const change = slot.currentSteps > slot.futureSteps ? -1 : 1;
    const { tec } = state.settings;
    const { itemType } = state.settings;
    
    let currentSteps = slot.currentSteps;
    let futureSteps = slot.futureSteps;

    const stepMax = 100 / slot.statData.pot;
    const maxNormalSteps = slot.statData.max || (stepMax > MAX_STEPS ? MAX_STEPS : stepMax);

    const all = [currentSteps, futureSteps].sort((a, b) => a - b);
    let diff = all[1] - all[0];
    let bonusDiff = 0;

    // Trim anything below the standard minimum
    if (all[0] < -maxNormalSteps) {
      let extras = Math.abs(all[0]) - maxNormalSteps;
      diff -= extras;
      bonusDiff += extras;
    }

    // Trim anything above the standard maximum
    if (all[1] > maxNormalSteps) {
      let extras = all[1] - maxNormalSteps;
      diff -= extras;
      bonusDiff += extras;
    }

    // Trim bonus for cases where both values are in bonus range
    if (diff < 0) {
      bonusDiff += diff;
      diff = 0;
    }

    const double = ![itemType, "u", "e"].includes(slot.statData.type) ? 2 : 1;
    const basicPot = Calc(diff).multiply(slot.statData.pot);
    const bonusPot = Calc(bonusDiff).multiply(slot.statData.pot).multiply(2);

    const potentialReturn = 5 + tec / 10;
    const bonusPotentialReturn = potentialReturn / 4;

    // Negatives have an extra multiplier
    if (change === -1) {
      basicPot.multiply(potentialReturn).multiply(0.01);
      bonusPot.multiply(bonusPotentialReturn).multiply(0.01);
    }

    // Add the 2 different types of potential return together
    const totalPot = basicPot
      .add(bonusPot)
      .multiply(double)
      .multiply(-change)
      .result();

    return toramRound(totalPot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.settings.tec, state.settings.itemType]);

  /**
   * Update slot with new stat selection or value
   */
  const updateSlot = useCallback((slotId, updates) => {
    const slot = state.simulation.slots[slotId];
    if (!slot) return;

    // Handle stat selection change
    if (updates.statDataId !== undefined) {
      if (updates.statDataId === 0) {
        // Reset slot
        actions.updateSlot(slotId, {
          statName: null,
          statData: null,
          currentStat: 0,
          futureStat: 0,
          currentSteps: 0,
          futureSteps: 0,
          isNewStat: true
        });
        return;
      }

      // Set up new stat data
      const statData = deepClone(OPTIONS[updates.statDataId - 1]);
      actions.updateSlot(slotId, {
        statData,
        statName: statData.name,
        isNewStat: updates.statDataId
      });
    }

    // Handle value changes
    if (updates.futureStat !== undefined) {
      const currentSlot = state.simulation.slots[slotId];
      if (currentSlot.statData) {
        const futureSteps = statToSteps(updates.futureStat, currentSlot.statData);
        actions.updateSlot(slotId, {
          futureStat: updates.futureStat,
          futureSteps
        });
      }
    }

    // Recalculate potential after slot update
    updatePotential();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.simulation.slots, actions, statToSteps]);

  /**
   * Update potential based on all slot changes
   */
  const updatePotential = useCallback(() => {
    let deltaPot = 0;
    for (let slot of state.simulation.slots) {
      if (!slot.statName) continue;
      deltaPot += getPotentialChange(slot);
    }

    const penalty = calculatePenalty();
    const futurePot = state.simulation.currentPot + toramRound(penalty * deltaPot);

    // Update simulation state (this would need to be implemented in context)
    // For now, we'll return the calculated value
    return futurePot;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.simulation.slots, state.simulation.currentPot, getPotentialChange, calculatePenalty]);

  /**
   * Confirm current step and apply changes
   */
  const confirmStep = useCallback(() => {
    // Implementation would update the context state
    // This is a complex operation that needs to:
    // 1. Calculate material costs
    // 2. Update formula steps
    // 3. Apply slot changes
    // 4. Update potential
    // 5. Check if simulation is finished
    
    console.log('Confirm step - implementation needed');
  }, []);

  /**
   * Undo last step
   */
  const undoStep = useCallback(() => {
    // Implementation would revert the last formula step
    console.log('Undo step - implementation needed');
  }, []);

  /**
   * Redo last undone step
   */
  const redoStep = useCallback(() => {
    // Implementation would replay the last undone step
    console.log('Redo step - implementation needed');
  }, []);

  /**
   * Repeat last step
   */
  const repeatStep = useCallback(() => {
    // Implementation would repeat the last formula step
    console.log('Repeat step - implementation needed');
  }, []);

  return {
    // Calculation functions
    calculatePenalty,
    getCostReduction,
    getSuccessRate,
    statToSteps,
    stepsToStat,
    calcBonusSteps,
    getMaxStat,
    calculateCost,
    getPotentialChange,
    
    // Action functions
    updateSlot,
    updatePotential,
    confirmStep,
    undoStep,
    redoStep,
    repeatStep
  };
}

export default useSimulatorLogic;