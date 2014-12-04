$(document).ready(function(e) {
	//alert($(window).width()+'/'+$(window).height());
	
	// 框架
	var loadBox=$('#loadBox');
	var wrapBox=$('.wrap');
	var containerBox=$('.container');
	var stageBox=containerBox.children('section');
	console.log('stageBox:'+stageBox.length);
	var stageNow=0,stageMax=stageBox.length,stageHt,stageDir;
	var turnBox=$('#turnBox');
	var blackBox=$('#blackBox');
	var btnL=$('#btnL');
	var btnR=$('#btnR');
	
	
	//内容
	var stageBox=containerBox.children('section');
	var focusBox=$('.focus');
	var stageTimeline=[];
	
	//分享
	var btnShare=$('.btnShare');
	var shareWx=$('#shareWx');
	var shareWb=$('#shareWb');
	var shareTxt=[];
	
	//视频
	var videoBtn=$('a.btnVideo');
	var videoBox=$('#videoBox');
	var videoIframe;
	var videoClose=videoBox.children('a.close');
	
	
	//问答
	var answList=[0,0,0];
	var seleBox=$('.sele')
	var btnAnsw=$('.btnAnsw');
	
	//导航
	var maskBox=$('#maskBox');
	var navThumb=$('nav.thumb');
	var navThumbMenu=navThumb.find('li');
	console.log('navThumbMenu:'+navThumbMenu.length);
	var navSlide=$('nav.slide');
	var navSlideMenu=navSlide.find('li');
	console.log('navSlideMenu:'+navSlideMenu.length);
	
	//结果
	var btnView=$('#btnView');
	var resultBox=stageBox.last().find('li');
	
	
	loadFunc();
	
	function loadFunc(){
		//载入图
		loadBox.show();
		var loader = new PxLoader();
		loader.addImage('images/common/btn_video.png');
		loader.addImage('images/common/ar.png');
		loader.addImage('images/common/ar1.png');
		loader.addImage('images/common/ar2.png');
		loader.addImage('images/common/logo.png');
		loader.addImage('images/common/prdu.jpg');
		loader.addImage('images/stage1/bg.jpg');	
		loader.addImage('images/stage2/bg.jpg');
		loader.addImage('images/stage3/bg.jpg');
		loader.addImage('images/stage4/bg.jpg');
		loader.addImage('images/sele/bg.jpg');	
		loader.addCompletionListener(function() {
			if(window.console) console.log('load complete');
			init();
			loader=null;
		});			
		loader.start();	
	}//end func	
	
	//自适应
	function window_resize(){
		wrapBox.css({height:$(window).height()});//保证内容高度不足情况下，wrap层背景能充满屏幕
		stageBox.css({height:$(window).height()});
		stageHt=$(window).height();
		console.log($(window).width()+'/'+$(window).height());
		//alert('sereen size:'+screen.width+'/'+screen.height);
		//alert('window size:'+$(window).width()+'/'+$(window).height());
		if(isWeixin && os.android){
			//纠正微信内置浏览器在三星s4 1080p屏幕下的 media font-size bug	
			if(screen.width==1080 && document.body.clientWidth==540 && document.body.clientHeight==851) document.querySelector('html').style.fontSize=23+'px';
			//纠正微信内置浏览器在三星note2 720P屏幕下的 media font-size bug
		}//end if
		
	}//end window_resize
	
	function window_orientationchange(e){
		if(e.orientation=='landscape') turnBox.show();
		else turnBox.hide();
	}//end func
	
	function init(){
		window_resize();
		$(window).on('resize',window_resize);
		$(document).on('touchmove',noEvent);//IOS里禁止上下滑动拖动屏幕移动
		$(window).on( "orientationchange",window_orientationchange);
		stageNow=0;
		addEvent();
		addTimeLine();
		addMonitor();
		btnL.hide();
		focusBox.focusR({speed:2});
		setTimeout(function(){
			if(os.ios) blackBox.fadeOut(500);
			else blackBox.hide();
			loadBox.hide();
		},1000);
				
		//测试
		//answList=[1,2,2];
		//stageNow=12;
		stageMotion(0.0001);
		
	}//end init
	
	function addEvent(){
		
		btnView.on('click',btnView_click);
		btnViewAni();
		
		//问答
		btnAnsw.on('click',btnAnsw_click);
		
		//分享
		btnShare.on('click',btnShare_click);
		shareWx.on('click',shareWx_click);
		
		
		//导航控制
		navThumb.on('click',nav_swiperight);
		navSlide.on('click',nav_swipeleft);
		maskBox.on('click',nav_swipeleft);
		//$(document).on('swiperight',nav_swiperight);
		//$(document).on('swipeleft',nav_swipeleft);
		navSlideMenu.on('click',nav_click);
		
		//框架滑动控制
		$(document).on('swipeup',document_swipeup).on('swipedown',document_swipedown);
		
		//-------------------视频
		if(os.ios) video_ios();
		else videoBtn.on('click',video_android);
		videoClose.on('click',video_close);
		
	}//end func
	
	function btnViewAni(){
		btnView.fadeOut(1000,function(){
			btnView.fadeIn(1000,function(){
				setTimeout(btnViewAni,500);
			});
		});
	}//end func
	
	function btnView_click(e){
		stageDir=1;
		stageSwitch();
	}//end func
	
	//问答
	function btnAnsw_click(e){
		var seleId=$(this).parents('.sele').index('.sele');
		var answId=$(this).data('id');
		console.log('sele id:'+seleId);
		console.log('answ id:'+answId);
		answList[seleId]=answId;
		console.log(answList);
		stageDir=1;
		stageSwitch();
	}//end func	
	
	//导航栏控制
	function nav_click(e){
		if(stageBox.last().hasClass('active')){
			var id=$(this).index();
			console.log('menu id:'+id);
			var stage=$('section.stage'+(id+1));
			if(stage.index()!=stageNow){
				stageNow=stage.index();
				stageMotion(0.0001);
				nav_off();
			}//end if
		}//end if
	}//end func
	
	
	function nav_swiperight(e){
		if(!containerBox.hasClass('moving') && !navSlide.hasClass('moving') && navSlide.hasClass('off')){
			nav_on();
		}//end if
	}//end func

	
	function nav_on(){
		if(os.ios) maskBox.fadeIn(250);
		else maskBox.show();
		navSlide.addClass('moving');
		TweenLite.killTweensOf(navSlide);
		TweenLite.to(navSlide,1,{transform:'translate3d('+ navSlide.width() +'px,'+ 0 +'px,0px)', ease:Power2.easeInOut,onComplete:function(){
			navSlide.removeClass('moving').removeClass('off');
		}});
	}//end func
	
	function nav_swipeleft(e){
		if(!containerBox.hasClass('moving') && !navSlide.hasClass('moving') && !navSlide.hasClass('off')){
			nav_off();
		}//end if
	}//end func
	
	function nav_off(){
		if(os.ios) maskBox.fadeOut(250);
		else maskBox.hide();
		navSlide.addClass('moving');
		TweenLite.killTweensOf(navSlide);
		TweenLite.to(navSlide,1,{transform:'translate3d('+ 0 +'px,'+ 0 +'px,0px)', ease:Power2.easeInOut,onComplete:function(){
			navSlide.removeClass('moving').addClass('off');
		}});
	}//end func
	
	//框架滑动控制
	function document_swipedown(e){
		console.log('document_swipedown');
		if(!containerBox.hasClass('moving') && !navSlide.hasClass('moving') && stageNow>0 &&!containerBox.hasClass('lockUp')){
			stageDir=-1;
			stageSwitch();
		}//end if
	}//end func
	
	function document_swipeup(e){
		console.log('document_swipeup');
		if(!containerBox.hasClass('moving') && !navSlide.hasClass('moving') && stageNow<stageMax-1 &&!containerBox.hasClass('lockDown')){
			stageDir=1;
			stageSwitch();
		}//end if
	}//end func
	
	function stageSwitch(){
		if(stageNow==3) focusBox.focusStop();
		console.log('stageDir:'+stageDir);
		stageNow+=stageDir;
		stageNow=stageNow<0?0:stageNow;
		stageNow=stageNow>stageMax-1?stageMax-1:stageNow;
		stageMotion();
	}//end func
	
	function stageMotion(speed){
		speed=speed!=null?speed:1.8;
		speed==0?0.0001:speed;
		console.log('speed:'+speed);
		console.log('stageNow:'+stageNow);
		TweenLite.killTweensOf(containerBox);
		TweenLite.to(containerBox,speed,{transform:'translate3d('+ 0 +'px,'+ -stageNow*stageHt +'px,0px)', ease:Power2.easeInOut,onStart:motionStart,onComplete:motionComplete});
	}//edn func
	
	function motionStart(){
		containerBox.addClass('moving');
		if(!navSlide.hasClass('off')) nav_off();
		var stage=stageBox.eq(stageNow);
		if(stage.hasClass('sele')){
			btnL.hide();
			btnR.hide();
			TweenLite.to(navThumb,1,{transform:'translate3d('+ -navThumb.width() +'px,'+ 0 +'px,0px)', ease:Power2.easeInOut});
			containerBox.addClass('lockDown');
		}//end if
		/*
		else if(stage.hasClass('interlude')){
			btnL.hide();
			btnR.hide();
			TweenLite.to(navThumb,1,{transform:'translate3d('+ 0 +'px,'+ 0 +'px,0px)', ease:Power2.easeInOut,delay:1.5});
			containerBox.addClass('lockDown lockUp');
		}//end if
		*/
		else{
			if(stageNow>0) btnL.show();
			else btnL.hide();
			if(stageNow<stageMax-1) btnR.show();
			else btnR.hide();
			TweenLite.to(navThumb,1,{transform:'translate3d('+ 0 +'px,'+ 0 +'px,0px)', ease:Power2.easeInOut,delay:1.5});
			containerBox.removeClass('lockDown lockUp');
		}//end else
		//nav
		var stageId=stage.data('id');
		console.log('stage id:'+stageId);
		if(stageId){
			navThumbMenu.eq(stageId-1).addClass('active').siblings().removeClass('active');
			navSlideMenu.eq(stageId-1).addClass('active').siblings().removeClass('active');
		}//end if
		else{
			navThumbMenu.removeClass('active');
			navSlideMenu.removeClass('active');
		}//end else
		//result
		if(stage.hasClass('result')) stage.addClass('active');
		var re=getResult(answList);
		resultBox.eq(re-1).show().siblings().hide();
		if(stageNow<stageMax-1) stageTimeline[stageNow].restart();
		else stageTimeline[stageNow+re-1].restart();
	}//edn func
	
	function motionComplete(){
		containerBox.removeClass('moving');
		var stage=stageBox.eq(stageNow);
		// 360
		var box360=stage.children('.w360');
		if(box360.length>0 && !box360.hasClass('active')){
			box360.frameOn({path:box360.data('path'),num:36});
			box360.addClass('active');
		}//end if
		//result
		if(stageNow==2) focusBox.focusPlay();
	}//edn func
	
	
	//-------------------视频播放-------------------
	function video_ios(){
		videoBtn.each(function(i) {
            var vid=$(this).data('vid');
			var iframe=$('<iframe src="http://player.youku.com/embed/'+vid+'" frameborder=0 allowfullscreen></iframe>').appendTo($(this));
        });
		videoBox.remove();
	}//end funcs
	
	function video_android(e){
		videoBox.show();
		var vid=$(this).data('vid');
		var ht=$(window).width()*9/16;
		videoIframe=$('<iframe src="http://player.youku.com/embed/'+vid+'" frameborder=0 allowfullscreen isAutoPlay="true"></iframe>').css({height:ht,marginTop:$(window).height()/2-ht/2}).prependTo(videoBox);
	}//end event
	
	function video_close(e){
		videoIframe.remove();
		videoBox.hide();
	}//end event
	
	//-------------------结果-------------------
	
	
	//获得答案的逻辑函数
	function getResult(option){
		var setup1=option[0],setup2=option[1],setup3=option[2];
		setup1=setup1!=0?setup1:1;
		setup2=setup2!=0?setup2:1;
		setup3=setup3!=0?setup3:1;
		if(setup1==1 && setup2==1 && setup3==1) return 1;
		else if(setup1==1 && setup2==1 && setup3==2) return 2;
		else if(setup1==1 && setup2==2 && setup3==1) return 3;
		else if(setup1==1 && setup2==2 && setup3==2) return 3;
		else if(setup1==2 && setup2==1 && setup3==1) return 1;
		else if(setup1==2 && setup2==1 && setup3==2) return 4;
		else if(setup1==2 && setup2==2 && setup3==1) return 4;
		else return 1;
	}//end func

	//---------分享
	function btnShare_click(e){
		if(isWeixin) shareWx.show();
	}//end func
	
	function shareWx_click(e){
		$(this).hide();
	}//end func
	
	//--------------添加时间线动画
	function timelineStart(){
	}//end func
	
	function timelineComplete(){
		/*
		if(stageNow==1){
			setTimeout(stageSwitch,2000);
		}//end if
		*/
	}//end func	
		
	
	function addTimeLine(){
				
		/* page 1 */
		stageTimeline[0]= new TimelineLite({paused:true});	
		stageTimeline[0].eventCallback("onStart", timelineStart);
		stageTimeline[0].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from($('.stage1 .intro h4'), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),1.5);
		t.add(new TimelineLite().from($('.stage1 .intro p'), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2);
		stageTimeline[0].add(t);
		
		/* interlude */
		stageTimeline[1]= new TimelineLite({paused:true});	
		stageTimeline[1].eventCallback("onStart", timelineStart);
		stageTimeline[1].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from($('.interlude h4'), 2, {alpha:0,transform:'translate3d('+ 0 +'px,'+ -20 +'px,0px)',ease:Quart.easeOut}),1.5);
		stageTimeline[1].add(t);
			
		/* sele 1 */
		stageTimeline[2]= new TimelineLite({paused:true});	
		stageTimeline[2].eventCallback("onStart", timelineStart);
		stageTimeline[2].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from($('section.sele1 .ques h4'), 2, {alpha:0,transform:'translate3d('+ 0 +'px,'+ +20 +'px,0px)',ease:Quart.easeOut}),1.5);
		t.add(new TimelineLite().from($('section.sele1 .ques p'), 2, {alpha:0,transform:'translate3d('+ 0 +'px,'+ -20 +'px,0px)',ease:Quart.easeOut}),1.7);
		t.add(new TimelineLite().from($('section.sele1 .answ').eq(0).children('h4'), 2, {alpha:0,transform:'translate3d('+ 50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2);
		t.add(new TimelineLite().from($('section.sele1 .answ').eq(0).children('p').eq(0), 2, {alpha:0,transform:'translate3d('+ 50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2.2);
		t.add(new TimelineLite().from($('section.sele1 .answ').eq(0).children('p').eq(1), 2, {alpha:0,transform:'translate3d('+ 50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2.4);
		t.add(new TimelineLite().from($('section.sele1 .answ').eq(1).children('h4'), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2.6);
		t.add(new TimelineLite().from($('section.sele1 .answ').eq(1).children('p').eq(0), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2.8);
		t.add(new TimelineLite().from($('section.sele1 .answ').eq(1).children('p').eq(1), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),3.0);
		stageTimeline[2].add(t);
		
		
		/* page 2 */
		stageTimeline[3]= new TimelineLite({paused:true});	
		stageTimeline[3].eventCallback("onStart", timelineStart);
		stageTimeline[3].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from($('.stage2 .intro h4'), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),1.5);
		t.add(new TimelineLite().from($('.stage2 .intro p'), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2);
		stageTimeline[3].add(t);
		
		
		/* sele 2 */
		stageTimeline[4]= new TimelineLite({paused:true});	
		stageTimeline[4].eventCallback("onStart", timelineStart);
		stageTimeline[4].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from($('.sele2 .ques h4'), 2, {alpha:0,transform:'translate3d('+ 0 +'px,'+ +20 +'px,0px)',ease:Quart.easeOut}),1.5);
		t.add(new TimelineLite().from($('.sele2 .ques p'), 2, {alpha:0,transform:'translate3d('+ 0 +'px,'+ -20 +'px,0px)',ease:Quart.easeOut}),1.7);
		t.add(new TimelineLite().from($('.sele2 .answ').eq(0).children('h4'), 2, {alpha:0,transform:'translate3d('+ 50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2);
		t.add(new TimelineLite().from($('.sele2 .answ').eq(0).children('p').eq(0), 2, {alpha:0,transform:'translate3d('+ 50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2.2);
		t.add(new TimelineLite().from($('.sele2 .answ').eq(0).children('p').eq(1), 2, {alpha:0,transform:'translate3d('+ 50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2.4);
		t.add(new TimelineLite().from($('.sele2 .answ').eq(1).children('h4'), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2.6);
		t.add(new TimelineLite().from($('.sele2 .answ').eq(1).children('p').eq(0), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2.8);
		t.add(new TimelineLite().from($('.sele2 .answ').eq(1).children('p').eq(1), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),3.0);
		stageTimeline[4].add(t);
		
		
		/* page 3 */
		stageTimeline[5]= new TimelineLite({paused:true});	
		stageTimeline[5].eventCallback("onStart", timelineStart);
		stageTimeline[5].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from($('.stage3 .intro h4'), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),1.5);
		t.add(new TimelineLite().from($('.stage3 .intro p'), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2);
		stageTimeline[5].add(t);
		
		/* prdu 1 */
		stageTimeline[6]= new TimelineLite({paused:true});	
		stageTimeline[6].eventCallback("onStart", timelineStart);
		stageTimeline[6].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from($('.prdu1 h4'), 2, {alpha:0,transform:'translate3d('+ 50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),1.5);
		t.add(new TimelineLite().from($('.prdu1 .intro p').eq(0), 2, {alpha:0,transform:'translate3d('+ -50 +'px,' +0 +'px,0px)',ease:Quart.easeOut}),2);
		t.add(new TimelineLite().from($('.prdu1 .intro p').eq(1), 2, {alpha:0,transform:'translate3d('+ -50 +'px,' +0 +'px,0px)',ease:Quart.easeOut}),2.4);
		stageTimeline[6].add(t);
		
		/* prdu 2 */
		stageTimeline[7]= new TimelineLite({paused:true});	
		stageTimeline[7].eventCallback("onStart", timelineStart);
		stageTimeline[7].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from($('.prdu2 h4'), 2, {alpha:0,transform:'translate3d('+ 50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),1.5);
		t.add(new TimelineLite().from($('.prdu2 .intro p').eq(0), 2, {alpha:0,transform:'translate3d('+ -50 +'px,' +0 +'px,0px)',ease:Quart.easeOut}),2);
		t.add(new TimelineLite().from($('.prdu2 .intro p').eq(1), 2, {alpha:0,transform:'translate3d('+ -50 +'px,' +0 +'px,0px)',ease:Quart.easeOut}),2.4);
		t.add(new TimelineLite().from($('.prdu2 a.btnVideo'), 1.5, {alpha:0,scale:2,ease:Quart.easeOut}),2.6);
		stageTimeline[7].add(t);
		
		/* prdu 3 */
		stageTimeline[8]= new TimelineLite({paused:true});	
		stageTimeline[8].eventCallback("onStart", timelineStart);
		stageTimeline[8].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from($('.prdu3 h4'), 2, {alpha:0,transform:'translate3d('+ 50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),1.5);
		t.add(new TimelineLite().from($('.prdu3 .intro p').eq(0), 2, {alpha:0,transform:'translate3d('+ -50 +'px,' +0 +'px,0px)',ease:Quart.easeOut}),2);
		t.add(new TimelineLite().from($('.prdu3 .intro p').eq(1), 2, {alpha:0,transform:'translate3d('+ -50 +'px,' +0 +'px,0px)',ease:Quart.easeOut}),2.4);
		t.add(new TimelineLite().from($('.prdu3 .sign360'), 1.5, {alpha:0,scale:2,ease:Quart.easeOut}),2.6);
		stageTimeline[8].add(t);
		
		/* prdu 4 */
		stageTimeline[9]= new TimelineLite({paused:true});	
		stageTimeline[9].eventCallback("onStart", timelineStart);
		stageTimeline[9].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from($('.prdu4 h4'), 2, {alpha:0,transform:'translate3d('+ 50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),1.5);
		t.add(new TimelineLite().from($('.prdu4 .intro p').eq(0), 2, {alpha:0,transform:'translate3d('+ -50 +'px,' +0 +'px,0px)',ease:Quart.easeOut}),2);
		t.add(new TimelineLite().from($('.prdu4 .intro p').eq(1), 2, {alpha:0,transform:'translate3d('+ -50 +'px,' +0 +'px,0px)',ease:Quart.easeOut}),2.4);
		stageTimeline[9].add(t);
		
		/* sele 2 */
		stageTimeline[10]= new TimelineLite({paused:true});	
		stageTimeline[10].eventCallback("onStart", timelineStart);
		stageTimeline[10].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from($('.sele3 .ques h4'), 2, {alpha:0,transform:'translate3d('+ 0 +'px,'+ +20 +'px,0px)',ease:Quart.easeOut}),1.5);
		t.add(new TimelineLite().from($('.sele3 .ques p'), 2, {alpha:0,transform:'translate3d('+ 0 +'px,'+ -20 +'px,0px)',ease:Quart.easeOut}),1.7);
		t.add(new TimelineLite().from($('.sele3 .answ').eq(0).children('h4'), 2, {alpha:0,transform:'translate3d('+ 50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2);
		t.add(new TimelineLite().from($('.sele3 .answ').eq(0).children('p').eq(0), 2, {alpha:0,transform:'translate3d('+ 50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2.2);
		t.add(new TimelineLite().from($('.sele3 .answ').eq(0).children('p').eq(1), 2, {alpha:0,transform:'translate3d('+ 50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2.4);
		t.add(new TimelineLite().from($('.sele3 .answ').eq(1).children('h4'), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2.6);
		t.add(new TimelineLite().from($('.sele3 .answ').eq(1).children('p').eq(0), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2.8);
		t.add(new TimelineLite().from($('.sele3 .answ').eq(1).children('p').eq(1), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),3.0);
		stageTimeline[10].add(t);
		
		/* page 4 */
		stageTimeline[11]= new TimelineLite({paused:true});	
		stageTimeline[11].eventCallback("onStart", timelineStart);
		stageTimeline[11].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from($('.stage4 .intro h4'), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),1.5);
		t.add(new TimelineLite().from($('.stage4 .intro p'), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2);
		stageTimeline[11].add(t);
		
		/* prdu 5 */
		stageTimeline[12]= new TimelineLite({paused:true});	
		stageTimeline[12].eventCallback("onStart", timelineStart);
		stageTimeline[12].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from($('.prdu5 h4'), 2, {alpha:0,transform:'translate3d('+ 50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),1.5);
		t.add(new TimelineLite().from($('.prdu5 .intro p').eq(0), 2, {alpha:0,transform:'translate3d('+ -50 +'px,' +0 +'px,0px)',ease:Quart.easeOut}),2);
		stageTimeline[12].add(t);
		
		/* prdu 6 */
		stageTimeline[13]= new TimelineLite({paused:true});	
		stageTimeline[13].eventCallback("onStart", timelineStart);
		stageTimeline[13].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from($('.prdu6 h4'), 2, {alpha:0,transform:'translate3d('+ 50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),1.5);
		t.add(new TimelineLite().from($('.prdu6 .intro p').eq(0), 2, {alpha:0,transform:'translate3d('+ -50 +'px,' +0 +'px,0px)',ease:Quart.easeOut}),2);
		t.add(new TimelineLite().from($('.prdu6 .intro p').eq(1), 1.5, {alpha:0,transform:'translate3d('+ 0 +'px,' +20 +'px,0px)',ease:Quart.easeOut}),1.7);
		t.add(new TimelineLite().from($('.prdu6 .sign360'), 1.5, {alpha:0,scale:2,ease:Quart.easeOut}),2.6);
		stageTimeline[13].add(t);
		
		/* result 1 */
		stageTimeline[14]= new TimelineLite({paused:true});	
		stageTimeline[14].eventCallback("onStart", timelineStart);
		stageTimeline[14].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from($('.result li').eq(0).children('.intro').children('h4'), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),1.5);
		t.add(new TimelineLite().from($('.result li').eq(0).children('.intro').children('p'), 2, {alpha:0,transform:'translate3d('+ 50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),1.8);
		t.add(new TimelineLite().from($('.result li').eq(0).children('.intro').children('h5'), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2);
		t.add(new TimelineLite().from($('.result li').eq(0).children('a.btnShare'), 1.5, {alpha:0,scale:2,ease:Quart.easeOut}),2.4);
		stageTimeline[14].add(t);
		
		/* result 2 */
		stageTimeline[15]= new TimelineLite({paused:true});	
		stageTimeline[15].eventCallback("onStart", timelineStart);
		stageTimeline[15].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from($('.result li').eq(1).children('.intro').children('h4'), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),1.5);
		t.add(new TimelineLite().from($('.result li').eq(1).children('.intro').children('p'), 2, {alpha:0,transform:'translate3d('+ 50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),1.8);
		t.add(new TimelineLite().from($('.result li').eq(1).children('.intro').children('h5'), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2);
		t.add(new TimelineLite().from($('.result li').eq(1).children('a.btnShare'), 1.5, {alpha:0,scale:2,ease:Quart.easeOut}),2.4);
		stageTimeline[15].add(t);
		
		/* result 3 */
		stageTimeline[16]= new TimelineLite({paused:true});	
		stageTimeline[16].eventCallback("onStart", timelineStart);
		stageTimeline[16].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from($('.result li').eq(2).children('.intro').children('h4'), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),1.5);
		t.add(new TimelineLite().from($('.result li').eq(2).children('.intro').children('p'), 2, {alpha:0,transform:'translate3d('+ 50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),1.8);
		t.add(new TimelineLite().from($('.result li').eq(2).children('.intro').children('h5'), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2);
		t.add(new TimelineLite().from($('.result li').eq(2).children('a.btnShare'), 1.5, {alpha:0,scale:2,ease:Quart.easeOut}),2.4);
		stageTimeline[16].add(t);
		
		/* result 4 */
		stageTimeline[17]= new TimelineLite({paused:true});	
		stageTimeline[17].eventCallback("onStart", timelineStart);
		stageTimeline[17].eventCallback("onComplete", timelineComplete);
		var t=new TimelineLite();
		t.add(new TimelineLite().from($('.result li').eq(3).children('.intro').children('h4'), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),1.5);
		t.add(new TimelineLite().from($('.result li').eq(3).children('.intro').children('p'), 2, {alpha:0,transform:'translate3d('+ 50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),1.8);
		t.add(new TimelineLite().from($('.result li').eq(3).children('.intro').children('h5'), 2, {alpha:0,transform:'translate3d('+ -50 +'px,'+ 0 +'px,0px)',ease:Quart.easeOut}),2);
		t.add(new TimelineLite().from($('.result li').eq(3).children('a.btnShare'), 1.5, {alpha:0,scale:2,ease:Quart.easeOut}),2.4);
		stageTimeline[17].add(t);
				
	}//end func
	
	
	//--------------生成检测
	function addMonitor(){
		monitorAdd({obj:btnShare,category:'',label:'分享按钮'});
		monitorAdd({obj:videoBtn,category:'',label:'视频按钮'});
		monitorAdd({obj:navThumb,category:'',label:'左上角导航缩略按钮'});
		monitorAdd({obj:navSlideMenu,category:'',label:'导航菜单'});
		monitorAdd({obj:btnView,category:'',label:'查看结果按钮'});
		monitorAdd({obj:btnAnsw,category:'',label:'问答按钮'});
	}//end func
	
});


//--------------------------------公共函数
	
	function getTimer(t){//转换毫秒到字符串时间
		var sec=Math.floor(t/1000);
		if(sec<10) sec="0"+sec;
		else sec=String(sec);
		var mil=String(t%1000);
		mil=mil.substr(0, 2);
		return sec+'.'+mil;
	}//end func
	
	function hoverFunc(_this){
		var srcOrg,src,str;
		var img;
		if(_this.attr('src')) img=_this;
		else if(_this.find('img').length>0) img=_this.find('img');
		
		if(img){
			str=img.attr('src').split('.');
			srcOrg=img.attr('src');
			src=str[0]+'_active.'+str[1];
		}//end if
		_this.on('touchstart',function(e){
			_this.addClass('active');
			if(img) img.attr({src:src});
			setTimeout(function(){
				_this.removeClass('active');
				if(img) img.attr({src:srcOrg});
			},250);
		});		
	}//end func
	
	function noEvent(e){
		e.preventDefault();
	}//end func
	
	function getRound(num,n){
		n=n||2;
		var r=Math.pow(10, n);
		return Math.round(num*r)/r;
	}//end func
	
	function randomPlus() {
			return Math.random()<0.5?-1:1;
	}//end func  随机正负
		
	function randomRange(min, max) {
			var randomNumber;
			randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
			return randomNumber;
	}//end func
	
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	}//end func
	
	//打印json数据
	function jsonPrint(data){
		console.log("-----------------------------------------------------------------------------");
		for(var i=0; i<data.length; i++) objectPrint(data[i]);
		console.log("-----------------------------------------------------------------------------");
	}//end func
	
	//打印object数据
	function objectPrint(data){
		console.log("-----------------------------------------------------------------------------");
		var info="";
		for(var i in data) info+=i+":"+data[i]+"  "
		console.log(info);
		console.log("-----------------------------------------------------------------------------");
	}//end func
	
	function mathAutoSize(aryNum,aryMax){
				var aryNow=new Array()
				var aryRate= aryNum[0]/aryNum[1];
				aryNow[0] = aryMax[0];
				aryNow[1] = Math.round(aryNow[0]/aryRate);
				if(aryNow[1]<aryMax[1]){
					aryNow[1]=aryMax[1];
					aryNow[0] = Math.round(aryNow[1]*aryRate);
				}//end if				
				return aryNow;
	}//end func	

	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
	// MIT license
	//PC的老式浏览器，还有安卓浏览器，不支持原生requestAnimationFrame
	(function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}
		if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
		if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}());