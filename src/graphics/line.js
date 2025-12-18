/*
 * Sub class for line graphics items.
 */

import { GraphicsBase } from './graphics_base.js';

export class Line extends GraphicsBase
{
    drawElement(ctx)
    {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        if (this.scaledSize)
        {
            ctx.lineWidth /= this.scale;
        }
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        ctx.lineTo(this.points[1].x, this.points[1].y);
        ctx.stroke();
    }
}
