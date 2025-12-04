/* KiReader */

'use strict';

export class KiReader
{

    constructor(filename, debug)
    {
        this.filename = filename;
        this.debug = debug;
    }

    async loadFile()
    {
        if (this.debug) console.log('Reader: load file:', this.filename);
    }
}
