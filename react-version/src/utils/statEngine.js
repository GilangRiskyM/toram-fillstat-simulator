import { Calc, toramRound, deepClone } from './mathUtils.js';
import { STATS_OPTIONS, MAX_STEPS, BONUS_STEPS, PENALTY_DATA } from '../data/statsData.js';

// Core stat engine ported from t4stat.js

export class StatSlot {
  constructor(slotNum, statInstance) {
    this.currentStat = 0;
    this.futureStat = 0;
    this.currentSteps = 0;
    this.futureSteps = 0;
    this.slotNum = slotNum;
    this.statName = null;
    this.statData = null;
    this.statDataId = 0;
    this.statInstance = statInstance;
    this.newStat = true;
    this.disabled = false;
  }

  // Convert stat value to steps
  statToSteps(value = this.futureStat) {
    if (!this.statData) return 0;
    
    const inputIsNegative = value < 0 ? -1 : 1;
    const stepMax = 100 / this.statData.pot;
    const changePerStep = this.statData.step || 1;
    const maxNormalStep = stepMax > MAX_STEPS ? MAX_STEPS : stepMax;
    const maxNormalValue = this.statData.max
      ? this.statData.max
      : stepMax > MAX_STEPS
      ? MAX_STEPS * changePerStep
      : stepMax * changePerStep;
    
    let futureSteps;

    if (Math.abs(value) > maxNormalValue) {
      const overstep = this.statData.bonus || changePerStep;
      futureSteps =
        (maxNormalStep + (Math.abs(value) - maxNormalValue) / overstep) *
        inputIsNegative;
    } else {
      futureSteps = value / changePerStep;
    }
    return toramRound(futureSteps);
  }

  // Convert steps to stat value
  stepsToStat(value = this.futureSteps) {
    if (!this.statData) return 0;
    
    let isNegative = value < 0;
    value = Math.abs(value);
    const stepMax = 100 / this.statData.pot;
    const changePerStep = this.statData.step || 1;
    const maxNormalValue = this.statData.max
      ? this.statData.max / changePerStep
      : stepMax > MAX_STEPS
      ? MAX_STEPS
      : stepMax;

    if (value < maxNormalValue) {
      value = value * (this.statData.step || 1);
    } else {
      const bonus = this.statData.bonus || this.statData.step || 1;
      value =
        maxNormalValue * (this.statData.step || 1) +
        (value - maxNormalValue) * bonus;
    }

    if (isNegative) value *= -1;
    return value;
  }

  // Calculate bonus steps for this stat
  calcBonusSteps() {
    if (!this.statData) return 0;
    
    const bonusSteps = Math.floor(
      BONUS_STEPS * (this.statData.bonusratio || 1)
    );
    const reduction = this.statData.bonusdeduction || 0;
    return bonusSteps - reduction;
  }

  // Get maximum stat value
  getMaxStat(isNega = false) {
    if (!this.statData) return 0;
    
    const stepMax = 100 / this.statData.pot;
    const bonusSteps = this.calcBonusSteps();
    const customMax = (this.statData.max || 0) * (this.statData.step || 1);
    const baseMax = stepMax > MAX_STEPS ? MAX_STEPS : stepMax;
    const maxBaseStat = (this.statData.step || 1) * baseMax;
    const bonusMax = (this.statData.bonus || 0) * bonusSteps;

    if (this.statData.bonus) {
      let value = (customMax || maxBaseStat) + bonusMax;
      if (isNega && this.statData.max_only) return customMax || maxBaseStat;
      return value;
    } else if (customMax) {
      return customMax;
    } else {
      return baseMax * (this.statData.step || 1);
    }
  }

  // Get maximum steps
  getMaxSteps(isNega = false) {
    const stat = this.getMaxStat(isNega);
    return this.statToSteps(stat);
  }

  // Calculate material cost for current changes
  getCost() {
    if (!this.statData) return 0;
    
    const baseCost = parseFloat(this.statData.cost);
    const change = this.currentSteps < this.futureSteps ? 1 : -1;

    let cost = 0;
    for (
      let i = this.currentSteps + change;
      change > 0 ? i <= this.futureSteps : i >= this.futureSteps;
      i += change
    ) {
      cost += baseCost * Math.pow(i, 2);
    }

    return cost * this.statInstance.getCostReduction();
  }

  // Get material type for this stat
  getMatType() {
    return this.statData?.mat || '';
  }

