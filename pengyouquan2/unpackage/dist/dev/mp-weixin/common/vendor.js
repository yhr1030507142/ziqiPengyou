(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],{

/***/ "./node_modules/@dcloudio/uni-mp-weixin/dist/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createPage = createPage;exports.createComponent = createComponent;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ "./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mpvue/index.js"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var SYNC_API_RE = /requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name);
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {params[_key - 1] = arguments[_key];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return api.apply(void 0, [options].concat(params));
    }
    return handlePromise(new Promise(function (resolve, reject) {
      api.apply(void 0, [Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      Promise.prototype.finally = function (callback) {
        var promise = this.constructor;
        return this.then(
        function (value) {return promise.resolve(callback()).then(function () {return value;});},
        function (reason) {return promise.resolve(callback()).then(function () {
            throw reason;
          });});

      };
    }));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var protocols = {};

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.includes(key)) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var returnValue = wx[options.name || methodName](arg1, arg2);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  getProvider: getProvider });




var api = /*#__PURE__*/Object.freeze({});



var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {args[_key2 - 1] = arguments[_key2];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var name = 'onLoad';
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {args[_key3] = arguments[_key3];}
      return oldHook.apply(this, args);
    };
  }
  return MPPage(options);
};

var behavior = Behavior({
  created: function created() {
    initTriggerEvent(this);
  } });


Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  (options.behaviors || (options.behaviors = [])).unshift(behavior);
  return MPComponent(options);
};

var MOCKS = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__', '__webviewId__'];

function initMocks(vm) {
  var mpInstance = vm.$mp[vm.mpType];
  MOCKS.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function initHooks(mpOptions, hooks) {
  hooks.forEach(function (hook) {
    mpOptions[hook] = function (args) {
      return this.$vm.__call_hook(hook, args);
    };
  });
}

function getData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function getProperties(props) {
  var properties = {
    vueSlots: { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } } };


  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }
        properties[key] = {
          type: PROP_TYPES.includes(opts.type) ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        properties[key] = {
          type: PROP_TYPES.includes(opts) ? opts : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  // TODO 又得兼容 mpvue 的 mp 对象
  event.mp = event;

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                                  *[
                                                  *    ['data.items', 'data.id', item.data.id],
                                                  *    ['metas', 'id', meta.id]
                                                  *],
                                                  *[
                                                  *    ['data.items', 'data.id', item.data.id],
                                                  *    ['metas', 'id', meta.id]
                                                  *],
                                                  *'test'
                                                  */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          extraObj['$' + index] = vm.__get_value(dataPath);
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var eventOpts = (event.currentTarget || event.target).dataset.eventOpts;
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;
  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && eventType === type) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handler = _this.$vm[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          handler.apply(_this.$vm, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName));

        }
      });
    }
  });
}

function initRefs(vm) {
  var mpInstance = vm.$mp[vm.mpType];
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

var hooks = [
'onHide',
'onError',
'onPageNotFound',
'onUniNViewMessage'];


function initVm(vm) {
  if (this.$vm) {// 百度竟然 onShow 在 onLaunch 之前？
    return;
  }
  {
    if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
      console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
    }
  }

  this.$vm = vm;

  this.$vm.$mp = {
    app: this };

}

function createApp(vm) {
  // 外部初始化时 Vue 还未初始化，放到 createApp 内部初始化 mixin
  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }
      this.mpType = this.$options.mpType;
      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        {// 头条的 selectComponent 竟然是异步的
          initRefs(this);
        }
        initMocks(this);
      }
    },
    created: function created() {// 处理 injections
      this.__init_injections(this);
      this.__init_provide(this);
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      initVm.call(this, vm);

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted');

      this.$vm.__call_hook('onLaunch', args);
    },
    onShow: function onShow(args) {
      initVm.call(this, vm);

      this.$vm.__call_hook('onShow', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};

  initHooks(appOptions, hooks); // 延迟执行，因为 App 的注册在 main.js 之前，可能导致生命周期内 Vue 原型上开发者注册的属性无法访问

  App(appOptions);

  return vm;
}

function triggerLink(mpInstance, vueOptions) {
  mpInstance.triggerEvent('__l', mpInstance.$vm || vueOptions, {
    bubbles: true,
    composed: true });

}

function handleLink(event) {
  if (event.detail.$mp) {// vm
    if (!event.detail.$parent) {
      event.detail.$parent = this.$vm;
      event.detail.$parent.$children.push(event.detail);

      event.detail.$root = this.$vm.$root;
    }
  } else {// vueOptions
    if (!event.detail.parent) {
      event.detail.parent = this.$vm;
    }
  }
}

var hooks$1 = [
'onShow',
'onHide',
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap',
'onBackPress',
'onNavigationBarButtonTap',
'onNavigationBarSearchInputChanged',
'onNavigationBarSearchInputConfirmed',
'onNavigationBarSearchInputClicked'];


function initVm$1(VueComponent) {// 百度的 onLoad 触发在 attached 之前
  if (this.$vm) {
    return;
  }

  this.$vm = new VueComponent({
    mpType: 'page',
    mpInstance: this });


  this.$vm.__call_hook('created');
  this.$vm.$mount();
}

function createPage(vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = _vue.default.extend(vueOptions);
  }
  var pageOptions = {
    options: {
      multipleSlots: true,
      addGlobalClass: true },

    data: getData(vueOptions, _vue.default.prototype),
    lifetimes: { // 当页面作为组件时
      attached: function attached() {
        initVm$1.call(this, VueComponent);
      },
      ready: function ready() {
        this.$vm.__call_hook('beforeMount');
        this.$vm._isMounted = true;
        this.$vm.__call_hook('mounted');
        this.$vm.__call_hook('onReady');
      },
      detached: function detached() {
        this.$vm.$destroy();
      } },

    methods: { // 作为页面时
      onLoad: function onLoad(args) {
        initVm$1.call(this, VueComponent);
        this.$vm.$mp.query = args; // 又要兼容 mpvue
        this.$vm.__call_hook('onLoad', args); // 开发者可能会在 onLoad 时赋值，提前到 mount 之前
      },
      onUnload: function onUnload() {
        this.$vm.__call_hook('onUnload');
      },
      __e: handleEvent,
      __l: handleLink } };



  initHooks(pageOptions.methods, hooks$1);

  return Component(pageOptions);
}

function initVm$2(VueComponent) {
  if (this.$vm) {
    return;
  }

  var options = {
    mpType: 'component',
    mpInstance: this,
    propsData: this.properties };

  // 初始化 vue 实例
  this.$vm = new VueComponent(options);

  // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
  var vueSlots = this.properties.vueSlots;
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    this.$vm.$scopedSlots = this.$vm.$slots = $slots;
  }
  // 性能优先，mount 提前到 attached 中，保证组件首次渲染数据被合并
  // 导致与标准 Vue 的差异，data 和 computed 中不能使用$parent，provide等组件属性
  this.$vm.$mount();
}

function createComponent(vueOptions) {
  vueOptions = vueOptions.default || vueOptions;

  var properties = getProperties(vueOptions.props);

  var VueComponent = _vue.default.extend(vueOptions);

  var componentOptions = {
    options: {
      multipleSlots: true,
      addGlobalClass: true },

    data: getData(vueOptions, _vue.default.prototype),
    properties: properties,
    lifetimes: {
      attached: function attached() {
        initVm$2.call(this, VueComponent);
      },
      ready: function ready() {
        initVm$2.call(this, VueComponent); // 目前发现部分情况小程序 attached 不触发
        triggerLink(this); // 处理 parent,children

        // 补充生命周期
        this.$vm.__call_hook('created');
        this.$vm.__call_hook('beforeMount');
        this.$vm._isMounted = true;
        this.$vm.__call_hook('mounted');
        this.$vm.__call_hook('onReady');
      },
      detached: function detached() {
        this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __e: handleEvent,
      __l: handleLink } };



  return Component(componentOptions);
}

var uni = {};

if (typeof Proxy !== 'undefined') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (name === 'upx2px') {
        return upx2px;
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    } });

} else {
  uni.upx2px = upx2px;

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),

/***/ "./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mpvue-page-factory/index.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mpvue-page-factory/index.js ***!
  \****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mpvue/index.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);


function callHook$1(vm, hook, params) {
  var handlers = vm.$options[hook];
  if (hook === 'onError' && handlers) {
    handlers = [handlers];
  }
  if(typeof handlers === 'function'){
    handlers = [handlers]
  }

  var ret;
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
//      try {
        ret = handlers[i].call(vm, params);
//       } catch (e) {//fixed by xxxxxx
//         handleError(e, vm, (hook + " hook"));
//       }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }

  // for child
  if (vm.$children.length) {
    vm.$children.forEach(function (v) {
      return callHook$1(v, hook, params);
    });
  }

  return ret
}

function getRootVueVm(page) {
  return page.$vm.$root;
}

/* harmony default export */ __webpack_exports__["default"] = (function (App) {
  return {
    // 页面的初始数据
    data: {
      $root: {}
    },

    // mp lifecycle for vue
    // 生命周期函数--监听页面加载
    onLoad:function onLoad(query) {
      //页面加载的时候
      var app = new vue__WEBPACK_IMPORTED_MODULE_0___default.a(App);
      // 挂载Vue对象到page上
      this.$vm = app;
      var rootVueVM = app.$root;
      rootVueVM.__wxExparserNodeId__ = this.__wxExparserNodeId__//fixed by xxxxxx(createIntersectionObserver)
      rootVueVM.__wxWebviewId__ = this.__wxWebviewId__//fixed by xxxxxx(createIntersectionObserver)
      
      //初始化mp对象
      if (!rootVueVM.$mp) {
        rootVueVM.$mp = {};
      }
      var mp = rootVueVM.$mp;
      mp.mpType = 'page';
      mp.page = this;
      mp.query = query;
      mp.status = 'load';
      //mount 要在 mp.status = 'load';赋值之后，不然mount方法会重复添加微信Page
      //具体原因参考mpvue核心库源码，_initMP方法
      app.$mount();
    },

    handleProxy: function handleProxy(e) {
      var rootVueVM = getRootVueVm(this);
      return rootVueVM.$handleProxyWithVue(e)
    },

    // 生命周期函数--监听页面显示
    onShow:function onShow() {
      var rootVueVM = getRootVueVm(this);
      var mp = rootVueVM.$mp;
      mp.status = 'show';
      callHook$1(rootVueVM, 'onShow');
      //   // 只有页面需要 setData
      rootVueVM.$nextTick(function () {
        rootVueVM._initDataToMP();
      });
    },

    // 生命周期函数--监听页面初次渲染完成
    onReady:function onReady() {
      var rootVueVM = getRootVueVm(this);
      var mp = rootVueVM.$mp;
      mp.status = 'ready';
      callHook$1(rootVueVM, 'onReady');
    },

    // 生命周期函数--监听页面隐藏
    onHide: function onHide() {
      var rootVueVM = getRootVueVm(this);
      var mp = rootVueVM.$mp;
      mp.status = 'hide';
      callHook$1(rootVueVM, 'onHide');
    },

    // 生命周期函数--监听页面卸载
    onUnload: function onUnload() {
      var rootVueVM = getRootVueVm(this);
      callHook$1(rootVueVM, 'onUnload');
      rootVueVM.$destroy();
    },

    // 页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function onPullDownRefresh() {
      var rootVueVM = getRootVueVm(this);
      callHook$1(rootVueVM, 'onPullDownRefresh');
    },

    // 页面上拉触底事件的处理函数
    onReachBottom: function onReachBottom() {
      var rootVueVM = getRootVueVm(this);
      callHook$1(rootVueVM, 'onReachBottom');
    },

    // Do something when page scroll
    onPageScroll: function onPageScroll(options) {
      var rootVueVM = getRootVueVm(this);
      callHook$1(rootVueVM, 'onPageScroll', options);
    },

    // 当前是 tab 页时，点击 tab 时触发
    onTabItemTap: function onTabItemTap(options) {
      var rootVueVM = getRootVueVm(this);
      callHook$1(rootVueVM, 'onTabItemTap', options);
    },
		
    // // 用户点击右上角分享
    onShareAppMessage: App.onShareAppMessage ?
      function (options) {
        var rootVueVM = getRootVueVm(this);
        return callHook$1(rootVueVM, 'onShareAppMessage', options);
      } : null,

    //fixed by xxxxxx
    onNavigationBarButtonTap: function onNavigationBarButtonTap(options) {
        var rootVueVM = getRootVueVm(this);
    		callHook$1(rootVueVM, "onNavigationBarButtonTap", options)
    },
    onNavigationBarSearchInputChanged: function onNavigationBarSearchInputChanged(options) {
        var rootVueVM = getRootVueVm(this);
    		callHook$1(rootVueVM, "onNavigationBarSearchInputChanged", options)
    },
    onNavigationBarSearchInputConfirmed: function onNavigationBarSearchInputConfirmed(options) {
        var rootVueVM = getRootVueVm(this);
    		callHook$1(rootVueVM, "onNavigationBarSearchInputConfirmed", options)
    },
    onNavigationBarSearchInputClicked: function onNavigationBarSearchInputClicked(options) {
        var rootVueVM = getRootVueVm(this);
    		callHook$1(rootVueVM, "onNavigationBarSearchInputClicked", options)
    },
    onBackPress: function onBackPress(options) {
        var rootVueVM = getRootVueVm(this);
    		return callHook$1(rootVueVM, "onBackPress",options)
    },
		$getAppWebview:function (e) {
				return plus.webview.getWebviewById('' + this.__wxWebviewId__)
		}
  };
});


/***/ }),

/***/ "./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mpvue/index.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mpvue/index.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// fix env
try {
    if (!global) global = {}
    global.process = global.process || {}
    global.process.env = global.process.env || {}
    global.App = global.App || App
    global.Page = global.Page || Page
    global.Component = global.Component || Component
    global.getApp = global.getApp || getApp
} catch (e) {}

;(function(global, factory) {
     true
        ? (module.exports = factory())
        : undefined
})(this, function() {
    "use strict"

    //fixed by xxxxxx
    function calcDiff(holder, key, newObj, oldObj) {
        if (newObj === oldObj || newObj === undefined) {
            return
        }

        if (newObj == null || oldObj == null || typeof newObj !== typeof oldObj) {
            holder[key] = newObj
        } else if (Array.isArray(newObj) && Array.isArray(oldObj)) {
            if (newObj.length === oldObj.length) {
                for (var i = 0, len = newObj.length; i < len; ++i) {
                    calcDiff(holder, key + "[" + i + "]", newObj[i], oldObj[i])
                }
            } else {
                holder[key] = newObj
            }
        } else if (typeof newObj === "object" && typeof oldObj === "object") {
            var newKeys = Object.keys(newObj)
            var oldKeys = Object.keys(oldObj)

            if (newKeys.length !== oldKeys.length) {
                holder[key] = newObj
            } else {
                var allKeysSet = Object.create(null)
                for (var i = 0, len = newKeys.length; i < len; ++i) {
                    allKeysSet[newKeys[i]] = true
                    allKeysSet[oldKeys[i]] = true
                }
                if (Object.keys(allKeysSet).length !== newKeys.length) {
                    holder[key] = newObj
                } else {
                    for (var i = 0, len = newKeys.length; i < len; ++i) {
                        var k = newKeys[i]
                        calcDiff(holder, key + "." + k, newObj[k], oldObj[k])
                    }
                }
            }
        } else if (newObj !== oldObj) {
            holder[key] = newObj
        }
    }

    function diff(newObj, oldObj) {
        var keys = Object.keys(newObj)
        var diffResult = {}
        for (var i = 0, len = keys.length; i < len; ++i) {
            var k = keys[i]
            var oldKeyPath = k.split(".")
            var oldValue = oldObj[oldKeyPath[0]]
            for (var j = 1, jlen = oldKeyPath.length; j < jlen && oldValue !== undefined; ++j) {
                oldValue = oldValue[oldKeyPath[j]]
            }
            calcDiff(diffResult, k, newObj[k], oldValue)
        }
        return diffResult
    }

    /*  */

    // these helpers produces better vm code in JS engines due to their
    // explicitness and function inlining
    function isUndef(v) {
        return v === undefined || v === null
    }

    function isDef(v) {
        return v !== undefined && v !== null
    }

    function isTrue(v) {
        return v === true
    }

    function isFalse(v) {
        return v === false
    }

    /**
     * Check if value is primitive
     */
    function isPrimitive(value) {
        return typeof value === "string" || typeof value === "number"
    }

    /**
     * Quick object check - this is primarily used to tell
     * Objects from primitive values when we know the value
     * is a JSON-compliant type.
     */
    function isObject(obj) {
        return obj !== null && typeof obj === "object"
    }

    var _toString = Object.prototype.toString

    /**
     * Strict object type check. Only returns true
     * for plain JavaScript objects.
     */
    function isPlainObject(obj) {
        return _toString.call(obj) === "[object Object]"
    }

    function isRegExp(v) {
        return _toString.call(v) === "[object RegExp]"
    }

    /**
     * Check if val is a valid array index.
     */
    function isValidArrayIndex(val) {
        var n = parseFloat(val)
        return n >= 0 && Math.floor(n) === n && isFinite(val)
    }

    /**
     * Convert a value to a string that is actually rendered.
     */
    function toString(val) {
        return val == null
            ? ""
            : typeof val === "object"
                ? JSON.stringify(val, null, 2)
                : String(val)
    }

    /**
     * Convert a input value to a number for persistence.
     * If the conversion fails, return original string.
     */
    function toNumber(val) {
        var n = parseFloat(val)
        return isNaN(n) ? val : n
    }

    /**
     * Make a map and return a function for checking if a key
     * is in that map.
     */
    function makeMap(str, expectsLowerCase) {
        var map = Object.create(null)
        var list = str.split(",")
        for (var i = 0; i < list.length; i++) {
            map[list[i]] = true
        }
        return expectsLowerCase
            ? function(val) {
                  return map[val.toLowerCase()]
              }
            : function(val) {
                  return map[val]
              }
    }

    /**
     * Check if a tag is a built-in tag.
     */
    var isBuiltInTag = makeMap("slot,component", true)

    /**
     * Check if a attribute is a reserved attribute.
     */
    var isReservedAttribute = makeMap("key,ref,slot,is")

    /**
     * Remove an item from an array
     */
    function remove(arr, item) {
        if (arr.length) {
            var index = arr.indexOf(item)
            if (index > -1) {
                return arr.splice(index, 1)
            }
        }
    }

    /**
     * Check whether the object has the property.
     */
    var hasOwnProperty = Object.prototype.hasOwnProperty

    function hasOwn(obj, key) {
        return hasOwnProperty.call(obj, key)
    }

    /**
     * Create a cached version of a pure function.
     */
    function cached(fn) {
        var cache = Object.create(null)
        return function cachedFn(str) {
            var hit = cache[str]
            return hit || (cache[str] = fn(str))
        }
    }

    /**
     * Camelize a hyphen-delimited string.
     */
    var camelizeRE = /-(\w)/g
    var camelize = cached(function(str) {
        return str.replace(camelizeRE, function(_, c) {
            return c ? c.toUpperCase() : ""
        })
    })

    /**
     * Capitalize a string.
     */
    var capitalize = cached(function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    })

    /**
     * Hyphenate a camelCase string.
     */
    var hyphenateRE = /([^-])([A-Z])/g
    var hyphenate = cached(function(str) {
        return str
            .replace(hyphenateRE, "$1-$2")
            .replace(hyphenateRE, "$1-$2")
            .toLowerCase()
    })

    /**
     * Simple bind, faster than native
     */
    function bind(fn, ctx) {
        function boundFn(a) {
            var l = arguments.length
            return l ? (l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a)) : fn.call(ctx)
        }
        // record original fn length
        boundFn._length = fn.length
        return boundFn
    }

    /**
     * Convert an Array-like object to a real Array.
     */
    function toArray(list, start) {
        start = start || 0
        var i = list.length - start
        var ret = new Array(i)
        while (i--) {
            ret[i] = list[i + start]
        }
        return ret
    }

    /**
     * Mix properties into target object.
     */
    function extend(to, _from) {
        for (var key in _from) {
            to[key] = _from[key]
        }
        return to
    }

    /**
     * Merge an Array of Objects into a single Object.
     */
    function toObject(arr) {
        var res = {}
        for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
                extend(res, arr[i])
            }
        }
        return res
    }

    /**
     * Perform no operation.
     * Stubbing args to make Flow happy without leaving useless transpiled code
     * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
     */
    function noop(a, b, c) {}

    /**
     * Always return false.
     */
    var no = function(a, b, c) {
        return false
    }

    /**
     * Return same value
     */
    var identity = function(_) {
        return _
    }

    /**
     * Generate a static keys string from compiler modules.
     */

    /**
     * Check if two values are loosely equal - that is,
     * if they are plain objects, do they have the same shape?
     */
    function looseEqual(a, b) {
        var isObjectA = isObject(a)
        var isObjectB = isObject(b)
        if (isObjectA && isObjectB) {
            try {
                return JSON.stringify(a) === JSON.stringify(b)
            } catch (e) {
                // possible circular reference
                return a === b
            }
        } else if (!isObjectA && !isObjectB) {
            return String(a) === String(b)
        } else {
            return false
        }
    }

    function looseIndexOf(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (looseEqual(arr[i], val)) {
                return i
            }
        }
        return -1
    }

    /**
     * Ensure a function is called only once.
     */
    function once(fn) {
        var called = false
        return function() {
            if (!called) {
                called = true
                fn.apply(this, arguments)
            }
        }
    }

    var SSR_ATTR = "data-server-rendered"

    var ASSET_TYPES = ["component", "directive", "filter"]

    var LIFECYCLE_HOOKS = [
        "beforeCreate",
        "created",
        "beforeMount",
        "mounted",
        "beforeUpdate",
        "updated",
        "beforeDestroy",
        "destroyed",
        "activated",
        "deactivated",
        "onLaunch",
        "onLoad",
        "onShow",
        "onReady",
        "onHide",
        "onUnload",
        "onPullDownRefresh",
        "onReachBottom",
        "onShareAppMessage",
        "onPageScroll",
        "onTabItemTap",
        "attached",
        "ready",
        "moved",
        "detached",
        "onUniNViewMessage", //fixed by xxxxxx
        "onNavigationBarButtonTap", //fixed by xxxxxx
        "onBackPress",//fixed by xxxxxx
    ]

    /*  */

    var config = {
        /**
         * Option merge strategies (used in core/util/options)
         */
        optionMergeStrategies: Object.create(null),

        /**
         * Whether to suppress warnings.
         */
        silent: false,

        /**
         * Show production mode tip message on boot?
         */
        productionTip: "production" !== "production",

        /**
         * Whether to enable devtools
         */
        devtools: "production" !== "production",

        /**
         * Whether to record perf
         */
        performance: false,

        /**
         * Error handler for watcher errors
         */
        errorHandler: null,

        /**
         * Warn handler for watcher warns
         */
        warnHandler: null,

        /**
         * Ignore certain custom elements
         */
        ignoredElements: [],

        /**
         * Custom user key aliases for v-on
         */
        keyCodes: Object.create(null),

        /**
         * Check if a tag is reserved so that it cannot be registered as a
         * component. This is platform-dependent and may be overwritten.
         */
        isReservedTag: no,

        /**
         * Check if an attribute is reserved so that it cannot be used as a component
         * prop. This is platform-dependent and may be overwritten.
         */
        isReservedAttr: no,

        /**
         * Check if a tag is an unknown element.
         * Platform-dependent.
         */
        isUnknownElement: no,

        /**
         * Get the namespace of an element
         */
        getTagNamespace: noop,

        /**
         * Parse the real tag name for the specific platform.
         */
        parsePlatformTagName: identity,

        /**
         * Check if an attribute must be bound using property, e.g. value
         * Platform-dependent.
         */
        mustUseProp: no,

        /**
         * Exposed for legacy reasons
         */
        _lifecycleHooks: LIFECYCLE_HOOKS
    }

    /*  */

    var emptyObject = Object.freeze({})

    /**
     * Check if a string starts with $ or _
     */
    function isReserved(str) {
        var c = (str + "").charCodeAt(0)
        return c === 0x24 || c === 0x5f
    }

    /**
     * Define a property.
     */
    function def(obj, key, val, enumerable) {
        Object.defineProperty(obj, key, {
            value: val,
            enumerable: !!enumerable,
            writable: true,
            configurable: true
        })
    }

    /**
     * Parse simple path.
     */
    var bailRE = /[^\w.$]/

    function parsePath(path) {
        if (bailRE.test(path)) {
            return
        }
        var segments = path.split(".")
        return function(obj) {
            for (var i = 0; i < segments.length; i++) {
                if (!obj) {
                    return
                }
                obj = obj[segments[i]]
            }
            return obj
        }
    }

    /*  */

    var warn = noop

    var formatComponentName = null // work around flow check

    /*  */

    function handleError(err, vm, info) {
        if (config.errorHandler) {
            config.errorHandler.call(null, err, vm, info)
        } else {
            if (inBrowser && typeof console !== "undefined") {
                console.error(err)
            } else {
                throw err
            }
        }
    }

    /*  */

    // can we use __proto__?
    var hasProto = "__proto__" in {}

    // Browser environment sniffing
    var inBrowser = typeof window !== "undefined"
    var UA = ["mpvue-runtime"].join()
    var isIE = UA && /msie|trident/.test(UA)
    var isIE9 = UA && UA.indexOf("msie 9.0") > 0
    var isEdge = UA && UA.indexOf("edge/") > 0
    var isAndroid = UA && UA.indexOf("android") > 0
    var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA)
    var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge

    // Firefix has a "watch" function on Object.prototype...
    var nativeWatch = {}.watch

    var supportsPassive = false
    if (inBrowser) {
        try {
            var opts = {}
            Object.defineProperty(opts, "passive", {
                get: function get() {
                    /* istanbul ignore next */
                    supportsPassive = true
                }
            }) // https://github.com/facebook/flow/issues/285
            window.addEventListener("test-passive", null, opts)
        } catch (e) {}
    }

    // this needs to be lazy-evaled because vue may be required before
    // vue-server-renderer can set VUE_ENV
    var _isServer
    var isServerRendering = function() {
        if (_isServer === undefined) {
            /* istanbul ignore if */
            if (!inBrowser && typeof global !== "undefined") {
                // detect presence of vue-server-renderer and avoid
                // Webpack shimming the process
                _isServer = global["process"].env.VUE_ENV === "server"
            } else {
                _isServer = false
            }
        }
        return _isServer
    }

    // detect devtools
    var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__

    /* istanbul ignore next */
    function isNative(Ctor) {
        return typeof Ctor === "function" && /native code/.test(Ctor.toString())
    }

    var hasSymbol =
        typeof Symbol !== "undefined" &&
        isNative(Symbol) &&
        typeof Reflect !== "undefined" &&
        isNative(Reflect.ownKeys)

    /**
     * Defer a task to execute it asynchronously.
     */
    var nextTick = (function() {
        var callbacks = []
        var pending = false
        var timerFunc

        function nextTickHandler() {
            pending = false
            var copies = callbacks.slice(0)
            callbacks.length = 0
            for (var i = 0; i < copies.length; i++) {
                copies[i]()
            }
        }

        // the nextTick behavior leverages the microtask queue, which can be accessed
        // via either native Promise.then or MutationObserver.
        // MutationObserver has wider support, however it is seriously bugged in
        // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
        // completely stops working after triggering a few times... so, if native
        // Promise is available, we will use it:
        /* istanbul ignore if */
        if (typeof Promise !== "undefined" && isNative(Promise)) {
            var p = Promise.resolve()
            var logError = function(err) {
                console.error(err)
            }
            timerFunc = function() {
                p.then(nextTickHandler).catch(logError)
                // in problematic UIWebViews, Promise.then doesn't completely break, but
                // it can get stuck in a weird state where callbacks are pushed into the
                // microtask queue but the queue isn't being flushed, until the browser
                // needs to do some other work, e.g. handle a timer. Therefore we can
                // "force" the microtask queue to be flushed by adding an empty timer.
                if (isIOS) {
                    setTimeout(noop)
                }
            }
            // } else if (typeof MutationObserver !== 'undefined' && (
            //   isNative(MutationObserver) ||
            //   // PhantomJS and iOS 7.x
            //   MutationObserver.toString() === '[object MutationObserverConstructor]'
            // )) {
            //   // use MutationObserver where native Promise is not available,
            //   // e.g. PhantomJS IE11, iOS7, Android 4.4
            //   var counter = 1
            //   var observer = new MutationObserver(nextTickHandler)
            //   var textNode = document.createTextNode(String(counter))
            //   observer.observe(textNode, {
            //     characterData: true
            //   })
            //   timerFunc = () => {
            //     counter = (counter + 1) % 2
            //     textNode.data = String(counter)
            //   }
        } else {
            // fallback to setTimeout
            /* istanbul ignore next */
            timerFunc = function() {
                setTimeout(nextTickHandler, 0)
            }
        }

        return function queueNextTick(cb, ctx) {
            var _resolve
            callbacks.push(function() {
                if (cb) {
                    try {
                        cb.call(ctx)
                    } catch (e) {
                        handleError(e, ctx, "nextTick")
                    }
                } else if (_resolve) {
                    _resolve(ctx)
                }
            })
            if (!pending) {
                pending = true
                timerFunc()
            }
            if (!cb && typeof Promise !== "undefined") {
                return new Promise(function(resolve, reject) {
                    _resolve = resolve
                })
            }
        }
    })()

    var _Set
    /* istanbul ignore if */
    if (typeof Set !== "undefined" && isNative(Set)) {
        // use native Set when available.
        _Set = Set
    } else {
        // a non-standard Set polyfill that only works with primitive keys.
        _Set = (function() {
            function Set() {
                this.set = Object.create(null)
            }
            Set.prototype.has = function has(key) {
                return this.set[key] === true
            }
            Set.prototype.add = function add(key) {
                this.set[key] = true
            }
            Set.prototype.clear = function clear() {
                this.set = Object.create(null)
            }

            return Set
        })()
    }

    /*  */

    var uid$1 = 0

    /**
     * A dep is an observable that can have multiple
     * directives subscribing to it.
     */
    var Dep = function Dep() {
        this.id = uid$1++
        this.subs = []
    }

    Dep.prototype.addSub = function addSub(sub) {
        this.subs.push(sub)
    }

    Dep.prototype.removeSub = function removeSub(sub) {
        remove(this.subs, sub)
    }

    Dep.prototype.depend = function depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

    Dep.prototype.notify = function notify() {
        // stabilize the subscriber list first
        var subs = this.subs.slice()
        for (var i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
        }
    }

    // the current target watcher being evaluated.
    // this is globally unique because there could be only one
    // watcher being evaluated at any time.
    Dep.target = null
    var targetStack = []

    function pushTarget(_target) {
        if (Dep.target) {
            targetStack.push(Dep.target)
        }
        Dep.target = _target
    }

    function popTarget() {
        Dep.target = targetStack.pop()
    }

    /*
     * not type checking this file because flow doesn't play well with
     * dynamically accessing methods on Array prototype
     */

    var arrayProto = Array.prototype
    var arrayMethods = Object.create(arrayProto)
    ;["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach(function(method) {
        // cache original method
        var original = arrayProto[method]
        def(arrayMethods, method, function mutator() {
            var args = [],
                len = arguments.length
            while (len--) args[len] = arguments[len]

            var result = original.apply(this, args)
            var ob = this.__ob__
            var inserted
            switch (method) {
                case "push":
                case "unshift":
                    inserted = args
                    break
                case "splice":
                    inserted = args.slice(2)
                    break
            }
            if (inserted) {
                ob.observeArray(inserted)
            }
            // notify change
            ob.dep.notify()
            return result
        })
    })

    /*  */

    var arrayKeys = Object.getOwnPropertyNames(arrayMethods)

    /**
     * By default, when a reactive property is set, the new value is
     * also converted to become reactive. However when passing down props,
     * we don't want to force conversion because the value may be a nested value
     * under a frozen data structure. Converting it would defeat the optimization.
     */
    var observerState = {
        shouldConvert: true
    }

    /**
     * Observer class that are attached to each observed
     * object. Once attached, the observer converts target
     * object's property keys into getter/setters that
     * collect dependencies and dispatches updates.
     */
    var Observer = function Observer(value) {
        this.value = value
        this.dep = new Dep()
        this.vmCount = 0
        def(value, "__ob__", this)
        if (Array.isArray(value)) {
            var augment = hasProto ? protoAugment : copyAugment
            augment(value, arrayMethods, arrayKeys)
            this.observeArray(value)
        } else {
            this.walk(value)
        }
    }

    /**
     * Walk through each property and convert them into
     * getter/setters. This method should only be called when
     * value type is Object.
     */
    Observer.prototype.walk = function walk(obj) {
        var keys = Object.keys(obj)
        for (var i = 0; i < keys.length; i++) {
            defineReactive$$1(obj, keys[i], obj[keys[i]])
        }
    }

    /**
     * Observe a list of Array items.
     */
    Observer.prototype.observeArray = function observeArray(items) {
        for (var i = 0, l = items.length; i < l; i++) {
            observe(items[i])
        }
    }

    // helpers

    /**
     * Augment an target Object or Array by intercepting
     * the prototype chain using __proto__
     */
    function protoAugment(target, src, keys) {
        /* eslint-disable no-proto */
        target.__proto__ = src
        /* eslint-enable no-proto */
    }

    /**
     * Augment an target Object or Array by defining
     * hidden properties.
     */
    /* istanbul ignore next */
    function copyAugment(target, src, keys) {
        for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i]
            def(target, key, src[key])
        }
    }

    /**
     * Attempt to create an observer instance for a value,
     * returns the new observer if successfully observed,
     * or the existing observer if the value already has one.
     */
    function observe(value, asRootData) {
        if (!isObject(value)) {
            return
        }
        var ob
        if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
            ob = value.__ob__
        } else if (
            observerState.shouldConvert &&
            !isServerRendering() &&
            (Array.isArray(value) || isPlainObject(value)) &&
            Object.isExtensible(value) &&
            !value._isVue
        ) {
            ob = new Observer(value)
        }
        if (asRootData && ob) {
            ob.vmCount++
        }
        return ob
    }

    /**
     * Define a reactive property on an Object.
     */
    function defineReactive$$1(obj, key, val, customSetter, shallow) {
        var dep = new Dep()

        var property = Object.getOwnPropertyDescriptor(obj, key)
        if (property && property.configurable === false) {
            return
        }

        // cater for pre-defined getter/setters
        var getter = property && property.get
        var setter = property && property.set

        var childOb = !shallow && observe(val)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function reactiveGetter() {
                var value = getter ? getter.call(obj) : val
                if (Dep.target) {
                    dep.depend()
                    if (childOb) {
                        childOb.dep.depend()
                    }
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
                return value
            },
            set: function reactiveSetter(newVal) {
                var value = getter ? getter.call(obj) : val
                /* eslint-disable no-self-compare */
                if (newVal === value || (newVal !== newVal && value !== value)) {
                    return
                }
                /* eslint-enable no-self-compare */
                if (false) {}
                if (setter) {
                    setter.call(obj, newVal)
                } else {
                    val = newVal
                }
                childOb = !shallow && observe(newVal)
                dep.notify()
            }
        })
    }

    /**
     * Set a property on an object. Adds the new property and
     * triggers change notification if the property doesn't
     * already exist.
     */
    function set(target, key, val) {
        if (Array.isArray(target) && isValidArrayIndex(key)) {
            target.length = Math.max(target.length, key)
            target.splice(key, 1, val)
            return val
        }
        if (hasOwn(target, key)) {
            target[key] = val
            return val
        }
        var ob = target.__ob__
        if (target._isVue || (ob && ob.vmCount)) {
             false &&
                false
            return val
        }
        if (!ob) {
            target[key] = val
            return val
        }
        defineReactive$$1(ob.value, key, val)
        ob.dep.notify()
        return val
    }

    /**
     * Delete a property and trigger change if necessary.
     */
    function del(target, key) {
        if (Array.isArray(target) && isValidArrayIndex(key)) {
            target.splice(key, 1)
            return
        }
        var ob = target.__ob__
        if (target._isVue || (ob && ob.vmCount)) {
             false &&
                false
            return
        }
        if (!hasOwn(target, key)) {
            return
        }
        delete target[key]
        if (!ob) {
            return
        }
        ob.dep.notify()
    }

    /**
     * Collect dependencies on array elements when the array is touched, since
     * we cannot intercept array element access like property getters.
     */
    function dependArray(value) {
        for (var e = void 0, i = 0, l = value.length; i < l; i++) {
            e = value[i]
            e && e.__ob__ && e.__ob__.dep.depend()
            if (Array.isArray(e)) {
                dependArray(e)
            }
        }
    }

    /*  */

    /**
     * Option overwriting strategies are functions that handle
     * how to merge a parent option value and a child option
     * value into the final value.
     */
    var strats = config.optionMergeStrategies

    /**
     * Options with restrictions
     */
    /**
     * Helper that recursively merges two data objects together.
     */
    function mergeData(to, from) {
        if (!from) {
            return to
        }
        var key, toVal, fromVal
        var keys = Object.keys(from)
        for (var i = 0; i < keys.length; i++) {
            key = keys[i]
            toVal = to[key]
            fromVal = from[key]
            if (!hasOwn(to, key)) {
                set(to, key, fromVal)
            } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
                mergeData(toVal, fromVal)
            }
        }
        return to
    }

    /**
     * Data
     */
    function mergeDataOrFn(parentVal, childVal, vm) {
        if (!vm) {
            // in a Vue.extend merge, both should be functions
            if (!childVal) {
                return parentVal
            }
            if (!parentVal) {
                return childVal
            }
            // when parentVal & childVal are both present,
            // we need to return a function that returns the
            // merged result of both functions... no need to
            // check if parentVal is a function here because
            // it has to be a function to pass previous merges.
            return function mergedDataFn() {
                return mergeData(
                    typeof childVal === "function" ? childVal.call(this) : childVal,
                    parentVal.call(this)
                )
            }
        } else if (parentVal || childVal) {
            return function mergedInstanceDataFn() {
                // instance merge
                var instanceData = typeof childVal === "function" ? childVal.call(vm) : childVal
                var defaultData = typeof parentVal === "function" ? parentVal.call(vm) : undefined
                if (instanceData) {
                    return mergeData(instanceData, defaultData)
                } else {
                    return defaultData
                }
            }
        }
    }

    strats.data = function(parentVal, childVal, vm) {
        if (!vm) {
            if (childVal && typeof childVal !== "function") {
                 false &&
                    false

                return parentVal
            }
            return mergeDataOrFn.call(this, parentVal, childVal)
        }

        return mergeDataOrFn(parentVal, childVal, vm)
    }

    /**
     * Hooks and props are merged as arrays.
     */
    function mergeHook(parentVal, childVal) {
        return childVal
            ? parentVal
                ? parentVal.concat(childVal)
                : Array.isArray(childVal)
                    ? childVal
                    : [childVal]
            : parentVal
    }

    LIFECYCLE_HOOKS.forEach(function(hook) {
        strats[hook] = mergeHook
    })

    /**
     * Assets
     *
     * When a vm is present (instance creation), we need to do
     * a three-way merge between constructor options, instance
     * options and parent options.
     */
    function mergeAssets(parentVal, childVal) {
        var res = Object.create(parentVal || null)
        return childVal ? extend(res, childVal) : res
    }

    ASSET_TYPES.forEach(function(type) {
        strats[type + "s"] = mergeAssets
    })

    /**
     * Watchers.
     *
     * Watchers hashes should not overwrite one
     * another, so we merge them as arrays.
     */
    strats.watch = function(parentVal, childVal) {
        // work around Firefox's Object.prototype.watch...
        if (parentVal === nativeWatch) {
            parentVal = undefined
        }
        if (childVal === nativeWatch) {
            childVal = undefined
        }
        /* istanbul ignore if */
        if (!childVal) {
            return Object.create(parentVal || null)
        }
        if (!parentVal) {
            return childVal
        }
        var ret = {}
        extend(ret, parentVal)
        for (var key in childVal) {
            var parent = ret[key]
            var child = childVal[key]
            if (parent && !Array.isArray(parent)) {
                parent = [parent]
            }
            ret[key] = parent ? parent.concat(child) : Array.isArray(child) ? child : [child]
        }
        return ret
    }

    /**
     * Other object hashes.
     */
    strats.props = strats.methods = strats.inject = strats.computed = function(
        parentVal,
        childVal
    ) {
        if (!childVal) {
            return Object.create(parentVal || null)
        }
        if (!parentVal) {
            return childVal
        }
        var ret = Object.create(null)
        extend(ret, parentVal)
        extend(ret, childVal)
        return ret
    }
    strats.provide = mergeDataOrFn

    /**
     * Default strategy.
     */
    var defaultStrat = function(parentVal, childVal) {
        return childVal === undefined ? parentVal : childVal
    }

    /**
     * Ensure all props option syntax are normalized into the
     * Object-based format.
     */
    function normalizeProps(options) {
        var props = options.props
        if (!props) {
            return
        }
        var res = {}
        var i, val, name
        if (Array.isArray(props)) {
            i = props.length
            while (i--) {
                val = props[i]
                if (typeof val === "string") {
                    name = camelize(val)
                    res[name] = {
                        type: null
                    }
                } else {
                }
            }
        } else if (isPlainObject(props)) {
            for (var key in props) {
                val = props[key]
                name = camelize(key)
                res[name] = isPlainObject(val)
                    ? val
                    : {
                          type: val
                      }
            }
        }
        options.props = res
    }

    /**
     * Normalize all injections into Object-based format
     */
    function normalizeInject(options) {
        var inject = options.inject
        if (Array.isArray(inject)) {
            var normalized = (options.inject = {})
            for (var i = 0; i < inject.length; i++) {
                normalized[inject[i]] = inject[i]
            }
        }
    }

    /**
     * Normalize raw function directives into object format.
     */
    function normalizeDirectives(options) {
        var dirs = options.directives
        if (dirs) {
            for (var key in dirs) {
                var def = dirs[key]
                if (typeof def === "function") {
                    dirs[key] = {
                        bind: def,
                        update: def
                    }
                }
            }
        }
    }

    /**
     * Merge two option objects into a new one.
     * Core utility used in both instantiation and inheritance.
     */
    function mergeOptions(parent, child, vm) {
        if (typeof child === "function") {
            child = child.options
        }

        normalizeProps(child)
        normalizeInject(child)
        normalizeDirectives(child)
        var extendsFrom = child.extends
        if (extendsFrom) {
            parent = mergeOptions(parent, extendsFrom, vm)
        }
        if (child.mixins) {
            for (var i = 0, l = child.mixins.length; i < l; i++) {
                parent = mergeOptions(parent, child.mixins[i], vm)
            }
        }
        var options = {}
        var key
        for (key in parent) {
            mergeField(key)
        }
        for (key in child) {
            if (!hasOwn(parent, key)) {
                mergeField(key)
            }
        }

        function mergeField(key) {
            var strat = strats[key] || defaultStrat
            options[key] = strat(parent[key], child[key], vm, key)
        }
        return options
    }

    /**
     * Resolve an asset.
     * This function is used because child instances need access
     * to assets defined in its ancestor chain.
     */
    function resolveAsset(options, type, id, warnMissing) {
        /* istanbul ignore if */
        if (typeof id !== "string") {
            return
        }
        var assets = options[type]
        // check local registration variations first
        if (hasOwn(assets, id)) {
            return assets[id]
        }
        var camelizedId = camelize(id)
        if (hasOwn(assets, camelizedId)) {
            return assets[camelizedId]
        }
        var PascalCaseId = capitalize(camelizedId)
        if (hasOwn(assets, PascalCaseId)) {
            return assets[PascalCaseId]
        }
        // fallback to prototype chain
        var res = assets[id] || assets[camelizedId] || assets[PascalCaseId]
        if (false) {}
        return res
    }

    /*  */

    function validateProp(key, propOptions, propsData, vm) {
        var prop = propOptions[key]
        var absent = !hasOwn(propsData, key)
        var value = propsData[key]
        // handle boolean props
        if (isType(Boolean, prop.type)) {
            if (absent && !hasOwn(prop, "default")) {
                value = false
            } else if (!isType(String, prop.type) && (value === "" || value === hyphenate(key))) {
                value = true
            }
        }
        // check default value
        if (value === undefined) {
            value = getPropDefaultValue(vm, prop, key)
            // since the default value is a fresh copy,
            // make sure to observe it.
            var prevShouldConvert = observerState.shouldConvert
            observerState.shouldConvert = true
            observe(value)
            observerState.shouldConvert = prevShouldConvert
        }
        return value
    }

    /**
     * Get the default value of a prop.
     */
    function getPropDefaultValue(vm, prop, key) {
        // no default, return undefined
        if (!hasOwn(prop, "default")) {
            return undefined
        }
        var def = prop.default
        // warn against non-factory defaults for Object & Array
        if (false) {}
        // the raw prop value was also undefined from previous render,
        // return previous default value to avoid unnecessary watcher trigger
        if (
            vm &&
            vm.$options.propsData &&
            vm.$options.propsData[key] === undefined &&
            vm._props[key] !== undefined
        ) {
            return vm._props[key]
        }
        // call factory function for non-Function types
        // a value is Function if its prototype is function even across different execution context
        return typeof def === "function" && getType(prop.type) !== "Function" ? def.call(vm) : def
    }

    /**
     * Use function string name to check built-in types,
     * because a simple equality check will fail when running
     * across different vms / iframes.
     */
    function getType(fn) {
        var match = fn && fn.toString().match(/^\s*function (\w+)/)
        return match ? match[1] : ""
    }

    function isType(type, fn) {
        if (!Array.isArray(fn)) {
            return getType(fn) === getType(type)
        }
        for (var i = 0, len = fn.length; i < len; i++) {
            if (getType(fn[i]) === getType(type)) {
                return true
            }
        }
        /* istanbul ignore next */
        return false
    }

    /*  */

    /* not type checking this file because flow doesn't play well with Proxy */

    var mark
    var measure

    /*  */

    var VNode = function VNode(
        tag,
        data,
        children,
        text,
        elm,
        context,
        componentOptions,
        asyncFactory
    ) {
        this.tag = tag
        this.data = data
        this.children = children
        this.text = text
        this.elm = elm
        this.ns = undefined
        this.context = context
        this.functionalContext = undefined
        this.key = data && data.key
        this.componentOptions = componentOptions
        this.componentInstance = undefined
        this.parent = undefined
        this.raw = false
        this.isStatic = false
        this.isRootInsert = true
        this.isComment = false
        this.isCloned = false
        this.isOnce = false
        this.asyncFactory = asyncFactory
        this.asyncMeta = undefined
        this.isAsyncPlaceholder = false
    }

    var prototypeAccessors = {
        child: {}
    }

    // DEPRECATED: alias for componentInstance for backwards compat.
    /* istanbul ignore next */
    prototypeAccessors.child.get = function() {
        return this.componentInstance
    }

    Object.defineProperties(VNode.prototype, prototypeAccessors)

    var createEmptyVNode = function(text) {
        if (text === void 0) text = ""

        var node = new VNode()
        node.text = text
        node.isComment = true
        return node
    }

    function createTextVNode(val) {
        return new VNode(undefined, undefined, undefined, String(val))
    }

    // optimized shallow clone
    // used for static nodes and slot nodes because they may be reused across
    // multiple renders, cloning them avoids errors when DOM manipulations rely
    // on their elm reference.
    function cloneVNode(vnode) {
        var cloned = new VNode(
            vnode.tag,
            vnode.data,
            vnode.children,
            vnode.text,
            vnode.elm,
            vnode.context,
            vnode.componentOptions,
            vnode.asyncFactory
        )
        cloned.ns = vnode.ns
        cloned.isStatic = vnode.isStatic
        cloned.key = vnode.key
        cloned.isComment = vnode.isComment
        cloned.isCloned = true
        return cloned
    }

    function cloneVNodes(vnodes) {
        var len = vnodes.length
        var res = new Array(len)
        for (var i = 0; i < len; i++) {
            res[i] = cloneVNode(vnodes[i])
        }
        return res
    }

    /*  */

    var normalizeEvent = cached(function(name) {
        var passive = name.charAt(0) === "&"
        name = passive ? name.slice(1) : name
        var once$$1 = name.charAt(0) === "~" // Prefixed last, checked first
        name = once$$1 ? name.slice(1) : name
        var capture = name.charAt(0) === "!"
        name = capture ? name.slice(1) : name
        return {
            name: name,
            once: once$$1,
            capture: capture,
            passive: passive
        }
    })

    function createFnInvoker(fns) {
        function invoker() {
            var arguments$1 = arguments

            var fns = invoker.fns
            if (Array.isArray(fns)) {
                var cloned = fns.slice()
                for (var i = 0; i < cloned.length; i++) {
                    cloned[i].apply(null, arguments$1)
                }
            } else {
                // return handler return value for single handlers
                return fns.apply(null, arguments)
            }
        }
        invoker.fns = fns
        return invoker
    }

    function updateListeners(on, oldOn, add, remove$$1, vm) {
        var name, cur, old, event
        for (name in on) {
            cur = on[name]
            old = oldOn[name]
            event = normalizeEvent(name)
            if (isUndef(cur)) {
                 false &&
                    false
            } else if (isUndef(old)) {
                if (isUndef(cur.fns)) {
                    cur = on[name] = createFnInvoker(cur)
                }
                add(event.name, cur, event.once, event.capture, event.passive)
            } else if (cur !== old) {
                old.fns = cur
                on[name] = old
            }
        }
        for (name in oldOn) {
            if (isUndef(on[name])) {
                event = normalizeEvent(name)
                remove$$1(event.name, oldOn[name], event.capture)
            }
        }
    }

    /*  */

    /*  */

    function extractPropsFromVNodeData(data, Ctor, tag) {
        // we are only extracting raw values here.
        // validation and default values are handled in the child
        // component itself.
        var propOptions = Ctor.options.props
        if (isUndef(propOptions)) {
            return
        }
        var res = {}
        var attrs = data.attrs
        var props = data.props
        if (isDef(attrs) || isDef(props)) {
            for (var key in propOptions) {
                var altKey = hyphenate(key)
                checkProp(res, props, key, altKey, true) ||
                    checkProp(res, attrs, key, altKey, false)
            }
        }
        return res
    }

    function checkProp(res, hash, key, altKey, preserve) {
        if (isDef(hash)) {
            if (hasOwn(hash, key)) {
                res[key] = hash[key]
                if (!preserve) {
                    delete hash[key]
                }
                return true
            } else if (hasOwn(hash, altKey)) {
                res[key] = hash[altKey]
                if (!preserve) {
                    delete hash[altKey]
                }
                return true
            }
        }
        return false
    }

    /*  */

    // The template compiler attempts to minimize the need for normalization by
    // statically analyzing the template at compile time.
    //
    // For plain HTML markup, normalization can be completely skipped because the
    // generated render function is guaranteed to return Array<VNode>. There are
    // two cases where extra normalization is needed:

    // 1. When the children contains components - because a functional component
    // may return an Array instead of a single root. In this case, just a simple
    // normalization is needed - if any child is an Array, we flatten the whole
    // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
    // because functional components already normalize their own children.
    function simpleNormalizeChildren(children) {
        for (var i = 0; i < children.length; i++) {
            if (Array.isArray(children[i])) {
                return Array.prototype.concat.apply([], children)
            }
        }
        return children
    }

    // 2. When the children contains constructs that always generated nested Arrays,
    // e.g. <template>, <slot>, v-for, or when the children is provided by user
    // with hand-written render functions / JSX. In such cases a full normalization
    // is needed to cater to all possible types of children values.
    function normalizeChildren(children) {
        return isPrimitive(children)
            ? [createTextVNode(children)]
            : Array.isArray(children)
                ? normalizeArrayChildren(children)
                : undefined
    }

    function isTextNode(node) {
        return isDef(node) && isDef(node.text) && isFalse(node.isComment)
    }

    function normalizeArrayChildren(children, nestedIndex) {
        var res = []
        var i, c, last
        for (i = 0; i < children.length; i++) {
            c = children[i]
            if (isUndef(c) || typeof c === "boolean") {
                continue
            }
            last = res[res.length - 1]
            //  nested
            if (Array.isArray(c)) {
                res.push.apply(res, normalizeArrayChildren(c, (nestedIndex || "") + "_" + i))
            } else if (isPrimitive(c)) {
                if (isTextNode(last)) {
                    // merge adjacent text nodes
                    // this is necessary for SSR hydration because text nodes are
                    // essentially merged when rendered to HTML strings
                    last.text += String(c)
                } else if (c !== "") {
                    // convert primitive to vnode
                    res.push(createTextVNode(c))
                }
            } else {
                if (isTextNode(c) && isTextNode(last)) {
                    // merge adjacent text nodes
                    res[res.length - 1] = createTextVNode(last.text + c.text)
                } else {
                    // default key for nested array children (likely generated by v-for)
                    if (
                        isTrue(children._isVList) &&
                        isDef(c.tag) &&
                        isUndef(c.key) &&
                        isDef(nestedIndex)
                    ) {
                        c.key = "__vlist" + nestedIndex + "_" + i + "__"
                    }
                    res.push(c)
                }
            }
        }
        return res
    }

    /*  */

    function ensureCtor(comp, base) {
        if (comp.__esModule && comp.default) {
            comp = comp.default
        }
        return isObject(comp) ? base.extend(comp) : comp
    }

    function createAsyncPlaceholder(factory, data, context, children, tag) {
        var node = createEmptyVNode()
        node.asyncFactory = factory
        node.asyncMeta = {
            data: data,
            context: context,
            children: children,
            tag: tag
        }
        return node
    }

    function resolveAsyncComponent(factory, baseCtor, context) {
        if (isTrue(factory.error) && isDef(factory.errorComp)) {
            return factory.errorComp
        }

        if (isDef(factory.resolved)) {
            return factory.resolved
        }

        if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
            return factory.loadingComp
        }

        if (isDef(factory.contexts)) {
            // already pending
            factory.contexts.push(context)
        } else {
            var contexts = (factory.contexts = [context])
            var sync = true

            var forceRender = function() {
                for (var i = 0, l = contexts.length; i < l; i++) {
                    contexts[i].$forceUpdate()
                }
            }

            var resolve = once(function(res) {
                // cache resolved
                factory.resolved = ensureCtor(res, baseCtor)
                // invoke callbacks only if this is not a synchronous resolve
                // (async resolves are shimmed as synchronous during SSR)
                if (!sync) {
                    forceRender()
                }
            })

            var reject = once(function(reason) {
                 false &&
                    false
                if (isDef(factory.errorComp)) {
                    factory.error = true
                    forceRender()
                }
            })

            var res = factory(resolve, reject)

            if (isObject(res)) {
                if (typeof res.then === "function") {
                    // () => Promise
                    if (isUndef(factory.resolved)) {
                        res.then(resolve, reject)
                    }
                } else if (isDef(res.component) && typeof res.component.then === "function") {
                    res.component.then(resolve, reject)

                    if (isDef(res.error)) {
                        factory.errorComp = ensureCtor(res.error, baseCtor)
                    }

                    if (isDef(res.loading)) {
                        factory.loadingComp = ensureCtor(res.loading, baseCtor)
                        if (res.delay === 0) {
                            factory.loading = true
                        } else {
                            setTimeout(function() {
                                if (isUndef(factory.resolved) && isUndef(factory.error)) {
                                    factory.loading = true
                                    forceRender()
                                }
                            }, res.delay || 200)
                        }
                    }

                    if (isDef(res.timeout)) {
                        setTimeout(function() {
                            if (isUndef(factory.resolved)) {
                                reject(null)
                            }
                        }, res.timeout)
                    }
                }
            }

            sync = false
            // return in case resolved synchronously
            return factory.loading ? factory.loadingComp : factory.resolved
        }
    }

    /*  */

    function getFirstComponentChild(children) {
        if (Array.isArray(children)) {
            for (var i = 0; i < children.length; i++) {
                var c = children[i]
                if (isDef(c) && isDef(c.componentOptions)) {
                    return c
                }
            }
        }
    }

    /*  */

    /*  */

    function initEvents(vm) {
        vm._events = Object.create(null)
        vm._hasHookEvent = false
        // init parent attached events
        var listeners = vm.$options._parentListeners
        if (listeners) {
            updateComponentListeners(vm, listeners)
        }
    }

    var target

    function add(event, fn, once$$1) {
        if (once$$1) {
            target.$once(event, fn)
        } else {
            target.$on(event, fn)
        }
    }

    function remove$1(event, fn) {
        target.$off(event, fn)
    }

    function updateComponentListeners(vm, listeners, oldListeners) {
        target = vm
        updateListeners(listeners, oldListeners || {}, add, remove$1, vm)
    }

    function eventsMixin(Vue) {
        var hookRE = /^hook:/
        Vue.prototype.$on = function(event, fn) {
            var this$1 = this

            var vm = this
            if (Array.isArray(event)) {
                for (var i = 0, l = event.length; i < l; i++) {
                    this$1.$on(event[i], fn)
                }
            } else {
                ;(vm._events[event] || (vm._events[event] = [])).push(fn)
                // optimize hook:event cost by using a boolean flag marked at registration
                // instead of a hash lookup
                if (hookRE.test(event)) {
                    vm._hasHookEvent = true
                }
            }
            return vm
        }

        Vue.prototype.$once = function(event, fn) {
            var vm = this

            function on() {
                vm.$off(event, on)
                fn.apply(vm, arguments)
            }
            on.fn = fn
            vm.$on(event, on)
            return vm
        }

        Vue.prototype.$off = function(event, fn) {
            var this$1 = this

            var vm = this
            // all
            if (!arguments.length) {
                vm._events = Object.create(null)
                return vm
            }
            // array of events
            if (Array.isArray(event)) {
                for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
                    this$1.$off(event[i$1], fn)
                }
                return vm
            }
            // specific event
            var cbs = vm._events[event]
            if (!cbs) {
                return vm
            }
            if (arguments.length === 1) {
                vm._events[event] = null
                return vm
            }
            // specific handler
            var cb
            var i = cbs.length
            while (i--) {
                cb = cbs[i]
                if (cb === fn || cb.fn === fn) {
                    cbs.splice(i, 1)
                    break
                }
            }
            return vm
        }

        Vue.prototype.$emit = function(event) {
            var vm = this
            var cbs = vm._events[event]
            if (cbs) {
                cbs = cbs.length > 1 ? toArray(cbs) : cbs
                var args = toArray(arguments, 1)
                for (var i = 0, l = cbs.length; i < l; i++) {
                    try {
                        cbs[i].apply(vm, args)
                    } catch (e) {
                        handleError(e, vm, 'event handler for "' + event + '"')
                    }
                }
            }
            return vm
        }
    }

    /*  */

    /**
     * Runtime helper for resolving raw children VNodes into a slot object.
     */
    function resolveSlots(children, context) {
        var slots = {}
        if (!children) {
            return slots
        }
        var defaultSlot = []
        for (var i = 0, l = children.length; i < l; i++) {
            var child = children[i]
            // named slots should only be respected if the vnode was rendered in the
            // same context.
            if (
                (child.context === context || child.functionalContext === context) &&
                child.data &&
                child.data.slot != null
            ) {
                var name = child.data.slot
                var slot = slots[name] || (slots[name] = [])
                if (child.tag === "template") {
                    slot.push.apply(slot, child.children)
                } else {
                    slot.push(child)
                }
            } else {
                defaultSlot.push(child)
            }
        }
        // ignore whitespace
        if (!defaultSlot.every(isWhitespace)) {
            slots.default = defaultSlot
        }
        return slots
    }

    function isWhitespace(node) {
        return node.isComment || node.text === " "
    }

    function resolveScopedSlots(
        fns, // see flow/vnode
        res
    ) {
        res = res || {}
        for (var i = 0; i < fns.length; i++) {
            if (Array.isArray(fns[i])) {
                resolveScopedSlots(fns[i], res)
            } else {
                res[fns[i].key] = fns[i].fn
            }
        }
        return res
    }

    /*  */

    var activeInstance = null

    function initLifecycle(vm) {
        var options = vm.$options

        // locate first non-abstract parent
        var parent = options.parent
        if (parent && !options.abstract) {
            while (parent.$options.abstract && parent.$parent) {
                parent = parent.$parent
            }
            parent.$children.push(vm)
        }

        vm.$parent = parent
        vm.$root = parent ? parent.$root : vm

        vm.$children = []
        vm.$refs = {}

        vm._watcher = null
        vm._inactive = null
        vm._directInactive = false
        vm._isMounted = false
        vm._isDestroyed = false
        vm._isBeingDestroyed = false
    }

    function lifecycleMixin(Vue) {
        Vue.prototype._update = function(vnode, hydrating) {
            var vm = this
            if (vm._isMounted) {
                callHook(vm, "beforeUpdate")
            }
            var prevEl = vm.$el
            var prevVnode = vm._vnode
            var prevActiveInstance = activeInstance
            activeInstance = vm
            vm._vnode = vnode
            // Vue.prototype.__patch__ is injected in entry points
            // based on the rendering backend used.
            if (!prevVnode) {
                // initial render
                vm.$el = vm.__patch__(
                    vm.$el,
                    vnode,
                    hydrating,
                    false /* removeOnly */,
                    vm.$options._parentElm,
                    vm.$options._refElm
                )
                // no need for the ref nodes after initial patch
                // this prevents keeping a detached DOM tree in memory (#5851)
                vm.$options._parentElm = vm.$options._refElm = null
            } else {
                // updates
                vm.$el = vm.__patch__(prevVnode, vnode)
            }
            activeInstance = prevActiveInstance
            // update __vue__ reference
            if (prevEl) {
                prevEl.__vue__ = null
            }
            if (vm.$el) {
                vm.$el.__vue__ = vm
            }
            // if parent is an HOC, update its $el as well
            if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
                vm.$parent.$el = vm.$el
            }
            // updated hook is called by the scheduler to ensure that children are
            // updated in a parent's updated hook.
        }

        Vue.prototype.$forceUpdate = function() {
            var vm = this
            if (vm._watcher) {
                vm._watcher.update()
            }
        }

        Vue.prototype.$destroy = function() {
            var vm = this
            if (vm._isBeingDestroyed) {
                return
            }
            callHook(vm, "beforeDestroy")
            vm._isBeingDestroyed = true
            // remove self from parent
            var parent = vm.$parent
            if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
                remove(parent.$children, vm)
            }
            // teardown watchers
            if (vm._watcher) {
                vm._watcher.teardown()
            }
            var i = vm._watchers.length
            while (i--) {
                vm._watchers[i].teardown()
            }
            // remove reference from data ob
            // frozen object may not have observer.
            if (vm._data.__ob__) {
                vm._data.__ob__.vmCount--
            }
            // call the last hook...
            vm._isDestroyed = true
            // invoke destroy hooks on current rendered tree
            vm.__patch__(vm._vnode, null)
            // fire destroyed hook
            callHook(vm, "destroyed")
            // turn off all instance listeners.
            vm.$off()
            // remove __vue__ reference
            if (vm.$el) {
                vm.$el.__vue__ = null
            }
        }
    }

    function mountComponent(vm, el, hydrating) {
        vm.$el = el
        if (!vm.$options.render) {
            vm.$options.render = createEmptyVNode
        }
        callHook(vm, "beforeMount")

        var updateComponent
        /* istanbul ignore if */
        if (false) {} else {
            updateComponent = function() {
                vm._update(vm._render(), hydrating)
            }
        }

        vm._watcher = new Watcher(vm, updateComponent, noop)
        hydrating = false

        // manually mounted instance, call mounted on self
        // mounted is called for render-created child components in its inserted hook
        if (vm.$vnode == null) {
            vm._isMounted = true
            callHook(vm, "mounted")
        }
        return vm
    }

    function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
        var hasChildren = !!(
            renderChildren || // has new static slots
            vm.$options._renderChildren || // has old static slots
            parentVnode.data.scopedSlots || // has new scoped slots
            vm.$scopedSlots !== emptyObject
        ) // has old scoped slots

        vm.$options._parentVnode = parentVnode
        vm.$vnode = parentVnode // update vm's placeholder node without re-render

        if (vm._vnode) {
            // update child tree's parent
            vm._vnode.parent = parentVnode
        }
        vm.$options._renderChildren = renderChildren

        // update $attrs and $listensers hash
        // these are also reactive so they may trigger child update if the child
        // used them during render
        vm.$attrs = parentVnode.data && parentVnode.data.attrs
        vm.$listeners = listeners

        // update props
        if (propsData && vm.$options.props) {
            observerState.shouldConvert = false
            var props = vm._props
            var propKeys = vm.$options._propKeys || []
            for (var i = 0; i < propKeys.length; i++) {
                var key = propKeys[i]
                props[key] = validateProp(key, vm.$options.props, propsData, vm)
            }
            observerState.shouldConvert = true
            // keep a copy of raw propsData
            vm.$options.propsData = propsData
        }

        // update listeners
        if (listeners) {
            var oldListeners = vm.$options._parentListeners
            vm.$options._parentListeners = listeners
            updateComponentListeners(vm, listeners, oldListeners)
        }
        // resolve slots + force update if has children
        if (hasChildren) {
            vm.$slots = resolveSlots(renderChildren, parentVnode.context)
            vm.$forceUpdate()
        }
    }

    function isInInactiveTree(vm) {
        while (vm && (vm = vm.$parent)) {
            if (vm._inactive) {
                return true
            }
        }
        return false
    }

    function activateChildComponent(vm, direct) {
        if (direct) {
            vm._directInactive = false
            if (isInInactiveTree(vm)) {
                return
            }
        } else if (vm._directInactive) {
            return
        }
        if (vm._inactive || vm._inactive === null) {
            vm._inactive = false
            for (var i = 0; i < vm.$children.length; i++) {
                activateChildComponent(vm.$children[i])
            }
            callHook(vm, "activated")
        }
    }

    function deactivateChildComponent(vm, direct) {
        if (direct) {
            vm._directInactive = true
            if (isInInactiveTree(vm)) {
                return
            }
        }
        if (!vm._inactive) {
            vm._inactive = true
            for (var i = 0; i < vm.$children.length; i++) {
                deactivateChildComponent(vm.$children[i])
            }
            callHook(vm, "deactivated")
        }
    }

    function callHook(vm, hook) {
        var handlers = vm.$options[hook]
        if (handlers) {
            for (var i = 0, j = handlers.length; i < j; i++) {
                try {
                    handlers[i].call(vm)
                } catch (e) {
                    handleError(e, vm, hook + " hook")
                }
            }
        }
        if (vm._hasHookEvent) {
            vm.$emit("hook:" + hook)
        }
    }

    /*  */

    var MAX_UPDATE_COUNT = 100

    var queue = []
    var activatedChildren = []
    var has = {}
    var circular = {}
    var waiting = false
    var flushing = false
    var index = 0

    /**
     * Reset the scheduler's state.
     */
    function resetSchedulerState() {
        index = queue.length = activatedChildren.length = 0
        has = {}
        waiting = flushing = false
    }

    /**
     * Flush both queues and run the watchers.
     */
    function flushSchedulerQueue() {
        flushing = true
        var watcher, id

        // Sort queue before flush.
        // This ensures that:
        // 1. Components are updated from parent to child. (because parent is always
        //    created before the child)
        // 2. A component's user watchers are run before its render watcher (because
        //    user watchers are created before the render watcher)
        // 3. If a component is destroyed during a parent component's watcher run,
        //    its watchers can be skipped.
        queue.sort(function(a, b) {
            return a.id - b.id
        })

        // do not cache length because more watchers might be pushed
        // as we run existing watchers
        for (index = 0; index < queue.length; index++) {
            watcher = queue[index]
            id = watcher.id
            has[id] = null
            watcher.run()
            // in dev build, check and stop circular updates.
            if (false) {}
        }

        // keep copies of post queues before resetting state
        var activatedQueue = activatedChildren.slice()
        var updatedQueue = queue.slice()

        resetSchedulerState()

        // call component updated and activated hooks
        callActivatedHooks(activatedQueue)
        callUpdatedHooks(updatedQueue)

        // devtool hook
        /* istanbul ignore if */
        if (devtools && config.devtools) {
            devtools.emit("flush")
        }
    }

    function callUpdatedHooks(queue) {
        var i = queue.length
        while (i--) {
            var watcher = queue[i]
            var vm = watcher.vm
            if (vm._watcher === watcher && vm._isMounted) {
                callHook(vm, "updated")
            }
        }
    }

    /**
     * Queue a kept-alive component that was activated during patch.
     * The queue will be processed after the entire tree has been patched.
     */
    function queueActivatedComponent(vm) {
        // setting _inactive to false here so that a render function can
        // rely on checking whether it's in an inactive tree (e.g. router-view)
        vm._inactive = false
        activatedChildren.push(vm)
    }

    function callActivatedHooks(queue) {
        for (var i = 0; i < queue.length; i++) {
            queue[i]._inactive = true
            activateChildComponent(queue[i], true /* true */)
        }
    }

    /**
     * Push a watcher into the watcher queue.
     * Jobs with duplicate IDs will be skipped unless it's
     * pushed when the queue is being flushed.
     */
    function queueWatcher(watcher) {
        var id = watcher.id
        if (has[id] == null) {
            has[id] = true
            if (!flushing) {
                queue.push(watcher)
            } else {
                // if already flushing, splice the watcher based on its id
                // if already past its id, it will be run next immediately.
                var i = queue.length - 1
                while (i > index && queue[i].id > watcher.id) {
                    i--
                }
                queue.splice(i + 1, 0, watcher)
            }
            // queue the flush
            if (!waiting) {
                waiting = true
                nextTick(flushSchedulerQueue)
            }
        }
    }

    /*  */

    var uid$2 = 0

    /**
     * A watcher parses an expression, collects dependencies,
     * and fires callback when the expression value changes.
     * This is used for both the $watch() api and directives.
     */
    var Watcher = function Watcher(vm, expOrFn, cb, options) {
        this.vm = vm
        vm._watchers.push(this)
        // options
        if (options) {
            this.deep = !!options.deep
            this.user = !!options.user
            this.lazy = !!options.lazy
            this.sync = !!options.sync
        } else {
            this.deep = this.user = this.lazy = this.sync = false
        }
        this.cb = cb
        this.id = ++uid$2 // uid for batching
        this.active = true
        this.dirty = this.lazy // for lazy watchers
        this.deps = []
        this.newDeps = []
        this.depIds = new _Set()
        this.newDepIds = new _Set()
        this.expression = ""
        // parse expression for getter
        if (typeof expOrFn === "function") {
            this.getter = expOrFn
        } else {
            this.getter = parsePath(expOrFn)
            if (!this.getter) {
                this.getter = function() {}
                 false &&
                    false
            }
        }
        this.value = this.lazy ? undefined : this.get()
    }

    /**
     * Evaluate the getter, and re-collect dependencies.
     */
    Watcher.prototype.get = function get() {
        pushTarget(this)
        var value
        var vm = this.vm
        try {
            value = this.getter.call(vm, vm)
        } catch (e) {
            if (this.user) {
                handleError(e, vm, 'getter for watcher "' + this.expression + '"')
            } else {
                throw e
            }
        } finally {
            // "touch" every property so they are all tracked as
            // dependencies for deep watching
            if (this.deep) {
                traverse(value)
            }
            popTarget()
            this.cleanupDeps()
        }
        return value
    }

    /**
     * Add a dependency to this directive.
     */
    Watcher.prototype.addDep = function addDep(dep) {
        var id = dep.id
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id)
            this.newDeps.push(dep)
            if (!this.depIds.has(id)) {
                dep.addSub(this)
            }
        }
    }

    /**
     * Clean up for dependency collection.
     */
    Watcher.prototype.cleanupDeps = function cleanupDeps() {
        var this$1 = this

        var i = this.deps.length
        while (i--) {
            var dep = this$1.deps[i]
            if (!this$1.newDepIds.has(dep.id)) {
                dep.removeSub(this$1)
            }
        }
        var tmp = this.depIds
        this.depIds = this.newDepIds
        this.newDepIds = tmp
        this.newDepIds.clear()
        tmp = this.deps
        this.deps = this.newDeps
        this.newDeps = tmp
        this.newDeps.length = 0
    }

    /**
     * Subscriber interface.
     * Will be called when a dependency changes.
     */
    Watcher.prototype.update = function update() {
        /* istanbul ignore else */
        if (this.lazy) {
            this.dirty = true
        } else if (this.sync) {
            this.run()
        } else {
            queueWatcher(this)
        }
    }

    /**
     * Scheduler job interface.
     * Will be called by the scheduler.
     */
    Watcher.prototype.run = function run() {
        if (this.active) {
            var value = this.get()
            if (
                value !== this.value ||
                // Deep watchers and watchers on Object/Arrays should fire even
                // when the value is the same, because the value may
                // have mutated.
                isObject(value) ||
                this.deep
            ) {
                // set new value
                var oldValue = this.value
                this.value = value
                if (this.user) {
                    try {
                        this.cb.call(this.vm, value, oldValue)
                    } catch (e) {
                        handleError(e, this.vm, 'callback for watcher "' + this.expression + '"')
                    }
                } else {
                    this.cb.call(this.vm, value, oldValue)
                }
            }
        }
    }

    /**
     * Evaluate the value of the watcher.
     * This only gets called for lazy watchers.
     */
    Watcher.prototype.evaluate = function evaluate() {
        this.value = this.get()
        this.dirty = false
    }

    /**
     * Depend on all deps collected by this watcher.
     */
    Watcher.prototype.depend = function depend() {
        var this$1 = this

        var i = this.deps.length
        while (i--) {
            this$1.deps[i].depend()
        }
    }

    /**
     * Remove self from all dependencies' subscriber list.
     */
    Watcher.prototype.teardown = function teardown() {
        var this$1 = this

        if (this.active) {
            // remove self from vm's watcher list
            // this is a somewhat expensive operation so we skip it
            // if the vm is being destroyed.
            if (!this.vm._isBeingDestroyed) {
                remove(this.vm._watchers, this)
            }
            var i = this.deps.length
            while (i--) {
                this$1.deps[i].removeSub(this$1)
            }
            this.active = false
        }
    }

    /**
     * Recursively traverse an object to evoke all converted
     * getters, so that every nested property inside the object
     * is collected as a "deep" dependency.
     */
    var seenObjects = new _Set()

    function traverse(val) {
        seenObjects.clear()
        _traverse(val, seenObjects)
    }

    function _traverse(val, seen) {
        var i, keys
        var isA = Array.isArray(val)
        if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
            return
        }
        if (val.__ob__) {
            var depId = val.__ob__.dep.id
            if (seen.has(depId)) {
                return
            }
            seen.add(depId)
        }
        if (isA) {
            i = val.length
            while (i--) {
                _traverse(val[i], seen)
            }
        } else {
            keys = Object.keys(val)
            i = keys.length
            while (i--) {
                _traverse(val[keys[i]], seen)
            }
        }
    }

    /*  */

    var sharedPropertyDefinition = {
        enumerable: true,
        configurable: true,
        get: noop,
        set: noop
    }

    function proxy(target, sourceKey, key) {
        sharedPropertyDefinition.get = function proxyGetter() {
            return this[sourceKey][key]
        }
        sharedPropertyDefinition.set = function proxySetter(val) {
            this[sourceKey][key] = val
        }
        Object.defineProperty(target, key, sharedPropertyDefinition)
    }

    function initState(vm) {
        vm._watchers = []
        var opts = vm.$options
        if (opts.props) {
            initProps(vm, opts.props)
        }
        if (opts.methods) {
            initMethods(vm, opts.methods)
        }
        if (opts.data) {
            initData(vm)
        } else {
            observe((vm._data = {}), true /* asRootData */)
        }
        if (opts.computed) {
            initComputed(vm, opts.computed)
        }
        if (opts.watch && opts.watch !== nativeWatch) {
            initWatch(vm, opts.watch)
        }
    }

    function checkOptionType(vm, name) {
        var option = vm.$options[name]
        if (!isPlainObject(option)) {
            warn('component option "' + name + '" should be an object.', vm)
        }
    }

    function initProps(vm, propsOptions) {
        var propsData = vm.$options.propsData || {}
        var props = (vm._props = {})
        // cache prop keys so that future props updates can iterate using Array
        // instead of dynamic object key enumeration.
        var keys = (vm.$options._propKeys = [])
        var isRoot = !vm.$parent
        // root instance props should be converted
        observerState.shouldConvert = isRoot
        var loop = function(key) {
            keys.push(key)
            var value = validateProp(key, propsOptions, propsData, vm)
            /* istanbul ignore else */
            {
                defineReactive$$1(props, key, value)
            }
            // static props are already proxied on the component's prototype
            // during Vue.extend(). We only need to proxy props defined at
            // instantiation here.
            if (!(key in vm)) {
                proxy(vm, "_props", key)
            }
        }

        for (var key in propsOptions) loop(key)
        observerState.shouldConvert = true
    }

    function initData(vm) {
        var data = vm.$options.data
        data = vm._data = typeof data === "function" ? getData(data, vm) : data || {}
        if (!isPlainObject(data)) {
            data = {}
             false &&
                false
        }
        // proxy data on instance
        var keys = Object.keys(data)
        var props = vm.$options.props
        var methods = vm.$options.methods
        var i = keys.length
        while (i--) {
            var key = keys[i]
            if (props && hasOwn(props, key)) {
                 false &&
                    false
            } else if (!isReserved(key)) {
                proxy(vm, "_data", key)
            }
        }
        // observe data
        observe(data, true /* asRootData */)
    }

    function getData(data, vm) {
        try {
            return data.call(vm)
        } catch (e) {
            handleError(e, vm, "data()")
            return {}
        }
    }

    var computedWatcherOptions = {
        lazy: true
    }

    function initComputed(vm, computed) {
         false && false
        var watchers = (vm._computedWatchers = Object.create(null))

        for (var key in computed) {
            var userDef = computed[key]
            var getter = typeof userDef === "function" ? userDef : userDef.get
            watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions)

            // component-defined computed properties are already defined on the
            // component prototype. We only need to define computed properties defined
            // at instantiation here.
            if (!(key in vm)) {
                defineComputed(vm, key, userDef)
            } else {
            }
        }
    }

    function defineComputed(target, key, userDef) {
        if (typeof userDef === "function") {
            sharedPropertyDefinition.get = createComputedGetter(key)
            sharedPropertyDefinition.set = noop
        } else {
            sharedPropertyDefinition.get = userDef.get
                ? userDef.cache !== false
                    ? createComputedGetter(key)
                    : userDef.get
                : noop
            sharedPropertyDefinition.set = userDef.set ? userDef.set : noop
        }
        Object.defineProperty(target, key, sharedPropertyDefinition)
    }

    function createComputedGetter(key) {
        return function computedGetter() {
            var watcher = this._computedWatchers && this._computedWatchers[key]
            if (watcher) {
                if (watcher.dirty) {
                    watcher.evaluate()
                }
                if (Dep.target) {
                    watcher.depend()
                }
                return watcher.value
            }
        }
    }

    function initMethods(vm, methods) {
         false && false
        var props = vm.$options.props
        for (var key in methods) {
            vm[key] = methods[key] == null ? noop : bind(methods[key], vm)
        }
    }

    function initWatch(vm, watch) {
         false && false
        for (var key in watch) {
            var handler = watch[key]
            if (Array.isArray(handler)) {
                for (var i = 0; i < handler.length; i++) {
                    createWatcher(vm, key, handler[i])
                }
            } else {
                createWatcher(vm, key, handler)
            }
        }
    }

    function createWatcher(vm, keyOrFn, handler, options) {
        if (isPlainObject(handler)) {
            options = handler
            handler = handler.handler
        }
        if (typeof handler === "string") {
            handler = vm[handler]
        }
        return vm.$watch(keyOrFn, handler, options)
    }

    function stateMixin(Vue) {
        // flow somehow has problems with directly declared definition object
        // when using Object.defineProperty, so we have to procedurally build up
        // the object here.
        var dataDef = {}
        dataDef.get = function() {
            return this._data
        }
        var propsDef = {}
        propsDef.get = function() {
            return this._props
        }
        Object.defineProperty(Vue.prototype, "$data", dataDef)
        Object.defineProperty(Vue.prototype, "$props", propsDef)

        Vue.prototype.$set = set
        Vue.prototype.$delete = del

        Vue.prototype.$watch = function(expOrFn, cb, options) {
            var vm = this
            if (isPlainObject(cb)) {
                return createWatcher(vm, expOrFn, cb, options)
            }
            options = options || {}
            options.user = true
            var watcher = new Watcher(vm, expOrFn, cb, options)
            if (options.immediate) {
                cb.call(vm, watcher.value)
            }
            return function unwatchFn() {
                watcher.teardown()
            }
        }
    }

    /*  */

    function initProvide(vm) {
        var provide = vm.$options.provide
        if (provide) {
            vm._provided = typeof provide === "function" ? provide.call(vm) : provide
        }
    }

    function initInjections(vm) {
        var result = resolveInject(vm.$options.inject, vm)
        if (result) {
            observerState.shouldConvert = false
            Object.keys(result).forEach(function(key) {
                /* istanbul ignore else */
                {
                    defineReactive$$1(vm, key, result[key])
                }
            })
            observerState.shouldConvert = true
        }
    }

    function resolveInject(inject, vm) {
        if (inject) {
            // inject is :any because flow is not smart enough to figure out cached
            var result = Object.create(null)
            var keys = hasSymbol ? Reflect.ownKeys(inject) : Object.keys(inject)

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i]
                var provideKey = inject[key]
                var source = vm
                while (source) {
                    if (source._provided && provideKey in source._provided) {
                        result[key] = source._provided[provideKey]
                        break
                    }
                    source = source.$parent
                }
                if (false) {}
            }
            return result
        }
    }

    /*  */

    function createFunctionalComponent(Ctor, propsData, data, context, children) {
        var props = {}
        var propOptions = Ctor.options.props
        if (isDef(propOptions)) {
            for (var key in propOptions) {
                props[key] = validateProp(key, propOptions, propsData || {})
            }
        } else {
            if (isDef(data.attrs)) {
                mergeProps(props, data.attrs)
            }
            if (isDef(data.props)) {
                mergeProps(props, data.props)
            }
        }
        // ensure the createElement function in functional components
        // gets a unique context - this is necessary for correct named slot check
        var _context = Object.create(context)
        var h = function(a, b, c, d) {
            return createElement(_context, a, b, c, d, true)
        }
        var vnode = Ctor.options.render.call(null, h, {
            data: data,
            props: props,
            children: children,
            parent: context,
            listeners: data.on || {},
            injections: resolveInject(Ctor.options.inject, context),
            slots: function() {
                return resolveSlots(children, context)
            }
        })
        if (vnode instanceof VNode) {
            vnode.functionalContext = context
            vnode.functionalOptions = Ctor.options
            if (data.slot) {
                ;(vnode.data || (vnode.data = {})).slot = data.slot
            }
        }
        return vnode
    }

    function mergeProps(to, from) {
        for (var key in from) {
            to[camelize(key)] = from[key]
        }
    }

    /*  */

    // hooks to be invoked on component VNodes during patch
    var componentVNodeHooks = {
        init: function init(vnode, hydrating, parentElm, refElm) {
            if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
                var child = (vnode.componentInstance = createComponentInstanceForVnode(
                    vnode,
                    activeInstance,
                    parentElm,
                    refElm
                ))
                child.$mount(hydrating ? vnode.elm : undefined, hydrating)
            } else if (vnode.data.keepAlive) {
                // kept-alive components, treat as a patch
                var mountedNode = vnode // work around flow
                componentVNodeHooks.prepatch(mountedNode, mountedNode)
            }
        },

        prepatch: function prepatch(oldVnode, vnode) {
            var options = vnode.componentOptions
            var child = (vnode.componentInstance = oldVnode.componentInstance)
            updateChildComponent(
                child,
                options.propsData, // updated props
                options.listeners, // updated listeners
                vnode, // new parent vnode
                options.children // new children
            )
        },

        insert: function insert(vnode) {
            var context = vnode.context
            var componentInstance = vnode.componentInstance

            if (!componentInstance._isMounted) {
                componentInstance._isMounted = true
                callHook(componentInstance, "mounted")
            }
            if (vnode.data.keepAlive) {
                if (context._isMounted) {
                    // vue-router#1212
                    // During updates, a kept-alive component's child components may
                    // change, so directly walking the tree here may call activated hooks
                    // on incorrect children. Instead we push them into a queue which will
                    // be processed after the whole patch process ended.
                    queueActivatedComponent(componentInstance)
                } else {
                    activateChildComponent(componentInstance, true /* direct */)
                }
            }
        },

        destroy: function destroy(vnode) {
            var componentInstance = vnode.componentInstance
            if (!componentInstance._isDestroyed) {
                if (!vnode.data.keepAlive) {
                    componentInstance.$destroy()
                } else {
                    deactivateChildComponent(componentInstance, true /* direct */)
                }
            }
        }
    }

    var hooksToMerge = Object.keys(componentVNodeHooks)

    function createComponent(Ctor, data, context, children, tag) {
        if (isUndef(Ctor)) {
            return
        }

        var baseCtor = context.$options._base

        // plain options object: turn it into a constructor
        if (isObject(Ctor)) {
            Ctor = baseCtor.extend(Ctor)
        }

        // if at this stage it's not a constructor or an async component factory,
        // reject.
        if (typeof Ctor !== "function") {
            return
        }

        // async component
        var asyncFactory
        if (isUndef(Ctor.cid)) {
            asyncFactory = Ctor
            Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context)
            if (Ctor === undefined) {
                // return a placeholder node for async component, which is rendered
                // as a comment node but preserves all the raw information for the node.
                // the information will be used for async server-rendering and hydration.
                return createAsyncPlaceholder(asyncFactory, data, context, children, tag)
            }
        }

        data = data || {}

        // resolve constructor options in case global mixins are applied after
        // component constructor creation
        resolveConstructorOptions(Ctor)

        // transform component v-model data into props & events
        if (isDef(data.model)) {
            transformModel(Ctor.options, data)
        }

        // extract props
        var propsData = extractPropsFromVNodeData(data, Ctor, tag)

        // functional component
        if (isTrue(Ctor.options.functional)) {
            return createFunctionalComponent(Ctor, propsData, data, context, children)
        }

        // keep listeners
        var listeners = data.on

        if (isTrue(Ctor.options.abstract)) {
            // abstract components do not keep anything
            // other than props & listeners & slot

            // work around flow
            var slot = data.slot
            data = {}
            if (slot) {
                data.slot = slot
            }
        }

        // merge component management hooks onto the placeholder node
        mergeHooks(data)

        // return a placeholder vnode
        var name = Ctor.options.name || tag
        var vnode = new VNode(
            "vue-component-" + Ctor.cid + (name ? "-" + name : ""),
            data,
            undefined,
            undefined,
            undefined,
            context,
            {
                Ctor: Ctor,
                propsData: propsData,
                listeners: listeners,
                tag: tag,
                children: children
            },
            asyncFactory
        )
        return vnode
    }

    function createComponentInstanceForVnode(
        vnode, // we know it's MountedComponentVNode but flow doesn't
        parent, // activeInstance in lifecycle state
        parentElm,
        refElm
    ) {
        var vnodeComponentOptions = vnode.componentOptions
        var options = {
            _isComponent: true,
            parent: parent,
            propsData: vnodeComponentOptions.propsData,
            _componentTag: vnodeComponentOptions.tag,
            _parentVnode: vnode,
            _parentListeners: vnodeComponentOptions.listeners,
            _renderChildren: vnodeComponentOptions.children,
            _parentElm: parentElm || null,
            _refElm: refElm || null
        }
        // check inline-template render functions
        var inlineTemplate = vnode.data.inlineTemplate
        if (isDef(inlineTemplate)) {
            options.render = inlineTemplate.render
            options.staticRenderFns = inlineTemplate.staticRenderFns
        }
        return new vnodeComponentOptions.Ctor(options)
    }

    function mergeHooks(data) {
        if (!data.hook) {
            data.hook = {}
        }
        for (var i = 0; i < hooksToMerge.length; i++) {
            var key = hooksToMerge[i]
            var fromParent = data.hook[key]
            var ours = componentVNodeHooks[key]
            data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours
        }
    }

    function mergeHook$1(one, two) {
        return function(a, b, c, d) {
            one(a, b, c, d)
            two(a, b, c, d)
        }
    }

    // transform component v-model info (value and callback) into
    // prop and event handler respectively.
    function transformModel(options, data) {
        var prop = (options.model && options.model.prop) || "value"
        var event = (options.model && options.model.event) || "input"
        ;(data.props || (data.props = {}))[prop] = data.model.value
        var on = data.on || (data.on = {})
        if (isDef(on[event])) {
            on[event] = [data.model.callback].concat(on[event])
        } else {
            on[event] = data.model.callback
        }
    }

    /*  */

    var SIMPLE_NORMALIZE = 1
    var ALWAYS_NORMALIZE = 2

    // wrapper function for providing a more flexible interface
    // without getting yelled at by flow
    function createElement(context, tag, data, children, normalizationType, alwaysNormalize) {
        if (Array.isArray(data) || isPrimitive(data)) {
            normalizationType = children
            children = data
            data = undefined
        }
        if (isTrue(alwaysNormalize)) {
            normalizationType = ALWAYS_NORMALIZE
        }
        return _createElement(context, tag, data, children, normalizationType)
    }

    function _createElement(context, tag, data, children, normalizationType) {
        if (isDef(data) && isDef(data.__ob__)) {
             false &&
                false
            return createEmptyVNode()
        }
        // object syntax in v-bind
        if (isDef(data) && isDef(data.is)) {
            tag = data.is
        }
        if (!tag) {
            // in case of component :is set to falsy value
            return createEmptyVNode()
        }
        // warn against non-primitive key
        if (
            false
        ) {}
        // support single function children as default scoped slot
        if (Array.isArray(children) && typeof children[0] === "function") {
            data = data || {}
            data.scopedSlots = {
                default: children[0]
            }
            children.length = 0
        }
        if (normalizationType === ALWAYS_NORMALIZE) {
            children = normalizeChildren(children)
        } else if (normalizationType === SIMPLE_NORMALIZE) {
            children = simpleNormalizeChildren(children)
        }
        var vnode, ns
        if (typeof tag === "string") {
            var Ctor
            ns = config.getTagNamespace(tag)
            if (config.isReservedTag(tag)) {
                // platform built-in elements
                vnode = new VNode(
                    config.parsePlatformTagName(tag),
                    data,
                    children,
                    undefined,
                    undefined,
                    context
                )
            } else if (isDef((Ctor = resolveAsset(context.$options, "components", tag)))) {
                // component
                vnode = createComponent(Ctor, data, context, children, tag)
            } else {
                // unknown or unlisted namespaced elements
                // check at runtime because it may get assigned a namespace when its
                // parent normalizes children
                vnode = new VNode(tag, data, children, undefined, undefined, context)
            }
        } else {
            // direct component options / constructor
            vnode = createComponent(tag, data, context, children)
        }
        if (isDef(vnode)) {
            if (ns) {
                applyNS(vnode, ns)
            }
            return vnode
        } else {
            return createEmptyVNode()
        }
    }

    function applyNS(vnode, ns) {
        vnode.ns = ns
        if (vnode.tag === "foreignObject") {
            // use default namespace inside foreignObject
            return
        }
        if (isDef(vnode.children)) {
            for (var i = 0, l = vnode.children.length; i < l; i++) {
                var child = vnode.children[i]
                if (isDef(child.tag) && isUndef(child.ns)) {
                    applyNS(child, ns)
                }
            }
        }
    }

    /*  */

    /**
     * Runtime helper for rendering v-for lists.
     */
    function renderList(val, render) {
        var ret, i, l, keys, key
        if (Array.isArray(val) || typeof val === "string") {
            ret = new Array(val.length)
            for (i = 0, l = val.length; i < l; i++) {
                ret[i] = render(val[i], i)
            }
        } else if (typeof val === "number") {
            ret = new Array(val)
            for (i = 0; i < val; i++) {
                ret[i] = render(i + 1, i)
            }
        } else if (isObject(val)) {
            keys = Object.keys(val)
            ret = new Array(keys.length)
            for (i = 0, l = keys.length; i < l; i++) {
                key = keys[i]
                ret[i] = render(val[key], key, i)
            }
        }
        if (isDef(ret)) {
            ret._isVList = true
        }
        return ret
    }

    /*  */

    /**
     * Runtime helper for rendering <slot>
     */
    function renderSlot(name, fallback, props, bindObject) {
        var scopedSlotFn = this.$scopedSlots[name]
        if (scopedSlotFn) {
            // scoped slot
            props = props || {}
            if (bindObject) {
                props = extend(extend({}, bindObject), props)
            }
            return scopedSlotFn(props) || fallback
        } else {
            var slotNodes = this.$slots[name]
            // warn duplicate slot usage
            if (slotNodes && "production" !== "production") {
                slotNodes._rendered &&
                    warn(
                        'Duplicate presence of slot "' +
                            name +
                            '" found in the same render tree ' +
                            "- this will likely cause render errors.",
                        this
                    )
                slotNodes._rendered = true
            }
            return slotNodes || fallback
        }
    }

    /*  */

    /**
     * Runtime helper for resolving filters
     */
    function resolveFilter(id) {
        return resolveAsset(this.$options, "filters", id, true) || identity
    }

    /*  */

    /**
     * Runtime helper for checking keyCodes from config.
     */
    function checkKeyCodes(eventKeyCode, key, builtInAlias) {
        var keyCodes = config.keyCodes[key] || builtInAlias
        if (Array.isArray(keyCodes)) {
            return keyCodes.indexOf(eventKeyCode) === -1
        } else {
            return keyCodes !== eventKeyCode
        }
    }

    /*  */

    /**
     * Runtime helper for merging v-bind="object" into a VNode's data.
     */
    function bindObjectProps(data, tag, value, asProp, isSync) {
        if (value) {
            if (!isObject(value)) {
                 false &&
                    false
            } else {
                if (Array.isArray(value)) {
                    value = toObject(value)
                }
                var hash
                var loop = function(key) {
                    if (key === "class" || key === "style" || isReservedAttribute(key)) {
                        hash = data
                    } else {
                        var type = data.attrs && data.attrs.type
                        hash =
                            asProp || config.mustUseProp(tag, type, key)
                                ? data.domProps || (data.domProps = {})
                                : data.attrs || (data.attrs = {})
                    }
                    if (!(key in hash)) {
                        hash[key] = value[key]

                        if (isSync) {
                            var on = data.on || (data.on = {})
                            on["update:" + key] = function($event) {
                                value[key] = $event
                            }
                        }
                    }
                }

                for (var key in value) loop(key)
            }
        }
        return data
    }

    /*  */

    /**
     * Runtime helper for rendering static trees.
     */
    function renderStatic(index, isInFor) {
        var tree = this._staticTrees[index]
        // if has already-rendered static tree and not inside v-for,
        // we can reuse the same tree by doing a shallow clone.
        if (tree && !isInFor) {
            return Array.isArray(tree) ? cloneVNodes(tree) : cloneVNode(tree)
        }
        // otherwise, render a fresh tree.
        tree = this._staticTrees[index] = this.$options.staticRenderFns[index].call(
            this._renderProxy
        )
        markStatic(tree, "__static__" + index, false)
        return tree
    }

    /**
     * Runtime helper for v-once.
     * Effectively it means marking the node as static with a unique key.
     */
    function markOnce(tree, index, key) {
        markStatic(tree, "__once__" + index + (key ? "_" + key : ""), true)
        return tree
    }

    function markStatic(tree, key, isOnce) {
        if (Array.isArray(tree)) {
            for (var i = 0; i < tree.length; i++) {
                if (tree[i] && typeof tree[i] !== "string") {
                    markStaticNode(tree[i], key + "_" + i, isOnce)
                }
            }
        } else {
            markStaticNode(tree, key, isOnce)
        }
    }

    function markStaticNode(node, key, isOnce) {
        node.isStatic = true
        node.key = key
        node.isOnce = isOnce
    }

    /*  */

    function bindObjectListeners(data, value) {
        if (value) {
            if (!isPlainObject(value)) {
                 false &&
                    false
            } else {
                var on = (data.on = data.on ? extend({}, data.on) : {})
                for (var key in value) {
                    var existing = on[key]
                    var ours = value[key]
                    on[key] = existing ? [].concat(ours, existing) : ours
                }
            }
        }
        return data
    }

    /*  */

    function initRender(vm) {
        vm._vnode = null // the root of the child tree
        vm._staticTrees = null
        var parentVnode = (vm.$vnode = vm.$options._parentVnode) // the placeholder node in parent tree
        var renderContext = parentVnode && parentVnode.context
        vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext)
        vm.$scopedSlots = emptyObject
        // bind the createElement fn to this instance
        // so that we get proper render context inside it.
        // args order: tag, data, children, normalizationType, alwaysNormalize
        // internal version is used by render functions compiled from templates
        vm._c = function(a, b, c, d) {
            return createElement(vm, a, b, c, d, false)
        }
        // normalization is always applied for the public version, used in
        // user-written render functions.
        vm.$createElement = function(a, b, c, d) {
            return createElement(vm, a, b, c, d, true)
        }

        // $attrs & $listeners are exposed for easier HOC creation.
        // they need to be reactive so that HOCs using them are always updated
        var parentData = parentVnode && parentVnode.data
        /* istanbul ignore else */
        {
            defineReactive$$1(vm, "$attrs", parentData && parentData.attrs, null, true)
            defineReactive$$1(vm, "$listeners", parentData && parentData.on, null, true)
        }
    }

    function renderMixin(Vue) {
        Vue.prototype.$nextTick = function(fn) {
            return nextTick(fn, this)
        }

        Vue.prototype._render = function() {
            var vm = this
            var ref = vm.$options
            var render = ref.render
            var staticRenderFns = ref.staticRenderFns
            var _parentVnode = ref._parentVnode

            if (vm._isMounted) {
                // clone slot nodes on re-renders
                for (var key in vm.$slots) {
                    vm.$slots[key] = cloneVNodes(vm.$slots[key])
                }
            }

            vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject

            if (staticRenderFns && !vm._staticTrees) {
                vm._staticTrees = []
            }
            // set parent vnode. this allows render functions to have access
            // to the data on the placeholder node.
            vm.$vnode = _parentVnode
            // render self
            var vnode
            try {
                vnode = render.call(vm._renderProxy, vm.$createElement)
            } catch (e) {
                handleError(e, vm, "render function")
                // return error render result,
                // or previous vnode to prevent render error causing blank component
                /* istanbul ignore else */
                {
                    vnode = vm._vnode
                }
            }
            // return empty vnode in case the render function errored out
            if (!(vnode instanceof VNode)) {
                if (false) {}
                vnode = createEmptyVNode()
            }
            // set parent
            vnode.parent = _parentVnode
            return vnode
        }

        // internal render helpers.
        // these are exposed on the instance prototype to reduce generated render
        // code size.
        Vue.prototype._o = markOnce
        Vue.prototype._n = toNumber
        Vue.prototype._s = toString
        Vue.prototype._l = renderList
        Vue.prototype._t = renderSlot
        Vue.prototype._q = looseEqual
        Vue.prototype._i = looseIndexOf
        Vue.prototype._m = renderStatic
        Vue.prototype._f = resolveFilter
        Vue.prototype._k = checkKeyCodes
        Vue.prototype._b = bindObjectProps
        Vue.prototype._v = createTextVNode
        Vue.prototype._e = createEmptyVNode
        Vue.prototype._u = resolveScopedSlots
        Vue.prototype._g = bindObjectListeners
    }

    /*  */

    var uid = 0

    function initMixin(Vue) {
        Vue.prototype._init = function(options) {
            var vm = this
            // a uid
            vm._uid = uid++

            var startTag, endTag
            /* istanbul ignore if */
            if (false) {}

            // a flag to avoid this being observed
            vm._isVue = true
            // merge options
            if (options && options._isComponent) {
                // optimize internal component instantiation
                // since dynamic options merging is pretty slow, and none of the
                // internal component options needs special treatment.
                initInternalComponent(vm, options)
            } else {
                vm.$options = mergeOptions(
                    resolveConstructorOptions(vm.constructor),
                    options || {},
                    vm
                )
            }
            /* istanbul ignore else */
            {
                vm._renderProxy = vm
            }
            // expose real self
            vm._self = vm
            initLifecycle(vm)
            initEvents(vm)
            initRender(vm)
            callHook(vm, "beforeCreate")
            initInjections(vm) // resolve injections before data/props
            initState(vm)
            initProvide(vm) // resolve provide after data/props
            callHook(vm, "created")

            /* istanbul ignore if */
            if (false) {}

            if (vm.$options.el) {
                vm.$mount(vm.$options.el)
            }
        }
    }

    function initInternalComponent(vm, options) {
        var opts = (vm.$options = Object.create(vm.constructor.options))
        // doing this because it's faster than dynamic enumeration.
        opts.parent = options.parent
        opts.propsData = options.propsData
        opts._parentVnode = options._parentVnode
        opts._parentListeners = options._parentListeners
        opts._renderChildren = options._renderChildren
        opts._componentTag = options._componentTag
        opts._parentElm = options._parentElm
        opts._refElm = options._refElm
        if (options.render) {
            opts.render = options.render
            opts.staticRenderFns = options.staticRenderFns
        }
    }

    function resolveConstructorOptions(Ctor) {
        var options = Ctor.options
        if (Ctor.super) {
            var superOptions = resolveConstructorOptions(Ctor.super)
            var cachedSuperOptions = Ctor.superOptions
            if (superOptions !== cachedSuperOptions) {
                // super option changed,
                // need to resolve new options.
                Ctor.superOptions = superOptions
                // check if there are any late-modified/attached options (#4976)
                var modifiedOptions = resolveModifiedOptions(Ctor)
                // update base extend options
                if (modifiedOptions) {
                    extend(Ctor.extendOptions, modifiedOptions)
                }
                options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
                if (options.name) {
                    options.components[options.name] = Ctor
                }
            }
        }
        return options
    }

    function resolveModifiedOptions(Ctor) {
        var modified
        var latest = Ctor.options
        var extended = Ctor.extendOptions
        var sealed = Ctor.sealedOptions
        for (var key in latest) {
            if (latest[key] !== sealed[key]) {
                if (!modified) {
                    modified = {}
                }
                modified[key] = dedupe(latest[key], extended[key], sealed[key])
            }
        }
        return modified
    }

    function dedupe(latest, extended, sealed) {
        // compare latest and sealed to ensure lifecycle hooks won't be duplicated
        // between merges
        if (Array.isArray(latest)) {
            var res = []
            sealed = Array.isArray(sealed) ? sealed : [sealed]
            extended = Array.isArray(extended) ? extended : [extended]
            for (var i = 0; i < latest.length; i++) {
                // push original options and not sealed options to exclude duplicated options
                if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
                    res.push(latest[i])
                }
            }
            return res
        } else {
            return latest
        }
    }

    function Vue$3(options) {
        if (false) {}
        this._init(options)
    }

    initMixin(Vue$3)
    stateMixin(Vue$3)
    eventsMixin(Vue$3)
    lifecycleMixin(Vue$3)
    renderMixin(Vue$3)

    /*  */

    function initUse(Vue) {
        Vue.use = function(plugin) {
            var installedPlugins = this._installedPlugins || (this._installedPlugins = [])
            if (installedPlugins.indexOf(plugin) > -1) {
                return this
            }

            // additional parameters
            var args = toArray(arguments, 1)
            args.unshift(this)
            if (typeof plugin.install === "function") {
                plugin.install.apply(plugin, args)
            } else if (typeof plugin === "function") {
                plugin.apply(null, args)
            }
            installedPlugins.push(plugin)
            return this
        }
    }

    /*  */

    function initMixin$1(Vue) {
        Vue.mixin = function(mixin) {
            this.options = mergeOptions(this.options, mixin)
            return this
        }
    }

    /*  */

    function initExtend(Vue) {
        /**
         * Each instance constructor, including Vue, has a unique
         * cid. This enables us to create wrapped "child
         * constructors" for prototypal inheritance and cache them.
         */
        Vue.cid = 0
        var cid = 1

        /**
         * Class inheritance
         */
        Vue.extend = function(extendOptions) {
            extendOptions = extendOptions || {}
            var Super = this
            var SuperId = Super.cid
            var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
            if (cachedCtors[SuperId]) {
                return cachedCtors[SuperId]
            }

            var name = extendOptions.name || Super.options.name
            var Sub = function VueComponent(options) {
                this._init(options)
            }
            Sub.prototype = Object.create(Super.prototype)
            Sub.prototype.constructor = Sub
            Sub.cid = cid++
            Sub.options = mergeOptions(Super.options, extendOptions)
            Sub["super"] = Super

            // For props and computed properties, we define the proxy getters on
            // the Vue instances at extension time, on the extended prototype. This
            // avoids Object.defineProperty calls for each instance created.
            if (Sub.options.props) {
                initProps$1(Sub)
            }
            if (Sub.options.computed) {
                initComputed$1(Sub)
            }

            // allow further extension/mixin/plugin usage
            Sub.extend = Super.extend
            Sub.mixin = Super.mixin
            Sub.use = Super.use

            // create asset registers, so extended classes
            // can have their private assets too.
            ASSET_TYPES.forEach(function(type) {
                Sub[type] = Super[type]
            })
            // enable recursive self-lookup
            if (name) {
                Sub.options.components[name] = Sub
            }

            // keep a reference to the super options at extension time.
            // later at instantiation we can check if Super's options have
            // been updated.
            Sub.superOptions = Super.options
            Sub.extendOptions = extendOptions
            Sub.sealedOptions = extend({}, Sub.options)

            // cache constructor
            cachedCtors[SuperId] = Sub
            return Sub
        }
    }

    function initProps$1(Comp) {
        var props = Comp.options.props
        for (var key in props) {
            proxy(Comp.prototype, "_props", key)
        }
    }

    function initComputed$1(Comp) {
        var computed = Comp.options.computed
        for (var key in computed) {
            defineComputed(Comp.prototype, key, computed[key])
        }
    }

    /*  */

    function initAssetRegisters(Vue) {
        /**
         * Create asset registration methods.
         */
        ASSET_TYPES.forEach(function(type) {
            Vue[type] = function(id, definition) {
                if (!definition) {
                    return this.options[type + "s"][id]
                } else {
                    /* istanbul ignore if */
                    if (type === "component" && isPlainObject(definition)) {
                        definition.name = definition.name || id
                        definition = this.options._base.extend(definition)
                    }
                    if (type === "directive" && typeof definition === "function") {
                        definition = {
                            bind: definition,
                            update: definition
                        }
                    }
                    this.options[type + "s"][id] = definition
                    return definition
                }
            }
        })
    }

    /*  */

    var patternTypes = [String, RegExp, Array]

    function getComponentName(opts) {
        return opts && (opts.Ctor.options.name || opts.tag)
    }

    function matches(pattern, name) {
        if (Array.isArray(pattern)) {
            return pattern.indexOf(name) > -1
        } else if (typeof pattern === "string") {
            return pattern.split(",").indexOf(name) > -1
        } else if (isRegExp(pattern)) {
            return pattern.test(name)
        }
        /* istanbul ignore next */
        return false
    }

    function pruneCache(cache, current, filter) {
        for (var key in cache) {
            var cachedNode = cache[key]
            if (cachedNode) {
                var name = getComponentName(cachedNode.componentOptions)
                if (name && !filter(name)) {
                    if (cachedNode !== current) {
                        pruneCacheEntry(cachedNode)
                    }
                    cache[key] = null
                }
            }
        }
    }

    function pruneCacheEntry(vnode) {
        if (vnode) {
            vnode.componentInstance.$destroy()
        }
    }

    var KeepAlive = {
        name: "keep-alive",
        abstract: true,

        props: {
            include: patternTypes,
            exclude: patternTypes
        },

        created: function created() {
            this.cache = Object.create(null)
        },

        destroyed: function destroyed() {
            var this$1 = this

            for (var key in this$1.cache) {
                pruneCacheEntry(this$1.cache[key])
            }
        },

        watch: {
            include: function include(val) {
                pruneCache(this.cache, this._vnode, function(name) {
                    return matches(val, name)
                })
            },
            exclude: function exclude(val) {
                pruneCache(this.cache, this._vnode, function(name) {
                    return !matches(val, name)
                })
            }
        },

        render: function render() {
            var vnode = getFirstComponentChild(this.$slots.default)
            var componentOptions = vnode && vnode.componentOptions
            if (componentOptions) {
                // check pattern
                var name = getComponentName(componentOptions)
                if (
                    name &&
                    ((this.include && !matches(this.include, name)) ||
                        (this.exclude && matches(this.exclude, name)))
                ) {
                    return vnode
                }
                var key =
                    vnode.key == null
                        ? // same constructor may get registered as different local components
                          // so cid alone is not enough (#3269)
                          componentOptions.Ctor.cid +
                          (componentOptions.tag ? "::" + componentOptions.tag : "")
                        : vnode.key
                if (this.cache[key]) {
                    vnode.componentInstance = this.cache[key].componentInstance
                } else {
                    this.cache[key] = vnode
                }
                vnode.data.keepAlive = true
            }
            return vnode
        }
    }

    var builtInComponents = {
        KeepAlive: KeepAlive
    }

    /*  */

    function initGlobalAPI(Vue) {
        // config
        var configDef = {}
        configDef.get = function() {
            return config
        }
        Object.defineProperty(Vue, "config", configDef)

        // exposed util methods.
        // NOTE: these are not considered part of the public API - avoid relying on
        // them unless you are aware of the risk.
        Vue.util = {
            warn: warn,
            extend: extend,
            mergeOptions: mergeOptions,
            defineReactive: defineReactive$$1
        }

        Vue.set = set
        Vue.delete = del
        Vue.nextTick = nextTick

        Vue.options = Object.create(null)
        ASSET_TYPES.forEach(function(type) {
            Vue.options[type + "s"] = Object.create(null)
        })

        // this is used to identify the "base" constructor to extend all plain-object
        // components with in Weex's multi-instance scenarios.
        Vue.options._base = Vue

        extend(Vue.options.components, builtInComponents)

        initUse(Vue)
        initMixin$1(Vue)
        initExtend(Vue)
        initAssetRegisters(Vue)
    }

    initGlobalAPI(Vue$3)

    Object.defineProperty(Vue$3.prototype, "$isServer", {
        get: isServerRendering
    })

    Object.defineProperty(Vue$3.prototype, "$ssrContext", {
        get: function get() {
            /* istanbul ignore next */
            return this.$vnode && this.$vnode.ssrContext
        }
    })

    Vue$3.version = "2.4.1"
    Vue$3.mpvueVersion = "1.0.12"

    /* globals renderer */

    var isReservedTag = makeMap(
        "template,script,style,element,content,slot,link,meta,svg,view," +
            "a,div,img,image,text,span,richtext,input,switch,textarea,spinner,select," +
            "slider,slider-neighbor,indicator,trisition,trisition-group,canvas," +
            "list,cell,header,loading,loading-indicator,refresh,scrollable,scroller," +
            "video,web,embed,tabbar,tabheader,datepicker,timepicker,marquee,countdown",
        true
    )

    // these are reserved for web because they are directly compiled away
    // during template compilation
    var isReservedAttr = makeMap("style,class")

    // Elements that you can, intentionally, leave open (and which close themselves)
    // more flexable than web
    var canBeLeftOpenTag = makeMap(
        "web,spinner,switch,video,textarea,canvas," + "indicator,marquee,countdown",
        true
    )

    var isUnaryTag = makeMap("embed,img,image,input,link,meta", true)

    function mustUseProp() {
        /* console.log('mustUseProp') */
    }

    function getTagNamespace() {
        /* console.log('getTagNamespace') */
    }

    function isUnknownElement() {
        /* console.log('isUnknownElement') */
    }

    function getComKey(vm) {
        return vm && vm.$attrs ? vm.$attrs["mpcomid"] : "0"
    }

    // 用于小程序的 event type 到 web 的 event
    var eventTypeMap = {
        tap: ["tap", "click"],
        touchstart: ["touchstart"],
        touchmove: ["touchmove"],
        touchcancel: ["touchcancel"],
        touchend: ["touchend"],
        longtap: ["longtap"],
        input: ["input"],
        blur: ["change", "blur"],
        submit: ["submit"],
        focus: ["focus"],
        scrolltoupper: ["scrolltoupper"],
        scrolltolower: ["scrolltolower"],
        scroll: ["scroll"]
    }

    /*  */

    // import { namespaceMap } from 'mp/util/index'

    var obj = {}

    function createElement$1(tagName, vnode) {
        return obj
    }

    function createElementNS(namespace, tagName) {
        return obj
    }

    function createTextNode(text) {
        return obj
    }

    function createComment(text) {
        return obj
    }

    function insertBefore(parentNode, newNode, referenceNode) {}

    function removeChild(node, child) {}

    function appendChild(node, child) {}

    function parentNode(node) {
        return obj
    }

    function nextSibling(node) {
        return obj
    }

    function tagName(node) {
        return "div"
    }

    function setTextContent(node, text) {
        return obj
    }

    function setAttribute(node, key, val) {
        return obj
    }

    var nodeOps = Object.freeze({
        createElement: createElement$1,
        createElementNS: createElementNS,
        createTextNode: createTextNode,
        createComment: createComment,
        insertBefore: insertBefore,
        removeChild: removeChild,
        appendChild: appendChild,
        parentNode: parentNode,
        nextSibling: nextSibling,
        tagName: tagName,
        setTextContent: setTextContent,
        setAttribute: setAttribute
    })

    /*  */

    var ref = {
        create: function create(_, vnode) {
            registerRef(vnode)
        },
        update: function update(oldVnode, vnode) {
            if (oldVnode.data.ref !== vnode.data.ref) {
                registerRef(oldVnode, true)
                registerRef(vnode)
            }
        },
        destroy: function destroy(vnode) {
            registerRef(vnode, true)
        }
    }

    function registerRef(vnode, isRemoval) {
        var key = vnode.data.ref
        if (!key) {
            return
        }

        var vm = vnode.context
        var ref = vnode.componentInstance || vnode.elm
        var refs = vm.$refs
        if (isRemoval) {
            if (Array.isArray(refs[key])) {
                remove(refs[key], ref)
            } else if (refs[key] === ref) {
                refs[key] = undefined
            }
        } else {
            if (vnode.data.refInFor) {
                if (!Array.isArray(refs[key])) {
                    refs[key] = [ref]
                } else if (refs[key].indexOf(ref) < 0) {
                    // $flow-disable-line
                    refs[key].push(ref)
                }
            } else {
                refs[key] = ref
            }
        }
    }

    /**
     * Virtual DOM patching algorithm based on Snabbdom by
     * Simon Friis Vindum (@paldepind)
     * Licensed under the MIT License
     * https://github.com/paldepind/snabbdom/blob/master/LICENSE
     *
     * modified by Evan You (@yyx990803)
     *

    /*
     * Not type-checking this because this file is perf-critical and the cost
     * of making flow understand it is not worth it.
     */

    var emptyNode = new VNode("", {}, [])

    var hooks = ["create", "activate", "update", "remove", "destroy"]

    function sameVnode(a, b) {
        return (
            a.key === b.key &&
            ((a.tag === b.tag &&
                a.isComment === b.isComment &&
                isDef(a.data) === isDef(b.data) &&
                sameInputType(a, b)) ||
                (isTrue(a.isAsyncPlaceholder) &&
                    a.asyncFactory === b.asyncFactory &&
                    isUndef(b.asyncFactory.error)))
        )
    }

    // Some browsers do not support dynamically changing type for <input>
    // so they need to be treated as different nodes
    function sameInputType(a, b) {
        if (a.tag !== "input") {
            return true
        }
        var i
        var typeA = isDef((i = a.data)) && isDef((i = i.attrs)) && i.type
        var typeB = isDef((i = b.data)) && isDef((i = i.attrs)) && i.type
        return typeA === typeB
    }

    function createKeyToOldIdx(children, beginIdx, endIdx) {
        var i, key
        var map = {}
        for (i = beginIdx; i <= endIdx; ++i) {
            key = children[i].key
            if (isDef(key)) {
                map[key] = i
            }
        }
        return map
    }

    function createPatchFunction(backend) {
        var i, j
        var cbs = {}

        var modules = backend.modules
        var nodeOps = backend.nodeOps

        for (i = 0; i < hooks.length; ++i) {
            cbs[hooks[i]] = []
            for (j = 0; j < modules.length; ++j) {
                if (isDef(modules[j][hooks[i]])) {
                    cbs[hooks[i]].push(modules[j][hooks[i]])
                }
            }
        }

        function emptyNodeAt(elm) {
            return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
        }

        function createRmCb(childElm, listeners) {
            function remove$$1() {
                if (--remove$$1.listeners === 0) {
                    removeNode(childElm)
                }
            }
            remove$$1.listeners = listeners
            return remove$$1
        }

        function removeNode(el) {
            var parent = nodeOps.parentNode(el)
            // element may have already been removed due to v-html / v-text
            if (isDef(parent)) {
                nodeOps.removeChild(parent, el)
            }
        }

        var inPre = 0

        function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested) {
            vnode.isRootInsert = !nested // for transition enter check
            if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
                return
            }

            var data = vnode.data
            var children = vnode.children
            var tag = vnode.tag
            if (isDef(tag)) {
                vnode.elm = vnode.ns
                    ? nodeOps.createElementNS(vnode.ns, tag)
                    : nodeOps.createElement(tag, vnode)
                setScope(vnode)

                /* istanbul ignore if */
                {
                    createChildren(vnode, children, insertedVnodeQueue)
                    if (isDef(data)) {
                        invokeCreateHooks(vnode, insertedVnodeQueue)
                    }
                    insert(parentElm, vnode.elm, refElm)
                }

                if (false) {}
            } else if (isTrue(vnode.isComment)) {
                vnode.elm = nodeOps.createComment(vnode.text)
                insert(parentElm, vnode.elm, refElm)
            } else {
                vnode.elm = nodeOps.createTextNode(vnode.text)
                insert(parentElm, vnode.elm, refElm)
            }
        }

        function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
            var i = vnode.data
            if (isDef(i)) {
                var isReactivated = isDef(vnode.componentInstance) && i.keepAlive
                if (isDef((i = i.hook)) && isDef((i = i.init))) {
                    i(vnode, false /* hydrating */, parentElm, refElm)
                }
                // after calling the init hook, if the vnode is a child component
                // it should've created a child instance and mounted it. the child
                // component also has set the placeholder vnode's elm.
                // in that case we can just return the element and be done.
                if (isDef(vnode.componentInstance)) {
                    initComponent(vnode, insertedVnodeQueue)
                    if (isTrue(isReactivated)) {
                        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
                    }
                    return true
                }
            }
        }

        function initComponent(vnode, insertedVnodeQueue) {
            if (isDef(vnode.data.pendingInsert)) {
                insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert)
                vnode.data.pendingInsert = null
            }
            vnode.elm = vnode.componentInstance.$el
            if (isPatchable(vnode)) {
                invokeCreateHooks(vnode, insertedVnodeQueue)
                setScope(vnode)
            } else {
                // empty component root.
                // skip all element-related modules except for ref (#3455)
                registerRef(vnode)
                // make sure to invoke the insert hook
                insertedVnodeQueue.push(vnode)
            }
        }

        function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
            var i
            // hack for #4339: a reactivated component with inner transition
            // does not trigger because the inner node's created hooks are not called
            // again. It's not ideal to involve module-specific logic in here but
            // there doesn't seem to be a better way to do it.
            var innerNode = vnode
            while (innerNode.componentInstance) {
                innerNode = innerNode.componentInstance._vnode
                if (isDef((i = innerNode.data)) && isDef((i = i.transition))) {
                    for (i = 0; i < cbs.activate.length; ++i) {
                        cbs.activate[i](emptyNode, innerNode)
                    }
                    insertedVnodeQueue.push(innerNode)
                    break
                }
            }
            // unlike a newly created component,
            // a reactivated keep-alive component doesn't insert itself
            insert(parentElm, vnode.elm, refElm)
        }

        function insert(parent, elm, ref$$1) {
            if (isDef(parent)) {
                if (isDef(ref$$1)) {
                    if (ref$$1.parentNode === parent) {
                        nodeOps.insertBefore(parent, elm, ref$$1)
                    }
                } else {
                    nodeOps.appendChild(parent, elm)
                }
            }
        }

        function createChildren(vnode, children, insertedVnodeQueue) {
            if (Array.isArray(children)) {
                for (var i = 0; i < children.length; ++i) {
                    createElm(children[i], insertedVnodeQueue, vnode.elm, null, true)
                }
            } else if (isPrimitive(vnode.text)) {
                nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text))
            }
        }

        function isPatchable(vnode) {
            while (vnode.componentInstance) {
                vnode = vnode.componentInstance._vnode
            }
            return isDef(vnode.tag)
        }

        function invokeCreateHooks(vnode, insertedVnodeQueue) {
            for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, vnode)
            }
            i = vnode.data.hook // Reuse variable
            if (isDef(i)) {
                if (isDef(i.create)) {
                    i.create(emptyNode, vnode)
                }
                if (isDef(i.insert)) {
                    insertedVnodeQueue.push(vnode)
                }
            }
        }

        // set scope id attribute for scoped CSS.
        // this is implemented as a special case to avoid the overhead
        // of going through the normal attribute patching process.
        function setScope(vnode) {
            var i
            var ancestor = vnode
            while (ancestor) {
                if (isDef((i = ancestor.context)) && isDef((i = i.$options._scopeId))) {
                    nodeOps.setAttribute(vnode.elm, i, "")
                }
                ancestor = ancestor.parent
            }
            // for slot content they should also get the scopeId from the host instance.
            if (
                isDef((i = activeInstance)) &&
                i !== vnode.context &&
                isDef((i = i.$options._scopeId))
            ) {
                nodeOps.setAttribute(vnode.elm, i, "")
            }
        }

        function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
            for (; startIdx <= endIdx; ++startIdx) {
                createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm)
            }
        }

        function invokeDestroyHook(vnode) {
            var i, j
            var data = vnode.data
            if (isDef(data)) {
                if (isDef((i = data.hook)) && isDef((i = i.destroy))) {
                    i(vnode)
                }
                for (i = 0; i < cbs.destroy.length; ++i) {
                    cbs.destroy[i](vnode)
                }
            }
            if (isDef((i = vnode.children))) {
                for (j = 0; j < vnode.children.length; ++j) {
                    invokeDestroyHook(vnode.children[j])
                }
            }
        }

        function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
            for (; startIdx <= endIdx; ++startIdx) {
                var ch = vnodes[startIdx]
                if (isDef(ch)) {
                    if (isDef(ch.tag)) {
                        removeAndInvokeRemoveHook(ch)
                        invokeDestroyHook(ch)
                    } else {
                        // Text node
                        removeNode(ch.elm)
                    }
                }
            }
        }

        function removeAndInvokeRemoveHook(vnode, rm) {
            if (isDef(rm) || isDef(vnode.data)) {
                var i
                var listeners = cbs.remove.length + 1
                if (isDef(rm)) {
                    // we have a recursively passed down rm callback
                    // increase the listeners count
                    rm.listeners += listeners
                } else {
                    // directly removing
                    rm = createRmCb(vnode.elm, listeners)
                }
                // recursively invoke hooks on child component root node
                if (
                    isDef((i = vnode.componentInstance)) &&
                    isDef((i = i._vnode)) &&
                    isDef(i.data)
                ) {
                    removeAndInvokeRemoveHook(i, rm)
                }
                for (i = 0; i < cbs.remove.length; ++i) {
                    cbs.remove[i](vnode, rm)
                }
                if (isDef((i = vnode.data.hook)) && isDef((i = i.remove))) {
                    i(vnode, rm)
                } else {
                    rm()
                }
            } else {
                removeNode(vnode.elm)
            }
        }

        function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
            var oldStartIdx = 0
            var newStartIdx = 0
            var oldEndIdx = oldCh.length - 1
            var oldStartVnode = oldCh[0]
            var oldEndVnode = oldCh[oldEndIdx]
            var newEndIdx = newCh.length - 1
            var newStartVnode = newCh[0]
            var newEndVnode = newCh[newEndIdx]
            var oldKeyToIdx, idxInOld, elmToMove, refElm

            // removeOnly is a special flag used only by <transition-group>
            // to ensure removed elements stay in correct relative positions
            // during leaving transitions
            var canMove = !removeOnly

            while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                if (isUndef(oldStartVnode)) {
                    oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
                } else if (isUndef(oldEndVnode)) {
                    oldEndVnode = oldCh[--oldEndIdx]
                } else if (sameVnode(oldStartVnode, newStartVnode)) {
                    patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
                    oldStartVnode = oldCh[++oldStartIdx]
                    newStartVnode = newCh[++newStartIdx]
                } else if (sameVnode(oldEndVnode, newEndVnode)) {
                    patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
                    oldEndVnode = oldCh[--oldEndIdx]
                    newEndVnode = newCh[--newEndIdx]
                } else if (sameVnode(oldStartVnode, newEndVnode)) {
                    // Vnode moved right
                    patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
                    canMove &&
                        nodeOps.insertBefore(
                            parentElm,
                            oldStartVnode.elm,
                            nodeOps.nextSibling(oldEndVnode.elm)
                        )
                    oldStartVnode = oldCh[++oldStartIdx]
                    newEndVnode = newCh[--newEndIdx]
                } else if (sameVnode(oldEndVnode, newStartVnode)) {
                    // Vnode moved left
                    patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
                    canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
                    oldEndVnode = oldCh[--oldEndIdx]
                    newStartVnode = newCh[++newStartIdx]
                } else {
                    if (isUndef(oldKeyToIdx)) {
                        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
                    }
                    idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null
                    if (isUndef(idxInOld)) {
                        // New element
                        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
                        newStartVnode = newCh[++newStartIdx]
                    } else {
                        elmToMove = oldCh[idxInOld]
                        /* istanbul ignore if */
                        if (false) {}
                        if (sameVnode(elmToMove, newStartVnode)) {
                            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
                            oldCh[idxInOld] = undefined
                            canMove &&
                                nodeOps.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm)
                            newStartVnode = newCh[++newStartIdx]
                        } else {
                            // same key but different element. treat as new element
                            createElm(
                                newStartVnode,
                                insertedVnodeQueue,
                                parentElm,
                                oldStartVnode.elm
                            )
                            newStartVnode = newCh[++newStartIdx]
                        }
                    }
                }
            }
            if (oldStartIdx > oldEndIdx) {
                refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
                addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
            } else if (newStartIdx > newEndIdx) {
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
            }
        }

        function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
            if (oldVnode === vnode) {
                return
            }

            var elm = (vnode.elm = oldVnode.elm)

            if (isTrue(oldVnode.isAsyncPlaceholder)) {
                if (isDef(vnode.asyncFactory.resolved)) {
                    hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
                } else {
                    vnode.isAsyncPlaceholder = true
                }
                return
            }

            // reuse element for static trees.
            // note we only do this if the vnode is cloned -
            // if the new node is not cloned it means the render functions have been
            // reset by the hot-reload-api and we need to do a proper re-render.
            if (
                isTrue(vnode.isStatic) &&
                isTrue(oldVnode.isStatic) &&
                vnode.key === oldVnode.key &&
                (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
            ) {
                vnode.componentInstance = oldVnode.componentInstance
                return
            }

            var i
            var data = vnode.data
            if (isDef(data) && isDef((i = data.hook)) && isDef((i = i.prepatch))) {
                i(oldVnode, vnode)
            }

            var oldCh = oldVnode.children
            var ch = vnode.children
            if (isDef(data) && isPatchable(vnode)) {
                for (i = 0; i < cbs.update.length; ++i) {
                    cbs.update[i](oldVnode, vnode)
                }
                if (isDef((i = data.hook)) && isDef((i = i.update))) {
                    i(oldVnode, vnode)
                }
            }
            if (isUndef(vnode.text)) {
                if (isDef(oldCh) && isDef(ch)) {
                    if (oldCh !== ch) {
                        updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
                    }
                } else if (isDef(ch)) {
                    if (isDef(oldVnode.text)) {
                        nodeOps.setTextContent(elm, "")
                    }
                    addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
                } else if (isDef(oldCh)) {
                    removeVnodes(elm, oldCh, 0, oldCh.length - 1)
                } else if (isDef(oldVnode.text)) {
                    nodeOps.setTextContent(elm, "")
                }
            } else if (oldVnode.text !== vnode.text) {
                nodeOps.setTextContent(elm, vnode.text)
            }
            if (isDef(data)) {
                if (isDef((i = data.hook)) && isDef((i = i.postpatch))) {
                    i(oldVnode, vnode)
                }
            }
        }

        function invokeInsertHook(vnode, queue, initial) {
            // delay insert hooks for component root nodes, invoke them after the
            // element is really inserted
            if (isTrue(initial) && isDef(vnode.parent)) {
                vnode.parent.data.pendingInsert = queue
            } else {
                for (var i = 0; i < queue.length; ++i) {
                    queue[i].data.hook.insert(queue[i])
                }
            }
        }

        var bailed = false
        // list of modules that can skip create hook during hydration because they
        // are already rendered on the client or has no need for initialization
        var isRenderedModule = makeMap("attrs,style,class,staticClass,staticStyle,key")

        // Note: this is a browser-only function so we can assume elms are DOM nodes.
        function hydrate(elm, vnode, insertedVnodeQueue) {
            if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
                vnode.elm = elm
                vnode.isAsyncPlaceholder = true
                return true
            }
            vnode.elm = elm
            var tag = vnode.tag
            var data = vnode.data
            var children = vnode.children
            if (isDef(data)) {
                if (isDef((i = data.hook)) && isDef((i = i.init))) {
                    i(vnode, true /* hydrating */)
                }
                if (isDef((i = vnode.componentInstance))) {
                    // child component. it should have hydrated its own tree.
                    initComponent(vnode, insertedVnodeQueue)
                    return true
                }
            }
            if (isDef(tag)) {
                if (isDef(children)) {
                    // empty element, allow client to pick up and populate children
                    if (!elm.hasChildNodes()) {
                        createChildren(vnode, children, insertedVnodeQueue)
                    } else {
                        var childrenMatch = true
                        var childNode = elm.firstChild
                        for (var i$1 = 0; i$1 < children.length; i$1++) {
                            if (
                                !childNode ||
                                !hydrate(childNode, children[i$1], insertedVnodeQueue)
                            ) {
                                childrenMatch = false
                                break
                            }
                            childNode = childNode.nextSibling
                        }
                        // if childNode is not null, it means the actual childNodes list is
                        // longer than the virtual children list.
                        if (!childrenMatch || childNode) {
                            if (
                                false
                            ) {}
                            return false
                        }
                    }
                }
                if (isDef(data)) {
                    for (var key in data) {
                        if (!isRenderedModule(key)) {
                            invokeCreateHooks(vnode, insertedVnodeQueue)
                            break
                        }
                    }
                }
            } else if (elm.data !== vnode.text) {
                elm.data = vnode.text
            }
            return true
        }

        return function patch(oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
            if (isUndef(vnode)) {
                if (isDef(oldVnode)) {
                    invokeDestroyHook(oldVnode)
                }
                return
            }

            var isInitialPatch = false
            var insertedVnodeQueue = []

            if (isUndef(oldVnode)) {
                // empty mount (likely as component), create new root element
                isInitialPatch = true
                createElm(vnode, insertedVnodeQueue, parentElm, refElm)
            } else {
                var isRealElement = isDef(oldVnode.nodeType)
                if (!isRealElement && sameVnode(oldVnode, vnode)) {
                    // patch existing root node
                    patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
                } else {
                    if (isRealElement) {
                        // mounting to a real element
                        // check if this is server-rendered content and if we can perform
                        // a successful hydration.
                        if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
                            oldVnode.removeAttribute(SSR_ATTR)
                            hydrating = true
                        }
                        if (isTrue(hydrating)) {
                            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                                invokeInsertHook(vnode, insertedVnodeQueue, true)
                                return oldVnode
                            } else {
                            }
                        }
                        // either not server-rendered, or hydration failed.
                        // create an empty node and replace it
                        oldVnode = emptyNodeAt(oldVnode)
                    }
                    // replacing existing element
                    var oldElm = oldVnode.elm
                    var parentElm$1 = nodeOps.parentNode(oldElm)
                    createElm(
                        vnode,
                        insertedVnodeQueue,
                        // extremely rare edge case: do not insert if old element is in a
                        // leaving transition. Only happens when combining transition +
                        // keep-alive + HOCs. (#4590)
                        oldElm._leaveCb ? null : parentElm$1,
                        nodeOps.nextSibling(oldElm)
                    )

                    if (isDef(vnode.parent)) {
                        // component root element replaced.
                        // update parent placeholder node element, recursively
                        var ancestor = vnode.parent
                        while (ancestor) {
                            ancestor.elm = vnode.elm
                            ancestor = ancestor.parent
                        }
                        if (isPatchable(vnode)) {
                            for (var i = 0; i < cbs.create.length; ++i) {
                                cbs.create[i](emptyNode, vnode.parent)
                            }
                        }
                    }

                    if (isDef(parentElm$1)) {
                        removeVnodes(parentElm$1, [oldVnode], 0, 0)
                    } else if (isDef(oldVnode.tag)) {
                        invokeDestroyHook(oldVnode)
                    }
                }
            }

            invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
            return vnode.elm
        }
    }

    /*  */

    // import baseModules from 'core/vdom/modules/index'
    // const platformModules = []
    // import platformModules from 'web/runtime/modules/index'

    // the directive module should be applied last, after all
    // built-in modules have been applied.
    // const modules = platformModules.concat(baseModules)
    var modules = [ref]

    var corePatch = createPatchFunction({
        nodeOps: nodeOps,
        modules: modules
    })

    function patch() {
        corePatch.apply(this, arguments)
        this.$updateDataToMP()
    }

    function callHook$1(vm, hook, params) {
        var handlers = vm.$options[hook]
        if (hook === "onError" && handlers) {
            handlers = [handlers]
        }

        var ret
        if (handlers) {
            for (var i = 0, j = handlers.length; i < j; i++) {
                try {
                    ret = handlers[i].call(vm, params)
                } catch (e) {
                    handleError(e, vm, hook + " hook")
                }
            }
        }
        if (vm._hasHookEvent) {
            vm.$emit("hook:" + hook)
        }

        // for child
        if (vm.$children.length) {
            vm.$children.forEach(function(v) {
                return callHook$1(v, hook, params)
            })
        }

        return ret
    }

    // mpType 小程序实例的类型，可能的值是 'app', 'page'
    // rootVueVM 是 vue 的根组件实例，子组件中访问 this.$root 可得
    function getGlobalData(app, rootVueVM) {
        var mp = rootVueVM.$mp
        if (app && app.globalData) {
            mp.appOptions = app.globalData.appOptions
        }
    }

    // 格式化 properties 属性，并给每个属性加上 observer 方法

    // properties 的 一些类型 https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html
    // properties: {
    //   paramA: Number,
    //   myProperty: { // 属性名
    //     type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    //     value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
    //     observer: function(newVal, oldVal, changedPath) {
    //        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    //        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
    //     }
    //   },
    // }

    // props 的一些类型 https://cn.vuejs.org/v2/guide/components-props.html#ad
    // props: {
    //   // 基础的类型检查 (`null` 匹配任何类型)
    //   propA: Number,
    //   // 多个可能的类型
    //   propB: [String, Number],
    //   // 必填的字符串
    //   propC: {
    //     type: String,
    //     required: true
    //   },
    //   // 带有默认值的数字
    //   propD: {
    //     type: Number,
    //     default: 100
    //   },
    //   // 带有默认值的对象
    //   propE: {
    //     type: Object,
    //     // 对象或数组且一定会从一个工厂函数返回默认值
    //     default: function () {
    //       return { message: 'hello' }
    //     }
    //   },
    //   // 自定义验证函数
    //   propF: {
    //     validator: function (value) {
    //       // 这个值必须匹配下列字符串中的一个
    //       return ['success', 'warning', 'danger'].indexOf(value) !== -1
    //     }
    //   }
    // }

    // core/util/options
    function normalizeProps$1(props, res, vm) {
        if (!props) {
            return
        }
        var i, val, name
        if (Array.isArray(props)) {
            i = props.length
            while (i--) {
                val = props[i]
                if (typeof val === "string") {
                    name = camelize(val)
                    res[name] = {
                        type: null
                    }
                } else {
                }
            }
        } else if (isPlainObject(props)) {
            for (var key in props) {
                val = props[key]
                name = camelize(key)
                res[name] = isPlainObject(val)
                    ? val
                    : {
                          type: val
                      }
            }
        }

        // fix vueProps to properties
        for (var key$1 in res) {
            if (res.hasOwnProperty(key$1)) {
                var item = res[key$1]
                if (item.default) {
                    item.value = item.default
                }
                var oldObserver = item.observer
                item.observer = function(newVal, oldVal) {
                    vm[name] = newVal
                    // 先修改值再触发原始的 observer，跟 watch 行为保持一致
                    if (typeof oldObserver === "function") {
                        oldObserver.call(vm, newVal, oldVal)
                    }
                }
            }
        }

        return res
    }

    function normalizeProperties(vm) {
        var properties = vm.$options.properties
        var vueProps = vm.$options.props
        var res = {}

        normalizeProps$1(properties, res, vm)
        normalizeProps$1(vueProps, res, vm)

        return res
    }

    /**
     * 把 properties 中的属性 proxy 到 vm 上
     */
    function initMpProps(vm) {
        var mpProps = (vm._mpProps = {})
        var keys = Object.keys(vm.$options.properties || {})
        keys.forEach(function(key) {
            if (!(key in vm)) {
                proxy(vm, "_mpProps", key)
                mpProps[key] = undefined // for observe
            }
        })
        observe(mpProps, true)
    }

    function initMP(mpType, next) {
        var rootVueVM = this.$root
        if (!rootVueVM.$mp) {
            rootVueVM.$mp = {}
        }

        var mp = rootVueVM.$mp

        // Please do not register multiple Pages
        // if (mp.registered) {
        if (mp.status) {
            // 处理子组件的小程序生命周期
            if (mpType === "app") {
                callHook$1(this, "onLaunch", mp.appOptions)
            } else {
                this.__wxWebviewId__ = rootVueVM.__wxWebviewId__
                this.__wxExparserNodeId__ = rootVueVM.__wxExparserNodeId__
                callHook$1(this, "onLoad", mp.query)
                // callHook$1(this, "onReady") // 避免 onReady触发两次
            }
            return next()
        }
        // mp.registered = true

        mp.mpType = mpType
        mp.status = "register"

        if (mpType === "app") {
            global.App({
                // 页面的初始数据
                globalData: {
                    appOptions: {}
                },

                handleProxy: function handleProxy(e) {
                    return rootVueVM.$handleProxyWithVue(e)
                },

                // Do something initial when launch.
                onLaunch: function onLaunch(options) {
                    if (options === void 0) options = {}

                    mp.app = this
                    mp.status = "launch"
                    this.globalData.appOptions = mp.appOptions = options
                    callHook$1(rootVueVM, "onLaunch", options)
                    next()
                },

                // Do something when app show.
                onShow: function onShow(options) {
                    if (options === void 0) options = {}

                    mp.status = "show"
                    this.globalData.appOptions = mp.appOptions = options
                    callHook$1(rootVueVM, "onShow", options)
                },

                // Do something when app hide.
                onHide: function onHide() {
                    mp.status = "hide"
                    callHook$1(rootVueVM, "onHide")
                },

                onError: function onError(err) {
                    callHook$1(rootVueVM, "onError", err)
                },
                //fixed by xxxxxx
                onUniNViewMessage: function onUniNViewMessage(e) {
                    callHook$1(rootVueVM, "onUniNViewMessage", e)
                }
            })
        } else if (mpType === "component") {
            initMpProps(rootVueVM)

            global.Component({
                // 小程序原生的组件属性
                properties: normalizeProperties(rootVueVM),
                // 页面的初始数据
                data: {
                    $root: {}
                },
                methods: {
                    handleProxy: function handleProxy(e) {
                        return rootVueVM.$handleProxyWithVue(e)
                    }
                },
                // mp lifecycle for vue
                // 组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
                created: function created() {
                    mp.status = "created"
                    mp.page = this
                },
                // 组件生命周期函数，在组件实例进入页面节点树时执行
                attached: function attached() {
                    mp.status = "attached"
                    callHook$1(rootVueVM, "attached")
                },
                // 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
                ready: function ready() {
                    mp.status = "ready"

                    callHook$1(rootVueVM, "ready")
                    next()

                    // 只有页面需要 setData
                    rootVueVM.$nextTick(function() {
                        rootVueVM._initDataToMP()
                    })
                },
                // 组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
                moved: function moved() {
                    callHook$1(rootVueVM, "moved")
                },
                // 组件生命周期函数，在组件实例被从页面节点树移除时执行
                detached: function detached() {
                    mp.status = "detached"
                    callHook$1(rootVueVM, "detached")
                }
            })
        } else {
            var app = global.getApp()
    
            
            global.Page({
                // 页面的初始数据
                data: {
                    $root: {}
                },

                handleProxy: function handleProxy(e) {
                    return rootVueVM.$handleProxyWithVue(e)
                },

                // mp lifecycle for vue
                // 生命周期函数--监听页面加载
                onLoad: function onLoad(query) {
                    rootVueVM.__wxWebviewId__ = this.__wxWebviewId__//fixed by xxxxxx(createIntersectionObserver)
                    rootVueVM.__wxExparserNodeId__ = this.__wxExparserNodeId__
                    mp.page = this
                    mp.query = query
                    mp.status = "load"
                    getGlobalData(app, rootVueVM)
                    //仅load时重置数据
                    if (rootVueVM.$options && typeof rootVueVM.$options.data === "function") {
                    		Object.assign(rootVueVM.$data, rootVueVM.$options.data())
                    }
                    callHook$1(rootVueVM, "onLoad", query)
                },

                // 生命周期函数--监听页面显示
                onShow: function onShow() {
                    rootVueVM.__wxWebviewId__ = this.__wxWebviewId__//fixed by xxxxxx(createIntersectionObserver)
                    rootVueVM.__wxExparserNodeId__ = this.__wxExparserNodeId__
                    mp.page = this
                    mp.status = "show"
                
                    callHook$1(rootVueVM, "onShow")
                    
                    //   // 只有页面需要 setData
                    rootVueVM.$nextTick(function () {
                    	rootVueVM._initDataToMP();
                    });
                },

                // 生命周期函数--监听页面初次渲染完成
                onReady: function onReady() {
                    mp.status = "ready"

                    callHook$1(rootVueVM, "onReady")
                    next()
                },

                // 生命周期函数--监听页面隐藏
                onHide: function onHide() {
                    mp.status = "hide"
                    callHook$1(rootVueVM, "onHide")
                },

                // 生命周期函数--监听页面卸载
                onUnload: function onUnload() {
                    mp.status = "unload"
                    callHook$1(rootVueVM, "onUnload")
                    mp.page = null
                },

                // 页面相关事件处理函数--监听用户下拉动作
                onPullDownRefresh: function onPullDownRefresh() {
                    callHook$1(rootVueVM, "onPullDownRefresh")
                },

                // 页面上拉触底事件的处理函数
                onReachBottom: function onReachBottom() {
                    callHook$1(rootVueVM, "onReachBottom")
                },

                // 用户点击右上角分享
                onShareAppMessage: rootVueVM.$options.onShareAppMessage
                    ? function(options) {
                          return callHook$1(rootVueVM, "onShareAppMessage", options)
                      }
                    : null,

                // Do something when page scroll
                onPageScroll: function onPageScroll(options) {
                    callHook$1(rootVueVM, "onPageScroll", options)
                },

                // 当前是 tab 页时，点击 tab 时触发
                onTabItemTap: function onTabItemTap(options) {
                    callHook$1(rootVueVM, "onTabItemTap", options)
                }
            })
        }
    }

    // 节流方法，性能优化
    // 全局的命名约定，为了节省编译的包大小一律采取形象的缩写，说明如下。
    // $c === $child
    // $k === $comKey

    // 新型的被拍平的数据结构
    // {
    //   $root: {
    //     '1-1'{
    //       // ... data
    //     },
    //     '1.2-1': {
    //       // ... data1
    //     },
    //     '1.2-2': {
    //       // ... data2
    //     }
    //   }
    // }

    function getVmData(vm) {
        // 确保当前 vm 所有数据被同步
        var dataKeys = [].concat(
            Object.keys(vm._data || {}),
            Object.keys(vm._props || {}),
            Object.keys(vm._mpProps || {}),
            Object.keys(vm._computedWatchers || {})
        )
        return dataKeys.reduce(function(res, key) {
            res[key] = vm[key]
            return res
        }, {})
    }

    function getParentComKey(vm, res) {
        if (res === void 0) res = []

        var ref = vm || {}
        var $parent = ref.$parent
        if (!$parent) {
            return res
        }
        res.unshift(getComKey($parent))
        if ($parent.$parent) {
            return getParentComKey($parent, res)
        }
        return res
    }

    function formatVmData(vm) {
        var $p = getParentComKey(vm).join(",")
        var $k = $p + ($p ? "," : "") + getComKey(vm)

        // getVmData 这儿获取当前组件内的所有数据，包含 props、computed 的数据
        // 改动 vue.runtime 所获的的核心能力
        var data = Object.assign(getVmData(vm), {
            $k: $k,
            $kk: $k + ",",
            $p: $p
        })
        var key = "$root." + $k
        var res = {}
        res[key] = data
        return res
    }

    function collectVmData(vm, res) {
        if (res === void 0) res = {}

        var vms = vm.$children
        if (vms && vms.length) {
            vms.forEach(function(v) {
                return collectVmData(v, res)
            })
        }
        return Object.assign(res, formatVmData(vm))
    }

    /**
     * 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait
     * 自动合并 data
     *
     * @param  {function}   func      传入函数
     * @param  {number}     wait      表示时间窗口的间隔
     * @param  {object}     options   如果想忽略开始边界上的调用，传入{leading: false}。
     *                                如果想忽略结尾边界上的调用，传入{trailing: false}
     * @return {function}             返回客户调用函数
     */
    function throttle(func, wait, options) {
        var context, args, result
        var timeout = null
        // 上次执行时间点
        var previous = 0
        if (!options) {
            options = {}
        }
        // 延迟执行函数
        function later() {
            // 若设定了开始边界不执行选项，上次执行时间始终为0
            previous = options.leading === false ? 0 : Date.now()
            timeout = null
            result = func.apply(context, args)
            if (!timeout) {
                context = args = null
            }
        }
        return function(handle, data) {
            var now = Date.now()
            // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
            if (!previous && options.leading === false) {
                previous = now
            }
            // 延迟执行时间间隔
            var remaining = wait - (now - previous)
            context = this
            args = args ? [handle, Object.assign(args[1], data)] : [handle, data]
            // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
            // remaining大于时间窗口wait，表示客户端系统时间被调整过
            if (remaining <= 0 || remaining > wait) {
                clearTimeout(timeout)
                timeout = null
                previous = now
                result = func.apply(context, args)
                if (!timeout) {
                    context = args = null
                }
                // 如果延迟执行不存在，且没有设定结尾边界不执行选项
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining)
            }
            return result
        }
    }

    // 优化频繁的 setData: https://mp.weixin.qq.com/debug/wxadoc/dev/framework/performance/tips.html
    var throttleSetData = throttle(function(handle, data) {
        handle && handle(data)
    }, 50)

    function getPage(vm) {
        var rootVueVM = vm.$root
        var ref = rootVueVM.$mp || {}
        var mpType = ref.mpType
        if (mpType === void 0) mpType = ""
        var page = ref.page

        // 优化后台态页面进行 setData: https://mp.weixin.qq.com/debug/wxadoc/dev/framework/performance/tips.html
        if (mpType === "app" || !page || typeof page.setData !== "function") {
            return
        }
        return page
    }

    // 优化每次 setData 都传递大量新数据
    function updateDataToMP() {
        var page = getPage(this)
        if (!page) {
            return
        }

        var data = JSON.parse(JSON.stringify(formatVmData(this)))
        //fixed by xxxxxx
        throttleSetData(page.setData.bind(page), diff(data, page.data))
    }

    function initDataToMP() {
        var page = getPage(this)
        if (!page) {
            return
        }

        var data = collectVmData(this.$root)
        //fixed by xxxxxx
        page.setData(JSON.parse(JSON.stringify(data)))
    }

    function getVM(vm, comkeys) {
        if (comkeys === void 0) comkeys = []

        var keys = comkeys.slice(1)
        if (!keys.length) {
            return vm
        }

        return keys.reduce(function(res, key) {
            var len = res.$children.length
            for (var i = 0; i < len; i++) {
                var v = res.$children[i]
                var k = getComKey(v)
                if (k === key) {
                    res = v
                    return res
                }
            }
            return res
        }, vm)
    }

    function getHandle(vnode, eventid, eventTypes) {
        if (eventTypes === void 0) eventTypes = []

        var res = []
        if (!vnode || !vnode.tag) {
            return res
        }

        var ref = vnode || {}
        var data = ref.data
        if (data === void 0) data = {}
        var children = ref.children
        if (children === void 0) children = []
        var componentInstance = ref.componentInstance
        if (componentInstance) {
            // 增加 slot 情况的处理
            // Object.values 会多增加几行编译后的代码
            Object.keys(componentInstance.$slots).forEach(function(slotKey) {
                var slot = componentInstance.$slots[slotKey]
                var slots = Array.isArray(slot) ? slot : [slot]
                slots.forEach(function(node) {
                    res = res.concat(getHandle(node, eventid, eventTypes))
                })
            })
        } else {
            // 避免遍历超出当前组件的 vm
            children.forEach(function(node) {
                res = res.concat(getHandle(node, eventid, eventTypes))
            })
        }

        var attrs = data.attrs
        var on = data.on
        if (attrs && on && attrs["eventid"] === eventid) {
            eventTypes.forEach(function(et) {
                var h = on[et]
                if (typeof h === "function") {
                    res.push(h)
                } else if (Array.isArray(h)) {
                    res = res.concat(h)
                }
            })
            return res
        }

        return res
    }

    function getWebEventByMP(e) {
        var type = e.type
        var timeStamp = e.timeStamp
        var touches = e.touches
        var detail = e.detail
        if (detail === void 0) detail = {}
        var target = e.target
        if (target === void 0) target = {}
        var currentTarget = e.currentTarget
        if (currentTarget === void 0) currentTarget = {}
        var x = detail.x
        var y = detail.y
        var event = {
            mp: e,
            type: type,
            timeStamp: timeStamp,
            x: x,
            y: y,
            target: Object.assign({}, target, detail),
            detail: detail, //fixed by xxxxxx
            currentTarget: currentTarget,
            stopPropagation: noop,
            preventDefault: noop
        }

        if (touches && touches.length) {
            Object.assign(event, touches[0])
            event.touches = touches
        }
        return event
    }

    function handleProxyWithVue(e) {
        var rootVueVM = this.$root
        var type = e.type
        var target = e.target
        if (target === void 0) target = {}
        var currentTarget = e.currentTarget
        var ref = currentTarget || target
        var dataset = ref.dataset
        if (dataset === void 0) dataset = {}
        var comkey = dataset.comkey
        if (comkey === void 0) comkey = ""
        var eventid = dataset.eventid
        var vm = getVM(rootVueVM, comkey.split(","))

        if (!vm) {
            return
        }

        var webEventTypes = eventTypeMap[type] || [type]
        var handles = getHandle(vm._vnode, eventid, webEventTypes)

        // TODO, enevt 还需要处理更多
        // https://developer.mozilla.org/zh-CN/docs/Web/API/Event
        if (handles.length) {
            var event = getWebEventByMP(e)
            if (handles.length === 1) {
                var result = handles[0](event)
                return result
            }
            handles.forEach(function(h) {
                return h(event)
            })
        }
    }

    // for platforms
    // import config from 'core/config'
    // install platform specific utils
    Vue$3.config.mustUseProp = mustUseProp
    Vue$3.config.isReservedTag = isReservedTag
    Vue$3.config.isReservedAttr = isReservedAttr
    Vue$3.config.getTagNamespace = getTagNamespace
    Vue$3.config.isUnknownElement = isUnknownElement

    // install platform patch function
    Vue$3.prototype.__patch__ = patch

    // public mount method
    Vue$3.prototype.$mount = function(el, hydrating) {
        var this$1 = this

        // el = el && inBrowser ? query(el) : undefined
        // return mountComponent(this, el, hydrating)

        // 初始化小程序生命周期相关
        var options = this.$options

        if (options && (options.render || options.mpType)) {
            var mpType = options.mpType
            if (mpType === void 0) mpType = "page"
            return this._initMP(mpType, function() {
                return mountComponent(this$1, undefined, undefined)
            })
        } else {
            return mountComponent(this, undefined, undefined)
        }
    }

    // for mp
    Vue$3.prototype._initMP = initMP

    Vue$3.prototype.$updateDataToMP = updateDataToMP
    Vue$3.prototype._initDataToMP = initDataToMP

    Vue$3.prototype.$handleProxyWithVue = handleProxyWithVue

    /*  */

    return Vue$3
})

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/node-libs-browser/mock/process.js":
/*!********************************************************!*\
  !*** ./node_modules/node-libs-browser/mock/process.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.nextTick = function nextTick(fn) {
	setTimeout(fn, 0);
};

exports.platform = exports.arch = 
exports.execPath = exports.title = 'browser';
exports.pid = 1;
exports.browser = true;
exports.env = {};
exports.argv = [];

exports.binding = function (name) {
	throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    exports.cwd = function () { return cwd };
    exports.chdir = function (dir) {
        if (!path) path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
        cwd = path.resolve(dir, cwd);
    };
})();

exports.exit = exports.kill = 
exports.umask = exports.dlopen = 
exports.uptime = exports.memoryUsage = 
exports.uvCounters = function() {};
exports.features = {};


/***/ }),

/***/ "./node_modules/path-browserify/index.js":
/*!***********************************************!*\
  !*** ./node_modules/path-browserify/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node-libs-browser/mock/process.js */ "./node_modules/node-libs-browser/mock/process.js")))

/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "./node_modules/vuex/dist/vuex.esm.js":
/*!********************************************!*\
  !*** ./node_modules/vuex/dist/vuex.esm.js ***!
  \********************************************/
/*! exports provided: Store, install, mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (true) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (true) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (true) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (true) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (true) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
     true &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (true) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (true) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (true) {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (true) {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (true) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ( true && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ( true && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["default"] = (index_esm);


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\朋友圈\\pages.json":
/*!*****************************************************!*\
  !*** C:/Users/Administrator/Desktop/朋友圈/pages.json ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\朋友圈\\static\\RongIMLib-2.4.0.js":
/*!********************************************************************!*\
  !*** C:/Users/Administrator/Desktop/朋友圈/static/RongIMLib-2.4.0.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
    说明: 请勿修改 header.js 和 footer.js
    用途: 自动拼接暴露方式
    命令: grunt release 中 concat
*/
(function(global,factory){
if(true){
module.exports=factory();
}else { var key, currentClient, isExists, tempClient, tempIMLib; }
})(window,function(){

var Polling={
SetUserStatusInput:function SetUserStatusInput(){
var a={};
this.setStatus=function(b){
a.status=b;
};
this.toArrayBuffer=function(){
return a;
};
},
SetUserStatusOutput:function SetUserStatusOutput(){
var a={};
this.setNothing=function(b){
a.nothing=b;
};
this.toArrayBuffer=function(){
return a;
};
},
GetUserStatusInput:function GetUserStatusInput(){
var a={};
this.setNothing=function(b){
a.nothing=b;
};
this.toArrayBuffer=function(){
return a;
};
},

GetUserStatusOutput:function GetUserStatusOutput(){
var a={};
this.setStatus=function(b){
a.status=b;
};
this.setSubUserId=function(b){
a.subUserId=b;
};
this.toArrayBuffer=function(){
return a;
};
},
VoipDynamicInput:function VoipDynamicInput(){
var a={};
this.setEngineType=function(b){
a.engineType=b;
};
this.setChannelName=function(b){
a.channelName=b;
};
this.setChannelExtra=function(b){
a.channelExtra=b;
};
this.toArrayBuffer=function(){
return a;
};
},
VoipDynamicOutput:function VoipDynamicOutput(){
var a={};
this.setDynamicKey=function(b){
a.dynamicKey=b;
};
this.toArrayBuffer=function(){
return a;
};
},
SubUserStatusInput:function SubUserStatusInput(){
var a={};
this.setUserid=function(b){
a.userid=b;
};
this.toArrayBuffer=function(){
return a;
};
},
SubUserStatusOutput:function SubUserStatusOutput(){
var a={};
this.setNothing=function(b){
a.nothing=b;
};
this.toArrayBuffer=function(){
return a;
};
},
CleanHisMsgInput:function CleanHisMsgInput(){
var a={};
this.setTargetId=function(b){
a.targetId=b;
};
this.setDataTime=function(b){
a.dataTime=b;
};
this.setConversationType=function(b){
a.conversationType=b;
};
this.toArrayBuffer=function(){
return a;
};
},
DeleteMsgInput:function DeleteMsgInput(){
var a={};
this.setType=function(b){
a.type=b;
};
this.setConversationId=function(b){
a.conversationId=b;
};
this.setMsgs=function(b){
a.msgs=b;
};
this.toArrayBuffer=function(){
return a;
};
},
DeleteMsg:function DeleteMsg(){
var a={};
this.setMsgId=function(b){
a.msgId=b;
};
this.setMsgDataTime=function(b){
a.msgDataTime=b;
};
this.setDirect=function(b){
a.direct=b;
};
this.toArrayBuffer=function(){
return a;
};
},
DeleteMsgOutput:function DeleteMsgOutput(){
var a={};
this.setNothing=function(b){
a.nothing=b;
};
this.toArrayBuffer=function(){
return a;
};
},
SearchMpInput:function SearchMpInput(){
var a={};
this.setType=function(b){
a.type=b;
};
this.setId=function(b){
a.id=b;
};
this.toArrayBuffer=function(){
return a;
};
},
SearchMpOutput:function SearchMpOutput(){
var a={};
this.setNothing=function(b){
a.nothing=b;
};
this.setInfo=function(b){
a.info=b;
};
this.toArrayBuffer=function(){
return a;
};
},
MpInfo:function MpInfo(){
var a={};
this.setMpid=function(b){
a.mpid=b;
};
this.setName=function(b){
a.name=b;
};
this.setType=function(b){
a.type=b;
};
this.setTime=function(b){
a.time=b;
};
this.setPortraitUri=function(b){
a.portraitUrl=b;
};
this.setExtra=function(b){
a.extra=b;
};
this.toArrayBuffer=function(){
return a;
};
},
PullMpInput:function PullMpInput(){
var a={};
this.setMpid=function(b){
a.mpid=b;
};
this.setTime=function(b){
a.time=b;
};
this.toArrayBuffer=function(){
return a;
};
},
PullMpOutput:function PullMpOutput(){
var a={};
this.setStatus=function(b){
a.status=b;
};
this.setInfo=function(b){
a.info=b;
};
this.toArrayBuffer=function(){
return a;
};
},
MPFollowInput:function MPFollowInput(){
var a={};
this.setId=function(b){
a.id=b;
};
this.toArrayBuffer=function(){
return a;
};
},
MPFollowOutput:function MPFollowOutput(){
var a={};
this.setNothing=function(b){
a.nothing=b;
};
this.setInfo=function(b){
a.info=b;
};
this.toArrayBuffer=function(){
return a;
};
},
NotifyMsg:function NotifyMsg(){
var a={};
this.setType=function(b){
a.type=b;
};
this.setTime=function(b){
a.time=b;
};
this.setChrmId=function(b){
a.chrmId=b;
};
this.toArrayBuffer=function(){
return a;
};
},
SyncRequestMsg:function SyncRequestMsg(){
var a={};
this.setSyncTime=function(b){
a.syncTime=b||0;
};
this.setIspolling=function(b){
a.ispolling=!!b;
};
this.setIsweb=function(b){
a.isweb=!!b;
};
this.setIsPullSend=function(b){
a.isPullSend=!!b;
};
this.setSendBoxSyncTime=function(b){
a.sendBoxSyncTime=b;
};
this.toArrayBuffer=function(){
return a;
};
},
UpStreamMessage:function UpStreamMessage(){
var a={};
this.setSessionId=function(b){
a.sessionId=b;
};
this.setClassname=function(b){
a.classname=b;
};
this.setContent=function(b){
if(b)a.content=b;
};
this.setPushText=function(b){
a.pushText=b;
};
this.setUserId=function(b){
a.userId=b;
};
this.setAppData=function(b){
a.appData=b;
};
this.toArrayBuffer=function(){
return a;
};
},
DownStreamMessages:function DownStreamMessages(){
var a={};
this.setList=function(b){
a.list=b;
};
this.setSyncTime=function(b){
a.syncTime=b;
};
this.setFinished=function(b){
a.finished=b;
};
this.toArrayBuffer=function(){
return a;
};
},
DownStreamMessage:function DownStreamMessage(){
var a={};
this.setFromUserId=function(b){
a.fromUserId=b;
};
this.setType=function(b){
a.type=b;
};
this.setGroupId=function(b){
a.groupId=b;
};
this.setClassname=function(b){
a.classname=b;
};
this.setContent=function(b){
if(b)
a.content=b;
};
this.setDataTime=function(b){
a.dataTime=b;
};
this.setStatus=function(b){
a.status=b;
};
this.setMsgId=function(b){
a.msgId=b;
};
this.toArrayBuffer=function(){
return a;
};
},
CreateDiscussionInput:function CreateDiscussionInput(){
var a={};
this.setName=function(b){
a.name=b;
};
this.toArrayBuffer=function(){
return a;
};
},
CreateDiscussionOutput:function CreateDiscussionOutput(){
var a={};
this.setId=function(b){
a.id=b;
};
this.toArrayBuffer=function(){
return a;
};
},
ChannelInvitationInput:function ChannelInvitationInput(){
var a={};
this.setUsers=function(b){
a.users=b;
};
this.toArrayBuffer=function(){
return a;
};
},
LeaveChannelInput:function LeaveChannelInput(){
var a={};
this.setNothing=function(b){
a.nothing=b;
};
this.toArrayBuffer=function(){
return a;
};
},
QueryChatroomInfoInput:function QueryChatroomInfoInput(){
var a={};
this.setCount=function(b){
a.count=b;
};
this.setOrder=function(b){
a.order=b;
};
this.toArrayBuffer=function(){
return a;
};
},
QueryChatroomInfoOutput:function QueryChatroomInfoOutput(){
var a={};
this.setUserTotalNums=function(b){
a.userTotalNums=b;
};
this.setUserInfos=function(b){
a.userInfos=b;
};
this.toArrayBuffer=function(){
return a;
};
},
ChannelEvictionInput:function ChannelEvictionInput(){
var a={};
this.setUser=function(b){
a.user=b;
};
this.toArrayBuffer=function(){
return a;
};
},
RenameChannelInput:function RenameChannelInput(){
var a={};
this.setName=function(b){
a.name=b;
};
this.toArrayBuffer=function(){
return a;
};
},
ChannelInfoInput:function ChannelInfoInput(){
var a={};
this.setNothing=function(b){
a.nothing=b;
};
this.toArrayBuffer=function(){
return a;
};
},
ChannelInfoOutput:function ChannelInfoOutput(){
var a={};
this.setType=function(b){
a.type=b;
};
this.setChannelId=function(b){
a.channelId=b;
};
this.setChannelName=function(b){
a.channelName=b;
};
this.setAdminUserId=function(b){
a.adminUserId=b;
};
this.setFirstTenUserIds=function(b){
a.firstTenUserIds=b;
};
this.setOpenStatus=function(b){
a.openStatus=b;
};
this.toArrayBuffer=function(){
return a;
};
},
ChannelInfosInput:function ChannelInfosInput(){
var a={};
this.setPage=function(b){
a.page=b;
};
this.setNumber=function(b){
a.number=b;
};
this.toArrayBuffer=function(){
return a;
};
},
ChannelInfosOutput:function ChannelInfosOutput(){
var a={};
this.setChannels=function(b){
a.channels=b;
};
this.setTotal=function(b){
a.total=b;
};
this.toArrayBuffer=function(){
return a;
};
},
MemberInfo:function MemberInfo(){
var a={};
this.setUserId=function(b){
a.userId=b;
};
this.setUserName=function(b){
a.userName=b;
};
this.setUserPortrait=function(b){
a.userPortrait=b;
};
this.setExtension=function(b){
a.extension=b;
};
this.toArrayBuffer=function(){
return a;
};
},
GroupMembersInput:function GroupMembersInput(){
var a={};
this.setPage=function(b){
a.page=b;
};
this.setNumber=function(b){
a.number=b;
};
this.toArrayBuffer=function(){
return a;
};
},
GroupMembersOutput:function GroupMembersOutput(){
var a={};
this.setMembers=function(b){
a.members=b;
};
this.setTotal=function(b){
a.total=b;
};
this.toArrayBuffer=function(){
return a;
};
},
GetUserInfoInput:function GetUserInfoInput(){
var a={};
this.setNothing=function(b){
a.nothing=b;
};
this.toArrayBuffer=function(){
return a;
};
},
GetUserInfoOutput:function GetUserInfoOutput(){
var a={};
this.setUserId=function(b){
a.userId=b;
};
this.setUserName=function(b){
a.userName=b;
};
this.setUserPortrait=function(b){
a.userPortrait=b;
};
this.toArrayBuffer=function(){
return a;
};
},
GetSessionIdInput:function GetSessionIdInput(){
var a={};
this.setNothing=function(b){
a.nothing=b;
};
this.toArrayBuffer=function(){
return a;
};
},
GetSessionIdOutput:function GetSessionIdOutput(){
var a={};
this.setSessionId=function(b){
a.sessionId=b;
};
this.toArrayBuffer=function(){
return a;
};
},
GetQNupTokenInput:function GetQNupTokenInput(){
var a={};
this.setType=function(b){
a.type=b;
};
this.toArrayBuffer=function(){
return a;
};
},
GetQNupTokenOutput:function GetQNupTokenOutput(){
var a={};
this.setDeadline=function(b){
a.deadline=b;
};
this.setToken=function(b){
a.token=b;
};
this.toArrayBuffer=function(){
return a;
};
},
GetQNdownloadUrlInput:function GetQNdownloadUrlInput(){
var a={};
this.setType=function(b){
a.type=b;
};
this.setKey=function(b){
a.key=b;
};
this.setFileName=function(b){
a.fileName=b;
};
this.toArrayBuffer=function(){
return a;
};
},
GetQNdownloadUrlOutput:function GetQNdownloadUrlOutput(){
var a={};
this.setDownloadUrl=function(b){
a.downloadUrl=b;
};
this.toArrayBuffer=function(){
return a;
};
},
Add2BlackListInput:function Add2BlackListInput(){
var a={};
this.setUserId=function(b){
a.userId=b;
};
this.toArrayBuffer=function(){
return a;
};
},
RemoveFromBlackListInput:function RemoveFromBlackListInput(){
var a={};
this.setUserId=function(b){
a.userId=b;
};
this.toArrayBuffer=function(){
return a;
};
},
QueryBlackListInput:function QueryBlackListInput(){
var a={};
this.setNothing=function(b){
a.nothing=b;
};
this.toArrayBuffer=function(){
return a;
};
},
QueryBlackListOutput:function QueryBlackListOutput(){
var a={};
this.setUserIds=function(b){
a.userIds=b;
};
this.toArrayBuffer=function(){
return a;
};
},
BlackListStatusInput:function BlackListStatusInput(){
var a={};
this.setUserId=function(b){
a.userId=b;
};
this.toArrayBuffer=function(){
return a;
};
},
BlockPushInput:function BlockPushInput(){
var a={};
this.setBlockeeId=function(b){
a.blockeeId=b;
};
this.toArrayBuffer=function(){
return a;
};
},
ModifyPermissionInput:function ModifyPermissionInput(){
var a={};
this.setOpenStatus=function(b){
a.openStatus=b;
};
this.toArrayBuffer=function(){
return a;
};
},
GroupInput:function GroupInput(){
var a={};
this.setGroupInfo=function(b){
for(var i=0,arr=[];i<b.length;i++){
arr.push({id:b[i].getContent().id,name:b[i].getContent().name});
}
a.groupInfo=arr;
};
this.toArrayBuffer=function(){
return a;
};
},
GroupOutput:function GroupOutput(){
var a={};
this.setNothing=function(b){
a.nothing=b;
};
this.toArrayBuffer=function(){
return a;
};
},
GroupInfo:function GroupInfo(){
var a={};
this.setId=function(b){
a.id=b;
};
this.setName=function(b){
a.name=b;
};
this.getContent=function(){
return a;
};
this.toArrayBuffer=function(){
return a;
};
},
GroupHashInput:function GroupHashInput(){
var a={};
this.setUserId=function(b){
a.userId=b;
};
this.setGroupHashCode=function(b){
a.groupHashCode=b;
};
this.toArrayBuffer=function(){
return a;
};
},
GroupHashOutput:function GroupHashOutput(){
var a={};
this.setResult=function(b){
a.result=b;
};
this.toArrayBuffer=function(){
return a;
};
},
ChrmInput:function ChrmInput(){
var a={};
this.setNothing=function(b){
a.nothing=b;
};
this.toArrayBuffer=function(){
return a;
};
},
ChrmOutput:function ChrmOutput(){
var a={};
this.setNothing=function(b){
a.nothing=b;
};
this.toArrayBuffer=function(){
return a;
};
},
ChrmPullMsg:function ChrmPullMsg(){
var a={};
this.setSyncTime=function(b){
a.syncTime=b;
};
this.setCount=function(b){
a.count=b;
};
this.toArrayBuffer=function(){
return a;
};
},
RelationsInput:function RelationsInput(){
var a={};
this.setType=function(b){
a.type=b;
};
this.setMsg=function(b){
a.msg=b;
};
this.setCount=function(b){
a.count=b;
};
this.toArrayBuffer=function(){
return a;
};
},
RelationsOutput:function RelationsOutput(){
var a={};
this.setInfo=function(b){
a.info=b;
};
this.toArrayBuffer=function(){
return a;
};
},
RelationInfo:function RelationInfo(){
var a={};
this.setType=function(b){
a.type=b;
};
this.setUserId=function(b){
a.userId=b;
};
this.setMsg=function(b){
a.msg=b;
};
this.toArrayBuffer=function(){
return a;
};
},
HistoryMessageInput:function HistoryMessageInput(){
var a={};
this.setTargetId=function(b){
a.targetId=b;
};
this.setDataTime=function(b){
a.dataTime=b;
};
this.setSize=function(b){
a.size=b;
};
this.toArrayBuffer=function(){
return a;
};
},
HistoryMessagesOuput:function HistoryMessagesOuput(){
var a={};
this.setList=function(b){
a.list=b;
};
this.setSyncTime=function(b){
a.syncTime=b;
};
this.setHasMsg=function(b){
a.hasMsg=b;
};
this.toArrayBuffer=function(){
return a;
};
},
HistoryMsgInput:function HistoryMsgInput(){
var a={};
this.setTargetId=function(b){
a.targetId=b;
};
this.setTime=function(b){
a.time=b;
};
this.setCount=function(b){
a.count=b;
};
this.setOrder=function(b){
a.order=b;
};
this.toArrayBuffer=function(){
return a;
};
},
HistoryMsgOuput:function HistoryMsgOuput(){
var a={};
this.setList=function(b){
a.list=b;
};
this.setSyncTime=function(b){
a.syncTime=b;
};
this.setHasMsg=function(b){
a.hasMsg=b;
};
this.toArrayBuffer=function(){
return a;
};
}};

for(var f in Polling){
Polling[f].decode=function(b){
var back={},val=JSON.parse(b)||eval("("+b+")");
for(var i in val){
back[i]=val[i];
back["get"+i.charAt(0).toUpperCase()+i.slice(1)]=function(){
return val[i];
};
}
return back;
};
}

/*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*jslint bitwise: true */
/*global unescape, define, module */

var md5=function(){
'use strict';

/*
    * Add integers, wrapping at 2^32. This uses 16-bit operations internally
    * to work around bugs in some JS interpreters.
    */
function safe_add(x,y){
var lsw=(x&0xFFFF)+(y&0xFFFF),
msw=(x>>16)+(y>>16)+(lsw>>16);
return msw<<16|lsw&0xFFFF;
}

/*
    * Bitwise rotate a 32-bit number to the left.
    */
function bit_rol(num,cnt){
return num<<cnt|num>>>32-cnt;
}

/*
    * These functions implement the four basic operations the algorithm uses.
    */
function md5_cmn(q,a,b,x,s,t){
return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b);
}
function md5_ff(a,b,c,d,x,s,t){
return md5_cmn(b&c|~b&d,a,b,x,s,t);
}
function md5_gg(a,b,c,d,x,s,t){
return md5_cmn(b&d|c&~d,a,b,x,s,t);
}
function md5_hh(a,b,c,d,x,s,t){
return md5_cmn(b^c^d,a,b,x,s,t);
}
function md5_ii(a,b,c,d,x,s,t){
return md5_cmn(c^(b|~d),a,b,x,s,t);
}

/*
    * Calculate the MD5 of an array of little-endian words, and a bit length.
    */
function binl_md5(x,len){
/* append padding */
x[len>>5]|=0x80<<len%32;
x[(len+64>>>9<<4)+14]=len;

var i,olda,oldb,oldc,oldd,
a=1732584193,
b=-271733879,
c=-1732584194,
d=271733878;

for(i=0;i<x.length;i+=16){
olda=a;
oldb=b;
oldc=c;
oldd=d;

a=md5_ff(a,b,c,d,x[i],7,-680876936);
d=md5_ff(d,a,b,c,x[i+1],12,-389564586);
c=md5_ff(c,d,a,b,x[i+2],17,606105819);
b=md5_ff(b,c,d,a,x[i+3],22,-1044525330);
a=md5_ff(a,b,c,d,x[i+4],7,-176418897);
d=md5_ff(d,a,b,c,x[i+5],12,1200080426);
c=md5_ff(c,d,a,b,x[i+6],17,-1473231341);
b=md5_ff(b,c,d,a,x[i+7],22,-45705983);
a=md5_ff(a,b,c,d,x[i+8],7,1770035416);
d=md5_ff(d,a,b,c,x[i+9],12,-1958414417);
c=md5_ff(c,d,a,b,x[i+10],17,-42063);
b=md5_ff(b,c,d,a,x[i+11],22,-1990404162);
a=md5_ff(a,b,c,d,x[i+12],7,1804603682);
d=md5_ff(d,a,b,c,x[i+13],12,-40341101);
c=md5_ff(c,d,a,b,x[i+14],17,-1502002290);
b=md5_ff(b,c,d,a,x[i+15],22,1236535329);

a=md5_gg(a,b,c,d,x[i+1],5,-165796510);
d=md5_gg(d,a,b,c,x[i+6],9,-1069501632);
c=md5_gg(c,d,a,b,x[i+11],14,643717713);
b=md5_gg(b,c,d,a,x[i],20,-373897302);
a=md5_gg(a,b,c,d,x[i+5],5,-701558691);
d=md5_gg(d,a,b,c,x[i+10],9,38016083);
c=md5_gg(c,d,a,b,x[i+15],14,-660478335);
b=md5_gg(b,c,d,a,x[i+4],20,-405537848);
a=md5_gg(a,b,c,d,x[i+9],5,568446438);
d=md5_gg(d,a,b,c,x[i+14],9,-1019803690);
c=md5_gg(c,d,a,b,x[i+3],14,-187363961);
b=md5_gg(b,c,d,a,x[i+8],20,1163531501);
a=md5_gg(a,b,c,d,x[i+13],5,-1444681467);
d=md5_gg(d,a,b,c,x[i+2],9,-51403784);
c=md5_gg(c,d,a,b,x[i+7],14,1735328473);
b=md5_gg(b,c,d,a,x[i+12],20,-1926607734);

a=md5_hh(a,b,c,d,x[i+5],4,-378558);
d=md5_hh(d,a,b,c,x[i+8],11,-2022574463);
c=md5_hh(c,d,a,b,x[i+11],16,1839030562);
b=md5_hh(b,c,d,a,x[i+14],23,-35309556);
a=md5_hh(a,b,c,d,x[i+1],4,-1530992060);
d=md5_hh(d,a,b,c,x[i+4],11,1272893353);
c=md5_hh(c,d,a,b,x[i+7],16,-155497632);
b=md5_hh(b,c,d,a,x[i+10],23,-1094730640);
a=md5_hh(a,b,c,d,x[i+13],4,681279174);
d=md5_hh(d,a,b,c,x[i],11,-358537222);
c=md5_hh(c,d,a,b,x[i+3],16,-722521979);
b=md5_hh(b,c,d,a,x[i+6],23,76029189);
a=md5_hh(a,b,c,d,x[i+9],4,-640364487);
d=md5_hh(d,a,b,c,x[i+12],11,-421815835);
c=md5_hh(c,d,a,b,x[i+15],16,530742520);
b=md5_hh(b,c,d,a,x[i+2],23,-995338651);

a=md5_ii(a,b,c,d,x[i],6,-198630844);
d=md5_ii(d,a,b,c,x[i+7],10,1126891415);
c=md5_ii(c,d,a,b,x[i+14],15,-1416354905);
b=md5_ii(b,c,d,a,x[i+5],21,-57434055);
a=md5_ii(a,b,c,d,x[i+12],6,1700485571);
d=md5_ii(d,a,b,c,x[i+3],10,-1894986606);
c=md5_ii(c,d,a,b,x[i+10],15,-1051523);
b=md5_ii(b,c,d,a,x[i+1],21,-2054922799);
a=md5_ii(a,b,c,d,x[i+8],6,1873313359);
d=md5_ii(d,a,b,c,x[i+15],10,-30611744);
c=md5_ii(c,d,a,b,x[i+6],15,-1560198380);
b=md5_ii(b,c,d,a,x[i+13],21,1309151649);
a=md5_ii(a,b,c,d,x[i+4],6,-145523070);
d=md5_ii(d,a,b,c,x[i+11],10,-1120210379);
c=md5_ii(c,d,a,b,x[i+2],15,718787259);
b=md5_ii(b,c,d,a,x[i+9],21,-343485551);

a=safe_add(a,olda);
b=safe_add(b,oldb);
c=safe_add(c,oldc);
d=safe_add(d,oldd);
}
return[a,b,c,d];
}

/*
    * Convert an array of little-endian words to a string
    */
function binl2rstr(input){
var i,
output='';
for(i=0;i<input.length*32;i+=8){
output+=String.fromCharCode(input[i>>5]>>>i%32&0xFF);
}
return output;
}

/*
    * Convert a raw string to an array of little-endian words
    * Characters >255 have their high-byte silently ignored.
    */
function rstr2binl(input){
var i,
output=[];
output[(input.length>>2)-1]=undefined;
for(i=0;i<output.length;i+=1){
output[i]=0;
}
for(i=0;i<input.length*8;i+=8){
output[i>>5]|=(input.charCodeAt(i/8)&0xFF)<<i%32;
}
return output;
}

/*
    * Calculate the MD5 of a raw string
    */
function rstr_md5(s){
return binl2rstr(binl_md5(rstr2binl(s),s.length*8));
}

/*
    * Calculate the HMAC-MD5, of a key and some data (raw strings)
    */
function rstr_hmac_md5(key,data){
var i,
bkey=rstr2binl(key),
ipad=[],
opad=[],
hash;
ipad[15]=opad[15]=undefined;
if(bkey.length>16){
bkey=binl_md5(bkey,key.length*8);
}
for(i=0;i<16;i+=1){
ipad[i]=bkey[i]^0x36363636;
opad[i]=bkey[i]^0x5C5C5C5C;
}
hash=binl_md5(ipad.concat(rstr2binl(data)),512+data.length*8);
return binl2rstr(binl_md5(opad.concat(hash),512+128));
}

/*
    * Convert a raw string to a hex string
    */
function rstr2hex(input){
var hex_tab='0123456789abcdef',
output='',
x,
i;
for(i=0;i<input.length;i+=1){
x=input.charCodeAt(i);
output+=hex_tab.charAt(x>>>4&0x0F)+
hex_tab.charAt(x&0x0F);
}
return output;
}

/*
    * Encode a string as utf-8
    */
function str2rstr_utf8(input){
return unescape(encodeURIComponent(input));
}

/*
    * Take string arguments and return either raw or hex encoded strings
    */
function raw_md5(s){
return rstr_md5(str2rstr_utf8(s));
}
function hex_md5(s){
return rstr2hex(raw_md5(s));
}
function raw_hmac_md5(k,d){
return rstr_hmac_md5(str2rstr_utf8(k),str2rstr_utf8(d));
}
function hex_hmac_md5(k,d){
return rstr2hex(raw_hmac_md5(k,d));
}

function md5(string,key,raw){
if(!key){
if(!raw){
return hex_md5(string);
}
return raw_md5(string);
}
if(!raw){
return hex_hmac_md5(key,string);
}
return raw_hmac_md5(key,string);
}
return md5;
}();

var RongIMLib;
(function(RongIMLib){
(function(MentionedType){
MentionedType[MentionedType["ALL"]=1]="ALL";
MentionedType[MentionedType["PART"]=2]="PART";
})(RongIMLib.MentionedType||(RongIMLib.MentionedType={}));
var MentionedType=RongIMLib.MentionedType;
(function(MethodType){
MethodType[MethodType["CUSTOMER_SERVICE"]=1]="CUSTOMER_SERVICE";
MethodType[MethodType["RECALL"]=2]="RECALL";
})(RongIMLib.MethodType||(RongIMLib.MethodType={}));
var MethodType=RongIMLib.MethodType;
(function(BlacklistStatus){
/**
         * 在黑名单中。
         */
BlacklistStatus[BlacklistStatus["IN_BLACK_LIST"]=0]="IN_BLACK_LIST";
/**
         * 不在黑名单中。
         */
BlacklistStatus[BlacklistStatus["NOT_IN_BLACK_LIST"]=1]="NOT_IN_BLACK_LIST";
})(RongIMLib.BlacklistStatus||(RongIMLib.BlacklistStatus={}));
var BlacklistStatus=RongIMLib.BlacklistStatus;
(function(ConnectionChannel){
ConnectionChannel[ConnectionChannel["XHR_POLLING"]=0]="XHR_POLLING";
ConnectionChannel[ConnectionChannel["WEBSOCKET"]=1]="WEBSOCKET";
//外部调用
ConnectionChannel[ConnectionChannel["HTTP"]=0]="HTTP";
//外部调用
ConnectionChannel[ConnectionChannel["HTTPS"]=1]="HTTPS";
})(RongIMLib.ConnectionChannel||(RongIMLib.ConnectionChannel={}));
var ConnectionChannel=RongIMLib.ConnectionChannel;
(function(CustomerType){
CustomerType[CustomerType["ONLY_ROBOT"]=1]="ONLY_ROBOT";
CustomerType[CustomerType["ONLY_HUMAN"]=2]="ONLY_HUMAN";
CustomerType[CustomerType["ROBOT_FIRST"]=3]="ROBOT_FIRST";
CustomerType[CustomerType["HUMAN_FIRST"]=4]="HUMAN_FIRST";
})(RongIMLib.CustomerType||(RongIMLib.CustomerType={}));
var CustomerType=RongIMLib.CustomerType;
(function(GetChatRoomType){
GetChatRoomType[GetChatRoomType["NONE"]=0]="NONE";
GetChatRoomType[GetChatRoomType["SQQUENCE"]=1]="SQQUENCE";
GetChatRoomType[GetChatRoomType["REVERSE"]=2]="REVERSE";
})(RongIMLib.GetChatRoomType||(RongIMLib.GetChatRoomType={}));
var GetChatRoomType=RongIMLib.GetChatRoomType;
(function(ConnectionStatus){
/**
         * 连接成功。
         */
ConnectionStatus[ConnectionStatus["CONNECTED"]=0]="CONNECTED";
/**
         * 连接中。
         */
ConnectionStatus[ConnectionStatus["CONNECTING"]=1]="CONNECTING";
/**
         * 断开连接。
         */
ConnectionStatus[ConnectionStatus["DISCONNECTED"]=2]="DISCONNECTED";
/**
         * 用户账户在其他设备登录，本机会被踢掉线。
         */
ConnectionStatus[ConnectionStatus["KICKED_OFFLINE_BY_OTHER_CLIENT"]=6]="KICKED_OFFLINE_BY_OTHER_CLIENT";
/**
         * websocket 连接失败
         */
ConnectionStatus[ConnectionStatus["WEBSOCKET_UNAVAILABLE"]=7]="WEBSOCKET_UNAVAILABLE";
/**
         * 网络不可用。
         */
ConnectionStatus[ConnectionStatus["NETWORK_UNAVAILABLE"]=3]="NETWORK_UNAVAILABLE";
/**
         * 域名错误
         */
ConnectionStatus[ConnectionStatus["DOMAIN_INCORRECT"]=12]="DOMAIN_INCORRECT";
/**
        *  连接关闭。
        */
ConnectionStatus[ConnectionStatus["CONNECTION_CLOSED"]=4]="CONNECTION_CLOSED";
/*
            互踢次数过多（count > 5），此时可能出现：在其它他设备登陆有 reconnect 逻辑
        */
ConnectionStatus[ConnectionStatus["ULTRALIMIT"]=1101]="ULTRALIMIT";
/*
            开始请求导航
        */
ConnectionStatus[ConnectionStatus["REQUEST_NAVI"]=201]="REQUEST_NAVI";
/*
            请求导航结束
        */
ConnectionStatus[ConnectionStatus["RESPONSE_NAVI"]=202]="RESPONSE_NAVI";
})(RongIMLib.ConnectionStatus||(RongIMLib.ConnectionStatus={}));
var ConnectionStatus=RongIMLib.ConnectionStatus;
(function(ConversationNotificationStatus){
/**
         * 免打扰状态，关闭对应会话的通知提醒。
         */
ConversationNotificationStatus[ConversationNotificationStatus["DO_NOT_DISTURB"]=0]="DO_NOT_DISTURB";
/**
         * 提醒。
         */
ConversationNotificationStatus[ConversationNotificationStatus["NOTIFY"]=1]="NOTIFY";
})(RongIMLib.ConversationNotificationStatus||(RongIMLib.ConversationNotificationStatus={}));
var ConversationNotificationStatus=RongIMLib.ConversationNotificationStatus;
(function(ConversationType){
ConversationType[ConversationType["NONE"]=0]="NONE";
ConversationType[ConversationType["PRIVATE"]=1]="PRIVATE";
ConversationType[ConversationType["DISCUSSION"]=2]="DISCUSSION";
ConversationType[ConversationType["GROUP"]=3]="GROUP";
ConversationType[ConversationType["CHATROOM"]=4]="CHATROOM";
ConversationType[ConversationType["CUSTOMER_SERVICE"]=5]="CUSTOMER_SERVICE";
ConversationType[ConversationType["SYSTEM"]=6]="SYSTEM";
//默认关注 MC
ConversationType[ConversationType["APP_PUBLIC_SERVICE"]=7]="APP_PUBLIC_SERVICE";
//手工关注 MP
ConversationType[ConversationType["PUBLIC_SERVICE"]=8]="PUBLIC_SERVICE";
})(RongIMLib.ConversationType||(RongIMLib.ConversationType={}));
var ConversationType=RongIMLib.ConversationType;
(function(DiscussionInviteStatus){
/**
         * 开放邀请。
         */
DiscussionInviteStatus[DiscussionInviteStatus["OPENED"]=0]="OPENED";
/**
         * 关闭邀请。
         */
DiscussionInviteStatus[DiscussionInviteStatus["CLOSED"]=1]="CLOSED";
})(RongIMLib.DiscussionInviteStatus||(RongIMLib.DiscussionInviteStatus={}));
var DiscussionInviteStatus=RongIMLib.DiscussionInviteStatus;
(function(ErrorCode){
ErrorCode[ErrorCode["RECALL_MESSAGE"]=25101]="RECALL_MESSAGE";
/**
         * 发送频率过快
         */
ErrorCode[ErrorCode["SEND_FREQUENCY_TOO_FAST"]=20604]="SEND_FREQUENCY_TOO_FAST";
ErrorCode[ErrorCode["RC_MSG_UNAUTHORIZED"]=20406]="RC_MSG_UNAUTHORIZED";
/**
         * 群组 Id 无效
         */
ErrorCode[ErrorCode["RC_DISCUSSION_GROUP_ID_INVALID"]=20407]="RC_DISCUSSION_GROUP_ID_INVALID";
/**
         * 群组被禁言
         */
ErrorCode[ErrorCode["FORBIDDEN_IN_GROUP"]=22408]="FORBIDDEN_IN_GROUP";
/**
         * 不在讨论组。
         */
ErrorCode[ErrorCode["NOT_IN_DISCUSSION"]=21406]="NOT_IN_DISCUSSION";
/**
         * 不在群组。
         */
ErrorCode[ErrorCode["NOT_IN_GROUP"]=22406]="NOT_IN_GROUP";
/**
         * 不在聊天室。
         */
ErrorCode[ErrorCode["NOT_IN_CHATROOM"]=23406]="NOT_IN_CHATROOM";
/**
         *聊天室被禁言
         */
ErrorCode[ErrorCode["FORBIDDEN_IN_CHATROOM"]=23408]="FORBIDDEN_IN_CHATROOM";
/**
         * 聊天室中成员被踢出
         */
ErrorCode[ErrorCode["RC_CHATROOM_USER_KICKED"]=23409]="RC_CHATROOM_USER_KICKED";
/**
         * 聊天室不存在
         */
ErrorCode[ErrorCode["RC_CHATROOM_NOT_EXIST"]=23410]="RC_CHATROOM_NOT_EXIST";
/**
         * 聊天室成员已满
         */
ErrorCode[ErrorCode["RC_CHATROOM_IS_FULL"]=23411]="RC_CHATROOM_IS_FULL";
/**
         * 获取聊天室信息参数无效
         */
ErrorCode[ErrorCode["RC_CHATROOM_PATAMETER_INVALID"]=23412]="RC_CHATROOM_PATAMETER_INVALID";
/**
         * 聊天室异常
         */
ErrorCode[ErrorCode["CHATROOM_GET_HISTORYMSG_ERROR"]=23413]="CHATROOM_GET_HISTORYMSG_ERROR";
/**
         * 没有打开聊天室消息存储
         */
ErrorCode[ErrorCode["CHATROOM_NOT_OPEN_HISTORYMSG_STORE"]=23414]="CHATROOM_NOT_OPEN_HISTORYMSG_STORE";
/**
         * 敏感词屏蔽
         */
ErrorCode[ErrorCode["SENSITIVE_SHIELD"]=21501]="SENSITIVE_SHIELD";
ErrorCode[ErrorCode["SENSITIVE_REPLACE"]=21502]="SENSITIVE_REPLACE";
ErrorCode[ErrorCode["TIMEOUT"]=-1]="TIMEOUT";
/**
         * 未知原因失败。
         */
ErrorCode[ErrorCode["UNKNOWN"]=-2]="UNKNOWN";
/**
         * 加入讨论失败
         */
ErrorCode[ErrorCode["JOIN_IN_DISCUSSION"]=21407]="JOIN_IN_DISCUSSION";
/**
         * 创建讨论组失败
         */
ErrorCode[ErrorCode["CREATE_DISCUSSION"]=21408]="CREATE_DISCUSSION";
/**
         * 设置讨论组邀请状态失败
         */
ErrorCode[ErrorCode["INVITE_DICUSSION"]=21409]="INVITE_DICUSSION";
/**
         *获取用户失败
         */
ErrorCode[ErrorCode["GET_USERINFO_ERROR"]=23407]="GET_USERINFO_ERROR";
/**
         * 在黑名单中。
         */
ErrorCode[ErrorCode["REJECTED_BY_BLACKLIST"]=405]="REJECTED_BY_BLACKLIST";
/**
         * 通信过程中，当前 Socket 不存在。
         */
ErrorCode[ErrorCode["RC_NET_CHANNEL_INVALID"]=30001]="RC_NET_CHANNEL_INVALID";
/**
         * Socket 连接不可用。
         */
ErrorCode[ErrorCode["RC_NET_UNAVAILABLE"]=30002]="RC_NET_UNAVAILABLE";
/**
         * 通信超时。
         */
ErrorCode[ErrorCode["RC_MSG_RESP_TIMEOUT"]=30003]="RC_MSG_RESP_TIMEOUT";
/**
         * 导航操作时，Http 请求失败。
         */
ErrorCode[ErrorCode["RC_HTTP_SEND_FAIL"]=30004]="RC_HTTP_SEND_FAIL";
/**
         * HTTP 请求失败。
         */
ErrorCode[ErrorCode["RC_HTTP_REQ_TIMEOUT"]=30005]="RC_HTTP_REQ_TIMEOUT";
/**
         * HTTP 接收失败。
         */
ErrorCode[ErrorCode["RC_HTTP_RECV_FAIL"]=30006]="RC_HTTP_RECV_FAIL";
/**
         * 导航操作的 HTTP 请求，返回不是200。
         */
ErrorCode[ErrorCode["RC_NAVI_RESOURCE_ERROR"]=30007]="RC_NAVI_RESOURCE_ERROR";
/**
         * 导航数据解析后，其中不存在有效数据。
         */
ErrorCode[ErrorCode["RC_NODE_NOT_FOUND"]=30008]="RC_NODE_NOT_FOUND";
/**
         * 导航数据解析后，其中不存在有效 IP 地址。
         */
ErrorCode[ErrorCode["RC_DOMAIN_NOT_RESOLVE"]=30009]="RC_DOMAIN_NOT_RESOLVE";
/**
         * 创建 Socket 失败。
         */
ErrorCode[ErrorCode["RC_SOCKET_NOT_CREATED"]=30010]="RC_SOCKET_NOT_CREATED";
/**
         * Socket 被断开。
         */
ErrorCode[ErrorCode["RC_SOCKET_DISCONNECTED"]=30011]="RC_SOCKET_DISCONNECTED";
/**
         * PING 操作失败。
         */
ErrorCode[ErrorCode["RC_PING_SEND_FAIL"]=30012]="RC_PING_SEND_FAIL";
/**
         * PING 超时。
         */
ErrorCode[ErrorCode["RC_PONG_RECV_FAIL"]=30013]="RC_PONG_RECV_FAIL";
/**
         * 消息发送失败。
         */
ErrorCode[ErrorCode["RC_MSG_SEND_FAIL"]=30014]="RC_MSG_SEND_FAIL";
/**
         * 做 connect 连接时，收到的 ACK 超时。
         */
ErrorCode[ErrorCode["RC_CONN_ACK_TIMEOUT"]=31000]="RC_CONN_ACK_TIMEOUT";
/**
         * 参数错误。
         */
ErrorCode[ErrorCode["RC_CONN_PROTO_VERSION_ERROR"]=31001]="RC_CONN_PROTO_VERSION_ERROR";
/**
         * 参数错误，App Id 错误。
         */
ErrorCode[ErrorCode["RC_CONN_ID_REJECT"]=31002]="RC_CONN_ID_REJECT";
/**
         * 服务器不可用。
         */
ErrorCode[ErrorCode["RC_CONN_SERVER_UNAVAILABLE"]=31003]="RC_CONN_SERVER_UNAVAILABLE";
/**
         * Token 错误。
         */
ErrorCode[ErrorCode["RC_CONN_USER_OR_PASSWD_ERROR"]=31004]="RC_CONN_USER_OR_PASSWD_ERROR";
/**
         * App Id 与 Token 不匹配。
         */
ErrorCode[ErrorCode["RC_CONN_NOT_AUTHRORIZED"]=31005]="RC_CONN_NOT_AUTHRORIZED";
/**
         * 重定向，地址错误。
         */
ErrorCode[ErrorCode["RC_CONN_REDIRECTED"]=31006]="RC_CONN_REDIRECTED";
/**
         * NAME 与后台注册信息不一致。
         */
ErrorCode[ErrorCode["RC_CONN_PACKAGE_NAME_INVALID"]=31007]="RC_CONN_PACKAGE_NAME_INVALID";
/**
         * APP 被屏蔽、删除或不存在。
         */
ErrorCode[ErrorCode["RC_CONN_APP_BLOCKED_OR_DELETED"]=31008]="RC_CONN_APP_BLOCKED_OR_DELETED";
/**
         * 用户被屏蔽。
         */
ErrorCode[ErrorCode["RC_CONN_USER_BLOCKED"]=31009]="RC_CONN_USER_BLOCKED";
/**
         * Disconnect，由服务器返回，比如用户互踢。
         */
ErrorCode[ErrorCode["RC_DISCONN_KICK"]=31010]="RC_DISCONN_KICK";
/**
         * Disconnect，由服务器返回，比如用户互踢。
         */
ErrorCode[ErrorCode["RC_DISCONN_EXCEPTION"]=31011]="RC_DISCONN_EXCEPTION";
/**
         * 协议层内部错误。query，上传下载过程中数据错误。
         */
ErrorCode[ErrorCode["RC_QUERY_ACK_NO_DATA"]=32001]="RC_QUERY_ACK_NO_DATA";
/**
         * 协议层内部错误。
         */
ErrorCode[ErrorCode["RC_MSG_DATA_INCOMPLETE"]=32002]="RC_MSG_DATA_INCOMPLETE";
/**
         * 未调用 init 初始化函数。
         */
ErrorCode[ErrorCode["BIZ_ERROR_CLIENT_NOT_INIT"]=33001]="BIZ_ERROR_CLIENT_NOT_INIT";
/**
         * 数据库初始化失败。
         */
ErrorCode[ErrorCode["BIZ_ERROR_DATABASE_ERROR"]=33002]="BIZ_ERROR_DATABASE_ERROR";
/**
         * 传入参数无效。
         */
ErrorCode[ErrorCode["BIZ_ERROR_INVALID_PARAMETER"]=33003]="BIZ_ERROR_INVALID_PARAMETER";
/**
         * 通道无效。
         */
ErrorCode[ErrorCode["BIZ_ERROR_NO_CHANNEL"]=33004]="BIZ_ERROR_NO_CHANNEL";
/**
         * 重新连接成功。
         */
ErrorCode[ErrorCode["BIZ_ERROR_RECONNECT_SUCCESS"]=33005]="BIZ_ERROR_RECONNECT_SUCCESS";
/**
         * 连接中，再调用 connect 被拒绝。
         */
ErrorCode[ErrorCode["BIZ_ERROR_CONNECTING"]=33006]="BIZ_ERROR_CONNECTING";
/**
         * 消息漫游服务未开通
         */
ErrorCode[ErrorCode["MSG_ROAMING_SERVICE_UNAVAILABLE"]=33007]="MSG_ROAMING_SERVICE_UNAVAILABLE";
ErrorCode[ErrorCode["MSG_INSERT_ERROR"]=33008]="MSG_INSERT_ERROR";
ErrorCode[ErrorCode["MSG_DEL_ERROR"]=33009]="MSG_DEL_ERROR";
/**
         * 删除会话失败
         */
ErrorCode[ErrorCode["CONVER_REMOVE_ERROR"]=34001]="CONVER_REMOVE_ERROR";
/**
         *拉取历史消息
         */
ErrorCode[ErrorCode["CONVER_GETLIST_ERROR"]=34002]="CONVER_GETLIST_ERROR";
/**
         * 会话指定异常
         */
ErrorCode[ErrorCode["CONVER_SETOP_ERROR"]=34003]="CONVER_SETOP_ERROR";
/**
         * 获取会话未读消息总数失败
         */
ErrorCode[ErrorCode["CONVER_TOTAL_UNREAD_ERROR"]=34004]="CONVER_TOTAL_UNREAD_ERROR";
/**
         * 获取指定会话类型未读消息数异常
         */
ErrorCode[ErrorCode["CONVER_TYPE_UNREAD_ERROR"]=34005]="CONVER_TYPE_UNREAD_ERROR";
/**
         * 获取指定用户ID&会话类型未读消息数异常
         */
ErrorCode[ErrorCode["CONVER_ID_TYPE_UNREAD_ERROR"]=34006]="CONVER_ID_TYPE_UNREAD_ERROR";
ErrorCode[ErrorCode["CONVER_CLEAR_ERROR"]=34007]="CONVER_CLEAR_ERROR";
ErrorCode[ErrorCode["CLEAR_HIS_ERROR"]=34010]="CLEAR_HIS_ERROR";
ErrorCode[ErrorCode["CLEAR_HIS_TYPE_ERROR"]=34008]="CLEAR_HIS_TYPE_ERROR";
ErrorCode[ErrorCode["CLEAR_HIS_TIME_ERROR"]=34011]="CLEAR_HIS_TIME_ERROR";
/*
            
        */
ErrorCode[ErrorCode["CONVER_GET_ERROR"]=34009]="CONVER_GET_ERROR";
//群组异常信息
/**
         *
         */
ErrorCode[ErrorCode["GROUP_SYNC_ERROR"]=35001]="GROUP_SYNC_ERROR";
/**
         * 匹配群信息异常
         */
ErrorCode[ErrorCode["GROUP_MATCH_ERROR"]=35002]="GROUP_MATCH_ERROR";
//聊天室异常
/**
         * 加入聊天室Id为空
         */
ErrorCode[ErrorCode["CHATROOM_ID_ISNULL"]=36001]="CHATROOM_ID_ISNULL";
/**
         * 加入聊天室失败
         */
ErrorCode[ErrorCode["CHARTOOM_JOIN_ERROR"]=36002]="CHARTOOM_JOIN_ERROR";
/**
         * 拉取聊天室历史消息失败
         */
ErrorCode[ErrorCode["CHATROOM_HISMESSAGE_ERROR"]=36003]="CHATROOM_HISMESSAGE_ERROR";
//黑名单异常
/**
         * 加入黑名单异常
         */
ErrorCode[ErrorCode["BLACK_ADD_ERROR"]=37001]="BLACK_ADD_ERROR";
/**
         * 获得指定人员再黑名单中的状态异常
         */
ErrorCode[ErrorCode["BLACK_GETSTATUS_ERROR"]=37002]="BLACK_GETSTATUS_ERROR";
/**
         * 移除黑名单异常
         */
ErrorCode[ErrorCode["BLACK_REMOVE_ERROR"]=37003]="BLACK_REMOVE_ERROR";
/**
         * 获取草稿失败
         */
ErrorCode[ErrorCode["DRAF_GET_ERROR"]=38001]="DRAF_GET_ERROR";
/**
         * 保存草稿失败
         */
ErrorCode[ErrorCode["DRAF_SAVE_ERROR"]=38002]="DRAF_SAVE_ERROR";
/**
         * 删除草稿失败
         */
ErrorCode[ErrorCode["DRAF_REMOVE_ERROR"]=38003]="DRAF_REMOVE_ERROR";
/**
         * 关注公众号失败
         */
ErrorCode[ErrorCode["SUBSCRIBE_ERROR"]=39001]="SUBSCRIBE_ERROR";
/**
         * 关注公众号失败
         */
ErrorCode[ErrorCode["QNTKN_FILETYPE_ERROR"]=41001]="QNTKN_FILETYPE_ERROR";
/**
         * 获取七牛token失败
         */
ErrorCode[ErrorCode["QNTKN_GET_ERROR"]=41002]="QNTKN_GET_ERROR";
/**
         * cookie被禁用
         */
ErrorCode[ErrorCode["COOKIE_ENABLE"]=51001]="COOKIE_ENABLE";
ErrorCode[ErrorCode["GET_MESSAGE_BY_ID_ERROR"]=61001]="GET_MESSAGE_BY_ID_ERROR";
// 没有注册DeviveId 也就是用户没有登陆
ErrorCode[ErrorCode["HAVNODEVICEID"]=24001]="HAVNODEVICEID";
// 已经存在
ErrorCode[ErrorCode["DEVICEIDISHAVE"]=24002]="DEVICEIDISHAVE";
// 成功
ErrorCode[ErrorCode["SUCCESS"]=0]="SUCCESS";
// 没有对应的用户或token
ErrorCode[ErrorCode["FEILD"]=24009]="FEILD";
// voip为空
ErrorCode[ErrorCode["VOIPISNULL"]=24013]="VOIPISNULL";
// 不支持的Voip引擎
ErrorCode[ErrorCode["NOENGINETYPE"]=24010]="NOENGINETYPE";
// channleName 是空
ErrorCode[ErrorCode["NULLCHANNELNAME"]=24011]="NULLCHANNELNAME";
// 生成Voipkey失败
ErrorCode[ErrorCode["VOIPDYANMICERROR"]=24012]="VOIPDYANMICERROR";
// 没有配置voip
ErrorCode[ErrorCode["NOVOIP"]=24014]="NOVOIP";
// 服务器内部错误
ErrorCode[ErrorCode["INTERNALERRROR"]=24015]="INTERNALERRROR";
//VOIP close
ErrorCode[ErrorCode["VOIPCLOSE"]=24016]="VOIPCLOSE";
ErrorCode[ErrorCode["CLOSE_BEFORE_OPEN"]=51001]="CLOSE_BEFORE_OPEN";
ErrorCode[ErrorCode["ALREADY_IN_USE"]=51002]="ALREADY_IN_USE";
ErrorCode[ErrorCode["INVALID_CHANNEL_NAME"]=51003]="INVALID_CHANNEL_NAME";
ErrorCode[ErrorCode["VIDEO_CONTAINER_IS_NULL"]=51004]="VIDEO_CONTAINER_IS_NULL";
/**
        * 删除消息数组长度为 0 .
        */
ErrorCode[ErrorCode["DELETE_MESSAGE_ID_IS_NULL"]=61001]="DELETE_MESSAGE_ID_IS_NULL";
/*!
        己方取消已发出的通话请求
        */
ErrorCode[ErrorCode["CANCEL"]=1]="CANCEL";
/*!
         己方拒绝收到的通话请求
         */
ErrorCode[ErrorCode["REJECT"]=2]="REJECT";
/*!
         己方挂断
         */
ErrorCode[ErrorCode["HANGUP"]=3]="HANGUP";
/*!
         己方忙碌
         */
ErrorCode[ErrorCode["BUSYLINE"]=4]="BUSYLINE";
/*!
         己方未接听
         */
ErrorCode[ErrorCode["NO_RESPONSE"]=5]="NO_RESPONSE";
/*!
         己方不支持当前引擎
         */
ErrorCode[ErrorCode["ENGINE_UN_SUPPORTED"]=6]="ENGINE_UN_SUPPORTED";
/*!
         己方网络出错
         */
ErrorCode[ErrorCode["NETWORK_ERROR"]=7]="NETWORK_ERROR";
/*!
         对方取消已发出的通话请求
         */
ErrorCode[ErrorCode["REMOTE_CANCEL"]=11]="REMOTE_CANCEL";
/*!
         对方拒绝收到的通话请求
         */
ErrorCode[ErrorCode["REMOTE_REJECT"]=12]="REMOTE_REJECT";
/*!
         通话过程对方挂断
         */
ErrorCode[ErrorCode["REMOTE_HANGUP"]=13]="REMOTE_HANGUP";
/*!
         对方忙碌
         */
ErrorCode[ErrorCode["REMOTE_BUSYLINE"]=14]="REMOTE_BUSYLINE";
/*!
         对方未接听
         */
ErrorCode[ErrorCode["REMOTE_NO_RESPONSE"]=15]="REMOTE_NO_RESPONSE";
/*!
         对方网络错误
         */
ErrorCode[ErrorCode["REMOTE_ENGINE_UN_SUPPORTED"]=16]="REMOTE_ENGINE_UN_SUPPORTED";
/*!
         对方网络错误
         */
ErrorCode[ErrorCode["REMOTE_NETWORK_ERROR"]=17]="REMOTE_NETWORK_ERROR";
/*!
         VoIP 不可用
         */
ErrorCode[ErrorCode["VOIP_NOT_AVALIABLE"]=18]="VOIP_NOT_AVALIABLE";
})(RongIMLib.ErrorCode||(RongIMLib.ErrorCode={}));
var ErrorCode=RongIMLib.ErrorCode;
(function(VoIPMediaType){
VoIPMediaType[VoIPMediaType["MEDIA_AUDIO"]=1]="MEDIA_AUDIO";
VoIPMediaType[VoIPMediaType["MEDIA_VEDIO"]=2]="MEDIA_VEDIO";
})(RongIMLib.VoIPMediaType||(RongIMLib.VoIPMediaType={}));
var VoIPMediaType=RongIMLib.VoIPMediaType;
(function(MediaType){
/**
         * 图片。
         */
MediaType[MediaType["IMAGE"]=1]="IMAGE";
/**
         * 声音。
         */
MediaType[MediaType["AUDIO"]=2]="AUDIO";
/**
         * 视频。
         */
MediaType[MediaType["VIDEO"]=3]="VIDEO";
/**
         * 通用文件。
         */
MediaType[MediaType["FILE"]=100]="FILE";
})(RongIMLib.MediaType||(RongIMLib.MediaType={}));
var MediaType=RongIMLib.MediaType;
(function(MessageDirection){
/**
         * 发送消息。
         */
MessageDirection[MessageDirection["SEND"]=1]="SEND";
/**
         * 接收消息。
         */
MessageDirection[MessageDirection["RECEIVE"]=2]="RECEIVE";
})(RongIMLib.MessageDirection||(RongIMLib.MessageDirection={}));
var MessageDirection=RongIMLib.MessageDirection;
(function(FileType){
FileType[FileType["IMAGE"]=1]="IMAGE";
FileType[FileType["AUDIO"]=2]="AUDIO";
FileType[FileType["VIDEO"]=3]="VIDEO";
FileType[FileType["FILE"]=4]="FILE";
})(RongIMLib.FileType||(RongIMLib.FileType={}));
var FileType=RongIMLib.FileType;
(function(RealTimeLocationErrorCode){
/**
         * 未初始化 RealTimeLocation 实例
         */
RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_NOT_INIT"]=-1]="RC_REAL_TIME_LOCATION_NOT_INIT";
/**
         * 执行成功。
         */
RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_SUCCESS"]=0]="RC_REAL_TIME_LOCATION_SUCCESS";
/**
         * 获取 RealTimeLocation 实例时返回
         * GPS 未打开。
         */
RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_GPS_DISABLED"]=1]="RC_REAL_TIME_LOCATION_GPS_DISABLED";
/**
         * 获取 RealTimeLocation 实例时返回
         * 当前会话不支持位置共享。
         */
RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_CONVERSATION_NOT_SUPPORT"]=2]="RC_REAL_TIME_LOCATION_CONVERSATION_NOT_SUPPORT";
/**
         * 获取 RealTimeLocation 实例时返回
         * 对方已发起位置共享。
         */
RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_IS_ON_GOING"]=3]="RC_REAL_TIME_LOCATION_IS_ON_GOING";
/**
         * Join 时返回
         * 当前位置共享已超过最大支持人数。
         */
RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_EXCEED_MAX_PARTICIPANT"]=4]="RC_REAL_TIME_LOCATION_EXCEED_MAX_PARTICIPANT";
/**
         * Join 时返回
         * 加入位置共享失败。
         */
RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_JOIN_FAILURE"]=5]="RC_REAL_TIME_LOCATION_JOIN_FAILURE";
/**
         * Start 时返回
         * 发起位置共享失败。
         */
RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_START_FAILURE"]=6]="RC_REAL_TIME_LOCATION_START_FAILURE";
/**
         * 网络不可用。
         */
RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_NETWORK_UNAVAILABLE"]=7]="RC_REAL_TIME_LOCATION_NETWORK_UNAVAILABLE";
})(RongIMLib.RealTimeLocationErrorCode||(RongIMLib.RealTimeLocationErrorCode={}));
var RealTimeLocationErrorCode=RongIMLib.RealTimeLocationErrorCode;
(function(RealTimeLocationStatus){
/**
         * 空闲状态 （默认状态）
         * 对方或者自己都未发起位置共享业务，或者位置共享业务已结束。
         */
RealTimeLocationStatus[RealTimeLocationStatus["RC_REAL_TIME_LOCATION_STATUS_IDLE"]=0]="RC_REAL_TIME_LOCATION_STATUS_IDLE";
/**
         * 呼入状态 （待加入）
         * 1. 对方发起了位置共享业务，此状态下，自己只能选择加入。
         * 2. 自己从已连接的位置共享中退出。
         */
RealTimeLocationStatus[RealTimeLocationStatus["RC_REAL_TIME_LOCATION_STATUS_INCOMING"]=1]="RC_REAL_TIME_LOCATION_STATUS_INCOMING";
/**
         * 呼出状态 =（自己创建）
         * 1. 自己发起位置共享业务，对方只能选择加入。
         * 2. 对方从已连接的位置共享业务中退出。
         */
RealTimeLocationStatus[RealTimeLocationStatus["RC_REAL_TIME_LOCATION_STATUS_OUTGOING"]=2]="RC_REAL_TIME_LOCATION_STATUS_OUTGOING";
/**
         * 连接状态 （自己加入）
         * 对方加入了自己发起的位置共享，或者自己加入了对方发起的位置共享。
         */
RealTimeLocationStatus[RealTimeLocationStatus["RC_REAL_TIME_LOCATION_STATUS_CONNECTED"]=3]="RC_REAL_TIME_LOCATION_STATUS_CONNECTED";
})(RongIMLib.RealTimeLocationStatus||(RongIMLib.RealTimeLocationStatus={}));
var RealTimeLocationStatus=RongIMLib.RealTimeLocationStatus;
(function(ReceivedStatus){
ReceivedStatus[ReceivedStatus["READ"]=1]="READ";
ReceivedStatus[ReceivedStatus["LISTENED"]=2]="LISTENED";
ReceivedStatus[ReceivedStatus["DOWNLOADED"]=4]="DOWNLOADED";
ReceivedStatus[ReceivedStatus["RETRIEVED"]=8]="RETRIEVED";
ReceivedStatus[ReceivedStatus["UNREAD"]=0]="UNREAD";
})(RongIMLib.ReceivedStatus||(RongIMLib.ReceivedStatus={}));
var ReceivedStatus=RongIMLib.ReceivedStatus;
(function(ReadStatus){
ReadStatus[ReadStatus["READ"]=1]="READ";
ReadStatus[ReadStatus["LISTENED"]=2]="LISTENED";
ReadStatus[ReadStatus["DOWNLOADED"]=4]="DOWNLOADED";
ReadStatus[ReadStatus["RETRIEVED"]=8]="RETRIEVED";
ReadStatus[ReadStatus["UNREAD"]=0]="UNREAD";
})(RongIMLib.ReadStatus||(RongIMLib.ReadStatus={}));
var ReadStatus=RongIMLib.ReadStatus;
(function(SearchType){
/**
         * 精确。
         */
SearchType[SearchType["EXACT"]=0]="EXACT";
/**
         * 模糊。
         */
SearchType[SearchType["FUZZY"]=1]="FUZZY";
})(RongIMLib.SearchType||(RongIMLib.SearchType={}));
var SearchType=RongIMLib.SearchType;
(function(SentStatus){
/**
         * 发送中。
         */
SentStatus[SentStatus["SENDING"]=10]="SENDING";
/**
         * 发送失败。
         */
SentStatus[SentStatus["FAILED"]=20]="FAILED";
/**
         * 已发送。
         */
SentStatus[SentStatus["SENT"]=30]="SENT";
/**
         * 对方已接收。
         */
SentStatus[SentStatus["RECEIVED"]=40]="RECEIVED";
/**
         * 对方已读。
         */
SentStatus[SentStatus["READ"]=50]="READ";
/**
         * 对方已销毁。
         */
SentStatus[SentStatus["DESTROYED"]=60]="DESTROYED";
})(RongIMLib.SentStatus||(RongIMLib.SentStatus={}));
var SentStatus=RongIMLib.SentStatus;
(function(ConnectionState){
ConnectionState[ConnectionState["ACCEPTED"]=0]="ACCEPTED";
ConnectionState[ConnectionState["UNACCEPTABLE_PROTOCOL_VERSION"]=1]="UNACCEPTABLE_PROTOCOL_VERSION";
ConnectionState[ConnectionState["IDENTIFIER_REJECTED"]=2]="IDENTIFIER_REJECTED";
ConnectionState[ConnectionState["SERVER_UNAVAILABLE"]=3]="SERVER_UNAVAILABLE";
/**
         * token无效
         */
ConnectionState[ConnectionState["TOKEN_INCORRECT"]=4]="TOKEN_INCORRECT";
ConnectionState[ConnectionState["NOT_AUTHORIZED"]=5]="NOT_AUTHORIZED";
ConnectionState[ConnectionState["REDIRECT"]=6]="REDIRECT";
ConnectionState[ConnectionState["PACKAGE_ERROR"]=7]="PACKAGE_ERROR";
ConnectionState[ConnectionState["APP_BLOCK_OR_DELETE"]=8]="APP_BLOCK_OR_DELETE";
ConnectionState[ConnectionState["BLOCK"]=9]="BLOCK";
ConnectionState[ConnectionState["TOKEN_EXPIRE"]=10]="TOKEN_EXPIRE";
ConnectionState[ConnectionState["DEVICE_ERROR"]=11]="DEVICE_ERROR";
})(RongIMLib.ConnectionState||(RongIMLib.ConnectionState={}));
var ConnectionState=RongIMLib.ConnectionState;
(function(RTCAPIType){
RTCAPIType[RTCAPIType["ROOM"]=1]="ROOM";
RTCAPIType[RTCAPIType["PERSON"]=2]="PERSON";
})(RongIMLib.RTCAPIType||(RongIMLib.RTCAPIType={}));
var RTCAPIType=RongIMLib.RTCAPIType;
})(RongIMLib||(RongIMLib={}));
var RongIMLib;
(function(RongIMLib){
var RongIMClient=function(){
function RongIMClient(){
}
RongIMClient.getInstance=function(){
if(!RongIMClient._instance){
throw new Error("RongIMClient is not initialized. Call .init() method first.");
}
return RongIMClient._instance;
};
RongIMClient.showError=function(errorInfo){
var hasConsole=console&&console.error;
if(hasConsole){
console.error(JSON.stringify(errorInfo));
}
};
RongIMClient.logger=function(params){
var code=params.code;
var errorInfo=RongIMClient.LogFactory[code]||params;
errorInfo.funcName=params.funcName;
errorInfo.msg=params.msg||errorInfo.msg;
if(RongIMClient._memoryStore.depend.showError){
RongIMClient.showError(errorInfo);
}
};
RongIMClient.logCallback=function(callback,funcName){
return{
onSuccess:callback.onSuccess,
onError:function onError(errorCode){
RongIMClient.logger({
code:errorCode,
funcName:funcName});

callback.onError(errorCode);
}};

};
;
RongIMClient.logSendCallback=function(callback,funcName){
return{
onSuccess:callback.onSuccess,
onError:function onError(errorCode,result){
RongIMClient.logger({
code:errorCode,
funcName:funcName});

callback.onError(errorCode,result);
},
onBefore:callback.onBefore};

};
;
/**
         * 初始化 SDK，在整个应用全局只需要调用一次。
         * @param appKey    开发者后台申请的 AppKey，用来标识应用。
         * @param dataAccessProvider 必须是DataAccessProvider的实例
         */
RongIMClient.init=function(appKey,dataAccessProvider,options,callback){
if(RongIMClient._instance){
return RongIMClient._memoryStore.sdkInfo;
}
RongIMClient._instance=new RongIMClient();
options=options||{};
var protocol="http://",wsScheme='ws://';
if(location.protocol=='https:'){
wsScheme='wss://';
protocol='https://';
}
var isPolling=false;
if(typeof WebSocket!='function'){
isPolling=true;
}
var isIntegrity=function isIntegrity(){
//iOS 9 
var hasWS=typeof WebSocket;
var integrity=typeof WebSocket.OPEN=='number';
return hasWS&&integrity;
};
if(typeof WebSocket=='object'&&isIntegrity()){
isPolling=false;
}
var supportUserData=function supportUserData(){
var element=document.documentElement;
return element.addBehavior;
};
if(RongIMLib.RongUtil.supportLocalStorage()){
RongIMClient._storageProvider=new RongIMLib.LocalStorageProvider();
}else
if(supportUserData()){
RongIMClient._storageProvider=new RongIMLib.UserDataProvider();
}else
{
RongIMClient._storageProvider=new RongIMLib.MemeoryProvider();
}
var serverIndex=RongIMClient._storageProvider.getItem('serverIndex');
RongIMClient.serverStore.index=serverIndex||0;
var pathTmpl='{0}{1}';
var _serverPath={
navi:'nav.cn.ronghub.com',
api:'api.cn.ronghub.com'};

RongIMLib.RongUtil.forEach(_serverPath,function(path,key){
_serverPath[key]=RongIMLib.RongUtil.stringFormat(pathTmpl,[protocol,path]);
});
RongIMLib.RongUtil.forEach(_serverPath,function(path,key){
var hasProto=key in options;
var config={
path:options[key],
tmpl:pathTmpl,
protocol:protocol,
sub:true};

path=hasProto?RongIMLib.RongUtil.formatProtoclPath(config):path;
options[key]=path;
});
var _sourcePath={
protobuf:'cdn.ronghub.com/protobuf-2.3.4.min.js'};

RongIMLib.RongUtil.forEach(_sourcePath,function(path,key){
_sourcePath[key]=RongIMLib.RongUtil.stringFormat(pathTmpl,[protocol,path]);
});
RongIMLib.RongUtil.extend(_sourcePath,options);
var _defaultOpts={
isPolling:isPolling,
wsScheme:wsScheme,
protocol:protocol,
showError:true,
openMp:true,
snifferTime:2000};

RongIMLib.RongUtil.extend(_defaultOpts,options);
if(RongIMLib.RongUtil.isFunction(options.protobuf)){
RongIMClient.Protobuf=options.protobuf;
}
RongIMClient.userStatusObserver=new RongIMLib.RongObserver();
var pather=new RongIMLib.FeaturePatcher();
pather.patchAll();
var tempStore={
token:"",
callback:null,
lastReadTime:new RongIMLib.LimitableMap(),
historyMessageLimit:new RongIMLib.MemoryCache(),
conversationList:[],
appKey:appKey,
publicServiceMap:new RongIMLib.PublicServiceMap(),
providerType:1,
deltaTime:0,
filterMessages:[],
isSyncRemoteConverList:true,
otherDevice:false,
custStore:{},
converStore:{latestMessage:{}},
connectAckTime:0,
voipStategy:0,
isFirstPingMsg:true,
depend:options,
listenerList:RongIMClient._memoryStore.listenerList,
notification:{}};

RongIMClient._memoryStore=tempStore;
if(dataAccessProvider&&Object.prototype.toString.call(dataAccessProvider)=="[object Object]"){
RongIMClient._dataAccessProvider=dataAccessProvider;
}else
{
RongIMClient._dataAccessProvider=new RongIMLib.ServerDataProvider();
}
options.appCallback=callback;
var sdkInfo=RongIMClient._dataAccessProvider.init(appKey,options);
RongIMClient._memoryStore.sdkInfo=sdkInfo;
// 兼容 c++ 设置导航，Web 端不生效
RongIMClient._dataAccessProvider.setServerInfo({navi:location.protocol+options.navi+'/navi.xml'});
RongIMClient.MessageParams={
TextMessage:{objectName:"RC:TxtMsg",msgTag:new RongIMLib.MessageTag(true,true)},
ImageMessage:{objectName:"RC:ImgMsg",msgTag:new RongIMLib.MessageTag(true,true)},
DiscussionNotificationMessage:{objectName:"RC:DizNtf",msgTag:new RongIMLib.MessageTag(false,true)},
VoiceMessage:{objectName:"RC:VcMsg",msgTag:new RongIMLib.MessageTag(true,true)},
RichContentMessage:{objectName:"RC:ImgTextMsg",msgTag:new RongIMLib.MessageTag(true,true)},
FileMessage:{objectName:"RC:FileMsg",msgTag:new RongIMLib.MessageTag(true,true)},
HandshakeMessage:{objectName:"",msgTag:new RongIMLib.MessageTag(true,true)},
UnknownMessage:{objectName:"",msgTag:new RongIMLib.MessageTag(true,true)},
LocationMessage:{objectName:"RC:LBSMsg",msgTag:new RongIMLib.MessageTag(true,true)},
InformationNotificationMessage:{objectName:"RC:InfoNtf",msgTag:new RongIMLib.MessageTag(false,true)},
ContactNotificationMessage:{objectName:"RC:ContactNtf",msgTag:new RongIMLib.MessageTag(false,true)},
ProfileNotificationMessage:{objectName:"RC:ProfileNtf",msgTag:new RongIMLib.MessageTag(false,true)},
CommandNotificationMessage:{objectName:"RC:CmdNtf",msgTag:new RongIMLib.MessageTag(true,true)},
PublicServiceRichContentMessage:{objectName:"RC:PSImgTxtMsg",msgTag:new RongIMLib.MessageTag(true,true)},
PublicServiceMultiRichContentMessage:{objectName:"RC:PSMultiImgTxtMsg",msgTag:new RongIMLib.MessageTag(true,true)},
JrmfRedPacketMessage:{objectName:"RCJrmf:RpMsg",msgTag:new RongIMLib.MessageTag(true,true)},
JrmfRedPacketOpenedMessage:{objectName:"RCJrmf:RpOpendMsg",msgTag:new RongIMLib.MessageTag(true,true)},
GroupNotificationMessage:{objectName:"RC:GrpNtf",msgTag:new RongIMLib.MessageTag(false,true)},
CommandMessage:{objectName:"RC:CmdMsg",msgTag:new RongIMLib.MessageTag(false,false)},
TypingStatusMessage:{objectName:"RC:TypSts",msgTag:new RongIMLib.MessageTag(false,false)},
PublicServiceCommandMessage:{objectName:"RC:PSCmd",msgTag:new RongIMLib.MessageTag(false,false)},
RecallCommandMessage:{objectName:"RC:RcCmd",msgTag:new RongIMLib.MessageTag(false,true)},
SyncReadStatusMessage:{objectName:"RC:SRSMsg",msgTag:new RongIMLib.MessageTag(false,false)},
ReadReceiptRequestMessage:{objectName:"RC:RRReqMsg",msgTag:new RongIMLib.MessageTag(false,false)},
ReadReceiptResponseMessage:{objectName:"RC:RRRspMsg",msgTag:new RongIMLib.MessageTag(false,false)},
ChangeModeResponseMessage:{objectName:"RC:CsChaR",msgTag:new RongIMLib.MessageTag(false,false)},
ChangeModeMessage:{objectName:"RC:CSCha",msgTag:new RongIMLib.MessageTag(false,false)},
EvaluateMessage:{objectName:"RC:CsEva",msgTag:new RongIMLib.MessageTag(false,false)},
CustomerContact:{objectName:"RC:CsContact",msgTag:new RongIMLib.MessageTag(false,false)},
HandShakeMessage:{objectName:"RC:CsHs",msgTag:new RongIMLib.MessageTag(false,false)},
HandShakeResponseMessage:{objectName:"RC:CsHsR",msgTag:new RongIMLib.MessageTag(false,false)},
SuspendMessage:{objectName:"RC:CsSp",msgTag:new RongIMLib.MessageTag(false,false)},
TerminateMessage:{objectName:"RC:CsEnd",msgTag:new RongIMLib.MessageTag(false,false)},
CustomerStatusUpdateMessage:{objectName:"RC:CsUpdate",msgTag:new RongIMLib.MessageTag(false,false)},
ReadReceiptMessage:{objectName:"RC:ReadNtf",msgTag:new RongIMLib.MessageTag(false,false)}};

RongIMClient.MessageParams["AcceptMessage"]={objectName:"RC:VCAccept",msgTag:new RongIMLib.MessageTag(false,false)};
RongIMClient.MessageParams["RingingMessage"]={objectName:"RC:VCRinging",msgTag:new RongIMLib.MessageTag(false,false)};
RongIMClient.MessageParams["SummaryMessage"]={objectName:"RC:VCSummary",msgTag:new RongIMLib.MessageTag(false,false)};
RongIMClient.MessageParams["HungupMessage"]={objectName:"RC:VCHangup",msgTag:new RongIMLib.MessageTag(false,false)};
RongIMClient.MessageParams["InviteMessage"]={objectName:"RC:VCInvite",msgTag:new RongIMLib.MessageTag(false,false)};
RongIMClient.MessageParams["MediaModifyMessage"]={objectName:"RC:VCModifyMedia",msgTag:new RongIMLib.MessageTag(false,false)};
RongIMClient.MessageParams["MemberModifyMessage"]={objectName:"RC:VCModifyMem",msgTag:new RongIMLib.MessageTag(false,false)};
RongIMClient.MessageType={
TextMessage:"TextMessage",
ImageMessage:"ImageMessage",
DiscussionNotificationMessage:"DiscussionNotificationMessage",
VoiceMessage:"VoiceMessage",
RichContentMessage:"RichContentMessage",
HandshakeMessage:"HandshakeMessage",
UnknownMessage:"UnknownMessage",
LocationMessage:"LocationMessage",
InformationNotificationMessage:"InformationNotificationMessage",
ContactNotificationMessage:"ContactNotificationMessage",
ProfileNotificationMessage:"ProfileNotificationMessage",
CommandNotificationMessage:"CommandNotificationMessage",
CommandMessage:"CommandMessage",
TypingStatusMessage:"TypingStatusMessage",
ChangeModeResponseMessage:"ChangeModeResponseMessage",
ChangeModeMessage:"ChangeModeMessage",
EvaluateMessage:"EvaluateMessage",
HandShakeMessage:"HandShakeMessage",
HandShakeResponseMessage:"HandShakeResponseMessage",
SuspendMessage:"SuspendMessage",
TerminateMessage:"TerminateMessage",
CustomerContact:"CustomerContact",
CustomerStatusUpdateMessage:"CustomerStatusUpdateMessage",
SyncReadStatusMessage:"SyncReadStatusMessage",
ReadReceiptRequestMessage:"ReadReceiptRequestMessage",
ReadReceiptResponseMessage:"ReadReceiptResponseMessage",
FileMessage:'FileMessage',
AcceptMessage:"AcceptMessage",
RingingMessage:"RingingMessage",
SummaryMessage:"SummaryMessage",
HungupMessage:"HungupMessage",
InviteMessage:"InviteMessage",
MediaModifyMessage:"MediaModifyMessage",
MemberModifyMessage:"MemberModifyMessage",
JrmfRedPacketMessage:"JrmfRedPacketMessage",
JrmfRedPacketOpenedMessage:"JrmfRedPacketOpenedMessage",
GroupNotificationMessage:"GroupNotificationMessage",
PublicServiceRichContentMessage:"PublicServiceRichContentMessage",
PublicServiceMultiRichContentMessage:"PublicServiceMultiRichContentMessage",
PublicServiceCommandMessage:"PublicServiceCommandMessage",
RecallCommandMessage:"RecallCommandMessage",
ReadReceiptMessage:"ReadReceiptMessage"};

RongIMClient.LogFactory={
/**
                 * 个人
                 */
"-1":{
code:"-1",
msg:"服务器超时"},

"-2":{
code:"-2",
msg:"未知原因失败"},

"-3":{
code:"-3",
msg:"参数错误"},

"-4":{
code:"-4",
msg:"参数不正确或尚未实例化"},

"25101":{
code:"25101",
msg:"撤回消息参数错误",
desc:"请检查撤回消息参数 https://rongcloud.github.io/websdk-demo/api-test.html"},

"25102":{
code:"25101",
msg:"只能撤回自发发送的消息"},

"20604":{
code:"20604",
msg:"发送频率过快",
desc:"https://developer.rongcloud.cn/ticket/info/9Q3L6vRKd1cLS7rycA==?type=1"},

"20406":{
code:"20406",
msg:"被禁言"},

"23407":{
code:"23407",
msg:"获取用户失败"},

/**
                 * 群组
                 */
"20407":{
code:"20407",
msg:"群组Id无效"},

"22408":{
code:"22408",
msg:"群组被禁言"},

"22406":{
code:"22406",
msg:"不在群组"},

"35001":{
code:"35001",
msg:"群组同步异常"},

"35002":{
code:"35002",
msg:"匹配群信息异常"},

/**
                 * 讨论组
                 */
"21406":{
code:"21406",
msg:"不在讨论组"},

"21407":{
code:"21407",
msg:"加入讨论失败"},

"21408":{
code:"21408",
msg:"创建讨论组失败"},

"21409":{
code:"21409",
msg:"设置讨论组邀请状态失败"},

/**
                 * 聊天室
                 */
"23406":{
code:"23406",
msg:"不在聊天室"},

"23408":{
code:"23408",
msg:"聊天室被禁言"},

"23409":{
code:"23409",
msg:"聊天室中成员被踢出"},

"23410":{
code:"23410",
msg:"聊天室不存在"},

"23411":{
code:"23411",
msg:"聊天室成员已满"},

"23412":{
code:"23412",
msg:"获取聊天室信息参数无效"},

"23413":{
code:"23413",
msg:"聊天室异常"},

"23414":{
code:"23414",
msg:"没有打开聊天室消息存储"},

"36001":{
code:"36001",
msg:"加入聊天室Id为空"},

"36002":{
code:"36002",
msg:"加入聊天室失败"},

"36003":{
code:"36003",
msg:"拉取聊天室历史消息失败"},

/**
                 * voip
                 */
"24001":{
code:"24001",
msg:"没有注册DeviveId 也就是用户没有登陆"},

"24002":{
code:"24002",
msg:"用户已经存在"},

"0":{
code:"0",
msg:"成功"},

"24009":{
code:"24009",
msg:"没有对应的用户或token"},

"24013":{
code:"24013",
msg:"voip为空"},

"24010":{
code:"24010",
msg:"不支持的Voip引擎"},

"24011":{
code:"24011",
msg:"channelName 是空"},

"24012":{
code:"24012",
msg:"生成Voipkey失败"},

"24014":{
code:"24014",
msg:"没有配置voip"},

"24015":{
code:"24015",
msg:"服务器内部错误"},

"24016":{
code:"24016",
msg:"VOIP close"},

/**
                 * 通讯、导航
                 */
"30001":{
code:"30001",
msg:"通信过程中，当前Socket不存在"},

"30002":{
code:"30002",
msg:"Socket连接不可用"},

"30003":{
code:"30003",
msg:"通信超时"},

"30004":{
code:"30004",
msg:"导航操作时，Http请求失败"},

"30005":{
code:"30005",
msg:"HTTP请求失败"},

"30006":{
code:"30006",
msg:"HTTP接收失败"},

"30007":{
code:"30007",
msg:"导航资源错误"},

"30008":{
code:"30008",
msg:"没有有效数据"},

"30009":{
code:"30009",
msg:"不存在有效 IP 地址"},

"30010":{
code:"30010",
msg:"创建 Socket 失败"},

"30011":{
code:"30011",
msg:" Socket 被断开"},

"30012":{
code:"30012",
msg:"PING 操作失败"},

"30013":{
code:"30013",
msg:"PING 超时"},

"30014":{
code:"30014",
msg:"消息发送失败"},

"30016":{
code:"30016",
msg:"消息大小超限，最大 128 KB"},

/**
                 * 连接
                 */
"31000":{
code:"31000",
msg:"做 connect 连接时，收到的 ACK 超时"},

"31001":{
code:"31001",
msg:"参数错误"},

"31002":{
code:"31002",
msg:"参数错误，App Id 错误"},

"31003":{
code:"31003",
msg:"服务器不可用"},

"31004":{
code:"31004",
msg:"Token 错误"},

"31005":{
code:"31005",
msg:"App Id 与 Token 不匹配"},

"31006":{
code:"31006",
msg:"重定向，地址错误"},

"31007":{
code:"31007",
msg:"NAME 与后台注册信息不一致"},

"31008":{
code:"31008",
msg:"APP 被屏蔽、删除或不存在"},

"31009":{
code:"31009",
msg:"用户被屏蔽"},

"31010":{
code:"31010",
msg:"Disconnect，由服务器返回，比如用户互踢"},

"31011":{
code:"31011",
msg:"Disconnect，由服务器返回，比如用户互踢"},

/**
                 * 协议
                 */
"32001":{
code:"32001",
msg:"协议层内部错误。query，上传下载过程中数据错误"},

"32002":{
code:"32002",
msg:"协议层内部错误"},

/**
                 * BIZ
                 */
"33001":{
code:"33001",
msg:"未调用 init 初始化函数"},

"33002":{
code:"33002",
msg:"数据库初始化失败"},

"33003":{
code:"33003",
msg:"传入参数无效"},

"33004":{
code:"33004",
msg:"通道无效"},

"33005":{
code:"33005",
msg:"重新连接成功"},

"33006":{
code:"33006",
msg:"连接中，再调用 connect 被拒绝"},

"33007":{
code:"33007",
msg:"消息漫游服务未开通"},

"33008":{
code:"33008",
msg:"消息添加失败"},

"33009":{
code:"33009",
msg:"消息删除失败"},

/**
                 * 会话
                 */
"34001":{
code:"34001",
msg:"删除会话失败"},

"34002":{
code:"34002",
msg:"拉取历史消息失败"},

"34003":{
code:"34003",
msg:"会话指定异常"},

"34004":{
code:"34004",
msg:"获取会话未读消息总数失败"},

"34005":{
code:"34005",
msg:"获取指定会话类型未读消息数异常"},

"34006":{
code:"34006",
msg:"获取指定用户ID&会话类型未读消息数异常"},

"34007":{
code:"34007",
msg:"清除会话消息异常"},

"34008":{
code:"34008",
msg:"获取会话消息异常"},

"34009":{
code:"34009",
msg:"清除历史消息会话类型不正确"},

"34010":{
code:"34010",
msg:"清除历史消息失败，请检查传入参数"},

/**
                 * 黑名单异常
                 */
"37001":{
code:"37001",
msg:"加入黑名单异常"},

"37002":{
code:"37002",
msg:"获得指定人员再黑名单中的状态异常"},

"37003":{
code:"37003",
msg:"移除黑名单异常"},

"405":{
code:"405",
msg:"在黑名单中"},

/**
                 * 草稿
                 */
"38001":{
code:"38001",
msg:"获取草稿失败"},

"38002":{
code:"38002",
msg:"保存草稿失败"},

"38003":{
code:"38003",
msg:"删除草稿失败"},

/**
                 * 公众号
                 */
"39001":{
code:"39001",
msg:"关注公众号失败"},

/**
                 * 文件
                 */
"41001":{
code:"41001",
msg:"文件类型错误"},

"41002":{
code:"41002",
msg:"获取七牛token失败"},

/**
                 *
                 */
"51001":{
code:"51001",
msg:"未安装或未启动插件"},

"51002":{
code:"51002",
msg:"视频已经存在"},

"51003":{
code:"51003",
msg:"无效的channelName"},

"51004":{
code:"51004",
msg:"视频内容为空"},

/**
                 *
                 */
"61001":{
code:"61001",
msg:"删除消息数组长度为 0"}};


return sdkInfo;
};
;
/**
            var config = {
                appkey: appkey,
                token: token,
                dataAccessProvider:dataAccessProvider,
                opts: opts
            };
            callback(_instance, userId);
        */
RongIMClient.initApp=function(config,callback){
RongIMClient.init(config.appkey,config.dataAccessProvider,config.opts,function(){
var instance=RongIMClient._instance;
//备用
var error=null;
callback(error,instance);
});
};
/**
         * 连接服务器，在整个应用全局只需要调用一次，断线后 SDK 会自动重连。
         *
         * @param token     从服务端获取的用户身份令牌（Token）。
         * @param callback  连接回调，返回连接的成功或者失败状态。
         */
RongIMClient.connect=function(token,_callback,userId,serverConf){
RongIMLib.CheckParam.getInstance().check(["string","object","string|null|object|global|undefined","object|null|global|undefined"],"connect",true,arguments);
var connectCallback={
onSuccess:_callback.onSuccess,
onTokenIncorrect:_callback.onTokenIncorrect,
onError:function onError(errorCode){
RongIMClient.logger({
code:errorCode,
funcName:"connect"});

_callback.onError(errorCode);
}};

RongIMClient._dataAccessProvider.connect(token,connectCallback,userId,serverConf);
};
RongIMClient.reconnect=function(callback,config){
var connectCallback={
onSuccess:callback.onSuccess,
onTokenIncorrect:callback.onTokenIncorrect,
onError:function onError(errorCode){
RongIMClient.logger({
code:errorCode,
funcName:"connect"});

callback.onError(errorCode);
}};

RongIMClient._dataAccessProvider.reconnect(connectCallback,config);
};
/**
         * 注册消息类型，用于注册用户自定义的消息。
         * 内建的消息类型已经注册过，不需要再次注册。
         * 自定义消息声明需放在执行顺序最高的位置（在RongIMClient.init(appkey)之后即可）
         * @param objectName  消息内置名称
         */
RongIMClient.registerMessageType=function(messageType,objectName,messageTag,messageContent,searchProps){
RongIMClient._dataAccessProvider.registerMessageType(messageType,objectName,messageTag,messageContent,searchProps);
RongIMClient.RegisterMessage[messageType].messageName=messageType;
RongIMClient.MessageType[messageType]=messageType;
RongIMClient.MessageParams[messageType]={objectName:objectName,msgTag:messageTag};
};
RongIMClient.prototype.registerMessageTypes=function(types){
types=types||{};
RongIMClient._dataAccessProvider.registerMessageTypes(types);
};
/**
         * 设置连接状态变化的监听器。
         *
         * @param listener  连接状态变化的监听器。
         */
RongIMClient.setConnectionStatusListener=function(listener){
if(RongIMClient._dataAccessProvider){
RongIMClient._dataAccessProvider.setConnectionStatusListener(listener);
}else
{
RongIMClient._memoryStore.listenerList.push(listener);
}
};
RongIMClient.statusWatch=function(watcher){
if(typeof watcher=='function'){
RongIMClient.statusListeners.push(watcher);
}
};
/**
         * 设置接收消息的监听器。
         *
         * @param listener  接收消息的监听器。
         */
RongIMClient.setOnReceiveMessageListener=function(listener){
if(RongIMClient._dataAccessProvider){
RongIMClient._dataAccessProvider.setOnReceiveMessageListener(listener);
}else
{
RongIMClient._memoryStore.listenerList.push(listener);
}
};
/**
         * 清理所有连接相关的变量
         */
RongIMClient.prototype.logout=function(){
RongIMClient._dataAccessProvider.logout();
};
/**
         * 断开连接。
         */
RongIMClient.prototype.disconnect=function(){
RongIMClient._dataAccessProvider.disconnect();
};
RongIMClient.prototype.startCustomService=function(custId,callback,content){
if(!custId||!callback)
return;
var msg=new RongIMLib.HandShakeMessage(content);
var me=this;
RongIMLib.RongIMClient._memoryStore.custStore["isInit"]=true;
RongIMClient.getInstance().sendMessage(RongIMLib.ConversationType.CUSTOMER_SERVICE,custId,msg,{
onSuccess:function onSuccess(data){
if(data.isBlack){
callback.onError();
me.stopCustomeService(custId,{
onSuccess:function onSuccess(){},
onError:function onError(){}});

}else
{
callback.onSuccess();
}
},
onError:function onError(){
callback.onError();
},
onBefore:function onBefore(){}});

};
RongIMClient.prototype.stopCustomeService=function(custId,callback){
if(!custId||!callback)
return;
var session=RongIMClient._memoryStore.custStore[custId];
if(!session)
return;
var msg=new RongIMLib.SuspendMessage({sid:session.sid,uid:session.uid,pid:session.pid});
this.sendCustMessage(custId,msg,{
onSuccess:function onSuccess(){
// delete RongIMClient._memoryStore.custStore[custId];
setTimeout(function(){
callback.onSuccess();
});
},
onError:function onError(){
setTimeout(function(){
callback.onError();
});
}});

};
RongIMClient.prototype.switchToHumanMode=function(custId,callback){
if(!custId||!callback)
return;
var session=RongIMClient._memoryStore.custStore[custId];
if(!session)
return;
var msg=new RongIMLib.ChangeModeMessage({sid:session.sid,uid:session.uid,pid:session.pid});
this.sendCustMessage(custId,msg,callback);
};
RongIMClient.prototype.evaluateRebotCustomService=function(custId,isRobotResolved,sugest,callback){
if(!custId||!callback)
return;
var session=RongIMClient._memoryStore.custStore[custId];
if(!session)
return;
var msg=new RongIMLib.EvaluateMessage({sid:session.sid,uid:session.uid,pid:session.pid,isRobotResolved:isRobotResolved,sugest:sugest,type:0});
this.sendCustMessage(custId,msg,callback);
};
RongIMClient.prototype.evaluateHumanCustomService=function(custId,humanValue,sugest,callback){
if(!custId||!callback)
return;
var session=RongIMClient._memoryStore.custStore[custId];
if(!session)
return;
var msg=new RongIMLib.EvaluateMessage({sid:session.sid,uid:session.uid,pid:session.pid,humanValue:humanValue,sugest:sugest,type:1});
this.sendCustMessage(custId,msg,callback);
};
RongIMClient.prototype.sendCustMessage=function(custId,msg,callback){
RongIMClient.getInstance().sendMessage(RongIMLib.ConversationType.CUSTOMER_SERVICE,custId,msg,{
onSuccess:function onSuccess(data){
callback.onSuccess();
},
onError:function onError(){
callback.onError();
},
onBefore:function onBefore(){}});

};
/**
         * 获取当前连接的状态。
         */
RongIMClient.prototype.getCurrentConnectionStatus=function(){
return RongIMClient._dataAccessProvider.getCurrentConnectionStatus();
};
/**
         * 获取当前使用的连接通道。
         */
RongIMClient.prototype.getConnectionChannel=function(){
if(RongIMLib.Transportations._TransportType==RongIMLib.Socket.XHR_POLLING){
return RongIMLib.ConnectionChannel.XHR_POLLING;
}else
if(RongIMLib.Transportations._TransportType==RongIMLib.Socket.WEBSOCKET){
return RongIMLib.ConnectionChannel.WEBSOCKET;
}
};
/**
         * 获取当前使用的本地储存提供者。 TODO
         */
RongIMClient.prototype.getStorageProvider=function(){
if(RongIMClient._memoryStore.providerType==1){
return"ServerDataProvider";
}else
{
return"OtherDataProvider";
}
};
/**
         * 过滤聊天室消息（拉取最近聊天消息）
         * @param {string[]} msgFilterNames
         */
RongIMClient.prototype.setFilterMessages=function(msgFilterNames){
if(Object.prototype.toString.call(msgFilterNames)=="[object Array]"){
RongIMClient._memoryStore.filterMessages=msgFilterNames;
}
};
RongIMClient.prototype.getAgoraDynamicKey=function(engineType,channelName,callback){
RongIMClient._dataAccessProvider.getAgoraDynamicKey(engineType,channelName,callback);
};
/**
         * 获取当前连接用户的 UserId。
         */
RongIMClient.prototype.getCurrentUserId=function(){
return RongIMLib.Bridge._client.userId;
};
/**
         * 获取服务器时间与本地时间的差值，单位为毫秒。
         * 计算公式：差值 = 本地时间毫秒数 - 服务器时间毫秒数
         * @param callback  获取的回调，返回差值。
         */
RongIMClient.prototype.getDeltaTime=function(){
return RongIMClient._dataAccessProvider.getDelaTime();
};
// #region Message
RongIMClient.prototype.getMessage=function(messageId,callback){
RongIMClient._dataAccessProvider.getMessage(messageId,RongIMClient.logCallback(callback,"getMessage"));
};
RongIMClient.prototype.deleteLocalMessages=function(conversationType,targetId,messageIds,callback){
RongIMClient._dataAccessProvider.removeLocalMessage(conversationType,targetId,messageIds,RongIMClient.logCallback(callback,"deleteLocalMessages"));
};
RongIMClient.prototype.updateMessage=function(message,callback){
RongIMClient._dataAccessProvider.updateMessage(message,RongIMClient.logCallback(callback,"updateMessage"));
};
RongIMClient.prototype.clearData=function(){
return RongIMClient._dataAccessProvider.clearData();
};
RongIMClient.prototype.clearMessages=function(conversationType,targetId,callback){
RongIMClient._dataAccessProvider.clearMessages(conversationType,targetId,{
onSuccess:function onSuccess(bool){
setTimeout(function(){
callback.onSuccess(bool);
});
},
onError:function onError(errorCode){
setTimeout(function(){
RongIMClient.logger({
code:errorCode,
funcName:"clearMessages"});

callback.onError(errorCode);
});
}});

};
/**TODO 清楚本地存储的未读消息，目前清空内存中的未读消息
         * [clearMessagesUnreadStatus 清空指定会话未读消息]
         * @param  {ConversationType}        conversationType [会话类型]
         * @param  {string}                  targetId         [用户id]
         * @param  {ResultCallback<boolean>} callback         [返回值，参数回调]
         */
RongIMClient.prototype.clearMessagesUnreadStatus=function(conversationType,targetId,callback){
RongIMClient._dataAccessProvider.updateMessages(conversationType,targetId,"readStatus",null,{
onSuccess:function onSuccess(bool){
setTimeout(function(){
callback.onSuccess(bool);
});
},
onError:function onError(errorCode){
setTimeout(function(){
RongIMClient.logger({
code:errorCode,
funcName:"clearMessagesUnreadStatus"});

callback.onError(errorCode);
});
}});

};
RongIMClient.prototype.deleteRemoteMessages=function(conversationType,targetId,delMsgs,callback){
RongIMLib.CheckParam.getInstance().check(["number","string|number","array","object"],"deleteRemoteMessages",false,arguments);
if(delMsgs.length==0){
var errorCode=RongIMLib.ErrorCode.DELETE_MESSAGE_ID_IS_NULL;
RongIMClient.logger({
code:errorCode,
funcName:"deleteRemoteMessages"});

callback.onError(RongIMLib.ErrorCode.DELETE_MESSAGE_ID_IS_NULL);
return;
}else
if(delMsgs.length>100){
delMsgs.length=100;
}
// 后续增加，去掉注释即可
callback.onSuccess(true);
// var modules = new RongIMClient.Protobuf.DeleteMsgInput();
// modules.setType(conversationType);
// modules.setConversationId(targetId);
// modules.setMsgs(delMsgs);
// RongIMClient.bridge.queryMsg(33, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, {
//     onSuccess: function(info: any) {
//         callback.onSuccess(true);
//     },
//     onError: function(err: any) {
//         callback.onError(err);
//     }
// }, "DeleteMsgOutput");
};
/**
         * [deleteMessages 删除消息记录。]
         * @param  {ConversationType}        conversationType [description]
         * @param  {string}                  targetId         [description]
         * @param  {number[]}                messageIds       [description]
         * @param  {ResultCallback<boolean>} callback         [description]
         */
RongIMClient.prototype.deleteMessages=function(conversationType,targetId,delMsgs,callback){
RongIMClient._dataAccessProvider.removeMessage(conversationType,targetId,delMsgs,{
onSuccess:function onSuccess(bool){
setTimeout(function(){
callback.onSuccess(bool);
});
},
onError:function onError(errorCode){
setTimeout(function(){
RongIMClient.logger({
code:errorCode,
funcName:"deleteMessages"});

callback.onError(errorCode);
});
}});

};
RongIMClient.prototype.sendLocalMessage=function(message,callback){
RongIMLib.CheckParam.getInstance().check(["object","object"],"sendLocalMessage",false,arguments);
RongIMClient._dataAccessProvider.updateMessage(message);
this.sendMessage(message.conversationType,message.targetId,message.content,RongIMClient.logSendCallback(callback,"sendLocalMessage"));
};
/**
         * [sendMessage 发送消息。]
         * @param  {ConversationType}        conversationType [会话类型]
         * @param  {string}                  targetId         [目标Id]
         * @param  {MessageContent}          messageContent   [消息类型]
         * @param  {SendMessageCallback}     sendCallback     []
         * @param  {ResultCallback<Message>} resultCallback   [返回值，函数回调]
         * @param  {string}                  pushContent      []
         * @param  {string}                  pushData         []
         */
RongIMClient.prototype.sendMessage=function(conversationType,targetId,messageContent,sendCallback,mentiondMsg,pushText,appData,methodType,params){
RongIMLib.CheckParam.getInstance().check(["number","string|number","object","object","undefined|object|null|global|boolean","undefined|object|null|global|string","undefined|object|null|global|string","undefined|object|null|global|number","undefined|object|null|global"],"sendMessage",false,arguments);
RongIMClient._dataAccessProvider.sendMessage(conversationType,targetId,messageContent,RongIMClient.logSendCallback(sendCallback,"sendMessage"),mentiondMsg,pushText,appData,methodType,params);
};
RongIMClient.prototype.sendReceiptResponse=function(conversationType,targetId,sendCallback){
RongIMClient._dataAccessProvider.sendReceiptResponse(conversationType,targetId,RongIMClient.logSendCallback(sendCallback,"sendReceiptResponse"));
};
RongIMClient.prototype.sendTypingStatusMessage=function(conversationType,targetId,messageName,sendCallback){
RongIMClient._dataAccessProvider.sendTypingStatusMessage(conversationType,targetId,messageName,RongIMClient.logSendCallback(sendCallback,"sendTypingStatusMessage"));
};
/**
         * [sendStatusMessage description]
         * @param  {MessageContent}          messageContent [description]
         * @param  {SendMessageCallback}     sendCallback   [description]
         * @param  {ResultCallback<Message>} resultCallback [description]
         */
RongIMClient.prototype.sendStatusMessage=function(messageContent,sendCallback,resultCallback){
throw new Error("Not implemented yet");
};
/**
         * [sendTextMessage 发送TextMessage快捷方式]
         * @param  {string}                  content        [消息内容]
         * @param  {ResultCallback<Message>} resultCallback [返回值，参数回调]
         */
RongIMClient.prototype.sendTextMessage=function(conversationType,targetId,content,sendMessageCallback){
RongIMClient._dataAccessProvider.sendTextMessage(conversationType,targetId,content,RongIMClient.logSendCallback(sendMessageCallback,"sendTextMessage"));
};
RongIMClient.prototype.sendRecallMessage=function(content,sendMessageCallback){
var callback=RongIMClient.logSendCallback(sendMessageCallback,"sendRecallMessage");
var senderUserId=content.senderUserId;
var userId=RongIMLib.Bridge._client.userId;
var isOther=senderUserId!=userId;
if(isOther){
var callback=RongIMClient.logSendCallback(sendMessageCallback,"sendRecallMessage");
callback.onError(RongIMLib.ErrorCode.RECALL_MESSAGE,content);
return;
}
RongIMClient._dataAccessProvider.sendRecallMessage(content,callback);
};
/**
         * [insertMessage 向本地插入一条消息，不发送到服务器。]
         * @param  {ConversationType}        conversationType [description]
         * @param  {string}                  targetId         [description]
         * @param  {string}                  senderUserId     [description]
         * @param  {MessageContent}          content          [description]
         * @param  {ResultCallback<Message>} callback         [description]
         */
RongIMClient.prototype.insertMessage=function(conversationType,targetId,content,callback){
RongIMClient._dataAccessProvider.addMessage(conversationType,targetId,content,RongIMClient.logCallback(callback,"insertMessage"));
};
RongIMClient.prototype.setMessageContent=function(messageId,content,objectName){
RongIMClient._dataAccessProvider.setMessageContent(messageId,content,objectName);
};
;
/**
         * [getHistoryMessages 拉取历史消息记录。]
         * @param  {ConversationType}          conversationType [会话类型]
         * @param  {string}                    targetId         [用户Id]
         * @param  {number|null}               pullMessageTime  [拉取历史消息起始位置(格式为毫秒数)，可以为null]
         * @param  {number}                    count            [历史消息数量]
         * @param  {ResultCallback<Message[]>} callback         [回调函数]
         * @param  {string}                    objectName       [objectName]
         */
RongIMClient.prototype.getHistoryMessages=function(conversationType,targetId,timestamp,count,callback,objectname,order){
RongIMLib.CheckParam.getInstance().check(["number","string|number","number|null|global|object","number","object","undefined|object|null|global|string","number|null|global|object"],"getHistoryMessages",false,arguments);
if(count>20){
throw new Error("HistroyMessage count must be less than or equal to 20!");
}
if(conversationType.valueOf()<0){
throw new Error("ConversationType must be greater than -1");
}
RongIMClient._dataAccessProvider.getHistoryMessages(conversationType,targetId,timestamp,count,RongIMClient.logCallback(callback,"getHistoryMessages"),objectname,order);
};
/**
         * [getRemoteHistoryMessages 拉取某个时间戳之前的消息]
         * @param  {ConversationType}          conversationType [description]
         * @param  {string}                    targetId         [description]
         * @param  {Date}                      dateTime         [description]
         * @param  {number}                    count            [description]
         * @param  {ResultCallback<Message[]>} callback         [description]
         */
RongIMClient.prototype.getRemoteHistoryMessages=function(conversationType,targetId,timestamp,count,callback,config){
RongIMLib.CheckParam.getInstance().check(["number","string|number","number|null|global|object","number","object","undefined|null|global|object"],"getRemoteHistoryMessages",false,arguments);
var funcName="getRemoteHistoryMessages";
var log={
errorCode:RongIMLib.ErrorCode.RC_CONN_PROTO_VERSION_ERROR,
funcName:"getRemoteHistoryMessages"};

if(count>20){
RongIMClient.logger(log);
callback.onError(RongIMLib.ErrorCode.RC_CONN_PROTO_VERSION_ERROR);
return;
}
if(conversationType.valueOf()<0){
RongIMClient.logger(log);
callback.onError(RongIMLib.ErrorCode.RC_CONN_PROTO_VERSION_ERROR);
return;
}
RongIMClient._dataAccessProvider.getRemoteHistoryMessages(conversationType,targetId,timestamp,count,RongIMClient.logCallback(callback,funcName),config);
};
RongIMClient.prototype.clearHistoryMessages=function(params,callback){
RongIMClient._dataAccessProvider.clearHistoryMessages(params,callback);
};
RongIMClient.prototype.clearRemoteHistoryMessages=function(params,callback){
RongIMClient._dataAccessProvider.clearRemoteHistoryMessages(params,RongIMClient.logCallback(callback,"clearRemoteHistoryMessages"));
};
/**
         * [hasRemoteUnreadMessages 是否有未接收的消息，jsonp方法]
         * @param  {string}          appkey   [appkey]
         * @param  {string}          token    [token]
         * @param  {ConnectCallback} callback [返回值，参数回调]
         */
RongIMClient.prototype.hasRemoteUnreadMessages=function(token,callback){
RongIMClient._dataAccessProvider.hasRemoteUnreadMessages(token,RongIMClient.logCallback(callback,"hasRemoteUnreadMessages"));
};
RongIMClient.prototype.getTotalUnreadCount=function(callback,conversationTypes){
RongIMClient._dataAccessProvider.getTotalUnreadCount({
onSuccess:function onSuccess(count){
setTimeout(function(){
callback.onSuccess(count);
});
},
onError:function onError(errorCode){
setTimeout(function(){
RongIMClient.logger({
code:errorCode,
funcName:"getTotalUnreadCount"});

callback.onError(errorCode);
});
}},
conversationTypes);
};
/**
         * [getConversationUnreadCount 指定多种会话类型获取未读消息数]
         * @param  {ResultCallback<number>} callback             [返回值，参数回调。]
         * @param  {ConversationType[]}     ...conversationTypes [会话类型。]
         */
RongIMClient.prototype.getConversationUnreadCount=function(conversationTypes,callback){
RongIMClient._dataAccessProvider.getConversationUnreadCount(conversationTypes,{
onSuccess:function onSuccess(count){
setTimeout(function(){
callback.onSuccess(count);
});
},
onError:function onError(errorCode){
setTimeout(function(){
RongIMClient.logger({
code:errorCode,
funcName:"getConversationUnreadCount"});

callback.onError(errorCode);
});
}});

};
/**
         * [getUnreadCount 指定用户、会话类型的未读消息总数。]
         * @param  {ConversationType} conversationType [会话类型]
         * @param  {string}           targetId         [用户Id]
         */
RongIMClient.prototype.getUnreadCount=function(conversationType,targetId,callback){
RongIMClient._dataAccessProvider.getUnreadCount(conversationType,targetId,{
onSuccess:function onSuccess(count){
setTimeout(function(){
callback.onSuccess(count);
});
},
onError:function onError(errorCode){
setTimeout(function(){
RongIMClient.logger({
code:errorCode,
funcName:"getUnreadCount"});

callback.onError(errorCode);
});
}});

};
RongIMClient.prototype.setUnreadCount=function(conversationType,targetId,count){
RongIMLib.CheckParam.getInstance().check(["number","string","number"],"setUnreadCount",false,arguments);
RongIMClient._dataAccessProvider.setUnreadCount(conversationType,targetId,count);
};
RongIMClient.prototype.clearUnreadCountByTimestamp=function(conversationType,targetId,timestamp,callback){
RongIMClient._dataAccessProvider.clearUnreadCountByTimestamp(conversationType,targetId,timestamp,RongIMClient.logCallback(callback,"clearUnreadCountByTimestamp"));
};
/**
         * 清楚会话未读消息数
         * @param  {ConversationType}        conversationType 会话类型
         * @param  {string}                  targetId         目标Id
         * @param  {ResultCallback<boolean>} callback         返回值，函数回调
         */
RongIMClient.prototype.clearUnreadCount=function(conversationType,targetId,callback){
RongIMClient._dataAccessProvider.clearUnreadCount(conversationType,targetId,{
onSuccess:function onSuccess(bool){
setTimeout(function(){
callback.onSuccess(bool);
});
},
onError:function onError(errorCode){
setTimeout(function(){
RongIMClient.logger({
code:errorCode,
funcName:"clearUnreadCount"});

callback.onError(errorCode);
});
}});

};
RongIMClient.prototype.clearTotalUnreadCount=function(callback){
RongIMClient._dataAccessProvider.clearTotalUnreadCount({
onSuccess:function onSuccess(bool){
callback.onSuccess(bool);
},
onError:function onError(errorCode){
setTimeout(function(){
RongIMClient.logger({
code:errorCode,
funcName:'clearTotalUnreadCount'});

callback.onError(errorCode);
});
}});

};
RongIMClient.prototype.clearLocalStorage=function(callback){
RongIMClient._storageProvider.clearItem();
callback();
};
RongIMClient.prototype.setMessageExtra=function(messageId,value,callback){
RongIMClient._dataAccessProvider.setMessageExtra(messageId,value,{
onSuccess:function onSuccess(bool){
setTimeout(function(){
callback.onSuccess(bool);
});
},
onError:function onError(errorCode){
setTimeout(function(){
RongIMClient.logger({
code:errorCode,
funcName:"setMessageExtra"});

callback.onError(errorCode);
});
}});

};
RongIMClient.prototype.setMessageReceivedStatus=function(messageUId,receivedStatus,callback){
RongIMClient._dataAccessProvider.setMessageReceivedStatus(messageUId,receivedStatus,{
onSuccess:function onSuccess(bool){
setTimeout(function(){
callback.onSuccess(bool);
});
},
onError:function onError(errorCode){
setTimeout(function(){
RongIMClient.logger({
code:errorCode,
funcName:"setMessageReceivedStatus"});

callback.onError(errorCode);
});
}});

};
RongIMClient.prototype.setMessageStatus=function(conersationType,targetId,timestamp,status,callback){
RongIMClient._dataAccessProvider.setMessageStatus(conersationType,targetId,timestamp,status,RongIMClient.logCallback(callback,"setMessageStatus"));
};
RongIMClient.prototype.setMessageSentStatus=function(messageId,sentStatus,callback){
RongIMClient._dataAccessProvider.setMessageSentStatus(messageId,sentStatus,{
onSuccess:function onSuccess(bool){
setTimeout(function(){
callback.onSuccess(bool);
});
},
onError:function onError(errorCode){
setTimeout(function(){
RongIMClient.logger({
code:errorCode,
funcName:"setMessageSentStatus"});

callback.onError(errorCode);
});
}});

};
// #endregion Message
// #region TextMessage Draft
/**
         * clearTextMessageDraft 清除指定会话和消息类型的草稿。
         * @param  {ConversationType}        conversationType 会话类型
         * @param  {string}                  targetId         目标Id
         */
RongIMClient.prototype.clearTextMessageDraft=function(conversationType,targetId){
RongIMLib.CheckParam.getInstance().check(["number","string|number","object"],"clearTextMessageDraft",false,arguments);
var key="darf_"+conversationType+"_"+targetId;
delete RongIMClient._memoryStore[key];
return true;
};
/**
         * [getTextMessageDraft 获取指定消息和会话的草稿。]
         * @param  {ConversationType}       conversationType [会话类型]
         * @param  {string}                 targetId         [目标Id]
         */
RongIMClient.prototype.getTextMessageDraft=function(conversationType,targetId){
RongIMLib.CheckParam.getInstance().check(["number","string|number","object"],"getTextMessageDraft",false,arguments);
if(targetId==""||conversationType<0){
throw new Error("params error : "+RongIMLib.ErrorCode.DRAF_GET_ERROR);
}
var key="darf_"+conversationType+"_"+targetId;
return RongIMClient._memoryStore[key];
};
/**
         * [saveTextMessageDraft description]
         * @param  {ConversationType}        conversationType [会话类型]
         * @param  {string}                  targetId         [目标Id]
         * @param  {string}                  value            [草稿值]
         */
RongIMClient.prototype.saveTextMessageDraft=function(conversationType,targetId,value){
RongIMLib.CheckParam.getInstance().check(["number","string|number","string","object"],"saveTextMessageDraft",false,arguments);
var key="darf_"+conversationType+"_"+targetId;
RongIMClient._memoryStore[key]=value;
return true;
};
// #endregion TextMessage Draft
// #region Conversation
RongIMClient.prototype.searchConversationByContent=function(keyword,callback,conversationTypes){
RongIMClient._dataAccessProvider.searchConversationByContent(keyword,RongIMClient.logCallback(callback,"searchConversationByContent"),conversationTypes);
};
RongIMClient.prototype.searchMessageByContent=function(conversationType,targetId,keyword,timestamp,count,total,callback){
RongIMClient._dataAccessProvider.searchMessageByContent(conversationType,targetId,keyword,timestamp,count,total,RongIMClient.logCallback(callback,"searchMessageByContent"));
};
RongIMClient.prototype.clearCache=function(){
RongIMClient._dataAccessProvider.clearCache();
};
RongIMClient.prototype.clearConversations=function(callback){
var conversationTypes=[];
for(var _i=1;_i<arguments.length;_i++){
conversationTypes[_i-1]=arguments[_i];
}
if(conversationTypes.length==0){
conversationTypes=[RongIMLib.ConversationType.CHATROOM,
RongIMLib.ConversationType.CUSTOMER_SERVICE,
RongIMLib.ConversationType.DISCUSSION,
RongIMLib.ConversationType.GROUP,
RongIMLib.ConversationType.PRIVATE,
RongIMLib.ConversationType.SYSTEM,
RongIMLib.ConversationType.PUBLIC_SERVICE,
RongIMLib.ConversationType.APP_PUBLIC_SERVICE];
}
RongIMClient._dataAccessProvider.clearConversations(conversationTypes,{
onSuccess:function onSuccess(bool){
setTimeout(function(){
callback.onSuccess(bool);
});
},
onError:function onError(errorCode){
setTimeout(function(){
RongIMClient.logger({
code:errorCode,
funcName:"clearConversations"});

callback.onError(errorCode);
});
}});

};
/**
         * [getConversation 获取指定会话，此方法需在getConversationList之后执行]
         * @param  {ConversationType}             conversationType [会话类型]
         * @param  {string}                       targetId         [目标Id]
         * @param  {ResultCallback<Conversation>} callback         [返回值，函数回调]
         */
RongIMClient.prototype.getConversation=function(conversationType,targetId,callback){
RongIMLib.CheckParam.getInstance().check(["number","string|number","object"],"getConversation",false,arguments);
RongIMClient._dataAccessProvider.getConversation(conversationType,targetId,{
onSuccess:function onSuccess(conver){
setTimeout(function(){
callback.onSuccess(conver);
});
},
onError:function onError(error){
setTimeout(function(){
RongIMClient.logger({
code:error,
funcName:"getConversation"});

callback.onError(error);
});
}});

};
/**
         * [pottingConversation 组装会话列表]
         * @param {any} tempConver [临时会话]
         * conver_conversationType_targetId_no.
         * msg_conversationType_targetId_no.
         */
RongIMClient.prototype.pottingConversation=function(tempConver){
var self=this,isUseReplace=false;
RongIMClient._dataAccessProvider.getConversation(tempConver.type,tempConver.userId,{
onSuccess:function onSuccess(conver){
if(!conver){
conver=new RongIMLib.Conversation();
}else
{
isUseReplace=true;
}
conver.conversationType=tempConver.type;
conver.targetId=tempConver.userId;
conver.latestMessage=RongIMLib.MessageUtil.messageParser(tempConver.msg);
conver.latestMessageId=conver.latestMessage.messageId;
conver.objectName=conver.latestMessage.objectName;
conver.receivedStatus=conver.latestMessage.receivedStatus;
conver.receivedTime=conver.latestMessage.receiveTime;
conver.sentStatus=conver.latestMessage.sentStatus;
conver.sentTime=conver.latestMessage.sentTime;
var mentioneds=RongIMClient._storageProvider.getItem("mentioneds_"+RongIMLib.Bridge._client.userId+'_'+conver.conversationType+'_'+conver.targetId);
if(mentioneds){
var info=JSON.parse(mentioneds);
conver.mentionedMsg=info[tempConver.type+"_"+tempConver.userId];
}
if(!isUseReplace){
if(RongIMLib.RongUtil.supportLocalStorage()){
var count=RongIMClient._storageProvider.getItem("cu"+RongIMLib.Bridge._client.userId+tempConver.type+tempConver.userId);
conver.unreadMessageCount=Number(count);
}else
{
conver.unreadMessageCount=0;
}
}
if(conver.conversationType==RongIMLib.ConversationType.DISCUSSION){
self.getDiscussion(tempConver.userId,{
onSuccess:function onSuccess(info){
conver.conversationTitle=info.name;
},
onError:function onError(error){}});

}
RongIMClient._dataAccessProvider.addConversation(conver,{onSuccess:function onSuccess(data){}});
},
onError:function onError(error){}});

};
RongIMClient.prototype.addConversation=function(conversation,callback){
RongIMClient._dataAccessProvider.addConversation(conversation,callback);
};
RongIMClient.prototype.sortConversationList=function(conversationList){
var convers=[];
for(var i=0,len=conversationList.length;i<len;i++){
if(!conversationList[i]){
continue;
}
if(conversationList[i].isTop){
convers.push(conversationList[i]);
conversationList.splice(i,1);
continue;
}
for(var j=0;j<len-i-1;j++){
if(conversationList[j].sentTime<conversationList[j+1].sentTime){
var swap=conversationList[j];
conversationList[j]=conversationList[j+1];
conversationList[j+1]=swap;
}
}
}
return RongIMClient._memoryStore.conversationList=convers.concat(conversationList);
};
RongIMClient.prototype.getConversationList=function(callback,conversationTypes,count,isGetHiddenConvers){
RongIMLib.CheckParam.getInstance().check(["object","null|undefined|array|object|global","number|undefined|null|object|global","boolean|undefined|null|object|global"],"getConversationList",false,arguments);
var me=this;
RongIMClient._dataAccessProvider.getConversationList({
onSuccess:function onSuccess(data){
if(conversationTypes||RongIMClient._dataAccessProvider){
setTimeout(function(){
callback.onSuccess(data);
});
}else
{
setTimeout(function(){
callback.onSuccess(RongIMClient._memoryStore.conversationList);
});
}
},
onError:function onError(error){
setTimeout(function(){
RongIMClient.logger({
code:error,
funcName:"getConversationList"});

callback.onError(error);
});
}},
conversationTypes,count,isGetHiddenConvers);
};
RongIMClient.prototype.getRemoteConversationList=function(callback,conversationTypes,count,isGetHiddenConvers){
RongIMLib.CheckParam.getInstance().check(["object","null|array|object|global","number|undefined|null|object|global","boolean|undefined|null|object|global"],"getRemoteConversationList",false,arguments);
RongIMClient._dataAccessProvider.getRemoteConversationList(RongIMClient.logCallback(callback,"getRemoteConversationList"),conversationTypes,count,isGetHiddenConvers);
};
RongIMClient.prototype.updateConversation=function(conversation){
return RongIMClient._dataAccessProvider.updateConversation(conversation);
};
/**
         * [createConversation 创建会话。]
         * @param  {number}  conversationType [会话类型]
         * @param  {string}  targetId         [目标Id]
         * @param  {string}  converTitle      [会话标题]
         * @param  {boolean} islocal          [是否同步到服务器，ture：同步，false:不同步]
         */
RongIMClient.prototype.createConversation=function(conversationType,targetId,converTitle){
RongIMLib.CheckParam.getInstance().check(["number","string|number","string"],"createConversation",false,arguments);
var conver=new RongIMLib.Conversation();
// var unreadContent: string = RongIMClient._storageProvider.getItem("cu" + Bridge._client.userId + conversationType + targetId);
// var unreadCount = Number(unreadContent) || 0;
conver.targetId=targetId;
conver.conversationType=conversationType;
conver.conversationTitle=converTitle;
conver.latestMessage={};
conver.unreadMessageCount=0;
return conver;
};
//TODO 删除本地和服务器、删除本地和服务器分开
RongIMClient.prototype.removeConversation=function(conversationType,targetId,callback){
RongIMLib.CheckParam.getInstance().check(["number","string|number","object"],"removeConversation",false,arguments);
RongIMClient._dataAccessProvider.removeConversation(conversationType,targetId,RongIMClient.logCallback(callback,"removeConversation"));
};
RongIMClient.prototype.setConversationHidden=function(conversationType,targetId,isHidden){
RongIMLib.CheckParam.getInstance().check(["number","string|number","boolean"],"setConversationHidden",false,arguments);
RongIMClient._dataAccessProvider.setConversationHidden(conversationType,targetId,isHidden);
};
RongIMClient.prototype.setConversationToTop=function(conversationType,targetId,isTop,callback){
RongIMLib.CheckParam.getInstance().check(["number","string|number","boolean","object"],"setConversationToTop",false,arguments);
RongIMClient._dataAccessProvider.setConversationToTop(conversationType,targetId,isTop,{
onSuccess:function onSuccess(bool){
setTimeout(function(){
callback.onSuccess(bool);
});
},
onError:function onError(errorCode){
setTimeout(function(){
RongIMClient.logger({
code:errorCode,
funcName:"setConversationToTop"});

callback.onError(errorCode);
});
}});

};
// #endregion Conversation
// #region Notifications
/**
         * [getConversationNotificationStatus 获取指定用户和会话类型免提醒。]
         * @param  {ConversationType}                               conversationType [会话类型]
         * @param  {string}                                         targetId         [目标Id]
         * @param  {ResultCallback<ConversationNotificationStatus>} callback         [返回值，函数回调]
         */
RongIMClient.prototype.getConversationNotificationStatus=function(conversationType,targetId,callback){
var params={
conversationType:conversationType,
targetId:targetId};

RongIMClient._dataAccessProvider.getConversationNotificationStatus(params,RongIMClient.logCallback(callback,"getConversationNotificationStatus"));
};
/**
         * [setConversationNotificationStatus 设置指定用户和会话类型免提醒。]
         * @param  {ConversationType}                               conversationType [会话类型]
         * @param  {string}                                         targetId         [目标Id]
         * @param  {ResultCallback<ConversationNotificationStatus>} callback         [返回值，函数回调]
         */
RongIMClient.prototype.setConversationNotificationStatus=function(conversationType,targetId,notificationStatus,callback){
var params={
conversationType:conversationType,
targetId:targetId,
status:status};

RongIMClient._dataAccessProvider.setConversationNotificationStatus(params,RongIMClient.logCallback(callback,"setConversationNotificationStatus"));
};
/**
         * [getNotificationQuietHours 获取免提醒消息时间。]
         * @param  {GetNotificationQuietHoursCallback} callback [返回值，函数回调]
         */
RongIMClient.prototype.getNotificationQuietHours=function(callback){
throw new Error("Not implemented yet");
};
/**
         * [removeNotificationQuietHours 移除免提醒消息时间。]
         * @param  {GetNotificationQuietHoursCallback} callback [返回值，函数回调]
         */
RongIMClient.prototype.removeNotificationQuietHours=function(callback){
throw new Error("Not implemented yet");
};
/**
         * [setNotificationQuietHours 设置免提醒消息时间。]
         * @param  {GetNotificationQuietHoursCallback} callback [返回值，函数回调]
         */
RongIMClient.prototype.setNotificationQuietHours=function(startTime,spanMinutes,callback){
throw new Error("Not implemented yet");
};
// #endregion Notifications
// #region Discussion
/**
         * [addMemberToDiscussion   加入讨论组]
         * @param  {string}            discussionId [讨论组Id]
         * @param  {string[]}          userIdList   [讨论中成员]
         * @param  {OperationCallback} callback     [返回值，函数回调]
         */
RongIMClient.prototype.addMemberToDiscussion=function(discussionId,userIdList,callback){
RongIMLib.CheckParam.getInstance().check(["string","array","object"],"addMemberToDiscussion",false,arguments);
RongIMClient._dataAccessProvider.addMemberToDiscussion(discussionId,userIdList,RongIMClient.logCallback(callback,"addMemberToDiscussion"));
};
/**
         * [createDiscussion 创建讨论组]
         * @param  {string}                   name       [讨论组名称]
         * @param  {string[]}                 userIdList [讨论组成员]
         * @param  {CreateDiscussionCallback} callback   [返回值，函数回调]
         */
RongIMClient.prototype.createDiscussion=function(name,userIdList,callback){
RongIMLib.CheckParam.getInstance().check(["string","array","object"],"createDiscussion",false,arguments);
RongIMClient._dataAccessProvider.createDiscussion(name,userIdList,callback);
};
/**
         * [getDiscussion 获取讨论组信息]
         * @param  {string}                     discussionId [讨论组Id]
         * @param  {ResultCallback<Discussion>} callback     [返回值，函数回调]
         */
RongIMClient.prototype.getDiscussion=function(discussionId,callback){
RongIMLib.CheckParam.getInstance().check(["string","object"],"getDiscussion",false,arguments);
RongIMClient._dataAccessProvider.getDiscussion(discussionId,RongIMClient.logCallback(callback,"getDiscussion"));
};
/**
         * [quitDiscussion 退出讨论组]
         * @param  {string}            discussionId [讨论组Id]
         * @param  {OperationCallback} callback     [返回值，函数回调]
         */
RongIMClient.prototype.quitDiscussion=function(discussionId,callback){
RongIMLib.CheckParam.getInstance().check(["string","object"],"quitDiscussion",false,arguments);
RongIMClient._dataAccessProvider.quitDiscussion(discussionId,RongIMClient.logCallback(callback,"quitDiscussion"));
};
/**
         * [removeMemberFromDiscussion 将指定成员移除讨论租]
         * @param  {string}            discussionId [讨论组Id]
         * @param  {string}            userId       [被移除的用户Id]
         * @param  {OperationCallback} callback     [返回值，参数回调]
         */
RongIMClient.prototype.removeMemberFromDiscussion=function(discussionId,userId,callback){
RongIMLib.CheckParam.getInstance().check(["string","string","object"],"removeMemberFromDiscussion",false,arguments);
RongIMClient._dataAccessProvider.removeMemberFromDiscussion(discussionId,userId,RongIMClient.logCallback(callback,"removeMemberFromDiscussion"));
};
/**
         * [setDiscussionInviteStatus 设置讨论组邀请状态]
         * @param  {string}                 discussionId [讨论组Id]
         * @param  {DiscussionInviteStatus} status       [邀请状态]
         * @param  {OperationCallback}      callback     [返回值，函数回调]
         */
RongIMClient.prototype.setDiscussionInviteStatus=function(discussionId,status,callback){
RongIMLib.CheckParam.getInstance().check(["string","number","object"],"setDiscussionInviteStatus",false,arguments);
RongIMClient._dataAccessProvider.setDiscussionInviteStatus(discussionId,status,RongIMClient.logCallback(callback,"setDiscussionInviteStatus"));
};
/**
         * [setDiscussionName 设置讨论组名称]
         * @param  {string}            discussionId [讨论组Id]
         * @param  {string}            name         [讨论组名称]
         * @param  {OperationCallback} callback     [返回值，函数回调]
         */
RongIMClient.prototype.setDiscussionName=function(discussionId,name,callback){
RongIMLib.CheckParam.getInstance().check(["string","string","object"],"setDiscussionName",false,arguments);
RongIMClient._dataAccessProvider.setDiscussionName(discussionId,name,RongIMClient.logCallback(callback,"setDiscussionName"));
};
// #endregion Discussion
// #region ChatRoom
/**
         * [加入聊天室。]
         * @param  {string}            chatroomId   [聊天室Id]
         * @param  {number}            messageCount [拉取消息数量，-1为不拉去消息]
         * @param  {OperationCallback} callback     [返回值，函数回调]
         */
RongIMClient.prototype.joinChatRoom=function(chatroomId,messageCount,callback){
RongIMLib.CheckParam.getInstance().check(["string|number","number","object"],"joinChatRoom",false,arguments);
if(chatroomId==""){
setTimeout(function(){
var errorCode=RongIMLib.ErrorCode.CHATROOM_ID_ISNULL;
RongIMClient.logger({
code:errorCode,
funcName:"joinChatRoom"});

callback.onError(RongIMLib.ErrorCode.CHATROOM_ID_ISNULL);
});
return;
}
RongIMClient._dataAccessProvider.joinChatRoom(chatroomId,messageCount,RongIMClient.logCallback(callback,"joinChatRoom"));
};
RongIMClient.prototype.setDeviceInfo=function(device){
RongIMClient._dataAccessProvider.setDeviceInfo(device);
};
RongIMClient.prototype.setChatroomHisMessageTimestamp=function(chatRoomId,timestamp){
RongIMLib.CheckParam.getInstance().check(["string|number","number"],"setChatroomHisMessageTimestamp",false,arguments);
RongIMClient._dataAccessProvider.setChatroomHisMessageTimestamp(chatRoomId,timestamp);
};
RongIMClient.prototype.getChatRoomHistoryMessages=function(chatRoomId,count,order,callback){
RongIMLib.CheckParam.getInstance().check(["string|number","number","number","object"],"getChatRoomHistoryMessages",false,arguments);
RongIMClient._dataAccessProvider.getChatRoomHistoryMessages(chatRoomId,count,order,RongIMClient.logCallback(callback,"getChatRoomHistoryMessages"));
};
RongIMClient.prototype.getChatRoomInfo=function(chatRoomId,count,order,callback){
RongIMLib.CheckParam.getInstance().check(["string|number","number","number","object"],"getChatRoomInfo",false,arguments);
RongIMClient._dataAccessProvider.getChatRoomInfo(chatRoomId,count,order,RongIMClient.logCallback(callback,"getChatRoomInfo"));
};
/**
         * [退出聊天室]
         * @param  {string}            chatroomId [聊天室Id]
         * @param  {OperationCallback} callback   [返回值，函数回调]
         */
RongIMClient.prototype.quitChatRoom=function(chatroomId,callback){
RongIMLib.CheckParam.getInstance().check(["string|number","object"],"quitChatRoom",false,arguments);
RongIMClient._dataAccessProvider.quitChatRoom(chatroomId,RongIMClient.logCallback(callback,"quitChatRoom"));
};
// #endregion ChatRoom
// #region Public Service
RongIMClient.prototype.getRemotePublicServiceList=function(callback,pullMessageTime){
RongIMClient._dataAccessProvider.getRemotePublicServiceList(RongIMClient.logCallback(callback,"getRemotePublicServiceList"),pullMessageTime);
};
/**
         * [getPublicServiceList ]获取本地的公共账号列表
         * @param  {ResultCallback<PublicServiceProfile[]>} callback [返回值，参数回调]
         */
RongIMClient.prototype.getPublicServiceList=function(callback){
if(RongIMClient._memoryStore.depend.openMp){
RongIMLib.CheckParam.getInstance().check(["object"],"getPublicServiceList",false,arguments);
this.getRemotePublicServiceList(RongIMClient.logCallback(callback,"getPublicServiceList"));
}
};
/**
         * [getPublicServiceProfile ]   获取某公共服务信息。
         * @param  {PublicServiceType}                    publicServiceType [公众服务类型。]
         * @param  {string}                               publicServiceId   [公共服务 Id。]
         * @param  {ResultCallback<PublicServiceProfile>} callback          [公共账号信息回调。]
         */
RongIMClient.prototype.getPublicServiceProfile=function(publicServiceType,publicServiceId,callback){
if(RongIMClient._memoryStore.depend.openMp){
RongIMLib.CheckParam.getInstance().check(["number","string|number","object"],"getPublicServiceProfile",false,arguments);
RongIMClient._dataAccessProvider.getPublicServiceProfile(publicServiceType,publicServiceId,RongIMClient.logCallback(callback,"getPublicServiceProfile"));
}
};
/**
         * [pottingPublicSearchType ] 公众好查询类型
         * @param  {number} bussinessType [ 0-all 1-mp 2-mc]
         * @param  {number} searchType    [0-exact 1-fuzzy]
         */
RongIMClient.prototype.pottingPublicSearchType=function(bussinessType,searchType){
if(RongIMClient._memoryStore.depend.openMp){
var bits=0;
if(bussinessType==0){
bits|=3;
if(searchType==0){
bits|=12;
}else
{
bits|=48;
}
}else
if(bussinessType==1){
bits|=1;
if(searchType==0){
bits|=8;
}else
{
bits|=32;
}
}else
{
bits|=2;
if(bussinessType==0){
bits|=4;
}else
{
bits|=16;
}
}
return bits;
}
};
/**
         * [searchPublicService ]按公众服务类型搜索公众服务。
         * @param  {SearchType}                             searchType [搜索类型枚举。]
         * @param  {string}                                 keywords   [搜索关键字。]
         * @param  {ResultCallback<PublicServiceProfile[]>} callback   [搜索结果回调。]
         */
RongIMClient.prototype.searchPublicService=function(searchType,keywords,callback){
if(RongIMClient._memoryStore.depend.openMp){
RongIMLib.CheckParam.getInstance().check(["number","string","object"],"searchPublicService",false,arguments);
var modules=new RongIMClient.Protobuf.SearchMpInput();
modules.setType(this.pottingPublicSearchType(0,searchType));
modules.setId(keywords);
RongIMClient.bridge.queryMsg(29,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),RongIMLib.Bridge._client.userId,RongIMClient.logCallback(callback,"searchPublicService"),"SearchMpOutput");
}
};
/**
         * [searchPublicServiceByType ]按公众服务类型搜索公众服务。
         * @param  {PublicServiceType}                      publicServiceType [公众服务类型。]
         * @param  {SearchType}                             searchType        [搜索类型枚举。]
         * @param  {string}                                 keywords          [搜索关键字。]
         * @param  {ResultCallback<PublicServiceProfile[]>} callback          [搜索结果回调。]
         */
RongIMClient.prototype.searchPublicServiceByType=function(publicServiceType,searchType,keywords,callback){
if(RongIMClient._memoryStore.depend.openMp){
RongIMLib.CheckParam.getInstance().check(["number","number","string","object"],"searchPublicServiceByType",false,arguments);
var type=publicServiceType==RongIMLib.ConversationType.APP_PUBLIC_SERVICE?2:1;
var modules=new RongIMClient.Protobuf.SearchMpInput();
modules.setType(this.pottingPublicSearchType(type,searchType));
modules.setId(keywords);
RongIMClient.bridge.queryMsg(29,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),RongIMLib.Bridge._client.userId,RongIMClient.logCallback(callback,"searchPublicServiceByType"),"SearchMpOutput");
}
};
/**
         * [subscribePublicService ] 订阅公众号。
         * @param  {PublicServiceType} publicServiceType [公众服务类型。]
         * @param  {string}            publicServiceId   [公共服务 Id。]
         * @param  {OperationCallback} callback          [订阅公众号回调。]
         */
RongIMClient.prototype.subscribePublicService=function(publicServiceType,publicServiceId,callback){
if(RongIMClient._memoryStore.depend.openMp){
RongIMLib.CheckParam.getInstance().check(["number","string|number","object"],"subscribePublicService",false,arguments);
var modules=new RongIMClient.Protobuf.MPFollowInput(),me=this,follow=publicServiceType==RongIMLib.ConversationType.APP_PUBLIC_SERVICE?"mcFollow":"mpFollow";
modules.setId(publicServiceId);
RongIMClient.bridge.queryMsg(follow,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),RongIMLib.Bridge._client.userId,{
onSuccess:function onSuccess(){
me.getRemotePublicServiceList({
onSuccess:function onSuccess(){},
onError:function onError(){}});

callback.onSuccess();
},
onError:function onError(code){
var errorCode=code;
RongIMClient.logger({
code:errorCode,
funcName:"subscribePublicService"});

callback.onError(code);
}},
"MPFollowOutput");
}
};
/**
         * [unsubscribePublicService ] 取消订阅公众号。
         * @param  {PublicServiceType} publicServiceType [公众服务类型。]
         * @param  {string}            publicServiceId   [公共服务 Id。]
         * @param  {OperationCallback} callback          [取消订阅公众号回调。]
         */
RongIMClient.prototype.unsubscribePublicService=function(publicServiceType,publicServiceId,callback){
if(RongIMClient._memoryStore.depend.openMp){
RongIMLib.CheckParam.getInstance().check(["number","string|number","object"],"unsubscribePublicService",false,arguments);
var modules=new RongIMClient.Protobuf.MPFollowInput(),me=this,follow=publicServiceType==RongIMLib.ConversationType.APP_PUBLIC_SERVICE?"mcUnFollow":"mpUnFollow";
modules.setId(publicServiceId);
RongIMClient.bridge.queryMsg(follow,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),RongIMLib.Bridge._client.userId,{
onSuccess:function onSuccess(){
RongIMClient._memoryStore.publicServiceMap.remove(publicServiceType,publicServiceId);
callback.onSuccess();
},
onError:function onError(code){
var errorCode=code;
RongIMClient.logger({
code:errorCode,
funcName:"unsubscribePublicService"});

callback.onError(code);
}},
"MPFollowOutput");
}
};
// #endregion Public Service
// #region Blacklist
/**
         * [加入黑名单]
         * @param  {string}            userId   [将被加入黑名单的用户Id]
         * @param  {OperationCallback} callback [返回值，函数回调]
         */
RongIMClient.prototype.addToBlacklist=function(userId,callback){
RongIMLib.CheckParam.getInstance().check(["string|number","object"],"addToBlacklist",false,arguments);
RongIMClient._dataAccessProvider.addToBlacklist(userId,RongIMClient.logCallback(callback,"addToBlacklist"));
};
/**
         * [获取黑名单列表]
         * @param  {GetBlacklistCallback} callback [返回值，函数回调]
         */
RongIMClient.prototype.getBlacklist=function(callback){
RongIMLib.CheckParam.getInstance().check(["object"],"getBlacklist",false,arguments);
RongIMClient._dataAccessProvider.getBlacklist(callback);
};
/**
         * [得到指定人员再黑名单中的状态]
         * @param  {string}                          userId   [description]
         * @param  {ResultCallback<BlacklistStatus>} callback [返回值，函数回调]
         */
//TODO 如果人员不在黑名单中，获取状态会出现异常
RongIMClient.prototype.getBlacklistStatus=function(userId,callback){
RongIMLib.CheckParam.getInstance().check(["string|number","object"],"getBlacklistStatus",false,arguments);
RongIMClient._dataAccessProvider.getBlacklistStatus(userId,RongIMClient.logCallback(callback,"getBlacklistStatus"));
};
/**
         * [将指定用户移除黑名单]
         * @param  {string}            userId   [将被移除的用户Id]
         * @param  {OperationCallback} callback [返回值，函数回调]
         */
RongIMClient.prototype.removeFromBlacklist=function(userId,callback){
RongIMLib.CheckParam.getInstance().check(["string|number","object"],"removeFromBlacklist",false,arguments);
RongIMClient._dataAccessProvider.removeFromBlacklist(userId,RongIMClient.logCallback(callback,"removeFromBlacklist"));
};
RongIMClient.prototype.getFileToken=function(fileType,callback){
RongIMLib.CheckParam.getInstance().check(["number","object"],"getQngetFileTokenTkn",false,arguments);
RongIMClient._dataAccessProvider.getFileToken(fileType,RongIMClient.logCallback(callback,"getFileToken"));
};
RongIMClient.prototype.getFileUrl=function(fileType,fileName,oriName,callback){
RongIMLib.CheckParam.getInstance().check(["number","string","string|global|object|null","object"],"getFileUrl",false,arguments);
RongIMClient._dataAccessProvider.getFileUrl(fileType,fileName,oriName,RongIMClient.logCallback(callback,"getFileUrl"));
};
;
// #endregion Blacklist
// #region Real-time Location Service
RongIMClient.prototype.addRealTimeLocationListener=function(conversationType,targetId,listener){
throw new Error("Not implemented yet");
};
RongIMClient.prototype.getRealTimeLocation=function(conversationType,targetId){
throw new Error("Not implemented yet");
};
RongIMClient.prototype.getRealTimeLocationCurrentState=function(conversationType,targetId){
throw new Error("Not implemented yet");
};
RongIMClient.prototype.getRealTimeLocationParticipants=function(conversationType,targetId){
throw new Error("Not implemented yet");
};
RongIMClient.prototype.joinRealTimeLocation=function(conversationType,targetId){
throw new Error("Not implemented yet");
};
RongIMClient.prototype.quitRealTimeLocation=function(conversationType,targetId){
throw new Error("Not implemented yet");
};
RongIMClient.prototype.startRealTimeLocation=function(conversationType,targetId){
throw new Error("Not implemented yet");
};
RongIMClient.prototype.updateRealTimeLocationStatus=function(conversationType,targetId,latitude,longitude){
throw new Error("Not implemented yet");
};
// #endregion Real-time Location Service
// # startVoIP
RongIMClient.prototype.startCall=function(converType,targetId,userIds,mediaType,extra,callback){
RongIMLib.CheckParam.getInstance().check(["number","string|number","array","number","string","object"],"startCall",false,arguments);
if(RongIMClient._memoryStore.voipStategy){
RongIMClient._voipProvider.startCall(converType,targetId,userIds,mediaType,extra,RongIMClient.logCallback(callback,"startCall"));
}else
{
var errorCode=RongIMLib.ErrorCode.VOIP_NOT_AVALIABLE;
RongIMClient.logger({
code:errorCode,
funcName:"startCall"});

callback.onError(RongIMLib.ErrorCode.VOIP_NOT_AVALIABLE);
}
};
RongIMClient.prototype.joinCall=function(mediaType,callback){
RongIMLib.CheckParam.getInstance().check(['number','object'],"joinCall",false,arguments);
if(RongIMClient._memoryStore.voipStategy){
RongIMClient._voipProvider.joinCall(mediaType,RongIMClient.logCallback(callback,"joinCall"));
}else
{
var errorCode=RongIMLib.ErrorCode.VOIP_NOT_AVALIABLE;
RongIMClient.logger({
code:errorCode,
funcName:"joinCall"});

callback.onError(RongIMLib.ErrorCode.VOIP_NOT_AVALIABLE);
}
};
RongIMClient.prototype.hungupCall=function(converType,targetId,reason){
RongIMLib.CheckParam.getInstance().check(["number","string","number"],"hungupCall",false,arguments);
if(RongIMClient._memoryStore.voipStategy){
RongIMClient._voipProvider.hungupCall(converType,targetId,reason);
}
};
RongIMClient.prototype.changeMediaType=function(converType,targetId,mediaType,callback){
RongIMLib.CheckParam.getInstance().check(["number","string","number","object"],"changeMediaType",false,arguments);
if(RongIMClient._memoryStore.voipStategy){
RongIMClient._voipProvider.changeMediaType(converType,targetId,mediaType,RongIMClient.logCallback(callback,"changeMediaType"));
}else
{
var errorCode=RongIMLib.ErrorCode.VOIP_NOT_AVALIABLE;
RongIMClient.logger({
code:errorCode,
funcName:"changeMediaType"});

callback.onError(RongIMLib.ErrorCode.VOIP_NOT_AVALIABLE);
}
};
// # endVoIP
RongIMClient.prototype.getUnreadMentionedMessages=function(conversationType,targetId){
return RongIMClient._dataAccessProvider.getUnreadMentionedMessages(conversationType,targetId);
};
RongIMClient.prototype.clearListeners=function(){
RongIMClient._dataAccessProvider.clearListeners();
};
// UserStatus start
RongIMClient.prototype.getUserStatus=function(userId,callback){
RongIMClient._dataAccessProvider.getUserStatus(userId,RongIMClient.logCallback(callback,"getUserStatus"));
};
RongIMClient.prototype.setUserStatus=function(status,callback){
RongIMClient._dataAccessProvider.setUserStatus(status,RongIMClient.logCallback(callback,"setUserStatus"));
};
RongIMClient.prototype.setUserStatusListener=function(params,callback){
var userIds=params.userIds;
var multiple=params.multiple;
RongIMClient.userStatusObserver.watch({
key:userIds,
func:callback,
multiple:multiple});

RongIMClient._dataAccessProvider.setUserStatusListener(params,callback);
};
// UserStaus end
// RTC start
RongIMClient.messageWatch=function(watcher){
RongIMClient.RTCListener=watcher;
};
/*
            var data = {
                key1: 123,
                key2: 345
            };
        */
RongIMClient.prototype.getRTCUserInfoList=function(room,callback){
RongIMLib.CheckParam.getInstance().check(["object","object"],"getRTCUserInfoList",false,arguments);
RongIMClient._dataAccessProvider.getRTCUserInfoList(room,callback);
};
RongIMClient.prototype.getRTCUserList=function(room,callback){
RongIMLib.CheckParam.getInstance().check(["object","object"],"getRTCUserList",false,arguments);
RongIMClient._dataAccessProvider.getRTCUserList(room,callback);
};
RongIMClient.prototype.setRTCUserInfo=function(room,info,callback){
RongIMLib.CheckParam.getInstance().check(["object","object","object"],"setRTCUserInfo",false,arguments);
RongIMClient._dataAccessProvider.setRTCUserInfo(room,info,callback);
};
RongIMClient.prototype.removeRTCUserInfo=function(room,info,callback){
RongIMLib.CheckParam.getInstance().check(["object","object","object"],"removeRTCUserInfo",false,arguments);
RongIMClient._dataAccessProvider.removeRTCUserInfo(room,info,callback);
};
RongIMClient.prototype.getRTCRoomInfo=function(room,callback){
RongIMLib.CheckParam.getInstance().check(["object","object"],"getRTCRoomInfo",false,arguments);
RongIMClient._dataAccessProvider.getRTCRoomInfo(room,callback);
};
RongIMClient.prototype.setRTCRoomInfo=function(room,info,callback){
RongIMLib.CheckParam.getInstance().check(["object","object","object"],"setRTCRoomInfo",false,arguments);
RongIMClient._dataAccessProvider.setRTCRoomInfo(room,info,callback);
};
RongIMClient.prototype.removeRTCRoomInfo=function(room,info,callback){
RongIMLib.CheckParam.getInstance().check(["object","object","object"],"removeRTCRoomInfo",false,arguments);
RongIMClient._dataAccessProvider.removeRTCRoomInfo(room,info,callback);
};
RongIMClient.prototype.joinRTCRoom=function(room,callback){
RongIMLib.CheckParam.getInstance().check(["object","object"],"joinRTCRoom",false,arguments);
RongIMClient._dataAccessProvider.joinRTCRoom(room,callback);
};
RongIMClient.prototype.quitRTCRoom=function(room,callback){
RongIMLib.CheckParam.getInstance().check(["object","object"],"quitRTCRoom",false,arguments);
RongIMClient._dataAccessProvider.quitRTCRoom(room,callback);
};
RongIMClient.prototype.RTCPing=function(room,callback){
RongIMLib.CheckParam.getInstance().check(["object","object"],"RTCPing",false,arguments);
RongIMClient._dataAccessProvider.RTCPing(room,callback);
};
RongIMClient.prototype.setRTCUserData=function(roomId,key,value,isInner,callback,message){
RongIMLib.CheckParam.getInstance().check(["string","string","string","boolean","object","global|object|null|undefined"],"setRTCUserData",false,arguments);
RongIMClient._dataAccessProvider.setRTCUserData(roomId,key,value,isInner,callback,message);
};
RongIMClient.prototype.getRTCUserData=function(roomId,keys,isInner,callback){
RongIMLib.CheckParam.getInstance().check(["string","array","boolean","object","global|object|null"],"getRTCUserData",false,arguments);
RongIMClient._dataAccessProvider.getRTCUserData(roomId,keys,isInner,callback);
};
RongIMClient.prototype.removeRTCUserData=function(roomId,keys,isInner,callback,message){
RongIMLib.CheckParam.getInstance().check(["string","array","boolean","object","global|object|null|undefined"],"removeRTCUserData",false,arguments);
RongIMClient._dataAccessProvider.removeRTCUserData(roomId,keys,isInner,callback,message);
};
RongIMClient.prototype.setRTCRoomData=function(roomId,key,value,isInner,callback,message){
RongIMLib.CheckParam.getInstance().check(["string","string","string","boolean","object","global|object|null|undefined"],"setRTCRoomData",false,arguments);
RongIMClient._dataAccessProvider.setRTCRoomData(roomId,key,value,isInner,callback,message);
};
RongIMClient.prototype.getRTCRoomData=function(roomId,keys,isInner,callback){
RongIMLib.CheckParam.getInstance().check(["string","array","boolean","object"],"getRTCRoomData",false,arguments);
RongIMClient._dataAccessProvider.getRTCRoomData(roomId,keys,isInner,callback);
};
RongIMClient.prototype.removeRTCRoomData=function(roomId,keys,isInner,callback,message){
RongIMLib.CheckParam.getInstance().check(["string","array","boolean","object","global|object|null|undefined"],"removeRTCRoomData",false,arguments);
RongIMClient._dataAccessProvider.removeRTCRoomData(roomId,keys,isInner,callback,message);
};
RongIMClient.prototype.getNavi=function(){
return RongIMClient._dataAccessProvider.getNavi();
};
RongIMClient.prototype.getRTCToken=function(room,callback){
RongIMLib.CheckParam.getInstance().check(["object","object"],"getRTCToken",false,arguments);
return RongIMClient._dataAccessProvider.getRTCToken(room,callback);
};
RongIMClient.prototype.getAppInfo=function(){
var appKey=RongIMClient._memoryStore.appKey;
return{
appKey:appKey};

};
RongIMClient.RTCListener=function(){};
RongIMClient.LogFactory={};
RongIMClient.MessageType={};
RongIMClient.RegisterMessage={};
RongIMClient._memoryStore={listenerList:[],isPullFinished:false,syncMsgQueue:[]};
RongIMClient.isNotPullMsg=false;
RongIMClient.userStatusObserver=null;
RongIMClient.sdkver='2.4.0';
RongIMClient.otherDeviceLoginCount=0;
RongIMClient.serverStore={index:0};
RongIMClient.isFirstConnect=true;
RongIMClient.statusListeners=[];
RongIMClient.userStatusListener=null;
return RongIMClient;
}();
RongIMLib.RongIMClient=RongIMClient;
})(RongIMLib||(RongIMLib={}));
//用于连接通道
var RongIMLib;
(function(RongIMLib){
(function(Qos){
Qos[Qos["AT_MOST_ONCE"]=0]="AT_MOST_ONCE";
Qos[Qos["AT_LEAST_ONCE"]=1]="AT_LEAST_ONCE";
Qos[Qos["EXACTLY_ONCE"]=2]="EXACTLY_ONCE";
Qos[Qos["DEFAULT"]=3]="DEFAULT";
})(RongIMLib.Qos||(RongIMLib.Qos={}));
var Qos=RongIMLib.Qos;
(function(Type){
Type[Type["CONNECT"]=1]="CONNECT";
Type[Type["CONNACK"]=2]="CONNACK";
Type[Type["PUBLISH"]=3]="PUBLISH";
Type[Type["PUBACK"]=4]="PUBACK";
Type[Type["QUERY"]=5]="QUERY";
Type[Type["QUERYACK"]=6]="QUERYACK";
Type[Type["QUERYCON"]=7]="QUERYCON";
Type[Type["SUBSCRIBE"]=8]="SUBSCRIBE";
Type[Type["SUBACK"]=9]="SUBACK";
Type[Type["UNSUBSCRIBE"]=10]="UNSUBSCRIBE";
Type[Type["UNSUBACK"]=11]="UNSUBACK";
Type[Type["PINGREQ"]=12]="PINGREQ";
Type[Type["PINGRESP"]=13]="PINGRESP";
Type[Type["DISCONNECT"]=14]="DISCONNECT";
})(RongIMLib.Type||(RongIMLib.Type={}));
var Type=RongIMLib.Type;
var _topic=[
"invtDiz","crDiz","qnUrl","userInf","dizInf","userInf","joinGrp","quitDiz","exitGrp","evctDiz",
["","ppMsgP","pdMsgP","pgMsgP","chatMsg","pcMsgP","","pmcMsgN","pmpMsgN","","","","prMsgS"],
"pdOpen","rename","uGcmpr","qnTkn","destroyChrm","createChrm","exitChrm","queryChrm",
"joinChrm","pGrps","addBlack","rmBlack","getBlack","blackStat",
"addRelation","qryRelation","delRelation","pullMp","schMp","qnTkn",
"qnUrl","qryVoipK","delMsg","qryCHMsg","getUserStatus","setUserStatus",
"subUserStatus","cleanHisMsg"];

var Channel=function(){
function Channel(cb,self){
this.connectionStatus=-1;
var appId=self.appId;
var token=encodeURIComponent(self.token);
var sdkVer=self.sdkVer;
var apiVer=self.apiVer;
this.self=self;
this.socket=Socket.getInstance().createServer();
var that=this;
var storage=RongIMLib.RongIMClient._storageProvider;
var servers=storage.getItem('servers');
servers=JSON.parse(servers)||[];
var depend=RongIMLib.RongIMClient._memoryStore.depend;
var startConnect=function startConnect(host){
var tpl='{host}/websocket?appId={appId}&token={token}&sdkVer={sdkVer}&apiVer={apiVer}';
that.url=RongIMLib.RongUtil.tplEngine(tpl,{
host:host,
appId:appId,
token:token,
sdkVer:sdkVer,
apiVer:apiVer});

that.socket.connect(that.url,cb);
// 临时兼容 Comet 逻辑，Comet 中用到
var userId=storage.getItem('rong_current_user');
RongIMLib.Navigation.Endpoint={
host:host,
userId:userId};

};
var connectMap={
ws:function ws(){
// 所有链接计算器，超过 15 秒后认为所有 CMP 地址均不可用
var totalTimer=new RongIMLib.Timer({
timeout:1*1000*15});

var timers=[];
var xhrs=[];
var isFinished=false;
var clearHandler=function clearHandler(){
for(var i=0;i<timers.length;i++){
var timer=timers[i];
clearTimeout(timer);
}
for(var i=0;i<xhrs.length;i++){
var xhr=xhrs[i];
xhr.abort();
}
timers.length=0;
xhrs.length=0;
};
var request=function request(config,callback){
var url=config.url;
var time=config.time;
if(isFinished){
return;
}
var timer=setTimeout(function(){
var onSuccess=function onSuccess(){
if(isFinished){
return;
}
clearHandler();
isFinished=true;
totalTimer.pause();
callback(url);
};
var xhr=RongIMLib.MessageUtil.detectCMP({
url:url,
success:onSuccess,
fail:function fail(code){
console.log(code);
}});

xhrs.push(xhr);
},time);
timers.push(timer);
};
var snifferCallback=function snifferCallback(url){
var reg=/(http|https):\/\/([^\/]+)/i;
var host=url.match(reg)[2];
startConnect(host);
};
var snifferTpl='{protocol}{server}/ping?r={random}';
for(var i=0;i<servers.length;i++){
var server=servers[i];
if(server){
server=RongIMLib.RongUtil.tplEngine(snifferTpl,{
protocol:depend.protocol,
server:server,
random:RongIMLib.RongUtil.getTimestamp()});

request({
url:server,
time:i*1000},
snifferCallback);
}
}
totalTimer.resume(function(){
RongIMLib.Navigation.clear();
clearHandler();
that.socket.fire("StatusChanged",RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE);
});
},
comet:function comet(){
var host=servers[0];
startConnect(host);
}};

var isPolling=depend.isPolling;
var type=isPolling?'comet':'ws';
connectMap[type]();
//注册状态改变观察者
var StatusEvent=Channel._ConnectionStatusListener;
var hasEvent=typeof StatusEvent=="object";
var me=this;
me.socket.on("StatusChanged",function(code){
if(!hasEvent){
throw new Error("setConnectStatusListener:Parameter format is incorrect");
}
var isNetworkUnavailable=code==RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE;
var isWebSocket=!RongIMLib.RongIMClient._memoryStore.depend.isPolling;
if(RongIMLib.RongIMClient.isFirstConnect&&isNetworkUnavailable&&isWebSocket){
code=RongIMLib.ConnectionStatus.WEBSOCKET_UNAVAILABLE;
}
me.connectionStatus=code;
setTimeout(function(){
StatusEvent.onChanged(code);
});
var isDisconnected=code==RongIMLib.ConnectionStatus.DISCONNECTED;
if(isDisconnected){
self.clearHeartbeat();
}
var isOtherDevice=code==RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT;
if(isOtherDevice){
// 累计其他设备登陆次数，超过 5 次后，自动销毁内部对象
// 删除位置：ServerDataProivder.prototype.connect
RongIMLib.RongIMClient.otherDeviceLoginCount++;
}
var isConnected=code==RongIMLib.ConnectionStatus.CONNECTED;
if(isConnected){
RongIMLib.RongIMClient.isFirstConnect=false;
}
var isWebsocketUnAvailable=code==RongIMLib.ConnectionStatus.WEBSOCKET_UNAVAILABLE;
if(isWebsocketUnAvailable){
me.changeConnectType();
RongIMLib.RongIMClient.isFirstConnect=false;
RongIMLib.RongIMClient.connect(self.token,RongIMLib.RongIMClient._memoryStore.callback);
}
});
//注册message观察者
this.socket.on("message",self.handler.handleMessage);
//注册断开连接观察者
this.socket.on("disconnect",function(status){
that.socket.fire("StatusChanged",status?status:2);
});
}
Channel.prototype.changeConnectType=function(){
RongIMLib.RongIMClient._memoryStore.depend.isPolling=!RongIMLib.RongIMClient._memoryStore.depend.isPolling;
new RongIMLib.FeatureDectector();
};
Channel.prototype.writeAndFlush=function(val){
this.socket.send(val);
};
Channel.prototype.reconnect=function(callback){
RongIMLib.MessageIdHandler.clearMessageId();
this.socket=this.socket.reconnect();
if(callback){
this.self.reconnectObj=callback;
}
};
Channel.prototype.disconnect=function(status){
this.socket.disconnect(status);
};
return Channel;
}();
RongIMLib.Channel=Channel;
var Socket=function(){
function Socket(){
this.socket=null;
this._events={};
}
Socket.getInstance=function(){
return new Socket();
};
Socket.prototype.connect=function(url,cb){
if(this.socket){
if(url){
RongIMLib.RongIMClient._storageProvider.setItem("rongSDK",this.checkTransport());
this.on("connect",cb||new Function());
}
if(url){
this.currentURL=url;
}
this.socket.createTransport(url);
}
return this;
};
Socket.prototype.createServer=function(){
var transport=this.getTransport(this.checkTransport());
if(transport===null){
throw new Error("the channel was not supported");
}
return transport;
};
Socket.prototype.getTransport=function(transportType){
if(transportType==Socket.XHR_POLLING){
this.socket=new RongIMLib.PollingTransportation(this);
}else
if(transportType==Socket.WEBSOCKET){
this.socket=new RongIMLib.SocketTransportation(this);
}
return this;
};
Socket.prototype.send=function(data){
if(this.socket){
if(this.checkTransport()==Socket.WEBSOCKET){
this.socket.send(data);
}else
{
this.socket.send(this._encode(data));
}
}
};
Socket.prototype.onMessage=function(data){
this.fire("message",data);
};
Socket.prototype.disconnect=function(status){
this.socket.disconnect(status);
this.fire("disconnect",status);
return this;
};
Socket.prototype.reconnect=function(){
if(this.currentURL&&RongIMLib.RongIMClient._storageProvider.getItem("rongSDK")){
return this.connect(this.currentURL,null);
}else
{
throw new Error("reconnect:no have URL");
}
};
/**
         * [checkTransport 返回通道类型]
         */
Socket.prototype.checkTransport=function(){
if(RongIMLib.RongIMClient._memoryStore.depend.isPolling){
RongIMLib.Transportations._TransportType=Socket.XHR_POLLING;
}
return RongIMLib.Transportations._TransportType;
};
Socket.prototype.fire=function(x,args){
if(x in this._events){
for(var i=0,ii=this._events[x].length;i<ii;i++){
this._events[x][i](args);
}
}
return this;
};
Socket.prototype.on=function(x,func){
if(!(typeof func=="function"&&x)){
return this;
}
if(x in this._events){
RongIMLib.MessageUtil.indexOf(this._events,func)==-1&&this._events[x].push(func);
}else
{
this._events[x]=[func];
}
return this;
};
Socket.prototype.removeEvent=function(x,fn){
if(x in this._events){
for(var a=0,l=this._events[x].length;a<l;a++){
if(this._events[x][a]==fn){
this._events[x].splice(a,1);
}
}
}
return this;
};
Socket.prototype._encode=function(x){
var str="?messageid="+x.getMessageId()+"&header="+x.getHeaderFlag()+"&sessionid="+RongIMLib.RongIMClient._storageProvider.getItem("sId"+RongIMLib.Navigation.Endpoint.userId);
if(!/(PubAckMessage|QueryConMessage)/.test(x._name)){
str+="&topic="+x.getTopic()+"&targetid="+(x.getTargetId()||"");
}
return{
url:str,
data:"getData"in x?x.getData():""};

};
//消息通道常量，所有和通道相关判断均用 XHR_POLLING WEBSOCKET两属性
Socket.XHR_POLLING="xhr-polling";
Socket.WEBSOCKET="websocket";
return Socket;
}();
RongIMLib.Socket=Socket;
//连接端消息累
var Client=function(){
function Client(token,appId){
this.timeoutMillis=6000;
this.timeout_=0;
this.sdkVer='';
this.apiVer=Math.floor(Math.random()*1e6);
this.channel=null;
this.handler=null;
this.userId="";
this.reconnectObj={};
this.heartbeat=0;
this.pullMsgHearbeat=0;
this.chatroomId="";
this.SyncTimeQueue=[];
this.cacheMessageIds=[];
this.token=token;
this.appId=appId;
this.SyncTimeQueue.state="complete";
this.sdkVer=RongIMLib.RongIMClient.sdkver;
}
Client.prototype.resumeTimer=function(){
var me=this;
this.timeout_=setTimeout(function(){
me.channel.disconnect();
},this.timeoutMillis);
};
Client.prototype.pauseTimer=function(){
if(this.timeout_){
clearTimeout(this.timeout_);
this.timeout_=0;
}
};
Client.prototype.connect=function(_callback){
//实例消息处理类
this.handler=new MessageHandler(this);
//设置连接回调
this.handler.setConnectCallback(_callback);
//实例通道类型
var me=this;
this.channel=new Channel(function(){
RongIMLib.Transportations._TransportType==Socket.WEBSOCKET&&me.keepLive();
},this);
//触发状态改变观察者
this.channel.socket.fire("StatusChanged",RongIMLib.ConnectionStatus.CONNECTING);
//没有返回地址就手动抛出错误
//_callback.onError(ConnectionState.NOT_AUTHORIZED);
};
Client.prototype.checkSocket=function(callback){
var me=this;
me.channel.writeAndFlush(new RongIMLib.PingReqMessage());
var count=0;
var checkTimeout=setInterval(function(){
if(!RongIMLib.RongIMClient._memoryStore.isFirstPingMsg){
clearInterval(checkTimeout);
callback.onSuccess();
}else
{
if(count>15){
clearInterval(checkTimeout);
callback.onError();
}
}
count++;
},100);
};
Client.prototype.keepLive=function(){
if(this.heartbeat>0){
clearInterval(this.heartbeat);
}
var me=this;
me.heartbeat=setInterval(function(){
me.resumeTimer();
me.channel.writeAndFlush(new RongIMLib.PingReqMessage());
},30000);
if(me.pullMsgHearbeat>0){
clearInterval(me.pullMsgHearbeat);
}
me.pullMsgHearbeat=setInterval(function(){
me.syncTime(true,undefined,undefined,false);
},180000);
};
Client.prototype.clearHeartbeat=function(){
clearInterval(this.heartbeat);
this.heartbeat=0;
this.pauseTimer();
clearInterval(this.pullMsgHearbeat);
this.pullMsgHearbeat=0;
};
Client.prototype.publishMessage=function(_topic,_data,_targetId,_callback,_msg){
var msgId=RongIMLib.MessageIdHandler.messageIdPlus(this.channel.reconnect);
if(!msgId){
return;
}
var msg=new RongIMLib.PublishMessage(_topic,_data,_targetId);
msg.setMessageId(msgId);
if(_callback){
msg.setQos(Qos.AT_LEAST_ONCE);
this.handler.putCallback(new RongIMLib.PublishCallback(_callback.onSuccess,_callback.onError),msg.getMessageId(),_msg);
}else
{
msg.setQos(Qos.AT_MOST_ONCE);
}
this.channel.writeAndFlush(msg);
};
Client.prototype.queryMessage=function(_topic,_data,_targetId,_qos,_callback,pbtype){
if(_topic=="userInf"){
if(Client.userInfoMapping[_targetId]){
_callback.onSuccess(Client.userInfoMapping[_targetId]);
return;
}
}
var msgId=RongIMLib.MessageIdHandler.messageIdPlus(this.channel.reconnect);
if(!msgId){
return;
}
var msg=new RongIMLib.QueryMessage(_topic,_data,_targetId);
msg.setMessageId(msgId);
msg.setQos(_qos);
this.handler.putCallback(new RongIMLib.QueryCallback(_callback.onSuccess,_callback.onError),msg.getMessageId(),pbtype);
this.channel.writeAndFlush(msg);
};
Client.prototype.invoke=function(isPullMsg,chrmId,offlineMsg){
var time,modules,str,me=this,target,temp=this.SyncTimeQueue.shift();
if(temp==undefined){
return;
}
this.SyncTimeQueue.state="pending";
var localSyncTime=RongIMLib.SyncTimeUtil.get();
var sentBoxTime=localSyncTime.sent;
if(temp.type!=2){
//普通消息
time=localSyncTime.received;
modules=new RongIMLib.RongIMClient.Protobuf.SyncRequestMsg();
modules.setIspolling(false);
str="pullMsg";
target=this.userId;
modules.setSendBoxSyncTime(sentBoxTime);
}else
{
//聊天室消息
target=temp.chrmId||me.chatroomId;
time=RongIMLib.RongIMClient._memoryStore.lastReadTime.get(target+Bridge._client.userId+"CST")||0;
modules=new RongIMLib.RongIMClient.Protobuf.ChrmPullMsg();
modules.setCount(0);
str="chrmPull";
if(!target){
throw new Error("syncTime:Received messages of chatroom but was not init");
}
}
//判断服务器给的时间是否消息本地存储的时间，小于的话不执行拉取操作，进行一下步队列操作
if(temp.pulltime<=time){
this.SyncTimeQueue.state="complete";
this.invoke(isPullMsg,target,offlineMsg);
return;
}
if(isPullMsg&&'setIsPullSend'in modules){
modules.setIsPullSend(true);
}
modules.setSyncTime(time);
//发送queryMessage请求
this.queryMessage(str,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),target,Qos.AT_LEAST_ONCE,{
onSuccess:function onSuccess(collection){
var sync=RongIMLib.MessageUtil.int64ToTimestamp(collection.syncTime),symbol=target;
//把返回时间戳存入本地，普通消息key为userid，聊天室消息key为userid＋'CST'；value都为服务器返回的时间戳
var isChrmPull=str=='chrmPull';
if(isChrmPull){
symbol+=Bridge._client.userId+"CST";
RongIMLib.RongIMClient._memoryStore.lastReadTime.set(symbol,sync);
}else
{
var storage=RongIMLib.RongIMClient._storageProvider;
if(sync>storage.getItem(symbol)){
storage.setItem(symbol,sync);
}
}
//把拉取到的消息逐条传给消息监听器
var list=collection.list;
var isPullFinished=collection.finished;
// chrmPull 没有 finished 字段，自动设置为拉取完成
if(isChrmPull){
isPullFinished=true;
}
RongIMLib.RongIMClient._memoryStore.isPullFinished=isPullFinished;
var connectAckTime=RongIMLib.RongIMClient._memoryStore.connectAckTime;
for(var i=0,len=list.length,count=len;i<len;i++){
count-=1;
var message=list[i];
var sentTime=RongIMLib.MessageUtil.int64ToTimestamp(message.dataTime);
var isSender=message.direction==RongIMLib.MessageDirection.SEND;
var compareTime=isSender?sentBoxTime:time;
if(sentTime>compareTime){
var isSyncMessage=false;
var isOffLineMessage=sentTime<connectAckTime;
Bridge._client.handler.onReceived(message,undefined,isOffLineMessage,count,isSyncMessage,isPullFinished);
}
}
me.SyncTimeQueue.state="complete";
me.invoke(isPullMsg,target,offlineMsg);
},
onError:function onError(error){
me.SyncTimeQueue.state="complete";
me.invoke(isPullMsg,target,offlineMsg);
}},
"DownStreamMessages");
};
Client.prototype.syncTime=function(_type,pullTime,chrmId,offlineMsg){
this.SyncTimeQueue.push({type:_type,pulltime:pullTime,chrmId:chrmId});
//如果队列中只有一个成员并且状态已经完成就执行invoke方法
if(this.SyncTimeQueue.length==1&&this.SyncTimeQueue.state=="complete"){
this.invoke(!_type,chrmId,offlineMsg);
}
};
Client.prototype.__init=function(f){
this.handler=new MessageHandler(this);
//设置连接回调
this.handler.setConnectCallback(RongIMLib.RongIMClient._memoryStore.callback);
this.channel=new Channel(f,this);
};
Client.userInfoMapping={};
return Client;
}();
RongIMLib.Client=Client;
//连接类，实现imclient与connect_client的连接
var Bridge=function(){
function Bridge(){
}
Bridge.getInstance=function(){
return new Bridge();
};
//连接服务器
Bridge.prototype.connect=function(appKey,token,callback){
if(!RongIMLib.RongIMClient.Protobuf){
return;
}
Bridge._client=new RongIMLib.Navigation().connect(appKey,token,callback);
return Bridge._client;
};
Bridge.prototype.setListener=function(_changer){
if(typeof _changer=="object"){
if(typeof _changer.onChanged=="function"){
Channel._ConnectionStatusListener=_changer;
}else
if(typeof _changer.onReceived=="function"){
Channel._ReceiveMessageListener=_changer;
}
}
};
Bridge.prototype.reconnect=function(callabck){
Bridge._client.channel.reconnect(callabck);
};
Bridge.prototype.disconnect=function(){
Bridge._client.channel.disconnect(2);
};
//执行queryMessage请求
Bridge.prototype.queryMsg=function(topic,content,targetId,callback,pbname){
if(typeof topic!="string"){
topic=_topic[topic];
}
Bridge._client.queryMessage(topic,content,targetId,Qos.AT_MOST_ONCE,callback,pbname);
};
//发送消息 执行publishMessage 请求
Bridge.prototype.pubMsg=function(topic,content,targetId,callback,msg,methodType){
if(typeof methodType=='number'){
if(methodType==RongIMLib.MethodType.CUSTOMER_SERVICE){
Bridge._client.publishMessage("pcuMsgP",content,targetId,callback,msg);
}else
if(methodType==RongIMLib.MethodType.RECALL){
Bridge._client.publishMessage("recallMsg",content,targetId,callback,msg);
}
}else
{
Bridge._client.publishMessage(_topic[10][topic],content,targetId,callback,msg);
}
};
return Bridge;
}();
RongIMLib.Bridge=Bridge;
var MessageHandler=function(){
function MessageHandler(client){
this.map={};
this.connectCallback=null;
if(!Channel._ReceiveMessageListener){
throw new Error("please set onReceiveMessageListener");
}
this._onReceived=Channel._ReceiveMessageListener.onReceived;
this._client=client;
this.syncMsgMap=new Object();
}
//把对象推入回调对象队列中，并启动定时器
MessageHandler.prototype.putCallback=function(callbackObj,_publishMessageId,_msg){
var item={
Callback:callbackObj,
Message:_msg};

item.Callback.resumeTimer();
this.map[_publishMessageId]=item;
};
//设置连接回调对象，启动定时器
MessageHandler.prototype.setConnectCallback=function(_connectCallback){
if(_connectCallback){
this.connectCallback=new RongIMLib.ConnectAck(_connectCallback.onSuccess,_connectCallback.onError,this._client);
}
};
MessageHandler.prototype.onReceived=function(msg,pubAckItem,offlineMsg,leftCount,isSync){
//实体对象
var entity,
//解析完成的消息对象
message,
//会话对象
con;
if(msg._name!="PublishMessage"){
entity=msg;
RongIMLib.RongIMClient._storageProvider.setItem(this._client.userId,RongIMLib.MessageUtil.int64ToTimestamp(entity.dataTime));
}else
{
if(msg.getTopic()=="s_ntf"){
entity=RongIMLib.RongIMClient.Protobuf.NotifyMsg.decode(msg.getData());
this._client.syncTime(entity.type,RongIMLib.MessageUtil.int64ToTimestamp(entity.time),entity.chrmId);
return;
}else
if(msg.getTopic()=="s_msg"){
entity=RongIMLib.RongIMClient.Protobuf.DownStreamMessage.decode(msg.getData());
var timestamp=RongIMLib.MessageUtil.int64ToTimestamp(entity.dataTime);
RongIMLib.RongIMClient._storageProvider.setItem(this._client.userId,timestamp);
RongIMLib.RongIMClient._memoryStore.lastReadTime.get(this._client.userId,timestamp);
}else
if(msg.getTopic()=="s_stat"){
entity=RongIMLib.RongIMClient.Protobuf.GetUserStatusOutput.decode(msg.getData());
entity=RongIMLib.RongInnerTools.convertUserStatus(entity);
RongIMLib.RongIMClient.userStatusObserver.notify({
key:entity.userId,
entity:entity});

return;
}else
{
if(Bridge._client.sdkVer&&Bridge._client.sdkVer=="1.0.0"){
return;
}
entity=RongIMLib.RongIMClient.Protobuf.UpStreamMessage.decode(msg.getData());
var tmpTopic=msg.getTopic();
var tmpType=tmpTopic.substr(0,2);
if(tmpType=="pp"){
entity.type=1;
}else
if(tmpType=="pd"){
entity.type=2;
}else
if(tmpType=="pg"){
entity.type=3;
}else
if(tmpType=="ch"){
entity.type=4;
}else
if(tmpType=="pc"){
entity.type=5;
}
//复用字段，targetId 以此为准
entity.groupId=msg.getTargetId();
entity.fromUserId=this._client.userId;
entity.dataTime=Date.parse(new Date().toString());
}
if(!entity){
return;
}
}
var isPullFinished=RongIMLib.RongIMClient._memoryStore.isPullFinished;
// PullMsg 没有拉取完成，抛弃所有直发在线消息，抛弃的消息会在 PullMsg 中返回
if(!isPullFinished&&!offlineMsg){
return;
}
//解析实体对象为消息对象。
message=RongIMLib.MessageUtil.messageParser(entity,this._onReceived,offlineMsg);
var isRTCMessage=message.conversationType==12;
if(isRTCMessage){
return RongIMLib.RongIMClient.RTCListener(message);
}
var isRecall=msg.getTopic&&msg.getTopic()=="recallMsg";
if(isRecall){
var content=message.content;
message.conversationType=content.conversationType;
message.targetId=content.targetId;
message.messageId=null;
}
if(pubAckItem){
message.messageUId=pubAckItem.getMessageUId();
message.sentTime=pubAckItem.getTimestamp();
RongIMLib.RongIMClient._storageProvider.setItem(this._client.userId,message.sentTime);
}
if(message===null){
return;
}
var isChatroomMessage=message.conversationType==RongIMLib.ConversationType.CHATROOM;
if(!isChatroomMessage){
var msgTag=RongIMLib.RongIMClient.MessageParams[message.messageType].msgTag.getMessageTag();
if(msgTag>=0){
RongIMLib.SyncTimeUtil.set(message);
}
var isSend=message.messageDirection==RongIMLib.MessageDirection.SEND;
if(isSend){
var storageProvider=RongIMLib.RongIMClient._storageProvider;
var userId=RongIMLib.Bridge._client.userId;
var lastSentTime=storageProvider.getItem('last_sentTime_'+userId)||0;
if(message.sentTime<=lastSentTime&&!isSync){
return;
}
}
}
// 设置会话时间戳并且判断是否传递 message  发送消息未处理会话时间戳
// key：'converST_' + 当前用户 + conversationType + targetId
// RongIMClient._storageProvider.setItem('converST_' + Bridge._client.userId + message.conversationType + message.targetId, message.sentTime);
var isPersited=RongIMLib.RongIMClient.MessageParams[message.messageType].msgTag.getMessageTag()>0;
if(isPersited){
con=RongIMLib.RongIMClient._dataAccessProvider.getConversation(message.conversationType,message.targetId,{
onSuccess:function onSuccess(){},
onError:function onError(){}});

if(!con){
con=RongIMLib.RongIMClient.getInstance().createConversation(message.conversationType,message.targetId,"");
}
if(message.messageDirection==RongIMLib.MessageDirection.RECEIVE&&(entity.status&64)==64){
var mentioneds=RongIMLib.RongIMClient._storageProvider.getItem("mentioneds_"+Bridge._client.userId+'_'+message.conversationType+'_'+message.targetId);
var key=message.conversationType+'_'+message.targetId,info={};
if(message.content&&message.content.mentionedInfo){
info[key]={uid:message.messageUId,time:message.sentTime,mentionedInfo:message.content.mentionedInfo};
RongIMLib.RongIMClient._storageProvider.setItem("mentioneds_"+Bridge._client.userId+'_'+message.conversationType+'_'+message.targetId,JSON.stringify(info));
mentioneds=JSON.stringify(info);
}
if(mentioneds){
var info=JSON.parse(mentioneds);
con.mentionedMsg=info[key];
}
}
var isReceiver=message.messageDirection==RongIMLib.MessageDirection.RECEIVE;
if(isReceiver){
con.unreadMessageCount=con.unreadMessageCount+1;
if(RongIMLib.RongUtil.supportLocalStorage()){
var originUnreadCount=RongIMLib.RongIMClient._storageProvider.getItem("cu"+Bridge._client.userId+con.conversationType+con.targetId);// 与本地存储会话合并
var newUnreadCount=Number(originUnreadCount)+1;
RongIMLib.RongIMClient._storageProvider.setItem("cu"+Bridge._client.userId+con.conversationType+message.targetId,newUnreadCount);
con.unreadMessageCount=newUnreadCount;
}
}
con.receivedTime=new Date().getTime();
con.receivedStatus=message.receivedStatus;
con.senderUserId=message.sendUserId;
con.notificationStatus=RongIMLib.ConversationNotificationStatus.DO_NOT_DISTURB;
con.latestMessageId=message.messageId;
con.latestMessage=message;
con.sentTime=message.sentTime;
RongIMLib.RongIMClient._dataAccessProvider.addConversation(con,{onSuccess:function onSuccess(data){},onError:function onError(){}});
}
if(message.conversationType==RongIMLib.ConversationType.CUSTOMER_SERVICE&&(message.messageType=="ChangeModeResponseMessage"||message.messageType=="SuspendMessage"||message.messageType=="HandShakeResponseMessage"||
message.messageType=="TerminateMessage"||message.messageType=="CustomerStatusUpdateMessage"||message.messageType=="TextMessage"||message.messageType=="InformationNotificationMessage")){
if(!RongIMLib.RongIMClient._memoryStore.custStore["isInit"]){
return;
}
}
if(message.conversationType==RongIMLib.ConversationType.CUSTOMER_SERVICE&&message.messageType!="HandShakeResponseMessage"){
if(!RongIMLib.RongIMClient._memoryStore.custStore[message.targetId]){
return;
}
if(message.messageType=="TerminateMessage"){
if(RongIMLib.RongIMClient._memoryStore.custStore[message.targetId].sid!=message.content.sid){
return;
}
}
}
if(message.messageType===RongIMLib.RongIMClient.MessageType["HandShakeResponseMessage"]){
var session=message.content.data;
RongIMLib.RongIMClient._memoryStore.custStore[message.targetId]=session;
if(session.serviceType==RongIMLib.CustomerType.ONLY_HUMAN||session.serviceType==RongIMLib.CustomerType.HUMAN_FIRST){
if(session.notAutoCha=="1"){
RongIMLib.RongIMClient.getInstance().switchToHumanMode(message.targetId,{
onSuccess:function onSuccess(){},
onError:function onError(){}});

}
}
}
var d=new Date(),m=d.getMonth()+1,date=d.getFullYear()+'/'+(m.toString().length==1?'0'+m:m)+'/'+d.getDate();
//new Date(date).getTime() - message.sentTime < 1 逻辑判断 超过 1 天未收的 ReadReceiptRequestMessage 离线消息自动忽略。
var dealtime=new Date(date).getTime()-message.sentTime<0;
if(RongIMLib.RongUtil.supportLocalStorage()&&message.messageType===RongIMLib.RongIMClient.MessageType["ReadReceiptRequestMessage"]&&dealtime&&message.messageDirection==RongIMLib.MessageDirection.SEND){
var sentkey=Bridge._client.userId+message.content.messageUId+"SENT";
RongIMLib.RongIMClient._storageProvider.setItem(sentkey,JSON.stringify({count:0,dealtime:message.sentTime,userIds:{}}));
}else
if(RongIMLib.RongUtil.supportLocalStorage()&&message.messageType===RongIMLib.RongIMClient.MessageType["ReadReceiptRequestMessage"]&&dealtime){
var reckey=Bridge._client.userId+message.conversationType+message.targetId+'RECEIVED',recData=JSON.parse(RongIMLib.RongIMClient._storageProvider.getItem(reckey));
if(recData){
if(message.senderUserId in recData){
if(recData[message.senderUserId].uIds&&recData[message.senderUserId].uIds&&recData[message.senderUserId].uIds.indexOf(message.content.messageUId)==-1){
recData[message.senderUserId].uIds.push(message.content.messageUId);
recData[message.senderUserId].dealtime=message.sentTime;
recData[message.senderUserId].isResponse=false;
RongIMLib.RongIMClient._storageProvider.setItem(reckey,JSON.stringify(recData));
}else
{
return;
}
}else
{
var objSon={uIds:[message.content.messageUId],dealtime:message.sentTime,isResponse:false};
recData[message.senderUserId]=objSon;
RongIMLib.RongIMClient._storageProvider.setItem(reckey,JSON.stringify(recData));
}
}else
{
var obj={};
obj[message.senderUserId]={uIds:[message.content.messageUId],dealtime:message.sentTime,isResponse:false};
RongIMLib.RongIMClient._storageProvider.setItem(reckey,JSON.stringify(obj));
}
}
if(RongIMLib.RongUtil.supportLocalStorage()&&message.messageType===RongIMLib.RongIMClient.MessageType["ReadReceiptResponseMessage"]&&dealtime){
var receiptResponseMsg=message.content,uIds=receiptResponseMsg.receiptMessageDic[Bridge._client.userId],sentkey="",sentObj;
message.receiptResponse||(message.receiptResponse={});
if(uIds){
var cbuIds=[];
for(var i=0,len=uIds.length;i<len;i++){
sentkey=Bridge._client.userId+uIds[i]+"SENT";
sentObj=JSON.parse(RongIMLib.RongIMClient._storageProvider.getItem(sentkey));
if(sentObj&&!(message.senderUserId in sentObj.userIds)){
cbuIds.push(uIds[i]);
sentObj.count+=1;
sentObj.userIds[message.senderUserId]=message.sentTime;
message.receiptResponse[uIds[i]]=sentObj.count;
RongIMLib.RongIMClient._storageProvider.setItem(sentkey,JSON.stringify(sentObj));
}
}
receiptResponseMsg.receiptMessageDic[Bridge._client.userId]=cbuIds;
message.content=receiptResponseMsg;
}
}
var that=this;
if(RongIMLib.RongIMClient._voipProvider&&['AcceptMessage','RingingMessage','HungupMessage','InviteMessage','MediaModifyMessage','MemberModifyMessage'].indexOf(message.messageType)>-1){
setTimeout(function(){
RongIMLib.RongIMClient._voipProvider.onReceived(message);
});
}else
{
var count=leftCount||0;
var hasMore=!isPullFinished;
setTimeout(function(){
that._onReceived(message,count,hasMore);
});
}
};
MessageHandler.prototype.handleMessage=function(msg){
if(!msg){
return;
}
switch(msg._name){
case"ConnAckMessage":
Bridge._client.handler.connectCallback.process(msg.getStatus(),msg.getUserId(),msg.getTimestamp());
break;
case"PublishMessage":
if(!msg.getSyncMsg()&&msg.getQos()!=0){
Bridge._client.channel.writeAndFlush(new RongIMLib.PubAckMessage(msg.getMessageId()));
}
// TODO && ->
if(msg.getSyncMsg()&&!RongIMLib.RongIMClient._memoryStore.depend.isPolling){
Bridge._client.handler.syncMsgMap[msg.getMessageId()]=msg;
}else
{
//如果是PublishMessage就把该对象给onReceived方法执行处理
Bridge._client.handler.onReceived(msg);
}
break;
case"QueryAckMessage":
if(msg.getQos()!=0){
Bridge._client.channel.writeAndFlush(new RongIMLib.QueryConMessage(msg.getMessageId()));
}
var temp=Bridge._client.handler.map[msg.getMessageId()];
if(temp){
//执行回调操作
temp.Callback.process(msg.getStatus(),msg.getData(),msg.getDate(),temp.Message);
delete Bridge._client.handler.map[msg.getMessageId()];
}
break;
case"PubAckMessage":
var item=Bridge._client.handler.map[msg.getMessageId()];
if(item){
item.Callback.process(msg.getStatus()||0,msg.getMessageUId(),msg.getTimestamp(),item.Message,msg.getMessageId());
delete Bridge._client.handler.map[msg.getMessageId()];
}else
{
var userId=RongIMLib.Bridge._client.userId;
RongIMLib.RongIMClient._storageProvider.setItem('last_sentTime_'+userId,msg.timestamp);
Bridge._client.handler.onReceived(Bridge._client.handler.syncMsgMap[msg.messageId],msg,null,null,true);
delete Bridge._client.handler.syncMsgMap[msg.getMessageId()];
}
break;
case"PingRespMessage":
if(RongIMLib.RongIMClient._memoryStore.isFirstPingMsg){
RongIMLib.RongIMClient._memoryStore.isFirstPingMsg=false;
}else
{
Bridge._client.pauseTimer();
}
break;
case"DisconnectMessage":
Bridge._client.channel.disconnect(msg.getStatus());
break;
default:}

};
return MessageHandler;
}();
RongIMLib.MessageHandler=MessageHandler;
})(RongIMLib||(RongIMLib={}));
var __extends=this&&this.__extends||function(d,b){
for(var p in b){if(b.hasOwnProperty(p))d[p]=b[p];}
function __(){this.constructor=d;}
d.prototype=b===null?Object.create(b):(__.prototype=b.prototype,new __());
};
/// <reference path="../dts/helper.d.ts"/>
var RongIMLib;
(function(RongIMLib){
var MessageCallback=function(){
function MessageCallback(error){
this.timeout=null;
this.onError=null;
if(error&&typeof error=="number"){
this.timeoutMillis=error;
}else
{
this.timeoutMillis=30000;
this.onError=error;
}
}
MessageCallback.prototype.resumeTimer=function(){
var me=this;
if(this.timeoutMillis>0&&!this.timeout){
this.timeout=setTimeout(function(){
me.readTimeOut(true);
},this.timeoutMillis);
}
};
MessageCallback.prototype.pauseTimer=function(){
if(this.timeout){
clearTimeout(this.timeout);
this.timeout=null;
}
};
MessageCallback.prototype.readTimeOut=function(isTimeout){
if(isTimeout&&this.onError){
this.onError(RongIMLib.ErrorCode.TIMEOUT);
}else
{
this.pauseTimer();
}
};
return MessageCallback;
}();
RongIMLib.MessageCallback=MessageCallback;
var CallbackMapping=function(){
function CallbackMapping(){
this.publicServiceList=[];
}
CallbackMapping.getInstance=function(){
return new CallbackMapping();
};
CallbackMapping.prototype.pottingProfile=function(item){
var temp;
this.profile=new RongIMLib.PublicServiceProfile();
temp=JSON.parse(item.extra);
this.profile.isGlobal=temp.isGlobal;
this.profile.introduction=temp.introduction;
this.profile.menu=temp.menu;
this.profile.hasFollowed=temp.follow;
this.profile.publicServiceId=item.mpid;
this.profile.name=item.name;
this.profile.portraitUri=item.portraitUrl;
this.profile.conversationType=item.type=="mc"?RongIMLib.ConversationType.APP_PUBLIC_SERVICE:RongIMLib.ConversationType.PUBLIC_SERVICE;
this.publicServiceList.push(this.profile);
};
CallbackMapping.prototype.mapping=function(entity,tag){
switch(tag){
case"GetUserInfoOutput":
var userInfo=new RongIMLib.UserInfo(entity.userId,entity.userName,entity.userPortrait);
return userInfo;
case"GetQNupTokenOutput":
return{
deadline:RongIMLib.MessageUtil.int64ToTimestamp(entity.deadline),
token:entity.token};

case"GetQNdownloadUrlOutput":
return{
downloadUrl:entity.downloadUrl};

case"CreateDiscussionOutput":
return entity.id;
case"ChannelInfoOutput":
var disInfo=new RongIMLib.Discussion();
disInfo.creatorId=entity.adminUserId;
disInfo.id=entity.channelId;
disInfo.memberIdList=entity.firstTenUserIds;
disInfo.name=entity.channelName;
disInfo.isOpen=entity.openStatus;
return disInfo;
case"GroupHashOutput":
return entity.result;
case"QueryBlackListOutput":
return entity.userIds;
case"SearchMpOutput":
case"PullMpOutput":
if(entity.info){
var self=this;
Array.forEach(entity.info,function(item){
setTimeout(function(){
self.pottingProfile(item);
},100);
});
}
return this.publicServiceList;
default:
return entity;}

};
return CallbackMapping;
}();
RongIMLib.CallbackMapping=CallbackMapping;
var PublishCallback=function(_super){
__extends(PublishCallback,_super);
function PublishCallback(_cb,_timeout){
_super.call(this,_timeout);
this._cb=_cb;
this._timeout=_timeout;
}
PublishCallback.prototype.process=function(_status,messageUId,timestamp,_msg,messageId){
this.readTimeOut();
if(_status==0){
if(_msg){
_msg.setSentStatus=_status;
}
var isPullFinished=RongIMLib.RongIMClient._memoryStore.isPullFinished;
if(isPullFinished){
var userId=RongIMLib.Bridge._client.userId;
var stroageProvider=RongIMLib.RongIMClient._storageProvider;
stroageProvider.setItem('last_sentTime_'+userId,timestamp);
RongIMLib.SyncTimeUtil.set({
messageDirection:RongIMLib.MessageDirection.SEND,
sentTime:timestamp});

}
this._cb({messageUId:messageUId,timestamp:timestamp,messageId:messageId});
}else
{
this._timeout(_status,{
messageUId:messageUId,
sentTime:timestamp});

}
};
PublishCallback.prototype.readTimeOut=function(x){
MessageCallback.prototype.readTimeOut.call(this,x);
};
return PublishCallback;
}(MessageCallback);
RongIMLib.PublishCallback=PublishCallback;
var QueryCallback=function(_super){
__extends(QueryCallback,_super);
function QueryCallback(_cb,_timeout){
_super.call(this,_timeout);
this._cb=_cb;
this._timeout=_timeout;
}
QueryCallback.prototype.process=function(status,data,serverTime,pbtype){
this.readTimeOut();
if(pbtype&&data&&status==0){
try{
data=CallbackMapping.getInstance().mapping(RongIMLib.RongIMClient.Protobuf[pbtype].decode(data),pbtype);
}
catch(e){
this._timeout(RongIMLib.ErrorCode.UNKNOWN);
return;
}
if("GetUserInfoOutput"==pbtype){
//pb类型为GetUserInfoOutput的话就把data放入userinfo缓存队列
RongIMLib.Client.userInfoMapping[data.userId]=data;
}
this._cb(data);
}else
{
status>0?this._timeout(status):this._cb(status);
}
};
QueryCallback.prototype.readTimeOut=function(x){
MessageCallback.prototype.readTimeOut.call(this,x);
};
return QueryCallback;
}(MessageCallback);
RongIMLib.QueryCallback=QueryCallback;
var ConnectAck=function(_super){
__extends(ConnectAck,_super);
function ConnectAck(_cb,_timeout,client){
_super.call(this,_timeout);
this._client=client;
this._cb=_cb;
this._timeout=_timeout;
}
ConnectAck.prototype.process=function(status,userId,timestamp){
this.readTimeOut();
if(status==0){
this._client.userId=userId;
var self=this;
if(!RongIMLib.RongIMClient._memoryStore.depend.isPolling&&RongIMLib.RongIMClient._memoryStore.isFirstPingMsg){
RongIMLib.Bridge._client.checkSocket({
onSuccess:function onSuccess(){
if(!RongIMLib.RongIMClient.isNotPullMsg){
self._client.syncTime(undefined,undefined,undefined,true);
}
},
onError:function onError(){
RongIMLib.RongIMClient._memoryStore.isFirstPingMsg=false;
RongIMLib.RongIMClient.getInstance().disconnect();
RongIMLib.RongIMClient.connect(RongIMLib.RongIMClient._memoryStore.token,RongIMLib.RongIMClient._memoryStore.callback);
}});

}else
{
if(!RongIMLib.RongIMClient.isNotPullMsg){
self._client.syncTime(undefined,undefined,undefined,true);
}
}
RongIMLib.Bridge._client.channel.socket.fire("StatusChanged",0);
if(this._client.reconnectObj.onSuccess){
this._client.reconnectObj.onSuccess(userId);
delete this._client.reconnectObj.onSuccess;
}else
{
var me=this;
setTimeout(function(){me._cb(userId);},500);
}
RongIMLib.RongIMClient._memoryStore.connectAckTime=timestamp;
if(!(new Date().getTime()-timestamp)){
RongIMLib.RongIMClient._memoryStore.deltaTime=0;
}else
{
RongIMLib.RongIMClient._memoryStore.deltaTime=new Date().getTime()-timestamp;
}
}else
if(status==6){
RongIMLib.RongIMClient.getInstance().disconnect();
//重定向 连错 CMP
var me=this;
var _client=me._client;
var appId=_client.appId,token=_client.token;
new RongIMLib.Navigation().getServerEndpoint(token,appId,function(){
_client.clearHeartbeat();
var newClient=new RongIMLib.Client(token,appId);
RongIMLib.Bridge._client=newClient;
newClient.__init(function(){
RongIMLib.Transportations._TransportType=="websocket"&&newClient.keepLive();
});
},me._timeout,false);
}else
{
RongIMLib.Bridge._client.channel.socket.socket._status=status;
if(this._client.reconnectObj.onError){
this._client.reconnectObj.onError(status);
delete this._client.reconnectObj.onError;
}else
{
this._timeout(status);
}
}
};
ConnectAck.prototype.readTimeOut=function(x){
MessageCallback.prototype.readTimeOut.call(this,x);
};
return ConnectAck;
}(MessageCallback);
RongIMLib.ConnectAck=ConnectAck;
})(RongIMLib||(RongIMLib={}));
var RongIMLib;
(function(RongIMLib){
var Navigation=function(){
function Navigation(){
window.getServerEndpoint=function(result){
var storage=RongIMLib.RongIMClient._storageProvider;
storage.setItem('fullnavi',JSON.stringify(result));
var server=result.server;
if(server){
server+=',';
}
var backupServer=result.backupServer||'';
var tpl='{server}{backupServer}';
var servers=RongIMLib.RongUtil.tplEngine(tpl,{
server:server,
backupServer:backupServer});

servers=servers.split(',');
storage.setItem('servers',JSON.stringify(servers));
var token=RongIMLib.RongIMClient._memoryStore.token;
var uid=RongIMLib.InnerUtil.getUId(token);
storage.setItem('rc_uid',uid);
var userId=result.userId;
storage.setItem('current_user',userId);
if(result.voipCallInfo){
var callInfo=JSON.parse(result.voipCallInfo);
RongIMLib.RongIMClient._memoryStore.voipStategy=callInfo.strategy;
storage.setItem("voipStrategy",callInfo.strategy);
}
//替换本地存储的导航信息 
var openMp=result.openMp;
storage.setItem('openMp'+uid,openMp);
RongIMLib.RongIMClient._memoryStore.depend.openMp=openMp;
var StatusEvent=RongIMLib.Channel._ConnectionStatusListener;
StatusEvent.onChanged(RongIMLib.ConnectionStatus.RESPONSE_NAVI);
};
}
Navigation.clear=function(){
var storage=RongIMLib.RongIMClient._storageProvider;
storage.removeItem('rc_uid');
storage.removeItem('serverIndex');
storage.removeItem('rongSDK');
};
Navigation.prototype.connect=function(appId,token,callback){
var oldAppId=RongIMLib.RongIMClient._storageProvider.getItem("appId");
//如果appid和本地存储的不一样，清空所有本地存储数据
if(oldAppId&&oldAppId!=appId){
RongIMLib.RongIMClient._storageProvider.clearItem();
RongIMLib.RongIMClient._storageProvider.setItem("appId",appId);
}
if(!oldAppId){
RongIMLib.RongIMClient._storageProvider.setItem("appId",appId);
}
var client=new RongIMLib.Client(token,appId);
var me=this;
this.getServerEndpoint(token,appId,function(){
client.connect(callback);
},callback.onError,true);
return client;
};
Navigation.prototype.getServerEndpoint=function(token,appId,_onsuccess,_onerror,unignore){
if(unignore){
//根据token生成MD5截取8-16下标的数据与本地存储的导航信息进行比对
//如果信息和上次的通道类型都一样，不执行navi请求，用本地存储的导航信息连接服务器
var uId=md5(token).slice(8,16);
var storage=RongIMLib.RongIMClient._storageProvider;
var transportType=storage.getItem("rongSDK");
var isSameType=RongIMLib.Transportations._TransportType==transportType;
var _old=storage.getItem('rc_uid');
var isSameUser=_old==uId;
var servers=storage.getItem('servers');
var hasServers=typeof servers=='string';
if(isSameUser&&isSameType&&hasServers){
RongIMLib.RongIMClient._memoryStore.voipStategy=storage.getItem("voipStrategy");
var openMp=storage.getItem('openMp'+uId);
RongIMLib.RongIMClient._memoryStore.depend.openMp=openMp;
_onsuccess();
return;
}
}
Navigation.clear();
var StatusEvent=RongIMLib.Channel._ConnectionStatusListener;
StatusEvent.onChanged(RongIMLib.ConnectionStatus.REQUEST_NAVI);
//导航信息，切换Url对象的key进行线上线下测试操作
var xss=document.createElement("script");
//进行jsonp请求
var depend=RongIMLib.RongIMClient._memoryStore.depend;
var domain=depend.navi;
var path=depend.isPolling?'cometnavi':'navi';
token=encodeURIComponent(token);
var sdkver=RongIMLib.RongIMClient.sdkver;
var random=RongIMLib.RongUtil.getTimestamp();
var tpl='{domain}/{path}.js?appId={appId}&token={token}&callBack=getServerEndpoint&v={sdkver}&r={random}';
var url=RongIMLib.RongUtil.tplEngine(tpl,{
domain:domain,
path:path,
appId:appId,
token:token,
sdkver:sdkver,
random:random});

xss.src=url;
document.body.appendChild(xss);
xss.onerror=function(){
_onerror(RongIMLib.ConnectionState.TOKEN_INCORRECT);
};
if("onload"in xss){
xss.onload=_onsuccess;
}else
{
xss.onreadystatechange=function(){
xss.readyState=="loaded"&&_onsuccess();
};
}
};
Navigation.Endpoint=new Object();
return Navigation;
}();
RongIMLib.Navigation=Navigation;
})(RongIMLib||(RongIMLib={}));
// TODO: 统一变量、方法等命名规范
var RongIMLib;
(function(RongIMLib){
/**
     * 消息基类
     */
var BaseMessage=function(){
function BaseMessage(arg){
this._name="BaseMessage";
this.lengthSize=0;
if(arg instanceof RongIMLib.Header){
this._header=arg;
}else
{
this._header=new RongIMLib.Header(arg,false,RongIMLib.Qos.AT_MOST_ONCE,false);
}
}
BaseMessage.prototype.read=function(In,length){
this.readMessage(In,length);
};
BaseMessage.prototype.write=function(Out){
var binaryHelper=new RongIMLib.BinaryHelper();
var out=binaryHelper.convertStream(Out);
this._headerCode=this.getHeaderFlag();
out.write(this._headerCode);
this.writeMessage(out);
return out;
};
BaseMessage.prototype.getHeaderFlag=function(){
return this._header.encode();
};
BaseMessage.prototype.getLengthSize=function(){
return this.lengthSize;
};
BaseMessage.prototype.toBytes=function(){
return this.write([]).getBytesArray();
};
BaseMessage.prototype.isRetained=function(){
return this._header.retain;
};
BaseMessage.prototype.setRetained=function(retain){
this._header.retain=retain;
};
BaseMessage.prototype.setQos=function(qos){
this._header.qos=Object.prototype.toString.call(qos)=="[object Object]"?qos:RongIMLib.Qos[qos];
};
BaseMessage.prototype.setDup=function(dup){
this._header.dup=dup;
};
BaseMessage.prototype.isDup=function(){
return this._header.dup;
};
BaseMessage.prototype.getType=function(){
return this._header.type;
};
BaseMessage.prototype.getQos=function(){
return this._header.qos;
};
BaseMessage.prototype.messageLength=function(){
return 0;
};
BaseMessage.prototype.writeMessage=function(out){};
BaseMessage.prototype.readMessage=function(In,length){};
BaseMessage.prototype.init=function(args){
var valName,nana,me=this;
for(nana in args){
if(!args.hasOwnProperty(nana)){
continue;
}
valName=nana.replace(/^\w/,function(x){
var tt=x.charCodeAt(0);
return"set"+(tt>=0x61?String.fromCharCode(tt&~32):x);
});
if(valName in me){
if(nana=="status"){
me[valName](disconnectStatus[args[nana]]?disconnectStatus[args[nana]]:args[nana]);
}else
{
me[valName](args[nana]);
}
}
}
};
return BaseMessage;
}();
RongIMLib.BaseMessage=BaseMessage;
/**
     *连接消息类型
     */
var ConnectMessage=function(_super){
__extends(ConnectMessage,_super);
function ConnectMessage(header){
_super.call(this,arguments.length==0||arguments.length==3?RongIMLib.Type.CONNECT:arguments[0]);
this._name="ConnectMessage";
this.CONNECT_HEADER_SIZE=12;
this.protocolId="RCloud";
this.binaryHelper=new RongIMLib.BinaryHelper();
this.protocolVersion=3;
switch(arguments.length){
case 0:
case 1:
case 3:
if(!arguments[0]||arguments[0].length>64){
throw new Error("ConnectMessage:Client Id cannot be null and must be at most 64 characters long: "+arguments[0]);
}
this.clientId=arguments[0];
this.cleanSession=arguments[1];
this.keepAlive=arguments[2];
break;}

}
ConnectMessage.prototype.messageLength=function(){
var payloadSize=this.binaryHelper.toMQttString(this.clientId).length;
payloadSize+=this.binaryHelper.toMQttString(this.willTopic).length;
payloadSize+=this.binaryHelper.toMQttString(this.will).length;
payloadSize+=this.binaryHelper.toMQttString(this.appId).length;
payloadSize+=this.binaryHelper.toMQttString(this.token).length;
return payloadSize+this.CONNECT_HEADER_SIZE;
};
ConnectMessage.prototype.readMessage=function(stream){
this.protocolId=stream.readUTF();
this.protocolVersion=stream.readByte();
var cFlags=stream.readByte();
this.hasAppId=(cFlags&128)>0;
this.hasToken=(cFlags&64)>0;
this.retainWill=(cFlags&32)>0;
this.willQos=cFlags>>3&3;
this.hasWill=(cFlags&4)>0;
this.cleanSession=(cFlags&32)>0;
this.keepAlive=stream.read()*256+stream.read();
this.clientId=stream.readUTF();
if(this.hasWill){
this.willTopic=stream.readUTF();
this.will=stream.readUTF();
}
if(this.hasAppId){
try{
this.appId=stream.readUTF();
}
catch(ex){
throw new Error(ex);
}
}
if(this.hasToken){
try{
this.token=stream.readUTF();
}
catch(ex){
throw new Error(ex);
}
}
return stream;
};
ConnectMessage.prototype.writeMessage=function(out){
var stream=this.binaryHelper.convertStream(out);
stream.writeUTF(this.protocolId);
stream.write(this.protocolVersion);
var flags=this.cleanSession?2:0;
flags|=this.hasWill?4:0;
flags|=this.willQos?this.willQos>>3:0;
flags|=this.retainWill?32:0;
flags|=this.hasToken?64:0;
flags|=this.hasAppId?128:0;
stream.write(flags);
stream.writeChar(this.keepAlive);
stream.writeUTF(this.clientId);
if(this.hasWill){
stream.writeUTF(this.willTopic);
stream.writeUTF(this.will);
}
if(this.hasAppId){
stream.writeUTF(this.appId);
}
if(this.hasToken){
stream.writeUTF(this.token);
}
return stream;
};
return ConnectMessage;
}(BaseMessage);
RongIMLib.ConnectMessage=ConnectMessage;
/**
     *连接应答类型
     */
var ConnAckMessage=function(_super){
__extends(ConnAckMessage,_super);
function ConnAckMessage(header){
_super.call(this,arguments.length==0?RongIMLib.Type.CONNACK:arguments.length==1?arguments[0]instanceof RongIMLib.Header?arguments[0]:RongIMLib.Type.CONNACK:null);
this._name="ConnAckMessage";
this.MESSAGE_LENGTH=2;
this.binaryHelper=new RongIMLib.BinaryHelper();
var me=this;
switch(arguments.length){
case 0:
case 1:
if(!(arguments[0]instanceof RongIMLib.Header)){
if(arguments[0]in RongIMLib.ConnectionState){
if(arguments[0]==null){
throw new Error("ConnAckMessage:The status of ConnAskMessage can't be null");
}
me.setStatus(arguments[0]);
}
}
break;}

}
;
ConnAckMessage.prototype.messageLength=function(){
var length=this.MESSAGE_LENGTH;
if(this.userId){
length+=this.binaryHelper.toMQttString(this.userId).length;
}
return length;
};
;
ConnAckMessage.prototype.readMessage=function(_in,msglength){
_in.read();
var result=+_in.read();
if(result>=0&&result<=12){
this.setStatus(result);
}else
{
throw new Error("Unsupported CONNACK code:"+result);
}
if(msglength>this.MESSAGE_LENGTH){
this.setUserId(_in.readUTF());
var sessionId=_in.readUTF();
var timestamp=_in.readLong();
this.setTimestamp(timestamp);
}
};
;
ConnAckMessage.prototype.writeMessage=function(out){
var stream=this.binaryHelper.convertStream(out);
stream.write(128);
switch(+status){
case 0:
case 1:
case 2:
case 5:
case 6:
stream.write(+status);
break;
case 3:
case 4:
stream.write(3);
break;
default:
throw new Error("Unsupported CONNACK code:"+status);}

if(this.userId){
stream.writeUTF(this.userId);
}
return stream;
};
;
ConnAckMessage.prototype.setStatus=function(x){
this.status=x;
};
;
ConnAckMessage.prototype.setUserId=function(_userId){
this.userId=_userId;
};
;
ConnAckMessage.prototype.getStatus=function(){
return this.status;
};
;
ConnAckMessage.prototype.getUserId=function(){
return this.userId;
};
;
ConnAckMessage.prototype.setTimestamp=function(x){
this.timestrap=x;
};
;
ConnAckMessage.prototype.getTimestamp=function(){
return this.timestrap;
};
return ConnAckMessage;
}(BaseMessage);
RongIMLib.ConnAckMessage=ConnAckMessage;
/**
     *断开消息类型
     */
var DisconnectMessage=function(_super){
__extends(DisconnectMessage,_super);
function DisconnectMessage(header){
_super.call(this,header instanceof RongIMLib.Header?header:RongIMLib.Type.DISCONNECT);
this._name="DisconnectMessage";
this.MESSAGE_LENGTH=2;
this.binaryHelper=new RongIMLib.BinaryHelper();
if(!(header instanceof RongIMLib.Header)){
if(header in RongIMLib.ConnectionStatus){
this.status=header;
}
}
}
DisconnectMessage.prototype.messageLength=function(){
return this.MESSAGE_LENGTH;
};
DisconnectMessage.prototype.readMessage=function(_in){
_in.read();
var result=+_in.read();
if(result>=0&&result<=5){
this.setStatus(disconnectStatus[result]?disconnectStatus[result]:result);
}else
{
throw new Error("Unsupported CONNACK code:"+result);
}
};
DisconnectMessage.prototype.writeMessage=function(Out){
var out=this.binaryHelper.convertStream(Out);
out.write(0);
if(+status>=1&&+status<=3){
out.write(+status-1);
}else
{
throw new Error("Unsupported CONNACK code:"+status);
}
};
DisconnectMessage.prototype.setStatus=function(x){
this.status=x;
};
;
DisconnectMessage.prototype.getStatus=function(){
return this.status;
};
;
return DisconnectMessage;
}(BaseMessage);
RongIMLib.DisconnectMessage=DisconnectMessage;
/**
     *请求消息信令
     */
var PingReqMessage=function(_super){
__extends(PingReqMessage,_super);
function PingReqMessage(header){
_super.call(this,header&&header instanceof RongIMLib.Header?header:RongIMLib.Type.PINGREQ);
this._name="PingReqMessage";
}
return PingReqMessage;
}(BaseMessage);
RongIMLib.PingReqMessage=PingReqMessage;
/**
     *响应消息信令
     */
var PingRespMessage=function(_super){
__extends(PingRespMessage,_super);
function PingRespMessage(header){
_super.call(this,header&&header instanceof RongIMLib.Header?header:RongIMLib.Type.PINGRESP);
this._name="PingRespMessage";
}
return PingRespMessage;
}(BaseMessage);
RongIMLib.PingRespMessage=PingRespMessage;
/**
     *封装MesssageId
     */
var RetryableMessage=function(_super){
__extends(RetryableMessage,_super);
function RetryableMessage(argu){
_super.call(this,argu);
this._name="RetryableMessage";
this.binaryHelper=new RongIMLib.BinaryHelper();
}
RetryableMessage.prototype.messageLength=function(){
return 2;
};
RetryableMessage.prototype.writeMessage=function(Out){
var out=this.binaryHelper.convertStream(Out),Id=this.getMessageId(),lsb=Id&255,msb=(Id&65280)>>8;
out.write(msb);
out.write(lsb);
return out;
};
RetryableMessage.prototype.readMessage=function(_in,msgLength){
var msgId=_in.read()*256+_in.read();
this.setMessageId(parseInt(msgId,10));
};
RetryableMessage.prototype.setMessageId=function(_messageId){
this.messageId=_messageId;
};
RetryableMessage.prototype.getMessageId=function(){
return this.messageId;
};
return RetryableMessage;
}(BaseMessage);
RongIMLib.RetryableMessage=RetryableMessage;
/**
     *发送消息应答（双向）
     *qos为1必须给出应答（所有消息类型一样）
     */
var PubAckMessage=function(_super){
__extends(PubAckMessage,_super);
function PubAckMessage(header){
_super.call(this,header instanceof RongIMLib.Header?header:RongIMLib.Type.PUBACK);
this.msgLen=2;
this.date=0;
this.millisecond=0;
this.timestamp=0;
this.binaryHelper=new RongIMLib.BinaryHelper();
this._name="PubAckMessage";
if(!(header instanceof RongIMLib.Header)){
_super.prototype.setMessageId.call(this,header);
}
}
PubAckMessage.prototype.messageLength=function(){
return this.msgLen;
};
PubAckMessage.prototype.writeMessage=function(Out){
var out=this.binaryHelper.convertStream(Out);
RetryableMessage.prototype.writeMessage.call(this,out);
};
PubAckMessage.prototype.readMessage=function(_in,msgLength){
RetryableMessage.prototype.readMessage.call(this,_in);
this.date=_in.readInt();
this.status=_in.read()*256+_in.read();
this.millisecond=_in.read()*256+_in.read();
this.timestamp=this.date*1000+this.millisecond;
this.messageUId=_in.readUTF();
};
PubAckMessage.prototype.setStatus=function(x){
this.status=x;
};
PubAckMessage.prototype.setTimestamp=function(timestamp){
this.timestamp=timestamp;
};
PubAckMessage.prototype.setMessageUId=function(messageUId){
this.messageUId=messageUId;
};
PubAckMessage.prototype.getStatus=function(){
return this.status;
};
PubAckMessage.prototype.getDate=function(){
return this.date;
};
PubAckMessage.prototype.getTimestamp=function(){
return this.timestamp;
};
PubAckMessage.prototype.getMessageUId=function(){
return this.messageUId;
};
return PubAckMessage;
}(RetryableMessage);
RongIMLib.PubAckMessage=PubAckMessage;
/**
     *发布消息
     */
var PublishMessage=function(_super){
__extends(PublishMessage,_super);
function PublishMessage(header,two,three){
_super.call(this,arguments.length==1&&header instanceof RongIMLib.Header?header:arguments.length==3?RongIMLib.Type.PUBLISH:0);
this._name="PublishMessage";
this.binaryHelper=new RongIMLib.BinaryHelper();
this.syncMsg=false;
if(arguments.length==3){
this.topic=header;
this.targetId=three;
this.data=typeof two=="string"?this.binaryHelper.toMQttString(two):two;
}
}
PublishMessage.prototype.messageLength=function(){
var length=10;
length+=this.binaryHelper.toMQttString(this.topic).length;
length+=this.binaryHelper.toMQttString(this.targetId).length;
length+=this.data.length;
return length;
};
PublishMessage.prototype.writeMessage=function(Out){
var out=this.binaryHelper.convertStream(Out);
out.writeUTF(this.topic);
out.writeUTF(this.targetId);
RetryableMessage.prototype.writeMessage.apply(this,arguments);
out.write(this.data);
};
;
PublishMessage.prototype.readMessage=function(_in,msgLength){
var pos=6;
this.date=_in.readInt();
this.topic=_in.readUTF();
pos+=this.binaryHelper.toMQttString(this.topic).length;
this.targetId=_in.readUTF();
pos+=this.binaryHelper.toMQttString(this.targetId).length;
RetryableMessage.prototype.readMessage.apply(this,arguments);
this.data=new Array(msgLength-pos);
this.data=_in.read(this.data);
};
;
PublishMessage.prototype.setTopic=function(x){
this.topic=x;
};
PublishMessage.prototype.setData=function(x){
this.data=x;
};
PublishMessage.prototype.setTargetId=function(x){
this.targetId=x;
};
PublishMessage.prototype.setDate=function(x){
this.date=x;
};
PublishMessage.prototype.setSyncMsg=function(x){
this.syncMsg=x;
};
//是否是其他端同步过来的消息
PublishMessage.prototype.getSyncMsg=function(){
return this.syncMsg;
};
PublishMessage.prototype.getTopic=function(){
return this.topic;
};
PublishMessage.prototype.getData=function(){
return this.data;
};
PublishMessage.prototype.getTargetId=function(){
return this.targetId;
};
PublishMessage.prototype.getDate=function(){
return this.date;
};
return PublishMessage;
}(RetryableMessage);
RongIMLib.PublishMessage=PublishMessage;
/**
     *请求查询
     */
var QueryMessage=function(_super){
__extends(QueryMessage,_super);
function QueryMessage(header,two,three){
_super.call(this,header instanceof RongIMLib.Header?header:arguments.length==3?RongIMLib.Type.QUERY:null);
this.binaryHelper=new RongIMLib.BinaryHelper();
this._name="QueryMessage";
if(arguments.length==3){
this.data=typeof two=="string"?this.binaryHelper.toMQttString(two):two;
this.topic=header;
this.targetId=three;
}
}
QueryMessage.prototype.messageLength=function(){
var length=0;
length+=this.binaryHelper.toMQttString(this.topic).length;
length+=this.binaryHelper.toMQttString(this.targetId).length;
length+=2;
length+=this.data.length;
return length;
};
QueryMessage.prototype.writeMessage=function(Out){
var out=this.binaryHelper.convertStream(Out);
out.writeUTF(this.topic);
out.writeUTF(this.targetId);
RetryableMessage.prototype.writeMessage.call(this,out);
out.write(this.data);
};
QueryMessage.prototype.readMessage=function(_in,msgLength){
var pos=0;
this.topic=_in.readUTF();
this.targetId=_in.readUTF();
pos+=this.binaryHelper.toMQttString(this.topic).length;
pos+=this.binaryHelper.toMQttString(this.targetId).length;
this.readMessage.apply(this,arguments);
pos+=2;
this.data=new Array(msgLength-pos);
_in.read(this.data);
};
QueryMessage.prototype.setTopic=function(x){
this.topic=x;
};
QueryMessage.prototype.setData=function(x){
this.data=x;
};
QueryMessage.prototype.setTargetId=function(x){
this.targetId=x;
};
QueryMessage.prototype.getTopic=function(){
return this.topic;
};
QueryMessage.prototype.getData=function(){
return this.data;
};
QueryMessage.prototype.getTargetId=function(){
return this.targetId;
};
return QueryMessage;
}(RetryableMessage);
RongIMLib.QueryMessage=QueryMessage;
/**
     *请求查询确认
     */
var QueryConMessage=function(_super){
__extends(QueryConMessage,_super);
function QueryConMessage(messageId){
_super.call(this,messageId instanceof RongIMLib.Header?messageId:RongIMLib.Type.QUERYCON);
this._name="QueryConMessage";
if(!(messageId instanceof RongIMLib.Header)){
_super.prototype.setMessageId.call(this,messageId);
}
}
return QueryConMessage;
}(RetryableMessage);
RongIMLib.QueryConMessage=QueryConMessage;
/**
     *请求查询应答
     */
var QueryAckMessage=function(_super){
__extends(QueryAckMessage,_super);
function QueryAckMessage(header){
_super.call(this,header);
this._name="QueryAckMessage";
this.binaryHelper=new RongIMLib.BinaryHelper();
}
QueryAckMessage.prototype.readMessage=function(In,msgLength){
RetryableMessage.prototype.readMessage.call(this,In);
this.date=In.readInt();
this.setStatus(In.read()*256+In.read());
if(msgLength>0){
this.data=new Array(msgLength-8);
this.data=In.read(this.data);
}
};
QueryAckMessage.prototype.getData=function(){
return this.data;
};
QueryAckMessage.prototype.getStatus=function(){
return this.status;
};
QueryAckMessage.prototype.getDate=function(){
return this.date;
};
QueryAckMessage.prototype.setDate=function(x){
this.date=x;
};
QueryAckMessage.prototype.setStatus=function(x){
this.status=x;
};
QueryAckMessage.prototype.setData=function(x){
this.data=x;
};
return QueryAckMessage;
}(RetryableMessage);
RongIMLib.QueryAckMessage=QueryAckMessage;
})(RongIMLib||(RongIMLib={}));
/// <reference path="../../dts/helper.d.ts"/>
var RongIMLib;
(function(RongIMLib){
/**
     * 把消息对象写入流中
     * 发送消息时用到
     */
var MessageOutputStream=function(){
function MessageOutputStream(_out){
var binaryHelper=new RongIMLib.BinaryHelper();
this.out=binaryHelper.convertStream(_out);
}
MessageOutputStream.prototype.writeMessage=function(msg){
if(msg instanceof RongIMLib.BaseMessage){
msg.write(this.out);
}
};
return MessageOutputStream;
}();
RongIMLib.MessageOutputStream=MessageOutputStream;
/**
     * 流转换为消息对象
     * 服务器返回消息时用到
     */
var MessageInputStream=function(){
function MessageInputStream(In,isPolling){
if(!isPolling){
var _in=new RongIMLib.BinaryHelper().convertStream(In);
this.flags=_in.readByte();
this._in=_in;
}else
{
this.flags=In["headerCode"];
}
this.header=new RongIMLib.Header(this.flags);
this.isPolling=isPolling;
this.In=In;
}
MessageInputStream.prototype.readMessage=function(){
switch(this.header.getType()){
case 1:
this.msg=new RongIMLib.ConnectMessage(this.header);
break;
case 2:
this.msg=new RongIMLib.ConnAckMessage(this.header);
break;
case 3:
this.msg=new RongIMLib.PublishMessage(this.header);
this.msg.setSyncMsg(this.header.getSyncMsg());
break;
case 4:
this.msg=new RongIMLib.PubAckMessage(this.header);
break;
case 5:
this.msg=new RongIMLib.QueryMessage(this.header);
break;
case 6:
this.msg=new RongIMLib.QueryAckMessage(this.header);
break;
case 7:
this.msg=new RongIMLib.QueryConMessage(this.header);
break;
case 9:
case 11:
case 13:
this.msg=new RongIMLib.PingRespMessage(this.header);
break;
case 8:
case 10:
case 12:
this.msg=new RongIMLib.PingReqMessage(this.header);
break;
case 14:
this.msg=new RongIMLib.DisconnectMessage(this.header);
break;
default:
throw new Error("No support for deserializing "+this.header.getType()+" messages");}

if(this.isPolling){
this.msg.init(this.In);
}else
{
this.msg.read(this._in,this.In.length-1);
}
return this.msg;
};
return MessageInputStream;
}();
RongIMLib.MessageInputStream=MessageInputStream;
var Header=function(){
function Header(_type,_retain,_qos,_dup){
this.retain=false;
this.qos=RongIMLib.Qos.AT_LEAST_ONCE;
this.dup=false;
this.syncMsg=false;
if(_type&&+_type==_type&&arguments.length==1){
this.retain=(_type&1)>0;
this.qos=(_type&6)>>1;
this.dup=(_type&8)>0;
this.type=_type>>4&15;
this.syncMsg=(_type&8)==8;
}else
{
this.type=_type;
this.retain=_retain;
this.qos=_qos;
this.dup=_dup;
}
}
Header.prototype.getSyncMsg=function(){
return this.syncMsg;
};
Header.prototype.getType=function(){
return this.type;
};
Header.prototype.encode=function(){
var me=this;
switch(this.qos){
case RongIMLib.Qos[0]:
me.qos=RongIMLib.Qos.AT_MOST_ONCE;
break;
case RongIMLib.Qos[1]:
me.qos=RongIMLib.Qos.AT_LEAST_ONCE;
break;
case RongIMLib.Qos[2]:
me.qos=RongIMLib.Qos.EXACTLY_ONCE;
break;
case RongIMLib.Qos[3]:
me.qos=RongIMLib.Qos.DEFAULT;
break;}

var _byte=this.type<<4;
_byte|=this.retain?1:0;
_byte|=this.qos<<1;
_byte|=this.dup?8:0;
return _byte;
};
Header.prototype.toString=function(){
return"Header [type="+this.type+",retain="+this.retain+",qos="+this.qos+",dup="+this.dup+"]";
};
return Header;
}();
RongIMLib.Header=Header;
/**
     * 二进制帮助对象
     */
var BinaryHelper=function(){
function BinaryHelper(){
}
BinaryHelper.prototype.writeUTF=function(str,isGetBytes){
var back=[],byteSize=0;
for(var i=0,len=str.length;i<len;i++){
var code=str.charCodeAt(i);
if(code>=0&&code<=127){
byteSize+=1;
back.push(code);
}else
if(code>=128&&code<=2047){
byteSize+=2;
back.push(192|31&code>>6);
back.push(128|63&code);
}else
if(code>=2048&&code<=65535){
byteSize+=3;
back.push(224|15&code>>12);
back.push(128|63&code>>6);
back.push(128|63&code);
}
}
for(var i=0,len=back.length;i<len;i++){
if(back[i]>255){
back[i]&=255;
}
}
if(isGetBytes){
return back;
}
if(byteSize<=255){
return[0,byteSize].concat(back);
}else
{
return[byteSize>>8,byteSize&255].concat(back);
}
};
BinaryHelper.prototype.readUTF=function(arr){
if(Object.prototype.toString.call(arr)=="[object String]"){
return arr;
}
var UTF="",_arr=arr;
for(var i=0,len=_arr.length;i<len;i++){
if(_arr[i]<0){
_arr[i]+=256;
}
;
var one=_arr[i].toString(2),v=one.match(/^1+?(?=0)/);
if(v&&one.length==8){
var bytesLength=v[0].length,
// store = _arr[i].toString(2).slice(7 - bytesLength);
store='';
for(var st=0;st<bytesLength;st++){
store+=_arr[st+i].toString(2).slice(2);
}
UTF+=String.fromCharCode(parseInt(store,2));
i+=bytesLength-1;
}else
{
UTF+=String.fromCharCode(_arr[i]);
}
}
return UTF;
};
/**
         * [convertStream 将参数x转化为RongIMStream对象]
         * @param  {any}    x [参数]
         */
BinaryHelper.prototype.convertStream=function(x){
if(x instanceof RongIMStream){
return x;
}else
{
return new RongIMStream(x);
}
};
BinaryHelper.prototype.toMQttString=function(str){
return this.writeUTF(str);
};
return BinaryHelper;
}();
RongIMLib.BinaryHelper=BinaryHelper;
var RongIMStream=function(){
function RongIMStream(arr){
//当前流执行的起始位置
this.position=0;
//当前流写入的多少字节
this.writen=0;
this.poolLen=0;
this.binaryHelper=new BinaryHelper();
this.pool=arr;
this.poolLen=arr.length;
}
RongIMStream.prototype.check=function(){
return this.position>=this.pool.length;
};
RongIMStream.prototype.readInt=function(){
if(this.check()){
return-1;
}
var end="";
for(var i=0;i<4;i++){
var t=this.pool[this.position++].toString(16);
if(t.length==1){
t="0"+t;
}
end+=t.toString(16);
}
return parseInt(end,16);
};
RongIMStream.prototype.readLong=function(){
if(this.check()){
return-1;
}
var end="";
for(var i=0;i<8;i++){
var t=this.pool[this.position++].toString(16);
if(t.length==1){
t="0"+t;
}
end+=t;
}
return parseInt(end,16);
};
RongIMStream.prototype.readTimestamp=function(){
if(this.check()){
return-1;
}
var end="";
for(var i=0;i<8;i++){
end+=this.pool[this.position++].toString(16);
}
end=end.substring(2,8);
return parseInt(end,16);
};
RongIMStream.prototype.readUTF=function(){
if(this.check()){
return-1;
}
var big=this.readByte()<<8|this.readByte();
return this.binaryHelper.readUTF(this.pool.subarray(this.position,this.position+=big));
};
RongIMStream.prototype.readByte=function(){
if(this.check()){
return-1;
}
var val=this.pool[this.position++];
if(val>255){
val&=255;
}
return val;
};
RongIMStream.prototype.read=function(bytesArray){
if(bytesArray){
return this.pool.subarray(this.position,this.poolLen);
}else
{
return this.readByte();
}
};
RongIMStream.prototype.write=function(_byte){
var b=_byte;
if(Object.prototype.toString.call(b).toLowerCase()=="[object array]"){
[].push.apply(this.pool,b);
}else
{
if(+b==b){
if(b>255){
b&=255;
}
this.pool.push(b);
this.writen++;
}
}
return b;
};
RongIMStream.prototype.writeChar=function(v){
if(+v!=v){
throw new Error("writeChar:arguments type is error");
}
this.write(v>>8&255);
this.write(v&255);
this.writen+=2;
};
RongIMStream.prototype.writeUTF=function(str){
var val=this.binaryHelper.writeUTF(str);
[].push.apply(this.pool,val);
this.writen+=val.length;
};
RongIMStream.prototype.toComplements=function(){
var _tPool=this.pool;
for(var i=0;i<this.poolLen;i++){
if(_tPool[i]>128){
_tPool[i]-=256;
}
}
return _tPool;
};
RongIMStream.prototype.getBytesArray=function(isCom){
if(isCom){
return this.toComplements();
}
return this.pool;
};
return RongIMStream;
}();
RongIMLib.RongIMStream=RongIMStream;
})(RongIMLib||(RongIMLib={}));
var RongIMLib;
(function(RongIMLib){
var SocketTransportation=function(){
/**
         * [constructor]
         * @param  {string} url [连接地址：包含token、version]
         */
function SocketTransportation(_socket){
//连接状态 true:已连接 false:未连接
this.connected=false;
//是否关闭： true:已关闭 false：未关闭
this.isClose=false;
//存放消息队列的临时变量
this.queue=[];
this.empty=new Function();
this._socket=_socket;
return this;
}
/**
         * [createTransport 创建WebScoket对象]
         */
SocketTransportation.prototype.createTransport=function(url,method){
if(!url){
throw new Error("URL can't be empty");
}
;
this.url=url;
var depend=RongIMLib.RongIMClient._memoryStore.depend;
var wsScheme=depend.wsScheme;
var tpl='{wsScheme}{url}';
url=RongIMLib.RongUtil.tplEngine(tpl,{
wsScheme:wsScheme,
url:url});

this.socket=new WebSocket(url);
this.socket.binaryType="arraybuffer";
this.addEvent();
return this.socket;
};
/**
         * [send 传送消息流]
         * @param  {ArrayBuffer} data [二进制消息流]
         */
SocketTransportation.prototype.send=function(data){
if(!this.connected&&!this.isClose){
//当通道不可用时，加入消息队列
this.queue.push(data);
return;
}
if(this.isClose){
this._socket.fire("StatusChanged",RongIMLib.ConnectionStatus.CONNECTION_CLOSED);
return;
}
var stream=new RongIMLib.RongIMStream([]),msg=new RongIMLib.MessageOutputStream(stream);
msg.writeMessage(data);
var val=stream.getBytesArray(true);
var binary=new Int8Array(val);
this.socket.send(binary.buffer);
return this;
};
/**
         * [onData 通道返回数据时调用的方法，用来想上层传递服务器返回的二进制消息流]
         * @param  {ArrayBuffer}    data [二进制消息流]
         */
SocketTransportation.prototype.onData=function(data){
if(RongIMLib.MessageUtil.isArray(data)){
this._socket.onMessage(new RongIMLib.MessageInputStream(data).readMessage());
}else
{
this._socket.onMessage(new RongIMLib.MessageInputStream(RongIMLib.MessageUtil.ArrayFormInput(data)).readMessage());
}
return"";
};
/**
         * [onClose 通道关闭时触发的方法]
         */
SocketTransportation.prototype.onClose=function(ev){
var me=this;
me.isClose=true;
me.socket=this.empty;
RongIMLib.Bridge._client.clearHeartbeat();
if(ev.code==1006&&!this._status){
me._socket.fire("StatusChanged",RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE);
}else
{
me._status=0;
}
};
/**
         * [onError 通道报错时触发的方法]
         * @param {any} error [抛出异常]
         */
SocketTransportation.prototype.onError=function(error){
throw new Error(error);
};
/**
         * [addEvent 为通道绑定事件]
         */
SocketTransportation.prototype.addEvent=function(){
var self=this;
self.socket.onopen=function(){
self.connected=true;
self.isClose=false;
//通道可以用后，调用发送队列方法，把所有等得发送的消息发出
self.doQueue();
self._socket.fire("connect");
};
self.socket.onmessage=function(ev){
//判断数据是不是字符串，如果是字符串那么就是flash传过来的。
if(typeof ev.data=="string"){
self.onData(ev.data.split(","));
}else
{
self.onData(ev.data);
}
};
self.socket.onerror=function(ev){
self.onError(ev);
};
self.socket.onclose=function(ev){
self.onClose(ev);
};
};
/**
         * [doQueue 消息队列，把队列中消息发出]
         */
SocketTransportation.prototype.doQueue=function(){
var self=this;
for(var i=0,len=self.queue.length;i<len;i++){
self.send(self.queue[i]);
}
};
/**
         * [disconnect 断开连接]
         */
SocketTransportation.prototype.disconnect=function(status){
var me=this;
if(me.socket.readyState){
me.isClose=true;
if(status){
me._status=status;
}
me.socket.close();
}
};
/**
         * [reconnect 重新连接]
         */
SocketTransportation.prototype.reconnect=function(){
this.disconnect();
this.createTransport(this.url);
};
SocketTransportation.prototype.close=function(){
this.socket.close();
};
return SocketTransportation;
}();
RongIMLib.SocketTransportation=SocketTransportation;
})(RongIMLib||(RongIMLib={}));
var RongIMLib;
(function(RongIMLib){
var PollingTransportation=function(){
function PollingTransportation(socket){
this.empty=new Function();
this.connected=false;
this.pid=+new Date()+Math.random()+"";
this.queue=[];
this.socket=socket;
return this;
}
PollingTransportation.prototype.createTransport=function(url,method){
if(!url){
throw new Error("Url is empty,Please check it!");
}
;
this.url=url;
var sid=RongIMLib.RongIMClient._storageProvider.getItem("sId"+RongIMLib.Navigation.Endpoint.userId),me=this;
if(sid){
setTimeout(function(){
me.onSuccess("{\"status\":0,\"userId\":\""+RongIMLib.Navigation.Endpoint.userId+"\",\"headerCode\":32,\"messageId\":0,\"sessionid\":\""+sid+"\"}");
me.connected=true;
},500);
return this;
}
this.getRequest(url,true);
return this;
};
PollingTransportation.prototype.requestFactory=function(url,method,multipart){
var reqest=this.XmlHttpRequest();
if(multipart){
reqest.multipart=true;
}
reqest.timeout=60000;
reqest.open(method||"GET",RongIMLib.RongIMClient._memoryStore.depend.protocol+url);
if(method=="POST"&&"setRequestHeader"in reqest){
reqest.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset=utf-8");
}
return reqest;
};
PollingTransportation.prototype.getRequest=function(url,isconnect){
var me=this;
me.xhr=this.requestFactory(url+"&pid="+encodeURIComponent(me.pid),"GET");
if("onload"in me.xhr){
me.xhr.onload=function(){
me.xhr.onload=me.empty;
if(this.responseText=="lost params"){
me.onError();
}else
{
me.onSuccess(this.responseText,isconnect);
}
};
me.xhr.onerror=function(){
me.disconnect();
};
}else
{
me.xhr.onreadystatechange=function(){
if(me.xhr.readyState==4){
me.xhr.onreadystatechange=me.empty;
if(/^(200|202)$/.test(me.xhr.status)){
me.onSuccess(me.xhr.responseText,isconnect);
}else
if(/^(400|403)$/.test(me.xhr.status)){
me.onError();
}else
{
me.disconnect();
}
}
};
}
me.xhr.send();
};
/**
         * [send 发送消息，Method:POST]
         * queue 为消息队列，待通道可用发送所有等待消息
         * @param  {string} data [需要传入comet格式数据，此处只负责通讯通道，数据转换在外层处理]
         */
PollingTransportation.prototype.send=function(data){
var me=this;
var _send=me.sendxhr=this.requestFactory(RongIMLib.Navigation.Endpoint.host+"/websocket"+data.url+"&pid="+encodeURIComponent(me.pid),"POST");
if("onload"in _send){
_send.onload=function(){
_send.onload=me.empty;
me.onData(_send.responseText);
};
_send.onerror=function(){
_send.onerror=me.empty;
};
}else
{
_send.onreadystatechange=function(){
if(_send.readyState==4){
this.onreadystatechange=this.empty;
if(/^(202|200)$/.test(_send.status)){
me.onData(_send.responseText);
}
}
};
}
_send.send(JSON.stringify(data.data));
};
PollingTransportation.prototype.onData=function(data,header){
if(!data||data=="lost params"){
return;
}
var self=this,val=JSON.parse(data);
if(val.userId){
RongIMLib.Navigation.Endpoint.userId=val.userId;
}
if(header){
RongIMLib.RongIMClient._storageProvider.setItem("sId"+RongIMLib.Navigation.Endpoint.userId,header);
}
if(!RongIMLib.MessageUtil.isArray(val)){
val=[val];
}
Array.forEach(val,function(m){
self.socket.fire("message",new RongIMLib.MessageInputStream(m,true).readMessage());
});
return"";
};
PollingTransportation.prototype.XmlHttpRequest=function(){
var hasCORS=typeof XMLHttpRequest!=="undefined"&&"withCredentials"in new XMLHttpRequest(),self=this;
if("undefined"!=typeof XMLHttpRequest&&hasCORS){
return new XMLHttpRequest();
}else
if("undefined"!=typeof XDomainRequest){
return new XDomainRequest();
}else
{
return new ActiveXObject("Microsoft.XMLHTTP");
}
};
PollingTransportation.prototype.onClose=function(){
if(this.xhr){
if(this.xhr.onload){
this.xhr.onreadystatechange=this.xhr.onload=this.empty;
}else
{
this.xhr.onreadystatechange=this.empty;
}
this.xhr.abort();
this.xhr=null;
}
if(this.sendxhr){
if(this.sendxhr.onload){
this.sendxhr.onreadystatechange=this.sendxhr.onload=this.empty;
}else
{
this.sendxhr.onreadystatechange=this.empty;
}
this.sendxhr.abort();
this.sendxhr=null;
}
};
PollingTransportation.prototype.disconnect=function(){
RongIMLib.RongIMClient._storageProvider.removeItem("sId"+RongIMLib.Navigation.Endpoint.userId);
RongIMLib.RongIMClient._storageProvider.removeItem(RongIMLib.Navigation.Endpoint.userId+"msgId");
this.onClose();
};
PollingTransportation.prototype.reconnect=function(){
this.disconnect();
this.createTransport(this.url);
};
PollingTransportation.prototype.onSuccess=function(responseText,isconnect){
var txt=responseText.match(/"sessionid":"\S+?(?=")/);
this.onData(responseText,txt?txt[0].slice(13):0);
if(/"headerCode":-32,/.test(responseText)){
RongIMLib.RongIMClient._storageProvider.removeItem("sId"+RongIMLib.Navigation.Endpoint.userId);
RongIMLib.RongIMClient._storageProvider.removeItem(RongIMLib.Navigation.Endpoint.userId+"msgId");
return;
}
this.getRequest(RongIMLib.Navigation.Endpoint.host+"/pullmsg.js?sessionid="+RongIMLib.RongIMClient._storageProvider.getItem("sId"+RongIMLib.Navigation.Endpoint.userId)+"&timestrap="+encodeURIComponent(new Date().getTime()+Math.random()+""));
this.connected=true;
isconnect&&this.socket.fire("connect");
};
PollingTransportation.prototype.onError=function(){
RongIMLib.RongIMClient._storageProvider.removeItem("sId"+RongIMLib.Navigation.Endpoint.userId);
RongIMLib.RongIMClient._storageProvider.removeItem(RongIMLib.Navigation.Endpoint.userId+"msgId");
this.onClose();
this.connected=false;
this.socket.fire("disconnect");
};
PollingTransportation.prototype.close=function(){
this.xhr.abort();
this.sendxhr=null;
};
return PollingTransportation;
}();
RongIMLib.PollingTransportation=PollingTransportation;
})(RongIMLib||(RongIMLib={}));
//objectname映射
var typeMapping={
"RC:TxtMsg":"TextMessage",
"RC:ImgMsg":"ImageMessage",
"RC:VcMsg":"VoiceMessage",
"RC:ImgTextMsg":"RichContentMessage",
"RC:FileMsg":"FileMessage",
"RC:LBSMsg":"LocationMessage",
"RC:InfoNtf":"InformationNotificationMessage",
"RC:ContactNtf":"ContactNotificationMessage",
"RC:ProfileNtf":"ProfileNotificationMessage",
"RC:CmdNtf":"CommandNotificationMessage",
"RC:DizNtf":"DiscussionNotificationMessage",
"RC:CmdMsg":"CommandMessage",
"RC:TypSts":"TypingStatusMessage",
"RC:CsChaR":"ChangeModeResponseMessage",
"RC:CsHsR":"HandShakeResponseMessage",
"RC:CsEnd":"TerminateMessage",
"RC:CsSp":"SuspendMessage",
"RC:CsUpdate":"CustomerStatusUpdateMessage",
"RC:ReadNtf":"ReadReceiptMessage",
"RC:VCAccept":"AcceptMessage",
"RC:VCRinging":"RingingMessage",
"RC:VCSummary":"SummaryMessage",
"RC:VCHangup":"HungupMessage",
"RC:VCInvite":"InviteMessage",
"RC:VCModifyMedia":"MediaModifyMessage",
"RC:VCModifyMem":"MemberModifyMessage",
"RC:CsContact":"CustomerContact",
"RC:PSImgTxtMsg":"PublicServiceRichContentMessage",
"RC:PSMultiImgTxtMsg":"PublicServiceMultiRichContentMessage",
"RC:GrpNtf":"GroupNotificationMessage",
"RC:PSCmd":"PublicServiceCommandMessage",
"RC:RcCmd":"RecallCommandMessage",
"RC:SRSMsg":"SyncReadStatusMessage",
"RC:RRReqMsg":"ReadReceiptRequestMessage",
"RC:RRRspMsg":"ReadReceiptResponseMessage",
"RCJrmf:RpMsg":"JrmfRedPacketMessage",
"RCJrmf:RpOpendMsg":"JrmfRedPacketOpenedMessage"},

//自定义消息类型
registerMessageTypeMapping={},HistoryMsgType={
4:"qryCMsg",
2:"qryDMsg",
3:"qryGMsg",
1:"qryPMsg",
6:"qrySMsg",
7:"qryPMsg",
8:"qryPMsg",
5:"qryCMsg"},
disconnectStatus={1:6};
var RongIMLib;
(function(RongIMLib){
/**
     * 通道标识类
     */
var Transportations=function(){
function Transportations(){
}
Transportations._TransportType=RongIMLib.Socket.WEBSOCKET;
return Transportations;
}();
RongIMLib.Transportations=Transportations;
var SyncTimeUtil=function(){
function SyncTimeUtil(){
}
SyncTimeUtil.$getKey=function(message){
var client=RongIMLib.Bridge._client;
var userId=client.userId;
var direction=message.messageDirection==1?'send':'receive';
var appkey=RongIMLib.RongIMClient._memoryStore.appKey;
var tpl='{appkey}_{userId}_{direction}box';
return RongIMLib.RongUtil.tplEngine(tpl,{
appkey:appkey,
userId:userId,
direction:direction});

};
SyncTimeUtil.set=function(message){
var key=SyncTimeUtil.$getKey(message);
var sentTime=message.sentTime;
var storage=RongIMLib.RongIMClient._storageProvider;
storage.setItem(key,sentTime);
};
SyncTimeUtil.get=function(){
var sent=SyncTimeUtil.$getKey({
messageDirection:RongIMLib.MessageDirection.SEND});

var received=SyncTimeUtil.$getKey({
messageDirection:RongIMLib.MessageDirection.RECEIVE});

var storage=RongIMLib.RongIMClient._storageProvider;
return{
sent:Number(storage.getItem(sent)||0),
received:Number(storage.getItem(received)||0)};

};
return SyncTimeUtil;
}();
RongIMLib.SyncTimeUtil=SyncTimeUtil;
var MessageUtil=function(){
function MessageUtil(){
}
/**
         *4680000 为localstorage最小容量5200000字节的90%，超过90%将删除之前过早的存储
         */
MessageUtil.checkStorageSize=function(){
return JSON.stringify(localStorage).length<4680000;
};
MessageUtil.getFirstKey=function(obj){
var str="";
for(var key in obj){
str=key;
break;
}
return str;
};
MessageUtil.isEmpty=function(obj){
var empty=true;
for(var key in obj){
empty=false;
break;
}
return empty;
};
MessageUtil.ArrayForm=function(typearray){
if(Object.prototype.toString.call(typearray)=="[object ArrayBuffer]"){
var arr=new Int8Array(typearray);
return[].slice.call(arr);
}
return typearray;
};
MessageUtil.ArrayFormInput=function(typearray){
if(Object.prototype.toString.call(typearray)=="[object ArrayBuffer]"){
var arr=new Uint8Array(typearray);
return arr;
}
return typearray;
};
MessageUtil.indexOf=function(arr,item,from){
for(var l=arr.length,i=from<0?Math.max(0,+from):from||0;i<l;i++){
if(arr[i]==item){
return i;
}
}
return-1;
};
MessageUtil.isArray=function(obj){
return Object.prototype.toString.call(obj)=="[object Array]";
};
//遍历，只能遍历数组
MessageUtil.forEach=function(arr,func){
if([].forEach){
return function(arr,func){
[].forEach.call(arr,func);
};
}else
{
return function(arr,func){
for(var i=0;i<arr.length;i++){
func.call(arr,arr[i],i,arr);
}
};
}
};
MessageUtil.remove=function(array,func){
for(var i=0,len=array.length;i<len;i++){
if(func(array[i])){
return array.splice(i,1)[0];
}
}
return null;
};
MessageUtil.int64ToTimestamp=function(obj,isDate){
if(obj.low===undefined){
return obj;
}
var low=obj.low;
if(low<0){
low+=0xffffffff+1;
}
low=low.toString(16);
var timestamp=parseInt(obj.high.toString(16)+"00000000".replace(new RegExp("0{"+low.length+"}$"),low),16);
if(isDate){
return new Date(timestamp);
}
return timestamp;
};
//消息转换方法
MessageUtil.messageParser=function(entity,onReceived,offlineMsg){
var message=new RongIMLib.Message(),content=entity.content,de,objectName=entity.classname,val,isUseDef=false;
try{
if(RongIMLib.RongIMClient._memoryStore.depend.isPolling){
val=new RongIMLib.BinaryHelper().readUTF(content.offset?MessageUtil.ArrayForm(content.buffer).slice(content.offset,content.limit):content);
de=JSON.parse(val);
}else
{
val=new RongIMLib.BinaryHelper().readUTF(content.offset?MessageUtil.ArrayFormInput(content.buffer).subarray(content.offset,content.limit):content);
de=JSON.parse(val);
}
}
catch(ex){
de=val;
isUseDef=true;
}
//映射为具体消息对象
if(objectName in typeMapping){
var str="new RongIMLib."+typeMapping[objectName]+"(de)";
message.content=eval(str);
message.messageType=typeMapping[objectName];
}else
if(objectName in registerMessageTypeMapping){
var str="new RongIMLib.RongIMClient.RegisterMessage."+registerMessageTypeMapping[objectName]+"(de)";
if(isUseDef){
message.content=eval(str).decode(de);
}else
{
message.content=eval(str);
}
message.messageType=registerMessageTypeMapping[objectName];
}else
{
message.content=new RongIMLib.UnknownMessage({content:de,objectName:objectName});
message.messageType="UnknownMessage";
}
//根据实体对象设置message对象]
var dateTime=MessageUtil.int64ToTimestamp(entity.dataTime);
if(dateTime>0){
message.sentTime=dateTime;
}else
{
message.sentTime=+new Date();
}
message.senderUserId=entity.fromUserId;
message.conversationType=entity.type;
if(entity.fromUserId==RongIMLib.Bridge._client.userId){
message.targetId=entity.groupId;
}else
{
message.targetId=/^[234]$/.test(entity.type||entity.getType())?entity.groupId:message.senderUserId;
}
if(entity.direction==1){
message.messageDirection=RongIMLib.MessageDirection.SEND;
message.senderUserId=RongIMLib.Bridge._client.userId;
}else
{
message.messageDirection=RongIMLib.MessageDirection.RECEIVE;
}
message.messageUId=entity.msgId;
message.receivedTime=new Date().getTime();
message.messageId=message.conversationType+"_"+~~(Math.random()*0xffffff);
message.objectName=objectName;
message.receivedStatus=RongIMLib.ReceivedStatus.READ;
if((entity.status&2)==2){
message.receivedStatus=RongIMLib.ReceivedStatus.RETRIEVED;
}
message.offLineMessage=offlineMsg?true:false;
if(!offlineMsg){
if(RongIMLib.RongIMClient._memoryStore.connectAckTime>message.sentTime){
message.offLineMessage=true;
}
}
return message;
};
MessageUtil.detectCMP=function(options){
var xhr=new XMLHttpRequest();
xhr.onreadystatechange=function(){
if(xhr.readyState==4){
var status=xhr.status;
if(status==200){
options.success();
}else
{
options.fail(xhr.status);
}
}
};
var method=options.url;
var url=options.url;
var method=options.method||'GET';
xhr.open(method,url);
var headers=options.headers;
for(var key in headers){
var value=headers[key];
xhr.setRequestHeader(key,value);
}
var body=JSON.stringify(options.body||{});
xhr.send(body);
return xhr;
};
//适配SSL
// static schemeArrs: Array<any> = [["http", "ws"], ["https", "wss"]];
MessageUtil.sign={converNum:1,msgNum:1,isMsgStart:true,isConvStart:true};
return MessageUtil;
}();
RongIMLib.MessageUtil=MessageUtil;
/**
     * 工具类
     */
var MessageIdHandler=function(){
function MessageIdHandler(){
}
MessageIdHandler.init=function(){
this.messageId=+(RongIMLib.RongIMClient._storageProvider.getItem(RongIMLib.Navigation.Endpoint.userId+"msgId")||RongIMLib.RongIMClient._storageProvider.setItem(RongIMLib.Navigation.Endpoint.userId+"msgId",0)||0);
};
MessageIdHandler.messageIdPlus=function(method){
RongIMLib.RongIMClient._memoryStore.depend.isPolling&&this.init();
if(this.messageId>=65535){
method();
return false;
}
this.messageId++;
RongIMLib.RongIMClient._memoryStore.depend.isPolling&&RongIMLib.RongIMClient._storageProvider.setItem(RongIMLib.Navigation.Endpoint.userId+"msgId",this.messageId);
return this.messageId;
};
MessageIdHandler.clearMessageId=function(){
this.messageId=0;
RongIMLib.RongIMClient._memoryStore.depend.isPolling&&RongIMLib.RongIMClient._storageProvider.setItem(RongIMLib.Navigation.Endpoint.userId+"msgId",this.messageId);
};
MessageIdHandler.getMessageId=function(){
RongIMLib.RongIMClient._memoryStore.depend.isPolling&&this.init();
return this.messageId;
};
MessageIdHandler.messageId=0;
return MessageIdHandler;
}();
RongIMLib.MessageIdHandler=MessageIdHandler;
var RongInnerTools=function(){
function RongInnerTools(){
}
RongInnerTools.convertUserStatus=function(entity){
entity=RongIMLib.RongUtil.rename(entity,{subUserId:'userId'});
var status=JSON.parse(entity.status);
var us=status.us;
if(!us){
return entity;
}
entity.status=RongIMLib.RongUtil.rename(us,{o:'online','p':'platform',s:'status'});
return entity;
};
return RongInnerTools;
}();
RongIMLib.RongInnerTools=RongInnerTools;
})(RongIMLib||(RongIMLib={}));
var RongIMLib;
(function(RongIMLib){
var MessageContent=function(){
function MessageContent(data){
throw new Error("This method is abstract, you must implement this method in inherited class.");
}
MessageContent.obtain=function(){
throw new Error("This method is abstract, you must implement this method in inherited class.");
};
return MessageContent;
}();
RongIMLib.MessageContent=MessageContent;
var NotificationMessage=function(_super){
__extends(NotificationMessage,_super);
function NotificationMessage(){
_super.apply(this,arguments);
}
return NotificationMessage;
}(MessageContent);
RongIMLib.NotificationMessage=NotificationMessage;
var StatusMessage=function(_super){
__extends(StatusMessage,_super);
function StatusMessage(){
_super.apply(this,arguments);
}
return StatusMessage;
}(MessageContent);
RongIMLib.StatusMessage=StatusMessage;
var ModelUtil=function(){
function ModelUtil(){
}
ModelUtil.modelClone=function(object){
var obj={};
for(var item in object){
if(item!="messageName"&&"encode"!=item){
obj[item]=object[item];
}
}
return obj;
};
ModelUtil.modleCreate=function(fields,msgType){
// if (fields.length < 1) {
//     throw new Error("Array is empty  -> registerMessageType.modleCreate");
// }
var Object=function Object(message){
var me=this;
for(var index in fields){
me[fields[index]]=message[fields[index]];
}
Object.prototype.messageName=msgType;
Object.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
};
return Object;
};
return ModelUtil;
}();
RongIMLib.ModelUtil=ModelUtil;
})(RongIMLib||(RongIMLib={}));
var RongIMLib;
(function(RongIMLib){
var CustomerStatusMessage=function(){
function CustomerStatusMessage(message){
this.messageName="CustomerStatusMessage";
this.status=message.status;
}
CustomerStatusMessage.obtain=function(){
return null;
};
CustomerStatusMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return CustomerStatusMessage;
}();
RongIMLib.CustomerStatusMessage=CustomerStatusMessage;
/**
     * 客服转换响应消息的类型名
     */
var ChangeModeResponseMessage=function(){
function ChangeModeResponseMessage(message){
this.messageName="ChangeModeResponseMessage";
this.code=message.code;
this.data=message.data;
this.msg=message.msg;
}
ChangeModeResponseMessage.obtain=function(){
return null;
};
ChangeModeResponseMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return ChangeModeResponseMessage;
}();
RongIMLib.ChangeModeResponseMessage=ChangeModeResponseMessage;
/**
     * 客服转换消息的类型名
     * 此消息不计入未读消息数
     */
var ChangeModeMessage=function(){
function ChangeModeMessage(message){
this.messageName="ChangeModeMessage";
this.uid=message.uid;
this.sid=message.sid;
this.pid=message.pid;
}
ChangeModeMessage.obtain=function(){
return null;
};
ChangeModeMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return ChangeModeMessage;
}();
RongIMLib.ChangeModeMessage=ChangeModeMessage;
var CustomerStatusUpdateMessage=function(){
function CustomerStatusUpdateMessage(message){
this.messageName="CustomerStatusUpdateMessage";
this.serviceStatus=message.serviceStatus;
this.sid=message.sid;
}
CustomerStatusUpdateMessage.obtain=function(){
return null;
};
CustomerStatusUpdateMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return CustomerStatusUpdateMessage;
}();
RongIMLib.CustomerStatusUpdateMessage=CustomerStatusUpdateMessage;
var HandShakeMessage=function(){
function HandShakeMessage(message){
this.messageName="HandShakeMessage";
if(message){
this.requestInfo=message.requestInfo;
this.userInfo=message.userInfo;
}
}
HandShakeMessage.obtain=function(){
return null;
};
HandShakeMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return HandShakeMessage;
}();
RongIMLib.HandShakeMessage=HandShakeMessage;
var CustomerContact=function(){
function CustomerContact(message){
this.messageName="CustomerContact";
this.page=message.page;
this.nickName=message.nickName;
this.routingInfo=message.routingInfo;
this.info=message.info;
this.requestInfo=message.requestInfo;
}
CustomerContact.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return CustomerContact;
}();
RongIMLib.CustomerContact=CustomerContact;
var EvaluateMessage=function(){
function EvaluateMessage(message){
this.messageName="EvaluateMessage";
this.uid=message.uid;
this.sid=message.sid;
this.pid=message.pid;
this.source=message.source;
this.suggest=message.suggest;
this.isresolve=message.isresolve;
this.type=message.type;
}
EvaluateMessage.obtain=function(){
return null;
};
EvaluateMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return EvaluateMessage;
}();
RongIMLib.EvaluateMessage=EvaluateMessage;
/**
     * 客服握手响应消息的类型名
     */
var HandShakeResponseMessage=function(){
function HandShakeResponseMessage(message){
this.messageName="HandShakeResponseMessage";
this.msg=message.msg;
this.status=message.status;
this.data=message.data;
}
HandShakeResponseMessage.obtain=function(){
return null;
};
HandShakeResponseMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return HandShakeResponseMessage;
}();
RongIMLib.HandShakeResponseMessage=HandShakeResponseMessage;
var SuspendMessage=function(){
function SuspendMessage(message){
this.messageName="SuspendMessage";
this.uid=message.uid;
this.sid=message.sid;
this.pid=message.pid;
}
SuspendMessage.obtain=function(){
return null;
};
SuspendMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return SuspendMessage;
}();
RongIMLib.SuspendMessage=SuspendMessage;
var TerminateMessage=function(){
function TerminateMessage(message){
this.messageName="TerminateMessage";
this.code=message.code;
this.msg=message.msg;
this.sid=message.sid;
}
TerminateMessage.obtain=function(){
return null;
};
TerminateMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return TerminateMessage;
}();
RongIMLib.TerminateMessage=TerminateMessage;
})(RongIMLib||(RongIMLib={}));
var RongIMLib;
(function(RongIMLib){
var IsTypingStatusMessage=function(){
function IsTypingStatusMessage(data){
this.messageName="IsTypingStatusMessage";
var msg=data;
}
IsTypingStatusMessage.prototype.encode=function(){
return undefined;
};
IsTypingStatusMessage.prototype.getMessage=function(){
return null;
};
return IsTypingStatusMessage;
}();
RongIMLib.IsTypingStatusMessage=IsTypingStatusMessage;
})(RongIMLib||(RongIMLib={}));
var RongIMLib;
(function(RongIMLib){
var InformationNotificationMessage=function(){
function InformationNotificationMessage(message){
this.messageName="InformationNotificationMessage";
if(arguments.length==0){
throw new Error("Can not instantiate with empty parameters, use obtain method instead -> InformationNotificationMessage.");
}
this.message=message.message;
this.extra=message.extra;
if(message.user){
this.user=message.user;
}
}
InformationNotificationMessage.obtain=function(message){
return new InformationNotificationMessage({message:message,extra:""});
};
InformationNotificationMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return InformationNotificationMessage;
}();
RongIMLib.InformationNotificationMessage=InformationNotificationMessage;
var CommandMessage=function(){
function CommandMessage(message){
this.messageName="CommandMessage";
if(arguments.length==0){
throw new Error("Can not instantiate with empty parameters, use obtain method instead -> CommandMessage.");
}
try{
if(Object.prototype.toString.call(message.data)=="[object String]"){
this.data=JSON.parse(message.data);
}else
{
this.data=message.data;
}
}
catch(e){
this.data=message.data;
}
this.name=message.name;
this.extra=message.extra;
}
CommandMessage.obtain=function(data){
return new CommandMessage({data:data,extra:""});
};
CommandMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return CommandMessage;
}();
RongIMLib.CommandMessage=CommandMessage;
var ContactNotificationMessage=function(){
function ContactNotificationMessage(message){
this.messageName="ContactNotificationMessage";
if(arguments.length==0){
throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ContactNotificationMessage.");
}
this.operation=message.operation;
this.targetUserId=message.targetUserId;
this.message=message.message;
this.extra=message.extra;
this.sourceUserId=message.sourceUserId;
if(message.user){
this.user=message.user;
}
}
ContactNotificationMessage.obtain=function(operation,sourceUserId,targetUserId,message){
return new InformationNotificationMessage({operation:operation,sourceUserId:sourceUserId,targetUserId:targetUserId,message:message});
};
ContactNotificationMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
ContactNotificationMessage.CONTACT_OPERATION_ACCEPT_RESPONSE="ContactOperationAcceptResponse";
ContactNotificationMessage.CONTACT_OPERATION_REJECT_RESPONSE="ContactOperationRejectResponse";
ContactNotificationMessage.CONTACT_OPERATION_REQUEST="ContactOperationRequest";
return ContactNotificationMessage;
}();
RongIMLib.ContactNotificationMessage=ContactNotificationMessage;
var ProfileNotificationMessage=function(){
function ProfileNotificationMessage(message){
this.messageName="ProfileNotificationMessage";
if(arguments.length==0){
throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ProfileNotificationMessage.");
}
this.operation=message.operation;
try{
if(Object.prototype.toString.call(message.data)=="[object String]"){
this.data=JSON.parse(message.data);
}else
{
this.data=message.data;
}
}
catch(e){
this.data=message.data;
}
this.extra=message.extra;
if(message.user){
this.user=message.user;
}
}
ProfileNotificationMessage.obtain=function(operation,data){
return new ProfileNotificationMessage({operation:operation,data:data});
};
ProfileNotificationMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return ProfileNotificationMessage;
}();
RongIMLib.ProfileNotificationMessage=ProfileNotificationMessage;
var CommandNotificationMessage=function(){
function CommandNotificationMessage(message){
this.messageName="CommandNotificationMessage";
if(arguments.length==0){
throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ProfileNotificationMessage.");
}
try{
if(Object.prototype.toString.call(message.data)=="[object String]"){
this.data=JSON.parse(message.data);
}else
{
this.data=message.data;
}
}
catch(e){
this.data=message.data;
}
this.name=message.name;
this.extra=message.extra;
if(message.user){
this.user=message.user;
}
}
CommandNotificationMessage.obtain=function(name,data){
return new CommandNotificationMessage({name:name,data:data,extra:""});
};
CommandNotificationMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return CommandNotificationMessage;
}();
RongIMLib.CommandNotificationMessage=CommandNotificationMessage;
var DiscussionNotificationMessage=function(){
function DiscussionNotificationMessage(message){
this.messageName="DiscussionNotificationMessage";
if(arguments.length==0){
throw new Error("Can not instantiate with empty parameters, use obtain method instead -> DiscussionNotificationMessage.");
}
this.extra=message.extra;
this.extension=message.extension;
this.type=message.type;
this.isHasReceived=message.isHasReceived;
this.operation=message.operation;
this.user=message.user;
if(message.user){
this.user=message.user;
}
}
DiscussionNotificationMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return DiscussionNotificationMessage;
}();
RongIMLib.DiscussionNotificationMessage=DiscussionNotificationMessage;
var GroupNotificationMessage=function(){
function GroupNotificationMessage(msg){
this.messageName="GroupNotificationMessage";
if(arguments.length==0){
throw new Error("Can not instantiate with empty parameters, use obtain method instead -> GroupNotificationMessage.");
}
msg.operatorUserId&&(this.operatorUserId=msg.operatorUserId);
msg.operation&&(this.operation=msg.operation);
msg.data&&(this.data=msg.data);
msg.message&&(this.message=msg.message);
msg.extra&&(this.extra=msg.extra);
}
GroupNotificationMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return GroupNotificationMessage;
}();
RongIMLib.GroupNotificationMessage=GroupNotificationMessage;
})(RongIMLib||(RongIMLib={}));
var RongIMLib;
(function(RongIMLib){
var TextMessage=function(){
function TextMessage(message){
this.messageName="TextMessage";
if(arguments.length==0){
throw new Error("Can not instantiate with empty parameters, use obtain method instead -> TextMessage.");
}
this.content=message.content;
this.extra=message.extra;
if(message.user){
this.user=message.user;
}
if(message.mentionedInfo){
this.mentionedInfo=message.mentionedInfo;
}
}
TextMessage.obtain=function(text){
return new TextMessage({extra:"",content:text});
};
TextMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return TextMessage;
}();
RongIMLib.TextMessage=TextMessage;
var TypingStatusMessage=function(){
function TypingStatusMessage(message){
this.messageName="TypingStatusMessage";
if(arguments.length==0){
throw new Error("Can not instantiate with empty parameters, use obtain method instead -> TypingStatusMessage.");
}
this.typingContentType=message.typingContentType;
this.data=message.data;
}
TypingStatusMessage.obtain=function(typingContentType,data){
return new TypingStatusMessage({typingContentType:typingContentType,data:data});
};
TypingStatusMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return TypingStatusMessage;
}();
RongIMLib.TypingStatusMessage=TypingStatusMessage;
var ReadReceiptMessage=function(){
function ReadReceiptMessage(message){
this.messageName="ReadReceiptMessage";
if(arguments.length==0){
throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ReadReceiptMessage.");
}
this.lastMessageSendTime=message.lastMessageSendTime;
this.messageUId=message.messageUId;
this.type=message.type;
}
ReadReceiptMessage.obtain=function(messageUId,lastMessageSendTime,type){
return new ReadReceiptMessage({messageUId:messageUId,lastMessageSendTime:lastMessageSendTime,type:type});
};
ReadReceiptMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return ReadReceiptMessage;
}();
RongIMLib.ReadReceiptMessage=ReadReceiptMessage;
var VoiceMessage=function(){
function VoiceMessage(message){
this.messageName="VoiceMessage";
if(arguments.length==0){
throw new Error("Can not instantiate with empty parameters, use obtain method instead -> VoiceMessage.");
}
this.content=message.content;
this.duration=message.duration;
this.extra=message.extra;
if(message.user){
this.user=message.user;
}
if(message.mentionedInfo){
this.mentionedInfo=message.mentionedInfo;
}
}
VoiceMessage.obtain=function(base64Content,duration){
return new VoiceMessage({content:base64Content,duration:duration,extra:""});
};
VoiceMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return VoiceMessage;
}();
RongIMLib.VoiceMessage=VoiceMessage;
var RecallCommandMessage=function(){
function RecallCommandMessage(message){
this.messageName="RecallCommandMessage";
this.messageUId=message.messageUId;
this.conversationType=message.conversationType;
this.targetId=message.targetId;
this.sentTime=message.sentTime;
message.extra&&(this.extra=message.extra);
message.user&&(this.user=message.user);
}
RecallCommandMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return RecallCommandMessage;
}();
RongIMLib.RecallCommandMessage=RecallCommandMessage;
var ImageMessage=function(){
function ImageMessage(message){
this.messageName="ImageMessage";
if(arguments.length==0){
throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ImageMessage.");
}
this.content=message.content;
this.imageUri=message.imageUri;
message.extra&&(this.extra=message.extra);
message.user&&(this.user=message.user);
if(message.mentionedInfo){
this.mentionedInfo=message.mentionedInfo;
}
}
ImageMessage.obtain=function(content,imageUri){
return new ImageMessage({content:content,imageUri:imageUri,extra:""});
};
ImageMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return ImageMessage;
}();
RongIMLib.ImageMessage=ImageMessage;
var LocationMessage=function(){
function LocationMessage(message){
this.messageName="LocationMessage";
if(arguments.length==0){
throw new Error("Can not instantiate with empty parameters, use obtain method instead -> LocationMessage.");
}
this.latitude=message.latitude;
this.longitude=message.longitude;
this.poi=message.poi;
this.content=message.content;
this.extra=message.extra;
if(message.user){
this.user=message.user;
}
if(message.mentionedInfo){
this.mentionedInfo=message.mentionedInfo;
}
}
LocationMessage.obtain=function(latitude,longitude,poi,content){
return new LocationMessage({latitude:latitude,longitude:longitude,poi:poi,content:content,extra:""});
};
LocationMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return LocationMessage;
}();
RongIMLib.LocationMessage=LocationMessage;
var RichContentMessage=function(){
function RichContentMessage(message){
this.messageName="RichContentMessage";
if(arguments.length==0){
throw new Error("Can not instantiate with empty parameters, use obtain method instead -> RichContentMessage.");
}
this.title=message.title;
this.content=message.content;
this.imageUri=message.imageUri;
this.extra=message.extra;
this.url=message.url;
if(message.user){
this.user=message.user;
}
}
RichContentMessage.obtain=function(title,content,imageUri,url){
return new RichContentMessage({title:title,content:content,imageUri:imageUri,url:url,extra:""});
};
RichContentMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return RichContentMessage;
}();
RongIMLib.RichContentMessage=RichContentMessage;
var JrmfRedPacketMessage=function(){
function JrmfRedPacketMessage(message){
this.messageName='JrmfRedPacketMessage';
message&&(this.message=message);
}
JrmfRedPacketMessage.prototype.encode=function(){
return"";
};
return JrmfRedPacketMessage;
}();
RongIMLib.JrmfRedPacketMessage=JrmfRedPacketMessage;
var JrmfRedPacketOpenedMessage=function(){
function JrmfRedPacketOpenedMessage(message){
this.messageName='JrmfRedPacketOpenedMessage';
message&&(this.message=message);
}
JrmfRedPacketOpenedMessage.prototype.encode=function(){
return"";
};
return JrmfRedPacketOpenedMessage;
}();
RongIMLib.JrmfRedPacketOpenedMessage=JrmfRedPacketOpenedMessage;
var UnknownMessage=function(){
function UnknownMessage(message){
this.messageName="UnknownMessage";
if(arguments.length==0){
throw new Error("Can not instantiate with empty parameters, use obtain method instead -> UnknownMessage.");
}
this.message=message;
}
UnknownMessage.prototype.encode=function(){
return"";
};
return UnknownMessage;
}();
RongIMLib.UnknownMessage=UnknownMessage;
var PublicServiceCommandMessage=function(){
function PublicServiceCommandMessage(message){
this.messageName="PublicServiceCommandMessage";
if(arguments.length==0){
throw new Error("Can not instantiate with empty parameters, use obtain method instead -> PublicServiceCommandMessage.");
}
this.content=message.content;
this.extra=message.extra;
this.menuItem=message.menuItem;
if(message.user){
this.user=message.user;
}
if(message.mentionedInfo){
this.mentionedInfo=message.mentionedInfo;
}
}
PublicServiceCommandMessage.obtain=function(item){
return new PublicServiceCommandMessage({content:"",command:"",menuItem:item,extra:""});
};
PublicServiceCommandMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return PublicServiceCommandMessage;
}();
RongIMLib.PublicServiceCommandMessage=PublicServiceCommandMessage;
var PublicServiceMultiRichContentMessage=function(){
function PublicServiceMultiRichContentMessage(messages){
this.messageName="PublicServiceMultiRichContentMessage";
this.richContentMessages=messages;
}
PublicServiceMultiRichContentMessage.prototype.encode=function(){
return null;
};
return PublicServiceMultiRichContentMessage;
}();
RongIMLib.PublicServiceMultiRichContentMessage=PublicServiceMultiRichContentMessage;
var SyncReadStatusMessage=function(){
function SyncReadStatusMessage(message){
this.messageName="SyncReadStatusMessage";
message.lastMessageSendTime&&(this.lastMessageSendTime=message.lastMessageSendTime);
}
SyncReadStatusMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return SyncReadStatusMessage;
}();
RongIMLib.SyncReadStatusMessage=SyncReadStatusMessage;
var ReadReceiptRequestMessage=function(){
function ReadReceiptRequestMessage(message){
this.messageName="ReadReceiptRequestMessage";
message.messageUId&&(this.messageUId=message.messageUId);
}
ReadReceiptRequestMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return ReadReceiptRequestMessage;
}();
RongIMLib.ReadReceiptRequestMessage=ReadReceiptRequestMessage;
var ReadReceiptResponseMessage=function(){
function ReadReceiptResponseMessage(message){
this.messageName="ReadReceiptResponseMessage";
message.receiptMessageDic&&(this.receiptMessageDic=message.receiptMessageDic);
}
ReadReceiptResponseMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return ReadReceiptResponseMessage;
}();
RongIMLib.ReadReceiptResponseMessage=ReadReceiptResponseMessage;
var PublicServiceRichContentMessage=function(){
function PublicServiceRichContentMessage(message){
this.messageName="PublicServiceRichContentMessage";
this.richContentMessage=message;
}
PublicServiceRichContentMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return PublicServiceRichContentMessage;
}();
RongIMLib.PublicServiceRichContentMessage=PublicServiceRichContentMessage;
var FileMessage=function(){
function FileMessage(message){
this.messageName="FileMessage";
message.name&&(this.name=message.name);
message.size&&(this.size=message.size);
message.type&&(this.type=message.type);
message.fileUrl&&(this.fileUrl=message.fileUrl);
message.extra&&(this.extra=message.extra);
message.user&&(this.user=message.user);
}
FileMessage.obtain=function(msg){
return new FileMessage({name:msg.name,size:msg.size,type:msg.type,fileUrl:msg.fileUrl});
};
FileMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return FileMessage;
}();
RongIMLib.FileMessage=FileMessage;
var AcceptMessage=function(){
function AcceptMessage(message){
this.messageName="AcceptMessage";
this.mediaId=message.mediaId;
this.callId=message.callId;
this.mediaType=message.mediaType;
this.mode=message.mode;
this.subInfo=message.subInfo;
}
AcceptMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return AcceptMessage;
}();
RongIMLib.AcceptMessage=AcceptMessage;
var RingingMessage=function(){
function RingingMessage(message){
this.messageName="RingingMessage";
this.callId=message.callId;
}
RingingMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return RingingMessage;
}();
RongIMLib.RingingMessage=RingingMessage;
var SummaryMessage=function(){
function SummaryMessage(message){
this.messageName="SummaryMessage";
this.caller=message.caller;
this.inviter=message.inviter;
this.mediaType=message.mediaType;
this.memberIdList=message.memberIdList;
this.startTime=message.startTime;
this.connectedTime=message.connectedTime;
this.duration=message.duration;
this.status=message.status;
}
SummaryMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return SummaryMessage;
}();
RongIMLib.SummaryMessage=SummaryMessage;
var HungupMessage=function(){
function HungupMessage(message){
this.messageName="HungupMessage";
this.callId=message.callId;
this.reason=message.reason;
this.mode=message.mode;
this.subInfo=message.subInfo;
}
HungupMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return HungupMessage;
}();
RongIMLib.HungupMessage=HungupMessage;
var InviteMessage=function(){
function InviteMessage(message){
this.messageName="InviteMessage";
this.mediaId=message.mediaId;
this.callId=message.callId;
this.engineType=message.engineType;
this.channelInfo=message.channelInfo;
this.mediaType=message.mediaType;
this.extra=message.extra;
this.inviteUserIds=message.inviteUserIds;
this.observerUserIds=message.observerUserIds;
this.mode=message.mode;
this.subInfo=message.subInfo;
}
InviteMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return InviteMessage;
}();
RongIMLib.InviteMessage=InviteMessage;
var MediaModifyMessage=function(){
function MediaModifyMessage(message){
this.messageName="MediaModifyMessage";
this.callId=message.callId;
this.mediaType=message.mediaType;
this.mode=message.mode;
this.subInfo=message.subInfo;
}
MediaModifyMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return MediaModifyMessage;
}();
RongIMLib.MediaModifyMessage=MediaModifyMessage;
var MemberModifyMessage=function(){
function MemberModifyMessage(message){
this.messageName="MemberModifyMessage";
this.modifyMemType=message.modifyMemType;
this.callId=message.callId;
this.caller=message.caller;
this.engineType=message.engineType;
this.channelInfo=message.channelInfo;
this.mediaType=message.mediaType;
this.extra=message.extra;
this.inviteUserIds=message.inviteUserIds;
this.existedMemberStatusList=message.existedMemberStatusList;
this.existedUserPofiles=message.existedUserPofiles;
this.observerUserIds=message.observerUserIds;
this.mode=message.mode;
this.subInfo=message.subInfo;
}
MemberModifyMessage.prototype.encode=function(){
return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
};
return MemberModifyMessage;
}();
RongIMLib.MemberModifyMessage=MemberModifyMessage;
})(RongIMLib||(RongIMLib={}));
var RongIMLib;
(function(RongIMLib){
var ChannelInfo=function(){
function ChannelInfo(Id,Key){
this.Id=Id;
this.Key=Key;
}
return ChannelInfo;
}();
RongIMLib.ChannelInfo=ChannelInfo;
var UserStatus=function(){
function UserStatus(platform,online,status){
this.platform=platform;
this.online=online;
this.status=status;
}
return UserStatus;
}();
RongIMLib.UserStatus=UserStatus;
var MentionedInfo=function(){
function MentionedInfo(type,userIdList,mentionedContent){
}
return MentionedInfo;
}();
RongIMLib.MentionedInfo=MentionedInfo;
var DeleteMessage=function(){
function DeleteMessage(msgId,msgDataTime,direct){
this.msgId=msgId;
this.msgDataTime=msgDataTime;
this.direct=direct;
}
return DeleteMessage;
}();
RongIMLib.DeleteMessage=DeleteMessage;
var CustomServiceConfig=function(){
function CustomServiceConfig(isBlack,companyName,companyUrl){
}
return CustomServiceConfig;
}();
RongIMLib.CustomServiceConfig=CustomServiceConfig;
var CustomServiceSession=function(){
function CustomServiceSession(uid,cid,pid,isQuited,type,adminHelloWord,adminOfflineWord){
}
return CustomServiceSession;
}();
RongIMLib.CustomServiceSession=CustomServiceSession;
var Conversation=function(){
function Conversation(conversationTitle,conversationType,draft,isTop,latestMessage,latestMessageId,notificationStatus,objectName,receivedStatus,receivedTime,senderUserId,senderUserName,sentStatus,sentTime,targetId,unreadMessageCount,senderPortraitUri,isHidden,mentionedMsg,hasUnreadMention,_readTime){
this.conversationTitle=conversationTitle;
this.conversationType=conversationType;
this.draft=draft;
this.isTop=isTop;
this.latestMessage=latestMessage;
this.latestMessageId=latestMessageId;
this.notificationStatus=notificationStatus;
this.objectName=objectName;
this.receivedStatus=receivedStatus;
this.receivedTime=receivedTime;
this.senderUserId=senderUserId;
this.senderUserName=senderUserName;
this.sentStatus=sentStatus;
this.sentTime=sentTime;
this.targetId=targetId;
this.unreadMessageCount=unreadMessageCount;
this.senderPortraitUri=senderPortraitUri;
this.isHidden=isHidden;
this.mentionedMsg=mentionedMsg;
this.hasUnreadMention=hasUnreadMention;
this._readTime=_readTime;
}
Conversation.prototype.setTop=function(){
RongIMLib.RongIMClient._dataAccessProvider.addConversation(this,{onSuccess:function onSuccess(data){}});
};
return Conversation;
}();
RongIMLib.Conversation=Conversation;
var Discussion=function(){
function Discussion(creatorId,id,memberIdList,name,isOpen){
this.creatorId=creatorId;
this.id=id;
this.memberIdList=memberIdList;
this.name=name;
this.isOpen=isOpen;
}
return Discussion;
}();
RongIMLib.Discussion=Discussion;
var Group=function(){
function Group(id,name,portraitUri){
this.id=id;
this.name=name;
this.portraitUri=portraitUri;
}
return Group;
}();
RongIMLib.Group=Group;
var Message=function(){
function Message(content,conversationType,extra,objectName,messageDirection,messageId,receivedStatus,receivedTime,senderUserId,sentStatus,sentTime,targetId,messageType,messageUId,isLocalMessage,offLineMessage,receiptResponse){
this.content=content;
this.conversationType=conversationType;
this.extra=extra;
this.objectName=objectName;
this.messageDirection=messageDirection;
this.messageId=messageId;
this.receivedStatus=receivedStatus;
this.receivedTime=receivedTime;
this.senderUserId=senderUserId;
this.sentStatus=sentStatus;
this.sentTime=sentTime;
this.targetId=targetId;
this.messageType=messageType;
this.messageUId=messageUId;
this.isLocalMessage=isLocalMessage;
this.offLineMessage=offLineMessage;
this.receiptResponse=receiptResponse;
}
return Message;
}();
RongIMLib.Message=Message;
var MessageTag=function(){
function MessageTag(isCounted,isPersited){
this.isCounted=isCounted;
this.isPersited=isPersited;
}
MessageTag.prototype.getMessageTag=function(){
if(this.isCounted&&this.isPersited){
return 3;
}else
if(this.isCounted){
return 2;
}else
if(this.isPersited){
return 1;
}else
if(!this.isCounted&&!this.isPersited){
return 0;
}
};
MessageTag.getTagByStatus=function(status){
var statusMap={
3:{
isCounted:true,
isPersited:true},

2:{
isCounted:true,
isPersited:false},

1:{
isCounted:true,
isPersited:true},

0:{
isCounted:true,
isPersited:true}};


return statusMap[status]||statusMap[3];
};
return MessageTag;
}();
RongIMLib.MessageTag=MessageTag;
var PublicServiceMenuItem=function(){
function PublicServiceMenuItem(id,name,type,sunMenuItems,url){
this.id=id;
this.name=name;
this.type=type;
this.sunMenuItems=sunMenuItems;
this.url=url;
}
return PublicServiceMenuItem;
}();
RongIMLib.PublicServiceMenuItem=PublicServiceMenuItem;
// TODO: TBD
var PublicServiceProfile=function(){
function PublicServiceProfile(conversationType,introduction,menu,name,portraitUri,publicServiceId,hasFollowed,isGlobal){
this.conversationType=conversationType;
this.introduction=introduction;
this.menu=menu;
this.name=name;
this.portraitUri=portraitUri;
this.publicServiceId=publicServiceId;
this.hasFollowed=hasFollowed;
this.isGlobal=isGlobal;
}
return PublicServiceProfile;
}();
RongIMLib.PublicServiceProfile=PublicServiceProfile;
var UserInfo=function(){
function UserInfo(id,name,portraitUri){
this.id=id;
this.name=name;
this.portraitUri=portraitUri;
}
return UserInfo;
}();
RongIMLib.UserInfo=UserInfo;
var User=function(){
function User(id,token){
this.id=id;
this.token=token;
}
return User;
}();
RongIMLib.User=User;
var Room=function(){
function Room(id,user){
this.id=id;
this.user=user;
}
return Room;
}();
RongIMLib.Room=Room;
})(RongIMLib||(RongIMLib={}));
var RongIMLib;
(function(RongIMLib){
var ServerDataProvider=function(){
function ServerDataProvider(){
this.userStatusListener=null;
}
ServerDataProvider.prototype.init=function(appKey,options){
new RongIMLib.FeatureDectector(options.appCallback);
};
ServerDataProvider.prototype.connect=function(token,callback,userId,option){
RongIMLib.RongIMClient.bridge=RongIMLib.Bridge.getInstance();
RongIMLib.RongIMClient._memoryStore.token=token;
RongIMLib.RongIMClient._memoryStore.callback=callback;
userId=userId||'';
option=option||{};
var isConnecting=false,isConnected=false;
if(RongIMLib.Bridge._client&&RongIMLib.Bridge._client.channel){
isConnecting=RongIMLib.Bridge._client.channel.connectionStatus==RongIMLib.ConnectionStatus.CONNECTING;
isConnected=RongIMLib.Bridge._client.channel.connectionStatus==RongIMLib.ConnectionStatus.CONNECTED;
}
if(isConnected||isConnecting){
return;
}
var isGreater=RongIMLib.RongIMClient.otherDeviceLoginCount>5;
if(isGreater){
callback.onError(RongIMLib.ConnectionStatus.ULTRALIMIT);
return;
}
// 清除本地导航缓存
if(option.force){
RongIMLib.RongIMClient._storageProvider.removeItem('servers');
}
//循环设置监听事件，追加之后清空存放事件数据
for(var i=0,len=RongIMLib.RongIMClient._memoryStore.listenerList.length;i<len;i++){
RongIMLib.RongIMClient.bridge["setListener"](RongIMLib.RongIMClient._memoryStore.listenerList[i]);
}
RongIMLib.RongIMClient._memoryStore.listenerList.length=0;
RongIMLib.RongIMClient.bridge.connect(RongIMLib.RongIMClient._memoryStore.appKey,token,{
onSuccess:function onSuccess(data){
setTimeout(function(){
callback.onSuccess(data);
});
},
onError:function onError(e){
if(e==RongIMLib.ConnectionState.TOKEN_INCORRECT||!e){
setTimeout(function(){
callback.onTokenIncorrect();
});
}else
{
setTimeout(function(){
callback.onError(e);
});
}
}});

};
/*
            config.auto: 默认 false, true 启用自动重连，启用则为必选参数
            config.rate: 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
            config.url: 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
        */
ServerDataProvider.prototype.reconnect=function(callback,config){
var store=RongIMLib.RongIMClient._memoryStore;
var token=store.token;
if(!token){
throw new Error('reconnect: token is empty.');
}
if(RongIMLib.Bridge._client&&RongIMLib.Bridge._client.channel&&RongIMLib.Bridge._client.channel.connectionStatus!=RongIMLib.ConnectionStatus.CONNECTED&&RongIMLib.Bridge._client.channel.connectionStatus!=RongIMLib.ConnectionStatus.CONNECTING){
config=config||{};
var key=config.auto?'auto':'custom';
var handler={
auto:function auto(){
var repeatConnect=function repeatConnect(options){
var step=options.step();
var done='done';
var url=options.url;
var ping=function ping(){
RongIMLib.RongUtil.request({
url:url,
success:function success(){
options.done();
},
error:function error(){
repeat();
}});

};
var repeat=function repeat(){
var next=step();
if(next=='done'){
var error=RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE;
options.done(error);
return;
}
setTimeout(ping,next);
};
repeat();
};
var protocol=RongIMLib.RongIMClient._memoryStore.depend.protocol;
var url=config.url||'cdn.ronghub.com/RongIMLib-2.2.6.min.js';
var pathConfig={
protocol:protocol,
path:url};

url=RongIMLib.RongUtil.formatProtoclPath(pathConfig);
var rate=config.rate||[100,1000,3000,6000,10000,18000];
//结束标识
rate.push('done');
var opts={
url:url,
step:function step(){
var index=0;
return function(){
var time=rate[index];
index++;
return time;
};
},
done:function done(error){
if(error){
callback.onError(error);
return;
}
RongIMLib.RongIMClient.connect(token,callback);
}};

repeatConnect(opts);
},
custom:function custom(){
RongIMLib.RongIMClient.connect(token,callback);
}};

handler[key]();
}
};
ServerDataProvider.prototype.logout=function(){
RongIMLib.RongIMClient.bridge.disconnect();
RongIMLib.RongIMClient.bridge=null;
};
ServerDataProvider.prototype.disconnect=function(){
RongIMLib.RongIMClient.bridge.disconnect();
};
ServerDataProvider.prototype.sendReceiptResponse=function(conversationType,targetId,sendCallback){
var rspkey=RongIMLib.Bridge._client.userId+conversationType+targetId+'RECEIVED',me=this;
if(RongIMLib.RongUtil.supportLocalStorage()){
var valObj=JSON.parse(RongIMLib.RongIMClient._storageProvider.getItem(rspkey));
if(valObj){
var vals=[];
for(var key in valObj){
var tmp={};
tmp[key]=valObj[key].uIds;
valObj[key].isResponse||vals.push(tmp);
}
if(vals.length==0){
sendCallback.onSuccess();
return;
}
var interval=setInterval(function(){
if(vals.length==1){
clearInterval(interval);
}
var obj=vals.splice(0,1)[0];
var rspMsg=new RongIMLib.ReadReceiptResponseMessage({receiptMessageDic:obj});
me.sendMessage(conversationType,targetId,rspMsg,{
onSuccess:function onSuccess(msg){
var senderUserId=RongIMLib.MessageUtil.getFirstKey(obj);
valObj[senderUserId].isResponse=true;
RongIMLib.RongIMClient._storageProvider.setItem(rspkey,JSON.stringify(valObj));
sendCallback.onSuccess(msg);
},
onError:function onError(error,msg){
sendCallback.onError(error,msg);
}});

},200);
}else
{
sendCallback.onSuccess();
}
}else
{
sendCallback.onSuccess();
}
};
ServerDataProvider.prototype.sendTypingStatusMessage=function(conversationType,targetId,messageName,sendCallback){
var me=this;
if(messageName in RongIMLib.RongIMClient.MessageParams){
me.sendMessage(conversationType,targetId,RongIMLib.TypingStatusMessage.obtain(RongIMLib.RongIMClient.MessageParams[messageName].objectName,""),{
onSuccess:function onSuccess(){
setTimeout(function(){
sendCallback.onSuccess();
});
},
onError:function onError(errorCode){
setTimeout(function(){
sendCallback.onError(errorCode,null);
});
},
onBefore:function onBefore(){}});

}
};
ServerDataProvider.prototype.sendRecallMessage=function(content,sendMessageCallback){
var msg=new RongIMLib.RecallCommandMessage({conversationType:content.conversationType,targetId:content.targetId,sentTime:content.sentTime,messageUId:content.messageUId,extra:content.extra,user:content.user});
this.sendMessage(content.conversationType,content.senderUserId,msg,sendMessageCallback,false,null,null,2);
};
ServerDataProvider.prototype.sendTextMessage=function(conversationType,targetId,content,sendMessageCallback){
var msgContent=RongIMLib.TextMessage.obtain(content);
this.sendMessage(conversationType,targetId,msgContent,sendMessageCallback);
};
ServerDataProvider.prototype.getRemoteHistoryMessages=function(conversationType,targetId,timestamp,count,callback,config){
if(count<=1){
throw new Error("the count must be greater than 1.");
}
config=config||{};
var order=config.order||0;
var getKey=function getKey(){
return[conversationType,targetId,'_',order].join('');
};
var key=getKey();
if(!RongIMLib.RongUtil.isNumber(timestamp)){
timestamp=RongIMLib.RongIMClient._memoryStore.lastReadTime.get(key);
}
var memoryStore=RongIMLib.RongIMClient._memoryStore;
var historyMessageLimit=memoryStore.historyMessageLimit;
/*
                limit 属性:
                var limit = {
                    time: '时间戳, 最后一次拉取时间',
                    hasMore: '是否还有历史消息, bool 值'
                };
            */
var limit=historyMessageLimit.get(key)||{};
var hasMore=limit.hasMore;
var isFecth=hasMore||limit.time!=timestamp;
// 正序获取消息时不做限制，防止有新消息导致无法获取
if(!isFecth&&order==0){
return callback.onSuccess([],hasMore);
}
var modules=new RongIMLib.RongIMClient.Protobuf.HistoryMsgInput(),self=this;
modules.setTargetId(targetId);
modules.setTime(timestamp);
modules.setCount(count);
modules.setOrder(order);
RongIMLib.RongIMClient.bridge.queryMsg(HistoryMsgType[conversationType],RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),targetId,{
onSuccess:function onSuccess(data){
var fetchTime=RongIMLib.MessageUtil.int64ToTimestamp(data.syncTime);
RongIMLib.RongIMClient._memoryStore.lastReadTime.set(key,fetchTime);
historyMessageLimit.set(key,{
hasMore:!!data.hasMsg,
time:fetchTime});

var list=data.list.reverse(),tempMsg=null,tempDir;
var read=RongIMLib.SentStatus.READ;
if(RongIMLib.RongUtil.supportLocalStorage()){
for(var i=0,len=list.length;i<len;i++){
tempMsg=RongIMLib.MessageUtil.messageParser(list[i]);
tempDir=JSON.parse(RongIMLib.RongIMClient._storageProvider.getItem(RongIMLib.Bridge._client.userId+tempMsg.messageUId+"SENT"));
if(tempDir){
tempMsg.receiptResponse||(tempMsg.receiptResponse={});
tempMsg.receiptResponse[tempMsg.messageUId]=tempDir.count;
}
tempMsg.sentStatus=read;
tempMsg.targetId=targetId;
list[i]=tempMsg;
}
}else
{
for(var i=0,len=list.length;i<len;i++){
var tempMsg=RongIMLib.MessageUtil.messageParser(list[i]);
tempMsg.sentStatus=read;
list[i]=tempMsg;
}
}
setTimeout(function(){
callback.onSuccess(list,!!data.hasMsg);
});
},
onError:function onError(error){
setTimeout(function(){
callback.onError(error);
});
}},
"HistoryMessagesOuput");
};
ServerDataProvider.prototype.hasRemoteUnreadMessages=function(token,callback){
var xss=null;
window.RCCallback=function(x){
setTimeout(function(){callback.onSuccess(!!+x.status);});
xss.parentNode.removeChild(xss);
};
xss=document.createElement("script");
xss.src=RongIMLib.RongIMClient._memoryStore.depend.api+"/message/exist.js?appKey="+encodeURIComponent(RongIMLib.RongIMClient._memoryStore.appKey)+"&token="+encodeURIComponent(token)+"&callBack=RCCallback&_="+RongIMLib.RongUtil.getTimestamp();
document.body.appendChild(xss);
xss.onerror=function(){
setTimeout(function(){callback.onError(RongIMLib.ErrorCode.UNKNOWN);});
xss.parentNode.removeChild(xss);
};
};
ServerDataProvider.prototype.getRemoteConversationList=function(callback,conversationTypes,count){
var modules=new RongIMLib.RongIMClient.Protobuf.RelationsInput(),self=this;
modules.setType(1);
if(typeof count=='undefined'){
modules.setCount(0);
}else
{
modules.setCount(count);
}
RongIMLib.RongIMClient.bridge.queryMsg(26,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),RongIMLib.Bridge._client.userId,{
onSuccess:function onSuccess(list){
if(list.info){
list.info=list.info.reverse();
for(var i=0,len=list.info.length;i<len;i++){
RongIMLib.RongIMClient.getInstance().pottingConversation(list.info[i]);
}
}
var conversations=RongIMLib.RongIMClient._memoryStore.conversationList;
setTimeout(function(){
if(conversationTypes){
return callback.onSuccess(self.filterConversations(conversationTypes,conversations));
}
callback.onSuccess(conversations);
});
},
onError:function onError(error){
callback.onError(error);
}},
"RelationsOutput");
};
ServerDataProvider.prototype.addMemberToDiscussion=function(discussionId,userIdList,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.ChannelInvitationInput();
modules.setUsers(userIdList);
RongIMLib.RongIMClient.bridge.queryMsg(0,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),discussionId,{
onSuccess:function onSuccess(){
setTimeout(function(){
callback.onSuccess();
});
},
onError:function onError(error){
setTimeout(function(){
callback.onError(error);
});
}});

};
ServerDataProvider.prototype.createDiscussion=function(name,userIdList,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.CreateDiscussionInput(),self=this;
modules.setName(name);
RongIMLib.RongIMClient.bridge.queryMsg(1,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),RongIMLib.Bridge._client.userId,{
onSuccess:function onSuccess(discussId){
if(userIdList.length>0){
self.addMemberToDiscussion(discussId,userIdList,{
onSuccess:function onSuccess(){},
onError:function onError(error){
setTimeout(function(){
callback.onError(error);
});
}});

}
setTimeout(function(){
callback.onSuccess(discussId);
});
},
onError:function onError(error){
setTimeout(function(){
callback.onError(error);
});
}},
"CreateDiscussionOutput");
};
ServerDataProvider.prototype.getDiscussion=function(discussionId,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.ChannelInfoInput();
modules.setNothing(1);
RongIMLib.RongIMClient.bridge.queryMsg(4,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),discussionId,{
onSuccess:function onSuccess(data){
setTimeout(function(){
callback.onSuccess(data);
});
},
onError:function onError(errorCode){
setTimeout(function(){
callback.onError(errorCode);
});
}},
"ChannelInfoOutput");
};
ServerDataProvider.prototype.quitDiscussion=function(discussionId,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.LeaveChannelInput();
modules.setNothing(1);
RongIMLib.RongIMClient.bridge.queryMsg(7,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),discussionId,{
onSuccess:function onSuccess(){
setTimeout(function(){
callback.onSuccess();
});
},
onError:function onError(errorCode){
setTimeout(function(){
callback.onError(errorCode);
});
}});

};
ServerDataProvider.prototype.removeMemberFromDiscussion=function(discussionId,userId,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.ChannelEvictionInput();
modules.setUser(userId);
RongIMLib.RongIMClient.bridge.queryMsg(9,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),discussionId,{
onSuccess:function onSuccess(){
setTimeout(function(){
callback.onSuccess();
});
},
onError:function onError(errorCode){
setTimeout(function(){
callback.onError(errorCode);
});
}});

};
ServerDataProvider.prototype.setDiscussionInviteStatus=function(discussionId,status,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.ModifyPermissionInput();
modules.setOpenStatus(status.valueOf());
RongIMLib.RongIMClient.bridge.queryMsg(11,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),discussionId,{
onSuccess:function onSuccess(x){
setTimeout(function(){
callback.onSuccess();
});
},onError:function onError(error){
setTimeout(function(){
callback.onError(error);
});
}});

};
ServerDataProvider.prototype.setDiscussionName=function(discussionId,name,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.RenameChannelInput();
modules.setName(name);
RongIMLib.RongIMClient.bridge.queryMsg(12,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),discussionId,{
onSuccess:function onSuccess(){
setTimeout(function(){
callback.onSuccess();
});
},
onError:function onError(errcode){
callback.onError(errcode);
}});

};
ServerDataProvider.prototype.joinChatRoom=function(chatroomId,messageCount,callback){
var e=new RongIMLib.RongIMClient.Protobuf.ChrmInput();
e.setNothing(1);
RongIMLib.Bridge._client.chatroomId=chatroomId;
RongIMLib.RongIMClient.bridge.queryMsg(19,RongIMLib.MessageUtil.ArrayForm(e.toArrayBuffer()),chatroomId,{
onSuccess:function onSuccess(){
setTimeout(function(){
callback.onSuccess();
});
var modules=new RongIMLib.RongIMClient.Protobuf.ChrmPullMsg();
messageCount==0&&(messageCount=-1);
modules.setCount(messageCount);
modules.setSyncTime(0);
RongIMLib.Bridge._client.queryMessage("chrmPull",RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),chatroomId,1,{
onSuccess:function onSuccess(collection){
var list=collection.list;
var sync=RongIMLib.MessageUtil.int64ToTimestamp(collection.syncTime);
var latestMessage=list[list.length-1];
if(latestMessage){
latestMessage=RongIMLib.MessageUtil.messageParser(latestMessage);
sync=latestMessage.sentTime;
}
RongIMLib.RongIMClient._memoryStore.lastReadTime.set(chatroomId+RongIMLib.Bridge._client.userId+"CST",sync);
var _client=RongIMLib.Bridge._client;
for(var i=0,mlen=list.length;i<mlen;i++){
var uId='R'+list[i].msgId;
if(!(uId in _client.cacheMessageIds)){
_client.cacheMessageIds[uId]=true;
var cacheUIds=RongIMLib.RongUtil.keys(_client.cacheMessageIds);
if(cacheUIds.length>10){
uId=cacheUIds[0];
delete _client.cacheMessageIds[uId];
}
if(RongIMLib.RongIMClient._memoryStore.filterMessages.length>0){
for(var j=0,flen=RongIMLib.RongIMClient._memoryStore.filterMessages.length;j<flen;j++){
if(RongIMLib.RongIMClient.MessageParams[RongIMLib.RongIMClient._memoryStore.filterMessages[j]].objectName!=list[i].classname){
_client.handler.onReceived(list[i]);
}
}
}else
{
_client.handler.onReceived(list[i]);
}
}
}
},
onError:function onError(x){
setTimeout(function(){
callback.onError(RongIMLib.ErrorCode.CHATROOM_HISMESSAGE_ERROR);
});
}},
"DownStreamMessages");
},
onError:function onError(error){
setTimeout(function(){
callback.onError(error);
});
}},
"ChrmOutput");
};
ServerDataProvider.prototype.getChatRoomInfo=function(chatRoomId,count,order,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.QueryChatroomInfoInput();
modules.setCount(count);
modules.setOrder(order);
RongIMLib.RongIMClient.bridge.queryMsg("queryChrmI",RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),chatRoomId,{
onSuccess:function onSuccess(ret){
var userInfos=ret.userInfos;
userInfos.forEach(function(item){
item.time=RongIMLib.MessageUtil.int64ToTimestamp(item.time);
});
setTimeout(function(){
callback.onSuccess(ret);
});
},
onError:function onError(errcode){
setTimeout(function(){
callback.onError(errcode);
});
}},
"QueryChatroomInfoOutput");
};
ServerDataProvider.prototype.quitChatRoom=function(chatroomId,callback){
var e=new RongIMLib.RongIMClient.Protobuf.ChrmInput();
e.setNothing(1);
RongIMLib.RongIMClient.bridge.queryMsg(17,RongIMLib.MessageUtil.ArrayForm(e.toArrayBuffer()),chatroomId,{
onSuccess:function onSuccess(){
setTimeout(function(){
callback.onSuccess();
});
},
onError:function onError(errcode){
setTimeout(function(){
callback.onError(errcode);
});
}},
"ChrmOutput");
};
ServerDataProvider.prototype.setChatroomHisMessageTimestamp=function(chatRoomId,timestamp){
RongIMLib.RongIMClient._memoryStore.lastReadTime.set('chrhis_'+chatRoomId,timestamp);
};
ServerDataProvider.prototype.getChatRoomHistoryMessages=function(chatRoomId,count,order,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.HistoryMsgInput();
modules.setTargetId(chatRoomId);
var timestamp=RongIMLib.RongIMClient._memoryStore.lastReadTime.get('chrhis_'+chatRoomId)||0;
modules.setTime(timestamp);
modules.setCount(count);
modules.setOrder(order);
RongIMLib.RongIMClient.bridge.queryMsg(34,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),RongIMLib.Bridge._client.userId,{
onSuccess:function onSuccess(data){
RongIMLib.RongIMClient._memoryStore.lastReadTime.set('chrhis_'+chatRoomId,RongIMLib.MessageUtil.int64ToTimestamp(data.syncTime));
var list=data.list.reverse();
for(var i=0,len=list.length;i<len;i++){
list[i]=RongIMLib.MessageUtil.messageParser(list[i]);
}
setTimeout(function(){
callback.onSuccess(list,!!data.hasMsg);
});
},
onError:function onError(error){
setTimeout(function(){
callback.onError(error);
});
}},
"HistoryMsgOuput");
};
ServerDataProvider.prototype.setMessageStatus=function(conversationType,targetId,timestamp,status,callback){
setTimeout(function(){
callback.onSuccess(true);
});
};
ServerDataProvider.prototype.addToBlacklist=function(userId,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.Add2BlackListInput();
modules.setUserId(userId);
RongIMLib.RongIMClient.bridge.queryMsg(21,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),userId,{
onSuccess:function onSuccess(){
setTimeout(function(){
callback.onSuccess();
});
},
onError:function onError(error){
setTimeout(function(){
callback.onError(error);
});
}});

};
ServerDataProvider.prototype.getBlacklist=function(callback){
var modules=new RongIMLib.RongIMClient.Protobuf.QueryBlackListInput();
modules.setNothing(1);
RongIMLib.RongIMClient.bridge.queryMsg(23,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),RongIMLib.Bridge._client.userId,{
onSuccess:function onSuccess(list){
setTimeout(function(){
callback.onSuccess(list);
});
},
onError:function onError(error){
setTimeout(function(){
callback.onError(error);
});
}},
"QueryBlackListOutput");
};
ServerDataProvider.prototype.getBlacklistStatus=function(userId,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.BlackListStatusInput();
modules.setUserId(userId);
RongIMLib.RongIMClient.bridge.queryMsg(24,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),userId,{
onSuccess:function onSuccess(status){
setTimeout(function(){
callback.onSuccess(RongIMLib.BlacklistStatus[status]);
});
},onError:function onError(error){
setTimeout(function(){
callback.onError(error);
});
}});

};
ServerDataProvider.prototype.removeFromBlacklist=function(userId,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.RemoveFromBlackListInput();
modules.setUserId(userId);
RongIMLib.RongIMClient.bridge.queryMsg(22,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),userId,{
onSuccess:function onSuccess(){
setTimeout(function(){
callback.onSuccess();
});
},
onError:function onError(error){
setTimeout(function(){
callback.onError(error);
});
}});

};
ServerDataProvider.prototype.getFileToken=function(fileType,callback){
if(!/(1|2|3|4)/.test(fileType.toString())){
setTimeout(function(){
callback.onError(RongIMLib.ErrorCode.QNTKN_FILETYPE_ERROR);
});
return;
}
var modules=new RongIMLib.RongIMClient.Protobuf.GetQNupTokenInput();
modules.setType(fileType);
RongIMLib.RongIMClient.bridge.queryMsg(30,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),RongIMLib.Bridge._client.userId,{
onSuccess:function onSuccess(data){
setTimeout(function(){
callback.onSuccess(data);
});
},
onError:function onError(errcode){
setTimeout(function(){
callback.onError(errcode);
});
}},
"GetQNupTokenOutput");
};
ServerDataProvider.prototype.getFileUrl=function(fileType,fileName,oriName,callback){
if(!/(1|2|3|4)/.test(fileType.toString())){
setTimeout(function(){
callback.onError(RongIMLib.ErrorCode.QNTKN_FILETYPE_ERROR);
});
return;
}
var modules=new RongIMLib.RongIMClient.Protobuf.GetQNdownloadUrlInput();
modules.setType(fileType);
modules.setKey(fileName);
if(oriName){
modules.setFileName(oriName);
}
RongIMLib.RongIMClient.bridge.queryMsg(31,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),RongIMLib.Bridge._client.userId,{
onSuccess:function onSuccess(data){
setTimeout(function(){
callback.onSuccess(data);
});
},
onError:function onError(errcode){
setTimeout(function(){
callback.onError(errcode);
});
}},
"GetQNdownloadUrlOutput");
};
/*
            methodType 1 : 多客服(客服后台使用);   2 : 消息撤回
            params.userIds : 定向消息接收者
        */
ServerDataProvider.prototype.sendMessage=function(conversationType,targetId,messageContent,sendCallback,mentiondMsg,pushText,appData,methodType,params){
if(!RongIMLib.Bridge._client.channel){
setTimeout(function(){
sendCallback.onError(RongIMLib.ErrorCode.RC_NET_UNAVAILABLE,null);
});
return;
}
if(!RongIMLib.Bridge._client.channel.socket.socket.connected){
setTimeout(function(){
sendCallback.onError(RongIMLib.ErrorCode.TIMEOUT,null);
});
throw new Error("connect is timeout! postion:sendMessage");
}
var isGroup=conversationType==RongIMLib.ConversationType.DISCUSSION||conversationType==RongIMLib.ConversationType.GROUP;
var modules=new RongIMLib.RongIMClient.Protobuf.UpStreamMessage();
if(mentiondMsg&&isGroup){
modules.setSessionId(7);
}else
{
modules.setSessionId(RongIMLib.RongIMClient.MessageParams[messageContent.messageName].msgTag.getMessageTag());
}
pushText&&modules.setPushText(pushText);
appData&&modules.setAppData(appData);
if(isGroup&&messageContent.messageName==RongIMLib.RongIMClient.MessageType["ReadReceiptResponseMessage"]){
var rspMsg=messageContent;
if(rspMsg.receiptMessageDic){
var ids=[];
for(var key in rspMsg.receiptMessageDic){
ids.push(key);
}
modules.setUserId(ids);
}
}
if(isGroup&&messageContent.messageName==RongIMLib.RongIMClient.MessageType["SyncReadStatusMessage"]){
modules.setUserId(RongIMLib.Bridge._client.userId);
}
params=params||{};
var userIds=params.userIds;
if(isGroup&&userIds){
modules.setUserId(userIds);
}
modules.setClassname(RongIMLib.RongIMClient.MessageParams[messageContent.messageName].objectName);
modules.setContent(messageContent.encode());
var content=modules.toArrayBuffer();
if(Object.prototype.toString.call(content)=="[object ArrayBuffer]"){
content=[].slice.call(new Int8Array(content));
}
var me=this,msg=new RongIMLib.Message();
var c=this.getConversation(conversationType,targetId);
if(RongIMLib.RongIMClient.MessageParams[messageContent.messageName].msgTag.getMessageTag()==3){
if(!c){
c=RongIMLib.RongIMClient.getInstance().createConversation(conversationType,targetId,"");
}
c.sentTime=new Date().getTime();
c.sentStatus=RongIMLib.SentStatus.SENDING;
c.senderUserName="";
c.senderUserId=RongIMLib.Bridge._client.userId;
c.notificationStatus=RongIMLib.ConversationNotificationStatus.DO_NOT_DISTURB;
c.latestMessage=msg;
c.unreadMessageCount=0;
RongIMLib.RongIMClient._dataAccessProvider.addConversation(c,{onSuccess:function onSuccess(data){}});
}
RongIMLib.RongIMClient._memoryStore.converStore=c;
msg.content=messageContent;
msg.conversationType=conversationType;
msg.senderUserId=RongIMLib.Bridge._client.userId;
msg.objectName=RongIMLib.RongIMClient.MessageParams[messageContent.messageName].objectName;
msg.targetId=targetId;
msg.sentTime=new Date().getTime();
msg.messageDirection=RongIMLib.MessageDirection.SEND;
msg.sentStatus=RongIMLib.SentStatus.SENT;
msg.messageType=messageContent.messageName;
RongIMLib.RongIMClient.bridge.pubMsg(conversationType.valueOf(),content,targetId,{
onSuccess:function onSuccess(data){
if(data&&data.timestamp){
RongIMLib.RongIMClient._memoryStore.lastReadTime.set('converST_'+RongIMLib.Bridge._client.userId+conversationType+targetId,data.timestamp);
}
if((conversationType==RongIMLib.ConversationType.DISCUSSION||conversationType==RongIMLib.ConversationType.GROUP)&&messageContent.messageName==RongIMLib.RongIMClient.MessageType["ReadReceiptRequestMessage"]){
var reqMsg=msg.content;
var sentkey=RongIMLib.Bridge._client.userId+reqMsg.messageUId+"SENT";
RongIMLib.RongIMClient._storageProvider.setItem(sentkey,JSON.stringify({count:0,dealtime:data.timestamp,userIds:{}}));
}
if(RongIMLib.RongIMClient.MessageParams[msg.messageType].msgTag.getMessageTag()==3){
var cacheConversation=RongIMLib.RongIMClient._memoryStore.converStore;
cacheConversation.sentStatus=msg.sentStatus;
cacheConversation.latestMessage=msg;
me.updateConversation(cacheConversation);
RongIMLib.RongIMClient._dataAccessProvider.addMessage(conversationType,targetId,msg,{
onSuccess:function onSuccess(ret){
msg=ret;
msg.messageUId=data.messageUId;
msg.sentTime=data.timestamp;
msg.sentStatus=RongIMLib.SentStatus.SENT;
msg.messageId=data.messageId;
RongIMLib.RongIMClient._dataAccessProvider.updateMessage(msg);
},
onError:function onError(){}});

}
setTimeout(function(){
cacheConversation&&me.updateConversation(cacheConversation);
msg.sentTime=data.timestamp;
msg.messageUId=data.messageUId;
sendCallback.onSuccess(msg);
});
},
onError:function onError(errorCode,_msg){
msg.sentStatus=RongIMLib.SentStatus.FAILED;
if(_msg){
msg.messageUId=_msg.messageUId;
msg.sentTime=_msg.sentTime;
}
if(RongIMLib.RongIMClient.MessageParams[msg.messageType].msgTag.getMessageTag()==3){
RongIMLib.RongIMClient._memoryStore.converStore.latestMessage=msg;
}
RongIMLib.RongIMClient._dataAccessProvider.addMessage(conversationType,targetId,msg,{
onSuccess:function onSuccess(ret){
msg.messageId=ret.messageId;
RongIMLib.RongIMClient._dataAccessProvider.updateMessage(msg);
},
onError:function onError(){}});

setTimeout(function(){
sendCallback.onError(errorCode,msg);
});
}},
null,methodType);
sendCallback.onBefore&&sendCallback.onBefore(RongIMLib.MessageIdHandler.messageId);
msg.messageId=RongIMLib.MessageIdHandler.messageId+"";
};
ServerDataProvider.prototype.setConnectionStatusListener=function(listener){
var watcher={
onChanged:function onChanged(status){
listener.onChanged(status);
RongIMLib.RongUtil.forEach(RongIMLib.RongIMClient.statusListeners,function(watch){
watch(status);
});
}};

if(RongIMLib.RongIMClient.bridge){
RongIMLib.RongIMClient.bridge.setListener(watcher);
}else
{
RongIMLib.RongIMClient._memoryStore.listenerList.push(watcher);
}
};
ServerDataProvider.prototype.setOnReceiveMessageListener=function(listener){
if(RongIMLib.RongIMClient.bridge){
RongIMLib.RongIMClient.bridge.setListener(listener);
}else
{
RongIMLib.RongIMClient._memoryStore.listenerList.push(listener);
}
};
ServerDataProvider.prototype.registerMessageType=function(messageType,objectName,messageTag,messageContent,searchProps){
if(!messageType){
throw new Error("messageType can't be empty,postion -> registerMessageType");
}
if(!objectName){
throw new Error("objectName can't be empty,postion -> registerMessageType");
}
if(Object.prototype.toString.call(messageContent)=="[object Array]"){
var regMsg=RongIMLib.ModelUtil.modleCreate(messageContent,messageType);
RongIMLib.RongIMClient.RegisterMessage[messageType]=regMsg;
}else
if(Object.prototype.toString.call(messageContent)=="[object Function]"||Object.prototype.toString.call(messageContent)=="[object Object]"){
if(!messageContent.encode){
throw new Error("encode method has not realized or messageName is undefined-> registerMessageType");
}
if(!messageContent.decode){
throw new Error("decode method has not realized -> registerMessageType");
}
}else
{
throw new Error("The index of 3 parameter was wrong type  must be object or function or array-> registerMessageType");
}
registerMessageTypeMapping[objectName]=messageType;
};
ServerDataProvider.prototype.registerMessageTypes=function(messages){
var types=[];
var getProtos=function getProtos(proto){
var protos=[];
for(var p in proto){
protos.push(p);
}
return protos;
};
//转换消息为自定义消息参数格式
for(var name in messages){
var message=messages[name];
var proto=message.proto;
var protos=getProtos(proto);
var flag=message.flag||3;
var tag=RongIMLib.MessageTag.getTagByStatus(flag);
flag=new RongIMLib.MessageTag(tag.isCounted,tag.isPersited);
types.push({
type:name,
name:message.name,
flag:flag,
protos:protos});

}
var register=function register(message){
var type=message.type;
var name=message.name;
var flag=message.flag;
var protos=message.protos;
RongIMLib.RongIMClient.registerMessageType(type,name,flag,protos);
};
for(var i=0,len=types.length;i<len;i++){
var message=types[i];
register(message);
}
};
ServerDataProvider.prototype.addConversation=function(conversation,callback){
var isAdd=true;
for(var i=0,len=RongIMLib.RongIMClient._memoryStore.conversationList.length;i<len;i++){
if(RongIMLib.RongIMClient._memoryStore.conversationList[i].conversationType===conversation.conversationType&&RongIMLib.RongIMClient._memoryStore.conversationList[i].targetId===conversation.targetId){
// RongIMClient._memoryStore.conversationList[i] = conversation;
RongIMLib.RongIMClient._memoryStore.conversationList.unshift(RongIMLib.RongIMClient._memoryStore.conversationList.splice(i,1)[0]);
isAdd=false;
break;
}
}
if(isAdd){
RongIMLib.RongIMClient._memoryStore.conversationList.unshift(conversation);
}
callback&&callback.onSuccess(true);
};
ServerDataProvider.prototype.updateConversation=function(conversation){
var conver;
for(var i=0,len=RongIMLib.RongIMClient._memoryStore.conversationList.length;i<len;i++){
var item=RongIMLib.RongIMClient._memoryStore.conversationList[i];
if(conversation.conversationType===item.conversationType&&conversation.targetId===item.targetId){
conversation.conversationTitle&&(item.conversationTitle=conversation.conversationTitle);
conversation.senderUserName&&(item.senderUserName=conversation.senderUserName);
conversation.senderPortraitUri&&(item.senderPortraitUri=conversation.senderPortraitUri);
conversation.latestMessage&&(item.latestMessage=conversation.latestMessage);
conversation.sentStatus&&(item.sentStatus=conversation.sentStatus);
break;
}
}
return conver;
};
ServerDataProvider.prototype.removeConversation=function(conversationType,targetId,callback){
var mod=new RongIMLib.RongIMClient.Protobuf.RelationsInput();
mod.setType(conversationType);
RongIMLib.RongIMClient.bridge.queryMsg(27,RongIMLib.MessageUtil.ArrayForm(mod.toArrayBuffer()),targetId,{
onSuccess:function onSuccess(){
var conversations=RongIMLib.RongIMClient._memoryStore.conversationList;
var len=conversations.length;
for(var i=0;i<len;i++){
if(conversations[i].conversationType==conversationType&&targetId==conversations[i].targetId){
conversations.splice(i,1);
break;
}
}
callback.onSuccess(true);
},onError:function onError(error){
setTimeout(function(){
callback.onError(error);
});
}});

};
ServerDataProvider.prototype.getMessage=function(messageId,callback){
callback.onSuccess(new RongIMLib.Message());
};
ServerDataProvider.prototype.addMessage=function(conversationType,targetId,message,callback){
if(callback){
callback.onSuccess(message);
}
};
ServerDataProvider.prototype.removeMessage=function(conversationType,targetId,messageIds,callback){
RongIMLib.RongIMClient.getInstance().deleteRemoteMessages(conversationType,targetId,messageIds,callback);
};
ServerDataProvider.prototype.removeLocalMessage=function(conversationType,targetId,timestamps,callback){
callback.onSuccess(true);
};
ServerDataProvider.prototype.updateMessage=function(message,callback){
if(callback){
callback.onSuccess(message);
}
};
ServerDataProvider.prototype.clearRemoteHistoryMessages=function(params,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.CleanHisMsgInput();
var conversationType=params.conversationType;
var _topic={
1:'cleanPMsg',
2:'cleanDMsg',
3:'cleanGMsg',
5:'cleanCMsg',
6:'cleanSMsg'};

var topic=_topic[conversationType];
if(!topic){
callback.onError(RongIMLib.ErrorCode.CLEAR_HIS_TYPE_ERROR);
return;
}
var timestamp=params.timestamp;
if(typeof timestamp!='number'){
callback.onError(RongIMLib.ErrorCode.CLEAR_HIS_TIME_ERROR);
return;
}
modules.setDataTime(timestamp);
var targetId=params.targetId;
modules.setTargetId(targetId);
RongIMLib.RongIMClient.bridge.queryMsg(topic,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),targetId,{
onSuccess:function onSuccess(result){
callback.onSuccess(!result);
},onError:function onError(error){
// error 1 历史消息云存储没有开通、传入时间大于服务器时间 清除失败，1 与其他错误码冲突，所以自定义错误码返回
if(error==1){
error=RongIMLib.ErrorCode.CLEAR_HIS_ERROR;
}
setTimeout(function(){
callback.onError(error);
});
}});

};
ServerDataProvider.prototype.clearHistoryMessages=function(params,callback){
this.clearRemoteHistoryMessages(params,callback);
};
// 兼容老版本
ServerDataProvider.prototype.clearMessages=function(conversationType,targetId,callback){
};
ServerDataProvider.prototype.updateMessages=function(conversationType,targetId,key,value,callback){
var me=this;
if(key=="readStatus"){
if(RongIMLib.RongIMClient._memoryStore.conversationList.length>0){
me.getConversationList({
onSuccess:function onSuccess(list){
Array.forEach(list,function(conver){
if(conver.conversationType==conversationType&&conver.targetId==targetId){
conver.unreadMessageCount=0;
}
});
},
onError:function onError(errorCode){
setTimeout(function(){
callback.onError(errorCode);
});
}},
null);
}
}
setTimeout(function(){
callback.onSuccess(true);
});
};
ServerDataProvider.prototype.getConversation=function(conversationType,targetId,callback){
var conver=null;
for(var i=0,len=RongIMLib.RongIMClient._memoryStore.conversationList.length;i<len;i++){
if(RongIMLib.RongIMClient._memoryStore.conversationList[i].conversationType==conversationType&&RongIMLib.RongIMClient._memoryStore.conversationList[i].targetId==targetId){
conver=RongIMLib.RongIMClient._memoryStore.conversationList[i];
if(RongIMLib.RongUtil.supportLocalStorage()){
var count=RongIMLib.RongIMClient._storageProvider.getItem("cu"+RongIMLib.Bridge._client.userId+conversationType+targetId);
if(conver.unreadMessageCount==0){
conver.unreadMessageCount=Number(count);
}
}
}
}
setTimeout(function(){
callback&&callback.onSuccess(conver);
});
return conver;
};
ServerDataProvider.prototype.filterConversations=function(types,list){
var conversaions=[];
RongIMLib.RongUtil.forEach(types,function(type){
RongIMLib.RongUtil.forEach(list,function(conversation){
if(conversation.conversationType==type){
conversaions.push(conversation);
}
});
});
return conversaions;
};
ServerDataProvider.prototype.getConversationList=function(callback,conversationTypes,count,isHidden){
var that=this;
var isSync=RongIMLib.RongIMClient._memoryStore.isSyncRemoteConverList;
var list=RongIMLib.RongIMClient._memoryStore.conversationList;
var isLocalInclude=list.length>count;
if(!isSync&&isLocalInclude){
setTimeout(function(){
var localList=list.slice(0,count);
if(conversationTypes){
localList=that.filterConversations(conversationTypes,localList);
}
callback.onSuccess(localList);
});
return;
}
RongIMLib.RongIMClient.getInstance().getRemoteConversationList({
onSuccess:function onSuccess(list){
if(RongIMLib.RongUtil.supportLocalStorage()){
Array.forEach(RongIMLib.RongIMClient._memoryStore.conversationList,function(item){
var count=RongIMLib.RongIMClient._storageProvider.getItem("cu"+RongIMLib.Bridge._client.userId+item.conversationType+item.targetId);
if(item.unreadMessageCount==0){
item.unreadMessageCount=Number(count);
}
});
}
RongIMLib.RongIMClient._memoryStore.isSyncRemoteConverList=false;
setTimeout(function(){
callback.onSuccess(list);
});
},
onError:function onError(errorcode){
setTimeout(function(){
callback.onError(errorcode);
});
}},
conversationTypes,count,isHidden);
};
ServerDataProvider.prototype.clearCache=function(){
var memoryStore=RongIMLib.RongIMClient._memoryStore||{};
memoryStore.conversationList=[];
memoryStore.isSyncRemoteConverList=true;
};
ServerDataProvider.prototype.clearConversations=function(conversationTypes,callback){
Array.forEach(conversationTypes,function(conversationType){
Array.forEach(RongIMLib.RongIMClient._memoryStore.conversationList,function(conver){
if(conversationType==conver.conversationType){
RongIMLib.RongIMClient.getInstance().removeConversation(conver.conversationType,conver.targetId,{onSuccess:function onSuccess(){},onError:function onError(){}});
}
});
});
setTimeout(function(){
callback.onSuccess(true);
});
};
ServerDataProvider.prototype.setMessageContent=function(messageId,content,objectname){
};
;
ServerDataProvider.prototype.getHistoryMessages=function(conversationType,targetId,timestamp,count,callback,objectname,order){
var config={
objectname:objectname,
order:order};

RongIMLib.RongIMClient.getInstance().getRemoteHistoryMessages(conversationType,targetId,timestamp,count,callback,config);
};
ServerDataProvider.prototype.getTotalUnreadCount=function(callback,conversationTypes){
var count=0;
var storageProvider=RongIMLib.RongIMClient._storageProvider;
if(conversationTypes){
RongIMLib.RongUtil.forEach(conversationTypes,function(type){
var unreadKeys=storageProvider.getItemKeyList("cu"+RongIMLib.Bridge._client.userId+type);
RongIMLib.RongUtil.forEach(unreadKeys,function(key){
var unread=storageProvider.getItem(key);
var unreadCount=Number(unread)||0;
count+=unreadCount;
});
});
}else
{
var unreadKeys=storageProvider.getItemKeyList("cu"+RongIMLib.Bridge._client.userId);
RongIMLib.RongUtil.forEach(unreadKeys,function(key){
var unread=storageProvider.getItem(key);
var unreadCount=Number(unread)||0;
count+=unreadCount;
});
}
callback.onSuccess(count);
};
ServerDataProvider.prototype.getConversationUnreadCount=function(conversationTypes,callback){
var count=0;
Array.forEach(conversationTypes,function(converType){
Array.forEach(RongIMLib.RongIMClient._memoryStore.conversationList,function(conver){
if(conver.conversationType==converType){
count+=conver.unreadMessageCount;
}
});
});
setTimeout(function(){
callback.onSuccess(count);
});
};
//由于 Web 端未读消息数按会话统计，撤回消息会导致未读数不准确，提供设置未读数接口，桌面版不实现此方法
ServerDataProvider.prototype.setUnreadCount=function(conversationType,targetId,count){
var storageProvider=RongIMLib.RongIMClient._storageProvider;
var key="cu"+RongIMLib.Bridge._client.userId+conversationType+targetId;
storageProvider.setItem(key,count);
};
ServerDataProvider.prototype.getUnreadCount=function(conversationType,targetId,callback){
var key="cu"+RongIMLib.Bridge._client.userId+conversationType+targetId;
var unread=RongIMLib.RongIMClient._storageProvider.getItem(key);
var unreadCount=Number(unread);
setTimeout(function(){
callback.onSuccess(unreadCount||0);
});
};
ServerDataProvider.prototype.cleanMentioneds=function(conver){
if(conver){
conver.mentionedMsg=null;
var targetId=conver.targetId;
var conversationType=conver.conversationType;
var mentioneds=RongIMLib.RongIMClient._storageProvider.getItem("mentioneds_"+RongIMLib.Bridge._client.userId+'_'+conversationType+'_'+targetId);
if(mentioneds){
var info=JSON.parse(mentioneds);
delete info[conversationType+"_"+targetId];
if(!RongIMLib.MessageUtil.isEmpty(info)){
RongIMLib.RongIMClient._storageProvider.setItem("mentioneds_"+RongIMLib.Bridge._client.userId+'_'+conversationType+'_'+targetId,JSON.stringify(info));
}else
{
RongIMLib.RongIMClient._storageProvider.removeItem("mentioneds_"+RongIMLib.Bridge._client.userId+'_'+conversationType+'_'+targetId);
}
}
}
};
ServerDataProvider.prototype.clearUnreadCountByTimestamp=function(conversationType,targetId,timestamp,callback){
setTimeout(function(){
callback.onSuccess(true);
});
};
ServerDataProvider.prototype.clearUnreadCount=function(conversationType,targetId,callback){
var me=this;
RongIMLib.RongIMClient._storageProvider.removeItem("cu"+RongIMLib.Bridge._client.userId+conversationType+targetId);
this.getConversation(conversationType,targetId,{
onSuccess:function onSuccess(conver){
if(conver){
conver.unreadMessageCount=0;
me.cleanMentioneds(conver);
}
setTimeout(function(){
callback.onSuccess(true);
});
},
onError:function onError(error){
setTimeout(function(){
callback.onError(error);
});
}});

};
ServerDataProvider.prototype.clearTotalUnreadCount=function(callback){
var list=RongIMLib.RongIMClient._memoryStore.conversationList;
var me=this;
if(list){
// 清除 mentioneds、清除 list 中的 unreadMessageCount
for(var i=0;i<list.length;i++){
var conver=list[i];
if(conver){
conver.unreadMessageCount=0;
me.cleanMentioneds(conver);
}
}
}
// 1. 获取所有 key 2. 清除
var unreadKeys=RongIMLib.RongIMClient._storageProvider.getItemKeyList("cu"+RongIMLib.Bridge._client.userId);
RongIMLib.RongUtil.forEach(unreadKeys,function(key){
RongIMLib.RongIMClient._storageProvider.removeItem(key);
});
setTimeout(function(){
callback.onSuccess(true);
});
};
ServerDataProvider.prototype.setConversationToTop=function(conversationType,targetId,isTop,callback){
var me=this;
this.getConversation(conversationType,targetId,{
onSuccess:function onSuccess(conver){
conver.isTop=isTop;
me.addConversation(conver,callback);
setTimeout(function(){
callback.onSuccess(true);
});
},
onError:function onError(error){
setTimeout(function(){
callback.onError(error);
});
}});

};
ServerDataProvider.prototype.getConversationNotificationStatus=function(params,callback){
var targetId=params.targetId;
var conversationType=params.conversationType;
var notification=RongIMLib.RongIMClient._memoryStore.notification;
var getKey=function getKey(){
return conversationType+'_'+targetId;
};
var key=getKey();
var status=notification[key];
if(typeof status=='number'){
callback.onSuccess(status);
return;
}
var topics={
1:'qryPPush',
3:'qryDPush'};

var topic=topics[conversationType];
if(!topic){
var error=8001;
callback.onError(error);
return;
}
var modules=new RongIMLib.RongIMClient.Protobuf.BlockPushInput();
modules.setBlockeeId(targetId);
var userId=RongIMLib.Bridge._client.userId;
var success=function success(status){
notification[key]=status;
setTimeout(function(){
callback.onSuccess(status);
});
};
RongIMLib.RongIMClient.bridge.queryMsg(topic,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),userId,{
onSuccess:function onSuccess(status){
success(status);
},onError:function onError(e){
if(e==1){
success(e);
}else
{
setTimeout(function(){
callback.onError(e);
});
}
}});

};
ServerDataProvider.prototype.setConversationNotificationStatus=function(params,callback){
var conversationType=params.conversationType;
var targetId=params.targetId;
var status=params.status;
var getKey=function getKey(){
return conversationType+'_'+status;
};
var topics={
'1_1':'blkPPush',
'3_1':'blkDPush',
'1_0':'unblkPPush',
'3_0':'unblkDPush'};

var key=getKey();
var notification=RongIMLib.RongIMClient._memoryStore.notification;
notification[key]=status;
var topic=topics[key];
if(!topic){
var error=8001;
setTimeout(function(){
callback.onError(error);
});
return;
}
var modules=new RongIMLib.RongIMClient.Protobuf.BlockPushInput();
modules.setBlockeeId(targetId);
var userId=RongIMLib.Bridge._client.userId;
RongIMLib.RongIMClient.bridge.queryMsg(topic,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),userId,{
onSuccess:function onSuccess(status){
setTimeout(function(){
callback.onSuccess(status);
});
},onError:function onError(e){
setTimeout(function(){
callback.onError(e);
});
}});

};
ServerDataProvider.prototype.getUserStatus=function(userId,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.GetUserStatusInput();
userId=RongIMLib.Bridge._client.userId;
RongIMLib.RongIMClient.bridge.queryMsg(35,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),userId,{
onSuccess:function onSuccess(status){
status=RongIMLib.RongInnerTools.convertUserStatus(status);
setTimeout(function(){
callback.onSuccess(status);
});
},onError:function onError(e){
setTimeout(function(){
callback.onError(e);
});
}},
'GetUserStatusOutput');
// callback.onSuccess(new UserStatus());
};
ServerDataProvider.prototype.setUserStatus=function(status,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.SetUserStatusInput();
var userId=RongIMLib.Bridge._client.userId;
if(status){
modules.setStatus(status);
}
RongIMLib.RongIMClient.bridge.queryMsg(36,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),userId,{
onSuccess:function onSuccess(status){
setTimeout(function(){
callback.onSuccess(true);
});
},onError:function onError(e){
setTimeout(function(){
callback.onError(e);
});
}},
'SetUserStatusOutput');
};
ServerDataProvider.prototype.subscribeUserStatus=function(userIds,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.SubUserStatusInput();
var userId=RongIMLib.Bridge._client.userId;
modules.setUserid(userIds);
RongIMLib.RongIMClient.bridge.queryMsg(37,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),userId,{
onSuccess:function onSuccess(status){
setTimeout(function(){
callback&&callback.onSuccess(true);
});
},onError:function onError(e){
setTimeout(function(){
callback&&callback.onError(e);
});
}},
'SubUserStatusOutput');
};
ServerDataProvider.prototype.setUserStatusListener=function(params,callback){
RongIMLib.RongIMClient.userStatusListener=callback;
var userIds=params.userIds||[];
if(userIds.length){
RongIMLib.RongIMClient._dataAccessProvider.subscribeUserStatus(userIds);
}
};
ServerDataProvider.prototype.clearListeners=function(){
};
ServerDataProvider.prototype.setServerInfo=function(info){
};
ServerDataProvider.prototype.getUnreadMentionedMessages=function(conversationType,targetId){
return null;
};
ServerDataProvider.prototype.setConversationHidden=function(conversationType,targetId,isHidden){
};
ServerDataProvider.prototype.setMessageExtra=function(messageId,value,callback){
setTimeout(function(){
callback.onSuccess(true);
});
};
ServerDataProvider.prototype.setMessageReceivedStatus=function(messageId,receivedStatus,callback){
setTimeout(function(){
callback.onSuccess(true);
});
};
ServerDataProvider.prototype.setMessageSentStatus=function(messageId,sentStatus,callback){
setTimeout(function(){
callback.onSuccess(true);
});
};
ServerDataProvider.prototype.getAllConversations=function(callback){
setTimeout(function(){
callback.onSuccess([]);
});
};
ServerDataProvider.prototype.getConversationByContent=function(keywords,callback){
setTimeout(function(){
callback.onSuccess([]);
});
};
ServerDataProvider.prototype.getMessagesFromConversation=function(conversationType,targetId,keywords,callback){
setTimeout(function(){
callback.onSuccess([]);
});
};
ServerDataProvider.prototype.searchConversationByContent=function(keyword,callback,conversationTypes){
setTimeout(function(){
callback.onSuccess([]);
});
};
ServerDataProvider.prototype.searchMessageByContent=function(conversationType,targetId,keyword,timestamp,count,total,callback){
setTimeout(function(){
callback.onSuccess([]);
});
};
ServerDataProvider.prototype.getDelaTime=function(){
return RongIMLib.RongIMClient._memoryStore.deltaTime;
};
ServerDataProvider.prototype.getCurrentConnectionStatus=function(){
var client=RongIMLib.Bridge._client||{};
var channel=client.channel||{};
var status=RongIMLib.ConnectionStatus.CONNECTION_CLOSED;
if(typeof channel.connectionStatus=='number'){
status=channel.connectionStatus;
}
return status;
};
ServerDataProvider.prototype.getAgoraDynamicKey=function(engineType,channelName,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.VoipDynamicInput();
modules.setEngineType(engineType);
modules.setChannelName(channelName);
RongIMLib.RongIMClient.bridge.queryMsg(32,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),RongIMLib.Bridge._client.userId,{
onSuccess:function onSuccess(result){
setTimeout(function(){
callback.onSuccess(result);
});
},
onError:function onError(errorCode){
setTimeout(function(){
callback.onError(errorCode);
});
}},
"VoipDynamicOutput");
};
ServerDataProvider.prototype.setDeviceInfo=function(deviceId){
};
ServerDataProvider.prototype.setEnvironment=function(isPrivate){
};
ServerDataProvider.prototype.clearData=function(){
return true;
};
ServerDataProvider.prototype.getPublicServiceProfile=function(publicServiceType,publicServiceId,callback){
var profile=RongIMLib.RongIMClient._memoryStore.publicServiceMap.get(publicServiceType,publicServiceId);
setTimeout(function(){
callback.onSuccess(profile);
});
};
ServerDataProvider.prototype.getRemotePublicServiceList=function(callback,pullMessageTime){
if(RongIMLib.RongIMClient._memoryStore.depend.openMp){
var modules=new RongIMLib.RongIMClient.Protobuf.PullMpInput(),self=this;
if(!pullMessageTime){
modules.setTime(0);
}else
{
modules.setTime(pullMessageTime);
}
modules.setMpid("");
RongIMLib.RongIMClient.bridge.queryMsg(28,RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),RongIMLib.Bridge._client.userId,{
onSuccess:function onSuccess(data){
//TODO 找出最大时间
// self.lastReadTime.set(conversationType + targetId, MessageUtil.int64ToTimestamp(data.syncTime));
RongIMLib.RongIMClient._memoryStore.publicServiceMap.publicServiceList.length=0;
RongIMLib.RongIMClient._memoryStore.publicServiceMap.publicServiceList=data;
setTimeout(function(){
callback&&callback.onSuccess(data);
});
},
onError:function onError(errorCode){
setTimeout(function(){
callback&&callback.onError(errorCode);
});
}},
"PullMpOutput");
}
};
ServerDataProvider.prototype.getRTCUserInfoList=function(room,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.RtcQueryListInput();
// 1 是正序,2是倒序
modules.setOrder(2);
RongIMLib.RongIMClient.bridge.queryMsg("rtcUData",RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),room.id,{
onSuccess:function onSuccess(result){
var users={};
var list=result.list;
RongIMLib.RongUtil.forEach(list,function(item){
var userId=item.userId;
var tmpData={};
RongIMLib.RongUtil.forEach(item.userData,function(data){
var key=data.key;
var value=data.value;
tmpData[key]=value;
});
users[userId]=tmpData;
});
callback.onSuccess(users);
},
onError:function onError(errorCode){
callback.onError(errorCode);
}},
"RtcUserListOutput");
};
ServerDataProvider.prototype.getRTCUserList=function(room,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.RtcQueryListInput();
modules.setOrder(2);
RongIMLib.RongIMClient.bridge.queryMsg("rtcUList",RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),room.id,{
onSuccess:function onSuccess(result){
callback.onSuccess({
users:result.list});

},
onError:function onError(errorCode){
callback.onError(errorCode);
}},
"RtcUserListOutput");
};
ServerDataProvider.prototype.setRTCUserInfo=function(room,info,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.RtcValueInfo();
modules.setKey(info.key);
modules.setValue(info.value);
RongIMLib.RongIMClient.bridge.queryMsg("rtcUPut",RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),room.id,{
onSuccess:function onSuccess(){
callback.onSuccess(true);
},
onError:function onError(errorCode){
callback.onError(errorCode);
}});

};
ServerDataProvider.prototype.removeRTCUserInfo=function(room,info,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.RtcKeyDeleteInput();
var keys=info.keys||[];
if(!RongIMLib.RongUtil.isArray(keys)){
keys=[keys];
}
modules.setKey(keys);
RongIMLib.RongIMClient.bridge.queryMsg("rtcUDel",RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),room.id,{
onSuccess:function onSuccess(){
callback.onSuccess(true);
},
onError:function onError(errorCode){
callback.onError(errorCode);
}});

};
ServerDataProvider.prototype.getRTCRoomInfo=function(room,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.RtcQueryListInput();
modules.setOrder(2);
RongIMLib.RongIMClient.bridge.queryMsg("rtcRInfo",RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),room.id,{
onSuccess:function onSuccess(result){
var room={
id:result.roomId,
total:result.userCount};

RongIMLib.RongUtil.forEach(result.roomData,function(data){
room[data.key]=data.value;
});
callback.onSuccess(room);
},
onError:function onError(errorCode){
callback.onError(errorCode);
}},
"RtcRoomInfoOutput");
};
ServerDataProvider.prototype.setRTCRoomInfo=function(room,info,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.RtcValueInfo();
modules.setKey(info.key);
modules.setValue(info.value);
RongIMLib.RongIMClient.bridge.queryMsg("rtcRPut",RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),room.id,{
onSuccess:function onSuccess(){
callback.onSuccess(true);
},
onError:function onError(errorCode){
callback.onError(errorCode);
}});

};
ServerDataProvider.prototype.removeRTCRoomInfo=function(room,info,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.RtcKeyDeleteInput();
var keys=info.keys||[];
if(!RongIMLib.RongUtil.isArray(keys)){
keys=[keys];
}
modules.setKey(keys);
RongIMLib.RongIMClient.bridge.queryMsg("rtcRDel",RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),room.id,{
onSuccess:function onSuccess(){
callback.onSuccess(true);
},
onError:function onError(errorCode){
callback.onError(errorCode);
}});

};
ServerDataProvider.prototype.joinRTCRoom=function(room,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.RtcInput();
;
RongIMLib.RongIMClient.bridge.queryMsg("rtcRJoin_data",RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),room.id,{
onSuccess:function onSuccess(result){
var users={};
var list=result.list,token=result.token;
RongIMLib.RongUtil.forEach(list,function(item){
var userId=item.userId;
var tmpData={};
RongIMLib.RongUtil.forEach(item.userData,function(data){
var key=data.key;
var value=data.value;
tmpData[key]=value;
});
users[userId]=tmpData;
});
callback.onSuccess({
users:users,
token:token});

},
onError:function onError(errorCode){
callback.onError(errorCode);
}},
"RtcUserListOutput");
};
ServerDataProvider.prototype.quitRTCRoom=function(room,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.SetUserStatusInput();
RongIMLib.RongIMClient.bridge.queryMsg("rtcRExit",RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),room.id,{
onSuccess:function onSuccess(){
callback.onSuccess(true);
},
onError:function onError(errorCode){
callback.onError(errorCode);
}});

};
ServerDataProvider.prototype.RTCPing=function(room,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.RtcInput();
RongIMLib.RongIMClient.bridge.queryMsg("rtcPing",RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),room.id,callback);
};
ServerDataProvider.prototype.setRTCData=function(roomId,key,value,isInner,apiType,callback,message){
var modules=new RongIMLib.RongIMClient.Protobuf.RtcSetDataInput();
modules.setInterior(isInner);
modules.setTarget(apiType);
modules.setKey(key);
modules.setValue(value);
message=message||{};
var name=message.name;
var content=message.content;
if(name){
modules.setObjectName(name);
}
if(content){
if(!RongIMLib.RongUtil.isString(content)){
content=JSON.stringify(content);
}
modules.setContent(content);
}
RongIMLib.RongIMClient.bridge.queryMsg("rtcSetData",RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),roomId,callback,"RtcOutput");
};
ServerDataProvider.prototype.getRTCData=function(roomId,keys,isInner,apiType,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.RtcDataInput();
modules.setInterior(isInner);
modules.setTarget(apiType);
modules.setKey(keys);
RongIMLib.RongIMClient.bridge.queryMsg("rtcQryData",RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),roomId,{
onSuccess:function onSuccess(result){
var props={};
var list=result.outInfo;
RongIMLib.RongUtil.forEach(list,function(item){
props[item.key]=item.value;
});
callback.onSuccess(props);
},
onError:callback.onError},
"RtcQryOutput");
};
ServerDataProvider.prototype.removeRTCData=function(roomId,keys,isInner,apiType,callback,message){
var modules=new RongIMLib.RongIMClient.Protobuf.RtcDataInput();
modules.setInterior(isInner);
modules.setTarget(apiType);
modules.setKey(keys);
message=message||{};
var name=message.name;
var content=message.content;
if(name){
modules.setObjectName(name);
}
if(content){
if(!RongIMLib.RongUtil.isString(content)){
content=JSON.stringify(content);
}
modules.setContent(content);
}
RongIMLib.RongIMClient.bridge.queryMsg("rtcDelData",RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),roomId,callback,"RtcOutput");
};
ServerDataProvider.prototype.setRTCUserData=function(roomId,key,value,isInner,callback,message){
this.setRTCData(roomId,key,value,isInner,RongIMLib.RTCAPIType.PERSON,callback,message);
};
ServerDataProvider.prototype.getRTCUserData=function(roomId,keys,isInner,callback,message){
this.getRTCData(roomId,keys,isInner,RongIMLib.RTCAPIType.PERSON,callback);
};
ServerDataProvider.prototype.removeRTCUserData=function(roomId,keys,isInner,callback,message){
this.removeRTCData(roomId,keys,isInner,RongIMLib.RTCAPIType.PERSON,callback,message);
};
ServerDataProvider.prototype.setRTCRoomData=function(roomId,key,value,isInner,callback,message){
this.setRTCData(roomId,key,value,isInner,RongIMLib.RTCAPIType.ROOM,callback,message);
};
ServerDataProvider.prototype.getRTCRoomData=function(roomId,keys,isInner,callback,message){
this.getRTCData(roomId,keys,isInner,RongIMLib.RTCAPIType.ROOM,callback);
};
ServerDataProvider.prototype.removeRTCRoomData=function(roomId,keys,isInner,callback,message){
this.removeRTCData(roomId,keys,isInner,RongIMLib.RTCAPIType.ROOM,callback,message);
};
ServerDataProvider.prototype.getNavi=function(){
var navi=RongIMLib.RongIMClient._storageProvider.getItem("fullnavi")||"{}";
return JSON.parse(navi);
};
ServerDataProvider.prototype.getRTCToken=function(room,callback){
var modules=new RongIMLib.RongIMClient.Protobuf.RtcInput();
RongIMLib.RongIMClient.bridge.queryMsg("rtcToken",RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()),room.id,{
onSuccess:function onSuccess(result){
callback.onSuccess(result);
},
onError:function onError(errorCode){
callback.onError(errorCode);
}},
"RtcTokenOutput");
};
return ServerDataProvider;
}();
RongIMLib.ServerDataProvider=ServerDataProvider;
})(RongIMLib||(RongIMLib={}));
var RongIMLib;
(function(RongIMLib){
var VCDataProvider=function(){
function VCDataProvider(addon){
// C++ 需要的 SDK 版本号
this.version='2.8.27';
this.userId="";
this.useConsole=false;
this.appKey="";
this.token="";
this.addon=addon;
}
VCDataProvider.prototype.init=function(appKey,config){
this.appKey=appKey;
this.useConsole&&console.log("init");
config=config||{};
config.version=this.version;
var sdkInfo=this.addon.initWithAppkey(appKey,config.dbPath,config);
if(sdkInfo){
sdkInfo=JSON.parse(sdkInfo);
}
// 0 不存不计数  1 只存不计数 3 存且计数
this.addon.registerMessageType("RC:VcMsg",3);
this.addon.registerMessageType("RC:ImgTextMsg",3);
this.addon.registerMessageType("RC:FileMsg",3);
this.addon.registerMessageType("RC:LBSMsg",3);
this.addon.registerMessageType("RC:PSImgTxtMsg",3);
this.addon.registerMessageType("RC:PSMultiImgTxtMsg",3);
this.addon.registerMessageType("RCJrmf:RpMsg",3);
this.addon.registerMessageType("RCJrmf:RpOpendMsg",1);
this.addon.registerMessageType("RC:GrpNtf",1);
this.addon.registerMessageType("RC:DizNtf",0);
this.addon.registerMessageType("RC:InfoNtf",0);
this.addon.registerMessageType("RC:ContactNtf",0);
this.addon.registerMessageType("RC:ProfileNtf",0);
this.addon.registerMessageType("RC:CmdNtf",0);
this.addon.registerMessageType("RC:CmdMsg",0);
this.addon.registerMessageType("RC:TypSts",0);
this.addon.registerMessageType("RC:CsChaR",0);
this.addon.registerMessageType("RC:CsHsR",0);
this.addon.registerMessageType("RC:CsEnd",0);
this.addon.registerMessageType("RC:CsSp",0);
this.addon.registerMessageType("RC:CsUpdate",0);
this.addon.registerMessageType("RC:CsContact",0);
this.addon.registerMessageType("RC:ReadNtf",0);
this.addon.registerMessageType("RC:VCAccept",0);
this.addon.registerMessageType("RC:VCRinging",0);
this.addon.registerMessageType("RC:VCSummary",0);
this.addon.registerMessageType("RC:VCHangup",0);
this.addon.registerMessageType("RC:VCInvite",0);
this.addon.registerMessageType("RC:VCModifyMedia",0);
this.addon.registerMessageType("RC:VCModifyMem",0);
this.addon.registerMessageType("RC:PSCmd",0);
this.addon.registerMessageType("RC:RcCmd",0);
this.addon.registerMessageType("RC:SRSMsg",0);
this.addon.registerMessageType("RC:RRReqMsg",0);
this.addon.registerMessageType("RC:RRRspMsg",0);
return sdkInfo;
};
VCDataProvider.prototype.connect=function(token,callback,userId,serverConf){
this.useConsole&&console.log("connect");
this.userId=userId;
this.connectCallback=callback;
RongIMLib.Bridge._client={
userId:userId};

serverConf=serverConf||{};
var openmp=!!serverConf.openMp;
var openus=!!serverConf.openUS;
if(serverConf.type){
this.addon.setEnvironment(true);
}
this.addon.connectWithToken(token,userId,serverConf.serverList,openmp,openus);
};
VCDataProvider.prototype.setServerInfo=function(info){
'setServerInfo'in this.addon&&this.addon.setServerInfo(info.navi);
};
VCDataProvider.prototype.logout=function(){
this.useConsole&&console.log("logout");
this.disconnect();
};
VCDataProvider.prototype.disconnect=function(){
this.useConsole&&console.log("disconnect");
this.addon.disconnect(true);
};
VCDataProvider.prototype.clearListeners=function(){
this.addon.setOnReceiveStatusListener();
this.addon.setConnectionStatusListener();
this.addon.setOnReceiveMessageListener();
};
VCDataProvider.prototype.clearData=function(){
this.useConsole&&console.log("clearData");
return this.addon.clearData();
};
VCDataProvider.prototype.setConnectionStatusListener=function(listener){
var me=this;
/**
            ConnectionStatus_TokenIncorrect = 31004,
            ConnectionStatus_Connected = 0,
            ConnectionStatus_KickedOff = 6,	// 其他设备登录
            ConnectionStatus_Connecting = 10,// 连接中
            ConnectionStatus_SignUp = 12, // 未登录
            ConnectionStatus_NetworkUnavailable = 1, // 连接断开
            ConnectionStatus_ServerInvalid = 8, // 断开
            ConnectionStatus_ValidateFailure = 9,//断开
            ConnectionStatus_Unconnected = 11,//断开
            ConnectionStatus_DisconnExecption = 31011 //断开
            RC_NAVI_MALLOC_ERROR   = 30000,//断开
            RC_NAVI_NET_UNAVAILABLE= 30002,//断开
            RC_NAVI_SEND_FAIL      = 30004,//断开
            RC_NAVI_REQ_TIMEOUT    = 30005,//断开
            RC_NAVI_RECV_FAIL      = 30006,//断开
            RC_NAVI_RESOURCE_ERROR = 30007,//断开
            RC_NAVI_NODE_NOT_FOUND = 30008,//断开
            RC_NAVI_DNS_ERROR      = 30009,//断开
            */
me.connectListener=listener;
this.useConsole&&console.log("setConnectionStatusListener");
me.addon&&me.addon.setConnectionStatusListener(function(result){
switch(result){
case 10:
setTimeout(function(){
listener.onChanged(RongIMLib.ConnectionStatus.CONNECTING);
});
break;
case 31004:
setTimeout(function(){
me.connectCallback.onTokenIncorrect();
});
break;
case 1:
case 8:
case 9:
case 11:
case 12:
case 31011:
case 30000:
case 30002:
setTimeout(function(){
listener.onChanged(RongIMLib.ConnectionStatus.DISCONNECTED);
});
break;
case 0:
case 33005:
setTimeout(function(){
me.connectCallback.onSuccess(me.userId);
listener.onChanged(RongIMLib.ConnectionStatus.CONNECTED);
});
break;
case 6:
setTimeout(function(){
listener.onChanged(RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT);
});
break;
default:
setTimeout(function(){
listener.onChanged(result);
});
break;}

});
};
VCDataProvider.prototype.setOnReceiveMessageListener=function(listener){
var me=this,localCount=0;
me.messageListener=listener;
this.useConsole&&console.log("setOnReceiveMessageListener");
me.addon&&me.addon.setOnReceiveMessageListener(function(result,leftCount,offline,hasMore){
var message=me.buildMessage(result);
message.offLineMessage=offline;
setTimeout(function(){
var voipMsgTypes=['AcceptMessage','RingingMessage','HungupMessage','InviteMessage','MediaModifyMessage','MemberModifyMessage'];
var isVoIPMsg=voipMsgTypes.indexOf(message.messageType)>-1;
if(isVoIPMsg){
RongIMLib.RongIMClient._voipProvider&&RongIMLib.RongIMClient._voipProvider.onReceived(message);
}else
{
listener.onReceived(message,leftCount,hasMore);
}
});
});
};
VCDataProvider.prototype.sendTypingStatusMessage=function(conversationType,targetId,messageName,sendCallback){
var me=this;
this.useConsole&&console.log("sendTypingStatusMessage");
if(messageName in RongIMLib.RongIMClient.MessageParams){
me.sendMessage(conversationType,targetId,RongIMLib.TypingStatusMessage.obtain(RongIMLib.RongIMClient.MessageParams[messageName].objectName,""),{
onSuccess:function onSuccess(){
setTimeout(function(){
sendCallback.onSuccess();
});
},
onError:function onError(errorCode){
setTimeout(function(){
sendCallback.onError(errorCode,null);
});
},
onBefore:function onBefore(){}});

}
};
VCDataProvider.prototype.setMessageStatus=function(conversationType,targetId,timestamp,status,callback){
this.addon.updateMessageReceiptStatus(conversationType,targetId,timestamp);
callback.onSuccess(true);
};
VCDataProvider.prototype.sendTextMessage=function(conversationType,targetId,content,sendMessageCallback){
var msgContent=RongIMLib.TextMessage.obtain(content);
this.useConsole&&console.log("sendTextMessage");
this.sendMessage(conversationType,targetId,msgContent,sendMessageCallback);
};
VCDataProvider.prototype.getRemoteHistoryMessages=function(conversationType,targetId,timestamp,count,callback,config){
try{
var me=this;
me.useConsole&&console.log("getRemoteHistoryMessages");
me.addon.getRemoteHistoryMessages(conversationType,targetId,timestamp?timestamp:0,count,function(ret,hasMore){
var list=ret?JSON.parse(ret).list:[],msgs=[];
list.reverse();
for(var i=0,len=list.length;i<len;i++){
var message=me.buildMessage(list[i].obj);
message.sentStatus=RongIMLib.SentStatus.READ;
msgs[i]=message;
}
callback.onSuccess(msgs,hasMore?true:false);
},function(errorCode){
callback.onError(errorCode);
});
}
catch(e){
callback.onError(e);
}
};
VCDataProvider.prototype.getRemoteConversationList=function(callback,conversationTypes,count,isGetHiddenConvers){
try{
this.useConsole&&console.log("getRemoteConversationList");
var converTypes=conversationTypes||[1,2,3,4,5,6,7,8];
var result=this.addon.getConversationList(converTypes);
var list=JSON.parse(result).list,convers=[],me=this,index=0;
list.reverse();
isGetHiddenConvers=typeof isGetHiddenConvers==='boolean'?isGetHiddenConvers:false;
for(var i=0,len_1=list.length;i<len_1;i++){
var tmpObj=list[i].obj,obj=JSON.parse(tmpObj);
if(obj!=""){
if(obj.isHidden==1&&isGetHiddenConvers){
continue;
}
convers[index]=me.buildConversation(tmpObj);
index++;
}
}
convers.reverse();
var len=convers.length;
count=count||len;
if(len>count){
convers.length=count;
}
callback.onSuccess(convers);
}
catch(e){
callback.onError(e);
}
};
VCDataProvider.prototype.removeConversation=function(conversationType,targetId,callback){
try{
this.useConsole&&console.log("removeConversation");
this.addon.removeConversation(conversationType,targetId);
var conversations=RongIMLib.RongIMClient._memoryStore.conversationList;
var len=conversations.length;
for(var i=0;i<len;i++){
if(conversations[i].conversationType==conversationType&&targetId==conversations[i].targetId){
conversations.splice(i,1);
break;
}
}
callback.onSuccess(true);
}
catch(e){
callback.onError(e);
}
};
VCDataProvider.prototype.joinChatRoom=function(chatRoomId,messageCount,callback){
this.useConsole&&console.log("joinChatRoom");
this.addon.joinChatRoom(chatRoomId,messageCount,function(){
callback.onSuccess();
},function(error){
callback.onError(error);
});
};
VCDataProvider.prototype.quitChatRoom=function(chatRoomId,callback){
this.useConsole&&console.log("quitChatRoom");
this.addon.quitChatRoom(chatRoomId,function(){
callback.onSuccess();
},function(error){
callback.onError(error);
});
};
VCDataProvider.prototype.addToBlacklist=function(userId,callback){
this.useConsole&&console.log("addToBlacklist");
this.addon.addToBlacklist(userId,function(){
callback.onSuccess();
},function(error){
callback.onError(error);
});
};
VCDataProvider.prototype.getBlacklist=function(callback){
this.useConsole&&console.log("getBlacklist");
this.addon.getBlacklist(function(blacklistors){
callback.onSuccess(blacklistors);
},function(error){
callback.onError(error);
});
};
VCDataProvider.prototype.getBlacklistStatus=function(userId,callback){
this.useConsole&&console.log("getBlacklistStatus");
this.addon.getBlacklistStatus(userId,function(result){
callback.onSuccess(result);
},function(error){
callback.onError(error);
});
};
VCDataProvider.prototype.removeFromBlacklist=function(userId,callback){
this.useConsole&&console.log("removeFromBlacklist");
this.addon.removeFromBlacklist(userId,function(){
callback.onSuccess();
},function(error){
callback.onError(error);
});
};
VCDataProvider.prototype.sendMessage=function(conversationType,targetId,messageContent,sendCallback,mentiondMsg,pushText,appData,methodType,params){
var me=this,users=[];
me.useConsole&&console.log("sendMessage");
params=params||{};
var isGroup=conversationType==RongIMLib.ConversationType.DISCUSSION||conversationType==RongIMLib.ConversationType.GROUP;
if(isGroup&&messageContent.messageName==RongIMLib.RongIMClient.MessageType["ReadReceiptResponseMessage"]){
users=[];
var rspMsg=messageContent;
if(rspMsg.receiptMessageDic){
var ids=[];
for(var key in rspMsg.receiptMessageDic){
ids.push(key);
}
users=ids;
}
}
if(isGroup&&messageContent.messageName==RongIMLib.RongIMClient.MessageType["SyncReadStatusMessage"]){
users=[];
users.push(me.userId);
}
var userIds=params.userIds;
if(isGroup&&userIds){
users=userIds;
}
var msg=me.addon.sendMessage(conversationType,targetId,RongIMLib.RongIMClient.MessageParams[messageContent.messageName].objectName,messageContent.encode(),pushText||"",appData||"",function(progress){
},function(message,code){
var msg=me.buildMessage(message);
var errorCode=RongIMLib.ErrorCode.SENSITIVE_REPLACE;
if(code==errorCode){
return sendCallback.onError(errorCode,msg);
}
sendCallback.onSuccess(msg);
},function(message,code){
sendCallback.onError(code,me.buildMessage(message));
},users);
var tempMessage=JSON.parse(msg);
sendCallback.onBefore&&sendCallback.onBefore(tempMessage.messageId);
RongIMLib.MessageIdHandler.messageId=tempMessage.messageId;
};
VCDataProvider.prototype.registerMessageType=function(messageType,objectName,messageTag,messageContent,searchProps){
this.useConsole&&console.log("registerMessageType");
this.addon.registerMessageType(objectName,messageTag.getMessageTag(),searchProps);
var regMsg=RongIMLib.ModelUtil.modleCreate(messageContent,messageType);
RongIMLib.RongIMClient.RegisterMessage[messageType]=regMsg;
RongIMLib.RongIMClient.RegisterMessage[messageType].messageName=messageType;
registerMessageTypeMapping[objectName]=messageType;
RongIMLib.RongIMClient.MessageType[messageType]=messageType;
RongIMLib.RongIMClient.MessageParams[messageType]={objectName:objectName,msgTag:messageTag};
typeMapping[objectName]=messageType;
};
VCDataProvider.prototype.registerMessageTypes=function(messages){
var types=[];
var getProtos=function getProtos(proto){
var protos=[];
for(var p in proto){
protos.push(p);
}
return protos;
};
//转换消息为自定义消息参数格式
for(var name in messages){
var message=messages[name];
var proto=message.proto;
var protos=getProtos(proto);
var flag=message.flag||3;
var tag=RongIMLib.MessageTag.getTagByStatus(flag);
flag=new RongIMLib.MessageTag(tag.isCounted,tag.isPersited);
types.push({
type:name,
name:message.name,
flag:flag,
protos:protos});

}
var register=function register(message){
var type=message.type;
var name=message.name;
var flag=message.flag;
var protos=message.protos;
RongIMLib.RongIMClient.registerMessageType(type,name,flag,protos);
};
for(var i=0,len=types.length;i<len;i++){
var message=types[i];
register(message);
}
};
VCDataProvider.prototype.addMessage=function(conversationType,targetId,message,callback){
this.useConsole&&console.log("addMessage");
var direction=message.direction;
var msg=this.addon.insertMessage(conversationType,targetId,message.senderUserId,message.objectName,JSON.stringify(message.content),function(){
callback.onSuccess(me.buildMessage(msg));
},function(){
callback.onError(RongIMLib.ErrorCode.MSG_INSERT_ERROR);
},direction),me=this;
};
VCDataProvider.prototype.removeMessage=function(conversationType,targetId,delMsgs,callback){
};
VCDataProvider.prototype.removeLocalMessage=function(conversationType,targetId,timestamps,callback){
try{
this.useConsole&&console.log("removeLocalMessage");
this.addon.deleteMessages(timestamps);
callback.onSuccess(true);
}
catch(e){
callback.onError(e);
}
};
VCDataProvider.prototype.getMessage=function(messageId,callback){
try{
this.useConsole&&console.log("getMessage");
var msg=this.buildMessage(this.addon.getMessage(messageId));
callback.onSuccess(msg);
}
catch(e){
callback.onError(e);
}
};
VCDataProvider.prototype.clearMessages=function(conversationType,targetId,callback){
try{
this.useConsole&&console.log("clearMessages");
this.addon.clearMessages(conversationType,targetId);
callback.onSuccess(true);
}
catch(e){
callback.onError(e);
}
};
// Web 端接口，桌面版无需实现
VCDataProvider.prototype.setUnreadCount=function(conversationType,targetId,count){
};
VCDataProvider.prototype.getConversation=function(conversationType,targetId,callback){
try{
this.useConsole&&console.log("getConversation");
var ret=this.addon.getConversation(conversationType,targetId);
callback.onSuccess(this.buildConversation(ret));
}
catch(e){
callback.onError(e);
}
};
VCDataProvider.prototype.getConversationList=function(callback,conversationTypes,count,isGetHiddenConvers){
this.useConsole&&console.log("getConversationList");
this.getRemoteConversationList(callback,conversationTypes,count,isGetHiddenConvers);
};
VCDataProvider.prototype.clearCache=function(){
var memoryStore=RongIMLib.RongIMClient._memoryStore||{};
memoryStore.conversationList=[];
memoryStore.isSyncRemoteConverList;
};
VCDataProvider.prototype.clearConversations=function(conversationTypes,callback){
try{
this.useConsole&&console.log("clearConversations");
this.addon.clearConversations();
callback.onSuccess(true);
}
catch(e){
callback.onError(e);
}
};
VCDataProvider.prototype.setMessageContent=function(messageId,content,objectName){
content=JSON.stringify(content);
this.addon.setMessageContent(messageId,content,objectName);
};
VCDataProvider.prototype.getHistoryMessages=function(conversationType,targetId,timestamp,count,callback,objectname,direction){
this.useConsole&&console.log("getHistoryMessages");
if(count<=0){
callback.onError(RongIMLib.ErrorCode.TIMEOUT);
return;
}
objectname=objectname||'';
direction=typeof direction=='undefined'||direction;
try{
var ret=this.addon.getHistoryMessages(conversationType,targetId,timestamp?timestamp:0,count,objectname,direction);
var list=ret?JSON.parse(ret).list:[],msgs=[],me=this;
list.reverse();
for(var i=0,len=list.length;i<len;i++){
var message=me.buildMessage(list[i].obj);
msgs[i]=message;
}
callback.onSuccess(msgs,len==count);
}
catch(e){
callback.onError(e);
}
};
VCDataProvider.prototype.clearRemoteHistoryMessages=function(params,callback){
var conversationType=params.conversationType;
var targetId=params.targetId;
var timestamp=params.timestamp;
var _topic={
1:true,
2:true,
3:true,
5:true,
6:true};

var topic=_topic[conversationType];
if(!topic){
callback.onError(RongIMLib.ErrorCode.CLEAR_HIS_TYPE_ERROR);
return;
}
if(typeof timestamp!='number'){
callback.onError(RongIMLib.ErrorCode.CLEAR_HIS_TIME_ERROR);
return;
}
this.addon.clearRemoteHistoryMessages(+conversationType,targetId,timestamp,function(){
callback.onSuccess(true);
},function(errorCode){
if(errorCode==1){
// 没有开通历史消息云存储
errorCode=RongIMLib.ErrorCode.CLEAR_HIS_ERROR;
}
callback.onError(errorCode);
});
};
VCDataProvider.prototype.clearHistoryMessages=function(params,callback){
var conversationType=+params.conversationType;
var targetId=params.targetId;
try{
this.addon.clearMessages(conversationType,targetId);
var isSuccess=true;
callback.onSuccess(isSuccess);
}
catch(e){
console.log(e);
callback.onError(RongIMLib.ErrorCode.CLEAR_HIS_ERROR);
}
};
VCDataProvider.prototype.getTotalUnreadCount=function(callback,conversationTypes){
try{
var result;
this.useConsole&&console.log("getTotalUnreadCount");
if(conversationTypes){
result=this.addon.getTotalUnreadCount(conversationTypes);
}else
{
result=this.addon.getTotalUnreadCount();
}
callback.onSuccess(result);
}
catch(e){
callback.onError(e);
}
};
VCDataProvider.prototype.getConversationUnreadCount=function(conversationTypes,callback){
this.useConsole&&console.log("getConversationUnreadCount");
this.getTotalUnreadCount(callback,conversationTypes);
};
VCDataProvider.prototype.getUnreadCount=function(conversationType,targetId,callback){
try{
this.useConsole&&console.log("getUnreadCount");
var result=this.addon.getUnreadCount(conversationType,targetId);
callback.onSuccess(result);
}
catch(e){
callback.onError(e);
}
};
VCDataProvider.prototype.clearUnreadCount=function(conversationType,targetId,callback){
try{
this.useConsole&&console.log("clearUnreadCount");
var result=this.addon.clearUnreadCount(conversationType,targetId);
callback.onSuccess(true);
}
catch(e){
callback.onError(e);
}
};
VCDataProvider.prototype.clearTotalUnreadCount=function(callback){
this.useConsole&&console.log("clearTotalUnreadCount");
};
VCDataProvider.prototype.clearUnreadCountByTimestamp=function(conversationType,targetId,timestamp,callback){
try{
this.useConsole&&console.log("clearUnreadCountByTimestamp");
var result=this.addon.clearUnreadCountByTimestamp(conversationType,targetId,timestamp);
callback.onSuccess(true);
}
catch(e){
callback.onError(e);
}
};
VCDataProvider.prototype.setConversationToTop=function(conversationType,targetId,isTop,callback){
try{
this.useConsole&&console.log("setConversationToTop");
this.addon.setConversationToTop(conversationType,targetId,isTop);
callback.onSuccess(true);
}
catch(e){
callback.onError(e);
}
};
VCDataProvider.prototype.setConversationHidden=function(conversationType,targetId,isHidden){
this.addon.setConversationHidden(conversationType,targetId,isHidden);
};
VCDataProvider.prototype.setMessageReceivedStatus=function(messageId,receivedStatus,callback){
try{
this.useConsole&&console.log("setMessageReceivedStatus");
this.addon.setMessageReceivedStatus(messageId,receivedStatus);
callback.onSuccess(true);
}
catch(e){
callback.onError(e);
}
};
VCDataProvider.prototype.setMessageSentStatus=function(messageId,sentStatus,callback){
try{
this.useConsole&&console.log("setMessageSentStatus");
this.addon.setMessageSentStatus(messageId,sentStatus);
callback.onSuccess(true);
}
catch(e){
callback.onError(e);
}
};
VCDataProvider.prototype.getFileToken=function(fileType,callback){
this.useConsole&&console.log("getFileToken");
this.addon.getUploadToken(fileType,function(token){
callback.onSuccess({token:token});
},function(errorCode){
callback.onError(errorCode);
});
};
VCDataProvider.prototype.getFileUrl=function(fileType,fileName,oriName,callback){
this.useConsole&&console.log("getFileUrl");
this.addon.getDownloadUrl(fileType,fileName,oriName,function(url){
callback.onSuccess({downloadUrl:url});
},function(errorCode){
callback.onError(errorCode);
});
};
VCDataProvider.prototype.searchConversationByContent=function(keyword,callback,conversationTypes){
var converTypes=[];
if(typeof conversationTypes=='undefined'){
converTypes=[1,2,3,4,5,6,7];
}else
{
converTypes=conversationTypes;
}
try{
this.useConsole&&console.log("searchConversationByContent");
var result=this.addon.searchConversationByContent(converTypes,keyword);
var list=JSON.parse(result).list,convers=[],me=this;
list.reverse();
for(var i=0,len=list.length;i<len;i++){
convers[i]=me.buildConversation(list[i].obj);
}
callback.onSuccess(convers);
}
catch(e){
callback.onError(e);
}
};
VCDataProvider.prototype.searchMessageByContent=function(conversationType,targetId,keyword,timestamp,count,total,callback){
var me=this;
try{
this.useConsole&&console.log("searchMessageByContent");
this.addon.searchMessageByContent(conversationType,targetId,keyword,timestamp,count,total,function(ret,matched){
var list=ret?JSON.parse(ret).list:[],msgs=[];
list.reverse();
for(var i=0,len=list.length;i<len;i++){
msgs[i]=me.buildMessage(list[i].obj);
}
callback.onSuccess(msgs,matched);
});
}
catch(e){
callback.onError(e);
}
};
VCDataProvider.prototype.getChatRoomInfo=function(chatRoomId,count,order,callback){
this.useConsole&&console.log("getChatRoomInfo");
this.addon.getChatroomInfo(chatRoomId,count,order,function(ret,count){
var list=ret?JSON.parse(ret).list:[],chatRoomInfo={userInfos:[],userTotalNums:count};
if(list.length>0){
for(var i=0,len=list.length;i<len;i++){
chatRoomInfo.userInfos.push(JSON.parse(list[i].obj));
}
}
callback.onSuccess(chatRoomInfo);
},function(errcode){
callback.onError(errcode);
});
};
VCDataProvider.prototype.setChatroomHisMessageTimestamp=function(chatRoomId,timestamp){
};
VCDataProvider.prototype.getChatRoomHistoryMessages=function(chatRoomId,count,order,callback){
};
VCDataProvider.prototype.getDelaTime=function(){
return this.addon.getDeltaTime();
};
VCDataProvider.prototype.getUserStatus=function(userId,callback){
var me=this;
this.addon.getUserStatus(userId,function(status){
var entity=RongIMLib.RongInnerTools.convertUserStatus({
status:status,
userId:''});

callback.onSuccess(entity);
},function(code){
callback.onError(code);
});
};
VCDataProvider.prototype.setUserStatus=function(status,callback){
this.addon.setUserStatus(status,function(){
callback.onSuccess(true);
},function(code){
callback.onError(code);
});
};
VCDataProvider.prototype.subscribeUserStatus=function(userIds,callback){
this.addon.subscribeUserStatus(userIds,function(){
callback&&callback.onSuccess(true);
},function(code){
callback&&callback.onError(code);
});
};
VCDataProvider.prototype.setUserStatusListener=function(params,callback){
var me=this;
this.addon.setOnReceiveStatusListener(function(userId,status){
var entity=RongIMLib.RongInnerTools.convertUserStatus({
userId:userId,
status:status});

RongIMLib.RongIMClient.userStatusObserver.notify({
key:userId,
entity:entity});

});
var userIds=params.userIds||[];
if(userIds.length){
RongIMLib.RongIMClient._dataAccessProvider.subscribeUserStatus(userIds);
}
};
VCDataProvider.prototype.getUnreadMentionedMessages=function(conversationType,targetId){
var me=this;
var mentions=JSON.parse(me.addon.getUnreadMentionedMessages(conversationType,targetId)).list;
for(var i=0,len=mentions.length;i<len;i++){
var temp=JSON.parse(mentions[i].obj);
temp.content=JSON.parse(temp.content);
mentions[i]=temp;
}
return mentions;
};
VCDataProvider.prototype.hasRemoteUnreadMessages=function(token,callback){
callback.onSuccess(false);
};
VCDataProvider.prototype.sendRecallMessage=function(content,sendMessageCallback){
var me=this;
me.addon.recallMessage("RC:RcCmd",JSON.stringify(content),content.push||"",function(){
content.objectName='RC:RcCmd';
sendMessageCallback.onSuccess(me.buildMessage(JSON.stringify(content)));
},function(errorCode){
sendMessageCallback.onError(errorCode);
});
};
VCDataProvider.prototype.updateMessage=function(message,callback){};
VCDataProvider.prototype.updateMessages=function(conversationType,targetId,key,value,callback){};
VCDataProvider.prototype.reconnect=function(callback){};
VCDataProvider.prototype.sendReceiptResponse=function(conversationType,targetId,sendCallback){};
VCDataProvider.prototype.setMessageExtra=function(messageId,value,callback){};
VCDataProvider.prototype.addMemberToDiscussion=function(discussionId,userIdList,callback){};
VCDataProvider.prototype.createDiscussion=function(name,userIdList,callback){};
VCDataProvider.prototype.getDiscussion=function(discussionId,callback){};
VCDataProvider.prototype.quitDiscussion=function(discussionId,callback){};
VCDataProvider.prototype.removeMemberFromDiscussion=function(discussionId,userId,callback){};
VCDataProvider.prototype.setDiscussionInviteStatus=function(discussionId,status,callback){};
VCDataProvider.prototype.setDiscussionName=function(discussionId,name,callback){};
VCDataProvider.prototype.setEnvironment=function(isPrivate){
this.addon.setEnvironment(isPrivate);
};
VCDataProvider.prototype.addConversation=function(conversation,callback){};
VCDataProvider.prototype.updateConversation=function(conversation){
return null;
};
VCDataProvider.prototype.getConversationNotificationStatus=function(params,callback){
var conversationType=params.conversationType;
var targetId=params.targetId;
var notification=RongIMLib.RongIMClient._memoryStore.notification;
var key=conversationType+'_'+targetId;
var status=notification[key];
if(typeof status=='number'){
callback.onSuccess(status);
return;
}
this.addon.getConversationNotificationStatus(conversationType,targetId,function(status){
notification[key]=status;
callback.onSuccess(status);
},function(error){
callback.onError(error);
});
};
VCDataProvider.prototype.setConversationNotificationStatus=function(params,callback){
var conversationType=params.conversationType;
var targetId=params.targetId;
var status=params.status;
var notification=RongIMLib.RongIMClient._memoryStore.notification;
var key=conversationType+'_'+targetId;
notification[key]=status;
var notify=!!status;
this.addon.setConversationNotificationStatus(conversationType,targetId,notify,function(){
callback.onSuccess(status);
},function(error){
callback.onError(error);
});
};
VCDataProvider.prototype.getCurrentConnectionStatus=function(){
return this.addon.getConnectionStatus();
};
VCDataProvider.prototype.getAgoraDynamicKey=function(engineType,channelName,callback){
var extra="";
this.addon.getVoIPKey(engineType,channelName,extra,function(token){
callback.onSuccess(token);
},function(errorCode){
callback.onError(errorCode);
});
};
VCDataProvider.prototype.getPublicServiceProfile=function(publicServiceType,publicServiceId,callback){
var profile=RongIMLib.RongIMClient._memoryStore.publicServiceMap.get(publicServiceType,publicServiceId);
callback.onSuccess(profile);
};
VCDataProvider.prototype.setDeviceInfo=function(device){
var id=device.id||'';
this.addon.setDeviceId(id);
};
VCDataProvider.prototype.getRemotePublicServiceList=function(callback,pullMessageTime){
var publicList=[];
var ret=this.addon.getAccounts();
var transformProto=function transformProto(ret){
var result={
hasFollowed:false,
isGlobal:false,
menu:null};

if(!ret.obj){
var error={error:ret};
throw new Error('公众账号数据格式错误: '+JSON.stringify(error));
}
var obj=JSON.parse(ret.obj);
var protoMap={
aType:'conversationType',
aId:'publicServiceId',
aName:'introduction',
aUri:'portraitUri',
follow:'hasFollowed',
isGlobal:'isGlobal'};

for(var key in obj){
var val=obj[key];
if(key=='aExtra'){
var extra=JSON.parse(val);
result["hasFollowed"]=extra.follow;
result["isGlobal"]=extra.isGlobal;
result["menu"]=extra.menu;
}
var uId=protoMap[key];
if(uId){
result[uId]=val;
}
}
return result;
};
if(ret){
ret=JSON.parse(ret);
var list=ret.list;
for(var i=0,len=list.length;i<len;i++){
var item=list[i];
item=transformProto(item);
publicList.push(item);
}
}
if(publicList.length>0){
RongIMLib.RongIMClient._memoryStore.publicServiceMap.publicServiceList.length=0;
RongIMLib.RongIMClient._memoryStore.publicServiceMap.publicServiceList=publicList;
}
callback.onSuccess(RongIMLib.RongIMClient._memoryStore.publicServiceMap.publicServiceList);
};
VCDataProvider.prototype.buildMessage=function(result){
var message=new RongIMLib.Message(),ret=JSON.parse(result);
message.conversationType=ret.conversationType;
message.targetId=ret.targetId;
message.messageDirection=ret.direction;
message.senderUserId=ret.senderUserId;
if(ret.direction==RongIMLib.MessageDirection.RECEIVE){
message.receivedStatus=ret.status;
}else
if(ret.direction==RongIMLib.MessageDirection.SEND){
message.sentStatus=ret.status;
}
message.sentTime=ret.sentTime;
message.objectName=ret.objectName;
var content=ret.content?JSON.parse(ret.content):ret.content;
var messageType=typeMapping[ret.objectName]||registerMessageTypeMapping[ret.objectName];
if(content){
content.messageName=messageType;
}
message.content=content;
message.messageId=ret.messageId;
message.messageUId=ret.messageUid;
message.messageType=messageType;
return message;
};
VCDataProvider.prototype.buildConversation=function(val){
if(val===''){
return null;
}
var conver=new RongIMLib.Conversation(),c=JSON.parse(val),lastestMsg=c.lastestMsg?this.buildMessage(c.lastestMsg):{};
conver.conversationTitle=c.title;
conver.conversationType=c.conversationType;
conver.draft=c.draft;
conver.isTop=c.isTop;
conver.isHidden=c.isHidden;
lastestMsg.conversationType=c.conversationType;
lastestMsg.targetId=c.targetId;
conver.latestMessage=lastestMsg;
conver.latestMessageId=lastestMsg.messageId;
conver.latestMessage.messageType=typeMapping[lastestMsg.objectName]||registerMessageTypeMapping[lastestMsg.objectName];
conver.objectName=lastestMsg.objectName;
conver.receivedStatus=RongIMLib.ReceivedStatus.READ;
conver.sentTime=lastestMsg.sentTime;
conver.senderUserId=lastestMsg.senderUserId;
conver.sentStatus=lastestMsg.status;
conver.targetId=c.targetId;
conver.unreadMessageCount=c.unreadCount;
conver.hasUnreadMention=c.m_hasUnreadMention;
var mentions=this.getUnreadMentionedMessages(c.conversationType,c.targetId);
if(mentions.length>0){
// 取最后一条 @ 消息,原因：和 web 互相兼容
var mention=mentions.pop();
conver.mentionedMsg={uid:mention.messageUid,time:mention.sentTime,mentionedInfo:mention.content.mentionedInfo,sendUserId:mention.senderUserId};
}
return conver;
};
VCDataProvider.prototype.getRTCUserInfoList=function(room,callback){
};
VCDataProvider.prototype.setRTCUserInfo=function(room,info,callback){
};
VCDataProvider.prototype.removeRTCUserInfo=function(room,info,callback){
};
VCDataProvider.prototype.getRTCUserList=function(room,callback){
};
VCDataProvider.prototype.getRTCRoomInfo=function(room,callback){
};
VCDataProvider.prototype.setRTCRoomInfo=function(room,data,callback){
};
VCDataProvider.prototype.removeRTCRoomInfo=function(room,data,callback){
};
VCDataProvider.prototype.joinRTCRoom=function(room,callback){
};
VCDataProvider.prototype.quitRTCRoom=function(room,callback){
};
VCDataProvider.prototype.RTCPing=function(room,callback){
};
VCDataProvider.prototype.setRTCUserData=function(roomId,key,value,isInner,callback,message){
};
VCDataProvider.prototype.getRTCUserData=function(roomId,key,isInner,callback,message){
};
VCDataProvider.prototype.removeRTCUserData=function(roomId,key,isInner,callback,message){
};
VCDataProvider.prototype.setRTCRoomData=function(roomId,key,value,isInner,callback,message){
};
VCDataProvider.prototype.getRTCRoomData=function(roomId,key,isInner,callback,message){
};
VCDataProvider.prototype.removeRTCRoomData=function(roomId,key,isInner,callback,message){
};
VCDataProvider.prototype.getNavi=function(){
};
VCDataProvider.prototype.getRTCToken=function(room,callback){
};
return VCDataProvider;
}();
RongIMLib.VCDataProvider=VCDataProvider;
})(RongIMLib||(RongIMLib={}));
var RongIMLib;
(function(RongIMLib){
var MemeoryProvider=function(){
function MemeoryProvider(){
this._memeoryStore={};
this.prefix="rong_";
}
MemeoryProvider.prototype.setItem=function(composedKey,object){
this._memeoryStore[composedKey]=decodeURIComponent(object);
};
MemeoryProvider.prototype.getItem=function(composedKey){
return this._memeoryStore[composedKey];
};
MemeoryProvider.prototype.removeItem=function(composedKey){
if(this.getItem(composedKey)){
delete this._memeoryStore[composedKey];
}
};
MemeoryProvider.prototype.getItemKey=function(regStr){
var me=this,item=null,reg=new RegExp(regStr+"\\w+");
for(var key in me._memeoryStore){
var arr=key.match(reg);
if(arr){
item=key;
}
}
return item;
};
MemeoryProvider.prototype.getItemKeyList=function(regStr){
var prefix=this.prefix;
var me=this,itemList=[],reg=new RegExp(regStr+"\\w+");
for(var key in me._memeoryStore){
var arr=key.match(reg);
if(arr){
key=key.substring(prefix.length);
itemList.push(key);
}
}
return itemList;
};
MemeoryProvider.prototype.clearItem=function(){
var me=this;
for(var key in me._memeoryStore){
delete me._memeoryStore[key];
}
};
//单位：字节
MemeoryProvider.prototype.onOutOfQuota=function(){
return 4*1024;
};
return MemeoryProvider;
}();
RongIMLib.MemeoryProvider=MemeoryProvider;
})(RongIMLib||(RongIMLib={}));
var RongIMLib;
(function(RongIMLib){
var LocalStorageProvider=function(){
// static _instance: LocalStorageProvider = new LocalStorageProvider();
function LocalStorageProvider(){
this.prefix='rong_';
this._host="";
var d=new Date(),m=d.getMonth()+1,date=d.getFullYear()+'/'+(m.toString().length==1?'0'+m:m)+'/'+d.getDate(),nowDate=new Date(date).getTime();
for(var key in localStorage){
if(key.lastIndexOf('RECEIVED')>-1){
var recObj=JSON.parse(localStorage.getItem(key));
for(var key_1 in recObj){
nowDate-recObj[key_1].dealtime>0&&delete recObj[key_1];
}
if(RongIMLib.RongUtil.isEmpty(recObj)){
localStorage.removeItem(key);
}else
{
localStorage.setItem(key,JSON.stringify(recObj));
}
}
if(key.lastIndexOf('SENT')>-1){
var sentObj=JSON.parse(localStorage.getItem(key));
nowDate-sentObj.dealtime>0&&localStorage.removeItem(key);
}
}
}
LocalStorageProvider.prototype.setItem=function(composedKey,object){
if(composedKey){
composedKey.indexOf(this.prefix)==-1&&(composedKey=this.prefix+composedKey);
localStorage.setItem(composedKey,object);
}
};
LocalStorageProvider.prototype.getItem=function(composedKey){
if(composedKey){
composedKey.indexOf(this.prefix)==-1&&(composedKey=this.prefix+composedKey);
return localStorage.getItem(composedKey?composedKey:"");
}
return"";
};
LocalStorageProvider.prototype.getItemKey=function(composedStr){
var item="";
var _key=this.prefix+composedStr;
for(var key in localStorage){
if(key.indexOf(_key)==0){
item=key;
break;
}
}
return item;
};
LocalStorageProvider.prototype.getItemKeyList=function(composedStr){
var itemList=[];
var prefix=this.prefix;
var _key=prefix+composedStr;
for(var key in localStorage){
if(key.indexOf(_key)==0){
key=key.substring(prefix.length);
itemList.push(key);
}
}
return itemList;
};
LocalStorageProvider.prototype.removeItem=function(composedKey){
if(composedKey){
composedKey.indexOf(this.prefix)==-1&&(composedKey=this.prefix+composedKey);
localStorage.removeItem(composedKey.toString());
}
};
LocalStorageProvider.prototype.clearItem=function(){
var me=this;
for(var key in localStorage){
if(key.indexOf(me.prefix)>-1){
me.removeItem(key);
}
}
};
//单位：字节
LocalStorageProvider.prototype.onOutOfQuota=function(){
return JSON.stringify(localStorage).length;
};
return LocalStorageProvider;
}();
RongIMLib.LocalStorageProvider=LocalStorageProvider;
})(RongIMLib||(RongIMLib={}));
var RongIMLib;
(function(RongIMLib){
var UserDataProvider=function(){
function UserDataProvider(){
this.opersistName='RongIMLib';
this.keyManager='RongUserDataKeyManager';
this._host="";
this.prefix="rong_";
this.oPersist=document.createElement("div");
this.oPersist.style.display="none";
this.oPersist.style.behavior="url('#default#userData')";
document.body.appendChild(this.oPersist);
this.oPersist.load(this.opersistName);
}
UserDataProvider.prototype.setItem=function(key,value){
key&&key.indexOf(this.prefix)==-1&&(key=this.prefix+key);
this.oPersist.setAttribute(key,value);
var keyNames=this.getItem(this.keyManager);
keyNames?keyNames.indexOf(key)==-1&&(keyNames+=','+key):keyNames=key;
this.oPersist.setAttribute(this.prefix+this.keyManager,keyNames);
this.oPersist.save(this.opersistName);
};
UserDataProvider.prototype.getItem=function(key){
key&&key.indexOf(this.prefix)==-1&&(key=this.prefix+key);
return key?this.oPersist.getAttribute(key):key;
};
UserDataProvider.prototype.removeItem=function(key){
key&&key.indexOf(this.prefix)==-1&&(key=this.prefix+key);
this.oPersist.removeAttribute(key);
this.oPersist.save(this.opersistName);
var keyNames=this.getItem(this.keyManager),keyNameArray=keyNames&&keyNames.split(',')||[];
for(var i=0,len=keyNameArray.length;i<len;i++){
if(keyNameArray[i]==key){
keyNameArray.splice(i,1);
}
}
this.oPersist.setAttribute(this.prefix+this.keyManager,keyNameArray.join(','));
this.oPersist.save(this.opersistName);
};
UserDataProvider.prototype.getItemKey=function(composedStr){
var item=null,keyNames=this.getItem(this.keyManager),keyNameArray=keyNames&&keyNames.split(',')||[],me=this;
var _key=this.prefix+composedStr;
if(keyNameArray.length){
for(var i=0,len=keyNameArray.length;i<len;i++){
if(keyNameArray[i]&&keyNameArray[i].indexOf(_key)==0){
item=keyNameArray[i];
break;
}
}
}
return item;
};
UserDataProvider.prototype.getItemKeyList=function(composedStr){
var itemList=[],keyNames=this.getItem(this.keyManager),keyNameArray=keyNames&&keyNames.split(',')||[];
var prefix=this.prefix;
var _key=prefix+composedStr;
if(keyNameArray.length){
for(var i=0,len=keyNameArray.length;i<len;i++){
if(keyNameArray[i]&&keyNameArray[i].indexOf(_key)==0){
var keyName=keyNameArray[i];
keyName=keyName.substring(prefix.length);
itemList.push(keyNameArray[i]);
}
}
}
return itemList;
};
UserDataProvider.prototype.clearItem=function(){
var keyNames=this.getItem(this.keyManager),keyNameArray=[],me=this;
keyNames&&(keyNameArray=keyNames.split(','));
if(keyNameArray.length){
for(var i=0,len=keyNameArray.length;i<len;i++){
keyNameArray[i]&&me.removeItem(keyNameArray[i]);
}
me.removeItem(me.keyManager);
}
};
UserDataProvider.prototype.onOutOfQuota=function(){
return 10*1024*1024;
};
return UserDataProvider;
}();
RongIMLib.UserDataProvider=UserDataProvider;
})(RongIMLib||(RongIMLib={}));
var RongIMLib;
(function(RongIMLib){
var FeatureDectector=function(){
function FeatureDectector(callback){
this.script=document.createElement("script");
this.head=document.getElementsByTagName("head")[0];
if("WebSocket"in window&&"ArrayBuffer"in window&&WebSocket.prototype.CLOSED===3&&!RongIMLib.RongIMClient._memoryStore.depend.isPolling){
RongIMLib.Transportations._TransportType=RongIMLib.Socket.WEBSOCKET;
if(!RongIMLib.RongIMClient.Protobuf){
var url=RongIMLib.RongIMClient._memoryStore.depend.protobuf;
var script=this.script;
script.src=url;
this.head.appendChild(script);
script.onload=script.onreadystatechange=function(){
var isLoaded=!this.readyState||this.readyState=='loaded'||this.readyState=='complete';
if(isLoaded){
// 防止 IE6、7 下偶发触发两次 loaded
script.onload=script.onreadystatechange=null;
if(callback){
callback();
}
if(!callback){
var token=RongIMLib.RongIMClient._memoryStore.token;
var connectCallback=RongIMLib.RongIMClient._memoryStore.callback;
token&&RongIMLib.RongIMClient.connect(token,connectCallback);
}
}
};
}
}else
{
RongIMLib.Transportations._TransportType="xhr-polling";
RongIMLib.RongIMClient.Protobuf=Polling;
}
}
return FeatureDectector;
}();
RongIMLib.FeatureDectector=FeatureDectector;
})(RongIMLib||(RongIMLib={}));
var RongIMLib;
(function(RongIMLib){
var FeaturePatcher=function(){
function FeaturePatcher(){
}
FeaturePatcher.prototype.patchAll=function(){
this.patchJSON();
this.patchForEach();
};
FeaturePatcher.prototype.patchForEach=function(){
if(!Array.forEach){
Array.forEach=function(arr,func){
for(var i=0;i<arr.length;i++){
func.call(arr,arr[i],i,arr);
}
};
}
};
FeaturePatcher.prototype.patchJSON=function(){
if(!window["JSON"]){
window["JSON"]=function(){
function JSON(){
}
JSON.parse=function(sJSON){
return eval('('+sJSON+')');
};
JSON.stringify=function(value){
return this.str("",{"":value});
};
JSON.str=function(key,holder){
var i,k,v,length,mind="",partial,value=holder[key],me=this;
if(value&&typeof value==="object"&&typeof value.toJSON==="function"){
value=value.toJSON(key);
}
switch(typeof value){
case"string":
return me.quote(value);
case"number":
return isFinite(value)?String(value):"null";
case"boolean":
case"null":
return String(value);
case"object":
if(!value){
return"null";
}
partial=[];
if(Object.prototype.toString.apply(value)==="[object Array]"){
length=value.length;
for(i=0;i<length;i+=1){
partial[i]=me.str(i,value)||"null";
}
v=partial.length===0?"[]":"["+partial.join(",")+"]";
return v;
}
for(k in value){
if(Object.prototype.hasOwnProperty.call(value,k)){
v=me.str(k,value);
if(v){
partial.push(me.quote(k)+":"+v);
}
}
}
v=partial.length===0?"{}":"{"+partial.join(",")+"}";
return v;}

};
JSON.quote=function(string){
var me=this;
me.rx_escapable.lastIndex=0;
return me.rx_escapable.test(string)?'"'+string.replace(me.rx_escapable,function(a){
var c=me.meta[a];
return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
})+'"':'"'+string+'"';
};
JSON.rx_escapable=new RegExp("[\\\"\\\\\"\0-\x1F\x7F-\x9F\xAD\u0600-\u0604\u070F\u17B4\u17B5\u200C-\u200F\u2028-\u202F\u2060-\u206F\uFEFF\uFFF0-\uFFFF]","g");
JSON.meta={
"\b":"\\b",
"	":"\\t",
"\n":"\\n",
"\f":"\\f",
"\r":"\\r",
'"':'\\"',
"''":"\\''",
"\\":"\\\\"};

return JSON;
}();
}
};
return FeaturePatcher;
}();
RongIMLib.FeaturePatcher=FeaturePatcher;
})(RongIMLib||(RongIMLib={}));
var RongIMLib;
(function(RongIMLib){
var ScriptLoader=function(){
function ScriptLoader(){
}
ScriptLoader.prototype.load=function(src,onLoad,onError){
var script=document.createElement("script");
script.async=true;
if(onLoad){
if(script.addEventListener){
script.addEventListener("load",function(event){
var target=event.target||event.srcElement;
onLoad(target.src);
},false);
}else
if(script.readyState){
script.onreadystatechange=function(event){
var target=event.srcElement;
onLoad(target.src);
};
}
}
if(onError){
script.onerror=function(event){
var target=event.target||event.srcElement;
onError(target.src);
};
}
(document.head||document.getElementsByTagName("head")[0]).appendChild(script);
script.src=src;
};
return ScriptLoader;
}();
})(RongIMLib||(RongIMLib={}));
var RongIMLib;
(function(RongIMLib){
var PublicServiceMap=function(){
function PublicServiceMap(){
this.publicServiceList=[];
}
PublicServiceMap.prototype.get=function(publicServiceType,publicServiceId){
for(var i=0,len=this.publicServiceList.length;i<len;i++){
if(this.publicServiceList[i].conversationType==publicServiceType&&publicServiceId==this.publicServiceList[i].publicServiceId){
return this.publicServiceList[i];
}
}
};
PublicServiceMap.prototype.add=function(publicServiceProfile){
var isAdd=true,me=this;
for(var i=0,len=this.publicServiceList.length;i<len;i++){
if(me.publicServiceList[i].conversationType==publicServiceProfile.conversationType&&publicServiceProfile.publicServiceId==me.publicServiceList[i].publicServiceId){
this.publicServiceList.unshift(this.publicServiceList.splice(i,1)[0]);
isAdd=false;
break;
}
}
if(isAdd){
this.publicServiceList.unshift(publicServiceProfile);
}
};
PublicServiceMap.prototype.replace=function(publicServiceProfile){
var me=this;
for(var i=0,len=this.publicServiceList.length;i<len;i++){
if(me.publicServiceList[i].conversationType==publicServiceProfile.conversationType&&publicServiceProfile.publicServiceId==me.publicServiceList[i].publicServiceId){
me.publicServiceList.splice(i,1,publicServiceProfile);
break;
}
}
};
PublicServiceMap.prototype.remove=function(conversationType,publicServiceId){
var me=this;
for(var i=0,len=this.publicServiceList.length;i<len;i++){
if(me.publicServiceList[i].conversationType==conversationType&&publicServiceId==me.publicServiceList[i].publicServiceId){
this.publicServiceList.splice(i,1);
break;
}
}
};
return PublicServiceMap;
}();
RongIMLib.PublicServiceMap=PublicServiceMap;
/**
     * 会话工具类。
     */
var ConversationMap=function(){
function ConversationMap(){
this.conversationList=[];
}
ConversationMap.prototype.get=function(conversavtionType,targetId){
for(var i=0,len=this.conversationList.length;i<len;i++){
if(this.conversationList[i].conversationType==conversavtionType&&this.conversationList[i].targetId==targetId){
return this.conversationList[i];
}
}
return null;
};
ConversationMap.prototype.add=function(conversation){
var isAdd=true;
for(var i=0,len=this.conversationList.length;i<len;i++){
if(this.conversationList[i].conversationType===conversation.conversationType&&this.conversationList[i].targetId===conversation.targetId){
this.conversationList.unshift(this.conversationList.splice(i,1)[0]);
isAdd=false;
break;
}
}
if(isAdd){
this.conversationList.unshift(conversation);
}
};
/**
         * [replace 替换会话]
         * 会话数组存在的情况下调用add方法会是当前会话被替换且返回到第一个位置，导致用户本地一些设置失效，所以提供replace方法
         */
ConversationMap.prototype.replace=function(conversation){
for(var i=0,len=this.conversationList.length;i<len;i++){
if(this.conversationList[i].conversationType===conversation.conversationType&&this.conversationList[i].targetId===conversation.targetId){
this.conversationList.splice(i,1,conversation);
break;
}
}
};
ConversationMap.prototype.remove=function(conversation){
for(var i=0,len=this.conversationList.length;i<len;i++){
if(this.conversationList[i].conversationType===conversation.conversationType&&this.conversationList[i].targetId===conversation.targetId){
this.conversationList.splice(i,1);
break;
}
}
};
return ConversationMap;
}();
RongIMLib.ConversationMap=ConversationMap;
var CheckParam=function(){
function CheckParam(){
}
CheckParam.getInstance=function(){
if(!CheckParam._instance){
CheckParam._instance=new CheckParam();
}
return CheckParam._instance;
};
CheckParam.prototype.logger=function(code,funcName,msg){
RongIMLib.RongIMClient.logger({
code:code,
funcName:funcName,
msg:msg});

};
CheckParam.prototype.check=function(f,position,d,c){
if(RongIMLib.RongIMClient._dataAccessProvider||d){
for(var g=0,e=c.length;g<e;g++){
if(!new RegExp(this.getType(c[g])).test(f[g])){
// throw new Error("The index of " + g + " parameter was wrong type " + this.getType(c[g]) + " [" + f[g] + "] -> position:" + position);
var msg="第"+(g+1)+"个参数错误, 错误类型："+this.getType(c[g])+" ["+f[g]+"] -> 位置:"+position;
this.logger("-3",position,msg);
}
}
}else
{
var msg="该参数不正确或尚未实例化RongIMClient -> 位置:"+position;
this.logger("-4",position,msg);
}
};
CheckParam.prototype.getType=function(str){
var temp=Object.prototype.toString.call(str).toLowerCase();
return temp.slice(8,temp.length-1);
};
CheckParam.prototype.checkCookieDisable=function(){
document.cookie="checkCookie=1";
var arr=document.cookie.match(new RegExp("(^| )checkCookie=([^;]*)(;|$)")),isDisable=false;
if(!arr){
isDisable=true;
}
document.cookie="checkCookie=1;expires=Thu, 01-Jan-1970 00:00:01 GMT";
return isDisable;
};
return CheckParam;
}();
RongIMLib.CheckParam=CheckParam;
var LimitableMap=function(){
function LimitableMap(limit){
this.map={};
this.keys=[];
this.limit=limit||10;
}
LimitableMap.prototype.set=function(key,value){
this.map[key]=value;
};
LimitableMap.prototype.get=function(key){
return this.map[key]||0;
};
LimitableMap.prototype.remove=function(key){
delete this.map[key];
};
return LimitableMap;
}();
RongIMLib.LimitableMap=LimitableMap;
var MemoryCache=function(){
function MemoryCache(){
this.cache={};
}
MemoryCache.prototype.set=function(key,value){
this.cache[key]=value;
};
MemoryCache.prototype.get=function(key){
return this.cache[key];
};
MemoryCache.prototype.remove=function(key){
delete this.cache[key];
};
return MemoryCache;
}();
RongIMLib.MemoryCache=MemoryCache;
var RongAjax=function(){
function RongAjax(options){
var me=this;
me.xmlhttp=null;
me.options=options;
var hasCORS=typeof XMLHttpRequest!=="undefined"&&"withCredentials"in new XMLHttpRequest();
if("undefined"!=typeof XMLHttpRequest&&hasCORS){
me.xmlhttp=new XMLHttpRequest();
}else
if("undefined"!=typeof XDomainRequest){
me.xmlhttp=new XDomainRequest();
}else
{
me.xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
}
}
RongAjax.prototype.send=function(callback){
var me=this;
me.options.url||(me.options.url="http://upload.qiniu.com/putb64/-1");
me.xmlhttp.onreadystatechange=function(){
if(me.xmlhttp.readyState==4){
if(me.options.type){
callback();
}else
{
callback(JSON.parse(me.xmlhttp.responseText.replace(/'/g,'"')));
}
}
};
me.xmlhttp.open("POST",me.options.url,true);
me.xmlhttp.withCredentials=false;
if("setRequestHeader"in me.xmlhttp){
if(me.options.type){
me.xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset=utf-8");
}else
{
me.xmlhttp.setRequestHeader("Content-type","application/octet-stream");
me.xmlhttp.setRequestHeader('Authorization',"UpToken "+me.options.token);
}
}
me.xmlhttp.send(me.options.type?"appKey="+me.options.appKey+"&deviceId="+me.options.deviceId+"&timestamp="+me.options.timestamp+"&deviceInfo="+me.options.deviceInfo+"&privateInfo="+JSON.stringify(me.options.privateInfo):me.options.base64);
};
return RongAjax;
}();
RongIMLib.RongAjax=RongAjax;
var RongUtil=function(){
function RongUtil(){
}
RongUtil.noop=function(){};
RongUtil.isEmpty=function(obj){
var empty=true;
for(var key in obj){
empty=false;
break;
}
return empty;
};
RongUtil.MD5=function(str,key,raw){
return md5(str,key,raw);
};
RongUtil.isObject=function(obj){
return Object.prototype.toString.call(obj)=='[object Object]';
};
RongUtil.isArray=function(array){
return Object.prototype.toString.call(array)=='[object Array]';
};
RongUtil.isString=function(array){
return Object.prototype.toString.call(array)=='[object String]';
};
RongUtil.isFunction=function(fun){
return Object.prototype.toString.call(fun)=='[object Function]';
};
;
RongUtil.stringFormat=function(tmpl,vals){
for(var i=0,len=vals.length;i<len;i++){
var val=vals[i],reg=new RegExp("\\{"+i+"\\}","g");
tmpl=tmpl.replace(reg,val);
}
return tmpl;
};
RongUtil.tplEngine=function(temp,data,regexp){
if(!(Object.prototype.toString.call(data)==="[object Array]")){
data=[data];
}
var ret=[];
for(var i=0,j=data.length;i<j;i++){
ret.push(replaceAction(data[i]));
}
return ret.join("");
function replaceAction(object){
return temp.replace(regexp||/{([^}]+)}/g,function(match,name){
if(match.charAt(0)=='\\'){
return match.slice(1);
}
return object[name]!=undefined?object[name]:'{'+name+'}';
});
}
};
;
RongUtil.forEach=function(obj,callback){
callback=callback||RongUtil.noop;
var loopObj=function loopObj(){
for(var key in obj){
if(obj.hasOwnProperty(key)){
callback(obj[key],key,obj);
}
}
};
var loopArr=function loopArr(){
for(var i=0,len=obj.length;i<len;i++){
callback(obj[i],i);
}
};
if(RongUtil.isObject(obj)){
loopObj();
}
if(RongUtil.isArray(obj)){
loopArr();
}
};
RongUtil.extend=function(source,target,callback,force){
RongUtil.forEach(source,function(val,key){
var hasProto=key in target;
if(force&&hasProto){
target[key]=val;
}
if(!hasProto){
target[key]=val;
}
});
return target;
};
RongUtil.createXHR=function(){
var item={
XMLHttpRequest:function(_XMLHttpRequest){function XMLHttpRequest(){return _XMLHttpRequest.apply(this,arguments);}XMLHttpRequest.toString=function(){return _XMLHttpRequest.toString();};return XMLHttpRequest;}(function(){
return new XMLHttpRequest();
}),
XDomainRequest:function(_XDomainRequest){function XDomainRequest(){return _XDomainRequest.apply(this,arguments);}XDomainRequest.toString=function(){return _XDomainRequest.toString();};return XDomainRequest;}(function(){
return new XDomainRequest();
}),
ActiveXObject:function(_ActiveXObject){function ActiveXObject(){return _ActiveXObject.apply(this,arguments);}ActiveXObject.toString=function(){return _ActiveXObject.toString();};return ActiveXObject;}(function(){
return new ActiveXObject('Microsoft.XMLHTTP');
})};

var isXHR=typeof XMLHttpRequest=='function';
var isXDR=typeof XDomainRequest=='function';
var key=isXHR?'XMLHttpRequest':isXDR?'XDomainRequest':'ActiveXObject';
return item[key]();
};
RongUtil.request=function(opts){
var url=opts.url;
var success=opts.success;
var error=opts.error;
var method=opts.method||'GET';
var xhr=RongUtil.createXHR();
xhr.onreadystatechange=function(){
if(xhr.readyState==4){
if(xhr.status==200){
success();
}else
{
error();
}
}
};
xhr.open(method,url,true);
xhr.send(null);
};
RongUtil.formatProtoclPath=function(config){
var path=config.path;
var protocol=config.protocol;
var tmpl=config.tmpl||'{0}{1}';
var sub=config.sub;
var flag='://';
var index=path.indexOf(flag);
var hasProtocol=index>-1;
if(hasProtocol){
index+=flag.length;
path=path.substring(index);
}
if(sub){
index=path.indexOf('/');
var hasPath=index>-1;
if(hasPath){
path=path.substr(0,index);
}
}
return RongUtil.stringFormat(tmpl,[protocol,path]);
};
;
RongUtil.supportLocalStorage=function(){
var support=false;
if(typeof localStorage=='object'){
try{
var key='RC_TMP_KEY',value='RC_TMP_VAL';
localStorage.setItem(key,value);
var localVal=localStorage.getItem(key);
if(localVal==value){
support=true;
}
}
catch(err){
console.log('localStorage is disabled.');
}
}
return support;
};
/*
            //返回新引用，不破坏原始对象
            rename({n: 'martin'}, {n: 'name'}); => {name: 'martin'}
            rename([{n: 'martin'}, {a: 18}], {n: 'name', a: 'age'});
            => [{name: 'martin'}, {age: 18}]
        */
RongUtil.rename=function(origin,newNames){
var isObject=RongUtil.isObject(origin);
if(isObject){
origin=[origin];
}
origin=JSON.parse(JSON.stringify(origin));
var updateProperty=function updateProperty(val,key,obj){
delete obj[key];
key=newNames[key];
obj[key]=val;
};
RongUtil.forEach(origin,function(item){
RongUtil.forEach(item,function(val,key,obj){
var isRename=key in newNames;
(isRename?updateProperty:RongUtil.noop)(val,key,obj);
});
});
return isObject?origin[0]:origin;
};
RongUtil.some=function(arrs,callback){
var has=false;
for(var i=0,len=arrs.length;i<len;i++){
if(callback(arrs[i])){
has=true;
break;
}
}
return has;
};
RongUtil.keys=function(obj){
var props=[];
for(var key in obj){
props.push(key);
}
return props;
};
RongUtil.isNumber=function(num){
return Object.prototype.toString.call(num)=='[object Number]';
};
RongUtil.getTimestamp=function(){
var date=new Date();
return date.getTime();
};
return RongUtil;
}();
RongIMLib.RongUtil=RongUtil;
/*
        var observer = new RongObserver();
        observer.watch({
            key: 'key',
            func: function(entity){
                
            }
        });
    */
var RongObserver=function(){
function RongObserver(){
this.watchers={};
}
RongObserver.prototype.genUId=function(key){
var time=new Date().getTime();
return[key,time].join('_');
};
RongObserver.prototype.watch=function(params){
var me=this;
var key=params.key;
var multiple=params.multiple;
key=RongUtil.isArray(key)?key:[key];
var func=params.func;
RongUtil.forEach(key,function(k){
k=multiple?me.genUId(k):k;
me.watchers[k]=func;
});
};
RongObserver.prototype.notify=function(params){
var me=this;
var key=params.key;
var entity=params.entity;
for(var k in me.watchers){
var isNotify=k.indexOf(key)==0;
if(isNotify){
me.watchers[k](entity);
}
}
};
RongObserver.prototype.remove=function(){
};
return RongObserver;
}();
RongIMLib.RongObserver=RongObserver;
var Timer=function(){
function Timer(config){
this.timeout=0;
this.timer=null;
this.timeout=config.timeout;
}
Timer.prototype.resume=function(callback){
this.timer=setTimeout(callback,this.timeout);
};
Timer.prototype.pause=function(){
clearTimeout(this.timer);
};
return Timer;
}();
RongIMLib.Timer=Timer;
var InnerUtil=function(){
function InnerUtil(){
}
InnerUtil.getUId=function(token){
return md5(token).slice(8,16);
};
return InnerUtil;
}();
RongIMLib.InnerUtil=InnerUtil;
})(RongIMLib||(RongIMLib={}));

/*
    说明: 请勿修改 header.js 和 footer.js
    用途: 自动拼接暴露方式
    命令: grunt release 中 concat
*/
return RongIMLib;
});

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\朋友圈\\static\\protobuf-2.3.4.min.js":
/*!***********************************************************************!*\
  !*** C:/Users/Administrator/Desktop/朋友圈/static/protobuf-2.3.4.min.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (c, d) {if (true) {!(__WEBPACK_AMD_DEFINE_FACTORY__ = (d),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));} else {}})(void 0, function (a) {var d = function () {function E(an, ap, ao) {this.low = an | 0;this.high = ap | 0;this.unsigned = !!ao;}E.prototype.__isLong__;Object.defineProperty(E.prototype, "__isLong__", { value: true, enumerable: false, configurable: false });function k(an) {return (an && an.__isLong__) === true;}E.isLong = k;var aa = {};var M = {};function ah(ap, ao) {var aq, ar, an;if (ao) {ap >>>= 0;if (an = 0 <= ap && ap < 256) {ar = M[ap];if (ar) {return ar;}}aq = S(ap, (ap | 0) < 0 ? -1 : 0, true);if (an) {M[ap] = aq;}return aq;} else {ap |= 0;if (an = -128 <= ap && ap < 128) {ar = aa[ap];if (ar) {return ar;}}aq = S(ap, ap < 0 ? -1 : 0, false);if (an) {aa[ap] = aq;}return aq;}}E.fromInt = ah;function q(ao, an) {if (isNaN(ao) || !isFinite(ao)) {return an ? m : F;}if (an) {if (ao < 0) {return m;}if (ao >= h) {return D;}} else {if (ao <= -C) {return T;}if (ao + 1 >= C) {return b;}}if (ao < 0) {return q(-ao, an).neg();}return S(ao % i | 0, ao / i | 0, an);}E.fromNumber = q;function S(an, ap, ao) {return new E(an, ap, ao);}E.fromBits = S;var B = Math.pow;function L(ar, ap, at) {if (ar.length === 0) {throw Error("empty string");}if (ar === "NaN" || ar === "Infinity" || ar === "+Infinity" || ar === "-Infinity") {return F;}if (typeof ap === "number") {at = ap, ap = false;} else {ap = !!ap;}at = at || 10;if (at < 2 || 36 < at) {throw RangeError("radix");}var ao;if ((ao = ar.indexOf("-")) > 0) {throw Error("interior hyphen");} else {if (ao === 0) {return L(ar.substring(1), ap, at).neg();}}var av = q(B(at, 8));var ax = F;for (var aq = 0; aq < ar.length; aq += 8) {var aw = Math.min(8, ar.length - aq),au = parseInt(ar.substring(aq, aq + aw), at);if (aw < 8) {var an = q(B(at, aw));ax = ax.mul(an).add(q(au));} else {ax = ax.mul(av);ax = ax.add(q(au));}}ax.unsigned = ap;return ax;}E.fromString = L;function K(an) {if (an instanceof E) {return an;}if (typeof an === "number") {return q(an);}if (typeof an === "string") {return L(an);}return S(an.low, an.high, an.unsigned);}E.fromValue = K;var ai = 1 << 16;var al = 1 << 24;var i = ai * ai;var h = i * i;var C = h / 2;var u = ah(al);var F = ah(0);E.ZERO = F;var m = ah(0, true);E.UZERO = m;var W = ah(1);E.ONE = W;var O = ah(1, true);E.UONE = O;var f = ah(-1);E.NEG_ONE = f;var b = S(4294967295 | 0, 2147483647 | 0, false);E.MAX_VALUE = b;var D = S(4294967295 | 0, 4294967295 | 0, true);E.MAX_UNSIGNED_VALUE = D;var T = S(0, 2147483648 | 0, false);E.MIN_VALUE = T;var z = E.prototype;z.toInt = function v() {return this.unsigned ? this.low >>> 0 : this.low;};z.toNumber = function ae() {if (this.unsigned) {return (this.high >>> 0) * i + (this.low >>> 0);}return this.high * i + (this.low >>> 0);};z.toString = function n(at) {at = at || 10;if (at < 2 || 36 < at) {throw RangeError("radix");}if (this.isZero()) {return "0";}if (this.isNegative()) {if (this.eq(T)) {var aq = q(at),an = this.div(aq),ap = an.mul(aq).sub(this);return an.toString(at) + ap.toInt().toString(at);} else {return "-" + this.neg().toString(at);}}var aw = q(B(at, 6), this.unsigned),av = this;var ax = "";while (true) {var au = av.div(aw),ar = av.sub(au.mul(aw)).toInt() >>> 0,ao = ar.toString(at);av = au;if (av.isZero()) {return ao + ax;} else {while (ao.length < 6) {ao = "0" + ao;}ax = "" + ao + ax;}}};z.getHighBits = function af() {return this.high;};z.getHighBitsUnsigned = function p() {return this.high >>> 0;};z.getLowBits = function y() {return this.low;};z.getLowBitsUnsigned = function U() {return this.low >>> 0;};z.getNumBitsAbs = function aj() {if (this.isNegative()) {return this.eq(T) ? 64 : this.neg().getNumBitsAbs();}var ao = this.high != 0 ? this.high : this.low;for (var an = 31; an > 0; an--) {if ((ao & 1 << an) != 0) {break;}}return this.high != 0 ? an + 33 : an + 1;};z.isZero = function R() {return this.high === 0 && this.low === 0;};z.isNegative = function X() {return !this.unsigned && this.high < 0;};z.isPositive = function ad() {return this.unsigned || this.high >= 0;};z.isOdd = function V() {return (this.low & 1) === 1;};z.isEven = function x() {return (this.low & 1) === 0;};z.equals = function N(an) {if (!k(an)) {an = K(an);}if (this.unsigned !== an.unsigned && this.high >>> 31 === 1 && an.high >>> 31 === 1) {return false;}return this.high === an.high && this.low === an.low;};z.eq = z.equals;z.notEquals = function ag(an) {return !this.eq(an);};z.neq = z.notEquals;z.lessThan = function t(an) {return this.comp(an) < 0;};z.lt = z.lessThan;z.lessThanOrEqual = function Z(an) {return this.comp(an) <= 0;};z.lte = z.lessThanOrEqual;z.greaterThan = function o(an) {return this.comp(an) > 0;};z.gt = z.greaterThan;z.greaterThanOrEqual = function Q(an) {return this.comp(an) >= 0;};z.gte = z.greaterThanOrEqual;z.compare = function s(ao) {if (!k(ao)) {ao = K(ao);}if (this.eq(ao)) {return 0;}var an = this.isNegative(),ap = ao.isNegative();if (an && !ap) {return -1;}if (!an && ap) {return 1;}if (!this.unsigned) {return this.sub(ao).isNegative() ? -1 : 1;}return ao.high >>> 0 > this.high >>> 0 || ao.high === this.high && ao.low >>> 0 > this.low >>> 0 ? -1 : 1;};z.comp = z.compare;z.negate = function w() {if (!this.unsigned && this.eq(T)) {return T;}return this.not().add(W);};z.neg = z.negate;z.add = function j(aq) {if (!k(aq)) {aq = K(aq);}var au = this.high >>> 16;var ao = this.high & 65535;var aw = this.low >>> 16;var ap = this.low & 65535;var ay = aq.high >>> 16;var ar = aq.high & 65535;var az = aq.low >>> 16;var at = aq.low & 65535;var aA = 0,av = 0,an = 0,ax = 0;ax += ap + at;an += ax >>> 16;ax &= 65535;an += aw + az;av += an >>> 16;an &= 65535;av += ao + ar;aA += av >>> 16;av &= 65535;aA += au + ay;aA &= 65535;return S(an << 16 | ax, aA << 16 | av, this.unsigned);};z.subtract = function r(an) {if (!k(an)) {an = K(an);}return this.add(an.neg());};z.sub = z.subtract;z.multiply = function I(az) {if (this.isZero()) {return F;}if (!k(az)) {az = K(az);}if (az.isZero()) {return F;}if (this.eq(T)) {return az.isOdd() ? T : F;}if (az.eq(T)) {return this.isOdd() ? T : F;}if (this.isNegative()) {if (az.isNegative()) {return this.neg().mul(az.neg());} else {return this.neg().mul(az).neg();}} else {if (az.isNegative()) {return this.mul(az.neg()).neg();}}if (this.lt(u) && az.lt(u)) {return q(this.toNumber() * az.toNumber(), this.unsigned);}var at = this.high >>> 16;var ao = this.high & 65535;var av = this.low >>> 16;var ap = this.low & 65535;var ax = az.high >>> 16;var aq = az.high & 65535;var ay = az.low >>> 16;var ar = az.low & 65535;var aA = 0,au = 0,an = 0,aw = 0;aw += ap * ar;an += aw >>> 16;aw &= 65535;an += av * ar;au += an >>> 16;an &= 65535;an += ap * ay;au += an >>> 16;an &= 65535;au += ao * ar;aA += au >>> 16;au &= 65535;au += av * ay;aA += au >>> 16;au &= 65535;au += ap * aq;aA += au >>> 16;au &= 65535;aA += at * ar + ao * ay + av * aq + ap * ax;aA &= 65535;return S(an << 16 | aw, aA << 16 | au, this.unsigned);};z.mul = z.multiply;z.divide = function J(an) {if (!k(an)) {an = K(an);}if (an.isZero()) {throw Error("division by zero");}if (this.isZero()) {return this.unsigned ? m : F;}var at, av, aq;if (!this.unsigned) {if (this.eq(T)) {if (an.eq(W) || an.eq(f)) {return T;} else {if (an.eq(T)) {return W;} else {var ao = this.shr(1);at = ao.div(an).shl(1);if (at.eq(F)) {return an.isNegative() ? W : f;} else {av = this.sub(an.mul(at));aq = at.add(av.div(an));return aq;}}}} else {if (an.eq(T)) {return this.unsigned ? m : F;}}if (this.isNegative()) {if (an.isNegative()) {return this.neg().div(an.neg());}return this.neg().div(an).neg();} else {if (an.isNegative()) {return this.div(an.neg()).neg();}}aq = F;} else {if (!an.unsigned) {an = an.toUnsigned();}if (an.gt(this)) {return m;}if (an.gt(this.shru(1))) {return O;}aq = m;}av = this;while (av.gte(an)) {at = Math.max(1, Math.floor(av.toNumber() / an.toNumber()));var aw = Math.ceil(Math.log(at) / Math.LN2),au = aw <= 48 ? 1 : B(2, aw - 48),ap = q(at),ar = ap.mul(an);while (ar.isNegative() || ar.gt(av)) {at -= au;ap = q(at, this.unsigned);ar = ap.mul(an);}if (ap.isZero()) {ap = W;}aq = aq.add(ap);av = av.sub(ar);}return aq;};z.div = z.divide;z.modulo = function ak(an) {if (!k(an)) {an = K(an);}return this.sub(this.div(an).mul(an));};z.mod = z.modulo;z.not = function ac() {return S(~this.low, ~this.high, this.unsigned);};z.and = function ab(an) {if (!k(an)) {an = K(an);}return S(this.low & an.low, this.high & an.high, this.unsigned);};z.or = function P(an) {if (!k(an)) {an = K(an);}return S(this.low | an.low, this.high | an.high, this.unsigned);};z.xor = function Y(an) {if (!k(an)) {an = K(an);}return S(this.low ^ an.low, this.high ^ an.high, this.unsigned);};z.shiftLeft = function A(an) {if (k(an)) {an = an.toInt();}if ((an &= 63) === 0) {return this;} else {if (an < 32) {return S(this.low << an, this.high << an | this.low >>> 32 - an, this.unsigned);} else {return S(0, this.low << an - 32, this.unsigned);}}};z.shl = z.shiftLeft;z.shiftRight = function l(an) {if (k(an)) {an = an.toInt();}if ((an &= 63) === 0) {return this;} else {if (an < 32) {return S(this.low >>> an | this.high << 32 - an, this.high >> an, this.unsigned);} else {return S(this.high >> an - 32, this.high >= 0 ? 0 : -1, this.unsigned);}}};z.shr = z.shiftRight;z.shiftRightUnsigned = function G(ap) {if (k(ap)) {ap = ap.toInt();}ap &= 63;if (ap === 0) {return this;} else {var ao = this.high;if (ap < 32) {var an = this.low;return S(an >>> ap | ao << 32 - ap, ao >>> ap, this.unsigned);} else {if (ap === 32) {return S(ao, 0, this.unsigned);} else {return S(ao >>> ap - 32, 0, this.unsigned);}}}};z.shru = z.shiftRightUnsigned;z.toSigned = function am() {if (!this.unsigned) {return this;}return S(this.low, this.high, false);};z.toUnsigned = function H() {if (this.unsigned) {return this;}return S(this.low, this.high, true);};z.toBytes = function (an) {return an ? this.toBytesLE() : this.toBytesBE();};z.toBytesLE = function () {var an = this.high,ao = this.low;return [ao & 255, ao >>> 8 & 255, ao >>> 16 & 255, ao >>> 24 & 255, an & 255, an >>> 8 & 255, an >>> 16 & 255, an >>> 24 & 255];};z.toBytesBE = function () {var an = this.high,ao = this.low;return [an >>> 24 & 255, an >>> 16 & 255, an >>> 8 & 255, an & 255, ao >>> 24 & 255, ao >>> 16 & 255, ao >>> 8 & 255, ao & 255];};return E;}();var c = function (k) {var n = function n(q, s, r) {if (typeof q === "undefined") {q = n.DEFAULT_CAPACITY;}if (typeof s === "undefined") {s = n.DEFAULT_ENDIAN;}if (typeof r === "undefined") {r = n.DEFAULT_NOASSERT;}if (!r) {q = q | 0;if (q < 0) {throw RangeError("Illegal capacity");}s = !!s;r = !!r;}this.buffer = q === 0 ? p : new ArrayBuffer(q);this.view = q === 0 ? null : new Uint8Array(this.buffer);this.offset = 0;this.markedOffset = -1;this.limit = q;this.littleEndian = s;this.noAssert = r;};n.VERSION = "5.0.1";n.LITTLE_ENDIAN = true;n.BIG_ENDIAN = false;n.DEFAULT_CAPACITY = 16;n.DEFAULT_ENDIAN = n.BIG_ENDIAN;n.DEFAULT_NOASSERT = false;n.Long = k || null;var l = n.prototype;l.__isByteBuffer__;Object.defineProperty(l, "__isByteBuffer__", { value: true, enumerable: false, configurable: false });var p = new ArrayBuffer(0);var m = String.fromCharCode;function b(r) {var q = 0;return function () {return q < r.length ? r.charCodeAt(q++) : null;};}function f() {var q = [],r = [];return function () {if (arguments.length === 0) {return r.join("") + m.apply(String, q);}if (q.length + arguments.length > 1024) {r.push(m.apply(String, q)), q.length = 0;}Array.prototype.push.apply(q, arguments);};}n.accessor = function () {return Uint8Array;};n.allocate = function (q, s, r) {return new n(q, s, r);};n.concat = function (z, s, r, y) {if (typeof s === "boolean" || typeof s !== "string") {y = r;r = s;s = undefined;}var q = 0;for (var w = 0, v = z.length, t; w < v; ++w) {if (!n.isByteBuffer(z[w])) {z[w] = n.wrap(z[w], s);}t = z[w].limit - z[w].offset;if (t > 0) {q += t;}}if (q === 0) {return new n(0, r, y);}var x = new n(q, r, y),u;w = 0;while (w < v) {u = z[w++];t = u.limit - u.offset;if (t <= 0) {continue;}x.view.set(u.view.subarray(u.offset, u.limit), x.offset);x.offset += t;}x.limit = x.offset;x.offset = 0;return x;};n.isByteBuffer = function (q) {return (q && q.__isByteBuffer__) === true;};n.type = function () {return ArrayBuffer;};n.wrap = function (q, s, u, t) {if (typeof s !== "string") {t = u;u = s;s = undefined;}if (typeof q === "string") {if (typeof s === "undefined") {s = "utf8";}switch (s) {case "base64":return n.fromBase64(q, u);case "hex":return n.fromHex(q, u);case "binary":return n.fromBinary(q, u);case "utf8":return n.fromUTF8(q, u);case "debug":return n.fromDebug(q, u);default:throw Error("Unsupported encoding: " + s);}}if (q === null || typeof q !== "object") {throw TypeError("Illegal buffer");}var v;if (n.isByteBuffer(q)) {v = l.clone.call(q);v.markedOffset = -1;return v;}if (q instanceof Uint8Array) {v = new n(0, u, t);if (q.length > 0) {v.buffer = q.buffer;v.offset = q.byteOffset;v.limit = q.byteOffset + q.byteLength;v.view = new Uint8Array(q.buffer);}} else {if (q instanceof ArrayBuffer) {v = new n(0, u, t);if (q.byteLength > 0) {v.buffer = q;v.offset = 0;v.limit = q.byteLength;v.view = q.byteLength > 0 ? new Uint8Array(q) : null;}} else {if (Object.prototype.toString.call(q) === "[object Array]") {v = new n(q.length, u, t);v.limit = q.length;for (var r = 0; r < q.length; ++r) {v.view[r] = q[r];}} else {throw TypeError("Illegal buffer");}}}return v;};l.writeBitSet = function (w, u) {var q = typeof u === "undefined";if (q) {u = this.offset;}if (!this.noAssert) {if (!(w instanceof Array)) {throw TypeError("Illegal BitSet: Not an array");}if (typeof u !== "number" || u % 1 !== 0) {throw TypeError("Illegal offset: " + u + " (not an integer)");}u >>>= 0;if (u < 0 || u + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + u + " (+" + 0 + ") <= " + this.buffer.byteLength);}}var r = u,x = w.length,y = x >> 3,v = 0,t;u += this.writeVarint32(x, u);while (y--) {t = !!w[v++] & 1 | (!!w[v++] & 1) << 1 | (!!w[v++] & 1) << 2 | (!!w[v++] & 1) << 3 | (!!w[v++] & 1) << 4 | (!!w[v++] & 1) << 5 | (!!w[v++] & 1) << 6 | (!!w[v++] & 1) << 7;this.writeByte(t, u++);}if (v < x) {var s = 0;t = 0;while (v < x) {t = t | (!!w[v++] & 1) << s++;}this.writeByte(t, u++);}if (q) {this.offset = u;return this;}return u - r;};l.readBitSet = function (t) {var q = typeof t === "undefined";if (q) {t = this.offset;}var u = this.readVarint32(t),x = u.value,y = x >> 3,v = 0,w = [],s;t += u.length;while (y--) {s = this.readByte(t++);w[v++] = !!(s & 1);w[v++] = !!(s & 2);w[v++] = !!(s & 4);w[v++] = !!(s & 8);w[v++] = !!(s & 16);w[v++] = !!(s & 32);w[v++] = !!(s & 64);w[v++] = !!(s & 128);}if (v < x) {var r = 0;s = this.readByte(t++);while (v < x) {w[v++] = !!(s >> r++ & 1);}}if (q) {this.offset = t;}return w;};l.readBytes = function (q, t) {var r = typeof t === "undefined";if (r) {t = this.offset;}if (!this.noAssert) {if (typeof t !== "number" || t % 1 !== 0) {throw TypeError("Illegal offset: " + t + " (not an integer)");}t >>>= 0;if (t < 0 || t + q > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + t + " (+" + q + ") <= " + this.buffer.byteLength);}}var s = this.slice(t, t + q);if (r) {this.offset += q;}return s;};l.writeBytes = l.append;l.writeInt8 = function (s, t) {var r = typeof t === "undefined";if (r) {t = this.offset;}if (!this.noAssert) {if (typeof s !== "number" || s % 1 !== 0) {throw TypeError("Illegal value: " + s + " (not an integer)");}s |= 0;if (typeof t !== "number" || t % 1 !== 0) {throw TypeError("Illegal offset: " + t + " (not an integer)");}t >>>= 0;if (t < 0 || t + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + t + " (+" + 0 + ") <= " + this.buffer.byteLength);}}t += 1;var q = this.buffer.byteLength;if (t > q) {this.resize((q *= 2) > t ? q : t);}t -= 1;this.view[t] = s;if (r) {this.offset += 1;}return this;};l.writeByte = l.writeInt8;l.readInt8 = function (s) {var r = typeof s === "undefined";if (r) {s = this.offset;}if (!this.noAssert) {if (typeof s !== "number" || s % 1 !== 0) {throw TypeError("Illegal offset: " + s + " (not an integer)");}s >>>= 0;if (s < 0 || s + 1 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + s + " (+" + 1 + ") <= " + this.buffer.byteLength);}}var q = this.view[s];if ((q & 128) === 128) {q = -(255 - q + 1);}if (r) {this.offset += 1;}return q;};l.readByte = l.readInt8;l.writeUint8 = function (s, t) {var r = typeof t === "undefined";if (r) {t = this.offset;}if (!this.noAssert) {if (typeof s !== "number" || s % 1 !== 0) {throw TypeError("Illegal value: " + s + " (not an integer)");}s >>>= 0;if (typeof t !== "number" || t % 1 !== 0) {throw TypeError("Illegal offset: " + t + " (not an integer)");}t >>>= 0;if (t < 0 || t + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + t + " (+" + 0 + ") <= " + this.buffer.byteLength);}}t += 1;var q = this.buffer.byteLength;if (t > q) {this.resize((q *= 2) > t ? q : t);}t -= 1;this.view[t] = s;if (r) {this.offset += 1;}return this;};l.writeUInt8 = l.writeUint8;l.readUint8 = function (s) {var r = typeof s === "undefined";if (r) {s = this.offset;}if (!this.noAssert) {if (typeof s !== "number" || s % 1 !== 0) {throw TypeError("Illegal offset: " + s + " (not an integer)");}s >>>= 0;if (s < 0 || s + 1 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + s + " (+" + 1 + ") <= " + this.buffer.byteLength);}}var q = this.view[s];if (r) {this.offset += 1;}return q;};l.readUInt8 = l.readUint8;l.writeInt16 = function (s, t) {var r = typeof t === "undefined";if (r) {t = this.offset;}if (!this.noAssert) {if (typeof s !== "number" || s % 1 !== 0) {throw TypeError("Illegal value: " + s + " (not an integer)");}s |= 0;if (typeof t !== "number" || t % 1 !== 0) {throw TypeError("Illegal offset: " + t + " (not an integer)");}t >>>= 0;if (t < 0 || t + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + t + " (+" + 0 + ") <= " + this.buffer.byteLength);}}t += 2;var q = this.buffer.byteLength;if (t > q) {this.resize((q *= 2) > t ? q : t);}t -= 2;if (this.littleEndian) {this.view[t + 1] = (s & 65280) >>> 8;this.view[t] = s & 255;} else {this.view[t] = (s & 65280) >>> 8;this.view[t + 1] = s & 255;}if (r) {this.offset += 2;}return this;};l.writeShort = l.writeInt16;l.readInt16 = function (s) {var r = typeof s === "undefined";if (r) {s = this.offset;}if (!this.noAssert) {if (typeof s !== "number" || s % 1 !== 0) {throw TypeError("Illegal offset: " + s + " (not an integer)");}s >>>= 0;if (s < 0 || s + 2 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + s + " (+" + 2 + ") <= " + this.buffer.byteLength);}}var q = 0;if (this.littleEndian) {q = this.view[s];q |= this.view[s + 1] << 8;} else {q = this.view[s] << 8;q |= this.view[s + 1];}if ((q & 32768) === 32768) {q = -(65535 - q + 1);}if (r) {this.offset += 2;}return q;};l.readShort = l.readInt16;l.writeUint16 = function (s, t) {var r = typeof t === "undefined";if (r) {t = this.offset;}if (!this.noAssert) {if (typeof s !== "number" || s % 1 !== 0) {throw TypeError("Illegal value: " + s + " (not an integer)");}s >>>= 0;if (typeof t !== "number" || t % 1 !== 0) {throw TypeError("Illegal offset: " + t + " (not an integer)");}t >>>= 0;if (t < 0 || t + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + t + " (+" + 0 + ") <= " + this.buffer.byteLength);}}t += 2;var q = this.buffer.byteLength;if (t > q) {this.resize((q *= 2) > t ? q : t);}t -= 2;if (this.littleEndian) {this.view[t + 1] = (s & 65280) >>> 8;this.view[t] = s & 255;} else {this.view[t] = (s & 65280) >>> 8;this.view[t + 1] = s & 255;}if (r) {this.offset += 2;}return this;};l.writeUInt16 = l.writeUint16;l.readUint16 = function (s) {var r = typeof s === "undefined";if (r) {s = this.offset;}if (!this.noAssert) {if (typeof s !== "number" || s % 1 !== 0) {throw TypeError("Illegal offset: " + s + " (not an integer)");}s >>>= 0;if (s < 0 || s + 2 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + s + " (+" + 2 + ") <= " + this.buffer.byteLength);}}var q = 0;if (this.littleEndian) {q = this.view[s];q |= this.view[s + 1] << 8;} else {q = this.view[s] << 8;q |= this.view[s + 1];}if (r) {this.offset += 2;}return q;};l.readUInt16 = l.readUint16;l.writeInt32 = function (s, t) {var r = typeof t === "undefined";if (r) {t = this.offset;}if (!this.noAssert) {if (typeof s !== "number" || s % 1 !== 0) {throw TypeError("Illegal value: " + s + " (not an integer)");}s |= 0;if (typeof t !== "number" || t % 1 !== 0) {throw TypeError("Illegal offset: " + t + " (not an integer)");}t >>>= 0;if (t < 0 || t + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + t + " (+" + 0 + ") <= " + this.buffer.byteLength);}}t += 4;var q = this.buffer.byteLength;if (t > q) {this.resize((q *= 2) > t ? q : t);}t -= 4;if (this.littleEndian) {this.view[t + 3] = s >>> 24 & 255;this.view[t + 2] = s >>> 16 & 255;this.view[t + 1] = s >>> 8 & 255;this.view[t] = s & 255;} else {this.view[t] = s >>> 24 & 255;this.view[t + 1] = s >>> 16 & 255;this.view[t + 2] = s >>> 8 & 255;this.view[t + 3] = s & 255;}if (r) {this.offset += 4;}return this;};l.writeInt = l.writeInt32;l.readInt32 = function (s) {var r = typeof s === "undefined";if (r) {s = this.offset;}if (!this.noAssert) {if (typeof s !== "number" || s % 1 !== 0) {throw TypeError("Illegal offset: " + s + " (not an integer)");}s >>>= 0;if (s < 0 || s + 4 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + s + " (+" + 4 + ") <= " + this.buffer.byteLength);}}var q = 0;if (this.littleEndian) {q = this.view[s + 2] << 16;q |= this.view[s + 1] << 8;q |= this.view[s];q += this.view[s + 3] << 24 >>> 0;} else {q = this.view[s + 1] << 16;q |= this.view[s + 2] << 8;q |= this.view[s + 3];q += this.view[s] << 24 >>> 0;}q |= 0;if (r) {this.offset += 4;}return q;};l.readInt = l.readInt32;l.writeUint32 = function (s, t) {var r = typeof t === "undefined";if (r) {t = this.offset;}if (!this.noAssert) {if (typeof s !== "number" || s % 1 !== 0) {throw TypeError("Illegal value: " + s + " (not an integer)");}s >>>= 0;if (typeof t !== "number" || t % 1 !== 0) {throw TypeError("Illegal offset: " + t + " (not an integer)");}t >>>= 0;if (t < 0 || t + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + t + " (+" + 0 + ") <= " + this.buffer.byteLength);}}t += 4;var q = this.buffer.byteLength;if (t > q) {this.resize((q *= 2) > t ? q : t);}t -= 4;if (this.littleEndian) {this.view[t + 3] = s >>> 24 & 255;this.view[t + 2] = s >>> 16 & 255;this.view[t + 1] = s >>> 8 & 255;this.view[t] = s & 255;} else {this.view[t] = s >>> 24 & 255;this.view[t + 1] = s >>> 16 & 255;this.view[t + 2] = s >>> 8 & 255;this.view[t + 3] = s & 255;}if (r) {this.offset += 4;}return this;};l.writeUInt32 = l.writeUint32;l.readUint32 = function (s) {var r = typeof s === "undefined";if (r) {s = this.offset;}if (!this.noAssert) {if (typeof s !== "number" || s % 1 !== 0) {throw TypeError("Illegal offset: " + s + " (not an integer)");}s >>>= 0;if (s < 0 || s + 4 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + s + " (+" + 4 + ") <= " + this.buffer.byteLength);}}var q = 0;if (this.littleEndian) {q = this.view[s + 2] << 16;q |= this.view[s + 1] << 8;q |= this.view[s];q += this.view[s + 3] << 24 >>> 0;} else {q = this.view[s + 1] << 16;q |= this.view[s + 2] << 8;q |= this.view[s + 3];q += this.view[s] << 24 >>> 0;}if (r) {this.offset += 4;}return q;};l.readUInt32 = l.readUint32;if (k) {l.writeInt64 = function (t, u) {var s = typeof u === "undefined";if (s) {u = this.offset;}if (!this.noAssert) {if (typeof t === "number") {t = k.fromNumber(t);} else {if (typeof t === "string") {t = k.fromString(t);} else {if (!(t && t instanceof k)) {throw TypeError("Illegal value: " + t + " (not an integer or Long)");}}}if (typeof u !== "number" || u % 1 !== 0) {throw TypeError("Illegal offset: " + u + " (not an integer)");}u >>>= 0;if (u < 0 || u + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + u + " (+" + 0 + ") <= " + this.buffer.byteLength);}}if (typeof t === "number") {t = k.fromNumber(t);} else {if (typeof t === "string") {t = k.fromString(t);}}u += 8;var v = this.buffer.byteLength;if (u > v) {this.resize((v *= 2) > u ? v : u);}u -= 8;var r = t.low,q = t.high;if (this.littleEndian) {this.view[u + 3] = r >>> 24 & 255;this.view[u + 2] = r >>> 16 & 255;this.view[u + 1] = r >>> 8 & 255;this.view[u] = r & 255;u += 4;this.view[u + 3] = q >>> 24 & 255;this.view[u + 2] = q >>> 16 & 255;this.view[u + 1] = q >>> 8 & 255;this.view[u] = q & 255;} else {this.view[u] = q >>> 24 & 255;this.view[u + 1] = q >>> 16 & 255;this.view[u + 2] = q >>> 8 & 255;this.view[u + 3] = q & 255;u += 4;this.view[u] = r >>> 24 & 255;this.view[u + 1] = r >>> 16 & 255;this.view[u + 2] = r >>> 8 & 255;this.view[u + 3] = r & 255;}if (s) {this.offset += 8;}return this;};l.writeLong = l.writeInt64;l.readInt64 = function (u) {var t = typeof u === "undefined";if (t) {u = this.offset;}if (!this.noAssert) {if (typeof u !== "number" || u % 1 !== 0) {throw TypeError("Illegal offset: " + u + " (not an integer)");}u >>>= 0;if (u < 0 || u + 8 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + u + " (+" + 8 + ") <= " + this.buffer.byteLength);}}var r = 0,q = 0;if (this.littleEndian) {r = this.view[u + 2] << 16;r |= this.view[u + 1] << 8;r |= this.view[u];r += this.view[u + 3] << 24 >>> 0;u += 4;q = this.view[u + 2] << 16;q |= this.view[u + 1] << 8;q |= this.view[u];q += this.view[u + 3] << 24 >>> 0;} else {q = this.view[u + 1] << 16;q |= this.view[u + 2] << 8;q |= this.view[u + 3];q += this.view[u] << 24 >>> 0;u += 4;r = this.view[u + 1] << 16;r |= this.view[u + 2] << 8;r |= this.view[u + 3];r += this.view[u] << 24 >>> 0;}var s = new k(r, q, false);if (t) {this.offset += 8;}return s;};l.readLong = l.readInt64;l.writeUint64 = function (t, v) {var s = typeof v === "undefined";if (s) {v = this.offset;}if (!this.noAssert) {if (typeof t === "number") {t = k.fromNumber(t);} else {if (typeof t === "string") {t = k.fromString(t);} else {if (!(t && t instanceof k)) {throw TypeError("Illegal value: " + t + " (not an integer or Long)");}}}if (typeof v !== "number" || v % 1 !== 0) {throw TypeError("Illegal offset: " + v + " (not an integer)");}v >>>= 0;if (v < 0 || v + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + v + " (+" + 0 + ") <= " + this.buffer.byteLength);}}if (typeof t === "number") {t = k.fromNumber(t);} else {if (typeof t === "string") {t = k.fromString(t);}}v += 8;var u = this.buffer.byteLength;if (v > u) {this.resize((u *= 2) > v ? u : v);}v -= 8;var r = t.low,q = t.high;if (this.littleEndian) {this.view[v + 3] = r >>> 24 & 255;this.view[v + 2] = r >>> 16 & 255;this.view[v + 1] = r >>> 8 & 255;this.view[v] = r & 255;v += 4;this.view[v + 3] = q >>> 24 & 255;this.view[v + 2] = q >>> 16 & 255;this.view[v + 1] = q >>> 8 & 255;this.view[v] = q & 255;} else {this.view[v] = q >>> 24 & 255;this.view[v + 1] = q >>> 16 & 255;this.view[v + 2] = q >>> 8 & 255;this.view[v + 3] = q & 255;v += 4;this.view[v] = r >>> 24 & 255;this.view[v + 1] = r >>> 16 & 255;this.view[v + 2] = r >>> 8 & 255;this.view[v + 3] = r & 255;}if (s) {this.offset += 8;}return this;};l.writeUInt64 = l.writeUint64;l.readUint64 = function (u) {var t = typeof u === "undefined";if (t) {u = this.offset;}if (!this.noAssert) {if (typeof u !== "number" || u % 1 !== 0) {throw TypeError("Illegal offset: " + u + " (not an integer)");}u >>>= 0;if (u < 0 || u + 8 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + u + " (+" + 8 + ") <= " + this.buffer.byteLength);}}var r = 0,q = 0;if (this.littleEndian) {r = this.view[u + 2] << 16;r |= this.view[u + 1] << 8;r |= this.view[u];r += this.view[u + 3] << 24 >>> 0;u += 4;q = this.view[u + 2] << 16;q |= this.view[u + 1] << 8;q |= this.view[u];q += this.view[u + 3] << 24 >>> 0;} else {q = this.view[u + 1] << 16;q |= this.view[u + 2] << 8;q |= this.view[u + 3];q += this.view[u] << 24 >>> 0;u += 4;r = this.view[u + 1] << 16;r |= this.view[u + 2] << 8;r |= this.view[u + 3];r += this.view[u] << 24 >>> 0;}var s = new k(r, q, true);if (t) {this.offset += 8;}return s;};l.readUInt64 = l.readUint64;}function i(x, w, t, r, A) {var B,v,u = A * 8 - r - 1,z = (1 << u) - 1,q = z >> 1,D = -7,y = t ? A - 1 : 0,C = t ? -1 : 1,E = x[w + y];y += C;B = E & (1 << -D) - 1;E >>= -D;D += u;for (; D > 0; B = B * 256 + x[w + y], y += C, D -= 8) {}v = B & (1 << -D) - 1;B >>= -D;D += r;for (; D > 0; v = v * 256 + x[w + y], y += C, D -= 8) {}if (B === 0) {B = 1 - q;} else {if (B === z) {return v ? NaN : (E ? -1 : 1) * Infinity;} else {v = v + Math.pow(2, r);B = B - q;}}return (E ? -1 : 1) * v * Math.pow(2, B - r);}function j(y, F, x, t, r, B) {var C,v,E,u = B * 8 - r - 1,A = (1 << u) - 1,q = A >> 1,w = r === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0,z = t ? 0 : B - 1,D = t ? 1 : -1,G = F < 0 || F === 0 && 1 / F < 0 ? 1 : 0;F = Math.abs(F);if (isNaN(F) || F === Infinity) {v = isNaN(F) ? 1 : 0;C = A;} else {C = Math.floor(Math.log(F) / Math.LN2);if (F * (E = Math.pow(2, -C)) < 1) {C--;E *= 2;}if (C + q >= 1) {F += w / E;} else {F += w * Math.pow(2, 1 - q);}if (F * E >= 2) {C++;E /= 2;}if (C + q >= A) {v = 0;C = A;} else {if (C + q >= 1) {v = (F * E - 1) * Math.pow(2, r);C = C + q;} else {v = F * Math.pow(2, q - 1) * Math.pow(2, r);C = 0;}}}for (; r >= 8; y[x + z] = v & 255, z += D, v /= 256, r -= 8) {}C = C << r | v;u += r;for (; u > 0; y[x + z] = C & 255, z += D, C /= 256, u -= 8) {}y[x + z - D] |= G * 128;}l.writeFloat32 = function (r, t) {var q = typeof t === "undefined";if (q) {t = this.offset;}if (!this.noAssert) {if (typeof r !== "number") {throw TypeError("Illegal value: " + r + " (not a number)");}if (typeof t !== "number" || t % 1 !== 0) {throw TypeError("Illegal offset: " + t + " (not an integer)");}t >>>= 0;if (t < 0 || t + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + t + " (+" + 0 + ") <= " + this.buffer.byteLength);}}t += 4;var s = this.buffer.byteLength;if (t > s) {this.resize((s *= 2) > t ? s : t);}t -= 4;j(this.view, r, t, this.littleEndian, 23, 4);if (q) {this.offset += 4;}return this;};l.writeFloat = l.writeFloat32;l.readFloat32 = function (s) {var r = typeof s === "undefined";if (r) {s = this.offset;}if (!this.noAssert) {if (typeof s !== "number" || s % 1 !== 0) {throw TypeError("Illegal offset: " + s + " (not an integer)");}s >>>= 0;if (s < 0 || s + 4 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + s + " (+" + 4 + ") <= " + this.buffer.byteLength);}}var q = i(this.view, s, this.littleEndian, 23, 4);if (r) {this.offset += 4;}return q;};l.readFloat = l.readFloat32;l.writeFloat64 = function (s, t) {var r = typeof t === "undefined";if (r) {t = this.offset;}if (!this.noAssert) {if (typeof s !== "number") {throw TypeError("Illegal value: " + s + " (not a number)");}if (typeof t !== "number" || t % 1 !== 0) {throw TypeError("Illegal offset: " + t + " (not an integer)");}t >>>= 0;if (t < 0 || t + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + t + " (+" + 0 + ") <= " + this.buffer.byteLength);}}t += 8;var q = this.buffer.byteLength;if (t > q) {this.resize((q *= 2) > t ? q : t);}t -= 8;j(this.view, s, t, this.littleEndian, 52, 8);if (r) {this.offset += 8;}return this;};l.writeDouble = l.writeFloat64;l.readFloat64 = function (s) {var r = typeof s === "undefined";if (r) {s = this.offset;}if (!this.noAssert) {if (typeof s !== "number" || s % 1 !== 0) {throw TypeError("Illegal offset: " + s + " (not an integer)");}s >>>= 0;if (s < 0 || s + 8 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + s + " (+" + 8 + ") <= " + this.buffer.byteLength);}}var q = i(this.view, s, this.littleEndian, 52, 8);if (r) {this.offset += 8;}return q;};l.readDouble = l.readFloat64;n.MAX_VARINT32_BYTES = 5;n.calculateVarint32 = function (q) {q = q >>> 0;if (q < 1 << 7) {return 1;} else {if (q < 1 << 14) {return 2;} else {if (q < 1 << 21) {return 3;} else {if (q < 1 << 28) {return 4;} else {return 5;}}}}};n.zigZagEncode32 = function (q) {return ((q |= 0) << 1 ^ q >> 31) >>> 0;};n.zigZagDecode32 = function (q) {return q >>> 1 ^ -(q & 1) | 0;};l.writeVarint32 = function (u, v) {var t = typeof v === "undefined";if (t) {v = this.offset;}if (!this.noAssert) {if (typeof u !== "number" || u % 1 !== 0) {throw TypeError("Illegal value: " + u + " (not an integer)");}u |= 0;if (typeof v !== "number" || v % 1 !== 0) {throw TypeError("Illegal offset: " + v + " (not an integer)");}v >>>= 0;if (v < 0 || v + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + v + " (+" + 0 + ") <= " + this.buffer.byteLength);}}var r = n.calculateVarint32(u),q;v += r;var s = this.buffer.byteLength;if (v > s) {this.resize((s *= 2) > v ? s : v);}v -= r;u >>>= 0;while (u >= 128) {q = u & 127 | 128;this.view[v++] = q;u >>>= 7;}this.view[v++] = u;if (t) {this.offset = v;return this;}return r;};l.writeVarint32ZigZag = function (q, r) {return this.writeVarint32(n.zigZagEncode32(q), r);};l.readVarint32 = function (u) {var t = typeof u === "undefined";if (t) {u = this.offset;}if (!this.noAssert) {if (typeof u !== "number" || u % 1 !== 0) {throw TypeError("Illegal offset: " + u + " (not an integer)");}u >>>= 0;if (u < 0 || u + 1 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + u + " (+" + 1 + ") <= " + this.buffer.byteLength);}}var v = 0,s = 0 >>> 0,q;do {if (!this.noAssert && u > this.limit) {var r = Error("Truncated");r.truncated = true;throw r;}q = this.view[u++];if (v < 5) {s |= (q & 127) << 7 * v;}++v;} while ((q & 128) !== 0);s |= 0;if (t) {this.offset = u;return s;}return { value: s, length: v };};l.readVarint32ZigZag = function (r) {var q = this.readVarint32(r);if (typeof q === "object") {q.value = n.zigZagDecode32(q.value);} else {q = n.zigZagDecode32(q);}return q;};if (k) {n.MAX_VARINT64_BYTES = 10;n.calculateVarint64 = function (r) {if (typeof r === "number") {r = k.fromNumber(r);} else {if (typeof r === "string") {r = k.fromString(r);}}var t = r.toInt() >>> 0,s = r.shiftRightUnsigned(28).toInt() >>> 0,q = r.shiftRightUnsigned(56).toInt() >>> 0;if (q == 0) {if (s == 0) {if (t < 1 << 14) {return t < 1 << 7 ? 1 : 2;} else {return t < 1 << 21 ? 3 : 4;}} else {if (s < 1 << 14) {return s < 1 << 7 ? 5 : 6;} else {return s < 1 << 21 ? 7 : 8;}}} else {return q < 1 << 7 ? 9 : 10;}};n.zigZagEncode64 = function (q) {if (typeof q === "number") {q = k.fromNumber(q, false);} else {if (typeof q === "string") {q = k.fromString(q, false);} else {if (q.unsigned !== false) {q = q.toSigned();}}}return q.shiftLeft(1).xor(q.shiftRight(63)).toUnsigned();};n.zigZagDecode64 = function (q) {if (typeof q === "number") {q = k.fromNumber(q, false);} else {if (typeof q === "string") {q = k.fromString(q, false);} else {if (q.unsigned !== false) {q = q.toSigned();}}}return q.shiftRightUnsigned(1).xor(q.and(k.ONE).toSigned().negate()).toSigned();};l.writeVarint64 = function (u, x) {var t = typeof x === "undefined";if (t) {x = this.offset;}if (!this.noAssert) {if (typeof u === "number") {u = k.fromNumber(u);} else {if (typeof u === "string") {u = k.fromString(u);} else {if (!(u && u instanceof k)) {throw TypeError("Illegal value: " + u + " (not an integer or Long)");}}}if (typeof x !== "number" || x % 1 !== 0) {throw TypeError("Illegal offset: " + x + " (not an integer)");}x >>>= 0;if (x < 0 || x + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + x + " (+" + 0 + ") <= " + this.buffer.byteLength);}}if (typeof u === "number") {u = k.fromNumber(u, false);} else {if (typeof u === "string") {u = k.fromString(u, false);} else {if (u.unsigned !== false) {u = u.toSigned();}}}var q = n.calculateVarint64(u),w = u.toInt() >>> 0,v = u.shiftRightUnsigned(28).toInt() >>> 0,s = u.shiftRightUnsigned(56).toInt() >>> 0;x += q;var r = this.buffer.byteLength;if (x > r) {this.resize((r *= 2) > x ? r : x);}x -= q;switch (q) {case 10:this.view[x + 9] = s >>> 7 & 1;case 9:this.view[x + 8] = q !== 9 ? s | 128 : s & 127;case 8:this.view[x + 7] = q !== 8 ? v >>> 21 | 128 : v >>> 21 & 127;case 7:this.view[x + 6] = q !== 7 ? v >>> 14 | 128 : v >>> 14 & 127;case 6:this.view[x + 5] = q !== 6 ? v >>> 7 | 128 : v >>> 7 & 127;case 5:this.view[x + 4] = q !== 5 ? v | 128 : v & 127;case 4:this.view[x + 3] = q !== 4 ? w >>> 21 | 128 : w >>> 21 & 127;case 3:this.view[x + 2] = q !== 3 ? w >>> 14 | 128 : w >>> 14 & 127;case 2:this.view[x + 1] = q !== 2 ? w >>> 7 | 128 : w >>> 7 & 127;case 1:this.view[x] = q !== 1 ? w | 128 : w & 127;}if (t) {this.offset += q;return this;} else {return q;}};l.writeVarint64ZigZag = function (q, r) {return this.writeVarint64(n.zigZagEncode64(q), r);};l.readVarint64 = function (w) {var t = typeof w === "undefined";if (t) {w = this.offset;}if (!this.noAssert) {if (typeof w !== "number" || w % 1 !== 0) {throw TypeError("Illegal offset: " + w + " (not an integer)");}w >>>= 0;if (w < 0 || w + 1 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + w + " (+" + 1 + ") <= " + this.buffer.byteLength);}}var x = w,v = 0,u = 0,s = 0,q = 0;q = this.view[w++];v = q & 127;if (q & 128) {q = this.view[w++];v |= (q & 127) << 7;if (q & 128 || this.noAssert && typeof q === "undefined") {q = this.view[w++];v |= (q & 127) << 14;if (q & 128 || this.noAssert && typeof q === "undefined") {q = this.view[w++];v |= (q & 127) << 21;if (q & 128 || this.noAssert && typeof q === "undefined") {q = this.view[w++];u = q & 127;if (q & 128 || this.noAssert && typeof q === "undefined") {q = this.view[w++];u |= (q & 127) << 7;if (q & 128 || this.noAssert && typeof q === "undefined") {q = this.view[w++];u |= (q & 127) << 14;if (q & 128 || this.noAssert && typeof q === "undefined") {q = this.view[w++];u |= (q & 127) << 21;if (q & 128 || this.noAssert && typeof q === "undefined") {q = this.view[w++];s = q & 127;if (q & 128 || this.noAssert && typeof q === "undefined") {q = this.view[w++];s |= (q & 127) << 7;if (q & 128 || this.noAssert && typeof q === "undefined") {throw Error("Buffer overrun");}}}}}}}}}}var r = k.fromBits(v | u << 28, u >>> 4 | s << 24, false);if (t) {this.offset = w;return r;} else {return { value: r, length: w - x };}};l.readVarint64ZigZag = function (r) {var q = this.readVarint64(r);if (q && q.value instanceof k) {q.value = n.zigZagDecode64(q.value);} else {q = n.zigZagDecode64(q);}return q;};}l.writeCString = function (v, u) {var t = typeof u === "undefined";if (t) {u = this.offset;}var r,q = v.length;if (!this.noAssert) {if (typeof v !== "string") {throw TypeError("Illegal str: Not a string");}for (r = 0; r < q; ++r) {if (v.charCodeAt(r) === 0) {throw RangeError("Illegal str: Contains NULL-characters");}}if (typeof u !== "number" || u % 1 !== 0) {throw TypeError("Illegal offset: " + u + " (not an integer)");}u >>>= 0;if (u < 0 || u + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + u + " (+" + 0 + ") <= " + this.buffer.byteLength);}}q = o.calculateUTF16asUTF8(b(v))[1];u += q + 1;var s = this.buffer.byteLength;if (u > s) {this.resize((s *= 2) > u ? s : u);}u -= q + 1;o.encodeUTF16toUTF8(b(v), function (w) {this.view[u++] = w;}.bind(this));this.view[u++] = 0;if (t) {this.offset = u;return this;}return q;};l.readCString = function (u) {var s = typeof u === "undefined";if (s) {u = this.offset;}if (!this.noAssert) {if (typeof u !== "number" || u % 1 !== 0) {throw TypeError("Illegal offset: " + u + " (not an integer)");}u >>>= 0;if (u < 0 || u + 1 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + u + " (+" + 1 + ") <= " + this.buffer.byteLength);}}var v = u,r;var t,q = -1;o.decodeUTF8toUTF16(function () {if (q === 0) {return null;}if (u >= this.limit) {throw RangeError("Illegal range: Truncated data, " + u + " < " + this.limit);}q = this.view[u++];return q === 0 ? null : q;}.bind(this), t = f(), true);if (s) {this.offset = u;return t();} else {return { string: t(), length: u - v };}};l.writeIString = function (u, t) {var s = typeof t === "undefined";if (s) {t = this.offset;}if (!this.noAssert) {if (typeof u !== "string") {throw TypeError("Illegal str: Not a string");}if (typeof t !== "number" || t % 1 !== 0) {throw TypeError("Illegal offset: " + t + " (not an integer)");}t >>>= 0;if (t < 0 || t + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + t + " (+" + 0 + ") <= " + this.buffer.byteLength);}}var v = t,q;q = o.calculateUTF16asUTF8(b(u), this.noAssert)[1];t += 4 + q;var r = this.buffer.byteLength;if (t > r) {this.resize((r *= 2) > t ? r : t);}t -= 4 + q;if (this.littleEndian) {this.view[t + 3] = q >>> 24 & 255;this.view[t + 2] = q >>> 16 & 255;this.view[t + 1] = q >>> 8 & 255;this.view[t] = q & 255;} else {this.view[t] = q >>> 24 & 255;this.view[t + 1] = q >>> 16 & 255;this.view[t + 2] = q >>> 8 & 255;this.view[t + 3] = q & 255;}t += 4;o.encodeUTF16toUTF8(b(u), function (w) {this.view[t++] = w;}.bind(this));if (t !== v + 4 + q) {throw RangeError("Illegal range: Truncated data, " + t + " == " + (t + 4 + q));}if (s) {this.offset = t;return this;}return t - v;};l.readIString = function (t) {var r = typeof t === "undefined";if (r) {t = this.offset;}if (!this.noAssert) {if (typeof t !== "number" || t % 1 !== 0) {throw TypeError("Illegal offset: " + t + " (not an integer)");}t >>>= 0;if (t < 0 || t + 4 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + t + " (+" + 4 + ") <= " + this.buffer.byteLength);}}var u = t;var q = this.readUint32(t);var s = this.readUTF8String(q, n.METRICS_BYTES, t += 4);t += s.length;if (r) {this.offset = t;return s.string;} else {return { string: s.string, length: t - u };}};n.METRICS_CHARS = "c";n.METRICS_BYTES = "b";l.writeUTF8String = function (u, t) {var s = typeof t === "undefined";if (s) {t = this.offset;}if (!this.noAssert) {if (typeof t !== "number" || t % 1 !== 0) {throw TypeError("Illegal offset: " + t + " (not an integer)");}t >>>= 0;if (t < 0 || t + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + t + " (+" + 0 + ") <= " + this.buffer.byteLength);}}var q;var v = t;q = o.calculateUTF16asUTF8(b(u))[1];t += q;var r = this.buffer.byteLength;if (t > r) {this.resize((r *= 2) > t ? r : t);}t -= q;o.encodeUTF16toUTF8(b(u), function (w) {this.view[t++] = w;}.bind(this));if (s) {this.offset = t;return this;}return t - v;};l.writeString = l.writeUTF8String;n.calculateUTF8Chars = function (q) {return o.calculateUTF16asUTF8(b(q))[0];};n.calculateUTF8Bytes = function (q) {return o.calculateUTF16asUTF8(b(q))[1];};n.calculateString = n.calculateUTF8Bytes;l.readUTF8String = function (t, s, w) {if (typeof s === "number") {w = s;s = undefined;}var u = typeof w === "undefined";if (u) {w = this.offset;}if (typeof s === "undefined") {s = n.METRICS_CHARS;}if (!this.noAssert) {if (typeof t !== "number" || t % 1 !== 0) {throw TypeError("Illegal length: " + t + " (not an integer)");}t |= 0;if (typeof w !== "number" || w % 1 !== 0) {throw TypeError("Illegal offset: " + w + " (not an integer)");}w >>>= 0;if (w < 0 || w + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + w + " (+" + 0 + ") <= " + this.buffer.byteLength);}}var r = 0,x = w,v;if (s === n.METRICS_CHARS) {v = f();o.decodeUTF8(function () {return r < t && w < this.limit ? this.view[w++] : null;}.bind(this), function (y) {++r;o.UTF8toUTF16(y, v);});if (r !== t) {throw RangeError("Illegal range: Truncated data, " + r + " == " + t);}if (u) {this.offset = w;return v();} else {return { string: v(), length: w - x };}} else {if (s === n.METRICS_BYTES) {if (!this.noAssert) {if (typeof w !== "number" || w % 1 !== 0) {throw TypeError("Illegal offset: " + w + " (not an integer)");}w >>>= 0;if (w < 0 || w + t > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + w + " (+" + t + ") <= " + this.buffer.byteLength);}}var q = w + t;o.decodeUTF8toUTF16(function () {return w < q ? this.view[w++] : null;}.bind(this), v = f(), this.noAssert);if (w !== q) {throw RangeError("Illegal range: Truncated data, " + w + " == " + q);}if (u) {this.offset = w;return v();} else {return { string: v(), length: w - x };}} else {throw TypeError("Unsupported metrics: " + s);}}};l.readString = l.readUTF8String;l.writeVString = function (v, u) {var t = typeof u === "undefined";if (t) {u = this.offset;}if (!this.noAssert) {if (typeof v !== "string") {throw TypeError("Illegal str: Not a string");}if (typeof u !== "number" || u % 1 !== 0) {throw TypeError("Illegal offset: " + u + " (not an integer)");}u >>>= 0;if (u < 0 || u + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + u + " (+" + 0 + ") <= " + this.buffer.byteLength);}}var w = u,s,q;s = o.calculateUTF16asUTF8(b(v), this.noAssert)[1];q = n.calculateVarint32(s);u += q + s;var r = this.buffer.byteLength;if (u > r) {this.resize((r *= 2) > u ? r : u);}u -= q + s;u += this.writeVarint32(s, u);o.encodeUTF16toUTF8(b(v), function (x) {this.view[u++] = x;}.bind(this));if (u !== w + s + q) {throw RangeError("Illegal range: Truncated data, " + u + " == " + (u + s + q));}if (t) {this.offset = u;return this;}return u - w;};l.readVString = function (t) {var r = typeof t === "undefined";if (r) {t = this.offset;}if (!this.noAssert) {if (typeof t !== "number" || t % 1 !== 0) {throw TypeError("Illegal offset: " + t + " (not an integer)");}t >>>= 0;if (t < 0 || t + 1 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + t + " (+" + 1 + ") <= " + this.buffer.byteLength);}}var u = t;var q = this.readVarint32(t);var s = this.readUTF8String(q.value, n.METRICS_BYTES, t += q.length);t += s.length;if (r) {this.offset = t;return s.string;} else {return { string: s.string, length: t - u };}};l.append = function (u, s, v) {if (typeof s === "number" || typeof s !== "string") {v = s;s = undefined;}var t = typeof v === "undefined";if (t) {v = this.offset;}if (!this.noAssert) {if (typeof v !== "number" || v % 1 !== 0) {throw TypeError("Illegal offset: " + v + " (not an integer)");}v >>>= 0;if (v < 0 || v + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + v + " (+" + 0 + ") <= " + this.buffer.byteLength);}}if (!(u instanceof n)) {u = n.wrap(u, s);}var r = u.limit - u.offset;if (r <= 0) {return this;}v += r;var q = this.buffer.byteLength;if (v > q) {this.resize((q *= 2) > v ? q : v);}v -= r;this.view.set(u.view.subarray(u.offset, u.limit), v);u.offset += r;if (t) {this.offset += r;}return this;};l.appendTo = function (q, r) {q.append(this, r);return this;};l.assert = function (q) {this.noAssert = !q;return this;};l.capacity = function () {return this.buffer.byteLength;};l.clear = function () {this.offset = 0;this.limit = this.buffer.byteLength;this.markedOffset = -1;return this;};l.clone = function (r) {var q = new n(0, this.littleEndian, this.noAssert);if (r) {q.buffer = new ArrayBuffer(this.buffer.byteLength);q.view = new Uint8Array(q.buffer);} else {q.buffer = this.buffer;q.view = this.view;}q.offset = this.offset;q.markedOffset = this.markedOffset;q.limit = this.limit;return q;};l.compact = function (u, t) {if (typeof u === "undefined") {u = this.offset;}if (typeof t === "undefined") {t = this.limit;}if (!this.noAssert) {if (typeof u !== "number" || u % 1 !== 0) {throw TypeError("Illegal begin: Not an integer");}u >>>= 0;if (typeof t !== "number" || t % 1 !== 0) {throw TypeError("Illegal end: Not an integer");}t >>>= 0;if (u < 0 || u > t || t > this.buffer.byteLength) {throw RangeError("Illegal range: 0 <= " + u + " <= " + t + " <= " + this.buffer.byteLength);}}if (u === 0 && t === this.buffer.byteLength) {return this;}var q = t - u;if (q === 0) {this.buffer = p;this.view = null;if (this.markedOffset >= 0) {this.markedOffset -= u;}this.offset = 0;this.limit = 0;return this;}var s = new ArrayBuffer(q);var r = new Uint8Array(s);r.set(this.view.subarray(u, t));this.buffer = s;this.view = r;if (this.markedOffset >= 0) {this.markedOffset -= u;}this.offset = 0;this.limit = q;return this;};l.copy = function (s, q) {if (typeof s === "undefined") {s = this.offset;}if (typeof q === "undefined") {q = this.limit;}if (!this.noAssert) {if (typeof s !== "number" || s % 1 !== 0) {throw TypeError("Illegal begin: Not an integer");}s >>>= 0;if (typeof q !== "number" || q % 1 !== 0) {throw TypeError("Illegal end: Not an integer");}q >>>= 0;if (s < 0 || s > q || q > this.buffer.byteLength) {throw RangeError("Illegal range: 0 <= " + s + " <= " + q + " <= " + this.buffer.byteLength);}}if (s === q) {return new n(0, this.littleEndian, this.noAssert);}var r = q - s,t = new n(r, this.littleEndian, this.noAssert);t.offset = 0;t.limit = r;if (t.markedOffset >= 0) {t.markedOffset -= s;}this.copyTo(t, 0, s, q);return t;};l.copyTo = function (u, w, s, v) {var t, r;if (!this.noAssert) {if (!n.isByteBuffer(u)) {throw TypeError("Illegal target: Not a ByteBuffer");}}w = (r = typeof w === "undefined") ? u.offset : w | 0;s = (t = typeof s === "undefined") ? this.offset : s | 0;v = typeof v === "undefined" ? this.limit : v | 0;if (w < 0 || w > u.buffer.byteLength) {throw RangeError("Illegal target range: 0 <= " + w + " <= " + u.buffer.byteLength);}if (s < 0 || v > this.buffer.byteLength) {throw RangeError("Illegal source range: 0 <= " + s + " <= " + this.buffer.byteLength);}var q = v - s;if (q === 0) {return u;}u.ensureCapacity(w + q);u.view.set(this.view.subarray(s, v), w);if (t) {this.offset += q;}if (r) {u.offset += q;}return this;};l.ensureCapacity = function (q) {var r = this.buffer.byteLength;if (r < q) {return this.resize((r *= 2) > q ? r : q);}return this;};l.fill = function (t, r, q) {var s = typeof r === "undefined";if (s) {r = this.offset;}if (typeof t === "string" && t.length > 0) {t = t.charCodeAt(0);}if (typeof r === "undefined") {r = this.offset;}if (typeof q === "undefined") {q = this.limit;}if (!this.noAssert) {if (typeof t !== "number" || t % 1 !== 0) {throw TypeError("Illegal value: " + t + " (not an integer)");}t |= 0;if (typeof r !== "number" || r % 1 !== 0) {throw TypeError("Illegal begin: Not an integer");}r >>>= 0;if (typeof q !== "number" || q % 1 !== 0) {throw TypeError("Illegal end: Not an integer");}q >>>= 0;if (r < 0 || r > q || q > this.buffer.byteLength) {throw RangeError("Illegal range: 0 <= " + r + " <= " + q + " <= " + this.buffer.byteLength);}}if (r >= q) {return this;}while (r < q) {this.view[r++] = t;}if (s) {this.offset = r;}return this;};l.flip = function () {this.limit = this.offset;this.offset = 0;return this;};l.mark = function (q) {q = typeof q === "undefined" ? this.offset : q;if (!this.noAssert) {if (typeof q !== "number" || q % 1 !== 0) {throw TypeError("Illegal offset: " + q + " (not an integer)");}q >>>= 0;if (q < 0 || q + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + q + " (+" + 0 + ") <= " + this.buffer.byteLength);}}this.markedOffset = q;return this;};l.order = function (q) {if (!this.noAssert) {if (typeof q !== "boolean") {throw TypeError("Illegal littleEndian: Not a boolean");}}this.littleEndian = !!q;return this;};l.LE = function (q) {this.littleEndian = typeof q !== "undefined" ? !!q : true;return this;};l.BE = function (q) {this.littleEndian = typeof q !== "undefined" ? !q : false;return this;};l.prepend = function (q, s, t) {if (typeof s === "number" || typeof s !== "string") {t = s;s = undefined;}var r = typeof t === "undefined";if (r) {t = this.offset;}if (!this.noAssert) {if (typeof t !== "number" || t % 1 !== 0) {throw TypeError("Illegal offset: " + t + " (not an integer)");}t >>>= 0;if (t < 0 || t + 0 > this.buffer.byteLength) {throw RangeError("Illegal offset: 0 <= " + t + " (+" + 0 + ") <= " + this.buffer.byteLength);}}if (!(q instanceof n)) {q = n.wrap(q, s);}var v = q.limit - q.offset;if (v <= 0) {return this;}var y = v - t;if (y > 0) {var u = new ArrayBuffer(this.buffer.byteLength + y);var x = new Uint8Array(u);x.set(this.view.subarray(t, this.buffer.byteLength), v);this.buffer = u;this.view = x;this.offset += y;if (this.markedOffset >= 0) {this.markedOffset += y;}this.limit += y;t += y;} else {var w = new Uint8Array(this.buffer);}this.view.set(q.view.subarray(q.offset, q.limit), t - v);q.offset = q.limit;if (r) {this.offset -= v;}return this;};l.prependTo = function (q, r) {q.prepend(this, r);return this;};l.printDebug = function (q) {if (typeof q !== "function") {q = console.log.bind(console);}q(this.toString() + "\n-------------------------------------------------------------------\n" + this.toDebug(true));};l.remaining = function () {return this.limit - this.offset;};l.reset = function () {if (this.markedOffset >= 0) {this.offset = this.markedOffset;this.markedOffset = -1;} else {this.offset = 0;}return this;};l.resize = function (s) {if (!this.noAssert) {if (typeof s !== "number" || s % 1 !== 0) {throw TypeError("Illegal capacity: " + s + " (not an integer)");}s |= 0;if (s < 0) {throw RangeError("Illegal capacity: 0 <= " + s);}}if (this.buffer.byteLength < s) {var r = new ArrayBuffer(s);var q = new Uint8Array(r);q.set(this.view);this.buffer = r;this.view = q;}return this;};l.reverse = function (r, q) {if (typeof r === "undefined") {r = this.offset;}if (typeof q === "undefined") {q = this.limit;}if (!this.noAssert) {if (typeof r !== "number" || r % 1 !== 0) {throw TypeError("Illegal begin: Not an integer");}r >>>= 0;if (typeof q !== "number" || q % 1 !== 0) {throw TypeError("Illegal end: Not an integer");}q >>>= 0;if (r < 0 || r > q || q > this.buffer.byteLength) {throw RangeError("Illegal range: 0 <= " + r + " <= " + q + " <= " + this.buffer.byteLength);}}if (r === q) {return this;}Array.prototype.reverse.call(this.view.subarray(r, q));return this;};l.skip = function (q) {if (!this.noAssert) {if (typeof q !== "number" || q % 1 !== 0) {throw TypeError("Illegal length: " + q + " (not an integer)");}q |= 0;}var r = this.offset + q;if (!this.noAssert) {if (r < 0 || r > this.buffer.byteLength) {throw RangeError("Illegal length: 0 <= " + this.offset + " + " + q + " <= " + this.buffer.byteLength);}}this.offset = r;return this;};l.slice = function (r, q) {if (typeof r === "undefined") {r = this.offset;}if (typeof q === "undefined") {q = this.limit;}if (!this.noAssert) {if (typeof r !== "number" || r % 1 !== 0) {throw TypeError("Illegal begin: Not an integer");}r >>>= 0;if (typeof q !== "number" || q % 1 !== 0) {throw TypeError("Illegal end: Not an integer");}q >>>= 0;if (r < 0 || r > q || q > this.buffer.byteLength) {throw RangeError("Illegal range: 0 <= " + r + " <= " + q + " <= " + this.buffer.byteLength);}}var s = this.clone();s.offset = r;s.limit = q;return s;};l.toBuffer = function (q) {var t = this.offset,s = this.limit;if (!this.noAssert) {if (typeof t !== "number" || t % 1 !== 0) {throw TypeError("Illegal offset: Not an integer");}t >>>= 0;if (typeof s !== "number" || s % 1 !== 0) {throw TypeError("Illegal limit: Not an integer");}s >>>= 0;if (t < 0 || t > s || s > this.buffer.byteLength) {throw RangeError("Illegal range: 0 <= " + t + " <= " + s + " <= " + this.buffer.byteLength);}}if (!q && t === 0 && s === this.buffer.byteLength) {return this.buffer;}if (t === s) {return p;}var r = new ArrayBuffer(s - t);new Uint8Array(r).set(new Uint8Array(this.buffer).subarray(t, s), 0);return r;};l.toArrayBuffer = l.toBuffer;l.toString = function (s, r, q) {if (typeof s === "undefined") {return "ByteBufferAB(offset=" + this.offset + ",markedOffset=" + this.markedOffset + ",limit=" + this.limit + ",capacity=" + this.capacity() + ")";}if (typeof s === "number") {s = "utf8", r = s, q = r;}switch (s) {case "utf8":return this.toUTF8(r, q);case "base64":return this.toBase64(r, q);case "hex":return this.toHex(r, q);case "binary":return this.toBinary(r, q);case "debug":return this.toDebug();case "columns":return this.toColumns();default:throw Error("Unsupported encoding: " + s);}};var h = function () {var r = {};var u = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47];var t = [];for (var s = 0, q = u.length; s < q; ++s) {t[u[s]] = s;}r.encode = function (x, y) {var v, w;while ((v = x()) !== null) {y(u[v >> 2 & 63]);w = (v & 3) << 4;if ((v = x()) !== null) {w |= v >> 4 & 15;y(u[(w | v >> 4 & 15) & 63]);w = (v & 15) << 2;if ((v = x()) !== null) {y(u[(w | v >> 6 & 3) & 63]), y(u[v & 63]);} else {y(u[w & 63]), y(61);}} else {y(u[w & 63]), y(61), y(61);}}};r.decode = function (y, A) {var z, x, w;function v(B) {throw Error("Illegal character code: " + B);}while ((z = y()) !== null) {x = t[z];if (typeof x === "undefined") {v(z);}if ((z = y()) !== null) {w = t[z];if (typeof w === "undefined") {v(z);}A(x << 2 >>> 0 | (w & 48) >> 4);if ((z = y()) !== null) {x = t[z];if (typeof x === "undefined") {if (z === 61) {break;} else {v(z);}}A((w & 15) << 4 >>> 0 | (x & 60) >> 2);if ((z = y()) !== null) {w = t[z];if (typeof w === "undefined") {if (z === 61) {break;} else {v(z);}}A((x & 3) << 6 >>> 0 | w);}}}}};r.test = function (v) {return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(v);};return r;}();l.toBase64 = function (r, q) {if (typeof r === "undefined") {r = this.offset;}if (typeof q === "undefined") {q = this.limit;}r = r | 0;q = q | 0;if (r < 0 || q > this.capacity || r > q) {throw RangeError("begin, end");}var s;h.encode(function () {return r < q ? this.view[r++] : null;}.bind(this), s = f());return s();};n.fromBase64 = function (t, r) {if (typeof t !== "string") {throw TypeError("str");}var s = new n(t.length / 4 * 3, r),q = 0;h.decode(b(t), function (u) {s.view[q++] = u;});s.limit = q;return s;};n.btoa = function (q) {return n.fromBinary(q).toBase64();};n.atob = function (q) {return n.fromBase64(q).toBinary();};l.toBinary = function (r, q) {if (typeof r === "undefined") {r = this.offset;}if (typeof q === "undefined") {q = this.limit;}r |= 0;q |= 0;if (r < 0 || q > this.capacity() || r > q) {throw RangeError("begin, end");}if (r === q) {return "";}var s = [],t = [];while (r < q) {s.push(this.view[r++]);if (s.length >= 1024) {t.push(String.fromCharCode.apply(String, s)), s = [];}}return t.join("") + String.fromCharCode.apply(String, s);};n.fromBinary = function (v, t) {if (typeof v !== "string") {throw TypeError("str");}var s = 0,r = v.length,q,u = new n(r, t);while (s < r) {q = v.charCodeAt(s);if (q > 255) {throw RangeError("illegal char code: " + q);}u.view[s++] = q;}u.limit = r;return u;};l.toDebug = function (u) {var t = -1,r = this.buffer.byteLength,q,w = "",v = "",s = "";while (t < r) {if (t !== -1) {q = this.view[t];if (q < 16) {w += "0" + q.toString(16).toUpperCase();} else {w += q.toString(16).toUpperCase();}if (u) {v += q > 32 && q < 127 ? String.fromCharCode(q) : ".";}}++t;if (u) {if (t > 0 && t % 16 === 0 && t !== r) {while (w.length < 3 * 16 + 3) {w += " ";}s += w + v + "\n";w = v = "";}}if (t === this.offset && t === this.limit) {w += t === this.markedOffset ? "!" : "|";} else {if (t === this.offset) {w += t === this.markedOffset ? "[" : "<";} else {if (t === this.limit) {w += t === this.markedOffset ? "]" : ">";} else {w += t === this.markedOffset ? "'" : u || t !== 0 && t !== r ? " " : "";}}}}if (u && w !== " ") {while (w.length < 3 * 16 + 3) {w += " ";}s += w + v + "\n";}return u ? s : w;};n.fromDebug = function (A, s, C) {var w = A.length,z = new n((w + 1) / 3 | 0, s, C);var y = 0,x = 0,q,B,v = false,D = false,r = false,t = false,u = false;while (y < w) {switch (q = A.charAt(y++)) {case "!":if (!C) {if (D || r || t) {u = true;break;}D = r = t = true;}z.offset = z.markedOffset = z.limit = x;v = false;break;case "|":if (!C) {if (D || t) {u = true;break;}D = t = true;}z.offset = z.limit = x;v = false;break;case "[":if (!C) {if (D || r) {u = true;break;}D = r = true;}z.offset = z.markedOffset = x;v = false;break;case "<":if (!C) {if (D) {u = true;break;}D = true;}z.offset = x;v = false;break;case "]":if (!C) {if (t || r) {u = true;break;}t = r = true;}z.limit = z.markedOffset = x;v = false;break;case ">":if (!C) {if (t) {u = true;break;}t = true;}z.limit = x;v = false;break;case "'":if (!C) {if (r) {u = true;break;}r = true;}z.markedOffset = x;v = false;break;case " ":v = false;break;default:if (!C) {if (v) {u = true;break;}}B = parseInt(q + A.charAt(y++), 16);if (!C) {if (isNaN(B) || B < 0 || B > 255) {throw TypeError("Illegal str: Not a debug encoded string");}}z.view[x++] = B;v = true;}if (u) {throw TypeError("Illegal str: Invalid symbol at " + y);}}if (!C) {if (!D || !t) {throw TypeError("Illegal str: Missing offset or limit");}if (x < z.buffer.byteLength) {throw TypeError("Illegal str: Not a debug encoded string (is it hex?) " + x + " < " + w);}}return z;};l.toHex = function (t, r) {t = typeof t === "undefined" ? this.offset : t;r = typeof r === "undefined" ? this.limit : r;if (!this.noAssert) {if (typeof t !== "number" || t % 1 !== 0) {throw TypeError("Illegal begin: Not an integer");}t >>>= 0;if (typeof r !== "number" || r % 1 !== 0) {throw TypeError("Illegal end: Not an integer");}r >>>= 0;if (t < 0 || t > r || r > this.buffer.byteLength) {throw RangeError("Illegal range: 0 <= " + t + " <= " + r + " <= " + this.buffer.byteLength);}}var s = new Array(r - t),q;while (t < r) {q = this.view[t++];if (q < 16) {s.push("0", q.toString(16));} else {s.push(q.toString(16));}}return s.join("");};n.fromHex = function (x, v, u) {if (!u) {if (typeof x !== "string") {throw TypeError("Illegal str: Not a string");}if (x.length % 2 !== 0) {throw TypeError("Illegal str: Length not a multiple of 2");}}var r = x.length,w = new n(r / 2 | 0, v),q;for (var t = 0, s = 0; t < r; t += 2) {q = parseInt(x.substring(t, t + 2), 16);if (!u) {if (!isFinite(q) || q < 0 || q > 255) {throw TypeError("Illegal str: Contains non-hex characters");}}w.view[s++] = q;}w.limit = s;return w;};var o = function () {var q = {};q.MAX_CODEPOINT = 1114111;q.encodeUTF8 = function (s, t) {var r = null;if (typeof s === "number") {r = s, s = function s() {return null;};}while (r !== null || (r = s()) !== null) {if (r < 128) {t(r & 127);} else {if (r < 2048) {t(r >> 6 & 31 | 192), t(r & 63 | 128);} else {if (r < 65536) {t(r >> 12 & 15 | 224), t(r >> 6 & 63 | 128), t(r & 63 | 128);} else {t(r >> 18 & 7 | 240), t(r >> 12 & 63 | 128), t(r >> 6 & 63 | 128), t(r & 63 | 128);}}}r = null;}};q.decodeUTF8 = function (v, x) {var t,r,w,u,s = function s(y) {y = y.slice(0, y.indexOf(null));var z = Error(y.toString());z.name = "TruncatedError";z.bytes = y;throw z;};while ((t = v()) !== null) {if ((t & 128) === 0) {x(t);} else {if ((t & 224) === 192) {(r = v()) === null && s([t, r]), x((t & 31) << 6 | r & 63);} else {if ((t & 240) === 224) {((r = v()) === null || (w = v()) === null) && s([t, r, w]), x((t & 15) << 12 | (r & 63) << 6 | w & 63);} else {if ((t & 248) === 240) {((r = v()) === null || (w = v()) === null || (u = v()) === null) && s([t, r, w, u]), x((t & 7) << 18 | (r & 63) << 12 | (w & 63) << 6 | u & 63);} else {throw RangeError("Illegal starting byte: " + t);}}}}}};q.UTF16toUTF8 = function (t, u) {var s,r = null;while (true) {if ((s = r !== null ? r : t()) === null) {break;}if (s >= 55296 && s <= 57343) {if ((r = t()) !== null) {if (r >= 56320 && r <= 57343) {u((s - 55296) * 1024 + r - 56320 + 65536);r = null;continue;}}}u(s);}if (r !== null) {u(r);}};q.UTF8toUTF16 = function (s, t) {var r = null;if (typeof s === "number") {r = s, s = function s() {return null;};}while (r !== null || (r = s()) !== null) {if (r <= 65535) {t(r);} else {r -= 65536, t((r >> 10) + 55296), t(r % 1024 + 56320);}r = null;}};q.encodeUTF16toUTF8 = function (r, s) {q.UTF16toUTF8(r, function (t) {q.encodeUTF8(t, s);});};q.decodeUTF8toUTF16 = function (r, s) {q.decodeUTF8(r, function (t) {q.UTF8toUTF16(t, s);});};q.calculateCodePoint = function (r) {return r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4;};q.calculateUTF8 = function (t) {var s,r = 0;while ((s = t()) !== null) {r += s < 128 ? 1 : s < 2048 ? 2 : s < 65536 ? 3 : 4;}return r;};q.calculateUTF16asUTF8 = function (s) {var t = 0,r = 0;q.UTF16toUTF8(s, function (u) {++t;r += u < 128 ? 1 : u < 2048 ? 2 : u < 65536 ? 3 : 4;});return [t, r];};return q;}();l.toUTF8 = function (r, q) {if (typeof r === "undefined") {r = this.offset;}if (typeof q === "undefined") {q = this.limit;}if (!this.noAssert) {if (typeof r !== "number" || r % 1 !== 0) {throw TypeError("Illegal begin: Not an integer");}r >>>= 0;if (typeof q !== "number" || q % 1 !== 0) {throw TypeError("Illegal end: Not an integer");}q >>>= 0;if (r < 0 || r > q || q > this.buffer.byteLength) {throw RangeError("Illegal range: 0 <= " + r + " <= " + q + " <= " + this.buffer.byteLength);}}var t;try {o.decodeUTF8toUTF16(function () {return r < q ? this.view[r++] : null;}.bind(this), t = f());} catch (s) {if (r !== q) {throw RangeError("Illegal range: Truncated data, " + r + " != " + q);}}return t();};n.fromUTF8 = function (u, s, r) {if (!r) {if (typeof u !== "string") {throw TypeError("Illegal str: Not a string");}}var t = new n(o.calculateUTF16asUTF8(b(u), true)[1], s, r),q = 0;o.encodeUTF16toUTF8(b(u), function (v) {t.view[q++] = v;});t.limit = q;return t;};return n;}(d);var e = function (j, k, f) {var l = {};l.ByteBuffer = j;l.c = j;var n = j;l.Long = k || null;l.VERSION = "5.0.1";l.WIRE_TYPES = {};l.WIRE_TYPES.VARINT = 0;l.WIRE_TYPES.BITS64 = 1;l.WIRE_TYPES.LDELIM = 2;l.WIRE_TYPES.STARTGROUP = 3;l.WIRE_TYPES.ENDGROUP = 4;l.WIRE_TYPES.BITS32 = 5;l.PACKABLE_WIRE_TYPES = [l.WIRE_TYPES.VARINT, l.WIRE_TYPES.BITS64, l.WIRE_TYPES.BITS32];l.TYPES = { int32: { name: "int32", wireType: l.WIRE_TYPES.VARINT, defaultValue: 0 }, uint32: { name: "uint32", wireType: l.WIRE_TYPES.VARINT, defaultValue: 0 }, sint32: { name: "sint32", wireType: l.WIRE_TYPES.VARINT, defaultValue: 0 }, int64: { name: "int64", wireType: l.WIRE_TYPES.VARINT, defaultValue: l.Long ? l.Long.ZERO : undefined }, uint64: { name: "uint64", wireType: l.WIRE_TYPES.VARINT, defaultValue: l.Long ? l.Long.UZERO : undefined }, sint64: { name: "sint64", wireType: l.WIRE_TYPES.VARINT, defaultValue: l.Long ? l.Long.ZERO : undefined }, bool: { name: "bool", wireType: l.WIRE_TYPES.VARINT, defaultValue: false }, "double": { name: "double", wireType: l.WIRE_TYPES.BITS64, defaultValue: 0 }, string: { name: "string", wireType: l.WIRE_TYPES.LDELIM, defaultValue: "" }, bytes: { name: "bytes", wireType: l.WIRE_TYPES.LDELIM, defaultValue: null }, fixed32: { name: "fixed32", wireType: l.WIRE_TYPES.BITS32, defaultValue: 0 }, sfixed32: { name: "sfixed32", wireType: l.WIRE_TYPES.BITS32, defaultValue: 0 }, fixed64: { name: "fixed64", wireType: l.WIRE_TYPES.BITS64, defaultValue: l.Long ? l.Long.UZERO : undefined }, sfixed64: { name: "sfixed64", wireType: l.WIRE_TYPES.BITS64, defaultValue: l.Long ? l.Long.ZERO : undefined }, "float": { name: "float", wireType: l.WIRE_TYPES.BITS32, defaultValue: 0 }, "enum": { name: "enum", wireType: l.WIRE_TYPES.VARINT, defaultValue: 0 }, message: { name: "message", wireType: l.WIRE_TYPES.LDELIM, defaultValue: null }, group: { name: "group", wireType: l.WIRE_TYPES.STARTGROUP, defaultValue: null } };l.MAP_KEY_TYPES = [l.TYPES.int32, l.TYPES.sint32, l.TYPES.sfixed32, l.TYPES.uint32, l.TYPES.fixed32, l.TYPES.int64, l.TYPES.sint64, l.TYPES.sfixed64, l.TYPES.uint64, l.TYPES.fixed64, l.TYPES.bool, l.TYPES.string, l.TYPES.bytes];l.ID_MIN = 1;l.ID_MAX = 536870911;l.convertFieldsToCamelCase = false;l.populateAccessors = true;l.populateDefaults = true;l.Util = function () {var b = {};b.IS_NODE = !!(typeof process === "object" && process + "" === "[object process]" && !process.browser);b.XHR = function () {var r = [function () {return new XMLHttpRequest();}, function () {return new ActiveXObject("Msxml2.XMLHTTP");}, function () {return new ActiveXObject("Msxml3.XMLHTTP");}, function () {return new ActiveXObject("Microsoft.XMLHTTP");}];var o = null;for (var q = 0; q < r.length; q++) {try {o = r[q]();} catch (p) {continue;}break;}if (!o) {throw Error("XMLHttpRequest is not supported");}return o;};b.fetch = function (q, o) {if (o && typeof o != "function") {o = null;}if (b.IS_NODE) {if (o) {g.readFile(q, function (t, s) {if (t) {o(null);} else {o("" + s);}});} else {try {return g.readFileSync(q);} catch (r) {return null;}}} else {var p = b.XHR();p.open("GET", q, o ? true : false);p.setRequestHeader("Accept", "text/plain");if (typeof p.overrideMimeType === "function") {p.overrideMimeType("text/plain");}if (o) {p.onreadystatechange = function () {if (p.readyState != 4) {return;}if (p.status == 200 || p.status == 0 && typeof p.responseText === "string") {o(p.responseText);} else {o(null);}};if (p.readyState == 4) {return;}p.send(null);} else {p.send(null);if (p.status == 200 || p.status == 0 && typeof p.responseText === "string") {return p.responseText;}return null;}}};b.toCamelCase = function (o) {return o.replace(/_([a-zA-Z])/g, function (p, q) {return q.toUpperCase();});};return b;}();l.Lang = { DELIM: /[\s\{\}=;:\[\],'"\(\)<>]/g, RULE: /^(?:required|optional|repeated|map)$/, TYPE: /^(?:double|float|int32|uint32|sint32|int64|uint64|sint64|fixed32|sfixed32|fixed64|sfixed64|bool|string|bytes)$/, NAME: /^[a-zA-Z_][a-zA-Z_0-9]*$/, TYPEDEF: /^[a-zA-Z][a-zA-Z_0-9]*$/, TYPEREF: /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)+$/, FQTYPEREF: /^(?:\.[a-zA-Z][a-zA-Z_0-9]*)+$/, NUMBER: /^-?(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+|([0-9]*(\.[0-9]*)?([Ee][+-]?[0-9]+)?)|inf|nan)$/, NUMBER_DEC: /^(?:[1-9][0-9]*|0)$/, NUMBER_HEX: /^0[xX][0-9a-fA-F]+$/, NUMBER_OCT: /^0[0-7]+$/, NUMBER_FLT: /^([0-9]*(\.[0-9]*)?([Ee][+-]?[0-9]+)?|inf|nan)$/, BOOL: /^(?:true|false)$/i, ID: /^(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+)$/, NEGID: /^\-?(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+)$/, WHITESPACE: /\s/, STRING: /(?:"([^"\\]*(?:\\.[^"\\]*)*)")|(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g, STRING_DQ: /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g, STRING_SQ: /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g };l.DotProto = function (s, t) {var q = {};var r = function r(o) {this.source = o + "";this.index = 0;this.line = 1;this.stack = [];this._stringOpen = null;};var b = r.prototype;b._readString = function () {var o = this._stringOpen === '"' ? t.STRING_DQ : t.STRING_SQ;o.lastIndex = this.index - 1;var y = o.exec(this.source);if (!y) {throw Error("unterminated string");}this.index = o.lastIndex;this.stack.push(this._stringOpen);this._stringOpen = null;return y[1];};b.next = function () {if (this.stack.length > 0) {return this.stack.shift();}if (this.index >= this.source.length) {return null;}if (this._stringOpen !== null) {return this._readString();}var y, z, A;do {y = false;while (t.WHITESPACE.test(A = this.source.charAt(this.index))) {if (A === "\n") {++this.line;}if (++this.index === this.source.length) {return null;}}if (this.source.charAt(this.index) === "/") {++this.index;if (this.source.charAt(this.index) === "/") {while (this.source.charAt(++this.index) !== "\n") {if (this.index == this.source.length) {return null;}}++this.index;++this.line;y = true;} else {if ((A = this.source.charAt(this.index)) === "*") {do {if (A === "\n") {++this.line;}if (++this.index === this.source.length) {return null;}z = A;A = this.source.charAt(this.index);} while (z !== "*" || A !== "/");++this.index;y = true;} else {return "/";}}}} while (y);if (this.index === this.source.length) {return null;}var C = this.index;t.DELIM.lastIndex = 0;var o = t.DELIM.test(this.source.charAt(C++));if (!o) {while (C < this.source.length && !t.DELIM.test(this.source.charAt(C))) {++C;}}var B = this.source.substring(this.index, this.index = C);if (B === '"' || B === "'") {this._stringOpen = B;}return B;};b.peek = function () {if (this.stack.length === 0) {var o = this.next();if (o === null) {return null;}this.stack.push(o);}return this.stack[0];};b.skip = function (y) {var o = this.next();if (o !== y) {throw Error("illegal '" + o + "', '" + y + "' expected");}};b.omit = function (o) {if (this.peek() === o) {this.next();return true;}return false;};b.toString = function () {return "Tokenizer (" + this.index + "/" + this.source.length + " at line " + this.line + ")";};q.Tokenizer = r;var u = function u(o) {this.tn = new r(o);this.proto3 = false;};var w = u.prototype;w.parse = function () {var A = { name: "[ROOT]", "package": null, messages: [], enums: [], imports: [], options: {}, services: [] };var y,z = true;try {while (y = this.tn.next()) {switch (y) {case "package":if (!z || A["package"] !== null) {throw Error("unexpected 'package'");}y = this.tn.next();if (!t.TYPEREF.test(y)) {throw Error("illegal package name: " + y);}this.tn.skip(";");A["package"] = y;break;case "import":if (!z) {throw Error("unexpected 'import'");}y = this.tn.peek();if (y === "public") {this.tn.next();}y = this._readString();this.tn.skip(";");A.imports.push(y);break;case "syntax":if (!z) {throw Error("unexpected 'syntax'");}this.tn.skip("=");if ((A.syntax = this._readString()) === "proto3") {this.proto3 = true;}this.tn.skip(";");break;case "message":this._parseMessage(A, null);z = false;break;case "enum":this._parseEnum(A);z = false;break;case "option":this._parseOption(A);break;case "service":this._parseService(A);break;case "extend":this._parseExtend(A);break;default:throw Error("unexpected '" + y + "'");}}} catch (o) {o.message = "Parse error at line " + this.tn.line + ": " + o.message;throw o;}delete A.name;return A;};u.parse = function (o) {return new u(o).parse();};function x(y, z) {var o = -1,A = 1;if (y.charAt(0) == "-") {A = -1;y = y.substring(1);}if (t.NUMBER_DEC.test(y)) {o = parseInt(y);} else {if (t.NUMBER_HEX.test(y)) {o = parseInt(y.substring(2), 16);} else {if (t.NUMBER_OCT.test(y)) {o = parseInt(y.substring(1), 8);} else {throw Error("illegal id value: " + (A < 0 ? "-" : "") + y);}}}o = A * o | 0;if (!z && o < 0) {throw Error("illegal id value: " + (A < 0 ? "-" : "") + y);}return o;}function p(o) {var y = 1;if (o.charAt(0) == "-") {y = -1;o = o.substring(1);}if (t.NUMBER_DEC.test(o)) {return y * parseInt(o, 10);} else {if (t.NUMBER_HEX.test(o)) {return y * parseInt(o.substring(2), 16);} else {if (t.NUMBER_OCT.test(o)) {return y * parseInt(o.substring(1), 8);} else {if (o === "inf") {return y * Infinity;} else {if (o === "nan") {return NaN;} else {if (t.NUMBER_FLT.test(o)) {return y * parseFloat(o);}}}}}}throw Error("illegal number value: " + (y < 0 ? "-" : "") + o);}w._readString = function () {var y = "",z,o;do {o = this.tn.next();if (o !== "'" && o !== '"') {throw Error("illegal string delimiter: " + o);}y += this.tn.next();this.tn.skip(o);z = this.tn.peek();} while (z === '"' || z === '"');return y;};w._readValue = function (z) {var y = this.tn.peek(),o;if (y === '"' || y === "'") {return this._readString();}this.tn.next();if (t.NUMBER.test(y)) {return p(y);}if (t.BOOL.test(y)) {return y.toLowerCase() === "true";}if (z && t.TYPEREF.test(y)) {return y;}throw Error("illegal value: " + y);};w._parseOption = function (z, o) {var A = this.tn.next(),y = false;if (A === "(") {y = true;A = this.tn.next();}if (!t.TYPEREF.test(A)) {throw Error("illegal option name: " + A);}var B = A;if (y) {this.tn.skip(")");B = "(" + B + ")";A = this.tn.peek();if (t.FQTYPEREF.test(A)) {B += A;this.tn.next();}}this.tn.skip("=");this._parseOptionValue(z, B);if (!o) {this.tn.skip(";");}};function v(y, z, o) {if (typeof y[z] === "undefined") {y[z] = o;} else {if (!Array.isArray(y[z])) {y[z] = [y[z]];}y[z].push(o);}}w._parseOptionValue = function (o, z) {var y = this.tn.peek();if (y !== "{") {v(o.options, z, this._readValue(true));} else {this.tn.skip("{");while ((y = this.tn.next()) !== "}") {if (!t.NAME.test(y)) {throw Error("illegal option name: " + z + "." + y);}if (this.tn.omit(":")) {v(o.options, z + "." + y, this._readValue(true));} else {this._parseOptionValue(o, z + "." + y);}}}};w._parseService = function (y) {var z = this.tn.next();if (!t.NAME.test(z)) {throw Error("illegal service name at line " + this.tn.line + ": " + z);}var A = z;var o = { name: A, rpc: {}, options: {} };this.tn.skip("{");while ((z = this.tn.next()) !== "}") {if (z === "option") {this._parseOption(o);} else {if (z === "rpc") {this._parseServiceRPC(o);} else {throw Error("illegal service token: " + z);}}}this.tn.omit(";");y.services.push(o);};w._parseServiceRPC = function (y) {var z = "rpc",A = this.tn.next();if (!t.NAME.test(A)) {throw Error("illegal rpc service method name: " + A);}var B = A;var o = { request: null, response: null, request_stream: false, response_stream: false, options: {} };this.tn.skip("(");A = this.tn.next();if (A.toLowerCase() === "stream") {o.request_stream = true;A = this.tn.next();}if (!t.TYPEREF.test(A)) {throw Error("illegal rpc service request type: " + A);}o.request = A;this.tn.skip(")");A = this.tn.next();if (A.toLowerCase() !== "returns") {throw Error("illegal rpc service request type delimiter: " + A);}this.tn.skip("(");A = this.tn.next();if (A.toLowerCase() === "stream") {o.response_stream = true;A = this.tn.next();}o.response = A;this.tn.skip(")");A = this.tn.peek();if (A === "{") {this.tn.next();while ((A = this.tn.next()) !== "}") {if (A === "option") {this._parseOption(o);} else {throw Error("illegal rpc service token: " + A);}}this.tn.omit(";");} else {this.tn.skip(";");}if (typeof y[z] === "undefined") {y[z] = {};}y[z][B] = o;};w._parseMessage = function (z, A) {var o = !!A,B = this.tn.next();var y = { name: "", fields: [], enums: [], messages: [], options: {}, services: [], oneofs: {} };if (!t.NAME.test(B)) {throw Error("illegal " + (o ? "group" : "message") + " name: " + B);}y.name = B;if (o) {this.tn.skip("=");A.id = x(this.tn.next());y.isGroup = true;}B = this.tn.peek();if (B === "[" && A) {this._parseFieldOptions(A);}this.tn.skip("{");while ((B = this.tn.next()) !== "}") {if (t.RULE.test(B)) {this._parseMessageField(y, B);} else {if (B === "oneof") {this._parseMessageOneOf(y);} else {if (B === "enum") {this._parseEnum(y);} else {if (B === "message") {this._parseMessage(y);} else {if (B === "option") {this._parseOption(y);} else {if (B === "service") {this._parseService(y);} else {if (B === "extensions") {y.extensions = this._parseExtensionRanges();} else {if (B === "reserved") {this._parseIgnored();} else {if (B === "extend") {this._parseExtend(y);} else {if (t.TYPEREF.test(B)) {if (!this.proto3) {throw Error("illegal field rule: " + B);}this._parseMessageField(y, "optional", B);} else {throw Error("illegal message token: " + B);}}}}}}}}}}}this.tn.omit(";");z.messages.push(y);return y;};w._parseIgnored = function () {while (this.tn.peek() !== ";") {this.tn.next();}this.tn.skip(";");};w._parseMessageField = function (o, y, z) {if (!t.RULE.test(y)) {throw Error("illegal message field rule: " + y);}var A = { rule: y, type: "", name: "", options: {}, id: 0 };var B;if (y === "map") {if (z) {throw Error("illegal type: " + z);}this.tn.skip("<");B = this.tn.next();if (!t.TYPE.test(B) && !t.TYPEREF.test(B)) {throw Error("illegal message field type: " + B);}A.keytype = B;this.tn.skip(",");B = this.tn.next();if (!t.TYPE.test(B) && !t.TYPEREF.test(B)) {throw Error("illegal message field: " + B);}A.type = B;this.tn.skip(">");B = this.tn.next();if (!t.NAME.test(B)) {throw Error("illegal message field name: " + B);}A.name = B;this.tn.skip("=");A.id = x(this.tn.next());B = this.tn.peek();if (B === "[") {this._parseFieldOptions(A);}this.tn.skip(";");} else {z = typeof z !== "undefined" ? z : this.tn.next();if (z === "group") {var C = this._parseMessage(o, A);if (!/^[A-Z]/.test(C.name)) {throw Error("illegal group name: " + C.name);}A.type = C.name;A.name = C.name.toLowerCase();this.tn.omit(";");} else {if (!t.TYPE.test(z) && !t.TYPEREF.test(z)) {throw Error("illegal message field type: " + z);}A.type = z;B = this.tn.next();if (!t.NAME.test(B)) {throw Error("illegal message field name: " + B);}A.name = B;this.tn.skip("=");A.id = x(this.tn.next());B = this.tn.peek();if (B === "[") {this._parseFieldOptions(A);}this.tn.skip(";");}}o.fields.push(A);return A;};w._parseMessageOneOf = function (o) {var y = this.tn.next();if (!t.NAME.test(y)) {throw Error("illegal oneof name: " + y);}var A = y,z;var B = [];this.tn.skip("{");while ((y = this.tn.next()) !== "}") {z = this._parseMessageField(o, "optional", y);z.oneof = A;B.push(z.id);}this.tn.omit(";");o.oneofs[A] = B;};w._parseFieldOptions = function (y) {this.tn.skip("[");var z,o = true;while ((z = this.tn.peek()) !== "]") {if (!o) {this.tn.skip(",");}this._parseOption(y, true);o = false;}this.tn.next();};w._parseEnum = function (o) {var A = { name: "", values: [], options: {} };var z = this.tn.next();if (!t.NAME.test(z)) {throw Error("illegal name: " + z);}A.name = z;this.tn.skip("{");while ((z = this.tn.next()) !== "}") {if (z === "option") {this._parseOption(A);} else {if (!t.NAME.test(z)) {throw Error("illegal name: " + z);}this.tn.skip("=");var y = { name: z, id: x(this.tn.next(), true) };z = this.tn.peek();if (z === "[") {this._parseFieldOptions({ options: {} });}this.tn.skip(";");A.values.push(y);}}this.tn.omit(";");o.enums.push(A);};w._parseExtensionRanges = function () {var A = [];var y, z, o;do {z = [];while (true) {y = this.tn.next();switch (y) {case "min":o = s.ID_MIN;break;case "max":o = s.ID_MAX;break;default:o = p(y);break;}z.push(o);if (z.length === 2) {break;}if (this.tn.peek() !== "to") {z.push(o);break;}this.tn.next();}A.push(z);} while (this.tn.omit(","));this.tn.skip(";");return A;};w._parseExtend = function (o) {var z = this.tn.next();if (!t.TYPEREF.test(z)) {throw Error("illegal extend reference: " + z);}var y = { ref: z, fields: [] };this.tn.skip("{");while ((z = this.tn.next()) !== "}") {if (t.RULE.test(z)) {this._parseMessageField(y, z);} else {if (t.TYPEREF.test(z)) {if (!this.proto3) {throw Error("illegal field rule: " + z);}this._parseMessageField(y, "optional", z);} else {throw Error("illegal extend token: " + z);}}}this.tn.omit(";");o.messages.push(y);return y;};w.toString = function () {return "Parser at line " + this.tn.line;};q.Parser = u;return q;}(l, l.Lang);l.Reflect = function (V) {var aa = {};var Z = function Z(q, o, p) {this.builder = q;this.parent = o;this.name = p;this.className;};var ab = Z.prototype;ab.fqn = function () {var p = this.name,o = this;do {o = o.parent;if (o == null) {break;}p = o.name + "." + p;} while (true);return p;};ab.toString = function (o) {return (o ? this.className + " " : "") + this.fqn();};ab.build = function () {throw Error(this.toString(true) + " cannot be built directly");};aa.T = Z;var P = function P(r, o, p, q, s) {Z.call(this, r, o, p);this.className = "Namespace";this.children = [];this.options = q || {};this.syntax = s || "proto2";};var H = P.prototype = Object.create(Z.prototype);H.getChildren = function (o) {o = o || null;if (o == null) {return this.children.slice();}var p = [];for (var q = 0, r = this.children.length; q < r; ++q) {if (this.children[q] instanceof o) {p.push(this.children[q]);}}return p;};H.addChild = function (o) {var p;if (p = this.getChild(o.name)) {if (p instanceof ad.Field && p.name !== p.originalName && this.getChild(p.originalName) === null) {p.name = p.originalName;} else {if (o instanceof ad.Field && o.name !== o.originalName && this.getChild(o.originalName) === null) {o.name = o.originalName;} else {throw Error("Duplicate name in namespace " + this.toString(true) + ": " + o.name);}}}this.children.push(o);};H.getChild = function (o) {var p = typeof o === "number" ? "id" : "name";for (var q = 0, r = this.children.length; q < r; ++q) {if (this.children[q][p] === o) {return this.children[q];}}return null;};H.resolve = function (q, t) {var s = typeof q === "string" ? q.split(".") : q,o = this,r = 0;if (s[r] === "") {while (o.parent !== null) {o = o.parent;}r++;}var p;do {do {if (!(o instanceof aa.Namespace)) {o = null;break;}p = o.getChild(s[r]);if (!p || !(p instanceof aa.T) || t && !(p instanceof aa.Namespace)) {o = null;break;}o = p;r++;} while (r < s.length);if (o != null) {break;}if (this.parent !== null) {return this.parent.resolve(q, t);}} while (o != null);return o;};H.qn = function (q) {var r = [],o = q;do {r.unshift(o.name);o = o.parent;} while (o !== null);for (var s = 1; s <= r.length; s++) {var p = r.slice(r.length - s);if (q === this.resolve(p, q instanceof aa.Namespace)) {return p.join(".");}}return q.fqn();};H.build = function () {var p = {};var q = this.children;for (var r = 0, s = q.length, o; r < s; ++r) {o = q[r];if (o instanceof P) {p[o.name] = o.build();}}if (Object.defineProperty) {Object.defineProperty(p, "$options", { value: this.buildOpt() });}return p;};H.buildOpt = function () {var q = {},p = Object.keys(this.options);for (var r = 0, t = p.length; r < t; ++r) {var s = p[r],o = this.options[p[r]];q[s] = o;}return q;};H.getOption = function (o) {if (typeof o === "undefined") {return this.options;}return typeof this.options[o] !== "undefined" ? this.options[o] : null;};aa.Namespace = P;var J = function J(o, q, p, r) {this.type = o;this.resolvedType = q;this.isMapKey = p;this.syntax = r;if (p && V.MAP_KEY_TYPES.indexOf(o) < 0) {throw Error("Invalid map key type: " + o.name);}};var b = J.prototype;function F(o) {if (typeof o === "string") {o = V.TYPES[o];}if (typeof o.defaultValue === "undefined") {throw Error("default value for type " + o.name + " is not supported");}if (o == V.TYPES.bytes) {return new n(0);}return o.defaultValue;}J.defaultFieldValue = F;function W(o, p) {if (o && typeof o.low === "number" && typeof o.high === "number" && typeof o.unsigned === "boolean" && o.low === o.low && o.high === o.high) {return new V.Long(o.low, o.high, typeof p === "undefined" ? o.unsigned : p);}if (typeof o === "string") {return V.Long.fromString(o, p || false, 10);}if (typeof o === "number") {return V.Long.fromNumber(o, p || false);}throw Error("not convertible to Long");}b.verifyValue = function (q) {var t = function (v, u) {throw Error("Illegal value for " + this.toString(true) + " of type " + this.type.name + ": " + v + " (" + u + ")");}.bind(this);switch (this.type) {case V.TYPES.int32:case V.TYPES.sint32:case V.TYPES.sfixed32:if (typeof q !== "number" || q === q && q % 1 !== 0) {t(typeof q, "not an integer");}return q > 4294967295 ? q | 0 : q;case V.TYPES.uint32:case V.TYPES.fixed32:if (typeof q !== "number" || q === q && q % 1 !== 0) {t(typeof q, "not an integer");}return q < 0 ? q >>> 0 : q;case V.TYPES.int64:case V.TYPES.sint64:case V.TYPES.sfixed64:if (V.Long) {try {return W(q, false);} catch (o) {t(typeof q, o.message);}} else {t(typeof q, "requires Long.js");}case V.TYPES.uint64:case V.TYPES.fixed64:if (V.Long) {try {return W(q, true);} catch (o) {t(typeof q, o.message);}} else {t(typeof q, "requires Long.js");}case V.TYPES.bool:if (typeof q !== "boolean") {t(typeof q, "not a boolean");}return q;case V.TYPES["float"]:case V.TYPES["double"]:if (typeof q !== "number") {t(typeof q, "not a number");}return q;case V.TYPES.string:if (typeof q !== "string" && !(q && q instanceof String)) {t(typeof q, "not a string");}return "" + q;case V.TYPES.bytes:if (j.isByteBuffer(q)) {return q;}return j.wrap(q);case V.TYPES["enum"]:var s = this.resolvedType.getChildren(V.Reflect.Enum.Value);for (r = 0; r < s.length; r++) {if (s[r].name == q) {return s[r].id;} else {if (s[r].id == q) {return s[r].id;}}}if (this.syntax === "proto3") {if (typeof q !== "number" || q === q && q % 1 !== 0) {t(typeof q, "not an integer");}if (q > 4294967295 || q < 0) {t(typeof q, "not in range for uint32");}return q;} else {t(q, "not a valid enum value");}case V.TYPES.group:case V.TYPES.message:if (!q || typeof q !== "object") {t(typeof q, "object expected");}if (q instanceof this.resolvedType.clazz) {return q;}if (q instanceof V.Builder.Message) {var p = {};for (var r in q) {if (q.hasOwnProperty(r)) {p[r] = q[r];}}q = p;}return new this.resolvedType.clazz(q);}throw Error("[INTERNAL] Illegal value for " + this.toString(true) + ": " + q + " (undefined type " + this.type + ")");};b.calculateLength = function (o, q) {if (q === null) {return 0;}var p;switch (this.type) {case V.TYPES.int32:return q < 0 ? n.calculateVarint64(q) : n.calculateVarint32(q);case V.TYPES.uint32:return n.calculateVarint32(q);case V.TYPES.sint32:return n.calculateVarint32(n.zigZagEncode32(q));case V.TYPES.fixed32:case V.TYPES.sfixed32:case V.TYPES["float"]:return 4;case V.TYPES.int64:case V.TYPES.uint64:return n.calculateVarint64(q);case V.TYPES.sint64:return n.calculateVarint64(n.zigZagEncode64(q));case V.TYPES.fixed64:case V.TYPES.sfixed64:return 8;case V.TYPES.bool:return 1;case V.TYPES["enum"]:return n.calculateVarint32(q);case V.TYPES["double"]:return 8;case V.TYPES.string:p = n.calculateUTF8Bytes(q);return n.calculateVarint32(p) + p;case V.TYPES.bytes:if (q.remaining() < 0) {throw Error("Illegal value for " + this.toString(true) + ": " + q.remaining() + " bytes remaining");}return n.calculateVarint32(q.remaining()) + q.remaining();case V.TYPES.message:p = this.resolvedType.calculate(q);return n.calculateVarint32(p) + p;case V.TYPES.group:p = this.resolvedType.calculate(q);return p + n.calculateVarint32(o << 3 | V.WIRE_TYPES.ENDGROUP);}throw Error("[INTERNAL] Illegal value to encode in " + this.toString(true) + ": " + q + " (unknown type)");};b.encodeValue = function (o, r, s) {if (r === null) {return s;}switch (this.type) {case V.TYPES.int32:if (r < 0) {s.writeVarint64(r);} else {s.writeVarint32(r);}break;case V.TYPES.uint32:s.writeVarint32(r);break;case V.TYPES.sint32:s.writeVarint32ZigZag(r);break;case V.TYPES.fixed32:s.writeUint32(r);break;case V.TYPES.sfixed32:s.writeInt32(r);break;case V.TYPES.int64:case V.TYPES.uint64:s.writeVarint64(r);break;case V.TYPES.sint64:s.writeVarint64ZigZag(r);break;case V.TYPES.fixed64:s.writeUint64(r);break;case V.TYPES.sfixed64:s.writeInt64(r);break;case V.TYPES.bool:if (typeof r === "string") {s.writeVarint32(r.toLowerCase() === "false" ? 0 : !!r);} else {s.writeVarint32(r ? 1 : 0);}break;case V.TYPES["enum"]:s.writeVarint32(r);break;case V.TYPES["float"]:s.writeFloat32(r);break;case V.TYPES["double"]:s.writeFloat64(r);break;case V.TYPES.string:s.writeVString(r);break;case V.TYPES.bytes:if (r.remaining() < 0) {throw Error("Illegal value for " + this.toString(true) + ": " + r.remaining() + " bytes remaining");}var q = r.offset;s.writeVarint32(r.remaining());s.append(r);r.offset = q;break;case V.TYPES.message:var p = new n().LE();this.resolvedType.encode(r, p);s.writeVarint32(p.offset);s.append(p.flip());break;case V.TYPES.group:this.resolvedType.encode(r, s);s.writeVarint32(o << 3 | V.WIRE_TYPES.ENDGROUP);break;default:throw Error("[INTERNAL] Illegal value to encode in " + this.toString(true) + ": " + r + " (unknown type)");}return s;};b.decode = function (r, s, o) {if (s != this.type.wireType) {throw Error("Unexpected wire type for element");}var q, p;switch (this.type) {case V.TYPES.int32:return r.readVarint32() | 0;case V.TYPES.uint32:return r.readVarint32() >>> 0;case V.TYPES.sint32:return r.readVarint32ZigZag() | 0;case V.TYPES.fixed32:return r.readUint32() >>> 0;case V.TYPES.sfixed32:return r.readInt32() | 0;case V.TYPES.int64:return r.readVarint64();case V.TYPES.uint64:return r.readVarint64().toUnsigned();case V.TYPES.sint64:return r.readVarint64ZigZag();case V.TYPES.fixed64:return r.readUint64();case V.TYPES.sfixed64:return r.readInt64();case V.TYPES.bool:return !!r.readVarint32();case V.TYPES["enum"]:return r.readVarint32();case V.TYPES["float"]:return r.readFloat();case V.TYPES["double"]:return r.readDouble();case V.TYPES.string:return r.readVString();case V.TYPES.bytes:p = r.readVarint32();if (r.remaining() < p) {throw Error("Illegal number of bytes for " + this.toString(true) + ": " + p + " required but got only " + r.remaining());}q = r.clone();q.limit = q.offset + p;r.offset += p;return q;case V.TYPES.message:p = r.readVarint32();return this.resolvedType.decode(r, p);case V.TYPES.group:return this.resolvedType.decode(r, -1, o);}throw Error("[INTERNAL] Illegal decode type");};b.valueFromString = function (o) {if (!this.isMapKey) {throw Error("valueFromString() called on non-map-key element");}switch (this.type) {case V.TYPES.int32:case V.TYPES.sint32:case V.TYPES.sfixed32:case V.TYPES.uint32:case V.TYPES.fixed32:return this.verifyValue(parseInt(o));case V.TYPES.int64:case V.TYPES.sint64:case V.TYPES.sfixed64:case V.TYPES.uint64:case V.TYPES.fixed64:return this.verifyValue(o);case V.TYPES.bool:return o === "true";case V.TYPES.string:return this.verifyValue(o);case V.TYPES.bytes:return n.fromBinary(o);}};b.valueToString = function (o) {if (!this.isMapKey) {throw Error("valueToString() called on non-map-key element");}if (this.type === V.TYPES.bytes) {return o.toString("binary");} else {return o.toString();}};aa.Element = J;var ad = function ad(s, p, q, r, o, t) {P.call(this, s, p, q, r, t);this.className = "Message";this.extensions = undefined;this.clazz = null;this.isGroup = !!o;this._fields = null;this._fieldsById = null;this._fieldsByName = null;};var L = ad.prototype = Object.create(P.prototype);L.build = function (s) {if (this.clazz && !s) {return this.clazz;}var q = function (y, E) {var A = E.getChildren(y.Reflect.Message.Field),v = E.getChildren(y.Reflect.Message.OneOf);var x = function x(ak, ag) {y.Builder.Message.call(this);for (var aj = 0, af = v.length; aj < af; ++aj) {this[v[aj].name] = null;}for (aj = 0, af = A.length; aj < af; ++aj) {var ah = A[aj];this[ah.name] = ah.repeated ? [] : ah.map ? new y.Map(ah) : null;if ((ah.required || E.syntax === "proto3") && ah.defaultValue !== null) {this[ah.name] = ah.defaultValue;}}if (arguments.length > 0) {var ai;if (arguments.length === 1 && ak !== null && typeof ak === "object" && (typeof ak.encode !== "function" || ak instanceof x) && !Array.isArray(ak) && !(ak instanceof y.Map) && !n.isByteBuffer(ak) && !(ak instanceof ArrayBuffer) && !(y.Long && ak instanceof y.Long)) {this.$set(ak);} else {for (aj = 0, af = arguments.length; aj < af; ++aj) {if (typeof (ai = arguments[aj]) !== "undefined") {this.$set(A[aj].name, ai);}}}}};var B = x.prototype = Object.create(y.Builder.Message.prototype);B.add = function (af, ai, ah) {var ag = E._fieldsByName[af];if (!ah) {if (!ag) {throw Error(this + "#" + af + " is undefined");}if (!(ag instanceof y.Reflect.Message.Field)) {throw Error(this + "#" + af + " is not a field: " + ag.toString(true));}if (!ag.repeated) {throw Error(this + "#" + af + " is not a repeated field");}ai = ag.verifyValue(ai, true);}if (this[af] === null) {this[af] = [];}this[af].push(ai);return this;};B.$add = B.add;B.set = function (ag, ak, ah) {if (ag && typeof ag === "object") {ah = ak;for (var aj in ag) {if (ag.hasOwnProperty(aj) && typeof (ak = ag[aj]) !== "undefined") {this.$set(aj, ak, ah);}}return this;}var ai = E._fieldsByName[ag];if (!ah) {if (!ai) {throw Error(this + "#" + ag + " is not a field: undefined");}if (!(ai instanceof y.Reflect.Message.Field)) {throw Error(this + "#" + ag + " is not a field: " + ai.toString(true));}this[ai.name] = ak = ai.verifyValue(ak);} else {this[ag] = ak;}if (ai && ai.oneof) {var af = this[ai.oneof.name];if (ak !== null) {if (af !== null && af !== ai.name) {this[af] = null;}this[ai.oneof.name] = ai.name;} else {if (af === ag) {this[ai.oneof.name] = null;}}}return this;};B.$set = B.set;B.get = function (af, ag) {if (ag) {return this[af];}var ah = E._fieldsByName[af];if (!ah || !(ah instanceof y.Reflect.Message.Field)) {throw Error(this + "#" + af + " is not a field: undefined");}if (!(ah instanceof y.Reflect.Message.Field)) {throw Error(this + "#" + af + " is not a field: " + ah.toString(true));}return this[ah.name];};B.$get = B.get;for (var D = 0; D < A.length; D++) {var w = A[D];if (w instanceof y.Reflect.Message.ExtensionField) {continue;}if (E.builder.options.populateAccessors) {(function (ai) {var aj = ai.originalName.replace(/(_[a-zA-Z])/g, function (ak) {return ak.toUpperCase().replace("_", "");});aj = aj.substring(0, 1).toUpperCase() + aj.substring(1);var ah = ai.originalName.replace(/([A-Z])/g, function (ak) {return "_" + ak;});var ag = function ag(al, ak) {this[ai.name] = ak ? al : ai.verifyValue(al);return this;};var af = function af() {return this[ai.name];};if (E.getChild("set" + aj) === null) {B["set" + aj] = ag;}if (E.getChild("set_" + ah) === null) {B["set_" + ah] = ag;}if (E.getChild("get" + aj) === null) {B["get" + aj] = af;}if (E.getChild("get_" + ah) === null) {B["get_" + ah] = af;}})(w);}}B.encode = function (aj, ai) {if (typeof aj === "boolean") {ai = aj, aj = undefined;}var af = false;if (!aj) {aj = new j(), af = true;}var ah = aj.littleEndian;try {E.encode(this, aj.LE(), ai);return (af ? aj.flip() : aj).LE(ah);} catch (ag) {aj.LE(ah);throw ag;}};x.encode = function (ag, af, ah) {return new x(ag).encode(af, ah);};B.calculate = function () {return E.calculate(this);};B.encodeDelimited = function (ah) {var af = false;if (!ah) {ah = new n(), af = true;}var ag = new n().LE();E.encode(this, ag).flip();ah.writeVarint32(ag.remaining());ah.append(ag);return af ? ah.flip() : ah;};B.encodeAB = function () {try {return this.encode().toArrayBuffer();} catch (af) {if (af.encoded) {af.encoded = af.encoded.toArrayBuffer();}throw af;}};B.toArrayBuffer = B.encodeAB;B.encodeNB = function () {try {return this.encode().toBuffer();} catch (af) {if (af.encoded) {af.encoded = af.encoded.toBuffer();}throw af;}};B.toBuffer = B.encodeNB;B.encode64 = function () {try {return this.encode().toBase64();} catch (af) {if (af.encoded) {af.encoded = af.encoded.toBase64();}throw af;}};B.toBase64 = B.encode64;B.encodeHex = function () {try {return this.encode().toHex();} catch (af) {if (af.encoded) {af.encoded = af.encoded.toHex();}throw af;}};B.toHex = B.encodeHex;function u(aj, aq, at, am) {if (aj === null || typeof aj !== "object") {if (am && am instanceof y.Reflect.Enum) {var al = y.Reflect.Enum.getName(am.object, aj);if (al !== null) {return al;}}return aj;}if (n.isByteBuffer(aj)) {return aq ? aj.toBase64() : aj.toBuffer();}if (y.Long.isLong(aj)) {return at ? aj.toString() : y.Long.fromValue(aj);}var ao;if (Array.isArray(aj)) {ao = [];aj.forEach(function (ag, af) {ao[af] = u(ag, aq, at, am);});return ao;}ao = {};if (aj instanceof y.Map) {var ai = aj.entries();for (var ar = ai.next(); !ar.done; ar = ai.next()) {ao[aj.keyElem.valueToString(ar.value[0])] = u(ar.value[1], aq, at, aj.valueElem.resolvedType);}return ao;}var ap = aj.$type,an = undefined;for (var ak in aj) {if (aj.hasOwnProperty(ak)) {if (ap && (an = ap.getChild(ak))) {ao[ak] = u(aj[ak], aq, at, an.resolvedType);} else {ao[ak] = u(aj[ak], aq, at);}}}return ao;}B.toRaw = function (af, ag) {return u(this, !!af, !!ag, this.$type);};B.encodeJSON = function () {return JSON.stringify(u(this, true, true, this.$type));};x.decode = function (af, aj) {if (typeof af === "string") {af = n.wrap(af, aj ? aj : "base64");}af = n.isByteBuffer(af) ? af : n.wrap(af);var ai = af.littleEndian;try {var ag = E.decode(af.LE());af.LE(ai);return ag;} catch (ah) {af.LE(ai);throw ah;}};x.decodeDelimited = function (ak, aj) {if (typeof ak === "string") {ak = n.wrap(ak, aj ? aj : "base64");}ak = n.isByteBuffer(ak) ? ak : n.wrap(ak);if (ak.remaining() < 1) {return null;}var ag = ak.offset,af = ak.readVarint32();if (ak.remaining() < af) {ak.offset = ag;return null;}try {var ah = E.decode(ak.slice(ak.offset, ak.offset + af).LE());ak.offset += af;return ah;} catch (ai) {ak.offset += af;throw ai;}};x.decode64 = function (af) {return x.decode(af, "base64");};x.decodeHex = function (af) {return x.decode(af, "hex");};x.decodeJSON = function (af) {return new x(JSON.parse(af));};B.toString = function () {return E.toString();};var ae;var C;var t;var z;if (Object.defineProperty) {Object.defineProperty(x, "$options", { value: E.buildOpt() }), Object.defineProperty(B, "$options", { value: x["$options"] }), Object.defineProperty(x, "$type", { value: E }), Object.defineProperty(B, "$type", { value: E });}return x;}(V, this);this._fields = [];this._fieldsById = {};this._fieldsByName = {};for (var p = 0, r = this.children.length, o; p < r; p++) {o = this.children[p];if (o instanceof M || o instanceof ad || o instanceof Q) {if (q.hasOwnProperty(o.name)) {throw Error("Illegal reflect child of " + this.toString(true) + ": " + o.toString(true) + " cannot override static property '" + o.name + "'");}q[o.name] = o.build();} else {if (o instanceof ad.Field) {o.build(), this._fields.push(o), this._fieldsById[o.id] = o, this._fieldsByName[o.name] = o;} else {if (!(o instanceof ad.OneOf) && !(o instanceof T)) {throw Error("Illegal reflect child of " + this.toString(true) + ": " + this.children[p].toString(true));}}}}return this.clazz = q;};L.encode = function (o, s, r) {var w = null,p;for (var q = 0, t = this._fields.length, v; q < t; ++q) {p = this._fields[q];v = o[p.name];if (p.required && v === null) {if (w === null) {w = p;}} else {p.encode(r ? v : p.verifyValue(v), s, o);}}if (w !== null) {var u = Error("Missing at least one required field for " + this.toString(true) + ": " + w);u.encoded = s;throw u;}return s;};L.calculate = function (r) {for (var o = 0, s = 0, t = this._fields.length, q, p; s < t; ++s) {q = this._fields[s];p = r[q.name];if (q.required && p === null) {throw Error("Missing at least one required field for " + this.toString(true) + ": " + q);} else {o += q.calculate(p, r);}}return o;};function O(p, q) {var r = q.readVarint32(),s = r & 7,o = r >>> 3;switch (s) {case V.WIRE_TYPES.VARINT:do {r = q.readUint8();} while ((r & 128) === 128);break;case V.WIRE_TYPES.BITS64:q.offset += 8;break;case V.WIRE_TYPES.LDELIM:r = q.readVarint32();q.offset += r;break;case V.WIRE_TYPES.STARTGROUP:O(o, q);break;case V.WIRE_TYPES.ENDGROUP:if (o === p) {return false;} else {throw Error("Illegal GROUPEND after unknown group: " + o + " (" + p + " expected)");}case V.WIRE_TYPES.BITS32:q.offset += 4;break;default:throw Error("Illegal wire type in unknown group " + p + ": " + s);}return true;}L.decode = function (w, A, u) {A = typeof A === "number" ? A : -1;var C = w.offset,z = new this.clazz(),o,p,B,r;while (w.offset < C + A || A === -1 && w.remaining() > 0) {o = w.readVarint32();p = o & 7;B = o >>> 3;if (p === V.WIRE_TYPES.ENDGROUP) {if (B !== u) {throw Error("Illegal group end indicator for " + this.toString(true) + ": " + B + " (" + (u ? u + " expected" : "not a group") + ")");}break;}if (!(r = this._fieldsById[B])) {switch (p) {case V.WIRE_TYPES.VARINT:w.readVarint32();break;case V.WIRE_TYPES.BITS32:w.offset += 4;break;case V.WIRE_TYPES.BITS64:w.offset += 8;break;case V.WIRE_TYPES.LDELIM:var t = w.readVarint32();w.offset += t;break;case V.WIRE_TYPES.STARTGROUP:while (O(B, w)) {}break;default:throw Error("Illegal wire type for unknown field " + B + " in " + this.toString(true) + "#decode: " + p);}continue;}if (r.repeated && !r.options.packed) {z[r.name].push(r.decode(p, w));} else {if (r.map) {var s = r.decode(p, w);z[r.name].set(s[0], s[1]);} else {z[r.name] = r.decode(p, w);if (r.oneof) {var q = z[r.oneof.name];if (q !== null && q !== r.name) {z[q] = null;}z[r.oneof.name] = r.name;}}}}for (var v = 0, x = this._fields.length; v < x; ++v) {r = this._fields[v];if (z[r.name] === null) {if (this.syntax === "proto3") {z[r.name] = r.defaultValue;} else {if (r.required) {var y = Error("Missing at least one required field for " + this.toString(true) + ": " + r.name);y.decoded = z;throw y;} else {if (V.populateDefaults && r.defaultValue !== null) {z[r.name] = r.defaultValue;}}}}}return z;};aa.Message = ad;var X = function X(t, p, q, v, r, x, w, o, s, u) {Z.call(this, t, p, x);this.className = "Message.Field";this.required = q === "required";this.repeated = q === "repeated";this.map = q === "map";this.keyType = v || null;this.type = r;this.resolvedType = null;this.id = w;this.options = o || {};this.defaultValue = null;this.oneof = s || null;this.syntax = u || "proto2";this.originalName = this.name;this.element = null;this.keyElement = null;if (this.builder.options.convertFieldsToCamelCase && !(this instanceof ad.ExtensionField)) {this.name = V.Util.toCamelCase(this.name);}};var N = X.prototype = Object.create(Z.prototype);N.build = function () {this.element = new J(this.type, this.resolvedType, false, this.syntax);if (this.map) {this.keyElement = new J(this.keyType, undefined, true, this.syntax);}if (this.syntax === "proto3" && !this.repeated && !this.map) {this.defaultValue = J.defaultFieldValue(this.type);} else {if (typeof this.options["default"] !== "undefined") {this.defaultValue = this.verifyValue(this.options["default"]);}}};N.verifyValue = function (o, r) {r = r || false;var s = function (t, u) {throw Error("Illegal value for " + this.toString(true) + " of type " + this.type.name + ": " + t + " (" + u + ")");}.bind(this);if (o === null) {if (this.required) {s(typeof o, "required");}if (this.syntax === "proto3" && this.type !== V.TYPES.message) {s(typeof o, "proto3 field without field presence cannot be null");}return null;}var p;if (this.repeated && !r) {if (!Array.isArray(o)) {o = [o];}var q = [];for (p = 0; p < o.length; p++) {q.push(this.element.verifyValue(o[p]));}return q;}if (this.map && !r) {if (!(o instanceof V.Map)) {if (!(o instanceof Object)) {s(typeof o, "expected ProtoBuf.Map or raw object for map field");}return new V.Map(this, o);} else {return o;}}if (!this.repeated && Array.isArray(o)) {s(typeof o, "no array expected");}return this.element.verifyValue(o);};N.hasWirePresence = function (o, p) {if (this.syntax !== "proto3") {return o !== null;}if (this.oneof && p[this.oneof.name] === this.name) {return true;}switch (this.type) {case V.TYPES.int32:case V.TYPES.sint32:case V.TYPES.sfixed32:case V.TYPES.uint32:case V.TYPES.fixed32:return o !== 0;case V.TYPES.int64:case V.TYPES.sint64:case V.TYPES.sfixed64:case V.TYPES.uint64:case V.TYPES.fixed64:return o.low !== 0 || o.high !== 0;case V.TYPES.bool:return o;case V.TYPES["float"]:case V.TYPES["double"]:return o !== 0;case V.TYPES.string:return o.length > 0;case V.TYPES.bytes:return o.remaining() > 0;case V.TYPES["enum"]:return o !== 0;case V.TYPES.message:return o !== null;default:return true;}};N.encode = function (p, t, o) {if (this.type === null || typeof this.type !== "object") {throw Error("[INTERNAL] Unresolved type in " + this.toString(true) + ": " + this.type);}if (p === null || this.repeated && p.length == 0) {return t;}try {if (this.repeated) {var s;if (this.options.packed && V.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {t.writeVarint32(this.id << 3 | V.WIRE_TYPES.LDELIM);t.ensureCapacity(t.offset += 1);var w = t.offset;for (s = 0; s < p.length; s++) {this.element.encodeValue(this.id, p[s], t);}var r = t.offset - w,u = n.calculateVarint32(r);if (u > 1) {var v = t.slice(w, t.offset);w += u - 1;t.offset = w;t.append(v);}t.writeVarint32(r, w - u);} else {for (s = 0; s < p.length; s++) {t.writeVarint32(this.id << 3 | this.type.wireType), this.element.encodeValue(this.id, p[s], t);}}} else {if (this.map) {p.forEach(function (x, z, A) {var y = n.calculateVarint32(1 << 3 | this.keyType.wireType) + this.keyElement.calculateLength(1, z) + n.calculateVarint32(2 << 3 | this.type.wireType) + this.element.calculateLength(2, x);t.writeVarint32(this.id << 3 | V.WIRE_TYPES.LDELIM);t.writeVarint32(y);t.writeVarint32(1 << 3 | this.keyType.wireType);this.keyElement.encodeValue(1, z, t);t.writeVarint32(2 << 3 | this.type.wireType);this.element.encodeValue(2, x, t);}, this);} else {if (this.hasWirePresence(p, o)) {t.writeVarint32(this.id << 3 | this.type.wireType);this.element.encodeValue(this.id, p, t);}}}} catch (q) {throw Error("Illegal value for " + this.toString(true) + ": " + p + " (" + q + ")");}return t;};N.calculate = function (q, r) {q = this.verifyValue(q);if (this.type === null || typeof this.type !== "object") {throw Error("[INTERNAL] Unresolved type in " + this.toString(true) + ": " + this.type);}if (q === null || this.repeated && q.length == 0) {return 0;}var o = 0;try {if (this.repeated) {var s, t;if (this.options.packed && V.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {o += n.calculateVarint32(this.id << 3 | V.WIRE_TYPES.LDELIM);t = 0;for (s = 0; s < q.length; s++) {t += this.element.calculateLength(this.id, q[s]);}o += n.calculateVarint32(t);o += t;} else {for (s = 0; s < q.length; s++) {o += n.calculateVarint32(this.id << 3 | this.type.wireType), o += this.element.calculateLength(this.id, q[s]);}}} else {if (this.map) {q.forEach(function (v, x, u) {var w = n.calculateVarint32(1 << 3 | this.keyType.wireType) + this.keyElement.calculateLength(1, x) + n.calculateVarint32(2 << 3 | this.type.wireType) + this.element.calculateLength(2, v);o += n.calculateVarint32(this.id << 3 | V.WIRE_TYPES.LDELIM);o += n.calculateVarint32(w);o += w;}, this);} else {if (this.hasWirePresence(q, r)) {o += n.calculateVarint32(this.id << 3 | this.type.wireType);o += this.element.calculateLength(this.id, q);}}}} catch (p) {throw Error("Illegal value for " + this.toString(true) + ": " + q + " (" + p + ")");}return o;};N.decode = function (s, x, v) {var t, w;var p = !this.map && s == this.type.wireType || !v && this.repeated && this.options.packed && s == V.WIRE_TYPES.LDELIM || this.map && s == V.WIRE_TYPES.LDELIM;if (!p) {throw Error("Illegal wire type for field " + this.toString(true) + ": " + s + " (" + this.type.wireType + " expected)");}if (s == V.WIRE_TYPES.LDELIM && this.repeated && this.options.packed && V.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {if (!v) {w = x.readVarint32();w = x.offset + w;var q = [];while (x.offset < w) {q.push(this.decode(this.type.wireType, x, true));}return q;}}if (this.map) {var r = J.defaultFieldValue(this.keyType);t = J.defaultFieldValue(this.type);w = x.readVarint32();if (x.remaining() < w) {throw Error("Illegal number of bytes for " + this.toString(true) + ": " + w + " required but got only " + x.remaining());}var u = x.clone();u.limit = u.offset + w;x.offset += w;while (u.remaining() > 0) {var o = u.readVarint32();s = o & 7;var y = o >>> 3;if (y === 1) {r = this.keyElement.decode(u, s, y);} else {if (y === 2) {t = this.element.decode(u, s, y);} else {throw Error("Unexpected tag in map field key/value submessage");}}}return [r, t];}return this.element.decode(x, s, this.id);};aa.Message.Field = X;var I = function I(u, q, p, r, s, o, t) {X.call(this, u, q, p, null, r, s, o, t);this.extension;};I.prototype = Object.create(X.prototype);aa.Message.ExtensionField = I;var G = function G(q, o, p) {Z.call(this, q, o, p);this.fields = [];};aa.Message.OneOf = G;var M = function M(r, o, p, q, s) {P.call(this, r, o, p, q, s);this.className = "Enum";this.object = null;};M.getName = function (s, o) {var p = Object.keys(s);for (var q = 0, r; q < p.length; ++q) {if (s[r = p[q]] === o) {return r;}}return null;};var Y = M.prototype = Object.create(P.prototype);Y.build = function (s) {if (this.object && !s) {return this.object;}var p = new V.Builder.Enum(),q = this.getChildren(M.Value);for (var o = 0, r = q.length; o < r; ++o) {p[q[o]["name"]] = q[o]["id"];}if (Object.defineProperty) {Object.defineProperty(p, "$options", { value: this.buildOpt(), enumerable: false });}return this.object = p;};aa.Enum = M;var R = function R(r, p, q, o) {Z.call(this, r, p, q);this.className = "Enum.Value";this.id = o;};R.prototype = Object.create(Z.prototype);aa.Enum.Value = R;var T = function T(r, p, q, o) {Z.call(this, r, p, q);this.field = o;};T.prototype = Object.create(Z.prototype);aa.Extension = T;var Q = function Q(q, r, o, p) {P.call(this, q, r, o, p);this.className = "Service";this.clazz = null;};var S = Q.prototype = Object.create(P.prototype);S.build = function (o) {if (this.clazz && !o) {return this.clazz;}return this.clazz = function (r, w) {var x = function x(z) {r.Builder.Service.call(this);this.rpcImpl = z || function (C, B, A) {setTimeout(A.bind(this, Error("Not implemented, see: https://github.com/dcodeIO/ProtoBuf.js/wiki/Services")), 0);};};var q = x.prototype = Object.create(r.Builder.Service.prototype);var t = w.getChildren(r.Reflect.Service.RPCMethod);for (var v = 0; v < t.length; v++) {(function (z) {q[z.name] = function (B, A) {try {try {B = z.resolvedRequestType.clazz.decode(n.wrap(B));} catch (C) {if (!(C instanceof TypeError)) {throw C;}}if (B === null || typeof B !== "object") {throw Error("Illegal arguments");}if (!(B instanceof z.resolvedRequestType.clazz)) {B = new z.resolvedRequestType.clazz(B);}this.rpcImpl(z.fqn(), B, function (E, ae) {if (E) {A(E);return;}try {ae = z.resolvedResponseType.clazz.decode(ae);} catch (D) {}if (!ae || !(ae instanceof z.resolvedResponseType.clazz)) {A(Error("Illegal response type received in service method " + w.name + "#" + z.name));return;}A(null, ae);});} catch (C) {setTimeout(A.bind(this, C), 0);}};x[z.name] = function (C, B, A) {new x(C)[z.name](B, A);};if (Object.defineProperty) {Object.defineProperty(x[z.name], "$options", { value: z.buildOpt() }), Object.defineProperty(q[z.name], "$options", { value: x[z.name]["$options"] });}})(t[v]);}var y;var u;var p;var s;if (Object.defineProperty) {Object.defineProperty(x, "$options", { value: w.buildOpt() }), Object.defineProperty(q, "$options", { value: x["$options"] }), Object.defineProperty(x, "$type", { value: w }), Object.defineProperty(q, "$type", { value: w });}return x;}(V, this);};aa.Service = Q;var ac = function ac(r, o, p, q) {Z.call(this, r, o, p);this.className = "Service.Method";this.options = q || {};};var U = ac.prototype = Object.create(Z.prototype);U.buildOpt = H.buildOpt;aa.Service.Method = ac;var K = function K(s, v, p, o, t, q, u, r) {ac.call(this, s, v, p, r);this.className = "Service.RPCMethod";this.requestName = o;this.responseName = t;this.requestStream = q;this.responseStream = u;this.resolvedRequestType = null;this.resolvedResponseType = null;};K.prototype = Object.create(ac.prototype);aa.Service.RPCMethod = K;return aa;}(l);l.Builder = function (p, q, b) {var o = function o(t) {this.ns = new b.Namespace(this, null, "");this.ptr = this.ns;this.resolved = false;this.result = null;this.files = {};this.importRoot = null;this.options = t || {};};var s = o.prototype;o.isMessage = function (t) {if (typeof t.name !== "string") {return false;}if (typeof t.values !== "undefined" || typeof t.rpc !== "undefined") {return false;}return true;};o.isMessageField = function (t) {if (typeof t.rule !== "string" || typeof t.name !== "string" || typeof t.type !== "string" || typeof t.id === "undefined") {return false;}return true;};o.isEnum = function (t) {if (typeof t.name !== "string") {return false;}if (typeof t.values === "undefined" || !Array.isArray(t.values) || t.values.length === 0) {return false;}return true;};o.isService = function (t) {if (typeof t.name !== "string" || typeof t.rpc !== "object" || !t.rpc) {return false;}return true;};o.isExtend = function (t) {if (typeof t.ref !== "string") {return false;}return true;};s.reset = function () {this.ptr = this.ns;return this;};s.define = function (t) {if (typeof t !== "string" || !q.TYPEREF.test(t)) {throw Error("illegal namespace: " + t);}t.split(".").forEach(function (u) {var v = this.ptr.getChild(u);if (v === null) {this.ptr.addChild(v = new b.Namespace(this, this.ptr, u));}this.ptr = v;}, this);return this;};s.create = function (t) {if (!t) {return this;}if (!Array.isArray(t)) {t = [t];} else {if (t.length === 0) {return this;}t = t.slice();}var u = [t];while (u.length > 0) {t = u.pop();if (!Array.isArray(t)) {throw Error("not a valid namespace: " + JSON.stringify(t));}while (t.length > 0) {var w = t.shift();if (o.isMessage(w)) {var v = new b.Message(this, this.ptr, w.name, w.options, w.isGroup, w.syntax);var x = {};if (w.oneofs) {Object.keys(w.oneofs).forEach(function (z) {v.addChild(x[z] = new b.Message.OneOf(this, v, z));}, this);}if (w.fields) {w.fields.forEach(function (A) {if (v.getChild(A.id | 0) !== null) {throw Error("duplicate or invalid field id in " + v.name + ": " + A.id);}if (A.options && typeof A.options !== "object") {throw Error("illegal field options in " + v.name + "#" + A.name);}var z = null;if (typeof A.oneof === "string" && !(z = x[A.oneof])) {throw Error("illegal oneof in " + v.name + "#" + A.name + ": " + A.oneof);}A = new b.Message.Field(this, v, A.rule, A.keytype, A.type, A.name, A.id, A.options, z, w.syntax);if (z) {z.fields.push(A);}v.addChild(A);}, this);}var y = [];if (w.enums) {w.enums.forEach(function (z) {y.push(z);});}if (w.messages) {w.messages.forEach(function (z) {y.push(z);});}if (w.services) {w.services.forEach(function (z) {y.push(z);});}if (w.extensions) {if (typeof w.extensions[0] === "number") {v.extensions = [w.extensions];} else {v.extensions = w.extensions;}}this.ptr.addChild(v);if (y.length > 0) {u.push(t);t = y;y = null;this.ptr = v;v = null;continue;}y = null;} else {if (o.isEnum(w)) {v = new b.Enum(this, this.ptr, w.name, w.options, w.syntax);w.values.forEach(function (z) {v.addChild(new b.Enum.Value(this, v, z.name, z.id));}, this);this.ptr.addChild(v);} else {if (o.isService(w)) {v = new b.Service(this, this.ptr, w.name, w.options);Object.keys(w.rpc).forEach(function (z) {var A = w.rpc[z];v.addChild(new b.Service.RPCMethod(this, v, z, A.request, A.response, !!A.request_stream, !!A.response_stream, A.options));}, this);this.ptr.addChild(v);} else {if (o.isExtend(w)) {v = this.ptr.resolve(w.ref, true);if (v) {w.fields.forEach(function (C) {if (v.getChild(C.id | 0) !== null) {throw Error("duplicate extended field id in " + v.name + ": " + C.id);}if (v.extensions) {var A = false;v.extensions.forEach(function (E) {if (C.id >= E[0] && C.id <= E[1]) {A = true;}});if (!A) {throw Error("illegal extended field id in " + v.name + ": " + C.id + " (not within valid ranges)");}}var D = C.name;if (this.options.convertFieldsToCamelCase) {D = p.Util.toCamelCase(D);}var z = new b.Message.ExtensionField(this, v, C.rule, C.type, this.ptr.fqn() + "." + D, C.id, C.options);var B = new b.Extension(this, this.ptr, C.name, z);z.extension = B;this.ptr.addChild(B);v.addChild(z);}, this);} else {if (!/\.?google\.protobuf\./.test(w.ref)) {throw Error("extended message " + w.ref + " is not defined");}}} else {throw Error("not a valid definition: " + JSON.stringify(w));}}}}w = null;v = null;}t = null;this.ptr = this.ptr.parent;}this.resolved = false;this.result = null;return this;};function r(t) {if (t.messages) {t.messages.forEach(function (u) {u.syntax = t.syntax;r(u);});}if (t.enums) {t.enums.forEach(function (u) {u.syntax = t.syntax;});}}s["import"] = function (D, C) {var A = "/";if (typeof C === "string") {if (p.Util.IS_NODE) {}if (this.files[C] === true) {return this.reset();}this.files[C] = true;} else {if (typeof C === "object") {var F = C.root;if (p.Util.IS_NODE) {}if (F.indexOf("\\") >= 0 || C.file.indexOf("\\") >= 0) {A = "\\";}var z = F + A + C.file;if (this.files[z] === true) {return this.reset();}this.files[z] = true;}}if (D.imports && D.imports.length > 0) {var x,G = false;if (typeof C === "object") {this.importRoot = C.root;G = true;x = this.importRoot;C = C.file;if (x.indexOf("\\") >= 0 || C.indexOf("\\") >= 0) {A = "\\";}} else {if (typeof C === "string") {if (this.importRoot) {x = this.importRoot;} else {if (C.indexOf("/") >= 0) {x = C.replace(/\/[^\/]*$/, "");if (x === "") {x = "/";}} else {if (C.indexOf("\\") >= 0) {x = C.replace(/\\[^\\]*$/, "");A = "\\";} else {x = ".";}}}} else {x = null;}}for (var w = 0; w < D.imports.length; w++) {if (typeof D.imports[w] === "string") {if (!x) {throw Error("cannot determine import root");}var E = D.imports[w];if (E === "google/protobuf/descriptor.proto") {continue;}E = x + A + E;if (this.files[E] === true) {continue;}if (/\.proto$/i.test(E) && !p.DotProto) {E = E.replace(/\.proto$/, ".json");}var y = p.Util.fetch(E);if (y === null) {throw Error("failed to import '" + E + "' in '" + C + "': file not found");}if (/\.json$/i.test(E)) {this["import"](JSON.parse(y + ""), E);} else {this["import"](p.DotProto.Parser.parse(y), E);}} else {if (!C) {this["import"](D.imports[w]);} else {if (/\.(\w+)$/.test(C)) {this["import"](D.imports[w], C.replace(/^(.+)\.(\w+)$/, function (t, u, v) {return u + "_import" + w + "." + v;}));} else {this["import"](D.imports[w], C + "_import" + w);}}}}if (G) {this.importRoot = null;}}if (D["package"]) {this.define(D["package"]);}if (D.syntax) {r(D);}var B = this.ptr;if (D.options) {Object.keys(D.options).forEach(function (t) {B.options[t] = D.options[t];});}if (D.messages) {this.create(D.messages), this.ptr = B;}if (D.enums) {this.create(D.enums), this.ptr = B;}if (D.services) {this.create(D.services), this.ptr = B;}if (D["extends"]) {this.create(D["extends"]);}return this.reset();};s.resolveAll = function () {var t;if (this.ptr == null || typeof this.ptr.type === "object") {return this;}if (this.ptr instanceof b.Namespace) {this.ptr.children.forEach(function (u) {this.ptr = u;this.resolveAll();}, this);} else {if (this.ptr instanceof b.Message.Field) {if (!q.TYPE.test(this.ptr.type)) {if (!q.TYPEREF.test(this.ptr.type)) {throw Error("illegal type reference in " + this.ptr.toString(true) + ": " + this.ptr.type);}t = (this.ptr instanceof b.Message.ExtensionField ? this.ptr.extension.parent : this.ptr.parent).resolve(this.ptr.type, true);if (!t) {throw Error("unresolvable type reference in " + this.ptr.toString(true) + ": " + this.ptr.type);}this.ptr.resolvedType = t;if (t instanceof b.Enum) {this.ptr.type = p.TYPES["enum"];if (this.ptr.syntax === "proto3" && t.syntax !== "proto3") {throw Error("proto3 message cannot reference proto2 enum");}} else {if (t instanceof b.Message) {this.ptr.type = t.isGroup ? p.TYPES.group : p.TYPES.message;} else {throw Error("illegal type reference in " + this.ptr.toString(true) + ": " + this.ptr.type);}}} else {this.ptr.type = p.TYPES[this.ptr.type];}if (this.ptr.map) {if (!q.TYPE.test(this.ptr.keyType)) {throw Error("illegal key type for map field in " + this.ptr.toString(true) + ": " + this.ptr.keyType);}this.ptr.keyType = p.TYPES[this.ptr.keyType];}} else {if (this.ptr instanceof p.Reflect.Service.Method) {if (this.ptr instanceof p.Reflect.Service.RPCMethod) {t = this.ptr.parent.resolve(this.ptr.requestName, true);if (!t || !(t instanceof p.Reflect.Message)) {throw Error("Illegal type reference in " + this.ptr.toString(true) + ": " + this.ptr.requestName);}this.ptr.resolvedRequestType = t;t = this.ptr.parent.resolve(this.ptr.responseName, true);if (!t || !(t instanceof p.Reflect.Message)) {throw Error("Illegal type reference in " + this.ptr.toString(true) + ": " + this.ptr.responseName);}this.ptr.resolvedResponseType = t;} else {throw Error("illegal service type in " + this.ptr.toString(true));}} else {if (!(this.ptr instanceof p.Reflect.Message.OneOf) && !(this.ptr instanceof p.Reflect.Extension) && !(this.ptr instanceof p.Reflect.Enum.Value)) {throw Error("illegal object in namespace: " + typeof this.ptr + ": " + this.ptr);}}}}return this.reset();};s.build = function (w) {this.reset();if (!this.resolved) {this.resolveAll(), this.resolved = true, this.result = null;}if (this.result === null) {this.result = this.ns.build();}if (!w) {return this.result;}var u = typeof w === "string" ? w.split(".") : w,v = this.result;for (var t = 0; t < u.length; t++) {if (v[u[t]]) {v = v[u[t]];} else {v = null;break;}}return v;};s.lookup = function (t, u) {return t ? this.ns.resolve(t, u) : this.ns;};s.toString = function () {return "Builder";};o.Message = function () {};o.Enum = function () {};o.Service = function () {};return o;}(l, l.Lang, l.Reflect);l.Map = function (q, b) {var r = function r(w, x) {if (!w.map) {throw Error("field is not a map");}this.field = w;this.keyElem = new b.Element(w.keyType, null, true, w.syntax);this.valueElem = new b.Element(w.type, w.resolvedType, false, w.syntax);this.map = {};Object.defineProperty(this, "size", { get: function get() {return Object.keys(this.map).length;} });if (x) {var s = Object.keys(x);for (var t = 0; t < s.length; t++) {var u = this.keyElem.valueFromString(s[t]);var v = this.valueElem.verifyValue(x[s[t]]);this.map[this.keyElem.valueToString(u)] = { key: u, value: v };}}};var p = r.prototype;function o(s) {var t = 0;return { next: function next() {if (t < s.length) {return { done: false, value: s[t++] };}return { done: true };} };}p.clear = function () {this.map = {};};p["delete"] = function (t) {var s = this.keyElem.valueToString(this.keyElem.verifyValue(t));var u = s in this.map;delete this.map[s];return u;};p.entries = function () {var u = [];var v = Object.keys(this.map);for (var t = 0, s; t < v.length; t++) {u.push([(s = this.map[v[t]]).key, s.value]);}return o(u);};p.keys = function () {var t = [];var s = Object.keys(this.map);for (var u = 0; u < s.length; u++) {t.push(this.map[s[u]].key);}return o(t);};p.values = function () {var u = [];var s = Object.keys(this.map);for (var t = 0; t < s.length; t++) {u.push(this.map[s[t]].value);}return o(u);};p.forEach = function (u, t) {var v = Object.keys(this.map);for (var s = 0, w; s < v.length; s++) {u.call(t, (w = this.map[v[s]]).value, w.key, this);}};p.set = function (u, s) {var v = this.keyElem.verifyValue(u);var t = this.valueElem.verifyValue(s);this.map[this.keyElem.valueToString(v)] = { key: v, value: t };return this;};p.get = function (t) {var s = this.keyElem.valueToString(this.keyElem.verifyValue(t));if (!(s in this.map)) {return undefined;}return this.map[s].value;};p.has = function (t) {var s = this.keyElem.valueToString(this.keyElem.verifyValue(t));return s in this.map;};return r;}(l, l.Reflect);l.loadProto = function (b, o, p) {if (typeof o === "string" || o && typeof o.file === "string" && typeof o.root === "string") {p = o, o = undefined;}return l.loadJson(l.DotProto.Parser.parse(b), o, p);};l.protoFromString = l.loadProto;l.loadProtoFile = function (p, b, q) {if (b && typeof b === "object") {q = b, b = null;} else {if (!b || typeof b !== "function") {b = null;}}if (b) {return l.Util.fetch(typeof p === "string" ? p : p.root + "/" + p.file, function (s) {if (s === null) {b(Error("Failed to fetch file"));return;}try {b(null, l.loadProto(s, q, p));} catch (r) {b(r);}});}var o = l.Util.fetch(typeof p === "object" ? p.root + "/" + p.file : p);return o === null ? null : l.loadProto(o, q, p);};l.protoFromFile = l.loadProtoFile;l.newBuilder = function (b) {b = b || {};if (typeof b.convertFieldsToCamelCase === "undefined") {b.convertFieldsToCamelCase = l.convertFieldsToCamelCase;}if (typeof b.populateAccessors === "undefined") {b.populateAccessors = l.populateAccessors;}return new l.Builder(b);};l.loadJson = function (b, o, p) {if (typeof o === "string" || o && typeof o.file === "string" && typeof o.root === "string") {p = o, o = null;}if (!o || typeof o !== "object") {o = l.newBuilder();}if (typeof b === "string") {b = JSON.parse(b);}o["import"](b, p);o.resolveAll();return o;};l.loadJsonFile = function (p, b, q) {if (b && typeof b === "object") {q = b, b = null;} else {if (!b || typeof b !== "function") {b = null;}}if (b) {return l.Util.fetch(typeof p === "string" ? p : p.root + "/" + p.file, function (s) {if (s === null) {b(Error("Failed to fetch file"));return;}try {b(null, l.loadJson(JSON.parse(s), q, p));} catch (r) {b(r);}});}var o = l.Util.fetch(typeof p === "object" ? p.root + "/" + p.file : p);return o === null ? null : l.loadJson(JSON.parse(o), q, p);};var m = function m(b) {var s,u,v,w,r,p,t,q = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);p = b.length;r = 0;t = "";while (r < p) {do {s = q[b.charCodeAt(r++) & 255];} while (r < p && s == -1);if (s == -1) {break;}do {u = q[b.charCodeAt(r++) & 255];} while (r < p && u == -1);if (u == -1) {break;}t += String.fromCharCode(s << 2 | (u & 48) >> 4);do {v = b.charCodeAt(r++) & 255;if (v == 61) {return t;}v = q[v];} while (r < p && v == -1);if (v == -1) {break;}t += String.fromCharCode((u & 15) << 4 | (v & 60) >> 2);do {w = b.charCodeAt(r++) & 255;if (w == 61) {return t;}w = q[w];} while (r < p && w == -1);if (w == -1) {break;}t += String.fromCharCode((v & 3) << 6 | w);}return t;};var h = m("cGFja2FnZSBNb2R1bGVzOwptZXNzYWdlIHByb2J1ZiB7CiAgICBtZXNzYWdlIFNldFVzZXJTdGF0dXNJbnB1dAogICAgewogICAgICAgIG9wdGlvbmFsIGludDMyIHN0YXR1cz0xOwogICAgfQoKICAgIG1lc3NhZ2UgU2V0VXNlclN0YXR1c091dHB1dAogICAgewogICAgICAgIG9wdGlvbmFsIGludDMyIG5vdGhpbmc9MTsKICAgIH0KCiAgICBtZXNzYWdlIEdldFVzZXJTdGF0dXNJbnB1dAogICAgewogICAgICAgIG9wdGlvbmFsIGludDMyIG5vdGhpbmc9MTsKICAgIH0KCiAgICBtZXNzYWdlIEdldFVzZXJTdGF0dXNPdXRwdXQKICAgIHsKICAgICAgICBvcHRpb25hbCBzdHJpbmcgc3RhdHVzPTE7Ly8mIzIzMTvClCYjMTY4OyYjMjMwO8KIJiMxODM7JiMyMjg7JiMxOTE7JiMxNjE7JiMyMzA7woEmIzE3NTsKICAgICAgICBvcHRpb25hbCBzdHJpbmcgc3ViVXNlcklkPTI7Ly8mIzIzMjsmIzE2MjsmIzE3MTsmIzIzMjsmIzE3NDsmIzE2MjsmIzIzMzvCmMKFJiMyMzI7woDChQogICAgfQoKICAgIG1lc3NhZ2UgU3ViVXNlclN0YXR1c0lucHV0CiAgICB7CiAgICAgICAgcmVwZWF0ZWQgc3RyaW5nIHVzZXJpZCA9MTsgIC8vJiMyMzE7wpQmIzE2ODsmIzIzMDvCiCYjMTgzOyYjMjI5O8KIwpcmIzIzMjsmIzE2MTsmIzE2ODsKICAgIH0KCiAgICBtZXNzYWdlIFN1YlVzZXJTdGF0dXNPdXRwdXQKICAgIHsKICAgICAgICBvcHRpb25hbCBpbnQzMiBub3RoaW5nPTE7ICAgIC8vJiMyMjk7wo0mIzE2MDsmIzIyODsmIzE4OTvCjQogICAgfQogICAgbWVzc2FnZSBWb2lwRHluYW1pY0lucHV0CiAgICB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgIGVuZ2luZVR5cGUgPSAxOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyBjaGFubmVsTmFtZSA9IDI7CiAgICAgICAgb3B0aW9uYWwgc3RyaW5nIGNoYW5uZWxFeHRyYSA9IDM7CiAgICB9CgogICAgbWVzc2FnZSBWb2lwRHluYW1pY091dHB1dAogICAgewogICAgICAgICByZXF1aXJlZCBzdHJpbmcgZHluYW1pY0tleT0xOwogICAgfQogICAgbWVzc2FnZSBOb3RpZnlNc2cgewogICAgICAgIHJlcXVpcmVkIGludDMyIHR5cGUgPSAxOwogICAgICAgIG9wdGlvbmFsIGludDY0IHRpbWUgPSAyOwogICAgICAgIG9wdGlvbmFsIHN0cmluZyBjaHJtSWQ9MzsKICAgIH0KICAgIG1lc3NhZ2UgU3luY1JlcXVlc3RNc2cgewogICAgICAgIHJlcXVpcmVkIGludDY0IHN5bmNUaW1lID0gMTsKICAgICAgICByZXF1aXJlZCBib29sIGlzcG9sbGluZyA9IDI7CiAgICAgICAgb3B0aW9uYWwgYm9vbCBpc3dlYj0zOwogICAgICAgIG9wdGlvbmFsIGJvb2wgaXNQdWxsU2VuZD00OwogICAgICAgIG9wdGlvbmFsIGJvb2wgaXNLZWVwaW5nPTU7CiAgICAgICAgb3B0aW9uYWwgaW50NjQgc2VuZEJveFN5bmNUaW1lPTY7CiAgICB9CiAgICBtZXNzYWdlIFVwU3RyZWFtTWVzc2FnZSB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgc2Vzc2lvbklkID0gMTsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgY2xhc3NuYW1lID0gMjsKICAgICAgICByZXF1aXJlZCBieXRlcyBjb250ZW50ID0gMzsKICAgICAgICBvcHRpb25hbCBzdHJpbmcgcHVzaFRleHQgPSA0OwogICAgICAgIG9wdGlvbmFsIHN0cmluZyBhcHBEYXRhID0gNTsKICAgICAgICByZXBlYXRlZCBzdHJpbmcgdXNlcklkID0gNjsKICAgIH0KICAgIG1lc3NhZ2UgRG93blN0cmVhbU1lc3NhZ2VzIHsKICAgICAgICByZXBlYXRlZCBEb3duU3RyZWFtTWVzc2FnZSBsaXN0ID0gMTsKICAgICAgICByZXF1aXJlZCBpbnQ2NCBzeW5jVGltZSA9IDI7CiAgICAgICAgb3B0aW9uYWwgYm9vbCBmaW5pc2hlZCA9IDM7CiAgICB9CiAgICBtZXNzYWdlIERvd25TdHJlYW1NZXNzYWdlIHsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgZnJvbVVzZXJJZCA9IDE7CiAgICAgICAgcmVxdWlyZWQgQ2hhbm5lbFR5cGUgdHlwZSA9IDI7CiAgICAgICAgb3B0aW9uYWwgc3RyaW5nIGdyb3VwSWQgPSAzOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyBjbGFzc25hbWUgPSA0OwogICAgICAgIHJlcXVpcmVkIGJ5dGVzIGNvbnRlbnQgPSA1OwogICAgICAgIHJlcXVpcmVkIGludDY0IGRhdGFUaW1lID0gNjsKICAgICAgICByZXF1aXJlZCBpbnQ2NCBzdGF0dXMgPSA3OwogICAgICAgIG9wdGlvbmFsIGludDY0IGV4dHJhID0gODsKICAgICAgICBvcHRpb25hbCBzdHJpbmcgbXNnSWQgPSA5OwogICAgICAgIG9wdGlvbmFsIGludDMyIGRpcmVjdGlvbiA9IDEwOyAKICAgIH0KICAgIGVudW0gQ2hhbm5lbFR5cGUgewogICAgICAgIFBFUlNPTiA9IDE7CiAgICAgICAgUEVSU09OUyA9IDI7CiAgICAgICAgR1JPVVAgPSAzOwogICAgICAgIFRFTVBHUk9VUCA9IDQ7CiAgICAgICAgQ1VTVE9NRVJTRVJWSUNFID0gNTsKICAgICAgICBOT1RJRlkgPSA2OwogICAgICAgIE1DPTc7CiAgICAgICAgTVA9ODsKICAgIH0KICAgIG1lc3NhZ2UgQ3JlYXRlRGlzY3Vzc2lvbklucHV0IHsKICAgICAgICBvcHRpb25hbCBzdHJpbmcgbmFtZSA9IDE7CiAgICB9CiAgICBtZXNzYWdlIENyZWF0ZURpc2N1c3Npb25PdXRwdXQgewogICAgICAgIHJlcXVpcmVkIHN0cmluZyBpZCA9IDE7CiAgICB9CiAgICBtZXNzYWdlIENoYW5uZWxJbnZpdGF0aW9uSW5wdXQgewogICAgICAgIHJlcGVhdGVkIHN0cmluZyB1c2VycyA9IDE7CiAgICB9CiAgICBtZXNzYWdlIExlYXZlQ2hhbm5lbElucHV0IHsKICAgICAgICByZXF1aXJlZCBpbnQzMiBub3RoaW5nID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgQ2hhbm5lbEV2aWN0aW9uSW5wdXQgewogICAgICAgIHJlcXVpcmVkIHN0cmluZyB1c2VyID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgUmVuYW1lQ2hhbm5lbElucHV0IHsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgbmFtZSA9IDE7CiAgICB9CiAgICBtZXNzYWdlIENoYW5uZWxJbmZvSW5wdXQgewogICAgICAgIHJlcXVpcmVkIGludDMyIG5vdGhpbmcgPSAxOwogICAgfQogICAgbWVzc2FnZSBDaGFubmVsSW5mb091dHB1dCB7CiAgICAgICAgcmVxdWlyZWQgQ2hhbm5lbFR5cGUgdHlwZSA9IDE7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIGNoYW5uZWxJZCA9IDI7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIGNoYW5uZWxOYW1lID0gMzsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgYWRtaW5Vc2VySWQgPSA0OwogICAgICAgIHJlcGVhdGVkIHN0cmluZyBmaXJzdFRlblVzZXJJZHMgPSA1OwogICAgICAgIHJlcXVpcmVkIGludDMyIG9wZW5TdGF0dXMgPSA2OwogICAgfQogICAgbWVzc2FnZSBDaGFubmVsSW5mb3NJbnB1dCB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgcGFnZSA9IDE7CiAgICAgICAgb3B0aW9uYWwgaW50MzIgbnVtYmVyID0gMjsKICAgIH0KICAgIG1lc3NhZ2UgQ2hhbm5lbEluZm9zT3V0cHV0IHsKICAgICAgICByZXBlYXRlZCBDaGFubmVsSW5mb091dHB1dCBjaGFubmVscyA9IDE7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgdG90YWwgPSAyOwogICAgfQogICAgbWVzc2FnZSBNZW1iZXJJbmZvIHsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgdXNlcklkID0gMTsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgdXNlck5hbWUgPSAyOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyB1c2VyUG9ydHJhaXQgPSAzOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyBleHRlbnNpb24gPSA0OwogICAgfQogICAgbWVzc2FnZSBHcm91cE1lbWJlcnNJbnB1dCB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgcGFnZSA9IDE7CiAgICAgICAgb3B0aW9uYWwgaW50MzIgbnVtYmVyID0gMjsKICAgIH0KICAgIG1lc3NhZ2UgR3JvdXBNZW1iZXJzT3V0cHV0IHsKICAgICAgICByZXBlYXRlZCBNZW1iZXJJbmZvIG1lbWJlcnMgPSAxOwogICAgICAgIHJlcXVpcmVkIGludDMyIHRvdGFsID0gMjsKICAgIH0KICAgIG1lc3NhZ2UgR2V0VXNlckluZm9JbnB1dCB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgbm90aGluZyA9IDE7CiAgICB9CiAgICBtZXNzYWdlIEdldFVzZXJJbmZvT3V0cHV0IHsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgdXNlcklkID0gMTsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgdXNlck5hbWUgPSAyOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyB1c2VyUG9ydHJhaXQgPSAzOwogICAgfQogICAgbWVzc2FnZSBHZXRTZXNzaW9uSWRJbnB1dCB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgbm90aGluZyA9IDE7CiAgICB9CiAgICBtZXNzYWdlIEdldFNlc3Npb25JZE91dHB1dCB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgc2Vzc2lvbklkID0gMTsKICAgIH0KICAgIGVudW0gRmlsZVR5cGUgewogICAgICAgIGltYWdlID0gMTsKICAgICAgICBhdWRpbyA9IDI7CiAgICAgICAgdmlkZW8gPSAzOwogICAgICAgIGZpbGUgPSA0OwogICAgfQogICAgbWVzc2FnZSBHZXRRTnVwVG9rZW5JbnB1dCB7CiAgICAgICAgcmVxdWlyZWQgRmlsZVR5cGUgdHlwZSA9IDE7CiAgICB9CiAgICBtZXNzYWdlIEdldFFOZG93bmxvYWRVcmxJbnB1dCB7CiAgICAgICAgcmVxdWlyZWQgRmlsZVR5cGUgdHlwZSA9IDE7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIGtleSA9IDI7CiAgICAgICAgb3B0aW9uYWwgc3RyaW5nICBmaWxlTmFtZSA9IDM7CiAgICB9CiAgICBtZXNzYWdlIEdldFFOdXBUb2tlbk91dHB1dCB7CiAgICAgICAgcmVxdWlyZWQgaW50NjQgZGVhZGxpbmUgPSAxOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyB0b2tlbiA9IDI7CiAgICB9CiAgICBtZXNzYWdlIEdldFFOZG93bmxvYWRVcmxPdXRwdXQgewogICAgICAgIHJlcXVpcmVkIHN0cmluZyBkb3dubG9hZFVybCA9IDE7CiAgICB9CiAgICBtZXNzYWdlIEFkZDJCbGFja0xpc3RJbnB1dCB7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIHVzZXJJZCA9IDE7CiAgICB9CiAgICBtZXNzYWdlIFJlbW92ZUZyb21CbGFja0xpc3RJbnB1dCB7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIHVzZXJJZCA9IDE7CiAgICB9CiAgICBtZXNzYWdlIFF1ZXJ5QmxhY2tMaXN0SW5wdXQgewogICAgICAgIHJlcXVpcmVkIGludDMyIG5vdGhpbmcgPSAxOwogICAgfQogICAgbWVzc2FnZSBRdWVyeUJsYWNrTGlzdE91dHB1dCB7CiAgICAgICAgcmVwZWF0ZWQgc3RyaW5nIHVzZXJJZHMgPSAxOwogICAgfQogICAgbWVzc2FnZSBCbGFja0xpc3RTdGF0dXNJbnB1dCB7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIHVzZXJJZCA9IDE7CiAgICB9CiAgICBtZXNzYWdlIEJsb2NrUHVzaElucHV0IHsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgYmxvY2tlZUlkID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgTW9kaWZ5UGVybWlzc2lvbklucHV0IHsKICAgICAgICByZXF1aXJlZCBpbnQzMiBvcGVuU3RhdHVzID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgR3JvdXBJbnB1dCB7CiAgICAgICAgcmVwZWF0ZWQgR3JvdXBJbmZvIGdyb3VwSW5mbyA9IDE7CiAgICB9CiAgICBtZXNzYWdlIEdyb3VwT3V0cHV0IHsKICAgICAgICByZXF1aXJlZCBpbnQzMiBub3RoaW5nID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgR3JvdXBJbmZvIHsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgaWQgPSAxOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyBuYW1lID0gMjsKICAgIH0KICAgIG1lc3NhZ2UgR3JvdXBIYXNoSW5wdXQgewogICAgICAgIHJlcXVpcmVkIHN0cmluZyB1c2VySWQgPSAxOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyBncm91cEhhc2hDb2RlID0gMjsKICAgIH0KICAgIG1lc3NhZ2UgR3JvdXBIYXNoT3V0cHV0IHsKICAgICAgICByZXF1aXJlZCBHcm91cEhhc2hUeXBlIHJlc3VsdCA9IDE7CiAgICB9CiAgICBlbnVtIEdyb3VwSGFzaFR5cGUgewogICAgICAgIGdyb3VwX3N1Y2Nlc3MgPSAweDAwOwogICAgICAgIGdyb3VwX2ZhaWx1cmUgPSAweDAxOwogICAgfQogICAgbWVzc2FnZSBDaHJtSW5wdXQgewogICAgICAgIHJlcXVpcmVkIGludDMyIG5vdGhpbmcgPSAxOwogICAgfQogICAgbWVzc2FnZSBDaHJtT3V0cHV0IHsKICAgICAgICByZXF1aXJlZCBpbnQzMiBub3RoaW5nID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgQ2hybVB1bGxNc2cgewogICAgICAgIHJlcXVpcmVkIGludDY0IHN5bmNUaW1lID0gMTsKICAgICAgICByZXF1aXJlZCBpbnQzMiBjb3VudCA9IDI7CiAgICB9CiAgICAKICAgIG1lc3NhZ2UgQ2hybVB1bGxNc2dOZXcgIC8vJiMyMjk7JiMxNzQ7JiMxNjI7JiMyMzA7wogmIzE4MzsmIzIzMTsmIzE3MTsmIzE3NTsmIzIzMDvCliYjMTc2OyYjMjMxO8KawoQmIzIzMDvCi8KJJiMyMjk7wo/CliYjMjMyO8KBwoomIzIyOTsmIzE2NDsmIzE2OTsmIzIyOTsmIzE3NDsmIzE2NDsmIzIzMDsmIzE4MjvCiCYjMjMwO8KBJiMxNzU7CiAgICB7CiAgICAgcmVxdWlyZWQgaW50MzIgY291bnQgPSAxOy8vJiMyMzA7wovCiSYjMjI5O8KPwpYmIzIzMDvCnSYjMTYxOyYjMjMwO8KVJiMxNzY7ICAgMDomIzIzMzvCgMKaJiMyMzE7wp8mIzE2NTsmIzIzMDvCi8KJJiMyMjk7wo/CliAgICYjMjMzO8Kdwp4wJiMyMzk7JiMxODg7wpomIzIyODsmIzE4NDsmIzE4NzsmIzIyOTvCiiYjMTY4OyYjMjMwO8KLwokmIzIyOTvCj8KWJiMyMjk7wo7ChiYjMjI5O8KPJiMxNzg7JiMyMzA7JiMxODI7wogmIzIzMDvCgSYjMTc1OyYjMjMwO8KdJiMxNjE7JiMyMzA7wpUmIzE3NjsKICAgICByZXF1aXJlZCBpbnQ2NCBzeW5jVGltZSA9IDI7Ly8mIzIyOTvCkMKMJiMyMzA7JiMxNzM7JiMxNjU7JiMyMzA7wovCiSYjMjI5O8KPwpYmIzIzMDvClyYjMTgyOyYjMjMzO8KXJiMxODA7CiAgICAgb3B0aW9uYWwgc3RyaW5nIGNocm1JZD0zOy8vJiMyMzI7woHCiiYjMjI5OyYjMTY0OyYjMTY5OyYjMjI5OyYjMTc0OyYjMTY0O0lECiAgICB9CiAgICAKICAgIG1lc3NhZ2UgUmVsYXRpb25zSW5wdXQKICAgIHsKICAgICAgICByZXF1aXJlZCBDaGFubmVsVHlwZSB0eXBlID0gMTsKICAgICAgICBvcHRpb25hbCBEb3duU3RyZWFtTWVzc2FnZSBtc2cgPTI7CiAgICAgICAgb3B0aW9uYWwgaW50MzIgY291bnQgPSAzOwogICAgICAgIG9wdGlvbmFsIGludDMyIG9mZnNldCA9IDQ7CiAgICAgICAgb3B0aW9uYWwgaW50NjQgc3RhcnRUaW1lID0gNTsKICAgICAgICBvcHRpb25hbCBpbnQ2NCBlbmRUaW1lID0gNjsKICAgIH0KICAgIG1lc3NhZ2UgUmVsYXRpb25zT3V0cHV0CiAgICB7CiAgICAgICAgcmVwZWF0ZWQgUmVsYXRpb25JbmZvIGluZm8gPSAxOwogICAgfQogICAgbWVzc2FnZSBSZWxhdGlvbkluZm8KICAgIHsKICAgICAgICByZXF1aXJlZCBDaGFubmVsVHlwZSB0eXBlID0gMTsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgdXNlcklkID0gMjsKICAgICAgICBvcHRpb25hbCBEb3duU3RyZWFtTWVzc2FnZSBtc2cgPTM7CiAgICAgICAgb3B0aW9uYWwgaW50NjQgcmVhZE1zZ1RpbWU9IDQ7CiAgICB9CiAgICBtZXNzYWdlIFJlbGF0aW9uSW5mb1JlYWRUaW1lCiAgICB7CiAgICAgICAgcmVxdWlyZWQgQ2hhbm5lbFR5cGUgdHlwZSA9IDE7CiAgICAgICAgcmVxdWlyZWQgaW50NjQgcmVhZE1zZ1RpbWU9IDI7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIHRhcmdldElkID0gMzsKICAgIH0KICAgIG1lc3NhZ2UgQ2xlYW5IaXNNc2dJbnB1dAogICAgewogICAgICAgICByZXF1aXJlZCBzdHJpbmcgdGFyZ2V0SWQgPSAxOy8vJiMyMjk7wo8mIzE3NTsmIzIzMjvCgyYjMTg5OyYjMjMwO8KYJiMxNzU7JiMyMzE7wpQmIzE2ODsmIzIzMDvCiCYjMTgzO2lkJiMyMzk7JiMxODg7wowmIzIzMTsmIzE5MDsmIzE2NDsmIzIzMTsmIzE4NzvChGlkJiMyMzE7JiMxNzM7wokmIzIyNzvCgMKCCiAgICAgICAgIHJlcXVpcmVkIGludDY0IGRhdGFUaW1lID0gMjsvLyYjMjMwOyYjMTg0O8KFJiMyMzM7wpkmIzE2NDsmIzIzMDvClyYjMTgyOyYjMjMzO8KXJiMxODA7CiAgICAgICAgIG9wdGlvbmFsIGludDMyIGNvbnZlcnNhdGlvblR5cGU9IDM7Ly8gJiMyMjk7JiMxNjQ7wocmIzIzMzvCgMKJJiMyMjk7JiMxNzM7wpcmIzIzMDsmIzE3NDsmIzE4MTsmIzIzMDvCmsKCJiMyMjg7JiMxODQ7wo0mIzIzMzvCnMKAJiMyMzI7JiMxNjY7woEKICAgIH0KICAgIG1lc3NhZ2UgSGlzdG9yeU1lc3NhZ2VJbnB1dAogICAgewogICAgICAgIHJlcXVpcmVkIHN0cmluZyB0YXJnZXRJZCA9IDE7CiAgICAgICAgcmVxdWlyZWQgaW50NjQgZGF0YVRpbWUgPTI7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgc2l6ZSAgPSAzOwogICAgfQoKICAgIG1lc3NhZ2UgSGlzdG9yeU1lc3NhZ2VzT3VwdXQKICAgIHsKICAgICAgICByZXBlYXRlZCBEb3duU3RyZWFtTWVzc2FnZSBsaXN0ID0gMTsKICAgICAgICByZXF1aXJlZCBpbnQ2NCBzeW5jVGltZSA9IDI7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgaGFzTXNnID0gMzsKICAgIH0KICAgIG1lc3NhZ2UgUXVlcnlDaGF0cm9vbUluZm9JbnB1dAogICAgewogICAgIHJlcXVpcmVkIGludDMyIGNvdW50PSAxOy8vJiMyMzA7wpzCnyYjMjMwO8KcwpsmIzIzMjvCjiYjMTgzOyYjMjI5O8KPwpYmIzIzMjvCgcKKJiMyMjk7JiMxNjQ7JiMxNjk7JiMyMjk7JiMxNzQ7JiMxNjQ7JiMyMzE7wpQmIzE2ODsmIzIzMDvCiCYjMTgzOyYjMjMxO8KawoQmIzIyODsmIzE4NjsmIzE4NjsmIzIzMDvClSYjMTc2OyYjMjM5OyYjMTg4O8KMJiMyMzI7wozCgyYjMjI5O8KbJiMxODA7JiMyMjg7JiMxODQ7JiMxODY7MH4yMAogICAgIG9wdGlvbmFsIGludDMyIG9yZGVyPSAyOy8vJiMyMzA7wozCiSYjMjMwO8KXJiMxODI7JiMyMzM7wpcmIzE4MDsmIzIzMDvCjsKSJiMyMjk7JiMxODY7wo8mIzIzOTsmIzE4ODvCjCYjMjMyO8KMwoMmIzIyOTvCmyYjMTgwOyYjMjM5OyYjMTg4O8KaMCYjMjM5OyYjMTg4O8KMMSYjMjM5OyYjMTg4O8KMMi4mIzIzOTsmIzE4ODvCiDA6JiMyMjg7JiMxODQ7wo0mIzIzMjsmIzE5MTvClCYjMjI5O8Kbwp4mIzIzOTsmIzE4ODvCmzE6JiMyMzA7JiMxNzM7JiMxNjM7JiMyMjk7JiMxODY7wo8oJiMyMzA7wpzCgCYjMjMwO8KXJiMxNjk7JiMyMjk7woomIzE2MDsmIzIyOTvChSYjMTY1OykmIzIzOTsmIzE4ODvCmzI6JiMyMjk7woDCkiYjMjI5OyYjMTg2O8KPKCYjMjMwO8KcwoAmIzIzMDvCmcKaJiMyMjk7woomIzE2MDsmIzIyOTvChSYjMTY1OykmIzIzOTsmIzE4ODvCiQogICAgfQoKICAgIG1lc3NhZ2UgUXVlcnlDaGF0cm9vbUluZm9PdXRwdXQKICAgIHsKICAgICBvcHRpb25hbCBpbnQzMiB1c2VyVG90YWxOdW1zID0gMTsvLyYjMjI5OyYjMTg5O8KTJiMyMjk7wonCjSYjMjMyO8KBwoomIzIyOTsmIzE2NDsmIzE2OTsmIzIyOTsmIzE3NDsmIzE2NDsmIzIyODsmIzE4NDsmIzE3MzsmIzIzMTvCmsKEJiMyMzA7woAmIzE4NzsmIzIyODsmIzE4NjsmIzE4NjsmIzIzMDvClSYjMTc2OwogICAgIHJlcGVhdGVkIENocm1NZW1iZXIgdXNlckluZm9zID0gMjsvLyYjMjMyOyYjMTkxO8KUJiMyMjk7wpvCniYjMjMzO8KDJiMxNjg7JiMyMjk7wojChiYjMjMxO8KUJiMxNjg7JiMyMzA7wogmIzE4MzsmIzIyODsmIzE5MTsmIzE2MTsmIzIzMDvCgSYjMTc1OyYjMjI5O8KIwpcmIzIzMjsmIzE2MTsmIzE2ODsmIzIzOTsmIzE4ODvCiCYjMjI5O8KPJiMxNzA7JiMyMjk7wozChSYjMjI5O8KQJiMxNzE7dXNlcklkJiMyMjk7wpLCjGpvaW5UaW1lJiMyMjk7JiMxNzc7wp4mIzIzMDvCgCYjMTY3OyYjMjM5OyYjMTg4O8KJCiAgICB9CiAgICBtZXNzYWdlIENocm1NZW1iZXIKICAgIHsKICAgICByZXF1aXJlZCBpbnQ2NCB0aW1lID0gMTsvL01lbWJlciYjMjMxO8KawoRqb2luVGltZQogICAgIHJlcXVpcmVkIHN0cmluZyBpZCA9IDI7Ly9NZW1iZXImIzIzMTvCmsKEdXNlcklkCiAgICB9CiAgICBtZXNzYWdlIE1QRm9sbG93SW5wdXQgIC8vbXAmIzIyOTvChSYjMTc5OyYjMjMwOyYjMTc5OyYjMTY4Oy8mIzIyOTvCj8KWJiMyMzA7JiMxODI7wogmIzIyOTvChSYjMTc5OyYjMjMwOyYjMTc5OyYjMTY4OwogICAgewogICAgICAgIHJlcXVpcmVkIHN0cmluZyBpZCA9IDE7Ly9tcGlkCiAgICB9CgogICAgbWVzc2FnZSBNUEZvbGxvd091dHB1dAogICAgewogICAgICAgIHJlcXVpcmVkIGludDMyIG5vdGhpbmcgPSAxOy8vJiMyMjk7wo0mIzE2MDsmIzIyODsmIzE4OTvCjSYjMjI5OyYjMTczO8KXJiMyMzA7JiMxNzQ7JiMxODE7CiAgICAgICAgb3B0aW9uYWwgTXBJbmZvIGluZm8gPTI7Ly8mIzIyOTvChSYjMTc5OyYjMjMwOyYjMTc5OyYjMTY4OyYjMjMxO8KawoRtcGluZm8KICAgIH0KCiAgICBtZXNzYWdlIE1DRm9sbG93SW5wdXQgICAvL21jJiMyMjk7woUmIzE3OTsmIzIzMDsmIzE3OTsmIzE2ODsvJiMyMjk7wo/CliYjMjMwOyYjMTgyO8KIJiMyMjk7woUmIzE3OTsmIzIzMDsmIzE3OTsmIzE2ODsKICAgIHsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgaWQgPSAxOy8vbWNpZAogICAgfQoKICAgIG1lc3NhZ2UgTUNGb2xsb3dPdXRwdXQKICAgIHsKICAgICAgICByZXF1aXJlZCBpbnQzMiBub3RoaW5nID0gMTsvLyYjMjI5O8KNJiMxNjA7JiMyMjg7JiMxODk7wo0mIzIyOTsmIzE3MzvClyYjMjMwOyYjMTc0OyYjMTgxOwogICAgICAgIG9wdGlvbmFsIE1wSW5mbyBpbmZvID0yOy8vJiMyMjk7woUmIzE3OTsmIzIzMDsmIzE3OTsmIzE2ODsmIzIzMTvCmsKEbXBpbmZvCiAgICB9CgogICAgbWVzc2FnZSBNcEluZm8gIC8vbXAmIzIyOTvCnyYjMTg2OyYjMjMwO8KcJiMxNzI7JiMyMjg7JiMxOTE7JiMxNjE7JiMyMzA7woEmIzE3NTsKICAgIHsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgbXBpZD0xOy8vbXAvbWNpZAogICAgICAgIHJlcXVpcmVkIHN0cmluZyBuYW1lID0gMjsvL2Rpc3BsYXlOYW1lCiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIHR5cGUgPSAzOy8vbXAvbWMKICAgICAgICByZXF1aXJlZCBpbnQ2NCB0aW1lPTQ7Ly8mIzIyOTvChSYjMTcyOyYjMjI4OyYjMTg4O8KXJiMyMjk7JiMxODQ7wpAmIzIyOTvCjyYjMTgzOyYjMjI4OyYjMTkxOyYjMTc0OyYjMjMwO8KUJiMxODU7JiMyMzA7wpcmIzE4MjsmIzIzMzvClyYjMTgwOwogICAgICAgIG9wdGlvbmFsIHN0cmluZyBwb3J0cmFpdFVybD01Oy8vJiMyMjk7JiMxNjQ7JiMxODA7JiMyMjk7woPCjwogICAgICAgIG9wdGlvbmFsIHN0cmluZyBleHRyYSA9NjsvLyYjMjI5O8KFJiMxODI7JiMyMjg7JiMxODc7wpYmIzIyODsmIzE5MTsmIzE2MTsmIzIzMDvCgSYjMTc1Oyhqc29uKSYjMjM5OyYjMTg4O8KMJiMyMzA7wovCiSYjMjI5O8KPwpYmIzIzMTvCmsKEJiMyMzA7wpcmIzE4MjsmIzIyOTvCgMKZJiMyMjk7wozChSYjMjI5O8KQJiMxNzE7JiMyMzI7wo/CnCYjMjI5O8KNwpUmIzIyNzvCgMKBJiMyMzE7JiMxNzQ7woAmIzIyODsmIzE4NzvCiyYjMjMxOyYjMTczO8KJJiMyMjg7JiMxOTE7JiMxNjE7JiMyMzA7woEmIzE3NTsmIzIyNzvCgMKCCiAgICB9CgogICAgbWVzc2FnZSBTZWFyY2hNcElucHV0IC8vJiMyMzA7JiMxNjA7JiMxODU7JiMyMzA7wo0mIzE3NDsmIzIyOTvChSYjMTcyOyYjMjI4OyYjMTg4O8KXJiMyMjk7JiMxODQ7wpAmIzIyOTvCjyYjMTgzO2lkJiMyMjk7JiMxNzQ7wowmIzIyOTvChSYjMTY4OyYjMjI5O8KMJiMxODU7JiMyMzM7woXCjSYjMjMwO8KfJiMxNjU7JiMyMzA7wokmIzE5MDsKICAgIHsKICAgICAgICByZXF1aXJlZCBpbnQzMiB0eXBlPTE7Ly8mIzIzMDsmIzE2MDvChyYjMjI5OyYjMTkxO8KXJiMyMjg7JiMxODk7wo0sJiMyMzA7wpcmIzE2NTsmIzIyOTvCkMKOJiMyMzA7wozCiSYjMjI4OyYjMTg5O8KNJiMyMzA7wp0mIzE2NTsmIzIyOTvCgcKaJiMyMzA7wokmIzE2OTsmIzIyOTsmIzE3NzvClQogICAgICAgIHJlcXVpcmVkIHN0cmluZyBpZD0yOy8vbXBpZC9tY2lkL2Rpc3BsYXlOYW1lCiAgICB9CgogICAgbWVzc2FnZSBTZWFyY2hNcE91dHB1dAogICAgewogICAgICAgIHJlcXVpcmVkIGludDMyIG5vdGhpbmc9MTsvLyYjMjI5O8KNJiMxNjA7JiMyMjg7JiMxODk7wo0mIzIzMTsmIzE3MjsmIzE2NjsKICAgICAgICByZXBlYXRlZCBNcEluZm8gaW5mbyA9IDI7Ly8mIzIyOTvChSYjMTcyOyYjMjI4OyYjMTg4O8KXJiMyMjk7JiMxODQ7wpAmIzIyOTvCjyYjMTgzOwogICAgfQoKICAgIG1lc3NhZ2UgUHVsbE1wSW5wdXQgLy8mIzIzMTsmIzE3MTsmIzE3NTsmIzIyODsmIzE4NDvCiiYjMjMwO8KLwokmIzIyOTvCj8KWJiMyMjk7woUmIzE3MjsmIzIyODsmIzE4ODvClyYjMjMyOyYjMTgwOyYjMTY2OyYjMjI5O8KPJiMxODM7JiMyMjg7JiMxOTE7JiMxNjE7JiMyMzA7woEmIzE3NTsKICAgIHsKICAgICAgICByZXF1aXJlZCBpbnQ2NCB0aW1lPTE7Ly8mIzIyOTvChSYjMTcyOyYjMjI4OyYjMTg4O8KXJiMyMjk7JiMxODQ7wpAmIzIyOTvCjyYjMTgzOyYjMjI4OyYjMTkxOyYjMTc0OyYjMjMwO8KUJiMxODU7JiMyMzA7wpcmIzE4MjsmIzIzMzvClyYjMTgwOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyBtcGlkPTI7Ly8mIzIzMTsmIzE3MTsmIzE3NTsmIzIyODsmIzE4NDvCiiYjMjMxOyYjMTg4O8KTJiMyMjk7JiMxNzM7wpgmIzIyOTvChSYjMTcyOyYjMjI4OyYjMTg4O8KXJiMyMjk7JiMxODQ7wpAmIzIyOTvCjyYjMTgzOyYjMjMxO8KawoRpZCYjMjMxO8KawoRtZDUmIzIyODsmIzE4NDsmIzE3ODsKICAgIH0KCiAgICBtZXNzYWdlIFB1bGxNcE91dHB1dAogICAgewogICAgICAgIHJlcXVpcmVkIGludDMyIHN0YXR1cz0xOy8vJiMyMzA7wpgmIzE3NTsmIzIyOTvCkCYjMTY2OyYjMjMwO8KcwokmIzIzMDsmIzE4MzsmIzE4NzsmIzIyOTvCiiYjMTYwOyYjMjI5O8KSwowmIzIyOTvCiCYjMTYwOyYjMjMzO8KZJiMxNjQ7JiMyMzk7JiMxODg7wowmIzIyOTsmIzE2NjvCgiYjMjMwO8KewpwmIzIzMDvCnMKJJiMyMjk7wo/CmCYjMjI5O8KMwpYmIzIyOTvCiMKZJiMyMzI7JiMxOTE7wpQmIzIyOTvCm8KeJiMyMjk7woUmIzE2ODsmIzIzMzvCgyYjMTY4OyYjMjM5OyYjMTg4O8KMJiMyMjk7wpAmIzE2NjsmIzIyOTvCiMKZJiMyMzI7JiMxOTE7wpQmIzIyOTvCm8KeJiMyMzA7wpsmIzE4MDsmIzIzMDvCliYjMTc2OyYjMjMxO8KawoQKICAgICAgICByZXBlYXRlZCBNcEluZm8gaW5mbyA9IDI7Ly8mIzIyOTvChSYjMTcyOyYjMjI4OyYjMTg4O8KXJiMyMjk7JiMxODQ7wpAmIzIyOTvCjyYjMTgzOwogICAgfQogICAgbWVzc2FnZSBIaXN0b3J5TXNnSW5wdXQgIAogICAgewogICAgICAgIG9wdGlvbmFsIHN0cmluZyB0YXJnZXRJZCA9IDE7Ly8mIzIzMjvCgcKKJiMyMjk7JiMxNjQ7JiMxNjk7JiMyMjk7JiMxNzQ7JiMxNjQ7SUQKICAgICAgICBvcHRpb25hbCBpbnQ2NCB0aW1lID0gMjsvLyYjMjMwO8KfJiMxNjU7JiMyMzI7JiMxNzU7JiMxNjI7JiMyMzA7wpcmIzE4MjsmIzIzMzvClyYjMTgwOyYjMjMxO8KCJiMxODU7CiAgICAgICAgb3B0aW9uYWwgaW50MzIgY291bnQgID0gMzsvLyYjMjMwO8KLwokmIzIyOTvCj8KWJiMyMzA7wp0mIzE2MTsmIzIzMDvClSYjMTc2OwogICAgICAgIG9wdGlvbmFsIGludDMyIG9yZGVyID0gNDsvLyYjMjMwO8KLwokmIzIyOTvCj8KWJiMyMzM7JiMxNjE7JiMxODY7JiMyMjk7JiMxODY7wo8gKDEmIzIzOTsmIzE4ODvCmiYjMjMwOyYjMTczOyYjMTYzOyYjMjI5OyYjMTg2O8KPJiMyMzk7JiMxODg7wpswJiMyMzk7JiMxODg7wpomIzIyOTvCgMKSJiMyMjk7JiMxODY7wo8pCiAgICB9CgogICAgbWVzc2FnZSBIaXN0b3J5TXNnT3VwdXQgIC8vJiMyMzI7JiMxOTE7wpQmIzIyOTvCm8KeJiMyMzI7woHCiiYjMjI5OyYjMTY0OyYjMTY5OyYjMjI5OyYjMTc0OyYjMTY0OyYjMjI5O8KOwoYmIzIyOTvCjyYjMTc4OyYjMjMwOyYjMTgyO8KIJiMyMzA7woEmIzE3NTsKICAgIHsKICAgICAgICByZXBlYXRlZCBEb3duU3RyZWFtTWVzc2FnZSBsaXN0PTE7Ly8mIzIzMDvCicKAJiMyMzA7wosmIzE2NTsmIzIzMDvCnMKJJiMyMzE7wprChCYjMjMwOyYjMTgyO8KIJiMyMzA7woEmIzE3NTsmIzIzOTsmIzE4ODvCiGxpc3QmIzIyOTsmIzE2NDvCjSYjMjMxOyYjMTc3OyYjMTg3OyYjMjI5O8KewosmIzIzOTsmIzE4ODvCiQogICAgICAgIHJlcXVpcmVkIGludDY0IHN5bmNUaW1lPTI7Ly8mIzIyOTvCkMKMJiMyMzA7JiMxNzM7JiMxNjU7JiMyMzA7wpcmIzE4MjsmIzIzMzvClyYjMTgwOwogICAgICAgIHJlcXVpcmVkIGludDMyIGhhc01zZz0zOyAvLyYjMjMwO8KYJiMxNzU7JiMyMjk7wpAmIzE2NjsmIzIzMjsmIzE5MTvCmCYjMjMwO8KcwokmIzIyOTvCkMKOJiMyMzE7JiMxODc7JiMxNzM7JiMyMjk7wo7ChiYjMjI5O8KPJiMxNzg7JiMyMzA7JiMxODI7wogmIzIzMDvCgSYjMTc1OwogICAgfQogICAgbWVzc2FnZSBSdGNRdWVyeUxpc3RJbnB1dHsKICAgICAgb3B0aW9uYWwgaW50MzIgb3JkZXI9MTsgLy8mIzIzMDvCnSYjMTYxOyYjMjMwO8KVJiMxNzY7JiMyMzM7wpnCkCYjMjI5O8KIJiMxODI7JiMyMjk7wpwmIzE2ODsmIzIzMDvCnMKNJiMyMjk7woomIzE2MTsmIzIzMTsmIzE3MTsmIzE3NTsmIzIyOTvCgcKaIDEgJiMyMzA7wpgmIzE3NTsmIzIzMDsmIzE3MzsmIzE2MzsmIzIyOTsmIzE4NjvCjywyJiMyMzA7wpgmIzE3NTsmIzIyOTvCgMKSJiMyMjk7JiMxODY7wo8KICAgIH0KCiAgICBtZXNzYWdlIFJ0Y0tleURlbGV0ZUlucHV0ewogICAgICByZXBlYXRlZCBzdHJpbmcga2V5PTE7CiAgICB9CgogICAgbWVzc2FnZSBSdGNWYWx1ZUluZm97CiAgICAgIHJlcXVpcmVkIHN0cmluZyBrZXk9MTsKICAgICAgcmVxdWlyZWQgc3RyaW5nIHZhbHVlPTI7CiAgICB9CgogICAgbWVzc2FnZSBSdGNVc2VySW5mb3sKICAgICAgcmVxdWlyZWQgc3RyaW5nIHVzZXJJZD0xOwogICAgICByZXBlYXRlZCBSdGNWYWx1ZUluZm8gdXNlckRhdGE9MjsKICAgIH0KCiAgICBtZXNzYWdlIFJ0Y1VzZXJMaXN0T3V0cHV0ewogICAgICByZXBlYXRlZCBSdGNVc2VySW5mbyBsaXN0PTE7CiAgICAgIG9wdGlvbmFsIHN0cmluZyB0b2tlbj0yOwogICAgfQogICAgbWVzc2FnZSBSdGNSb29tSW5mb091dHB1dHsKICAgICAgICBvcHRpb25hbCBzdHJpbmcgcm9vbUlkID0gMTsKICAgICAgICByZXBlYXRlZCBSdGNWYWx1ZUluZm8gcm9vbURhdGEgPSAyOwogICAgICAgIG9wdGlvbmFsIGludDMyIHVzZXJDb3VudCA9IDM7CiAgICAgICAgcmVwZWF0ZWQgUnRjVXNlckluZm8gbGlzdD00OwogICAgfQogICAgbWVzc2FnZSBSdGNJbnB1dHsKICAgICAgb3B0aW9uYWwgaW50MzIgbm90aGluZz0xOwogICAgfQogICAgbWVzc2FnZSBSdGNRcnlJbnB1dHsgLy9xdWVyeSAmIzIyOTvCjyYjMTc1OyYjMjI4OyYjMTg3OyYjMTY1OyYjMjMwO8KYJiMxNzU7JiMyMzA7wp8mIzE2NTsmIzIzMjsmIzE3NTsmIzE2MjsmIzIyOTvCjcKVJiMyMjg7JiMxODQ7JiMxNzA7JiMyMjk7JiMxNzc7wp4mIzIzMDvCgCYjMTY3OyYjMjI4OyYjMTg1O8KfJiMyMjk7wo8mIzE3NTsmIzIyODsmIzE4NzsmIzE2NTsmIzIzMDvCnyYjMTY1OyYjMjMyOyYjMTc1OyYjMTYyOyYjMjI5OyYjMTY0O8KaJiMyMjg7JiMxODQ7JiMxNzA7JiMyMjk7JiMxNzc7wp4mIzIzMDvCgCYjMTY3OwogICAgICByZXF1aXJlZCBib29sIGlzSW50ZXJpb3I9MTsvLyYjMjMwO8KYJiMxNzU7JiMyMjk7wpAmIzE2NjsmIzIyODsmIzE4NDsmIzE4NjsmIzIzMjvCjiYjMTgzOyYjMjI5O8KPwpYmIzIyOTvChsKFJiMyMzM7woMmIzE2ODsmIzIzMDvClSYjMTc2OyYjMjMwO8KNJiMxNzQ7CiAgICAgIHJlcXVpcmVkIHRhcmdldFR5cGUgdGFyZ2V0PTI7CiAgICAgIHJlcGVhdGVkIHN0cmluZyBrZXk9MzsgLy8mIzIyOTvCiCYjMTYwOyYjMjMzO8KZJiMxNjQ7JiMyMzA7wozChyYjMjI5OyYjMTc0O8KaIHVzZXIgJiMyMzA7wojCliYjMjMyO8KAwoUgcm9vbSBJZCYjMjMxO8KawoQga2V5CiAgICB9CiAgICBtZXNzYWdlIFJ0Y1FyeU91dHB1dHsKICAgICAgcmVwZWF0ZWQgUnRjVmFsdWVJbmZvIG91dEluZm89MTsKICAgIH0KICAgIG1lc3NhZ2UgUnRjRGVsRGF0YUlucHV0ewogICAgICByZXBlYXRlZCBzdHJpbmcga2V5PTE7IC8vJiMyMjk7wogmIzE2MDsmIzIzMzvCmSYjMTY0OyYjMjMwO8KMwocmIzIyOTsmIzE3NDvCmiB1c2VyICYjMjMwO8KIwpYmIzIzMjvCgMKFIHJvb20gSWQmIzIzMTvCmsKEIGtleQogICAgICByZXF1aXJlZCBib29sIGlzSW50ZXJpb3I9MjsvLyYjMjMwO8KYJiMxNzU7JiMyMjk7wpAmIzE2NjsmIzIyODsmIzE4NDsmIzE4NjsmIzIyOTsmIzE2NDvChCYjMjMxO8KQwoYmIzIyOTvChsKFJiMyMzM7woMmIzE2ODsmIzIzMDvClSYjMTc2OyYjMjMwO8KNJiMxNzQ7CiAgICAgIHJlcXVpcmVkIHRhcmdldFR5cGUgdGFyZ2V0PTM7CiAgICB9CiAgICBtZXNzYWdlIFJ0Y0RhdGFJbnB1dHsgCiAgICAgIHJlcXVpcmVkIGJvb2wgaW50ZXJpb3I9MTsKICAgICAgLy8mIzIzMDvCmCYjMTc1OyYjMjI5O8KQJiMxNjY7JiMyMjg7JiMxODQ7JiMxODY7JiMyMzI7wo4mIzE4MzsmIzIyOTvCj8KWJiMyMjk7wobChSYjMjMzO8KDJiMxNjg7JiMyMzA7wpUmIzE3NjsmIzIzMDvCjSYjMTc0OwogICAgICByZXF1aXJlZCB0YXJnZXRUeXBlIHRhcmdldD0yOwogICAgICAvLyYjMjI5O8KIJiMxNjA7JiMyMzM7wpkmIzE2NDsmIzIzMDvCjMKHJiMyMjk7JiMxNzQ7wpogdXNlciAmIzIzMDvCiMKWJiMyMzI7woDChSByb29tIElkJiMyMzE7wprChCBrZXkKICAgICAgcmVwZWF0ZWQgc3RyaW5nIGtleT0zOwogICAgICBvcHRpb25hbCBzdHJpbmcgb2JqZWN0TmFtZT01OwogICAgICBvcHRpb25hbCBzdHJpbmcgY29udGVudD02OwogICAgfQogICAgbWVzc2FnZSBSdGNTZXREYXRhSW5wdXR7CiAgICAgIHJlcXVpcmVkIGJvb2wgaW50ZXJpb3I9MTsvLyYjMjMwO8KYJiMxNzU7JiMyMjk7wpAmIzE2NjsmIzIyODsmIzE4NDsmIzE4NjsmIzIyOTvCj8KRJiMyMjk7JiMxODQ7woMmIzIyOTvChsKFJiMyMzM7woMmIzE2ODsmIzIzMDvClSYjMTc2OyYjMjMwO8KNJiMxNzQ7CiAgICAgIHJlcXVpcmVkIHRhcmdldFR5cGUgdGFyZ2V0PTI7CiAgICAgIHJlcXVpcmVkIHN0cmluZyBrZXk9MzsKICAgICAgcmVxdWlyZWQgc3RyaW5nIHZhbHVlPTQ7CiAgICAgIG9wdGlvbmFsIHN0cmluZyBvYmplY3ROYW1lPTU7CiAgICAgIG9wdGlvbmFsIHN0cmluZyBjb250ZW50PTY7CiAgICB9CiAgICBtZXNzYWdlIFJ0Y091dHB1dAogICAgewogICAgICAgIG9wdGlvbmFsIGludDMyIG5vdGhpbmc9MTsgICAgLy8mIzIyOTvCjSYjMTYwOyYjMjI4OyYjMTg5O8KNCiAgICB9CiAgICBtZXNzYWdlIFJ0Y1Rva2VuT3V0cHV0ewogICAgICByZXF1aXJlZCBzdHJpbmcgcnRjVG9rZW49MTsKICAgIH0KICAgIGVudW0gdGFyZ2V0VHlwZSB7CiAgICAgIFJPT00gPTEgOwogICAgICBQRVJTT04gPSAyOwogICAgfQp9");var i = l.loadProto(h, undefined, "").build("Modules").probuf;return i;}(c, d, a);return e;});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/node-libs-browser/mock/process.js */ "./node_modules/node-libs-browser/mock/process.js")))

/***/ })

}]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map