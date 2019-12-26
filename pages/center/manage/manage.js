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
        tabList: ["公告管理", "中心成员"],
        currTab: 0,
        scrollLeft: 0,

        centerId: '',
        // --------------- 公共 end --------------- //

        // --------------- 通知公告 begin --------------- //
        currAvatar: '',
        currDate: '',
        loadProgress: 0,
        loadModal: false,
        modalName: "",
        emitter: null,
        noticeList: [],

        selectedItem: {},
        currNoticeTitle: '',
        currNoticeContent: "",
        currNoticeId: "",
        currIsTop: false,
        currNoticeDate: '',
        // 0:查看，1:新增，2:编辑
        noticeState: VIEW_STATE,
        // --------------- 通知公告 end --------------- //

        // --------------- 成员列表 begin --------------- //

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

    tabSelect(e) {
        this.setData({
            currTab: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.loadProgress();
        this.setData({
            centerId: options.centerId,
            isAdmin: app.globalData.is_admin == '1',
            currAvatar: app.globalData.avatarUrl,
            currNoticeDate: util.formatTime(new Date() / 1000, 'Y-M-D')
        });
        this.initData();
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
        }, 500);
    },
    hideModal: function(e) {
        this.setData({
            modalName: null
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

    // --------------- 公共 end --------------- //

    // --------------- 通知公告 begin --------------- //
    requestNotice() {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Notice.GetNoticeList',
                keyword: ''
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Notice.GetNoticeList:" + JSON.stringify(res))
                that.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    for (let i = 0, length = res.data.data.list.length; i < length; i++) {
                        let item = res.data.data.list[i];
                        if (item.ctime != null) {
                            item.ctime = util.formatTime(item.ctime, 'Y-M-D');
                        }
                    }
                    that.setData({
                        noticeList: res.data.data.list
                    });
                } else {
                    that.showToast(res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
    refresh() {
        this.requestNotice()
    },
    onDele(e) {
        this.setData({
            modalName: 'DeleteNoticeModal',
            selectedItem: e.currentTarget.dataset.item
        })
    },
    dele(e) {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Notice.DeleteNotice',
                openid: app.globalData.openid,
                center_id: that.data.centerId,
                notice_id: that.data.selectedItem.id
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Notice.DeleteNotice:" + JSON.stringify(res))
                that.hideLoading();
                that.hideModal();
                if (res.data.data.code == constant.response_success) {
                    that.requestNotice()
                } else {
                    that.showToast(res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
                that.hideModal();
            }
        });
    },
    onAddNotice: function(e) {
        this.setData({
            modalName: "NoticeDialog",
            noticeState: ADD_STATE,
            currNoticeContent: "",
            currNoticeTitle: "",
            currNoticeId: "",
            currAvatar: app.globalData.avatarUrl,
            currIsTop: false,
        })
    },
    addNotice() {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Notice.CreateNotice',
                openid: app.globalData.openid,
                center_id: that.data.centerId,
                title: that.data.currNoticeTitle,
                content: that.data.currNoticeContent
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Notice.CreateNotice:" + JSON.stringify(res))
                that.hideLoading();
                that.hideModal();
                that.clearData()
                if (res.data.data.code == constant.response_success) {
                    that.requestNotice()
                } else {
                    that.showToast(res.data.data.msg);
                }
            },
            fail(res) {
                that.hideModal();
                that.hideLoading();
            }
        });
    },
    onEdit(e) {
        this.setData({
            noticeState: EDIT_STATE,
            modalName: "NoticeDialog",
            currNoticeContent: e.currentTarget.dataset.item.content,
            currNoticeTitle: e.currentTarget.dataset.item.title,
            currNoticeId: e.currentTarget.dataset.item.id,
            currAvatar: e.currentTarget.dataset.item.staff_avatar,
            currIsTop: e.currentTarget.dataset.item.is_top == 1
        })
    },
    editNotice() {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Notice.EditNotice',
                openid: app.globalData.openid,
                center_id: that.data.centerId,
                notice_id: that.data.currNoticeId,
                content: that.data.currNoticeContent,
                title: that.data.currNoticeTitle,
                is_top: that.data.currIsTop ? 1 : 0
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Notice.EditNotice:" + JSON.stringify(res))
                that.hideLoading();
                that.hideModal();
                that.clearData()
                if (res.data.data.code == constant.response_success) {
                    that.requestNotice()
                } else {
                    that.showToast(res.data.data.msg);
                }
            },
            fail(res) {
                that.hideModal();
                that.hideLoading();
            }
        });
    },
    showNotice(e) {
        let that = this
        that.setData({
            noticeState: VIEW_STATE,
            modalName: "NoticeDialog",
            currNoticeContent: e.currentTarget.dataset.item.content,
            currNoticeTitle: e.currentTarget.dataset.item.title,
            currNoticeId: e.currentTarget.dataset.item.id,
            currAvatar: e.currentTarget.dataset.item.staff_avatar,
            currIsTop: e.currentTarget.dataset.item.is_top == 1
        })
    },
    onTopChange(e) {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Notice.SetTop',
                openid: app.globalData.openid,
                center_id: that.data.centerId,
                notice_id: that.data.currNoticeId,
                is_top: e.detail.value ? 1 : 0
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Notice.SetTop:" + JSON.stringify(res))
                if (res.data.data.code == constant.response_success) {
                    that.setData({
                        currIsTop: e.detail.value
                    });
                } else {
                    that.showToast(res.data.data.msg);
                }
            },
        });

    },
    onSubmit(e) {
        if (this.data.noticeState == EDIT_STATE) {
            this.editNotice()
        } else if (this.data.noticeState == ADD_STATE) {
            this.addNotice()
        }
    },
    clearData() {
        this.setData({
            selectedItem: {},
            currNoticeTitle: '',
            currNoticeContent: '',
            currNoticeId: '',
            currIsTop: false,
            currNoticeDate: '',
            noticeState: VIEW_STATE
        })
    },
    // ============== UI begin ============== //
    onHide: function() {
        this.setData({
            modalName: ''
        });
    },
    onShow: function() {
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

    onTitleInput: function(e) {
        this.setData({
            currNoticeTitle: e.detail.value
        });
    },
    onNoticeInput: function(e) {
        this.setData({
            currNoticeContent: e.detail.value
        });
    },
    // --------------- 通知公告 end--------------- //

    // --------------- 成员列表 begin--------------- //
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
        this.requestCenterStaffList(this.data.searchValue);
        this.requestNotice();
    },

    requestCenterStaffList: function(searchValue) {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.SearchCenterMember',
                center_id: that.data.centerId,
                keyword: '',
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
                that.completeProgress();
            },
            fail(res) {
                that.completeProgress();
            }
        });
    },
    showModal: function(e) {
        this.setData({
            modalName: e.currentTarget.dataset.target,
            roleId: '',
            selectedStaff: e.target.dataset.staff
        });
    },

    gotoMember(e) {
        let item = e.currentTarget.dataset.item
        wx.navigateTo({
            url: '../manage/member/member?memberId=' + item.member_id
        });
    },

    deleteMember: function(e) {
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
    // --------------- 成员列表 end--------------- //
})