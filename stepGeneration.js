export function generateRawSteps(data) {
    const numbers = data.split(',')
        .map(s => parseFloat(s.trim()))
        .filter(n => !isNaN(n));

    if (numbers.length == 0) {
        return {
            general: "<p>No valid numbers entered for raw data.</p>",
            mean: "",
            median: "",
            mode: "",
            mad: "",
            stddev: ""
        };
    }

    const n = numbers.length;
    const originalNumbers = [...numbers];
    numbers.sort((a, b) => a - b);

    const generalIntro = `
        <h3>Input Data</h3>
        <p><strong>Input Data:</strong> ${originalNumbers.join(', ')}</p>
        <p><strong>Sorted Data:</strong> ${numbers.join(', ')}</p>
        <p>Total number of data points (n) = ${n}</p>
    `;

    // Mean Steps
    let meanHtml = '<h4>Mean (x̄)</h4>';
    const sum = numbers.reduce((s, num) => s + num, 0);
    const mean = sum / n;
    meanHtml += `<p>1. Sum all the numbers (&Sigma;x).</p>`;
    meanHtml += `<p class="calculation">&Sigma;x = ${numbers.join(' + ')} = ${sum}</p>`;
    meanHtml += `<p>2. Divide the sum by the total count of numbers (n).</p>`;
    meanHtml += `<p><strong>Formula:</strong> x̄ = &Sigma;x / n</p>`;
    meanHtml += `<p class="calculation">x̄ = ${sum} / ${n} = ${mean.toFixed(2)}</p>`;

    // Median Steps
    let medianHtml = '<h4>Median</h4>';
    medianHtml += `<p>1. Sort the data in ascending order: ${numbers.join(', ')}</p>`;
    const mid = Math.floor(n / 2);
    let medianValue;
    if (n % 2 === 0) {
        const val1 = numbers[mid - 1];
        const val2 = numbers[mid];
        medianValue = (val1 + val2) / 2;
        medianHtml += `<p>2. The total count (${n}) is even. The median is the average of the two middle numbers.</p>`;
        medianHtml += `<p><strong>Formula (Position):</strong> Position of middle values are N/2 and (N/2) + 1.</p>`;
        medianHtml += `<p class="calculation">Positions: ${n}/2 = ${mid} and ${n}/2 + 1 = ${mid + 1} (in a 1-based index, corresponding to array indices ${mid - 1} and ${mid}).</p>`;
        medianHtml += `<p>3. The numbers at these positions in the sorted data are ${val1} and ${val2}.</p>`;
        medianHtml += `<p><strong>Formula (Median):</strong> Median = (Value at N/2 + Value at (N/2)+1) / 2</p>`;
        medianHtml += `<p class="calculation">Median = (${val1} + ${val2}) / 2 = ${medianValue.toFixed(2)}</p>`;

    } else {
        medianValue = numbers[mid];
        medianHtml += `<p>2. The total count (${n}) is odd. The median is the middle number.</p>`;
        medianHtml += `<p><strong>Formula (Position):</strong> Position of the middle value is (N + 1) / 2.</p>`;
        medianHtml += `<p class="calculation">Position: (${n} + 1) / 2 = ${mid + 1} (in a 1-based index, corresponding to array index ${mid}).</p>`;
        medianHtml += `<p>3. The number at this position in the sorted data is ${medianValue}.</p>`;
    }
    medianHtml += `<p><strong>Median:</strong> ${typeof medianValue === 'number' ? medianValue.toFixed(2) : medianValue}</p>`;

    // Mode Steps
    let modeHtml = '<h4>Mode</h4>';
    modeHtml += `<p>1. Count the frequency of each number in the data.</p>`;
    const frequencyMap = {};
    numbers.forEach(num => {
        frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    });

    let freqTableHtml = '<ul>';
    for (const num in frequencyMap) {
        freqTableHtml += `<li>Number ${num}: ${frequencyMap[num]} time(s)</li>`;
    }
    freqTableHtml += '</ul>';
    modeHtml += freqTableHtml;

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

    modeHtml += `<p>2. Identify the highest frequency: ${maxFrequency}.</p>`;
    modeHtml += `<p>3. The mode is the number(s) that appear(s) with this highest frequency.</p>`;

    if (maxFrequency <= 1) {
        modeHtml += "<p>Since the highest frequency is 1, there is no distinct mode.</p>";
        modeHtml += `<p><strong>Mode:</strong> No distinct mode</p>`;
    } else if (mode.length > 1) {
        modeHtml += `<p>Multiple numbers have this highest frequency (${maxFrequency}). These numbers are: ${mode.join(', ')}.</p>`;
        modeHtml += `<p><strong>Mode:</strong> ${mode.join(', ')} (Multimodal)</p>`;
    } else {
        modeHtml += `<p>The number with the highest frequency is ${mode[0]}.</p>`;
        modeHtml += `<p><strong>Mode:</strong> ${mode[0]}</p>`;
    }

    // MAD Steps
    let madHtml = '<h4>Mean Absolute Deviation (MAD)</h4>';
    madHtml += `<p>1. Calculate the mean (x̄) of the data: ${mean.toFixed(2)}.</p>`;
    madHtml += `<p>2. Calculate the absolute deviation (|x - x̄|) of each number from the mean.</p>`;
    madHtml += `<p class="calculation">Absolute Deviations: ${numbers.map(num => `|${num} - ${mean.toFixed(2)}| = ${Math.abs(num - mean).toFixed(2)}`).join(', ')}</p>`;
    const sumAbsoluteDeviations = numbers.reduce((sum, num) => sum + Math.abs(num - mean), 0);
    madHtml += `<p>3. Sum these absolute deviations: &Sigma;|x - x̄| = ${sumAbsoluteDeviations.toFixed(2)}</p>`;
    madHtml += `<p>4. Divide the sum by the total count of numbers (n).</p>`;
    madHtml += `<p><strong>Formula:</strong> MAD = &Sigma;|x - x̄| / n</p>`;
    const mad = sumAbsoluteDeviations / n;
    madHtml += `<p class="calculation">MAD = ${sumAbsoluteDeviations.toFixed(2)} / ${n} = ${mad.toFixed(2)}</p>`;
    madHtml += `<p><strong>MAD:</strong> ${mad.toFixed(2)}</p>`;

    // Standard Deviation Steps
    let stddevHtml = '<h4>Standard Deviation And Variance (Population)</h4>';
    stddevHtml += `<p>1. Calculate the mean (x̄) of the data: ${mean.toFixed(2)}.</p>`;
    stddevHtml += `<p>2. Calculate the squared deviation ((x - x̄)&sup2;) of each number from the mean.</p>`;
    stddevHtml += `<p class="calculation">Squared Deviations: ${numbers.map(num => `(${num} - ${mean.toFixed(2)})&sup2; = ${Math.pow(num - mean, 2).toFixed(2)}`).join(', ')}</p>`;
    const sumSquaredDeviations = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0);
    stddevHtml += `<p>3. Sum these squared deviations: &Sigma;(x - x̄)&sup2; = ${sumSquaredDeviations.toFixed(2)}</p>`;
    stddevHtml += `<p>4. Divide the sum by the total count of numbers (n) to find the variance (&sigma;&sup2;).</p>`;
    stddevHtml += `<p><strong>Formula (Variance):</strong> &sigma;&sup2; = &Sigma;(x - x̄)&sup2; / n</p>`;
    const variance = sumSquaredDeviations / n;
    stddevHtml += `<p class="calculation">&sigma;&sup2; = ${sumSquaredDeviations.toFixed(2)} / ${n} = ${variance.toFixed(2)}</p>
   <p> <strong>Variance</strong>: ${variance.toFixed(2)}</p><br/>
    `;
    stddevHtml += `<p>5. Take the square root of the variance to find the standard deviation (&sigma;).</p>`;
    stddevHtml += `<p><strong>Formula (Standard Deviation):</strong> &sigma; = &radic;&sigma;&sup2;</p>`;
    const stdDev = Math.sqrt(variance);
    stddevHtml += `<p class="calculation">&sigma; = &radic;(${variance.toFixed(2)}) = ${stdDev.toFixed(2)}</p>`;
    stddevHtml += `<p><strong>Standard Deviation:</strong> ${stdDev.toFixed(2)}</p>
    `;

    return {
        general: generalIntro,
        mean: meanHtml,
        median: medianHtml,
        mode: modeHtml,
        mad: madHtml,
        stddev: stddevHtml
    };
}

