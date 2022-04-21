<template>
    <view class="personalized">
        <view class="name">
            {{name}}
        </view>
        <scroll-view scroll-x="true" class="scroll-view" height="200px" :show-scrollbar="false">
            <view class="scroll-view-item uni-bg-red" :class="[hidden&&i==0?'first':'']" v-for="(item,i) in data"
                :key="i" style="display: inline-block;">
                <view class="itembox" v-if="!type" @click="gotoPlaylist(item.id)">
                    <view :class="[hidden?'item':'']">
                        <view class="firstbox" v-if="i==0&&hidden">
                            <view class="title">
                                推荐歌单
                            </view>

                            <view class="text">
                                <view class="hello">
                                    晚上好
                                </view>
                                <text>今天分享这些宝藏给你</text>

                            </view>
                        </view>
                        <view class="images">
                            <image class="image" :src="item.picUrl" mode=""></image>
                            <view class="playCount" v-if="i!==0&&hidden" style="left: 0;">
                                <uni-icons class="icon" custom-prefix="iconfont" color="#fff" type="icon-play"
                                    size="12"></uni-icons>
                                {{(item.playCount/10000).toFixed(1)}}万
                            </view>
                        </view>
                    </view>
                    <view class="itemtext">
                        {{item.name}}
                    </view>
                </view>
                <view class="itembox" v-if="type == 'songs'" @click="playMusic([item.song])">
                    <view :class="[hidden?'item':'']">
                        <view class="images">
                            <image class="image" :src="item.song.al.picUrl" mode=""></image>
                            <view class="playCount" style="right: 0;">
                                <uni-icons style="margin-right: 0;" class="icon" custom-prefix="iconfont" color="#fff"
                                    type="icon-play" size="12"></uni-icons>
                            </view>
                        </view>
                    </view>
                    <view class="itemtext">
                        {{item.song.name}}
                    </view>
                </view>
                <view class="itembox" v-if="type == 'video'" @click="gotoVideo(item.mlogBaseData.id)">
                    <view :class="[hidden?'item':'']">
                        <view class="images">
                            <image class="image" :src="item.mlogBaseData.coverUrl" mode=""></image>
                            <view class="playCount" style="right: 0;bottom: 6px;background: none;">
                                <uni-icons class="icon" style="margin-right: 0;" custom-prefix="iconfont" color="#fff"
                                    type="icon-bofang1" size="22"></uni-icons>
                            </view>
                        </view>
                    </view>
                    <view class="itemtext">
                        {{item.mlogBaseData.text}} - {{item.mlogExtVO.artistName}}
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
    import {
        mapMutations,
        mapState
    } from 'vuex'
    export default {
        name: "my-scroll",
        data() {
            return {

            };
        },
        props: {
            data: Array,
            hidden: Boolean,
            name: String,
            type: String
        },
        computed: {
            ...mapState(['isPlay'])
        },
        methods: {
            ...mapMutations(['playMusic']),
            gotoPlaylist(id) {
                uni.navigateTo({
                    url: `/subpkg/playlist/playlist?id=${id}`
                })
            },
            gotoVideo(id) {
                uni.navigateTo({
                    // 指定详情页面的 URL 地址，并传递 goods_id 参数
                    url: '/subpkg/video/video?id=' + id + '&isPlay=' + this.isPlay
                })
            },
        }
    }
</script>

<style lang="scss">
    .personalized {
        margin-bottom: 20rpx;

        .name {
            font-weight: 500;
            margin-bottom: 10px;
        }

        .scroll-view {
            white-space: nowrap;
            height: 250rpx;


            .scroll-view-item {
                display: inline-block;
                margin-right: 20rpx;

                .images {
                    position: relative;

                    .image {
                        width: 200rpx;
                        height: 200rpx;
                        border-radius: 20rpx;
                    }

                    .playCount {
                        display: flex;
                        align-items: center;
                        font-size: 12px;
                        border-radius: 10rpx;
                        background: #666;
                        position: absolute;
                        bottom: 4px;
                        padding: 2px 8px;
                        color: #fff;

                        .icon {
                            margin-right: 8rpx;
                        }
                    }
                }



                .firstbox {
                    padding: 10px 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;

                    .title {
                        font-size: 18px;
                    }

                    .text {
                        font-size: 8px;
                    }

                    .hello {
                        font-size: 12px;
                    }
                }

                .itemtext {
                    font-size: 14px;
                    width: 200rpx;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-align: center;
                }
            }

        }

        .first {
            width: 400rpx;

            .item {
                display: flex;
                justify-content: space-around;
                padding: 0px 8px;
                color: white;
                background-image: url(../../static/home-bg.jpeg);
                border-radius: 20rpx;

                .image {
                    margin: 20rpx 0;
                    width: 160rpx !important;
                    height: 160rpx !important;
                }

            }

            .itemtext {
                width: 400rpx !important;
            }
        }

    }
</style>
