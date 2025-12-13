/* KiViewer: view KiCad design in a HTML canvas. */

'use strict';

import { KiColors } from './ki_colors.js';
import { KiDrawer } from './ki_drawer.js';
import { loadFont } from './ki_font.js';
import { KiReader } from './ki_reader.js';
import { pageLayout } from './ki_pagelayout.js';

// New parser
import { parseFile } from './parser/parser.js';
import { logger    } from './lib/logger.js';
import { timer     } from './lib/timer.js';

class KiViewer
{
    constructor(canvas, filename)
    {
        logger.logLevel = logger.LEVEL_SYSTEM | logger.LEVEL_PARSER;

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
        this.valuesDictionary = {
            paper: '',
            sheetpath: '',
            filename: '',
            title: '',
            kicad_version: '',
            issue_date: '',
            revision: '',
            pageNumber: '',
            totalPages: '',
            company: '',
            comment1: '',
            comment2: '',
            comment3: '',
            comment4: '',
        };
    }

    async initialize()
    {
        timer.start('Viewer');
        if (logger.logLevel & logger.LEVEL_VIEWER_GENERAL) logger.info(`[Viewer] viewing file '${this.filename}'`);
        let design = await parseFile(this.filename);


        // Old reader, to be replaced
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

        // Set values from content
        // Must haves:
        this.valuesDictionary.paper = this.content.paper;
        this.valuesDictionary.sheetpath = this.content.sheetpath;
        this.valuesDictionary.filename = this.content.filename;
        this.valuesDictionary.title = this.content.titleBlock.title;
        this.valuesDictionary.kicad_version = 'KiCad V' + this.content.version;
        this.valuesDictionary.issue_date = this.content.titleBlock.date;
        this.valuesDictionary.pageNumber = this.content.pageNumber;
        this.valuesDictionary.totalPages = this.content.totalPages;
        // Could haves:
        this.valuesDictionary.revision = this.content.titleBlock.rev || '';
        this.valuesDictionary.company = this.content.titleBlock.company || '';
        this.valuesDictionary.comment1 = this.content.titleBlock.comment1 || '';
        this.valuesDictionary.comment2 = this.content.titleBlock.comment2 || '';
        this.valuesDictionary.comment3 = this.content.titleBlock.comment3 || '';
        this.valuesDictionary.comment4 = this.content.titleBlock.comment4 || '';

        // Fit page to canvas
        this.fitScaleX = this.canvas.width / this.pageSize.width;
        this.fitScaleY = this.canvas.height / this.pageSize.height;
        this.viewportTransform.scale = Math.min(this.fitScaleX, this.fitScaleY) * 0.98;
        this.viewportTransform.x = (this.canvas.width - this.pageSize.width * this.viewportTransform.scale) / 2;
        this.viewportTransform.y = (this.canvas.height - this.pageSize.height * this.viewportTransform.scale) / 2;
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

        const drawer = new KiDrawer(ctx, this.viewportTransform.scale, this.colors, this.valuesDictionary,
                                    this.debug & debugLevels.DRAWER);
        drawer.drawPageOutline(this.pageSize);
        drawer.drawContent(this.sheet);
        drawer.drawContent(this.content);
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
