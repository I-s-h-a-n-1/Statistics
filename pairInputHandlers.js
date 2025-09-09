export function initializePairInputs() {
    const ungroupedPairsDiv = document.getElementById('ungroupedPairs');
    const addUngroupedPairBtn = document.getElementById('addUngroupedPairBtn');
    const groupedPairsDiv = document.getElementById('groupedPairs');
    const addGroupedPairBtn = document.getElementById('addGroupedPairBtn');
  
    addUngroupedPairInput(); // Initial pair
    addGroupedPairInput();   // Initial pair
  
    addUngroupedPairBtn.addEventListener('click', addUngroupedPairInput);
    addGroupedPairBtn.addEventListener('click', addGroupedPairInput);
  
    function addUngroupedPairInput() {
      const pairDiv = document.createElement('div');
      pairDiv.classList.add('pair-input');
      pairDiv.innerHTML = `
          <input type="number" class="value" placeholder="Value" min="0" step="any">
          <input type="number" class="frequency" placeholder="Frequency" min="0" step="1">
          <button type="button" class="remove-btn">&times;</button>
      `;
      ungroupedPairsDiv.appendChild(pairDiv);
      pairDiv.querySelector('.remove-btn').addEventListener('click', () => {
        pairDiv.remove();
        // Also hide steps and button if inputs change after calculation
        stepsSection.classList.remove('active');
        showStepsBtn.style.display = 'none';
        lastCalculatedData = null;
        lastCalculatedDataType = null;
        lastCalculatedSteps = null;
        stepsContentDiv.innerHTML = '';
        resultsDiv.textContent = ''; // Clear results too
        showStepsBtn.textContent = 'Show Steps'; // Reset button text
      });
      // Add input event listeners to hide steps if data is modified
      pairDiv.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
          stepsSection.classList.remove('active');
          showStepsBtn.style.display = 'none';
          lastCalculatedData = null;
          lastCalculatedDataType = null;
          lastCalculatedSteps = null;
          stepsContentDiv.innerHTML = '';
          resultsDiv.textContent = ''; // Clear results too
          showStepsBtn.textContent = 'Show Steps'; // Reset button text
        });
      });
    }
  
    function addGroupedPairInput() {
      const pairDiv = document.createElement('div');
      pairDiv.classList.add('pair-input');
      pairDiv.innerHTML = `
          <input type="number" class="lower-bound" placeholder="Lower Class Limit" step="any">
          <input type="number" class="upper-bound" placeholder="Upper Class Limit" step="any">
          <input type="number" class="frequency" placeholder="Frequency" min="0" step="1">
          <button type="button" class="remove-btn">&times;</button>
      `;
      groupedPairsDiv.appendChild(pairDiv);
      pairDiv.querySelector('.remove-btn').addEventListener('click', () => {
        pairDiv.remove();
        // Hide steps and button if inputs change
        stepsSection.classList.remove('active');
        showStepsBtn.style.display = 'none';
        lastCalculatedData = null;
        lastCalculatedDataType = null;
        lastCalculatedSteps = null;
        stepsContentDiv.innerHTML = '';
        resultsDiv.textContent = ''; // Clear results too
        showStepsBtn.textContent = 'Show Steps'; // Reset button text
      });
      // Add input event listeners to hide steps if data is modified
      pairDiv.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
          stepsSection.classList.remove('active');
          showStepsBtn.style.display = 'none';
          lastCalculatedData = null;
          lastCalculatedDataType = null;
          lastCalculatedSteps = null;
          stepsContentDiv.innerHTML = '';
          resultsDiv.textContent = ''; // Clear results too
          showStepsBtn.textContent = 'Show Steps'; // Reset button text
        });
      });
    }
  }