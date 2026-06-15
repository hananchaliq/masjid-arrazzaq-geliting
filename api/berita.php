<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . "/includes/functions.php";

try {

   $berita = getBerita(3);

   echo json_encode([
      "success" => true,
      "data" => $berita
   ]);

} catch (Exception $e) {

   http_response_code(500);

   echo json_encode([
      "success" => false,
      "message" => $e->getMessage()
   ]);
}