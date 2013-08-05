;(function($){

	function querypage(el, options){
		this.options = {
			url: {
				channel: 'http://svn.ui.sh.ctripcorp.com/p/getchannels.php?ismain=1&callback=querycpage.channel',
				mainpage: 'http://svn.ui.sh.ctripcorp.com/p/getpages.php?ismain=1&callback=querycpage.page',
				getchannelpage: 'http://svn.ui.sh.ctripcorp.com/p/getpages.php?cid={keyword}&callback=querycpage.page',
				getpage: 'http://svn.ui.sh.ctripcorp.com/p/getpageinfo.php?key={keyword}&callback=querycpage.page'
			},
			container: 'body',
			position: 'absolute',
            zindex: '1110',
            init: null,
			later: null
		};
		this._init(el, options);
	};

	$.fn.querypage = function(options) {
		var s = new querypage(this, options);
	};

	window.querycpage = {
		pool: {},
		c: null,
		p: null,
		cid: null,
        put: false,
		channel: function(data){
            var that = this

            if( !that.pool['channel'] ) that.pool['channel'] = data

            var m = that.pool['channel'], h = ''

            h += '<li data-cid="init">常用页面</li>'
            for (var i = 0; i < m.length; i++) {
                h += '<li data-cid="'+m[i]['cid']+'">'+m[i]['cname']+'</li>'
            }

            that.c.html( h )
            that.c.find('li:first').addClass('active')
            
        },
        page: function(data){
            var that = this, h = ''

            if( that.put ){
                h += '<ul class="unstyled">'
                for (var i = 0; i < data.length; i++) {
                    h += '<li data-pid="'+data[i]['pageid']+'" data-pname="'+data[i]['pagename']+'" data-url="'+data[i]['url']+'"><small>'+data[i]['pageid']+'</small><b>'+data[i]['pagename']+'</b><p>'+data[i]['url']+'</p></li>'
                }
                h += '</ul>'
            }else{
                if( !that.pool[that.cid] ) that.pool[that.cid] = data

                var m = that.pool[that.cid]

                if( that.cid != 'init' ){
                    h += '<ul class="unstyled">'
                    for (var i = 0; i < m.length; i++) {
                        h += '<li data-pid="'+m[i]['pageid']+'" data-pname="'+m[i]['pagename']+'" data-url="'+m[i]['url']+'"><small>'+m[i]['pageid']+'</small><b>'+m[i]['pagename']+'</b><p>'+m[i]['url']+'</p></li>'
                    }
                    h += '</ul>'
                }else{
                    for( var key in m ){
                        if( !m.hasOwnProperty(key) ) return 
                        h += '<h4>'+key+'</h4><ul class="unstyled">'
                        for (var i = 0; i < m[key].length; i++) {
                            h += '<li data-pid="'+m[key][i]['pageid']+'" data-pname="'+m[key][i]['pagename']+'" data-url="'+m[key][i]['url']+'"><small>'+m[key][i]['pageid']+'</small><b>'+m[key][i]['pagename']+'</b>'+'<p>'+m[key][i]['url']+'</p></li>'
                        }
                        h += '</ul>'
                    }
                }
            }
            that.p.html( h )
        }
	}
    
    var elArrs = []
    $(document).on('click',function(t) {
        // console.log( 0 )
        t = t || window.event;
        var target = t.target || t.srcElement;

        for (var i = 0; i < elArrs.length; i++) {
            var a = elArrs[i]
            if( !a['_el'].parent().find($(target)).length && a['_target'] ){
                // console.log( 2 )
                a['_target'].remove()
                a['_showflag'] = false
            }
        };
    })

	querypage.prototype = {
        _current: -1,
        _init: function(el, options){
            // console.log( this )
        	$.extend(true, this.options, options);

            var that = this
            that._showflag = false
            that._el = el

            elArrs.push(that)

            el.bind('click', function(e){
                if(typeof that.options.init==='function') {
                    that.options.init();
                }

                if( that._showflag ) return 
                that._showflag = true

                var uid = 'spage-'+new Date().getTime()+(Math.random()*1e10).toFixed(0);
                $(that.options.container).append('<div class="querypage" id="'+uid+'" style="display:none;"><div class="querypage-search"><input type="text" class="input-block-level querypage-input" placeholder="请输入页面ID或页面名称"></div><div class="querypage-content"><ul class="querypage-channel"></ul><div class="querypage-page"></div></div></div>');
                that._target = $('#'+uid);

                that._input = that._target.find('.querypage-input');

                that.hem = querycpage

                that.hem.c = that._target.find('.querypage-channel');
                that.hem.p = that._target.find('.querypage-page');

                that.uid = 'querypage-'+new Date().getTime()+(Math.random()*1e10).toFixed(0);

                var a = $(document).width()
                var w = el[0].offsetWidth;
                var l = el.offset().left;
                var r = a - w - l;
                var t = el.offset().top+el[0].offsetHeight+2;

                if( that.options.position === 'fixed' ){
                    t = el[0].offsetHeight+2+that.options.fixedTop
                }

                var tarw = that._target.width()+parseInt(that._target.css('padding-left'))+parseInt(that._target.css('padding-right'))+parseInt(that._target.css('border-left-width'))*2;

                if( a-l<=tarw ){
                    l = 'auto'
                }else{
                    r = 'auto'
                }

                that._target.css({
                    'position': that.options.position,
                    'z-index': that.options.zindex,
                    'left': l,
                    'right': r,
                    'top': t
                })

                that._target.show()
                that._input.focus()

                // if( !that.hem.pool['channel'] ){
                    that._load( that.options.url.channel )
                // }

                // if( !that.hem.pool['init'] ){
                    that.hem.cid = 'init'
                    that._load( that.options.url.mainpage )
                // }

                that._input.bind('input',function(){
                    that._change();
                });

                that._input.bind('keydown',function(e){
                    var count = that.hem.c.find('li').length;
                    var key = e.keyCode;  

                    if (key == 13){
                        var arr = that.hem.p.find('li:eq('+that._current+')')
                        that._target.hide()
                        if(typeof that.options.later === 'function') {
                            return that.options.later({
                                id: arr.attr('data-pid'),
                                name: arr.attr('data-pname'),
                                url: arr.attr('data-url')
                            })
                        }
                    }

                    if(key == 38){ 
                        if(that._current <= 0) that._current = count; 
                        that._current--;  
                        that._active();
                    }
                    else if(key == 40){
                        that._current++;  
                        if(that._current == count) that._current =0; 
                        that._active();
                    }
                });

                

                that._target.on('click',function(e){
                    e = e || window.event;
                    var target = e.target || e.srcElement
                      , _ta = $(target)


                    that._input.focus()

                    if( _ta.parent().attr('data-pid') ){
                        _ta = $(_ta.parent()[0])
                    }

                    if( _ta.attr('data-cid') ){
                        _ta.addClass('active').siblings().removeClass('active')

                        that.hem.cid = _ta.attr('data-cid')

                        that.hem.p.animate({scrollTop: 0},0)

                        if( that.hem.pool[that.hem.cid] ){
                            that.hem.page()
                        }else{
                            if( that.hem.cid === 'init' ){
                                that._load( that.options.url.mainpage )
                            }else{
                                that._load( that.options.url.getchannelpage.replace('{keyword}', that.hem.cid) )
                            }
                        }
                        
                    }

                    if( _ta.attr('data-pid') ){
                        that._target.hide()
                        if(typeof that.options.later === 'function') {
                            return that.options.later({
                                id: _ta.attr('data-pid'),
                                name: _ta.attr('data-pname'),
                                url: _ta.attr('data-url')
                            })
                        }
                    }
                    return false
                })

                // return false
            })

            
        },

        _load: function(url){
            var that = this
            $('.'+that.uid).remove()
            var elm = document.createElement('script');
            elm.type = 'text/javascript';
            elm.async = true;
            elm.src = url;
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(elm, s);
            $(s).addClass(that.uid)
        },

        _change: function(){
            var that = this;
            that._current = 0
            that._keyword = $.trim( encodeURI(that._input.val().replace(/[',.，。！*--+`~!@#$%^&*]/g, '')) )

            if( that._keyword.length ){
                if( that._keyword.length < 2 ){
                    if( that._keyword.length === 1 ){
                        that.hem.p.animate({
                            'margin-left': '-120px'
                        }, 200)
                    }
                    that.hem.p.html( '<p class="pagenull">请输入至少2个字符</p>' )
                }else{
                    that.hem.put = true
                    that._load( that.options.url.getpage.replace('{keyword}', that._keyword) )
                }
            }else{
                that.hem.put = false
                that.hem.page()
                that.hem.p.animate({
                    'margin-left': '5px'
                }, 200)
            }
        },
        _active: function(){
            var that = this;
            // console.log( that.hem )
            that.hem.p.find('li.active').removeClass('active');
            $(that.hem.p.find('li')[that._current]).addClass('active')
        }
    };
	
}(jQuery));
