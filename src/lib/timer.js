/*
 * Timer for tracking elapsed time (singleton).
 */

class Timer
{
    #timers = {};

    constructor() {}

    start(label)
    {
        this.#timers[label] = performance.now();
    }

    stop(label)
    {
        if (this.#timers[label] !== undefined)
        {
            const elapsed = performance.now() - this.#timers[label];
            this.#timers[label] = `${elapsed.toFixed(1)} ms`;
        }
    }

    showReport()
    {
        console.table(this.#timers);
    }
}

export const timer = new Timer();
