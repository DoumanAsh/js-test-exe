"use strict";

const path = require('path');
const fs = require('fs');

import test from 'ava';
import dom from '../helpers/dom.js';

import '../helpers/init.js';
import {serialize, deserialize} from '../../src/js/DOM/serde.js';
import {create_sub_list, create_element} from '../../src/js/DOM/utils.js';

test('serialize & deserialize', async t => {
	const tree = document.createElement('ul');

    create_element(tree).innerHTML = "Just some text 1";

    create_element(tree).innerHTML = "Just some text 2";

    const element = create_element(tree)
    element.innerHTML = "Some element with children";

    const sub_tree = create_sub_list(element);

    create_element(sub_tree).innerHTML = "Children 1";

    create_element(sub_tree).innerHTML = "Children 2";

    const text = serialize(tree);

    t.true(text.includes("Just some text 1"))
    t.true(text.includes("Just some text 2"))
    t.true(text.includes("Some element with children"))
    t.true(text.includes("Children 1"))
    t.true(text.includes("Children 2"))

	const restored_tree = document.createElement('ul');
    deserialize(restored_tree, text);

    t.is(tree.innerHTML, restored_tree.innerHTML);
    t.true(tree.isEqualNode(restored_tree));
});
