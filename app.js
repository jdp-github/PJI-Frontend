"use strict";
App({
    onLaunch: function () {
        wx.getSystemInfo({
            success: e => {
                this.globalData.StatusBar = e.statusBarHeight;
                let custom = wx.getMenuButtonBoundingClientRect();
                this.globalData.Custom = custom;
                this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
            }
        });
    },
    globalData: {
        is_admin: '', // 管理员flag 0否，1是
        openid: '',
        avatarUrl: '',
        Custom: '',
        CustomBar: '',
        StatusBar: '',
    }
});