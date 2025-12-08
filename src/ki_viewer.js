/* KiViewer: view KiCad design in a HTML canvas. */

'use strict';

import { KiColors } from './ki_colors.js';
import { KiDrawer } from './ki_drawer.js';
import { loadFont } from './ki_font.js';
import { KiReader } from './ki_reader.js';
import { pageLayout } from './page_layout.js';

class KiViewer
{
    constructor(canvas, filename)
    {
        this.debug = debugLevels.OFF;
        this.canvas = canvas;
        this.filename = filename;
        this.content = null;
        this.sheet = null;
        this.colors = null;
        this.pageSize = paperSizes.A4;
        this.viewportTransform = {
            x: 0,
            y: 0,
            scale: 1.0
        };
        this.scaleSpeed = 1 / 250;
        this.minScale = 1 / 50;
        this.previousX = 0;
        this.previousY = 0;
        this.isMoving = false;
        this.canvas.addEventListener('mousedown', this._onMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this._onMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this._onMouseMove.bind(this));
        this.canvas.addEventListener('wheel', this._onMouseWheel.bind(this));
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

        this.pageSize = paperSizes[this.content.paper];
        if (!this.pageSize)
        {
            if (this.debug & debugLevels.GENERAL) console.warn('Unknown page size:',  this.content.paper);
            this.pageSize = paperSizes.A4;
        }

        // Fit page to canvas
        this.viewportTransform.scale = this.canvas.width / (this.pageSize.width * 1.02);
        this.viewportTransform.x = (this.canvas.width - this.pageSize.width * this.viewportTransform.scale) / 2;
        this.viewportTransform.y = (this.canvas.height - this.pageSize.height * this.viewportTransform.scale) / 2;
        this._render();
    }

    _render()
    {
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
        drawer.drawPageOutline(this.pageSize);
        drawer.drawContent(this.sheet);
    }

    /* Event handlers */
    _onMouseDown(e)
    {
        if (this.debug & debugLevels.EVENTS) console.log('Mouse down:', e);
        this.previousX = e.clientX;
        this.previousY = e.clientY;
        this.isMoving = true;
    }

    _onMouseUp(e)
    {
        if (this.debug & debugLevels.EVENTS) console.log('Mouse up:', e);
        this.isMoving = false;
    }

    _onMouseMove(e)
    {
        if (!this.isMoving) return;
        if (this.debug & debugLevels.EVENTS) console.log('Mouse move:', e);
        const localX = e.clientX;
        const localY = e.clientY;
        this.viewportTransform.x += localX - this.previousX;
        this.viewportTransform.y += localY - this.previousY;
        this.previousX = localX;
        this.previousY = localY;
        this._render()
    }

    _onMouseWheel(e) {
        if (this.debug & debugLevels.EVENTS) console.log('Mouse wheel:', e);
        e.preventDefault();
        const oldX = this.viewportTransform.x;
        const oldY = this.viewportTransform.y;
        const localX = e.clientX;
        const localY = e.clientY;
        const previousScale = this.viewportTransform.scale;
        this.viewportTransform.scale += e.deltaY * -this.scaleSpeed;
        if (this.viewportTransform.scale < this.minScale)
        {
            this.viewportTransform.scale = this.minScale;
        }
        this.viewportTransform.x = localX - (localX - oldX) * (this.viewportTransform.scale / previousScale);
        this.viewportTransform.y = localY - (localY - oldY) * (this.viewportTransform.scale / previousScale);
        this._render()
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
    COLORS: 0x08,
    ALL: 0xFF
}

// Generate view when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    loadFont();
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
