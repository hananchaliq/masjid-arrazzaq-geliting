<?php
header('Content-Type: application/json');

// API KEY GEMINI
$apiKey = "AIzaSyBQ7gRljQfq7x-AWBc0406IMbjuc7WPCWs";

// Ambil input
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data || !isset($data['message'])) {
    echo json_encode(["error" => "Message kosong"]);
    exit;
}

$userMessage = $data['message'];

// Endpoint Gemini
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey";

// Payload
$payload = [
    "contents" => [
        [
            "parts" => [
                ["text" => "Kamu adalah AI Masjid Ar-Razzaq. Jawab dengan sopan, islami, dan membantu.\nUser: $userMessage"]
            ]
        ]
    ]
];

// CURL
$ch = curl_init($url);

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json"
    ],
    CURLOPT_POSTFIELDS => json_encode($payload)
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);

// Ambil jawaban
$reply = $result['candidates'][0]['content']['parts'][0]['text'] ?? "Maaf, terjadi kesalahan.";

echo json_encode([
    "reply" => $reply
]);