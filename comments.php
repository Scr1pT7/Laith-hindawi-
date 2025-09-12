<?php
// Simple PHP endpoints for comments + contact
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];
$file = __DIR__ . '/comments.json';
if(!file_exists($file)){ file_put_contents($file, json_encode(['comments'=>[]])); }

if($method === 'GET'){
  header('Content-Type: application/json');
  $data = json_decode(file_get_contents($file), true);
  echo json_encode(['success'=>true, 'comments'=>$data['comments']]);
  exit;
}
if($method === 'POST'){
  $name = isset($_POST['name']) ? trim($_POST['name']) : '';
  $role = isset($_POST['role']) ? trim($_POST['role']) : '';
  $text = isset($_POST['text']) ? trim($_POST['text']) : '';
  if($name === '' || $text === ''){ http_response_code(400); echo json_encode(['success'=>false, 'error'=>'Missing name or text']); exit; }
  $data = json_decode(file_get_contents($file), true);
  array_unshift($data['comments'], ['name'=>$name,'role'=>$role,'text'=>$text,'ts'=>round(microtime(true)*1000)]);
  file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
  header('Content-Type: application/json'); echo json_encode(['success'=>true]); exit;
}
?>
