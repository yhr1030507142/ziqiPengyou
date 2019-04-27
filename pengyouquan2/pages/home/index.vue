<template>
	<view class="index">
		<view class="top">
			<ul class="top_ul">
				<li class="top_li flex column">
					<view class="img-div">
						<image src="../../static/yhr.jpg" mode="" class="img"></image>
					</view>
					<text>妈妈</text> 
				</li>
				<li class="top_li flex column">
					<view class="img-div">
						<image src="../../static/yhr.jpg" mode="" class="img"></image>
					</view>
					<text>妈妈</text> 
				</li>
				<li class="top_li flex column">
					<view class="img-div">
						<image src="../../static/yhr.jpg" mode="" class="img"></image>
					</view>
					<text>妈妈</text> 
				</li>
				<li class=" top_li flex column">
					<view class="img-div add">
						<i>+</i>
					</view>
					<text></text> 
				</li>
			</ul>
		</view>
		
		<view class="list flex column" v-for="(v,i) in newsList" :key="i">
		<view class="list_top">
				<view class="list_content flex row">
						<view class="start flex row">
							<view class="img-div1">
								<image src="../../static/yhr.jpg" mode="" class="img img1"></image>
							</view>
							<view class="title flex column">
								<text class="title_top p_title">{{v.title}}</text>
								<text class="title_bottom p">2017.2.11</text>
							</view>
						</view>	
						<view class="end">
								<text class="name p">1分钟之前</text>
						</view>		
				</view>	
				
				<view class="list_middle">
					<text>{{v.content}}</text>
				</view>
				<view class="list_middle_pic flex row">
					<image src="../../static/yhr.jpg" mode="" class="pic-img"></image>
				</view>
				</view>
				<!-- <view class="list_bottom">
					<button class="btn" @tap="goToTalk()">聊一聊</button>
				</view> -->
		</view>	
		
		<text class="loading-text">
		{{loadingType === 0 ? contentText.contentdown : (loadingType === 1 ? contentText.contentrefresh : contentText.contentnomore)}}
		</text>
		
		
		</view>

	
	
</template>

