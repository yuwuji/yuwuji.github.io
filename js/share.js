// JavaScript Document  plugin with jquery

$.fn.Action = function(c){
	config ={Act:-1};
	c = $.extend(config , c || {});
	return this.each(function(){
	var a = $(this);
	a.WBURL = "http://apps.weibo.com/2142012291/8s2e8XJH?v=2";
	a.pics = ["share/1.jpg",
			  "share/2.jpg",
			  "share/3.jpg",
			  "share/4.jpg",
			  "share/5.jpg",
			  "share/6.jpg"];
	a.shareTxt = ["卡地亚全新短片＃SHAPE YOUR TIME™＃将于9月28日18：00首映，一起为这段深入制表工艺奥秘、亘古永恒的创新之旅的到来倒数。",
				  "我正在进行卡地亚风范测试，我雕塑的个人风范是：优雅风范 美学经典。与卡地亚一起雕塑时光＃SHAPE YOUR TIME™＃，匹配您的个人风范。",
				  "我正在进行卡地亚风范测试，我雕塑的个人风范是：突破创新 开拓进取。与卡地亚一起雕塑时光＃SHAPE YOUR TIME™＃，匹配您的个人风范。",
				  "我正在进行卡地亚风范测试，我雕塑的个人风范是：非凡卓越 致臻完美。与卡地亚一起雕塑时光＃SHAPE YOUR TIME™＃，匹配您的个人风范。",
				  "我正在进行卡地亚风范测试，我雕塑的个人风范是：精致优雅 精湛出众。与卡地亚一起雕塑时光＃SHAPE YOUR TIME™＃，匹配您的个人风范。",
				  "卡地亚全新短片＃SHAPE YOUR TIME™＃：短短90秒，你将深深沉醉于卡地亚时光走廊，从最初的创作到当代的经典，再到展现制表未来的最新概念腕表。"];
	a.appURL = "http://t.buzzreader.cn/cartier_shape_your_time/";
	a.handler = "../handler.php?action=sendMessage";
	a.getIndex = function(a,b,c){
		if(a == 1)
		{
			return b == 1 ? (c == 1? 1 : 2) : 3;
		}
		if(a == 2)
		{
			return b == 1? (c == 1? 1 : 4) : (c == 1? 4 : 1);
		}
		return 1;
	};
	a.getActive = function(){
		var a = this,u = window.location.href,d = a.shareTxt.length - 1;
		var regNum = /\/([^\/]*$)/i,num;
		if(c.Act > -1){
			d = c.Act;
		}else{
			if(u && u != "")
			{
				se = u.match(regNum);
				if(se[1] == "" || se[1].match(/index/i)){
					return 0;
				}
				if(se[1].match(/answ/i)){
					e = se[1].match(/answ\d=(\d+)/g);
					var f = [];
					for(i in e){
						f[i] = e[i].match(/\d+$/);
					}
					d = a.getIndex(f[0],f[1],f[2]);
				}
			}
		}
		return d;
	};
	a.loginTrigger = function(){
		WeiboJSBridge.invoke("login", {
			"redirect_uri" : encodeURIComponent(a.WBURL)
		}, function (params, success, code) {});
	};
	var sendMessage = function(){
		var b = a.getActive(),d = a.shareTxt[b] + a.WBURL , n = getLength(d);
		if(webAuth){
			a.loginTrigger();
			return !1;
		}
		if(n > 140){
			$('#popAlert').popOn({text:'当前字数为:'+ n +',请在140之内~'});
			return !1;
		};
		var m = {message : d , pic : a.appURL + a.pics[b]};
		$.ajax({
			url:a.handler,
			type:"POST",
			dataType:"json",
			data:m,
			success:function(resp){
				if(resp.code == 200)
				{
					$('#shareWb').fadeIn(500,function(){
						setTimeout(function(){$('#shareWb').fadeOut(500)},1000);
					});
				}else if(resp.code == 15){
					$('#popAlert').popOn({text:"请勿短时间重复分享~"});
				}
				else if(resp.code == 14){
					a.loginTrigger();
				}
			}
		});
	};
		a.getActive();
		a.on("click",sendMessage);
	});
}
//统计字数
var getLength = (function() {
	var trim = function(h) {
		try {
			return h.replace(/^\s+|\s+$/g, "")
		} catch(j) {
			return h
		}
	}
	var byteLength = function(b) {
		if (typeof b == "undefined") {
			return 0
		}
		var a = b.match(/[^\x00-\x80]/g);
		return (b.length + (!a ? 0 : a.length))
	};

	return function(q, g) {
		g = g || {};
		g.max = g.max || 140;
		g.min = g.min || 41;
		g.surl = g.surl || 20;
		var p = trim(q).length;
		if (p > 0) {
			var j = g.min,
			s = g.max,
			b = g.surl,
			n = q;
			var r = q.match(/(http|https):\/\/[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+([-A-Z0-9a-z\$\.\+\!\_\*\(\)\/\,\:;@&=\?~#%]*)*/gi) || [];
			var h = 0;
			for (var m = 0,
			p = r.length; m < p; m++) {
				var o = byteLength(r[m]);
				if (/^(http:\/\/t.cn)/.test(r[m])) {
					continue
				} else {
					if (/^(http:\/\/)+(weibo.com|weibo.cn)/.test(r[m])) {
						h += o <= j ? o: (o <= s ? b: (o - s + b))
					} else {
						h += o <= s ? b: (o - s + b)
					}
				}
				n = n.replace(r[m], "")
			}
			return Math.ceil((h + byteLength(n)) / 2)
		} else {
			return 0
		}
	}
})();
var webAuth = false;
$(function(){
	if(!isWeixin){
		$.get("../handler.php?action=getAuth", function(resp){
			if(resp.code == 200){
				webAuth = true;
			}
		});
		$("#wbShare").Action();
		for(var i in (arr = ["w1","w2","w3","w4","w5"]))
		{
			var obj = $("." + arr[i]);
			if(obj.length > 0)
			{
				obj.Action({"Act":(parseInt(i)+1)});
			}
		}
	}
})