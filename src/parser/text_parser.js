/*
 * Parse a line section into a design element and graphics elements.
 */

'use strict';

import { ParserBase } from "./parser_base.js";
import { Sections } from "./sections_parser.js";
import { Text } from "../graphics/text.js";

export class TextParser extends ParserBase
{
    parse(sectionContent)
    {
        const properties = Sections.getProperties(sectionContent);
        let content = this.keyValueMap.replace(Sections.getValues(sectionContent)[0]);
        let size = this.getTextSize();
        let bold = false;
        let italic = false;
        let align_h = 'left';
        let align_v = 'middle';
        let mirror = false;
        if (properties.font)
        {
            for (let value of properties.font)
            {
                if (value == 'bold') bold = true;
                if (value == 'italic') italic = true;
                if (value.startsWith('size '))
                {
                    size = value.split(' ')[1];
                }
            }
        }
        if (properties.justify)
        {
            for (let value of properties.justify)
            {
                if (['left', 'center', 'right'].includes(value))
                {
                    align_h = value;
                }
                if (['top', 'middle', 'bottom'].includes(value))
                {
                    align_v = value;
                }
                if (value == 'mirror')
                {
                    mirror = true;
                }
            }
        }

        const x = this.correctXY('x', parseFloat(properties.pos[0]), properties.pos?.[2] ?? null);
        let y = this.correctXY('y', parseFloat(properties.pos[1]), properties.pos?.[2] ?? null);
        // Looks like the Y is a bit off, so adjust for that
        y += size * 0.15;
        const repeat = parseInt(properties.repeat?.[0] ?? 1);
        const incrX = parseInt(properties.incrx?.[0] ?? 0);
        const incrY = parseInt(properties.incry?.[0] ?? 0);
        const color = this.getColor('worksheet');

        let font = '';
        font += bold ? 'bold ' : '';
        font += italic ? 'italic ' : '';
        font += `${size}px `;
        font += 'KiCadFont';

        let minX = 0;
        let minY = 0;
        let maxX = this.paper.width;
        let maxY = this.paper.height;
        minX += this.setup.leftMargin || 0;
        minY += this.setup.topMargin || 0;
        maxX -= this.setup.rightMargin || 0;
        maxY -= this.setup.bottomMargin || 0;

        for (let i = 0; i < repeat; i++)
        {
            let xs = x + i * incrX;
            let ys = y + i * incrY;
            if (xs >= minX && xs <= maxX && ys >= minY && ys <= maxY)
            {
                let text = new Text();
                text.font = font;
                text.text = content;
                text.layer = 'sheet';
                text.color = color;
                text.align_h = align_h;
                text.align_v = align_v;
                text.mirror = mirror;
                text.points.push({ x: xs, y: ys });
                this.graphicsElements.push(text);
                if (repeat > 1)
                {
                    content = this.nextTextSequence(content);
                }
            }
        }
    }
}
