!function(e){function t(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=2)}([function(e,t,n){"use strict";function i(e,t){return e.innerHTML=t,e}function r(e){return e.innerHTML}t.b=i,t.a=r},function(e,t,n){"use strict";function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=document.createElement("ul");return t.classList.add("tree__sub"),null!==e&&e.appendChild(t),t}function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=document.createElement("li");return t.classList.add("tree__element"),null!==e&&e.appendChild(t),t}function l(e){var t=e.parentNode;return t.removeChild(e),t}function c(e){var t=document.createElement("input");return t.type="text",0===e.childNodes.length?(t.value="",e.appendChild(t)):0===e.children.length?(t.value=e.innerHTML,e.innerHTML="",e.appendChild(t)):(t.value=e.childNodes[0].textContent,e.childNodes[0].textContent="",e.insertBefore(t,e.children[0])),t}function o(e){var t=e.value.trim(),n=e.parentNode;return n.removeChild(e),""===t?n.parentNode.removeChild(n):0===n.childNodes.length?n.innerHTML=t:n.childNodes[0].textContent=t,n}function d(e){e.setSelectionRange(0,e.value.length),e.focus()}t.f=i,t.e=r,t.a=l,t.b=c,t.d=o,t.c=d},function(e,t,n){"use strict";function i(){null!==a.selection&&a.hide_menu(),null!==a.editable&&a.stop_edit()}function r(){null!==a.editable&&a.stop_edit(),localStorage.setItem(u,n.i(o.a)(a.tree))}function l(){var e=localStorage.getItem(u);null!==e&&(a.tree.click(),n.i(o.b)(a.tree,e))}function c(){localStorage.removeItem(u)}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),d=n(1),a={tree:document.getElementById("object-tree"),tree_menu:document.getElementById("object-tree-menu"),context_menu:document.getElementById("context-menu"),selection:null,remove_selection:function(){var e=n.i(d.a)(this.selection);0===e.children.length&&n.i(d.a)(e),this.hide_menu()},hide_menu:function(){this.selection=null,this.context_menu.classList.add("hidden")},editable:null,start_edit:function(){var e=this;return this.editable=n.i(d.b)(this.selection),n.i(d.c)(this.editable),this.editable.addEventListener("keyup",function(t){13===t.keyCode&&(t.stopPropagation(),t.preventDefault(),e.stop_edit())}),this.hide_menu(),this.editable},stop_edit:function(){var e=n.i(d.d)(this.editable);return this.editable=null,e}};a.tree_actions={add_element:a.context_menu.children[0],add_child:a.context_menu.children[1],edit:a.context_menu.children[2],delete:a.context_menu.children[3],save:a.tree_menu.children[0],load:a.tree_menu.children[1],clear_save:a.tree_menu.children[2]},a.tree_actions.add_element.addEventListener("click",function(){var e=a.selection.parentNode;a.selection=n.i(d.e)(e),a.start_edit()}),a.tree_actions.add_child.addEventListener("click",function(){var e=0===a.selection.children.length?n.i(d.f)(a.selection):a.selection.children[0];a.selection=n.i(d.e)(e),a.start_edit()}),a.tree_actions.edit.addEventListener("click",function(){a.start_edit()}),a.tree_actions.delete.addEventListener("click",function(){a.remove_selection()}),a.tree.addEventListener("click",function(e){a.editable!==e.target&&i()}),a.tree.addEventListener("contextmenu",function(e){var t=e.target;if(t!==a.tree){if(null!==a.editable){if(a.editable===t)return;a.stop_edit()}e.preventDefault(),e.stopPropagation(),a.selection=t.classList.contains("tree__sub")?t.parentNode:t,a.context_menu.style.left=e.clientX+"px",a.context_menu.style.top=e.clientY+"px",a.context_menu.classList.remove("hidden")}});var u="current_state";a.tree_actions.save.addEventListener("click",r),a.tree_actions.load.addEventListener("click",l),a.tree_actions.clear_save.addEventListener("click",c),l()}]);
//# sourceMappingURL=app.js.map