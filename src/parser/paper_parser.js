/*
 * Parsing a paper section into a design object and graphics objects.
 */

'use strict';

import { logger } from '../lib/logger.js';
import { ParserBase } from './parser_base.js';
import { Sections } from './sections_parser.js';
import { Rectangle } from '../graphics/rectangle.js';
import { PaperElement } from '../design/paper_element.js';

export class PaperParser extends ParserBase
{
    parse(sectionContent)
    {
        let values = Sections.getValues(sectionContent);
        let pageSize = paperSizes[values[0]];
        if (!pageSize)
        {
            logger.warn(logger.LEVEL_PARSER, 'Unknown page size:',  values[0]);
            pageSize = paperSizes.A4;
        }
        this.keyValueMap.set('paper', values[0]);

        this.designElement = new PaperElement('paper');
        this.designElement.width = pageSize.width;
        this.designElement.height = pageSize.height;

        let rectangle = new Rectangle();
        rectangle.layer = 'sheet';
        rectangle.color = this.getColor('page_limits');
        rectangle.size = 0.5;
        rectangle.scaledSize = true;
        rectangle.points.push({ x: 0, y: 0 });
        rectangle.points.push({ x: pageSize.width, y: pageSize.height });
        this.graphicsElements.push(rectangle);
    }
}

const paperSizes = {
  A0: { width: 1189, height: 841 },
  A1: { width: 841,  height: 594 },
  A2: { width: 594,  height: 420 },
  A3: { width: 420,  height: 297 },
  A4: { width: 297,  height: 210 }
};
