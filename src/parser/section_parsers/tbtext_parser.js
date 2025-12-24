/*
 * Parse a tbtext section (title block text).
 */

'use strict';

import { BaseParser } from "./base_parser.js";
import { Sections } from "../sections_parser.js";

export class TbTextParser extends BaseParser
{
    parse(sectionContent)
    {
        const properties = Sections.getProperties(sectionContent);

        let content = this.keyValueMap.replace(Sections.getValues(sectionContent)[0]);
        let size = this.getTextSize();
        let bold = false;
        let italic = false;
        let hAlign = 'left';
        let vAlign = 'middle';
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
                    hAlign = value;
                }
                if (['top', 'middle', 'bottom'].includes(value))
                {
                    vAlign = value;
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

        for (let i = 0; i < repeat; i++)
        {
            let xs = x + i * incrX;
            let ys = y + i * incrY;
            if (xs >= this.minX && xs <= this.maxX && ys >= this.minY && ys <= this.maxY)
            {
                const points =[{ x: xs, y: ys }];
                this.addText('sheet', points, content, size, color, bold, italic, hAlign, vAlign, mirror)
                if (repeat > 1)
                {
                    content = this.nextTextSequence(content);
                }
            }
        }
    }
}
