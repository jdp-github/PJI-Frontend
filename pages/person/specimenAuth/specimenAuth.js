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
        loadProgress: 0,
        loadModal: false,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,

        centerIndex: 0,
        centerList: [],
        centerNameList: [],
        hidden: true,
        isAdmin: false,
        staffList: {},
        selectedStaff: {},
        indexBarDisplay: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.loadProgress();
        this.initData();
        this.completeProgress()
    },

    // -------------- 公共事件 begin -------------- //
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
        }, 500);
    },
    hideModal: function(e) {
        this.setData({
            modalName: null
        });
    },
    // -------------- 公共事件 begin -------------- //

    CenterPickerChange(e) {
        this.setData({
            centerIndex: parseInt(e.detail.value)
        })
        this.requestCenterStaffList(that.data.centerList[this.data.centerIndex].center_id);
    },

    onReady: function() {
        let that = this;
        wx.createSelectorQuery().select('.indexBar-box').boundingClientRect(function(res) {
            that.setData({
                boxTop: res ? res.top : 0
            });
        }).exec();
        wx.createSelectorQuery().select('.indexes').boundingClientRect(function(res) {
            that.setData({
                barTop: res ? res.top : 0
            });
        }).exec();
    },
    getCurrent: function(e) {
        this.setData({
            hidden: false,
            listCur: this.data.list[e.target.id],
        });
    },

    setCurrent: function(e) {
        this.setData({
            hidden: true,
            listCur: this.data.listCur
        });
    },
    tMove: function(e) {
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
    tStart: function() {
        this.setData({
            hidden: false
        });
    },
    tEnd: function() {
        this.setData({
            hidden: true,
            listCurID: this.data.listCur
        });
    },
    indexSelect: function(e) {
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
    initData: function() {
        this.requestCenterList();
    },

    requestCenterList() {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Staff.GetStaffInfo',
                openid: app.globalData.openid
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.data.code == constant.response_success) {
                    let centerNameList = []
                    res.data.data.info.center_list.forEach(item => {
                        centerNameList.push(item.center_name)
                    })
                    that.setData({
                        centerList: res.data.data.info.center_list,
                        centerNameList: centerNameList
                    });
                    that.requestCenterStaffList(that.data.centerList[0].center_id);
                } else {
                    that.showToast(res.data.data.msg);
                }
            },
            fail(res) {}
        });
    },

    requestCenterStaffList(centerId) {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.SearchCenterMember',
                center_id: centerId,
                // keyword: '',
                sort: 1
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Center.SearchCenterMember:" + JSON.stringify(res))
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
    onAuth(e) {
        let that = this;
        let staff = e.currentTarget.dataset.item
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.ApplySampleAuth',
                openid: app.globalData.openid,
                staff_id: staff.staff_id
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.data.code == constant.response_success) {
                    that.showToast("已向 " + staff.staff_name + " 申请授权")
                } else {
                    that.showToast(res.data.data.msg);
                }
            },
            fail(res) {

            }
        });
    },
    // --------------- 成员列表 end--------------- //
})