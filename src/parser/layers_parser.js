/*
 * Parsing the layers section.
 */

'use strict';

import { logger } from '../lib/logger.js';
import { ParserBase } from './parser_base.js';
import { Sections } from './sections_parser.js';
import { LayersElement } from '../design/layers_element.js';

export class LayersParser extends ParserBase
{
    parse(sectionContent)
    {
        let layers = {};
        let properties = Sections.getProperties(sectionContent);
        for (let prop in properties)
        {
            const layer = properties[prop][0];
            let index = LAYER_ORDER.indexOf(layer) * 100;
            if (layer.startsWith('In') && layer.endsWith('.Cu'))
            {
                index = (LAYER_ORDER.indexOf('In*') + 1) * 100;
                const match = layer.match(/In(\d+).Cu/);
                index -= parseInt(match[1]);
            }
            if (index < 0)
            {
                logger.warn(logger.LEVEL_PARSER, '[Parser] unknown layer:', layer);
            }
            else
            {
                layers[index] = layer;
            }
        }
        this.designElement = new LayersElement('layers');
        this.designElement.layers = Object.values(layers)
    }
}

// Layer order bottom to top (= drawing order)
const LAYER_ORDER = [
    'B.SilkS',
    'B.CrtYd',
    'B.Fab',
    'B.Adhes',
    'B.Paste',
    'B.Cu',
    'B.Mask',
    'In*',
    'F.Mask',
    'F.Cu',
    'F.Paste',
    'F.Adhes',
    'F.Fab',
    'F.CrtYd',
    'F.SilkS',
    'Margin',
    'Edge.Cuts',
    'Dwgs.User',
    'Cmts.User',
    'Eco1.User',
    'Eco2.User'
];
