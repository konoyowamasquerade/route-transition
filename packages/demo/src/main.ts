import RouteTransition from 'route-transition';

function prepareFeature(from: string, to: string) {
  const aboutFeatureRoute =
    (from.includes('about') && to.includes('feature')) ||
    (from.includes('feature') && to.includes('about'));

  if (!aboutFeatureRoute) return;

  const el = document.querySelector(
    '.feature-item-brief, .feature-item-detail'
  );
  if (!el) return;

  requestAnimationFrame(() => {
    // el.scrollIntoView();
    scrollTo(0, 0);
  });
  el.classList.add('feature-item-fancy-animation');
}

function clearFeature() {
  const el = document.querySelector(
    '.feature-item-brief, .feature-item-detail'
  );
  if (!el) return;
  el.classList.remove('feature-item-fancy-animation');
}

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

rt.run();

let fromHref: string;
let toHref: string;

rt.on('action', (event: any) => {
  console.log('action', event);

  fromHref = event.fromHref;
  toHref = event.toHref;

  prepareFeature(fromHref, toHref);
});

rt.on('process', (event: any) => {
  console.log('process', rt.getPhase(), event);
  // const els = event.animatedEls;
});

rt.on('load', (event) => {
  console.log('load', event);
});

rt.on('insert', (event) => {
  console.log('insert', event);

  prepareFeature(fromHref, toHref);
});

rt.on('complete', (event) => {
  console.log('complete', event);

  clearFeature();
});

rt.on('error', (event) => {
  console.error('error', event);
});
