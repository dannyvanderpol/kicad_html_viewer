/*
 * Parsing a setup section into a design element and graphics elements.
 */

'use strict';

import { ParserBase } from './parser_base.js';
import { Sections } from './sections_parser.js';
import { SetupElement } from '../design/setup_element.js';

export class SetupParser extends ParserBase
{
    parse(sections)
    {
        let properties = Sections.getProperties(sections, true);
        this.designElement = new SetupElement(this.sectionName);
        this.designElement.textSize = properties.textsize ? parseFloat(properties.textsize) : 0;
        this.designElement.lineWidth = properties.linewidth ? parseFloat(properties.linewidth) : 0;
        this.designElement.leftMargin = properties.left_margin ? parseFloat(properties.left_margin) : 0;
        this.designElement.rightMargin = properties.right_margin ? parseFloat(properties.right_margin) : 0;
        this.designElement.topMargin = properties.top_margin ? parseFloat(properties.top_margin) : 0;
        this.designElement.bottomMargin = properties.bottom_margin ? parseFloat(properties.bottom_margin) : 0;
    }
}
