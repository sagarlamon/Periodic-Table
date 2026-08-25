import { AtomVisualizer } from '../canvas/atomVisualizer.js';

export class ElementModal {
  constructor(modalOverlayElement, onCompareToggle) {
    this.overlay = modalOverlayElement;
    this.onCompareToggle = onCompareToggle;
    this.currentElement = null;
    this.atomVisualizer = null;

    this.initDOM();
  }

  initDOM() {
    if (!this.overlay) return;
    this.overlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <div class="modal-title-group">
            <div class="modal-badge-number" id="m-number">1</div>
            <div class="modal-title">
              <h2 id="m-name">Hydrogen</h2>
              <span id="m-category">Reactive Nonmetal</span>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <button class="btn btn-primary" id="m-compare-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"/><path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4"/><path d="M22 12H18"/></svg>
              Compare
            </button>
            <button class="close-btn" id="m-close-btn">&times;</button>
          </div>
        </div>
        <div class="modal-body">
          <div class="visualizer-pane">
            <!-- 1. Real Physical Sample Reference Image (Top) -->
            <div class="sample-image-section">
              <span class="pane-section-header">Physical Sample Reference</span>
              <div class="sample-image-box">
                <img id="m-sample-img" class="sample-image" src="" alt="Element physical reference sample photograph" />
              </div>
              <p class="sample-caption" id="m-sample-caption">Wikipedia / Wikimedia Commons reference photograph.</p>
            </div>

            <!-- 2. Bohr Atomic Model Canvas (Bottom) -->
            <div class="atom-model-section">
              <span class="pane-section-header">Bohr Atomic Model</span>
              <div class="canvas-container">
                <canvas id="atom-canvas" class="atom-canvas"></canvas>
              </div>
              <div class="visualizer-controls">
                <div class="speed-control">
                  <label for="speed-slider">Orbit Speed:</label>
                  <input type="range" id="speed-slider" min="0.1" max="3" step="0.1" value="1.0">
                </div>
              </div>
            </div>
          </div>

          <div class="info-pane">
            <div class="info-section">
              <h3>Atomic & Subatomic Parameters</h3>
              <div class="data-grid">
                <div class="data-card"><label>Symbol</label><value id="m-symbol">H</value></div>
                <div class="data-card"><label>Atomic Weight</label><value id="m-mass">1.008 u</value></div>
                <div class="data-card"><label>Protons / Electrons</label><value id="m-protons">1</value></div>
                <div class="data-card"><label>Neutrons (Est.)</label><value id="m-neutrons">0</value></div>
                <div class="data-card"><label>Block / Group / Period</label><value id="m-location">s-block, G1, P1</value></div>
                <div class="data-card" style="grid-column: span 2;"><label>Electron Configuration</label><value id="m-config">1s¹</value></div>
              </div>
            </div>

            <div class="info-section">
              <h3>Physical & Thermodynamic Properties</h3>
              <div class="data-grid">
                <div class="data-card"><label>Phase at STP</label><value id="m-state">Gas</value></div>
                <div class="data-card"><label>Melting Point</label><value id="m-melt">13.99 K</value></div>
                <div class="data-card"><label>Boiling Point</label><value id="m-boil">20.27 K</value></div>
                <div class="data-card"><label>Density</label><value id="m-density">0.00009 g/cm³</value></div>
                <div class="data-card"><label>Electronegativity</label><value id="m-electroneg">2.20</value></div>
                <div class="data-card"><label>Ionization Energy</label><value id="m-ionization">1312 kJ/mol</value></div>
              </div>
            </div>

            <div class="info-section">
              <h3>Discovery & Etymology</h3>
              <div class="summary-box">
                <p id="m-history">Discovered by Henry Cavendish in 1766.</p>
              </div>
            </div>

            <div class="info-section">
              <h3>Overview</h3>
              <div class="summary-box">
                <p id="m-summary">Hydrogen is the lightest element...</p>
              </div>
            </div>

            <div class="info-section">
              <h3>Practical Applications & Uses</h3>
              <div class="uses-list" id="m-uses">
                <span class="use-chip">Rocket Fuel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Event Bindings
    this.overlay.querySelector('#m-close-btn').addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    const canvas = this.overlay.querySelector('#atom-canvas');
    this.atomVisualizer = new AtomVisualizer(canvas);

    const speedSlider = this.overlay.querySelector('#speed-slider');
    speedSlider.addEventListener('input', (e) => {
      this.atomVisualizer.setSpeed(e.target.value);
    });

    this.overlay.querySelector('#m-compare-btn').addEventListener('click', () => {
      if (this.currentElement && this.onCompareToggle) {
        this.onCompareToggle(this.currentElement.number);
      }
    });
  }

