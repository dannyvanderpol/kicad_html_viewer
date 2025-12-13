/*
 * Class for drawing the objects.
 */

'use strict';


import { logger } from '../lib/logger.js';
import { timer } from '../lib/timer.js';

export const Drawer = {
    layerOrder: {
        'kicad_sch': ['sheet', 'design'],
        'kicad_pcb': ['sheet', 'B.Cu', 'F.Cu', 'design']
    },

    draw: function (ctx, designObject)
    {
        let drawnLayers = [];
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
                    element.draw(ctx);
                }
                drawnLayers.push(layer);
            }
        }
        if (logger.logLevel & logger.LEVEL_DRAWER_GENERAL) logger.info('[Drawer] drawn layers:', drawnLayers);
        const undrawn = Object.keys(byLayer).filter(layer => !drawnLayers.includes(layer));
        if (undrawn.length > 0 && logger.logLevel & logger.LEVEL_DRAWER_GENERAL) logger.warn('[Drawer] undrawn layers:', undrawn);

        timer.stop('Drawer');
    }
}
