// Periodic Grid Renderer Component - Scientific Diagram Engine
export class PeriodicGrid {
  constructor(containerElement, elementsData, onElementClick) {
    this.container = containerElement;
    this.elements = elementsData;
    this.onElementClick = onElementClick;
    this.currentTemperature = 298.15; // 25°C / STP
    this.activeCategory = null;
    this.searchQuery = "";
    this.activeHeatmap = null;
    this.selectedCompareSet = new Set();
    this.activeElementNumber = null;

    this.readoutContent = document.getElementById('readout-content');
  }

  setTemperature(kelvin) {
    this.currentTemperature = kelvin;
    this.render();
  }

  setCategoryFilter(category) {
    this.activeCategory = category;
    this.render();
  }

  setSearchQuery(query) {
    this.searchQuery = query.toLowerCase().trim();
    this.render();
  }

  setHeatmap(property) {
    this.activeHeatmap = property;
    this.render();
  }

  toggleCompare(elementNumber) {
    if (this.selectedCompareSet.has(elementNumber)) {
      this.selectedCompareSet.delete(elementNumber);
    } else {
      if (this.selectedCompareSet.size >= 3) {
        alert("You can compare up to 3 elements at a time.");
        return;
      }
      this.selectedCompareSet.add(elementNumber);
    }
    this.render();
  }

  getElementState(el) {
    if (el.state_stp === 'synthetic' || el.number > 94) return 'synthetic';
    if (!el.melting_point_k) return 'solid';
    
    if (this.currentTemperature < el.melting_point_k) {
      return 'solid';
    } else if (el.boiling_point_k && this.currentTemperature >= el.boiling_point_k) {
      return 'gas';
    } else {
      return 'liquid';
    }
  }

  getStateSummary() {
    let solid = 0, liquid = 0, gas = 0, synth = 0;
    this.elements.forEach(el => {
      const st = this.getElementState(el);
      if (st === 'solid') solid++;
      else if (st === 'liquid') liquid++;
      else if (st === 'gas') gas++;
      else synth++;
    });
    return `${solid} Solid · ${gas} Gas · ${liquid} Liquid · ${synth} Synthetic`;
  }

  calculateHeatmapColor(el) {
    if (!this.activeHeatmap) return null;
    let val = el[this.activeHeatmap];
    if (val === null || val === undefined) return 'rgba(30, 36, 50, 0.6)';

    val = parseFloat(val);
    let min = 0, max = 100;

    if (this.activeHeatmap === 'electronegativity') { min = 0.7; max = 4.0; }
    else if (this.activeHeatmap === 'density') { min = 0.0001; max = 22.5; }
    else if (this.activeHeatmap === 'ionization_energy') { min = 380; max = 2400; }
    else if (this.activeHeatmap === 'melting_point_k') { min = 0; max = 3800; }

    const ratio = Math.max(0, Math.min(1, (val - min) / (max - min)));
    const hue = 210 - (ratio * 195);
    const lightness = 20 + (ratio * 25);
    return `hsl(${hue}, 70%, ${lightness}%)`;
  }

