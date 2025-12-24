/*
 * Circle graphics item.
 */

import { GraphicsBase } from './graphics_base.js';

export class Circle extends GraphicsBase
{
    drawElement(ctx)
    {
        ctx.beginPath();
        ctx.arc(this.points[0].x, this.points[0].y, this.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}
