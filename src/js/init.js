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
    load: UI.tree_menu.children[1]
};

UI.tree_actions.add_element.addEventListener('click', function() {
    const list = UI.selection.parentNode;

    UI.selection = create_element(list);
    UI.start_edit();
});

UI.tree_actions.add_child.addEventListener('click', function() {
    const list = create_sub_list(UI.selection);

    UI.selection = create_element(list);
    UI.start_edit();
});

UI.tree_actions.edit.addEventListener('click', function() {
    UI.start_edit();
});

UI.tree_actions.delete.addEventListener('click', function() {
    UI.remove_selection();
});

//Closes context menu on left-click
UI.tree.addEventListener('click', function() {
    if (UI.selection !== null) {
        UI.hide_menu();
    }
    if (UI.editable !== null) {
        UI.stop_edit();
    }
});

//Opens context menu relative to mouse pointer position.
UI.tree.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    event.stopPropagation();

    UI.selection = event.target;

    UI.context_menu.style.left = event.clientX + 'px';
    UI.context_menu.style.top = event.clientY + 'px';
    UI.context_menu.classList.remove('hidden');
});

const STATE = "current_state";

//Saves state of object tree before leaving page.
function save() {
    localStorage.setItem(STATE, serialize(UI.tree));
}

//Loads state of object tree from localStorage.
function load() {
    const value = localStorage.getItem(STATE);
    if (value === null) return;

    deserialize(UI.tree, value);
}

UI.tree_actions.save.addEventListener('click', save);
UI.tree_actions.load.addEventListener('click', load);

window.onbeforeunload = save;

load();
