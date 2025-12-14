/*
 * Parsing a zone into a design object and graphics objects.
 */

'use strict';

import { ParserBase } from './parser_base.js';
import { Sections   } from './sections_parser.js';
import { Polygon    } from '../graphics/polygon.js';

export class ZoneParser extends ParserBase
{
    parse(sections)
    {
        for (const subSection of sections)
        {
            let name = Sections.getSectionName(subSection);
            switch (name)
            {
                // Graphics
                case 'filled_polygon':
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
                    break;

                // Skip
                case 'attr':
                case 'connect_pads':
                case 'fill':
                case 'filled_areas_thickness':
                case 'hatch':
                case 'layer':
                case 'min_thickness':
                case 'name':
                case 'net':
                case 'net_name':
                case 'polygon':
                case 'priority':
                case 'uuid':
                    break;

                default:
                    if (this.showDebug) console.warn('[ZoneParser]: unknown zone subsection:', name);
            }
        }
    }
}
