/*
 * Parsing a zone into a design object and graphics objects.
 */

import { ParserBase } from './parser_base.js';
import { Sections   } from './sections_parser.js';
import { Polygon    } from '../graphics/polygon.js';

export class ZoneParser extends ParserBase
{
    parseSection()
    {
        for (const subSection of this.sections)
        {
            let name = Sections.getSectionName(subSection);
            switch (name)
            {
                // Graphics
                case 'filled_polygon':
                    let polygon = new Polygon();
                    this.graphicsObjects.push(polygon);
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
                    if (this.showDebug) console.warn('Reader: unknown zone subsection:', name);
            }
        }
    }
}
