/* KiReader: read and parse KiCad files */

'use strict';

export class KiReader
{

    constructor(filename, showDebug)
    {
        this.filename = filename;
        this.showDebug = showDebug;
    }

    async loadFile()
    {
        let content = {};
        if (this.showDebug) console.log('Reader: load file:', this.filename);
        try
        {
            const response = await fetch(this.filename);
            if (!response.ok)
            {
                if (this.showDebug) console.error(`Reader: HTTP error status: ${response.status}`);
            }
            else
            {
                const text = await response.text();
                content = this.parseFile(text);
                content.filename = this.filename;
                if (this.showDebug) console.log('Reader: file loaded successfully');
            }
        }
        catch (error)
        {
            if (this.showDebug) console.error('Reader: error loading file:', error);
        }
        return content;
    }

    parseFile(data)
    {
        let content = {
            lines: [],
            rectangles: [],
            texts: [],
            junctions: [],
            sheetpath: '/',
            pageNumber: 1,
            totalPages: 1
        };
        let sections = this._getSections(data);
        if (sections.length != 1)
        {
            throw new Error('Reader: invalid file format');
        }
        let name = this._getSectionName(sections[0]);
        content.type = name;
        // Get other sections
        for (const section of this._getSections(sections[0].substring(1, sections[0].length - 1)))
        {
            name = this._getSectionName(section);
            switch (name)
            {
                case 'generator_version':
                    content.version = this._getValues(section)[0];
                    break;

                case 'junction':
                    let properties = this._getProperties(section);
                    properties.type = name;
                    properties.pos = {};
                    properties.pos.x = parseFloat(properties.at[0]);
                    properties.pos.y = parseFloat(properties.at[1]);
                    properties.diameter = parseFloat(properties.diameter[0]);
                    properties.color = properties.color.map(x => parseInt(x));
                    delete properties.at;
                    delete properties.uuid;
                    content.junctions.push(properties);
                    break;

                case 'line':
                    content.lines.push(this._readGraphics(section, name));
                    break;

                case 'paper':
                    content.paper = this._getValues(section)[0];
                    break;

                case 'rect':
                    content.rectangles.push(this._readGraphics(section, name));
                    break;

                case 'setup':
                    content.setup = this._getProperties(section, true);
                    break;

                case 'tbtext':
                    content.texts.push(this._readText(section, name));
                    break;

                case 'title_block':
                    content.titleBlock = this._getProperties(section, true);
                    break;

                case 'uuid':
                    content.uuid = this._getValues(section)[0];
                    break;

                case 'generator':
                case 'version':
                    // Skip
                    break;

                default:
                    if (this.showDebug) {
                        console.warn('Reader: Unknown section:', name);
                        console.log(section);
                    }
            }
        }
        if (this.showDebug) console.log('Reader: parsed content:', content);
        return content;
    }

    _getSections(data)
    {
        let sections = []
        let start = -1
        let section = 0
        for (let i = 0; i < data.length; i++)
        {
            if (data[i] == '(')
            {
                if (section == 0)
                {
                    start = i;
                }
                section += 1
            }
            else if (data[i] == ')')
            {
                section -= 1
            }
            if (section == 0 && start >= 0 && i > start)
            {
                sections.push(data.substring(start,i + 1))
                section = 0
                start = -1
            }
        }
        return sections;
    }

    _getSectionName(section)
    {
        let name = '';
        for (let i = 2; i < section.length; i++)
        {
            if ([' ', '\r', '\n', '\t', ')'].includes(section[i]))
            {
                name = section.substring(1, i);
                break;
            }
        }
        return name.trim();
    }

