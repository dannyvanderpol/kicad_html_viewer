/*
 * Parse a line section into a design element and graphics elements.
 */

'use strict';

import { ParserBase } from "./parser_base.js";
import { Sections } from "./sections_parser.js";
import { Line } from "../graphics/line.js";

export class LineParser extends ParserBase
{
    parse(sections)
    {
        const properties = Sections.getProperties(sections);
        const startX = this.correctXY('x', parseFloat(properties.start[0]), properties.start?.[2] ?? null);
        const startY = this.correctXY('y', parseFloat(properties.start[1]), properties.start?.[2] ?? null);
        const endX = this.correctXY('x', parseFloat(properties.end[0]), properties.end?.[2] ?? null);
        const endY = this.correctXY('y', parseFloat(properties.end[1]), properties.end?.[2] ?? null);
        const repeat = parseInt(properties.repeat?.[0] ?? 1);
        const incrX = parseInt(properties.incrx?.[0] ?? 0);
        const incrY = parseInt(properties.incry?.[0] ?? 0);
        const color = this.getColor('worksheet');
        const thickness = this.getThickness();

        let minX = 0;
        let minY = 0;
        let maxX = this.paper.width;
        let maxY = this.paper.height;
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
                line.thickness = thickness;
                line.points.push({ x: xs, y: ys });
                line.points.push({ x: xe, y: ye });
                this.graphicsElements.push(line);
            }
        }
    }
}
