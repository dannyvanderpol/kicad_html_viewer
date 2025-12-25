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
        let color = '';
        let size = 0;
        let fillColor = '';

        let sections = Sections.getSections(sectionContent.substring(1, sectionContent.length - 1));
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

                case 'size':
                    const point = { ...points[0] };
                    point.x += parseFloat(values[0]);
                    point.y += parseFloat(values[1]);
                    points.push(point);
                    break;

                case 'stroke':
                    size = parseFloat(properties.width[0]);
                    break;

                case 'fill':
                    fillColor = properties.color;
                    break;
            }
        }
        fillColor = this.getColor(this.sectionName + '_background', fillColor);
        if (points.length == 2)
        {
            size = this.getLineThickness(size);
            color = this.getColor('sheet');
            this.addRectangle('design', points, size, color, fillColor);
        }
    }
}
