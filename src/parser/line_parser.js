/*
 * Parse a line section into a design element and graphics elements.
 */

'use strict';

import { ParserBase } from "./parser_base.js";
import { Sections } from "./sections_parser.js";
import { Line } from "../graphics/line.js";

export class LineParser extends ParserBase
{
    parse(sectionContent)
    {
        const properties = Sections.getProperties(sectionContent);

        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        if (properties.start)
        {
            startX = this.correctXY('x', parseFloat(properties.start[0]), properties.start?.[2] ?? null);
            startY = this.correctXY('y', parseFloat(properties.start[1]), properties.start?.[2] ?? null);
        }
        if (properties.end)
        {
            endX = this.correctXY('x', parseFloat(properties.end[0]), properties.end?.[2] ?? null);
            endY = this.correctXY('y', parseFloat(properties.end[1]), properties.end?.[2] ?? null);
        }
        if (properties.pts)
        {
            startX = parseFloat(properties.pts[0].split(' ')[1]);
            startY = parseFloat(properties.pts[0].split(' ')[2]);
            endX = parseFloat(properties.pts[1].split(' ')[1]);
            endY = parseFloat(properties.pts[1].split(' ')[2]);
        }

        let repeat = parseInt(properties.repeat?.[0] ?? 1);
        let incrX = parseInt(properties.incrx?.[0] ?? 0);
        let incrY = parseInt(properties.incry?.[0] ?? 0);

        let layer = properties.layer?.[0] ?? 'design';
        let color = this.sectionName == 'segment' ? this.getColor(layer) : this.getColor(this.sectionName);
        if (this.designType == 'kicad_wks')
        {
            layer = 'sheet';
            color = this.getColor('worksheet');
        }
        let size = properties.width ? parseFloat(properties.width[0]) : 0;
        if (properties.stroke)
        {
            let parts = properties.stroke[0].split(' ')
            size = parts[0] == 'width' ? parseFloat(parts[1]) : 0;
        }
        size = this.getLineThickness(size);

        let minX = this.paper ? 0 : -2000;
        let minY = this.paper ? 0 : -2000;
        let maxX = this.paper ? this.paper.width : 2000;
        let maxY = this.paper ? this.paper.height : 2000;
        minX += this.setup ? this.setup.leftMargin : 0;
        minY += this.setup ? this.setup.topMargin : 0;
        maxX -= this.setup ? this.setup.rightMargin : 0;
        maxY -= this.setup ? this.setup.bottomMargin : 0;

        for (let i = 0; i < repeat; i++)
        {
            let xs = startX + i * incrX;
            let ys = startY + i * incrY;
            let xe = endX + i * incrX;
            let ye = endY + i * incrY;
            if (xs >= minX && xs <= maxX && ys >= minY && ys <= maxY &&
                xe >= minX && xe <= maxX && ye >= minY && ye <= maxY)
            {
                let line = new Line();
                line.layer = layer;
                line.color = color;
                line.size = size;
                line.points.push({ x: xs, y: ys });
                line.points.push({ x: xe, y: ye });
                this.graphicsElements.push(line);
            }
        }
    }
}
