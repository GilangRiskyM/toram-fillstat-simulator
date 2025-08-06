/**
 * Main App component for Toram Fill Stats Simulator
 * React.js version with modern architecture
 */

import React from 'react';
import { ThemeProvider } from 'styled-components';
import { SimulatorProvider } from './context/SimulatorContext';
import { GlobalStyle, theme, Container, Workspace } from './components/GlobalStyles';

// Import components
import Header from './components/Header';
import SettingsPanel from './components/SettingsPanel';
import SlotManagement from './components/SlotManagement';
import StatsDisplay from './components/StatsDisplay';
import MaterialCosts from './components/MaterialCosts';
import Notifications from './components/Notifications';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <SimulatorProvider>
        <Container>
          <Header />
          <SettingsPanel />
          
          <Workspace>
            <div>
              <SlotManagement />
            </div>
            <div>
              <StatsDisplay />
              <MaterialCosts />
            </div>
          </Workspace>
          
          <Notifications />
        </Container>
      </SimulatorProvider>
    </ThemeProvider>
  );
}

export default App;