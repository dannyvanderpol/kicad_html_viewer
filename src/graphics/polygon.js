/*
 * Sub class for polygon graphics items.
 */

import { GraphicsBase } from './graphics_base.js';

export class Polygon extends GraphicsBase
{
    drawElement(ctx)
    {
        ctx.fillStyle = this.color;
        ctx.lineWidth = 0;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++)
        {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.closePath();
        ctx.fill();
    }
}
