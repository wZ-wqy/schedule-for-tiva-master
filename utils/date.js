const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**
 * 获取当前年月日，格式入20190514
 */
const formatDate = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].map(formatNumber).join('')
}

/**
 * 获取当前年月，例如：201905
 */
const formatYearMonth = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    return [year, month].map(formatNumber).join('')
}

/**
 * 将年月日数字转化为对象
 */
const convertDateToObj = dateStr => {
    return {
        year: dateStr.slice(0, 4),
        month: dateStr.slice(4, 6),
        day: dateStr.slice(6)
    }
}

/**
 * 将对象转化为年月日数字
 */
const convertObjToDate = obj => {
    return [obj.year, obj.month, obj.day].map(formatNumber).join('')
}

module.exports = {
    formatDate,
    formatNumber,
    formatYearMonth,
    convertDateToObj,
    convertObjToDate,
    formatTime
}