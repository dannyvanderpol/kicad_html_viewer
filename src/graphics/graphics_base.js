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
        this.size = 1;
        this.scaledSize = false;
        this.scale = 1;
        this.points = [];
        this.text = '';
        this.align_h = 'left';
        this.align_v = 'middle';
        this.mirror = false;
    }

    draw(ctx)
    {
        const name = this.constructor.name;
        timer.start(`Draw ${name}`);
        if (this.points.length >= MIN_POINTS[name])
        {
            // default drawing settings
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            this.drawElement(ctx);
        }
        else
        {
            logger.warn(logger.LEVEL_DRAWER, `[GraphicsBase] Drawing '${name}' skipped`, MIN_POINTS[name]);
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
    'Junction': 1,
    'Line': 2,
    'Polygon': 3,
    'Rectangle': 2,
    'Text': 1
}
