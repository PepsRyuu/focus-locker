import { fireEvent } from "@testing-library/dom";

export async function tab({ shiftKey } = {}) {
    let evt = new KeyboardEvent('keydown', { 
        shiftKey, 
        keyCode: 9, 
        key: 'Tab' 
    });

    document.dispatchEvent(evt);

    let els = document.querySelectorAll('input,button');
    let index = [].indexOf.call(els, document.activeElement);

    let target;

    if (!shiftKey) {
        target = index === els.length - 1? els[0] : els[index + 1];
    } else {
        target = index === 0? els[els.length - 1] : els[index - 1];
    }

    target.focus();
}

export async function click(target) {
    fireEvent.mouseDown(target);
    target.focus();
    fireEvent.click(target);
    fireEvent.mouseUp(target);
}

export function skipTick() {
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
        });
    });
}