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

    const content = await fetchFile(filename);

    if (logger.logLevel & logger.LEVEL_PARSER_FETCH) logger.info('Fetcher', `[Parser] Content length: ${content.length} bytes`);

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
        for (let section of Sections.getSections(sections[0].substring(1, sections[0].length - 1)))
        {
            let sectionName = Sections.getSectionName(section);
            switch (sectionName)
            {
                // Skip
                case 'embedded_fonts':
                    if (logger.logLevel & logger.LEVEL_PARSER_GENERAL) logger.info(`[Parser] Skip '${sectionName}'`);
                    break;

                // Unknown
                default:
                    if (logger.logLevel & logger.LEVEL_PARSER_GENERAL) logger.warn('[Parser] Unknown section:', sectionName);
                    break;
            }
        }
    }

    timer.stop('Parse content');
    if (logger.logLevel & logger.LEVEL_PARSER_GENERAL) logger.info('Parser', '[Parser] Parsed design:', design);
    timer.stop('Parser');
    return design;
}
