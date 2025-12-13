# KiCad HTML viewer

Viewer for viewing KiCad designs in a HTML page.

Support: KiCad 9 and higher

[![Bundle and minify](https://github.com/dannyvanderpol/kicad_html_viewer/actions/workflows/publish_js.yml/badge.svg)](https://github.com/dannyvanderpol/kicad_html_viewer/actions/workflows/publish_js.yml)

## Features

* Drawing designs in a canvas.
    * Schematics: not yet working
    * PCB:
        * drawing zones on copper layers is working

## Usage

Create a HTML page and include the minified buid.

``` html
<html>
<head>
    <title>Test page</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        html, body {margin: 0; padding: 0;}
        body {
            margin: 32px;
            font-family: sans-serif;
            font-size: 14px;
        }
        /* Put your canvas styling here */
        canvas {
            border: 1px solid #ccc;
        }
    </style>
    <!-- include the JS module:
      - use the -dev for development versions
      - use the .x.y for a stable version
    -->
    <script type="module" src="ki_viewer-dev.min.js"></script>
</head>
<body>
    <!-- Add canvas for a design, the module does its magic -->

    <p>KiCad Schematic:</p>
    <canvas src="path/to/your.kicad_sch" type="application/kicad" width="900" height="640"></canvas>

    <p>KiCad PCB:</p>
    <canvas src="path/to/your.kicad_pcb" type="application/kicad" width="900" height="640"></canvas>
</body>
</html>
```

You can add as many canvas elements as you wish.
The JS module starts working on the `DOMContentLoaded` event.

### Disclamer

This software can be used for any purpose, in case of any issues, open an issue in the issue tracker.
For the rest, you are on your own. I do not accept any liabilities when using this software.
