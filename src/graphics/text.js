/*
 * Sub class for line graphics items.
 */

import { GraphicsBase } from './graphics_base.js';

export class Text extends GraphicsBase
{
    drawElement(ctx)
    {
        const angle = this.rotation ? this.rotation * Math.PI / 180 : 0;

        // Text needs some offset, depending on angle
        let y = this.points[0].y;
        let x = this.points[0].x;
        if (this.rotation == 0) y += this.size * 0.16;
        if (this.rotation == 90) x -= this.size * 0.16;
        if (this.rotation == 180) y -= this.size * 0.16;
        if (this.rotation == 270) x += this.size * 0.16;

        let font = '';
        font += this.bold ? 'bold ' : '';
        font += this.italic ? 'italic ' : '';
        font += `${this.size}px `;
        font += 'KiCadFont';

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.font = font;
        ctx.fillStyle = this.color;
        ctx.textAlign = this.hAlign;
        ctx.textBaseline = this.vAlign;
        ctx.fillText(this.text, 0, 0);
        ctx.restore();
    }
}
