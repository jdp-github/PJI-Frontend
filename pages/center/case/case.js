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

        centerId: '',
        centerName: '',
        caseId: '',
        isShowErrBtn: false,

        searchValue: '',
        startDate: util.getNowFormatDate(true),
        endDate: util.getNowFormatDate(),
        stateIndex: 0,
        statePicker: ["全部病例", '未审核', '已审核'],
        lastEventIndex: 0,
        lastEvnetPicker: ['全部事件', '诊断穿刺', '入院手术', '药物治疗', '门诊随访'],
        limitIndex: 0,
        limitPicker: ['建档日期', '末次事件日期'],
        doctorIndex: 0,
        doctorList: [],

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
        this.requestDoctorList();
        this.requestCaseList();
    },

    requestDoctorList() {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.GetDoctorList',
                center_id: that.data.centerId,
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.GetDoctorList:" + JSON.stringify(res))
                if (res.data.data.code == constant.response_success) {
                    let doctorList = []
                    res.data.data.list.forEach(item => {
                        doctorList.push(item.pro_doctor)
                    })
                    doctorList.unshift('全体医师')
                    that.setData({
                        doctorList: doctorList
                    });
                } else {
                    that.showToast(res.data.msg);
                }

            },
            fail(res) {
                that.hideLoading();
                that.showToast(res.data.msg);
            }
        });
    },

    requestCaseList: function() {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.SearchCaseList',
                openid: app.globalData.openid,
                center_id: that.data.centerId,
                keyword: that.data.searchValue,
                start_time: that.data.startDate,
                end_time: that.data.endDate,
                state: that.data.stateIndex,
                date_type: that.data.limitIndex + 1,
                pro_doctor: that.getProDoctor(),
                last_element: that.data.lastEventIndex == 0 ? that.data.lastEventIndex : (parseInt(that.data.lastEventIndex) + 1)
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.SearchCaseList:" + JSON.stringify(res))
                that.hideLoading()
                if (res.data.data.code == constant.response_success) {
                    for (let i = 0, len = res.data.data.list.length; i < len; i++) {
                        let caseInfo = res.data.data.list[i];
                        // 建档日期
                        if (caseInfo.create_time == 0) {
                            caseInfo.create_time = "暂无"
                        } else {
                            caseInfo.create_time = util.formatTime(caseInfo.create_time, 'Y-M-D');
                        }
                        if (caseInfo.last_time == 0) {
                            caseInfo.last_time = "暂无"
                        } else {
                            caseInfo.last_time = util.formatTime(caseInfo.last_time, 'Y-M-D');
                        }
                        if (caseInfo.last_element == 1) {
                            caseInfo.last_element = '基本信息'
                        } else if (caseInfo.last_element == 2) {
                            caseInfo.last_element = '诊断穿刺'
                        } else if (caseInfo.last_element == 3) {
                            caseInfo.last_element = '入院手术'
                        } else if (caseInfo.last_element == 4) {
                            caseInfo.last_element = '用药方案'
                        } else if (caseInfo.last_element == 5) {
                            caseInfo.last_element = '门诊随访'
                        }
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
                that.showToast(res.data.msg);
            }
        });
    },

    getProDoctor() {
        let doctorStr = ''
        if (this.data.doctorList.length > 0) {
            doctorStr = this.data.doctorList[this.data.doctorIndex]
            if (doctorStr == "全体医师") {
                doctorStr = ''
            }
        }
        return doctorStr;
    },

    onAddCase: function(e) {
        this.setData({
            modalName: 'AddCase'
        })

        this.clearDialogValue()
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
                        url: '../case/base/base?caseId=' + res.data.data.info.case_id + "&itemId=0" + "&centerId=" + that.data.centerId + "&centerName=" + that.data.centerName
                    });
                } else {
                    that.showModal("ErrModal", res.data.data.msg);
                    that.setData({
                        caseId: res.data.data.info.case_id,
                    })
                }
            },
            fail(res) {}
        });

        this.hideModal()
    },


    clearDialogValue() {
        this.setData({
            addCaseName: '',
            addCaseID: '',
            addCasePartIndex: 0,
            addCaseSideIndex: 0
        });
    },

    showExistCase(e) {
        this.hideModal()
        wx.navigateTo({
            url: '../case/timeline/timeline?caseInfo=' + this.makeCaseInfo() + "&centerId=" + this.data.centerId + "&centerName=" + this.data.centerName
        });
    },

    makeCaseInfo() {
        let caseInfo = {
            case_id: this.data.caseId,
            case_no: this.data.addCaseID,
            patient_name: this.data.addCaseName,
            side_name: this.data.addCaseSidePicker[this.data.addCaseSideIndex],
            part_name: this.data.addCasePartPicker[this.data.addCasePartIndex],
        }

        return JSON.stringify(caseInfo)
    },

    // 查看
    onLookCase: function(e) {
        let caseInfo = e.currentTarget.dataset.case;
        wx.navigateTo({
            url: '../case/timeline/timeline?caseInfo=' + JSON.stringify(caseInfo) + "&centerId=" + this.data.centerId + "&centerName=" + this.data.centerName + "&isLook=" + true
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
                    that.requestCaseList();
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
        }, 100);
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
        this.requestCaseList();
    },
    StatePickerChange(e) {
        this.setData({
            stateIndex: parseInt(e.detail.value)
        })
        this.requestCaseList();
    },
    DoctorPickerChange(e) {
        this.setData({
            doctorIndex: parseInt(e.detail.value)
        })
        this.requestCaseList();
    },
    LastEventPickerChange(e) {
        this.setData({
            lastEventIndex: e.detail.value
        })
        this.requestCaseList();
    },
    LimitPickerChange(e) {
        this.setData({
            limitIndex: e.detail.value
        })
        this.requestCaseList();
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
        this.initData()
    },

    // ============ 事件 end ============ //
});