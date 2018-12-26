"use strict";
Page({
    data: {
        searchValue: '',
    },
    onSearchChange(e) {
        this.setData({
            value: e.detail.value,
        })
    },
    onSearchFocus(e) {
    },
    onSearchBlur(e) {
    },
    onSearchConfirm(e) {
    },
    onSearchClear(e) {
        this.setData({
            searchValue: '',
        })
    },
    onSearchCancel(e) {
    },
});