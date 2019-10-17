'use strict';

let constant = require('../../utils/constant.js');
let regeneratorRuntime = require('../../lib/regenerator-runtime/runtime');

const app = getApp();

Page({
    data: {
        loadProgress: 0,
        loadModal: false,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        emitter: null,
        centerObjList: [],
        centerValueList: [],
        centerValue: '全部',
        centerIndex: 0,
        infectEc: {
            disableTouch: true
        },
        typeEc: {
            disableTouch: true
        },
        completeEc: {
            disableTouch: true
        },
        noInfectPercentage: 0,
        seizePercentage: 0,
        approvePercentage: 0,
        notApprovePercentage: 0,
    },
    onHide: function () {
        this.setData({
            modalName: ''
        });
    },
    onShow: function () {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 1,
                emitter: app.globalData.emitter
            });
            app.globalData.emitter.on('addEmitter', () => {
                console.log("stats modal");
            });
        }
        this.onLoad();
    },
    onLoad: function () {
        this.initLogic();
    },
    initLogic: async function () {
        await this.requestCenterList();
        await this.requestCharts(true);
    },
    loadProgress: function () {
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
    completeProgress: function () {
        this.setData({
            loadProgress: 100
        });
    },
    showToast: function (msg) {
        wx.showToast({
            icon: 'none',
            title: msg,
        });
    },
    showLoading: function () {
        this.setData({
            loadModal: true
        });
    },
    hideLoading: function () {
        setTimeout(() => {
            this.setData({
                loadModal: false
            });
        }, 1500);
    },
    backToAuth: function () {
        wx.navigateTo({
            url: '../auth/auth'
        });
    },
    centerChange: function (e) {
        this.setData({
            centerIndex: e.detail.value,
            centerValue: this.data.centerValueList[e.detail.value]
        });
        if (this.data.centerValue == "全部") {
            this.requestCharts(true);
        } else {
            this.requestCharts(false);
        }
    },
    requestCenterList: function () {
        let that = this;
        return new Promise((resolve, reject) => {
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
                    if (res.data.data.code == constant.response_success) {
                        that.setData({
                            centerValueList: [],
                            centerObjList: res.data.data.list
                        });
                        for (let i = 0, len = that.data.centerObjList.length; i < len; i++) {
                            that.data.centerValueList[i] = that.data.centerObjList[i].center_name;
                        }
                        that.data.centerValueList.push('全部');
                        that.setData({
                            centerValueList: that.data.centerValueList
                        });
                    }
                    // that.completeProgress();
                    resolve(res);
                },
                fail(res) {
                    // that.completeProgress();
                    that.showToast(res.data.msg);
                    reject(res);
                }
            });
        });
    },
    requestCharts: function (all) {
        let that = this;
        return new Promise((resolve, reject) => {
            wx.request({
                url: constant.basePath,
                data: {
                    service: 'Statistics.GetCharts',
                    center_id: all ? "" : that.data.centerObjList[that.data.centerIndex].center_id,
                    openid: app.globalData.openid
                },
                header: {
                    'content-type': 'application/json'
                },
                success(res) {
                    if (res.data.data.code == constant.response_success) {
                        let notInfect = res.data.data.infect_list.notinfect;
                        let infect = res.data.data.infect_list.infect;
                        let seize = res.data.data.type_list.seize;
                        let displace = res.data.data.type_list.displace;
                        let totalType = res.data.data.type_list.total_type;
                        let firstType = res.data.data.type_list.first;
                        let otherType = res.data.data.type_list.other;
                        let approve = res.data.data.finished_list.completed_cases;
                        let notApprove = res.data.data.finished_list.no_approve_cases;
                        let totalCases = res.data.data.finished_list.total_cases;
                        that.setData({
                            complete_list: res.data.data.finished_list,
                            infect_list: res.data.data.infect_list,
                            type_list: res.data.data.type_list,
                            noInfectPercentage: Math.round((parseInt(notInfect) / (parseInt(notInfect) + parseInt(infect))) * 100)?Math.round((parseInt(notInfect) / (parseInt(notInfect) + parseInt(infect))) * 100):0,
                            seizePercentage: Math.round((parseInt(seize) / parseInt(totalType)) * 100)?Math.round((parseInt(seize) / parseInt(totalType)) * 100):0,
                            displacePercentage: Math.round((parseInt(displace) / parseInt(totalType)) * 100)?Math.round((parseInt(displace) / parseInt(totalType)) * 100):0,
                            firstPercentage: Math.round((parseInt(firstType) / parseInt(totalType)) * 100)?Math.round((parseInt(firstType) / parseInt(totalType)) * 100):0,
                            otherPercentage: Math.round((parseInt(otherType) / parseInt(totalType)) * 100)?Math.round((parseInt(otherType) / parseInt(totalType)) * 100):0,
                            approvePercentage: Math.round((parseInt(approve) / parseInt(totalCases)) * 100)? Math.round((parseInt(approve) / parseInt(totalCases)) * 100):0,
                            notApprovePercentage: Math.round((notApprove / parseInt(totalCases)) * 100)?Math.round((notApprove / parseInt(totalCases)) * 100):0
                        });
                    } else {
                        that.showToast(res.data.msg);
                    }
                    resolve(res);
                },
                fail(res) {
                    that.showToast(res.data.msg);
                    reject(res);
                }
            });
        });
    }
});
