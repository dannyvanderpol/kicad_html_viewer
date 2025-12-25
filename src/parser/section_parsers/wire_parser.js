/*
 * Parsing the wire section.
 */

'use strict';

import { BaseParser } from "./base_parser.js";
import { Sections } from "../sections_parser.js";

export class WireParser extends BaseParser
{
    parse(sectionContent)
    {
        const properties = Sections.getProperties(sectionContent);

        const startX = parseFloat(properties.pts[0].split(' ')[1]);
        const startY = parseFloat(properties.pts[0].split(' ')[2]);
        const endX = parseFloat(properties.pts[1].split(' ')[1]);
        const endY = parseFloat(properties.pts[1].split(' ')[2]);

        const points = [
            { x: startX, y: startY },
            { x: endX,   y: endY   }
        ]

        const color = this.getColor(this.sectionName);

        let parts = properties.stroke[0].split(' ')
        let size = parts[0] == 'width' ? parseFloat(parts[1]) : 0;
        size = this.getLineThickness(size);

        this.addLine('design', points, size, color)
    }
}
