/*
 * Base parser for all section parsers.
 */

'use strict';

import { DesignElement } from '../design/design_element.js';
import { Colors } from '../lib/colors.js';
import { logger } from '../lib/logger.js';
import { Sections } from './sections_parser.js';
import { timer } from '../lib/timer.js';

export class ParserBase
{
    constructor()
    {
        this.designType = '';
        this.designElement = new DesignElement;
        this.graphicsElements = [];
    }

    parseSection(sectionContent, designType)
    {
        this.designType = designType;
        this.sectionName = Sections.getSectionName(sectionContent);
        timer.start(`Parse ${this.sectionName}`);
        this.parse(Sections.getSections(sectionContent.substring(1, sectionContent.length - 1)));
        timer.stop(`Parse ${this.sectionName}`);
    }

    parse(sections)
    {
        // To be implemented by subclasses
        console.error('parseSection() not implemented in subclass');
    }

    getColor(identifier)
    {
        const defaultPcbAlpha = 0.7;
        let color = Colors.default;
        if (logger.logLevel & logger.LEVEL_PARSER_COLOR) logger.info('[ParserBase] Get color for:', this, identifier);
        const colors = Colors[this.designType];
        if (colors)
        {
            // Color for layers: B.Cu, F.Cu, etc.
            let parts = identifier.toLowerCase().split('.');
            if (parts.length == 2)
            {
                color = colors[parts[1]][parts[0]] || Colors.default;
                if (color.startsWith('rgb('))
                {
                    color = color.replace('rgb', 'rgba').replace(')', `, ${defaultPcbAlpha})`);
                }
            }
            else
            {
                color = colors[identifier] || Colors.default;
            }
        }
        else
        {
            if (logger.logLevel & logger.LEVEL_PARSER_COLOR) logger.warn(`[ParserBase] No colors for ' ${this.designType}'`);
        }
        return color;
    }
}
