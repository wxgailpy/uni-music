<template>
    <view class="bg">
        <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text"
            activeColor="#4cd964 !important"></uni-segmented-control>
        <!-- 歌曲内容 -->
        <view class="content" v-if="songDetail">
            <view v-show="current === 0">
                <view class="images">
                    <image :src="playlist[index].img" widthFix class="image" mode=""></image>
                </view>
                <view class="title">
                    <view class="name">
                        <view :style="{transform:'translateX('+lampX+'px)'}">{{playlist[index].name}}</view>
                    </view>
                    <view class="text">
                        <view class="song">
                            {{playlist[index].song}}
                        </view>
                        <view class="icons iconvip"></view>
                        <view class="icons iconyuan"></view>
                        </uni-icons>
                    </view>
                    <view class="lyric">
                        还回家后阿斯顿撒
                    </view>
                </view>
            </view>
            <!-- 歌词的内容 -->
            <view v-show="current === 1">
                <view class="title">
                    <view class="name">
                        <view :style="{transform:'translateX('+lampX+'px)'}">{{playlist[index].name}}</view>
                    </view>
                    <view class="text">
                        <view class="song">
                            {{playlist[index].song}}
                        </view>
                    </view>
                </view>
                <scroll-view class="scroll-Y lyrics" scroll-anchoring="true" :scroll-top="scrollTop" scroll-y="true">
                    <view class="lyric" v-for="(item,i) in lyric" :key="i" :class="{
					  active:
					    playTime*1000 <= lyric[i].time &&
					    playTime*1000 > lyric[i].pre,
					}">
                        {{item.lyric}}
                    </view>
                </scroll-view>

            </view>

            <view class="bottom">
                <view class="btns">
                    <uni-icons @click="download" custom-prefix="iconfont" color="#fff" type="icon-yunduanxiazai"
                        size="28">
                    </uni-icons>
                    <uni-icons custom-prefix="iconfont" color="#fff" type="icon-pinglun" size="28"></uni-icons>
                    <uni-icons custom-prefix="iconfont" color="#fff" type="icon-liebiao-dian" size="28">
                    </uni-icons>
                </view>
                <view class="jindu">
                    <view class="jingdudian" :style="{width:widths(playTime)+'%'}"></view>
                    <view class="jingdutiao"></view>
                    <view class="time">
                        <view class="new">
                            {{time(playTime)}}
                        </view>
                        <view class="old">
                            {{time((playlist[index].time/1000).toFixed(0))}}
                        </view>
                    </view>
                </view>

                <view class="btns btns1">
                    <uni-icons custom-prefix="iconfont" color="#fff" type="icon-shunxubofang" size="22">
                    </uni-icons>
                    <uni-icons custom-prefix="iconfont" @click="next(-1)" color="#fff" type="icon-shangyishou"
                        size="22"></uni-icons>
                    <uni-icons custom-prefix="iconfont" @click="play" color="#fff"
                        :type="isPlay?'icon-zanting':'icon-bofang'" size="48"></uni-icons>
                    <uni-icons custom-prefix="iconfont" @click="next(1)" color="#fff" type="icon-xiayishou" size="22">
                    </uni-icons>
                    <uni-icons custom-prefix="iconfont" color="#fff" type="icon-liebiao" size="28"></uni-icons>
                </view>
            </view>

        </view>
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
                items: ['歌曲', '歌词'],
                current: 0,
                songDetail: [],
                // 跑马灯
                lampX: 0,
                // 定时器
                setInterval: null,
                // 歌词滚动位置
                scrollTop: 0,
                //进度的宽度
                width: 0
            };
        },
        onLoad(options) {
            this.getLyric()
            // this.lamp()
        },
        computed: {
            ...mapState(['playlist', 'index', 'isPlay', 'playTime', 'lyric']),
            time(datetime) {
                return function(datetime) {
                    var min = Math.floor(datetime / 60)
                    var second = datetime % 60
                    return (min >= 10 ? min : '0' + min) + ':' + (second >= 10 ? second : '0' + second)
                }
            },
            widths(playTime) {
                return function(playTime) {
                    return (playTime * 100 * 1000 / this.playlist[this.index].time)
                }
            }
        },
        watch: {
            playTime(newValue, oldValue) {
                const query = uni.createSelectorQuery().in(this);
                query.select('.active').boundingClientRect(data => {
                    // console.log(data)
                    if (data.top !== null && data.height !== null) {
                        if (data.top >= 200) this.scrollTop += data.height
                    }
                }).exec();
            }
        },
        methods: {
            ...mapMutations(['changePlay', 'setIndex', 'setLyric', 'setPlayTime']),
            async getLyric() {
                const {
                    data: res
                } = await uni.$http.get('/lyric', {
                    id: this.playlist[this.index].id
                })
                let arr = res.lrc.lyric.split(/\n/gis).map((item) => {
                    let min = parseInt(item.slice(1, 3))
                    let sec = parseInt(item.slice(4, 6))
                    let mill = parseInt(item.slice(7, item.indexOf(']')))
                    return {
                        min,
                        sec,
                        mill,
                        lyric: item.slice(item.indexOf(']') + 1, item.length),
                        content: item,
                        pre: mill + sec * 1000 + min * 60 * 1000
                    }
                })
                arr.forEach((item, i) => {
                    if (i + 1 >= arr.length - 1) {
                        item.time = 999999
                    } else {
                        item.time = arr[i + 1].pre
                    }
                })
                arr.splice(arr.length - 1, 1)
                this.setLyric(arr)
            },
            lamp() {
                clearInterval(this.setInterval)
                this.setInterval = setInterval(() => {
                    this.lampX -= 1
                    if (this.lampX < -(this.playlist[this.index].name.length * 26)) this.lampX = 300
                }, 10)
            },
            play() {
                this.changePlay(!this.isPlay)
            },
            next(value) {
                if (this.playlist.length == 1) return
                this.changePlay(false)
                this.setIndex(this.index + value)
                this.scrollTop = 0
                this.setPlayTime(0)
                this.getLyric()
                uni.$emit('play')

            },
            onClickItem(e) {
                if (this.current !== e.currentIndex) {
                    this.current = e.currentIndex
                }
            },
            download() {
                console.log('开始下载')
                uni.downloadFile({
                    url: `https://music.163.com/song/media/outer/url?id=${this.playlist[this.index].id}.mp3`,
                    success: (res) => {
                        console.log(res.tempFilePath)
                        uni.$showMsg('下载成功' + res.filePath)
                        uni.saveFile({
                            tempFilePath: res.tempFilePath, //临时路径
                            success: function(res) {
                                uni.showToast({
                                    icon: "none",
                                    mask: true,
                                    title: '文件保存：' + res.savedFilePath,
                                    duration: 3000
                                })
                                setTimeout(() => {
                                    //打开文档查看
                                    uni.openDocument({
                                        filePath: res.savedFilePath,
                                        success: function(res) {
                                            console.log('打开文档成功');
                                        },
                                        fail: function() {
                                            console.log('打开失败');
                                        }
                                    });
                                }, 3000);
                            },
                            fail: function() {
                                console.log('保存失败');
                            }
                        })
                    },
                    fail: function() {
                        console.log('下载失败');
                    	   uni.showToast({
                            icon: 'none',
                            mask: true,
                            title: '失败请重新下载'
                        });
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .bg {
        background: #999;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .segmented-control {
        width: 50%;
        margin: 0 auto;
    }

    .segmented-control__item--text {
        border-bottom-width: 0 !important;
        padding: 0 !important;

    }

    .segmented-control__text {
        color: #fff !important;
    }

    .content {
        width: 80%;
        margin: 0 auto;
        color: #fff;

        .images {
            margin-bottom: 20px;
            margin-top: 20px;
            border-radius: 40rpx;
            overflow: hidden;

            .image {
                width: 100%;
                height: 40vh;
            }
        }

        .title {
            display: flex;
            flex-direction: column;
            justify-content: space-around;

            .name {
                font-size: 26px;
                overflow: hidden;
                margin-bottom: 20rpx;
                white-space: nowrap;
            }

            .text {
                display: flex;
                align-items: center;
                color: #FFFEFC;
                ;

                .icons {
                    margin-left: 10px;
                }

                .icons {
                    background-image: url(../../static/icons.png);
                    display: table-cell !important;
                    vertical-align: middle;
                    display: inline-block !important;
                    width: 34px;
                    height: 16px;
                    margin: 10px 5px;
                }

                .iconvip {
                    background-position: -80px -160px;
                }

                .iconyuan {
                    background-position: -80px -280px;
                }
            }
        }

        .lyrics {
            height: 50vh;
            text-align: center;
            overflow: hidden;
            position: relative;
            top: 0px;

            .lyric {
                line-height: 80rpx;
            }

            .active {
                color: #4cd964;
            }
        }
    }

    .bottom {
        width: 80%;
        position: fixed;
        bottom: 50rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 250rpx;

        .btns {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30rpx;
        }

        .jindu {
            .jingdudian {
                border: 2rpx solid #9F6;
                position: relative;
                top: 2px;
            }

            .jingdudian::after {
                display: block;
                width: 30rpx;
                height: 30rpx;
                border-radius: 50%;
            }


            .jingdutiao {
                width: 100%;
                border: 2rpx solid #aaa;

            }
        }

        .time {
            display: flex;
            justify-content: space-between;
            margin-top: 15rpx;
            font-size: 12px;
        }

    }
</style>
