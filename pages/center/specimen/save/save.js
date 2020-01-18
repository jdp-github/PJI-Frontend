'use strict';

const app = getApp();
let constant = require('../../../../utils/constant.js');
let util = require('../../../../utils/util.js');
let regeneratorRuntime = require('../../../../lib/regenerator-runtime/runtime');

Page({
    data: {
        loadProgress: 0,
        loadModal: false,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        hidden: true,
        isAdmin: false,

        centerId: '',
        boxInfo: '',
        searchValue: '',
        specimenInfo: '',
        caseList: [],
        selectedCaseInfo: {},
        punctureList: [],
        selectedPunctureInfo: {},

        remark: '',
        typeList: ['关节液', '血液', '组织'],
        typeIndex: 0,
        eccentricityList: ['未离心', '6600*3min', '1000g*5min', '1000g*10min'],
        eccentricityIndex: 0,
        axenicList: ['否', '是'],
        axenicIndex: 0,
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
    showModal(e) {
        this.setData({
            modalName: e.currentTarget.dataset.target
        });
    },
    hideModal(e) {
        this.setData({
            modalName: null
        });
    },

    onLoad: function(options) {
        let boxInfo = JSON.parse(options.boxInfo);
        let specimenInfo = JSON.parse(options.specimenInfo);
        this.setData({
            centerId: options.centerId,
            boxInfo: boxInfo,
            specimenInfo: specimenInfo
        });
        this.requestCaseList(this.data.searchValue);
    },
    requestCaseList: function(searchValue) {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.SearchCaseList',
                openid: app.globalData.openid,
                center_id: this.data.centerId,
                keyword: searchValue,
                sort: 1
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.SearchCaseList:" + JSON.stringify(res))
                that.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    for (let i = 0, len = res.data.data.list.length; i < len; i++) {
                        let caseInfo = res.data.data.list[i];
                        caseInfo.create_time = util.formatTime(caseInfo.create_time, 'Y-M-D');
                        caseInfo.isSelected = false;
                    }
                    that.setData({
                        caseList: res.data.data.list
                    });
                } else {
                    that.showToast(res.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
    onInput: function(e) {
        this.setData({
            remark: e.detail.value
        });
    },
    onClickType: function(e) {
        let tmp = parseInt(e.detail.value);
        if (parseInt(e.detail.value) >= 0) {
            this.setData({
                typeIndex: tmp
            });
        }
    },
    onClickEccentricity: function(e) {
        let tmp = parseInt(e.detail.value);
        if (parseInt(e.detail.value) >= 0) {
            this.setData({
                eccentricityIndex: tmp
            });
        }
    },
    onClickAxenic: function(e) {
        console.log(e)
        let tmp = parseInt(e.detail.value);
        if (parseInt(e.detail.value) >= 0) {
            this.setData({
                axenicIndex: tmp
            });
        }
    },
    onSearchChange: function(e) {
        this.setData({
            searchValue: e.detail.value
        });
    },
    onSearch: function(e) {
        this.requestCaseList(this.data.searchValue);
    },
    onItemClick: function(e) {
        let caseInfo = e.currentTarget.dataset.item;
        for (let i = 0, length = this.data.caseList.length; i < length; i++) {
            this.data.caseList[i].isSelected = caseInfo.case_id == this.data.caseList[i].case_id;
        }

        this.setData({
            caseList: this.data.caseList,
            selectedCaseInfo: caseInfo,
            modalName: "DrawerModalR"
        });

        this.getPunctrueList(caseInfo.case_id);
    },

    getPunctrueList(caseId) {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.GetCaseItems',
                case_id: caseId,
                type: 2,
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.GetCaseItems:" + JSON.stringify(res))
                if (res.data.data.code == constant.response_success) {
                    for (let i = 0, len = res.data.data.list.length; i < len; i++) {
                        let punctrueInfo = res.data.data.list[i];
                        punctrueInfo.date_time = util.formatTime(punctrueInfo.date_time, 'Y-M-D');
                        punctrueInfo.isSelected = that.data.selectedPunctureInfo.item_id == punctrueInfo.item_id
                    }
                    that.setData({
                        punctureList: res.data.data.list
                    });
                } else {
                    that.showToast(res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },

    onPunctureItemClick(e) {
        let punctureInfo = e.currentTarget.dataset.item;
        for (let i = 0, length = this.data.punctureList.length; i < length; i++) {
            this.data.punctureList[i].isSelected = punctureInfo.item_id == this.data.punctureList[i].item_id;
        }

        this.setData({
            punctureList: this.data.punctureList,
            selectedPunctureInfo: punctureInfo
        });
    },

    gotoPuncture(e) {
        let punctureInfo = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: '../../case/chuanci/chuanci?centerId=' + this.data.centerId + "&centerName=''" + "&caseId=" + this.data.selectedCaseInfo.case_id + "&itemId=" + punctureInfo.item_id
        });
    },

    savePuncture() {
        this.setData({
            modalName: ''
        })
    },

    onPutClick: function() {
        if (!this.data.selectedPunctureInfo.item_id) {
            this.showToast("请选择关联的穿刺手术")
            return
        }
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.PutSample',
                openid: app.globalData.openid,
                sample_id: that.data.specimenInfo.sample_id,
                case_id: that.data.selectedCaseInfo.case_id,
                item_id: that.data.selectedPunctureInfo.item_id,
                type: parseInt(that.data.typeIndex) + 1,
                eccentricity: parseInt(that.data.eccentricityIndex),
                is_asepsis: parseInt(that.data.axenicIndex),
                remark: that.data.remark
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Sample.PutSample:" + JSON.stringify(res))
                that.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    that.showToast("存储成功")
                    that.reloadPrePage();
                    wx.navigateBack({
                        delta: -1
                    });
                } else {
                    that.showToast(res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
    reloadPrePage: function() {
        let pages = getCurrentPages();
        if (pages.length > 1) {
            //上一个页面实例对象
            let prePage = pages[pages.length - 2];
            //关键在这里
            prePage.initData();
        }
    },
    onBackClick: function() {
        wx.navigateBack({
            delta: -1
        });
    }
});