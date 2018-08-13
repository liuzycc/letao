$(function(){
  //1.初始化加载数据
  //上拉刷新 下拉加载
  //2.点击搜索加载页面
  //3.点击标签刷新数据
  new App();
})
var App = function(){
  //获取用户要查询的内容
  this.val = It.getParameterByUrl().key;
  this.valinput = $('.tit input');
  this.valinput.val(this.val);
  //获取要绑定的元素
  this.list = $('.lt_product');
  //获取要绑定的事件对象
  this.soBtn = $('.tit a');
  this.selectlist = $('.select');
  this.page = 1;
  this.pageSize = 4;
  this.obj = {};
  this.init();
}
App.prototype = {
  init:function(){
    this.initPullRefresh();
    this.bindEvent();
  },
  // 初始化上拉加载
  initPullRefresh:function(){
    var _this = this;
    mui.init({
      pullRefresh : {
        container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
        down : {
          height:50,//可选,默认50.触发下拉刷新拖动距离,
          auto: true,//可选,默认false.首次加载自动下拉刷新一次
          contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
          contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
          contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
          callback :  function(){
            _this.page = 1;
            _this.loadlist(function(data){
              //初始化obj
              _this.obj = {};
              _this.list.html(template('plane',data));
              mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
              //放开上拉加载
              mui('#refreshContainer').pullRefresh().refresh(true);
            });
          } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        },
        up : {
          height:50,//可选.默认50.触发上拉加载拖动距离
          auto:true,//可选,默认false.自动上拉加载一次
          contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
          contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
          callback :function(){
            _this.page++;
            _this.loadlist(function(data){
              console.log(data);
              //如果没有数据取消上拉加载
              setTimeout(function(){
                _this.obj = {};
              _this.list.append(template('plane',data));
              mui('#refreshContainer').pullRefresh().endPullupToRefresh(!data.data.length);
              },1000)
            })
          } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        }
      }
    });
  },
  //加载数据
  loadlist:function(callback){
    $.ajax({
      type:'get',
      url:'/product/queryProduct',
      data:$.extend({ page:this.page,pageSize:this.pageSize,proName:this.valinput.val()},this.obj),
      dataType:'json',
      success:function(data){
        console.log(data);
        callback && callback(data);
      }
    })
  },
  //绑定事件
  bindEvent:function(){
    var _this = this;
    //搜索按钮
    this.soBtn.on('tap',function(){
      //判断是否为空
      if(!_this.valinput.val()){
        mui.toast('请输入文字');
        return;
      }
      //主动触发下拉刷新去渲染列表
      mui('#refreshContainer').pullRefresh().pulldownLoading();
    })
    //点击标签栏
    this.selectlist.on('tap','a',function(){
      //样式改变
      $(this).addClass('now').siblings().removeClass('now');
      $(this).find('span').attr('class')=='fa fa-chevron-up'?$(this).find('span').attr('class','fa fa-chevron-down'):$(this).find('span').attr('class','fa fa-chevron-up');
      var selectName = this.dataset.name;
      var order = $(this).find('span').attr('class')=='fa fa-chevron-up'?2:1;
      _this.obj[selectName] = order;
      //主动触发下拉刷新去渲染列表
      mui('#refreshContainer').pullRefresh().pulldownLoading();
    })
  }


}