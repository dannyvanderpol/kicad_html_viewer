/*
 * Fetch the content of a file.
 */

'use strict';

import { logger } from './logger.js';

export async function fetchFile(filename)
{
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
    return content;
}
