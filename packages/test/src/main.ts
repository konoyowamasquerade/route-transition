import RouteTransition from 'route-transition/development';

const rt = new RouteTransition({
  linkSelector: '.rt-action-link',
  contentSelector: '#rt-content',
  animation: {
    elSelector: '.rt-el-animation',
    // elSelector: '.rt-el-animation1',
    in: {
      class: 'rt-el-animation-in',
      beforeClass: 'rt-el-animation-before-in',
      // duration: { min: 50, max: 2000 },
      // delay: { min: 50, max: 2000 },
    },
    out: {
      class: 'rt-el-animation-out',
      // duration: { min: 50, max: 2000 },
      // delay: { min: 50, max: 2000 },
    },
  },
});

rt.run();

rt.on('action', (event) => {
  console.log('action', event);
});

rt.on('process', (event: any) => {
  const els = event.animatedEls;

  rt.setProcess([
    {
      animation: {
        el: els[0],
        // duration: { min: 3000, max: 5000 },
        // delay: { min: 3000, max: 5000 },
      },
    },
    {
      all: [{ el: els[1] }, { el: els[2] }, { el: els[3] }, { el: els[4] }],
    },
    { animation: { el: els[5] } },

    { animation: { el: els[6] } },
    { animation: { el: els[7] } },

    { animation: { el: els[8] } },
    { animation: { el: els[9] } },

    {
      animation: {
        el: els[10],
        class:
          rt.getPhase() === 'in'
            ? 'box-own-options-animation-in'
            : 'box-own-options-animation-out',
        duration: { min: 100, max: 500 },
        delay: { min: 100, max: 500 },
      },
    },
  ]);

  // rt.setProcess(123);

  console.log('process', rt.getPhase(), event);
});

rt.on('load', (event) => {
  console.log('load', event);
});

rt.on('insert', (event) => {
  console.log('insert', event);
});

rt.on('complete', (event) => {
  console.log('complete', event);
});

rt.on('error', (event) => {
  console.log('error', event);
});
