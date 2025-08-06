/**
 * Slot Management component
 * Handles individual stat slots and their configuration
 */

import React from 'react';
import styled from 'styled-components';
import { useSimulator } from '../../context/SimulatorContext';
import useSimulatorLogic from '../../hooks/useSimulator';
import { SlotsSection, SlotRow, SlotNumber, Select, Input } from '../GlobalStyles';
import { OPTIONS } from '../../utils/statOptions';
import { isValidStatInput } from '../../utils/helpers';

const SlotsTitle = styled.h3`
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.secondary};
`;

const StatSelect = styled(Select)`
  flex: 2;
  min-width: 200px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    min-width: auto;
  }
`;

const StatInput = styled(Input)`
  flex: 1;
  max-width: 80px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    max-width: none;
  }
`;

const MatCost = styled.span`
  color: ${props => props.theme.colors.success};
  font-size: 0.8em;
  font-weight: bold;
  min-width: 120px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    min-width: auto;
    text-align: center;
  }
`;

function SlotItem({ slot, index }) {
  const { state } = useSimulator();
  const { updateSlot, calculateCost, getMaxStat, stepsToStat } = useSimulatorLogic();
  
  const buildStatOptions = () => {
    let options = [<option key="0" value="0">PILIH STAT</option>];
    let lastCat = "";
    let catId = 0;

    for (let data of OPTIONS) {
      // Skip Awaken Elements for armor
      if (state.settings.itemType === "a" && data.cat === "Awaken Elements") continue;

      if (lastCat !== data.cat) {
        options.push(
          <option key={`cat-${catId}`} value="-1" disabled style={{ color: 'blue' }}>
            &gt;-- {data.cat} --&lt;
          </option>
        );
        lastCat = data.cat;
      }

      catId++;
      options.push(
        <option key={catId} value={catId}>
          {data.name}
        </option>
      );
    }

    return options;
  };

  const handleStatChange = (statDataId) => {
    updateSlot(slot.id, { statDataId: parseInt(statDataId) });
  };

  const handleValueChange = (value) => {
    if (!isValidStatInput(value)) return;
    
    updateSlot(slot.id, { futureStat: parseInt(value) || 0 });
  };

  const handleKeyPress = (event) => {
    const charCode = event.which || event.keyCode;
    const exceptions = [8, 9, 37, 39, 189]; // backspace, tab, arrows, minus

    // Handle special keys
    if (charCode === 38 || charCode === 81) { // up arrow or Q
      event.preventDefault();
      changeValueBySteps(1);
    } else if (charCode === 40 || charCode === 87) { // down arrow or W
      event.preventDefault();
      changeValueBySteps(-1);
    } else if (charCode === 13) { // enter
      // Confirm step - handled by parent component
    } else if (charCode === 65) { // A - set to max
      event.preventDefault();
      if (slot.statData) {
        const maxStat = getMaxStat(slot.statData, false);
        updateSlot(slot.id, { futureStat: maxStat });
      }
    } else if (charCode === 68) { // D - set to min
      event.preventDefault();
      if (slot.statData) {
        const maxStat = getMaxStat(slot.statData, true);
        updateSlot(slot.id, { futureStat: -maxStat });
      }
    } else if ((charCode > 57 || charCode < 48) && !exceptions.includes(charCode)) {
      event.preventDefault();
    }
  };

  const changeValueBySteps = (steps) => {
    if (!slot.statData) return;
    
    const newSteps = slot.futureSteps + steps;
    const newStat = stepsToStat(newSteps, slot.statData);
    updateSlot(slot.id, { futureStat: newStat });
  };

  const getCostDisplay = () => {
    if (!slot.statData || slot.currentSteps === slot.futureSteps) return "";
    
    const cost = calculateCost(slot.currentSteps, slot.futureSteps, slot.statData);
    return `(${Math.round(cost)} ${slot.statData.mat})`;
  };

  const getInputColor = () => {
    if (!slot.statName) return '#3498db';
    
    const maxStat = getMaxStat(slot.statData, slot.futureStat < 0);
    
    if (Math.abs(slot.futureStat) > maxStat || 
        (slot.futureSteps < 0 && slot.statData?.nonega)) {
      return '#e74c3c'; // red for invalid
    } else if (slot.futureSteps >= 0) {
      return '#2c3e50'; // black for positive
    } else {
      return '#7f8c8d'; // gray for negative
    }
  };

  return (
    <SlotRow>
      <SlotNumber>{index + 1}</SlotNumber>
      <StatSelect
        value={slot.statData ? OPTIONS.findIndex(opt => opt.name === slot.statName) + 1 : 0}
        onChange={(e) => handleStatChange(e.target.value)}
        disabled={state.simulation.finished}
      >
        {buildStatOptions()}
      </StatSelect>
      <StatInput
        type="text"
        maxLength="4"
        value={slot.futureStat}
        onChange={(e) => handleValueChange(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={!slot.statName || state.simulation.finished}
        style={{ color: getInputColor() }}
      />
      <MatCost>{getCostDisplay()}</MatCost>
    </SlotRow>
  );
}

function SlotManagement() {
  const { state } = useSimulator();
  
  if (!state.simulation.isActive) {
    return null;
  }

  return (
    <SlotsSection>
      <SlotsTitle>📋 Slot Stats</SlotsTitle>
      {state.simulation.slots.map((slot, index) => (
        <SlotItem key={slot.id} slot={slot} index={index} />
      ))}
    </SlotsSection>
  );
}

export default SlotManagement;