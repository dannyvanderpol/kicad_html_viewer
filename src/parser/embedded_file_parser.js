/*
 * Parsing a setup section into a design element and graphics elements.
 */

'use strict';

import { ParserBase } from './parser_base.js';
import { Sections } from './sections_parser.js';
import { WorksheetElement } from '../design/worksheet_element.js';
import * as fzstd from '../lib/fzstd.js';

export class EmbeddedFileParser extends ParserBase
{
    parse(sectionContent)
    {
        let sections = Sections.getSections(sectionContent.substring(1, sectionContent.length - 1));
        for (let section of sections)
        {
            let properties = Sections.getProperties(section);
            if (properties.type == 'worksheet')
            {
                this.designElement = new WorksheetElement('worksheet');
                this.designElement.filename = properties.name[0];
                this.designElement.content = properties.data.join('').replace(/^\|+|\|+$/g, '');
                this.designElement.content = atob(this.designElement.content);
                let contentArray = new Uint8Array(this.designElement.content.length);
                for (let i = 0; i < this.designElement.content.length; i++)
                {
                    contentArray[i] = this.designElement.content.charCodeAt(i);
                }
                contentArray = fzstd.decompress(contentArray);
                this.designElement.content = '';
                for (let i = 0; i < contentArray.length; i++)
                {
                    this.designElement.content += String.fromCharCode(contentArray[i]);
                }
            }
        }
    }
}
