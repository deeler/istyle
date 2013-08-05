<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Less To CSS</title>
<style>
body{padding: 20px;}
.checklist li{width: 20%;float: left;}
</style>
</head>
<body>

<ul class="unstyled checklist clearfix"></ul>
<hr>
<div class="pull-right">
	<button class="btn btn-success" id="update">Less To CSS</button>
	<button class="btn" id="toggle-all">Toggle All</button>
</div>
<script src="../misc/jquery.js"></script>
<script src="../misc/adapter.js"></script>
<script>

(function($){

	var tocss='';
	for (var i = 0; i < $.istyle.css.base.length; i++) {
		tocss += '<li><label class="checkbox"><input type="checkbox" value="'+$.istyle.css.base[i]+'">'+$.istyle.css.base[i]+'</label></li>';
	}
	for (var i = 0; i < $.istyle.css.reset.length; i++) {
		tocss += '<li><label class="checkbox"><input type="checkbox" value="'+$.istyle.css.reset[i]+'">'+$.istyle.css.reset[i]+'</label></li>';
	}
	for( var key in $.istyle.css.mods ){
		if( $.istyle.css.mods[key].d != null ){
			tocss += '<li><label class="checkbox"><input type="checkbox" value="'+key+'">'+$.istyle.css.mods[key].n+'</label></li>';
		}
	}
	$('.checklist').prepend(tocss);

	// console.log(tocss);

	var inputsComponent = $(".checklist input");

	// toggle all plugin checkboxes
	$('#toggle-all').on('click',function(e) {
		e.preventDefault() 
		inputsComponent.attr('checked', !inputsComponent.is(':checked'))
	})


	$('#update').live('click',function() {
		var less_conf = '', name='', less_conf_code='';

		var config = $.istyle.css.conf.concat($.istyle.css.base);

		// $(this).hide();

		for (var i = 0; i < config.length; i++) {
			$.get($.istyle.url('less')+'/'+config[i]+'.less', function(data){
				less_conf += data+'\n';
			});
		};

		setTimeout(function(){
			try {
				less.Parser().parse(less_conf, function(error, result){
					if(error == null){
						less_conf_code = result.toCSS();
						// console.log(less_conf_code);
						// console.log(name, code);
						// return;
					}else{
						// showError(error);
					}
				});
			}catch (error){
				// showError(error);
			}
		},500);

		$('.checklist input:checked').each(function(e){
			name = $(this).val();
			$.get($.istyle.url('less')+'/'+name+'.less', function(data){
				setTimeout(function(){
					lessTocss($($('.checklist input:checked')[e]).val(),data,less_conf_code);

				},700);
			});

		});

		function lessTocss(name, data, dele){
			var lessCode = less_conf+data;
			// console.log(name, lessCode);
			// return;
			try {
				less.Parser().parse(lessCode, function(error, result){
					if(error == null){
						var code = result.toCSS();
						// console.log(name, dele);
						// return;
						setTimeout(function(){
							code = cssPacker(code,2);
							// console.log(name, code);
							// console.log(code);
							// return;
							$.ajax({
								type: 'POST',
								url: 'update.php',
								dataType: 'jsonpi', 
								params: {
									name: name+'.css',
									code: code,
									dele: dele
								}
							});
						},1000);
					}else{
						// showError(error);
					}
				});
			}catch (error){
				// showError(error);
			}
		}
	});

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
			// 删除注释
			case 2:
				s = s.replace(/\/\*(.|\n)*?\*\//g, ""); 
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
</script>
</body>
</html>