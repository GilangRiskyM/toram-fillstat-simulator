/**
 * Settings Panel component
 * Handles initial configuration before starting simulation
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { useSimulator } from '../../context/SimulatorContext';
import { Card, Button, Input, Select, FormGroup, Label } from '../GlobalStyles';
import { ITEM_TYPES } from '../../utils/constants';
import { parsePotential, parseTEC, parseProficiency } from '../../utils/helpers';

const SettingsCard = styled(Card)`
  background: #ecf0f1;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SettingsTitle = styled.h3`
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.secondary};
`;

const SettingsRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  align-items: end;
  flex-wrap: wrap;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
    gap: ${props => props.theme.spacing.md};
  }
`;

const CheckboxGroup = styled(FormGroup)`
  flex-direction: row;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  min-width: auto;
`;

const CheckboxInput = styled.input`
  margin: 0;
  width: auto;
`;

const StartButton = styled(Button)`
  background: ${props => props.theme.gradients.button};
  font-size: 1.1em;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.md};
  }
`;

function SettingsPanel() {
  const { state, actions } = useSimulator();
  const { settings } = state;
  const [errors, setErrors] = useState({});

  const handleSettingChange = (key, value) => {
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }

    let processedValue = value;
    
    // Process specific values based on type
    switch (key) {
      case 'startingPot':
      case 'recipePot':
        processedValue = parsePotential(value);
        break;
      case 'tec':
        processedValue = parseTEC(value);
        break;
      case 'proficiency':
        processedValue = parseProficiency(value);
        break;
      default:
        break;
    }

    actions.updateSettings({
      [key]: processedValue
    });
  };

  const validateSettings = () => {
    const newErrors = {};

    if (!settings.startingPot || settings.startingPot < 1) {
      newErrors.startingPot = 'POT awal harus diisi dan minimal 1';
    }

    if (!settings.recipePot || settings.recipePot < 1) {
      newErrors.recipePot = 'POT resep harus diisi dan minimal 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartSimulation = () => {
    if (validateSettings()) {
      const success = actions.startSimulation();
      if (!success) {
        // Error notification already handled in context
      }
    }
  };

  return (
    <SettingsCard>
      <SettingsTitle>⚙️ Pengaturan Dasar</SettingsTitle>
      
      <SettingsRow>
        <FormGroup>
          <Label htmlFor="itemType">Tipe Item:</Label>
          <Select
            id="itemType"
            value={settings.itemType}
            onChange={(e) => handleSettingChange('itemType', e.target.value)}
          >
            <option value={ITEM_TYPES.WEAPON}>Weapon (Senjata)</option>
            <option value={ITEM_TYPES.ARMOR}>Armor (Zirah)</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="startingPot">POT Awal:</Label>
          <Input
            type="number"
            id="startingPot"
            placeholder="Contoh: 99"
            min="1"
            max="999"
            value={settings.startingPot}
            onChange={(e) => handleSettingChange('startingPot', e.target.value)}
            style={{ 
              borderColor: errors.startingPot ? '#e74c3c' : undefined 
            }}
          />
          {errors.startingPot && (
            <span style={{ color: '#e74c3c', fontSize: '0.8em' }}>
              {errors.startingPot}
            </span>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="recipePot">POT Resep:</Label>
          <Input
            type="number"
            id="recipePot"
            min="1"
            max="999"
            value={settings.recipePot}
            onChange={(e) => handleSettingChange('recipePot', e.target.value)}
            style={{ 
              borderColor: errors.recipePot ? '#e74c3c' : undefined 
            }}
          />
          {errors.recipePot && (
            <span style={{ color: '#e74c3c', fontSize: '0.8em' }}>
              {errors.recipePot}
            </span>
          )}
        </FormGroup>
      </SettingsRow>

      <SettingsRow>
        <FormGroup>
          <Label htmlFor="tec">TEC:</Label>
          <Input
            type="number"
            id="tec"
            min="0"
            max="255"
            value={settings.tec}
            onChange={(e) => handleSettingChange('tec', e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="proficiency">Proficiency:</Label>
          <Input
            type="number"
            id="proficiency"
            min="0"
            max="999"
            value={settings.proficiency}
            onChange={(e) => handleSettingChange('proficiency', e.target.value)}
          />
        </FormGroup>

        <CheckboxGroup>
          <CheckboxInput
            type="checkbox"
            id="matReduction"
            checked={settings.matReduction}
            onChange={(e) => handleSettingChange('matReduction', e.target.checked)}
          />
          <Label htmlFor="matReduction">10% Mat Reduction</Label>
        </CheckboxGroup>

        <FormGroup>
          <StartButton
            onClick={handleStartSimulation}
            disabled={state.simulation.isActive}
          >
            🚀 Mulai Simulasi
          </StartButton>
        </FormGroup>
      </SettingsRow>
    </SettingsCard>
  );
}

export default SettingsPanel;