$(function(){
  //1.上拉刷新
  //2.点击按钮刷新
  //3.初始化加载数据
  //4.删除
  //5.编辑
  new App();
})
var App = function(){
  //获取要绑定的容器
  this.$container = $('.mui-scroll');
  this.cartlist = null;
  this.init();
  this.bindEvent();
}
App.prototype = {
  init:function(){
    var _this = this;
    //初始化滚动区域
    mui('.mui-scroll-wrapper').scroll();
    //下拉刷新
    mui.init({
      pullRefresh : {
        container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
        down : {
          auto: true,//可选,默认false.首次加载自动下拉刷新一次
          callback : function(){
            var that = this;
            _this.render(function(data){
              console.log(data);
              mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
            })  
          }
        }
      }
    });
  },
  render:function(callback){
    var _this = this;
    if (_this.cartlist) {
      //绑定模板引擎
      _this.$container.html(template('tpl', _this.cartlist));
      _this.caleNum();
      callback && callback(_this.cartlist);
    }
    else {
      //请求数据
      It.ajax({
        type: 'get',
        url: '/cart/queryCart',
        success: function (data) {
          _this.cartlist = data;
          //绑定模板引擎
          _this.$container.html(template('tpl', data));
          _this.caleNum();
          callback && callback(data);
        }
      })
    }
  },
  bindEvent:function(){
    var _this = this;
    $('body').on('tap','.fa-trash',function(){
      //获取当前index
      var index = $(this).data('index');
      _this.delInfo(index);
    }).on('tap','.fa-edit',function(){
      //获取当前index
      var index = $(this).data('index');
      var order = $(this).data('order');
      _this.editInfo(index,order);
    })
    //绑定弹窗里面的事件
    $('body').on('tap','.pro_size span',function(){
			this.classList.add('now');
			$(this).siblings().removeClass('now');
		}).on('tap','.box .reduce',function(){
      console.log('---');
			var input = $('.box input');
			var num = input.val();
			if(--num <= 0)
			{
				mui.toast('不能再小了');
				return;
			}
			input.val(num);
		}).on('tap','.box .add',function(){
			var input = $('.box input');
			var max = $('.num').text();
			var num = input.val();
			if(++num > max)
			{
				mui.toast('没有库存了亲~');
				return;
			}
			input.val(num);
    })
    //绑定单选框事件
    $('body').on('change','input[type="checkbox"]',function(){
      console.log(this.checked);
      var index = $(this).data('index');
      var current = _this.cartlist[index];
      current.ischecked = this.checked;
      _this.caleNum();
    })
  },
  delInfo:function(index){
    var _this = this;
    var id = _this.cartlist[index].id;
    It.ajax({
      type:'get',
      url:'/cart/deleteCart',
      data:{id:id},
      dataType:'json',
      success:function(data){
        if(data.success)
        {
          _this.cartlist.splice(index,1);
          console.log(_this.cartlist);
          //重新渲染
          _this.render();
        }
      }
    })
  },
  editInfo:function(index,order){
    //1.弹窗
    //2.赋值信息
    //3.更新信息
    //4.渲染页面
    var _this = this;
    var currentLi = $('#cart li').get(order);
    var listinone = this.cartlist[index];
    console.log(listinone);
    var html = template('tpl2',listinone).replace(/\n/g,'');
    mui.confirm(html,'编辑商品',['取消','编辑'],function(e){
      if(e.index == 1){
        //编辑
        //获取数据
        var id = listinone.id;
        var size = $('.pro_size span.now').text();
        var num = $('.box input').val();
        It.ajax({
          type:'post',
          url:'/cart/updateCart',
          data:{id:id,size:size,num:num},
          dataType:'json',
          success:function(data){
            if(data.success)
            {
              listinone.size = size;
              listinone.num = num;
              _this.render();
            }
          }
        })
      }else{
        //取消
        mui.swipeoutClose(currentLi);//当前列表的dom对象 li
      }
    })
  },
  caleNum:function(){
    //获取所有选中的并计算合
    var listCheckbox = $('#cart li input[type="checkbox"]:checked');
    var num = 0;
    for(var i=0;i<listCheckbox.length;i++)
    {
      num += listCheckbox.eq(i).closest('li').data('price') * listCheckbox.eq(i).closest('li').data('num');
    }
    console.log(num);
    $('.priceAll').text(num.toFixed(2));
  }
}