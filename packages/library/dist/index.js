class EventObserver {
    // #subscribers: { [key: string]: Array<SubscriberFunction> }
    #subscribers;
    constructor(){
        this.#subscribers = {};
    }
    // getSubscribers(type: string): Array<SubscriberFunction> {
    //   return this.#subscribers[type];
    // }
    emit(type, data) {
        if (this.#subscribers[type]) {
            this.#subscribers[type].forEach((subscriber)=>{
                subscriber(data);
            });
        }
    }
    on(type, subscriber) {
        if (!this.#subscribers[type]) {
            this.#subscribers[type] = [];
        }
        this.#subscribers[type].push(subscriber);
    }
    off(type, subscriber) {
        if (!type) {
            this.#subscribers = {};
        } else if (!subscriber && this.#subscribers[type] !== undefined) {
            this.#subscribers[type] = [];
        } else if (this.#subscribers[type] !== undefined && subscriber instanceof Function) {
            const index = this.#subscribers[type].indexOf(subscriber);
            if (index > -1) {
                this.#subscribers[type].splice(index, 1);
            }
        }
    }
}

function getDocumentTitle(element) {
    const text = element.querySelector('title')?.textContent;
    if (text == null) return null;
    return text;
}
function setDocumentTitle(title, _document) {
    (document).title = title;
}
function isHtmlEl(el) {
    return el instanceof HTMLElement;
}

function rand(min, max) {
    return Math.random() * (max - min) + min;
}
function formRandomValue(value) {
    let finalValue;
    if (typeof value !== 'number' && value?.min && value?.max) {
        const min = value.min;
        const max = value.max;
        finalValue = rand(min, max);
    } else if (typeof value === 'number') {
        finalValue = value;
    }
    return finalValue;
}

function round(x, afterComma = 0) {
    const acc = 10 ** afterComma;
    return Math.round(x * acc) / acc;
}

class AnimationError extends Error {
    element;
    animationClass;
    constructor(message, element, animationClass){
        super(`${message}\n  class: ${animationClass}`);
        this.name = this.constructor.name;
        this.element = element;
        this.animationClass = animationClass;
    }
}

function traverse(process, callback) {
    if (!Array.isArray(process)) return;
    for (const step of process){
        if (step?.animation) {
            callback({
                animation: step.animation
            });
        } else if (Array.isArray(step?.all)) {
            for (const animation of step.all){
                callback({
                    animation
                });
            }
        }
    }
}
function addAnimationPropsToEl(el, anim) {
    el.classList.add(anim.class);
    if (anim.duration != null) {
        el.style.setProperty('animation-duration', `${anim.duration}ms`);
        el.style.setProperty('transition-duration', `${anim.duration}ms`);
    }
    if (anim.delay != null) {
        el.style.setProperty('animation-delay', `${anim.delay}ms`);
        el.style.setProperty('transition-delay', `${anim.delay}ms`);
    }
}
function removeAnimationPropsFromEl(el, elClass) {
    el.classList.remove(elClass);
    el.style.setProperty('animation-duration', null);
    el.style.setProperty('animation-delay', null);
    el.style.setProperty('transition-duration', null);
    el.style.setProperty('transition-delay', null);
}
function clearAnimation(anim) {
    removeAnimationPropsFromEl(anim.el, anim.class);
}
async function animationFinishPromise(animation) {
    return new Promise((resolve)=>{
        const onFinish = ()=>{
            resolve();
        };
        animation.addEventListener('finish', onFinish, {
            once: true
        });
    });
}
// const onAnimationend = (event: Event) => {
//   event.stopPropagation();
//   resolve();
// };
// el.addEventListener('animationend', onAnimationend, { once: true });
async function allElAnimationsFinishPromise(el) {
    const animations = el.getAnimations();
    if (!animations.length) return Promise.resolve();
    const animationFinishPromises = animations.map((animation)=>animationFinishPromise(animation));
    await Promise.all(animationFinishPromises);
    return Promise.resolve();
}
async function animate(anim) {
    addAnimationPropsToEl(anim.el, anim);
    return allElAnimationsFinishPromise(anim.el);
}

