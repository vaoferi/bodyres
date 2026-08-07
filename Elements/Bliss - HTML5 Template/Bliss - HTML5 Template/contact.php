<?php

$name       = trim($_POST['name']);
$email      = trim($_POST['email']);
$subject    = trim($_POST['subject']);
$messege    = trim($_POST['messege']);


 if(empty($name) AND  empty($email) AND empty($subject) AND  empty($messege)) 
 {
    exit;
 }
 else 
 {
    $recipient = 'info@companyemail.com';

    $mail_body =
    "Name:  "       . $name   ."\r\n" .
    "Email: "       . $email ."\r\n" .
    "Messege:  "    . $messege;

    $header = "From: " . $name . " <" . $recipient . ">\r\n";
    mail($recipient, $subject, $mail_body, $header);
        
    echo 'Send';
 }