'use strict';

let constant = require('../../../../utils/constant.js');
let util = require('../../../../utils/util.js');

const app = getApp();

Page({
    data: {
        loadProgress: 0,
        loadModal: false,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        // -------- modal begin ----------- //
        modalName: '',
        errMsg: '',
        // -------- modal end ------------- //

        memberId: '',
        info: {},
        roleId: '',
        roleList: [],
    },

    // -------- 提示框 begin -------- //
    loadProgress: function() {
        if (this.data.loadProgress < 96) {
            this.setData({
                loadProgress: this.data.loadProgress + 3
            });
        }
        if (this.data.loadProgress < 100) {
            setTimeout(() => {
                this.loadProgress();
            }, 100);
        } else {
            this.setData({
                loadProgress: 0
            });
        }
    },
    completeProgress: function() {
        this.setData({
            loadProgress: 100
        });
    },
    showToast: function(msg) {
        wx.showToast({
            icon: 'none',
            title: msg,
        });
    },
    showLoading: function() {
        this.setData({
            loadModal: true
        });
    },
    hideLoading: function() {
        setTimeout(() => {
            this.setData({
                loadModal: false
            });
        }, 1500);
    },
    // -------- 提示框 end -------- //

    // -------- 模态对话框 start -------- //
    showModal: function(e, errMessage = '') {
        if (e.currentTarget) {
            this.setData({
                modalName: e.currentTarget.dataset.target
            });
        } else {
            this.setData({
                modalName: e,
                errMsg: errMessage
            });
        }
    },
    hideModal: function(e) {
        this.setData({
            modalName: null
        });
    },
    // -------- 模态对话框 end  -------- //

    onLoad: function(options) {
        this.loadProgress();
        this.setData({
            isAdmin: app.globalData.is_admin == '1',
            memberId: options.memberId,
        });
        this.requestRoleList()
        this.requestInfo()
        this.completeProgress();
    },

    onCall(e) {
        wx.makePhoneCall({
            phoneNumber: '13898199268',
            success() {},
            fail() {}
        })
    },

    onCopy(e) {
        wx.setClipboardData({
            //准备复制的数据
            data: "123321",
            success: function(res) {
                wx.showToast({
                    title: '复制成功',
                });
            }
        });
    },

    onEditRole(e) {
        this.setData({
            modalName: "EditRole",
            roleId: '',
        });
    },

    onRoleChange: function(e) {
        this.setData({
            roleId: e.detail.value
        });
    },

    requestInfo() {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.GetMemberInfo',
                member_id: that.data.memberId
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Center.GetMemberInfo:" + JSON.stringify(res))
                if (res.data.data.code == constant.response_success) {
                    that.setData({
                        info: res.data.data.info,
                    });
                } else {
                    that.showToast(res.data.msg);
                }
            },
            fail(res) {}
        });
    },

    requestRoleList: function() {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.GetCenterRole'
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Center.GetCenterRole:" + JSON.stringify(res))
                if (res.data.data.code == constant.response_success) {
                    that.setData({
                        roleList: res.data.data.list,
                    });
                } else {
                    that.showToast(res.data.msg);
                }
            },
            fail(res) {}
        });
    },
    editMember: function(e) {
        let that = this;
        that.loadProgress();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.EditCenterMember',
                openid: app.globalData.openid,
                member_id: that.data.memberId,
                role_id: this.data.roleId
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.completeProgress();
                if (res.data.data.code == constant.response_success) {
                    that.requestInfo();
                } else {
                    that.showToast(res.data.data.msg);
                }
                that.setData({
                    modalName: ''
                });
            },
            fail(res) {
                that.completeProgress();
            }
        });
    },
});