<script>
	import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue';
	var  _self,
	page = 1;
	export default { 
		components: {uniLoadMore},
		data() {
			return {
				title: 'Hello',
				newsList:[],
				loadingType: 0,
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				data:[ 
					{"id":"0","title":"1双龙聚凤 璀璨人生翡翠 色泽光鲜色彩伊人","public_time":"2019-01-01","img":"/static/paint1.png",
					"content":"科普推广：科学知识、科学思维方法、科学态度。将“科学知识原理”转化为趣味性、游戏化、生活化的课程，深入浅出，将科学知识还原为最浅显的生活原理，最深层次激发孩子的联想，培养和建立能力素质。"},
					{"id":"1","title":"2天然缅甸翡翠 外形简洁饱满 异常圆润 意钱财滚滚来","public_time":"2019-01-01","img":"/static/paint2.png",
					"content":"科普推广：科学知识、科学思维方法、科学态度。将“科学知识原理”转化为趣味性、游戏化、生活化的课程，深入浅出，将科学知识还原为最浅显的生活原理，最深层次激发孩子的联想，培养和建立能力素质。"},
					{"id":"2","title":"3双龙聚凤 璀璨人生翡翠 色泽光鲜色彩伊人","public_time":"2019-01-01","img":"/static/paint1.png",
					"content":"科普推广：科学知识、科学思维方法、科学态度。将“科学知识原理”转化为趣味性、游戏化、生活化的课程，深入浅出，将科学知识还原为最浅显的生活原理，最深层次激发孩子的联想，培养和建立能力素质。"},
					{"id":"3","title":"4天然缅甸翡翠 外形简洁饱满 异常圆润 意钱财滚滚来","public_time":"2019-01-01","img":"/static/paint2.png",
					"content":"科普推广：科学知识、科学思维方法、科学态度。将“科学知识原理”转化为趣味性、游戏化、生活化的课程，深入浅出，将科学知识还原为最浅显的生活原理，最深层次激发孩子的联想，培养和建立能力素质。"},
					{"id":"4","title":"5天然缅甸翡翠 外形简洁饱满 异常圆润 意钱财滚滚来","public_time":"2019-01-01","img":"/static/w8.png",
					"content":"科普推广：科学知识、科学思维方法、科学态度。将“科学知识原理”转化为趣味性、游戏化、生活化的课程，深入浅出，将科学知识还原为最浅显的生活原理，最深层次激发孩子的联想，培养和建立能力素质。"},
					{"id":"5","title":"6天然缅甸翡翠 外形简洁饱满 异常圆润 意钱财滚滚来","public_time":"2019-01-01","img":"/static/paint2.png",
					"content":"科普推广：科学知识、科学思维方法、科学态度。将“科学知识原理”转化为趣味性、游戏化、生活化的课程，深入浅出，将科学知识还原为最浅显的生活原理，最深层次激发孩子的联想，培养和建立能力素质。"},
					{"id":"6","title":"7天然缅甸翡翠 外形简洁饱满 异常圆润 意钱财滚滚来","public_time":"2019-01-01","img":"/static/banner.png",
					"content":"科普推广：科学知识、科学思维方法、科学态度。将“科学知识原理”转化为趣味性、游戏化、生活化的课程，深入浅出，将科学知识还原为最浅显的生活原理，最深层次激发孩子的联想，培养和建立能力素质。"},
					{"id":"7","title":"8天然缅甸翡翠 外形简洁饱满 异常圆润 意钱财滚滚来","public_time":"2019-01-01","img":"/static/paint2.png",
					"content":"科普推广：科学知识、科学思维方法、科学态度。将“科学知识原理”转化为趣味性、游戏化、生活化的课程，深入浅出，将科学知识还原为最浅显的生活原理，最深层次激发孩子的联想，培养和建立能力素质。"},
					{"id":"8","title":"9天然缅甸翡翠 外形简洁饱满 异常圆润 意钱财滚滚来","public_time":"2019-01-01","img":"/static/banner.png",
					"content":"科普推广：科学知识、科学思维方法、科学态度。将“科学知识原理”转化为趣味性、游戏化、生活化的课程，深入浅出，将科学知识还原为最浅显的生活原理，最深层次激发孩子的联想，培养和建立能力素质。"}
				],
				"pages_count":"9"

			}
			
		},
		onLoad() {
			_self = this;
			this.getNewsList();
		},
		onPullDownRefresh() {
			this.getNewsList();
		},
		// 上拉加载
		onReachBottom: function() {
			console.log(_self.newsList.length);
			if (_self.loadingType != 0) {//loadingType!=0;直接返回
				return false;
			}
			_self.loadingType = 1;
			uni.showNavigationBarLoading();//显示加载动画
				if (_self.newsList.length==this.pages_count) {//没有数据
				_self.loadingType = 2;
				uni.hideNavigationBarLoading();//关闭加载动画
				return false;
			}
			page++;//每触底一次 page +1
			// console.log(page);
			for(var i=_self.newsList.length;i<this.pages_count;i++){
				_self.newsList = _self.newsList.concat(this.data[i]);//将数据拼接在一起
			}
			_self.loadingType = 0;//将loadingType归0重置
			uni.hideNavigationBarLoading();//关闭加载动画
			
// 			uni.request({
// 				url:'../../static/news.json?page='+page,
// 				success: function(res) {
// 				
// 				}
// 			});
		},
		methods: {
			goToTalk:function () {
				console.log(123456)
					uni.switchTab({
						url: '../talk/talk',
					})
			},	
		getNewsList: function() {//第一次回去数据
				_self.loadingType = 0;
				uni.showNavigationBarLoading();
					let newsList =[];
				for(var i=0;i<2;i++){
					newsList.push(this.data[i]);
				}
				_self.newsList = newsList;
				console.log()
				if(this.pages_count==this.data.length){
					uni.showToast({
						title: '已是最新',
						duration: 2000
					});
				}
				uni.hideNavigationBarLoading();
				uni.stopPullDownRefresh();//得到数据后停止下拉刷新
// 				uni.request({
// 					url: '../../static/news.json?page=1',
// 					success: function(res) {
// 					
// 					}
// 				});
				
			}

	}
	}
	

</script>

<style> 
	.flex{
		display: flex;
	}
	.row{
		flex-direction: row;
	}
	.column{
		flex-direction: column;
	}
	.p_title{
		font-size: 40upx;
		font-weight: 600;
	}
	.p{
		font-size: 30upx;
		color: #ccc;
	}
	.index {
		width: 100%;
		margin: 0 auto;
	}
	.top_ul{
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		background: #fc6c6c;
	}
	.top_li{
		width: 100upx;
		height: 160upx;
		margin-left: 40upx;
		color: #fff;
		font-size: 30upx;
		text-align: center;
		/* align-items: center; */
		/* justify-content: center; */
		
	}
	.img-div{
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
	}
	.img-div1{
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
		margin-right: 30upx;
	}
	.img{
		width: 100%;
		height: 100%;
	}
	.img1{
		border: 2px solid #FC6C6C;
	}
	.add{
		width: 90upx;
		height: 90upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border: 1px solid #fff;
		
	}
	.list{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		/* border: 1px solid #000; */
		width: 96%;
		border-radius: 5upx;
		margin: 0 auto;
		margin-top: 20upx;
		box-shadow: 0 3px 0 0 rgba(242, 156, 177, 0.3);
		margin-top: 50upx;
		padding-bottom: 30upx;
	}

	.list_content{
		/* min-height: 120upx; */
		margin-top: 10upx;
		justify-content: space-between;	
		
	}
	.list_top{
		width: 96%;
		margin: 0 auto;
	}
	.img{
		/* border:1px solid #000; */
		border-radius: 50%;
		width: 90upx;
		height: 90upx;
		margin-right: 20upx;
	}
	.list_middle{
		min-height: 200upx;
		margin-top: 20upx;
	}
	.btn{
		width: 100%;
		height: 100upx;
		border-radius: 0upx;
	}
	.list_middle_pic{
		justify-content: flex-start;
		width: 100%;
		margin: 0 auto;
	}
	.pic-img{
		width: 100%;
		
	}
	
</style>
