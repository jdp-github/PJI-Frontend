"use strict";
Page({
    data: {
        searchValue: '',
        filterItems: [
            {
                type: 'sort',
                label: '姓名',
                value: 'name',
                groups: ['001'],
            },
            {
                type: 'sort',
                label: 'ID',
                value: 'id',
                groups: ['002'],
            },
            {
                type: 'sort',
                label: '建档日期',
                value: 'create_date',
                groups: ['003'],
            },
            {
                type: 'sort',
                label: '完成度',
                value: 'completeness',
                groups: ['004'],
            },
            {
                type: 'sort',
                label: '锁定',
                value: 'lock',
                groups: ['005'],
            },
        ],
    },
    onFilterChange(e) {
        const checkedItems = e.detail.checkedItems;
        const params = {};

        checkedItems.forEach((n) => {
            if (n.checked) {
                if (n.value === 'name') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? 'asc' : 'desc'
                } else if (n.value === 'id') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? 'asc' : 'desc'
                } else if (n.value === 'create_date') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? 'asc' : 'desc'
                } else if (n.value === 'completeness') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? 'asc' : 'desc'
                } else if (n.value === 'lock') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? 'asc' : 'desc'
                }
            }
        });

        this.getCases(params)
    },
    onLoad() {
        this.getCases();
    },
    getCases(params = {}) {
        wx.showLoading();
        this.setData({
            cases: [
                {
                    name: "李文浩",
                    id: 'Y1234567',
                    create_date: '2018-12-24',
                    completeness: "90",
                    lock: true
                },
                {
                    name: "赵振阳",
                    id: 'Y1234568',
                    create_date: '2018-12-24',
                    completeness: "30",
                    lock: true
                }
            ]
        });
        wx.hideLoading();
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
    onSearchCancel(e) {},
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

});