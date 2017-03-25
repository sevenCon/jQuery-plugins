/**
 * [smoothAjax 防止多次发送ajax请求] 1: 每次发送需要等到上次返回， 0： 两次发送的间隔不得少于500ms
 * @param  {[Object]} opt []
 * @return {[type]}     [inited function]
 */
(function($){
	$.extend({"smartAjax":(function(){
		var canSend = 1,
			startTime = 0;
		return function(opt){
			var nood = function(){},
				_type = opt.smartType || 0,
				validFn = function(fn){
					return typeof fn == 'functon' && fn || nood;
				};
				respondCallBack = function(cb){
					["success","error"].forEach(function(item){
						var tmpFn = validFn(opt[item]);
						opt[item] = function(){
							cb();
							tmpFn.apply(this,arguments);						
						}
					})
				},
				callback = {
					1:function(){
						if(startTime){
							canSend = 1;
							startTime = 0;
						}
						if(canSend){
							respondCallBack(function(){
								canSend = 1;
							});
						}
					},
					0:function(){
						if(Date.now() - startTime > 1000){
							startTime = Date.now();
							canSend = 1;
						}else{
							canSend = 0;
						}
					}
				}

			callback[opt.smartType]();
			if(canSend){
				// $.ajax(opt);
				canSend = 0;
				setTimeout(function(){
					canSend = 1;
				},1000);
				console.log("can sended");
			}else{
				console.log("stop");
			}
		};
	})()});
})(window.$);
