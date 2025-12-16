/*
 * Timer for tracking elapsed time (singleton).
 */

'use strict';

import { logger } from "./logger.js";

class Timer
{
    #timers = {};

    constructor() {}

    reset()
    {
        this.#timers = {};
    }

    start(label)
    {
        this.#timers[label] ??= [];
        this.#timers[label].push(performance.now());
    }

    stop(label)
    {
        if (this.#timers[label] !== undefined)
        {
            const startTime = this.#timers[label].pop();
            const elapsed = performance.now() - startTime
            this.#timers[label].push(elapsed);
        }
    }

    showReport()
    {
        const lines = [];
        let maxLabelLength = 0;
        for (const [label, times] of Object.entries(this.#timers))
        {
            if (label.length > maxLabelLength) maxLabelLength = label.length;
        }
        maxLabelLength++;
        lines.push('Timer results:');
        let hLine = '+' + '-'.repeat(maxLabelLength + 1) + ('+' + '-'.repeat(11)).repeat(4) + '+';
        lines.push(hLine);
        let line = '| label'.padEnd(maxLabelLength + 2, ' ') + '| Calls (#) | Avg (ms)  | Min (ms)  | Max (ms)  |';
        lines.push(line);
        lines.push(hLine);
        for (const [label, times] of Object.entries(this.#timers))
        {
            const total = times.reduce((a, b) => a + b, 0);
            line = '| ' + label.padEnd(maxLabelLength) + '|';
            line += ' ' + times.length.toString().padEnd(10, ' ') + '|';
            line += ' ' + (total / times.length).toFixed(1).padEnd(10, ' ') + '|';
            line += ' ' + Math.min(...times).toFixed(1).padEnd(10, ' ') + '|';
            line += ' ' + Math.max(...times).toFixed(1).padEnd(10, ' ') + '|';
            lines.push(line);
        }
        lines.push(hLine);
        for (line of lines)
        {
            logger.info(logger.LEVEL_TIMER, line);
        }
    }
}

export const timer = new Timer();