function randomizeTimeAnim(anim) {
    const result = {
        class: anim.class,
        el: anim.el
    };
    if (anim.duration) result.duration = round(formRandomValue(anim.duration), 3);
    if (anim.delay) result.delay = round(formRandomValue(anim.delay), 3);
    return result;
}
function randomizeAndAnimate(animation) {
    return animate(randomizeTimeAnim(animation));
}
class Animation extends EventObserver {
    process;
    constructor(options){
        super();
        this.process = options?.process;
    }
    async #animateOne(animation) {
        const eventData = {
            el: animation.el
        };
        try {
            const promise = randomizeAndAnimate(animation);
            this.emit('animation-start', eventData);
            await promise;
            this.emit('animation-end', eventData);
        } catch (error) {
            const msg = error?.message ?? error;
            throw new AnimationError(msg, animation.el, animation.class);
        }
    }
    async animate() {
        if (!Array.isArray(this.process)) return;
        for (const step of this.process){
            if (step?.animation && isHtmlEl(step?.animation?.el)) {
                await this.#animateOne(step.animation);
            } else if (Array.isArray(step?.all)) {
                const parallel = [];
                for (const animation of step.all){
                    if (isHtmlEl(animation?.el)) parallel.push(this.#animateOne(animation));
                }
                await Promise.all(parallel);
            }
        }
    // content.el.classList.add(content.class);
    // const times = getAnimationTimes(content.el);
    // content.el.classList.remove(content.class);
    }
    // resetToZeroImmediate() {}
    clearImmediate() {
        if (!this.process) return;
        traverse(this.process, ({ animation })=>{
            if (!isHtmlEl(animation?.el)) return;
            clearAnimation(animation);
        });
    }
}

const DEFAULT_LINK_SELECTOR = '.rt-action-link';
const DEFAULT_CONTENT_SELECTOR = '#rt-content'; // TODO: make a decision: #rt-content or html or body?
// export const DEFAULT_ANIMATION_DELAY_MIN = 50;
// export const DEFAULT_ANIMATION_DELAY_MAX = 500;
// export const DEFAULT_ANIMATION_DURATION_MIN = 200;
// export const DEFAULT_ANIMATION_DURATION_MAX = 500;
const DEFAULT_ANIMATION_EL_SELECTOR = '.rt-el-animation';
const DEFAULT_ANIMATION_IN_CLASS = 'rt-el-animation-in';
const DEFAULT_ANIMATION_OUT_CLASS = 'rt-el-animation-out';
const DEFAULT_ANIMATION_IN_BEFORE_CLASS = 'rt-el-animation-before-in';
// export const DEFAULT_ANIMATION_DELAY = {
//   min: DEFAULT_ANIMATION_DELAY_MIN,
//   max: DEFAULT_ANIMATION_DELAY_MAX,
// };
// export const DEFAULT_ANIMATION_DURATION = {
//   min: DEFAULT_ANIMATION_DURATION_MIN,
//   max: DEFAULT_ANIMATION_DURATION_MAX,
// };
const DEFAULT_OPTIONS = {
    linkSelector: DEFAULT_LINK_SELECTOR,
    contentSelector: DEFAULT_CONTENT_SELECTOR,
    animation: {
        elSelector: DEFAULT_ANIMATION_EL_SELECTOR,
        in: {
            beforeClass: DEFAULT_ANIMATION_IN_BEFORE_CLASS,
            class: DEFAULT_ANIMATION_IN_CLASS
        },
        out: {
            class: DEFAULT_ANIMATION_OUT_CLASS
        }
    }
};

class HrefNotFoundError extends Error {
    element;
    selector;
    constructor(element, selector){
        super('Href not found');
        this.name = this.constructor.name;
        this.element = element;
        this.selector = selector;
    }
}

const MAX_HISTORY_LENGTH = 3;

