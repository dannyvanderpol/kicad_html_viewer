/*
 * Timer for tracking elapsed time (singleton).
 */

class Timer
{
    #timers = {};

    constructor() {}

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
            const elapsed = Math.round((performance.now() - startTime) * 10) / 10;
            this.#timers[label].push(elapsed);
        }
    }

    showReport()
    {
        const report = {};
        for (const [label, times] of Object.entries(this.#timers))
        {
            const total = times.reduce((a, b) => a + b, 0);
            report[label] = {
                'Calls (#)': times.length,
                'Avg (ms)': Math.round((total / times.length) * 10) / 10,
                'Min (ms)': Math.min(...times),
                'Max (ms)': Math.max(...times)
            };
        }
        console.table(report);
    }
}

export const timer = new Timer();
