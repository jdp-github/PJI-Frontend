'use strict';

let constant = require('../../../utils/constant.js');
let util = require('../../../utils/util.js');
import C2Pin from 'c2pin';

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
        searchValue: '',
        roleList: [],
        roleId: '',
        staffList: {},
        selectedStaff: {},
        indexBarDisplay: true
    },
    onLoad: function (options) {
        this.loadProgress();
        this.setData({
            centerId: options.centerId,
            isAdmin: app.globalData.is_admin == '1',
        });
        this.initData();
    },
    onReady: function () {
        let that = this;
        wx.createSelectorQuery().select('.indexBar-box').boundingClientRect(function (res) {
            that.setData({
                boxTop: res.top
            });
        }).exec();
        wx.createSelectorQuery().select('.indexes').boundingClientRect(function (res) {
            that.setData({
                barTop: res.top
            });
        }).exec();
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
    getCurrent: function (e) {
        this.setData({
            hidden: false,
            listCur: this.data.list[e.target.id],
        });
    },

    setCurrent: function (e) {
        this.setData({
            hidden: true,
            listCur: this.data.listCur
        });
    },
    tMove: function (e) {
        let y = e.touches[0].clientY,
            offsettop = this.data.boxTop,
            that = this;
        if (y > offsettop) {
            let num = parseInt((y - offsettop) / 20);
            this.setData({
                listCur: that.data.list[num]
            });
        }
    },
    tStart: function () {
        this.setData({
            hidden: false
        });
    },
    tEnd: function () {
        this.setData({
            hidden: true,
            listCurID: this.data.listCur
        });
    },
    indexSelect: function (e) {
        let that = this;
        let barHeight = this.data.barHeight;
        let list = this.data.list;
        let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
        for (let i = 0; i < list.length; i++) {
            if (scrollY < i + 1) {
                that.setData({
                    listCur: list[i],
                    movableY: i * 20
                });
                return false
            }
        }
    },
    initData: function () {
        this.requestRoleList();
        this.requestCenterStaffList(this.data.searchValue);
    },
    requestRoleList: function () {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.GetCenterRole'
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.data.code == constant.response_success) {
                    that.setData({
                        roleList: res.data.data.list,
                    });
                } else {
                    that.showToast(res.data.msg);
                }
            },
            fail(res) {
            }
        });
    },
    requestCenterStaffList: function (searchValue) {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.SearchCenterMember',
                center_id: that.data.centerId,
                keyword: searchValue,
                sort: 1
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.data.code == constant.response_success) {
                    let list = [];
                    let realStaffList = {};
                    let realListCur = '';
                    for (let i = 0, len = res.data.data.list.length; i < len; i++) {
                        let staff = res.data.data.list[i];
                        staff.auth_time = util.formatTime(staff.auth_time, 'Y-M-D');
                        let prefixLetter = C2Pin.firstChar(res.data.data.list[i].staff_name).substr(0, 1).toUpperCase();
                        list[i] = prefixLetter;
                        // 重新组织相同首字母的人员
                        if (!realStaffList[prefixLetter]) {
                            realStaffList[prefixLetter] = [];
                        }
                        realStaffList[prefixLetter].push(staff);
                    }
                    if (list.length == 0) {
                        realListCur = ''
                    } else {
                        realListCur = list[0];
                    }
                    that.setData({
                        staffList: realStaffList,
                        list: [...new Set(list)],
                        listCur: realListCur
                    });
                } else {
                    that.showToast(res.data.msg);
                }
                that.completeProgress();
            },
            fail(res) {
                that.completeProgress();
            }
        });
    },
    onSearchChange: function (e) {
        this.setData({
            searchValue: e.detail.value
        });
    },
    onSearch: function (e) {
        this.loadProgress();
        this.requestCenterStaffList(this.data.searchValue);
    },
    ListTouchStart: function (e) {
        this.setData({
            ListTouchStart: e.touches[0].pageX,
            indexBarDisplay: false
        });
    },

    ListTouchMove: function (e) {
        this.setData({
            ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left',
            indexBarDisplay: false
        });
    },

    ListTouchEnd: function (e) {
        if (this.data.ListTouchDirection == 'left') {
            this.setData({
                modalName: e.currentTarget.dataset.target
            });
        } else {
            this.setData({
                modalName: null,
                indexBarDisplay: true
            });
        }
        this.setData({
            ListTouchDirection: null
        });
    },
    showModal: function (e) {
        this.setData({
            modalName: e.currentTarget.dataset.target,
            roleId: '',
            selectedStaff: e.target.dataset.staff
        });
    },
    hideModal: function (e) {
        this.setData({
            modalName: null
        });
    },
    onRoleChange: function (e) {
        this.setData({
            roleId: e.detail.value
        });
    },
    editMember: function (e) {
        let that = this;
        that.loadProgress();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.EditCenterMember',
                openid: app.globalData.openid,
                member_id: that.data.selectedStaff.member_id,
                role_id: this.data.roleId
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.data.code == constant.response_success) {
                    that.requestCenterStaffList(that.data.searchValue);
                } else {
                    that.showToast(res.data.msg);
                    that.completeProgress();
                }
                that.setData({
                    modalName: ''
                });
            },
            fail(res) {
                that.completeProgress();
            }
        });
    },
    deleteMember: function (e) {
        let that = this;
        that.loadProgress();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.DeleteCenterMember',
                openid: app.globalData.openid,
                member_id: that.data.selectedStaff.member_id
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.data.code == constant.response_success) {
                    that.requestCenterStaffList(that.data.searchValue)
                } else {
                    that.showToast(res.data.msg);
                    that.completeProgress();
                }
                that.setData({
                    modalName: ''
                });
            },
            fail(res) {
                that.completeProgress();
            }
        });
    },
    onPageScroll: function (e) {
    }
});