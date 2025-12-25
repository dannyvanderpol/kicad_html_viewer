/*
 * Parsing the rectangle section.
 */

'use strict';

import { BaseParser } from "./base_parser.js";
import { Sections } from "../sections_parser.js";

export class RectangleParser extends BaseParser
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
        const size = this.getLineThickness();

        for (let i = 0; i < repeat; i++)
        {
            let xs = startX + i * incrX;
            let ys = startY + i * incrY;
            let xe = endX - i * incrX;
            let ye = endY - i * incrY;
            const points = [
                { x: xs, y: ys },
                { x: xe, y: ye }
            ];
            this.addRectangle('sheet', points, size, color);
        }
    }
}
