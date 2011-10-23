/*
 *
 *  Image64 0.1
 *  Website: https://github.com/aoao/Image64 
 *  author: aoao (loaoao@gmail.com http://www.aoao.org.cn)
 *  Date: 2011/10/23
 *  Released under the MIT License.
 * 
 */
 
function Image64() {
	return this.init();
}
Image64.prototype = {
	url: null,
	data: null,
	onload: function() {},
	setSrc: function(url){
		//this.src = url;//test
		this.url = url;
		this.run();
	},
	run: function() {
		this.key = (new Date()).getTime().toString(36);
		Image64.addImg(this);
		Image64.proxy();
		if(Image64.hasProxy){
			Image64.post(this);
		}else{
			Image64.addQueue(this);
		}
	},
	finish: function() {
		this.src = this.data;
	},
	init: function() {
		var tmp = new Image();
		tmp.data = this.data;
		tmp.url = this.url;
		tmp.setSrc = this.setSrc;
		tmp.run = this.run;
		tmp.finish = this.finish;
		return tmp;
	}
	/*,
	wait: function() {
		var me = this;
		if (me.url) {
			me.run();
		} else {
			if(me.timer){clearTimeout(me.timer)}
			me.timer = setTimeout(function() {
				me.wait();
			},
			100)
		}
	}
*/
}

Image64.imgs = {};

Image64.proxyUrl = 'proxy.html';

Image64.proxy = function(){
	var proxy = document.getElementById('_image64proxy_');
	if(!proxy) {
		var ifr = document.createElement('iframe');
		ifr.id='_image64proxy_';
		ifr.src = Image64.proxyUrl;
		ifr.style.display = "none";
		ifr.onload = function(){
			Image64.hasProxy = true;
			
		};
		document.body.appendChild(ifr);
		//document.body.insertBefore(ifr, document.body.childNodes[0]);
		window.addEventListener('message',function(d){Image64.message(d)})
	}
}
Image64.hasProxy = false;

Image64.timer = null;

Image64.addImg =function(d){
	var key = (d.key)
	Image64.imgs[key]= d;
}
Image64.queue = [];

Image64.addQueue = function(d){
	Image64.queue.push(d);
	Image64.check();
}
Image64.check =function(){
	if(Image64.timer){clearTimeout(Image64.timer)}

	if(Image64.hasProxy){
		for(var i = 0,len =Image64.queue.length;i<len;i++){
			Image64.post(Image64.queue[i]);
		}
		clearTimeout(Image64.timer);
	}else{
		Image64.timer = setTimeout(Image64.check,10)
	}
}

Image64.post =function(me){
	document.getElementById('_image64proxy_').contentWindow.postMessage( me.key + "|" + me.url,'*')
}

Image64.message = function(d){
	var proxyDomain = 'http://' + Image64.proxyUrl.split('/')[2];
	if(d.origin != proxyDomain){
		return false;
	}
	var x = Image64.imgs[d.data.key];
	x.data = d.data.data;
	x.finish();
}