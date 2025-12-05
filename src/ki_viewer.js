/* KiViewer: view KiCad design in a HTML canvas. */

'use strict';

import { KiColors } from './ki_colors.js';
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
        this.colors = null;
        this.viewportTransform = {
            x: 0,
            y: 0,
            scale: 1.0
        };
    }

    async initialize()
    {
        if (this.debug & debugLevels.VIEWER) console.log('Viewer: drawing KiCad content');
        let reader = new KiReader(this.filename, this.debug & debugLevels.READER);
        this.content = await reader.loadFile();

        if (this.debug & debugLevels.GENERAL) console.log('Load default sheet');
        reader = new KiReader('pageLayout', this.debug & debugLevels.READER);
        this.sheet = reader.parseFile(pageLayout);

        this.colors = new KiColors(this.content.type, this.debug & debugLevels.COLORS);

        const pageSize = paperSizes[this.content.paper];
        if (!pageSize)
        {
            if (this.debug & debugLevels.GENERAL) console.warn('Unknown page size:',  this.content.paper);
            pageSize = paperSizes.A4;
        }

        // Fit page to canvas
        this.viewportTransform.scale = this.canvas.width / (pageSize.width * 1.02);
        this.viewportTransform.x = (this.canvas.width - pageSize.width * this.viewportTransform.scale) / 2;
        this.viewportTransform.y = (this.canvas.height - pageSize.height * this.viewportTransform.scale) / 2;

        const ctx = this.canvas.getContext('2d');

        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        ctx.setTransform(
            this.viewportTransform.scale,
            0,
            0,
            this.viewportTransform.scale,
            this.viewportTransform.x,
            this.viewportTransform.y
        );

        const drawer = new KiDrawer(ctx, this.viewportTransform.scale, this.colors, this.debug & debugLevels.DRAWER);
        drawer.drawPageOutline(pageSize);
        drawer.drawContent(this.sheet);
    }
}

const paperSizes = {
  A0: { width: 1189, height: 841 },
  A1: { width: 841,  height: 594 },
  A2: { width: 594,  height: 420 },
  A3: { width: 420,  height: 297 },
  A4: { width: 297,  height: 210 }
};

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
