/*
 * @Author: your name
 * @Date: 2021-06-12 19:38:01
 * @LastEditTime: 2021-06-12 19:39:00
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \Vue-SourceCode-Learing\vue\src\core\index.js
 */
import Vue from './instance/index';
import { initGlobalAPI } from './global-api/index';
import { isServerRendering } from 'core/util/env';
import { FunctionalRenderContext } from 'core/vdom/create-functional-component';

// 往Vue上挂载了一些全局api和静态属性 set nextTick等 全局config 组件也是一个Vue 实例
initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering,
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get() {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext;
  },
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext,
});

Vue.version = '__VERSION__';

export default Vue;
