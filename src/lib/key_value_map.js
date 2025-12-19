/* Key value map class */

import { logger } from './logger.js';

export class KeyValueMap {

    #map = {};

    constructor()
    {
        this.#map = {
            'comment1': '',
            'comment2': '',
            'comment3': '',
            'comment4': '',
            'company': '',
            'filename': '',
            'issue_date': '',
            'kicad_version': '',
            'paper': '',
            'revision': '',
            'sheetpath': '/',
            'title': '',
            '#': '',
            '##': ''
        };
    }

    set(key, value)
    {
        this.#map[key] = value;
    }

    replace(input)
    {
        return input.replace(/\$\{([^}]+)\}/g, (_, key) => {
            if (Object.prototype.hasOwnProperty.call(this.#map, key.toLowerCase()))
            {
                return this.#map[key.toLowerCase()];
            }
            logger.warn(logger.LEVEL_PARSER, `[KeyValueMap] Unknown placeholder: ${key}`);
            return '';
        });
    }
}
