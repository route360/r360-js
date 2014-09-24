<?php

$headers = "From: " . $_POST['from'] . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

$headers = 'From: ' . $_POST['from'] . PHP_EOL .
           'Content-Type: text/html; charset=UTF-8' . PHP_EOL .
           'X-Mailer: PHP/' . phpversion();

mail($_POST['to'], $_POST['subject'], $_POST['message'], $headers);

?>