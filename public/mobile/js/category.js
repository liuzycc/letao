

$(function () {
    /*需求分析*/
    /*1. 默认渲染一级分类和二级分类*/
    /*1.1 先获取一级分类数据*/
    /*1.2 渲染左侧分类*/
    /*1.3 同时获取第一个第一分类且根据这个分类去查询二级分类数据*/
    /*1.4 渲染右侧分类*/
    /*2. 点击测试分类 进行右侧分类的渲染*/
    /*2.1 左侧栏样式的切换*/
    /*2.2 去进行右侧栏的渲染*/
    /*2.3 去进行右侧栏的渲染*/
    new app();
});
//网页业务对象
var app = function(){
    this.left = $('.lt_cateLeft');
    this.right = $('.lt_cateRight');
    this.init();
    this.bindEvent();
}
app.prototype = {
    //初始化网页
    init:function(){
        var _this = this;
        this.renderLeft(function(data){
            _this.renderRight(data.rows[0].id);
        });
    },
    //渲染左侧列表
    renderLeft:function(callback){
        var _this = this;
        $.ajax({
            type:'get',
            url:'/category/queryTopCategory',
            data:'',
            dataType:'json',
            success:function(data){
                //绑定左侧数据
                // console.log(this);//这里this指向window
                _this.left.html(template('renderLeft',data));
                callback && callback(data);
            }
        })
    },
    //渲染右侧列表
    renderRight:function(index){
        var _this = this;
        $.ajax({
            type:'get',
            url:'/category/querySecondCategory',
            data:{id:index},
            // type:'json',
            success:function(data){
                //绑定数据
                _this.right.html(template('renderRight',data));
                //没有数据的时候加载mui提示框
                !data.rows.length && mui.toast('没有数据啦');
            }
        })
    },
    //点击列表方法
    bindEvent:function(){
        var _this = this;
        this.left.on('tap','li a',function(){
            $(this).parent().addClass('now').siblings().removeClass('now');
            var id = $(this).parent().data('id');
            _this.renderRight(id);
        })
    },
}