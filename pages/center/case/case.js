'use strict';

let constant = require('../../../utils/constant.js');
let util = require('../../../utils/util.js');

const app = getApp();

Page({
    data: {
        loadProgress: 0,
        loadModal: false,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        hidden: true,
        isAdmin: false,

        searchValue: '',
        startDate: util.getNowFormatDate(true),
        endDate: util.getNowFormatDate(),
        stateIndex: 0,
        statePicker: ["全部病例", '未审核', '已审核'],
        addCaseName: '',
        addCaseID: '',
        addCaseSideIndex: 0,
        addCaseSidePicker: ['请选择', '左侧', '右侧'],
        addCasePartIndex: 0,
        addCasePartPicker: ['请选择', '髋', '膝'],
        caseList: [],
        selectedCase: {},
        errMsg: ''
    },

    onLoad: function(options) {
        this.setData({
            centerId: options.centerId,
            centerName: options.centerName,
            isAdmin: app.globalData.is_admin == '1'
        });
        this.initData()
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
                start_time: new Date(that.data.startDate).getTime(),
                end_time: new Date(that.data.endDate).getTime(),
                state: that.data.stateIndex
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.SearchCaseList:" + JSON.stringify(res))
                if (res.data.data.code == constant.response_success) {
                    for (let i = 0, len = res.data.data.list.length; i < len; i++) {
                        let caseInfo = res.data.data.list[i];
                        // 建档日期
                        if (caseInfo.create_time == 0) {
                            caseInfo.create_time = "暂无"
                        } else {
                            caseInfo.create_time = util.formatTime(caseInfo.create_time, 'Y-M-D');
                        }
                        // 末次要素
                        if (caseInfo.last_element == 0) {
                            caseInfo.last_element = "暂无"
                        } else {
                            caseInfo.last_element = util.formatTime(caseInfo.last_element, 'Y-M-D')
                        }
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

    onAddCase: function(e) {
        this.setData({
            modalName: 'AddCase'
        })
    },

    onSubmitAdd() {
        if (this.data.addCaseName.length == 0) {
            this.showToast("请输入姓名")
            return
        }
        if (this.data.addCaseID.length == 0) {
            this.showToast("请输入ID号")
            return
        }
        if (this.data.addCaseSideIndex == 0) {
            this.showToast("请选择侧别")
            return
        }
        if (this.data.addCasePartIndex == 0) {
            this.showToast("请选择部位")
            return
        }
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.CreateCase',
                openid: app.globalData.openid,
                patient_name: that.data.addCaseName,
                case_no: that.data.addCaseID,
                side: that.data.addCaseSideIndex,
                part: that.data.addCasePartIndex,
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.CreateCase:" + JSON.stringify(res));
                if (res.data.data.code == constant.response_success) {
                    wx.navigateTo({
                        url: '../case/base/base?caseId=' + res.data.data.info.case_id
                    });
                } else {
                    that.showModal("ErrModal", res.data.data.msg);
                }
            },
            fail(res) {}
        });

        this.hideModal()
    },

    onHideAdd() {
        this.setData({
            modalName: null,
            addCaseName: '',
            addCaseID: '',
            addCasePartIndex: 0,
            addCaseSideIndex: 0
        });
    },

    // 查看
    onLookCase: function(e) {
        let caseInfo = e.currentTarget.dataset.case;
        wx.navigateTo({
            url: '../../center/case/base/base?case_id=' + caseInfo.case_id + "&centerId=" + this.data.centerId + "&centerName=" + this.data.centerName + "&isLook=" + true
        });
    },

    onDeleCase: function(e) {
        let selectedCase = e.currentTarget.dataset.case;
        this.setData({
            selectedCase: selectedCase
        });
        this.showModal("DeleteCaseModal");
    },
    deleCase: function() {
        let that = this;
        that.loadProgress();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.DeleteCase',
                openid: app.globalData.openid,
                case_id: that.data.selectedCase.case_id
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.DeleteCase:" + JSON.stringify(res));
                that.completeProgress();
                if (res.data.data.code == constant.response_success) {
                    that.loadProgress();
                    that.requestCaseList(that.data.searchValue);
                    that.setData({
                        modalName: ''
                    });
                } else {
                    that.showModal("ErrModal", res.data.data.msg);
                }
            },
            fail(res) {
                that.completeProgress();
            }
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
    onSearchChange: function(e) {
        this.setData({
            searchValue: e.detail.value
        });
    },
    onSearch: function() {
        this.loadProgress();
        this.requestCaseList(this.data.searchValue);
    },
    StatePickerChange(e) {
        this.setData({
            stateIndex: e.detail.value
        })
        this.requestCaseList(this.data.searchValue);
    },
    onAddNameInput: function(e) {
        this.setData({
            addCaseName: e.detail.value
        });
    },
    onAddIDInput: function(e) {
        this.setData({
            addCaseID: e.detail.value
        });
    },
    SidePickerChange(e) {
        this.setData({
            addCaseSideIndex: e.detail.value
        })
    },
    PartPickerChange(e) {
        this.setData({
            addCasePartIndex: e.detail.value
        })
    },
    StartDateChange(e) {
        this.setData({
            startDate: e.detail.value
        })
        this.requestCaseList(this.data.searchValue);
    },
    EndDateChange(e) {
        this.setData({
            endDate: e.detail.value
        })
        this.requestCaseList(this.data.searchValue);
    },
    ListTouchStart: function(e) {
        this.setData({
            ListTouchStart: e.touches[0].pageX
        });
    },
    ListTouchMove: function(e) {
        this.setData({
            ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
        });
    },
    ListTouchEnd: function(e) {
        if (this.data.ListTouchDirection == 'left') {
            this.setData({
                modalName: e.currentTarget.dataset.target
            });
        } else {
            this.setData({
                modalName: null
            });
        }
        this.setData({
            ListTouchDirection: null
        });
    },

    onRefresh: function(e) {
        // this.initData()
        wx.navigateTo({
            url: '../case/timeline/timeline?centerId=' + this.data.centerId + "&centerName=" + this.data.centerName + "&case_id="
        });
    },

    // ============ 事件 end ============ //
});