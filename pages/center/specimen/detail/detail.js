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
        specimenSaveVisible: false,
        modalName: ''
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
                        that.showToast(res.data.data.msg);
                    }
                    resolve(res);
                },
                fail(res) {
                    that.showToast(res.data.data.msg);
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
                        that.showToast(res.data.data.msg);
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
    onItemClick: function (e) {
        let specimen = e.currentTarget.dataset.selecteditem;
        if (specimen.color_type == SPECIMEN_TYPE_NO_RIGHT) { // 无权限
            this.showToast({
                msg: '您无权限查看',
            });
            return
        }

        if (!this.data.isGetAll) { // 普通模式
            if (specimen.color_type == SPECIMEN_TYPE_FREE) { // 空闲
                wx.navigateTo({
                    url: '../save/save?specimenInfo=' + JSON.stringify(e.currentTarget.dataset.selecteditem) + "&boxInfo=" + JSON.stringify(this.data.boxInfo) + "&centerId=" + this.data.centerId
                });
            } else if (specimen.color_type == SPECIMEN_TYPE_PUT || specimen.color_type == SPECIMEN_TYPE_GET) { // 已存放 or 已取出
                this.showDetail(specimen.sample_id);
            }
        } else { // 批量取出
            let number = specimen.number;
            let columnIndex = this.data.letterArr.indexOf(number.substring(0, 1));
            let rowIndex = number.substring(1, number.length);
            let selectedItem = this.data.specimenGrid[columnIndex][rowIndex];
            if (selectedItem.isChecked) {
                selectedItem.isChecked = false;
                selectedItem.icon = selectedItem.origiIcon;
                selectedItem.color_hex = selectedItem.origiColor;
                this.data.getAllList.splice(this.data.getAllList.indexOf(selectedItem.sample_id), 1);
            } else {
                selectedItem.isChecked = true;
                selectedItem.origiColor = selectedItem.color_hex;
                selectedItem.origiIcon = selectedItem.icon;
                selectedItem.icon = "fa-calendar-check-o";
                selectedItem.color_hex = "green";
                this.data.getAllList.push(selectedItem.sample_id);
            }
            this.setData({
                specimenGrid: this.data.specimenGrid
            });
            // console.log(this.data.getAllList)
        }
    },
    showDetail: function (specimenId) {
        this.setData({
            modalName: 'specimenInfo'
        });
        this.showLoading();
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.CheckSample',
                openid: app.globalData.openid,
                sample_id: specimenId
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    let specimenInfo = res.data.data.info;
                    specimenInfo.msis = that.getMsisInfo(specimenInfo.msis);
                    specimenInfo.put_time = util.formatTime(specimenInfo.put_time, 'Y-M-D h:m');
                    specimenInfo.get_time = util.formatTime(specimenInfo.get_time, 'Y-M-D h:m');
                    that.setData({
                        selectedSpecimen: specimenInfo
                    });
                } else {
                    that.showToast( res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
    getMsisInfo: function (msisFlag) {
        let msisValue;
        if (msisFlag == 1) {
            msisValue = "不能确定"
        } else if (msisFlag == 2) {
            msisValue = "非感染"
        } else if (msisFlag == 3) {
            msisValue = "感染"
        }
        return msisValue
    },
    onGetClick: function () {
        this.setData({
            modalName: ''
        });
        this.getSpecimen(this.data.selectedSpecimen.sample_id)
    },
    // 取出标本
    getSpecimen: function (sample_ids) {
        this.showLoading();
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.GetSample',
                openid: app.globalData.openid,
                sample_ids: sample_ids
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    that.clearFilter();
                    that.requestSampleList(that.data.typeIndex, that.data.infectIndex, that.data.staffList[that.data.ownerIndex].staff_id);
                } else {
                    that.showToast(res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
});