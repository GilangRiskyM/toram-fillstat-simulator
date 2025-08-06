import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material';

type ItemType = 'w' | 'a';

interface SimulatorFormProps {
  itemType: ItemType;
  startingPot: number;
  recipePot: number;
  tec: number;
  proficiency: number;
  matReduction: boolean;
  onItemTypeChange: (type: ItemType) => void;
  onStartingPotChange: (pot: number) => void;
  onRecipePotChange: (pot: number) => void;
  onTecChange: (tec: number) => void;
  onProficiencyChange: (proficiency: number) => void;
  onMatReductionChange: (enabled: boolean) => void;
  onStartSimulation: () => void;
  isSimulationActive: boolean;
}

export const SimulatorForm: React.FC<SimulatorFormProps> = ({
  itemType,
  startingPot,
  recipePot,
  tec,
  proficiency,
  matReduction,
  onItemTypeChange,
  onStartingPotChange,
  onRecipePotChange,
  onTecChange,
  onProficiencyChange,
  onMatReductionChange,
  onStartSimulation,
  isSimulationActive,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        ⚙️ Pengaturan Dasar
      </Typography>
      
      <Alert severity="warning" sx={{ mb: 3 }}>
        <strong>⚠️ Catatan Penting:</strong><br />
        Ini hanyalah simulasi saja, bisa terjadi perbedaan di dalam game.
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Tipe Item</InputLabel>
            <Select
              value={itemType}
              label="Tipe Item"
              onChange={(e) => onItemTypeChange(e.target.value as ItemType)}
              disabled={isSimulationActive}
            >
              <MenuItem value="w">Weapon (Senjata)</MenuItem>
              <MenuItem value="a">Armor (Zirah)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            type="number"
            label="POT Awal"
            value={startingPot || ''}
            onChange={(e) => onStartingPotChange(parseInt(e.target.value) || 0)}
            placeholder="Contoh: 99"
            inputProps={{ min: 1, max: 999 }}
            disabled={isSimulationActive}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            type="number"
            label="POT Resep"
            value={recipePot}
            onChange={(e) => onRecipePotChange(parseInt(e.target.value) || 0)}
            inputProps={{ min: 1, max: 999 }}
            disabled={isSimulationActive}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            type="number"
            label="TEC"
            value={tec}
            onChange={(e) => onTecChange(parseInt(e.target.value) || 0)}
            inputProps={{ min: 0, max: 255 }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            type="number"
            label="Proficiency"
            value={proficiency}
            onChange={(e) => onProficiencyChange(parseInt(e.target.value) || 0)}
            inputProps={{ min: 0, max: 999 }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={matReduction}
                onChange={(e) => onMatReductionChange(e.target.checked)}
              />
            }
            label="10% Mat Reduction"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={onStartSimulation}
            disabled={!startingPot || !recipePot || isSimulationActive}
            sx={{ height: '56px' }}
          >
            🚀 {isSimulationActive ? 'Simulasi Aktif' : 'Mulai Simulasi'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};