  updateReadout(el) {
    if (!this.readoutContent) {
      this.readoutContent = document.getElementById('readout-content');
    }
    if (!this.readoutContent) return;

    if (!el) {
      this.readoutContent.innerHTML = 'Hover over an element to inspect metadata preview. Click for datasheet details.';
      return;
    }

    const formattedCategory = el.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const massStr = typeof el.atomic_mass === 'number' ? `${el.atomic_mass.toFixed(3)} u` : el.atomic_mass;
    const configStr = el.electron_configuration ? ` · ${el.electron_configuration}` : '';

    this.readoutContent.innerHTML = `Z=${el.number} · <span class="highlight-symbol">${el.name} (${el.symbol})</span> · <span class="highlight-category">${formattedCategory}</span> · ${massStr}${configStr}`;
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = "";

    const grid = document.createElement('div');
    grid.className = 'periodic-grid';

    // 1. Render Group Headers (Columns 2-19 in Grid)
    const groupBlocks = [
      "s", "s", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "p", "p", "p", "p", "p", "p"
    ];

    const topLeft = document.createElement('div');
    topLeft.style.gridColumn = 1;
    topLeft.style.gridRow = 1;
    grid.appendChild(topLeft);

    for (let g = 1; g <= 18; g++) {
      const gh = document.createElement('div');
      gh.className = 'group-header';
      gh.style.gridColumn = g + 1;
      gh.style.gridRow = 1;
      gh.innerHTML = `<span>${g}</span><span class="block-tag">${groupBlocks[g-1]}</span>`;
      grid.appendChild(gh);
    }

    // 2. Render Period Headers (Rows 2-8 in Grid)
    for (let p = 1; p <= 7; p++) {
      const ph = document.createElement('div');
      ph.className = 'period-header';
      ph.style.gridColumn = 1;
      ph.style.gridRow = p + 1;
      ph.innerText = p;
      grid.appendChild(ph);
    }

    // Map cards for fast class manipulation on hover
    const cardMap = new Map();

    // 3. Render Elements (118 Elements Placement)
    this.elements.forEach(el => {
      const isLanthanide = el.number >= 57 && el.number <= 71;
      const isActinide = el.number >= 89 && el.number <= 103;

      let gridCol = el.group + 1;
      let gridRow = el.period + 1;

      if (isLanthanide) {
        gridRow = 10;
        gridCol = (el.number - 57) + 4;
      } else if (isActinide) {
        gridRow = 11;
        gridCol = (el.number - 89) + 4;
      }

      // Filter matching
      let matchesSearch = true;
      if (this.searchQuery) {
        matchesSearch = el.name.toLowerCase().includes(this.searchQuery) ||
                        el.symbol.toLowerCase().includes(this.searchQuery) ||
                        el.number.toString() === this.searchQuery;
      }

      let matchesCategory = true;
      if (this.activeCategory) {
        matchesCategory = el.category === this.activeCategory;
      }

      const isDimmed = !matchesSearch || !matchesCategory;
      const currentState = this.getElementState(el);
      const isSelectedCompare = this.selectedCompareSet.has(el.number);
      const heatmapColor = this.calculateHeatmapColor(el);

      const card = document.createElement('div');
      card.className = `element-card cat-${el.category} state-${currentState} ${isDimmed ? 'dimmed' : ''} ${isSelectedCompare ? 'selected-compare' : ''} ${this.activeHeatmap ? 'heatmap-active' : ''}`;
      card.style.gridColumn = gridCol;
      card.style.gridRow = gridRow;
      card.setAttribute('tabindex', '0'); // Accessibility Keyboard Focus
      card.dataset.category = el.category;
      card.dataset.number = el.number;

      if (heatmapColor) {
        card.style.setProperty('--heatmap-bg', heatmapColor);
      }

      let stateShort = 'S';
      if (currentState === 'liquid') stateShort = 'L';
      if (currentState === 'gas') stateShort = 'G';
      if (currentState === 'synthetic') stateShort = 'SYN';

      const massDisplay = typeof el.atomic_mass === 'number' ? el.atomic_mass.toFixed(el.atomic_mass > 100 ? 1 : 2) : el.atomic_mass;

      card.innerHTML = `
        <div class="card-top">
          <span class="card-number">${el.number}</span>
          <span class="card-state-tag" title="State at ${Math.round(this.currentTemperature)}K">${stateShort}</span>
        </div>
        <div class="card-main">
          <div class="card-symbol">${el.symbol}</div>
          <div class="card-name">${el.name}</div>
        </div>
        <div class="card-bottom">
          <span class="card-mass">${massDisplay}</span>
        </div>
      `;

      cardMap.set(el.number, card);

      // Hover / Focus Inspection Interactions
      const handleEnter = () => {
        grid.classList.add('is-hovering');
        card.classList.add('hover-target');
        this.updateReadout(el);

        // Highlight neighborhood elements of the same category
        cardMap.forEach((otherCard, otherNum) => {
          if (otherCard.dataset.category === el.category) {
            otherCard.classList.add('hover-same-category');
          }
        });
      };

      const handleLeave = () => {
        grid.classList.remove('is-hovering');
        card.classList.remove('hover-target');
        this.updateReadout(null);

        cardMap.forEach((otherCard) => {
          otherCard.classList.remove('hover-same-category');
        });
      };

      card.addEventListener('mouseenter', handleEnter);
      card.addEventListener('mouseleave', handleLeave);
      card.addEventListener('focus', handleEnter);
      card.addEventListener('blur', handleLeave);

      // Click / Keydown Activation
      card.addEventListener('click', () => {
        if (this.onElementClick) {
          this.onElementClick(el);
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (this.onElementClick) {
            this.onElementClick(el);
          }
        }
      });

      grid.appendChild(card);
    });

    // 4. Series Labels for Lanthanides & Actinides
    const lLabel = document.createElement('div');
    lLabel.className = 'series-label';
    lLabel.style.gridRow = 10;
    lLabel.style.gridColumn = '1 / span 3';
    lLabel.innerHTML = 'Lanthanides (57–71)';
    grid.appendChild(lLabel);

    const aLabel = document.createElement('div');
    aLabel.className = 'series-label';
    aLabel.style.gridRow = 11;
    aLabel.style.gridColumn = '1 / span 3';
    aLabel.innerHTML = 'Actinides (89–103)';
    grid.appendChild(aLabel);

    this.container.appendChild(grid);
  }
}
