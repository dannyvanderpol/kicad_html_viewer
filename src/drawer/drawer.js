/*
 * Class for drawing the objects.
 */

'use strict';

import { logger } from '../lib/logger.js';
import { timer } from '../lib/timer.js';

export const Drawer = {

    draw: function (ctx, designObject, scale)
    {
        // We always start with the worksheet
        let layerOrder = [ 'sheet' ];
        // Add any design specific layers
        let layers = designObject.getDesignElement('layers');
        if (layers)
        {
            layerOrder.push(...layers.layers);
        }
        // End with design layers
        layerOrder.push('design');

        let drawnLayers = [];
        timer.start('Drawer');
        logger.info(logger.LEVEL_DRAWER, `[Drawer] drawing '${designObject.filename}'`, designObject.designType);

        const byLayer = designObject.graphicsElements.reduce((acc, obj) => { (acc[obj.layer] ??= []).push(obj); return acc;}, {});
        for (const layer of layerOrder)
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
