/* Test page common stuff */

'use strict';

// From src/lib/logger.js
const LEVEL_SYSTEM = 0x01;
const LEVEL_EVENTS = 0x02;
const LEVEL_TIMER = 0x04;
const LEVEL_VIEWER = 0x08;
const LEVEL_PARSER = 0x10;
const LEVEL_DRAWER = 0x20;

const kiViewerSettings = {
    // Show additional log levels:
    logLevel: 0
}

const PAGE_CONTENT = `<p>KiCad Schematic:</p>
<canvas src="designs/all_features/all_features.kicad_sch" type="application/kicad" width="900" height="640"></canvas>

<p>KiCad PCB:</p>
<canvas src="designs/all_features/all_features.kicad_pcb" type="application/kicad" width="900" height="640"></canvas>

<div id="logContainer">
    <div id="logTitle">Log output:</div>
    <div id="logControls">
        <button id="btnClear">Clear Logs</button>
        <button id="btnDownload">Download Logs</button>
    </div>
    <pre id="logOutput"></pre>
</div>
`
