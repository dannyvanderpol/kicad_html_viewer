/* Test page common stuff */

'use strict';

const COOKIE_KEY_SRC = 'canvas_src';
const COOKIE_KEY_LOG = 'log_level';

const kiViewerSettings =
{
    logLevel: 0
}

function loadSettings()
{
    let filename = '';
    let canvasSrc = getCookie(COOKIE_KEY_SRC);
    let logLevel = getCookie(COOKIE_KEY_LOG);

    let elmProject = document.getElementById('project');
    let elmLogLevel = document.getElementById('log-level');

    if (!canvasSrc)
    {
        canvasSrc = elmProject.value;
    }
    if (canvasSrc.startsWith('local_storage:'))
    {
        filename = canvasSrc.split(':')[1];
        canvasSrc = localStorage.getItem(COOKIE_KEY_SRC);
    }
    if (!canvasSrc)
    {
        canvasSrc = elmProject.value;
    }
    if (canvasSrc.startsWith('designs/'))
    {
        filename = canvasSrc;
        elmProject.value = canvasSrc;
    }
    document.getElementById('filename').innerHTML = filename;
    document.getElementById('kicad-design').setAttribute('src', canvasSrc);
    document.getElementById('kicad-design').setAttribute('filename', filename);

    if (!logLevel)
    {
        logLevel = 0;
        if (elmLogLevel)
        {
            logLevel = elmLogLevel.value;
        }
    }
    if (elmLogLevel)
    {
        elmLogLevel.value = logLevel;
    }
    kiViewerSettings.logLevel = logLevel;
}

function selectProject()
{
    let project = document.getElementById('project').value;
    setCookie(COOKIE_KEY_SRC, project, 100);
    location.reload();
}

function uploadFile(event)
{
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        localStorage.setItem(COOKIE_KEY_SRC, reader.result);
        setCookie(COOKIE_KEY_SRC, 'local_storage:' + file.name, 100);
        location.reload();
    };
    reader.onerror = function () {
        console.error('Error reading file:', reader.error);
    };
}

function setLogLevel()
{
    let logLevel = document.getElementById('log-level').value;
    setCookie(COOKIE_KEY_LOG, logLevel, 100);
    location.reload();
}

const PAGE_CONTENT = `
<p>Select a project from the list below or upload your own file.</p>
<p><table>
<tr><td>Demo projects:</td><td>
<select id="project" onchange="selectProject()">
    <option value="designs/kicad_demo_coldfire/kit-dev-coldfire-xilinx_5213.kicad_sch">KiCad demo coldfire SCH</option>
    <option value="designs/kicad_demo_coldfire/kit-dev-coldfire-xilinx_5213.kicad_pcb">KiCad demo coldfire PCB</option>
    <option value="designs/kicad_demo_sonde_xilinx/sonde_xilinx.kicad_sch">KiCad demo sonde Xilinx SCH</option>
    <option value="designs/kicad_demo_sonde_xilinx/sonde_xilinx.kicad_pcb">KiCad demo sonde Xilinx PCB</option>
    <option value="designs/kicad_demo_stickhub/StickHub.kicad_sch">KiCad demo StickHub SCH</option>
    <option value="designs/kicad_demo_stickhub/StickHub.kicad_pcb">KiCad demo StickHub PCB</option>
    <option value="designs/kicad_demo_test_xil_95108/carte_test.kicad_sch">KiCad demo test xil 95108 SCH</option>
    <option value="designs/kicad_demo_test_xil_95108/carte_test.kicad_pcb">KiCad demo test xil 95108 PCB</option>
    <option value="designs/special_features/special_features.kicad_sch">Special features SCH</option>
    <option value="designs/special_features/special_features.kicad_pcb">Special features PCB</option>
</select>
</td></tr>
<tr><td>Upload design:</td>
<td><input id="file-input" type="file" accept=".kicad_pcb,.kicad_sch" onchange="uploadFile(event)" /></td></tr>
</table></p>
<p>Selected file: <span id="filename"></span></p>
<hr />
<p>KiCad design viewer</p>
<canvas id="kicad-design" type="application/kicad" width="1016px" height="720px"></canvas>
<hr />
<div id="logContainer">
    <div id="logTitle">Log output:</div>
    <div id="logControls">
        <button id="btnClear">Clear Logs</button>
        <button id="btnDownload">Download Logs</button>
    </div>
    <pre id="logOutput"></pre>
</div>`