    _getValues(section)
    {
        // Remove any new lines ot tabs, and multiple spaces
        section = section.replace(/[\r\n\t]/g, ' ').replace(/ +/g, ' ');
        if (this.showDebug) console.log('Reader: parse values:', section);
        let values = [];
        let pos = section.indexOf(' ');
        if (pos > 0)
        {
            let start = pos;
            let token = '';
            // Values can be '(section_name (a b c) value "string")'
            for (let i = pos; i < section.length - 1; i++)
            {
                // Start of values
                if ((section[i] == ' ' && token == '') ||
                    (section[i] == '"' && token == ' ') ||
                    (section[i] == '(' && token == ' '))
                {
                    start = i + 1;
                    token = section[i] == '(' ? ')' : section[i];
                    continue;
                }

                if (token != '' && (section[i] == token || i == section.length - 2))
                {
                    values.push(section.substring(start, i + 1).trim().replace(/^"|"$/g, '').replace(/\)$/g, ''));
                    if (token == ')') token = '';
                    start = i + 1;
                }
            }
        }
        if (this.showDebug) console.log('Reader: parsed values:', values);
        return values;
    }

    _getProperties(section, singleValue=false)
    {
        let properties = {};
        for (const subSection of this._getSections(section.substring(1, section.length - 1)))
        {
            let value = this._getValues(subSection);
            let name = this._getSectionName(subSection);
            if (name == 'comment')
            {
                name = 'comment' + value[0];
                value = [value[1]];
            }
            if (singleValue && value.length >= 1)
            {
                value = value[0];
            }
            properties[name] = value;
        }
        return properties;
    }

    _readGraphics(section, type)
    {
        let properties = {
            type: type,
            thickness: 0,
            start: { x: 0, y: 0, relative_to: null },
            end: { x: 0, y: 0, relative_to: null },
            repeat: 1,
            increment_x: 0,
            increment_y: 0,
        };
        for (const subSection of this._getSections(section.substring(1, section.length - 1)))
        {
            let name = this._getSectionName(subSection);
            let values = this._getValues(subSection);
            switch (name)
            {
                case 'start':
                    properties.start.x = parseFloat(values[0]);
                    properties.start.y = parseFloat(values[1]);
                    if (values.length > 2)
                    {
                        properties.start.relative_to = values[2];
                    }
                    break;

                case 'end':
                    properties.end.x = parseFloat(values[0]);
                    properties.end.y = parseFloat(values[1]);
                    if (values.length > 2)
                    {
                        properties.end.relative_to = values[2];
                    }
                    break;

                case 'repeat':
                    properties.repeat = parseInt(values[0]);
                    break;

                case 'incrx':
                    properties.increment_x = parseFloat(values[0]);
                    break;

                case 'incry':
                    properties.increment_y = parseFloat(values[0]);
                    break;
            }
        }
        return properties;
    }

    _readText(section, type)
    {
        let properties = {
            type: type,
            text: '',
            size: 0,
            pos: { x: 0, y: 0, relative_to: null },
            repeat: 1,
            increment_x: 0,
            increment_y: 0,
            bold: false,
            italic: false,
            align_h: 'left',
            align_v: 'middle',
            mirror: false,
        };
        properties.text = this._getValues(section)[0];
        for (const subSection of this._getSections(section.substring(1, section.length - 1)))
        {
            let name = this._getSectionName(subSection);
            switch (name)
            {
                case 'font':
                    for (let value of this._getValues(subSection))
                    {
                        if (value.startsWith('size '))
                        {
                            properties.size = parseFloat(value.split(' ')[1]);
                        }
                        if (value == 'bold')
                        {
                            properties.bold = true;
                        }
                        if (value == 'italic')
                        {
                            properties.italic = true;
                        }
                    }
                    break;

                case 'incrx':
                    properties.increment_x = parseFloat(this._getValues(subSection)[0]);
                    break;

                case 'incry':
                    properties.increment_y = parseFloat(this._getValues(subSection)[0]);
                    break;

                case 'justify':
                    for (let value of this._getValues(subSection))
                    {
                        if (['left', 'center', 'right'].includes(value))
                        {
                            properties.align_h = value;
                        }
                        if (['top', 'middle', 'bottom'].includes(value))
                        {
                            properties.align_v = value;
                        }
                        if (value == 'mirror')
                        {
                            properties.mirror = true;
                        }
                    }
                    break;

                case 'pos':
                    let values = this._getValues(subSection);
                    properties.pos.x = parseFloat(values[0]);
                    properties.pos.y = parseFloat(values[1]);
                    if (values.length > 2)
                    {
                        properties.pos.relative_to = values[2];
                    }
                    break;

                case 'repeat':
                    properties.repeat = parseInt(this._getValues(subSection)[0]);
                    break;

                case 'comment':
                case "name":
                    // Skip
                    break;

                default:
                    if (this.showDebug) console.warn('Reader: unknown text subsection:', name);
            }
        }
        return properties;
    }
}
