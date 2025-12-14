/*
 * Object contains info about an page in a design.
 */

'use strict';

import { DesignElement } from "./design_element.js";

export class PageElement extends DesignElement
{
    constructor(reference)
    {
        super(reference);
        this.width = 0;
        this.height = 0;
    }
}