  // Get potential change for this slot
  getPotentialChange() {
    if (!this.statData || this.currentSteps === this.futureSteps) return 0;
    
    const change = this.currentSteps > this.futureSteps ? -1 : 1;
    const stepMax = 100 / this.statData.pot;
    const maxNormalSteps =
      this.statData.max || (stepMax > MAX_STEPS ? MAX_STEPS : stepMax);

    const all = [this.currentSteps, this.futureSteps].sort((a, b) => a - b);
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

    const double = ![this.statInstance.type, "u", "e"].includes(this.statData.type) ? 2 : 1;
    const basicpot = Calc(diff).multiply(this.statData.pot);
    const bonuspot = Calc(bonusDiff).multiply(this.statData.pot).multiply(2);

    // Negatives have an extra multiplier
    if (change === -1) {
      basicpot.multiply(this.statInstance.potentialReturn).multiply(0.01);
      bonuspot.multiply(this.statInstance.bonusPotentialReturn).multiply(0.01);
    }

    // Add the 2 different types of potential return together
    const totalpot = basicpot
      .add(bonuspot)
      .multiply(double)
      .multiply(-change)
      .result();

    return toramRound(totalpot);
  }

  // Update slot with new stat and value
  updateSlot(statDataId, futureStatValue) {
    if (statDataId === 0) {
      // Reset slot
      this.statName = null;
      this.statData = null;
      this.currentStat = 0;
      this.futureStat = 0;
      this.currentSteps = 0;
      this.futureSteps = 0;
      this.statDataId = 0;
      this.newStat = true;
      return;
    }

    // Set up stat data
    this.statData = deepClone(STATS_OPTIONS[statDataId - 1]);
    this.statName = this.statData.name;
    this.statDataId = statDataId;

    if (this.newStat) this.newStat = statDataId;

    // Update future stat value and calculate steps
    this.futureStat = futureStatValue;
    this.futureSteps = this.statToSteps();
  }

  // Confirm changes (move future to current)
  confirm() {
    this.currentStat = this.futureStat;
    this.currentSteps = this.futureSteps;
    this.newStat = false;
  }

  // Check if stat value is valid
  isValidValue() {
    if (!this.statData) return true;
    
    const allowedMax = this.getMaxStat(this.futureStat < 0);
    return !(
      Math.abs(this.futureStat) > allowedMax ||
      (this.futureSteps < 0 && this.statData.nonega)
    );
  }

  // Raw override for undo/redo operations
  rawOverride(data) {
    const [slotNum, deltaSteps, id] = data;

    if (id !== null) {
      if (id === 0) {
        this.statName = null;
        this.statData = null;
        this.currentStat = 0;
        this.futureStat = 0;
        this.currentSteps = 0;
        this.futureSteps = 0;
        this.statDataId = 0;
        this.newStat = true;
        return;
      } else {
        this.statDataId = id;
        this.statData = deepClone(STATS_OPTIONS[id - 1]);
        this.statName = this.statData.name;
        this.newStat = false;
      }
    }

    this.futureSteps += deltaSteps;
    this.currentSteps = this.futureSteps;
    this.futureStat = this.stepsToStat(this.futureSteps);
    this.currentStat = this.futureStat;
  }
}

export class StatFormula {
  constructor(statInstance) {
    this.statInstance = statInstance;
    this.formula = [];
    this.condensedFormula = [];
    this.stepChanges = [];
    this.stepCodeChanges = [];
    this.redoQueue = [];
  }

  // Gather changes for this step
  gatherChanges(slot, stat, deltaStep, deltaStat, newStat) {
    let positive = deltaStep > 0 ? "+" : "";
    this.stepChanges.push(`${stat} ${positive}${deltaStat}`);
    this.stepCodeChanges.push([slot, deltaStep, newStat || null]);
  }

  // Commit changes to formula
  commitChanges() {
    if (!this.stepCodeChanges.length) return;

    const finished =
      this.statInstance.slots.every((slot) => slot.statName) ||
      this.statInstance.futurePot <= 0
        ? this.statInstance.getSuccessRate()
        : false;

    this.formula.push({
      repeat: 1,
      code: this.stepCodeChanges,
      text: this.stepChanges.join(" "),
      potBefore: this.statInstance.pot,
      potAfter: this.statInstance.futurePot,
      stepMats: { ...this.statInstance.stepMats },
      maxMatsBefore: this.statInstance.maxMats,
      maxMatsAfter: this.statInstance.stepMaxMats || this.statInstance.maxMats,
      finished,
    });

    this.redoQueue = [];
    this.stepChanges = [];
    this.stepCodeChanges = [];
    this.buildCondensedFormula();
  }

  // Build condensed formula for display
  buildCondensedFormula() {
    this.condensedFormula = [];
    let lastChange = {};

    for (let step of this.formula) {
      if (lastChange.text && lastChange.text === step.text) {
        let targetStep = this.condensedFormula[this.condensedFormula.length - 1];
        targetStep.repeat++;
        targetStep.potAfter = step.potAfter;
      } else {
        this.condensedFormula.push(deepClone(step));
        lastChange = step;
      }
    }
  }

