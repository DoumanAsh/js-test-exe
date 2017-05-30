"use strict";

import {JSDOM} from 'jsdom';

const dom = new JSDOM("<body></body>");

global.window = dom.window;
global.document = dom.window.document;

export default dom;
