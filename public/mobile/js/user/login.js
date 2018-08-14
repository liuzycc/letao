$(function(){
  /**
   * 1.获取用户名和密码数据
   * 2.非空校验
   * 3.提交登录
   * 4.响应成功
   * 4.1登录成功  success:true  回跳来源页面|个人中心
   * 4.2登录失败  s提示用户错误信息
   */
  $('form').on('submit',function(e){
    e.preventDefault();
    // var data = this.serialize();//键值对字符串
    var dataArray = $(this).serializeArray();//数组对象
    //为什么要转：数组不好进行校验
    var data = {};
    //非空检验
    dataArray.forEach(function(item,i){
      data[item.name] = item.value;
    })
    // console.log(data);
    if(!data.username)
    {
      mui.toast('请输入用户名');
      return;
    }
    if(!data.password)
    {
      mui.toast('请输入密码');
      return;
    }
    //ajax
    $.ajax({
      type:'post',
      url:'/user/login',
      data:data,
      dataType:'json',
      success:function(data){
        if(data.success)
        {
          //成功
          var returnUrl = It.getParameterByUrl().returnUrl;
          if(returnUrl)
          {
            location.href = returnUrl;
          }else{
            location.href = './index.html'
          }
        }
        else{
          //失败
          mui.toast(data.message);
        }
      }
    })
    
  })
})