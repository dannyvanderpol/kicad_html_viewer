/*
 * Retieve sections from content.
 * A section is eveything between the opening '(' and the corresponding closing ')'.
 * Also includes nested sections.
 */

export const Sections = {
    getSections: function (data)
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
    }
}
