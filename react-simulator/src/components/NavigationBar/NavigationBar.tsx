import React from 'react';
import {
  Paper,
  Box,
  Button,
  ButtonGroup,
} from '@mui/material';

interface NavigationBarProps {
  onConfirm: () => void;
  onRepeat: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canConfirm: boolean;
  canRepeat: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  onConfirm,
  onRepeat,
  onUndo,
  onRedo,
  canConfirm,
  canRepeat,
  canUndo,
  canRedo,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <ButtonGroup variant="contained">
          <Button
            onClick={onConfirm}
            disabled={!canConfirm}
            color="success"
          >
            ✅ Confirm
          </Button>
          <Button
            onClick={onRepeat}
            disabled={!canRepeat}
            color="info"
          >
            🔄 Repeat
          </Button>
        </ButtonGroup>
        
        <ButtonGroup variant="outlined">
          <Button
            onClick={onUndo}
            disabled={!canUndo}
          >
            ↶ Undo
          </Button>
          <Button
            onClick={onRedo}
            disabled={!canRedo}
          >
            ↷ Redo
          </Button>
        </ButtonGroup>
      </Box>
    </Paper>
  );
};