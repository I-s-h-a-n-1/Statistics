import { initializeUI } from './uiHandlers.js';
import { initializePairInputs } from './pairInputHandlers.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeUI();
  initializePairInputs();
});

// removed all other code as it's been moved to specialized modules

