/* KiReader */

'use strict';

export class KiReader
{

    constructor(filename, showDebug)
    {
        this.filename = filename;
        this.showDebug = showDebug;
    }

    async loadFile()
    {
        let content = {};
        if (this.showDebug) console.log('Reader: load file:', this.filename);
        try
        {
            const response = await fetch(this.filename);
            if (!response.ok)
            {
                if (this.showDebug) console.error(`Reader: HTTP error status: ${response.status}`);
            }
            else
            {
                const text = await response.text();
                content = this._parseFile(text);
                content.filename = this.filename;
                if (this.showDebug) console.log('Reader: file loaded successfully');
            }
        }
        catch (error)
        {
            if (this.showDebug) console.error('Reader: error loading file:', error);
        }
        return content;
    }

    _parseFile(data)
    {
        let content = {
        }

        return content;
    }
}
