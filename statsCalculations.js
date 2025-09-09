// PART 1

export function calculateRawStats(data) {
    const numbers = data.split(',')
        .map(s => parseFloat(s.trim()))
        .filter(n => !isNaN(n));

    if (numbers.length == 0)
        return "Please enter valid numbers for raw data.";

    const n = numbers.length;
    numbers.sort((a, b) => a - b);  

    // Mean (accurate formula: Σx/n)
    const sum = numbers.reduce((s, num) => s + num, 0);
    const mean = sum / n;

    // Median (accurate position based) 
    let median;
    const mid = Math.floor(n / 2);
    if (n % 2 === 0) {
        median = (numbers[mid - 1] + numbers[mid]) / 2;
    } else {
        median = numbers[mid];
    }

    // Mode (most frequent value(s))
    const frequencyMap = {};
    numbers.forEach(num => {
        frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    });

    let mode = [];
    let maxFrequency = 0;
    for (const num in frequencyMap) {
        if (frequencyMap[num] > maxFrequency) {
            mode = [parseFloat(num)];
            maxFrequency = frequencyMap[num];
        } else if (frequencyMap[num] === maxFrequency && maxFrequency > 1) {
            mode.push(parseFloat(num));
        }
    }

    if (maxFrequency <= 1) {
        mode = ["No distinct mode"];
    } else if (mode.length > 1) {
        mode = [`${mode.join(', ')} (Multimodal)`];
    } else {
        mode = mode[0]; 
    }

    // Mean Absolute Deviation (accurate Σ|x - mean|)
    const sumAbsoluteDeviations = numbers.reduce((sum, num) => sum + Math.abs(num - mean), 0);
    const mad = sumAbsoluteDeviations / n;

    // Standard Deviation (Population formula Σ(x-μ)²/n)
    const sumSquaredDeviations = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0);
    const variance = sumSquaredDeviations / n; 
    const stdDev = Math.sqrt(variance); 

    return `
Mean: ${mean.toFixed(2)}
Median: ${typeof median === 'number' ? median.toFixed(2) : median}
Mode: ${Array.isArray(mode) ? mode.join(', ') : mode}
MAD: ${mad.toFixed(2)}
Standard Deviation (Pop): ${stdDev.toFixed(2)}
`;
}

export function calculateUngroupedStats(pairs) {
    if (pairs.length == 0) {
        return "Please add at least one value-frequency pair for ungrouped data.";
    }

    let totalFrequency = 0;
    let sumOfValuesTimesFreq = 0;
    const sortedPairs = pairs.sort((a, b) => a.value - b.value);

    sortedPairs.forEach(pair => {
        totalFrequency += pair.frequency;
        sumOfValuesTimesFreq += pair.value * pair.frequency;
    });

    if (totalFrequency == 0) {
        return "Total frequency must be greater than 0.";
    }

    // Mean
    const mean = sumOfValuesTimesFreq / totalFrequency;

    // Median (Accurate for Ungrouped)
    let median = null;
    let cumulativeFrequency = 0;
    if (totalFrequency % 2 != 0) { 
        const medianPosition = (totalFrequency + 1) / 2;
        for (const pair of sortedPairs) {
            cumulativeFrequency += pair.frequency;
            if (cumulativeFrequency >= medianPosition) {
                median = pair.value;
                break;
            }
        }
    } else { 
        const pos1 = totalFrequency / 2;
        const pos2 = totalFrequency / 2 + 1;
        let value1 = null;
        let value2 = null;
        cumulativeFrequency = 0; 
        for (const pair of sortedPairs) {
            cumulativeFrequency += pair.frequency;
            if (cumulativeFrequency >= pos1 && value1 === null) {
                value1 = pair.value;
            }
            if (cumulativeFrequency >= pos2 && value2 === null) {
                value2 = pair.value;
            }
        }
        median = (value1 + value2) / 2;
    }

    // Mode
    let mode = [];
    let maxFrequency = 0;

    for (const pair of sortedPairs) {
        if (pair.frequency > maxFrequency) {
            mode = [pair.value];
            maxFrequency = pair.frequency;
        } else if (pair.frequency === maxFrequency && maxFrequency > 0) {
            mode.push(pair.value);
        }
    }

    if (maxFrequency <= 0) { 
        mode = ["Cannot determine mode"];
    } else if (mode.length === sortedPairs.length && maxFrequency > 0) { 
        mode = ["No distinct mode"];
    } else if (mode.length > 1) {
        mode = [`${mode.join(', ')} (Multimodal)`];
    } else {
        mode = mode[0]; 
    }

    // MAD
    let sumAbsoluteDeviationsTimesFreq = 0;
    sortedPairs.forEach(pair => {
        sumAbsoluteDeviationsTimesFreq += Math.abs(pair.value - mean) * pair.frequency;
    });
    const mad = sumAbsoluteDeviationsTimesFreq / totalFrequency;

    // Standard Deviation (Population)
    let sumSquaredDeviationsTimesFreq = 0;
    sortedPairs.forEach(pair => {
        sumSquaredDeviationsTimesFreq += Math.pow(pair.value - mean, 2) * pair.frequency;
    });
    const variance = sumSquaredDeviationsTimesFreq / totalFrequency; 
    const stdDev = Math.sqrt(variance); 

    return `
Mean: ${mean.toFixed(2)}
Median: ${typeof median === 'number' ? median.toFixed(2) : median}
Mode: ${Array.isArray(mode) ? mode.join(', ') : mode}
MAD: ${mad.toFixed(2)}
Standard Deviation (Pop.): ${stdDev.toFixed(2)}
`;
}

