import {
    formatDate,
    formatNumber
} from 'utils/date.js'

App({
    onLaunch() {
        // 清除30天之前的待办，避免10M的存储空间被占满
        wx.getStorageInfo({
            success: function(res) {
                const keys = res.keys

                const date = new Date
                const currentYear = date.getFullYear()
                const currentMonth = date.getMonth() + 1
                const currentDay = date.getDate()

                let year, month, day = formatNumber(currentDay) // 期限，该日期之前的 key 都清除
                if (currentMonth > 1) {
                    year = formatNumber(currentYear)
                    month = formatNumber(currentMonth - 1)
                } else {
                    year = formatNumber(currentYear - 1)
                    month = '12'
                }
                const limit = year + month + day

                for (let index = 0; index < keys.length; index++) {
                    const date = keys[index]
                    if (date < limit) {
                        wx.removeStorage({
                            key: date,
                            success: function(res) {
                                console.log(res)
                            },
                        })
                    }
                }
            },
        })
    }
})