export class CompareDrawer {
  constructor(containerElement, onRemoveElement) {
    this.container = containerElement;
    this.onRemoveElement = onRemoveElement;
    this.elementsToCompare = [];
    this.initDOM();
  }

  initDOM() {
    if (!this.container) return;
    this.container.className = 'compare-drawer';
    this.container.innerHTML = `
      <div class="compare-header">
        <div style="display:flex; align-items:center; gap:0.85rem;">
          <span style="font-family:var(--font-mono); font-size:0.75rem; font-weight:600; color:var(--accent-amber); letter-spacing:0.5px;">COMPARISON MATRIX</span>
          <div class="compare-list" id="compare-list"></div>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-primary" id="view-compare-btn">View Side-by-Side Table</button>
          <button class="btn" id="clear-compare-btn">Clear Selection</button>
        </div>
      </div>
    `;

    this.container.querySelector('#clear-compare-btn').addEventListener('click', () => {
      this.clearAll();
    });

    this.container.querySelector('#view-compare-btn').addEventListener('click', () => {
      this.openComparisonModal();
    });
  }

  setElements(elementsList) {
    this.elementsToCompare = elementsList;
    if (elementsList.length > 0) {
      this.container.classList.add('active');
    } else {
      this.container.classList.remove('active');
    }
    this.renderChips();
  }

  renderChips() {
    const list = this.container.querySelector('#compare-list');
    list.innerHTML = '';
    this.elementsToCompare.forEach(el => {
      const chip = document.createElement('div');
      chip.className = 'compare-item';
      chip.innerHTML = `
        <span style="font-weight:600; color:var(--text-main);">${el.symbol}</span>
        <span style="font-size:0.75rem; color:var(--text-muted);">${el.name}</span>
        <span style="cursor:pointer; color:var(--text-dim); margin-left:4px;" class="remove-chip">&times;</span>
      `;
      chip.querySelector('.remove-chip').addEventListener('click', () => {
        if (this.onRemoveElement) this.onRemoveElement(el.number);
      });
      list.appendChild(chip);
    });
  }

  clearAll() {
    this.elementsToCompare.forEach(el => {
      if (this.onRemoveElement) this.onRemoveElement(el.number);
    });
  }

  openComparisonModal() {
    if (this.elementsToCompare.length === 0) return;

    let overlay = document.getElementById('compare-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'compare-modal-overlay';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }

    const cols = this.elementsToCompare;
    overlay.innerHTML = `
      <div class="modal-container" style="max-width:1050px;">
        <div class="modal-header">
          <div class="modal-title-group">
            <h2 style="font-family:var(--font-ui); font-size:1.2rem; font-weight:600;">Side-by-Side Property Comparison Matrix</h2>
          </div>
          <button class="close-btn" id="c-close-btn">&times;</button>
        </div>
        <div style="padding:1.25rem; overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.82rem; font-family:var(--font-mono); font-variant-numeric:tabular-nums;">
            <thead>
              <tr style="border-bottom:2px solid var(--border-color-strong);">
                <th style="padding:0.6rem; color:var(--text-dim); font-weight:600; font-family:var(--font-ui);">Property</th>
                ${cols.map(c => `<th style="padding:0.6rem; font-size:1.05rem; color:var(--accent-blue); font-family:var(--font-ui); font-weight:600;">${c.name} (${c.symbol})</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border-color);">
                <td style="padding:0.5rem 0.6rem; color:var(--text-muted); font-family:var(--font-ui);">Atomic Number (Z)</td>
                ${cols.map(c => `<td style="padding:0.5rem 0.6rem; font-weight:600;">${c.number}</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid var(--border-color);">
                <td style="padding:0.5rem 0.6rem; color:var(--text-muted); font-family:var(--font-ui);">Atomic Weight</td>
                ${cols.map(c => `<td style="padding:0.5rem 0.6rem;">${c.atomic_mass} u</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid var(--border-color);">
                <td style="padding:0.5rem 0.6rem; color:var(--text-muted); font-family:var(--font-ui);">Category</td>
                ${cols.map(c => `<td style="padding:0.5rem 0.6rem; font-family:var(--font-ui);">${c.category.replace(/-/g, ' ')}</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid var(--border-color);">
                <td style="padding:0.5rem 0.6rem; color:var(--text-muted); font-family:var(--font-ui);">Electron Configuration</td>
                ${cols.map(c => `<td style="padding:0.5rem 0.6rem;">${c.electron_configuration || 'N/A'}</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid var(--border-color);">
                <td style="padding:0.5rem 0.6rem; color:var(--text-muted); font-family:var(--font-ui);">Electronegativity</td>
                ${cols.map(c => `<td style="padding:0.5rem 0.6rem;">${c.electronegativity || 'N/A'}</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid var(--border-color);">
                <td style="padding:0.5rem 0.6rem; color:var(--text-muted); font-family:var(--font-ui);">Melting Point</td>
                ${cols.map(c => `<td style="padding:0.5rem 0.6rem;">${c.melting_point_k ? c.melting_point_k + ' K' : 'N/A'}</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid var(--border-color);">
                <td style="padding:0.5rem 0.6rem; color:var(--text-muted); font-family:var(--font-ui);">Boiling Point</td>
                ${cols.map(c => `<td style="padding:0.5rem 0.6rem;">${c.boiling_point_k ? c.boiling_point_k + ' K' : 'N/A'}</td>`).join('')}
              </tr>
              <tr style="border-bottom:1px solid var(--border-color);">
                <td style="padding:0.5rem 0.6rem; color:var(--text-muted); font-family:var(--font-ui);">Density</td>
                ${cols.map(c => `<td style="padding:0.5rem 0.6rem;">${c.density ? c.density + ' g/cm³' : 'N/A'}</td>`).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    overlay.classList.add('active');
    overlay.querySelector('#c-close-btn').addEventListener('click', () => overlay.classList.remove('active'));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });
  }
}
