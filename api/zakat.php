<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/includes/functions.php';

try {

    $zakatData = getZakatData(); // ambil 10 transaksi terakhir, sesuaikan kebutuhan

    $response = [
        'success' => true,
        'data'    => $zakatData
    ];

    echo json_encode($response);

} catch (Exception $e) {

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}