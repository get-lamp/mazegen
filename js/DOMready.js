var sub = false;
function Page(index, url, background, name) {
	this.name = name;
	this.index = index;
	this.url = url;
	this.background = background;
	this.load = function(target, callback, query, delayBackground) {
		query = query || "";
		$(target).load(this.url + query, function(response, status, xhr){
		
			$('.slides').removeClass('centerfold');
			$(target).addClass('centerfold');		
		
			if((typeof callback != 'undefined') && (callback != false)){
				callback();
			}
		});
		//$('#container').css('background-image', "url(" + this.background + ")");		
			
		if(!delayBackground){
			$('#main-background').attr('src', this.background);
		}
		site.index = this.index
	}
}
var site = {
	pages: function(){
		p = new Array();		
		p['home'] = new Page(0, './home.html', './img/home_bg.png', 'home');
		p['about_us'] = new Page(1, './about_us.php', './img/about_us_bg.png', 'about_us');
		p['what_we_do'] = new Page(2, './what_we_do.php', './img/what_we_do_bg.png', 'what_we_do');
		p['industries'] = new Page(3, './industries.php', './img/industries_bg.png', 'industries');
		p['careers'] = new Page(4, './careers.html', './img/careers_bg.png', 'careers');
		p['contact_us'] = new Page(5, './contact_us.php', './img/contact_us_bg.png', 'contact_us');	
		// paginas fuera del carrousel (no se cuentan en pageCount y son devueltas por next() y prev())
		p['affiliations'] = new Page(6, './affiliations.html', './img/home_bg.png', 'affiliations');			
		return p;		
	}(),
	pageCount: 6,
	images: new Array(),
	index: undefined,
	current: function(){
		for(var i in this.pages){
			if(this.pages[i].index == this.index){
				return this.pages[i];
			}		
		}
		return this.pages['home'];
	},
	next: function(){
		for(var i in this.pages){		
			if(this.pages[i].index == (( ( this.index + 1 > 0 ) && 
				( ( this.index + 1 ) < this.pageCount ) ) ? this.index + 1  : 0 )){
				return this.pages[i];
			}
		}
		return false;
	},
	prev: function(){
		for(var i in this.pages){
		if(this.pages[i].index == (( ( this.index - 1 >= 0 ) && 
			(( this.index - 1 ) < this.pageCount ) ) ? this.index - 1  : this.pageCount - 1 )){
				return this.pages[i];
			}
		}
		return false;
	},
	get: function(key){
		return this.pages[key];
	},
	preload: function(){	
		// *** IMPORTANTE ***
		// La precarga de pic depende de mantener la convencion para los nombres de los archivos de imagenes
		if(document.images){	
			var bckgrnd; // fondos del slide
			var pic; // fotos del left-container de las paginas
			for(var i in this.pages){
				bckgrnd = new Image(1600, 600);					
				bckgrnd.src = this.pages[i].background;					
				this.images.push(bckgrnd);
				
				if(i == 'home')
					continue;
				
				pic = new Image(300, 150);
				pic.src = "./img/" + this.pages[i].name + "_pic.png";
				this.images.push(pic);
			}
			return true;
		}
		return false;
	}
}

site.preload();
	
function bindMenuEvents(){
	var hash = window.location.href;
	var hash = hash.split('/');
	
	if(hash[hash.length - 2] == 'management'){
		$('#management-submenu').css('display', 'block');
	}
	
	$('#management-root').click(function(){
		$('#management-submenu').toggle('fast');
	});	
}

function bindHomeEvents(){
	$('#home .middle-container article:not(:first-child)').css('display', 'none');
	
	var slideCounter = {
		count: 0,
		next: function(){
			return (this.count+1 > 3) ? this.count = 0 : ++this.count;
		}
	};
	
	$('#next-home-slide').click(function(){		
		$($('#home .middle-container article')[slideCounter.count]).toggle('slow');
		$($('#home .middle-container article')[slideCounter.next()]).toggle('slow');
	});
}

function done(){
	$('#loading').fadeOut('fast');
}

$(document).ready(function(){
	
	function loadAndSlide(query, urlParams, delayBackground){
	
		ev = site.get(query).index;
					
		({	target: ( ev > site.index ) ? slides[2] : slides[0],
			call: ( ev > site.index ) ? slideRight : slideLeft,
			load: function() {
				site.get(query).load(this.target, this.call, urlParams, delayBackground);
			}
		}).load();
	}
	
	function loadDirect(query, urlParams, delayBackground){
		site.get(query).load(slides[1], false, urlParams, delayBackground);
	}
	
	/* HISTORY */

	// ON URL CHANGE
	$.address.init(function(event) {
		// address initialization
	}).change(function(event) {
			
			if($(slides[1]).queue().length > 0){
				window.history.back(-1);
				/*
				$.each(slides, function(index){
					$(this).css('left', index * 1600);
				});
				*/
				return false;
			}
	
			query = (event.value).replace('/','') || false;
				
			if(!query){
		
				if(typeof site.index == 'undefined'){			
					loadDirect('home', false);
					return false;
				}
				query = 'home';
			} 
				
			var subcheck = query.split("/");
			
				
			if(subcheck.length == 1){

				if(site.current().name == query){
					loadDirect(query, false);
					return false;
				}
				loadAndSlide(query, false);								
			} else {
				delayBackground = true;
				query = query.split("/");
				ev = query.splice(0,1) || 'home';
				query = "?" + query.join('&');
					
				if(site.current().name == ev){
					loadDirect(ev, query, delayBackground);
					return false;
				}				
				loadAndSlide(ev, query, delayBackground);
			}			
		});

	/* END OF BLOCK - HISTORY */

	/* SLIDING PAGES */

	var slides = $('.slide').get();

	$('section').bind('dragend', {distance: 100}, function( event, drag ) {
		if(drag.deltaX < 0){
			site.next().load(slides[2]);
			slideRight();
		}
		else  {
			site.prev().load(slides[0]);
			slideLeft();
		}
	});	

	$("#right-scroll-surface, #left-scroll-surface").hover(
		function(){$(this).fadeTo('fast', 1);}, 
		function(){$(this).fadeTo('fast', 0.25);}
	);

	$("#right-scroll-surface").click(function(event) {
		site.next().load(slides[2]);
		slideRight();

	});

	$("#left-scroll-surface").click(function(event) {
		site.prev().load(slides[0]);
		slideLeft();
	});

	function slideRight() {

		var fChild = $(slides[0]);
		var lChild = $(slides[slides.length - 1]);

		/*	
		if(lChild.queue().length > 0){

			$.each(slides, function(index){
				$(this).css('left', index * 1600);
			});

			return false;
		}
		*/
		var lastChild = slides.shift();
		slides.push(lastChild);
		fChild.css('left', lChild.position().left + lChild.width());

		$('.slide').animate({
			left: '-=1600'
			}, 1000, function() {
				if(this === slides[1]){
				}
			});
	}

	function slideLeft() {

		var fChild = $(slides[0]);
		var lChild = $(slides[slides.length - 1]);

		/*
		if(lChild.queue().length > 0){

			$.each(slides, function(index){
				$(this).css('left', index * 1600);
			});

			return false;
		}
		*/
		slides.unshift(slides.pop());
		lChild.css('left', fChild.position().left - lChild.width());

		$('.slide').animate({
			left: '+=1600'
			}, 1000, function() {
				if(this === slides[1]){
				// on animation end callback
			}
		});
	}
	/* END OF BLOCK - SLIDING PAGES */
});