<template>
    <view class="my-play">
        <!-- <view class="bg"></view> -->
        <view class="box">
            <view class="images" @click="detail">
                <image class="image" :src="playlist.length>0?playlist[index].img:'../../static/yyue.png'" mode="">
                </image>
            </view>
            <view class="lyric" @click="detail">
                {{playlist.length>0?playlist[index].name+'-'+playlist[index].song:'QQ音乐 听我想听'}}
            </view>
            <uni-icons custom-prefix="iconfont" @click="play" color="#fff" :type="isPlay?'icon-zanting':'icon-bofang'"
                size="34"></uni-icons>
            <uni-icons custom-prefix="iconfont" color="#fff" type="icon-liebiao" size="34"></uni-icons>
        </view>
    </view>
</template>

<script>
    var innerAudioContext = uni.createInnerAudioContext()
    var currentTime = null
    import {
        mapState,
        mapMutations,
    } from 'vuex'
    export default {
        name: "my-play",
        data() {
            return {};
        },
        created() {
            uni.$on('play', () => {
                    this.changePlay(false)
                    innerAudioContext.stop()
                    innerAudioContext.src =
                        `https://music.163.com/song/media/outer/url?id=${this.playlist[this.index].id}.mp3`;
                    setTimeout(function() {
                        innerAudioContext.play()
                    }, 500);

                    this.changePlay(!this.isPlay)
                }),
                uni.$on('pause', () => {
                    this.changePlay(false)
                    // innerAudioContext.pause()
                }),
                uni.$on('platto', () => {
                    this.changePlay(true)
                    // innerAudioContext.play()
                })
        },
        computed: {
            ...mapState(['isPlay', 'playlist', 'index'])
        },
        watch: {
            isPlay() {
                innerAudioContext.src =
                    `https://music.163.com/song/media/outer/url?id=${this.playlist[this.index].id}.mp3`;
                if (!this.isPlay) {
                    innerAudioContext.pause();
                } else {
                    innerAudioContext.play();
                }
                innerAudioContext.onPlay(() => {
                    // console.log('开始播放');
                });
                innerAudioContext.onPause(() => {
                    // console.log('暂停播放');
                    // clearInterval(currentTime)
                });
                innerAudioContext.onError((res) => {
                    if(this.playlist.length > 1){
                        uni.$showMsg('该歌曲无法播放,自动为您播放下一首')
                        this.changePlay(false)
                        this.setIndex(this.index + 1)
                        this.setPlayTime(0)
                        uni.$emit('play')
                    }else{
                        uni.$showMsg('该歌曲无法播放')
                        uni.$emit('pause')
                        this.empty()
                    }
                });
                innerAudioContext.onEnded((res) => {
                    this.changePlay(false)
                    this.setIndex(this.index + 1)
                    this.setPlayTime(0)
                    uni.$emit('play')
                })
                innerAudioContext.onCanplay(() => {
                    // console.log('初始时长上一个歌曲时长', innerAudioContext.duration)
                    // setTimeout(() => {
                    //     console.log('歌曲时长', innerAudioContext.duration); // 401.475918
                    // }, 200)
                })
                //监听播放时间 及 计算播放进度
                innerAudioContext.onTimeUpdate(() => {
                    // console.log(innerAudioContext.currentTime)
                    this.setPlayTime(innerAudioContext.currentTime.toFixed(0))
                })
            }
        },
        methods: {
            ...mapMutations(['changePlay', 'setIndex','empty', 'setPlayTime']),
            play() {
                if (this.playlist.length <= 0) return uni.$showMsg('请选择歌曲')
                this.changePlay(!this.isPlay)
            },
            detail(type) {
                if (this.playlist.length <= 0) return
                uni.navigateTo({
                    url: '/subpkg/playmusic/playmusic'
                })
            }
        }
    }
</script>

<style lang="scss">
    .my-play {
        position: fixed;
        bottom: 0px;
        width: 100%;
        height: 50px;
        z-index: 9;
        // animation-duration: 5s;
        /* 动画时长1s */
        // animation-fill-mode: forwards;
        /*当动画完成后，保持最后一个属性值（在最后一个关键帧中定义）*/
        // animation-iteration-count: infinite;
        /* 动画次数 无限次 */
        // animation-name: animationa;
        /* 执行动画名称 */
        // animation-timing-function: linear;
        /* 动画速度，线性匀速 */
        // background-size: 750rpx auto;
        /* 背景大小 */

        .bg {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #f5f5f5;
            height: 50rpx;
            z-index: -1;
        }

        .box {
            color: #fff;
            width: 90%;
            height: 100%;
            border-top-right-radius: 25px;
            border-bottom-right-radius: 25px;
            background: linear-gradient(to right, #395556, #747a58);
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding-right: 20rpx;
            padding-bottom: 0;

            .image {
                width: 110rpx;
                height: 110rpx;
            }

            .lyric {
                width: 50%;
                white-space: nowrap;
                overflow: hidden;
            }
        }
    }

    @keyframes animationa {

        /* 修改背景定位 */
        0% {
            background-position: 0rpx 25px;
        }

        100% {
            background-position: 750rpx 25px;
        }
    }

    .uni-popup {
        bottom: 0;

        .uni-popup__wrapper {
            width: 100%;
            height: 100vh;
            position: absolute !important;
            left: 0;
            bottom: 0;
            background-color: #000 !important;
        }
    }
</style>
