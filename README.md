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
