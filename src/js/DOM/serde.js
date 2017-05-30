"use strict";

/**
 * Re-creates DOM tree from string.
 * @param {Object} tree DOM tree in which to append content..
 * @param {String} string DOM's content
 * @returns {Object} DOM tree.
 */
export function deserialize(tree, string) {
    tree.innerHTML = string;
    return tree;
}

/**
 * Serializes DOM tree into string.
 * @param {Object} tree DOM tree.
 * @returns {String} string representation of DOM
 */
export function serialize(tree) {
    return tree.innerHTML;
}
