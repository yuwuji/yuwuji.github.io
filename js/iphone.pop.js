//2014.8.22
(function($) {	
	$.fn.extend({
		popOn: function(option) {	
			var _this=$(this);
			var _box;
			var _y,_text,_noscroll,_parent,_url,_callback;
			if(option){
				_text=option.text;
				_noscroll=option.noscroll!=null?option.noscroll:true;
				_parent=option.parent!=null?option.parent:true;
				_url = option.url!=null?option.url:false;
				_callback=option.callback;
			}//end if
			else{
				_parent=true;
				_noscroll=true;
			}//end else
			if(_parent){
				_y=($(window).height()-_this.outerHeight())/2; //默认赋值
				_y=_y<0?0:_y;
			}//end if
			init();
			
			function init(){
				_this.show();
				_this.on('resize',resizeFunc).one('close',closeFunc).find(".close").one('click',closeFunc);//end on
				if(_noscroll) $(document).on('touchmove',noScroll);//弹出窗口后静止屏幕滑动
				if(_text) _this.find('.text').html(_text);
				if(_parent){
					if(!_this.parent().hasClass("popBox"))_this.wrap("<div class='popBox'></div>");
					_box=_this.parent();
					resizeFunc();
					$(window).on('resize',resizeFunc);//end on
				}//end if
			}//end func	
			function closeFunc(e){
				_this.off().hide();
				if(_noscroll) $(document).off('touchmove',noScroll);
				if(_parent){
					_this.unwrap()
					$(window).off('resize',resizeFunc);
				}//end if
				if(_callback) _callback();
				if(_url) window.location.href = _url;
			}//end func
			function resizeFunc(e){
				if(_parent){
					_box.css({width:$(window).width(),height:$(window).height()});
					_y=($(window).height()-_this.outerHeight())/2;
					_y=_y<0?0:_y;
					_this.css("top",_y);
					_this.css("left",Math.floor($(window).width()/2-_this.outerWidth()/2));
				}//end if
			}//end func
			function noScroll(e){
				e.preventDefault();
			}//end func
		},//end fn
		popOff: function() {
			$(this).trigger('close');
		}//end fn
	});//end extend	
})(jQuery);//闭包