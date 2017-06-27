/*!
 * Focus Locker
 * MIT License (c) 2017 Paul Sweeney
 * http://github.com/PepsRyuu
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        window.FocusLocker = factory();
    }
}(function () {
    
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
    var shiftTab = false;

    document.addEventListener('focus', onDocumentFocus, true);
    document.addEventListener('keydown', onDocumentKeyDown, true);

    function onDocumentKeyDown (e) {
        shiftTab = (e.shiftKey && e.keyCode === 9);
    }

    function onDocumentFocus (e) {
        if (stack.length > 0) {
            var element = stack[stack.length - 1].element;
            if (element !== e.target && !element.contains(e.target)) {
                e.stopPropagation();
                if (shiftTab) {
                    findLastFocusableElement(element).focus();
                } else {
                    findFocusableElement(element).focus();
                }
            }
        }
    }

    function findFocusableElement (parent) {
        return parent.querySelector(focus_selector) || parent;
    }

    function findLastFocusableElement (parent) {
        var els = parent.querySelectorAll(focus_selector);
        return els? els[els.length -1] : parent;
    }

    return {
        request: function (element) {
            var handle = {
                element: element,
                lastFocused: document.activeElement
            };

            stack.push(handle);
            findFocusableElement(element).focus();
        },

        release: function () {
            if (stack.length > 0) {
                var handle = stack.pop();
                handle.lastFocused.focus();
            }
        }
    }
}));