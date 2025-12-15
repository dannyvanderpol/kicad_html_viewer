/*
 * Base class for all graphics objects.
 */

'use strict';

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
        this.thickness = 1;
        this.scaledThickness = false;
        this.scale = 1;
        this.points = [];
    }

    draw(ctx)
    {
        const name = this.constructor.name;
        timer.start(`Draw ${name}`);
        if (logger.logLevel & logger.LEVEL_DRAWER_ELEMENT) console.log(`[GraphicsBase] Drawing '${name}' on layer '${this.layer}'`);
        if (this.points.length >= MIN_POINTS[name])
        {
            // default drawing settings
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            this.drawElement(ctx);
        }
        else if (logger.logLevel & logger.LEVEL_DRAWER_ELEMENT)
        {
            console.warn(`[GraphicsBase] Drawing '${name}' skipped`, this, MIN_POINTS[name]);
        }
        timer.stop(`Draw ${name}`);
    }

    drawElement(ctx, scale)
    {
        // To be implemented by subclasses.
        console.error('[GraphicsBase] drawElement() not implemented in subclass');
    }
}

const MIN_POINTS = {
    'Polygon': 3,
    'Rectangle': 2
}
