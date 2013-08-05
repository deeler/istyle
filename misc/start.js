
;(function($){

	// 时间对象的格式化
// iformat="yyyy-MM-dd hh:mm:ss"
// var myDate = new Date(); myDate.iformat("yyyy-MM-dd hh:mm");
Date.prototype.iformat = function(iformat) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    }

    if (/(y+)/.test(iformat)) {
        iformat = iformat.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(iformat)) {
            iformat = iformat.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return iformat;
}	
	
	


	$('.iptselect').each(function(e){
		$(this).val($.istyle.url('HTTP')+$(this).val());

		$(this).click(function(){
			$(this).select();
		});
	})
	
	var cssversi = 0, cssversLast = ''
	for( var key in $.istyle.css.vers ){
		if( cssversi === 0 ){
			cssversLast = key.substr(1)
		}
		cssversi ++
		$(".docs-versions-css small").append('<span class="label" title="'+$.istyle.css.vers[key]+'">'+key.substr(1)+'</span> ');
	}
	$(".docs-versions-css input").val($.istyle.url('code')+'/istyle.'+$(".docs-versions-css small span:first").text()+'.css');
	$(".docs-versions-css small span:first").addClass('label-success');


	var jsversi = 0, jsversLast = ''
	for( var key in $.istyle.js.vers ){
		if( jsversi === 0 ){
			jsversLast = key.substr(1)
		}
		jsversi ++
		$(".docs-versions-js small").append('<span class="label" title="'+$.istyle.js.vers[key]+'">'+key.substr(1)+'</span> ');
	}
	$(".docs-versions-js input").val($.istyle.url('code')+'/istyle.'+$(".docs-versions-js small span:first").text()+'.js');
	$(".docs-versions-js small span:first").addClass('label-success');


	var tmplhtml = '<ol class="linenums"><li class="L0"><span class="dec">&lt;!doctype html&gt;</span></li><li class="L1"><span class="tag">&lt;html</span><span class="pln"> </span><span class="atn">lang</span><span class="pun">=</span><span class="atv">"en"</span><span class="tag">&gt;</span></li><li class="L2"><span class="tag">&lt;head&gt;</span></li><li class="L3"><span class="tag">&lt;meta</span><span class="pln"> </span><span class="atn">charset</span><span class="pun">=</span><span class="atv">"utf-8"</span><span class="tag">&gt;</span></li><li class="L4"><span class="tag">&lt;title&gt;</span><span class="pln">Document</span><span class="tag">&lt;/title&gt;</span></li><li class="L5"><span class="tag">&lt;link</span><span class="pln"> </span><span class="atn">rel</span><span class="pun">=</span><span class="atv">"stylesheet"</span><span class="pln"> </span><span class="atn">href</span><span class="pun">=</span><span class="atv">"'+$.istyle.url('HTTP')+'/istyle/code/istyle.'+cssversLast+'.css"</span><span class="tag">&gt;</span></li><li class="L6"><span class="tag">&lt;/head&gt;</span></li><li class="L7"><span class="tag">&lt;body&gt;</span></li><li class="L8"><span class="pln">&nbsp;</span></li><li class="L9"><span class="com">&lt;!-- Your code --&gt;</span></li><li class="L0"><span class="pln">&nbsp;</span></li><li class="L1"><span class="tag">&lt;script</span><span class="pln"> </span><span class="atn">src</span><span class="pun">=</span><span class="atv">"'+$.istyle.url('HTTP')+'/libs/jquery-1.9.1.min.js"</span><span class="tag">&gt;&lt;/script&gt;</span></li><li class="L2"><span class="tag">&lt;script</span><span class="pln"> </span><span class="atn">src</span><span class="pun">=</span><span class="atv">"'+$.istyle.url('HTTP')+'/istyle/code/istyle.'+jsversLast+'.js"</span><span class="tag">&gt;&lt;/script&gt;</span></li><li class="L3"><span class="tag">&lt;/body&gt;</span></li><li class="L4"><span class="tag">&lt;/html&gt;</span></li></ol>'

	$('#starttmplhtml').html(tmplhtml)


	for( var key in $.istyle.css.mods ){
		if( $.istyle.css.mods[key].d != null ){
			var checkit='';
			if( $.istyle.css.mods[key].d==1 ) checkit=' checked="checked"';
			$("#components .download-builder ul").append('<li><label class="checkbox"><input'+checkit+' type="checkbox" value="'+key+'">'+$.istyle.css.mods[key].n+'</label></li>');
		}
	}

	for( var key in $.istyle.js.mods ){
		if( $.istyle.js.mods[key].d != null ){
			var checkit='';
			if( $.istyle.js.mods[key].d==1 ) checkit=' checked="checked"';
			$("#plugins .download-builder ul").append('<li><label class="checkbox"><input'+checkit+' type="checkbox" value="'+key+'">'+$.istyle.js.mods[key].n+'</label></li>');
		}
	}
	var myDate = new Date();
	var buildTime = myDate.iformat("yyyy-MM-dd hh:mm");

	var urlPre = $.istyle.url('g')+'/??';
	var urlTime = '?t='+myDate.iformat("yyyyMMdd");

	var inputsComponent = $("#components .download-builder input"),
		inputsPlugin = $("#plugins .download-builder input"),
		inputsVariables = $("#variables .download-builder input");

	// toggle all plugin checkboxes
	$('#components .toggle-all').on('click',function(e) {
		e.preventDefault() 
		inputsComponent.attr('checked', !inputsComponent.is(':checked'))
		var css = $('#components').find('.download-builder input:checked').map(function() {
				return this.value+'.css';
			}).get().join();
		if( css )
			$('#customurls-css').val(urlPre+css+urlTime+'.css')
		else
			$('#customurls-css').val('')
	})


	$('#plugins .toggle-all').on('click',function(e) {
		e.preventDefault() 
		inputsPlugin.attr('checked', !inputsPlugin.is(':checked'))
		var js = $('#plugins').find('.download-builder input:checked').map(function() {
				return this.value+'.js';
			}).get().join();
		if( js )
			$('#customurls-js').val(urlPre+js+urlTime+'.js')
		else
			$('#customurls-js').val('')
	})

	$('#variables .toggle-all').on('click',function(e) {
		e.preventDefault() 
		inputsVariables.val('')
	})

	

	var ist = {
		hid: '.istart-ver, .istart-url, .istart-dow, .istart-update',
		ver: '.istart-ver',
		url: '.istart-url',
		dow: '.istart-dow',
		update: '.istart-update'
	};

	$(ist.hid).hide();
	$(ist.ver).show();

	$('.nav-custom a').each(function(e){
		$(this).click(function(){
			$(this).parent().addClass('active').siblings().removeClass('active');
			var point = $(this).attr('data-point');

			if( point==='ver' ){
				$(ist.hid).hide();
				$(ist.ver).show();
			}
			else if( point==='url' ){
				$(ist.hid).hide();
				$(ist.url).show();
				customUrl($('#components'), $('#customurls-css'), '.css');
				customUrl($('#plugins'), $('#customurls-js'), '.js');
			}
			else if( point==='dow' ){
				$(ist.hid).hide();
				$(ist.dow).show();
			}
			else if( point==='update' ){
				$(ist.hid).hide();
				$(ist.update).show();
			}
		});
		
	});

	var urlPre = $.istyle.url('g')+'/??';
	var urlTime = '?t='+myDate.iformat("yyyyMMdd");

	customUrl($('#components'), $('#customurls-css'), '.css');
	customUrl($('#plugins'), $('#customurls-js'), '.js');

	function customUrl(mod, area, suffix){
		var cssDefault = mod.find('.download-builder input:checked').map(function() {
			return this.value+suffix;
		}).get().join();

		area.val(urlPre+cssDefault+urlTime+suffix);

		mod.find('.download-builder').click(function(e){
			e = e || window.event;
	        var target = e.target || e.srcElement;

	        if( target.tagName === 'INPUT' ){
				var css = mod.find('.download-builder input:checked').map(function() {
					return this.value+suffix;
				}).get().join();
				area.val(urlPre+css+urlTime+suffix);
	        }
		});

	}




	$('.toggle-open').click(function(){
		$('#variables .download-builder, #variables .toggle-all').toggle();
	});
	

	// request built javascript
	$('.btn-customdown').on('click',function() {

		var css = $("#components .download-builder input:checked").map(function() {
				return this.value
			}).get().join(),
			js = $("#plugins .download-builder input:checked").map(function() {
				return this.value
			}).toArray(),
			vars = {},
			img = false,
			csscopy = '/*!\n'+'* istyle.css\n'+'* '+css+'\n* '+buildTime+'\n'+'*/\n',
			jscopy = '/*!\n'+'* istyle.js\n'+'* '+js.join(',')+'\n* '+buildTime+'\n'+'*/\n';

		$("#variables .download-builder input").each(function() {
			$(this).val() && (vars[$(this).prev().text()] = $(this).val())
		})

		var less_pot = '', less_conf = '', less_vars = '', js_pot = '';

		if( css ){
			$.get($.istyle.url('less')+'/'+$.istyle.css.conf.join()+'.less', function(data){
				less_conf = data+'\n';
			});

			if( vars ){
				for( var key in vars ){
					less_vars += key+':'+vars[key]+';\n';
				}
			}

			if( css.indexOf('sprite')>=0 ){
				img = true;
			}

			css = css.split(',');
			css = $.istyle.css.base.concat(css);
			css = $.istyle.css.reset.concat(css);
			for (var i = 0; i < css.length; i++) {
				$.get($.istyle.url('less')+'/'+css[i]+'.less', function(data){
					less_pot += data+'\n';
				});
			};
		}

		if( js.length ){
			for (var i = 0; i < js.length; i++) {
				$.get($.istyle.url('js')+'/'+js[i]+'.js', function(data){
					js_pot += data+'\n';
				});
			};
		}

		setTimeout(function(){
			var lessCode = less_conf+less_vars+less_pot, css_pot = '';
			if( !$.istyle.isdev() ){
				$('body').append('<script src="'+$.istyle.url('misc')+'/less.js"></script>');
			}
			try {
				less.Parser().parse(lessCode, function(error, result){
					if(error == null){
						css_pot = result.toCSS();

						if( css_pot ){
							if(  $('#custom-pack-css-1').is(':checked') ){
								css_pot = cssPacker(css_pot, 1);
							}
							if(  $('#custom-pack-css-2').is(':checked') ){
								css_pot = cssPacker(css_pot, 0);
							}
						}

						if( js_pot ){
							if(  $('#custom-pack-js-1').is(':checked') ){
								$('body').append('<script src="'+$.istyle.url('misc')+'/js-packer.js"></script>');
								js_pot = jsPacker(js_pot, 1);
							}
							if(  $('#custom-pack-js-2').is(':checked') ){
								$('body').append('<script src="'+$.istyle.url('misc')+'/js-packer.js"></script>');
								js_pot = jsPacker(js_pot, 0);
							}
						}

						if( css_pot || js_pot ){
							setTimeout(function(){
								$.ajax({
									type: 'POST',
									url: $.istyle.url('misc')+'/custom.download.php',
									dataType: 'jsonpi', 
									params: {
										js: js_pot,
										css: css_pot,
										img: img,
										csscopy: csscopy,
										jscopy: jscopy
									}
								});
							},500);
							$('#download .alert-danger').html('').removeClass('in');
						}
					}else{
						showError(error);
					}
				});
			}catch (error){
				showError(error);
			}

			// less error
			function showError(error){
				var errorMessage = "";
				if(error != null){
					if(error.name != null){
						errorMessage += error.name + ": ";
					}
					if(error.message != null){
						errorMessage += error.message;
					}
					
					if(error.extract != null && error.extract.length > 0){
						var extract = null;
						for(var i = 0; i < error.extract.length; i++){
							var currentExtract = error.extract[i];
							if(extract == null){
								extract = currentExtract;
							}
							else if(lessCode.indexOf(extract + "\n" + currentExtract) != -1){
								extract += "\n" + currentExtract;
							}
							else{
								break;
							}
						}
					}
				}
				if(errorMessage == null){
					errorMessage = "Unknown error";
				}
				$('#download .alert-danger').html(errorMessage).addClass('in');
			}

		},400);

	})

	function jsPacker(code, base64) {
	    var packer = new Packer;
	    if (base64) {
	        var output = packer.pack(code, 1, 0)
	    } else {
	        var output = packer.pack(code, 0, 0)
	    }
	    return output
	}
	
	function cssPacker(code, type){
		var s = code;
		switch (type){
			// 一行
			case 1:
				s = s.replace(/\/\*(.|\n)*?\*\//g, ""); 
				s = s.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
				s = s.replace(/\,[\s\.\#\d]*\{/g, "{"); 
				s = s.replace(/;\s*;/g, ";");
				s = s.replace(/;\s*}/g, "}"); 
				s = s.match(/^\s*(\S+(\s+\S+)*)\s*$/);
				return (s == null) ? "" : s[1];
			break;
			// 多行
			case 0:
				s = s.replace(/\/\*(.|\n)*?\*\//g, ""); 
				s = s.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
				s = s.replace(/\,[\s\.\#\d]*\{/g, "{");
				s = s.replace(/;\s*;/g, ";"); 
				s = s.replace(/;\s*}/g, "}"); 
				s = s.replace(/([^\s])\{([^\s])/g, "$1{$2");
				s = s.replace(/([^\s])\}([^\n]s*)/g, "$1}\n$2");
				return s;
			break;
		}
	}

	// https://github.com/benvinegar/jquery-jsonpi
	$.ajaxTransport('jsonpi', function(opts, originalOptions, jqXHR) {
	  var url = opts.url;

	  return {
	    send: function(_, completeCallback) {
	      var name = 'jQuery_iframe_' + jQuery.now()
	        , iframe, form

	      iframe = $('<iframe>')
	        .attr('name', name)
	        .appendTo('head')

	      form = $('<form>')
	        .attr('method', opts.type) // GET or POST
	        .attr('action', url)
	        .attr('target', name)

	      $.each(opts.params, function(k, v) {

	        $('<input>')
	          .attr('type', 'hidden')
	          .attr('name', k)
	          .attr('value', typeof v == 'string' ? v : JSON.stringify(v))
	          .appendTo(form)
	      })

	      form.appendTo('body').submit()
	    }
	  }
	})


})(jQuery);