class RouterHistory {
    #hrefs = [];
    #index = -1;
    #maxLength;
    constructor(options){
        this.#maxLength = options?.maxLength || MAX_HISTORY_LENGTH;
    }
    add(href) {
        this.#hrefs.push(href);
        this.#index++;
        if (this.#hrefs.length > this.#maxLength) {
            this.#hrefs.shift();
            this.#index--;
        }
    }
    get(index) {
        return this.#hrefs.at(index) ?? null;
    }
    get current() {
        return this.#hrefs[this.#index];
    }
    get length() {
        return this.#hrefs.length;
    }
    backward() {
        if (this.#index <= 0) return null;
        this.#index--;
        return this.#hrefs[this.#index];
    }
    forward() {
        if (this.#index >= this.#hrefs.length - 1) return null;
        this.#index++;
        return this.#hrefs[this.#index];
    }
    clear() {
        this.#hrefs = [];
        this.#index = -1;
    }
}

class Router extends EventObserver {
    linkSelector;
    #history;
    #clickHandlerBinded;
    #popstateHandlerBinded;
    constructor(props){
        super();
        this.linkSelector = props?.linkSelector || DEFAULT_LINK_SELECTOR;
        this.#clickHandlerBinded = this.#clickHandler.bind(this);
        this.#popstateHandlerBinded = this.#popstateHandler.bind(this);
        this.#history = new RouterHistory();
        this.#history.add(window.location.href);
    }
    run() {
        this.#addListeners();
    }
    destroy() {
        this.#removeListeners();
    }
    goBack() {
        const prevHref = this.#history.backward();
        if (prevHref) {
            history.pushState({}, '', prevHref);
        }
    }
    #addListeners() {
        document.addEventListener('click', this.#clickHandlerBinded);
        window.addEventListener('popstate', this.#popstateHandlerBinded);
    }
    #removeListeners() {
        document.removeEventListener('click', this.#clickHandlerBinded);
        window.removeEventListener('popstate', this.#popstateHandlerBinded);
    }
    #isElementLink(element) {
        if (!this.linkSelector) return false;
        if (!element) return false;
        return element.matches(this.linkSelector);
    }
    #popstateHandler(event) {
        this.#generateEvent({
            type: 'popstate',
            nativeEvent: event,
            toHref: window.location.href,
            fromHref: this.#history.current
        });
    }
    #generateEvent(data) {
        this.#history.add(data.toHref);
        this.emit('action', data);
    }
    #clickHandler(event) {
        const target = event.target;
        const linkEl = target.closest(this.linkSelector);
        if (!this.#isElementLink(linkEl)) return;
        event.preventDefault();
        const href = linkEl.getAttribute('href');
        if (!href) {
            const error = new HrefNotFoundError(linkEl, this.linkSelector);
            this.emit('error', error);
            return;
        }
        history.pushState({}, '', href);
        this.#generateEvent({
            type: 'link-click',
            nativeEvent: event,
            target: linkEl,
            toHref: href,
            fromHref: this.#history.current || window.location.href
        });
    }
}

class RequestError extends Error {
    response;
    constructor(response){
        super();
        this.name = this.constructor.name;
        this.response = response;
    }
}

class ContentLoader extends EventObserver {
    selector;
    #abortController;
    constructor(options){
        super();
        this.selector = options.selector;
    }
    stop() {
        if (this.#abortController) {
            this.#abortController.abort();
        }
    }
    async #parseResponse(response) {
        const htmlStr = await response.text();
        const html = document.createElement('html');
        html.innerHTML = htmlStr;
        const contentElement = html.querySelector(`${this.selector}`);
        const result = {
            contentElement,
            documentTitle: getDocumentTitle(html)
        };
        return result;
    }
    async load(url) {
        try {
            this.#abortController = new AbortController();
            const response = await fetch(url, {
                signal: this.#abortController.signal
            });
            if (response.ok) {
                return this.#parseResponse(response);
            }
            throw new RequestError(response);
        } finally{
            this.#abortController = null;
        }
    }
}

class ContentElementNotFoundError extends Error {
    selector;
    phase;
    constructor(selector, phase){
        super(`Content not found by selector ${selector} in phase ${phase}`);
        this.name = this.constructor.name;
        this.selector = selector;
        this.phase = phase;
    }
}

