import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { MATERIAL_NAMES } from '../../utils/constants';

interface MaterialCosts {
  Metal: number;
  Cloth: number;
  Beast: number;
  Wood: number;
  Medicine: number;
  Mana: number;
  maxPerStep: number;
}

interface MaterialCostsProps {
  costs: MaterialCosts;
}

export const MaterialCosts: React.FC<MaterialCostsProps> = ({ costs }) => {
  const materials = [
    { key: 'Metal', name: MATERIAL_NAMES.Metal },
    { key: 'Cloth', name: MATERIAL_NAMES.Cloth },
    { key: 'Beast', name: MATERIAL_NAMES.Beast },
    { key: 'Wood', name: MATERIAL_NAMES.Wood },
    { key: 'Medicine', name: MATERIAL_NAMES.Medicine },
    { key: 'Mana', name: MATERIAL_NAMES.Mana },
  ] as const;

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        💎 Biaya Material
      </Typography>
      
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Material</strong></TableCell>
              <TableCell align="right"><strong>Jumlah</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.map(({ key, name }) => (
              <TableRow key={key}>
                <TableCell>{name}</TableCell>
                <TableCell align="right">{costs[key] || 0}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell><strong>Max/Step</strong></TableCell>
              <TableCell align="right"><strong>{costs.maxPerStep || 0}</strong></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};