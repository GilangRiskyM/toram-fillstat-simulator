# 🗡️ Toram Fill Stats Simulator (React.js) 🛡️

A modern, fully-migrated React.js application for simulating Toram Online's fill stats mechanics with an intuitive interface and comprehensive features.

## ✨ Features

### 🎯 Core Simulation
- **Complete Fill Stats Simulation** - For both Weapons and Armor with 79 stat options
- **Accurate Success Rate Calculator** - Based on POT, TEC, and game mechanics
- **Real-time Potential Tracking** - Live updates as you configure stats
- **Advanced Penalty Calculations** - Category-based penalty system

### 💎 Material Management
- **Complete Material Tracking** - All 6 material types (Metal/Logam, Cloth/Kain, Beast/Fauna, Wood/Kayu, Medicine/Obat, Mana)
- **Real-time Cost Calculation** - See material costs as you plan
- **Bilingual Display** - English/Indonesian material names
- **Max Material Tracking** - Shows highest material cost per step

### 🔄 Advanced Controls
- **Undo/Redo System** - Full step-by-step history management
- **Repeat Function** - Quickly repeat successful combinations
- **Auto-Save** - Progress saved automatically every 30 seconds
- **Responsive Design** - Optimized for mobile and desktop

### ⚙️ Configuration Options
- **TEC Support** - Full TEC range (0-255) with accurate calculations
- **Proficiency System** - Smithing proficiency (0-999) for cost reduction
- **Material Reduction** - 10% material reduction passive support
- **Item Type Selection** - Weapon vs Armor with appropriate stat filtering

## 🚀 Technology Stack

- **React 18** - Modern React with hooks and functional components
- **Styled Components** - CSS-in-JS for responsive styling
- **Context API** - Centralized state management
- **Custom Hooks** - Reusable simulation logic
- **TypeScript-ready** - Architecture prepared for TypeScript migration
- **GitHub Pages** - Automated deployment pipeline

## 🎮 How to Use

### 1. Basic Setup
1. Select **Item Type** (Weapon or Armor)
2. Enter **POT Awal** (starting potential, e.g., 99)
3. Set **POT Resep** (recipe potential, default: 46)
4. Configure **TEC** (default: 255 for optimal results)
5. Set **Proficiency** if applicable (0-999)
6. Enable **10% Mat Reduction** if you have the passive
7. Click **🚀 Mulai Simulasi** to start

### 2. Stat Configuration
1. For each slot (1-8), select a stat from the dropdown
2. Enter desired stat value
3. View real-time success rate and material costs
4. Use keyboard shortcuts for efficiency:
   - **Q/Up Arrow**: Increase stat by 1 step
   - **W/Down Arrow**: Decrease stat by 1 step
   - **A**: Set to maximum value
   - **D**: Set to minimum value
   - **Enter**: Confirm current step

### 3. Step Management
- **✅ Confirm**: Apply current configuration and move to next step
- **🔄 Repeat**: Repeat the last successful step
- **↶ Undo**: Revert the last step
- **↷ Redo**: Restore an undone step

## 📊 All 79 Stat Options

### 🔥 Enhance Stats
- STR, STR %, INT, INT %, VIT, VIT %, AGI, AGI %, DEX, DEX %

### ❤️ Enhance HP/MP
- Natural HP/MP Regen, MaxHP, MaxHP %, MaxMP

### ⚔️ Enhance Attack
- ATK, ATK %, MATK, MATK %, Stability %, Physical Pierce %, Magic Pierce %

### 🛡️ Enhance Defense
- DEF, DEF %, MDEF, MDEF %, Physical/Magical Resistance %
- Reduce Damage from various attack types (Foe Epicenter, Player Epicenter, Straight Line, Charge, Meteor, Bullet, Bowling, Floor)

### 🎯 Enhance Accuracy & Dodge
- Accuracy, Accuracy %, Dodge, Dodge %

### ⚡ Enhance Speed
- ASPD, ASPD %, CSPD, CSPD %

### 💥 Enhance Critical
- Critical Rate, Critical Rate %, Critical Damage, Critical Damage %

### 🌟 Enhance Elements
- Element Strength % against all 6 elements (Fire, Water, Wind, Earth, Light, Dark)
- Element Resistance % for all 6 elements

### ✨ Special Enhancement
- Ailment Resistance %, Guard Power %, Guard Rate %, Evasion Rate %, Aggro %

### 🌈 Awaken Elements (Weapon Only)
- All 6 elements in both regular and matching variants

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/GilangRiskyM/toram-fillstat-simulator.git
cd toram-fillstat-simulator

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Project Structure
```
src/
├── components/           # React components
│   ├── Header/          # App header with title and disclaimer
│   ├── SettingsPanel/   # Initial configuration settings
│   ├── SlotManagement/  # 8-slot stat configuration
│   ├── StatsDisplay/    # Potential, success rate, and steps
│   ├── MaterialCosts/   # Material cost tracking
│   ├── Notifications/   # User feedback system
│   └── GlobalStyles.js  # Styled-components theme
├── context/             # State management
│   └── SimulatorContext.js
├── hooks/               # Custom hooks
│   ├── useLocalStorage.js
│   └── useSimulator.js
├── utils/               # Utility functions
│   ├── constants.js     # App constants and configuration
│   ├── helpers.js       # Helper functions
│   ├── math.js         # Precise mathematical calculations
│   └── statOptions.js  # All 79 stat configurations
└── App.js              # Main application component
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file for local development:
```
CI=false                 # Disable treating warnings as errors
GENERATE_SOURCEMAP=false # Disable source maps for production
```

### GitHub Pages Deployment
The app is configured for automatic deployment to GitHub Pages:
- **Homepage**: Set in `package.json`
- **Build**: Optimized production build
- **Deploy**: GitHub Actions workflow handles deployment

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- 📱 Mobile browsers (iOS Safari, Chrome Mobile)

## ⚠️ Important Disclaimer

**This is a simulation tool only. Results may differ from the actual game due to:**
- Game engine variations
- Rounding differences
- Hidden mechanics
- Server-side calculations

Always test your builds in-game before investing significant resources.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

- **Original Concept**: Toram Online community
- **Core Algorithm**: [sparkychildcharlie](https://github.com/sparkychildcharlie)
- **React Migration**: Modern React.js architecture
- **Design**: JetBrains Mono font with gaming-themed UI
- **Community**: Toram Online Indonesia

## 🔗 Links

- **Live Demo**: [GitHub Pages](https://gilangriskim.github.io/toram-fillstat-simulator)
- **Original Version**: Legacy HTML/CSS/JS version included
- **Issues**: [GitHub Issues](https://github.com/GilangRiskyM/toram-fillstat-simulator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/GilangRiskyM/toram-fillstat-simulator/discussions)

---

**Happy Statting! 🎮✨**

*Remember: This is a simulation - actual game results may vary!*