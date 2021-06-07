const http = require('../../utils/httpRequest.js')

Page({
    login(e) {
        wx.login({
            success({
                code
            }) {
                wx.getUserInfo({
                    success({
                        userInfo
                    }) {
                        /**
                         * 登录逻辑
                         */

                        // 携带 code userInfo 两个参数发送异步请求
                        // success 成功则将token存在本地，并返回前一个路由；失败则将信息展示
                        // complete 隐藏 loading
                        const data = {
                            jsCode: code,
                            userInfo: userInfo
                        }
                        http.put('/api/login', data, res => {
                            if (res.data.code === 1) {
                                wx.setStorageSync('Auth-Token', res.data.value)
                                wx.navigateBack({
                                    delta: 1
                                })
                                wx.showToast({
                                    title: '登录成功',
                                })
                            } else {
                                wx.showModal({
                                    title: '登录失败',
                                    content: res.data.value,
                                    confirmColor: '#4fc08d',
                                    success: res => {
                                        wx.navigateBack({
                                            delta: 1
                                        })
                                    }
                                })
                            }
                        }, res => {
                            wx.showModal({
                                title: '网络请求失败',
                                content: res.errMsg,
                                confirmColor: '#4fc08d',
                                success: res => {
                                    wx.navigateBack({
                                        delta: 1
                                    })
                                }
                            })
                        })

                    },
                    fail() {
                        wx.showModal({
                            title: '无法登录',
                            content: '请先同意使用您的信息',
                            showCancel: false,
							confirmColor: '#4fc08d',
                            confirmText: '知道了'
                        })
                    }
                })
            }
        })
    }
})