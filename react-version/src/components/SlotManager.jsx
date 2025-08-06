import React from 'react';
import { STATS_OPTIONS } from '../data/statsData.js';
import { useSlotCost } from '../hooks/useMaterialCalculator.js';

const StatSlot = ({ slot, slotIndex, engine, onSlotUpdate }) => {
  const { displayText: costDisplay, hasChange } = useSlotCost(slot, engine);

  const buildStatOptions = () => {
    let options = [<option key="0" value="0">PILIH STAT</option>];
    let lastCat = "";
    let catId = 0;

    for (let data of STATS_OPTIONS) {
      // Skip Awaken Elements for armor
      if (engine.type === "a" && data.cat === "Awaken Elements") continue;

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

  const getInputColor = () => {
    if (!slot.statName) return { color: 'blue' };
    
    const isValid = slot.isValidValue();
    if (!isValid) return { color: 'red' };
    if (slot.futureSteps >= 0) return { color: 'black' };
    return { color: 'gray' };
  };

  const handleStatChange = (e) => {
    const statDataId = parseInt(e.target.value);
    onSlotUpdate(slotIndex, statDataId, slot.futureStat);
  };

  const handleValueChange = (e) => {
    const value = e.target.value;
    if (!/^-?\d*$/.test(value)) return; // Only allow numbers and minus
    
    onSlotUpdate(slotIndex, slot.statDataId, value);
  };

  const handleKeyDown = (e) => {
    const key = e.key;
    
    if (key === 'ArrowUp' || key === 'q' || key === 'Q') {
      e.preventDefault();
      const newValue = slot.futureStat + (slot.statData?.step || 1);
      onSlotUpdate(slotIndex, slot.statDataId, newValue);
    } else if (key === 'ArrowDown' || key === 'w' || key === 'W') {
      e.preventDefault();
      const newValue = slot.futureStat - (slot.statData?.step || 1);
      onSlotUpdate(slotIndex, slot.statDataId, newValue);
    } else if (key === 'a' || key === 'A') {
      e.preventDefault();
      const maxStat = slot.getMaxStat();
      onSlotUpdate(slotIndex, slot.statDataId, maxStat);
    } else if (key === 'd' || key === 'D') {
      e.preventDefault();
      const maxStat = slot.getMaxStat(true);
      onSlotUpdate(slotIndex, slot.statDataId, -maxStat);
    } else if (key === 'Enter') {
      // Could trigger confirm here if needed
    }
  };

  return (
    <div className="slot-row">
      <div className="slot-number">{slotIndex + 1}</div>
      
      <select
        className="stat-select"
        value={slot.statDataId}
        onChange={handleStatChange}
        disabled={engine.finished || (slot.statName && !slot.newStat)}
      >
        {buildStatOptions()}
      </select>
      
      <input
        className="stat-input"
        type="text"
        maxLength="4"
        value={slot.futureStat}
        onChange={handleValueChange}
        onKeyDown={handleKeyDown}
        disabled={!slot.statName || engine.finished}
        style={getInputColor()}
        placeholder="0"
      />
      
      <span className="mat-cost">
        {hasChange && costDisplay}
      </span>
    </div>
  );
};

const SlotManager = ({ engine, onSlotUpdate }) => {
  if (!engine) return null;

  return (
    <div className="slots-section">
      <h3>📋 Slot Stats</h3>
      <div className="slots-container">
        {engine.slots.map((slot, index) => (
          <StatSlot
            key={index}
            slot={slot}
            slotIndex={index}
            engine={engine}
            onSlotUpdate={onSlotUpdate}
          />
        ))}
      </div>
      
      {/* Keyboard shortcuts help */}
      <div className="shortcuts-help">
        <small>
          <strong>Keyboard shortcuts:</strong>{' '}
          Q/↑ +1 step • W/↓ -1 step • A max • D min • Enter confirm
        </small>
      </div>
    </div>
  );
};

export default SlotManager;