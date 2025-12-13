/*
 * Design object.
 * Holds design elements and graphics elements.
 */

export class DesignObject
{
    constructor(filename)
    {
        this.filename = filename;
        this.designType = '';
        this.designElements = [];
        this.graphicsElements = [];
    }
}
