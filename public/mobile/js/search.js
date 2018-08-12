//需要完成的业务
//初始化页面获取本地缓存数据（有数据加载出来，没有数据显示  ‘您没有历史搜索记录’ ）
//点击删除按钮 删除数据
//点击搜索添加数据（超过10条删除第一个追加最新的，有重复的删除添加最新的，直接添加）最后跳转搜索结果页面
//点击清空记录 清空数据

$(function(){
  new App();
})
var App = function(){
  //获取本地缓存数据
  this.key = 'soso';
  this.list = JSON.parse(localStorage.getItem('soso')||'[]');
  this.$conUl = $('.con-ul');
  this.$soBth = $('.tit a');
  this.titInput = $('.tit input');
  this.$clearBtn = $('.con-tit a');
  this.init();
  this.bindEvent();
}
App.prototype = {
  // 初始化页面
  init:function(){
    this.$conUl.html(template('conul',this.list));
  },
  //绑定事件
  bindEvent:function(){
    var _this = this;
    // 搜索按钮
    this.$soBth.on('tap',function(){
      var valcc = _this.titInput.val();
      if(!valcc)
      {
        mui.toast('请输入要搜索的内容');
        return; 
      }
      _this.addHistory(valcc);
    })
    //删除事件
    this.$conUl.on('click','li a',function(){
      var index = $(this).data('index');
      _this.removeHistory(index);
      //重新渲染页面
      _this.init();
    })
    //清空记录
    this.$clearBtn.on('click',function(){
      _this.list.length = 0;
      localStorage.setItem(_this.key,JSON.stringify(_this.list));
      //重新渲染页面
      _this.init();
    })
  },
  addHistory:function(value){
    if(this.list.indexOf(value) != -1)
    {
      //之前数组存在
      this.list.splice(this.list.indexOf(value),1);
    }
    else if(this.list.length == 10)
    {
      //已经存储10条数据的情况
      this.list.pop();
    }
    this.list.push(value);
    localStorage.setItem(this.key,JSON.stringify(this.list));
    this.titInput.val('');
    //跳转页面
    location.href = './searchlist.html';
  },
  removeHistory:function(index){
    if(this.list.length < index)
    {
      //不存在退出
      return;
    }
    this.list.splice(index,1);
    localStorage.setItem(this.key,JSON.stringify(this.list));
  },
  clearHistory:function(){}
}