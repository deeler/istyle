<?php  

$css = $_POST['css'];
$js = $_POST['js'];
$img = $_POST['img'];
$csscopy = $_POST['csscopy'];
$jscopy = $_POST['jscopy'];

// 准备模块less
if( !is_dir('user') ){
	mkdir('user');
}

// 创建css
if( $css ){
	d_create('istyle.css', $csscopy.$css);
}

// 创建js
if( $js ){
	d_create('istyle.js', $jscopy.$js);
}

// 创建img
if( $img == 'true' ){
	d_copy('../img','user/img',1);
}

// 下载包
include('phpzip.class.php');

$zipfilename="istyle.zip"; 
$z = new PHPZip(); 
$z -> ZipAndDownload('user',$zipfilename); 

// 清空文件夹
deldir("user");



// 清空文件夹
function deldir($dir) {
  //先删除目录下的文件：
  $dh=opendir($dir);
  while ($file=readdir($dh)) {
    if($file!="." && $file!="..") {
      $fullpath=$dir."/".$file;
      if(!is_dir($fullpath)) {
          unlink($fullpath);
      } else {
          deldir($fullpath);
      }
    }
  }
 
  closedir($dh);
  //删除当前文件夹：
  if(rmdir($dir)) {
    return true;
  } else {
    return false;
  }
}

//读取文件
function d_file($files, $dir, $suffix){
	$results='';
	for ($i=0; $i < count($files); $i++) { 
		$fp_w=fopen($dir.$files[$i].$suffix,'r');
		while(!feof($fp_w)){
			$results .= fgets($fp_w);
		}
		$results .= "\n";
		fclose($fp_w);
	}
	return $results;
}


//创建文件
function d_create($filename, $content){
	$filename = 'user/'.$filename;
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

//复制文件夹
// d_copy("feiy","feiy2",1):拷贝feiy下的文件到 feiy2,包括子目录
// d_copy("feiy","feiy2",0):拷贝feiy下的文件到 feiy2,不包括子目录
function d_copy($source, $destination, $child){
    if(!is_dir($source)){
    echo("Error:the $source is not a direction!");
    return 0;
    }
    if(!is_dir($destination)){
    mkdir($destination,0777);
    }
    $handle=dir($source);
    while($entry=$handle->read()) {
        if(($entry!=".")&&($entry!="..")){
            if(is_dir($source."/".$entry)){
                if($child)    d_copy($source."/".$entry,$destination."/".$entry,$child);
            }else{
                copy($source."/".$entry,$destination."/".$entry);
            }
        }
    }
    return true;
}

?>