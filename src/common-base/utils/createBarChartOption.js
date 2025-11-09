export default function (model) {
  let xAxisNames = [];
  let yAxisValues = [];
  
  for (let i = 0; i < model.length; i++) {
    xAxisNames.push(model[i].subject);
    yAxisValues.push((parseFloat(model[i].revenueRatio) * 100).toFixed(2));
  }
  
  let option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {  // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function (params) {
        return params[0].name + '<br/> 营收比' + params[0].value + ' % ';
      }
    },
    legend: {
      data: ['营收比']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      name: '人员',
      type: 'category',
      data: xAxisNames
    },
    yAxis: {
      name: '',
      type: 'value'
    },
    series: [
      {
        name: '营收比',
        data: yAxisValues,
        type: 'bar'
      }]
  }
  return option
}
