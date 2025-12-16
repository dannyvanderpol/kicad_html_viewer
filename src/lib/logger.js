/*
 * Application wide logger (singleton).
 * Logs to log element (see HTML example).
 * Log can be downloaded as a text file.
 */

'use strict';

class Logger
{
    LEVEL_OFF = 0x00;
    LEVEL_SYSTEM = 0x01;
    LEVEL_EVENTS = 0x02;
    LEVEL_TIMER = 0x04;
    LEVEL_VIEWER = 0x08;
    LEVEL_PARSER = 0x10;
    LEVEL_DRAWER = 0x20;

    logBuffer = [];
    logElement = null;
    logLevel = this.LEVEL_OFF;

    constructor() {}

    info(logLevel, ...args)
    {
        this._addToBuffer(logLevel, 'INFO ', ...args);
    }

    warn(logLevel, ...args)
    {
        this._addToBuffer(logLevel, 'WARN ', ...args);
    }

    error(logLevel, ...args)
    {
        console.error(...args);
        this._addToBuffer(logLevel, 'ERROR', ...args);
    }

    setLogElement(elementId)
    {
        const element = document.getElementById(elementId);
        if (element)
        {
            this.logElement = element;
            document.getElementById('btnClear').addEventListener('click', () => {
                logger.clearLogs();
            });
            document.getElementById('btnDownload').addEventListener('click', () => {
                logger.downloadLogs('kicad_viewer_logs.txt');
            });
        }
    }

    _addToBuffer(logLevel, level, ...args)
    {
        const timestamp = new Date().toISOString();
        const message = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');

        const logLine = `[${timestamp}] [${level}] ${message}`;

        this.logBuffer.push(logLine);

        // Update DOM element if attached
        if (this.logElement && this.logLevel & logLevel)
        {
            let textClass = 'info';
            if (logLine.includes('[WARN')) textClass = 'warn';
            if (logLine.includes('[ERROR')) textClass = 'error';
            this.logElement.innerHTML += `<span class="${textClass}">${logLine}</span>` + '\n';
            this.logElement.scrollTop = this.logElement.scrollHeight;
        }
    }

    downloadLogs(filename = 'logs.txt')
    {
        const content = this.logBuffer.join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    clearLogs()
    {
        this.logBuffer = [];
        if (this.logElement)
        {
            this.logElement.textContent = '';
        }
    }
}

export const logger = new Logger();
