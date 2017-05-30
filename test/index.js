"use strict";

import test from 'ava';

import {JSDOM} from 'jsdom';

const path = require('path');
const fs = require('fs');
const dom = new JSDOM(fs.readFileSync(path.join(__dirname, '../public/index.html')))

global.window = dom.window;
global.document = dom.window.document;
global.localStorage = new (require('node-storage-shim'))()

import './helpers/init.js';

//Use require to ensure that globals are set
require('../src/js/init.js');

const UI = {
    tree: document.getElementById('object-tree'),
    tree_menu: document.getElementById('object-tree-menu'),
    context_menu: document.getElementById('context-menu'),
}

function create_enter_event() {
    return new window.KeyboardEvent("keyup", {
        view: window,
        bubbles: true,
        cancelable: true,
        keyCode: 13,
    });
}

function create_mouse_event(name, opts={}) {
    return new window.MouseEvent("contextmenu", Object.assign({
        view: window,
        bubbles: true,
        cancelable: true,
    }, opts));
}

test.serial('open context menu and close by click', async t => {
    const left = 500;
    const top = 250;
    const element = UI.tree.children[1];
    const context_event = create_mouse_event("contextmenu", {
        clientX: left,
        clientY: top
    });

    element.dispatchEvent(context_event);

    t.is(`${left}px`, UI.context_menu.style.left);
    t.is(`${top}px`, UI.context_menu.style.top);
    t.not(UI.context_menu.className.includes('hidden'));

    element.click();
    t.true(UI.context_menu.className.includes('hidden'));
});

function get_element_text(element) {
    return element.children.length === 0 ? element.innerHTML : element.childNodes[0].textContent;
};

test.serial('edit some element', async t => {
    const element = UI.tree.children[1];
    const element_value = get_element_text(element);
    const element_new_value = element_value + ' appended something...';
    const context_event = create_mouse_event("contextmenu");

    //Select element
    element.dispatchEvent(context_event);
    t.false(UI.context_menu.className.includes('hidden'));

    //Start edit
    UI.context_menu.children[2].click();
    t.true(UI.context_menu.className.includes('hidden'));
    let element_input = element.children[0];
    t.not(element_input, undefined);
    t.is(element_input.nodeName.toLowerCase(), "input");
    t.is(element_value, element_input.value);

    //Change element
    element_input.value = element_new_value;
    const enter_event = create_enter_event();

    const non_enter_key = new window.KeyboardEvent("keyup", {
        view: window,
        bubbles: true,
        cancelable: true,
        keyCode: 14,
    });

    //Try to finish editing by non-Enter. Should fail
    element_input.dispatchEvent(non_enter_key);
    element_input = element.children[0];
    t.not(element_input, undefined);
    t.is(element_input.nodeName.toLowerCase(), "input");

    //Press Enter to finish
    element_input.dispatchEvent(enter_event);
    element_input = element.children[0];
    t.not(element_input, undefined);
    t.not(element_input.nodeName.toLowerCase(), "input");
    t.is(element.childNodes[0].textContent, element_new_value);
});

test.serial('finish edit by saving', async t => {
    const element = UI.tree.children[1];
    const element_value = get_element_text(element);
    const element_new_value = element_value + ' appended something...';
    const context_event = create_mouse_event("contextmenu");

    //Select element
    element.dispatchEvent(context_event);
    t.false(UI.context_menu.className.includes('hidden'));

    //Start edit
    UI.context_menu.children[2].click();
    t.true(UI.context_menu.className.includes('hidden'));
    let element_input = element.children[0];
    t.not(element_input, undefined);
    t.is(element_input.nodeName.toLowerCase(), "input");
    t.is(element_value, element_input.value);

    //Change element
    element_input.value = element_new_value;

    //Click something else to finish editing
    UI.tree_menu.children[0].click();
    element_input = element.children[0];
    t.not(element_input, undefined);
    t.not(element_input.nodeName.toLowerCase(), "input");
    t.is(element.childNodes[0].textContent, element_new_value);

});

test.serial('finish edit by click', async t => {
    const element = UI.tree.children[1];
    const element_value = get_element_text(element);
    const element_new_value = element_value + ' appended something...';
    const context_event = create_mouse_event("contextmenu");

    //Select element
    element.dispatchEvent(context_event);
    t.false(UI.context_menu.className.includes('hidden'));

    //Start edit
    UI.context_menu.children[2].click();
    t.true(UI.context_menu.className.includes('hidden'));
    let element_input = element.children[0];
    t.not(element_input, undefined);
    t.is(element_input.nodeName.toLowerCase(), "input");
    t.is(element_value, element_input.value);

    //Change element
    element_input.value = element_new_value;

    //Click something else to finish editing
    UI.tree.children[0].click();
    element_input = element.children[0];
    t.not(element_input, undefined);
    t.not(element_input.nodeName.toLowerCase(), "input");
    t.is(element.childNodes[0].textContent, element_new_value);
});

