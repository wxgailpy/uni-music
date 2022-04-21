import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        // 正在播放的歌词
        lyric: uni.getStorageSync('lyric') || [],
        // 播放列表
        playlist: uni.getStorageSync('playlist') || [],
        // 是否在播放
        isPlay: false,
        // 播放索引
        index: 0,
        // 播放时间
        playTime: 0,
        user: uni.getStorageSync('userData') || {
            // user: {
            // 是否登录
            isLogin: false,
            account: {},
            userDetail: {},
            token: '',
            cookie: ''
        }
    },
    mutations: {
        // 修改歌词
        setLyric(state, value) {
            state.lyric = value
            // 保存到本地
            uni.setStorageSync('lyric', state.lyric);
        },
        // 修改是否正在播放
        changePlay(state, value) {
            state.isPlay = value
            // console.log(state.isPlay)
        },
        // 添加播放列表
        addPlaylist(state, value) {
            if (value.fee == 1 || value.fee == 4) {
                uni.$showMsg('这是vip歌曲，无法播放')
                return
            }
            uni.$showMsg('歌曲将在下一首播放')
            let data = {
                'id': value.id,
                'img': value.al.picUrl,
                'name': value.name,
                'song': value.ar[0].name,
                'time': value.dt
            }
            state.playlist.splice(state.index + 1, 0, data); //添加在当前播放音乐的后面 下一个就播放这个音乐
            // 去重
            // state.playlist = [...new Set(state.playlist)]
            // const res = new Map()
            // state.playlist.filter((a) => {
            //     !res.has(a) && res.set(a, 1)
            // })
            for (var i = 0; i < state.playlist.length; i++) {
                for (var j = i + 1; j < state.playlist.length; j++) {
                    if (state.playlist[i].id == state.playlist[j].id) { //第一个等同于第二个，splice方法删除第二个
                        state.playlist.splice(j, 1);
                        j--;
                    }
                }
            }
            console.log(state.playlist)
            // 保存到本地
            uni.setStorageSync('playlist', state.playlist);
            if (!state.isPlay) uni.$emit('play')
        },
        // 修改播放歌曲当前索引
        setIndex(state, value) {
            if (value >= state.playlist.length) value = 0
            if (value < 0) value = state.playlist.length - 1
            state.index = value
        },
        // 修改歌曲进度时间
        setPlayTime(state, value) {
            state.playTime = value
        },
        // 修改登录状态
        setIsLogin(state, value) {
            state.user.isLogin = value
        },
        // 登录修改用户信息
        setUserDetail(state, value) {
            state.user.userDetail = value
        },
        setUser(state, value) {
            state.user = value
        },
        // 设置播放列表
        playMusic(state, value) {
            if (value.length > 1) {
                uni.$showMsg('vip，付费歌曲将会自动过滤')
                let goods = []
                for (let i = 0; i < value.length; i++) {
                    // vip 付费歌曲跳过
                    if (value[i].fee == 1 || value[i].fee == 4) continue
                    goods.push({
                        'id': value[i].id,
                        'img': value[i].al.picUrl,
                        'name': value[i].name,
                        'song': value[i].ar[0].name,
                        'time': value[i].dt
                    })
                }
                state.playlist = goods
                console.log(state.playlist)
            } else {
                if (value[0].fee == 1 || value[0].fee == 4) {
                    uni.$showMsg('这是vip歌曲，无法播放')
                    return
                }
                state.playlist = [{
                    'id': value[0].id,
                    'img': value[0].al.picUrl,
                    'name': value[0].name,
                    'song': value[0].ar[0].name,
                    'time': value[0].dt
                }]
            }
            this.commit('setIndex', 0)
            uni.$emit('play')
            // 保存到本地
            uni.setStorageSync('playlist', state.playlist);
        },
        // 清空播放列表
        empty(state) {
            state.playlist = []
            // 保存到本地
            uni.setStorageSync('playlist', state.playlist);
        }
    },
    actions: {
        // 手机号登录
        async phoneLogin(content, payload) {
            const res = await uni.$http.get('/login/cellphone', {
                phone: payload.phone,
                password: payload.password,
            })
            console.log(res)
            if (res.data.code == 200) {
                content.commit('setIsLogin', true)
                content.state.user.account = res.data.account
                content.state.user.token = res.data.token
                content.state.user.cookie = res.data.cookie
                const userDetail = await uni.$http.get('/user/detail', {
                    uid: res.data.account.id
                })
                content.commit('setUserDetail', userDetail.data)
                // 保存到本地
                uni.setStorageSync('userData', content.state.user);
                content.commit('setUser', content.state.user)
                uni.$showMsg('登录成功')
                uni.navigateBack({
                    delta: 1
                });
            }
        },
        // 手机号注册
        async cellphone(content, payload) {
            const res = await uni.$http.get('/register/cellphone', {
                phone: payload.phone,
                password: payload.password,
                nickname: payload.nickname,
                captcha: payload.captcha
            })
            console.log(res)
            if (res.data.code == 200) {
                this.dispatch('phoneLogin', {
                    'phone': payload.phone,
                    'password': payload.password
                })
            } else {
                uni.$showMsg(res.data.message)
            }
        },
        // 验证码校验
        async verify(content, payload) {
            const res = await uni.$http.get('/captcha/verify', {
                phone: payload.phone,
                captcha: payload.captcha
            })
            if (res.data.code == 200) {
                this.dispatch('cellphone', {
                    'phone': payload.phone,
                    'password': payload.password,
                    'captcha': payload.captcha,
                    'nickname': payload.name
                })
            } else {
                uni.$showMsg(res.data.message)
            }
        }
    },
    getters: {

    }
})
export default store
