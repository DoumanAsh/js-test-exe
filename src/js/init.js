"use strict";

import {serialize, deserialize} from './DOM/serde.js';
import {create_sub_list, create_element, destroy_element, make_element_editable, make_editable_static, select_input_text} from './DOM/utils.js';

const UI = {
    tree: document.getElementById('object-tree'),
    tree_menu: document.getElementById('object-tree-menu'),
    context_menu: document.getElementById('context-menu'),
    selection: null,
    remove_selection: function() {
        const parent = destroy_element(this.selection);

        if (parent.children.length === 0) destroy_element(parent);

        this.hide_menu();
    },
    hide_menu: function() {
        this.selection = null;
        this.context_menu.classList.add('hidden');
    },

    editable: null,
    start_edit: function() {
        this.editable = make_element_editable(this.selection);
        select_input_text(this.editable);

        this.editable.addEventListener('keyup', (event) => {
            if (event.keyCode === 13) {
                //enter
                event.stopPropagation();
                event.preventDefault();
                this.stop_edit();
            }
        });

        this.hide_menu();
        return this.editable;
    },
    stop_edit: function() {
        const result = make_editable_static(this.editable);
        this.editable = null;
        return result;
    }
};

UI.tree_actions = {
    add_element: UI.context_menu.children[0],
    add_child: UI.context_menu.children[1],
    edit: UI.context_menu.children[2],
    delete: UI.context_menu.children[3],
    save: UI.tree_menu.children[0],
    load: UI.tree_menu.children[1],
    clear_save: UI.tree_menu.children[2]
};

UI.tree_actions.add_element.addEventListener('click', function() {
    const list = UI.selection.parentNode;

    UI.selection = create_element(list);
    UI.start_edit();
});

UI.tree_actions.add_child.addEventListener('click', function() {
    //Re-use existing sub-list
    const list = UI.selection.children.length === 0 ? create_sub_list(UI.selection) : UI.selection.children[0];

    UI.selection = create_element(list);
    UI.start_edit();
});

UI.tree_actions.edit.addEventListener('click', function() {
    UI.start_edit();
});

UI.tree_actions.delete.addEventListener('click', function() {
    UI.remove_selection();
});

/**
 * Stop selection and edit.
 * @returns {void}
 */
function stop_current_actions() {
    if (UI.selection !== null) {
        UI.hide_menu();
    }
    if (UI.editable !== null) {
        UI.stop_edit();
    }
}

//Closes context menu on left-click
UI.tree.addEventListener('click', stop_current_actions);

//Opens context menu relative to mouse pointer position.
UI.tree.addEventListener('contextmenu', function(event) {
    //Skip on container.
    if (event.target === UI.tree) return;

    event.preventDefault();
    event.stopPropagation();
    stop_current_actions();

    //In some cases Our target may be sub-list of element (when clicking left empty space).
    //Since I'm rather lazy we shall go with using its parent rather than  attempting to calculate
    //position of elemen right to the position click.
    UI.selection = event.target.classList.contains("tree__sub") ? event.target.parentNode : event.target;

    UI.context_menu.style.left = event.clientX + 'px';
    UI.context_menu.style.top = event.clientY + 'px';
    UI.context_menu.classList.remove('hidden');
});

const STATE = "current_state";

//Saves state of object tree before leaving page.
function save() {
    if (UI.editable !== null) {
        UI.stop_edit();
    }

    localStorage.setItem(STATE, serialize(UI.tree));
}

//Loads state of object tree from localStorage.
function load() {
    const value = localStorage.getItem(STATE);
    if (value === null) return;

    UI.tree.click();

    deserialize(UI.tree, value);
}

function clear_save() {
    localStorage.removeItem(STATE);
}

UI.tree_actions.save.addEventListener('click', save);
UI.tree_actions.load.addEventListener('click', load);
UI.tree_actions.clear_save.addEventListener('click', clear_save);

//It as assumed that script is loaded after DOM has been constructed.
load();
