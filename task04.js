/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
  //返回年月日的格式
}

function randomBuildData(seed) {
  //定义了一个返回的对象数据
  var returnData = {};
  //设置的初始数据
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    //格式化日期
    datStr = getDateStr(dat);
    //2016-01-01: 500*0.5
    returnData[datStr] = Math.ceil(Math.random() * seed);
    //该日期设置日期加一天
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

var formGraTime = document.getElementById("form-gra-time");
var citySelect = document.getElementById("city-select");
var wrapper = document.getElementsByClassName("aqi-chart-wrap")[0];

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: "北京",
  nowGraTime: "day"
};
 
/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var nowCityData = aqiSourceData[pageState.nowSelectCity];
  //nowCityData是确定的一个城市的92天降水数组，key是日期
  //nowCityData[key]是降水量

  //定义空气质量的总数，总的天数，以及总的周数
  var aqiDataSum = 0,
      aqiDataDay = 0,
      aqiDataweek = 0,
      aqiDataMonth = 0;
  //判断当前页面的选择的状态
  if (pageState.nowGraTime === "day") {
     chartData = nowCityData;
     //是一个每天的数据对象
  }else if (pageState.nowGraTime === "week") {
    //每个城市的数据
    for(var item in nowCityData){
      aqiDataSum += nowCityData[item];
      aqiDataDay++;
      //getDay(),返回值是 0（周日） 到 6（周六） 之间的一个整数
      //对周的判断,为一周的判断
      if ((new Date(item)).getDay() === 6) {
        aqiDataweek++;
        chartData["第"+aqiDataweek + "周"] = Math.floor(aqiDataSum/aqiDataDay);
        //重新赋值为0;
        aqiDataSum = 0;
        aqiDataDay = 0;
      }
    }
    //保证最后一周若不满也能算一周
    if (aqiDataDay != 0) {
      week++;
      chartData["第"+aqiDataweek + "周"] = Math.floor(aqiDataSum/aqiDataDay);
    }
  }else if(pageState.nowGraTime === "month"){
      //每个城市的数据
      for(var item in nowCityData){
        aqiDataSum += nowCityData[item];
        aqiDataDay++;
        //getMonth(),返回值是 0（一月） 到 11（十二月） 之间的一个整数
        //对月的判断
        if ((new Date(item)).getMonth() !== month) {
          aqiDataMonth++;
          chartData["第"+aqiDataMonth + "月"] = Math.floor(aqiDataSum/aqiDataDay);
          //重新赋值为0;
          aqiDataSum = 0;
          aqiDataDay = 0;
        }
    }
    //保证最后一周若不满也能算一周
    if (aqiDataDay != 0) {
      week++;
      chartData["第"+aqiDataMonth + "月"] = Math.floor(aqiDataSum/aqiDataDay);
    }
  }

}


/**
 * 渲染图表
 */
   //随机颜色
function getRandomColor(){
   return  '#' +
     (function(color){
     return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])
       && (color.length == 6) ?  color : arguments.callee(color);
   })('');
}

function renderChart() {
    var color,
        aqiDataContent = '';
    for(var item in chartData){
      color = getRandomColor();
      aqiDataContent += '<div title="'+item+":"+ "空气指数为"+chartData[item]+'" style="height:'+chartData[item]+'px; background-color:'+color+'"></div>';
     }
  wrapper.innerHTML = aqiDataContent;
}
initAqiChartData();
renderChart();
/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 

  // 设置对应数据

  // 调用图表渲染函数
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 

  // 设置对应数据

  // 调用图表渲染函数
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {

}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项

  // 给select设置事件，当选项发生变化时调用函数citySelectChange

}



/**
 * 初始化函数
 */
// function init() {
//   initGraTimeForm()
//   initCitySelector();
//   initAqiChartData();
// }

// init();
