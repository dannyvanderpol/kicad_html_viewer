/*
 * Parsing a KiCad file into a design object.
 * input: filename (URI)
 * output: design object
 */

import { logger } from '../lib/logger.js';
import { timer } from '../lib/timer.js';
import { fetchFile } from '../lib/fetch_file.js';
import { DesignObject } from '../design/design_object.js';
import { Sections } from './sections_parser.js';
import { PAGE_LAYOUT } from '../lib/ki_pagelayout.js';
import { LineParser } from './line_parser.js';
import { PaperParser } from './paper_parser.js';
import { RectangleParser } from './rectangle_parser.js';
import { SetupParser } from './setup_parser.js';
import { TextParser } from './text_parser.js';
import { ZoneParser } from './zone_parser.js';

export const DesignParser = {
    parseFile: async function (filename)
    {
        timer.start('Parse design');
        logger.info(logger.LEVEL_PARSER, '[Parser] Fetching file content');
        const content = await fetchFile(filename);

        logger.info(logger.LEVEL_PARSER, `[Parser] Content length: ${content.length} bytes`);
        logger.info(logger.LEVEL_PARSER, `[Parser] Parsing file: '${filename}'`);
        let design = this.parseContent(content);
        design.filename = filename;

        let pageLayout = this.parseContent(PAGE_LAYOUT, design.designType, design.getDesignElement('paper'));
        design.designElements.push(...pageLayout.designElements);
        design.graphicsElements.push(...pageLayout.graphicsElements);

        logger.info(logger.LEVEL_PARSER, `[Parser] Parsed design: ${design.designType} ` +
                                         `${design.designElements.length} design elements, ` +
                                         `${design.graphicsElements.length} graphic elements`);
        timer.stop('Parse design');
        return design;
    },

    parseContent: function (content, parentType=null, paper=null)
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
                let elementParser = null;
                let sectionName = Sections.getSectionName(section);
                switch (sectionName)
                {
                    case 'generator_version':
                        design.version = Sections.getValues(section)[0];
                        break;

                    case 'line':
                        elementParser = new LineParser();
                        break;

                    case 'paper':
                        elementParser = new PaperParser();
                        break;

                    case 'rect':
                        elementParser = new RectangleParser();
                        break;

                    case 'setup':
                        elementParser = new SetupParser();
                        break;

                    case 'tbtext':
                        elementParser = new TextParser();
                        break;

                    case 'zone':
                        elementParser = new ZoneParser();
                        break;

                    // Skip
                    case 'embedded_fonts':
                    case 'generator':
                    case 'version':
                        logger.info(logger.LEVEL_PARSER, `[Parser] Skip '${sectionName}'`);
                        break;

                    // Unknown
                    default:
                        logger.warn(logger.LEVEL_PARSER, '[Parser] Unknown section:', sectionName);
                        break;
                }
                if (elementParser != null)
                {
                    elementParser.parseSection(section, design.designType, parentType,
                                               design.getDesignElement('setup'), paper);
                    design.designElements.push(elementParser.designElement);
                    design.graphicsElements.push(...elementParser.graphicsElements);
                }
            }
        }
        timer.stop('Parse content');
        return design;
    }
}
