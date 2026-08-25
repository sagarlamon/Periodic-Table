# Periodic Table of Elements

A minimal, information-dense scientific visualizer and reference tool for all 118 chemical elements.

Built from the ground up to feel like a modern laboratory reference instrument rather than a generic SaaS dashboard or AI concept.

- **Live Demo / Preview**: [https://sagarlamon.github.io/Periodic-Table/](https://sagarlamon.github.io/Periodic-Table/)

---

## Design Philosophy: Pure Scientific Minimalism

- **Precision Visual Rhythm**: High-density IUPAC 18-group grid layout with subtle, low-saturation category accents.
- **IBM Plex Font Stack**: Clean UI hierarchy using IBM Plex Sans and tabular IBM Plex Mono for atomic numbers, atomic weights, and temperature measurements.
- **No Decorative Emojis**: Pure SVG vector icons used exclusively across controls, legends, and search boxes for a professional scientific UI.
- **Integrated Dual Media Column**: Physical reference sample photographs from Wikipedia/Wikimedia Commons stacked directly above interactive 3D Bohr atomic orbit simulations.

---

## Key Features

- **Complete 118 Element Dataset**: Full IUPAC atomic metadata for Hydrogen ($Z=1$) to Oganesson ($Z=118$).
- **Physical Reference Photographs**: Real-world sample photographs from Wikipedia for physical element identification.
- **Interactive Bohr Atom Canvas**: Dynamic electron orbit animation with shell labels ($K, L, M, N, O, P, Q$) and orbit speed control.
- **Real-Time Thermal Phase Calculator**: Interactive STP temperature slider ($0\text{ K}$ to $6,000\text{ K}$) that computes real-time phase states (Solid, Liquid, Gas, Synthetic).
- **Quantitative Property Heatmaps**: Quantitative color gradient overlays for Electronegativity (Pauling), Density ($\text{g/cm}^3$), Ionization Energy ($\text{kJ/mol}$), and Melting Point ($\text{K}$).
- **Multi-Element Comparison Matrix**: Compare up to 3 elements side-by-side in a quantitative property matrix.
- **Keyboard Navigation**: Press `/` to focus the search bar instantly.

---

## Tech Stack

- **Core**: HTML5, Vanilla JavaScript (ES Modules)
- **Styling**: Vanilla CSS3 (Custom CSS Design Tokens, Glassmorphism, Responsive Grid)
- **Typography**: IBM Plex Sans, IBM Plex Mono, IBM Plex Serif
- **Icons**: Clean SVG Icons
- **Data & Media**: Wikimedia Commons & Wikipedia REST API
- **Build Tool**: Vite

---

## Local Setup & Development

### 1. Clone the Repository
```bash
git clone https://github.com/sagarlamon/Periodic-Table.git
cd Periodic-Table
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

### 5. Deploy to GitHub Pages
```bash
npm run deploy
```

---

## Author & Repository

- **Author**: SAGAR
- **GitHub Repository**: [https://github.com/sagarlamon/Periodic-Table](https://github.com/sagarlamon/Periodic-Table)
- **Live Preview**: [https://sagarlamon.github.io/Periodic-Table/](https://sagarlamon.github.io/Periodic-Table/)
