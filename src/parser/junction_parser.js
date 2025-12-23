/*
 * Parsing a setup section into a design element and graphics elements.
 */

'use strict';

import { ParserBase } from './parser_base.js';
import { Sections } from './sections_parser.js';
import { Junction } from '../graphics/junction.js';

export class JunctionParser extends ParserBase
{
    parse(sectionContent)
    {
        let properties = Sections.getProperties(sectionContent);
        let junction = new Junction();
        junction.layer = 'design';
        junction.points.push({
            x: parseFloat(properties.at[0]),
            y: parseFloat(properties.at[1])
        });
        junction.size = parseFloat(properties.diameter[0]);
        junction.color = properties.color.map(x => parseInt(x, 10));
        junction.color = this.getColor('junction', junction.color);
        this.graphicsElements.push(junction);
    }
}
