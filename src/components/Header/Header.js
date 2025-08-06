/**
 * Header component for Toram Fill Stats Simulator
 * Displays title and main navigation
 */

import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: 2em;
  color: ${props => props.theme.colors.secondary};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.5em;
    margin-bottom: ${props => props.theme.spacing.md};
  }
`;

const Disclaimer = styled.div`
  background: rgba(243, 156, 18, 0.15);
  border: 2px solid #f39c12;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
  font-weight: bold;
  color: #d68910;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 0.9em;
    padding: ${props => props.theme.spacing.sm};
  }
`;

function Header() {
  return (
    <HeaderContainer>
      <Title>🗡️ Toram Fill Stats Simulator 🛡️</Title>
      <Disclaimer>
        ⚠️ Ini hanyalah simulasi saja, bisa terjadi perbedaan di dalam game.
      </Disclaimer>
    </HeaderContainer>
  );
}

export default Header;