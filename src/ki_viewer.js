/* KiViewer */

'use strict';

class KiViewer
{
    constructor(canvas, filename)
    {
        this.debug = debugLevels.VIEWER;
        this.canvas = canvas;
        this.filename = filename;
    }

    async draw()
    {
        if (this.debug & debugLevels.VIEWER)
        {
            console.log('Drawing KiCad content');
            console.log('Filename:', this.filename);
            console.log('Canvas:', this.canvas);
        }
    }
}

const debugLevels = {
    OFF: 0x00,
    VIEWER: 0x01
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
