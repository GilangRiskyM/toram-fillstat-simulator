/**
 * Global styles for Toram Fill Stats Simulator
 * Styled-components theme and global CSS
 */

import styled, { createGlobalStyle } from 'styled-components';
import { UI_COLORS, GRADIENT_BACKGROUNDS } from '../utils/constants';

// Global styles
export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    background-color: ${UI_COLORS.BACKGROUND};
    color: ${UI_COLORS.SECONDARY};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  input, select, button, textarea {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
  }

  button {
    cursor: pointer;
    transition: all 0.3s ease;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  // Scrollbar styling
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${UI_COLORS.TEXT_MUTED};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${UI_COLORS.PRIMARY};
  }
`;

// Theme object
export const theme = {
  colors: {
    primary: UI_COLORS.PRIMARY,
    secondary: UI_COLORS.SECONDARY,
    accent: UI_COLORS.ACCENT,
    background: UI_COLORS.BACKGROUND,
    textMuted: UI_COLORS.TEXT_MUTED,
    success: UI_COLORS.SUCCESS_HIGH,
    warning: UI_COLORS.SUCCESS_MEDIUM,
    error: UI_COLORS.SUCCESS_LOW,
  },
  gradients: {
    primary: GRADIENT_BACKGROUNDS.PRIMARY,
    card: GRADIENT_BACKGROUNDS.CARD,
    button: GRADIENT_BACKGROUNDS.BUTTON,
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '50px',
  },
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 8px 25px rgba(0,0,0,0.15)',
    xl: '0 20px 25px rgba(0,0,0,0.15)',
  },
};

// Common styled components
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0 ${props => props.theme.spacing.md};
  }
`;

export const Card = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.lg};
    border-radius: ${props => props.theme.borderRadius.md};
  }
`;

export const GradientCard = styled(Card)`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

export const Button = styled.button`
  background: ${props => props.variant === 'primary' 
    ? props.theme.colors.primary 
    : props.variant === 'gradient'
    ? props.theme.gradients.button
    : '#6c757d'};
  color: white;
  border: none;
  padding: ${props => props.size === 'large' 
    ? `${props.theme.spacing.md} ${props.theme.spacing.xl}` 
    : `${props.theme.spacing.sm} ${props.theme.spacing.md}`};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: ${props => props.size === 'large' ? '1.1em' : '0.9em'};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  &:disabled {
    background: #95a5a6;
    transform: none;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.md};
    font-size: 0.9em;
  }
`;

export const Input = styled.input`
  padding: ${props => props.theme.spacing.sm};
  border: 2px solid #bdc3c7;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.9em;
  transition: all 0.3s ease;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
  }
  
  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  padding: ${props => props.theme.spacing.sm};
  border: 2px solid #bdc3c7;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.9em;
  transition: all 0.3s ease;
  background: white;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
  }
  
  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 150px;
  gap: ${props => props.theme.spacing.xs};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    min-width: auto;
  }
`;

export const Label = styled.label`
  font-weight: bold;
  color: ${props => props.theme.colors.secondary};
  font-size: 0.9em;
`;

export const Workspace = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  margin-top: ${props => props.theme.spacing.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.lg};
  }
`;

export const SlotsSection = styled(Card)`
  background: #f8f9fa;
`;

export const ResultsSection = styled(Card)`
  background: #f8f9fa;
`;

export const SlotRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
    gap: ${props => props.theme.spacing.xs};
  }
`;

export const SlotNumber = styled.div`
  width: 30px;
  text-align: center;
  font-weight: bold;
  color: ${props => props.theme.colors.textMuted};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: auto;
    text-align: left;
  }
`;

export const PotentialDisplay = styled.div`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.sm};
  text-align: center;
  font-size: 1.1em;
  font-weight: bold;
  margin-bottom: ${props => props.theme.spacing.md};
`;

export const SuccessRateDisplay = styled.div`
  background: ${props => 
    props.rate >= 80 ? props.theme.colors.success :
    props.rate >= 60 ? props.theme.colors.warning :
    props.theme.colors.error
  };
  color: white;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.sm};
  text-align: center;
  font-size: 1.1em;
  font-weight: bold;
  margin-bottom: ${props => props.theme.spacing.md};
  transition: background-color 0.3s ease;
`;

export const ControlsRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
  
  ${Button} {
    flex: 1;
    min-width: 100px;
    
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      min-width: auto;
    }
  }
`;

export const FormulaDisplay = styled.div`
  background: white;
  border: 2px solid #e1e8ed;
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: ${props => props.theme.spacing.md};
  max-height: 300px;
  overflow-y: auto;
  font-size: 0.85em;
  line-height: 1.4;
`;

export const MaterialTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: ${props => props.theme.spacing.sm};
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
`;

export const NotificationContainer = styled.div`
  position: fixed;
  top: ${props => props.theme.spacing.lg};
  right: ${props => props.theme.spacing.lg};
  z-index: 1000;
  max-width: 400px;
`;

export const Notification = styled.div`
  background: ${props => 
    props.type === 'success' ? props.theme.colors.success :
    props.type === 'error' ? props.theme.colors.error :
    props.type === 'warning' ? props.theme.colors.warning :
    props.theme.colors.primary
  };
  color: white;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: bold;
  box-shadow: ${props => props.theme.shadows.lg};
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const GlobalStylesExport = {
  GlobalStyle,
  theme,
  Container,
  Card,
  GradientCard,
  Button,
  Input,
  Select,
  FormGroup,
  Label,
  Workspace,
  SlotsSection,
  ResultsSection,
  SlotRow,
  SlotNumber,
  PotentialDisplay,
  SuccessRateDisplay,
  ControlsRow,
  FormulaDisplay,
  MaterialTable,
  NotificationContainer,
  Notification
};

export default GlobalStylesExport;