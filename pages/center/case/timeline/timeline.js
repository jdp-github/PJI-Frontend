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
    },

    onLoad: function(options) {
        this.setData({
            centerId: options.centerId,
            centerName: options.centerName,
            isAdmin: app.globalData.is_admin == '1'
        });
        // this.initData()
    },

    initData() {
        this.loadProgress();
        this.requestCaseList(this.data.searchValue);
    },

    requestCaseList: function(searchValue) {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.SearchCaseList',
                openid: app.globalData.openid,
                center_id: that.data.centerId,
                keyword: searchValue,
                sort: 1
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.SearchCaseList:" + JSON.stringify(res))
                if (res.data.data.code == constant.response_success) {
                    for (let i = 0, len = res.data.data.list.length; i < len; i++) {
                        let caseInfo = res.data.data.list[i];
                        // 日期
                        if (caseInfo.puncture_date == 0) {
                            caseInfo.puncture_date = "暂无"
                        } else {
                            caseInfo.puncture_date = util.formatTime(caseInfo.puncture_date, 'Y-M-D');
                        }
                        if (caseInfo.operation_date == 0) {
                            caseInfo.operation_date = "暂无"
                        } else {
                            caseInfo.operation_date = util.formatTime(caseInfo.operation_date, 'Y-M-D')
                        }
                        caseInfo.patient_name_prefix_letter = caseInfo.patient_name.substr(0, 1);

                        // 进度
                        caseInfo.baseStatValue = that.getStateValue(caseInfo.base_state)
                        caseInfo.punctureStatValue = that.getStateValue(caseInfo.puncture_state)
                        caseInfo.beinStatValue = that.getStateValue(caseInfo.bein_state)
                    }

                    that.setData({
                        caseList: res.data.data.list
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

    onPuncture() {
        wx.navigateTo({
            url: '../chuanci/chuanci?centerId=' + this.data.centerId + "&centerName=" + this.data.centerName + "&case_id="
        });
    },

    onShouShu() {
        wx.navigateTo({
            url: '../shoushu/shoushu?centerId=' + this.data.centerId + "&centerName=" + this.data.centerName + "&case_id="
        });
    },

    // ============ 事件 begin ============ //
    tabSelect(e) {
        this.setData({
            currTab: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60
        })
    },
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