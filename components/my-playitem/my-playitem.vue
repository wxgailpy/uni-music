<template>
    <view class="playitem">
        <view class="btns">
            <view class="btns-left" @click="playMusic(data)">
                <uni-icons class="icons" custom-prefix="iconfont" color="#24e0a3" type="icon-playCircle" size="32">
                </uni-icons>
                全部播放({{total}})
            </view>
            <view class="btns-right">
                <uni-icons class="icons" type="download" color="#bfbfbf" size="28"></uni-icons>
                <uni-icons class="icons" type="list" color="#bfbfbf" size="28"></uni-icons>
            </view>
        </view>
        <view class="items" v-if="data" v-for="(item,i) in data" :key="i">
            <view class="num">
                {{i+1}}
            </view>
            <view class="title" @click="playMusic([data[i]])">
                <view class="name">
                    {{item.name}}
                </view>
                <view class="jieshao">
                    <view class="icons iconvip" v-if="item.fee==1 ||item.fee==4"></view>
                    <view class="icons iconyuan" v-if="item.originCoverType==1"></view>
                    <view class="text">
                        {{item.ar[0].name}}
                    </view>
                </view>
            </view>
            <view class="icon">
                <uni-icons class="icons" custom-prefix="iconfont" v-if="item.mv!==0" @click="gotoVideo(item.mv)"
                    color="#bfbfbf" type="icon-bofang1" size="28"></uni-icons>
                <uni-icons class="play icons" custom-prefix="iconfont" @click="addPlaylist(data[i])" color="#bfbfbf"
                    type="icon-play" size="28"></uni-icons>
                <uni-icons class="icons" custom-prefix="iconfont" color="#bfbfbf" type="icon-liebiao-dian" size="28">
                </uni-icons>
            </view>
        </view>
    </view>
</template>

<script>
    var _self
    import {
        mapState,
        mapMutations
    } from 'vuex'
    export default {
        name: "my-playitem",
        data() {
            return {

            };
        },
        props: {
            data: Array,
            total: {
                type: String,
                default: ''
            }
        },
        created() {
            _self = this
        },
        computed: {
            ...mapState(['isPlay'])
        },
        methods: {
            ...mapMutations(['addPlaylist', 'playMusic', 'setIndex']),
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
    .playitem {
        padding: 20rpx;
        margin-bottom: 50px;

        .btns {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20rpx;


            .btns-right,
            .btns-left {
                display: flex;
                align-items: center;
            }

            .icons {
                margin-right: 12rpx;
            }
        }

        .items {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 30rpx;

            .num {
                width: 70rpx;
                text-align: center;
                margin-right: 30rpx;
            }

            .title {
                font-size: 16px;
                width: 100%;
                overflow: hidden;

                .name {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }

                .jieshao {
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    margin-top: 10rpx;

                    .icons {
                        background-image: url(../../static/icons.png);
                        display: table-cell !important;
                        vertical-align: middle;
                        display: inline-block !important;
                        width: 34px;
                        height: 16px;
                        margin-top: -8rpx;
                        margin-right: 10rpx;
                    }

                    .iconvip {
                        background-position: -80px -160px;
                    }

                    .iconyuan {
                        background-position: -80px -280px;
                    }

                    .text {

                        white-space: nowrap;
                    }
                }


            }

            .icon {
                display: flex;

                .icons {
                    margin-right: 20rpx;
                }

                .play {
                    margin-right: 0rpx;
                }
            }
        }
    }
</style>
