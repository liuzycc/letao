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