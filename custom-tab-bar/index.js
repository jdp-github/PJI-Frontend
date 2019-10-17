'use strict';

let emitter = require('events');

Component({
    data: {
        selected: 0,
        emitter: null
    },
    attached: function () {
    },
    methods : {
        navigateToCenter: function (e) {
            if (emitter) {
                this.data.emitter.removeAllListeners('addEmitter');
            }
            this.setData({
                selected: 0
            });
            wx.switchTab({
                url: '../center/center'
            });
        },
        navigateToStats: function (e) {
            if (emitter) {
                this.data.emitter.removeAllListeners('addEmitter');
            }
            this.setData({
                selected: 1
            });
            wx.switchTab({
                url: '../stats/stats'
            });
        },
        navigateToService: function (e) {
            if (emitter) {
                this.data.emitter.removeAllListeners('addEmitter');
            }
            this.setData({
                selected: 2
            });
            wx.switchTab({
                url: '../service/service'
            });
        },
        navigateToPerson: function (e) {
            if (emitter) {
                this.data.emitter.removeAllListeners('addEmitter');
            }
            this.setData({
                selected: 3
            });
            wx.switchTab({
                url: '../person/person'
            });
        },
        triggerEvent: function() {
            this.data.emitter.emit('addEmitter');
        }
    }
});