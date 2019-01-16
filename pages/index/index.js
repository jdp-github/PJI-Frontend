"use strict";

const app = getApp();
var constant = require('../../utils/constant.js');
var util = require('../../utils/util.js');

Page({
    data: {
        isAdmin: false,
        searchValue: '',
        centerList: [],
        centerTempList: [], // 存储中心列表，取消搜索时恢复数据用
        visibleCenter: false,
        centerName: ''
    },

    onLoad: function() {
        this.setData({
            isAdmin: app.globalData.is_admin == '1'
        })
        this.initData()
    },

    initData() {
        var that = this
        wx.showLoading({
            title: '请求数据中...',
        })
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.SearchStaffCenter',
                openid: app.globalData.openid
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Center.SearchStaffCenter:" + JSON.stringify(res))
                wx.hideLoading()
                if (res.data.data.code == constant.response_success) {
                    for (var i = 0, len = res.data.data.list.length; i < len; i++) {
                        var center = res.data.data.list[i]
                        if (center.center_ctime != null) {
                            center.center_ctime = util.formatTime(center.center_ctime, 'Y-M-D')
                        }
                        if (center.center_leader == null) {
                            center.center_leader = '暂无'
                        }
                    }
                    that.setData({
                        centerList: res.data.data.list,
                        centerTempList: res.data.data.list
                    })
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: res.data.data.msg
                    })
                }
            },
            fail(res) {
                wx.hideLoading()
            }
        })
    },

    // 点击人员
    onStaffClick(e) {
        // console.log(e)
        wx.navigateTo({
            url: '../index/people/people?centerId=' + e.target.dataset.centerid
        })
    },

    // 点击病历
    onRecordClick(e) {
        // console.log(e)
        wx.navigateTo({
            url: '../case/case?centerId=' + e.target.dataset.centerid
        })
    },

    // ------------------ search begin ------------------ //
    onSearchChange(e) {
        var that = this
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.SearchStaffCenter',
                openid: app.globalData.openid,
                keyword: e.detail.value
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Center.SearchStaffCenter:" + JSON.stringify(res))
                wx.hideLoading()
                if (res.data.data.code == constant.response_success) {
                    for (var i = 0, len = res.data.data.list.length; i < len; i++) {
                        var center = res.data.data.list[i]
                        if (center.center_ctime != null) {
                            center.center_ctime = util.formatTime(center.center_ctime, 'Y-M-D')
                        }
                        if (center.center_leader == null) {
                            center.center_leader = '暂无'
                        }
                    }
                    that.setData({
                        centerList: res.data.data.list
                    })

                } else {
                    wx.showToast({
                        icon: 'none',
                        title: res.data.data.msg,
                    })
                }
            },
            fail(res) {
                // wx.hideLoading()
            }
        })
    },
    onSearchFocus(e) {},
    onSearchBlur(e) {},
    onSearchConfirm(e) {},
    onSearchClear(e) {
        this.setData({
            centerList: this.data.centerTempList
        })
    },
    onSearchCancel(e) {
        this.onSearchClear()
    },
    // ------------------ search end ------------------ //

    // ------------------ add begin ------------------ //
    addCenter(e) {
        this.setData({
            visibleCenter: true,
        });
    },
    onCenterNameChange(e) {
        this.setData({
            centerName: e.detail.value,
        })
    },
    onCenterNameClear() {
        this.setData({
            name: '',
        })
    },
    okAddCenter() {
        var that = this;
        if (that.data.centerName.length == 0) {
            wx.showToast({
                icon: 'none',
                title: '请输入中心名',
            })
            return
        }
        this.setData({
            visibleCenter: false
        })
        wx.showLoading({
            title: '新增中心...',
        })
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.CreateCenter',
                openid: app.globalData.openid,
                center_name: that.data.centerName
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Center.CreateCenter:" + JSON.stringify(res))
                wx.hideLoading()
                if (res.data.data.code == constant.response_success) {
                    that.initData()
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: res.data.data.msg,
                    })
                }
            },
            fail(res) {
                wx.hideLoading()
            }
        })
    },
    onCenterClose(e) {
        this.setData({
            centerName: ''
        })
    },
    closeCenter(e) {
        this.setData({
            visibleCenter: false
        })
    },
    // ------------------ add end ------------------ //
});