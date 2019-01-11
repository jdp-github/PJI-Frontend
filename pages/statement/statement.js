import * as echarts from '../../ec-canvas/echarts';

let infectChart = null;
let typeChart = null;
let finishChart = null;

function initFinishChart(canvas, width, height) {
    finishChart = echarts.init(canvas, null, {
        width: width,
        height: height
    });
    canvas.setChart(finishChart);

    var option = {
        tooltip : {
            trigger: 'axis',
            axisPointer : {
                type : 'shadow'
            }
        },
        legend: {
            data:['已审核','未审核','未完成']
        },
        grid: {
            left: '3%',
            right: '8%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : ['1月','2月','3月','4月','5月','6月']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'已审核',
                type:'bar',
                stack: 'total',
                label: {
                    normal: {
                        show: true,
                        position: 'insideTop'
                    }
                },
                data:[320, 332, 301, 334, 390, 330]
            },
            {
                name:'未审核',
                type:'bar',
                stack: 'total',
                label: {
                    normal: {
                        show: true,
                        position: 'insideTop'
                    }
                },
                data:[120, 132, 101, 134, 90, 230]
            },
            {
                name:'未完成',
                type:'bar',
                stack: 'total',
                label: {
                    normal: {
                        show: true,
                        position: 'insideTop'
                    }
                },
                data:[220, 182, 191, 234, 290, 330]
            },
        ]
    };

    finishChart.setOption(option);
    return finishChart;
}

function initInfectChart(canvas, width, height) {
    infectChart = echarts.init(canvas, null, {
        width: width,
        height: height
    });
    canvas.setChart(infectChart);

    var option = {
        color: ['#ef473a', '#91c7ae'],
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data:['感染','非感染']
        },
        series: [
            {
                name:'感染/非感染',
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center',
                        formatter: '{b} \n {c} ({d}%)',

                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '14',
                            fontWeight: '300',
                        }
                    },
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {value:335, name:'感染'},
                    {value:310, name:'非感染'},
                ]
            }
        ]
    };

    infectChart.setOption(option);
    return infectChart;
}

function initTypeChart(canvas, width, height) {
    typeChart = echarts.init(canvas, null, {
        width: width,
        height: height
    });
    canvas.setChart(typeChart);

    var option = {
        color: ['#334b5c', '#de9325'],
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data:['置换术后','占位器']
        },
        series: [
            {
                name:'置换术后/占位器',
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center',
                        formatter: '{b} \n {c} ({d}%)',

                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '14',
                            fontWeight: '300',
                        }
                    },
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {value:40, name:'置换术后'},
                    {value:310, name:'占位器'},
                ]
            }
        ]
    };

    typeChart.setOption(option);
    return typeChart;
}

Page({
    data: {
        infectEc: {
            onInit: initInfectChart,
        },
        typeEc: {
            onInit: initTypeChart,
        },
        finishEc: {
            onInit: initFinishChart,
        }
    },
});
