# 🗡️ Toram Fill Stats Simulator - React Version 🛡️

A complete React implementation of the Toram Fill Stats Simulator, maintaining all core functionality from the original HTML/JavaScript version while providing a modern, component-based architecture.

![Screenshot](https://github.com/user-attachments/assets/4f71589a-0286-4911-b27e-ff0256694cb0)

## ✨ Features

### Core Simulation Features
- 🎯 **Complete simulation engine** ported from original t4stat.js logic
- 📊 **Real-time success rate calculation** based on POT and TEC values
- 💎 **Material cost tracking** for all 6 material types (Metal/Logam, Cloth/Kain, Beast/Fauna, Wood/Kayu, Medicine/Obat, Mana)
- 🔄 **Full undo/redo system** for step-by-step experimentation
- 💾 **Auto-save functionality** with localStorage integration (every 30 seconds)
- 📋 **79 stats support** with proper categorization across 11 categories
- 🌐 **Bilingual material names** (Indonesia/English)

### Technical Implementation
- ⚛️ **Modern React architecture** with hooks and functional components
- 🎨 **Responsive design** optimized for mobile and desktop
- 🔤 **JetBrains Mono font** for consistent monospace display
- 🎛️ **Multi-workspace support** with navigation tabs
- ⌨️ **Keyboard shortcuts** support (Q/W for ±1 step, A for max, D for min)
- 🐛 **Debug tools** for development and troubleshooting
- 🎯 **Color-coded success rates** (Green 80%+, Yellow 60-79%, Red <60%)

### New React Features
- 📱 **Component-based architecture** for better maintainability
- 🔧 **Custom hooks** for state management and calculations
- 🎨 **Modern CSS styling** with CSS modules approach
- 📊 **Enhanced material tracking** with efficiency analysis
- 🔔 **Notification system** for user feedback
- 🏗️ **Proper error boundaries** and loading states

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm (or yarn)
- Modern web browser with ES2020+ support

### Installation
```bash
# Clone the repository
cd react-version

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development URLs
- **Development**: http://localhost:5173
- **Production build**: http://localhost:4173 (after `npm run preview`)

## 📁 Project Structure

```
src/
├── components/              # React components
│   ├── App.jsx             # Main application container
│   ├── SimulatorForm.jsx   # Settings and configuration form
│   ├── SlotManager.jsx     # 8 stat slots management
│   ├── MaterialTracker.jsx # Material cost tracking display
│   ├── FormulaDisplay.jsx  # Steps history and results
│   └── NavigationBar.jsx   # Multi-workspace navigation
├── hooks/                  # Custom React hooks
│   ├── useStatEngine.js    # Core stat engine management
│   ├── useLocalStorage.js  # localStorage integration & settings
│   └── useMaterialCalculator.js # Material cost calculations
├── utils/                  # Core utility functions
│   ├── mathUtils.js        # Precise math calculations (ported from math.js)
│   ├── statEngine.js       # Core logic engine (ported from t4stat.js)
│   └── calculations.js     # Helper calculation functions
├── data/
│   └── statsData.js        # 79 stats configuration data
├── styles/
│   └── App.css            # Main stylesheet with JetBrains Mono
└── main.jsx               # React app entry point
```

## 🎮 How to Use

### 1. Basic Setup
1. Select item type: **Weapon (Senjata)** or **Armor (Zirah)**
2. Set **POT Awal** (starting potential) - default: 99
3. Set **POT Resep** (recipe potential) - default: 46
4. Configure **TEC** (0-255, default: 255) and **Proficiency** (0-999, default: 0)
5. Enable **10% Mat Reduction** if you have the passive skill
6. Click **🚀 Mulai Simulasi** to start

### 2. Stat Selection & Planning
1. Choose stats from dropdowns (organized by 11 categories)
2. Enter desired stat values
3. Monitor real-time success rate and material costs
4. Use keyboard shortcuts for quick adjustments:
   - **Q/↑**: +1 step
   - **W/↓**: -1 step  
   - **A**: Set to maximum
   - **D**: Set to minimum
   - **Enter**: Confirm step

### 3. Step Management
- **✅ Confirm**: Apply changes and add to history
- **🔄 Repeat**: Repeat the last step
- **↶ Undo**: Revert last step
- **↷ Redo**: Restore undone step

### 4. Multi-Workspace Features
- **Rename**: ✏️ Rename current workspace
- **Duplicate**: 📋 Copy current workspace for testing variations
- **Close**: ❌ Remove workspace
- **Auto-save**: 💾 Automatic saving every 30 seconds

## 📊 79 Available Stats

### 🔥 Enhance Stats (10)
- STR, STR %, INT, INT %, VIT, VIT %, AGI, AGI %, DEX, DEX %

### ❤️ Enhance HP/MP (7)
- Natural HP/MP Regen, MaxHP/MP with percentage variants

### ⚔️ Enhance Attack (7)
- ATK, MATK with % variants, Stability %, Physical/Magic Pierce %

### 🛡️ Enhance Defense (14)
- DEF, MDEF with variants, Resistances, Damage reduction by attack type

### 🎯 Enhance Accuracy/Dodge (4)
- Accuracy, Accuracy %, Dodge, Dodge %

### ⚡ Enhance Speed (4)
- ASPD, ASPD %, CSPD, CSPD %

### 💥 Enhance Critical (4)
- Critical Rate/Damage with percentage variants

### 🌟 Enhance Elements (12)
- Element strengths and resistances for all 6 elements

### ✨ Special Enhancement (5)
- Ailment Resistance, Guard Power/Rate, Evasion Rate, Aggro

### 🔮 Awaken Elements (12)
- Element awakening (normal and matching types) - **Weapons only**

## 🎨 Design Features

### Visual Design
- **JetBrains Mono** font for professional monospace display
- **Color-coded success rates**: Green (80%+), Yellow (60-79%), Red (<60%)
- **Modern card-based layout** with smooth transitions
- **Responsive grid system** that adapts to screen size
- **Dark workspace tabs** with status indicators

### User Experience
- **Real-time calculations** with immediate feedback
- **Intuitive keyboard shortcuts** for power users
- **Clear material cost display** with bilingual names
- **Step-by-step history** with detailed breakdown
- **Auto-save notifications** for peace of mind

## 🔧 Technical Details

### State Management
- **React hooks** (useState, useEffect, useReducer) for local state
- **Custom hooks** for complex logic separation
- **Context-free architecture** for better performance
- **Immutable state updates** for reliable undo/redo

### Performance Optimizations
- **useMemo** for expensive calculations
- **useCallback** for stable function references
- **Component splitting** to minimize re-renders
- **Efficient diff algorithms** for large stat lists

### Data Persistence
- **localStorage** for workspace data and settings
- **JSON serialization** of complete application state
- **Automatic cleanup** of invalid stored data
- **Migration support** for data format changes

## 🚨 Important Notes

### Accuracy Disclaimer
⚠️ **Ini hanyalah simulasi saja, bisa terjadi perbedaan di dalam game.**

This is a simulation tool. Actual in-game results may vary due to:
- Game engine differences
- Hidden mechanics or rounding
- Client-server calculation variations
- Game updates changing formulas

### Browser Compatibility
- **Modern browsers** with ES2020+ support
- **Mobile browsers** (iOS Safari, Chrome Mobile)
- **Desktop browsers** (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Development Features
- **Hot Module Replacement** for instant updates
- **Source maps** for debugging
- **Development debug panel** with state inspection
- **Console logging** for troubleshooting
- **Error boundaries** for graceful failure handling

### Code Organization
- **Functional components** with hooks
- **Custom hooks** for business logic
- **Pure utility functions** for calculations
- **Separated concerns** between UI and logic
- **TypeScript-ready** structure (optional migration)

## 📈 Compared to Original

### Maintained Features ✅
- ✅ **Exact same calculation engine** ported from t4stat.js
- ✅ **All 79 stats** with identical behavior
- ✅ **Same success rate formulas** and material costs
- ✅ **Identical undo/redo mechanics**
- ✅ **POT default 99** for ease of use
- ✅ **Bilingual material names**
- ✅ **Keyboard shortcuts support**
- ✅ **Multi-workspace functionality**

### Enhanced Features 🚀
- 🚀 **Modern React architecture** for better maintainability
- 🚀 **Improved responsive design** for mobile devices
- 🚀 **Enhanced auto-save** with user control
- 🚀 **Better error handling** and user feedback
- 🚀 **Debug tools** for development
- 🚀 **Modular component structure** for easier updates
- 🚀 **Improved accessibility** with proper ARIA labels

## 🤝 Contributing

### Development Setup
1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies: `npm install`
4. **Create** a feature branch
5. **Make** your changes
6. **Test** thoroughly with `npm run dev`
7. **Build** to verify: `npm run build`
8. **Submit** a pull request

### Code Style
- **Functional components** with hooks
- **ESLint** configuration for code quality
- **Prettier** for consistent formatting
- **JSDoc comments** for complex functions
- **Component prop validation** (add PropTypes if needed)

## 📄 License

Free to use for the Toram Online Indonesia community.

## 🙏 Credits

- **Original calculation engine**: Toram community & [sparkychildcharlie](https://github.com/sparkychildcharlie)
- **React implementation**: Created with ❤️ for the Toram Online community
- **Design inspiration**: Material Design principles
- **Font**: JetBrains Mono for professional monospace display

---

**Happy Statting! 🎮✨**

_Remember: This is only a simulation - actual in-game results may vary!_
