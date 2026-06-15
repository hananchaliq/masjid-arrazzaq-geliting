<?php
// 1. Bersihkan buffer jika ada warning/notice tak sengaja di awal
ob_start();

// 2. Set Header API
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST");

// Jika ini adalah request OPTIONS (preflight dari browser), langsung gass bereskan
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
   exit(0);
}

// 3. Panggil file koneksi database
// PENTING: Pastikan path ini benar! Jika file ini selevel dengan folder api, sesuaikan ../
require_once __DIR__ . '//includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

   // 4. Ambil data mentah JSON dari React
   $json = file_get_contents('php://input');
   $data = json_decode($json, true);

   // 5. Validasi apakah JSON berhasil di-decode
   if ($data === null) {
      ob_clean();
      echo json_encode([
         "success" => false,
         "message" => "Format data yang dikirim tidak valid (Bukan JSON)."
      ]);
      exit();
   }

   // Mengubah input dari React menjadi format yang dikenali database kamu
   $jenisRaw = $data['jenis_zakat'] ?? 'Harta';
   $jenis = (strtolower($jenisRaw) === 'harta' || strtolower($jenisRaw) === 'maal') ? 'maal' : 'fitrah';
   $jumlah = $data['jumlah_bayar'] ?? 0;
   $nama = htmlspecialchars($data['nama_muzakki'] ?? 'Hamba Allah');

   if ($jumlah > 0 && !empty($nama)) {
      try {
         // Pastikan fungsi ini mengembalikan objek PDO yang aktif
         $pdo = getDBConnection();

         $sql = "INSERT INTO zakat (
                        nama_muzakki,
                        jenis_zakat,
                        jumlah_bayar,
                        tanggal
                    ) VALUES (?, ?, ?, NOW())";

         $stmt = $pdo->prepare($sql);
         $simpan = $stmt->execute([$nama, $jenis, $jumlah]);

         if ($simpan) {
            ob_clean(); // Hapus output HTML liar sebelum kirim JSON
            echo json_encode([
               "success" => true,
               "message" => "Data zakat berhasil disimpan!"
            ]);
            exit();
         } else {
            ob_clean();
            echo json_encode([
               "success" => false,
               "message" => "Gagal menyimpan ke database."
            ]);
            exit();
         }

      } catch (PDOException $e) {
         ob_clean();
         echo json_encode([
            "success" => false,
            "message" => "Error Database: " . $e->getMessage()
         ]);
         exit();
      }
   } else {
      ob_clean();
      echo json_encode([
         "success" => false,
         "message" => "Nama muzakki atau jumlah bayar tidak boleh kosong."
      ]);
      exit();
   }
} else {
   ob_clean();
   echo json_encode([
      "success" => false,
      "message" => "Metode HTTP tidak diizinkan."
   ]);
   exit();
}