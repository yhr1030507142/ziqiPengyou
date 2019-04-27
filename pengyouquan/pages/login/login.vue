<template>
	<view>
			登录
		    <button type="primary" @tap="denglu(1)">用户一</button>
			<button type="primary" @tap="denglu(2)">用户二</button>
		    <button type="primary" @tap="denglu(3)">用户三</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:"",
			} 
		},
		methods: {
			denglu:function(id){
				if(id==1){
					this.token = this.$store.state.user1
					uni.setStorage({//将用户信息保存在本地  
						key: 'info',  
						data: this.token  
					})  
					uni.switchTab({
					url: '/pages/chat/chat'
					});
				}
				if(id==2){
					this.token = this.$store.state.user2
					uni.setStorage({//将用户信息保存在本地  
						key: 'info',  
						data: this.token  
					})  
					uni.switchTab({
					url: '/pages/chat/chat'
					});
				}
				if(id==3){
					this.token = this.$store.state.user3.token
					uni.setStorage({//将用户信息保存在本地  
						key: 'token',  
						data: this.token  
					})
					uni.switchTab({
					url: '/pages/chat/chat'
					});
				}
			}
		}
	}
</script>

<style>

</style>
