<template>
	<view class="uni-column">
		<view class="goBack-top">
				<view class="goBcak">
				<view class="uni-icon uni-icon-back"></view>
				<text class="gobackName">妈妈</text> 
			</view>
		</view>
	
		
		<view class="content" id="content" :style="{height:style.contentViewHeight+'upx'}">
			<scroll-view id="scrollview"   scroll-y="true" :style="{height:style.contentViewHeight+'upx'}" :scroll-with-animation="true"
			    :scroll-top="scrollTop">
				<message-show v-for="(message,index) in messages" :key="index" v-bind:message="message" :id="index"></message-show>
				<view id="bottom"></view>
			</scroll-view>
		</view>
		<view class="foot">
			<chat-input @send-message="getInputMessage" ></chat-input>
		</view>
	</view>
</template>
<script>
	import chatInput from './chatinput.vue';
	import messageShow from './messageshow.vue';
	export default {
		
		data() {
			return {
				style: {
					pageHeight: 0,
					contentViewHeight: 0,
					footViewHeight: 90,
					mitemHeight: 0,
				},
				scrollTop: 0,
				messages: [{
					user: 'home',
					type: 'head', //input,content 
					content: '你好!'
				}]
			}
		},
		components: {
			chatInput,
			messageShow
		},
		created: function () { 
			const res = uni.getSystemInfoSync();
			this.style.pageHeight = res.windowHeight;
			this.style.contentViewHeight = res.windowHeight - uni.getSystemInfoSync().screenWidth / 750 * (100); //像素
		},
		methods: {
			getInputMessage: function (message) { //获取子组件的输入数据
				// console.log(message);
				this.addMessage('customer', message.content, false);
				this.toRobot(message.content);
			},
			addMessage: function (user, content, hasSub, subcontent) {
				var that = this;
				that.messages.push({
					user: user,
					content: content,
					hasSub: hasSub,
					subcontent: subcontent
				});
			},
			scrollToBottom: function () {
				var that = this;
				var query = uni.createSelectorQuery();
				query.selectAll('.m-item').boundingClientRect();
				query.select('#scrollview').boundingClientRect();

				query.exec(function (res) {
					that.style.mitemHeight = 0;
					res[0].forEach(function (rect) {
						// console.info(rect.height);
						that.style.mitemHeight = that.style.mitemHeight + rect.height + 20;
					});

					if (that.style.mitemHeight > that.style.contentViewHeight) {
						that.scrollTop = that.style.mitemHeight - that.style.contentViewHeight;
					}
				});
			},
			toRobot: function (info) {
						this.addMessage('home','你还打',false);
						this.scrollToBottom();
						console.log('request success:' + res.data.text);
				// this.addMessage('home', info, false);
// 				var apiUrl = 'http://www.tuling123.com/openapi/api';
// 				uni.request({
// 					url: apiUrl,
// 					data: {
// 						"key": 'acfbca724ea1b5db96d2eef88ce677dc',
// 						"info": info,
// 						"userid": 'uni-test'
// 					},
// 					success: (res) => {
// 						this.addMessage('home', res.data.text, false);
// 						this.scrollToBottom();
// 						console.log('request success:' + res.data.text);
// 					},
// 					fail: (err) => {
// 						console.log('request fail', err);
// 						uni.showModal({
// 							content: err.errMsg,
// 							showCancel: false
// 						})
// 					}
// 				});
			}
		} 
	}
</script>
<style>
	@import "../../static1/css/common.css";
	.goBack-top{
		background: #fc6c6c;
		opacity: 0.9; 
		height: 90upx;
		line-height: 90upx;
	}
	.goBcak{
		font-size: 70upx;
		color: #fff; 
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 55%;
		align-items: center;
	}
	.uni-column {
		display: flex;
		flex-direction: column;
	}
	.content {

		display: flex;
		flex: 1;
		margin-bottom: 100upx;
		 
	}
	.foot {
		position: fixed;
		width: 100%;
		height: 90upx;
		min-height: 90upx;
		left: 0upx;
		bottom: 0upx;
		overflow: hidden;
	}
	.gobackName{
		font-size: 40upx;
	}
</style>
