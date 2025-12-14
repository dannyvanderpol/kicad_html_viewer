/*
 * Parsing a KiCad file into a design object.
 * input: filename (URI)
 * output: design object
 */

import { DesignObject } from '../design/design_object.js';
import { fetchFile } from '../lib/fetch_file.js';
import { logger } from '../lib/logger.js';
import { Sections } from './sections_parser.js';
import { timer } from '../lib/timer.js';
import { ZoneParser } from './zone_parser.js';

export const DesignParser = {
    parseFile: async function (filename)
    {
        timer.start('Parse design');
        if (logger.logLevel & logger.LEVEL_PARSER_FETCH) logger.info('[Parser] Fetching file content');

        const content = await fetchFile(filename);

        if (logger.logLevel & logger.LEVEL_PARSER_FETCH) logger.info(`[Parser] Content length: ${content.length} bytes`);


        if (logger.logLevel & logger.LEVEL_PARSER_GENERAL) logger.info(`[Parser] Parsing file: '${filename}'`);

        let design = this.parseContent(content);
        design.filename = filename;

        if (logger.logLevel & logger.LEVEL_PARSER_GENERAL) logger.info('[Parser] Parsed design:', design);
        timer.stop('Parse design');
        return design;
    },

    parseContent: function (content)
    {
        timer.start('Parse content');

        let design = new DesignObject();
        let sections = Sections.getSections(content);
        if (sections.length != 1)
        {
            if (logger.logLevel & logger.LEVEL_PARSER_GENERAL) logger.error('[Parser] Invalid file format.');
        }
        else
        {
            design.designType = Sections.getSectionName(sections[0]);
            if (logger.logLevel & logger.LEVEL_PARSER_GENERAL) logger.info(`[Parser] Design type: '${design.designType}'`);
            for (let section of Sections.getSections(sections[0].substring(1, sections[0].length - 1)))
            {
                let sectionName = Sections.getSectionName(section);
                switch (sectionName)
                {
                    case 'zone':
                        const zone = new ZoneParser(design.designType, section);
                        design.designElements.push(zone.designElement);
                        design.graphicsElements.push(...zone.graphicsElements);
                        break;

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
        return design;
    }
}
