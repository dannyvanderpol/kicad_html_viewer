/* KiDrawer: drawing objects from a KiCad design in a HTML canvas. */

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
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.pageSize = null;
        this.margins = { left: 0, right: 0, top: 0, bottom: 0 };
    }

    drawPageOutline(paperSize)
    {
        this.pageSize = paperSize;
        if (this.showDebug) console.log('Drawer: drawing page outline for paper size:', this.pageSize);
        this.ctx.strokeStyle = this.colors.colorPageLimits;
        this.ctx.lineWidth = drawingDefaults.pageOutline / this.scale;
        this.ctx.strokeRect(0, 0, this.pageSize.width, this.pageSize.height);
        this.ctx.canvas.style.backgroundColor = this.colors.colorBackground;
    }

    drawContent(content)
    {
        this.drawingType = content.type;
        if (this.showDebug) console.log('Drawer: Drawing type:', this.drawingType);
        this.setup = content.setup;
        this.margins.left = this.setup.left_margin ? parseFloat(this.setup.left_margin) : 0;
        this.margins.right = this.setup.right_margin ? parseFloat(this.setup.right_margin) : 0;
        this.margins.top = this.setup.top_margin ? parseFloat(this.setup.top_margin) : 0;
        this.margins.bottom = this.setup.bottom_margin ? parseFloat(this.setup.bottom_margin) : 0;
        this._drawObjects(content);
        this.drawingType = null;
    }

    _drawObjects(objects, name=null)
    {
        for (let item in objects)
        {
            if (Array.isArray(objects[item]))
            {
                this._drawObjects(objects[item], item);
            }
            else if (typeof objects[item] === 'object' && objects[item] !== null && name !== null)
            {
                this._drawObject(name, objects[item]);
            }
        }
    }

    _drawObject(name, obj)
    {
        switch (name)
        {
            case 'lines':
                this._drawLine(obj);
                break;

            case 'rectangles':
                this._drawRectangle(obj);
                break;

            case 'paper':
            case 'setup':
                // Skip
                break;

            default:
                if (this.showDebug) console.warn('Drawer: unknown type:', name, obj);
        }
    }

    _drawLine(line)
    {
        if (this.showDebug) console.log('Drawer: line', line);

        let thickness = this._setThickness(line.type, line.thickness);
        let x1 = this._correctXY('x', line.start.x, line.start.relative_to);
        let y1 = this._correctXY('y', line.start.y, line.start.relative_to);
        let x2 = this._correctXY('x', line.end.x, line.end.relative_to);
        let y2 = this._correctXY('y', line.end.y, line.end.relative_to);

        this.ctx.strokeStyle = this.colors.getColor(this.drawingType, line.type);
        this.ctx.lineWidth = thickness;
        this.ctx.beginPath();
        for (let i = 0; i < line.repeat; i++)
        {
            let xs = x1 + i * line.increment_x;
            let ys = y1 + i * line.increment_y;
            let xe = x2 + i * line.increment_x;
            let ye = y2 + i * line.increment_y;
            if (xs > this.pageSize.width - this.margins.right) break;
            if (ys > this.pageSize.height - this.margins.bottom) break;
            if (this.showDebug) console.log(`Drawer: line: (${xs}, ${ys}) to (${xe}, ${ye})`);
            this.ctx.moveTo(xs, ys);
            this.ctx.lineTo(xe, ye);
        }
        this.ctx.stroke();
    }

    _drawRectangle(rect)
    {
        if (this.showDebug) console.log('Drawer:', rect);

        let thickness = this._setThickness(rect.type, rect.thickness);
        let x1 = this._correctXY('x', rect.start.x, rect.start.relative_to);
        let y1 = this._correctXY('y', rect.start.y, rect.start.relative_to);
        let x2 = this._correctXY('x', rect.end.x, rect.end.relative_to);
        let y2 = this._correctXY('y', rect.end.y, rect.end.relative_to);

        this.ctx.strokeStyle = this.colors.getColor(this.drawingType, rect.type);
        this.ctx.lineWidth = thickness;
        for (let i = 0; i < rect.repeat; i++)
        {
            let xs = x1 + i * rect.increment_x;
            let ys = y1 + i * rect.increment_y;
            let xe = x2 - i * rect.increment_x;
            let ye = y2 - i * rect.increment_y;
            if (this.showDebug) console.log(`Drawer: rectangle: (${xs}, ${ys}) to (${xe}, ${ye})`);
            this.ctx.strokeRect(xs, ys, xe - xs, ye - ys);
        }
    }

    _correctXY(axis, value, relativeTo)
    {
        if (this.drawingType != 'kicad_wks')
        {
            return value;
        }

        switch (relativeTo)
        {
            case 'ltcorner':
                if (axis == 'x')
                {
                    value += this.margins.left;
                }
                if (axis == 'y')
                {
                    value += this.margins.top;
                }
                break;

            case 'rtcorner':
                if (axis == 'x')
                {
                    value = this.pageSize.width - value - this.margins.right;
                }
                if (axis == 'y')
                {
                    value += this.margins.top;
                }
                break;

            case 'lbcorner':
                if (axis == 'x')
                {
                    value += this.margins.left;
                }
                if (axis == 'y')
                {
                    value = this.pageSize.height - value - this.margins.bottom;
                }
                break;

            case 'rbcorner':
                if (axis == 'x')
                {
                    value = this.pageSize.width - value - this.margins.right;
                }
                else if (axis == 'y')
                {
                    value = this.pageSize.height - value - this.margins.bottom;
                }
                break;

            default:
                // For worksheets, default rbcorner
                if (this.drawingType == 'kicad_wks')
                {
                    value = this._correctXY(axis, value, 'rbcorner');
                }
        }
        return value;
    }

    _setThickness(type, thickness)
    {
        if (thickness > 0)
        {
            return thickness;
        }

        switch (type)
        {
            case 'line':
            case 'rect':
                thickness = this.setup.lineWidth ? parseFloat(this.setup.lineWidth) : drawingDefaults.lineThickness;
                break;

            default:
                if (this.showDebug) console.warn(`Drawer: no thickness for type '${type}'`);
        }
        return thickness;
    }
}

const drawingDefaults = {
    pageOutline: 0.3,       // 0.3 units
    lineThickness: 0.152,   // 6 mil
    wireThickness: 0.152,   // 6 mil
    busThickness: 0.305,    // 12 mil
    junctionSize: 0.914,    // 36 mil
    textSize: 1.27          // 50 mil
};
