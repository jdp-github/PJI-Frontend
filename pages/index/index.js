"use strict";

const app = getApp();
var constant = require('../../utils/constant.js');

Page({
    data: {
        searchValue: '',
        centerList: [],
        centerTempList: [], // 存储中心列表，取消搜索时恢复数据用
        visibleCenter: false,
        centerName: ''
    },

    onLoad: function() {
        this.initData()
    },

    initData() {
        wx.showLoading({
            title: '请求数据中...',
        })
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.GetStaffCenterList',
                openid: app.globalData.openid
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                // console.log(JSON.stringify(res))
                wx.hideLoading()
                that.setData({
                    centerList: res.data.data.list,
                    centerTempList: res.data.data.list
                })
            },
            fail(res) {
                wx.hideLoading()
            }
        })
    },

    // 点击人员
    onStaffClick(e) {
        wx.navigateTo({
            url: '/people/people?centerId=' + e.target.dataset.centerId
        })
    },

    // 点击病历
    onRecordClick(e) {},

    // ------------------ search begin ------------------ //
    onSearchChange(e) {
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
                // console.log(JSON.stringify(res))
                wx.hideLoading()
                that.setData({
                    centerList: res.data.data.list
                })
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
    onSearchCancel(e) {},
    // ------------------ search end ------------------ //

    // ------------------ add begin ------------------ //
    addCenter(e) {
        this.setData({
            visibleCenter: true,
        });
    },
    okAddCenter() {
        var that = this;
        if (that.data.centerName.length == 0) {
            wx.showToast({
                title: '请输入中心名',
            })
            return
        }
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
                // console.log(JSON.stringify(res))
                wx.hideLoading()
                that.initData()
            },
            fail(res) {
                wx.hideLoading()
            }
        })
    },
    onCenterClose(e) {},
    closeCenter(e) {
        this.setData({
            visibleCenter: false,
        })
    },
    // ------------------ add end ------------------ //
});