(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/chat/chat"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\朋友圈\\pages\\chat\\chat.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--18-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib??vue-loader-options!C:/Users/Administrator/Desktop/朋友圈/pages/chat/chat.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;




































































__webpack_require__(/*! @/assets/chat.css */ "C:\\Users\\Administrator\\Desktop\\朋友圈\\assets\\chat.css");

var _protobuf234Min = _interopRequireDefault(__webpack_require__(/*! ../../static/protobuf-2.3.4.min.js */ "C:\\Users\\Administrator\\Desktop\\朋友圈\\static\\protobuf-2.3.4.min.js"));
var _RongIMLib = _interopRequireDefault(__webpack_require__(/*! ../../static/RongIMLib-2.4.0.js */ "C:\\Users\\Administrator\\Desktop\\朋友圈\\static\\RongIMLib-2.4.0.js"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} //import init from "@/assets/rongyun/init";
_RongIMLib.default.RongIMClient.Protobuf = _protobuf234Min.default;var _default =
{
  data: function data() {
    return {
      targetUserId: "",
      token: "",
      instance: "",
      stat: {
        currentView: "chat",
        currentUserInfo: {
          id: "user1",
          nickname: "user",
          region: "86",
          phone: "13269772701",
          portraitUri:
          "https://www.rongcloud.cn/docs/assets/img/index/logo.png" },

        targetUserInfo: {
          id: "user2",
          nickname: "开发",
          region: "86",
          phone: "13269772702",
          portraitUri:
          "https://www.rongcloud.cn/docs/assets/img/index/logo.png" },

        messageList: [],
        sendMsgVal: "" } };


  },
  mounted: function mounted() {
    uni.getStorage({
      key: 'info',
      success: function success(res) {
        var _this = this;
        var appkey = '0vnjpoad0310z';
        var token = res.data.token;
        this.targetUserId = res.data.targetUserId;
        console.log(this.targetUserId);
        var navi = null;
        var RongIMClient = _RongIMLib.default.RongIMClient;
        var config = {};
        if (navi) {
          config.navi = navi;
        }
        RongIMClient.init(appkey, null, config);
        RongIMClient.setConnectionStatusListener({
          onChanged: function onChanged(status) {
            switch (status) {
              case _RongIMLib.default.ConnectionStatus['CONNECTED']:
              case 0:
                console.log('连接成功');
                break;

              case _RongIMLib.default.ConnectionStatus['CONNECTING']:
              case 1:
                console.log('连接中');
                break;

              case _RongIMLib.default.ConnectionStatus['DISCONNECTED']:
              case 2:
                console.log('当前用户主动断开链接');
                break;

              case _RongIMLib.default.ConnectionStatus['NETWORK_UNAVAILABLE']:
              case 3:
                console.log('网络不可用');
                break;

              case _RongIMLib.default.ConnectionStatus['CONNECTION_CLOSED']:
              case 4:
                console.log('未知原因，连接关闭');
                break;

              case _RongIMLib.default.ConnectionStatus['KICKED_OFFLINE_BY_OTHER_CLIENT']:
              case 6:
                console.log('用户账户在其他设备登录，本机会被踢掉线');
                break;

              case _RongIMLib.default.ConnectionStatus['DOMAIN_INCORRECT']:
              case 12:
                console.log('当前运行域名错误，请检查安全域名配置');
                break;}

          } });


        RongIMClient.setOnReceiveMessageListener({
          // 接收到的消息
          onReceived: function onReceived(message) {
            console.log('新消息 ' + message.targetId + ':' + JSON.stringify(message));
          } });


        RongIMClient.connect(token, {
          onSuccess: function onSuccess(userId) {
            console.log('链接成功，用户id：' + userId);
            alert('链接成功，用户id：' + userId);
          },
          onTokenIncorrect: function onTokenIncorrect() {
            console.log('token无效');
          },
          onError: function onError(errorCode) {
            console.log(errorCode);
          } },
        null);
      } });


    //         var userInfo = {
    //             // appKey: "82hegw5u8mqwx",
    //             // token:
    //             //     "oUh0wcHH6E2LiuTpEKp/+jCvQwRQ4mI0ws9X674LamLVDfNK14vl8UoEcZT0otHeuyNsIi1T4wZ8UwVl0ZqyZA=="
    //             appKey: "0vnjpoad0310z",
    //             token:
    //                 "40fQ75q/l7sbO5sEfZZtKQ/MeVAFbziQOLcKtSFa1/HZ/+mI5iBT9B40ug3nZB1tYXJBq0Gh6pBGfu61QycNaw=="
    //         };
    //         var callbacks = {
    //             CONNECTED: function(instance) {
    //                 //传入实例参数
    //                 //获取历史消息
    //                 var conversationType = RongIMLib.ConversationType.PRIVATE;
    //               
    //                 var targetId = "user2";
    //                 instance.getHistoryMessages(
    //                     conversationType,
    //                     targetId,
    //                     null,
    //                     20,
    //                     {
    //                         onSuccess(list, hasMsg) {
    //                             console.log(list);
    //                             //渲染会话列表
    //                             _this.stat.messageList = list;
    //                             return (_this.instance = instance);
    //                         }
    //                     },
    //                     null
    //                 );
    //             },
    //             Success: function(id) {},
    //             Received: function(message) {}
    //         };
    //         init(userInfo, callbacks);
    // 
    this.scrollEnd();
  },
  methods: {
    sendMsg: function sendMsg() {
      var text = this.stat.sendMsgVal;
      if (!text) {
        return false;
      }
      var msg = new _RongIMLib.default.TextMessage({
        content: text,
        extra: "附加信息" });

      var conversationType = _RongIMLib.default.ConversationType.PRIVATE; // 私聊
      var targetId = this.targetUserId; // 目标 Id
      var that = this;
      _RongIMLib.default.RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
        // 发送消息成功
        onSuccess: function onSuccess(message) {
          that.stat.sendMsgVal = "";
          that.stat.messageList.push(message);
          that.$nextTick(that.scrollEnd);
        },
        onError: function onError(errorCode, message) {

        } });

    },
    scrollEnd: function scrollEnd() {
      //添加完消息 跳转到最后一条
      var list = document.querySelectorAll(".message-item");
      if (list.length > 1) {
        var last = list[list.length - 1];
        last.scrollIntoView();
      }
    } } };exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ "./node_modules/@dcloudio/uni-mp-weixin/dist/index.js")["default"]))

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\朋友圈\\pages\\chat\\chat.vue?vue&type=template&id=2c657577&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib??vue-loader-options!C:/Users/Administrator/Desktop/朋友圈/pages/chat/chat.vue?vue&type=template&id=2c657577&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("div", { attrs: { id: "chat" } }, [
      _c(
        "div",
        { staticClass: "chat" },
        [
          _c("header", { staticClass: "header" }, [
            _c("span", { staticClass: "title" }, [
              _vm._v(_vm._s(_vm.stat.currentUserInfo.nickname))
            ])
          ]),
          _c("div", { staticClass: "chat-content" }, [
            _c(
              "div",
              { staticClass: "message-wrapper" },
              _vm._l(_vm.stat.messageList, function(msg, index) {
                return _c(
                  "div",
                  {
                    key: index,
                    staticClass: "message-item",
                    class: [msg.messageDirection == 1 ? "my-msg" : "your-msg"]
                  },
                  [
                    msg.messageType == "TextMessage"
                      ? _c("div", { staticClass: "message-text" }, [
                          _c("div", { staticClass: "rong-avatar" }, [
                            msg.messageDirection == 1
                              ? _c("img", {
                                  staticClass: "rong-avatar-bd",
                                  attrs: {
                                    src: _vm.stat.currentUserInfo.portraitUri
                                  }
                                })
                              : _c("img", {
                                  staticClass: "rong-avatar-bd",
                                  attrs: {
                                    src: _vm.stat.targetUserInfo.portraitUri
                                  }
                                })
                          ]),
                          _c(
                            "div",
                            { staticClass: "message-body" },
                            [
                              msg.content.messageName == "TextMessage"
                                ? _c("pre", { staticClass: "user-msg" }, [
                                    _vm._v(_vm._s(msg.content.content))
                                  ])
                                : _vm._e(),
                              msg.content.messageName == "ImageMessage"
                                ? _c("img", {
                                    staticClass: "image-message",
                                    attrs: {
                                      src: msg.content.imageUri,
                                      alt: "image"
                                    }
                                  })
                                : _vm._e()
                            ],
                            1
                          )
                        ])
                      : _vm._e()
                  ]
                )
              })
            )
          ]),
          _c("footer", { staticClass: "footer" }, [
            _c("div", { staticClass: "message-wrap" }, [
              _c("textarea", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.stat.sendMsgVal,
                    expression: "stat.sendMsgVal"
                  }
                ],
                staticClass: "message-content",
                attrs: {
                  id: "message-content",
                  placeholder: "请输入文字...",
                  eventid: "713726aa-0"
                },
                domProps: { value: _vm.stat.sendMsgVal },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.stat.sendMsgVal = $event.target.value
                  }
                }
              })
            ]),
            _c(
              "span",
              {
                staticClass: "send-btn",
                attrs: { eventid: "713726aa-1" },
                on: { click: _vm.sendMsg }
              },
              [_vm._v("发送")]
            )
          ])
        ],
        1
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\朋友圈\\assets\\chat.css":
/*!**********************************************************!*\
  !*** C:/Users/Administrator/Desktop/朋友圈/assets/chat.css ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\朋友圈\\main.js?{\"page\":\"pages%2Fchat%2Fchat\"}":
/*!*********************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/朋友圈/main.js?{"page":"pages%2Fchat%2Fchat"} ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
__webpack_require__(/*! uni-pages */ "C:\\Users\\Administrator\\Desktop\\朋友圈\\pages.json");
var _mpvuePageFactory = _interopRequireDefault(__webpack_require__(/*! mpvue-page-factory */ "./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mpvue-page-factory/index.js"));
var _chat = _interopRequireDefault(__webpack_require__(/*! ./pages/chat/chat.vue */ "C:\\Users\\Administrator\\Desktop\\朋友圈\\pages\\chat\\chat.vue"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
Page((0, _mpvuePageFactory.default)(_chat.default));

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\朋友圈\\pages\\chat\\chat.vue":
/*!**************************************************************!*\
  !*** C:/Users/Administrator/Desktop/朋友圈/pages/chat/chat.vue ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _chat_vue_vue_type_template_id_2c657577_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chat.vue?vue&type=template&id=2c657577&scoped=true& */ "C:\\Users\\Administrator\\Desktop\\朋友圈\\pages\\chat\\chat.vue?vue&type=template&id=2c657577&scoped=true&");
/* harmony import */ var _chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chat.vue?vue&type=script&lang=js& */ "C:\\Users\\Administrator\\Desktop\\朋友圈\\pages\\chat\\chat.vue?vue&type=script&lang=js&");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _chat_vue_vue_type_template_id_2c657577_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _chat_vue_vue_type_template_id_2c657577_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "2c657577",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "C:/Users/Administrator/Desktop/朋友圈/pages/chat/chat.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\朋友圈\\pages\\chat\\chat.vue?vue&type=script&lang=js&":
/*!***************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/朋友圈/pages/chat/chat.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--18-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib??vue-loader-options!./chat.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\朋友圈\\pages\\chat\\chat.vue?vue&type=script&lang=js&");
/* harmony import */ var _D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\朋友圈\\pages\\chat\\chat.vue?vue&type=template&id=2c657577&scoped=true&":
/*!*********************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/朋友圈/pages/chat/chat.vue?vue&type=template&id=2c657577&scoped=true& ***!
  \*********************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_template_id_2c657577_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib??vue-loader-options!./chat.vue?vue&type=template&id=2c657577&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\朋友圈\\pages\\chat\\chat.vue?vue&type=template&id=2c657577&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_template_id_2c657577_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_hbuilder_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_template_id_2c657577_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

},[["C:\\Users\\Administrator\\Desktop\\朋友圈\\main.js?{\"page\":\"pages%2Fchat%2Fchat\"}","common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chat/chat.js.map