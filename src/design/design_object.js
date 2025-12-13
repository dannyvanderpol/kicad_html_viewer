/*
 * Design object.
 * Holds design elements and graphics elements.
 */

export class DesignObject
{
    constructor(filename)
    {
        this.filename = filename;
        this.fileType = '';
        this.designElements = [];
        this.graphicsElements = [];
    }
}
