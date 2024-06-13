"use strict";(self.webpackChunkroute_transition_demo=self.webpackChunkroute_transition_demo||[]).push([[792],{830:function(t,e,n){n.r(e);class s{#t;constructor(){this.#t={}}emit(t,e){this.#t[t]&&this.#t[t].forEach((t=>{t(e)}))}on(t,e){this.#t[t]||(this.#t[t]=[]),this.#t[t].push(e)}off(t,e){if(t)if(e||void 0===this.#t[t]){if(void 0!==this.#t[t]&&e instanceof Function){const n=this.#t[t].indexOf(e);n>-1&&this.#t[t].splice(n,1)}}else this.#t[t]=[];else this.#t={}}}function i(t){const e=t.querySelector("title")?.textContent;return null==e?null:e}function r(t){return t instanceof HTMLElement}function o(t){let e;if("number"!=typeof t&&t?.min&&t?.max){e=function(t,e){return Math.random()*(e-t)+t}(t.min,t.max)}else"number"==typeof t&&(e=t);return e}function a(t,e=0){const n=10**e;return Math.round(t*n)/n}class l extends Error{element;animationClass;constructor(t,e,n){super(`${t}\n  class: ${n}`),this.name=this.constructor.name,this.element=e,this.animationClass=n}}function c(t,e){if(Array.isArray(t))for(const n of t)if(n?.animation)e({animation:n.animation});else if(Array.isArray(n?.all))for(const t of n.all)e({animation:t})}async function h(t){const e=t.getAnimations();if(!e.length)return Promise.resolve();const n=e.map((t=>async function(t){return new Promise((e=>{t.addEventListener("finish",(()=>{e()}),{once:!0})}))}(t)));return await Promise.all(n),Promise.resolve()}function u(t){return async function(t){return function(t,e){t.classList.add(e.class),null!=e.duration&&(t.style.setProperty("animation-duration",`${e.duration}ms`),t.style.setProperty("transition-duration",`${e.duration}ms`)),null!=e.delay&&(t.style.setProperty("animation-delay",`${e.delay}ms`),t.style.setProperty("transition-delay",`${e.delay}ms`))}(t.el,t),h(t.el)}(function(t){const e={class:t.class,el:t.el};return t.duration&&(e.duration=a(o(t.duration),3)),t.delay&&(e.delay=a(o(t.delay),3)),e}(t))}class m extends s{process;constructor(t){super(),this.process=t?.process}async#e(t){const e={el:t.el};try{const n=u(t);this.emit("animation-start",e),await n,this.emit("animation-end",e)}catch(e){throw new l(e?.message??e,t.el,t.class)}}async animate(){if(Array.isArray(this.process))for(const t of this.process)if(t?.animation&&r(t?.animation?.el))await this.#e(t.animation);else if(Array.isArray(t?.all)){const e=[];for(const n of t.all)r(n?.el)&&e.push(this.#e(n));await Promise.all(e)}}clearImmediate(){this.process&&c(this.process,(({animation:t})=>{var e,n,s;r(t?.el)&&(n=(e=t).el,s=e.class,n.classList.remove(s),n.style.setProperty("animation-duration",null),n.style.setProperty("animation-delay",null),n.style.setProperty("transition-duration",null),n.style.setProperty("transition-delay",null))}))}}const d=".rt-action-link",f={linkSelector:d,contentSelector:"#rt-content",animation:{elSelector:".rt-el-animation",in:{beforeClass:"rt-el-animation-before-in",class:"rt-el-animation-in"},out:{class:"rt-el-animation-out"}}};class p extends Error{element;selector;constructor(t,e){super("Href not found"),this.name=this.constructor.name,this.element=t,this.selector=e}}class y{#n=[];#s=-1;#i;constructor(t){this.#i=t?.maxLength||3}add(t){this.#n.push(t),this.#s++,this.#n.length>this.#i&&(this.#n.shift(),this.#s--)}get(t){return this.#n.at(t)??null}get current(){return this.#n[this.#s]}get length(){return this.#n.length}backward(){return this.#s<=0?null:(this.#s--,this.#n[this.#s])}forward(){return this.#s>=this.#n.length-1?null:(this.#s++,this.#n[this.#s])}clear(){this.#n=[],this.#s=-1}}class b extends s{linkSelector;#r;#o;#a;constructor(t){super(),this.linkSelector=t?.linkSelector||d,this.#o=this.#l.bind(this),this.#a=this.#c.bind(this),this.#r=new y,this.#r.add(window.location.href)}run(){this.#h()}destroy(){this.#u()}goBack(){const t=this.#r.backward();t&&history.pushState({},"",t)}#h(){document.addEventListener("click",this.#o),window.addEventListener("popstate",this.#a)}#u(){document.removeEventListener("click",this.#o),window.removeEventListener("popstate",this.#a)}#m(t){return!!this.linkSelector&&(!!t&&t.matches(this.linkSelector))}#c(t){this.#d({type:"popstate",nativeEvent:t,toHref:window.location.href,fromHref:this.#r.current})}#d(t){this.#r.add(t.toHref),this.emit("action",t)}#l(t){const e=t.target.closest(this.linkSelector);if(!this.#m(e))return;t.preventDefault();const n=e.getAttribute("href");if(n)history.pushState({},"",n),this.#d({type:"link-click",nativeEvent:t,target:e,toHref:n,fromHref:this.#r.current||window.location.href});else{const t=new p(e,this.linkSelector);this.emit("error",t)}}}class E extends Error{response;constructor(t){super(),this.name=this.constructor.name,this.response=t}}class w extends s{selector;#f;constructor(t){super(),this.selector=t.selector}stop(){this.#f&&this.#f.abort()}async#p(t){const e=await t.text(),n=document.createElement("html");n.innerHTML=e;return{contentElement:n.querySelector(`${this.selector}`),documentTitle:i(n)}}async load(t){try{this.#f=new AbortController;const e=await fetch(t,{signal:this.#f.signal});if(e.ok)return this.#p(e);throw new E(e)}finally{this.#f=null}}}class A extends Error{selector;phase;constructor(t,e){super(`Content not found by selector ${t} in phase ${e}`),this.name=this.constructor.name,this.selector=t,this.phase=e}}function k(t){return null!=t&&"Object"===t?.constructor?.name}function g(t){if(Array.isArray(t))return[...t];if(!k(t))return t;const e={};return Object.keys(t).forEach((n=>{e[n]=g(t?.[n])})),e}function C(t,e){if(!k(t))return;Object.keys(e).forEach((n=>{n in t?k(e[n])&&C(t[n],e[n]):t[n]=e[n]}))}function L(t){const e=g(t??{});return C(e,f),e}function S(t,e){return{el:t.el,class:t.class??e.class,duration:t.duration??e.duration,delay:t.delay??e.delay}}function v(t,e){const n=[];return t.forEach((t=>{if(t?.animation){const s=S(t.animation,e);n.push({animation:s})}else if(Array.isArray(t?.all)){const s=[];t.all.forEach((t=>{const n=S(t,e);s.push(n)})),n.push({all:s})}})),n}function P(t,e){if(!(t.includes("about")&&e.includes("feature")||t.includes("feature")&&e.includes("about")))return;const n=document.querySelector(".feature-item-brief, .feature-item-detail");n&&(requestAnimationFrame((()=>{scrollTo(0,0)})),n.classList.add("feature-item-fancy-animation"))}const x=new class extends s{options;#y;#b;#E;#w;#A;#k;#g;constructor(t){super(),this.options=L(t),this.#b=new b({linkSelector:this.options.linkSelector}),this.#E=new w({selector:this.options.contentSelector}),this.#w=new m}run(){this.#b.run(),this.#b.on("action",this.#C),this.#b.on("error",this.#L),this.#w.on("animation-start",this.#S)}destroy(){this.#b.off(),this.#b.destroy(),this.#E.off(),this.#w.off()}setProcess(t){Array.isArray(t)?this.#y=v(t,this.options.animation[this.#A]):this.#y=null}getPhase(){return this.#A}#v(){this.#k=document.querySelector(this.options.contentSelector)}#P(){return[...document.querySelectorAll(`${this.options.animation.elSelector}`)]}#x(t){return function({els:t,options:e,phase:n}){const s=[],i=[];return t.forEach((t=>{const s={el:t,class:e.animation[n].class,duration:e.animation[n].duration,delay:e.animation[n].delay};i.push(s)})),s.push({all:i}),s}({els:t,options:this.options,phase:this.#A})}#H(t){t.classList.add(this.options.animation.in.beforeClass)}#B(t){t.classList.remove(this.options.animation.in.beforeClass)}#S=t=>{r(t?.el)&&this.#B(t.el)};async#O(t){return this.#g&&this.#E.stop(),this.#E.load(t.toHref).then((t=>{if(!r(t.contentElement))throw new A(this.options.contentSelector,"in");return this.emit("load",t),t}))}#I(t){var e;this.#$(t.contentElement?.outerHTML),this.emit("insert",t),null!=t.documentTitle&&(e=t.documentTitle,document.title=e)}#$(t){this.#k.outerHTML=t}#R(){if(this.#v(),!this.#k)throw new A(this.options.contentSelector,"out");const t=this.#P();return{contentEl:this.#k,animatedEls:t}}#T({phase:t,els:e}){Array.isArray(this.#y)?this.#y=v(this.#y,this.options.animation[t]):this.#y=this.#x(e),this.#w.process=this.#y}async#q(){return this.#w.animate()}async#M(t){this.#A=t;const{animatedEls:e}=this.#R();this.emit("process",{animatedEls:e,phase:this.#A}),"in"===t&&this.#j(),this.#T({phase:t,els:e}),await this.#q(),this.#y=null}async#_(){await this.#M("in"),this.#w.clearImmediate()}async#D(){await this.#M("out")}#j(){this.#y&&c(this.#y,(({animation:t})=>{r(t?.el)&&this.#H(t.el)}))}async#F(t){const e=await Promise.allSettled([this.#O(t),this.#D()]);if("rejected"===e[0].status)throw e[0].reason;if("rejected"===e[1].status)throw e[1].reason;return e[0].value}#z(t){this.emit("error",t)}#L=t=>{this.#g||(this.#z(t),this.#g=!1)};#G(t){this.#z(t),t instanceof E&&404===t.response?.status&&this.#b.goBack(),location.reload()}#C=async t=>{if(!this.#g)try{this.#g=!0,this.emit("action",t);const e=await this.#F(t);this.#I(e),await this.#_(),this.emit("complete")}catch(t){this.#G(t)}finally{this.#g=!1}}}({linkSelector:".rt-action-link",contentSelector:"#rt-content",animation:{elSelector:".rt-el-animation",in:{class:"rt-el-animation-in",beforeClass:"rt-el-animation-before-in"},out:{class:"rt-el-animation-out"}}});let H,B;x.run(),x.on("action",(t=>{H=t.fromHref,B=t.toHref,P(H,B)})),x.on("process",(t=>{})),x.on("load",(t=>{})),x.on("insert",(t=>{P(H,B)})),x.on("complete",(t=>{!function(){const t=document.querySelector(".feature-item-brief, .feature-item-detail");t&&t.classList.remove("feature-item-fancy-animation")}()})),x.on("error",(t=>{}))}},function(t){var e;e=830,t(t.s=e)}]);