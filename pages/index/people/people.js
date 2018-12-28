"use strict";
const app = getApp();
Page({
    data: {
        searchValue: '',
        filterItems: [{
            type: 'sort',
            label: '姓名',
            value: 'name',
            groups: ['001'],
        },
            {
                type: 'sort',
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
    onLoad() {
        this.getUsers();

    },
    onFilterChange(e) {
        const checkedItems = e.detail.checkedItems;
        const params = {};

        checkedItems.forEach((n) => {
            if (n.checked) {
                if (n.value === 'name') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? 'asc' : 'desc'
                } else if (n.value === 'center') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? 'asc' : 'desc'
                } else if (n.value === 'role') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? 'asc' : 'desc'
                }
            }
        });

        this.getUsers(params)
    },
    getUsers(params = {}) {
        wx.showLoading();
        this.setData({
            users: [
                {
                    avatar: "https://avatars3.githubusercontent.com/u/36479205?s=400&u=cb3d4cf7f58f5cfe4602199485cfec3b60527d08&v=4",
                    name: "李文浩",
                    center: '骨头中心',
                    role: '中心管理员',
                    authorization_date: "2018-12-24"
                },
                {
                    avatar: "https://avatars3.githubusercontent.com/u/36479205?s=400&u=cb3d4cf7f58f5cfe4602199485cfec3b60527d08&v=4",
                    name: "季大鹏",
                    center: '血液中心',
                    role: '中心管理员',
                    authorization_date: "2018-12-24"
                }
            ]
        });
        wx.hideLoading();
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
    onSearchChange(e) {
        this.setData({
            value: e.detail.value,
        });
    },
    onSearchFocus(e) {},
    onSearchBlur(e) {},
    onSearchConfirm(e) {},
    onSearchClear(e) {
        this.setData({
            searchValue: '',
        });
    },
    onSearchCancel(e) {}
});