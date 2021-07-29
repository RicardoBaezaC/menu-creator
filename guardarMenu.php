<?php 
    include('conexion.php');

    $datos = array(
        'idM' => $_POST['idM'],
        'array' => $_POST['arrayM']
    );

    foreach($datos['array'] as $key => $use){
        $sql = "INSERT INTO app_menudetalle (Menu, idM, Enlace, Nivel) VALUES ('".$use[0]."','".$datos['idM']."','".$use[1]."',".$use[2].")";
        
        if (($result = mysqli_query($conn, $sql)) === false) {
            die(mysqli_error($conn));
        }
    }
    $conn->close(); 
?>