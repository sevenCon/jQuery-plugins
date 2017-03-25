/**
 * desc: a demo similar to bootstrap carousel , but the anomation is fade in or out the window.
 * date: 2017-03-06 
 * author:sevenCon.quanlincong
 */

/*
	style one:  jQuery.extend({ pluginname: function(){} })
		 emit:  jQuery.pluginname();

	style one: 	jQuery.fn.pluginname = function(){}
		 emit:  $("#id").pluginname();

	style three: jQuery.widget() : a little complex ,not talking ,ignored;	 
	
 */

jQuery.fn.carousel = function(){
	var hoverDot = this.find(".carousel-indicators");  // active
	var banner = this.find(".slides"); 

	var time = 6000	 // 轮播时长

	var now = +(hoverDot.find(".active").attr("data-slide-to"))+1, // 当前播放的图片
		length = hoverDot.children().length,
		next = now +1; // 下一张图片

	var isMoving = false;
	var isCarousel = false; // 在非轮播状态下	
	
	// 开始轮播
	function startCarousel(){
		// 已经开始轮播
		if(isCarousel){
			return false;
		}
		isCarousel = setInterval(function(){
			isCarousel = true;
			nextStep();
		},time);
	}

	// 停止轮播
	function stopCarousel(){
		clearInterval(isCarousel);
		isCarousel = false;
	}

	function nextStep(){
		if(now == length){ // 最后一张
			// hover 状态
			next = 1;
		}else{
			next = now + 1;
		}

		hoverDot.find("li.active").removeClass("active");
		hoverDot.find("li:nth-child("+ next +")").addClass("active");

		jump(now, next);
	}

	function last(){
		next = null;
		// 第一张
		if(now == 1){
			next = now+1;
		}else{
			next = now - 1;
		}

		hoverDot.find("li.active").removeClass("active");
		hoverDot.find("li:nth-child("+ next +")").addClass("active");
		jump(now, next);
	}

	function jump(_now,_next){
		
		isMoving = true;

		var zIndex = _next == 1?3:2;
		banner.find("li:nth-child("+_next+")").css({"zIndex":zIndex,"opacity":0});
		banner.find("li:nth-child("+_next+")").animate({"opacity":1},2500,undefined,function(){
			banner.find("li:nth-child("+_now+")").css({"zIndex":1});
			if(zIndex==3){
				banner.find("li:nth-child("+_next+")").css({"zIndex":2});
			}
			isMoving = false;
		});
		
		now = _next;
	}

	// icon hover状态
	function hoverIdt(index){
		index++;
		hoverDot.find("li.active").removeClass("active");
		hoverDot.find("li:nth-child("+ index +")").addClass("active");

		jump(now,index);
	}
	
	hoverDot.find("li").click(function(el){
		stopCarousel();
		if(isMoving){
			return false;
		}
		last = +el.target.dataset.slideTo+1;
		hoverIdt(+el.target.dataset.slideTo);
	});

	startCarousel();
}
