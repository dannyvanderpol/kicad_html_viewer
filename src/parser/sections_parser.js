/*
 * Retieve sections from content.
 * Retrieve properties or values from sections.
 * A section is eveything between the opening '(' and the corresponding closing ')'.
 * Also includes nested sections.
 */

export const Sections = {
    getSections: function (data)
    {
        data = data.substring(1, data.length - 1);
        const sections = []
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
    },

    getSectionName: function (section)
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
    },

    getValues: function (section)
    {
        // Remove any new lines ot tabs, and multiple spaces
        section = section.replace(/[\r\n\t]/g, ' ').replace(/ +/g, ' ');
        const values = [];
        const pos = section.indexOf(' ');
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
                    if (token != ' ') token = '';
                    start = i;
                }
            }
        }
        return values;
    },

    getProperties: function (sectionContent, singleValue=false)
    {
        // Section content can be a list of sub-sections with values or a string with a section
        if (typeof sectionContent === 'string')
        {
            sectionContent = this.getSections(sectionContent);
        }
        const properties = {};
        for (const subSection of sectionContent)
        {
            let value = this.getValues(subSection);
            let name = this.getSectionName(subSection);
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
}
