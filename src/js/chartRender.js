/*
 * @Author: taochen
 * @Date:   2016-11-22 11:14:52
 * @Last Modified by:   taochen
 * @Last Modified time: 2016-11-26 20:11:50
 */
var $ = require("jquery")
var echarts = require("echarts")
var chartData = require("../data.json")


// 对数据进行百分化处理
function asset_round(data) {
    var weight = (Math.round(data * 10000) / 100).toFixed(2);
    return weight
}

var asset_name = [];
$.each(chartData.data.ef_curve.asset, function(index, ele) {
    $.each(ele, function(i, v) {
        asset_name.push(v)
    })
})

var point_x = {};
var point_y = {};

//获取第一张图表数据（散点图）
var label = [];
var label_x = [];
var label_y = [];
$.each(chartData.data.ef_curve.points, function(index, ele) {
    label_x.push(ele.sigma)
    label_y.push(ele.r)
})
for (var i = 0; i < label_x.length; i++) {
    var label_total = []
    label_total.push(label_x[i])
    label_total.push(label_y[i])
    label.push(label_total)
}
var label2 = [];
var label2_x = [];
var label2_y = [];
var label_all = [];
if (chartData.data.pre_scheme.points) {
    $.each(chartData.data.pre_scheme.points, function(index, ele) {
        label2_x.push(ele.sigma)
        label2_y.push(ele.r)
    })
    for (var j = 0; j < label2_x.length; j++) {
        var label2_total = []
        label2_total.push(label2_x[j])
        label2_total.push(label2_y[j])
        label2.push(label2_total)
    }
    label_all.push(label, label2)
} else {
    label_all.push(label)
}

//绘制第一张图表（散点图）
var chart1 = echarts.init(document.getElementById('line1'));

option1 = {
    grid: {
        left: '3%',
        right: '7%',
        bottom: '3%',
        containLabel: true
    },
    tooltip: {
        trigger: 'axis',
        formatter: function(params) {
            if (params.value == undefined) {
                return '收益: ' + (Math.round(params.data.yAxis * 10000) / 100).toFixed(2) + '% ,风险：' + (Math.round(params.data.xAxis * 10000) / 100).toFixed(2) + '%';
            } else if (params.value.length > 1) {
                return '收益：' + (Math.round(params.value[1] * 10000) / 100).toFixed(2) + '% , 风险：' + (Math.round(params.value[0] * 10000) / 100).toFixed(2) + '%'
            } else {
                return (Math.round(params.value[1] * 10000) / 100).toFixed(2) + (Math.round(params.value[0] * 10000) / 100).toFixed(2)
            }


        },
        axisPointer: {
            show: true,
            type: 'cross',
            lineStyle: {
                type: 'dashed',
                width: 1
            }
        }
    },
    xAxis: [{
        type: 'value',
        scale: true,
        axisLabel: {
            formatter: '{value}',
            textStyle: {
                color: '#fff'
            }
        },
        splitLine: {
            show: false,
            lineStyle: {
                type: 'dashed',
                color: '#766080',
            }

        },
        name: '风险',
        nameTextStyle: {
            color: '#fff'
        }
    }],
    yAxis: [{
        type: 'value',
        scale: true,
        axisLabel: {
            formatter: '{value}',
            textStyle: {
                color: '#fff'
            }
        },
        splitLine: {
            lineStyle: {
                type: 'dashed',
                color: '#766080',
            }

        },
        nameTextStyle: {
            color: '#fff'
        },
        name: '收益'
    }],
    series: [{
        type: 'scatter',
        data: label_all[0],
        symbolSize: 5,
        zlevel: 100,
        markPoint: {
            data: [
                { label: 'current', name: '当前点', xAxis: chartData.data.ef_curve.current_point.sigma, yAxis: chartData.data.ef_curve.current_point.r },
                { label: 'growth', name: '激进', xAxis: 0.0783, yAxis: 0.1307 },
                { label: 'moderate', name: '保守', xAxis: 0.0044, yAxis: 0.0664 },
                { label: 'conservative', name: '平衡', xAxis: 0.0511, yAxis: 0.1072 }
            ],
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        formatter: function(params, ticket, callback) {
                            return params.name;
                        },
                        textStyle: {
                            color: '#000'
                        }
                    },
                    color: '#FFAE00'
                }
            },
            symbolSize: 70,
            symbol: 'pin'
        }
    }, {
        type: 'scatter',
        data: label_all[1],
        symbolSize: 5
    }]
};
chart1.setOption(option1)