test.serial('add & remove element', async t => {
    const tree_len = UI.tree.children.length;
    const element = UI.tree.children[0];

    const context_event = create_mouse_event("contextmenu");
    element.dispatchEvent(context_event);
    t.false(UI.context_menu.className.includes('hidden'));

    //Add
    UI.context_menu.children[0].click();
    t.true(UI.context_menu.className.includes('hidden'));

    t.is(tree_len + 1, UI.tree.children.length);
    const new_element = UI.tree.children[tree_len]; //New element is added at the end.
    const new_element_input = new_element.children[0];
    t.not(new_element_input, undefined);
    t.is(new_element_input.nodeName.toLowerCase(), "input");

    //Set value to new element
    const new_element_value = "I'm a new element";
    new_element_input.value = new_element_value;
    new_element_input.dispatchEvent(create_enter_event());

    t.is(new_element.children.length, 0);
    t.is(new_element.childNodes[0].textContent, new_element_value);

    //Remove this element
    new_element.dispatchEvent(context_event);
    UI.context_menu.children[3].click();

    t.is(tree_len, UI.tree.children.length);

    //Ensure that new element is deleted.
    for (let idx = 0; idx < UI.tree.children.length; idx += 1) {
        t.not(UI.tree.children[idx].childNodes[0].textContent, new_element_value);
    }
});

test.serial('add & delete child elements', async t => {
    const element = UI.tree.children[0];
    const element_children_len = element.children.length;
    //There is supposed to be no elements!
    t.is(element_children_len, 0);

    const context_event = create_mouse_event("contextmenu");
    element.dispatchEvent(context_event);
    t.false(UI.context_menu.className.includes('hidden'));

    //Add child element
    UI.context_menu.children[1].click();
    t.true(UI.context_menu.className.includes('hidden'));

    //Verify that sub-list is created
    t.is(element_children_len + 1, element.children.length);
    const sub_list = element.children[element_children_len];
    t.is(sub_list.nodeName.toLowerCase(), "ul");
    //Verify that list contains newly created element
    let child_element = sub_list.children[0];
    t.not(child_element, undefined);
    t.is(child_element.nodeName.toLowerCase(), "li");
    let child_input = child_element.children[0];
    t.not(child_input, undefined);
    t.is(child_input.nodeName.toLowerCase(), "input");

    //Set value to new element
    let child_element_value = "I'm a new child";
    child_input.value = child_element_value;
    child_input.dispatchEvent(create_enter_event());

    t.is(child_element.children.length, 0);
    t.is(child_element.childNodes[0].textContent, child_element_value);

    //Create one more child
    element.dispatchEvent(context_event);
    t.false(UI.context_menu.className.includes('hidden'));
    UI.context_menu.children[1].click();
    t.true(UI.context_menu.className.includes('hidden'));

    //The same sub-list is supposed to be used.
    t.is(element_children_len + 1, element.children.length);
    child_element = sub_list.children[1];
    t.not(child_element, undefined);
    t.is(child_element.nodeName.toLowerCase(), "li");

    child_input = child_element.children[0];
    t.not(child_input, undefined);
    t.is(child_input.nodeName.toLowerCase(), "input");

    //Set value to new element
    child_element_value = "I'm another new child";
    child_input.value = child_element_value;
    child_input.dispatchEvent(create_enter_event());

    t.is(child_element.children.length, 0);
    t.is(child_element.childNodes[0].textContent, child_element_value);

    //Remove second created element.
    child_element.dispatchEvent(context_event);
    UI.context_menu.children[3].click();
    t.is(sub_list.children.length, 1);

    //Remove first created element.
    sub_list.children[0].dispatchEvent(context_event);
    UI.context_menu.children[3].click();
    t.is(sub_list.children.length, 0);

    //Sub-list is removed after all elementes are deleted
    t.is(element_children_len, element.children.length);
});

test.serial('save & load', async t => {
    //save
    UI.tree_menu.children[0].click();
    const original_tree = UI.tree.innerHTML;

    //Perform Edit
    const element = UI.tree.children[1];
    const element_value = get_element_text(element);
    const element_new_value = element_value + ' appended something...';
    const context_event = create_mouse_event("contextmenu");

    element.dispatchEvent(context_event);
    t.false(UI.context_menu.className.includes('hidden'));

    //Start edit
    UI.context_menu.children[2].click();
    t.true(UI.context_menu.className.includes('hidden'));
    const element_input = element.children[0];
    t.not(element_input, undefined);
    t.is(element_value, element_input.value);

    //Change element and stop editing.
    element_input.value = element_new_value;
    const enter_event = create_enter_event();
    element_input.dispatchEvent(enter_event);
    t.is(element.childNodes[0].textContent, element_new_value);

    //load
    UI.tree_menu.children[1].click();
    t.is(original_tree, UI.tree.innerHTML);
});
