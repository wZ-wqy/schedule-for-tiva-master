const domain = 'http://192.168.31.43:5800' // 开发测试用局域网 IP，请根据需要修改

const http = {
    get: function(url, data, success, fail) {
        request('GET', url, data, success, fail)
    },
    put: function(url, data, success, fail) {
        request('PUT', url, data, success, fail)
    }
}

function request(method, url, data, success, fail) {
    wx.showLoading({
        title: '',
    })
    if (fail === null || fail === undefined) {
        fail = function(res) {
            wx.showModal({
                title: '网络请求失败',
                content: res.errMsg,
                confirmColor: '#4fc08d'
            })
        }
    }
    wx.request({
        header: {
            'Auth-Token': wx.getStorageSync('Auth-Token')
        },
        method,
        url: domain + url,
        data,
        success,
        fail,
        complete() {
            setTimeout(() => {
                wx.hideLoading()
				wx.hideToast()
            }, 3000)
        }
    })
}

module.exports = http