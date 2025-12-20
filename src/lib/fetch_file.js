/*
 * Fetch the content of a file.
 */

'use strict';

import { logger } from './logger.js';
import { timer  } from './timer.js';

export async function fetchFile(filename)
{
    timer.start('Fetch file');
    let content = null;
    try
    {
        const response = await fetch(filename);
        if (!response.ok)
        {
            logger.error(logger.LEVEL_SYSTEM, `fetchFile: HTTP error status: ${response.status}`);
        }
        else
        {
            content = await response.text();
        }
    }
    catch (error)
    {
        logger.error(logger.LEVEL_SYSTEM, 'fetchFile: error loading file:', error);
    }
    timer.stop('Fetch file');
    return content;
}