  // Get display string for formula
  getDisplay() {
    if (!this.condensedFormula.length) {
      return '<em style="color: #7f8c8d;">Belum ada langkah yang dilakukan.</em>';
    }

    const display = this.condensedFormula.map((step, index) => {
      const stepNum = `<strong style="color: #2c3e50;">#${index + 1}.</strong>`;
      const stepText = `<span style="color: #34495e;">${step.text}</span>`;
      const repeatText =
        step.repeat > 1
          ? ` <span style="color: #9b59b6;">(x${step.repeat})</span>`
          : "";
      const potText = `<span style="color: #7f8c8d; font-size: 12px;">(${step.potAfter} pot)</span>`;

      return `${stepNum} ${stepText}${repeatText} ${potText}`;
    });

    return display.join("<br>");
  }

  // Undo last step
  undo() {
    let step = this.formula.pop();
    this.redoQueue.push(deepClone(step));
    return step;
  }

  // Redo step
  redo() {
    let step = this.redoQueue.pop();
    this.formula.push(deepClone(step));
    return step;
  }
}

export class StatEngine {
  constructor(details) {
    this.slots = Array(8).fill(null).map((_, i) => new StatSlot(i, this));
    this.details = deepClone(details);
    
    this.type = details.weapArm;
    this.recipePot = parseInt(details.recipePot);
    this.pot = parseInt(details.startingPot);
    this.futurePot = this.pot;
    this.startingPot = parseInt(details.startingPot);
    this.steps = new StatFormula(this);
    
    this.mats = { Metal: 0, Cloth: 0, Beast: 0, Wood: 0, Medicine: 0, Mana: 0 };
    this.stepMats = { Metal: 0, Cloth: 0, Beast: 0, Wood: 0, Medicine: 0, Mana: 0 };
    
    this.maxMats = 0;
    this.stepMaxMats = 0;
    
    this.tec = parseInt(details.tec) || 0;
    this.potentialReturn = 5 + this.tec / 10;
    this.bonusPotentialReturn = this.potentialReturn / 4;
    
    this.proficiency = parseInt(details.proficiency) || 0;
    this.matReduction = details.matReduction || false;
    
    this.finished = false;
  }

  // Calculate penalty based on stat categories
  calculatePenalty() {
    const categories = {};
    for (let slot of this.slots) {
      if (!slot.statName || (slot.newStat && !slot.futureSteps)) continue;
      if (!categories[slot.statData.cat]) categories[slot.statData.cat] = 0;
      categories[slot.statData.cat]++;
    }
    
    let penaltyValues = Object.keys(categories)
      .map((c) => categories[c])
      .map((repeats) => PENALTY_DATA[repeats]);
    
    if (!penaltyValues.length) return 1;
    
    let penalty = penaltyValues.reduce((a, b) => a + b);
    return 1 + 0.01 * penalty;
  }

  // Get cost reduction from proficiency and passive
  getCostReduction() {
    let percent =
      100 -
      (Math.floor(this.proficiency / 10) + Math.floor(this.proficiency / 50));
    if (this.matReduction) percent *= 0.9;
    return 0.01 * percent;
  }

  // Calculate success rate
  getSuccessRate() {
    if (typeof this.finished === "number") return this.finished;
    
    let prevPot = this.pot > this.recipePot ? this.pot : this.recipePot;
    let successRate = 160 + (this.futurePot * 230) / prevPot;
    
    if (successRate > 100) successRate = 100;
    if (successRate < 0) successRate = 0;
    
    return toramRound(successRate);
  }

  // Update future potential based on slot changes
  updatePotential() {
    let deltaPot = 0;
    for (let slot of this.slots) {
      if (!slot.statName) continue;
      deltaPot += slot.getPotentialChange();
    }

    let penalty = this.calculatePenalty();
    this.futurePot = this.pot + toramRound(penalty * deltaPot);
  }

  // Confirm all slot changes
  confirm() {
    this.removeEmptySlots();
    
    // Reset step materials
    this.stepMats = { Metal: 0, Cloth: 0, Beast: 0, Wood: 0, Medicine: 0, Mana: 0 };
    
    for (const slot of this.slots) {
      if (!slot.statName || slot.currentSteps === slot.futureSteps) continue;

      const usedMat = slot.getMatType();
      const usedMatAmount = slot.getCost();
      this.stepMats[usedMat] += usedMatAmount;

      // Log changes in formula
      this.steps.gatherChanges(
        slot.slotNum,
        slot.statName,
        slot.futureSteps - slot.currentSteps,
        slot.futureStat - slot.currentStat,
        slot.newStat
      );
      
      slot.confirm();
    }

    // Update material totals
    for (const mat in this.stepMats) {
      this.stepMats[mat] = toramRound(this.stepMats[mat]);
      this.mats[mat] += this.stepMats[mat];
    }

    // Update max materials
    this.stepMaxMats = Object.values(this.stepMats).sort((a, b) => b - a)[0];
    if (this.stepMaxMats <= this.maxMats) this.stepMaxMats = 0;

    this.steps.commitChanges();

    if (this.stepMaxMats) {
      this.maxMats = this.stepMaxMats;
      this.stepMaxMats = 0;
    }

    // Check if finished
    if (this.slots.every((slot) => slot.statName) || this.futurePot <= 0) {
      this.finished = this.getSuccessRate();
    } else {
      this.pot = this.futurePot;
    }
  }

