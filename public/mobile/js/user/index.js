$(function(){
  //1.渲染页面
  //2.点击退出登录  退出 并跳转到登录页
  new App();
})
var App = function(){
  //获取元素
  this.$logout = $('.mui-btn-danger');
  this.init();
}
App.prototype = {
  init:function(){
    var _this = this;
    It.ajax({
      type:'get',
      url:'/user/queryUserMessage',
      data:{},
      dataType:'',
      success:function(data){
        console.log(data);
        _this.render(data);
      }
    })
    this.bindEvent();
  },
  //渲染
  render:function(data){
    $('.userimg').attr('src',data.img||'../images/user.jpg');
    $('.username').text(data.username);
    $('.userphone').text(data.mobile);
  },
  bindEvent:function(){
    var _this = this;
    $('.userimg').error(function(){
      this.src='../images/user.jpg';
    })
    _this.$logout.on('click',function(){
      $.ajax({
        type:'get',
        url:'/user/logout',
        success:function(data){
          if(data.success)
          {
            location.href = '/mobile/user/login.html';
          }
        }
      })
    })
  }
}