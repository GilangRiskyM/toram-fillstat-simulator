import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Grid, Typography } from '@mui/material';
import { SimulatorForm } from './components/SimulatorForm';
import { StatSlots } from './components/StatSlots';
import { MaterialCosts } from './components/MaterialCosts';
import { FormulaDisplay } from './components/FormulaDisplay';
import { NavigationBar } from './components/NavigationBar';
import { DebugPanel } from './components/DebugPanel';
import { useSimulator } from './hooks/useSimulator';
import { useAutoSave } from './hooks/useLocalStorage';
import './App.css';

const theme = createTheme({
  typography: {
    fontFamily: '"JetBrains Mono", "Courier New", monospace',
  },
  palette: {
    primary: {
      main: '#3498db',
    },
    success: {
      main: '#27ae60',
    },
    warning: {
      main: '#f39c12',
    },
    error: {
      main: '#e74c3c',
    },
  },
});

function App() {
  const {
    state,
    updateBasicSettings,
    startSimulation,
    updateSlot,
    confirm,
    repeat,
    undo,
    redo,
    exportState,
    importState,
    resetState,
  } = useSimulator();

  // Auto-save state to localStorage
  useAutoSave('toram-simulator-state', state);

  const handleItemTypeChange = (itemType: 'w' | 'a') => {
    updateBasicSettings({ itemType });
  };

  const handleStartingPotChange = (startingPot: number) => {
    updateBasicSettings({ startingPot });
  };

  const handleRecipePotChange = (recipePot: number) => {
    updateBasicSettings({ recipePot });
  };

  const handleTecChange = (tec: number) => {
    updateBasicSettings({ tec });
  };

  const handleProficiencyChange = (proficiency: number) => {
    updateBasicSettings({ proficiency });
  };

  const handleMatReductionChange = (matReduction: boolean) => {
    updateBasicSettings({ matReduction });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          🗡️ Toram Fill Stats Simulator 🛡️
        </Typography>
        
        <SimulatorForm
          itemType={state.itemType}
          startingPot={state.startingPot}
          recipePot={state.recipePot}
          tec={state.tec}
          proficiency={state.proficiency}
          matReduction={state.matReduction}
          onItemTypeChange={handleItemTypeChange}
          onStartingPotChange={handleStartingPotChange}
          onRecipePotChange={handleRecipePotChange}
          onTecChange={handleTecChange}
          onProficiencyChange={handleProficiencyChange}
          onMatReductionChange={handleMatReductionChange}
          onStartSimulation={startSimulation}
          isSimulationActive={state.isSimulationActive}
        />

        {state.isSimulationActive && (
          <>
            <NavigationBar
              onConfirm={confirm}
              onRepeat={repeat}
              onUndo={undo}
              onRedo={redo}
              canConfirm={true} // TODO: Calculate based on state
              canRepeat={true} // TODO: Calculate based on state
              canUndo={state.historyIndex > 0}
              canRedo={state.historyIndex < state.history.length - 1}
            />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <StatSlots
                  slots={state.slots}
                  itemType={state.itemType}
                  proficiency={state.proficiency}
                  matReduction={state.matReduction}
                  onSlotChange={updateSlot}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormulaDisplay
                  steps={state.formulaSteps}
                  potential={{ current: state.futurePot, max: state.currentPot }}
                  successRate={state.successRate}
                />
                
                <MaterialCosts costs={state.materialCosts} />
              </Grid>
            </Grid>

            <DebugPanel
              simulatorState={state}
              onExportState={exportState}
              onImportState={importState}
              onResetState={resetState}
            />
          </>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
