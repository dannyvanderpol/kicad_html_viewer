/*
 * Parsing the junction section.
 */

'use strict';

import { BaseParser } from './base_parser.js';
import { Sections } from '../sections_parser.js';


export class JunctionParser extends BaseParser
{
    parse(sectionContent)
    {
        let properties = Sections.getProperties(sectionContent);
        let points = [{
            x: parseFloat(properties.at[0]),
            y: parseFloat(properties.at[1])
        }];
        let color = properties.color.map(x => parseInt(x, 10));
        color = this.getColor('junction', color);
        this.addCircle('design', points, parseFloat(properties.diameter[0]), color);
    }
}
