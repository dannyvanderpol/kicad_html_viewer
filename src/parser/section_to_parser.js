/*
 * Select the proper parser for the given section.
 */

import { logger } from '../lib/logger.js';
import { JunctionParser } from './section_parsers/junction_parser.js';
import { LineParser } from './section_parsers/line_parser.js';
import { PaperParser } from './section_parsers/paper_parser.js';
import { SetupParser } from './section_parsers/setup_parser.js';
import { TbTextParser } from './section_parsers/tbtext_parser.js';
import { TitleBlockParser } from './section_parsers/title_block_parser.js';

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
    'junction'      : JunctionParser,
    'line'          : LineParser,
    'paper'         : PaperParser,
    'setup'         : SetupParser,
    'tbtext'        : TbTextParser,
    'title_block'   : TitleBlockParser
};
