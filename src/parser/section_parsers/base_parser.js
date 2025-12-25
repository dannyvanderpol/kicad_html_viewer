/*
 * Base parser for all section parsers.
 */

'use strict';

import { Colors } from '../../lib/colors.js';
import { logger } from '../../lib/logger.js';
import { Sections } from '../sections_parser.js';
import { timer } from '../../lib/timer.js';
import { Circle } from '../../graphics/circle.js';
import { Line } from '../../graphics/line.js';
import { Rectangle } from '../../graphics/rectangle.js';
import { Text } from '../../graphics/text.js';

export class BaseParser
{
    constructor()
    {
        this.designType = null;
        this.parentType = null;
        this.setup = null;
        this.paper = null;
        this.keyValueMap = null;
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
        // Calculate boundaries for X and Y values
        this.minX = this.paper ? 0 : -2000;
        this.minY = this.paper ? 0 : -2000;
        this.maxX = this.paper ? this.paper.width : 2000;
        this.maxY = this.paper ? this.paper.height : 2000;
        this.minX += this.setup ? this.setup.leftMargin : 0;
        this.minY += this.setup ? this.setup.topMargin : 0;
        this.maxX -= this.setup ? this.setup.rightMargin : 0;
        this.maxY -= this.setup ? this.setup.bottomMargin : 0;
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
            thickness = this.setup ? this.setup.lineWidth : designDefaults.lineWidth;
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
        return this.setup ? this.setup.textSize : designDefaults.textSize;
    }

    correctXY(axis, value, relativeTo)
    {
        // Correct X and Y only for worksheet elements
        if (this.designType != 'kicad_wks')
        {
            return value;
        }

        const leftMargin = this.setup ? this.setup.leftMargin : 0;
        const topMargin = this.setup ? this.setup.topMargin : 0;
        const rightMargin = this.setup ? this.setup.rightMargin : 0;
        const bottomMargin = this.setup ? this.setup.bottomMargin : 0;
        const paperWidth = this.paper ? this.paper.width : 0;
        const paperHeight = this.paper ? this.paper.height : 0;

        switch (relativeTo)
        {
            case 'ltcorner':
                if (axis == 'x')
                {
                    value += leftMargin;
                }
                if (axis == 'y')
                {
                    value += topMargin;
                }
                break;

            case 'rtcorner':
                if (axis == 'x')
                {
                    value = paperWidth - rightMargin - value;
                }
                if (axis == 'y')
                {
                    value += topMargin;
                }
                break;

            case 'lbcorner':
                if (axis == 'x')
                {
                    value += leftMargin;
                }
                if (axis == 'y')
                {
                    value = paperHeight - bottomMargin - value;
                }
                break;

            case 'rbcorner':
                if (axis == 'x')
                {
                    value = paperWidth - rightMargin - value;
                }
                else if (axis == 'y')
                {
                    value = paperHeight - bottomMargin - value;
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

    addCircle(layer, points, size, color)
    {
        const circle = new Circle();
        circle.layer = layer;
        circle.points = points;
        circle.size = size;
        circle.color = color;
        this.graphicsElements.push(circle);
    }

    addLine(layer, points, size, color)
    {
        const line = new Line();
        line.layer = layer;
        line.points = points;
        line.size = size;
        line.color = color;
        this.graphicsElements.push(line);
    }

    addRectangle(layer, points, size, color)
    {
        const rectangle = new Rectangle();
        rectangle.layer = layer;
        rectangle.points = points;
        rectangle.size = size;
        rectangle.color = color;
        this.graphicsElements.push(rectangle);
    }

    addText(layer, points, content, size, color, bold, italic, hAlign, vAlign, mirror)
    {
        let font = '';
        font += bold ? 'bold ' : '';
        font += italic ? 'italic ' : '';
        font += `${size}px `;
        font += 'KiCadFont';

        const text = new Text();
        text.layer = layer;
        text.points = points;
        text.text = content;
        text.font = font;
        text.color = color;
        text.hAlign = hAlign;
        text.vAlign = vAlign;
        text.mirror = mirror;
        this.graphicsElements.push(text);
    }
}

const designDefaults = {
    lineWidth: 0.1524,  // 6 mil
    buswidth: 0.3048    // 12 mil
}
