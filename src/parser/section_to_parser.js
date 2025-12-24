/*
 * Select the proper parser for the given section.
 */

import { logger } from '../lib/logger.js';
import { PaperParser } from './section_parsers/paper_parser.js';

export function getParser(sectionName)
{
    if (skipSections.includes(sectionName))
    {
        return null;
    }
    const parserClass = sectionToParser[sectionName];
    if (!parserClass)
    {
        logger.warn(logger.LEVEL_PARSER, '[Parser] Unknown section:', sectionName);
        return null;
    }
    return new parserClass();
}

const skipSections = [ 'version', 'generator' ];

const sectionToParser = {
    'paper': PaperParser
};
