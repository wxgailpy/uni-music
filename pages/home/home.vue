<template>
    <view class="boxs">
        <!-- 搜索 -->
        <my-search @clickSearch="gotoSearch"></my-search>
        <!-- 轮播图 -->
        <view class="banners boxsitem">
            <swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500"
                indicator-color="#cccccc" circular="true">
                <swiper-item class="swiper-items" v-for="(item,i) in banners" @click="banner(item.bannerId)" :key="i">
                    <view class="swiper-item">
                        <image class="image" :src="item.pic" mode=""></image>
                    </view>
                </swiper-item>
            </swiper>
        </view>

        <!-- 推荐歌单 -->
        <view class="my-scroll boxsitem" v-if="personalized">
            <my-scroll :data="personalized" name="推荐今日专属歌单" :hidden="true"></my-scroll>
        </view>

        <!-- 推荐音乐 -->
        <view class="newsong boxsitem" v-if="newsong">
            <my-newsong :data="newsong" :total="total" name="听见另外一种声音"></my-newsong>
        </view>

        <!-- 推荐电台 -->
        <view class="my-scroll boxsitem" v-if="djprogram">
            <my-scroll :data="djprogram" name="最热门的电台节目"></my-scroll>
        </view>

        <!-- 播放 -->
        <my-play></my-play>

        <!-- 更多为你推荐 -->
        <view class="my-mvs boxsitem">
            <my-mvs ref="myMvs" name="更多为你推荐"></my-mvs>
        </view>
    </view>
</template>

<script>
    import {
        mapMutations,
        mapState
    } from 'vuex'
    export default {
        data() {
            return {
                // 轮播图
                banners: [],
                // 歌单
                personalized: [],
                // 新音乐
                newsong: [],
                // 当前索引
                current: 0,
                // 总数
                total: 18,
                // 电台
                djprogram: [],

            };
        },
        created() {
            this.getBanner()
            this.getPersonaLized()
            this.getNewSong()
            this.getDjprogram()

        },
        computed: {
            ...mapState(['isPlay'])
        },
        methods: {
            ...mapMutations(['changePlay', 'addPlaylist', 'setPlaylist']),
            async getBanner() {
                const {
                    data: res
                } = await uni.$http.get('/banner?type=1')
                this.banners = res.banners
            },
            async getPersonaLized() {
                const {
                    data: res
                } = await uni.$http.get('/personalized?limit=10')
                this.personalized = res.result
            },
            async getNewSong() {
                const {
                    data: res
                } = await uni.$http.get(`/personalized/newsong?limit=${this.total}`)
                this.newsong = res.result
                this.total = this.newsong.length
            },
            async getDjprogram() {
                const {
                    data: res
                } = await uni.$http.get('/personalized/personalized/djprogram')
                this.djprogram = res.result.slice(10)
            },

            gotoSearch() {
                uni.navigateTo({
                    url: '/subpkg/search/search'
                })
            },
            banner(id) {
                uni.$showMsg('请登录')
            }

        },

        // 触底的事件
        onReachBottom() {
            this.$refs.myMvs.bottom()
        }
    }
</script>

<style lang="scss">
    .box {
        padding-bottom: 50px;
    }

    .boxs .boxsitem {
        margin-bottom: 20rpx;
        padding: 0 10rpx;
    }

    .name {
        font-weight: 500;
        margin-bottom: 10px;
    }

    .banners {
        .swiper {
            height: 330rpx;

            .swiper-items {
                border-radius: 10rpx;

                image {
                    width: 100%;
                    height: 330rpx;
                }
            }
        }
    }
</style>
