'use strict';

import C2Pin from 'c2pin';

let constant = require('../../../utils/constant.js');
let util = require('../../../utils/util.js');

const app = getApp();

const VIEW_STATE = 0;
const ADD_STATE = 1;
const EDIT_STATE = 2;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // --------------- 公共 begin --------------- //
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        scrollLeft: 0,

        centerId: '',
        // --------------- 公共 end --------------- //


        // --------------- 成员列表 begin --------------- //
        currAvatar: '',
        currDate: '',
        loadProgress: 0,
        loadModal: false,
        modalName: "",
        emitter: null,
        hidden: true,
        isAdmin: false,
        roleList: [],
        roleId: '',
        staffList: {},
        selectedStaff: {},
        indexBarDisplay: false,

        // --------------- 成员列表 end --------------- //

    },

    // --------------- 公共 begin --------------- //

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadProgress();
        this.setData({
            centerId: options.centerId,
            isAdmin: app.globalData.is_admin == '1',
            currAvatar: app.globalData.avatarUrl,
        });
        this.initData();
        this.completeProgress()
    },

    initData: function () {
        this.requestCenterStaffList(this.data.searchValue);
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
        }, 500);
    },
    hideModal: function (e) {
        this.setData({
            modalName: null
        });
    },

    // --------------- 公共 end --------------- //

  
    // ============== UI begin ============== //
    onHide: function () {
        this.setData({
            modalName: ''
        });
    },
    onShow: function () {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 3,
                emitter: app.globalData.emitter
            });
            app.globalData.emitter.on('addEmitter', () => {
                console.log("person modal");
            });
        }
    },

    // --------------- 成员列表 begin--------------- //
    onReady: function () {
        let that = this;
        wx.createSelectorQuery().select('.indexBar-box').boundingClientRect(function (res) {
            that.setData({
                boxTop: res ? res.top : 0
            });
        }).exec();
        wx.createSelectorQuery().select('.indexes').boundingClientRect(function (res) {
            that.setData({
                barTop: res ? res.top : 0
            });
        }).exec();
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

    requestCenterStaffList: function (searchValue) {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.SearchCenterMember',
                center_id: that.data.centerId,
                // keyword: '',
                sort: 1
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.data.code == constant.response_success) {
                    let list = [];
                    let realStaffList = {};
                    let sortByPrefix = {};
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
                    list.sort();
                    for (let i = 0, len = list.length; i < len; i++) {
                        let prefix = list[i];
                        if (!sortByPrefix[prefix]) {
                            sortByPrefix[prefix] = [];
                        }
                        sortByPrefix[prefix] = realStaffList[prefix]
                    }
                    that.setData({
                        staffList: sortByPrefix,
                        list: [...new Set(list)],
                        listCur: realListCur
                    });
                } else {
                    that.showToast(res.data.msg);
                }
            },
            fail(res) {}
        });
    },
    showModal: function (e) {
        this.setData({
            modalName: e.currentTarget.dataset.target,
            roleId: '',
            selectedStaff: e.target.dataset.staff
        });
    },

    gotoMember(e) {
        let item = e.currentTarget.dataset.item
        wx.navigateTo({
            url: './member-detail/member-detail?memberId=' + item.member_id
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
                }
                
                that.completeProgress();
                that.setData({
                    modalName: ''
                });
            },
            fail(res) {
                that.completeProgress();
            }
        });
    },
    // --------------- 成员列表 end--------------- //
})