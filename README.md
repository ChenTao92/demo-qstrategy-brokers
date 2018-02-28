# 宽客实验室

## Data
- API: `http://103.20.249.126/api/assetAllocation/default?client_id=164`
- 由于有cookie验证，所以这里先用下载的json作为数据源

## 仿写页面预览
预览：[demo-qstrategy-brokers](https://taylor-chan.github.io/demo-qstrategy-brokers/dist/)

## 仿写页面实现

- 使用ECharts进行绘图
- 使用jQuery操作DOM
- 使用Stylus作为CSS预处理器
- 使用Normalize.css规范化样式
- 使用FontAwesome提供Icon
- 使用Yarn进行包管理
- 使用Webpack进行项目整理打包

## 原页面使用库

- `jQuery`： DOM操作
- `Echarts`：百度开源的图表库
- `font-awesome`：图标字体库
- `jQuery.cookie.js插件`：一个轻量级的cookie插件
- `DataTables`：jQuery表格插件
- `loaders.css`：CSS加载动画
- `layer.js&layer.css`：基于jQuery的web弹层组件


## 改进意见

### Tech

- 考虑使用打包器（例如webpack）对各资源进行打包，节省http请求资源开销，合并压缩提高页面加载速度（浏览器并发线程只有6个）
- 部分JS中使用了字符串拼接的方式组装返回left-content，但这种方式存在隐患，容易出错，可以考虑使用模板引擎来处理这一部分
- CSS某些功能可以考虑使用更为成熟的库，比如栅格系统
- 部分页面响应式实现不完善，在小屏幕下样式破碎
- 考虑使用组件化方式来实现页面，使用React或者Vue

### UI

- 页面设计不是很美观，考虑使用Bootstrap或者Material改善样式


- 智能投资-单策略智投和多策略组合智投、宽客实验室-回溯队列等多处页面，下方均呈现大量空白