  open(element) {
    this.currentElement = element;
    if (!this.overlay) return;

    this.overlay.querySelector('#m-number').innerText = element.number;
    this.overlay.querySelector('#m-name').innerText = element.name;
    this.overlay.querySelector('#m-category').innerText = element.category.replace(/-/g, ' ').toUpperCase();
    this.overlay.querySelector('#m-symbol').innerText = element.symbol;
    this.overlay.querySelector('#m-mass').innerText = typeof element.atomic_mass === 'number' ? `${element.atomic_mass.toFixed(3)} u` : element.atomic_mass;
    this.overlay.querySelector('#m-protons').innerText = element.number;
    
    const neutrons = Math.round(parseFloat(element.atomic_mass) - element.number) || 0;
    this.overlay.querySelector('#m-neutrons').innerText = Math.max(0, neutrons);
    this.overlay.querySelector('#m-location').innerText = `${element.block}-block, G${element.group}, P${element.period}`;
    this.overlay.querySelector('#m-config').innerText = element.electron_configuration || 'N/A';

    this.overlay.querySelector('#m-melt').innerText = element.melting_point_k ? `${element.melting_point_k} K (${(element.melting_point_k - 273.15).toFixed(1)} °C)` : 'N/A';
    this.overlay.querySelector('#m-boil').innerText = element.boiling_point_k ? `${element.boiling_point_k} K (${(element.boiling_point_k - 273.15).toFixed(1)} °C)` : 'N/A';
    this.overlay.querySelector('#m-density').innerText = element.density ? `${element.density} g/cm³` : 'N/A';
    this.overlay.querySelector('#m-electroneg').innerText = element.electronegativity ? element.electronegativity : 'N/A';
    this.overlay.querySelector('#m-ionization').innerText = element.ionization_energy ? `${element.ionization_energy} kJ/mol` : 'N/A';
    this.overlay.querySelector('#m-state').innerText = element.state_stp.toUpperCase();

    this.overlay.querySelector('#m-history').innerText = `Discovered by ${element.discoverer || 'Unknown'} (${element.discovery_year || 'Historical'}).`;
    this.overlay.querySelector('#m-summary').innerText = element.summary;

    // Load Real Physical Sample Photograph from Wikipedia
    const imgEl = this.overlay.querySelector('#m-sample-img');
    const captionEl = this.overlay.querySelector('#m-sample-caption');

    if (element.image_url) {
      imgEl.src = element.image_url;
      captionEl.innerText = `Physical reference photograph of ${element.name} sample. (Source: Wikimedia Commons / Wikipedia)`;
    } else {
      imgEl.src = `https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Gold-crystals.jpg/330px-Gold-crystals.jpg`;
      captionEl.innerText = `Synthetic / short-lived heavy isotope. (Macro physical sample unstable in nature).`;
    }

    const usesList = this.overlay.querySelector('#m-uses');
    usesList.innerHTML = '';
    if (element.uses && element.uses.length > 0) {
      element.uses.forEach(use => {
        const chip = document.createElement('span');
        chip.className = 'use-chip';
        chip.innerText = use;
        usesList.appendChild(chip);
      });
    } else {
      usesList.innerHTML = '<span class="use-chip">Scientific Research</span>';
    }

    this.overlay.classList.add('active');

    // Start Bohr Atom Model animation
    setTimeout(() => {
      this.atomVisualizer.resizeCanvas();
      this.atomVisualizer.setElement(element);
    }, 100);
  }

  close() {
    if (!this.overlay) return;
    this.overlay.classList.remove('active');
    if (this.atomVisualizer) {
      this.atomVisualizer.stopAnimation();
    }
  }
}
