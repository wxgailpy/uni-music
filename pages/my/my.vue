<template>
    <view class="my">
        <view class="user">
            <image class="img" :src="user.userDetail.profile.avatarUrl" mode=""></image>
            <view class="name">{{user.userDetail.profile.nickname}}</view>
            <view class="vipType">
                {{user.userDetail.profile.vipType == 0?'您还未开通VIP':'你的VIP等级是'+user.userDetail.profile.vipType}}
            </view>
        </view>
        <view class="playlist myitems">
            <my-scroll :data="playlist" name="最近播放" type='songs' ></my-scroll>
        </view>
        
        <view class="videos myitems">
            <my-scroll :data="likeVideos" name="曾经点赞过的视频" type='video' ></my-scroll>
        </view>
        <!-- 播放 -->
        <my-play></my-play>
    </view>
</template>

<script>
    import {
        mapState,
        mapMutations,
        mapActions
    } from 'vuex'
    export default {
        data() {
            return {
                // 用户歌单
                playlist: [],
                // 点赞的视频
                likeVideos:[]
            }
        },
        onLoad() {
            this.isLogin()
            this.getsubcount()
            this.getVideos()
        },
        computed: {
            ...mapState(['user'])
        },
        methods: {
            isLogin() {
                if (!this.user.isLogin) {
                    uni.navigateTo({
                        url: '/subpkg/login/login'
                    })
                }
            },
            // 获取用户歌单
            async getsubcount() {
                if (!this.user.isLogin) return
                const {
                    data: res
                } = await uni.$http.get('/user/record', {
                    'uid': this.user.account.id,
                    'token': this.user.token,
                    'cookie': this.user.cookie
                })
                this.playlist = res.allData
            },
            // 获取用户点赞视频
            async getVideos() {
                if (!this.user.isLogin) return
                const {
                    data: res
                } = await uni.$http.get('/playlist/mylike', {
                    'token': this.user.token,
                    'cookie': this.user.cookie
                })
                this.likeVideos = res.data.feeds
            }
        }
    }
</script>

<style lang="scss">
    .my{
        padding-bottom: 50px;
    }
    .myitems{
        margin-bottom: 20rpx;
        padding: 0 10rpx;
    }
    .user {
        background: #9dc37f8f;
        height: 500rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 20rpx;
        .img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
        }

        .name {
            margin-top: 20rpx;
            margin-bottom: 20rpx;
        }
    }
</style>
