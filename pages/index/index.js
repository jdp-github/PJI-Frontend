"use strict";
Page({
    data: {
        searchValue: '',
        visibleCenter: false
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
    addCenter(e) {
        this.setData({
            visibleCenter: true,
        });
    },
    onCenterClose(e) {
    },
    closeCenter(e) {
        this.setData({
            visibleCenter: false,
        })
    },
});