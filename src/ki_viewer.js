/* KiViewer */

'use strict';

import { KiDrawer } from './ki_drawer.js';
import { KiReader } from './ki_reader.js';
import { pageLayout } from './page_layout.js';

class KiViewer
{
    constructor(canvas, filename)
    {
        this.debug = debugLevels.ALL;
        this.canvas = canvas;
        this.filename = filename;
        this.content = null;
        this.sheet = null;
    }

    async initialize()
    {
        if (this.debug & debugLevels.VIEWER) console.log('Viewer: drawing KiCad content');
        let reader = new KiReader(this.filename, this.debug & debugLevels.READER);
        this.content = await reader.loadFile();

        if (this.debug & debugLevels.GENERAL) console.log('Load default sheet');
        reader = new KiReader('pageLayout', this.debug & debugLevels.READER);
        this.sheet = reader.parseFile(pageLayout);

        const drawer = new KiDrawer(this.canvas, this.debug & debugLevels.DRAWER);
    }
}

const debugLevels = {
    OFF: 0x00,
    VIEWER: 0x01,
    READER: 0x02,
    DRAWER: 0x04,
    ALL: 0xFF
}

// Generate view when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    for (const canvas of document.querySelectorAll('canvas[type="application/kicad"]'))
    {
        let filename = canvas.getAttribute('src');
        if (filename)
        {
            const viewer = new KiViewer(canvas, filename);
            await viewer.initialize();
        }
    }
});
