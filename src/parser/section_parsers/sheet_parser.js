/*
 * Parsing the sheet section.
 */

'use strict';

import { BaseParser } from './base_parser.js';
import { Sections } from '../sections_parser.js';

export class SheetParser extends BaseParser
{
    parse(sectionContent)
    {
        const points = [];
        let sheetColor = '';
        let sheetSize = 0;
        let fillColor = '';

        let sections = Sections.getSections(sectionContent);
        for (const subSection of sections)
        {
            const name = Sections.getSectionName(subSection);
            const values = Sections.getValues(subSection);
            const properties = Sections.getProperties(subSection);
            switch (name)
            {
                case 'at':
                    points.push({ x: parseFloat(values[0]), y: parseFloat(values[1])});
                    break;

                case 'pin':
                    const pinData = this.getLabelData(subSection)
                    this.addHierPin(pinData.pos, pinData.attributes[1]);
                    break;

                case 'property':
                    const propData = this.getLabelData(subSection)
                    let content = propData.attributes[1];
                    if (propData.attributes[0] == "Sheetfile")
                    {
                        content = 'File: ' + content;
                    }
                    const pos = [
                        { x: propData.pos[0], y: propData.pos[1] }
                    ]
                    const color = this.getColor(propData.attributes[0]);
                    this.addText('design', pos, content, propData.size, color, propData.bold, propData.italic,
                                 propData.hAlign, propData.vAlign, propData.mirror)
                    break;

                case 'size':
                    const point = { ...points[0] };
                    point.x += parseFloat(values[0]);
                    point.y += parseFloat(values[1]);
                    points.push(point);
                    break;

                case 'stroke':
                    sheetSize = parseFloat(properties.width[0]);
                    break;

                case 'fill':
                    fillColor = properties.color;
                    break;

                default:
                    //console.log(subSection);
            }
        }
        fillColor = this.getColor(this.sectionName + '_background', fillColor);
        if (points.length == 2)
        {
            sheetSize = this.getLineThickness(sheetSize);
            sheetColor = this.getColor('sheet');
            this.addRectangle('design', points, sheetSize, sheetColor, fillColor);
        }
    }
}
