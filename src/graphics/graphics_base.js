/*
 * Base class for all graphics objects.
 */

import { logger } from '../lib/logger.js';
import { timer } from '../lib/timer.js';

export class GraphicsBase
{
    constructor()
    {
        this.type = GraphicsBase.name;
        this.layer = 'design';
    }

    draw()
    {
        const name = this.constructor.name;
        timer.start(`Draw ${name}`);
        if (logger.logLevel & logger.LEVEL_DRAWER_ELEMENT) console.log(`Drawing '${name}' on layer '${this.layer}'`);
        this.drawElement();
        timer.stop(`Draw ${name}`);
    }

    drawElement()
    {
        // To be implemented by subclasses.
        console.error('drawElement() not implemented in subclass');
    }
}
