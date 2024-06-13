# Route Transition

Animate simple static site pages routing.

## Use case

Add smooth navigating between multiple static pages without reloading.

## [DEMO](https://route-transition-demo.vercel.app)

## Install

### npm

```sh
npm install route-transition
```

## Quick start

### Include
```js
import RouteTransition from 'route-transition';
```

or from cdn

```html
<script src="https://cdn.jsdelivr.net/npm/route-transition"></script>
```
```js
window.RouteTransition;
```

#### Styles (optional, for default behavior):
```css
@import 'route-transition/styles';
```

or from cdn

```html
<link href="https://cdn.jsdelivr.net/npm/route-transition/packages/library/dist/styles.min.css" rel="stylesheet" />
```

### Usage

1. Add _rt-action-link_ class to navigation links:

```html
<nav>
  <a href="page-1.html" class="rt-action-link"></a>
  <a href="page-2.html" class="rt-action-link"></a>
  <a href="page-3.html" class="rt-action-link"></a>
</nav>
```

2. Add _rt-content_ id to the _main content_ and _rt-el-animation_ class to the animated elements:

```html
<!-- Page 1 -->
<main id="rt-content"> <!-- main tag just for semantic example -->
  page 1 content
  <div class="rt-el-animation">page 1 element 1</div>
  <div class="rt-el-animation">page 1 element 2</div>
  <div class="rt-el-animation">page 1 element 3</div>
  <div class="rt-el-animation">page 1 element 4</div>
</main>
```

Similar: Page 2, Page 3, ..., Page N.

The library loads page html and replaces _rt-content_.

3. Initialize
```js
const rt = new RouteTransition();
rt.run();
```

Now, when navigating, an animation of hiding and showing page elements will appear without reloading the page.

## Usage limitations

- This library can be used for simple static site **with common styles for all pages**.
- Only **one instance of RouteTransition** can be created due to the global router _popstate_ listener.
- All listeners attached outside the _main content_ must be detached manually.
- Clicking a link while transition is in progress will have no effect until it completes.

## Options

| Option | Description | Default |
|------|-------------|---------|
| **linkSelector** | selector for element _a_ with _href_ attribute.<br>Page will be uploaded after click | .rt-action-link |
| **contentSelector** | selector for _main content_ (replaced element) | #rt-content |
| **animation** | animation options |  |
| **animation.elSelector** | selector for elements to animate | .rt-el-animation |
| **animation.in** | options that describe how elements should be animated when new page content is inserted |
| **animation.in.duration** | { min, max } or number | from styles |
| **animation.in.delay** | { min, max } or number  | from styles |
| **animation.in.class** | added to animate element when new page content is inserted; removed after animation | rt-el-animation-in |
| **animation.in.beforeClass** | added to all elements when _main content_ is inserted to the page; removed from particular element when animation started | rt-el-animation-before-in |
| **animation.out** | options that describe how elements should be animated while new page content is loading |  |
| **animation.out.duration** | { min, max } or number | from styles |
| **animation.out.delay** | { min, max } or number | from styles |
| **animation.out.class** | added to animate element while new page content is loading; removed after animation | rt-el-animation-out |

**duration** and **delay** — random time from min to max or determined number; animation/transition-duration/delay will be set.

**class** — animation element class.

## Methods

- **run()** — attach all required listeners.
- **getPhase()** — get current animation phase ('in' or 'out').
- **setProcess(process?: AnimationProcessOptions)** — set process for current animation phase, that defines animation elements order and changes animation settings for particular element.
- **destroy()** — detach all required listeners.
- **on(type: string, subscriber: SubscriberFunction)** — attach custom event listener.
- **off(type?: string, subscriber?: SubscriberFunction)** — detach custom event listener (or all listeners if no arguments are provided).

## Events

- **action** — emits when action link was clicked.

```ts
// eventData:
type RouterActionEvent = {
  type: 'link-click' | 'popstate';
  nativeEvent?: Event;
  target?: HTMLElement;
  fromHref: string;
  toHref: string;
};
```

- **load** — emits when page with _main content_ was loaded.

```ts
// eventData:
type LoadingContent = {
  contentElement: HTMLElement;
  documentTitle: string;
};
```

- **insert** — emits when _main content_ was replaced by new one.

```ts
// eventData:
type LoadingContent = {
  contentElement: HTMLElement;
  documentTitle: string;
};
```

- **process** — emits before animation in or out; order and animation settings for particular element can be set by providing _setProcess_ (example below).

```ts
// eventData:
type ProcessEvent = {
  animatedEls: Array<HTMLElement>;
  phase: AnimationPhase;
};
```

- **complete** — emits when page was loaded, inserted and all animations were finished.

- **error** — emits when there was any error. See _Errors_ section below.

  eventData: errorObj.

## Errors

```ts
import {
  HrefNotFoundError,
  ContentElementNotFoundError,
  // ...
} from 'route-transition';
```

- **ContentElementNotFoundError** — there is no element matched specified selector (_contentSelector_).

```ts
interface ContentElementNotFoundError extends Error {
  selector: string;
  phase: AnimationPhase;
}
```

- **HrefNotFoundError** — clicked _a_ element matched _linkSelector_ has no _href_ attribute.

```ts
interface HrefNotFoundError extends Error {
  element: HTMLElement;
  selector: string;
}
```

- **AnimationError** — any animation error.

```ts
interface AnimationError extends Error {
  element: HTMLElement;
  animationClass: string;
}
```

and some specific network errors:

- **RequestError**

```ts
interface RequestError extends Error {
  response: Response;
}
```

and + all erorrs that throws fetch and response.text().

## Advanced usage examples

You can use styles with predefined animations and override default classes or use your own:

```css
.rt-el-animation-out,
.rt-el-animation-in {
  animation: myContentAnimation;
  animation-duration: 0.25s;
  /* ... */

  /* or transitions */
}
```

Thus you can animate each page in its own way.

```js
const rt = new RouteTransition({
  linkSelector: '.rt-action-link',
  contentSelector: '#rt-content',
  animation: {
    elSelector: '.rt-el-animation',
    in: {
      class: 'rt-el-animation-in',
      beforeClass: 'rt-el-animation-before-in',
      // duration: { min: 50, max: 500 },
      // delay: { min: 50, max: 500 },
    },
    out: {
      class: 'rt-el-animation-out',
      // duration: { min: 50, max: 500 },
      // delay: { min: 50, max: 500 },
    },
  },
});
```

And then

```js
rt.run();

rt.on('action', (eventData) => {});
rt.on('load', (eventData) => {});
rt.on('insert', (eventData) => {});
rt.on('process', (eventData) => {
  // set order and animation options for particular elements
  rt.setProcess([
    // animate el0
    {
      animation: {
        el: els[0],
        class:
          rt.getPhase() === 'in'
            ? 'my-animation-in'
            : 'my-animation-out',
        duration: { min: 200, max: 2000 },
        delay: { min: 50, max: 300 },
      },
    },
    // then animate el1, el2 together
    {
      all: [
        { el: els[1] },
        { el: els[2] },
      ],
    },
    // and then animate el3
    { animation: { el: els[3] } },
  ]);
});
rt.on('complete', () => {});
rt.on('error', (error) => {});
```

## License

Released under MIT license
