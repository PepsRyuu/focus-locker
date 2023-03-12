import { render, fireEvent } from '@testing-library/preact';
import { useEffect, useState, useRef } from 'preact/hooks';
import FocusLocker from '../../src/main.js';
import { tab, click, skipTick } from '../utils';

function BasicTestApp() {
    let [open, setOpen] = useState(false);
    let modalRef = useRef();

    useEffect(() => {
        if (open) {
            FocusLocker.request(modalRef.current);
            return () => FocusLocker.release();
        }
    }, [open]);

    return (
        <div class="TestApp">
            <button class="open" onClick={() => setOpen(true)}>Open</button>
            {open && (
                <div class="Modal" ref={modalRef}>
                    <input class="input-a" />
                    <input class="input-b" />
                    <button class="close" onClick={() => setOpen(false)}>Close</button>
                </div>
            )}
        </div>
    )
}

function CustomReturnTestApp() {
    let [open, setOpen] = useState(false);
    let modalRef = useRef();
    let returnRef = useRef();

    useEffect(() => {
        if (open) {
            FocusLocker.request(modalRef.current, returnRef.current);
            return () => FocusLocker.release();
        }
    }, [open]);

    return (
        <div class="TestApp">
            <button class="open" onClick={() => setOpen(true)}>Open</button>
            <button class="return-btn" ref={returnRef}>ReturnBtn</button>
            {open && (
                <div class="Modal" ref={modalRef}>
                    <button class="close" onClick={() => setOpen(false)}>Close</button>
                </div>
            )}
        </div>
    )
}

function CustomReturnWrapperTestApp() {
    let [open, setOpen] = useState(false);
    let modalRef = useRef();
    let returnRef = useRef();

    useEffect(() => {
        if (open) {
            FocusLocker.request(modalRef.current, returnRef.current);
            return () => FocusLocker.release();
        }
    }, [open]);

    return (
        <div class="TestApp">
            <button class="open" onClick={() => setOpen(true)}>Open</button>
            <div class="MyReturnWrapper" ref={returnRef}>
                <button class="return-btn">ReturnBtn</button>
            </div>
            {open && (
                <div class="Modal" ref={modalRef}>
                    <button class="close" onClick={() => setOpen(false)}>Close</button>
                </div>
            )}
        </div>
    )
}

function AutoFocusInsideTestApp({ focus }) {
    let modalRef = useRef();

    useEffect(() => {
        FocusLocker.request(modalRef.current);
        return () => FocusLocker.release();
    }, []);

    return (
        <div class="TestApp">
            <div class="Modal" ref={modalRef}>
                <input class="input-a" />
                <div data-autofocus-inside>
                    <input class="input-c" data-autofocus={focus === 'input-c'} />
                    <input class="input-d" data-autofocus={focus === 'input-d'} />
                </div>
            </div>
        </div>
    )
}

function NestedTestApp() {
    let [open, setOpen] = useState(false);
    let [nestOpen, setNestOpen] = useState(false);
    let modalRef = useRef();
    let nestModalRef = useRef();

    useEffect(() => {
        if (open) {
            FocusLocker.request(modalRef.current);
            return () => FocusLocker.release();
        }
    }, [open]);

    useEffect(() => {
        if (nestOpen) {
            FocusLocker.request(nestModalRef.current);
            return () => FocusLocker.release();
        }
    }, [nestOpen]);

    return (
        <div class="TestApp">
            <button class="open" onClick={() => setOpen(true)}>Open</button>
            {open && (
                <div class="Modal" ref={modalRef}>
                    <input class="input-a" />
                    <input class="input-b" />
                    <button class="nest-open" onClick={() => setNestOpen(true)}>Open</button>
                    <button class="close" onClick={() => setOpen(false)}>Close</button>
                </div>
            )}
            {nestOpen && (
                <div class="Modal" ref={nestModalRef}>
                    <input class="input-nest-a" />
                    <input class="input-nest-b" />
                    <button class="nest-close" onClick={() => setNestOpen(false)}>Close</button>
                </div>
            )}
        </div>
    )
}