function isObject(obj) {
    return obj != null && obj?.constructor?.name === 'Object';
}
function deepCopyObject(obj) {
    if (Array.isArray(obj)) return [
        ...obj
    ];
    if (!isObject(obj)) return obj;
    const objCopied = {};
    Object.keys(obj).forEach((key)=>{
        objCopied[key] = deepCopyObject(obj?.[key]);
    });
    return objCopied;
// return JSON.parse(JSON.stringify(obj)) as T;
}
function fillWithDefault(obj, defaultObj) {
    if (!isObject(obj)) return;
    const keys = Object.keys(defaultObj);
    keys.forEach((key)=>{
        if (!(key in obj)) {
            obj[key] = defaultObj[key];
            return;
        }
        if (isObject(defaultObj[key])) {
            fillWithDefault(obj[key], defaultObj[key]);
        }
    });
}

function getOptionsFilledWithDefaults(options) {
    const _options = deepCopyObject(options ?? {});
    fillWithDefault(_options, DEFAULT_OPTIONS);
    return _options;
}
function getFilledAnimationWithDefault(animation, animationDefault) {
    return {
        el: animation.el,
        class: animation.class ?? animationDefault.class,
        duration: animation.duration ?? animationDefault.duration,
        delay: animation.delay ?? animationDefault.delay
    };
}
function getFilledProcessWithDefault(process, animationDefault) {
    const newProcess = [];
    process.forEach((step)=>{
        if (step?.animation) {
            const animationWithDefaults = getFilledAnimationWithDefault(step.animation, animationDefault);
            newProcess.push({
                animation: animationWithDefaults
            });
        } else if (Array.isArray(step?.all)) {
            const all = [];
            step.all.forEach((animation)=>{
                const animationWithDefaults = getFilledAnimationWithDefault(animation, animationDefault);
                all.push(animationWithDefaults);
            });
            newProcess.push({
                all
            });
        }
    });
    return newProcess;
}
function formDefaultProcess({ els, options, phase }) {
    const process = [];
    const all = [];
    els.forEach((el)=>{
        const animation = {
            el,
            class: options.animation[phase].class,
            duration: options.animation[phase].duration,
            delay: options.animation[phase].delay
        };
        all.push(animation);
    });
    process.push({
        all
    });
    return process;
}

