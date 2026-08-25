import { getFull118Elements } from './data/elements.js';
import { PeriodicGrid } from './components/grid.js';
import { ElementModal } from './components/modal.js';
import { CompareDrawer } from './components/compare.js';

document.addEventListener('DOMContentLoaded', () => {
  const elementsData = getFull118Elements();

  const gridContainer = document.getElementById('grid-container');
  const modalOverlay = document.getElementById('element-modal-overlay');
  const compareContainer = document.getElementById('compare-drawer-container');
  const stateSummaryText = document.getElementById('state-summary-text');
  const landscapePrompt = document.getElementById('landscape-prompt');
  const dismissPromptBtn = document.getElementById('dismiss-prompt-btn');

  // Attempt screen orientation lock to landscape on supported devices
  function tryLockLandscape() {
    if (window.screen && window.screen.orientation && typeof window.screen.orientation.lock === 'function') {
      window.screen.orientation.lock('landscape').catch(() => {
        // Ignored if user hasn't interacted or if orientation lock isn't supported by platform
      });
    }
  }

  // Dismiss landscape rotation prompt on mobile
  if (dismissPromptBtn && landscapePrompt) {
    dismissPromptBtn.addEventListener('click', () => {
      landscapePrompt.style.display = 'none';
      tryLockLandscape();
    });
  }

  // Auto lock landscape on first touch interaction
  document.addEventListener('touchstart', () => {
    tryLockLandscape();
  }, { once: true });

  // Compare Drawer Component
  const compareDrawer = new CompareDrawer(compareContainer, (numberToRemove) => {
    periodicGrid.toggleCompare(numberToRemove);
    updateCompareDrawer();
  });

  // Modal Component
  const elementModal = new ElementModal(modalOverlay, (numberToCompare) => {
    periodicGrid.toggleCompare(numberToCompare);
    updateCompareDrawer();
  });

  // Periodic Grid Component
  const periodicGrid = new PeriodicGrid(gridContainer, elementsData, (selectedElement) => {
    elementModal.open(selectedElement);
  });

  function updateCompareDrawer() {
    const selectedNums = Array.from(periodicGrid.selectedCompareSet);
    const selectedObjList = elementsData.filter(el => selectedNums.includes(el.number));
    compareDrawer.setElements(selectedObjList);
  }

  function updateStateSummary() {
    if (stateSummaryText) {
      stateSummaryText.innerText = periodicGrid.getStateSummary();
    }
  }

  // Initial Grid Render
  periodicGrid.render();
  updateStateSummary();

  // Search Input Binding & Keyboard Shortcut '/'
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    periodicGrid.setSearchQuery(e.target.value);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    } else if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.blur();
    }
  });

  // Thermal Temperature Slider Binding
  const thermalSlider = document.getElementById('thermal-slider');
  const tempBadge = document.getElementById('temp-badge');

  thermalSlider.addEventListener('input', (e) => {
    const kelvin = parseFloat(e.target.value);
    const celsius = (kelvin - 273.15).toFixed(0);
    const fahrenheit = ((kelvin - 273.15) * 9/5 + 32).toFixed(0);
    tempBadge.innerText = `${kelvin} K (${celsius}°C / ${fahrenheit}°F)`;
    periodicGrid.setTemperature(kelvin);
    updateStateSummary();
  });

  // Trend Heatmap Binding
  const heatmapSelect = document.getElementById('heatmap-select');
  heatmapSelect.addEventListener('change', (e) => {
    periodicGrid.setHeatmap(e.target.value || null);
  });

  // Category Legend Filter Binding
  const legendBadges = document.querySelectorAll('.legend-badge');
  legendBadges.forEach(badge => {
    badge.addEventListener('click', () => {
      legendBadges.forEach(b => b.classList.remove('active'));
      badge.classList.add('active');
      const cat = badge.dataset.category;
      periodicGrid.setCategoryFilter(cat === 'all' ? null : cat);
    });
  });
});
