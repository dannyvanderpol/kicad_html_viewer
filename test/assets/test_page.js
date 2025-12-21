/* Test page common stuff */

'use strict';

const PAGE_CONTENT = `<p>Page options:</p>
<p><table>
<tr><td>Project:</td><td>
<select id="project">
    <option value="kicad_demo_coldfire/kit-dev-coldfire-xilinx_5213">KiCad demo coldfire</option>
    <option value="kicad_demo_multi_channel/multichannel_mixer">KiCad demo multi channel</option>
    <option value="kicad_demo_sonde_xilinx/sonde_xilinx">KiCad demo sonde Xilinx</option>
    <option value="kicad_demo_stickhub/StickHub">KiCad demo StickHub</option>
    <option value="kicad_demo_test_xil_95108/carte_test">KiCad demo test xil 95108</option>
    <option value="special_features/special_features">Special features</option>
</select>
</td></tr>
<tr><td>Log level:</td><td>
<select id="log-level">
    <option value="0">Default</option>
    <option value="0x10">Parser</option>
    <option value="0x20">Drawer</option>
    <option value="0x30">Parser + drawer</option>
    <option value="0x02">Events</option>
</select>
</td></tr>
<tr><td></td><td><button onclick="setOptions()">Apply</button></td></tr>
</table></p>

<hr />

<p>KiCad Schematic:</p>
<p><canvas id="kicad-sch" src="" type="application/kicad" width="900" height="640"></canvas></p>

<hr />

<p>KiCad PCB:</p>
<p><canvas id="kicad-pcb" src="" type="application/kicad" width="900" height="640"></canvas></p>

<hr />

<div id="logContainer">
    <div id="logTitle">Log output:</div>
    <div id="logControls">
        <button id="btnClear">Clear Logs</button>
        <button id="btnDownload">Download Logs</button>
    </div>
    <pre id="logOutput"></pre>
</div>
`

const kiViewerSettings =
{
    logLevel: 0
}

function setOptions()
{
    const project = document.getElementById('project').value;
    const logLevel = document.getElementById('log-level').value;

    setCookie('project', project, 100);
    setCookie('log_level', logLevel, 100);

    location.reload();
}

function loadOptions()
{
    let project = getCookie('project');
    let logLevel = getCookie('log_level');

    let elmProject = document.getElementById('project');
    let elmLogLevel = document.getElementById('log-level');

    if (!project)
    {
        project = elmProject.value;
    }
    if (!logLevel)
    {
        logLevel = elmLogLevel.value;
    }

    elmProject.value = project;
    elmLogLevel.value = logLevel;

    document.getElementById('kicad-sch').setAttribute('src', 'designs/' + project + '.kicad_sch');
    document.getElementById('kicad-pcb').setAttribute('src', 'designs/' + project + '.kicad_pcb');
    kiViewerSettings.logLevel = parseInt(logLevel);
}
