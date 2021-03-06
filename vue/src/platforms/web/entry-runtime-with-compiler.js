/* @flow */

import config from 'core/config';
import { warn, cached } from 'core/util/index';
import { mark, measure } from 'core/util/perf';

import Vue from './runtime/index';
import { query } from './util/index';
import { compileToFunctions } from './compiler/index';
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat';

const idToTemplate = cached(id => {
  const el = query(id);
  return el && el.innerHTML;
});

const mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (el?: string | Element, hydrating?: boolean): Component {
  el = el && query(el);

  /* istanbul ignore if */
  // 这个dom对象如果是 body 或者html 就不能挂载了 会覆盖
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' &&
      warn(`Do not mount Vue to <html> or <body> - mount to normal elements instead.`);
    return this;
  }

  const options = this.$options;
  // resolve template/el and convert to render function 没有render 会把templeate生成render,没有templeate,就会用el来生成template
  if (!options.render) {
    let template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(`Template element not found or is empty: ${options.template}`, this);
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this);
        }
        return this;
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile');
      }

      //利用compileToFunctions 方法来 编译 template
      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments,
        },
        this
      );
      // 带编译器的版本会 把template 编译成一个render函数，options就是 vm.$option
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end');
        measure(`vue ${this._name} compile`, 'compile', 'compile end');
      }
    }
  }
  // 编译完成后调用 原来保存在原型上的 $mount方法
  // el: 标识他要挂载的元素 hydrating: 服务端渲染有关,浏览器环境下不需要第二个参数
  return mount.call(this, el, hydrating);
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML(el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML;
  } else {
    const container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML;
  }
}

Vue.compile = compileToFunctions;

export default Vue;
