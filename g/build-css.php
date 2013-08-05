<?php
$filedir = $_POST['file'];

create($_POST['note'].$_POST['css']);

//创建文件
function create($data){
	global $filedir;
	$fp=fopen("$filedir", "w+"); 
	if ( !is_writable($filedir) ){
	      die("文件:" .$filedir. "不可写，请检查！");
	}
	fclose($fp);  

	//写入文件
	file_put_contents($filedir, $data);
	/*$file_pointer = fopen($filedir,"a");  
	fwrite($file_pointer,$data);
	fclose($file_pointer);*/
}

?>