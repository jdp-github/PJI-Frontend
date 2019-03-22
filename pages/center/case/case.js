'use strict';

let constant = require('../../../utils/constant.js');
let util = require('../../../utils/util.js');

const app = getApp();
const SORT_BY_DOCTOR_ASC = 1;
const SORT_BY_DOCTOR_DESC = -1;
const SORT_BY_INFLECT_ASC = 2;
const SORT_BY_INFLECT_DESC = -2;

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
        caseList: [],
        selectedCase: {},
        sortType: SORT_BY_DOCTOR_ASC,
        filterItems: [{
                type: 'sort',
                label: '主诊医师',
                value: 'doctor',
                groups: ['001'],
            },
            {
                type: 'sort',
                label: '感染',
                value: 'inflect',
                groups: ['002'],
            },
        ],
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
        this.requestCaseList(this.data.searchValue, this.data.sortType);
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
    onSearchChange: function(e) {
        this.setData({
            searchValue: e.detail.value
        });
    },
    onSearch: function() {
        this.loadProgress();
        this.requestCaseList(this.data.searchValue, this.data.sortType);
    },
    onFilterChange(e) {
        const checkedItems = e.detail.checkedItems;
        const params = {};

        checkedItems.forEach((n) => {
            if (n.checked) {
                if (n.value === 'doctor') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? SORT_BY_DOCTOR_ASC : SORT_BY_DOCTOR_DESC;
                } else if (n.value === 'inflect') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? SORT_BY_INFLECT_ASC : SORT_BY_INFLECT_DESC;
                }

                this.setData({
                    sortType: params.order
                });
                this.loadProgress();
                this.requestCaseList(this.data.searchValue, this.data.sortType);
            }
        });
    },
    onFilterOpen: function(e) {
        this.setData({
            pageStyle: 'height: 100%; overflow: hidden',
        });
    },
    onFilterClose: function(e) {
        this.setData({
            pageStyle: '',
        });
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
    requestCaseList: function(searchValue, sortType) {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.SearchCaseList',
                openid: app.globalData.openid,
                center_id: that.data.centerId,
                keyword: searchValue,
                sort: sortType
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.data.code == constant.response_success) {
                    for (let i = 0, len = res.data.data.list.length; i < len; i++) {
                        let caseInfo = res.data.data.list[i];
                        caseInfo.puncture_date = util.formatTime(caseInfo.puncture_date, 'Y-M-D');
                        caseInfo.operation_date = util.formatTime(caseInfo.operation_date, 'Y-M-D')
                        caseInfo.patient_name_prefix_letter = caseInfo.patient_name.substr(0, 1);
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
        wx.navigateTo({
            url: '../../center/case/detail/detail?centerId=' + this.data.centerId + "&centerName=" + this.data.centerName + "&case_id="
        });
    },
    onEditCase: function(e) {
        let that = this;
        that.showLoading();
        let caseInfo = e.currentTarget.dataset.case;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.SetCaseWritingStaff',
                openid: app.globalData.openid,
                case_id: caseInfo.case_id,
                type: 1
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.data.code == 0) {
                    wx.navigateTo({
                        url: '../../center/case/detail/detail?case_id=' + caseInfo.case_id + "&centerId=" + that.data.centerId + "&centerName=" + that.data.centerName
                    });
                } else {
                    that.showModal("ErrModal", res.data.data.msg);
                }
                that.hideLoading();
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },

    // onLockCase: function(e) {
    //     let that = this;
    //     let selectedCase = e.currentTarget.dataset.case;
    //     let isApprove = selectedCase.state == 2
    //     let title = isApprove ? '解锁中...' : '锁定病历中...';
    //     // 1审批，2解锁
    //     let type = isApprove ? 2 : 1;
    //     that.showLoading();
    //     wx.request({
    //         url: constant.basePath,
    //         data: {
    //             service: 'Case.Approve',
    //             openid: app.globalData.openid,
    //             case_id: selectedCase.case_id,
    //             type: type
    //         },
    //         header: {
    //             'content-type': 'application/json'
    //         },
    //         success(res) {
    //             that.hideLoading();
    //             if (res.data.data.code == constant.response_success) {
    //                 that.requestCaseList(that.data.searchValue, that.data.sortType);
    //             } else {
    //                 that.showModal("ErrModal", res.data.msg);
    //             }
    //         },
    //         fail(res) {
    //             that.hideLoading();
    //         }
    //     })
    // },

    onDeleCase: function(e) {
        let selectedCase = e.currentTarget.dataset.case;
        this.setData({
            selectedCase: selectedCase
        });
        this.showModal("DeleteCaseModal");
    },
    deleCase: function() {
        let that = this;
        that.showLoading();
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
                that.hideLoading()
                if (res.data.data.code == constant.response_success) {
                    that.requestCaseList(that.data.searchValue, that.data.sortType);
                } else {
                    that.showModal("ErrModal", res.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
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
    onPageScroll: function(e) {

    }
});