export function calculateGroupedStats(intervals) {
    if (intervals.length == 0) {
        return "Please add at least one class interval and frequency pair for grouped data.";
    }

    let totalFrequency = 0;
    let sumOfMidpointsTimesFrequency = 0;
    const sortedIntervals = intervals.sort((a, b) => a.lower - b.lower);

    for (const interval of sortedIntervals) {
        if (isNaN(interval.lower) || isNaN(interval.upper) || isNaN(interval.frequency) || interval.lower >= interval.upper || interval.frequency < 0) {
            return "Invalid input: Ensure lower bound < upper bound and frequency is non-negative.";
        }
        const midpoint = (interval.lower + interval.upper) / 2;
        totalFrequency += interval.frequency;
        sumOfMidpointsTimesFrequency += midpoint * interval.frequency;
    }

    if (totalFrequency == 0) {
        return "Total frequency must be greater than 0.";
    }

    // Mean (Estimated from midpoints)
    const mean = sumOfMidpointsTimesFrequency / totalFrequency;

    // Median (requires cumulative frequency)
    let median = "Could not calculate median (Complex, requires formula)"; 
    let cumulativeFrequency = 0;
    const medianPosition = totalFrequency / 2; 
    let medianClass = null;
    let previousCumulativeFrequency = 0;

    cumulativeFrequency = 0; 
    for (let i = 0; i < sortedIntervals.length; i++) {
        cumulativeFrequency += sortedIntervals[i].frequency;
        if (cumulativeFrequency >= medianPosition) {
            medianClass = sortedIntervals[i];
            previousCumulativeFrequency = i > 0 ? cumulativeFrequency - sortedIntervals[i].frequency : 0;
            const lowerBoundMedianClass = medianClass.lower;
            const medianClassFrequency = medianClass.frequency;
            const classWidth = medianClass.upper - medianClass.lower;

            if (medianClassFrequency > 0 && classWidth > 0) {
                median = lowerBoundMedianClass + ((medianPosition - previousCumulativeFrequency) / medianClassFrequency) * classWidth;
            } else {
                median = "Could not calculate median (Zero frequency or width in median class)"; 
            }
            break; 
        }
    }

    // Mode (requires modal class - highest frequency)
    let modalClass = null;
    let highestFrequency = 0;

    for (const interval of sortedIntervals) {
        if (interval.frequency > highestFrequency) {
            highestFrequency = interval.frequency;
            modalClass = interval;
        } else if (interval.frequency === highestFrequency && highestFrequency > 0) {
        }
    }

    let mode = "Could not calculate mode (Complex, requires formula)"; 

    const modalClasses = sortedIntervals.filter(i => i.frequency === highestFrequency && highestFrequency > 0);

    if (modalClasses.length > 1) {
        mode = `Multimodal (Modal Classes: ${modalClasses.map(c => `${c.lower}-${c.upper}`).join(', ')})`;
    } else if (modalClasses.length === 1) {
        modalClass = modalClasses[0];
        const modalIndex = sortedIntervals.findIndex(interval => interval === modalClass);
        const freqBefore = modalIndex > 0 ? sortedIntervals[modalIndex - 1].frequency : 0;
        const freqAfter = modalIndex < sortedIntervals.length - 1 ? sortedIntervals[modalIndex + 1].frequency : 0;

        const d1 = highestFrequency - freqBefore;
        const d2 = highestFrequency - freqAfter;
        const lowerBoundModalClass = modalClass.lower;
        const modalClassWidth = modalClass.upper - modalClass.lower;

        if (modalClassWidth > 0 && highestFrequency > 0) { 
            if (d1 + d2 !== 0) { 
                mode = lowerBoundModalClass + (d1 / (d1 + d2)) * modalClassWidth;
            } else { 
                mode = (modalClass.lower + modalClass.upper) / 2;
            }
        } else {
            mode = "Could not calculate mode (Zero frequency, class width, or invalid interval)"; 
        }
    } else { 
        mode = "Could not calculate mode (No unique modal class or zero frequencies)";
    }

    // MAD (Estimated)
    let sumAbsoluteDeviationsTimesFreq = 0;
    sortedIntervals.forEach(interval => {
        const midpoint = (interval.lower + interval.upper) / 2;
        sumAbsoluteDeviationsTimesFreq += Math.abs(midpoint - mean) * interval.frequency;
    });
    const mad = sumAbsoluteDeviationsTimesFreq / totalFrequency;

    // Standard Deviation (Estimated Population)
    let sumSquaredDeviationsTimesFreq = 0;
    sortedIntervals.forEach(interval => {
        const midpoint = (interval.lower + interval.upper) / 2;
        sumSquaredDeviationsTimesFreq += Math.pow(midpoint - mean, 2) * interval.frequency;
    });
    const variance = sumSquaredDeviationsTimesFreq / totalFrequency; 
    const stdDev = Math.sqrt(variance); 

    return `
Mean (Estimated): ${mean.toFixed(2)}
Median (Estimated): ${typeof median === 'number' ? median.toFixed(2) : median}
Mode (Estimated): ${typeof mode === 'number' ? mode.toFixed(2) : mode}
MAD (Estimated): ${mad.toFixed(2)}
Standard Deviation (Estimated Pop.): ${stdDev.toFixed(2)}
`;
}