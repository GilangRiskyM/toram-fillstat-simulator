/**
 * Material Costs component
 * Displays current material costs and usage tracking
 */

import React from 'react';
import styled from 'styled-components';
import { useSimulator } from '../../context/SimulatorContext';
import { Card, MaterialTable } from '../GlobalStyles';
import { getMaterialDisplayName } from '../../utils/helpers';
import { MATERIAL_TYPES } from '../../utils/constants';

const MaterialCostsCard = styled(Card)`
  background: white;
  border: 2px solid #e1e8ed;
  margin-top: ${props => props.theme.spacing.md};
`;

const MaterialTitle = styled.h4`
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.secondary};
`;

const MaterialAmount = styled.td`
  color: ${props => props.amount > 0 ? props.theme.colors.success : 'inherit'};
  font-weight: ${props => props.amount > 0 ? 'bold' : 'normal'};
`;

const MaxMaterialRow = styled.tr`
  background-color: #f8f9fa;
  
  th, td {
    font-weight: bold;
  }
`;

function MaterialCosts() {
  const { state } = useSimulator();

  if (!state.simulation.isActive) {
    return null;
  }

  const materials = [
    { key: MATERIAL_TYPES.METAL, display: getMaterialDisplayName(MATERIAL_TYPES.METAL) },
    { key: MATERIAL_TYPES.CLOTH, display: getMaterialDisplayName(MATERIAL_TYPES.CLOTH) },
    { key: MATERIAL_TYPES.BEAST, display: getMaterialDisplayName(MATERIAL_TYPES.BEAST) },
    { key: MATERIAL_TYPES.WOOD, display: getMaterialDisplayName(MATERIAL_TYPES.WOOD) },
    { key: MATERIAL_TYPES.MEDICINE, display: getMaterialDisplayName(MATERIAL_TYPES.MEDICINE) },
    { key: MATERIAL_TYPES.MANA, display: getMaterialDisplayName(MATERIAL_TYPES.MANA) }
  ];

  return (
    <MaterialCostsCard>
      <MaterialTitle>💎 Biaya Material</MaterialTitle>
      <MaterialTable>
        <thead>
          <tr>
            <th>Material</th>
            <th>Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr key={material.key}>
              <td>{material.display}</td>
              <MaterialAmount amount={state.materials[material.key]}>
                {state.materials[material.key] || 0}
              </MaterialAmount>
            </tr>
          ))}
          <MaxMaterialRow>
            <th>Max/Step</th>
            <td>{state.maxMaterials || 0}</td>
          </MaxMaterialRow>
        </tbody>
      </MaterialTable>
    </MaterialCostsCard>
  );
}

export default MaterialCosts;