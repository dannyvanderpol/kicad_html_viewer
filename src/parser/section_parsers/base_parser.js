/*
 * Base parser for all section parsers.
 */

'use strict';

import { Colors } from '../../lib/colors.js';
import { logger } from '../../lib/logger.js';
import { Sections } from '../sections_parser.js';
import { timer } from '../../lib/timer.js';

export class BaseParser
{
    constructor()
    {
        this.designType = null;
        this.parentType = null;
        this.setup = null;
        this.designElement = null;
        this.graphicsElements = [];
    }

    parseSection(sectionContent, designType, parentType, setup, paper, keyValueMap)
    {
        this.designType = designType;
        this.parentType = parentType;
        this.setup = setup;
        this.paper = paper;
        this.keyValueMap = keyValueMap;
        this.sectionName = Sections.getSectionName(sectionContent);
        timer.start(`Parse ${this.sectionName}`);
        this.parse(sectionContent);
        timer.stop(`Parse ${this.sectionName}`);
    }

    parse(sectionContent)
    {
        // To be implemented by subclasses
        console.error('parseSection() not implemented in subclass');
    }

    getColor(identifier, overrideColor=[])
    {
        // Check if override has a color (usually read from the design)
        if (overrideColor.some(x => x !== 0))
        {
            if (overrideColor.length === 3)
            {
                return `rgb(${overrideColor.join(', ')})`;
            }
            else if (overrideColor.length === 4)
            {
                return `rgba(${overrideColor.join(', ')})`;
            }
        }
        // If we did not return here, the override was invalid, use default color or based on identifier
        let color = Colors.default;
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
                    color = color.replace('rgb', 'rgba').replace(')', `, ${Colors.defaultPcbAlpha})`);
                }
            }
            else
            {
                color = colors[identifier] || Colors.default;
            }
        }
        else
        {
            logger.warn(logger.LEVEL_PARSER, `[ParserBase] No colors for '${this.designType}/${this.parentType}'`);
        }
        return color;
    }

    getLineThickness(thickness=0)
    {
        if (thickness > 0)
        {
            return thickness;
        }
        if (this.designType == 'kicad_wks')
        {
            thickness = this.setup.lineWidth;
        }
        else
        {
            switch (this.sectionName)
            {
                case 'bus':
                    thickness = designDefaults.buswidth;
                    break;

                case 'wire':
                    thickness = designDefaults.lineWidth;
                    break;
            }
        }
        return thickness;
    }

    getTextSize()
    {
        return this.setup.textSize;
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

    nextTextSequence(content)
    {
        if (!isNaN(content))
        {
            content = (parseInt(content) + 1).toString();
        }
        else if (content.length == 1)
        {
            content = String.fromCharCode(content.charCodeAt(0) + 1);
        }
        else
        {
            if (this.showDebug) logger.warn('Drawer: no text sequence for:', content);
        }
        return content;
    }
}

const designDefaults = {
    lineWidth: 0.1524,  // 6 mil
    buswidth: 0.3048    // 12 mil
}
