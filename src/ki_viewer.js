/* KiViewer: view KiCad design in a HTML canvas. */

'use strict';

import { parseFile } from './parser/design_parser.js';
import { logger    } from './lib/logger.js';
import { timer     } from './lib/timer.js';

// Old imports
import { loadFont } from './lib/ki_font.js';

class KiViewer
{
    constructor(canvas, filename)
    {
        logger.logLevel = logger.LEVEL_SYSTEM | logger.LEVEL_PARSER;

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
        this.fitScaleX = 1;
        this.fitScaleY = 1;
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
        timer.start('Viewer');
        if (logger.logLevel & logger.LEVEL_VIEWER_GENERAL) logger.info(`[Viewer] viewing file '${this.filename}'`);
        let design = await parseFile(this.filename);

        this._render();
        timer.stop('Viewer');
        if (logger.logLevel & logger.LEVEL_TIMER) timer.showReport();
    }

    _render()
    {
        timer.start('Render');
        const ctx = this.canvas.getContext('2d');

        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // Don't allow moving the page out of view
        let scaleRatioX = this.viewportTransform.scale / this.fitScaleX;
        let scaleRatioY = this.viewportTransform.scale / this.fitScaleY;
        let maxX = this.canvas.width * 0.95;
        let minX = -this.canvas.width * 0.95;
        let maxY = this.canvas.height * 0.95;
        let minY = -this.canvas.height * 0.95;
        this.viewportTransform.x = (this.viewportTransform.x > maxX) ? maxX : this.viewportTransform.x;
        this.viewportTransform.x = (this.viewportTransform.x / scaleRatioX < minX) ? minX * scaleRatioX : this.viewportTransform.x;
        this.viewportTransform.y = (this.viewportTransform.y > maxY) ? maxY : this.viewportTransform.y;
        this.viewportTransform.y = (this.viewportTransform.y / scaleRatioY < minY) ? minY * scaleRatioY : this.viewportTransform.y;
        ctx.setTransform(
            this.viewportTransform.scale,
            0,
            0,
            this.viewportTransform.scale,
            this.viewportTransform.x,
            this.viewportTransform.y
        );
        timer.stop('Render');
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
