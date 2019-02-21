"use strict";
const app = getApp();
var constant = require('../../utils/constant.js');
var util = require('../../utils/util.js');

const SORT_BY_NAME_ASC = 1
const SORT_BY_NAME_DESC = -1
const SORT_BY_CREATE_DATE_ASC = 2
const SORT_BY_CREATE_DATE_DESC = -2
const SORT_BY_UPDATE_DATE_ASC = 3
const SORT_BY_UPDATE_DATE_DESC = -3
const SORT_BY_LOCK_ASC = 4
const SORT_BY_LOCK_DESC = -4

Page({
    data: {
        // 中心相关
        centerId: '',
        // 搜索关键词
        searchValue: '',
        // 排序
        sortType: SORT_BY_NAME_ASC,
        filterItems: [{
                type: 'sort',
                label: '名称',
                value: 'name',
                groups: ['001'],
            },
            {
                type: 'sort',
                label: '启用时间',
                value: 'create_date',
                groups: ['002'],
            },
            {
                type: 'sort',
                label: '修改时间',
                value: 'update_date',
                groups: ['003'],
            },
            {
                type: 'sort',
                label: '锁定',
                value: 'lock',
                groups: ['004'],
            },
        ],
        boxList: [],
        // 新增标本盒名
        boxName: '',
        // 新增标本盒存放点
        depositary: '',
        visibleBox: false,
    },

    // -------- filter begin -------- //
    onFilterChange(e) {
        const checkedItems = e.detail.checkedItems;
        const params = {};

        checkedItems.forEach((n) => {
            if (n.checked) {
                if (n.value === 'name') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? SORT_BY_NAME_ASC : SORT_BY_NAME_DESC
                } else if (n.value === 'create_date') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? SORT_BY_CREATE_DATE_ASC : SORT_BY_CREATE_DATE_DESC
                } else if (n.value === 'update_date') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? SORT_BY_UPDATE_DATE_ASC : SORT_BY_UPDATE_DATE_DESC
                } else if (n.value === 'lock') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? SORT_BY_LOCK_ASC : SORT_BY_LOCK_DESC
                }

                this.setData({
                    sortType: params.order
                })
                this.requestBoxList(this.data.searchValue, this.data.sortType)
            }
        });
    },
    // -------- filter end -------- //

    // -------- search begin -------- //
    onSearchChange(e) {
        this.setData({
            searchValue: e.detail.value
        });
        this.requestBoxList(this.data.searchValue, this.data.sortType)
    },
    onSearchClear(e) {
        this.setData({
            searchValue: ''
        });
        this.requestBoxList(this.data.searchValue, this.data.sortType)
    },
    onSearchCancel(e) {
        this.onSearchClear()
    },
    // -------- search end -------- //

    // -------- 新增标本盒 begin -------- //
    addBox(e) {
        this.setData({
            visibleBox: true,
        });
    },
    okAddBox() {
        var that = this;
        if (that.data.boxName.length == 0) {
            wx.showToast({
                icon: 'none',
                title: '请输入标本盒名称',
            })
            return
        }
        if (that.data.depositary.length == 0) {
            wx.showToast({
                icon: 'none',
                title: '请输入标本盒存放地点',
            })
            return
        }
        this.setData({
            visibleBox: false
        })
        wx.showLoading({
            title: '新增标本盒...',
        })
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.CreateSampleBox',
                openid: app.globalData.openid,
                center_id: that.data.centerId,
                name: that.data.boxName,
                depositary: that.data.depositary
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Sample.CreateSampleBox:" + JSON.stringify(res))
                wx.hideLoading()
                if (res.data.data.code == constant.response_success) {
                    that.requestBoxList(that.data.searchValue, that.data.sortType)
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: res.data.data.msg,
                    })
                }
            },
            fail(res) {
                wx.hideLoading()
            }
        })
    },
    onBoxClose(e) {
        this.setData({
            boxName: '',
            depositary: ''
        })
    },
    closeBox(e) {
        this.setData({
            visibleBox: false,
            boxName: '',
            depositary: ''
        })
    },
    onInput(e) {
        if (e.target.dataset.prop == "boxName") {
            this.setData({
                boxName: e.detail.value
            })
        } else if (e.target.dataset.prop == "depositary") {
            this.setData({
                depositary: e.detail.value
            })
        }
    },
    onClear(e) {
        if (e.target.dataset.prop == "boxName") {
            this.setData({
                boxName: ""
            })
        } else if (e.target.dataset.prop == "depositary") {
            this.setData({
                depositary: ""
            })
        }
    },
    // -------- 新增标本盒 end -------- //

    onLoad: function(options) {
        this.setData({
            centerId: options.centerId
        })
        this.initData()
    },

    onPullDownRefresh() {
        this.initData()
    },

    initData() {
        this.requestBoxList(this.data.searchValue, this.data.sortType)
    },

    requestBoxList(searchValue, sortType) {
        wx.showLoading({
            title: '请求数据中...',
        });
        let that = this;

        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.GetSampleBoxList',
                openid: app.globalData.openid,
                center_id: that.data.centerId,
                keyword: searchValue,
                sort: sortType
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Sample.GetSampleBoxList:" + JSON.stringify(res))
                wx.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    for (var i = 0, len = res.data.data.list.length; i < len; i++) {
                        var box = res.data.data.list[i]
                        if (box.ctime > 0) {
                            box.ctime = util.formatTime(box.ctime, 'Y-M-D')
                        }
                        if (box.utime > 0) {
                            box.utime = util.formatTime(box.utime, 'Y-M-D')
                        }
                    }
                    that.setData({
                        boxList: res.data.data.list
                    })
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: res.data.data.msg,
                    })
                }
            },
            fail(res) {
                wx.hideLoading();
            }
        })
    },

    onItemClick(e) {
        wx.navigateTo({
            url: '../specimen/detail/detail?boxId=' + e.currentTarget.dataset.selecteditem.id + '&centerId?' + this.data.centerId
        })
    },

    // 删除
    onDele(e) {
        var that = this
        var selectedItem = e.target.dataset.selecteditem
        wx.showModal({
            title: '提示',
            content: '确定删除 [' + selectedItem.name + "] ?",
            success(res) {
                if (res.confirm) {
                    that.deleBox(selectedItem.id)
                } else if (res.cancel) {

                }
            }
        })
    },

    deleBox(boxId) {
        var that = this
        wx.showLoading({
            title: '删除标本盒中...',
        })
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.DeleteSampleBox',
                openid: app.globalData.openid,
                box_id: boxId
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Sample.DeleteSampleBox:" + JSON.stringify(res))
                wx.hideLoading()
                if (res.data.data.code == constant.response_success) {
                    that.requestBoxList(that.data.searchValue, that.data.sortType)
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: res.data.data.msg,
                    })
                }
            },
            fail(res) {
                wx.hideLoading()
            }
        })
    },

    // 锁定
    onLock(e) {
        var box = e.target.dataset.selecteditem;
        var title = box.is_lock == 0 ? "锁定中..." : "解锁中..."
        wx.showLoading({
            title: title,
        })

        var that = this
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.SetLock',
                openid: app.globalData.openid,
                box_id: box.id,
                type: box.is_lock == 0 ? 1 : 0
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Sample.SetLock:" + JSON.stringify(res))
                wx.hideLoading()
                if (res.data.data.code == constant.response_success) {
                    that.requestBoxList(that.data.searchValue, that.data.sortType)
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: res.data.data.msg,
                    })
                }
            },
            fail(res) {
                wx.hideLoading()
            }
        })
    },
});