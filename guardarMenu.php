<?php 
    include('conexion.php');

    $datos = array(
        'idM' => $_POST['idM'],
        'Enlace' => $_POST['Enlace'],
        'Menu' => $_POST['Menu'],
        'Nivel' => $_POST['Nivel']
    );

    if($datos['idM']!="" && $datos['Nivel']!="" && $datos['Menu']!=""){
        $insert = "INSERT INTO app_menudetalle (";
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