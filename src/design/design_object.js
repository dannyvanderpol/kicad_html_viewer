/*
 * Design object.
 * Holds design elements and graphics elements.
 */

export class DesignObject
{
    constructor()
    {
        this.filename = '';
        this.designType = '';
        this.version = '';
        this.designElements = [];
        this.graphicsElements = [];
    }

    getDesignElement(reference)
    {
        return this.designElements.find(o => o.reference === reference);
    }
}
