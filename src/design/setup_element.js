/*
 * Object contains info about a setup in a design.
 */

'use strict';

import { DesignElement } from "./design_element.js";

export class SetupElement extends DesignElement
{
    constructor(reference)
    {
        super(reference);
        this.textSize = 0;
        this.lineWidth = 0;
        this.leftMargin = 10;
        this.rightMargin = 10;
        this.topMargin = 10;
        this.bottomMargin = 10;
    }
}
