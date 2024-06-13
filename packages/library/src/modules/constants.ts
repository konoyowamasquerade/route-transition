export const DEFAULT_LINK_SELECTOR = '.rt-action-link';
export const DEFAULT_CONTENT_SELECTOR = '#rt-content'; // TODO: make a decision: #rt-content or html or body?

// export const DEFAULT_ANIMATION_DELAY_MIN = 50;
// export const DEFAULT_ANIMATION_DELAY_MAX = 500;
// export const DEFAULT_ANIMATION_DURATION_MIN = 200;
// export const DEFAULT_ANIMATION_DURATION_MAX = 500;

export const DEFAULT_ANIMATION_EL_SELECTOR = '.rt-el-animation';
export const DEFAULT_ANIMATION_IN_CLASS = 'rt-el-animation-in';
export const DEFAULT_ANIMATION_OUT_CLASS = 'rt-el-animation-out';
export const DEFAULT_ANIMATION_IN_BEFORE_CLASS = 'rt-el-animation-before-in';

// export const DEFAULT_ANIMATION_DELAY = {
//   min: DEFAULT_ANIMATION_DELAY_MIN,
//   max: DEFAULT_ANIMATION_DELAY_MAX,
// };

// export const DEFAULT_ANIMATION_DURATION = {
//   min: DEFAULT_ANIMATION_DURATION_MIN,
//   max: DEFAULT_ANIMATION_DURATION_MAX,
// };

export const DEFAULT_OPTIONS = {
  linkSelector: DEFAULT_LINK_SELECTOR,

  contentSelector: DEFAULT_CONTENT_SELECTOR,

  animation: {
    elSelector: DEFAULT_ANIMATION_EL_SELECTOR,
    in: {
      beforeClass: DEFAULT_ANIMATION_IN_BEFORE_CLASS,
      class: DEFAULT_ANIMATION_IN_CLASS,
      // duration: DEFAULT_ANIMATION_DURATION,
      // delay: DEFAULT_ANIMATION_DELAY,
    },
    out: {
      class: DEFAULT_ANIMATION_OUT_CLASS,
      // duration: DEFAULT_ANIMATION_DURATION,
      // delay: DEFAULT_ANIMATION_DELAY,
    },
  },
};
