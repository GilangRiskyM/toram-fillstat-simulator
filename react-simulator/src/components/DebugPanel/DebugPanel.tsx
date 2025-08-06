import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  Collapse,
  Box,
  Divider,
} from '@mui/material';

interface DebugPanelProps {
  simulatorState: any;
  onExportState: () => void;
  onImportState: (state: any) => void;
  onResetState: () => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
  simulatorState,
  onExportState,
  onImportState,
  onResetState,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outlined"
        size="small"
        sx={{ mb: isOpen ? 2 : 0 }}
      >
        🔍 Debug Panel {isOpen ? '▼' : '▶'}
      </Button>
      
      <Collapse in={isOpen}>
        <Typography variant="h6" gutterBottom>
          Debug Tools
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={onExportState}
          >
            📤 Export State
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.json';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const state = JSON.parse(event.target?.result as string);
                      onImportState(state);
                    } catch (error) {
                      alert('Invalid file format');
                    }
                  };
                  reader.readAsText(file);
                }
              };
              input.click();
            }}
          >
            📥 Import State
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={onResetState}
          >
            🗑️ Reset
          </Button>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Typography variant="body2" component="pre" sx={{ 
          backgroundColor: 'grey.100',
          p: 2,
          borderRadius: 1,
          maxHeight: 200,
          overflow: 'auto',
          fontSize: '0.75rem'
        }}>
          {JSON.stringify(simulatorState, null, 2)}
        </Typography>
      </Collapse>
    </Paper>
  );
};