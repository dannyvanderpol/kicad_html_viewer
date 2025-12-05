/* KiDrawer */

'use strict';

export class KiDrawer
{
    constructor(ctx, scale, colors, showDebug)
    {
        this.showDebug = showDebug;
        this.colors = colors;
        this.ctx = ctx;
        this.scale = scale;
        this.drawingType = null;
        this.setup = null;
    }

    drawPageOutline(paperSize)
    {
        if (this.showDebug) console.log('Drawer: drawing page outline for paper size:', paperSize);
        this.ctx.strokeStyle = this.colors.colorPageLimits;
        this.ctx.lineWidth = drawingDefaults.pageOutline / this.scale;
        this.ctx.strokeRect(0, 0, paperSize.width, paperSize.height);
        this.ctx.canvas.style.backgroundColor = this.colors.colorBackground;
    }

    drawContent(content)
    {
        this.drawingType = content.type;
        if (this.showDebug) console.log('Drawer: Drawing type:', this.drawingType);
        this.setup = content.setup;
        this._drawObjects(content);
        this.drawingType = null;
    }

    _drawObjects(objects)
    {
        console.log(objects);
    }
}

export const drawingDefaults = {
    pageOutline: 0.3,       // 0.3 units
    lineThickness: 0.152,   // 6 mil
    wireThickness: 0.152,   // 6 mil
    busThickness: 0.305,    // 12 mil
    junctionSize: 0.914,    // 36 mil
    textSize: 1.27          // 50 mil
};
