"use strict";

/**
 * Creates sub list to hold children elements.
 * @param {Object} parent DOM element to become parent. Optional.
 * @returns {Object} DOM element.
 */
export function create_sub_list(parent=null) {
	let result = document.createElement('ul');
    result.classList.add('tree__sub');

    if (parent !== null) {
        parent.appendChild(result);
    }

    return result;
}

/**
 * Creates new li element to be inserted into tree.
 * @param {Object} parent DOM element to become parent. Optional.
 * @returns {Object} DOM element.
 */
export function create_element(parent=null) {
	let result = document.createElement('li');
    result.classList.add('tree__element');

    if (parent !== null) {
        parent.appendChild(result);
    }

    return result;
}

/**
 * Destroys DOM element by removing it from its parent.
 * @param {Object} element DOM element to remove
 * @returns {Object} parent element.
 */
export function destroy_element(element) {
    const parent = element.parentNode;

    parent.removeChild(element);

    return parent;
}

/**
 * Makes element editable.
 * @param {Object} element DOM of Tree element.
 * @returns {Object} input which became child of element.
 */
export function make_element_editable(element) {
    let input = document.createElement('input');
    input.type = 'text';

    if (element.childNodes.length === 0) {
        //Newly created empty element
        input.value = '';
        element.appendChild(input);
    }
    else if (element.children.length === 0) {
        //No sub elements
        input.value = element.innerHTML;
        element.innerHTML = '';
        element.appendChild(input);
    }
    else {
        //Some children elements...
        input.value = element.childNodes[0].textContent;
        element.childNodes[0].textContent = '';
        element.insertBefore(input, element.children[0]);
    }


    return input;
}

/**
 * Transforms editable input of Tree element into static one.
 * @param {Object} element DOM of Tree element's input.
 * @returns {Object} DOM of Tree's element.
 */
export function make_editable_static(element) {
    const value = element.value.trim();
    const parent = element.parentNode;

    parent.removeChild(element);

    if (value === '') {
        parent.parentNode.removeChild(parent);
    }
    else if (parent.childNodes.length === 0) {
        parent.innerHTML = value;
    } else {
        parent.childNodes[0].textContent = value;
    }

    return parent;
}

/**
 * Selects text of input and brings focus onto it.
 * @param {Object} element DOM of input.
 * @returns {void}
 */
export function select_input_text(element) {
    element.setSelectionRange(0, element.value.length);
    element.focus();
}
