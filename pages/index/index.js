import initCalendar, {
    setTodoLabels,
    clearTodoLabels
} from '../../components/calendar/main.js'
import {
    convertDateToObj,
    convertObjToDate,
    formatDate
} from '../../utils/date.js'

Page({
    data: {
        showInput: false,
        currentSelectDay: convertDateToObj(formatDate(new Date)),
        displayAreaTodolist: [],
        successMessage: '', // 成功提示的内容，不要超过11个中文字，因为提示框宽度的固定的
        animations: {
            addBtn: {},
            input: {},
            todolist: {},
            successMessage: {}
        }
    },

    onShow() {
        let angle = 90

        // 初始化日历配置
        initCalendar({
            afterTapDay: (currentSelectDay) => {
                const key = convertObjToDate(currentSelectDay)
                const list = wx.getStorageSync(key)
                this.setData({
                    currentSelectDay: currentSelectDay,
                    showInput: false
                })

                setTimeout(() => {
                    this.setData({
                        displayAreaTodolist: list
                    })
                }, 100)

                // 按钮动画，旋转
                const btnAnimation = wx.createAnimation({
                    timingFunction: 'ease-in-out',
                    duration: 300
                })
                btnAnimation.rotate(angle).backgroundColor('#33a1fc').step()
                btnAnimation.backgroundColor('#64b5f6').step()
                angle += 90

                const animations = this.data.animations
                animations.addBtn = btnAnimation.export()
                this.setData({
                    animations: animations
                })

                // 输入框动画，宽度回到0，等待下一次展开
                const inputAnimation = wx.createAnimation({
                    duration: 1,
                    timingFunction: 'step-start'
                })
                inputAnimation.width('0rpx').step()

                const _animations = this.data.animations
                _animations.input = inputAnimation.export()
                this.setData({
                    animations: _animations
                })

                // todolist 动画
                const todolistAnimation = wx.createAnimation({
                    timingFunction: 'ease-out',
                    duration: 100
                })
                todolistAnimation.opacity(0).step()

                const animations_ = this.data.animations
                animations_.todolist = todolistAnimation.export()
                this.setData({
                    animations: animations_
                })

                setTimeout(() => {
                    const todolistAnimation = wx.createAnimation({
                        timingFunction: 'ease-in',
                        duration: 200
                    })
                    todolistAnimation.opacity(1).step()
                    const _animations_ = this.data.animations
                    _animations_.todolist = todolistAnimation.export()
                    this.setData({
                        animations: _animations_
                    })
                }, 100)

            }
        })

        this.refreshTododays()
    },

    onReady() {
        this.refreshTododays()
        // 展示当天待办
        const key = formatDate(new Date)
        const list = wx.getStorageSync(key)
        this.setData({
            displayAreaTodolist: list
        })
    },

    /**
     * 事件处理器 点击添加按钮
     */
    showInput() {
        this.setData({
            showInput: true
        })

        const inputAnimation = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        })
        inputAnimation.width('500rpx').step()
        const animations = this.data.animations
        animations.input = inputAnimation.export()
        this.setData({
            animations: animations
        })
    },

    /**
     * 事件处理器 输入新安排完成
     */
    confirmInput(e) {
        this.todolistAdd(e.detail.value)
        this.setData({
            showInput: false,
        })

        this.successMessage('千里之行 始于足下 🏃🏻‍')
    },

    /**
     * 事件处理器 点击删除安排按钮
     */
    tapDelete(e) {
        const key = convertObjToDate(this.data.currentSelectDay);
        const todolist = wx.getStorageSync(key)
        const index = e.target.dataset.index

        todolist.splice(index, 1)
        // 更新存储
        wx.setStorageSync(key, todolist)
        // 更新页面属性
        this.setData({
            displayAreaTodolist: todolist, // todolist展示区
        })
        // 刷新小红点
        this.refreshTododays()

        // 删除成功提示
        const fruits = ['🍎', '🍌', '🍊', '🍉', '🍓', '🍇', '🍐', '🍍', '🥝', '🥥', '🍒'];
        const fruitIndex = Math.round(Math.random() * 10)
        this.successMessage('完成一件事 奖励一个果 ' + fruits[fruitIndex])
    },

    /**
     * 添加待办事项
     */
    todolistAdd(str) {
        let key
        if (Object.getOwnPropertyNames(this.data.currentSelectDay).length === 0) {
            key = formatDate(new Date)
        } else {
            key = convertObjToDate(this.data.currentSelectDay)
        }
        let currentSelectDayTodoList = wx.getStorageSync(key)
        if (!currentSelectDayTodoList) {
            currentSelectDayTodoList = []
        }
        currentSelectDayTodoList.push(str)
        wx.setStorageSync(key, currentSelectDayTodoList)

        // 更新展示区
        this.setData({
            displayAreaTodolist: currentSelectDayTodoList
        })
        // 更新小红点
        this.refreshTododays()
    },

    /**
     * 刷新小红点标注
     */
    refreshTododays() {
        wx.getStorageInfo({
            success: function(res) {
                clearTodoLabels()
                const keys = res.keys
                const days = []
                for (let index = 0; index < keys.length; index++) {
                    if (wx.getStorageSync(keys[index]).length !== 0) {
                        days.push(convertDateToObj(keys[index]))
                    }
                }
                setTodoLabels({
                    days: days
                })
            }
        })
    },

    /**
     * 展示成功提示
     */
    successMessage(message) {
        this.setData({
            successMessage: message
        })

        // 成功提示 出场动画
        const successAnimation = wx.createAnimation({
            timingFunction: 'ease-in-out',
            duration: 700
        })
        successAnimation.top('20rpx').step()

        const animations = this.data.animations
        animations.successMessage = successAnimation.export()
        this.setData({
            animations: animations
        })

        // 成功提示 回场动画
        setTimeout(() => {
            successAnimation.top('-110rpx').step()
            const animations = this.data.animations
            animations.successMessage = successAnimation.export()
            this.setData({
                animations: animations
            })
        }, 3000)
    },
})