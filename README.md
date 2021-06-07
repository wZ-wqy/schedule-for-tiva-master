# schedule-for-tiva
> 为 Tiva 量身定制的每日事务管理微信小程序

## 功能
根据日历来制定每天的事务安排，并支持设备数据迁移/备份。

## 要点
1. 利用微信提供的开发能力 API 实现微信登录（后端配合），保存用户登录状态。
2. 利用微信 API 实现提示信息、按钮、输入框和 view 容器的动画效果。
3. 利用微信提供的本地存储 API 进行保存每日的计划安排。
4. 在 App `onLaunch` 生命周期来清除 30 天之前的本地存储。
5. 使用 `movable-area` 和 `movable-view` 基础组件实现左划删除功能。

## 依赖
日历插件来自：[treadpit/wx_calendar](https://github.com/treadpit/wx_calendar)