export function generateUngroupedSteps(pairs) {
    if (pairs.length == 0) {
        return {
            general: "<p>No value-frequency pairs entered for ungrouped data.</p>",
            mean: "",
            median: "",
            mode: "",
            mad: "",
            stddev: ""
        };
    }

    const sortedPairs = pairs.sort((a, b) => a.value - b.value);
    let totalFrequency = 0;
    let sumOfValuesTimesFreq = 0;

    // Calculate Mean first for use in other calculations
    sortedPairs.forEach(pair => {
        totalFrequency += pair.frequency;
        sumOfValuesTimesFreq += pair.value * pair.frequency;
    });

    if (totalFrequency == 0) {
        return {
            general: "<p>Total frequency is zero, cannot calculate stats.</p>",
            mean: "",
            median: "",
            mode: "",
            mad: "",
            stddev: ""
        };
    }
    const mean = sumOfValuesTimesFreq / totalFrequency;

    // Gather data for frequency table
    let cumulativeFreq = 0;
    let sumAbsoluteDeviationsTimesFreq = 0;
    let sumSquaredDeviationsTimesFreq = 0;

    const tableData = sortedPairs.map(pair => {
        cumulativeFreq += pair.frequency;
        const valueTimesFreq = pair.value * pair.frequency;
        const absoluteDeviation = Math.abs(pair.value - mean);
        const absoluteDeviationTimesFreq = absoluteDeviation * pair.frequency;
        const squaredDeviation = Math.pow(pair.value - mean, 2);
        const squaredDeviationTimesFreq = squaredDeviation * pair.frequency;

        sumAbsoluteDeviationsTimesFreq += absoluteDeviationTimesFreq;
        sumSquaredDeviationsTimesFreq += squaredDeviationTimesFreq;

        return {
            value: pair.value,
            frequency: pair.frequency,
            cumFrequency: cumulativeFreq,
            valueTimesFreq: valueTimesFreq.toFixed(2), // For Mean
            absDeviation: absoluteDeviation.toFixed(2), // For MAD
            absDeviationTimesFreq: absoluteDeviationTimesFreq.toFixed(2), // For MAD
            squaredDeviation: squaredDeviation.toFixed(2), // For Std Dev
            squaredDeviationTimesFreq: squaredDeviationTimesFreq.toFixed(2) // For Std Dev
        };
    });

    // Create frequency distribution table
    let tableHtml = `
    <h3>Frequency Distribution Table</h3>
    <div class="table-container">
        <table class="frequency-table">
            <thead>
                <tr>
                    <th>Value (x)</th>
                    <th>Frequency (f)</th>
                    <th>x × f</th>
                    <th>|x - x̄|</th> 
                    <th>|x - x̄| × f</th>
                    <th>(x - x̄)²</th>
                    <th>(x - x̄)² × f</th>
                    <th>Cumulative Frequency</th>
                    <th>Relative Frequency</th>
                    <th>Cumulative Relative Frequency</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    tableData.forEach(row => {
        const relativeFreq = (row.frequency / totalFrequency).toFixed(4);
        const cumRelativeFreq = (row.cumFrequency / totalFrequency).toFixed(4);
        tableHtml += `
            <tr>
                <td>${row.value}</td>
                <td>${row.frequency}</td>
                <td>${row.valueTimesFreq}</td>
                <td>${row.absDeviation}</td>
                <td>${row.absDeviationTimesFreq}</td>
                <td>${row.squaredDeviation}</td>
                <td>${row.squaredDeviationTimesFreq}</td>
                <td>${row.cumFrequency}</td>
                <td>${relativeFreq} (${(relativeFreq * 100).toFixed(2)}%)</td>
                <td>${cumRelativeFreq} (${(cumRelativeFreq * 100).toFixed(2)}%)</td>
            </tr>
        `;
    });
    
    tableHtml += `
            <tr class="total-row">
                <td><strong>Total</strong></td>
                <td><strong>${totalFrequency}</strong></td>
                <td><strong>${sumOfValuesTimesFreq.toFixed(2)}</strong></td>
                <td>-</td>
                <td><strong>${sumAbsoluteDeviationsTimesFreq.toFixed(2)}</strong></td>
                <td>-</td>
                <td><strong>${sumSquaredDeviationsTimesFreq.toFixed(2)}</strong></td>
                <td>-</td>
                <td><strong>1.0000 (100.00%)</strong></td>
                <td>-</td>
            </tr>
            </tbody>
        </table>
    </div>`;

    // Mean Steps
    let meanHtml = '<h4>Mean</h4>';
    meanHtml += `<p>1. Calculate the sum of (Value × Frequency) for each pair.</p>`;
    let sumSteps = sortedPairs.map(pair => `${pair.value} × ${pair.frequency}`).join(' + ');
    meanHtml += `<p>Sum Σ(f × x) = ${sumSteps} = ${sumOfValuesTimesFreq.toFixed(2)}</p>`;
    meanHtml += `<p>2. Divide the sum by the total frequency (Σf = ${totalFrequency}): ${sumOfValuesTimesFreq.toFixed(2)} / ${totalFrequency} = ${mean.toFixed(2)}</p>`;
    meanHtml += `<p><strong>Mean:</strong> ${mean.toFixed(2)}</p>`;

    // Median Steps
    let medianHtml = '<h4>Median</h4>';
    medianHtml += `<p>1. Sort the data by value.</p>`;
    medianHtml += `<p>2. Calculate the position of the median using the total frequency (N = ${totalFrequency}).</p>`;

    let median = null;
    let cumulativeFrequency = 0;

    if (totalFrequency % 2 != 0) { // Odd N
        const medianPosition = (totalFrequency + 1) / 2;
        medianHtml += `<p>Position = (N + 1) / 2 = (${totalFrequency} + 1) / 2 = ${medianPosition}</p>`;
        medianHtml += `<p>3. Find the value where the cumulative frequency first reaches or exceeds ${medianPosition}.</p>`;
        let foundValue = null;
        cumulativeFrequency = 0; // Reset
        medianHtml += '<p>Cumulative Frequencies:</p><ul>';
        for (const pair of sortedPairs) {
            cumulativeFrequency += pair.frequency;
            medianHtml += `<li>Value ${pair.value}: Cumulative Freq = ${cumulativeFrequency}</li>`;
            if (cumulativeFrequency >= medianPosition && foundValue === null) {
                median = pair.value;
                foundValue = pair.value; // Mark as found
            }
        }
        medianHtml += '</ul>';
        medianHtml += `<p>The value at this position is ${median}.</p>`;
        medianHtml += `<p><strong>Median:</strong> ${median.toFixed(2)}</p>`;

    } else { // Even N
        const pos1 = totalFrequency / 2;
        const pos2 = totalFrequency / 2 + 1;
        medianHtml += `<p>Positions = N / 2 and (N / 2) + 1 = ${pos1} and ${pos2}</p>`;
        medianHtml += `<p>3. Find the values at these positions using cumulative frequency.</p>`;
        let value1 = null;
        let value2 = null;
        cumulativeFrequency = 0; // Reset
        medianHtml += '<p>Cumulative Frequencies:</p><ul>';
        for (const pair of sortedPairs) {
            cumulativeFrequency += pair.frequency;
            medianHtml += `<li>Value ${pair.value}: Cumulative Freq = ${cumulativeFrequency}</li>`;
            if (cumulativeFrequency >= pos1 && value1 === null) {
                value1 = pair.value;
            }
            if (cumulativeFrequency >= pos2 && value2 === null) {
                value2 = pair.value;
            }
        }
        medianHtml += '</ul>';
        medianHtml += `<p>The values at positions ${pos1} and ${pos2} are ${value1} and ${value2}.</p>`;
        median = (value1 + value2) / 2;
        medianHtml += `<p>4. The median is the average of these two values: (${value1} + ${value2}) / 2 = ${median.toFixed(2)}</p>`;
        medianHtml += `<p><strong>Median:</strong> ${median.toFixed(2)}</p>`;
    }

    // Mode Steps
    let modeHtml = '<h4>Mode</h4>';
    modeHtml += `<p>1. Identify the value(s) with the highest frequency.</p>`;

    let mode = [];
    let maxFrequency = 0;
    const frequencyMap = {}; // For mode
    sortedPairs.forEach(pair => frequencyMap[pair.value] = pair.frequency);

    let freqList = '<ul>';
    for (const value in frequencyMap) {
        freqList += `<li>Value ${value}: Frequency = ${frequencyMap[value]}</li>`;
        if (frequencyMap[value] > maxFrequency) {
            maxFrequency = frequencyMap[value];
        }
    }
    freqList += '</ul>';
    modeHtml += freqList;
    modeHtml += `<p>Highest Frequency observed: ${maxFrequency}</p>`;

    if (maxFrequency <= 0) {
        modeHtml += `<p>No values have frequencies greater than zero.</p>`;
        modeHtml += `<p><strong>Mode:</strong> Cannot determine mode</p>`;
    } else {
        mode = [];
        for (const value in frequencyMap) {
            if (frequencyMap[value] === maxFrequency) {
                mode.push(parseFloat(value));
            }
        }
        modeHtml += `<p>2. The value(s) with frequency ${maxFrequency} are: ${mode.join(', ')}.</p>`;

        if (mode.length === sortedPairs.length && maxFrequency > 0) {
            modeHtml += "<p>All values appear with the same maximum frequency.</p>";
            modeHtml += `<p><strong>Mode:</strong> No distinct mode</p>`;
        } else if (mode.length > 1) {
            modeHtml += `<p><strong>Mode:</strong> ${mode.join(', ')} (Multimodal)</p>`;
        } else {
            modeHtml += `<p><strong>Mode:</strong> ${mode[0]}</p>`;
        }
    }

    // MAD Steps
    let madHtml = '<h4>Mean Absolute Deviation (MAD)</h4>';
    madHtml += `<p>1. Calculate the absolute deviation of each value from the mean.</p>`;
    madHtml += `<p>2. Multiply each absolute deviation by its frequency and sum them: ${sortedPairs.map(pair => `${Math.abs(pair.value - mean)} × ${pair.frequency}`).join(' + ')} = ${sortedPairs.reduce((sum, pair) => sum + Math.abs(pair.value - mean) * pair.frequency, 0)}</p>`;
    madHtml += `<p>3. Divide the sum by the total frequency (N = ${totalFrequency}): ${sortedPairs.reduce((sum, pair) => sum + Math.abs(pair.value - mean) * pair.frequency, 0)} / ${totalFrequency}</p>`;
    const mad = sortedPairs.reduce((sum, pair) => sum + Math.abs(pair.value - mean) * pair.frequency, 0) / totalFrequency;
    madHtml += `<p><strong>MAD:</strong> ${mad.toFixed(2)}</p>`;

    // Standard Deviation Steps
    let stddevHtml = '<h4>Standard Deviation (Population)</h4>';
    stddevHtml += `<p>1. Calculate the squared deviation of each value from the mean.</p>`;
    stddevHtml += `<p>2. Multiply each squared deviation by its frequency and sum them: ${sortedPairs.map(pair => `${Math.pow(pair.value - mean, 2)} × ${pair.frequency}`).join(' + ')} = ${sortedPairs.reduce((sum, pair) => sum + Math.pow(pair.value - mean, 2) * pair.frequency, 0)}</p>`;
    stddevHtml += `<p>3. Divide the sum by the total frequency (N = ${totalFrequency}): ${sortedPairs.reduce((sum, pair) => sum + Math.pow(pair.value - mean, 2) * pair.frequency, 0)} / ${totalFrequency}</p>`;
    const variance = sortedPairs.reduce((sum, pair) => sum + Math.pow(pair.value - mean, 2) * pair.frequency, 0) / totalFrequency;
    stddevHtml += `<p>4. Take the square root of the variance to find the standard deviation: sqrt(${variance})</p>`;
    const stdDev = Math.sqrt(variance);
    stddevHtml += `<p><strong>Standard Deviation (Pop.):</strong> ${stdDev.toFixed(2)}</p>`;

    return {
        general: tableHtml,
        mean: meanHtml,
        median: medianHtml,
        mode: modeHtml,
        mad: madHtml,
        stddev: stddevHtml
    };
}

export function generateGroupedSteps(intervals) {
    if (intervals.length == 0) {
        return {
            general: "<p>No class interval and frequency pairs entered for grouped data.</p>",
            mean: "",
            median: "",
            mode: "",
            mad: "",
            stddev: ""
        };
    }

    const sortedIntervals = intervals.sort((a, b) => a.lower - b.lower);
    let totalFrequency = 0;
    let sumOfMidpointsTimesFrequency = 0;

    // Gather data for frequency table
    let cumulativeFreq = 0;
    const tableData = sortedIntervals.map(interval => {
        const midpoint = (interval.lower + interval.upper) / 2;
        const width = interval.upper - interval.lower;
        const lowerBoundary = interval.lower - 0.5 * (width > 1 ? 1 : 0.1);
        const upperBoundary = interval.upper + 0.5 * (width > 1 ? 1 : 0.1);
        
        totalFrequency += interval.frequency;
        sumOfMidpointsTimesFrequency += midpoint * interval.frequency;
        cumulativeFreq += interval.frequency;
        
        return {
            interval: `${interval.lower} - ${interval.upper}`,
            lowerBound: interval.lower,
            upperBound: interval.upper,
            lowerBoundary: lowerBoundary.toFixed(2),
            upperBoundary: upperBoundary.toFixed(2),
            midpoint: midpoint.toFixed(2),
            width: width.toFixed(2),
            frequency: interval.frequency,
            cumFrequency: cumulativeFreq
        };
    });

    // Create frequency distribution table
    let tableHtml = `
    <h3>Frequency Distribution Table</h3>
    <div class="table-container">
        <table class="frequency-table">
            <thead>
                <tr>
                    <th>Class Interval</th>
                    <th>Class Boundaries</th>
                    <th>Midpoint (x)</th>
                    <th>Frequency (f)</th>
                    <th>x × f</th>
                    <th>|x - x̄|</th>
                    <th>|x - x̄| × f</th>
                    <th>(x - x̄)²</th>
                    <th>(x - x̄)² × f</th>
                    <th>Cumulative Frequency</th>
                    <th>Relative Frequency</th>
                    <th>Class Size</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    tableData.forEach(row => {
        const relativeFreq = (row.frequency / totalFrequency).toFixed(4);
        const cumRelativeFreq = (row.cumFrequency / totalFrequency).toFixed(4);
        tableHtml += `
            <tr>
                <td>${row.interval}</td>
                <td>${row.lowerBoundary} - ${row.upperBoundary}</td>
                <td>${row.midpoint}</td>
                <td>${row.frequency}</td>
                <td>${(row.midpoint * row.frequency).toFixed(2)}</td>
                <td>${Math.abs(row.midpoint - (sumOfMidpointsTimesFrequency / totalFrequency)).toFixed(2)}</td>
                <td>${Math.abs(row.midpoint - (sumOfMidpointsTimesFrequency / totalFrequency)) * row.frequency}</td>
                <td>${Math.pow(row.midpoint - (sumOfMidpointsTimesFrequency / totalFrequency), 2).toFixed(2)}</td>
                <td>${Math.pow(row.midpoint - (sumOfMidpointsTimesFrequency / totalFrequency), 2) * row.frequency}</td>
                <td>${row.cumFrequency}</td>
                <td>${relativeFreq} (${(relativeFreq * 100).toFixed(2)}%)</td>
                <td>${row.upperBoundary-row.lowerBoundary}</td>
            </tr>
        `;
    });
    
    tableHtml += `
            <tr class="total-row">
                <td colspan="4"><strong>Total</strong></td>
                <td><strong>${totalFrequency}</strong></td>
                <td><strong>${sumOfMidpointsTimesFrequency.toFixed(2)}</strong></td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
            </tr>
            </tbody>
        </table>
    </div>`;

    let generalInfo = `<p><strong>Input Data (Class Interval, Frequency):</strong></p>`;
    generalInfo += tableHtml;
    generalInfo += `<p>Total Frequency (N): ${totalFrequency}</p>`;

    if (totalFrequency == 0) {
        return {
            general: generalInfo,
            mean: "<p>Total frequency is zero, cannot calculate stats.</p>",
            median: "",
            mode: "",
            mad: "",
            stddev: ""
        };
    }

    // Mean Steps
    let meanHtml = '<h4>Mean (Estimated)</h4>';
    const mean = sumOfMidpointsTimesFrequency / totalFrequency;
    meanHtml += `<p>1. Calculate the midpoint for each class interval ((lower + upper) / 2).</p>`;
    meanHtml += `<p>2. Calculate the sum of (Midpoint × Frequency) for each class interval.</p>`;
    let sumSteps = sortedIntervals.map(interval => {
        const midpoint = (interval.lower + interval.upper) / 2;
        return `(${interval.lower}+${interval.upper})/2 × ${interval.frequency} = ${midpoint.toFixed(2)} × ${interval.frequency} = ${(midpoint * interval.frequency).toFixed(2)}`;
    }).join(' + ');
    meanHtml += `<p>Sum Σ(f × m) = ${sumSteps} = ${sumOfMidpointsTimesFrequency.toFixed(2)}</p>`;
    meanHtml += `<p>3. Divide the sum by the total frequency (Σf = ${totalFrequency}): ${sumOfMidpointsTimesFrequency.toFixed(2)} / ${totalFrequency} = ${mean.toFixed(2)}</p>`;
    meanHtml += `<p><strong>Mean:</strong> ${mean.toFixed(2)}</p>`;

    // Median Steps
    let medianHtml = '<h4>Median (Estimated)</h4>';
    medianHtml += `<p>1. Sort the data by lower bound of class interval and calculate cumulative frequencies.</p>`;
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

    medianHtml += `<p>2. The median class is from ${medianClass.lower} to ${medianClass.upper}.</p>`;
    medianHtml += `<p>3. Calculate the median using the formula: L + ((N/2 - Cf) / f) * h</p>`;
    medianHtml += `<p>Where L = ${medianClass.lower}, Cf = ${previousCumulativeFrequency}, f = ${medianClass.frequency}, and h = ${medianClass.upper - medianClass.lower}</p>`;
    medianHtml += `<p>Median = ${medianClass.lower} + ((${medianPosition} - ${previousCumulativeFrequency}) / ${medianClass.frequency}) * ${medianClass.upper - medianClass.lower} = ${median}</p>`;
    medianHtml += `<p><strong>Median:</strong> ${median}</p>`;

    // Mode Steps
    let modeHtml = '<h4>Mode</h4>';
    modeHtml += `<p>1. Identify the class interval with the highest frequency.</p>`;
    let modalClass = null;
    let highestFrequency = 0;

    for (const interval of sortedIntervals) {
        if (interval.frequency > highestFrequency) {
            highestFrequency = interval.frequency;
            modalClass = interval;
        }
    }

    let mode = "Could not calculate mode (Complex, requires formula)";
    modeHtml += `<p>2. The highest frequency is ${highestFrequency}.</p>`;
    modeHtml += `<p>3. The class interval with this frequency is from ${modalClass.lower} to ${modalClass.upper}.</p>`;

    // Calculate mode using the formula for grouped data
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

    modeHtml += `<p>4. Calculate the mode using the formula: L + (d1 / (d1 + d2)) * h</p>`;
    modeHtml += `<p>Where L = ${lowerBoundModalClass}, d1 = ${d1}, d2 = ${d2}, and h = ${modalClassWidth}</p>`;
    modeHtml += `<p>Mode = ${lowerBoundModalClass} + (${d1} / (${d1} + ${d2})) * ${modalClassWidth} = ${mode}</p>`;
    modeHtml += `<p><strong>Mode:</strong> ${mode}</p>`;

    // MAD Steps
    let madHtml = '<h4>Mean Absolute Deviation (MAD)</h4>';
    madHtml += `<p>1. Calculate the absolute deviation of each midpoint from the mean.</p>`;
    madHtml += `<p>2. Multiply each absolute deviation by its frequency and sum them: ${sortedIntervals.map(interval => {
        const midpoint = (interval.lower + interval.upper) / 2;
        return `${Math.abs(midpoint - mean)} × ${interval.frequency}`;
    }).join(' + ')} = ${sortedIntervals.reduce((sum, interval) => sum + Math.abs((interval.lower + interval.upper) / 2 - mean) * interval.frequency, 0)}</p>`;
    madHtml += `<p>3. Divide the sum by the total frequency (N = ${totalFrequency}): ${sortedIntervals.reduce((sum, interval) => sum + Math.abs((interval.lower + interval.upper) / 2 - mean) * interval.frequency, 0)} / ${totalFrequency}</p>`;
    const mad = sortedIntervals.reduce((sum, interval) => sum + Math.abs((interval.lower + interval.upper) / 2 - mean) * interval.frequency, 0) / totalFrequency;
    madHtml += `<p><strong>MAD:</strong> ${mad.toFixed(2)}</p>`;

    // Standard Deviation Steps
    let stddevHtml = '<h4>Standard Deviation (Estimated Population)</h4>';
    stddevHtml += `<p>1. Calculate the squared deviation of each midpoint from the mean.</p>`;
    stddevHtml += `<p>2. Multiply each squared deviation by its frequency and sum them: ${sortedIntervals.map(interval => {
        const midpoint = (interval.lower + interval.upper) / 2;
        return `${Math.pow(midpoint - mean, 2)} × ${interval.frequency}`;
    }).join(' + ')} = ${sortedIntervals.reduce((sum, interval) => sum + Math.pow((interval.lower + interval.upper) / 2 - mean, 2) * interval.frequency, 0)}</p>`;
    stddevHtml += `<p>3. Divide the sum by the total frequency (N = ${totalFrequency}): ${sortedIntervals.reduce((sum, interval) => sum + Math.pow((interval.lower + interval.upper) / 2 - mean, 2) * interval.frequency, 0)} / ${totalFrequency}</p>`;
    const variance = sortedIntervals.reduce((sum, interval) => sum + Math.pow((interval.lower + interval.upper) / 2 - mean, 2) * interval.frequency, 0) / totalFrequency;
    stddevHtml += `<p>4. Take the square root of the variance to find the standard deviation: sqrt(${variance})</p>`;
    const stdDev = Math.sqrt(variance);
    stddevHtml += `<p><strong>Standard Deviation (Estimated Pop.):</strong> ${stdDev.toFixed(2)}</p>`;

    return {
        general: generalInfo,
        mean: meanHtml,
        median: medianHtml,
        mode: modeHtml,
        mad: madHtml,
        stddev: stddevHtml
    };
}