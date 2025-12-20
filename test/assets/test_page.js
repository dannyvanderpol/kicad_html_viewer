/* Test page common stuff */

'use strict';

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
