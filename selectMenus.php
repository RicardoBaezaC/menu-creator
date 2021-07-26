<?php 
    include('conexion.php');
        
    $sql = "SELECT * FROM app_menu";
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