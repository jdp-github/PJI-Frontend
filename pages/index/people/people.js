"use strict";
const app = getApp();
Page({
    data: {
        centerId: '',
        staffList: [],
        staffTempList: [], // 存储数据，搜索清空是恢复数据用
        searchValue: '',
        visiblePeople: false,
        filterItems: [{
                type: 'sort',
                label: '姓名',
                value: 'name',
                groups: ['001'],
            },
            {
                type: 'text',
                label: '中心',
                value: 'center',
                groups: ['002'],
            },
            {
                type: 'sort',
                label: '角色',
                value: 'role',
                groups: ['003'],
            },
            {
                type: 'sort',
                label: '授权日期',
                value: 'authorization_date',
                groups: ['004'],
            },
        ],
    },
    onLoad: function(options) {
        // this.setData({
        //     centerId: options.centerId
        // })
        // this.initData();
        this.getUsers()
    },

    getUsers(params = {}) {
        wx.showLoading();
        this.setData({
            staffList: [{
                    staff_avatar: "https://avatars3.githubusercontent.com/u/36479205?s=400&u=cb3d4cf7f58f5cfe4602199485cfec3b60527d08&v=4",
                    staff_name: "李文浩",
                    center: '骨头中心',
                    role_name: '中心管理员',
                    auth_time: "2018-12-24"
                },
                {
                    staff_avatar: "https://avatars3.githubusercontent.com/u/36479205?s=400&u=cb3d4cf7f58f5cfe4602199485cfec3b60527d08&v=4",
                    staff_name: "季大鹏",
                    center: '骨头中心',
                    role_name: '项目负责人',
                    auth_time: "2018-12-24"
                }
            ]
        });
        wx.hideLoading();
    },

    // ------------- filter begin ------------- //
    onFilterChange(e) {
        const checkedItems = e.detail.checkedItems;
        const params = {};

        checkedItems.forEach((n) => {
            if (n.checked) {
                if (n.value === 'name') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? 'asc' : 'desc'
                } else if (n.value === 'role') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? 'asc' : 'desc'
                }
            }
        });
    },

    onFilterOpen(e) {
        this.setData({
            pageStyle: 'height: 100%; overflow: hidden',
        })
    },
    onFilterClose(e) {
        this.setData({
            pageStyle: '',
        })
    },
    // ------------- filter end ------------- //

    // ------------- search begin ------------- //
    onSearchChange(e) {
        var that = this
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.SearchCenterMember',
                center_id: that.data.centerId,
                keyword: 'e.detail.value'
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                // console.log(JSON.stringify(res))
                wx.hideLoading()
                that.setData({
                    staffList: res.data.data.list
                })
            },
            fail(res) {
                wx.hideLoading()
            }
        })
    },
    onSearchFocus(e) {},
    onSearchBlur(e) {},
    onSearchConfirm(e) {},
    onSearchClear(e) {
        this.setData({
            staffList: this.data.staffTempList
        });
    },
    onSearchCancel(e) {},
    // ------------- search end ------------- //

    // ------------- pop begin ------------- //
    operationBtn(e) {
        this.setData({
            visiblePeople: true,
        });
    },
    onPeopleClose(e) {},
    // 保存
    popSave() {
        this.setData({
            visiblePeople: false,
        })
    },
    // 删除
    popDele() {
        this.setData({
            visiblePeople: false,
        })
    },
    // 取消
    popCancel(e) {
        this.setData({
            visiblePeople: false,
        })
    },
    // ------------- pop end ------------- //

    initData() {
        var that = this
        wx.showLoading({
            title: '请求数据中...',
        })
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Center.GetCenterMember',
                center_id: that.data.centerId
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                // console.log(JSON.stringify(res))
                wx.hideLoading()
                that.setData({
                    staffList: res.data.data.list,
                    staffTempList: res.data.data.list
                })
            },
            fail(res) {
                wx.hideLoading()
            }
        })
    }
});