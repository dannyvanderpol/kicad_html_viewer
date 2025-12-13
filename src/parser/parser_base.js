/*
 * Base parser for all section parsers.
 */

import { DesignObject } from '../design/design_object.js';
import { Sections } from './sections_parser.js';
import { timer } from '../lib/timer.js';

export class ParserBase
{
    constructor(sectionContent)
    {
        this.designObject = new DesignObject;
        this.graphicsObjects = [];
        this.sectionName = Sections.getSectionName(sectionContent);
        timer.start(this.sectionName);
        this.sections = Sections.getSections(sectionContent.substring(1, sectionContent.length - 1));
        this.parseSection();
        timer.stop(this.sectionName);
    }

    parseSection()
    {
        // To be implemented by subclasses
        console.error('parseSection() not implemented in subclass');
    }
}
