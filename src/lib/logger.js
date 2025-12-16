/*
 * Application wide logger (singleton).
 * Logs to log element (see HTML example).
 * Log can be downloaded as a text file.
 */

'use strict';

class Logger
{
    logBuffer = [];
    logElement = null;

    constructor() {}

    info(...args)
    {
        this._addToBuffer('INFO ', ...args);
    }

    warn(...args)
    {
        this._addToBuffer('WARN ', ...args);
    }

    error(...args)
    {
        console.error(...args);
        this._addToBuffer('ERROR', ...args);
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

    _addToBuffer(level, ...args)
    {
        const timestamp = new Date().toISOString();
        const message = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');

        const logLine = `[${timestamp}] [${level}] ${message}`;

        this.logBuffer.push(logLine);

        // Update DOM element if attached
        if (this.logElement)
        {
            this.logElement.textContent += logLine + '\n';
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
