/*
 * Parsing the zone section.
 */

'use strict';

import { BaseParser } from './base_parser.js';
import { Sections   } from '../sections_parser.js';
import { Polygon    } from '../../graphics/polygon.js';

export class ZoneParser extends BaseParser
{
    parse(sectionContent)
    {
        let sections = Sections.getSections(sectionContent.substring(1, sectionContent.length - 1));
        for (const subSection of sections)
        {
            let name = Sections.getSectionName(subSection);
            if (name == 'filled_polygon')
            {
                let props = Sections.getProperties(subSection);
                let polygon = new Polygon();
                polygon.layer = props.layer[0];
                polygon.color = this.getColor(polygon.layer);
                for (let pt of props.pts)
                {
                    let parts = pt.split(' ');
                    if (parts.length == 3 && parts[0] == 'xy')
                    {
                        polygon.points.push({
                            x: parseFloat(parts[1]),
                            y: parseFloat(parts[2])
                        });
                    }
                }
                this.graphicsElements.push(polygon);
            }
        }
    }
}
