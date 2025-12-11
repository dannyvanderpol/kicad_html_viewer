/*
 * Parsing a KiCad file into a design object.
 * input: filename (URI)
 * output: design object
 */

import { Design } from '../design/design.js';
import { fetchFile } from '../lib/fetch_file.js';

export async function parseFile(filename)
{
    let design = new Design();
    const content = await fetchFile(filename);
    return design;
}
