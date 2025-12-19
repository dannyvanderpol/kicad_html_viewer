/*
 * Object contains info about a setup in a design.
 */

'use strict';

import { DesignElement } from "./design_element.js";

export class TitleBlockElement extends DesignElement
{
    constructor(reference)
    {
        super(reference);
        this.comment1 = '';
        this.comment2 = '';
        this.comment3 = '';
        this.comment4 = '';
        this.company = '';
        this.date = '';
        this.kicad_version = '';
        this.revision = '';
        this.title = '';
    }
}
