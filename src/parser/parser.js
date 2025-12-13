/*
 * Parsing a KiCad file into a design object.
 * input: filename (URI)
 * output: design object
 */

import { Design     } from '../design/design.js';
import { fetchFile  } from '../lib/fetch_file.js';
import { logger     } from '../lib/logger.js';
import { Sections   } from './sections.js';
import { timer      } from '../lib/timer.js';

export async function parseFile(filename)
{
    timer.start('Parser');
    if (logger.logLevel & logger.LEVEL_PARSER_FETCH) logger.info('Fetcher', '[Parser] Fetching file content');
    timer.start('Fetch');
    const content = await fetchFile(filename);
    timer.stop('Fetch');
    if (logger.logLevel & logger.LEVEL_PARSER_FETCH) logger.info('Fetcher', `[Parser] Content length: ${content.length}`);

    timer.start('Parse content');
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
    timer.stop('Parse content');
    if (logger.logLevel & logger.LEVEL_PARSER_GENERAL) logger.info('Parser', '[Parser] Parsed design:', design);
    timer.stop('Parser');
    return design;
}
