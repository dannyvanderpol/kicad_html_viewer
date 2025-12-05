/* KiReader */

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
        let content = {};
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
                case 'paper':
                    content.paper = this._getValues(section)[0];
                    break;

                case 'setup':
                    content.setup = this._getProperties(section);
                    break;

                default:
                    if (this.showDebug) {
                        console.warn('Reader: Unknown section:', name);
                        console.log(section);
                    }
            }
        }
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
        let value = '';
        let pos = section.indexOf(' ');
        if (pos > 0)
        {
            value = section.substring(pos + 1, section.length - 1).trim();
        }
        return value.replace(/^"(.*)"$/, '$1').split(' ');
    }

    _getProperties(section)
    {
        let properties = {};
        for (const subSection of this._getSections(section.substring(1, section.length - 1)))
        {
            properties[this._getSectionName(subSection)] = this._getValues(subSection)[0];
        }
        return properties;
    }
}
