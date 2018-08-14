window.It = {};
It.getParameterByUrl = function(){
  var str = location.search;
  var obj = {};
  if(!str)
  {
    return obj;
  }
  if(str.length == 1)
  {f
    return obj;
  }
  str = str.slice(1);
  var arr = str.split('&');
  arr.forEach(function(v,i){
    var itemArr = v.split('=');
    obj[itemArr[0]] = decodeURIComponent(itemArr[1]);
  })
  return obj;
} 
//封装ajax 为了 拦截data==400情况的发生
It.ajax = function(options){
  var current = options.success;
  options.success = function(data){
    if(data.error == '400')
    {
      location.href = 'http://127.0.0.1:3000/mobile/user/login.html?returnUrl=' + encodeURIComponent(location.href);
      return;
    }
    else {
      current(data);
    }
  }
  $.ajax(options);
}