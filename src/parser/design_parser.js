/*
 * Parsing a KiCad file into a design object.
 * input: filename (URI)
 * output: design object
 */

'use strict';

import { logger } from '../lib/logger.js';
import { timer } from '../lib/timer.js';
import { fetchFile } from '../lib/fetch_file.js';
import { PAGE_LAYOUT } from '../lib/ki_pagelayout.js';
import { KeyValueMap } from '../lib/key_value_map.js';
import { DesignObject } from '../design/design_object.js';
import { Sections } from './sections_parser.js';
import { getParser } from './section_to_parser.js';

export const DesignParser = {
    parseFile: async function (src, filename)
    {
        let design = null;
        timer.start('Parse design');
        logger.info(logger.LEVEL_PARSER, '[Parser] Fetching file content');
        const content = await fetchFile(src);
        if (content)
        {
            logger.info(logger.LEVEL_PARSER, `[Parser] Content length: ${content.length} bytes`);
            logger.info(logger.LEVEL_PARSER, `[Parser] Parsing file: '${filename}'`);
            const keyValueMap = new KeyValueMap();
            keyValueMap.set('filename', filename);

            design = this.parseContent(content, keyValueMap);
            design.filename = filename;

            // TODO: set to the actual page numbers
            keyValueMap.set('#', 1);
            keyValueMap.set('##', 1);

            // Get embedded worksheet from design if any
            let pageLayout = PAGE_LAYOUT;
            let worksheet = design.getDesignElement('worksheet');
            if (worksheet)
            {
                pageLayout = worksheet.content;
            }
            pageLayout = this.parseContent(pageLayout, keyValueMap, design.designType, design.getDesignElement('paper'));
            design.designElements.push(...pageLayout.designElements);
            design.graphicsElements.push(...pageLayout.graphicsElements);

            logger.info(logger.LEVEL_PARSER, `[Parser] Parsed design: ${design.designType} ` +
                                            `${design.designElements.length} design elements, ` +
                                            `${design.graphicsElements.length} graphic elements`);
        }
        timer.stop('Parse design');
        return design;
    },

    parseContent: function (content, keyValueMap, parentType=null, paper=null)
    {
        timer.start('Parse content');
        let design = new DesignObject();
        let sections = Sections.getSections(content);
        if (sections.length != 1)
        {
            logger.error(logger.LEVEL_SYSTEM, '[Parser] Invalid file format.');
        }
        else
        {
            design.designType = Sections.getSectionName(sections[0]);
            logger.info(logger.LEVEL_PARSER, `[Parser] Design type: '${design.designType}'`);
            for (let section of Sections.getSections(sections[0].substring(1, sections[0].length - 1)))
            {
                let sectionName = Sections.getSectionName(section);
                // Sepecific sections that doesn't require a parser
                if (sectionName == 'generator_version')
                {
                    design.version = Sections.getValues(section)[0];
                }
                else if (sectionName == 'uuid')
                {
                    design.uuid = Sections.getValues(section)[0];
                }
                else
                {
                    let elementParser = getParser(sectionName);
                    if (elementParser)
                    {
                        elementParser.parseSection(section, design.designType, parentType,
                                                design.getDesignElement('setup'), paper, keyValueMap);
                        design.designElements.push(elementParser.designElement);
                        design.graphicsElements.push(...elementParser.graphicsElements);
                    }
                }
            }
        }
        timer.stop('Parse content');
        return design;
    }
}
