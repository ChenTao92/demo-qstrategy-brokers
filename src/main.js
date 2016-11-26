/*
* @Author: taochen
* @Date:   2016-11-22 12:26:18
* @Last Modified by:   taochen
* @Last Modified time: 2016-11-26 12:28:49
*/


var $ = require("jquery")

// 图表绘制渲染脚本
require("./js/chartRender.js")

// 表格展开收起脚本
$('#an').click(function(){
  $(this).toggleClass('al');
  if($(this).hasClass('al')){
    $('#hide-table').animate({'bottom':'0'});
    $(this).text('收起表格')
  }else{
    $('#hide-table').animate({'bottom':'-300px'});
    $('#hide-table .table-cot').animate({'scrollTop':'0'});
    $(this).text('展开表格');
  }
});
