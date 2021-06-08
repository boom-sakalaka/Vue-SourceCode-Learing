import { initMixin } from './init';
import { stateMixin } from './state';
import { renderMixin } from './render';
import { eventsMixin } from './events';
import { lifecycleMixin } from './lifecycle';
import { warn } from '../util/index';


// Vue 本身就是一个函数类
function Vue(options) {
  // Vue 必须要通过new 方法实例化，否则会检测到并报错 为什么不通过es6 类（class）方法 定义Vue,用es6 方法往原型上挂载方法比较难写 
  if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

// 把Vue的原型上挂载方法，分类存放
initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

export default Vue;
