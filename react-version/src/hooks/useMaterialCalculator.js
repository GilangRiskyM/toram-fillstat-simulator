import { useMemo } from 'react';
import { MATERIAL_TYPES } from '../data/statsData.js';
import { formatMaterialName, calculateMaterialCost, toramRound } from '../utils/calculations.js';

// Hook for material cost calculations
export function useMaterialCalculator(statEngine) {
  const materialCosts = useMemo(() => {
    if (!statEngine) {
      return {
        stepCosts: {},
        totalCosts: {},
        maxCostPerStep: 0,
        costSummary: []
      };
    }

    // Calculate step costs (for current changes)
    const stepCosts = {};
    let maxCostPerStep = 0;

    for (const materialType of Object.keys(MATERIAL_TYPES)) {
      stepCosts[materialType] = 0;
    }

    // Calculate costs for current pending changes
    for (const slot of statEngine.slots) {
      if (!slot.statName || slot.currentSteps === slot.futureSteps) continue;

      const matType = slot.getMatType();
      const cost = slot.getCost();
      
      if (matType && stepCosts.hasOwnProperty(matType)) {
        stepCosts[matType] += cost;
      }
    }

    // Round step costs and find max
    for (const materialType of Object.keys(stepCosts)) {
      stepCosts[materialType] = toramRound(stepCosts[materialType]);
      if (stepCosts[materialType] > maxCostPerStep) {
        maxCostPerStep = stepCosts[materialType];
      }
    }

    // Total costs (accumulated + step costs)
    const totalCosts = {};
    for (const materialType of Object.keys(MATERIAL_TYPES)) {
      totalCosts[materialType] = (statEngine.mats[materialType] || 0) + stepCosts[materialType];
    }

    // Create cost summary array
    const costSummary = Object.keys(MATERIAL_TYPES).map(materialType => ({
      type: materialType,
      displayName: formatMaterialName(materialType),
      stepCost: stepCosts[materialType],
      totalCost: totalCosts[materialType],
      hasStepCost: stepCosts[materialType] > 0,
      hasTotalCost: totalCosts[materialType] > 0
    }));

    return {
      stepCosts,
      totalCosts,
      maxCostPerStep,
      costSummary,
      overallMaxCost: statEngine.maxMats
    };
  }, [statEngine]);

  return materialCosts;
}

// Hook for individual slot cost calculation
export function useSlotCost(slot, statEngine) {
  return useMemo(() => {
    if (!slot || !slot.statName || !statEngine) {
      return {
        cost: 0,
        materialType: '',
        displayText: '',
        hasChange: false
      };
    }

    const hasChange = slot.currentSteps !== slot.futureSteps;
    if (!hasChange) {
      return {
        cost: 0,
        materialType: slot.getMatType(),
        displayText: '',
        hasChange: false
      };
    }

    const cost = slot.getCost();
    const materialType = slot.getMatType();
    const roundedCost = toramRound(cost);
    
    return {
      cost: roundedCost,
      materialType,
      displayText: `(${roundedCost} ${materialType})`,
      hasChange: true
    };
  }, [slot, statEngine]);
}

// Hook for cost reduction calculation
export function useCostReduction(proficiency, matReduction) {
  return useMemo(() => {
    let percent = 100 - (Math.floor(proficiency / 10) + Math.floor(proficiency / 50));
    if (matReduction) percent *= 0.9;
    
    const reduction = 0.01 * percent;
    const savingsPercent = Math.round((1 - reduction) * 100);
    
    return {
      multiplier: reduction,
      savingsPercent,
      isReduced: reduction < 1
    };
  }, [proficiency, matReduction]);
}

// Hook for material cost validation and warnings
export function useMaterialWarnings(materialCosts, budgetLimits = {}) {
  return useMemo(() => {
    const warnings = [];
    const { stepCosts, totalCosts, maxCostPerStep } = materialCosts;

    // Check for high step costs
    if (maxCostPerStep > 1000) {
      warnings.push({
        type: 'high_step_cost',
        message: `High material cost per step: ${maxCostPerStep}`,
        severity: 'warning'
      });
    }

    // Check for very high step costs
    if (maxCostPerStep > 5000) {
      warnings.push({
        type: 'very_high_step_cost',
        message: `Very high material cost per step: ${maxCostPerStep}`,
        severity: 'error'
      });
    }

    // Check against budget limits
    Object.keys(budgetLimits).forEach(materialType => {
      const limit = budgetLimits[materialType];
      const totalCost = totalCosts[materialType] || 0;
      
      if (totalCost > limit) {
        warnings.push({
          type: 'budget_exceeded',
          message: `${formatMaterialName(materialType)} budget exceeded: ${totalCost}/${limit}`,
          severity: 'error',
          materialType
        });
      } else if (totalCost > limit * 0.8) {
        warnings.push({
          type: 'budget_warning',
          message: `${formatMaterialName(materialType)} approaching budget limit: ${totalCost}/${limit}`,
          severity: 'warning',
          materialType
        });
      }
    });

    return warnings;
  }, [materialCosts, budgetLimits]);
}

// Hook for material efficiency analysis
export function useMaterialEfficiency(statEngine) {
  return useMemo(() => {
    if (!statEngine || !statEngine.steps.formula.length) {
      return {
        efficiency: 0,
        materialPerPot: {},
        suggestions: []
      };
    }

    const totalPotUsed = statEngine.startingPot - statEngine.pot;
    const suggestions = [];
    
    // Calculate material per pot efficiency
    const materialPerPot = {};
    Object.keys(MATERIAL_TYPES).forEach(materialType => {
      const totalMaterial = statEngine.mats[materialType] || 0;
      materialPerPot[materialType] = totalPotUsed > 0 ? totalMaterial / totalPotUsed : 0;
    });

    // Calculate overall efficiency score
    const totalMaterials = Object.values(statEngine.mats).reduce((sum, amount) => sum + amount, 0);
    const efficiency = totalPotUsed > 0 ? Math.max(0, 100 - (totalMaterials / totalPotUsed)) : 100;

    // Generate suggestions based on efficiency
    if (efficiency < 50) {
      suggestions.push({
        type: 'low_efficiency',
        message: 'Consider using stats with lower material costs or higher proficiency',
        priority: 'high'
      });
    }

    if (statEngine.proficiency < 100) {
      suggestions.push({
        type: 'proficiency',
        message: 'Increasing proficiency will reduce material costs',
        priority: 'medium'
      });
    }

    if (!statEngine.matReduction) {
      suggestions.push({
        type: 'mat_reduction',
        message: 'Consider using 10% material reduction passive if available',
        priority: 'low'
      });
    }

    return {
      efficiency: Math.round(efficiency),
      materialPerPot,
      totalMaterialsUsed: totalMaterials,
      totalPotUsed,
      suggestions
    };
  }, [statEngine]);
}