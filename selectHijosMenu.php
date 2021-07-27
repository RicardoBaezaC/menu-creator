<?php 
    include('conexion.php');
    
    $id = $_POST['id'];
    $sql = "SELECT * FROM app_menudetalle WHERE idM ='".$id."'";
    $result = $conn->query($sql);
    $nrow = 0;
    if ($result->num_rows > 0) {   
        while($row = $result->fetch_assoc()) {
            $todo[$nrow] = $row;
            $nrow = $nrow + 1; 
        }
        echo json_encode($todo);
    } else {
        echo "0";
    }
    $conn->close();

?>