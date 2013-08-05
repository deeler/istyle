<?php  

$name = $_POST['name'];
$code = $_POST['code'];
$dele = $_POST['dele'];

if( $name!='_mixins.css' ){
	$code = str_replace($dele,'',$code);
}else{
	$code = $dele;
}

// date_default_timezone_set('PRC');
// $time = date("Y-m-d G:i:s");

$copy = '';
$copy .= "/*!\n";
$copy .= " * ".$name."\n";
// $copy .= " * ".$time."\n";
// $copy .= " * istyle component\n";
$copy .= " * ------------------------------\n";
$copy .= " */\n";

$code = $copy.$code;
// var_dump($name, $code);
// die();


// 创建css
d_create($name, $code);


//创建文件
function d_create($filename, $content){
	$filename = '../css/'.$filename;
	$fp=fopen("$filename", "w+"); 
	if ( !is_writable($filename) ){
	      die("文件:" .$filename. "不可写，请检查！");
	}
	fclose($fp);  

	//写入文件
	$file_pointer = fopen($filename,"a");  
	fwrite($file_pointer,$content);
	fclose($file_pointer);
}

?>