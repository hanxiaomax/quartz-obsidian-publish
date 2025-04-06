---
title: "Anime.js | JavaScript Animation Engine"
source: "https://animejs.com/"
author:
published:
created: 2025-04-05
description: "A fast and versatile JavaScript animation library"
tags:
  - "clippings"
---
## All-in-one animation engine.

A fast and versatile JavaScript  
library to animate W e b G L.

```
npm i animejs
```

## The complete animator's toolbox

Break free from browser limitations and animate anything on the web with a single API.

## Intuitive API

Animate faster with an easy-to-use, yet powerful animation API.

- [Per property parameters](https://animejs.com/documentation/animation/tween-parameters/composition)
- [Flexible keyframes system](https://animejs.com/documentation/animation/tween-parameters/composition)
- [Built-in easings](https://animejs.com/documentation/animation/tween-parameters/composition)

## Enhanced transforms

Smoothly blend individual CSS transform properties with a versatile composition API.

- [Individual CSS Transforms](https://animejs.com/documentation/animation/animatable-properties/css-transforms)
- [Function based values](https://animejs.com/documentation/animation/tween-value-types/function-based)
- [Blend composition](https://animejs.com/documentation/animation/tween-parameters/composition)

## SVG toolset

Morph shapes, follow motion paths, and draw lines easily with the built-in SVG utilities.

- [Shape morphing](https://animejs.com/documentation/svg/morphto)
- [Line drawing](https://animejs.com/documentation/svg/createdrawable)
- [Motion path](https://animejs.com/documentation/svg/createmotionpath)

## Scroll Observer

Synchronise and trigger animations on scroll with the Scroll Observer API.

- [Multiple synchronisation modes](https://animejs.com/documentation/scroll/scrollobserver-synchronisation-modes)
- [Advanced thresholds](https://animejs.com/documentation/scroll/scrollobserver-thresholds)
- [Complete set of callbacks](https://animejs.com/documentation/scroll/scrollobserver-callbacks)

## Advanced staggering

Create stunning effects in seconds with the built-in Stagger utility function.

- [Time staggering](https://animejs.com/documentation/stagger/time-staggering)
- [Values staggering](https://animejs.com/documentation/stagger/values-staggering)
- [Timeline positions staggering](https://animejs.com/documentation/stagger/timeline-positions-staggering)

## Springs and draggable

Drag, snap, flick and throw HTML elements with the fully-featured Draggable API.

- [Versatile settings](https://animejs.com/documentation/draggable/draggable-settings)
- [Comprehensive callbacks](https://animejs.com/documentation/draggable/draggable-callbacks)
- [Useful methods](https://animejs.com/documentation/draggable/draggable-methods)

## Runs like clockwork

Orchestrate animation sequences and keep callbacks in sync with the powerfull Timeline API.

- [Synchronise animations](https://animejs.com/documentation/timeline/add-animations)
- [Advanced time positions](https://animejs.com/documentation/timeline/time-position)
- [Playback settings](https://animejs.com/documentation/timeline/timeline-playback-settings)

## Responsive animations

Make animations respond to media queries easily with the Scope API.

- [Media queries](https://animejs.com/documentation/scope/scope-parameters/mediaqueries)
- [Custom root element](https://animejs.com/documentation/scope/scope-parameters/root)
- [Scopped methods](https://animejs.com/documentation/scope/register-method-function)

## A lightweight and modular API

Keep your bundle size small by only importing the parts you need.

## Start animating

Get started quickly with our in-depth documentation.

- [Getting started](https://animejs.com/documentation/getting-started)
- [Timer](https://animejs.com/documentation/timer)
- [Animation](https://animejs.com/documentation/animation)
- [Timeline](https://animejs.com/documentation/timeline)
- [Animatable](https://animejs.com/documentation/animatable)
- [Draggable](https://animejs.com/documentation/draggable)
- [Scroll](https://animejs.com/documentation/scroll)
- [Scope](https://animejs.com/documentation/scope)
- [Stagger](https://animejs.com/documentation/stagger)
- [SVG](https://animejs.com/documentation/svg)
- [Utils](https://animejs.com/documentation/utilities)
- [WAAPI](https://animejs.com/documentation/web-animation-api)

```javascript
animate('.square', {
  rotate: 90,
  loop: true,
  ease: 'inOutExpo',
});
```
```javascript
animate('.shape', {
  x: random(-100, 100),
  y: random(-100, 100),
  rotate: random(-180, 180),
  duration: random(500, 1000),
  composition: 'blend',
});
```
```javascript
animate('.car', {
  ...createMotionPath('.circuit'),
});

animate(createDrawable('.circuit'), {
  draw: '0 1',
});

animate('.circuit-a', {
  d: morphTo('.circuit-b'),
});
```
```javascript
animate(createDrawable('path'), {
  draw: ['0 0', '0 1', '1 1'],
  delay: stagger(40),
  ease: 'inOut(3)',
  autoplay: onScroll({ sync: true }),
});
```
```javascript
const options = {
  grid: [13, 13],
  from: 'center',
};

createTimeline()
  .add('.dot', {
    scale: stagger([1.1, .75], options),
    ease: 'inOutQuad',
  }, stagger(200, options));
```
```javascript
createDraggable('.circle', {
  releaseEase: createSpring({
    stiffness: 120,
    damping: 6,
  })
});
```
```javascript
createTimeline()
  .add('.tick', {
    y: '-=6',
    duration: 50,
  }, stagger(10))
  .add('.ticker', {
    rotate: 360,
    duration: 1920,
  }, '<');
```
```javascript
createScope({
  mediaQueries: {
    portrait: '(orientation: portrait)',
  }
})
.add(({ matches }) => {
  const isPortrait = matches.portrait;
  createTimeline().add('.circle', {
    y: isPortrait ? 0 : [-50, 50, -50],
    x: isPortrait ? [-50, 50, -50] : 0,
  }, stagger(100));
});
```

### Bundle size

27.13 KB
- Timer 5.60 KB
- Animation +5.20 KB
- Timeline +0.55 KB
- Animatable +0.40 KB
- Draggable +6.41 KB
- Scroll +4.30 KB
- Scope +0.22 KB
- Stagger +0.48 KB
- SVG 0.35 KB
- Spring 0.52 KB
- WAAPI 3.50 KB

### Funding goal

29%

Help the project via [GitHub Sponsors](https://github.com/sponsors/juliangarnier).