console.log('%cDevelopment route-transition', 'color: burlywood;');
class RouteTransition extends EventObserver {
    options;
    #process;
    #router;
    #contentLoader;
    #animation;
    #phase;
    #contentEl;
    #inProgress;
    constructor(options){
        super();
        this.options = getOptionsFilledWithDefaults(options);
        this.#router = new Router({
            linkSelector: this.options.linkSelector
        });
        this.#contentLoader = new ContentLoader({
            selector: this.options.contentSelector
        });
        this.#animation = new Animation();
    }
    run() {
        this.#router.run();
        this.#router.on('action', this.#onRouteAction);
        this.#router.on('error', this.#onRouteError);
        this.#animation.on('animation-start', this.#onAnimationStart);
    // this.#animation.on('animation-end', this.#onAnimationEnd);
    }
    destroy() {
        this.#router.off();
        this.#router.destroy();
        this.#contentLoader.off();
        this.#animation.off();
    }
    setProcess(process) {
        if (!Array.isArray(process)) this.#process = null;
        else this.#process = getFilledProcessWithDefault(process, this.options.animation[this.#phase]);
    }
    getPhase() {
        return this.#phase;
    }
    #setContentEl() {
        this.#contentEl = document.querySelector(this.options.contentSelector);
    }
    #getAnimatedEls() {
        return [
            ...document.querySelectorAll(`${this.options.animation.elSelector}`)
        ];
    }
    #formDefaultProcess(els) {
        return formDefaultProcess({
            els,
            options: this.options,
            phase: this.#phase
        });
    }
    #addAnimationInElBeforeClass(el) {
        el.classList.add(this.options.animation.in.beforeClass);
    }
    #removeAnimationInElBeforeClass(el) {
        el.classList.remove(this.options.animation.in.beforeClass);
    }
    #onAnimationStart = (event)=>{
        // this.emit('animation-start', event);
        if (!isHtmlEl(event?.el)) return;
        this.#removeAnimationInElBeforeClass(event.el);
    };
    // #onAnimationEnd = (event: AnimationElEvent) => {
    //   // this.emit('animation-end', event);
    // };
    async #loadContent(routeEvent) {
        if (this.#inProgress) this.#contentLoader.stop();
        return this.#contentLoader.load(routeEvent.toHref).then((data)=>{
            if (!isHtmlEl(data.contentElement)) {
                throw new ContentElementNotFoundError(this.options.contentSelector, 'in');
            }
            this.emit('load', data);
            return data;
        });
    }
    #replaceContent(newContent) {
        this.#replaceContentByHtml(newContent.contentElement?.outerHTML);
        this.emit('insert', newContent);
        if (newContent.documentTitle != null) setDocumentTitle(newContent.documentTitle);
    }
    #replaceContentByHtml(newHtml) {
        this.#contentEl.outerHTML = newHtml;
    }
    #prepareEls() {
        this.#setContentEl();
        if (!this.#contentEl) {
            throw new ContentElementNotFoundError(this.options.contentSelector, 'out');
        }
        const animatedEls = this.#getAnimatedEls();
        return {
            contentEl: this.#contentEl,
            animatedEls
        };
    }
    #prepareAnimationProcess({ phase, els }) {
        if (Array.isArray(this.#process)) {
            this.#process = getFilledProcessWithDefault(this.#process, this.options.animation[phase]);
        } else {
            this.#process = this.#formDefaultProcess(els);
        }
        this.#animation.process = this.#process;
    }
    async #animate() {
        return this.#animation.animate();
    }
    async #animatePhase(phase) {
        this.#phase = phase;
        const { animatedEls } = this.#prepareEls();
        this.emit('process', {
            animatedEls,
            phase: this.#phase
        });
        if (phase === 'in') this.#addAnimationInElsBeforeClass();
        this.#prepareAnimationProcess({
            phase,
            els: animatedEls
        });
        await this.#animate();
        this.#process = null;
    }
    async #animateInAndReset() {
        await this.#animatePhase('in');
        this.#animation.clearImmediate();
    }
    async #animateOut() {
        await this.#animatePhase('out');
    }
    #addAnimationInElsBeforeClass() {
        if (!this.#process) return;
        traverse(this.#process, ({ animation })=>{
            if (!isHtmlEl(animation?.el)) return;
            this.#addAnimationInElBeforeClass(animation.el);
        });
    }
    async #animateOutAndLoadContent(routeEvent) {
        const data = await Promise.allSettled([
            this.#loadContent(routeEvent),
            this.#animateOut()
        ]);
        if (data[0].status === 'rejected') {
            throw data[0].reason;
        } else if (data[1].status === 'rejected') {
            throw data[1].reason;
        }
        const loadedData = data[0].value;
        return loadedData;
    }
    #emitError(error) {
        this.emit('error', error);
    }
    #onRouteError = (error)=>{
        if (!this.#inProgress) {
            this.#emitError(error);
            this.#inProgress = false;
        }
    };
    #handleError(error) {
        this.#emitError(error);
        if (error instanceof RequestError && error.response?.status === 404) {
            this.#router.goBack();
        }
        location.reload();
    }
    #onRouteAction = async (routeEvent)=>{
        if (this.#inProgress) return;
        try {
            this.#inProgress = true;
            this.emit('action', routeEvent);
            const loadedData = await this.#animateOutAndLoadContent(routeEvent);
            this.#replaceContent(loadedData);
            await this.#animateInAndReset();
            this.emit('complete');
        } catch (error) {
            this.#handleError(error);
        } finally{
            this.#inProgress = false;
        }
    };
}

export { AnimationError, ContentElementNotFoundError, HrefNotFoundError, RequestError, RouteTransition as default };
//# sourceMappingURL=index.js.map
