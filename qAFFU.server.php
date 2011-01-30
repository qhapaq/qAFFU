<?

/*
* by qhapaq
* ejemplo de recepcion de los archivos  
* @param $_FILES['Filedata'], archivo 
*/

if (isset($_FILES['Filedata']) and $_FILES['Filedata']['name']){
	$from = $_FILES[Filedata][tmp_name];
	$to = "tmp/".(($_GET[name])?($_GET[name]):($_FILES[Filedata][name]));
	move_uploaded_file($from, $to);
	
}else{
	/* ejemplo de muestra de datos al hacer submit */
	echo "<h2>qFFU Submit Data</h2>";
	echo "<pre>";
	print_r($_POST);
	echo "</pre>";
}

?>