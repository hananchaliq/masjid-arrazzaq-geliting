<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . "/includes/functions.php";

try {

   $agenda = getAgendaMendatang(5);

   echo json_encode([
      "success" => true,
      "data" => $agenda
   ]);

} catch (Exception $e) {

   http_response_code(500);

   echo json_encode([
      "success" => false,
      "message" => $e->getMessage()
   ]);
}