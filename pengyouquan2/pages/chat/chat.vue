<template>
    <div>
        <!-- <div id="chatPage">{{ stat.messageList }}</div> -->
        <div id="chat">
            <div class="chat">
                <!--header-->
                <header class="header">
                    <span class="title">{{stat.currentUserInfo.nickname}}</span>
                </header>
                <!--header-->
 
                <!--chat-content-->
                <div class="chat-content">
                    <div class="message-wrapper">
                        <div
                            class="message-item"
                            v-for="(msg,index) in stat.messageList"
                            :key="index"
                            :class="[msg.messageDirection == 1 ? 'my-msg' : 'your-msg']"
                        >
                            <div v-if="msg.messageType == 'TextMessage'" class="message-text">
                                <div class="rong-avatar">
                                    <img
                                        v-if="msg.messageDirection == 1"
                                        :src="stat.currentUserInfo.portraitUri"
                                        class="rong-avatar-bd"
                                    >
                                    <img
                                        v-else
                                        :src="stat.targetUserInfo.portraitUri"
                                        class="rong-avatar-bd"
                                    >
                                </div>
                                <div class="message-body">
                                    <pre
                                        class="user-msg"
                                        v-if="msg.content.messageName == 'TextMessage'"
                                    >{{msg.content.content}}</pre>
                                    <img
                                        class="image-message"
                                        :src="msg.content.imageUri"
                                        alt="image"
                                        v-if="msg.content.messageName == 'ImageMessage'"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--chat-content-->
                <!--footer-->
                <footer class="footer">
                    <div class="message-wrap">
                        <textarea
                            v-model="stat.sendMsgVal"
                            id="message-content"
                            placeholder="请输入文字..."
                            class="message-content"
                        ></textarea>
                    </div>
                    <span class="send-btn" @click="sendMsg">发送</span>
                </footer>
                <!--footer-->
            </div>
        </div>
    </div>
</template>

