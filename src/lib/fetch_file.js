/*
 * Fetch the content of a file.
 */

'use strict';

export async function fetchFile(filename)
{
    let content = null;
    try
    {
        const response = await fetch(filename);
        if (!response.ok)
        {
            console.error(`fetchFile: HTTP error status: ${response.status}`);
        }
        content = await response.text();
    }
    catch (error)
    {
        console.error('fetchFile: error loading file:', error);
    }
    return content;
}
