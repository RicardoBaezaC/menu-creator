<?php 
    include('conexion.php');

    $datos = array(
        'nomMenu' => $_POST['nomMenu'],
        'Fecha' => $_POST['Fecha']
    );

    if($datos['nomMenu']!=""){
        $insert = "INSERT INTO app_menu (";
        $values = " VALUES (";
     
        foreach ( $_POST as $key => $value ) {
            $insert .= "$key, ";
            $values .= " '$value', ";
        }
     
        $insert = substr($insert, 0, -2).')';
        $values = substr($values, 0, -2).')';
     
        $sql = $insert.$values; 
        
        if (($result = mysqli_query($conn, $sql)) === false) {
            die(mysqli_error($conn));
        }else{
            echo "jaló";
        }
    }      

    $conn->close();
?>