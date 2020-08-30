'use strict';

let constant = require('../../utils/constant.js');
let util = require('../../utils/util.js');

const app = getApp();


Page({
    data: {
        loadProgress: 0,
        loadModal: false,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        isAdmin: false,
        searchValue: '',
        centerList: [],
        centerIndex: 0,
        centerInfo: {},
        visibleCenter: false,
        centerName: '',
    },
    onHide: function () {
        this.setData({
            modalName: ''
        });
    },
    onShow: function () {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 0,
                emitter: app.globalData.emitter
            });
        }
        app.globalData.emitter.on('addEmitter', () => {
            this.setData({
                modalName: 'AddCenterModal'
            });
        });
        this.onLoad();
    },
    onLoad: function () {
        this.loadProgress()
        let that = this;
        this.setData({
            isAdmin: app.globalData.is_admin == '1'
        });
        this.initData();
        this.completeProgress()
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
    showModal: function (msg) {
        this.setData({
            modalName: "AddCenterModal"
        });
    },
    hideModal: function (e) {
        this.setData({
            modalName: null
        });
    },
    initData: function () {
        let that = this;
        // that.showLoading()
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.SearchStaffCenter',
                openid: app.globalData.openid
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                // that.hideLoading()
                if (res.data.data.code == constant.response_success) {
                    for (let i = 0, len = res.data.data.list.length; i < len; i++) {
                        let center = res.data.data.list[i];
                        if (center.center_ctime != null) {
                            center.center_ctime = util.formatTime(center.center_ctime, 'Y-M-D');
                        }
                        if (center.center_leader == null) {
                            center.center_leader = '暂无';
                        }
                        center.center_name_prefix_letter = center.center_name.substr(0, 1);
                        let total = center.completed_cases + center.no_approve_cases + center.no_completed_cases;
                        if (total == 0) {
                            center.completed_percentage = 0;
                            center.no_approve_percentage = 0;
                            center.no_completed_percentage = 0;
                        } else {
                            center.completed_percentage = Math.round((center.completed_cases / total) * 100) / 100;
                            center.no_approve_percentage = Math.round((center.no_approve_cases / total) * 100) / 100;
                            center.no_completed_percentage = Math.round((center.no_completed_cases / total) * 100) / 100;
                        }
                        if (center.notice && center.notice.length > 0) {
                            center.topNotice = center.notice[0]
                        }
                    }
                    that.setData({
                        centerList: res.data.data.list,
                        centerInfo: res.data.data.list[that.data.centerIndex]
                    });
                } else {
                    that.showToast(res.data.msg);
                }
            },
            fail(res) {
                that.hideLoading()
            }
        });
    },

    onCenterChange: function (e) {
        this.setData({
            centerIndex: parseInt(e.detail.value)
        });
    },

    // onSearchChange: function(e) {
    //     this.setData({
    //         searchValue: e.detail.value
    //     });
    // },
    // onSearch: function(e) {
    //     let that = this;
    //     that.showLoading();
    //     wx.request({
    //         url: constant.basePath,
    //         data: {
    //             service: 'Center.SearchStaffCenter',
    //             openid: app.globalData.openid,
    //             keyword: that.data.searchValue
    //         },
    //         header: {
    //             'content-type': 'application/json'
    //         },
    //         success(res) {
    //             that.hideLoading();
    //             if (res.data.data.code == constant.response_success) {
    //                 for (let i = 0, len = res.data.data.list.length; i < len; i++) {
    //                     let center = res.data.data.list[i];
    //                     if (center.center_ctime != null) {
    //                         center.center_ctime = util.formatTime(center.center_ctime, 'Y-M-D');
    //                     }
    //                     if (center.center_leader == null) {
    //                         center.center_leader = '暂无';
    //                     }
    //                     center.center_name_prefix_letter = center.center_name.substr(0, 1);
    //                     let total = center.completed_cases + center.no_approve_cases + center.no_completed_cases;
    //                     if (total == 0) {
    //                         center.completed_percentage = 0;
    //                         center.no_approve_percentage = 0;
    //                         center.no_completed_percentage = 0;
    //                     } else {
    //                         center.completed_percentage = Math.round((center.completed_cases / total) * 100) / 100;
    //                         center.no_approve_percentage = Math.round((center.no_approve_cases / total) * 100) / 100;
    //                         center.no_completed_percentage = Math.round((center.no_completed_cases / total) * 100) / 100;
    //                     }
    //                 }
    //                 that.setData({
    //                     centerList: res.data.data.list
    //                 });

    //             } else {
    //                 that.showToast(res.data.msg);
    //             }
    //         },
    //         fail(res) {
    //             that.hideLoading();
    //         }
    //     });
    // },
    onClickCase: function (e) {
        wx.navigateTo({
            url: '../center/case/case?centerId=' + this.data.centerInfo.center_id + "&centerName=" + this.data.centerInfo.center_name
        });
    },
    onClickStats: function (e) {
        wx.navigateTo({
            url: '../stats/stats?centerId=' + this.data.centerInfo.center_id
        });
    },
    onClickSpecimen: function (e) {
        wx.navigateTo({
            url: '../center/specimen/specimen?centerId=' + this.data.centerInfo.center_id + "&centerName=" + this.data.centerInfo.center_name
        })
    },
    onClickMember: function (e) {
        wx.navigateTo({
            url: './member/member?centerId=' + this.data.centerInfo.center_id
        })
    },

    onClickNotice(e) {
        wx.navigateTo({
            url: '../center/notice/notice?centerId=' + this.data.centerInfo.center_id
        })
    },

    centerNameInput: function (e) {
        this.setData({
            centerName: e.detail.value
        });
    },
    addCenter: function () {
        let that = this;
        if (that.data.centerName.length == 0) {
            that.showToast('请输入中心名');
            return
        }
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.CreateCenter',
                openid: app.globalData.openid,
                center_name: that.data.centerName
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    that.initData();
                } else {
                    that.showToast(res.data.msg);
                }
                that.setData({
                    modalName: ''
                });
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
    backToAuth: function () {
        wx.navigateTo({
            url: '../auth/auth'
        });
    }
});