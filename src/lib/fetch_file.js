/*
 * Fetch the content of a file.
 */

'use strict';

import { logger } from './logger.js';
import { timer  } from './timer.js';

export async function fetchFile(filename)
{
    timer.start('Fetch');
    let content = null;
    try
    {
        const response = await fetch(filename);
        if (!response.ok)
        {
            logger.error(`fetchFile: HTTP error status: ${response.status}`);
        }
        content = await response.text();
    }
    catch (error)
    {
        logger.error('fetchFile: error loading file:', error);
    }
    timer.stop('Fetch');
    return content;
}
