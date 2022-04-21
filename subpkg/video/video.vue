<template>
    <view>
        <view class="uni-padding-wrap uni-common-mt" v-if="videoUrl">
            <view>
                <video id="myVideo" ref="video" :src="videoUrl.url" @error="videoErrorCallback" loop
                    play-btn-position="center" page-gesture autoplay controls></video>
            </view>
        </view>
        <view class="bottom" v-if="data">
            <view class="title">
                <view class="images">
                    <image class="image" :src="data.cover" mode=""></image>
                </view>
                <view class="name">
                    {{data.artistName}}
                </view>
            </view>
            <view class="text">
                {{data.name}}
            </view>
        </view>
        <view class="right" v-if="nums">
            <view class="item" @click="clickLike">
                <uni-icons custom-prefix="iconfont" :color="isLike?'#24e0a3':'#bfbfbf'" type="icon-dianzan" size="28">
                </uni-icons>
                <view class="text">
                    {{likedCount}}
                </view>
            </view>
            <view class="item" @click="open">
                <uni-icons custom-prefix="iconfont" type="icon-pinglun" color="#bfbfbf" size="28"></uni-icons>
                <view class="text">
                    {{nums.commentCount}}
                </view>
            </view>
            <view class="item">
                <uni-icons type="redo-filled" color="#bfbfbf" size="38"></uni-icons>
                <view class="text">
                    分享
                </view>
            </view>
        </view>
        <uni-popup popper-append-to-body="false" ref="popup" type="bottom">
            <view class="pinlunqu">
                <view class="pinlunqutop">
                    <view class="pinlunqutop-left">
                        <view class="left-name">
                            评论区
                        </view>
                        <view class="left-nums">
                            {{nums.commentCount}}
                        </view>
                    </view>
                    <view class="pinlunqutop-right">
                        <view class="right-hot" :class="isComments=='hot'?'active':''" @click="changeComments('hot')">
                            热门
                        </view>
                        <view class="right-time" :class="isComments=='all'?'active':''" @click="changeComments('all')">
                            事件
                        </view>
                    </view>
                </view>
                <view class="hot" v-if="comments">
                    <scroll-view :scroll-top="scrollTop" ref="scrollview" scroll-y="true" class="scroll-Y"
                        @scrolltolower="scrolltolower" style="height: 63vh;">
                        <view class="hotname">
                            精彩评论
                        </view>

                        <view class="hotitem" v-for="(item,i) in comments" :key="i">
                            <view class="images">
                                <image class="image" :src="item.user.avatarUrl" mode=""></image>
                            </view>
                            <view class="text">
                                <view class="top">
                                    <view class="hottitle">
                                        {{item.user.nickname}}
                                    </view>
                                    <view class="textright">
                                        {{item.likedCount}}
                                    </view>
                                </view>
                                <view class="time">
                                    {{item.timeStr }}
                                </view>
                                <view class="p">
                                    {{item.content}}
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
    import {
        mapState
    } from 'vuex'
    var play
    export default {
        data() {
            return {
                // 视频链接
                videoUrl: [],
                // 视频详情
                data: [],
                // 喜欢评论数量
                nums: [],
                // 是否喜欢
                isLike: false,
                // id
                id: 0,
                show: false,
                // 评论
                comments: [],
                // 节流阀
                isget: false,
                // 评论类型
                isComments: 'hot',
                // 评论页数
                page: 0
            };
        },
        onLoad(options) {
            // console.log(this.$store.state.isPlay)
            play = options.isPlay
            if(play == 'true'){uni.$emit('pause')}
            // 获取 Id
            this.id = options.id
            // 调用请求商品详情数据的方法
            this.getVideo()
            this.getDetail()
            this.getInfo()
            this.getComment('hot')
        },
        onUnload() {
            if(play == 'true'){
                uni.$emit('platto')
            }
        },
        computed: {
            ...mapState(['user']),
            likedCount() {
                if (this.nums.likedCount < 10000) return this.nums.likedCount
                return (this.nums.likedCount / 10000).toFixed(1) + '万'
            }
        },
        methods: {
            async getVideo() {
                const {
                    data: res
                } = await uni.$http.get('/mv/url', {
                    id: this.id
                })
                if (res.code !== 200) return uni.$showMsg()
                this.videoUrl = res.data
            },
            async getDetail() {
                const {
                    data: res
                } = await uni.$http.get('/mv/detail', {
                    mvid: this.id
                })
                if (res.code !== 200) return uni.$showMsg()
                this.data = res.data
            },
            async getInfo() {
                const {
                    data: res
                } = await uni.$http.get('/mv/detail/info', {
                    mvid: this.id
                })
                if (res.code !== 200) return uni.$showMsg()
                this.nums = res
            },
            async clickLike() {
                if (!this.user.isLogin) {
                    let time = 4
                    let timer = setInterval(() => {
                        time -= 1
                        uni.$showMsg(`未登录!!!${time}秒钟后自动跳转`)
                    }, 1000)
                    setTimeout(() => {
                        clearInterval(timer)
                        uni.navigateTo({
                            url: '/subpkg/login/login'
                        })
                    }, 3500)
                }
                else{
                this.isLike = !this.isLike
                const {
                    data: res
                } = await uni.$http.get('/resource/like?type=1', {
                    id: this.id,
                    t: this.isLike ? 1 : 0,
                    token: this.user.token,
                    cookie: this.user.cookie
                })
                this.nums.likedCount += this.isLike ? 1 : -1
                }
            },
            open() {
                // 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
                this.$refs.popup.open('bottom')
            },
            async getComment() {
                this.isget = true
                const {
                    data: res
                } = await uni.$http.get('/comment/mv', {
                    offset: this.page * 20,
                    id: this.id
                })
                this.page += 1
                this.isget = false
                if (res.code !== 200) return uni.$showMsg()
                this.comments = this.isComments == 'hot' ? res.hotComments : [...this.comments,
                    ...res.comments
                ]
            },
            changeComments(str) {
                if (this.isget) return
                if (this.isComments != str) {
                    this.isComments = str
                }
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
                this.comments = []
                this.page = 0
                this.getComment()
            },
            scrolltolower() {
                if (this.isget) return
                if (this.isComments == 'hot') return
                console.log(123)
                this.page = this.page * 20 > this.nums.commentCount ? this.page - 1 : this.page
                this.getComment()
            }
        }
    }
