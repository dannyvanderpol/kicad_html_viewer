/*
 * Parse a rectangle section into a design element and graphics elements.
 */

'use strict';

import { ParserBase } from "./parser_base.js";
import { Sections } from "./sections_parser.js";
import { Rectangle } from "../graphics/rectangle.js";

export class RectangleParser extends ParserBase
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
        const color = this.getColor('worksheet');
        const thickness = this.getThickness();

        for (let i = 0; i < repeat; i++)
        {
            let xs = startX + i * incrX;
            let ys = startY + i * incrY;
            let xe = endX - i * incrX;
            let ye = endY - i * incrY;
            let rectangle = new Rectangle();
            rectangle.layer = 'sheet';
            rectangle.color = color;
            rectangle.thickness = thickness;
            rectangle.points.push({ x: xs, y: ys });
            rectangle.points.push({ x: xe, y: ye });
            this.graphicsElements.push(rectangle);
        }
    }
}
