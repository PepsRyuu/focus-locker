# Focus Locker

A simple utility class that restricts focusing to the content of the element specified. This module has no dependency on any framework and can be easily added to any component.

## Features

* Uses a stack, which enables situations like dialogs on top of dialogs to function correctly.
* Remembers what was previously focused when the focus lock is released.
* Supports both tabbing forwards and tabbing in reverse.

## Getting Started

```npm install focus-locker```

When the component is instantiated, use the following code to lock the focus:

```FocusLocker.request(element);```

And when restoring focus, use the following code:

```FocusLocker.release();```

## API

### FocusLocker.request(element, [returnElement])

* Allows you to lock focus into the specified element.
* By default, when you release focus, it will return to the focused element before locking.
* You can optionally choose which element to return to by specifying the second optional parameter.
* You can stack the focus locks, like a dialog on top of a dialog.

### FocusLocker.release([element])

* This will release the last focus lock and return to the element that was focused before locking.
* Typically this will release the last lock on the stack, you can choose to release in the middle of the stack by specifying that container element. Doing so will not return focus.

### data-autofocus-inside

* By default, when you lock focus, it will look for the first focusable element inside the container element and focus on that.
* If you want to focus on a subset of that container, you can use the `data-autofocus-inside` attribute, and it will look for the first focusable element inside that element.

### data-autofocus

* This attribute allows you to specifically choose which element to focus on upon locking.