//获取第二张图表数据（动态饼状图）
var pie_label = [];
$.each(chartData.data.ef_curve.points[0].weight, function(index, ele) {
    if (ele < 0.0001) {} else {
        var arr = { value: Number(ele.toFixed(4)), name: asset_name[index] }
        pie_label.push(arr)
    }
})

//绘制第二张图表（动态饼状图）
var chart2 = echarts.init(document.getElementById('pie1'));

option2 = {
    title: {
        text: '选中点',
        left: 'center',
        textStyle: {
            color: '#fff'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {d}%"
    },
    series: [{
        name: '权重',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: pie_label,
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }]
};
chart2.setOption(option2)

//绘制第三张图表（动态柱状图）
var chart3 = echarts.init(document.getElementById('bar1'));

option3 = {
    title: {
        text: '选中点',
        left: 'center',
        textStyle: {
            color: '#fff'
        }
    },
    tooltip: {
        trigger: 'axis',
        formatter: '{a}:{c}%'
    },
    grid: {
        left: 'center'
    },
    calculable: true,
    xAxis: [{
        type: 'category',
        data: ['预期年化收益率'],
        axisLabel: {
            formatter: '{value}',
            textStyle: {
                color: '#fff'
            }
        }
    }],
    yAxis: [{
        type: 'value',
        axisLabel: {
            formatter: '{value}%',
            textStyle: {
                color: '#fff'
            }
        }
    }],
    series: [{
        name: '预期年化收益率',
        type: 'bar',
        data: [(Math.round(chartData.data.ef_curve.points[0].r * 10000) / 100).toFixed(2)],
        barWidth: 50
    }]
};
chart3.setOption(option3);


// 绘制第四张和第五张图表（静态饼状图和柱状图）
var chart4 = echarts.init(document.getElementById('pie2'));
var chart5 = echarts.init(document.getElementById('bar2'));

var option4 = {
    title: {
        text: '当前点',
        textStyle: {
            color: '#FFF'
        },
        x: 'center',

    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c}%"
    },
    series: [{
        name: '权重',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [{ value: 100, name: '人民币' }],
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }]
};

var option5 = {
    title: {
        text: '当前点',
        left: 'center',
        textStyle: {
            color: '#fff'
        }
    },
    tooltip: {
        trigger: 'axis',
        formatter: '{a}:{c}%'
    },
    grid: {
        left: 'center'
    },
    calculable: true,
    xAxis: [{
        type: 'category',
        data: ['预期年化收益率'],
        axisLabel: {
            textStyle: {
                color: '#fff'
            }
        }
    }],
    yAxis: [{
        type: 'value',
        axisLabel: {
            formatter: '{value}%',
            textStyle: {
                color: '#fff'
            }
        }
    }],
    series: [{
        name: '预期年化收益率',
        type: 'bar',
        barWidth: 50,
        data: [1.42]
    }]
};
chart4.setOption(option4);
chart5.setOption(option5);

// 绘制第六、七、八张图表（保守平衡激进三个饼状图）
var chart6 = echarts.init(document.getElementById('pie3'));
var chart7 = echarts.init(document.getElementById('pie4'));
var chart8 = echarts.init(document.getElementById('pie5'));

