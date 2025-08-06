import React from 'react';

const FormulaDisplay = ({ engine }) => {
  if (!engine) return null;

  const getDisplayContent = () => {
    let display = engine.steps.getDisplay();
    
    if (typeof engine.finished === "number") {
      display += `<br><br><strong>🎯 Final Result:</strong><br>`;
      display += `Success Rate: <span style="color: #27ae60; font-weight: bold;">${engine.getSuccessRate()}%</span>`;

      if (engine.tec !== 255) {
        display += ` <span style="color: #e74c3c; font-size: 12px">(${engine.tec} TEC)</span>`;
      }

      const matsUsed = Object.keys(engine.mats)
        .filter((mat) => engine.mats[mat] > 0)
        .map((mat) => `${engine.mats[mat]} ${mat}`)
        .join(" / ");

      if (matsUsed) {
        display += `<br><span style="color: #3498db; font-size: 12px">📦 Materials Used: ${matsUsed} (Max: ${engine.maxMats})</span>`;
      }

      let settings = [];
      if (engine.proficiency) settings.push(`${engine.proficiency} proficiency`);
      if (engine.matReduction) settings.push("10% mat reduction");
      if (settings.length) {
        display += `<br><span style="color: #27ae60; font-size: 12px">⚙️ Bonuses: ${settings.join(" + ")}</span>`;
      }
    }

    const content = `<strong>📊 Langkah-langkah:</strong><br><br>${
      engine.type === "w" ? "⚔️ Weapon" : "🛡️ Armor"
    } - Starting Potential: ${engine.startingPot}<br><br>${
      display || '<em style="color: #7f8c8d;">Belum ada langkah yang dilakukan.</em>'
    }`;

    return content;
  };

  return (
    <div className="formula-display">
      <div 
        dangerouslySetInnerHTML={{ __html: getDisplayContent() }}
      />
      
      {/* Quick stats summary */}
      {engine.steps.formula.length > 0 && (
        <div className="formula-stats">
          <hr />
          <small>
            <strong>Summary:</strong>{' '}
            {engine.steps.formula.length} steps • {' '}
            {engine.steps.condensedFormula.length} unique operations • {' '}
            POT: {engine.startingPot} → {engine.pot}
            {engine.finished && ` • Final Rate: ${engine.getSuccessRate()}%`}
          </small>
        </div>
      )}

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="formula-debug">
          <hr />
          <details>
            <summary>Debug Info</summary>
            <pre style={{ fontSize: '10px', maxHeight: '100px', overflow: 'auto' }}>
              {JSON.stringify({
                formulaLength: engine.steps.formula.length,
                condensedLength: engine.steps.condensedFormula.length,
                redoQueueLength: engine.steps.redoQueue.length,
                currentPot: engine.pot,
                futurePot: engine.futurePot,
                finished: engine.finished
              }, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default FormulaDisplay;