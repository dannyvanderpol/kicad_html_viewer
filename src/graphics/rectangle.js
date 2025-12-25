/*
 * Sub class for polygon graphics items.
 */

import { GraphicsBase } from './graphics_base.js';

export class Rectangle extends GraphicsBase
{
    drawElement(ctx)
    {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        if (this.scaledSize)
        {
            ctx.lineWidth /= this.scale;
        }
        const w = this.points[1].x - this.points[0].x;
        const h = this.points[1].y - this.points[0].y;
        if (this.fillColor)
        {
            ctx.fillStyle = this.fillColor;
            ctx.fillRect(this.points[0].x, this.points[0].y, w, h);
        }
        ctx.strokeRect(this.points[0].x, this.points[0].y, w, h);
    }
}
