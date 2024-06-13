type SubscriberFunction = (...args: unknown[]) => unknown;
interface IEventObserver {
    emit(type: string, data?: object): void;
    on(type: string, subscriber: SubscriberFunction): void;
    off(type: string, subscriber: SubscriberFunction): void;
}
declare class EventObserver implements IEventObserver {
    #private;
    constructor();
    emit(type: string, data?: object): void;
    on(type: string, subscriber: SubscriberFunction): void;
    off(type?: string, subscriber?: SubscriberFunction): void;
}

type DeepRequired<T> = Required<{
    [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]>;
}>;
interface Range {
    min: number;
    max: number;
}

type AnimationTimeRandom = Range;
interface AnimationElBase {
    el: HTMLElement;
    duration?: AnimationTimeRandom | number;
    delay?: AnimationTimeRandom | number;
}
interface AnimationEl extends AnimationElBase {
    class: string;
}

type AnimationBaseOptions = Omit<AnimationEl, 'el' | 'duration' | 'delay'> & {
    duration?: AnimationTimeRandom | number;
    delay?: AnimationTimeRandom | number;
};
type AnimationOptions = Partial<AnimationBaseOptions>;
type AnimationInOptions = AnimationOptions & {
    beforeClass?: string;
};
type EntityAnimationOptions = {
    elSelector?: string;
    in?: AnimationInOptions;
    out?: AnimationOptions;
};
type RouteTransitionBaseOptions = {
    linkSelector?: string;
    contentSelector?: string;
};
type RouteTransitionOptions = {
    animation?: EntityAnimationOptions;
} & RouteTransitionBaseOptions;
type RouteTransitionOptionsWithDefaults = DeepRequired<RouteTransitionOptions>;
type AnimationPhase = 'in' | 'out';
type AnimationElOptions = Omit<Partial<AnimationEl>, 'el'> & {
    el: HTMLElement;
};
type AnimationsParallelOptions = Array<AnimationElOptions>;
type AnimationStepOptions = {
    animation?: AnimationElOptions;
    all?: AnimationsParallelOptions;
};
type AnimationProcessOptions = Array<AnimationStepOptions>;
interface IRouteTransition {
    /**
     * attach all required listeners
     */
    run(): void;
    /**
     * detach all required listeners
     */
    destroy(): void;
    setProcess(process?: AnimationProcessOptions): void;
    getPhase(): void;
}

declare class RouteTransition extends EventObserver implements IRouteTransition {
    #private;
    options: RouteTransitionOptionsWithDefaults;
    constructor(options?: RouteTransitionOptions);
    run(): void;
    destroy(): void;
    setProcess(process?: AnimationProcessOptions): void;
    getPhase(): AnimationPhase;
}

declare class AnimationError extends Error {
    element: HTMLElement;
    animationClass: string;
    constructor(message: string, element: HTMLElement, animationClass: string);
}

declare class RequestError extends Error {
    response?: Response;
    constructor(response: Response);
}

declare class HrefNotFoundError extends Error {
    element: HTMLElement;
    selector: string;
    constructor(element: HTMLElement, selector: string);
}

declare class ContentElementNotFoundError extends Error {
    selector: string;
    phase: AnimationPhase;
    constructor(selector: string, phase: AnimationPhase);
}

export { AnimationError, ContentElementNotFoundError, HrefNotFoundError, RequestError, RouteTransition as default };
