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
        isAdmin: false,
        // -------- modal begin ----------- //
        modalName: '',
        // -------- modal end ------------- //
        // -------- tab切换 begin -------- //
        TabCur: 0,
        VerticalNavTop: 0,
        TabTitle: ['基本信息', '诊断性穿刺', '入院后信息'],
        ShowBasic: true,
        ShowDiagnose: false,
        ShowAdmission: false,
        // -------- tab切换 end -------- //

        // -------- 基本信息 begin -------- //
        name: '',
        caseNO: "",
        createDate: util.getNowFormatDate(new Date()),
        sex: 0,
        sexPicker: ['请选择', '男', '女'],
        age: '',
        height: '',
        weight: '',
        bmi: '',
        chiefDoc: '',
        tel1: '',
        tel2: '',
        tel2Disabled: true,
        part: 0,
        partPicker: ['请选择', '髋', '膝'],
        type: 0,
        typePicker: ['请选择', '置换术后', '占位器'],
        operationDateMultiArray: [
            ['单位'],
            ['天', '周', '月', '年'],
            ['1天', '2天', '3天', '4天', '5天', '6天', '7天', '8天', '9天', '10天', '11天', '12天', '13天', '14天', '15天', '16天', '17天', '18天', '19天', '20天', '21天', '22天', '23天', '24天', '25天', '26天', '27天', '28天', '29天', '30天', '31天']
        ],
        operationDateMultiIndex: [0, 0],
        operationDisabled: true,
        symptomDateMultiArray: [
            ['单位'],
            ['天', '周', '月', '年'],
            ['1天', '2天', '3天', '4天', '5天', '6天', '7天', '8天', '9天', '10天', '11天', '12天', '13天', '14天', '15天', '16天', '17天', '18天', '19天', '20天', '21天', '22天', '23天', '24天', '25天', '26天', '27天', '28天', '29天', '30天', '31天']
        ],
        symptomDateMultiIndex: [0, 0],
        symptomDisabled: true,
        ris: 0,
        risPicker: ['请选择', '否', '类风湿', '强制性脊柱炎', '其他 (请在备注中标明)'],
        qtbsjb: '',
        antibiotic: 0,
        antibioticPicker: ['请选择', '是', '否'],
        jybs: '',
        cbzd: '',
        tssxbz: '',
        // -------- 基本信息 end -------- //

        // -------- 诊断性穿刺 begin -------- //
        chuangciDate: '未行诊断性穿刺',
        ccDateDisabled: true,
        ccDescribe: '',
        ccDescribeDisabeld: true,
        ccgjy: '',
        ccgjyDisabled: true,
        ccgxy: '',
        ccgxyDisabled: true,
        leIndex: 0,
        lePicker: ["请选择", "无法判定", "neg.", "25", "75", "250 (+)", "500 (++)", ],
        leDisabled: true,
        leAfterIndex: 0,
        leAfterPicker: ["请选择", "无法判定", "neg.", "25", "75", "250 (+)", "500 (++)"],
        leAfterDisabled: true,
        gjybxb: '',
        gjybxbDisabled: true,
        gjyzx: '',
        gjyzxDisabled: true,
        bcpysjIndex: 0,
        bcpysjPicker: ["请选择", "关节液", "灌洗液", "混合液"],
        bcpysjDisabled: true,
        drgpyp: '',
        drgpypDisabled: true,
        bcxyResult: '',
        bcxyResultDisabled: true,
        bcxyLast: '',
        bcxyLastDisabled: true,
        bcyyResult: '',
        bcyyResultDisabled: true,
        bcyyLast: '',
        bcyyLastDisabled: true,
        mNGSResult: '',
        mNGSResultDisabled: true,
        // -------- 诊断性穿刺 end -------- //

        // -------- 入院后信息 begin -------- //
        doudaoIndex: 0,
        doudaoPicker: ["请选择", "有", "无"],
        sqesr: '',
        sqcpr: '',
        bzhcrp: '',
        il6: '',
        il6Disabled: true,
        xwdby: '',
        xwdbyDisabled: true,
        ddimer: '',
        ddimerDisabled: true,
        shoushuDate: '',
        ssDateDisabled: true,
        szjnIndex: 0,
        szjnPicker: ["请选择", "脓性液体", "未见脓液"],
        szjnDisabled: true,
        blIndex: 0,
        blPicker: ["请选择", "<5", "5-10", ">10"],
        blDisabled: true,
        szLEIndex: 0,
        szLEPicker: ["请选择", "/无法判定", "neg.", "25", "75", "250(+)", "500(+)"],
        szLEDisabled: true,
        szLEAfterIndex: 0,
        szLEAfterPicker: ["请选择", "/无法判定", "neg.", "25", "75", "250(+)", "500(+)"],
        szLEAfterDisabled: true,
        szgjybxb: '',
        szgjybxbDisabled: true,
        szgjyzxl: '',
        szgjyzxlDisabled: true,
        qbgjy: '',
        qbgjyDisabled: true,
        szzzpy: '',
        szzzpyDisabled: true,
        zznMGSResult: '',
        zznMGSResultDisabled: true,
        csljy: '',
        csljyDisabled: true,
        msisIndex: 0,
        msisPicker: ["请选择", "暂不能确定", "感染", "非感染"],
        msisDisabled: true,
        zzclIndex: 0,
        zzclPicker: ["请选择", "手术-占位器植入", "手术-假体植入", "手术-清创换垫", "未手术-抗生素压制", "未手术-门诊随访", "失访-不详"],
        zzclDisabled: true,
        // -------- 入院后信息 end -------- //

        // ------- 图片上传 start --------- //
        pic1: '',
        pic2: '',
        pic3: '',
        pic4: '',
        pic5: '',
        pic6: '',
        pic7: '',
        pic8: '',
        pic9: '',
        pic10: '',
        pic11: '',
        pic12: ''
        // ------- 图片上传 end  ---------- //
    },

    tabSelect: function(e) {
        let tabId = e.currentTarget.dataset.id;
        switch (tabId) {
            case 0:
                this.setData({
                    TabCur: tabId,
                    VerticalNavTop: (tabId - 1) * 50,
                    ShowBasic: true,
                    ShowDiagnose: false,
                    ShowAdmission: false,
                });
                break;
            case 1:
                this.setData({
                    TabCur: tabId,
                    VerticalNavTop: (tabId - 1) * 50,
                    ShowBasic: false,
                    ShowDiagnose: true,
                    ShowAdmission: false,
                });
                break;
            case 2:
                this.setData({
                    TabCur: tabId,
                    VerticalNavTop: (tabId - 1) * 50,
                    ShowBasic: false,
                    ShowDiagnose: false,
                    ShowAdmission: true,
                });
                break;
            case 3:
                this.setData({
                    TabCur: tabId,
                    VerticalNavTop: (tabId - 1) * 50,
                    ShowBasic: false,
                    ShowDiagnose: false,
                    ShowAdmission: false,
                });
                break;
        }
    },

    // -------- 基本信息事件 begin -------- //
    onNameInput: function(e) {
        this.setData({
            name: e.detail.value
        });
    },
    onCaseNOInput: function(e) {
        this.setData({
            caseNO: e.detail.value
        });
    },
    onCreateDateChange: function(e) {
        this.setData({
            createDate: e.detail.value
        });
    },
    onAgeInput: function(e) {
        this.setData({
            sex: e.detail.value,
        });
    },
    onHeightInput: function(e) {
        this.setData({
            height: e.detail.value
        });
        if (this.data.weight != 0 && this.data.height != 0) {
            var calcBMI = this.data.weight / (this.data.height * this.data.height)
            this.setData({
                bmi: calcBMI.toFixed(2)
            })
        }
    },
    onWeightInput: function(e) {
        this.setData({
            weight: e.detail.value
        });
        if (this.data.weight != 0 && this.data.height != 0) {
            var calcBMI = this.data.weight / (this.data.height * this.data.height)
            this.setData({
                bmi: calcBMI.toFixed(2)
            })
        }
    },
    onChiefDocInput: function(e) {
        this.setData({
            chiefDoc: e.detail.value
        });
    },
    onTel1Input: function(e) {
        this.setData({
            tel1: e.detail.value
        });
    },
    onTel2Input: function(e) {
        this.setData({
            tel2: e.detail.value
        });
    },
    onTel2SwitchChange: function(e) {
        this.setData({
            tel2Disabled: !e.detail.value
        });
    },
    onPartChange: function(e) {
        this.setData({
            part: e.detail.value,
        });
    },
    onTypeChange: function(e) {
        this.setData({
            type: e.detail.value,
        });
    },
    operationDateChange: function(e) {
        this.setData({
            operationDateMultiIndex: e.detail.value
        })
    },
    operationDateColumnChange: function(e) {
        let data = {
            operationDateMultiArray: this.data.operationDateMultiArray,
            operationDateMultiIndex: this.data.operationDateMultiIndex
        };
        data.operationDateMultiIndex[e.detail.column] = e.detail.value;
        switch (e.detail.column) {
            case 0:
                switch (data.operationDateMultiIndex[0]) {
                    case 0:
                        data.operationDateMultiArray[1] = ['天', '月', '年'];
                        data.operationDateMultiArray[2] = ['1天', '2天', '3天', '4天', '5天', '6天', '7天', '8天', '9天', '10天', '11天', '12天', '13天', '14天', '15天', '16天', '17天', '18天', '19天', '20天', '21天', '22天', '23天', '24天', '25天', '26天', '27天', '28天', '29天', '30天', '31天'];
                        break;
                }
                data.operationDateMultiIndex[1] = 0;
                data.operationDateMultiIndex[2] = 0;
                break;
            case 1:
                switch (data.operationDateMultiIndex[0]) {
                    case 0:
                        switch (data.operationDateMultiIndex[1]) {
                            case 0:
                                data.operationDateMultiArray[2] = ['1天', '2天', '3天', '4天', '5天', '6天', '7天', '8天', '9天', '10天', '11天', '12天', '13天', '14天', '15天', '16天', '17天', '18天', '19天', '20天', '21天', '22天', '23天', '24天', '25天', '26天', '27天', '28天', '29天', '30天', '31天'];
                                break;
                            case 1:
                                data.operationDateMultiArray[2] = ['1周', '2周', '3周', '4周'];
                                break;
                            case 2:
                                data.operationDateMultiArray[2] = ['1个月', '2个月', '3个月', '4个月', '5个月', '6个月', '7个月', '8个月', '9个月', '10个月', '11个月', '12个月'];
                                break;
                            case 3:
                                data.operationDateMultiArray[2] = ['1年', '2年', '3年', '4年', '5年', '6年', '7年', '8年', '9年', '10年'];
                                break;
                        }
                        break;
                }
                data.operationDateMultiIndex[2] = 0;
                break;
        }
        this.setData(data);
    },
    onOperationcSwitchChange: function(e) {
        this.setData({
            operationDisabled: !e.detail.value
        });
    },
    symptomDateChange: function(e) {
        this.setData({
            symptomDateMultiIndex: e.detail.value
        })
    },
    symptomDateColumnChange: function(e) {
        let data = {
            symptomDateMultiArray: this.data.symptomDateMultiArray,
            symptomDateMultiIndex: this.data.symptomDateMultiIndex
        };
        data.symptomDateMultiIndex[e.detail.column] = e.detail.value;
        switch (e.detail.column) {
            case 0:
                switch (data.symptomDateMultiIndex[0]) {
                    case 0:
                        data.symptomDateMultiArray[1] = ['天', '月', '年'];
                        data.symptomDateMultiArray[2] = ['1天', '2天', '3天', '4天', '5天', '6天', '7天', '8天', '9天', '10天', '11天', '12天', '13天', '14天', '15天', '16天', '17天', '18天', '19天', '20天', '21天', '22天', '23天', '24天', '25天', '26天', '27天', '28天', '29天', '30天', '31天'];
                        break;
                }
                data.symptomDateMultiIndex[1] = 0;
                data.symptomDateMultiIndex[2] = 0;
                break;
            case 1:
                switch (data.symptomDateMultiIndex[0]) {
                    case 0:
                        switch (data.symptomDateMultiIndex[1]) {
                            case 0:
                                data.symptomDateMultiArray[2] = ['1天', '2天', '3天', '4天', '5天', '6天', '7天', '8天', '9天', '10天', '11天', '12天', '13天', '14天', '15天', '16天', '17天', '18天', '19天', '20天', '21天', '22天', '23天', '24天', '25天', '26天', '27天', '28天', '29天', '30天', '31天'];
                                break;
                            case 1:
                                data.symptomDateMultiArray[2] = ['1周', '2周', '3周', '4周'];
                                break;
                            case 2:
                                data.symptomDateMultiArray[2] = ['1个月', '2个月', '3个月', '4个月', '5个月', '6个月', '7个月', '8个月', '9个月', '10个月', '11个月', '12个月'];
                                break;
                            case 3:
                                data.symptomDateMultiArray[2] = ['1年', '2年', '3年', '4年', '5年', '6年', '7年', '8年', '9年', '10年'];
                                break;
                        }
                        break;
                }
                data.symptomDateMultiIndex[2] = 0;
                break;
        }
        this.setData(data);
    },
    onSymptomSwitchChange: function(e) {
        this.setData({
            symptomDisabled: !e.detail.value
        });
    },
    onRisChange: function(e) {
        this.setData({
            ris: e.detail.value,
        });
    },
    onQtbsjbInput: function(e) {
        this.setData({
            qtbsjb: e.detail.value
        });
    },
    onAntibioticChange: function(e) {
        this.setData({
            antibiotic: e.detail.value,
        });
    },
    onJybsInput: function(e) {
        this.setData({
            jybs: e.detail.value
        });
    },
    onCbzdInput: function(e) {
        this.setData({
            cbzd: e.detail.value
        });
    },
    onTsssbzInput: function(e) {
        this.setData({
            tssxbz: e.detail.value
        });
    },
    // -------- 基本信息事件 end -------- //

    // -------- 诊断性穿刺 begin -------- //
    onChuanciDateChange: function(e) {
        this.setData({
            chuangciDate: e.detail.value
        });
    },
    onCCDateSwitchChange: function(e) {
        if (this.data.ccDateDisabled) {
            this.setData({
                chuangciDate: "",
                ccDateDisabled: false
            });
        } else {
            this.setData({
                chuangciDate: "未行诊断性穿刺",
                ccDateDisabled: true
            });
        }
    },
    onCCDescribeInput: function(e) {
        this.setData({
            ccDescribe: e.detail.value
        });
    },
    onCCDescribeSwitchChange: function(e) {
        this.setData({
            ccDescribeDisabeld: !e.detail.value
        });
    },
    onCcgjyInput: function(e) {
        this.setData({
            ccgjy: e.detail.value
        });
    },
    onCcgjySwitchChange: function(e) {
        this.setData({
            ccgjyDisabled: !e.detail.value
        });
    },
    onCcgxyInput: function(e) {
        this.setData({
            ccgxy: e.detail.value
        });
    },
    onCcgxySwitchChange: function(e) {
        this.setData({
            ccgxyDisabled: !e.detail.value
        });
    },
    onLeChange: function(e) {
        this.setData({
            leIndex: e.detail.value,
        });
    },
    onLeSwitchChange: function(e) {
        this.setData({
            leDisabled: !e.detail.value
        });
    },
    onLeAfterChange: function(e) {
        this.setData({
            leAfterIndex: e.detail.value,
        });
    },
    onLeAfterSwitchChange: function(e) {
        this.setData({
            leAfterDisabled: !e.detail.value
        });
    },
    onGjybxbInput: function(e) {
        this.setData({
            gjybxb: e.detail.value
        });
    },
    onGjybxbSwitchChange: function(e) {
        this.setData({
            gjybxbDisabled: !e.detail.value
        });
    },
    onGjyzxInput: function(e) {
        this.setData({
            gjyzx: e.detail.value
        });
    },
    onGjyzxSwitchChange: function(e) {
        this.setData({
            gjyzxDisabled: !e.detail.value
        });
    },
    onBcpysjChange: function(e) {
        this.setData({
            bcpysjIndex: e.detail.value,
        });
    },
    onBcpysjSwitchChange: function(e) {
        this.setData({
            bcpysjDisabled: !e.detail.value
        });
    },
    onDrgpypjChange: function(e) {
        this.setData({
            drgpyp: e.detail.value,
        });
    },
    onDrgpypSwitchChange: function(e) {
        this.setData({
            drgpypDisabled: !e.detail.value
        });
    },
    // 
    onBcxyChange: function(e) {
        this.setData({
            bcxyResult: e.detail.value,
        });
    },
    onBcxySwitchChange: function(e) {
        this.setData({
            bcxyResultDisabled: !e.detail.value
        });
    },
    onBcxyLastChange: function(e) {
        this.setData({
            bcxyLast: e.detail.value,
        });
    },
    onBcxyLastSwitchChange: function(e) {
        this.setData({
            bcxyLastDisabled: !e.detail.value
        });
    },
    onBcyyChange: function(e) {
        this.setData({
            bcyyResult: e.detail.value,
        });
    },
    onBcyySwitchChange: function(e) {
        this.setData({
            bcyyResultDisabled: !e.detail.value
        });
    },
    onBcyyLastChange: function(e) {
        this.setData({
            bcxyLast: e.detail.value,
        });
    },
    onBcyyLastSwitchChange: function(e) {
        this.setData({
            bcyyLastDisabled: !e.detail.value
        });
    },
    onMNGsChange: function(e) {
        this.setData({
            mNGSResult: e.detail.value,
        });
    },
    onMNGSSwitchChange: function(e) {
        this.setData({
            mNGSResultDisabled: !e.detail.value
        });
    },
    // -------- 诊断性穿刺 end -------- //

    // -------- 入院后信息 begin -------- //
    onDoudaoChange: function(e) {
        this.setData({
            doudaoIndex: e.detail.value,
        });
    },
    onSqesrChange: function(e) {
        this.setData({
            sqesr: e.detail.value,
            bzhcrp: e.detail.value * 10
        });
    },
    onSqcprChange: function(e) {
        this.setData({
            sqcpr: e.detail.value,
        });
    },
    onXwdbyChange: function(e) {
        this.setData({
            xwdby: e.detail.value
        });
    },
    onXwdbySwitchChange: function(e) {
        this.setData({
            xwdbyDisabled: !e.detail.value
        });
    },
    onDdimerChange: function(e) {
        this.setData({
            ddimer: e.detail.value
        });
    },
    onDdimerSwitchChange: function(e) {
        this.setData({
            ddimerDisabled: !e.detail.value
        });
    },
    onShoushuDateChange: function(e) {
        this.setData({
            shoushuDate: e.detail.value
        });
    },
    onShoushuSwitchChange: function(e) {
        this.setData({
            ssDateDisabled: !e.detail.value
        });
    },
    onSzjnChange: function(e) {
        this.setData({
            szjnIndex: e.detail.value,
        });
    },
    onSzjnSwitchChange: function(e) {
        this.setData({
            szjnDisabled: !e.detail.value
        });
    },
    onBlChange: function(e) {
        this.setData({
            blIndex: e.detail.value,
        });
    },
    onBlSwitchChange: function(e) {
        this.setData({
            blDisabled: !e.detail.value
        });
    },
    onSZLEChange: function(e) {
        this.setData({
            szLEIndex: e.detail.value,
        });
    },
    onSZLESwitchChange: function(e) {
        this.setData({
            szLEDisabled: !e.detail.value
        });
    },
    onSZLEAfterChange: function(e) {
        this.setData({
            szLEAfterIndex: e.detail.value,
        });
    },
    onSZLEAfterSwitchChange: function(e) {
        this.setData({
            szLEAfterDisabled: !e.detail.value
        });
    },
    onSzgjybxbInput: function(e) {
        this.setData({
            szgjybxb: e.detail.value
        });
    },
    onSzgjybxbSwitchChange: function(e) {
        this.setData({
            szgjybxbDisabled: !e.detail.value
        });
    },
    onSzgjyzxlInput: function(e) {
        this.setData({
            szgjyzxl: e.detail.value
        });
    },
    onSzgjyzxlSwitchChange: function(e) {
        this.setData({
            szgjyzxlDisabled: !e.detail.value
        });
    },
    onQbgjyInput: function(e) {
        this.setData({
            qbgjy: e.detail.value
        });
    },
    onQbgjySwitchChange: function(e) {
        this.setData({
            qbgjyDisabled: !e.detail.value
        });
    },
    onSzzzpyInput: function(e) {
        this.setData({
            szzzpy: e.detail.value
        });
    },
    onSzzzpySwitchChange: function(e) {
        this.setData({
            szzzpyDisabled: !e.detail.value
        });
    },
    onZznMGSResultInput: function(e) {
        this.setData({
            zznMGSResult: e.detail.value
        });
    },
    onZznMGSResultSwitchChange: function(e) {
        this.setData({
            zznMGSResultDisabled: !e.detail.value
        });
    },
    onCsljyInput: function(e) {
        this.setData({
            csljy: e.detail.value
        });
    },
    onCsljySwitchChange: function(e) {
        this.setData({
            csljyDisabled: !e.detail.value
        });
    },
    onMsisChange: function(e) {
        this.setData({
            msisIndex: e.detail.value,
        });
    },
    onMsisSwitchChange: function(e) {
        this.setData({
            msisDisabled: !e.detail.value
        });
    },
    onZzclChange: function(e) {
        this.setData({
            zzclIndex: e.detail.value,
        });
    },
    onZzclSwitchChange: function(e) {
        this.setData({
            zzclDisabled: !e.detail.value
        });
    },
    // -------- 入院后信息 end -------- //

    // -------- 提示框 begin -------- //
    loadProgress: function() {
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
    completeProgress: function() {
        this.setData({
            loadProgress: 100
        });
    },
    showToast: function(msg) {
        wx.showToast({
            icon: 'none',
            title: msg,
        });
    },
    showLoading: function() {
        this.setData({
            loadModal: true
        });
    },
    hideLoading: function() {
        setTimeout(() => {
            this.setData({
                loadModal: false
            });
        }, 1500);
    },
    // -------- 提示框 end -------- //

    // -------- 模态对话框 start -------- //
    showModal: function(e) {
        this.setData({
            modalName: e.currentTarget.dataset.target
        });
    },
    hideModal: function(e) {
        this.setData({
            modalName: null
        });
    },
    // -------- 模态对话框 end  -------- //

    // -------- 上传图片 start --------- //
    onChooseImage: function(e) {
        let that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                const tempFilePaths = res.tempFilePaths;
                switch (e.target.dataset.le) {
                    case "11":
                        that.setData({
                            pic1: tempFilePaths
                        });
                        break;
                    case "12":
                        that.setData({
                            pic2: tempFilePaths
                        });
                        break;
                    case "13":
                        that.setData({
                            pic3: tempFilePaths
                        });
                        break;
                    case "21":
                        that.setData({
                            pic4: tempFilePaths
                        });
                        break;
                    case "22":
                        that.setData({
                            pic5: tempFilePaths
                        });
                        break;
                    case "23":
                        that.setData({
                            pic6: tempFilePaths
                        });
                        break;
                    case "31":
                        that.setData({
                            pic7: tempFilePaths
                        });
                        break;
                    case "32":
                        that.setData({
                            pic8: tempFilePaths
                        });
                        break;
                    case "33":
                        that.setData({
                            pic9: tempFilePaths
                        });
                        break;
                    case "41":
                        that.setData({
                            pic10: tempFilePaths
                        });
                        break;
                    case "42":
                        that.setData({
                            pic11: tempFilePaths
                        });
                        break;
                    case "43":
                        that.setData({
                            pic12: tempFilePaths
                        });
                        break;
                }
            }
        });
    },
    onRemovePic: function(e) {
        let that = this;
        switch (e.target.dataset.le) {
            case "11":
                that.setData({
                    pic1: ''
                });
                break;
            case "12":
                that.setData({
                    pic2: ''
                });
                break;
            case "13":
                that.setData({
                    pic3: ''
                });
                break;
            case "21":
                that.setData({
                    pic4: ''
                });
                break;
            case "22":
                that.setData({
                    pic5: ''
                });
                break;
            case "23":
                that.setData({
                    pic6: ''
                });
                break;
            case "31":
                that.setData({
                    pic7: ''
                });
                break;
            case "32":
                that.setData({
                    pic8: ''
                });
                break;
            case "33":
                that.setData({
                    pic9: ''
                });
                break;
            case "41":
                that.setData({
                    pic10: ''
                });
                break;
            case "42":
                that.setData({
                    pic11: ''
                });
                break;
            case "43":
                that.setData({
                    pic12: ''
                });
                break;
        }
    },
    // -------- 上传图片 end  ---------- //

    onLoad: function(options) {
        this.loadProgress();
        this.setData({
            centerId: options.centerId ? options.centerId : '',
            centerName: options.centerName ? options.centerName : '',
            isAdmin: app.globalData.is_admin == '1'
        });
        this.completeProgress();
    },

    submit: function(e) {
        if (this.data.ShowBasic) { // 基本信息
            this.submitBasic()
        } else if (this.data.ShowDiagnose) { // 诊断性穿刺
            this.submitDiagnose()
        } else if (this.data.ShowAdmission) { // 入院后信息
            this.submitAdmission()
        }
    },

    submitBasic() {},
    submitDiagnose() {},
    submitAdmission() {},

    verify: function(e) {
        if (this.data.ShowBasic) { // 基本信息
            this.verifyBasic()
        } else if (this.data.ShowDiagnose) { // 诊断性穿刺
            this.verifyDiagnose()
        } else if (this.data.ShowAdmission) { // 入院后信息
            this.verifyAdmission()
        }
    },

    verifyBasic(){},
    verifyDiagnose() { },
    verifyAdmission() { },
});