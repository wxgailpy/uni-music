<template>
    <view class="square">
        <my-mvs ref="myMvs"></my-mvs>
    </view>
</template>

<script>
    export default {
        data() {
            return {

            };
        },
        // 触底的事件
        onReachBottom() {
            this.$refs.myMvs.bottom()
        },
    }
</script>

<style lang="scss">
    .mv {
        padding-left: 8rpx;
    }
</style>
