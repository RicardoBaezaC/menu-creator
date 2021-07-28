<?php 
    include('conexion.php');
    $id = $_POST['id'];
    $sql = "DELETE FROM app_menudetalle WHERE idM ='".$id."'";
    $result = $conn->query($sql);
    if ($result) {   
        
    }
    $conn->close();

?>