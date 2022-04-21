<template>
    <view>
        <view class="playlist-top">
            <view class="playlist-title" v-if="playlist">
                <view class="title-left">
                    <image class="image" :src="playlist.coverImgUrl" mode=""></image>
                </view>
                <view class="title-right">
                    <view class="title-name">
                        <view class="name">
                            {{playlist.name}}
                        </view>
                        <view class="song-title">
                            <view class="songitem song-image">
                                <image class="image" :src="playlist.creator.avatarUrl" mode=""></image>
                            </view>
                            <view class="songitem song-name">
                                {{playlist.creator.nickname}}
                            </view>
                            <view class="songitem song-guanzu">
                                关注
                            </view>
                        </view>
                    </view>
                    <view class="title-jianjie">
                        简介:{{playlist.description}}
                    </view>
                </view>
            </view>
            <view class="playlist-items">
                <view class="item">
                    <uni-icons class="icons" custom-prefix="iconfont" @click="clickLike"
                        :color="!isLike?'#bfbfbf':'#d81e06'" :type="!isLike?'icon-like':'icon-like1'" size="26">
                    </uni-icons>
                    {{playlist.subscribedCount}}
                </view>
                <view class="item" @click="open">
                    <uni-icons class="icons" custom-prefix="iconfont" color="#bfbfbf" type="icon-pinglun" size="26">
                    </uni-icons>
                    {{playlist.commentCount}}
                </view>
                <view class="item">
                    <button open-type="share" class="btn">
                        <uni-icons class="icons" color="#bfbfbf" type="redo-filled" size="32"></uni-icons>
                        分享
                    </button>
                </view>
            </view>
        </view>
        <my-playitem :data="songs" :total="playlist.trackCount"></my-playitem>
        <view class="my-play">
            <my-play></my-play>
        </view>
        <uni-popup popper-append-to-body="false" ref="popup" @change="close" type="bottom">
            <view class="pinlunqu">
                <view class="pinlunqutop">
                    <view class="pinlunqutop-left">
                        <view class="left-name">
                            评论区
                        </view>
                        <view class="left-nums">
                            {{playlist.commentCount}}
                        </view>
                    </view>
                </view>
                <view class="hot" v-if="comments">
                    <scroll-view :scroll-top="scrollTop" ref="scrollview" scroll-y="true" class="scroll-Y"
                        @scrolltolower="scrolltolower" style="height: 63vh;">

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
        mapState,
        mapMutations
    } from 'vuex'
    export default {
        data() {
            return {
                // 歌单数据
                playlist: [],
                // 是否收藏
                isLike: false,
                // 歌单id
                id: 0,
                // 所有歌曲
                songs: [],
                // 歌曲数量
                pages: 30,
                // 分享地址
                share: '',
                page: 0,
                isget: false,
                comments: []
            };
        },
        onLoad(options) {
            const id = this.id = options.id
            this.getPlaylist(id)
            this.getComment()
        },
        computed: {
            ...mapState(['isPlay', 'user']),
        },
        onShareAppMessage() {
            return {
                title: this.playlist.name,
                desc: "分享",
                path: '/pages/test/test?id=' + this.id,
                imageUrl: '',
                success: res => {
                    console.log(res)
                },
                fail: err => {
                    console.log(err)
                }

            }
        },
        methods: {
            ...mapMutations(['addPlaylist', 'setIndex', 'playMusic']),
            async getPlaylist(id) {
                const {
                    data: res
                } = await uni.$http.get('/playlist/detail', {
                    id: id,
                    token: this.user.token,
                    cookie: this.user.cookie
                })
                if (res.code !== 200) return uni.$showMsg()
                this.playlist = res.playlist
                this.getSongs(this.playlist.trackIds)
            },
            async clickLike() {
                this.isLike = !this.isLike
                const {
                    data: res
                } = await uni.$http.get('/playlist/subscribe', {
                    t: this.isLike ? 1 : 2,
                    id: this.id,
                    token: this.user.token,
                    cookie: this.user.cookie

                })
                this.playlist.subscribedCount += this.isLike ? 1 : -1
                uni.$showMsg(`${this.isLike? '收藏成功':'取消收藏'}`)
            },
            async getSongs(data) {
                let ids = ''
                for (let i = 0; i < data.length; i++) {
                    ids += data[i].id + ','
                }
                ids = ids.slice(0, ids.length - 1)
                const {
                    data: res
                } = await uni.$http.get('/song/detail', {
                    ids: ids
                })
                if (res.code !== 200) return uni.$showMsg()
                this.songs = res.songs
            },
            gotoVideo(id) {
                uni.$emit('pause')
                uni.navigateTo({
                    // 指定详情页面的 URL 地址，并传递 goods_id 参数
                    url: '/subpkg/video/video?id=' + id
                })
            },
            setList() {
                let goods = []
                for (let i of this.data) {
                    if (i.fee !== 1 || i.fee !== 4) {
                        goods.push({
                            'id': i.id,
                            'img': i.al.picUrl,
                            'name': i.name,
                            'song': i.ar[0].name,
                            'time': i.dt
                        })
                    }
                }
                this.setPlaylist(goods)
                this.setIndex(0)
                uni.$emit('play')
            },

            // #ifdef APP-PLUS
            async share() {
                const {
                    data: res
                } = await uni.$http.get('/share/resource', {
                    id: this.id,
                    type: 'playlist',
                    token: this.user.token,
                    cookie: this.user.cookie,
                    msg: '分享歌单',

                })
                console.log(res)
            },
            // #endif
            open() {
                // 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
                this.$refs.popup.open('bottom')
            },
            close(e) {
                if (e.show) return
                console.log(e.show)
                this.page = 0
                this.comments = this.comments.slice(0,20)
            },
            async getComment() {
                this.isget = true
                const {
                    data: res
                } = await uni.$http.get('/comment/playlist', {
                    offset: this.page * 20,
                    id: this.id
                })
                this.isget = false
                this.comments = [...this.comments, ...res.comments]
            },
            scrolltolower() {
                
                if (this.isget) return
                if ((this.page+1) * 20 > this.playlist.commentCount) {
                    uni.$showMsg('已经到底了')
                    return
                }
                this.page += 1
                console.log(this.page)
                this.getComment()
            }
        }
    }
