/*
 * Parsing the bus section.
 */

'use strict';

import { BaseParser } from './base_parser.js';
import { Sections } from '../sections_parser.js';

export class BusParser extends BaseParser
{
    parse(sectionContent)
    {
        const properties = Sections.getProperties(sectionContent);
        let values;
        const points = [];
        for (let pt of properties.pts)
        {
            values = pt.split(' ');
            if (values[0] == 'xy' && values.length == 3)
            {
                points.push({ x: parseFloat(values[1]), y: parseFloat(values[2]) });
            }
        }
        values = properties.stroke[0].split(' ')
        const size = this.getLineThickness(values[0] == 'width' ? parseFloat(values[1]): 0);
        const color = this.getColor('bus');
        this.addLine('design', points, size, color);
    }
}
