<template>
    <view class="mvs">
        <view class="name" v-if="name">
            <text>{{name}}</text>
        </view>
        <!-- #ifdef APP-PLUS -->
        <list class="mvs-item">
            <cell class="item" v-for="(item,i) in mvs" :key="i" @click="gotoVideo(item.id)">
                <!-- #endif -->
                <!-- #ifndef APP-PLUS -->
                <view class="mvs-item">
                    <view class="item" v-for="(item,i) in mvs" :key="i" @click="gotoVideo(item.id)">
                        <!-- #endif -->
                        <view class="images">
                            <image class="image" :src="item.cover" mode=""></image>
                            <view class="playMvsCount">
                                <uni-icons class="icons" custom-prefix="iconfont" color="#fff" type="icon-bofang1"
                                    size="20"></uni-icons>
                                {{item.playCount>10000?(item.playCount/10000).toFixed(1)+'万':item.playCount}}
                            </view>
                        </view>
                        <view class="title">
                            {{item.name}}
                        </view>
                        <!-- #ifndef APP-PLUS -->
                    </view>
                </view>
                <!-- #endif -->
                <!-- #ifdef APP-PLUS -->
            </cell>
        </list>
        <!-- #endif -->
    </view>
</template>

<script>
    export default {
        name: "my-mvs",
        data() {
            return {
                // mv
                mvs: [],

                // mv索引
                mvIndex: 0,
                isLoading: false
            };
        },
        props: {
            name: String,
        },
        created() {
            this.getMvs()
        },
        methods: {
            async getMvs() {
                // ** 打开节流阀
                this.isloading = true
                const {
                    data: res
                } = await uni.$http.get('/mv/all', {
                    'limit': 10,
                    'offset': this.mvIndex * 10
                })
                // ** 关闭节流阀
                this.isloading = false
                this.mvs = [...this.mvs, ...res.data]
            },

            gotoVideo(id) {
                uni.navigateTo({
                    url: '/subpkg/video/video?id=' + id + '&isPlay=' + this.isPlay
                })
            },
            bottom() {
                // 判断是否还有下一页数据
                // if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
                if (this.mvIndex >= 80) return uni.$showMsg('数据加载完毕！')
                // 判断是否正在请求其它数据，如果是，则不发起额外的请求
                if (this.isloading) return

                // 让页码值自增 +1
                this.mvIndex += 1
                // 重新获取列表数据
                this.getMvs()
            }
        },

    }
</script>

<style lang="scss">
    .mvs {
        .mvs-item {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            .item {
                width: 49%;
                margin-bottom: 20px;

                .images {
                    position: relative;

                    .image {
                        width: 100%;
                        height: 300rpx;
                        border-radius: 16rpx;
                    }

                    .playMvsCount {
                        display: flex;
                        align-items: center;
                        font-size: 12px;
                        border-radius: 10rpx;
                        position: absolute;
                        left: 0rpx;
                        bottom: 15rpx;
                        padding: 2px 8px;
                        color: #fff;

                        .icons {
                            margin-right: 8rpx;
                        }
                    }
                }

                .title {
                    font-size: 14px;
                    text-overflow: -o-ellipsis-lastline;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
            }
        }
    }
</style>
