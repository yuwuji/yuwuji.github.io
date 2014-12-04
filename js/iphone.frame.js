//2014.9.26
(function($) {	
	jQuery.fn.extend({
		frameOn: function(option) {
			var _this=$(this);
			var _box=_this.children('.box');
			var _load=_this.children('.load');
			var _sign=_this.children('.sign');
			var imgNow,imgMax,imgWd,imgHt,imgSelf,imgPath,imgTest,imgRepeat;
			var posXSt,posYSt,posXLast,posYLast;
			var idBox;
			if(option){
				imgMax=option.num!=null?option.num:30;//图片多少张
				imgPath=option.path!=null?option.path:'images/frame/';//360图片路径
				imgWd=option.width;
				imgHt=option.height;
				imgTest==option.test!=null?option.test:false;//是否测试
				imgRepeat=option.repeat!=null?option.repeat:true;//是否循环序列
			}//end if
			else{
				imgMax=30;//u向图片多少张
				imgPath='images/frame/';//360图片路径
				imgTest=false;
				imgRepeat=true;
			}//end else
			
			loadFunc();
			
			function loadFunc(){
				//载入图
				var loader = new PxLoader();
				for(var i=0; i<imgMax; i++) loader.addImage(imgPath+i+'.jpg');			
				loader.addProgressListener(function(e) { 
					_load.html(Math.round(e.completedCount/e.totalCount*100)); 
				}); 			
				loader.addCompletionListener(function() {
					if(window.console) console.log('load complete');
					_load.remove();
					_sign.show();
					init();
					loader=null;
				});			
				loader.start();	
			}//end func
			
			function init(){
				_box.empty();
				if(imgTest) idBox=$('<i></i>').appendTo(_box);	
				imgSelf=$('<img>').appendTo(_box);	
				var size=[];
				if(imgWd && imgHt && imgWd>0 && imgHt>0){
					size=mathAutoSize([imgWd,imgHt],[_box.width(),_box.height()]);
					imgSelf.css({width:size[0],height:size[1],marginLeft:Math.floor(_box.width()/2-size[0]/2),marginTop:Math.floor(_box.height()/2-size[1]/2)});
				}//end if
				_this.on("off",_this_off).on("reset",resetFunc).on("goto",gotoFunc);
				_this.on("touchstart",touchstartHandler).on("touchmove",touchmoveHandler);
				resetFunc();
			}//end func
			
			
			//关闭功能
			function _this_off(e){
				_this.off();
			}//end func
						
			//--------自定义事件
			function resetFunc(event){
				if(window.console) console.log('sprite reset');
				imgNow=0;	
				upShowCar();
			}//end func
			function gotoFunc(event,value){
				imgNow=value;	
				upShowCar();
			}//end func	
			
			//-----------------touch事件
			function touchstartHandler(e){
				e.preventDefault();	
				posXLast=posXSt=event.touches[0].clientX;
				posYLast=posYSt=event.touches[0].clientY;
			}//end func
			function touchmoveHandler(e){
				e.preventDefault();
				moveHandler(event.changedTouches[0].clientX,event.changedTouches[0].clientY);
				posXLast=event.changedTouches[0].clientX;
				posYLast=event.changedTouches[0].clientY;
			}//end func
			
			//移动事件
			function moveHandler(x,y){
				var disX=Math.floor(Math.abs(posXSt-x));
				var disY=Math.floor(Math.abs(posYSt-y));
				var moveX=Math.abs(posXLast-x);
				var moveY=Math.abs(posYLast-y);
				if(os.ios) var disRate=1;
				else var disRate=2;
				if( moveY<=moveX*2.5 && disX%disRate==0 ){
					if(imgRepeat) imgNow=posXLast>x?imgNow-1:imgNow+1;
					else imgNow=posXLast>x?imgNow-1:imgNow+1;
				}//end if
				upShowCar();
			}//end func
			
			//----------图片切换
			function upShowCar(){
				if(imgRepeat){
					imgNow=imgNow>imgMax-1?0:imgNow;
					imgNow=imgNow<0?imgMax-1:imgNow;
				}//end if
				else{
					imgNow=imgNow>imgMax-1?imgMax-1:imgNow;
					imgNow=imgNow<0?0:imgNow;
				}//end else
				var src=imgPath+imgNow+'.jpg';
				if(window.console) console.log('src:'+src);
				if(imgTest) idBox.text(src);
				imgSelf.attr({src:src});
			};//end func
			
			//---------通用函数
			
			function mouseSelectOff(){
				document.onselectstart = function () { return false; };	
				document.unselectable= "on";
				$('body').css({"-moz-user-select":"none","-webkit-user-select":"none","-ms-user-select":"none","user-select":"none"});
			}//end func
	
			function mouseSelectOn(){
				document.onselectstart = function () { return true; };
				document.unselectable= "off";
				$('body').css({"-moz-user-select":"auto","-webkit-user-select":"auto","-ms-user-select":"auto","user-select":"auto"});
			}//end func
		
			function mathAutoSize(aryNum,aryMax){
				var aryNow=new Array()
				var aryRate = aryNum[0]/aryNum[1];
				aryNow[0] = aryMax[0];
				aryNow[1] = Math.round(aryNow[0]/aryRate);
				if(aryNow[1]>aryMax[1]){
					aryNow[1] = aryNow[1]<=aryMax[1] ? aryNow[1] : aryMax[1];
					aryNow[0] = Math.round(aryNow[1]*aryRate);
				}//end if
				return aryNow;
			}//end func
			
		},//end fn		
		frameReset: function() {
			$(this).trigger('reset');
		},//end fn
		frameGoto: function(value) {
			value=value||0;
			$(this).trigger('goto',[value]);
		},//end fn	
		frameOff: function(value) {
			$(this).trigger('off');
		}//end fn	
	});//end extend
})(jQuery);//闭包