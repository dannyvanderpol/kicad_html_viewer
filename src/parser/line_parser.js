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
        const startX = this.correctXY('x', parseFloat(properties.start[0]), properties.start?.[2] ?? null);
        const startY = this.correctXY('y', parseFloat(properties.start[1]), properties.start?.[2] ?? null);
        const endX = this.correctXY('x', parseFloat(properties.end[0]), properties.end?.[2] ?? null);
        const endY = this.correctXY('y', parseFloat(properties.end[1]), properties.end?.[2] ?? null);
        const repeat = parseInt(properties.repeat?.[0] ?? 1);
        const incrX = parseInt(properties.incrx?.[0] ?? 0);
        const incrY = parseInt(properties.incry?.[0] ?? 0);
        const layer = properties.layer?.[0] ?? 'sheet';
        let color = this.getColor('worksheet');
        if (this.sectionName == 'segment')
        {
            color = this.getColor(layer);
        }
        const size = this.getLineThickness(properties.width ? parseFloat(properties.width[0]) : 0);

        let minX = this.paper ? 0 : -2000;
        let minY = this.paper ? 0 : -2000;
        let maxX = this.paper ? this.paper.width : 2000;
        let maxY = this.paper ? this.paper.height : 2000;
        minX += this.setup.leftMargin || 0;
        minY += this.setup.topMargin || 0;
        maxX -= this.setup.rightMargin || 0;
        maxY -= this.setup.bottomMargin || 0;

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
                line.layer = 'sheet';
                line.color = color;
                line.size = size;
                line.points.push({ x: xs, y: ys });
                line.points.push({ x: xe, y: ye });
                this.graphicsElements.push(line);
            }
        }
    }
}
