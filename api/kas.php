<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/includes/functions.php';

try {

   $kasData = getKasData();

   $response = [
      'success' => true,

      'summary' => [
         'masuk' => getTotalMasuk(),
         'keluar' => getTotalKeluar(),
         'saldo' => getSaldo(),
      ],

      'transactions' => $kasData
   ];

   echo json_encode($response);

} catch (Exception $e) {

   echo json_encode([
      'success' => false,
      'message' => $e->getMessage()
   ]);
}