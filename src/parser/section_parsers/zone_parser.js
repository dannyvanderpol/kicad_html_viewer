/*
 * Parsing the zone section.
 */

'use strict';

import { BaseParser } from './base_parser.js';
import { Sections } from '../sections_parser.js';

export class ZoneParser extends BaseParser
{
    parse(sectionContent)
    {
        let sections = Sections.getSections(sectionContent);
        for (const subSection of sections)
        {
            let name = Sections.getSectionName(subSection);
            if (name == 'filled_polygon')
            {
                let props = Sections.getProperties(subSection);
                const layer = props.layer[0];
                const points = [];
                for (let pt of props.pts)
                {
                    let parts = pt.split(' ');
                    if (parts.length == 3 && parts[0] == 'xy')
                    {
                        points.push({
                            x: parseFloat(parts[1]),
                            y: parseFloat(parts[2])
                        });
                    }
                }
                this.addPolygon(layer, points, 0, null, this.getColor(layer));
            }
        }
    }
}
