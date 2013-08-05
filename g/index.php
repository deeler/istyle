<?php 
/*
 * iStyle URL Modules
 * Modify 2013.04.15
 * Author Haozi
 */

date_default_timezone_set('PRC');
$split = '/g/??';
if( substr_count(geturl(), $split)!=1 ){
	return undefind();
}

$url = explode($split, geturl());

$reg = "/^(([A-Za-z0-9_-]+\.css)(,[A-Za-z0-9_-]+\.css)*(\?t=(20[1-3]{1}[0-9]{1}[0|1]\d{1}[0-3]{1}\d{1}\.css)+)|([A-Za-z0-9_-]+\.js)(,[A-Za-z0-9_-]+\.js)*(\?t=(20[1-3]{1}[0-9]{1}[0|1]\d{1}[0-3]{1}\d{1}\.js)+))$/";
// $reg = "/^(([A-Za-z0-9_-]+\.css)(,[A-Za-z0-9_-]+\.css)*(\?t=(20[1-3]{1}[0-9]{1}[0|1]\d{1}[0-3]{1}\d{1}\.css)+)?|([A-Za-z0-9_-]+\.js)(,[A-Za-z0-9_-]+\.js)*(\?t=(20[1-3]{1}[0-9]{1}[0|1]\d{1}[0-3]{1}\d{1}\.js)+)?)$/";

// 网址匹配
if( !preg_match($reg, $url[1]) ){
	return undefind();
}

$url = explode('?t=', $url[1]);

$mods = explode(',', $url[0]);
$modsSort = $mods;  sort($modsSort);
$mostr = implode(',', $modsSort);

$time = explode('.', $url[1]);

$suffix = $time[1];
$time = $time[0];
$textType = 'javascript';

$filename = $time.'-'.md5($mostr).'.'.$suffix;
$filedir = '../gcode/'.$filename;

if( $suffix=='css' ){
	$suffix='less';
	$textType = 'css';
}

$note = '';
$note .= '/*!'."\n";
$note .= ' * iStyle '.$time."\n";
$note .= ' * Modules: '.$mostr."\n";
$note .= '*/'."\n";

// if( file_exists($filedir) ) { 
// 	header("Content-type: text/".$textType."; charset=utf-8");
// 	echo history();
// }
// else{
	if( $suffix=='less' ){
		?>

		<textarea style="display:none" id="t"><?php echo code(); ?></textarea>
		<textarea style="display:none" id="u"><?php echo $filedir; ?></textarea>
		<textarea style="display:none" id="n"><?php echo $note; ?></textarea>
		<script src="../misc/jquery.js"></script>
		<script src="../misc/less.js"></script>
		<script>
		(function($){
			try {
				less.Parser().parse($('#t').val(), function(error, result){
					if(error == null){
						// var r = result.toCSS()
						var r = cssPacker(result.toCSS(),2);
						$.ajax({
						  url: "build-css.php",
						  type: 'POST',
						  data: {
						  	css: r,
						  	note: $('#n').val(),
						  	file: $('#u').val()
						  }
						}).done(function() {
						    window.location.reload()
						});
					}
				});
			}catch (error){}

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
		})(jQuery)
		</script>

		<?php
	}
	else{
		header("Content-type: text/".$textType."; charset=utf-8");
		echo code();
		create(code());
	}
// }


// logs();

// log
function logs(){
	global $filedir, $filename;
	$log = "";
	$log .= "'time':'".date("Y-m-d G:i:s")."',\n";
	$log .= "'http':'".$_SERVER['SERVER_NAME']."'";

	$filedirlog = $filedir.'.log';
	$fp=fopen("$filedirlog", "w+"); 
	fclose($fp);  

	//写入文件
	$file_pointer = fopen($filedirlog,"a");  
	fwrite($file_pointer,$log);
	fclose($file_pointer);
}

// 404
function undefind(){
	header("Content-type: text/html; charset=utf-8");
	
	echo '<style>body{margin:40px;font-family:Microsoft Yahei;color:#666;}</style>';
	echo "\n".'<h1>404 Not Found</h1>';
	echo "\n".'<p>The requested URL was not found on this server.</p>';
	echo "\n".'<p><strong> URL:</strong> '.geturl().'</p>';
	echo "\n".'<p><strong>Date:</strong> '.date("Y-m-d G:i:s").'</p>';
}

// 读取历史文件
function history(){
	global $filedir;
	$results='';
	$fp_w=fopen($filedir,'r');
	while(!feof($fp_w)){
		$results .= fgets($fp_w);
	}
	fclose($fp_w);
	return $results;
}

// 合并代码
function code(){
	global $note;
	
	if( read()==null )
		return undefind();
	else
		return $note.read();
}

//读取模块
function read(){
	global $mods, $suffix;
	if( $suffix=='less' ){	
		$smods = array('_variables.less','_mixins.less', 'reset.less', 'type.less', 'grid.less');
		$mods = array_merge($smods,$mods);
	}
	$results='';
	for ($i=0; $i < count($mods); $i++) { 
		$item = explode('.', $mods[$i]);
		$results .= file_get_contents('../'.$suffix.'/'.$item[0].'.'.$suffix );
		$results .= "\n";
	}
	return $results;
}

//创建文件
function create($data){
	global $filedir;
	$fp=fopen("$filedir", "w+"); 
	if ( !is_writable($filedir) ){
	      die("文件:" .$filedir. "不可写，请检查！");
	}
	fclose($fp);  

	//写入文件
	$file_pointer = fopen($filedir,"a");  
	fwrite($file_pointer,$data);
	fclose($file_pointer);
}

function geturl() {
    $pageURL = 'http';

    /*if ($_SERVER["HTTPS"] == "on") {
        $pageURL .= "s";
    }*/
    $pageURL .= "://";

    if ($_SERVER["SERVER_PORT"] != "80") {
        $pageURL .= $_SERVER["SERVER_NAME"] . ":" . $_SERVER["SERVER_PORT"] . $_SERVER["REQUEST_URI"];
    } else {
        $pageURL .= $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
    }
    return $pageURL;
}
?>