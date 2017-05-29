"use strict";

import test from 'ava';
import dom from '../helpers/dom.js';

import '../helpers/init.js';
import {create_sub_list, create_element, destroy_element, make_element_editable, make_editable_static, select_input_text} from '../../src/js/DOM/utils.js';

test('create_element', async t => {
    const element = create_element();
    t.not(element, null);

    const child = create_element(element);
    t.not(child, null);
    t.is(child.parentNode, element);
});

test('destroy_element', async t => {
    const element = create_element();

    const child = create_element(element);
    t.is(child.parentNode, element);

    t.is(element, destroy_element(child));
    t.is(child.parentNode, null);

});

test('create_sub_list', async t => {
    const element = create_sub_list();
    t.not(element, null);

    const child = create_sub_list(element);
    t.not(child, null);
    t.is(child.parentNode, element);
});

test('edit & save element', async t => {
    const element_value = "test";
    const element = create_element();
    element.innerHTML = element_value;

    const input = make_element_editable(element);
    t.is(input.type, 'text');
    t.is(input.parentNode, element);
    t.is(input.value, element_value);
    t.false(element.innerHTML.startsWith(element_value));

    select_input_text(input);
    t.is(input, document.activeElement);
    const new_value = `Prepended to ${element_value}`;
    input.value = new_value;

    const result = make_editable_static(input);
    t.is(result, element);
    t.is(input.parentNode, null);
    t.is(result.innerHTML, new_value);
});
