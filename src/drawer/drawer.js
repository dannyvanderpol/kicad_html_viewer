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

    draw: function (ctx, designObject, scale)
    {
        let drawnLayers = [];
        timer.start('Drawer');
        logger.info(logger.LEVEL_DRAWER, `[Drawer] drawing '${designObject.filename}'`, designObject.designType);

        const byLayer = designObject.graphicsElements.reduce((acc, obj) => { (acc[obj.layer] ??= []).push(obj); return acc;}, {});
        for (const layer of this.layerOrder[designObject.designType])
        {
            if (byLayer[layer])
            {
                if (byLayer[layer].length > 0)
                {
                    logger.info(logger.LEVEL_DRAWER, `[Drawer] drawing layer '${layer}'`);
                    logger.info(logger.LEVEL_DRAWER, `[Drawer] drawing ${byLayer[layer].length} elements`);
                    for (const element of byLayer[layer])
                    {
                        element.scale = scale;
                        element.draw(ctx);
                    }
                    drawnLayers.push(layer);
                }
            }
        }
        logger.info(logger.LEVEL_DRAWER, '[Drawer] drawn layers: ' + drawnLayers.join(', '));
        const undrawn = Object.keys(byLayer).filter(layer => !drawnLayers.includes(layer));
        if (undrawn.length > 0) logger.warn(logger.LEVEL_DRAWER, '[Drawer] undrawn layers: ' + undrawn.join(', '));
        timer.stop('Drawer');
    }
}
