<template>
    <view>
        <view class="login" v-if="!user.isLogin">
            <view class="title">
                用户{{title}}
            </view>
            <view class="form">
                <uni-forms ref="form" :modelValue="formData" :rules="rules" validate-trigger="bind">
                    <uni-forms-item left-icon="person" name="name" v-if="title == '注册'">
                        <!-- uni-easyinput 的校验时机是数据发生变化， 即触发 input 时 -->
                        <uni-easyinput v-model="formData.name" type="name" placeholder="请输入昵称" />
                    </uni-forms-item>
                    <uni-forms-item left-icon="phone" name="phone" class="phone">
                        <!-- uni-easyinput 的校验时机是数据发生变化， 即触发 input 时 -->
                        <uni-easyinput v-model="formData.phone" type="phone" placeholder="请输入手机号" />
                        <button class="button btn1" :disabled="isCaptcha" size="mini" @click="captcha"
                            v-if="title == '注册'">{{isCaptcha == true ? time+'秒':'发送'}}</button>
                    </uni-forms-item>
                    <uni-forms-item left-icon="tune" name="numbers" class="numbers" v-if="title == '注册'">
                        <!-- uni-easyinput 的校验时机是数据发生变化， 即触发 input 时 -->
                        <uni-easyinput v-model="formData.numbers" type="numbers" placeholder="请输入验证码" />
                    </uni-forms-item>
                    <uni-forms-item left-icon="locked-filled" name="password">
                        <!-- input 的校验时机是触发 binddata 时， 即触发 blur 时 -->
                        <uni-easyinput v-model="formData.password" type="password" placeholder="请输入密码"
                            @input="binddata('password',$event.detail.value)" />
                    </uni-forms-item>
                </uni-forms>

                <view class="btns">
                    <button class="button" @click="submit">{{title}}</button>

                    <button class="button" @click="changeTile('登录')" v-if="title == '注册'">已有账号，登录</button>
                    <button class="button" @click="changeTile('注册')" v-else>没有账号，注册</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {
        mapState,
        mapActions
    } from 'vuex'
    export default {
        data() {
            return {
                formData: {
                    name: '',
                    phone: '',
                    password: '',
                    numbers: ''
                },
                rules: {
                    // 对name字段进行必填验证
                    name: {
                        rules: [{
                                required: true,
                                errorMessage: '请输入昵称',
                            },
                            {
                                minLength: 2,
                                maxLength: 12,
                                errorMessage: '昵称为{minLength} - {maxLength}个字符',
                            }
                        ]
                    },
                    phone: {
                        rules: [{
                                required: true,
                                errorMessage: '请输入手机号',
                            },
                            {
                                minLength: 11,
                                maxLength: 11,
                                errorMessage: '手机号为11个字符',
                            }
                        ]
                    },
                    password: {
                        rules: [{
                                required: true,
                                errorMessage: '请输入密码',
                            },
                            {
                                minLength: 6,
                                maxLength: 16,
                                errorMessage: '密码长度在 {minLength} 到 {maxLength} 个字符'
                            }
                        ]
                    },
                    numbers: {
                        rules: [{
                                required: true,
                                errorMessage: '请输入验证码',
                            },
                            {
                                format: 'number',
                                errorMessage: '验证码只能输入数字'
                            }
                        ]
                    }
                },
                title: '登录',
                // 定时器
                time: 60,
                // 是否发送验证码
                isCaptcha: false
            }
        },
        onReady() {
            // 需要在onReady中设置规则
            this.$refs.form.setRules(this.rules)
        },
        computed: {
            ...mapState(['user'])
        },
        methods: {
            ...mapActions(['phoneLogin','verify']),
            submit() {
                if(this.title == '登录'){
                    this.$refs.form.validate().then(res => {
                        this.phoneLogin({
                            'phone': res.phone,
                            'password': res.password
                        })
                    
                    }).catch(err => {
                        uni.$showMsg(err)
                    })
                }
                else{
                    this.$refs.form.validate().then(res => {
                        this.verify({
                            'phone': res.phone,
                            'password': res.password,
                            'captcha':res.numbers,
                            'nickname':res.name
                        })
                    
                    }).catch(err => {
                        uni.$showMsg(err)
                    })
                }
                

            },
            changeTile(value) {
                this.title = value
            },
            async captcha() {
                var timer
                let _self = this
                _self.isCaptcha = true
                const {
                    data: res
                } = await uni.$http.get(`/captcha/sent?phone=${this.formData.phone}`)
                if (res) return uni.$showMsg('发送成功')
                // console.log(res)
                timer = setInterval(function() {
                    _self.time -= 1
                    if (_self.time == 0) {
                        clearInterval(timer)
                        _self.time = 60
                        _self.isCaptcha = false
                    }
                    console.log(_self.isCaptcha)
                }, 1000)

            }

        }
    }
</script>

<style lang="scss">
    .login {
        width: 80%;
        margin: 0 auto;

        .title {
            font-size: 32px;
            margin-top: 20rpx;
            margin-bottom: 40rpx;
            text-align: center;
        }

        .btns {
            display: flex;
            justify-content: space-around;

            .button {
                margin: 0;
            }
        }

        .phone {
            position: relative;

            .btn1 {
                position: absolute;
                right: 0;
                top: 0;
                height: 36px;
                line-height: 36px;
                z-index: 9;
                border-radius: 3px;
            }
        }

    }
</style>
