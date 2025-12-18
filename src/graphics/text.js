/*
 * Sub class for line graphics items.
 */

import { GraphicsBase } from './graphics_base.js';

export class Text extends GraphicsBase
{
    drawElement(ctx)
    {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.textAlign = this.align_h;
        ctx.textBaseline = this.align_v;
        ctx.fillText(this.text, this.points[0].x, this.points[0].y);
    }
}
