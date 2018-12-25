"use strict";

Page({
    data: {
        currentRegister: [],
        currentApprove: [],
        segementedKey1: true,
        segementedKey2: false
    },
    onLoad() {
        this.key = String(Math.floor(Math.random() * 3))
    },
    onSegmentedChange(e) {
        if(e.detail.key === 0) {
            this.setData({
                segementedKey1: true,
                segementedKey2: false
            });
        } else {
            this.setData({
                segementedKey1: false,
                segementedKey2: true
            });
        }
    },
    onRegisterChange(e) {
        this.setData({
            currentRegister: e.detail.key,
        })
    },
    onApproveChange(e) {
        this.setData({
            currentApprove: e.detail.key,
        })
    },
});


