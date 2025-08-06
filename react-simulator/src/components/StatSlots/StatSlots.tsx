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

type ItemType = 'w' | 'a';

interface StatOption {
  name: string;
  mat: string;
  pot: number;
  cost: number | string;
  cat: string;
  type: string;
  bonus?: number;
  bonusratio?: number;
  step?: number;
  max?: number;
  max_only?: boolean;
  nonega?: boolean;
}

interface StatSlot {
  optionIndex: number;
  value: number;
  materialCost: number;
}

interface StatSlotsProps {
  slots: StatSlot[];
  itemType: ItemType;
  onSlotChange: (slotIndex: number, optionIndex: number, value: number) => void;
}

// Material names for display
const MATERIAL_NAMES = {
  Metal: "Metal / Logam",
  Cloth: "Cloth / Kain", 
  Beast: "Beast / Fauna",
  Wood: "Wood / Kayu",
  Medicine: "Medicine / Obat",
  Mana: "Mana"
};

// Stat options (simplified for now - will be imported from constants later)
const STAT_OPTIONS: StatOption[] = [
  {
    name: "STR",
    mat: "Beast",
    pot: 5,
    cost: 25,
    cat: "Enhance Stats",
    type: "u",
    bonus: 1,
  },
  {
    name: "STR %",
    mat: "Beast",
    pot: 10,
    cost: 50,
    cat: "Enhance Stats",
    type: "u",
  },
  // Add more options later
];

export const StatSlots: React.FC<StatSlotsProps> = ({ slots, itemType, onSlotChange }) => {
  const getFilteredOptions = () => {
    return STAT_OPTIONS.filter(option => 
      option.type === 'u' || option.type === itemType || option.type === 'e'
    );
  };

  const getGroupedOptions = () => {
    const filteredOptions = getFilteredOptions();
    const groups: { [key: string]: StatOption[] } = {};
    
    filteredOptions.forEach(option => {
      if (!groups[option.cat]) {
        groups[option.cat] = [];
      }
      groups[option.cat].push(option);
    });
    
    return groups;
  };

  const renderSelectOptions = () => {
    const groups = getGroupedOptions();
    const elements: React.ReactNode[] = [];
    
    Object.entries(groups).forEach(([category, options]) => {
      elements.push(
        <MenuItem key={`category-${category}`} disabled>
          <strong>{category}</strong>
        </MenuItem>
      );
      
      options.forEach((option, index) => {
        const optionIndex = STAT_OPTIONS.indexOf(option);
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
    
    const option = STAT_OPTIONS[slot.optionIndex];
    if (!option) return '';
    
    const materialName = MATERIAL_NAMES[option.mat as keyof typeof MATERIAL_NAMES];
    return `${materialName}: ${slot.materialCost}`;
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