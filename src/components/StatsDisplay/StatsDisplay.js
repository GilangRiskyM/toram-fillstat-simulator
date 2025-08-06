/**
 * Stats Display component
 * Shows current potential, success rate, and formula steps
 */

import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import useSimulatorLogic from '../../hooks/useSimulator';
import { 
  ResultsSection, 
  PotentialDisplay, 
  SuccessRateDisplay, 
  FormulaDisplay,
  Button,
  ControlsRow
} from '../GlobalStyles';

// Removed unused StatsTitle component

function StatsDisplay() {
  const { state } = useSimulator();
  const { 
    getSuccessRate, 
    updatePotential, 
    confirmStep, 
    undoStep, 
    redoStep, 
    repeatStep 
  } = useSimulatorLogic();

  if (!state.simulation.isActive) {
    return null;
  }

  const successRate = getSuccessRate();
  const futurePot = updatePotential();

  const getFormulaDisplay = () => {
    if (!state.formula.condensedSteps.length) {
      return '<em style="color: #7f8c8d;">Belum ada langkah yang dilakukan.</em>';
    }

    const display = state.formula.condensedSteps.map((step, index) => {
      const stepNum = `<strong style="color: #2c3e50;">#${index + 1}.</strong>`;
      const stepText = `<span style="color: #34495e;">${step.text}</span>`;
      const repeatText = step.repeat > 1 
        ? ` <span style="color: #9b59b6;">(x${step.repeat})</span>` 
        : "";
      const potText = `<span style="color: #7f8c8d; font-size: 12px;">(${step.pot_after} pot)</span>`;

      return `${stepNum} ${stepText}${repeatText} ${potText}`;
    });

    return display.join('<br>');
  };

  const getFullFormulaContent = () => {
    let content = `<strong>📊 Langkah-langkah:</strong><br><br>`;
    content += `${state.settings.itemType === 'w' ? '⚔️ Weapon' : '🛡️ Armor'} - Starting Potential: ${state.settings.startingPot}<br><br>`;
    content += getFormulaDisplay();

    if (typeof state.simulation.finished === 'number') {
      content += `<br><br><strong>🎯 Final Result:</strong><br>`;
      content += `Success Rate: <span style="color: #27ae60; font-weight: bold;">${successRate}%</span>`;

      if (state.settings.tec !== 255) {
        content += ` <span style="color: #e74c3c; font-size: 12px">(${state.settings.tec} TEC)</span>`;
      }

      const matsUsed = Object.keys(state.materials)
        .filter(mat => state.materials[mat] > 0)
        .map(mat => `${state.materials[mat]} ${mat}`)
        .join(' / ');

      if (matsUsed) {
        content += `<br><span style="color: #3498db; font-size: 12px">📦 Materials Used: ${matsUsed} (Max: ${state.maxMaterials})</span>`;
      }

      let settings = [];
      if (state.settings.proficiency) settings.push(`${state.settings.proficiency} proficiency`);
      if (state.settings.matReduction) settings.push('10% mat reduction');
      if (settings.length) {
        content += `<br><span style="color: #27ae60; font-size: 12px">⚙️ Bonuses: ${settings.join(' + ')}</span>`;
      }
    }

    return content;
  };

  const canConfirm = state.simulation.currentPot !== futurePot;
  const canUndo = state.formula.steps.length > 0;
  const canRedo = state.formula.redoQueue.length > 0;
  const canRepeat = state.formula.steps.length > 0 && !state.simulation.finished;

  return (
    <ResultsSection>
      <PotentialDisplay>
        Potential: {futurePot} / {state.simulation.currentPot}
      </PotentialDisplay>
      
      <SuccessRateDisplay rate={successRate}>
        Success Rate: {successRate}%
      </SuccessRateDisplay>

      <ControlsRow>
        <Button
          variant="primary"
          onClick={confirmStep}
          disabled={!canConfirm}
        >
          ✅ Confirm
        </Button>
        <Button
          variant="secondary"
          onClick={repeatStep}
          disabled={!canRepeat}
        >
          🔄 Repeat
        </Button>
        <Button
          variant="secondary"
          onClick={undoStep}
          disabled={!canUndo}
        >
          ↶ Undo
        </Button>
        <Button
          variant="secondary"
          onClick={redoStep}
          disabled={!canRedo}
        >
          ↷ Redo
        </Button>
      </ControlsRow>

      <FormulaDisplay 
        dangerouslySetInnerHTML={{ __html: getFullFormulaContent() }}
      />
    </ResultsSection>
  );
}

export default StatsDisplay;