var option6 = {
    title: {
        text: '保守',
        textStyle: {
            color: '#FFF'
        },
        x: 'left'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c}%"
    },
    series: [{
        name: '权重',
        textStyle: {
            color: '#FFF'
        },
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
            { value: 0.13, name: '中国基金' },
            { value: 3.1, name: '中国企业债（交易）' },
            { value: 2.41, name: '美国股票' },
            { value: 1.04, name: '欧洲股票' },
            { value: 0.04, name: '发展中国家股票' },
            { value: 0.69, name: '中国房地产' },
            { value: 92.59, name: '中国金融产品' }
        ],
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }]
};
var option7 = {
    title: {
        text: '平衡',
        textStyle: {
            color: '#FFF'
        },
        x: 'left'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c}%"
    },
    series: [{
        name: '权重',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
            { value: 6.65, name: '中国基金' },
            { value: 27.66, name: '美国股票' },
            { value: 20.3, name: '欧洲股票' },
            { value: 9.85, name: '中国房地产' },
            { value: 35.54, name: '中国金融产品' }
        ],
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }]
};
var option8 = {
    title: {
        text: '激进',
        textStyle: {
            color: '#FFF'
        },
        x: 'left'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c}%"
    },
    series: [{
        name: '权重',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
            { value: 10.43, name: '中国基金' },
            { value: 42.32, name: '美国股票' },
            { value: 31.22, name: '欧洲股票' },
            { value: 15.15, name: '中国房地产' },
            { value: 0.88, name: '中国金融产品' }
        ],
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }]
};
// 使用刚指定的配置项和数据显示图表。
chart6.setOption(option6);
chart7.setOption(option7);
chart8.setOption(option8);


//获取第九张图表数据（回测数据表）
var backtest_Label = [];
$.each(chartData.data.back_test, function(index, ele) {
    var nv = [];
    $.each(ele.nv, function(i, v) {
        nv.push(Number(v.toFixed(4)))
    })
    var arr = { name: ele.name, type: 'line', data: nv }
    backtest_Label.push(arr)
})


// 绘制第九张图表（回测数据表）
var chart9 = echarts.init(document.getElementById('line2'));
option9 = {
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: chartData.data.back_test.hold.date,
        axisLabel: {
            textStyle: {
                color: '#fff'
            }
        },
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            textStyle: {
                color: '#fff'
            }
        },
        splitLine: {
            lineStyle: {
                color: '#424159'
            }
        }
    },
    series: backtest_Label
};
chart9.setOption(option9);



//最后一张表格数据
var tbody = '';
$.each(chartData.data.static_table.row, function(index, ele) {
    tbody += '<tr class="n">';
    $.each(chartData.data.ef_curve.asset, function(k, v) {
        $.each(v, function(i, n) {
            if (i == index) {
                tbody += '<td>' + n + '</td>'
            }
        })
    })
    if (ele.value < 1) {
        tbody += '<td>' + ele.value.toFixed(2) + '</td>'
    } else if (ele.value > 1) {
        tbody += '<td>' + String(ele.value.toFixed(2)).replace(/\B(?=(?:\d{3})+\b)/g, ',') + '</td>'
    }
    tbody += '<td>' + (Math.round(ele.weight * 10000) / 100).toFixed(2) + '%</td>'
    tbody += '<td></td>'
    tbody += '<td></td>'
    tbody += '<td></td>'
    tbody += '<td>' + (Math.round(ele.model_r * 10000) / 100).toFixed(2) + '%</td>'
    tbody += '<td>' + (Math.round(ele.model_sigma * 10000) / 100).toFixed(2) + '%</td>'
    tbody += '</tr>';
})

