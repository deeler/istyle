;(function($){

	// $('title:first').after('<script src="../istyle/misc/adapter.js"></script>');
	var container = $('.docs-container'),
		tags = $('.docs-tags'),
		menubar = $('.docs-menubar:first'),
		cgiKey='|',
		cgi = $.istyle.css.mods;

	var count = 0;
	for( var key in cgi ){ 
		if( cgi[key].m != null ){
			var iconIt='';
			cgi[key].i ? iconIt='<span class="label label-info">'+cgi[key].i+'</span>' : '';
			menubar.append('<li menu="'+key+'">'+cgi[key].n+iconIt+'<i>&gt;</i></li>');
			count += 1;
		}
	};

	menubar.find('li:first').after('<li class="divider"></li>'); 

	$('.docs-menubar li').each(function(e){
		if( !$(this).attr('menu') ) return;
		var type=$(this).attr('menu'), u='modules/'+type+'.html';
		
		cgiKey += type+'|';
		$(this).attr('h',$(this).offset().top);

		if(getHash()==type){
			$(this).addClass('active');
			tags.css({
				'padding-top': $(this).attr('h')+'px'
			});
			ajaxGet(u);
		}

		$(this).click(function(){
			setHash(type);
			$(this).addClass('active').siblings().removeClass('active');
			tags.css({
				'padding-top': $(this).attr('h')+'px'
			});
			ajaxGet(u);
		})
	})

	if(cgiKey.indexOf(getHash())<0 || !getHash()) {
		var cur = menubar.find('li:first');
		cur.addClass('active').siblings().removeClass('active');
		tags.css({
			'padding-top': cur.attr('h')+'px'
		});
		ajaxGet('modules/'+cur.attr('menu')+'.html');
		setHash(cur.attr('menu'));
	}

	$('.maildeveloper').tooltip({
		container: 'body'
	});

	function ajaxGet(u){
		$.ajax({
			type: 'GET',
			dataType: 'html',
			cache: false,
			url: u,
			beforeSend: function(){
				loading();
			},
			success: function(msg){
				

				if( getHash() === 'start' ){
					container[0].innerHTML = msg;
					var elm = document.createElement('script');
					elm.type = 'text/javascript';
					elm.async = true;
					elm.src="misc/start.js"
					var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(elm, s);
				}else{
					container.html(msg);
				}
				navbar();
				window.prettyPrint && prettyPrint();
				// container.find('a').attr('href','javascript:;');
			}
		});
	}

	function navbar(){
		var val='';
		container.find('h2').each(function(i){
			val += '<li>'+$(this).text()+'</li>';
		})
	
		if ( getHash()==='start' || getHash()==='help' ) {
			tags.hide();
			$('body').css({
				'padding-left': '175px'
			});
		}else{
			tags.fadeIn();
			$('body').css({
				'padding-left': '315px'
			});


			tags.find('ul').html(val).show();
			tags.find('li').each(function(t){
				var posTop = $(container.find('h2')[t]).offset().top;
				$(this).bind('click',function(){
					$(this).addClass('docs-tags-active').siblings().removeClass();
			       	$('html,body').animate({scrollTop: posTop},200);
				})
			})
			tags.find('li:first').addClass('docs-tags-active');
		};
	}

	function loading(){ 
		container.html('<div class="docs-loading"><img src="misc/ajax-loader.gif"><br>数据加载中...</div>');
	}

	function setHash(val){ 
		return window.location.hash = '#!'+val;

	}

	function getHash(){ 
		return window.location.hash.substr(2);
	}



	

	
})(jQuery);