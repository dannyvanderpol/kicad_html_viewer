/* KiViewer */

'use strict';

import { KiReader } from './ki_reader.js';

class KiViewer
{
    constructor(canvas, filename)
    {
        this.debug = debugLevels.OFF | debugLevels.READER;
        this.canvas = canvas;
        this.filename = filename;
        this.content = null;
        this.sheet = null;
    }

    async draw()
    {
        if (this.debug & debugLevels.VIEWER) console.log('Viewer: drawing KiCad content');
        let reader = new KiReader(this.filename, this.debug & debugLevels.READER);
        this.content = await reader.loadFile();

        if (this.debug & debugLevels.GENERAL) console.log('Load default sheet');
        reader = new KiReader('/src/pagelayout.kicad_wks', this.debug & debugLevels.READER);
        this.sheet = await reader.loadFile();
    }
}

const debugLevels = {
    OFF: 0x00,
    VIEWER: 0x01,
    READER: 0x02
}

// Generate view when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    for (const canvas of document.querySelectorAll('canvas[type="application/kicad"]'))
    {
        let filename = canvas.getAttribute('src');
        if (filename)
        {
            const viewer = new KiViewer(canvas, filename);
            await viewer.draw();
        }
    }
});
