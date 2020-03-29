<?php
include "koneksi.php";
class Statistik 
{

	public  function get_statistik()
	{
		header('Content-Type: application/json');
		header('Access-Control-Allow-Origin: *');  
		global $mysqli;
		$query="SELECT * FROM tbl_statistik where tanggal < CURDATE() order by tanggal ASC";
		$response=array();
		$result=$mysqli->query($query);
		while($row=mysqli_fetch_object($result))
		{
		    $date=date_create($row->tanggal);
			$r['date'] = date_format($date,"d M");
			$r['jumlah_positif'] = $row->jumlah_positif;
			$r['jumlah_sembuh'] = $row->jumlah_sembuh;
			$r['jumlah_meninggal'] = $row->jumlah_meninggal;
			$response[]['attributes']= $r;
		}
		$url = 'https://api.kawalcorona.com/indonesia/'; // path to your JSON file
		$data = file_get_contents($url); // put the contents of the file into a variable
		$json_parse = json_decode($data); // decode the JSON feed
		$r['date'] = date('d M');
		$r['jumlah_positif'] = $json_parse[0]->positif;
		$r['jumlah_sembuh'] = $json_parse[0]->sembuh;
		$r['jumlah_meninggal'] = $json_parse[0]->meninggal;
		$response[]['attributes']= $r;

  	 	echo json_encode($response);
	}
}

class GlobalCls 
{

	public  function get_global()
	{
		header('Content-Type: application/json');
		$url = 'https://covid19.mathdro.id/api'; // path to your JSON file
		$data = file_get_contents($url); // put the contents of the file into a variable
		$json_parse = json_decode($data); // decode the JSON feed
		$output = array(
			'positif' => $json_parse->confirmed->value,
			'sembuh' => $json_parse->recovered->value,
			'meninggal' =>$json_parse->deaths->value,
		);
  	 	echo json_encode($output);
	}
}

class Cronsave 
{

	public  function save()
	{
		global $mysqli;
		$query="SELECT * FROM tbl_statistik where tanggal = CURDATE()";
		$result=$mysqli->query($query);
		$cek = mysqli_num_rows($result);
		$url = 'https://api.kawalcorona.com/indonesia'; // path to your JSON file
		$data = file_get_contents($url); // put the contents of the file into a variable
		$json_parse = json_decode($data); // decode the JSON feed

		$positif = str_replace(",","",$json_parse[0]->positif);
		$sembuh = str_replace(",","",$json_parse[0]->sembuh);
		$meninggal = str_replace(",","",$json_parse[0]->meninggal);
		if($cek>0){
			// update
			$rs = mysqli_query($mysqli, "UPDATE tbl_statistik SET
		        jumlah_positif = '$positif',
		        jumlah_sembuh = '$sembuh',
		        jumlah_meninggal = '$meninggal'
		        WHERE tanggal=CURDATE()");

			if($rs)
			{
				$response=array(
					'status' => 1,
					'status_message' =>'Updated Successfully.'
				);
			}
		}else{
			// save
			$rs = mysqli_query($mysqli, "INSERT INTO tbl_statistik SET
					tanggal = CURDATE(),
					jumlah_positif = '$positif',
			        jumlah_sembuh = '$sembuh',
			        jumlah_meninggal = '$meninggal'");
			if($rs)
			{
				$response=array(
					'status' => 1,
					'status_message' =>'Saved Successfully.'
				);
			}
		}

		header('Content-Type: application/json');
		echo json_encode($response);
	}
}

 ?>