<script>
import "@/assets/chat.css";
//import init from "@/assets/rongyun/init";
import Protobuf from '../../static/protobuf-2.3.4.min.js'
import RongIMLib from '../../static/RongIMLib-2.4.0.js'
RongIMLib.RongIMClient.Protobuf = Protobuf
export default {

    data() {
        return {
			targetUserId:""	,
			token:"",
            instance: "",
            stat: {
                currentView: "chat",
                currentUserInfo: {
                    id: "user1",
                    nickname: "user",
                    region: "86",
                    phone: "13269772701",
                    portraitUri:
                        "https://www.rongcloud.cn/docs/assets/img/index/logo.png"
                },
                targetUserInfo: {
                    id: "user2",
                    nickname: "开发",
                    region: "86",
                    phone: "13269772702",
                    portraitUri:
                        "https://www.rongcloud.cn/docs/assets/img/index/logo.png"
                },
                messageList: [],
                sendMsgVal: ""
            }
        };
    },
    mounted() {
			var tthat = this
		uni.getStorage({ 
			key: 'info',
			success: function (res) {
					var _this = this;
					var appkey = '0vnjpoad0310z'
					var token = res.data.token
					this.targetUserId = res.data.targetUserId
					console.log(this.targetUserId)
					var navi = null
					var RongIMClient = RongIMLib.RongIMClient
					var config = {}
					if (navi) {
						config.navi = navi
					}
				RongIMClient.init(appkey, null, config)
					//监听
						RongIMClient.setOnReceiveMessageListener({
									// 接收到的消息
									onReceived: function(message) {
										//console.log('新消息 ' + message.targetId + ':' + JSON.stringify(message))
										
						  switch(message.messageType){
					    case RongIMClient.MessageType.TextMessage:
						      this.content = message
						      console.log(tthat.stat.messageList)
						      tthat.stat.messageList.push(message) 
						     // message.content.content => 文字内容
					        // message.content.content => 文字内容
					        break;
					    case RongIMClient.MessageType.VoiceMessage:
					        // message.content.content => 格式为 AMR 的音频 base64
					        break;
					    case RongIMClient.MessageType.ImageMessage:
					        // message.content.content => 图片缩略图 base64
					        // message.content.imageUri => 原图 URL
					        break;
					    case RongIMClient.MessageType.LocationMessage:
					        // message.content.latiude => 纬度
					        // message.content.longitude => 经度
					        // message.content.content => 位置图片 base64
					        break;
					    case RongIMClient.MessageType.RichContentMessage:
					        // message.content.content => 文本消息内容
					        // message.content.imageUri => 图片 base64
					        // message.content.url => 原图 URL
					        break;
					    case RongIMClient.MessageType.InformationNotificationMessage:
					        // do something
					        break;
					    case RongIMClient.MessageType.ContactNotificationMessage:
					        // do something
					        break;
					    case RongIMClient.MessageType.ProfileNotificationMessage:
					        // do something
					        break;
					    case RongIMClient.MessageType.CommandNotificationMessage:
					        // do something
					        break;
					    case RongIMClient.MessageType.CommandMessage:
					        // do something
					        break;
					    case RongIMClient.MessageType.UnknownMessage:
					        // do something
					        break;
					    default:
					        // do something
					}
									}
								})
					
			
					
					
// 连接状态监听器
RongIMClient.setConnectionStatusListener({
    onChanged: function (status) {
        // status 标识当前连接状态
        switch (status) {
            case RongIMLib.ConnectionStatus.CONNECTED:
                console.log('链接成功');
                break;
            case RongIMLib.ConnectionStatus.CONNECTING:
                console.log('正在链接');
                break;
            case RongIMLib.ConnectionStatus.DISCONNECTED:
                console.log('断开连接');
                break;
            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                console.log('其他设备登录');
                break;
            case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                console.log('域名不正确');
                break;
            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                console.log('网络不可用');
                break;
        }
    }
});


					//
					RongIMClient.setConnectionStatusListener({
						onChanged: function(status) {
							switch (status) {
								case RongIMLib.ConnectionStatus['CONNECTED']:
								case 0:
									console.log('连接成功')
									break
					
								case RongIMLib.ConnectionStatus['CONNECTING']:
								case 1:
									console.log('连接中')
									break
					
								case RongIMLib.ConnectionStatus['DISCONNECTED']:
								case 2:
									console.log('当前用户主动断开链接')
									break
					
								case RongIMLib.ConnectionStatus['NETWORK_UNAVAILABLE']:
								case 3:
									console.log('网络不可用')
									break
					
								case RongIMLib.ConnectionStatus['CONNECTION_CLOSED']:
								case 4:
									console.log('未知原因，连接关闭')
									break
					
								case RongIMLib.ConnectionStatus['KICKED_OFFLINE_BY_OTHER_CLIENT']:
								case 6:
									console.log('用户账户在其他设备登录，本机会被踢掉线')
									break
					
								case RongIMLib.ConnectionStatus['DOMAIN_INCORRECT']:
								case 12:
									console.log('当前运行域名错误，请检查安全域名配置')
									break
							}
						}
					})
					
				
					
					RongIMClient.connect(token, {
						onSuccess: function(userId) {
							console.log('链接成功，用户id：' + userId)
							//alert('链接成功，用户id：' + userId);
						},
						onTokenIncorrect: function() {
							console.log('token无效')
						},
						onError: function(errorCode) {
							console.log(errorCode)
						}
					}, null)
		}
		});
       
	  

        this.scrollEnd();
	
    },
    methods: {
        sendMsg:function() {
            var text = this.stat.sendMsgVal;
            if (!text) {
                return false;
            }
            var msg = new RongIMLib.TextMessage({
                content: text,
                extra: "附加信息"
            });
            var conversationType = RongIMLib.ConversationType.PRIVATE; // 私聊
            var targetId = "user1"; // 目标 Id
            var that = this;
            RongIMLib.RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
                // 发送消息成功
                onSuccess: function(message) {
                    that.stat.sendMsgVal = "";
                    that.stat.messageList.push(message);
                    that.$nextTick(that.scrollEnd);
                },
                 onError: function (errorCode, message) {

                }
            });
        },
        scrollEnd: function() {
            //添加完消息 跳转到最后一条
            var list = document.querySelectorAll(".message-item");
            if (list.length > 1) {
                var last = list[list.length - 1];
                last.scrollIntoView();
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
