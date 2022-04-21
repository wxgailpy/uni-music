<template>
	<view class="my-search-container" :style="{'background-color': bgcolor}" @click="searchBox">
		<!-- 使用 view 组件模拟 input 输入框的样式 -->
		<view class="my-search-box" :style="{'border-radius': radius + 'px'}">
			<uni-icons type="search" size="17"></uni-icons>
			<text class="placeholder">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
		  // 背景颜色
		  bgcolor: {
		    type: String,
		    default: '#f6f6f6'
		  },
		  // 圆角尺寸
		  radius: {
		    type: Number,
		    // 单位是 px
		    default: 18
		  }
		},
		name: "my-search",
		data() {
			return {

			};
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync()
			// 可用高度 = 屏幕高度 - navigationBar高度 - tabBar高度 - 自定义的search组件高度
			this.wh = sysInfo.windowHeight - 50
		},
		methods:{
			searchBox(){
				this.$emit('clickSearch')
			}
		}
	}
</script>


<style lang="scss">
	.my-search-container {
		height: 50px;
		padding: 0 10px;
		display: flex;
		align-items: center;
		position: sticky;
		top: 0;
		background-color: #fefefe;
		z-index: 9;
	}

	.my-search-box {
		height: 36px;
		background-color: #ffffff;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

		.placeholder {
			font-size: 15px;
			margin-left: 5px;
		}
	}
</style>
