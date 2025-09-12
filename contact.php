<?php
header('Content-Type: application/json'); header('Access-Control-Allow-Origin: *'); header('Access-Control-Allow-Methods: POST'); header('Access-Control-Allow-Headers: Content-Type');
$name = isset($_POST['name']) ? trim($_POST['name']) : ''; $email = isset($_POST['email']) ? trim($_POST['email']) : ''; $message = isset($_POST['message']) ? trim($_POST['message']) : '';
if($name === '' || $email === '' || $message === ''){ http_response_code(400); echo json_encode(['success'=>false,'error'=>'Missing fields.']); exit; }
file_put_contents(__DIR__.'/messages.log', json_encode(['ts'=>date('c'),'name'=>$name,'email'=>$email,'message'=>$message])."\n", FILE_APPEND);
echo json_encode(['success'=>true]);
