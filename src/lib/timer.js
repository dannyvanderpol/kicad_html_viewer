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
            this.#timers[label] = Math.round((performance.now() - this.#timers[label]) * 10) / 10;
        }
    }

    showReport()
    {
        console.table(this.#timers);
    }
}

export const timer = new Timer();
