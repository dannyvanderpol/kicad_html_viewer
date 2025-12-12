/*
 * Parsing a KiCad file into a design object.
 * input: filename (URI)
 * output: design object
 */

import { Design } from '../design/design.js';
import { fetchFile } from '../lib/fetch_file.js';
import { logger } from '../lib/logger.js';
import { Sections } from './sections.js';

export async function parseFile(filename)
{
    if (logger.logLevel & logger.LEVEL_PARSER_FETCH) logger.info('Fetcher', '[Parser] Fetching file content');
    const content = await fetchFile(filename);
    if (logger.logLevel & logger.LEVEL_PARSER_FETCH) logger.info('Fetcher', `[Parser] Content length: ${content.length}`);

    if (logger.logLevel & logger.LEVEL_PARSER_GENERAL) logger.info('Parser', `[Parser] Parsing file: '${filename}'`);
    let design = new Design();

    let sections = Sections.getSections(content);
    if (sections.length != 1)
    {
        if (logger.logLevel & logger.LEVEL_PARSER_GENERAL) logger.error('[Parser] Invalid file format.');
    }
    else
    {
        design.fileType = Sections.getSectionName(sections[0]);
        if (logger.logLevel & logger.LEVEL_PARSER_GENERAL) logger.info(`[Parser] Design type: '${design.fileType}'`);

    }

    if (logger.logLevel & logger.LEVEL_PARSER_GENERAL) logger.info('Parser', '[Parser] Parsed design:', design);
    return design;
}
