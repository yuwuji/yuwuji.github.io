//2014.9.28
(function($) {	
	jQuery.fn.extend({
		focusR: function(option) {	
			var _this=$(this);
			var boxCont,boxThis,boxBtn,boxBtnL,boxBtnR,boxWd,boxHt,boxMax,boxesWd,boxesHt,boxDis,boxTar,boxTimer,boxNow,boxBtnThis,boxDir;
			var _auto,_sp,_delay;
			var _posXSt,_posYSt,_posXLast,_posYLast;
			var boxJump;
			if(option){
				_delay=option.delay!=null?option.delay:5000;
				_sp=option.speed!=null?option.speed:1;
				_auto=option.auto!=null?option.auto:false;
				_mousewheel=option.mousewheel!=null?option.mousewheel:true;
			}//end if
			else{
				_delay=5000;
				_sp=1;
				_auto=false;
			}//end else		
			init();
			function init(){
				boxWd=_this.width();
				boxHt=_this.height();
				boxCont=_this.children('ul');
				boxThis=boxCont.children().css({width:_this.width(),height:_this.height()});
				boxBtn=_this.children("a.boxBtn");
				boxBtnL=_this.children("a.boxBtnL");
				boxBtnR=_this.children("a.boxBtnR");
				boxMax=boxThis.length;//一共有几张图
				console.log('boxMax:'+boxMax);
				boxesWd=boxMax*boxWd;//总长度
				boxesHt=boxMax*boxHt;//总高度
				boxTar=0;
				boxNow=1;
				boxDir=-1;
				boxJump=false;
				boxThis.css({width:_this.width(),height:_this.height()});
				boxCont.width(boxesWd);
				boxDis=boxesWd-boxWd;		
				for(var i=0; i<boxMax; i++) boxBtn.append('<span></span>');
				_this.on("reset",resetFunc).on("goto",gotoFunc).on("prev",prevFunc).on("next",boxNext).on("stop",stopFunc).on("play",playFunc);
				$(document).on('swipeleft',swipeleft_handler).on('swiperight',swiperight_handler);
				if(boxMax<=1){
					boxBtnL.hide();
					boxBtnR.hide();
					boxBtn.hide();
				}//end if
				if(boxBtnL.length>0) boxBtnL.on('click',boxBtnL_click);
				if(boxBtnR.length>0) boxBtnR.on('click',boxBtnR_click);
				if(boxBtn.length>0){
					boxBtnThis=boxBtn.children();
					boxBtnThis.on('click',boxBtnThis_click);
				}//end if
				boxBtnChange();
				timerFunc();
			}//end func			
			
			//---------自定义事件			
			function stopFunc(e){
				console.log('focus stop');
				clearInterval(boxTimer);
			}//end func
			function playFunc(e){
				console.log('focus play');
				clearInterval(boxTimer);
				boxTimer=setInterval(boxRollFunc,_delay);
			}//end func
			function prevFunc(e){
				if(!boxCont.hasClass("moving") && boxDis>0 && boxNow > 1){	
					boxNow--;
					boxDir=-1;
					boxMotion();
					boxBtnChange();
				}//end if
			}//end func
			function boxNext(e){
				if(!boxCont.hasClass("moving") && boxDis>0 && boxNow < boxMax){
					boxNow++;
					boxDir=1;
					boxMotion();
					boxBtnChange();
				}//end if
			}//end func
			function resetFunc(e){
				if(window.console) console.log('focus reset');
				boxNow=1;
				boxDir=-1;
				boxJump=true;
				TweenLite.killTweensOf(boxCont);
				boxMotion();
				boxBtnChange();
				timerFunc();
			}//end func
			function gotoFunc(e,value1,value2){
				if(boxDis>0 && boxNow!=value1){
					boxNow=value1;
					boxJump=value2;
					TweenLite.killTweensOf(boxCont);
					boxMotion();
					boxBtnChange();
					timerFunc();
				}//end if
			}//end func		
			
			//---------------touch swipe 事件
			function swipeleft_handler(e){
				if(window.console) console.log('focus swipe left');
				e.preventDefault();
				boxBtnR_click();
			}//end func
			function swiperight_handler(e){
				if(window.console) console.log('focus swipe right');
				e.preventDefault();
				boxBtnL_click();
			}//end func
			
			//----------鼠标事件	
			function boxBtnThis_click(e){
				var _obj=$(e.target);
				var _id=_obj.index();
				if(!boxCont.hasClass("moving") && boxDis>0){
					var last=boxNow;
					boxNow=_id+1;
					boxDir=boxNow>last?1:boxDir;
					boxDir=boxNow<last?-1:boxDir;
					boxMotion();
					boxBtnChange();
				}//end if
			}//end func
			function boxBtnL_click(e){
				if(!boxCont.hasClass("moving") && boxDis>0 && boxNow > 1){	
					boxNow--;
					boxDir=-1;
					boxMotion();
					boxBtnChange();
				}//end if
			}//end func
			function boxBtnR_click(e){
				if(!boxCont.hasClass("moving") && boxDis>0 && boxNow < boxMax){	
					boxNow++;
					boxDir=1;
					boxMotion();
					boxBtnChange();
				}//end if
			}//end func			
			function timerFunc(){
				if(_auto){
					clearInterval(boxTimer);
					boxTimer=setInterval(boxRollFunc,_delay);
				}//end if
			}//end func			
			function boxRollFunc(){
				if(!boxCont.hasClass("moving") && boxDis>0){		
					if(boxNow==1 || boxNow==boxMax)boxDir=-boxDir;
					if(boxDir==-1){ boxNow--;}else{boxNow++;}
					boxMotion();
					boxBtnChange();
				}//end if(!boxCont.hasClass("moving") && boxDis>0)
			}//end func			
			function boxMotion(){
				if(boxJump){
					boxJump=false;
					TweenLite.set(boxCont, {transform:'translate3d('+ -(boxNow-1) * boxWd +'px,'+ 0 +'px,0px)'});
				}//end if
				else{
					boxCont.addClass('moving');
					TweenLite.to(boxCont,_sp, {transform:'translate3d('+ -(boxNow-1) * boxWd +'px,'+ 0 +'px,0px)', ease:Quart.easeOut,onComplete:boxMotionComplete});
				}//end else				
			}//end func
			function boxMotionComplete(){
				boxCont.removeClass('moving');
			}//end if		
			function boxBtnChange(){
				if(boxBtnL.length>0 && boxBtnR.length>0){
					if(boxNow==1){
						boxBtnL.removeClass("active");
						boxBtnR.addClass("active");
					}else if(boxNow==boxMax){
						boxBtnL.addClass("active");
						boxBtnR.removeClass("active");
					}else{
						boxBtnL.addClass("active");
						boxBtnR.addClass("active");
					}//end if
				}//end if
				if(boxBtn.length>0) boxBtnThis.removeClass().eq(boxNow-1).addClass("active");
			}//end func
		},//end fn	
		focusReset: function() {
			$(this).trigger('reset');
		},//end fn	
		focusGoto: function(value1,value2) {
			value1=value1!=null?value1:1;
			value2=value2!=null?value2:false;
			$(this).trigger('goto', [value1,value2]);
		},//end fn
		focusPrev: function() {
			$(this).trigger('prev');
		},//end fn
		focusNext: function() {
			$(this).trigger('next');
		},//end fn
		focusStop: function() {
			$(this).trigger('stop');
		},//end fn
		focusPlay: function() {
			$(this).trigger('play');
		}//end fn		
	});//end extend
})(jQuery);//闭包