tbody += '<tr><td rowspan="3" class="comp">组合描述</td><td>当前市值</td><td>' + String(chartData.data.static_table.capital).replace(/\B(?=(?:\d{3})+\b)/g, ',') + '</td><td>组合当前收益率</td><td class="comp_r">' + (Math.round(chartData.data.ef_curve.points[0].r * 10000) / 100).toFixed(2) + '%' + '</td><td></td><td>组合当前波动率</td><td class="comp_s">' + (Math.round(chartData.data.ef_curve.points[0].sigma * 10000) / 100).toFixed(2) + '%</td></tr>';
tbody += '<tr><td>增量金额</td><td>' + String(chartData.data.static_table.increase_money.toFixed(2)).replace(/\B(?=(?:\d{3})+\b)/g, ',') + '</td><td>权益配置</td><td class="equity_w">' + Number(chartData.data.ef_curve.points[0].equityW).toFixed(2) + '</td><td></td><td>风险乘数</td><td class="risk_m">' + Number(chartData.data.ef_curve.points[0].risk_multiplier).toFixed(2) + '</td><td></td></tr>';
tbody += '<tr><td>权益可接受最大亏损</td><td class="equity_ml">' + String(chartData.data.ef_curve.points[0].equity_max_loss.toFixed(2)).replace(/\B(?=(?:\d{3})+\b)/g, ',') + '</td><td></td><td></td><td></td><td></td><td></td></tr>';

$('#tbody').append(tbody)

$.each($('#tbody tr.n'), function(k, n) {
    $('#tbody tr').eq(k).find('td').eq(3).html(asset_round(chartData.data.ef_curve.points[0].weight[k]) + '%');
    $('#tbody tr').eq(k).find('td').eq(4).html(String(chartData.data.ef_curve.points[0].value[k].toFixed(2)).replace(/\B(?=(?:\d{3})+\b)/g, ','));
    $('#tbody tr').eq(k).find('td').eq(5).html(String(chartData.data.ef_curve.points[0].diff[k].toFixed(2)).replace(/\B(?=(?:\d{3})+\b)/g, ','));
})



// 实现图表数据联动功能
chart1.on('mouseover', function(params) {
    if (params.componentType === 'series' || params.componentType === 'markPoint') {
        if (params.name != "当前点") {
            var index = params.dataIndex;
            var data_name = params.name;
            if (params.componentType === 'markPoint') {
                switch (data_name) {
                    case "激进":
                        index = chartData.data.ef_curve.growth.point;
                        break;
                    case "保守":
                        index = chartData.data.ef_curve.moderate.point;
                        break;
                    case "平衡":
                        index = chartData.data.ef_curve.conservative.point;
                        break;
                }

            }
            $.each(chartData.data.ef_curve.points, function(i, v) {
                if (i == index) {
                    $.each($('#tbody tr.n'), function(k, n) {
                        //$('#tbody tr.n').eq(k).find('td').eq(3).html(Number(v.weight[k]).toFixed(2));
                        $('#tbody tr.n').eq(k).find('td').eq(3).html(asset_round(v.weight[k]) + '%');
                        $('#tbody tr.n').eq(k).find('td').eq(4).html(String(v.value[k].toFixed(2)).replace(/\B(?=(?:\d{3})+\b)/g, ','));
                        $('#tbody tr.n').eq(k).find('td').eq(5).html(String(v.diff[k].toFixed(2)).replace(/\B(?=(?:\d{3})+\b)/g, ','));
                    })
                    $('#tbody tr .comp_r').html((Math.round(v.r * 10000) / 100).toFixed(2) + '%');
                    $('#tbody tr .comp_s').html((Math.round(v.sigma * 10000) / 100).toFixed(2) + '%');
                    $('#tbody tr .equity_w').html(Number(v.equityW).toFixed(2));
                    $('#tbody tr .risk_m').html(Number(v.risk_multiplier).toFixed(2));
                    $('#tbody tr .equity_ml').html(String(v.equity_max_loss.toFixed(2)).replace(/\B(?=(?:\d{3})+\b)/g, ','));

                    var pie1_label_new = [];
                    $.each(v.weight, function(k, n) {
                        if (n < 0.0001) {} else {
                            var arr = { value: Number(n.toFixed(4)), name: asset_name[k] }
                            pie1_label_new.push(arr)
                        }
                    })
                    chart2.setOption({
                        series: [{
                            data: pie1_label_new
                        }]
                    })
                    chart3.setOption({
                        series: [{
                            data: [(Math.round(v.r * 10000) / 100).toFixed(2)]
                        }]
                    })
                }
            })
        }

    }
})

// 加载完毕后隐去CSS-loading
$("#loading").hide(500);