function ParallelTestApp() {
    function Popup({ trigger, content }) {
        let [show, setShow] = useState(false);
        let triggerRef = useRef();
        let contentRef = useRef();

        useEffect(() => {
            let closeFn = () => setShow(false);

            if (show) {
                let content = contentRef.current;
                document.body.addEventListener('click', closeFn);
                FocusLocker.request(content);

                return () => {
                    document.body.removeEventListener('click', closeFn);
                    FocusLocker.release(content);
                };
            }
        }, [show]);

        return (
            <div>
                <div ref={triggerRef} onClick={() => setShow(true)}>
                    {trigger}
                </div>
                {show && (
                    <div ref={contentRef} onKeyDown={e => e.key === 'Escape' && setShow(false)}>
                        {content}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div class="TestApp">
            <Popup
                trigger={<button class="popup-a-trigger">Open</button>}
                content={
                    <div class="popup-a-content">
                        <input class="input-a-p-a" />
                        <input class="input-b-p-a" />
                    </div>
                }
            />
            <Popup
                trigger={<button class="popup-b-trigger">Open</button>}
                content={
                    <div class="popup-b-content">
                        <input class="input-a-p-b" />
                        <input class="input-b-p-b" />
                    </div>
                }
            />
        </div>
    )
}

function EscapeTestApp() {
    let [open, setOpen] = useState(false);
    let modalRef = useRef();

    useEffect(() => {
        if (open) {
            FocusLocker.request(modalRef.current);
            return () => FocusLocker.release();
        }
    }, [open]);

    return (
        <div class="TestApp">
            <button class="open" onClick={() => setOpen(true)}>Open</button>
            {open && (
                <div class="Modal" ref={modalRef}>
                    <input class="input-a" />
                </div>
            )}
            <input 
                class="escape-check" 
            />
        </div>
    )
}

describe('FocusLocker', () => {
    test('should focus on first focusable item in element passed to request', () => {
        render(<BasicTestApp />);
        let openBtn = document.querySelector('button.open');
        openBtn.focus();
        expect(document.activeElement.className).toEqual('open');
        fireEvent.click(openBtn);
        expect(document.activeElement.className).toEqual('input-a');
    });

    test('should support data-autofocus-inside', () => {
        expect(document.activeElement.tagName).toEqual('BODY');
        render(<AutoFocusInsideTestApp />);
        expect(document.activeElement.className).toEqual('input-c');
    });

    test('should support data-autofocus', () => {
        expect(document.activeElement.tagName).toEqual('BODY');
        render(<AutoFocusInsideTestApp focus="input-d" />);
        expect(document.activeElement.className).toEqual('input-d');
    });

    test('should focus lock inside the element passed to request', async () => {
        render(<BasicTestApp />);
        let openBtn = document.querySelector('button.open');
        openBtn.focus();
        fireEvent.click(openBtn);
        expect(document.activeElement.className).toEqual('input-a');
        await tab();
        expect(document.activeElement.className).toEqual('input-b');
        await tab();
        expect(document.activeElement.className).toEqual('close');
        await tab();
        expect(document.activeElement.className).toEqual('input-a');
    });

    test('should focus lock reverse inside the element passed to request', async () => {
        render(<BasicTestApp />);
        let openBtn = document.querySelector('button.open');
        openBtn.focus();
        fireEvent.click(openBtn);
        expect(document.activeElement.className).toEqual('input-a');
        await tab({ shiftKey: true });
        expect(document.activeElement.className).toEqual('close');
        await tab({ shiftKey: true });
        expect(document.activeElement.className).toEqual('input-b');
        await tab({ shiftKey: true });
        expect(document.activeElement.className).toEqual('input-a');
    });

    test('should return focus to the element before request was triggered', () => {
        render(<BasicTestApp />);
        let openBtn = document.querySelector('button.open');
        openBtn.focus();
        expect(document.activeElement.className).toEqual('open');
        fireEvent.click(openBtn);
        expect(document.activeElement.className).toEqual('input-a');
        let closeBtn = document.querySelector('button.close');
        fireEvent.click(closeBtn);
        expect(document.activeElement.className).toEqual('open');
    });

    test('should not focus lock for clicks', async () => {
        // Note, the idea behind this is that if you're using FocusLocker for a 
        // component such as a popover, it shouldn't block clicks outside the popover.
        // This would break features such as :active styles. Instead, this is up
        // to the developer to decide through CSS like using an element ovelay to block clicks.
        render(<BasicTestApp />);
        let openBtn = document.querySelector('button.open');
        await click(openBtn);
        expect(document.activeElement.className).toEqual('input-a');
        await click(openBtn);
        expect(document.activeElement.className).toEqual('open');
    });

    test('should support custom element to return to on request', async () => {
        render(<CustomReturnTestApp />);
        await click(document.querySelector('button.open'));
        expect(document.activeElement.className).toEqual('close');
        await click(document.querySelector('button.close'));
        expect(document.activeElement.className).toEqual('return-btn');
    });

    test('should support focusable element inside custom element to return to on request', async () => {
        render(<CustomReturnWrapperTestApp />);
        await click(document.querySelector('button.open'));
        expect(document.activeElement.className).toEqual('close');
        await click(document.querySelector('button.close'));
        expect(document.activeElement.className).toEqual('return-btn');
    });

    test('should focus lock inside a focus lock and stack', async () => {
        render(<NestedTestApp />);
        await click(document.querySelector('button.open'));
        expect(document.activeElement.className).toEqual('input-a');
        await click(document.querySelector('button.nest-open'));
        expect(document.activeElement.className).toEqual('input-nest-a');
        await tab();
        expect(document.activeElement.className).toEqual('input-nest-b');
        await tab();
        expect(document.activeElement.className).toEqual('nest-close');
        await tab();
        expect(document.activeElement.className).toEqual('input-nest-a');
    });

    test('should return focus to the element before request inside a stack', async () => {
        render(<NestedTestApp />);
        await click(document.querySelector('button.open'));
        expect(document.activeElement.className).toEqual('input-a');
        await click(document.querySelector('button.nest-open'));
        expect(document.activeElement.className).toEqual('input-nest-a');
        await click(document.querySelector('button.nest-close'));
        expect(document.activeElement.className).toEqual('nest-open');
        await click(document.querySelector('button.close'));
        expect(document.activeElement.className).toEqual('open');
    });

    test('should allow programmatically releasing from anywhere in the stack and not restore focus', async () => {
        render(<ParallelTestApp />);
        await click(document.querySelector('.popup-a-trigger'));
        expect(document.activeElement.className).toEqual('input-a-p-a');
        await click(document.querySelector('.popup-b-trigger'));
        expect(document.activeElement.className).toEqual('input-a-p-b');
        fireEvent.keyDown(document.activeElement, { key: 'Escape' });
        await skipTick();
        expect(document.activeElement.className).toEqual('popup-b-trigger');
    });
    
    test('should not escape at all when redirecting focus back to start of requested element', async () => {
        // Track focused elements.
        let focus = window.HTMLElement.prototype.focus;
        let trail = [];
        window.HTMLElement.prototype.focus = function () {
            trail.push(this);
            focus.call(this);
        };

        render(<EscapeTestApp />);
        let openBtn = document.querySelector('button.open');
        openBtn.focus();
        fireEvent.click(openBtn);
        expect(document.activeElement.className).toEqual('input-a');
        await tab();
        expect(document.activeElement.className).toEqual('input-a');
        expect(trail.find(t => t.className === 'escape-check')).toEqual(undefined);

        // Restore
        window.HTMLElement.prototype.focus = focus;
    });
});