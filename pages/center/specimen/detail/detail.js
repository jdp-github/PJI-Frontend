'use strict';

const app = getApp();
let constant = require('../../../../utils/constant.js');
let util = require('../../../../utils/util.js');
let regeneratorRuntime = require('../../../../lib/regenerator-runtime/runtime');

// 空闲
const SPECIMEN_TYPE_FREE = 0;
// 存放
const SPECIMEN_TYPE_PUT = 1;
// 取出
const SPECIMEN_TYPE_GET = 2;
// 无权限
const SPECIMEN_TYPE_NO_RIGHT = 3;

const SPECIMEN_TYPE_LIST = ['关节液', '血液', '组织'];
const ECCENTRICITY_LIST = ['6600*3min', '1000g*5min', '1000g*10min', '未离心'];

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
        boxUse: 1,

        letterArr: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", ],
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
        modalName: '',
        infectList: ['请选择', '否', '是'],
        typeList: ['请选择', '关节液', '血液', '组织'],
        ownerList: ['请选择'],
        // 可用取出盒列表
        showDetail: false,
        outerBoxTitle: '请选择',
        outerBoxValue: '',
        outerBoxList: [],
        outerBoxNameList: [],
        outerBoxIndex: 0,
        outerBoxId: '',
        // 取出的标本id
        getSpecimenIds: '',
        // 待删除的标本id
        deleteSpecimenId: ''
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
    showDeleteModal(e) {
        this.setData({
            deleteModalName: e.currentTarget.dataset.target,
            deleteSpecimenId: e.currentTarget.dataset.id
        });
    },
    hideModal(e) {
        this.setData({
            modalName: null,
        });
    },
    hideDeleteModal(e) {
        this.setData({
            deleteModalName: null,
        });
    },
    onLoad: function(options) {
        this.setData({
            boxId: options.boxId,
            centerId: options.centerId,
            caseId: options.caseId,
            boxUse: options.boxUse
        });
        this.clearFilter();
        this.initData();
    },
    initData: async function() {
        this.loadProgress();
        await this.requestCenterStaffList(this.data.centerId);
        await this.requestSampleList();
    },
    clearFilter: function() {
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
    requestCenterStaffList: function(centerId) {
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
                        that.showToast(res.data.msg);
                    }
                    resolve(res);
                },
                fail(res) {
                    that.showToast(res.data.msg);
                    that.completeProgress();
                    reject(res);
                }
            });
        });
    },
    requestSampleList: function(msis, type, staffId) {
        let that = this;
        return new Promise((resolve, reject) => {
            wx.request({
                url: constant.basePath,
                data: {
                    service: 'Sample.GetSampleList',
                    openid: app.globalData.openid,
                    box_id: that.data.boxId,
                    is_asepsis: msis,
                    type: type,
                    staff_id: staffId,
                    case_id: that.data.caseId
                },
                header: {
                    'content-type': 'application/json'
                },
                success(res) {
                    console.log("Sample.GetSampleList:" + JSON.stringify(res))
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
                            boxUse: boxInfo.uses,
                            specimenGrid: specimenGrid
                        });
                    } else {
                        that.showToast(res.data.msg);
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
    makeSpecimenGrid: function(specimenList) {
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
    onItemClick: function(e) {
        let specimen = e.currentTarget.dataset.selecteditem;
        if (specimen.color_type == SPECIMEN_TYPE_NO_RIGHT) { // 无权限
            this.showToast('您无权限查看');
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
        } else if (specimen.color_type == SPECIMEN_TYPE_PUT) { // 批量取出，只有存放状态的可以取出
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
        }
    },
    showDetail: function(specimenId) {
        this.setData({
            modalName: 'specimenInfo',
            showDetail: true
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
                console.log("Sample.CheckSample:" + JSON.stringify(res))
                that.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    let specimenInfo = res.data.data.info;
                    specimenInfo.put_time = util.formatTime(specimenInfo.put_time, 'Y-M-D h:m');
                    if (specimenInfo.get_time == 0) {
                        specimenInfo.get_time = "-"
                    } else {
                        specimenInfo.get_time = util.formatTime(specimenInfo.get_time, 'Y-M-D h:m');
                    }

                    // 标本类型
                    specimenInfo.typeValue = SPECIMEN_TYPE_LIST[specimenInfo.type - 1]
                    // 离心转数
                    specimenInfo.eccentricityValue = ECCENTRICITY_LIST[specimenInfo.eccentricity]
                    // 是否无菌
                    specimenInfo.isAsepsisValue = specimenInfo.is_asepsis == 0 ? "否" : "是"
                    that.setData({
                        selectedSpecimen: specimenInfo
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
    // ======================== 取出标本 begin ======================== //
    // 单取
    onSingleGetClick: function(e) {
        this.setData({
            showDetail: false,
            getSpecimenIds: e.target.dataset.id
        })
        this.requestAbleBox(1)
    },
    onGetBackClick: function() {
        this.hideModal()
    },
    // 删除
    onSingleDeleClick: function(e) {
        let that = this;
        that.hideDeleteModal();
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.DeleteSample',
                openid: app.globalData.openid,
                sample_id: that.data.deleteSpecimenId
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Sample.DeleteSample:" + JSON.stringify(res));
                that.setData({
                   deleteSpecimenId: ''
                });
                that.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    that.hideModal();
                    that.loadProgress();
                    that.requestSampleList(that.data.infectIndex, that.data.typeIndex, that.data.staffList[that.data.ownerIndex].staff_id);
                } else {
                    that.showToast(res.data.data.msg);
                }
            },
            fail(res) {
                that.setData({
                    deleteSpecimenId: ''
                });
                that.hideLoading();
            }
        });
    },
    // 批量取出
    onMultipleGetClick: function() {
        if (this.data.getAllList.length == 0) {
            this.showToast('请选择要取出的标本');
            return
        }
        let sample_ids = "";
        let getAllList = this.data.getAllList;
        for (let i = 0, length = getAllList.length; i < length; i++) {
            sample_ids += getAllList[i] + ",";
        }
        sample_ids = sample_ids.substr(0, sample_ids.length - 1);

        this.requestAbleBox(getAllList.length)
        this.setData({
            showDetail: false,
            modalName: 'specimenInfo',
            getSpecimenIds: sample_ids
        })
    },
    onMultipleGetBackClick: function() {
        this.hideModal()
    },
    toGetAllMode: function() {
        this.clearFilter();
        this.setData({
            isGetAll: true
        });
    },
    toNormalMode: function() {
        this.setData({
            isGetAll: false
        });
        this.clearSelectStatus();
    },
    // 获取可以存放的标本盒列表接口
    requestAbleBox(specimenCount) {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.EnablePutBoxList',
                openid: app.globalData.openid,
                center_id: that.data.centerId,
                quantity: specimenCount
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Sample.EnablePutBoxList:" + JSON.stringify(res))
                that.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    var boxNameList = []
                    var boxList = res.data.data.list
                    for (var i = 0, length = boxList.length; i < length; i++) {
                        boxNameList[i] = boxList[i].name
                    }
                    boxNameList.unshift('请选择')
                    that.setData({
                        outerBoxList: boxList,
                        outerBoxNameList: boxNameList
                    })
                } else {
                    that.showToast(res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
    onClickOuterBox: function(e) {
        let tmp = parseInt(e.detail.value);
        if (tmp >= 0) {
            this.setData({
                outerBoxValue: tmp,
                outerBoxTitle: this.data.outerBoxNameList[tmp],
                outerBoxIndex: tmp,
                outerBoxId: this.data.outerBoxList[tmp - 1].id
            });
        }
    },
    // 真正的取出
    onFinalGet() {
        if (this.data.outerBoxIndex == 0) {
            this.showToast("请选择可用的取出盒")
            return
        }
        this.showLoading();
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.SetWritingStaff',
                openid: app.globalData.openid,
                box_id: that.data.outerBoxId
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    that.requestGetSpecimen()
                } else {
                    that.showToast(res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });

    },

    requestGetSpecimen() {
        this.showLoading();
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.GetSample',
                openid: app.globalData.openid,
                sample_ids: that.data.getSpecimenIds,
                box_id: that.data.outerBoxId
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Sample.GetSample:" + JSON.stringify(res))
                that.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    that.clearFilter();
                    that.loadProgress();
                    that.setData({
                        boxId: that.data.outerBoxId,
                        outerBoxIndex: 0,
                        outerBoxId: '',
                        getSpecimenIds: '',
                        isGetAll: false
                    })
                    that.hideModal()
                    that.showToast("取出成功，标本列表已跳转至[" + that.data.outerBoxTitle + "]")
                    that.requestSampleList()
                } else {
                    that.showToast(res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
    // ======================== 取出标本 end ======================== //

    // 感染筛选
    onClickInfect: function(e) {
        if (this.data.isGetAll) {
            return
        }
        let tmp = parseInt(e.detail.value);
        if (parseInt(e.detail.value) >= 0) {
            this.setData({
                infectValue: tmp,
                infectTitle: this.data.infectList[tmp],
                infectIndex: tmp
            });
            this.loadProgress();
            this.requestSampleList(this.data.infectIndex, this.data.typeIndex, this.data.staffList[this.data.ownerIndex].staff_id);
        }
    },
    // 类型筛选
    onClickType: function(e) {
        if (this.data.isGetAll) {
            return
        }
        let tmp = parseInt(e.detail.value);
        if (parseInt(e.detail.value) >= 0) {
            this.setData({
                typeValue: tmp,
                typeTitle: this.data.typeList[tmp],
                typeIndex: tmp
            });
            this.loadProgress();
            this.requestSampleList(this.data.infectIndex, this.data.typeIndex, this.data.staffList[this.data.ownerIndex].staff_id);
        }
    },
    // 存放者筛选
    onClickOwner: function(e) {
        if (this.data.isGetAll) {
            return
        }
        let tmp = parseInt(e.detail.value);
        if (parseInt(e.detail.value) >= 0) {
            this.setData({
                ownerValue: tmp,
                ownerTitle: this.data.staffNameList[tmp],
                ownerIndex: tmp
            });
            this.loadProgress();
            this.requestSampleList(this.data.infectIndex, this.data.typeIndex, this.data.staffList[this.data.ownerIndex].staff_id);
        }
    },
    // 清空选中标本的状态
    clearSelectStatus: function() {
        let specimenGrid = this.data.specimenGrid;
        for (let i = 0, column = specimenGrid.length; i < column; i++) {
            for (let j = 0, row = specimenGrid[i].length; j < row; j++) {
                let specimenItem = specimenGrid[i][j];
                if (specimenItem.isChecked) {
                    specimenItem.isChecked = false;
                    specimenItem.icon = specimenItem.origiIcon;
                    specimenItem.color_hex = specimenItem.origiColor;
                }
            }
        }
        this.setData({
            specimenGrid: specimenGrid
        });
    },

    onUnload() {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.ClearWritingStatus',
                box_id: that.data.boxId,
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.hideLoading();
                if (res.data.data.code == 0) {
                    // that.reloadPrePage()
                    // wx.navigateBack({
                    //     delta: 1
                    // })
                } else {
                    that.showModal("ErrModal", res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    }
});