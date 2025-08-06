import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
} from '@mui/material';

interface FormulaStep {
  text: string;
  pot_after: number;
  repeat?: number;
}

interface FormulaDisplayProps {
  steps: FormulaStep[];
  potential: { current: number; max: number };
  successRate: number;
}

export const FormulaDisplay: React.FC<FormulaDisplayProps> = ({ 
  steps, 
  potential, 
  successRate 
}) => {
  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'error';
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Chip
          label={`Potential: ${potential.current} / ${potential.max}`}
          color="primary"
          sx={{ mb: 1, mr: 1, fontSize: '1rem', fontWeight: 'bold' }}
        />
        <Chip
          label={`Success Rate: ${successRate.toFixed(1)}%`}
          color={getSuccessRateColor(successRate)}
          sx={{ mb: 1, fontSize: '1rem', fontWeight: 'bold' }}
        />
      </Box>

      <Typography variant="h6" gutterBottom>
        📊 Langkah-langkah
      </Typography>
      
      <Box 
        sx={{ 
          maxHeight: 300, 
          overflow: 'auto',
          backgroundColor: 'grey.50',
          borderRadius: 1,
          p: 2,
          fontFamily: 'monospace'
        }}
      >
        {steps.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Belum ada langkah yang dilakukan.
          </Typography>
        ) : (
          steps.map((step, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography 
                variant="body2" 
                component="div"
                sx={{ 
                  fontFamily: 'monospace',
                  lineHeight: 1.4
                }}
              >
                <strong>{index + 1}.</strong> {step.text} 
                <span style={{ color: 'blue' }}> ({step.pot_after}pot)</span>
                {step.repeat && step.repeat > 1 && (
                  <span style={{ color: 'green' }}> x{step.repeat}</span>
                )}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
};