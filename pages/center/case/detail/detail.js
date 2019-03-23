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

        // -------- 公用信息 begin -------- //
        centerId: '',
        centerName: '',
        caseId: '',
        isCreateCase: '',
        caseInfo: {},
        addAvatar: '',
        updateAvatarArr: [],
        approveAvatar: '',
        // -------- 公用信息 end -------- //

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
        // 部位
        part: 0,
        partPicker: ['请选择', '髋', '膝'],
        // 类型
        type: 0,
        typePicker: ['请选择', '置换术后', '占位器'],
        // 末次手术至今时长
        operationDateMultiArray: [
            ['单位'],
            ['天', '周', '月', '年'],
            ['1天', '2天', '3天', '4天', '5天', '6天', '7天', '8天', '9天', '10天', '11天', '12天', '13天', '14天', '15天', '16天', '17天', '18天', '19天', '20天', '21天', '22天', '23天', '24天', '25天', '26天', '27天', '28天', '29天', '30天', '31天']
        ],
        operationDateMultiIndex: [0, 0],
        operationDisabled: true,
        // 症状出现时长
        symptomDateMultiArray: [
            ['单位'],
            ['天', '周', '月', '年'],
            ['1天', '2天', '3天', '4天', '5天', '6天', '7天', '8天', '9天', '10天', '11天', '12天', '13天', '14天', '15天', '16天', '17天', '18天', '19天', '20天', '21天', '22天', '23天', '24天', '25天', '26天', '27天', '28天', '29天', '30天', '31天']
        ],
        symptomDateMultiIndex: [0, 0],
        xingzhiIndex: 0,
        xingzhiValue: '',
        // 是否合并风湿免疫性疾病
        ris: 0,
        risPicker: ['请选择', '否', '类风湿', '强制性脊柱炎', '其他 (请在备注中标明)'],
        qtbsjb: '',
        antibiotic: 0,
        antibioticPicker: ['请选择', '是', '否'],
        jybs: '',
        cbzd: '',
        tssxbz: '',
        isBaseLock: 0,
        // -------- 基本信息 end -------- //

        // -------- 诊断性穿刺 begin -------- //
        chuangciDate: '请选择日期',
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
        sqcrp: '',
        bzhcrp: '',
        il6: '',
        il6Disabled: true,
        xwdby: '',
        xwdbyDisabled: true,
        ddimer: '',
        ddimerDisabled: true,
        shoushuDate: '请选择日期',
        ssDateDisabled: true,
        szjnIndex: 0,
        szjnPicker: ["请选择", "脓性液体", "未见脓液"],
        szjnDisabled: true,
        blIndex: 0,
        blPicker: ["请选择", "<5", "5-10", ">10"],
        blDisabled: true,
        szLEIndex: 0,
        szLEPicker: ["请选择", "无法判定", "neg.", "25", "75", "250(+)", "500(+)"],
        szLEDisabled: true,
        szLEAfterIndex: 0,
        szLEAfterPicker: ["请选择", "无法判定", "neg.", "25", "75", "250(+)", "500(+)"],
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
        pic1Upload: '',
        pic2: '',
        pic2Upload: '',
        pic3: '',
        pic3Upload: '',
        pic4: '',
        pic4Upload: '',
        pic5: '',
        pic5Upload: '',
        pic6: '',
        pic6Upload: '',
        pic7: '',
        pic7Upload: '',
        pic8: '',
        pic8Upload: '',
        pic9: '',
        pic9Upload: '',
        pic10: '',
        pic10Upload: '',
        pic11: '',
        pic11Upload: '',
        pic12: '',
        pic12Upload: '',
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
                if (!this.data.isCreateCase) {
                    this.setData({
                        addAvatar: this.data.caseInfo.base.base_creator_avatar,
                        updateAvatarArr: this.makeUpdateAvatar(this.data.caseInfo.base.base_editor_list),
                        approveAvatar: this.data.caseInfo.base.base_auditor_avatar,
                    })
                    console.log("addAvatar1:"+this.data.addAvatar)
                    console.log("updateAvatarArr1:" + this.data.updateAvatarArr)
                }
                break;
            case 1:
                this.setData({
                    TabCur: tabId,
                    VerticalNavTop: (tabId - 1) * 50,
                    ShowBasic: false,
                    ShowDiagnose: true,
                    ShowAdmission: false,
                });
                if (!this.data.isCreateCase) {
                    this.setData({
                        addAvatar: this.data.caseInfo.puncture.puncture_creator_avatar,
                        updateAvatarArr: this.makeUpdateAvatar(this.data.caseInfo.puncture.puncture_editor_list),
                        approveAvatar: this.data.caseInfo.puncture.puncture_auditor_avatar,
                    })
                    console.log("addAvatar2:" + this.data.addAvatar)
                    console.log("updateAvatarArr2:" + this.data.updateAvatarArr)
                }
                break;
            case 2:
                this.setData({
                    TabCur: tabId,
                    VerticalNavTop: (tabId - 1) * 50,
                    ShowBasic: false,
                    ShowDiagnose: false,
                    ShowAdmission: true,
                });
                if (!this.data.isCreateCase) {
                    this.setData({
                        addAvatar: this.data.caseInfo.bein.bein_creator_avatar,
                        updateAvatarArr: this.makeUpdateAvatar(this.data.caseInfo.bein.bein_editor_list),
                        approveAvatar: this.data.caseInfo.bein.bein_auditor_avatar,

                    })
                    console.log("addAvatar3:" + this.data.addAvatar)
                    console.log("updateAvatarArr3:" + this.data.updateAvatarArr)
                }
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
    onSexChange: function(e) {
        this.setData({
            sex: parseInt(e.detail.value)
        });
    },
    onAgeInput: function(e) {
        this.setData({
            age: e.detail.value,
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
        if (this.data.tel2Disabled) {
            this.setData({
                tel2: ''
            });
        }
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
        if (this.data.operationDisabled) {
            this.setData({
                operationDateMultiIndex: [0, 0]
            })
        }
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
        if (data.symptomDateMultiIndex[1] == 0 || data.symptomDateMultiIndex[1] == 1) {
            this.setData({
                xingzhiIndex: 1,
                xingzhiValue: '急性'
            })
        } else {
            this.setData({
                xingzhiIndex: 2,
                xingzhiValue: '慢性'
            })
        }
        this.setData(data);
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
        this.setData({
            ccDateDisabled: !e.detail.value
        });
        if (this.data.ccDateDisabled) {
            this.setData({
                chuangciDate: "请选择日期"
            })
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
        if (this.data.ccDescribeDisabeld) {
            this.setData({
                ccDescribe: ''
            })
        }
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
        if (this.data.ccgjyDisabled) {
            this.setData({
                ccgjy: ''
            })
        }
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
        if (this.data.ccgxyDisabled) {
            this.setData({
                ccgxy: ''
            })
        }
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
        if (this.data.leDisabled) {
            this.setData({
                leIndex: 0,
                pic1: '',
                pic2: '',
                pic3: '',
            })
        }
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
        if (this.data.leAfterDisabled) {
            this.setData({
                leAfterIndex: 0,
                pic4: '',
                pic5: '',
                pic6: '',
            })
        }
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
        if (this.data.gjybxbDisabled) {
            this.setData({
                gjybxb: ''
            })
        }
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
        if (this.data.gjyzxDisabled) {
            this.setData({
                gjyzx: ''
            })
        }
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
        if (this.data.bcpysjDisabled) {
            this.setData({
                bcpysjIndex: 0
            })
        }
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
        if (this.data.drgpypDisabled) {
            this.setData({
                drgpyp: ''
            })
        }
    },
    onBcxyChange: function(e) {
        this.setData({
            bcxyResult: e.detail.value,
        });
    },
    onBcxySwitchChange: function(e) {
        this.setData({
            bcxyResultDisabled: !e.detail.value
        });
        if (this.data.bcxyResultDisabled) {
            this.setData({
                bcxyResult: ''
            })
        }
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
        if (this.data.bcxyLastDisabled) {
            this.setData({
                bcxyLast: ''
            })
        }
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
        if (this.data.bcyyResultDisabled) {
            this.setData({
                bcyyResult: ""
            })
        }
    },
    onBcyyLastChange: function(e) {
        this.setData({
            bcyyLast: e.detail.value,
        });
    },
    onBcyyLastSwitchChange: function(e) {
        this.setData({
            bcyyLastDisabled: !e.detail.value
        });
        if (this.data.bcyyLastDisabled) {
            this.setData({
                bcyyLast: ''
            })
        }
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
        if (this.data.mNGSResultDisabled) {
            this.setData({
                mNGSResult: ''
            })
        }
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
        });
    },
    onSqcrpChange: function(e) {
        this.setData({
            sqcrp: e.detail.value,
            bzhcrp: e.detail.value * 10
        });
    },
    onIl6Change: function(e) {
        this.setData({
            il6: e.detail.value
        });
    },
    onIl6SwitchChange: function(e) {
        this.setData({
            il6Disabled: !e.detail.value
        });
        if (this.data.il6Disabled) {
            this.setData({
                il6: ''
            })
        }
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
        if (this.data.xwdbyDisabled) {
            this.setData({
                xwdby: ''
            })
        }
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
        if (this.data.ddimerDisabled) {
            this.setData({
                ddimer: ''
            })
        }
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
        if (this.data.ssDateDisabled) {
            this.setData({
                shoushuDate: '请选择日期'
            })
        }
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
        if (this.data.szjnDisabled) {
            this.setData({
                szjnIndex: 0
            })
        }
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
        if (this.data.blDisabled) {
            this.setData({
                blIndex: 0
            })
        }
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
        if (this.data.szLEDisabled) {
            this.setData({
                szLEIndex: 0
            })
        }
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
        if (this.data.szLEAfterDisabled) {
            this.setData({
                szLEAfterIndex: 0
            })
        }
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
        if (this.data.szgjybxbDisabled) {
            this.setData({
                szgjybxb: ""
            })
        }
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
        if (this.data.szgjyzxlDisabled) {
            this.setData({
                szgjyzxl: ""
            })
        }
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
        if (this.data.qbgjyDisabled) {
            this.setData({
                qbgjy: ""
            })
        }
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
        if (this.data.szzzpyDisabled) {
            this.setData({
                szzzpy: ""
            })
        }
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
        if (this.data.zznMGSResultDisabled) {
            this.setData({
                zznMGSResult: ""
            })
        }
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
        if (this.data.csljyDisabled) {
            this.setData({
                csljy: ""
            })
        }
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
        if (this.data.msisDisabled) {
            this.setData({
                msisIndex: 0
            })
        }
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
        if (this.data.zzclDisabled) {
            this.setData({
                zzclIndex: 0
            })
        }
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
    showModal: function(e, errMsg) {
        if (e.currentTarget) {
            this.setData({
                modalName: e.currentTarget.dataset.target
            });
        } else {
            this.setData({
                modalName: e,
                errMsg: errMsg
            });
        }
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
                that.uploadImg(e.target.dataset.le, tempFilePaths[0])
            }
        });
    },
    uploadImg(le, filePath) {
        let that = this;
        that.showLoading();
        wx.uploadFile({
            url: constant.basePath + "",
            filePath: filePath,
            name: "file",
            formData: {
                service: 'Common.Upload'
            },
            header: {
                "Content-Type": "multipart/form-data"
            },
            success(res) {
                that.hideLoading();
                let data = JSON.parse(res.data)
                if (data.data.code == 0) {
                    switch (le) {
                        case "11":
                            that.setData({
                                pic1: data.data.info.url,
                                pic1Upload: data.data.info.file,
                            });
                            break;
                        case "12":
                            that.setData({
                                pic2: data.data.info.url,
                                pic2Upload: data.data.info.file,
                            });
                            break;
                        case "13":
                            that.setData({
                                pic3: data.data.info.url,
                                pic3Upload: data.data.info.file,
                            });
                            break;
                        case "21":
                            that.setData({
                                pic4: data.data.info.url,
                                pic4Upload: data.data.info.file,
                            });
                            break;
                        case "22":
                            that.setData({
                                pic5: data.data.info.url,
                                pic5Upload: data.data.info.file,
                            });
                            break;
                        case "23":
                            that.setData({
                                pic6: data.data.info.url,
                                pic6Upload: data.data.info.file,
                            });
                            break;
                        case "31":
                            that.setData({
                                pic7: data.data.info.url,
                                pic7Upload: data.data.info.file,
                            });
                            break;
                        case "32":
                            that.setData({
                                pic8: data.data.info.url,
                                pic8Upload: data.data.info.file,
                            });
                            break;
                        case "33":
                            that.setData({
                                pic9: data.data.info.url,
                                pic9Upload: data.data.info.file,
                            });
                            break;
                        case "41":
                            that.setData({
                                pic10: data.data.info.url,
                                pic10Upload: data.data.info.file,
                            });
                            break;
                        case "42":
                            that.setData({
                                pic11: data.data.info.url,
                                pic11Upload: data.data.info.file,
                            });
                            break;
                        case "43":
                            that.setData({
                                pic12: data.data.info.url,
                                pic12Upload: data.data.info.file
                            });
                            break;
                    }
                } else {
                    that.showModal("ErrModal", data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
    onRemovePic: function(e) {
        let that = this;
        switch (e.target.dataset.le) {
            case "11":
                that.setData({
                    pic1: '',
                    pic1Upload: ''
                });
                break;
            case "12":
                that.setData({
                    pic2: '',
                    pic2Upload: ''
                });
                break;
            case "13":
                that.setData({
                    pic3: '',
                    pic3Upload: ''
                });
                break;
            case "21":
                that.setData({
                    pic4: '',
                    pic4Upload: ''
                });
                break;
            case "22":
                that.setData({
                    pic5: '',
                    pic5Upload: ''
                });
                break;
            case "23":
                that.setData({
                    pic6: '',
                    pic6Upload: ''
                });
                break;
            case "31":
                that.setData({
                    pic7: '',
                    pic7Upload: ''
                });
                break;
            case "32":
                that.setData({
                    pic8: '',
                    pic8Upload: ''
                });
                break;
            case "33":
                that.setData({
                    pic9: '',
                    pic9Upload: ''
                });
                break;
            case "41":
                that.setData({
                    pic10: '',
                    pic10Upload: ''
                });
                break;
            case "42":
                that.setData({
                    pic11: '',
                    pic11Upload: ''
                });
                break;
            case "43":
                that.setData({
                    pic12: '',
                    pic12Upload: ''
                });
                break;
        }
    },
    // -------- 上传图片 end  ---------- //

    onLoad: function(options) {
        this.loadProgress();
        var caseId = options.case_id
        this.setData({
            centerId: options.centerId ? options.centerId : '',
            centerName: options.centerName ? options.centerName : '',
            isAdmin: app.globalData.is_admin == '1',
            caseId: caseId,
            isCreateCase: caseId.length <= 0,
        });
        if (!this.data.isCreateCase) {
            this.requestCaseInfo(caseId)
        } else {
            this.setData({
                addAvatar: app.globalData.avatarUrl
            })
        }
        this.completeProgress();
    },

    requestCaseInfo(caseId) {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.GetCaseInfo',
                case_id: caseId
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.GetCaseInfo:" + JSON.stringify(res))
                that.hideLoading();
                if (res.data.data.code == 0) {
                    that.initViewByData(res.data.data)
                } else {
                    that.showModal("ErrModal", res.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },

    initViewByData(info) {
        this.setData({
            caseInfo: info
        });
        // 基本信息
        this.setData({
            name: info.base.patient_name,
            caseNO: info.base.case_no,
            createDate: util.formatTime(info.base.create_time, 'Y-M-D'),
            sex: info.base.sex,
            age: info.base.age,
            height: info.base.height,
            weight: info.base.weight,
            bmi: info.base.bmi,
            chiefDoc: info.base.pro_doctor,
            tel1: info.base.telphone1,
            tel2: info.base.telphone2,
            tel2Disabled: this.getValueDisable(info.base.telphone2),
            part: info.base.part,
            type: info.base.type,
            'operationDateMultiIndex[2]': info.base.last_to_now,
            'operationDateMultiIndex[1]': info.base.last_to_now_unit,
            operationDisabled: this.getNumDisable(info.base.last_to_now),
            'symptomDateMultiIndex[2]': info.base.duration_symptoms,
            'symptomDateMultiIndex[1]': info.base.duration_symptoms_unit,
            xingzhiIndex: info.base.duration_symptoms_prop,
            xingzhiValue: info.base.duration_symptoms_prop == 1 ? "急性" : "慢性",
            ris: info.base.is_merge_disease,
            qtbsjb: info.base.other_concomitant_diseases,
            antibiotic: info.base.is_used_antibiotics,
            jybs: info.base.medical_history,
            cbzd: info.base.diagnose,
            tssxbz: info.base.special_matter,
            addAvatar: info.base.base_creator_avatar,
            updateAvatarArr: this.makeUpdateAvatar(info.base.base_editor_list),
            approveAvatar: info.base.base_auditor_avatar,
            isBaseLock: info.base.is_lock
        })
        // 诊断性穿刺
        this.setData({
            chuangciDate: this.getDefaultDate(info.puncture.puncture_date),
            ccDateDisabled: this.getNumDisable(info.puncture.puncture_date),
            ccDescribe: info.puncture.puncture_desc,
            ccDescribeDisabeld: this.getValueDisable(info.puncture.puncture_desc),
            ccgjy: this.getDefaultNum(info.puncture.rinse_fluid_volume),
            ccgjyDisabled: this.getNumDisable(info.puncture.rinse_fluid_volume),
            ccgxy: this.getDefaultNum(info.puncture.rinse_lavage_volume),
            ccgxyDisabled: this.getNumDisable(info.puncture.rinse_lavage_volume),
            leIndex: info.puncture.le_testpaper_stoste,
            leDisabled: this.getNumDisable(info.puncture.le_testpaper_stoste),
            leAfterIndex: info.puncture.le_testpaper_centrifugal,
            leAfterDisabled: this.getNumDisable(info.puncture.le_testpaper_centrifugal),
            gjybxb: this.getDefaultNum(info.puncture.joint_fluid_leukocyte),
            gjybxbDisabled: this.getNumDisable(info.puncture.joint_fluid_leukocyte),
            gjyzx: this.getDefaultNum(info.puncture.neutrophils_percent),
            gjyzxDisabled: this.getNumDisable(info.puncture.neutrophils_percent),
            bcpysjIndex: info.puncture.culture_type,
            bcpysjDisabled: this.getNumDisable(info.puncture.culture_type),
            drgpyp: this.getDefaultNum(info.puncture.culture_bottle_fluid_volume),
            drgpypDisabled: this.getNumDisable(info.puncture.culture_bottle_fluid_volume),
            bcxyResult: info.puncture.aerobic_culture_result,
            bcxyResultDisabled: this.getValueDisable(info.puncture.aerobic_culture_result),
            bcxyLast: this.getDefaultNum(info.puncture.aerobic_culture_time),
            bcxyLastDisabled: this.getNumDisable(info.puncture.aerobic_culture_time),
            bcyyResult: info.puncture.anaerobic_culture_result,
            bcyyResultDisabled: this.getValueDisable(info.puncture.anaerobic_culture_result),
            bcyyLast: this.getDefaultNum(info.puncture.anaerobic_culture_time),
            bcyyLastDisabled: this.getNumDisable(info.puncture.anaerobic_culture_time),
            mNGSResult: info.puncture.joint_fluid_mngs_result,
            mNGSResultDisabled: this.getValueDisable(info.puncture.joint_fluid_mngs_result),
            // TOOD 标本
        })
        // 入院后信息
        this.setData({
            doudaoIndex: info.bein.sious,
            sqesr: info.bein.preoperative_esr,
            sqcrp: info.bein.preoperative_crp,
            bzhcrp: this.getDefaultNum(info.bein.normal_crp),
            il6: this.getDefaultNum(info.bein.il6),
            il6Disabled: this.getNumDisable(info.bein.il6),
            xwdby: this.getDefaultNum(info.bein.fibrinogen),
            xwdbyDisabled: this.getNumDisable(info.bein.fibrinogen),
            ddimer: this.getDefaultNum(info.bein.dimer),
            ddimerDisabled: this.getNumDisable(info.bein.dimer),
            shoushuDate: this.getDefaultDate(info.bein.operation_date),
            ssDateDisabled: this.getNumDisable(info.bein.operation_date),
            szjnIndex: info.bein.culture_pus,
            szjnDisabled: this.getNumDisable(info.bein.culture_pus),
            blIndex: info.bein.pathology,
            blDisabled: this.getNumDisable(info.bein.pathology),
            szLEIndex: info.bein.intrao_le_testpaper_stoste,
            szLEDisabled: this.getNumDisable(info.bein.intrao_le_testpaper_stoste),
            // doudaoIndex: info.bein.intrao_le_testpaper_pic, // TODO pic
            szLEAfterIndex: info.bein.intrao_le_testpaper_centrifugal,
            szLEAfterDisabled: this.getNumDisable(info.bein.intrao_le_testpaper_centrifugal),
            // doudaoIndex: info.bein.intrao_le_testpaper_centr_pic, // TODO pic
            szgjybxb: this.getDefaultNum(info.bein.intrao_joint_fluid_leukocyte),
            szgjybxbDisabled: this.getNumDisable(info.bein.intrao_joint_fluid_leukocyte),
            szgjyzxl: this.getDefaultNum(info.bein.intrao_neutrophils_percent),
            szgjyzxlDisabled: this.getNumDisable(info.bein.intrao_neutrophils_percent),
            qbgjy: info.bein.all_culture_result,
            qbgjyDisabled: this.getValueDisable(info.bein.all_culture_result),
            szzzpy: info.bein.intrao_culture_result,
            szzzpyDisabled: this.getValueDisable(info.bein.intrao_culture_result),
            zznMGSResult: info.bein.tissue_ngs_result,
            zznMGSResultDisabled: this.getNumDisable(info.bein.tissue_ngs_result),
            csljy: info.bein.ultrasonic_degradation_ngs_result,
            csljyDisabled: this.getNumDisable(info.bein.ultrasonic_degradation_ngs_result),
            msisIndex: info.bein.msis,
            msisDisabled: this.getNumDisable(info.bein.msis),
            zzclIndex: info.bein.final_disposal,
            zzclDisabled: this.getNumDisable(info.bein.final_disposal)
        })
    },

    getDefaultNum(num) {
        return num > 0 ? num : ""
    },

    getDefaultDate(date) {
        var dateValue = "请选择日期"
        if (date != 0) {
            dateValue = util.formatTime(date, 'Y-M-D')
        }
        return dateValue
    },

    getValueDisable(value) {
        return value.length <= 0
    },

    getNumDisable(value) {
        return value <= 0
    },

    makeUpdateAvatar(avatarObjList) {
        debugger
        var avatarList = [];
        var avatarLen = avatarObjList.length;
        for (var i = 0; i < avatarLen; i++) {
            if (avatarObjList[i].base_editor_avatar) {
                avatarList[i] = avatarObjList[i].base_editor_avatar
            } else if (avatarObjList[i].puncture_editor_avatar) {
                avatarList[i] = avatarObjList[i].puncture_editor_avatar
            } else if (avatarObjList[i].bein_editor_avatar) {
                avatarList[i] = avatarObjList[i].bein_editor_avatar
            }

        }
        return avatarList
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

    submitBasic() {
        if (!this.isBasicValueRight()) {
            return;
        }

        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.CreateEditCaseBase',
                case_id: that.data.caseId,
                openid: app.globalData.openid,
                json_data: that.makeBasicData()
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.CreateEditCaseBase:" + JSON.stringify(res))
                that.hideLoading();
                if (res.data.data.code == 0) {
                    that.reloadPrePage()
                    wx.navigateBack({
                        delta: 1
                    })
                } else {
                    that.showModal("ErrModal", res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },

    makeBasicData() {
        let that = this;
        var jsonData = {
            center_id: that.data.centerId,
            patient_name: that.data.name,
            case_no: that.data.caseNO,
            create_time: new Date(that.data.createDate).getTime() / 1000,
            sex: that.data.sex,
            age: parseInt(that.data.age),
            height: parseFloat(that.data.height),
            weight: parseFloat(that.data.weight),
            bmi: parseFloat(that.data.bmi),
            pro_doctor: that.data.chiefDoc,
            telphone1: that.data.tel1,
            telphone2: that.data.tel2,
            part: parseInt(that.data.part),
            type: parseInt(that.data.type),

            // 末次手术至今时长
            last_to_now: parseInt(that.data.operationDateMultiIndex[2]) + 1,
            // 末次手术至今时长单位。1天，2月
            last_to_now_unit: parseInt(that.data.operationDateMultiIndex[1]),
            // 症状出现时长
            duration_symptoms: parseInt(that.data.symptomDateMultiIndex[2]) + 1,
            // 症状出现时长单位。1天，2月(必填项)
            duration_symptoms_unit: parseInt(that.data.symptomDateMultiIndex[1]),
            // 症状出现时长性质。1急性，2慢性(必填项)
            duration_symptoms_prop: parseInt(that.data.xingzhiIndex),

            is_merge_disease: parseInt(that.data.ris),
            other_concomitant_diseases: that.data.qtbsjb,
            is_used_antibiotics: parseInt(that.data.antibiotic),
            medical_history: that.data.jybs,
            diagnose: that.data.cbzd,
            special_matter: that.data.tssxbz,
        }
        console.log("基本信息：" + JSON.stringify(jsonData))
        return JSON.stringify(jsonData)
    },
    submitDiagnose() {
        let that = this;
        that.showLoading();

        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.CreateEditCasePuncture',
                case_id: that.data.caseId,
                openid: app.globalData.openid,
                json_data: that.makeDiagnoseData()
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.hideLoading();
                if (res.data.data.code == 0) {
                    that.reloadPrePage()
                    wx.navigateBack({
                        delta: 1
                    })
                } else {
                    that.showModal("ErrModal", res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
    makeDiagnoseData() {
        let that = this
        var lePic = {
            pic1Upload: that.data.pic1Upload,
            pic2Upload: that.data.pic2Upload,
            pic3Upload: that.data.pic3Upload,
        }
        var leCentrPic = {
            pic4Upload: that.data.pic4Upload,
            pic5Upload: that.data.pic5Upload,
            pic6Upload: that.data.pic6Upload,
        }
        var jsonData = {
            puncture_date: that.data.ccDateDisabled ? 0 : new Date(that.data.chuangciDate).getTime() / 1000,
            puncture_desc: that.data.ccDescribe,
            rinse_fluid_volume: parseFloat(this.getDefaultValue(that.data.ccgjy)),
            rinse_lavage_volume: parseFloat(this.getDefaultValue(that.data.ccgxy)),
            le_testpaper_stoste: parseInt(this.getDefaultValue(that.data.leIndex)),
            le_testpaper_pic: JSON.stringify(lePic),
            le_testpaper_centrifugal: parseInt(this.getDefaultValue(that.data.leAfterIndex)),
            le_testpaper_centr_pic: JSON.stringify(leCentrPic),
            joint_fluid_leukocyte: parseInt(this.getDefaultValue(that.data.gjybxb)),
            neutrophils_percent: parseFloat(this.getDefaultValue(that.data.gjyzx)),
            culture_type: parseInt(this.getDefaultValue(that.data.bcpysjIndex)),
            culture_bottle_fluid_volume: parseFloat(this.getDefaultValue(that.data.drgpyp)),
            aerobic_culture_result: that.data.bcxyResult,
            aerobic_culture_time: parseInt(this.getDefaultValue(that.data.bcxyLast)),
            anaerobic_culture_result: that.data.bcyyResult,
            anaerobic_culture_time: parseInt(this.getDefaultValue(that.data.bcyyLast)),
            joint_fluid_mngs_result: that.data.mNGSResult,
        }
        console.log("穿刺：" + JSON.stringify(jsonData))
        return JSON.stringify(jsonData)
    },

    getDefaultValue(value) {
        return value.length == 0 ? 0 : value
    },

    submitAdmission() {
        if (!this.isAdmissionValueRight()) {
            return;
        }
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.CreateEditCasePuncture',
                case_id: that.data.caseId,
                openid: app.globalData.openid,
                json_data: that.makePunctureData()
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.hideLoading();
                if (res.data.data.code == 0) {
                    that.reloadPrePage()
                    wx.navigateBack({
                        delta: 1
                    })
                } else {
                    that.showModal("ErrModal", res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
    makePunctureData() {
        let that = this
        var lePic = {
            pic7Upload: that.data.pic7Upload,
            pic8Upload: that.data.pic8Upload,
            pic9Upload: that.data.pic9Upload,
        }
        var leCentrPic = {
            pic10Upload: that.data.pic10Upload,
            pic11Upload: that.data.pic11Upload,
            pic12Upload: that.data.pic12Upload,
        }
        var jsonData = {
            sious: parseInt(that.data.doudaoIndex),
            preoperative_esr: parseInt(this.getDefaultValue(that.data.sqesr)),
            preoperative_crp: parseFloat(this.getDefaultValue(that.data.sqcrp)),
            normal_crp: parseFloat(this.getDefaultValue(that.data.bzhcrp)),
            il6: parseFloat(this.getDefaultValue(that.data.il6)),
            fibrinogen: parseFloat(this.getDefaultValue(that.data.xwdby)),
            dimer: parseFloat(this.getDefaultValue(that.data.ddimer)),
            operation_date: that.data.ssDateDisabled ? 0 : new Date(that.data.shoushuDate).getTime() / 1000,
            culture_pus: parseInt(this.getDefaultValue(that.data.szjnIndex)),
            pathology: parseInt(this.getDefaultValue(that.data.blIndex)),
            intrao_le_testpaper_stoste: parseInt(this.getDefaultValue(that.data.szLEIndex)),
            intrao_le_testpaper_pic: JSON.stringify(lePic),
            intrao_le_testpaper_centrifugal: parseInt(this.getDefaultValue(that.data.szLEAfterIndex)),
            intrao_le_testpaper_centr_pic: JSON.stringify(leCentrPic),
            intrao_joint_fluid_leukocyte: parseFloat(this.getDefaultValue(that.data.szgjybxb)),
            intrao_neutrophils_percent: parseFloat(this.getDefaultValue(that.data.szgjyzxl)),
            all_culture_result: that.data.qbgjy,
            intrao_culture_result: that.data.szzzpy,
            tissue_ngs_result: that.data.zznMGSResult,
            ultrasonic_degradation_ngs_result: that.data.csljy,
            msis: parseInt(this.getDefaultValue(that.data.msisIndex)),
            final_disposal: parseInt(this.getDefaultValue(that.data.zzclIndex)),
        }
        console.log("入院后：" + JSON.stringify(jsonData))
        return JSON.stringify(jsonData)
    },

    isBasicValueRight() {
        if (this.data.name.length <= 0) {
            this.showToast("请填写姓名")
            return false;
        }
        if (this.data.caseNO.length <= 0) {
            this.showToast("请填写病历号")
            return false;
        }
        if (this.data.sex == 0) {
            this.showToast("请选择性别")
            return false;
        }
        if (this.data.age.length <= 0) {
            this.showToast("请填写年龄")
            return false;
        }
        if (this.data.height.length <= 0) {
            this.showToast("请填写身高")
            return false;
        }
        if (this.data.weight.length <= 0) {
            this.showToast("请填写体重")
            return false;
        }
        if (this.data.chiefDoc.length <= 0) {
            this.showToast("请填写主诊医师")
            return false;
        }
        if (this.data.tel1.length <= 0) {
            this.showToast("请填写联系电话1")
            return false;
        }
        if (this.data.part == 0) {
            this.showToast("请选择部位")
            return false;
        }
        if (this.data.type == 0) {
            this.showToast("请选择类型")
            return false;
        }
        if (this.data.xingzhiIndex == 0) {
            this.showToast("请选择症状出现时长")
            return false;
        }
        if (this.data.ris == 0) {
            this.showToast("请选择是否合并风湿免疫性疾病")
            return false;
        }
        if (this.data.qtbsjb.length <= 0) {
            this.showToast("请填写其他伴随疾病")
            return false;
        }
        if (this.data.antibiotic == 0) {
            this.showToast("请选择近期(2周)应用抗生素")
            return false;
        }
        if (this.data.jybs.length <= 0) {
            this.showToast("请填写简要病史")
            return false;
        }
        if (this.data.cbzd.length <= 0) {
            this.showToast("请填写初步诊断")
            return false;
        }
        if (this.data.tssxbz.length <= 0) {
            this.showToast("请填写特殊事项备注")
            return false;
        }

        return true;
    },
    isAdmissionValueRight() {
        if (this.data.doudaoIndex == 0) {
            this.showToast("请选择窦道")
            return false;
        }
        if (this.data.sqesr.length <= 0) {
            this.showToast("请填写术前ESR")
            return false;
        }
        if (this.data.sqcrp.length <= 0) {
            this.showToast("请填写术前CRP")
            return false;
        }

        return true;
    },

    verify: function(e) {
        this.showToast("ss")
        if (this.data.ShowBasic) { // 基本信息
            this.verifyBasic()
        } else if (this.data.ShowDiagnose) { // 诊断性穿刺
            this.verifyDiagnose()
        } else if (this.data.ShowAdmission) { // 入院后信息
            this.verifyAdmission()
        }
    },

    verifyBasic() {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.Approve',
                case_id: that.data.caseId,
                openid: app.globalData.openid,
                type: 1
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.hideLoading();
                if (res.data.data.code == 0) {
                    that.reloadPrePage()
                    wx.navigateBack({
                        delta: 1
                    })
                } else {
                    that.showModal("ErrModal", res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
    verifyDiagnose() {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.Approve',
                case_id: that.data.caseId,
                openid: app.globalData.openid,
                type: 2
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.hideLoading();
                if (res.data.data.code == 0) {
                    that.reloadPrePage()
                    wx.navigateBack({
                        delta: 1
                    })
                } else {
                    that.showModal("ErrModal", res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
    verifyAdmission() {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.Approve',
                case_id: that.data.caseId,
                openid: app.globalData.openid,
                type: 3
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.hideLoading();
                if (res.data.data.code == 0) {
                    that.reloadPrePage()
                    wx.navigateBack({
                        delta: 1
                    })
                } else {
                    that.showModal("ErrModal", res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
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
});