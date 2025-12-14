/*
 * Sub class for polygon graphics items.
 */

import { GraphicsBase } from './graphics_base.js';

export class Rectangle extends GraphicsBase
{
    drawElement(ctx)
    {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.thickness;
        ctx.strokeRect(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y);
    }
}
