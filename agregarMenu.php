<?php 
    include('conexion.php');

    $datos = array(
        'nomMenu' => $_POST['nomMenu'],
        'Usuario' => $_POST['Usuario'],
        'Fecha' => $_POST['Fecha']
    );

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
        
    $conn->close();
?>