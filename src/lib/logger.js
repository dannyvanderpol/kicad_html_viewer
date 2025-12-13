/*
 * Application wide logger (singleton)
 * Debug levels:
 *  - System levels: first byte (0x01, 0x02, ..., 0x80)
 *  - Viewer levels: second byte (0x0100, 0x0200, ..., 0x8000)
 *  - Parser levels: third byte (0x010000, 0x020000, ..., 0x800000)
 *  - Drawer levels: fourth byte (0x01000000, 0x02000000, ..., 0x80000000)
 *
 * Each level can have 8 sub-levels (0x01 to 0x08)
 */

'use strict';

class Logger
{
    LEVEL_OFF = 0;

    // System levels
    LEVEL_SYSTEM = 0xFF;
    LEVEL_ERROR = 0x01;
    LEVEL_WARN = 0x02;
    LEVEL_INFO = 0x04;
    LEVEL_TIMER = 0x08;

    // Viewer levels
    LEVEL_VIEWER = 0xFF00;
    LEVEL_VIEWER_GENERAL = 0x0100;
    LEVEL_VIEWER_EVENTS = 0x0200;

    // Parser levels
    LEVEL_PARSER = 0xFF0000;
    LEVEL_PARSER_GENERAL = 0x010000;
    LEVEL_PARSER_FETCH = 0x020000;

    // Drawer levels
    LEVEL_DRAWER = 0xFF000000;

    logLevel = this.LEVEL_OFF;

    constructor() {}

    info(...args)
    {
        if (this.logLevel & this.LEVEL_INFO)
        {
            console.info(...args);
        }
    }

    warn(...args)
    {
        if (this.logLevel & this.LEVEL_WARN)
        {
            console.warn(...args);
        }
    }

    error(...args)
    {
        if (this.logLevel & this.LEVEL_ERROR)
        {
            console.error(...args);
        }
    }
}

export const logger = new Logger();
