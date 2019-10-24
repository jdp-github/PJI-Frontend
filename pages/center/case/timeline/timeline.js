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
        hidden: true,
        isAdmin: false,
        searchValue: '',
        startDate: '2018-12-25',
        endDate: '2018-12-25',
        stateIndex: "0",
        statePicker: ["全部病例", '未审核', '已审核'],
        addCaseName: '',
        addCaseID: '',
        addCaseSideIndex: 0,
        addCaseSidePicker: ['左侧', '右侧'],
        addCasePartIndex: 0,
        addCasePartPicker: ['髋', '膝'],
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
        this.makeDate();
        this.loadProgress();
        this.requestCaseList(this.data.searchValue);
    },

    makeDate() {
        this.setData({
            startDate: util.getNowFormatDate(true),
            endDate: util.getNowFormatDate()
        })
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

    getStateValue(state) {
        var stateValue = ""
        if (state == 0) {
            stateValue = "未完成"
        } else if (state == 1) {
            stateValue = "已完成未审核"
        } else if (state == 2) {
            stateValue = "已审核"
        }

        return stateValue
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
        wx.navigateTo({
            url: '../case/base/base?centerId=' + this.data.centerId + "&centerName=" + this.data.centerName + "&case_id="
        });
    },

    // onEditCase: function(e) {
    //     let that = this;
    //     that.showLoading();
    //     let caseInfo = e.currentTarget.dataset.case;
    //     wx.request({
    //         url: constant.basePath,
    //         data: {
    //             service: 'Case.SetCaseWritingStaff',
    //             openid: app.globalData.openid,
    //             case_id: caseInfo.case_id,
    //             type: 1
    //         },
    //         header: {
    //             'content-type': 'application/json'
    //         },
    //         success(res) {
    //             if (res.data.data.code == 0) {
    //                 wx.navigateTo({
    //                     url: '../../center/case/detail/detail?case_id=' + caseInfo.case_id + "&centerId=" + that.data.centerId + "&centerName=" + that.data.centerName
    //                 });
    //             } else {
    //                 that.showModal("ErrModal", res.data.data.msg);
    //             }
    //             that.hideLoading();
    //         },
    //         fail(res) {
    //             that.hideLoading();
    //         }
    //     });
    // },

    // 查看
    onLookCase: function(e) {
        let caseInfo = e.currentTarget.dataset.case;
        wx.navigateTo({
            url: '../../center/case/detail/detail?case_id=' + caseInfo.case_id + "&centerId=" + this.data.centerId + "&centerName=" + this.data.centerName + "&isLook=" + true
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
    },
    EndDateChange(e) {
        this.setData({
            endDate: e.detail.value
        })
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
        this.initData()
    },

    // ============ 事件 end ============ //
});