  // Remove empty slots
  removeEmptySlots() {
    for (const slot of this.slots) {
      if (slot.newStat && !slot.futureSteps) {
        slot.rawOverride([slot.slotNum, 0, 0]);
      }
    }
  }

  // Reset to base state
  resetToBase() {
    for (const slot of this.slots) {
      if (slot.newStat) {
        slot.rawOverride([slot.slotNum, 0, 0]);
      } else {
        slot.futureSteps = slot.currentSteps;
        slot.futureStat = slot.currentStat;
      }
    }
  }

  // Undo last step
  undo() {
    if (!this.steps.formula.length) return;

    this.resetToBase();
    let lastStep = this.steps.undo();
    
    if (this.finished) {
      this.finished = false;
    }

    // Deal with potential
    this.futurePot = lastStep.potBefore;
    this.pot = lastStep.potBefore;

    // Deal with material costs
    for (let mat in lastStep.stepMats) {
      this.mats[mat] -= lastStep.stepMats[mat];
    }
    this.maxMats = lastStep.maxMatsBefore;

    // Deal with stats
    const stepData = lastStep.code;
    for (const instruction of stepData) {
      let slotNum = instruction[0];
      if (instruction[2]) instruction[2] = 0;
      instruction[1] *= -1;
      this.slots[slotNum].rawOverride(instruction);
    }

    this.steps.buildCondensedFormula();
  }

  // Redo step
  redo() {
    let lastStep = this.steps.redo();
    this.resetToBase();

    // Deal with potential
    this.futurePot = lastStep.potAfter;
    this.pot = lastStep.potAfter;

    // Deal with material costs
    for (let mat in lastStep.stepMats) {
      this.mats[mat] += lastStep.stepMats[mat];
    }
    this.maxMats = lastStep.maxMatsAfter;

    // Deal with stats
    const stepData = lastStep.code;
    for (const instruction of stepData) {
      let slotNum = instruction[0];
      this.slots[slotNum].rawOverride(instruction);
    }

    if (lastStep.finished) {
      this.finished = lastStep.finished;
    }

    this.steps.buildCondensedFormula();
  }

  // Repeat last step
  repeat() {
    if (this.finished) return;
    
    const lastStep = this.steps.formula[this.steps.formula.length - 1];
    if (!lastStep) return;

    for (const code of lastStep.code) {
      const [slotNum, delta] = code;
      const slot = this.slots[slotNum];
      slot.futureSteps += delta;
      slot.futureStat = slot.stepsToStat(slot.futureSteps);
    }

    this.confirm();
  }

  // Get snapshot for saving
  getSnapshot() {
    return {
      formula: deepClone(this.steps.formula),
      settings: {
        tec: this.tec,
        proficiency: this.proficiency,
        matReduction: this.matReduction,
        type: this.type,
        recipePot: this.recipePot,
        futurePot: this.futurePot,
        startingPot: this.startingPot,
        potentialReturn: this.potentialReturn,
        bonusPotentialReturn: this.bonusPotentialReturn,
        finished: this.finished,
        maxMats: this.maxMats,
        mats: { ...this.mats },
      },
    };
  }

  // Auto load from snapshot
  autoLoad(data) {
    const formula = data.formula;
    this.steps.formula = formula;
    this.steps.buildCondensedFormula();

    Object.assign(this, data.settings);

    for (let step of formula) {
      this.runStepInstruction(step);
    }
  }

  // Run step instruction for loading
  runStepInstruction(instruction) {
    this.futurePot = instruction.potAfter;
    this.pot = this.finished ? instruction.potBefore : instruction.potAfter;

    for (let mat in instruction.stepMats) {
      this.mats[mat] += instruction.stepMats[mat];
    }

    const stepData = instruction.code;
    for (const instr of stepData) {
      let slotNum = instr[0];
      this.slots[slotNum].rawOverride(instr);
    }

    if (instruction.finished) {
      this.finished = instruction.finished;
    }

    this.steps.buildCondensedFormula();
  }
}