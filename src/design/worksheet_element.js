/*
 * Object contains info about a worksheet embedded in the design.
 */

'use strict';

import { DesignElement } from "./design_element.js";

export class WorksheetElement extends DesignElement
{
    constructor(reference)
    {
        super(reference);
        this.filename;
        this.content;
    }
}
