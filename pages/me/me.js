const http = require('../../utils/httpRequest.js')

Page({
    data: {
        isLogin: false,
    },

    onShow: function() {
        // 检测是否登录
        const token = wx.getStorageSync('Auth-Token')
        if (token) this.setData({
            isLogin: true
        })
        else this.setData({
            isLogin: false
        })
    },

    tapLogin() {
        if (!this.data.isLogin) {
            wx.navigateTo({
                url: '../login/login'
            })
            return true
        }
        return false
    },

    /**
     * 点击备份
     */
    tapUpload() {
        if (!this.tapLogin()) {
            const keys = wx.getStorageInfoSync().keys
            const data = {}
            for (let index = 0; index < keys.length; index++) {
                const key = keys[index]
                const value = wx.getStorageSync(key)
                if (!isNaN(key) && value.length !== 0) data[key] = value
            }
            http.put('/api/synchronize', data, res => {
                if (res.data.code === 1) {
					wx.hideLoading()
                    wx.showToast({
                        title: '备份完成',
                    })
                }
            })

        }

    },

    /**
     * 点击恢复
     */
    tapDownload() {
        if (!this.tapLogin()) {
            http.get('/api/restore', null, res => {
                if (res.data.code === 1) {
                    const dailyMatters = res.data.value
                    for (let index = 0; index < dailyMatters.length; index++) {
                        const date = dailyMatters[index].date
                        const matters = dailyMatters[index].matters
                        if (wx.getStorageSync(date) === '') {
                            wx.setStorageSync(date, matters)
                        } else {
                            const originalMatters = wx.getStorageSync(date)
                            for (let index = 0; index < matters.length; index++) {
                                const isIncluded = originalMatters.includes(matters[index])
                                if (!isIncluded) originalMatters.push(matters[index])
                            }
                            wx.setStorageSync(date, originalMatters)
                        }
                    }
                }
                wx.showToast({
                    title: '恢复完成',
                })
            })
        }
    },

    tapAbout() {
        wx.navigateTo({
            url: '../about/about',
        })
    },

    /**
     * 点击退出登录
     */
    tapExit() {
        wx.showModal({
            title: '确定退出？',
            content: '退出后将无法使用迁移功能',
            confirmColor: '#4fc08d',
            success: res => {
                if (res.confirm) {
                    wx.removeStorageSync('Auth-Token')
                    this.setData({
                        isLogin: false
                    })
                }
            }
        })
    }
})