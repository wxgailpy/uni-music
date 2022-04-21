<template>
    <view style="width: 100%;height: 100%;">
        <view class="name" v-if="name">
            {{name}}
        </view>
        <swiper class="swiper" observer="true" observeParents="true" :duration="500">
            <swiper-item class="swiper-items" v-for="(item,i) in Math.floor(total/num)" :key="i">
                <view class="swiper-item" v-for="(jtem,j) in num" :key="j" @click="play(i*num+j)">
                    <view class="images">
                        <image class="image" :src="data[i*num+j].picUrl" mode=""></image>
                    </view>
                    <view class="text">
                        <view class="title">
                            {{data[i*num+j].name}}
                        </view>
                        <view class="song">
                            {{data[i*num+j].song.artists[0].name}}-{{data[i*num+j].song.album.company}}
                        </view>
                    </view>
                </view>
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
    import {
        mapMutations
    } from 'vuex'
    export default {
        name: "my-newsong",
        data() {
            return {
                // 一页显示几个
                num: 3,
            }
        },
        props: {
            data: Array,
            name: String,
            total: Number
        },
        methods: {
            ...mapMutations(['playMusic']),
            play(index) {
                this.playMusic([{
                    'id': this.data[index].id,
                    'al': {
                        'picUrl': this.data[index].picUrl
                    },
                    'name': this.data[index].name,
                    'ar': [{
                        'name': this.data[index].song.artists[0].name
                    }],
                    'dt': this.data[index].song.duration,
                    'fee': this.data[index].song.fee
                }])
            },
        }
    }
</script>

<style lang="scss">
    .swiper {
        height: 400rpx;
    }

    .swiper-items {
        width: 650rpx !important;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .swiper-item {
            display: flex;

            .images {
                margin-right: 20rpx;

                .image {
                    width: 100rpx;
                    height: 100rpx;
                    border-radius: 20rpx;
                }

            }

            .text {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-around;

                .title {
                    font-size: 14px;
                }

                .song {
                    font-size: 10px;
                    color: #666;
                }
            }
        }
    }
</style>
