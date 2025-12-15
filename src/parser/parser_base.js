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
        this.designType = null;
        this.parentType = null;
        this.setup = null;
        this.designElement = new DesignElement;
        this.graphicsElements = [];
    }

    parseSection(sectionContent, designType, parentType, setup, paper)
    {
        this.designType = designType;
        this.parentType = parentType;
        this.setup = setup;
        this.paper = paper;
        this.sectionName = Sections.getSectionName(sectionContent);
        timer.start(`Parse ${this.sectionName}`);
        let sections = Sections.getSections(sectionContent.substring(1, sectionContent.length - 1))
        if (sections.length == 0)
        {
            sections = sectionContent;
        }
        this.parse(sections);
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
        let colors = Colors[this.designType];
        if (this.designType == 'kicad_wks')
        {
            colors = Colors[this.parentType];
        }
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
            if (logger.logLevel & logger.LEVEL_PARSER_COLOR) logger.warn(`[ParserBase] No colors for '${this.designType}/${this.parentType}'`);
        }
        return color;
    }

    getThickness()
    {
        return this.setup.lineWidth;
    }

    correctXY(axis, value, relativeTo)
    {
        // Correct X and Y only for worksheet elements
        if (this.designType != 'kicad_wks')
        {
            return value;
        }

        switch (relativeTo)
        {
            case 'ltcorner':
                if (axis == 'x')
                {
                    value += this.setup.leftMargin;
                }
                if (axis == 'y')
                {
                    value += this.setup.topMargin;
                }
                break;

            case 'rtcorner':
                if (axis == 'x')
                {
                    value = this.paper.width - this.setup.rightMargin - value;
                }
                if (axis == 'y')
                {
                    value += this.setup.topMargin;
                }
                break;

            case 'lbcorner':
                if (axis == 'x')
                {
                    value += this.setup.leftMargin;
                }
                if (axis == 'y')
                {
                    value = this.paper.height - this.setup.bottomMargin - value;
                }
                break;

            case 'rbcorner':
                if (axis == 'x')
                {
                    value = this.paper.width - this.setup.rightMargin - value;
                }
                else if (axis == 'y')
                {
                    value = this.paper.height - this.setup.bottomMargin - value;
                }
                break;

            default:
                // Default rbcorner
                value = this.correctXY(axis, value, 'rbcorner');
        }
        return value;
    }
}
