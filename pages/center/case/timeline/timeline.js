'use strict';

let constant = require('../../../../utils/constant.js');
let util = require('../../../../utils/util.js');

const app = getApp();

Page({
    data: {
        loadProgress: 0,
        loadModal: false,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,

        tabList: ["要素速览", "诊疗日历"],
        currTab: 0,
        scrollLeft: 0,
        // ---------------- timeline ---------------- //
        isIn: 0,
        caseInfo: '',
        timeLineList: [],
        typePicker: ["基本信息", "诊断穿刺", "入院手术", "抗生素治疗开始", "门诊随访", "抗生素治疗终止", "手术", "出院"],
        // ---------------- calendar ---------------- //
        eventTopPosition: "80rpx",
        weekRow: [1, 2, 3, 4, 5, 6, 7],
        weekList: [],
        windowWidth: 0, // 手机可用区域宽度
        defaultDays: 30, // 默认显示30天
        axisHeight: 35, // 纵坐标轴步长
        axisWidth: 0, // 横坐标轴步长
        whiteHeight: 35, // 留白高度
        tagWidth: 16, // 标签宽度
        tagHeight: 35, // 标签高度
        tagMargin: 20, // 标签间隔
        textOffset: 8, // 文字左右偏移量
        textOffsetVertical: 4, // 文字上下偏移量
        eventDateTagsOrder: {}, // 事件标签顺序
        localTreatmentDateTagsOrder: {}, // 局部用药标签顺序
        oralMedicationDateTagsOrder: {}, // 口服用药标签顺序
        venousTransfusionDateTagsOrder: {}, // 静脉用药标签顺序
        days: 0, // 计算后要显示的日期长度
        fakeData: {
            'events': {
                'createCase': ['2020-04-01'], // 建档日期
                'inHospital': ['2020-04-01'], // 入院
                'useDrug': [
                    {
                        'start': '2020-04-02',
                        'end': '2020-04-30'
                    }
                ], // 用药, 需要给出其实日期到最长用药的截止日期
                'outHospital': ['2020-04-30'] // 出院
            }, // 记录(建档/入院/用药/穿刺/手术/出院)等各种事件信息
            'localTreatment': [
                {
                    'drugID': '1', // 药品ID
                    'drugName': '甲硝唑', // 药品名称
                    'startDate': '2020-04-02', // 开始时间
                    'duration': 7 // 用药时长
                }
            ], // 局部用药
            'oralMedication': [
                {
                    'drugID': '2', // 药品ID
                    'drugName': '万古霉素', // 药品名称
                    'startDate': '2020-04-03', // 开始时间
                    'duration': 7 // 用药时长
                },
                {
                    'drugID': '2', // 药品ID
                    'drugName': '万古霉素', // 药品名称
                    'startDate': '2020-04-12', // 开始时间
                    'duration': 7 // 用药时长
                },
                {
                    'drugID': '4', // 药品ID
                    'drugName': '强力美素', // 药品名称
                    'startDate': '2020-04-03', // 开始时间
                    'duration': 4 // 用药时长
                }
            ], // 口服用药
            'venousTransfusion': [
                {
                    'drugID': '3', // 药品ID
                    'drugName': '利福平', // 药品名称
                    'startDate': '2020-04-02', // 开始时间
                    'duration': 4 // 用药时长
                }
            ] // 静脉用药
        } // 测试数据
    },

    tabSelect(e) {
        this.setData({
            currTab: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60
        })
    },

    onReady: function () {
        var that = this;
        wx.getSystemInfo({
            success: e => {
                that.setData({
                    windowWidth: e.windowWidth,
                    pixelRatio: e.pixelRatio,
                    axisWidth: e.windowWidth / 4 - 10
                })
            }
        })

        const ctx = wx.createCanvasContext('timelineCanvas', this)
        // 设置字号
        ctx.setFontSize(12)
        // 设置显示天数
        let days = 0
        let dateEnd = ''
        let dateStart = '' + that.data.fakeData.events.createCase[0]
        if (that.data.fakeData.events.outHospital.length >= 1) {
            dateEnd = that.data.fakeData.events.outHospital[that.data.fakeData.events.outHospital.length - 1]
        } else {
            if (that.data.fakeData.events.useDrug.length >= 1) {
                dateEnd = that.data.fakeData.events.useDrug[that.data.fakeData.events.outHospital.length - 1].end
            }
        }
        if (dateEnd === '') {
            days = that.data.defaultDays
        } else {
            let startFormat = new Date(dateStart).getTime()
            let endFormat = new Date(dateEnd).getTime()
            days = Math.floor((endFormat - startFormat) / (24 * 3600 * 1000)) + 1
        }
        that.setData({
            days: days
        })
        // 缓存字典, 用于后续判断排序顺序
        for (var i = 0; i < days; i++) {
            that.data.eventDateTagsOrder[i] = 0
            that.data.localTreatmentDateTagsOrder[i] = 0
            that.data.oralMedicationDateTagsOrder[i] = 0
            that.data.venousTransfusionDateTagsOrder[i] = 0
        }
        that.setData({
            eventDateTagsOrder: that.data.eventDateTagsOrder,
            localTreatmentDateTagsOrder: that.data.localTreatmentDateTagsOrder,
            oralMedicationDateTagsOrder: that.data.oralMedicationDateTagsOrder,
            venousTransfusionDateTagsOrder: that.data.venousTransfusionDateTagsOrder
        })
        // 绘制参考线
        that.drawLineY(ctx, that.data.days, 30, true)
        that.drawLineY(ctx, that.data.days, 30 + that.data.axisWidth, false)
        that.drawLineY(ctx, that.data.days, 30 + 2 * that.data.axisWidth, false)
        that.drawLineY(ctx, that.data.days, 30 + 3 * that.data.axisWidth, false)
        // 绘制参考线文本
        that.drawLineYText(ctx, that.data.days + 1, 30)
        // 绘制事件
        that.drawEvents(ctx)
        // 绘制局部用药
        that.drawLocalTreatment(ctx)
        // 绘制口服用药
        that.drawOralMedication(ctx)
        // 绘制静脉用药
        that.drawVenousTransfusion(ctx)
        // 绘制
        ctx.draw()
    },

    onLoad: function (options) {
        this.setData({
            caseInfo: JSON.parse(options.caseInfo),
            centerId: options.centerId,
            centerName: options.centerName,
            isAdmin: app.globalData.is_admin == '1'
        });
        this.initData()
    },

    initData() {
        this.loadProgress();
        this.requestTimeLine();
        this.requestCalendar(this.data.calendarDate);
        this.completeProgress();
    },

    // ---------------- timeline begin ---------------- //
    requestTimeLine: function () {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.Timeline',
                openid: app.globalData.openid,
                case_id: that.data.caseInfo.case_id,
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.Timeline:" + JSON.stringify(res))
                if (res.data.data.code == constant.response_success) {
                    for (let i = 0, len = res.data.data.list.length; i < len; i++) {
                        let timeLineInfo = res.data.data.list[i];
                        timeLineInfo.time = timeLineInfo.time.split(" ")[0]
                        timeLineInfo.typeName = that.data.typePicker[timeLineInfo.type - 1]
                    }

                    that.setData({
                        isIn: res.data.data.info.is_in,
                        timeLineList: res.data.data.list
                    });
                } else {
                    that.showToast(res.data.msg);
                }
            },
            fail(res) {
                that.showToast(res.data.msg);
            }
        });
    },

    onItemClick(e) {
        let item = e.currentTarget.dataset.item
        if (item.type == 1) { // 基本信息
            wx.navigateTo({
                url: '../base/base?centerId=' + this.data.centerId + "&centerName=" + this.data.centerName + "&caseId=" + this.data.caseInfo.case_id + "&itemId=" + item.item_id
            });
        } else if (item.type == 2) { // 穿刺
            wx.navigateTo({
                url: '../chuanci/chuanci?centerId=' + this.data.centerId + "&centerName=" + this.data.centerName + "&caseId=" + this.data.caseInfo.case_id + "&itemId=" + item.item_id
            });
        } else if (item.type == 3 || item.type == 7 || item.type == 8) { // 手术
            wx.navigateTo({
                url: '../shoushu/shoushu?centerId=' + this.data.centerId + "&centerName=" + this.data.centerName + "&caseId=" + this.data.caseInfo.case_id + "&itemId=" + item.item_id
            });
        } else if (item.type == 4 || item.type == 6) { // 用药
            wx.navigateTo({
                url: '../medicine/medicine?caseId=' + this.data.caseInfo.case_id + "&itemId=" + item.item_id + "&userinfo=" + this.makeUserInfo()
            });
        } else if (item.type == 5) { // 随访
            wx.navigateTo({
                url: '../followup/followup?centerId=' + this.data.centerId + "&centerName=" + this.data.centerName + "&caseId=" + this.data.caseInfo.case_id + "&itemId=" + item.item_id
            });
        }
    },

    onPuncture() {
        wx.navigateTo({
            url: '../chuanci/chuanci?centerId=' + this.data.centerId + "&centerName=" + this.data.centerName + "&caseId=" + this.data.caseInfo.case_id + "&itemId=" + 0
        });
    },

    onShouShu() {
        wx.navigateTo({
            url: '../shoushu/shoushu?centerId=' + this.data.centerId + "&centerName=" + this.data.centerName + "&caseId=" + this.data.caseInfo.case_id + "&itemId=" + 0
        });
    },

    onYongyao() {
        if (this.data.isIn == 0) {
            this.showToast("前序抗生素疗程尚未结束，无法创建新疗程")
            return
        }
        wx.navigateTo({
            url: '../yongyao/yongyao?caseId=' + this.data.caseInfo.case_id + "&itemId=" + 0 + "&userinfo=" + this.makeUserInfo() + "&isfromlist=" + false
        });
    },

    onFollowup() {
        wx.navigateTo({
            url: '../followup/followup?centerId=' + this.data.centerId + "&centerName=" + this.data.centerName + "&caseId=" + this.data.caseInfo.case_id + "&itemId=" + 0
        });
    },

    makeUserInfo() {
        let that = this
        let obj = {
            patient_name: that.data.caseInfo.patient_name,
            case_no: that.data.caseInfo.case_no,
            side_name: that.data.caseInfo.side_name,
            part_name: that.data.caseInfo.part_name,
        }
        return JSON.stringify(obj)
    },

    onDeleCase: function (e) {
        this.showModal("DeleteCaseModal");
    },
    deleCase: function () {
        let that = this;
        that.loadProgress();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.DeleteCase',
                openid: app.globalData.openid,
                case_id: that.data.caseInfo.case_id
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.completeProgress();
                if (res.data.data.code == constant.response_success) {
                    that.reloadPrePage()
                    wx.navigateBack({
                        delta: 1
                    })
                } else {
                    that.showModal("ErrModal", res.data.data.msg);
                }
            },
            fail(res) {
                that.completeProgress();
            }
        });
    },

    reloadPrePage() {
        var pages = getCurrentPages();
        if (pages.length > 1) {
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];
            //关键在这里
            prePage.initData()
        }
    },

    // ---------------- timeline end ---------------- //

    // ---------------- calendar begin ---------------- //
    requestCalendar: function (month) {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.Calendar',
                case_id: that.data.caseInfo.case_id,
                month: month,
                openid: app.globalData.openid
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.GetDoctorList:" + JSON.stringify(res))
                if (res.data.data.code == constant.response_success) {
                    that.setData({
                        weekList: res.data.data.list
                    })
                } else {
                    that.showToast(res.data.data.msg);
                }

            },
            fail(res) {
                that.hideLoading();
                that.showToast(res.data.msg);
            }
        });
    },
    CalendarDateChange(e) {
        this.setData({
            calendarDate: e.detail.value
        })
        this.requestCalendar(this.data.calendarDate);
    },

    drawLineY (ctx, days, xPos, tick) {
        var that = this
        ctx.beginPath()
        ctx.moveTo(xPos, that.data.whiteHeight)
        ctx.lineTo(xPos, (days - 1) * that.data.axisHeight + that.data.whiteHeight)
        ctx.stroke()
        if (tick) {
            // 设置刻度线
            for (var i = 0; i < days; i++) {
                ctx.beginPath()
                ctx.moveTo(xPos, i * that.data.axisHeight + that.data.whiteHeight)
                ctx.lineTo(xPos + 5, i * that.data.axisHeight + that.data.whiteHeight)
                ctx.stroke()
            }
        }
    },

    drawLineYText (ctx, days, xPos) {
        var that = this
        for (var i = 0; i < days; i++) {
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'
            let date = new Date('' + that.data.fakeData.events.createCase[0])
            date.setDate(date.getDate() + i)
            if (i % 7 === 0) {
                ctx.setFillStyle('#000000')
                fillTextVertical(ctx, formatTime(date, false), xPos - 15, i * that.data.axisHeight + that.data.whiteHeight - 30)
            }
        }
    },

    drawEvents (ctx) {
        var that = this
        // 建档
        that.data.fakeData.events.createCase.forEach(item => {
            // 判断天数差, 用于计算坐标
            let startFormat = new Date('' + that.data.fakeData.events.createCase[0]).getTime()
            let endFormat = new Date(item).getTime()
            let diff = Math.floor((endFormat - startFormat) / (24 * 3600 * 1000))
            // 绘制事件标签
            ctx.setFillStyle('#39A9ED')
            ctx.fillRect(4 * that.data.axisWidth - that.data.eventDateTagsOrder[diff] * that.data.tagMargin, diff * that.data.axisHeight + that.data.whiteHeight / 2, that.data.tagWidth, that.data.tagHeight)
            ctx.setStrokeStyle('#DDDDDD')
            ctx.beginPath()
            ctx.moveTo(30, diff * that.data.axisHeight + that.data.whiteHeight)
            ctx.lineTo(4 * that.data.axisWidth - that.data.eventDateTagsOrder[diff] * that.data.tagMargin, diff * that.data.axisHeight + that.data.whiteHeight)
            ctx.stroke()
            // 绘制标签文字
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'
            ctx.setFillStyle('white')
            fillTextVertical(ctx, '建档', 4 * that.data.axisWidth - that.data.eventDateTagsOrder[diff] * that.data.tagMargin + that.data.textOffset, diff * that.data.axisHeight + that.data.whiteHeight / 2 + that.data.textOffsetVertical)
            that.data.eventDateTagsOrder[diff] = that.data.eventDateTagsOrder[diff] + 1
        })
        // 住院
        that.data.fakeData.events.inHospital.forEach(item => {
            // 判断天数差, 用于计算坐标
            let startFormat = new Date('' + that.data.fakeData.events.createCase[0]).getTime()
            let endFormat = new Date(item).getTime()
            let diff = Math.floor((endFormat - startFormat) / (24 * 3600 * 1000))
            // 绘制事件标签
            ctx.setFillStyle('#39A9ED')
            ctx.fillRect(4 * that.data.axisWidth - that.data.eventDateTagsOrder[diff] * that.data.tagMargin, diff * that.data.axisHeight + that.data.whiteHeight / 2, that.data.tagWidth, that.data.tagHeight)
            ctx.setStrokeStyle('#DDDDDD')
            ctx.beginPath()
            ctx.moveTo(30, diff * that.data.axisHeight + that.data.whiteHeight)
            ctx.lineTo(4 * that.data.axisWidth - that.data.eventDateTagsOrder[diff] * that.data.tagMargin, diff * that.data.axisHeight + that.data.whiteHeight)
            ctx.stroke()
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'
            ctx.setFillStyle('white')
            fillTextVertical(ctx, '住院', 4 * that.data.axisWidth - that.data.eventDateTagsOrder[diff] * that.data.tagMargin + that.data.textOffset, diff * that.data.axisHeight + that.data.whiteHeight / 2 + that.data.textOffsetVertical)
            that.data.eventDateTagsOrder[diff] = that.data.eventDateTagsOrder[diff] + 1
        })
        // 用药
        that.data.fakeData.events.useDrug.forEach(temp => {
            for (var i = 0; i < 2; i++) {
                let item = temp.start
                if (i === 0) {
                    item = temp.start
                } else {
                    item = temp.end
                }
                // 判断天数差, 用于计算坐标
                let startFormat = new Date('' + that.data.fakeData.events.createCase[0]).getTime()
                let endFormat = new Date(item).getTime()
                let diff = Math.floor((endFormat - startFormat) / (24 * 3600 * 1000))
                // 绘制事件标签
                ctx.setFillStyle('#39A9ED')
                ctx.fillRect(4 * that.data.axisWidth - that.data.eventDateTagsOrder[diff] * that.data.tagMargin, diff * that.data.axisHeight + that.data.whiteHeight / 2, that.data.tagWidth, that.data.tagHeight)
                ctx.setStrokeStyle('#DDDDDD')
                ctx.beginPath()
                ctx.moveTo(30, diff * that.data.axisHeight + that.data.whiteHeight)
                ctx.lineTo(4 * that.data.axisWidth - that.data.eventDateTagsOrder[diff] * that.data.tagMargin, diff * that.data.axisHeight + that.data.whiteHeight)
                ctx.stroke()
                ctx.textAlign = 'center'
                ctx.textBaseline = 'bottom'
                ctx.setFillStyle('white')
                fillTextVertical(ctx, i === 0 ? '开始' : '结束', 4 * that.data.axisWidth - that.data.eventDateTagsOrder[diff] * that.data.tagMargin + that.data.textOffset, diff * that.data.axisHeight + that.data.whiteHeight / 2 + that.data.textOffsetVertical)
                that.data.eventDateTagsOrder[diff] = that.data.eventDateTagsOrder[diff] + 1
            }
        })
        // 出院
        that.data.fakeData.events.outHospital.forEach(item => {
            // 判断天数差, 用于计算坐标
            let startFormat = new Date('' + that.data.fakeData.events.createCase[0]).getTime()
            let endFormat = new Date(item).getTime()
            let diff = Math.floor((endFormat - startFormat) / (24 * 3600 * 1000))
            // 绘制事件标签
            ctx.setFillStyle('#39A9ED')
            ctx.fillRect(4 * that.data.axisWidth - that.data.eventDateTagsOrder[diff] * that.data.tagMargin, diff * that.data.axisHeight + that.data.whiteHeight / 2, that.data.tagWidth, that.data.tagHeight)
            ctx.setStrokeStyle('#DDDDDD')
            ctx.beginPath()
            ctx.moveTo(30, diff * that.data.axisHeight + that.data.whiteHeight)
            ctx.lineTo(4 * that.data.axisWidth - that.data.eventDateTagsOrder[diff] * that.data.tagMargin, diff * that.data.axisHeight + that.data.whiteHeight)
            ctx.stroke()
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'
            ctx.setFillStyle('white')
            fillTextVertical(ctx, '出院', 4 * that.data.axisWidth - that.data.eventDateTagsOrder[diff] * that.data.tagMargin + that.data.textOffset, diff * that.data.axisHeight + that.data.whiteHeight / 2 + that.data.textOffsetVertical)
            that.data.eventDateTagsOrder[diff] = that.data.eventDateTagsOrder[diff] + 1
        })
    },

    drawLocalTreatment (ctx) {
        var that = this
        // 局部用药
        that.data.fakeData.localTreatment.forEach(item => {
            // 判断天数差, 用于计算坐标
            let startFormat = new Date('' + that.data.fakeData.events.createCase[0]).getTime()
            let endFormat = new Date(item.startDate).getTime()
            let diff = Math.floor((endFormat - startFormat) / (24 * 3600 * 1000))
            // 绘制事件标签
            ctx.setFillStyle('#ED6A0C')
            ctx.fillRect(3 * that.data.axisWidth - that.data.localTreatmentDateTagsOrder[diff] * that.data.tagMargin, diff * that.data.axisHeight + that.data.whiteHeight / 2, that.data.tagWidth, that.data.tagHeight)
            ctx.setStrokeStyle('#DDDDDD')
            ctx.beginPath()
            ctx.moveTo(30, diff * that.data.axisHeight + that.data.whiteHeight)
            ctx.lineTo(3 * that.data.axisWidth - that.data.localTreatmentDateTagsOrder[diff] * that.data.tagMargin, diff * that.data.axisHeight + that.data.whiteHeight)
            ctx.stroke()
            // 绘制标签文字
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'
            ctx.setFillStyle('white')
            fillTextVertical(ctx, item.drugName.slice(0, 2), 3 * that.data.axisWidth - that.data.localTreatmentDateTagsOrder[diff] * that.data.tagMargin + that.data.textOffset, diff * that.data.axisHeight + that.data.whiteHeight / 2 + that.data.textOffsetVertical)
            // 绘制持续时长线条
            ctx.beginPath()
            ctx.setStrokeStyle('#ED6A0C')
            ctx.moveTo(3 * that.data.axisWidth - that.data.localTreatmentDateTagsOrder[diff] * that.data.tagMargin + that.data.textOffset, diff * that.data.axisHeight + that.data.whiteHeight + 3 * that.data.textOffsetVertical)
            ctx.lineTo(3 * that.data.axisWidth - that.data.localTreatmentDateTagsOrder[diff] * that.data.tagMargin + that.data.textOffset, diff * that.data.axisHeight + that.data.whiteHeight + item.duration * that.data.axisHeight - that.data.textOffsetVertical)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(3 * that.data.axisWidth - that.data.localTreatmentDateTagsOrder[diff] * that.data.tagMargin, diff * that.data.axisHeight + that.data.whiteHeight + item.duration * that.data.axisHeight - that.data.textOffsetVertical)
            ctx.lineTo(3 * that.data.axisWidth - that.data.localTreatmentDateTagsOrder[diff] * that.data.tagMargin + that.data.tagWidth, diff * that.data.axisHeight + that.data.whiteHeight + item.duration * that.data.axisHeight - that.data.textOffsetVertical)
            ctx.stroke()
            // 绘制持续时长文字
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'
            ctx.setFillStyle('black')
            fillTextVertical(ctx, item.duration + 'days', 3 * that.data.axisWidth - that.data.localTreatmentDateTagsOrder[diff] * that.data.tagMargin + that.data.textOffset, diff * that.data.axisHeight + that.data.whiteHeight + item.duration * that.data.axisHeight / 2 - that.data.textOffsetVertical)
            // 需要增加排序索引, 避免重叠
            for (var i = 0; i < item.duration; i++) {
                if (i !== 0) {
                    that.data.localTreatmentDateTagsOrder[diff + i] = that.data.localTreatmentDateTagsOrder[diff + i] + 1
                }
            }
            that.data.localTreatmentDateTagsOrder[diff] = that.data.localTreatmentDateTagsOrder[diff] + 1
        })
    },

    drawOralMedication (ctx) {
        var that = this
        // 局部用药
        that.data.fakeData.oralMedication.forEach(item => {
            // 判断天数差, 用于计算坐标
            let startFormat = new Date('' + that.data.fakeData.events.createCase[0]).getTime()
            let endFormat = new Date(item.startDate).getTime()
            let diff = Math.floor((endFormat - startFormat) / (24 * 3600 * 1000))
            // 绘制事件标签
            ctx.setFillStyle('#82C91E')
            ctx.fillRect(2 * that.data.axisWidth - that.data.oralMedicationDateTagsOrder[diff] * that.data.tagMargin, diff * that.data.axisHeight + that.data.whiteHeight / 2, that.data.tagWidth, that.data.tagHeight)
            ctx.setStrokeStyle('#DDDDDD')
            ctx.beginPath()
            ctx.moveTo(30, diff * that.data.axisHeight + that.data.whiteHeight)
            ctx.lineTo(2 * that.data.axisWidth - that.data.oralMedicationDateTagsOrder[diff] * that.data.tagMargin, diff * that.data.axisHeight + that.data.whiteHeight)
            ctx.stroke()
            // 绘制标签文字
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'
            ctx.setFillStyle('white')
            fillTextVertical(ctx, item.drugName.slice(0, 2), 2 * that.data.axisWidth - that.data.oralMedicationDateTagsOrder[diff] * that.data.tagMargin + that.data.textOffset, diff * this.data.axisHeight + this.data.whiteHeight / 2 + this.data.textOffsetVertical)
            // 绘制持续时长线条
            ctx.beginPath()
            ctx.setStrokeStyle('#82C91E')
            ctx.moveTo(2 * that.data.axisWidth - that.data.oralMedicationDateTagsOrder[diff] * that.data.tagMargin + that.data.textOffset, diff * that.data.axisHeight + that.data.whiteHeight + 3 * that.data.textOffsetVertical)
            ctx.lineTo(2 * that.data.axisWidth - that.data.oralMedicationDateTagsOrder[diff] * that.data.tagMargin + that.data.textOffset, diff * that.data.axisHeight + that.data.whiteHeight + item.duration * that.data.axisHeight - that.data.textOffsetVertical)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(2 * that.data.axisWidth - that.data.oralMedicationDateTagsOrder[diff] * that.data.tagMargin, diff * that.data.axisHeight + that.data.whiteHeight + item.duration * that.data.axisHeight - that.data.textOffsetVertical)
            ctx.lineTo(2 * that.data.axisWidth - that.data.oralMedicationDateTagsOrder[diff] * that.data.tagMargin + that.data.tagWidth, diff * that.data.axisHeight + that.data.whiteHeight + item.duration * that.data.axisHeight - that.data.textOffsetVertical)
            ctx.stroke()
            // 绘制持续时长文字
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'
            ctx.setFillStyle('black')
            fillTextVertical(ctx, item.duration + 'days', 2 * that.data.axisWidth - that.data.oralMedicationDateTagsOrder[diff] * that.data.tagMargin + that.data.textOffset, diff * that.data.axisHeight + that.data.whiteHeight + item.duration * that.data.axisHeight / 2 - that.data.textOffsetVertical)
            // 需要增加排序索引, 避免重叠
            for (var i = 0; i < item.duration; i++) {
                if (i !== 0) {
                    that.data.oralMedicationDateTagsOrder[diff + i] = that.data.oralMedicationDateTagsOrder[diff + i] + 1
                }
            }
            that.data.oralMedicationDateTagsOrder[diff] = that.data.oralMedicationDateTagsOrder[diff] + 1
        })
    },

    drawVenousTransfusion (ctx) {
        var that = this
        // 静脉用药
        that.data.fakeData.venousTransfusion.forEach(item => {
            // 判断天数差, 用于计算坐标
            let startFormat = new Date('' + that.data.fakeData.events.createCase[0]).getTime()
            let endFormat = new Date(item.startDate).getTime()
            let diff = Math.floor((endFormat - startFormat) / (24 * 3600 * 1000))
            // 绘制事件标签
            ctx.setFillStyle('#36CEE3')
            ctx.fillRect(that.data.axisWidth - that.data.venousTransfusionDateTagsOrder[diff] * that.data.tagMargin, diff * that.data.axisHeight + that.data.whiteHeight / 2, that.data.tagWidth, that.data.tagHeight)
            ctx.setStrokeStyle('#DDDDDD')
            ctx.beginPath()
            ctx.moveTo(30, diff * that.data.axisHeight + that.data.whiteHeight)
            ctx.lineTo(that.data.axisWidth - that.data.venousTransfusionDateTagsOrder[diff] * that.data.tagMargin, diff * that.data.axisHeight + that.data.whiteHeight)
            ctx.stroke()
            // 绘制标签文字
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'
            ctx.setFillStyle('white')
            fillTextVertical(ctx, item.drugName.slice(0, 2), that.data.axisWidth - that.data.venousTransfusionDateTagsOrder[diff] * that.data.tagMargin + that.data.textOffset, diff * that.data.axisHeight + that.data.whiteHeight / 2 + that.data.textOffsetVertical)
            // 绘制持续时长线条
            ctx.beginPath()
            ctx.setStrokeStyle('#36CEE3')
            ctx.moveTo(that.data.axisWidth - that.data.venousTransfusionDateTagsOrder[diff] * that.data.tagMargin + that.data.textOffset, diff * that.data.axisHeight + that.data.whiteHeight + 3 * that.data.textOffsetVertical)
            ctx.lineTo(that.data.axisWidth - that.data.venousTransfusionDateTagsOrder[diff] * that.data.tagMargin + that.data.textOffset, diff * that.data.axisHeight + that.data.whiteHeight + item.duration * that.data.axisHeight - that.data.textOffsetVertical)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(that.data.axisWidth - that.data.venousTransfusionDateTagsOrder[diff] * that.data.tagMargin, diff * that.data.axisHeight + that.data.whiteHeight + item.duration * that.data.axisHeight - that.data.textOffsetVertical)
            ctx.lineTo(that.data.axisWidth - that.data.venousTransfusionDateTagsOrder[diff] * that.data.tagMargin + that.data.tagWidth, diff * that.data.axisHeight + that.data.whiteHeight + item.duration * that.data.axisHeight - that.data.textOffsetVertical)
            ctx.stroke()
            // 绘制持续时长文字
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'
            ctx.setFillStyle('black')
            fillTextVertical(ctx, item.duration + 'days', that.data.axisWidth - that.data.venousTransfusionDateTagsOrder[diff] * that.data.tagMargin + that.data.textOffset, diff * that.data.axisHeight + that.data.whiteHeight + item.duration * that.data.axisHeight / 2 - that.data.textOffsetVertical)
            // 需要增加排序索引, 避免重叠
            for (var i = 0; i < item.duration; i++) {
                if (i !== 0) {
                    that.data.venousTransfusionDateTagsOrder[diff + i] = that.data.venousTransfusionDateTagsOrder[diff + i] + 1
                }
            }
            that.data.venousTransfusionDateTagsOrder[diff] = that.data.venousTransfusionDateTagsOrder[diff] + 1
        })
    },
    // ---------------- calendar end ---------------- //

    onUnload() {
        var pages = getCurrentPages();
        if (pages.length > 1) {
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];
            //关键在这里
            prePage.initData()
        }
    },

    // ============ 事件 begin ============ //
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
    showModal: function (modalName, msg = '') {
        this.setData({
            modalName: modalName,
            errMsg: msg
        });
    },
    hideModal: function (e) {
        this.setData({
            modalName: null
        });
    },
    onRefresh: function (e) {
        this.initData()
    },

    // ============ 事件 end ============ //
});

function formatNumber (n) {
    const str = n.toString()
    return str[1] ? str : `0${str}`
}

function formatTime (date, more) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    const t1 = [year, month, day].map(formatNumber).join('-')
    const t2 = [hour, minute, second].map(formatNumber).join(':')

    if (more) {
        return `${t1} ${t2}`
    } else {
        return `${t1}`
    }
}

function fillTextVertical (ctx, text, x, y) {
    let letterSpacing = 2
    for (let i = 0; i < text.length; i++) {
        const str = text.slice(i, i + 1).toString()
        if (str.match(/[A-Za-z0-9]/)) {
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(Math.PI / 180 * 90)
            ctx.textBaseline = 'bottom'
            ctx.fillText(str, 0, 0)
            ctx.restore()
            y += ctx.measureText(str).width + letterSpacing
        } else if (str.match(/[\u4E00-\u9FA5]/)) {
            ctx.save()
            ctx.textBaseline = 'top'
            ctx.fillText(str, x, y)
            ctx.restore()
            y += ctx.measureText(str).width + letterSpacing
        }
    }
}