</script>

<style lang="scss">
    page {
        height: 100vh;
        background-color: rgb(0, 0, 0);
        color: #fff;

        video {
            width: 100%;
        }
    }

    .uni-padding-wrap {
        padding-top: 20vh;
    }

    .images {
        margin-right: 20rpx;

        .image {
            width: 70rpx;
            border-radius: 50%;
            height: 70rpx
        }
    }

    .bottom {
        position: absolute;
        bottom: 50px;
        left: 14px;
        width: 80%;

        .title {
            display: flex;
            line-height: 60rpx;

            .name {
                font-size: 14px;
            }
        }

        .text {
            font-size: 12px;
        }
    }

    .right {
        position: absolute;
        right: 20px;
        bottom: 50px;
        display: flex;
        flex-direction: column;
        text-align: center;

        .item {
            margin-top: 15px;

            .image {
                width: 60rpx;
                height: 60rpx;
            }

            .text {
                font-size: 14px;
                margin-top: 10rpx;
            }

        }

        .item:last-child {
            .text {
                margin-top: 0rpx;
            }
        }
    }

    .uni-popup {
        bottom: 0;

        .uni-popup__wrapper {
            width: 100%;
            height: 70vh;
            position: absolute !important;
            left: 0;
            bottom: 0;
            background-color: #000 !important;
        }
    }

    .pinlunqu {
        padding: 0 20rpx;
        height: 100%;

        .pinlunqutop {
            display: flex;
            justify-content: space-between;
            position: sticky;
            top: 0;
            padding: 10px 0;

            >view {
                display: flex;
                color: #999;
            }

            .left-name {
                color: #fff;
                margin-right: 20rpx;
            }

            .right-hot {
                margin-right: 20rpx;
            }

            .active {
                color: #fff;
            }
        }

        .hot {
            .hotname {
                margin-bottom: 20px;
            }

            .hotitem {
                display: flex;
                margin-bottom: 20px;
                z-index: 9;

                .text {
                    width: 100%;
                    color: #999;

                    .top {
                        display: flex;
                        justify-content: space-between;
                        line-height: 40rpx;
                        padding-right: 40rpx;

                        .hottitle {
                            font-size: 14px;
                        }
                    }

                    .time {

                        font-size: 10px;
                        margin-bottom: 4rpx;
                    }

                    .p {
                        color: #fff;
                        font-size: 14px;
                    }
                }

            }
        }
    }
</style>
