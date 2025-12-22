/* KiViewer: view KiCad design in a HTML canvas. */

'use strict';

import { timer } from './lib/timer.js';
import { logger } from './lib/logger.js';
import { KI_FONT } from './lib/ki_font.js';
import { Colors } from './lib/colors.js';
import { DesignParser } from './parser/design_parser.js';
import { Drawer } from './drawer/drawer.js';

class KiViewer
{
    constructor(canvas)
    {
        logger.setLogElement('logOutput');

        // Get user settings if defined, else use defaults
        // User settings can be difined by:
        // <script>
        //     const kiViewerSettings {
        //         ... add your settings here ...
        //     }
        // </script>
        const userSettings = typeof kiViewerSettings !== 'undefined' ? kiViewerSettings : {};
        logger.logLevel |= userSettings.logLevel || 0;

        this.canvas = canvas;
        this.design = null;
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
        timer.reset();
    }

    async initialize()
    {
        timer.start('Viewer');
        let canvasSrc = this.canvas.getAttribute('src');
        let filename = this.canvas.getAttribute('filename');

        logger.info(logger.LEVEL_VIEWER, `[Viewer] viewing file '${filename}'`);
        this.design = await DesignParser.parseFile(canvasSrc, filename);
        if (this.design)
        {
            // Fit page to canvas
            let page = this.design.getDesignElement('paper');
            this.fitScaleX = this.canvas.width / page.width;
            this.fitScaleY = this.canvas.height / page.height;
            this.viewportTransform.scale = Math.min(this.fitScaleX, this.fitScaleY) * 0.98;
            this.viewportTransform.x = (this.canvas.width - page.width * this.viewportTransform.scale) / 2;
            this.viewportTransform.y = (this.canvas.height - page.height * this.viewportTransform.scale) / 2;
            this._render();
        }
        timer.stop('Viewer');
        timer.showReport();
    }

    _render()
    {
        timer.start('Render');
        const ctx = this.canvas.getContext('2d');
        ctx.globalCompositeOperation = "source-over";
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // We draw the background instead of using CSS, when saving the canvas as image, the background is included
        ctx.fillStyle = Colors[this.design.designType]['background'];
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
        Drawer.draw(ctx, this.design, this.viewportTransform.scale);
        timer.stop('Render');
    }

    /* Event handlers */
    _onMouseDown(e)
    {
        if (logger.logLevel & logger.LEVEL_EVENTS) console.log(e);
        this.previousX = e.clientX;
        this.previousY = e.clientY;
        this.isMoving = true;
    }

    _onMouseUp(e)
    {
        if (logger.logLevel & logger.LEVEL_EVENTS) console.log(e);
        this.isMoving = false;
    }

    _onMouseMove(e)
    {
        if (!this.isMoving) return;
        if (logger.logLevel & logger.LEVEL_EVENTS) console.log(e);
        const localX = e.clientX;
        const localY = e.clientY;
        this.viewportTransform.x += localX - this.previousX;
        this.viewportTransform.y += localY - this.previousY;
        this.previousX = localX;
        this.previousY = localY;
        this._render()
    }

    _onMouseWheel(e) {
        if (logger.logLevel & logger.LEVEL_EVENTS) console.log(e);
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
    // Load font
    const font = new FontFace('KiCadFont', KI_FONT.buffer);
    font.load().then(function(loadedFont) {
        document.fonts.add(loadedFont);
    });

    for (const canvas of document.querySelectorAll('canvas[type="application/kicad"]'))
    {
        const viewer = new KiViewer(canvas);
        await viewer.initialize();
    }
});
