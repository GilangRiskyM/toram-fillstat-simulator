import React, { useState } from 'react';

const SimulatorForm = ({ settings, onUpdateSetting, onStartSimulation, hasActiveSimulation }) => {
  const [formData, setFormData] = useState({
    itemType: 'w',
    startingPot: '99',
    recipePot: '46'
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const startingPot = parseInt(formData.startingPot);
    const recipePot = parseInt(formData.recipePot);

    if (!startingPot || startingPot < 1) {
      newErrors.startingPot = 'POT awal harus diisi dan minimal 1';
    }

    if (!recipePot || recipePot < 1) {
      newErrors.recipePot = 'POT resep harus diisi dan minimal 1';
    }

    if (startingPot && recipePot && startingPot < recipePot) {
      newErrors.startingPot = 'POT awal tidak boleh lebih kecil dari POT resep';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onStartSimulation(formData);
    }
  };

  const handleSettingChange = (setting, value) => {
    onUpdateSetting(setting, value);
  };

  return (
    <div className="settings-section">
      <h3>⚙️ Pengaturan Dasar</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="settings-row">
          <div className="form-group">
            <label htmlFor="itemType">Tipe Item:</label>
            <select
              id="itemType"
              value={formData.itemType}
              onChange={(e) => handleInputChange('itemType', e.target.value)}
              disabled={hasActiveSimulation}
            >
              <option value="w">Weapon (Senjata)</option>
              <option value="a">Armor (Zirah)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="startingPot">POT Awal:</label>
            <input
              type="number"
              id="startingPot"
              value={formData.startingPot}
              onChange={(e) => handleInputChange('startingPot', e.target.value)}
              placeholder="Contoh: 99"
              min="1"
              max="999"
              disabled={hasActiveSimulation}
              className={errors.startingPot ? 'error' : ''}
            />
            {errors.startingPot && (
              <div className="error-message">{errors.startingPot}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="recipePot">POT Resep:</label>
            <input
              type="number"
              id="recipePot"
              value={formData.recipePot}
              onChange={(e) => handleInputChange('recipePot', e.target.value)}
              min="1"
              max="999"
              disabled={hasActiveSimulation}
              className={errors.recipePot ? 'error' : ''}
            />
            {errors.recipePot && (
              <div className="error-message">{errors.recipePot}</div>
            )}
          </div>
        </div>

        <div className="settings-row">
          <div className="form-group">
            <label htmlFor="tec">TEC:</label>
            <input
              type="number"
              id="tec"
              value={settings.tec}
              onChange={(e) => handleSettingChange('tec', parseInt(e.target.value) || 0)}
              min="0"
              max="255"
            />
          </div>

          <div className="form-group">
            <label htmlFor="proficiency">Proficiency:</label>
            <input
              type="number"
              id="proficiency"
              value={settings.proficiency}
              onChange={(e) => handleSettingChange('proficiency', parseInt(e.target.value) || 0)}
              min="0"
              max="999"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="matReduction"
                checked={settings.matReduction}
                onChange={(e) => handleSettingChange('matReduction', e.target.checked)}
              />
              10% Mat Reduction
            </label>
          </div>

          <div className="form-group">
            <button
              type="submit"
              className="btn btn-primary btn-start"
              disabled={hasActiveSimulation}
            >
              🚀 {hasActiveSimulation ? 'Simulasi Aktif' : 'Mulai Simulasi'}
            </button>
          </div>
        </div>
      </form>

      {/* Settings Summary */}
      <div className="settings-summary">
        <small>
          <strong>Settings:</strong>{' '}
          {settings.tec !== 255 && `TEC ${settings.tec} • `}
          {settings.proficiency > 0 && `Proficiency ${settings.proficiency} • `}
          {settings.matReduction && '10% Mat Reduction • '}
          <span className="cost-reduction">
            Material Cost: {Math.round((100 - (Math.floor(settings.proficiency / 10) + Math.floor(settings.proficiency / 50))) * (settings.matReduction ? 0.9 : 1))}%
          </span>
        </small>
      </div>
    </div>
  );
};

export default SimulatorForm;