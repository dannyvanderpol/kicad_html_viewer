/*
 * Base class for all graphics objects.
 */

import { Colors } from '../lib/colors.js';
import { logger } from '../lib/logger.js';
import { timer } from '../lib/timer.js';

export class GraphicsBase
{
    constructor()
    {
        this.type = GraphicsBase.name;
        this.layer = 'design';
        this.color = Colors.default;
        this.points = [];
    }

    draw(ctx)
    {
        const name = this.constructor.name;
        timer.start(`Draw ${name}`);
        if (logger.logLevel & logger.LEVEL_DRAWER_ELEMENT) console.log(`[Drawer] Drawing '${name}' on layer '${this.layer}'`);
        if (this.points.length > 0)
        {
            // default drawing settings
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.drawElement(ctx);
        }
        else if (logger.logLevel & logger.LEVEL_DRAWER_ELEMENT)
        {
            console.warn('[Drawer] Drawing skipped');
        }
        timer.stop(`Draw ${name}`);
    }

    drawElement(ctx)
    {
        // To be implemented by subclasses.
        console.error('[Drawer] drawElement() not implemented in subclass');
    }
}
