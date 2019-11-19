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

        tabList: ["要素速览", "诊疗日历"],
        currTab: 0,
        scrollLeft: 0,

        caseInfo: '',
        timeLineList: [],
        typePicker: ["基本信息", "穿刺信息", "入院后信息", "用药方案", "复诊随访"]
    },

    onLoad: function(options) {
        this.setData({
            caseInfo: JSON.parse(options.caseInfo),
            centerId: options.centerId,
            centerName: options.centerName,
            isAdmin: app.globalData.is_admin == '1'
        });
        this.initData()
    },

    initData() {
        this.loadProgress();
        this.requestTimeLine();
    },

    requestTimeLine: function() {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.Timeline',
                openid: app.globalData.openid,
                case_no: that.data.caseInfo.case_no,
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.Timeline:" + JSON.stringify(res))
                if (res.data.data.code == constant.response_success) {
                    for (let i = 0, len = res.data.data.list.length; i < len; i++) {
                        let timeLineInfo = res.data.data.list[i];
                        timeLineInfo.time = timeLineInfo.time.split(" ")[0]
                        timeLineInfo.typeName = that.data.typePicker[timeLineInfo.type - 1]
                    }

                    that.setData({
                        timeLineList: res.data.data.list
                    });
                } else {
                    that.showToast(res.data.msg);
                }
                that.completeProgress();
            },
            fail(res) {
                that.completeProgress();
                that.showToast(res.data.msg);
            }
        });
    },

    onItemClick(e) {
        let item = e.currentTarget.dataset.item
        if (item.type == 1) { // 基本信息
            wx.navigateTo({
                url: '../base/base?centerId=' + this.data.centerId + "&centerName=" + this.data.centerName + "&caseId=" + this.data.caseInfo.case_id + "&isCreate=" + false
            });
        } else if (item.type == 2) { // 穿刺
            wx.navigateTo({
                url: '../chuanci/chuanci?centerId=' + this.data.centerId + "&centerName=" + this.data.centerName + "&caseId=" + this.data.caseInfo.case_id + "&isCreate=" + false
            });
        } else if (item.type == 3) { // 手术
            wx.navigateTo({
                url: '../shoushu/shoushu?centerId=' + this.data.centerId + "&centerName=" + this.data.centerName + "&caseId=" + this.data.caseInfo.case_id + "&isCreate=" + false
            });
        } else if (item.type == 5) { // 随访

        }
    },

    onPuncture() {
        wx.navigateTo({
            url: '../chuanci/chuanci?centerId=' + this.data.centerId + "&centerName=" + this.data.centerName + "&caseId=" + this.data.caseInfo.case_id + "&isCreate=" + true
        });
    },

    onShouShu() {
        wx.navigateTo({
            url: '../shoushu/shoushu?centerId=' + this.data.centerId + "&centerName=" + this.data.centerName + "&caseId=" + this.data.caseInfo.case_id
        });
    },

    // ============ 事件 begin ============ //
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
    showModal: function(modalName, msg = '') {
        this.setData({
            modalName: modalName,
            errMsg: msg
        });
    },
    hideModal: function(e) {
        this.setData({
            modalName: null
        });
    },
    onRefresh: function(e) {
        this.initData()
    },

    // ============ 事件 end ============ //
});