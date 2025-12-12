/*
 * Parsing a KiCad file into a design object.
 * input: filename (URI)
 * output: design object
 */

import { Design } from '../design/design.js';
import { fetchFile } from '../lib/fetch_file.js';
import { logger } from '../lib/logger.js';

export async function parseFile(filename)
{
    if (logger.logLevel & logger.LEVEL_PARSER_GENERAL) logger.time('Parser', `[Parser] Parsing file: '${filename}'`);
    let design = new Design();

    if (logger.logLevel & logger.LEVEL_PARSER_FETCH) logger.time('Fetcher', '[Parser] Fetching file content');
    const content = await fetchFile(filename);
    if (logger.logLevel & logger.LEVEL_PARSER_FETCH) logger.time('Fetcher', `[Parser] Content length: ${content.length}`);

    if (logger.logLevel & logger.LEVEL_PARSER_GENERAL) logger.time('Parser', '[Parser] Parsed design:', design);
    return design;
}
