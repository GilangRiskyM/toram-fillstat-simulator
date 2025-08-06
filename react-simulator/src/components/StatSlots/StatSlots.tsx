import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
} from '@mui/material';
import { STAT_OPTIONS, MATERIAL_NAMES } from '../../utils/constants';
import { getGroupedStatOptions, calculateMaterialCost, getCostReduction } from '../../utils/calculations';

type ItemType = 'w' | 'a';

interface StatSlot {
  optionIndex: number;
  value: number;
  materialCost: number;
}

interface StatSlotsProps {
  slots: StatSlot[];
  itemType: ItemType;
  proficiency: number;
  matReduction: boolean;
  onSlotChange: (slotIndex: number, optionIndex: number, value: number) => void;
}

export const StatSlots: React.FC<StatSlotsProps> = ({ 
  slots, 
  itemType, 
  proficiency,
  matReduction,
  onSlotChange 
}) => {
  const renderSelectOptions = () => {
    const groups = getGroupedStatOptions(itemType);
    const elements: React.ReactNode[] = [];
    
    Object.entries(groups).forEach(([category, options]) => {
      elements.push(
        <MenuItem key={`category-${category}`} disabled>
          <strong>{category}</strong>
        </MenuItem>
      );
      
      options.forEach((option) => {
        const optionIndex = STAT_OPTIONS.indexOf(option) + 1; // +1 because 0 is "PILIH STAT"
        elements.push(
          <MenuItem key={optionIndex} value={optionIndex}>
            {option.name}
          </MenuItem>
        );
      });
    });
    
    return elements;
  };

  const getMaterialCostDisplay = (slotIndex: number) => {
    const slot = slots[slotIndex];
    if (slot.optionIndex === 0 || slot.value === 0) return '';
    
    const option = STAT_OPTIONS[slot.optionIndex - 1];
    if (!option) return '';
    
    const costReduction = getCostReduction(proficiency, matReduction);
    const materialCost = calculateMaterialCost(option, slot.value, costReduction);
    const materialName = MATERIAL_NAMES[option.mat as keyof typeof MATERIAL_NAMES];
    
    return `${materialName}: ${materialCost}`;
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        📋 Slot Stats
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Array.from({ length: 8 }, (_, index) => (
          <Grid container spacing={2} key={index} alignItems="center">
            <Grid item xs={1}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                {index + 1}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Pilih Stat</InputLabel>
                <Select
                  value={slots[index]?.optionIndex || 0}
                  label="Pilih Stat"
                  onChange={(e) => onSlotChange(index, Number(e.target.value), slots[index]?.value || 0)}
                >
                  <MenuItem value={0}>PILIH STAT</MenuItem>
                  {renderSelectOptions()}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={slots[index]?.value || 0}
                onChange={(e) => onSlotChange(index, slots[index]?.optionIndex || 0, parseInt(e.target.value) || 0)}
                disabled={!slots[index]?.optionIndex || slots[index]?.optionIndex === 0}
                inputProps={{ min: 0, max: 9999 }}
                sx={{ '& input': { color: 'primary.main', fontWeight: 'bold' } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              {getMaterialCostDisplay(index) && (
                <Chip
                  label={getMaterialCostDisplay(index)}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              )}
            </Grid>
          </Grid>
        ))}
      </Box>
    </Paper>
  );
};