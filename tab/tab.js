//匿名函数自执行，封装一个tab选项卡类
;(function($){



	 var Tab = function(tab){
		
		var _this_ = this;
		//保存单个tab组件
		this.tab = tab;

		//默认配置参数
		this.config = {
			"triggerType": "mouseover",//用来定义鼠标的触发类型，是click还是mouseover
			"effect": "default", //定义内容切换效果是直接切换还是淡入淡出效果
			"invoke": 1,  //默认展示第几个tab
			"auto": false //用来定义tab是否自动切换，指定时间间隔，表示自动切换，且切换时间为指定间隔
		};
		//如果配置参数存在，就扩展掉默认的配置参数
		if(this.getConfig()){
			$.extend(this.config, this.getConfig());
		};

		//保存tab标签列表、对应的内容列表
		this.tabItems = this.tab.find("ul.tab-nav li");
		this.contentItems = this.tab.find("div.content-wrap div.content-item");

		//保存配置参数
		var config = this.config;

		if(config.triggerType === "click"){
			this.tabItems.bind(config.triggerType, function(){
				_this_.invoke($(this));
			});
		}else if(config.triggerType === "mouseover" || config.triggerType != "click") {
			this.tabItems.mouseover(function(){
				var self = $(this);
				this.timer = window.setTimeout(function(){
					_this_.invoke(self);
				}, 300);
			}).mouseout(function(){
				window.clearTimeout(this.timer);
			});
		};

		//自动切换功能，当配置了事件，根据时间间隔进行自动切换

		if(config.auto) {
			//定义一个全局的定时器
			this.timer = null;
			//计数器
			this.loop = 0;

			this.autoPlay();

			this.tab.hover(function(){

				window.clearInterval(_this_.timer);

			},function(){

				_this_.autoPlay();

			});
		};

		if(config.invoke > 1){
			this.invoke(this.tabItems.eq(config.invoke-1));
		};

	};

	//window.Tab = Tab;   //注册到window对象，外面可以访问到

	Tab.prototype = {

		//自动间隔事件切换
		autoPlay: function(){
			var _this_ = this,   
			    tabItems = this.tabItems, //临时保存tab列表
			    tabLength = tabItems.length, //tab的个数
			    config = this.config;  

				this.timer = window.setInterval(function(){
					_this_.loop++;
					if(_this_.loop >= tabLength){
						_this_.loop = 0;
					};
					tabItems.eq(_this_.loop).trigger(config.triggerType);

				}, config.auto);
		},

		//事件驱动函数
		invoke: function(currentTab){
			var _this_ = this;
			/*
			执行tab的选中状态，当前选中加上actived（标记为白底）
			切换对应的tab内容，根据配置参数的effect是default还是fade
			*/

			var index = currentTab.index();

			//tab选中状态
			currentTab.addClass("actived").siblings().removeClass("actived");
			//切换对应的内容区域
			var effect = this.config.effect;
			var conItems = this.contentItems;
			if(effect === "default" || effect != "fade") {
				conItems.eq(index).addClass("current").siblings().removeClass("current");
			}else if(effect === "fade"){
                conItems.eq(index).fadeIn().siblings().fadeOut();
			};

			//注意：如果配置了自动切换，把当前的loop值切换为当前tab的index

			if(this.config.auto){
				this.loop = index;
			}




		},

		//获取配置参数
		getConfig: function(){
			//获取tab elem节点上的data-config
			var config = this.tab.attr("data-config");
			//确保有配置参数
			if(config && config != ""){
				return $.parseJSON(config);
			}else{
				return null;
			}
		}

	};

/*	Tab.init = function(tabs){
		var _this_ = this;
		tabs.each(function(){
			new _this_($(this));
		});

	};*/

	//注册成jq方法
	/*$.fn.extend({
		tab: function() {
			this.each(function(){
				new Tab($(this));
			});
			return this;
		}
	})*/

	$.fn.tab = function() {
			console.log(this);
			this.each(function(){
				console.log(this);
				new Tab($(this));
			});
			return this;
		}

/*$.ajax
$.fn.asdf   $('#asdf').asf()*/
 
	

})(jQuery); //jquery传入