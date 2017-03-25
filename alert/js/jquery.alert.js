/**
 * [jquery beauty alert] author: quanlicong date: 2017-03-25 
 * @param  {[type]} $ [jquery]
 * @return {[type]}   [null]
 */
(function($){
	$.fn.alert = function(opt){
		var nullFn = function(){},
			context = opt.context,
			isValid = function(fn){
				return typeof fn =='function' && fn || nullFn;
			},
			callback = isValid(opt.callback) || nullFn,
			html = "";

	}
})(window.jQuery)