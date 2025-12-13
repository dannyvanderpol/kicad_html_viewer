/*
 * Class for drawing the objects.
 */

'use strict';


import { logger } from '../lib/logger.js';
import { timer } from '../lib/timer.js';

export const Drawer = {
    layerOrder: {
        'kicad_sch': ['sheet'],
        'kicad_pcb': ['sheet']
    },

    draw: function (designObject)
    {
        timer.start('Drawer');
        if (logger.logLevel & logger.LEVEL_DRAWER_GENERAL) logger.info(`[Drawer] drawing '${designObject.filename}'`, designObject);

        const byLayer = designObject.graphicsElements.reduce((acc, obj) => { (acc[obj.layer] ??= []).push(obj); return acc;}, {});
        for (const layer of this.layerOrder[designObject.designType])
        {
            if (logger.logLevel & logger.LEVEL_DRAWER_LAYER) logger.info(`[Drawer] drawing layer '${layer}'`);
            if (byLayer[layer])
            {
                if (logger.logLevel & logger.LEVEL_DRAWER_ELEMENT) logger.info('[Drawer] drawing elements:' , byLayer[layer]);
                for (const element of byLayer[layer])
                {
                    element.draw();
                }
            }
        }
        timer.stop('Drawer');
    }
}
