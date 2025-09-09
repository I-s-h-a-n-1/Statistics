import { calculateRawStats, calculateUngroupedStats, calculateGroupedStats } from './statsCalculations.js';
import { generateRawSteps, generateUngroupedSteps, generateGroupedSteps } from './stepGeneration.js';

// Variables to store last calculated data and type, and separate steps HTML
let lastCalculatedData = null;
let lastCalculatedDataType = null;
let lastCalculatedSteps = null;

export function initializeUI() {
  const dataTypeRadios = document.querySelectorAll('input[name="dataType"]');
  const inputAreas = document.querySelectorAll('.input-area');
  const calculateBtn = document.getElementById('calculateBtn');
  const resultsDiv = document.getElementById('results');
  const showStepsBtn = document.getElementById('showStepsBtn');
  const stepsSection = document.getElementById('steps-section');
  const stepsContentDiv = document.getElementById('steps-content');

  // --- UI Logic for switching input areas ---
  dataTypeRadios.forEach(radio => {
      radio.addEventListener('change', (event) => {
          const selectedType = event.target.value;
          inputAreas.forEach(area => {
              area.classList.remove('active');
          });
          document.getElementById(`${selectedType}InputArea`).classList.add('active');
          // Hide steps and button when switching data type
          stepsSection.classList.remove('active'); // Collapse the steps section entirely
          showStepsBtn.style.display = 'none'; // Hide the button
          lastCalculatedData = null; // Clear previous data
          lastCalculatedDataType = null;
          lastCalculatedSteps = null; // Clear steps data
          resultsDiv.textContent = ''; // Clear results too
          stepsContentDiv.innerHTML = ''; // Clear steps content
          showStepsBtn.textContent = 'Show Steps'; // Reset button text
      });
  });

  // --- Calculate Button Event Listener ---
  calculateBtn.addEventListener('click', () => {
    const selectedType = document.querySelector('input[name="dataType"]:checked').value;
    let results = "";
    let steps = null;

    if (selectedType === 'raw') {
        const rawData = document.getElementById('rawData').value;
        results = calculateRawStats(rawData);
        steps = generateRawSteps(rawData);
    } else if (selectedType === 'ungrouped') {
        const pairs = [];
        document.getElementById('ungroupedPairs').querySelectorAll('.pair-input').forEach(pairDiv => {
            const valueInput = pairDiv.querySelector('.value');
            const frequencyInput = pairDiv.querySelector('.frequency');
            const value = parseFloat(valueInput.value);
            const frequency = parseInt(frequencyInput.value);

            if (!isNaN(value) && !isNaN(frequency) && frequency >= 0) {
                pairs.push({ value, frequency });
            }
        });
        results = calculateUngroupedStats(pairs);
        steps = generateUngroupedSteps(pairs);
    } else if (selectedType === 'grouped') {
        const intervals = [];
        document.getElementById('groupedPairs').querySelectorAll('.pair-input').forEach(pairDiv => {
            const lowerInput = pairDiv.querySelector('.lower-bound');
            const upperInput = pairDiv.querySelector('.upper-bound');
            const frequencyInput = pairDiv.querySelector('.frequency');
            const lower = parseFloat(lowerInput.value);
            const upper = parseFloat(upperInput.value);
            const frequency = parseInt(frequencyInput.value);

            if (!isNaN(lower) && !isNaN(upper) && !isNaN(frequency) && lower < upper && frequency >= 0) {
                intervals.push({ lower, upper, frequency });
            }
        });
        results = calculateGroupedStats(intervals);
        steps = generateGroupedSteps(intervals);
    }

    resultsDiv.textContent = results;
    if (steps) {
        stepsContentDiv.innerHTML = '';
        
        // Always show general info first (data table)
        if (steps.general) {
            stepsContentDiv.innerHTML += steps.general;
        }

        // Create navigation for steps
        const stepNav = document.createElement('div');
        stepNav.className = 'step-nav';
        stepNav.innerHTML = `
            <button class="step-nav-btn active" data-target="mean">Mean</button>
            <button class="step-nav-btn" data-target="median">Median</button>
            <button class="step-nav-btn" data-target="mode">Mode</button>
            <button class="step-nav-btn" data-target="mad">MAD</button>
            <button class="step-nav-btn" data-target="stddev">Standard deviation & Variance</button>
        `;
        stepsContentDiv.appendChild(stepNav);

        // Create step sections container
        const stepSections = document.createElement('div');
        stepSections.className = 'step-sections';
        
        // Create sections for all steps
        for (const [key, content] of Object.entries(steps)) {
            if (key !== 'general') {
                const section = document.createElement('div');
                section.id = `step-${key}`;
                section.className = 'step-section';
                section.innerHTML = content;
                stepSections.appendChild(section);
            }
        }
        
        stepsContentDiv.appendChild(stepSections);
        
        // Add navigation functionality
        const navButtons = stepNav.querySelectorAll('.step-nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const target = btn.dataset.target;
                document.querySelectorAll('.step-section').forEach(section => {
                    section.style.display = 'none';
                });
                document.getElementById(`step-${target}`).style.display = 'block';
            });
        });

        // Show mean by default
        document.getElementById('step-mean').style.display = 'block';
    }

    // Show steps button and section
    showStepsBtn.style.display = 'inline-block';
    lastCalculatedData = results;
    lastCalculatedDataType = selectedType;
    lastCalculatedSteps = steps;
  });

  // --- Show Steps Button Event Listener ---
  showStepsBtn.addEventListener('click', () => {
    stepsSection.classList.toggle('active');
    if (stepsSection.classList.contains('active')) {
        showStepsBtn.textContent = 'Hide Steps';
        // Scroll into view if steps section is activated
        stepsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        showStepsBtn.textContent = 'Show Steps';
    }
  });
}