/**
 * Constants and configuration data for Toram Fill Stats Simulator
 * Migrated from t4stat.js to centralized constants
 */

export const MAX_STEPS = 20;
export const BONUS_STEPS = 10;
export const SLOTS = 8;

export const PENALTY_DATA = [0, 0, 20, 45, 80, 125, 180, 245, 320];

export const DEFAULT_WEAPON_RECIPE_POT = 46;
export const DEFAULT_ARMOR_RECIPE_POT = 44;

export const MATERIAL_TYPES = {
  METAL: 'Metal',
  CLOTH: 'Cloth', 
  BEAST: 'Beast',
  WOOD: 'Wood',
  MEDICINE: 'Medicine',
  MANA: 'Mana'
};

export const ITEM_TYPES = {
  WEAPON: 'w',
  ARMOR: 'a'
};

export const ELEMENT_TYPES = {
  FIRE: 'Fire',
  WATER: 'Water', 
  WIND: 'Wind',
  EARTH: 'Earth',
  LIGHT: 'Light',
  DARK: 'Dark'
};

export const STAT_CATEGORIES = {
  ENHANCE_STATS: 'Enhance Stats',
  ENHANCE_HP_MP: 'Enhance HP/MP',
  ENHANCE_ATTACK: 'Enhance Attack',
  ENHANCE_DEFENSE: 'Enhance Defense',
  ENHANCE_ACCURACY: 'Enhance Accuracy',
  ENHANCE_DODGE: 'Enhance Dodge',
  ENHANCE_SPEED: 'Enhance Speed',
  ENHANCE_CRITICAL: 'Enhance Critical',
  ENHANCE_ELEMENTS: 'Enhance Elements',
  SPECIAL_ENHANCEMENT: 'Special Enhancement',
  AWAKEN_ELEMENTS: 'Awaken Elements'
};

// Default settings
export const DEFAULT_SETTINGS = {
  TEC: 255,
  PROFICIENCY: 0,
  MAT_REDUCTION: false,
  STARTING_POT: 99,
  AUTO_SAVE_INTERVAL: 30000 // 30 seconds
};

// UI Colors
export const UI_COLORS = {
  SUCCESS_HIGH: '#27ae60',    // 80%+ success rate
  SUCCESS_MEDIUM: '#f39c12',  // 60-79% success rate  
  SUCCESS_LOW: '#e74c3c',     // <60% success rate
  PRIMARY: '#3498db',
  SECONDARY: '#2c3e50',
  ACCENT: '#9b59b6',
  BACKGROUND: '#f5f5f5',
  TEXT_MUTED: '#7f8c8d'
};

export const GRADIENT_BACKGROUNDS = {
  PRIMARY: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  CARD: 'rgba(255,255,255,0.1)',
  BUTTON: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)'
};

// LocalStorage keys
export const STORAGE_KEYS = {
  INSTANCE_DATA: 'instance_data',
  EXTRA_SETTINGS: 'extra_settings'
};

const ConstantsExport = {
  MAX_STEPS,
  BONUS_STEPS,
  SLOTS,
  PENALTY_DATA,
  DEFAULT_WEAPON_RECIPE_POT,
  DEFAULT_ARMOR_RECIPE_POT,
  MATERIAL_TYPES,
  ITEM_TYPES,
  ELEMENT_TYPES,
  STAT_CATEGORIES,
  DEFAULT_SETTINGS,
  UI_COLORS,
  GRADIENT_BACKGROUNDS,
  STORAGE_KEYS
};

export default ConstantsExport;