/**
 * Utility functions for Toram Fill Stats Simulator
 * Migrated from t4stat.js helper functions
 */

/**
 * Toram-specific rounding function
 * @param {number} value - Value to round
 * @returns {number} Rounded value following Toram game logic
 */
export function toramRound(value) {
  if (value > 0) return Math.floor(value);
  return Math.ceil(value);
}

/**
 * Deep clone an object or array
 * @param {any} obj - Object to clone
 * @returns {any} Deep cloned object
 */
export function deepClone(obj) {
  let type = typeof obj;
  if (Array.isArray(obj)) type = "array";

  let newObj;
  switch (type) {
    case "string":
      newObj = "" + obj;
      break;
    case "array":
      newObj = obj.slice(0).map((i) => deepClone(i));
      break;
    case "number":
      newObj = 0 + obj;
      break;
    case "boolean":
      newObj = !!obj;
      break;
    case "function":
      newObj = Object.assign({}, { func: obj }).func;
      break;
    case "object":
      // null is a special case
      if (obj === null) return null;

      newObj = {};
      for (let prop in obj) {
        newObj[prop] = deepClone(obj[prop]);
      }
      break;
    default:
      newObj = obj;
  }

  return newObj;
}

/**
 * Generate a unique ID for workspace instances
 * @param {Object} existingStats - Object containing existing stats
 * @returns {string} Unique workspace ID
 */
export function generateWorkspaceId(existingStats = {}) {
  let id = 0;
  do {
    id++;
  } while (existingStats[`Stat_${id}`]);
  return `Stat_${id}`;
}

/**
 * Format number for display with proper decimal places
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number string
 */
export function formatNumber(value, decimals = 2) {
  if (typeof value !== 'number') return '0';
  return Number(value).toFixed(decimals).replace(/\.?0+$/, '');
}

/**
 * Get material type display name with bilingual support
 * @param {string} materialType - Material type key
 * @returns {string} Display name for material
 */
export function getMaterialDisplayName(materialType) {
  const materialNames = {
    'Metal': 'Metal / Logam',
    'Cloth': 'Cloth / Kain',
    'Beast': 'Beast / Fauna',
    'Wood': 'Wood / Kayu',
    'Medicine': 'Medicine / Obat',
    'Mana': 'Mana'
  };
  
  return materialNames[materialType] || materialType;
}

/**
 * Get success rate color class based on percentage
 * @param {number} rate - Success rate percentage
 * @returns {string} CSS class name for color
 */
export function getSuccessRateColor(rate) {
  if (rate >= 80) return 'high';
  if (rate >= 60) return 'medium';
  return 'low';
}

/**
 * Validate numeric input for stats
 * @param {string} value - Input value to validate
 * @returns {boolean} True if valid numeric input
 */
export function isValidStatInput(value) {
  return /^-?\d*$/.test(value);
}

/**
 * Parse potential value from string
 * @param {string|number} pot - Potential value
 * @returns {number} Parsed potential value
 */
export function parsePotential(pot) {
  const parsed = parseInt(pot);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}

/**
 * Parse TEC value with validation
 * @param {string|number} tec - TEC value
 * @returns {number} Validated TEC value (0-255)
 */
export function parseTEC(tec) {
  const parsed = parseInt(tec);
  if (isNaN(parsed)) return 255;
  return Math.max(0, Math.min(255, parsed));
}

/**
 * Parse proficiency value with validation
 * @param {string|number} proficiency - Proficiency value
 * @returns {number} Validated proficiency value (0-999)
 */
export function parseProficiency(proficiency) {
  const parsed = parseInt(proficiency);
  if (isNaN(parsed)) return 0;
  return Math.max(0, Math.min(999, parsed));
}

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if device is mobile based on screen width
 * @returns {boolean} True if mobile device
 */
export function isMobile() {
  return window.innerWidth <= 768;
}

/**
 * Format step display text with proper styling
 * @param {Object} step - Step object with text and metadata
 * @returns {string} Formatted HTML string
 */
export function formatStepDisplay(step) {
  const stepNum = `<strong style="color: #2c3e50;">#${step.index}.</strong>`;
  const stepText = `<span style="color: #34495e;">${step.text}</span>`;
  const repeatText = step.repeat > 1 
    ? ` <span style="color: #9b59b6;">(x${step.repeat})</span>` 
    : "";
  const potText = `<span style="color: #7f8c8d; font-size: 12px;">(${step.pot_after} pot)</span>`;
  
  return `${stepNum} ${stepText}${repeatText} ${potText}`;
}

export default {
  toramRound,
  deepClone,
  generateWorkspaceId,
  formatNumber,
  getMaterialDisplayName,
  getSuccessRateColor,
  isValidStatInput,
  parsePotential,
  parseTEC,
  parseProficiency,
  debounce,
  isMobile,
  formatStepDisplay
};