</script>

<style lang="scss">
    .image {
        width: 100%;
        height: 100%;
        border-radius: 20rpx;
    }

    .playlist-top {
        background-color: #838383;
        color: #fff;
        padding-bottom: 20px;
        padding-top: 20px;
    }

    .playlist-title {
        display: flex;
        justify-content: space-around;
        font-size: 12px;
        margin-bottom: 20px;

        .title-left {
            width: 250rpx;
            height: 250rpx;
        }

        .title-right {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            width: 50%;

            .title-name {
                .name {
                    font-size: 16px;
                }

                .song-title {
                    display: flex;
                    align-items: center;

                    .songitem {
                        margin-right: 15rpx;
                    }

                    .song-image {
                        width: 60rpx;
                        height: 60rpx;
                        border-radius: 50%;
                        overflow: hidden;
                    }

                    .song-name {
                        font-size: 14px;
                    }
                }
            }

            .title-jianjie {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    .playlist-items {
        display: flex;
        justify-content: space-around;

        .item {
            display: flex;
            align-items: center;

            .btn {
                background: #838383;
                color: #fff;
                display: flex;
                align-items: center;
            }

            .btn::after {
                border: none;
            }
        }

        .icons {
            margin-right: 20rpx;
        }

        .item:last-child {
            .icons {
                margin-right: 10rpx;
            }
        }

    }

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

    .images {
        margin-right: 20rpx;

        .image {
            width: 70rpx;
            border-radius: 50%;
            height: 70rpx
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
