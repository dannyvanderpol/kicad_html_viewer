/*
 * Object contains info about an page in a design.
 */

'use strict';

import { DesignElement } from "./design_element.js";

export class LayersElement extends DesignElement
{
    constructor(reference)
    {
        super(reference);
        this.copperLayers = [];
    }
}
