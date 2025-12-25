/*
 * Parse the bus entry section.
 */

'use strict';

import { BaseParser } from './base_parser.js';
import { Sections } from '../sections_parser.js';

export class BusEntryParser extends BaseParser
{
    parse(sectionContent)
    {
        const properties = Sections.getProperties(sectionContent);
        const startX = parseFloat(properties.at[0]);
        const startY = parseFloat(properties.at[1]);
        const endX = startX + parseFloat(properties.size[0]);
        const endY = startY + parseFloat(properties.size[1]);
        const parts = properties.stroke[0].split(' ')
        let size = parts[0] == 'width' ? parseFloat(parts[1]) : 0;
        size = this.getLineThickness(size);
        const color = this.getColor('wire');
        const points = [
            { x: startX, y: startY },
            { x: endX,   y: endY   }
        ]
        this.addLine('design', points, size, color);
    }
}
