$(function(){
	new App();
})
var App = function(){
	this.id = It.getParameterByUrl().id;
	//获取渲染的父元素
	this.$container = $('.mui-scroll');
	//获取立刻购买和加入购物车元素
	this.$pay = $('.pay');
	this.$addCar = $('.addCar');
	//初始化页面
	this.init();
}
App.prototype = {
	init:function(){
		this.loadData();
		this.bindEvent();
	},
	//加载数据
	loadData:function(){
		var _this = this;
		$.ajax({
			type:'get',
			url:'/product/queryProductDetail',
			data:{id:this.id},
			dataType:'json',
			success:function(data){
				console.log(data);
				_this.render(data);
			}
		})
	},
	//渲染
	render:function(data){
		this.$container.html(template('Area',data));
		this.lunboGo();
	},
	bindEvent:function(){
		var _this = this;
		this.$container.on('tap','.pro_size span',function(){
			this.classList.add('now');
			$(this).siblings().removeClass('now');
		}).on('tap','.box .reduce',function(){
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
		//绑定立刻购买按钮
		this.$pay.on('tap',function(){
			//获取数据到一个对象中
			var obj = {};
		})
		//绑定加入购物车
		$('.addCar').on('tap',function(){
			_this.addCart();
		})
	},
	//添加购物车
	addCart:function(){
		var data = {
			productId:this.id,
			size:$('.pro_size span.now').text(),
			num:$('.box input').val()
		}
		if(!data.size)
		{
			mui.toast('请选择尺码');
			return;
		}
		console.log(data);
		It.ajax({
			type:'post',
			url:'/cart/addCart',
			data:data,
			dataType:'json',
			success:function(data){
				//成功业务
				mui.confirm('添加成功,去购物车看看？','温馨提示',['取消','确认'],function(e){
					if(e.index == 1)
					{
						location.href = '/mobile/user/cart.html';
					}
				})
			}

		})
	},
	//重新初始化轮播图滚动和页面滚动
	lunboGo:function(){
		mui('.mui-slider').slider({
			interval:1000
		});
		mui('.mui-scroll-wrapper').scroll({
			deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
	}
}