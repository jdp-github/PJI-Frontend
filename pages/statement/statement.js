import * as echarts from '../../ec-canvas/echarts';

let infectChart = null;

function initInfectChart(canvas, width, height) {
    infectChart = echarts.init(canvas, null, {
        width: width,
        height: height
    });
    canvas.setChart(infectChart);

    var option = {
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

Page({
    data: {
        infectEc: {
            onInit: initInfectChart,
        }
    },

});
