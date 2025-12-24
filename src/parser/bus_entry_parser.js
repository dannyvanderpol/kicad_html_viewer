/*
 * Parsing bus entry section.
 */

'use strict';

import { ParserBase } from './parser_base.js';
import { Sections } from './sections_parser.js';
import { Line } from "../graphics/line.js";

export class BusEntryParser extends ParserBase
{
    parse(sectionContent)
    {
        let properties = Sections.getProperties(sectionContent);
        const startX = parseFloat(properties.at[0]);
        const startY = parseFloat(properties.at[1]);
        const endX = startX + 2.54;
        const endY = startY - 2.54;
        let parts = properties.stroke[0].split(' ')
        let size = parts[0] == 'width' ? parseFloat(parts[1]) : 0;
        let line = new Line();
        line.layer = 'design';
        line.points.push({ x: startX, y: startY });
        line.points.push({ x: endX, y: endY });
        line.size = this.getLineThickness(size);
        line.color = this.getColor('wire');
        this.graphicsElements.push(line);
    }
}
