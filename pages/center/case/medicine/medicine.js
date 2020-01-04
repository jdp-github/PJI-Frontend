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
        isAdmin: false,
        // -------- modal begin ----------- //
        modalName: '',
        errMsg: '',
        // -------- modal end ------------- //
        centerId: '',
        centerName: '',
        caseId: '',
        caseNO: '',
        itemId: '',
        userInfo: {},

        baseInfo: {},
        medicineList: [],
        according_to_picker: ['请选择', '药敏指导', '经验用药'],
        wayPicker: ['请选择', '静脉', '口服', '局部灌洗'],
        frequencyPicker: ["请选择", "1/日", "2/日", "3/日", "1/12h"],
    },
    onLoad: function(options) {
        this.loadProgress();
        this.setData({
            isAdmin: app.globalData.is_admin == '1',
            centerId: options.centerId ? options.centerId : '',
            centerName: options.centerName ? options.centerName : '',
            caseId: options.caseId,
            caseNO: options.caseNO,
            itemId: options.itemId,
            userInfo: JSON.parse(options.userinfo)
        });
        this.initData()
        this.completeProgress();
    },

    initData() {
        this.requestMedicationList();
    },

    requestMedicationList() {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.GetMedicationList',
                case_id: that.data.caseId,
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.GetMedicationList:" + JSON.stringify(res))
                if (res.data.data.code == constant.response_success) {
                    res.data.data.list.forEach(item => {
                        if (item.start_time == 0) {
                            item.start_time = "暂无"
                        } else {
                            item.start_time = util.formatTime(item.start_time, 'Y-M-D')
                        }
                        if (item.end_time == 0) {
                            item.end_time = "暂无"
                        } else {
                            item.end_time = util.formatTime(item.end_time, 'Y-M-D')
                        }
                        item.according_to = parseInt(item.according_to)
                    })

                    that.setData({
                        baseInfo: res.data.data.info,
                        medicineList: res.data.data.list
                    })
                } else {
                    that.showToast(res.data.data.msg);
                }
            }
        });
    },

    onAddYongyao(e) {
        if (this.data.baseInfo.is_finish == 1) {
            this.showToast("抗生素治疗已终止")
            return
        }
        wx.navigateTo({
            url: '../yongyao/yongyao?centerId=' + this.data.centerId + "&centerName=" + this.data.centerName + "&caseId=" + this.data.caseId + "&itemId=" + 0
        });
    },

    onRefresh() {
        this.requestMedicationList()
    },

    onItemClick(e) {
        let item = e.currentTarget.dataset.item
        wx.navigateTo({
            url: '../yongyao/yongyao?centerId=' + this.data.centerId + "&centerName=" + this.data.centerName + "&caseId=" + this.data.caseId + "&itemId=" + item.item_id
        });
    },

    onEndMedication() {
        let that = this;
        if (that.data.medicineList.length == 0) {
            that.showToast("请添加用药")
            return
        }
        let type = that.data.baseInfo.is_finish == 1 ? 2 : 1
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.FinishMedication',
                openid: app.globalData.openid,
                case_id: that.data.caseId,
                type: type
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.FinishMedication:" + JSON.stringify(res))
                if (res.data.data.code == constant.response_success) {
                    // if (type == 1) {

                    // } else {

                    // }
                    wx.navigateBack({
                        delta: 1
                    })
                    that.reloadPrePage()
                } else {
                    that.showToast(res.data.data.msg);
                }
            }
        });
    },

    reloadPrePage() {
        var pages = getCurrentPages();
        if (pages.length > 1) {
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];
            //关键在这里
            prePage.initData()
        }
    },

    onBack() {
        wx.navigateBack({
            delta: 1
        })
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
    onUnload() {
        var pages = getCurrentPages();
        if (pages.length > 1) {
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];
            //关键在这里
            prePage.initData()
        }
    },
});