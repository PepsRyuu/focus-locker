var focus_selector = [
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'object:not([disabled])',
    'a[href]',
    '*[tabindex]'
].join(',');

var stack = [];
var mouseDown = false;

document.addEventListener('focus', onDocumentFocus, true);
document.addEventListener('mousedown', onDocumentMouseDown, true);
document.addEventListener('mouseup', onDocumentMouseUp, true);

function onDocumentMouseDown(e) {
    mouseDown = true;
}

function onDocumentMouseUp(e) {
    mouseDown = false;
}

function onDocumentFocus (e) {
    if (mouseDown) {
        return;
    }

    if (stack.length > 0) {
        var element = stack[stack.length - 1].element;
        if (element !== e.target && !element.contains(e.target)) {
            e.stopPropagation();
            focus(findFirstFocusableElement(element) || element);
        }
    }
}

function onElementKeyDown(e) {
    if (e.keyCode === 9) {
        let target = e.currentTarget;
        let firstFocusable = findFirstFocusableElement(target) || target;
        let lastFocusable = findLastFocusableElement(target) || target;

        if (document.activeElement === lastFocusable && !e.shiftKey) {
            e.preventDefault();
            focus(firstFocusable);
        } else if (document.activeElement === firstFocusable && e.shiftKey) {
            e.preventDefault();
            focus(lastFocusable);
        }
    }
}

function findFocusableElements(parent) {
    return parent.querySelectorAll(focus_selector);
}

function findFirstFocusableElement (parent) {
    return findFocusableElements(parent)[0];
}

function findLastFocusableElement (parent) {
    var els = findFocusableElements(parent);
    return els? els[els.length -1] : null;
}

function focus(element, opts = {}) {
    element.focus({
        preventScroll: opts.preventScroll
    });
}

function request (element, options = {}) {
    let opts = options instanceof Node? {
        returnElement: options,
        preventScroll: false
    } : {
        returnElement: options.returnElement || document.activeElement,
        preventScroll: options.preventScroll || false,
    };

    if (!element) {
        throw new Error('Must pass element to focus lock into.');
    }

    var handle = { element, opts };

    element.addEventListener('keydown', onElementKeyDown);

    stack.push(handle);
    
    var autoFocus = element.querySelector('[data-autofocus=""], [data-autofocus="true"]');
    var autoFocusInside = element.querySelector('[data-autofocus-inside=""], [data-autofocus-inside="true"]');

    if (autoFocus) {
        focus(autoFocus, opts);
        return;
    }

    if (autoFocusInside) {
        var found = findFirstFocusableElement(autoFocusInside);
        if (found) {
            focus(found, opts);
            return;
        }
    }

    focus((findFirstFocusableElement(element) || element), opts);
}

function release (element) {
    if (stack.length > 0) {
        var stackLength = stack.length;
        var index = element? stack.findIndex(h => h.element === element) : stack.length - 1;
        var handle = stack[index];
        stack.splice(index, 1);

        handle.element.removeEventListener('keydown', onElementKeyDown);

        if (index === stackLength - 1) {
            if (handle.opts.returnElement.matches(focus_selector)) {
                focus(handle.opts.returnElement, handle.opts);
            } else {
                var el = handle.opts.returnElement.querySelector(focus_selector);
                if (el) {
                    focus(el, handle.opts);
                }
            }
        }
    }
}

var main = { request, release };

export default main;