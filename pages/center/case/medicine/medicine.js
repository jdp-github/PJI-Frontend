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
                case_no: that.data.caseNO,
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
                        medicineList: res.data.data.list
                    })
                } else {
                    that.showToast(res.data.data.msg);
                }
            }
        });
    },

    onAddYongyao(e) {
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
});