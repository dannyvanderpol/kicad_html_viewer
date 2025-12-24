/*
 * Parse the title block section.
 */

'use strict';

import { BaseParser } from "./base_parser.js";
import { Sections } from "../sections_parser.js";
import { TitleBlockElement } from "../../design/title_block_element.js";

export class TitleBlockParser extends BaseParser
{
    parse(sectionContent)
    {
        const titleBlock = new TitleBlockElement('title_block');
        const properties = Sections.getProperties(sectionContent, true);
        for (let prop in properties)
        {
            switch (prop)
            {
                case 'comment1':
                    titleBlock.comment1 = properties[prop];
                    this.keyValueMap.set('comment1', titleBlock.comment1);
                    break;

                case 'comment2':
                    titleBlock.comment2 = properties[prop];
                    this.keyValueMap.set('comment2', titleBlock.comment2);
                    break;

                case 'comment3':
                    titleBlock.comment3 = properties[prop];
                    this.keyValueMap.set('comment3', titleBlock.comment3);
                    break;

                case 'comment4':
                    titleBlock.comment4 = properties[prop];
                    this.keyValueMap.set('comment4', titleBlock.comment4);
                    break;

                case 'company':
                    titleBlock.company = properties[prop];
                    this.keyValueMap.set('company', titleBlock.company);
                    break;

                case 'date':
                    titleBlock.date = properties[prop];
                    this.keyValueMap.set('issue_date', titleBlock.date);
                    break;

                case 'kicad_version':
                    titleBlock.kicad_version = properties[prop];
                    this.keyValueMap.set('kicad_version', titleBlock.kicad_version);
                    break;

                case 'rev':
                    titleBlock.revision = properties[prop];
                    this.keyValueMap.set('revision', titleBlock.revision);
                    break;

                case 'title':
                    titleBlock.title = properties[prop];
                    this.keyValueMap.set('title', titleBlock.title);
                    break;
            }
        }
    }
}
