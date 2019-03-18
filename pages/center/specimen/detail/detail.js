'use strict';

const app = getApp();
let constant = require('../../../../utils/constant.js');
let util = require('../../../../utils/util.js');
let regeneratorRuntime = require('../../../../lib/regenerator-runtime/runtime');

// 空闲
const SPECIMEN_TYPE_FREE = 0
// 存放
const SPECIMEN_TYPE_PUT = 1
// 取出
const SPECIMEN_TYPE_GET = 2
// 无权限
const SPECIMEN_TYPE_NO_RIGHT = 3

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
        boxId: '',
        boxInfo: {},
        caseId: '',
        letterArr: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J",],
        specimenGrid: [],
        selectedSpecimen: {},
        isGetAll: false,
        getAllList: [],
        // 是否感染
        infectTitle: '请选择',
        infectValue: '',
        infectIndex: 0,
        // 手术类型
        typeTitle: '请选择',
        typeValue: '',
        typeIndex: 0,
        // 存放者
        ownerTitle: '请选择',
        ownerValue: '',
        ownerIndex: 0,
        staffList: [],
        staffNameList: [],
        // 弹出框
        specimenInfoVisible: false,
        specimenSaveVisible: false
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
    onLoad: function (options) {
        this.setData({
            boxId: options.boxId,
            centerId: options.centerId,
            caseId: options.caseId
        });
        this.loadProgress();
        this.clearFilter();
        this.init();
    },
    init: async function () {
        await this.requestCenterStaffList(this.data.centerId);
        await this.requestSampleList();
    },
    clearFilter: function () {
        this.setData({
            typeIndex: 0,
            typeValue: '',
            typeTitle: '请选择',
            infectIndex: 0,
            infectValue: '',
            infectTitle: '请选择',
            ownerIndex: 0,
            ownerValue: '',
            ownerTitle: '请选择'
        });
    },
    requestCenterStaffList: function (centerId) {
        let that = this;
        return new Promise((resolve, reject) => {
            wx.request({
                url: constant.basePath,
                data: {
                    service: 'Center.SearchCenterMember',
                    center_id: centerId,
                    keyword: '',
                    sort: 1
                },
                header: {
                    'content-type': 'application/json'
                },
                success(res) {
                    if (res.data.data.code == constant.response_success) {
                        let staffList = res.data.data.list;
                        let staffEmpty = {
                            staff_name: "请选择",
                            staff_id: 0
                        };
                        staffList.unshift(staffEmpty);
                        let staffNameList = [];
                        for (let i = 0, len = staffList.length; i < len; i++) {
                            let staff = staffList[i];
                            staffNameList[i] = staff.staff_name;
                        }
                        that.setData({
                            staffList: staffList,
                            staffNameList: staffNameList
                        });
                    } else {
                        that.showToast({
                            msg: res.data.data.msg,
                        });
                    }
                    resolve(res);
                },
                fail(res) {
                    that.showToast({
                        msg: res.data.data.msg,
                    });
                    that.completeProgress();
                    reject(res);
                }
            });
        });
    },
    requestSampleList: function (msis, type, staffId) {
        let that = this;
        return new Promise((resolve, reject) => {
            wx.request({
                url: constant.basePath,
                data: {
                    service: 'Sample.GetSampleList',
                    openid: app.globalData.openid,
                    box_id: that.data.boxId,
                    msis: msis,
                    type: type,
                    staff_id: staffId,
                    case_id: that.data.caseId
                },
                header: {
                    'content-type': 'application/json'
                },
                success(res) {
                    that.completeProgress();
                    if (res.data.data.code == constant.response_success) {
                        let boxInfo = res.data.data.info;
                        if (boxInfo.utime > 0) {
                            boxInfo.showTime = util.formatTime(boxInfo.utime, 'Y-M-D h:m');
                        } else if (boxInfo.ctime > 0) {
                            boxInfo.showTime = util.formatTime(boxInfo.ctime, 'Y-M-D h:m');
                        }
                        let specimenGrid = that.makeSpecimenGrid(res.data.data.list);
                        that.setData({
                            boxInfo: boxInfo,
                            specimenGrid: specimenGrid
                        });
                    } else {
                        that.showToast({
                            msg: res.data.data.msg,
                        });
                    }
                    resolve(res);
                },
                fail(res) {
                    that.completeProgress();
                    reject(res);
                }
            });
        });
    },
    makeSpecimenGrid: function (specimenList) {
        let specimenGrid = [];
        let row = [];
        for (let i = 0, column = 0, length = specimenList.length; i < length; i++) {
            let specimen = specimenList[i];
            specimen.index = (i % 10) + 1;
            row[i % 10] = specimen;
            if ((i + 1) % 10 == 0) {
                let specimen = {
                    index: 0,
                    text: this.data.letterArr[column]
                };
                row.unshift(specimen);
                specimenGrid[column] = row;
                column++;
                row = []
            }
        }
        return specimenGrid;
    },
});