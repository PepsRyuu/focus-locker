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
            (findFirstFocusableElement(element) || element).focus();
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
            firstFocusable.focus();
        } else if (document.activeElement === firstFocusable && e.shiftKey) {
            e.preventDefault();
            lastFocusable.focus();
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

function request (element, lastFocused) {
    if (!element) {
        throw new Error('Must pass element to focus lock into.');
    }

    var handle = {
        element: element,
        lastFocused: lastFocused || document.activeElement
    };

    element.addEventListener('keydown', onElementKeyDown);

    stack.push(handle);
    
    var autoFocus = element.querySelector('[data-autofocus=""], [data-autofocus="true"]');
    var autoFocusInside = element.querySelector('[data-autofocus-inside=""], [data-autofocus-inside="true"]');

    if (autoFocus) {
        autoFocus.focus();
        return;
    }

    if (autoFocusInside) {
        var found = findFirstFocusableElement(autoFocusInside);
        if (found) {
            found.focus();
            return;
        }
    }

    (findFirstFocusableElement(element) || element).focus();
}

function release (element) {
    if (stack.length > 0) {
        var stackLength = stack.length;
        var index = element? stack.findIndex(h => h.element === element) : stack.length - 1;
        var handle = stack[index];
        stack.splice(index, 1);

        handle.element.removeEventListener('keydown', onElementKeyDown);

        if (index === stackLength - 1) {
            if (handle.lastFocused.matches(focus_selector)) {
                handle.lastFocused.focus();
            } else {
                var el = handle.lastFocused.querySelector(focus_selector);
                if (el) {
                    el.focus();
                }
            }
        }
    }
}

export default { request, release };