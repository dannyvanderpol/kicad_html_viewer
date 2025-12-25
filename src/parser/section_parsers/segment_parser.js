/*
 * Parsing the segment section.
 */

'use strict';

import { BaseParser } from "./base_parser.js";
import { Sections } from "../sections_parser.js";

export class SegmentParser extends BaseParser
{
    parse(sectionContent)
    {
        const properties = Sections.getProperties(sectionContent);
        const startX = parseFloat(properties.start[0]);
        const startY = parseFloat(properties.start[1]);
        const endX = parseFloat(properties.end[0]);
        const endY = parseFloat(properties.end[1]);
        const layer = properties.layer[0];
        const size = parseFloat(properties.width[0]);
        const color = this.getColor(layer);

        const points = [
            { x: startX, y: startY },
            { x: endX,   y: endY   }
        ]
        this.addLine(layer, points, size, color)
    }
}
