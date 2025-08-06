import React from 'react';
import { useMaterialCalculator } from '../hooks/useMaterialCalculator.js';

const MaterialTracker = ({ engine }) => {
  const { costSummary, overallMaxCost } = useMaterialCalculator(engine);

  if (!engine) return null;

  return (
    <div className="material-costs">
      <h4>💎 Biaya Material</h4>
      <table className="material-table">
        <thead>
          <tr>
            <th>Material</th>
            <th>Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {costSummary.map((material) => (
            <tr key={material.type}>
              <td>{material.displayName}</td>
              <td style={material.hasTotalCost ? { color: '#27ae60', fontWeight: 'bold' } : {}}>
                {material.totalCost}
              </td>
            </tr>
          ))}
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th>Max/Step</th>
            <td style={{ fontWeight: 'bold' }}>
              {overallMaxCost}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Material efficiency info */}
      {engine.steps.formula.length > 0 && (
        <div className="material-efficiency">
          <small>
            <strong>Efficiency:</strong>{' '}
            Total materials used: {Object.values(engine.mats).reduce((sum, val) => sum + val, 0)} •{' '}
            POT used: {engine.startingPot - engine.pot}
          </small>
        </div>
      )}

      {/* Cost reduction info */}
      {(engine.proficiency > 0 || engine.matReduction) && (
        <div className="cost-reduction-info">
          <small style={{ color: '#27ae60' }}>
            <strong>Active bonuses:</strong>{' '}
            {engine.proficiency > 0 && `${engine.proficiency} proficiency`}
            {engine.proficiency > 0 && engine.matReduction && ' + '}
            {engine.matReduction && '10% mat reduction'}
          </small>
        </div>
      )}
    </div>
  );
};

export default MaterialTracker;