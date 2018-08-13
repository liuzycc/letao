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
		this.$container.on('click','.pro_size span',function(){
			this.classList.add('now');
			$(this).siblings().removeClass('now');
		}).on('click','.box .reduce',function(){
			var input = $('.box input');
			var num = input.val();
			if(--num <= 0)
			{
				mui.toast('不能再小了');
				return;
			}
			input.val(num);
		}).on('click','.box .add',function(){
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
		this.$pay.on('click',function(){
			//获取数据到一个对象中
			var obj = {};
			
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