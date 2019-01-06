"use strict";

const app = getApp();
var constant = require('../../utils/constant.js');

Page({
    data: {
        searchValue: '',
        centerList: [],
        visibleCenter: false
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

            },
            fail(res) {
                wx.hideLoading()
            }
        })
    },

    // ------------------ search begin ------------------ //
    onSearchChange(e) {
        this.setData({
            value: e.detail.value,
        });
    },
    onSearchFocus(e) {},
    onSearchBlur(e) {},
    onSearchConfirm(e) {},
    onSearchClear(e) {
        this.setData({
            searchValue: '',
        });
    },
    onSearchCancel(e) {},
    // ------------------ search end ------------------ //

    // ------------------ add begin ------------------ //
    addCenter(e) {
        this.setData({
            visibleCenter: true,
        });
    },
    onCenterClose(e) {},
    closeCenter(e) {
        this.setData({
            visibleCenter: false,
        })
    },
    // ------------------ add end ------------------ //
});