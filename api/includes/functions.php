<?php
/**
 * Common Functions
 * File: includes/functions.php
 */

require_once 'db.php';

if (session_status() === PHP_SESSION_NONE) {
   session_start();
}

date_default_timezone_set('Asia/Jakarta');

/**
 * Format angka ke format Rupiah
 */
function formatRupiah($angka)
{
   // Paksa jadi float/int, kalau null atau kosong jadi 0
   $nominal = (float) ($angka ?? 0);
   return 'Rp ' . number_format($nominal, 0, ',', '.');
}

/**
 * Format tanggal ke format Indonesia
 */
function formatTanggal($tanggal)
{
   $bulan = [
      1 => 'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
   ];
   $date = strtotime($tanggal);
   return date('d', $date) . ' ' . $bulan[date('n', $date)] . ' ' . date('Y', $date);
}

/**
 * Format tanggal dan waktu ke format Indonesia
 */
function formatTanggalWaktu($datetime)
{
   $bulan = [
      1 => 'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
   ];
   $date = strtotime($datetime);
   return date('d', $date) . ' ' . $bulan[date('n', $date)] . ' ' . date('Y', $date) . ' ' . date('H:i', $date) . ' WIB';
}

/**
 * Mendapatkan nama hari dalam bahasa Indonesia
 */
function getNamaHari($tanggal = null)
{
   $hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
   if ($tanggal) {
      return $hari[date('w', strtotime($tanggal))];
   }
   return $hari[date('w')];
}

/**
 * Mendapatkan data kas dengan perhitungan saldo
 */
function getKasData()
{
   $pdo = getDBConnection();
   $stmt = $pdo->query("SELECT * FROM kas ORDER BY tanggal DESC, id DESC");
   return $stmt->fetchAll();
}

/**
 * Mendapatkan total pemasukan
 */
function getTotalMasuk()
{
   $pdo = getDBConnection();
   $stmt = $pdo->query("SELECT COALESCE(SUM(jumlah), 0) as total FROM kas WHERE jenis = 'masuk'");
   $result = $stmt->fetch();
   return $result['total'];
}

/**
 * Mendapatkan total pengeluaran
 */
function getTotalKeluar()
{
   $pdo = getDBConnection();
   $stmt = $pdo->query("SELECT COALESCE(SUM(jumlah), 0) as total FROM kas WHERE jenis = 'keluar'");
   $result = $stmt->fetch();
   return $result['total'];
}

/**
 * Mendapatkan saldo kas
 */
function getSaldo()
{
   return getTotalMasuk() - getTotalKeluar();
}

/**
 * Mendapatkan data agenda
 */
function getAgendaData($limit = null)
{
   $pdo = getDBConnection();
   $sql = "SELECT * FROM agenda ORDER BY tanggal_mulai ASC";
   if ($limit) {
      $sql .= " LIMIT " . (int) $limit;
   }
   $stmt = $pdo->query($sql);
   return $stmt->fetchAll();
}

/**
 * Mendapatkan agenda yang akan datang
 */
function getAgendaMendatang($limit = 5)
{
   $pdo = getDBConnection();
   $stmt = $pdo->prepare("SELECT * FROM agenda WHERE tanggal_mulai >= NOW() ORDER BY tanggal_mulai ASC LIMIT ?");
   $stmt->execute([$limit]);
   return $stmt->fetchAll();
}

/**
 * Redirect helper
 */
function redirect($url)
{
   header("Location: " . $url);
   exit();
}

/**
 * Flash message helper
 */
function setFlashMessage($type, $message)
{
   $_SESSION['flash'] = [
      'type' => $type,
      'message' => $message
   ];
}

/**
 * Get flash message
 */
function getFlashMessage()
{
   if (isset($_SESSION['flash'])) {
      $flash = $_SESSION['flash'];
      unset($_SESSION['flash']);
      return $flash;
   }
   return null;
}

/**
 * Sanitize input
 */
function sanitize($data)
{
   return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}


/**
 * Mendapatkan data zakat terbaru
 */
function getZakatData($limit = 5)
{
   $pdo = getDBConnection();

   $stmt = $pdo->prepare("
        SELECT
            id,
            jenis_zakat,
            jumlah_bayar,
            tanggal,
            status
        FROM zakat
        WHERE status = 'Berhasil'
        ORDER BY tanggal DESC
        LIMIT ?
    ");

   $stmt->bindValue(1, (int) $limit, PDO::PARAM_INT);
   $stmt->execute();
   return $stmt->fetchAll(PDO::FETCH_ASSOC);
}


// Tambahkan fungsi baru untuk Admin melihat yang pending
function getZakatPending()
{
   $pdo = getDBConnection();
   $stmt = $pdo->query("SELECT * FROM zakat WHERE status = 'Pending' ORDER BY tanggal ASC");
   return $stmt->fetchAll();
}

// Ambil semua berita (untuk dashboard utama)
function getBerita($limit = 6)
{
   $pdo = getDBConnection();
   $stmt = $pdo->prepare("SELECT * FROM berita ORDER BY tanggal DESC LIMIT ?");
   $stmt->execute([$limit]);
   return $stmt->fetchAll();
}

function uploadGambarBerita($file)
{
   if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
      return [
         'status' => false,
         'message' => 'Gagal upload gambar'
      ];
   }

   $allowed = ['jpg', 'jpeg', 'png', 'webp'];

   $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

   if (!in_array($ext, $allowed)) {
      return [
         'status' => false,
         'message' => 'Format harus JPG, PNG, atau WEBP'
      ];
   }

   // max 2MB
   if ($file['size'] > 2 * 1024 * 1024) {
      return [
         'status' => false,
         'message' => 'Ukuran gambar maksimal 2MB'
      ];
   }

   $nama = uniqid('news_') . '.' . $ext;

   $folder = __DIR__ . '/../uploads/news/';

   if (!is_dir($folder)) {
      mkdir($folder, 0777, true);
   }

   $target = $folder . $nama;

   if (move_uploaded_file($file['tmp_name'], $target)) {

      return [
         'status' => true,
         'filename' => $nama
      ];
   }

   return [
      'status' => false,
      'message' => 'Gagal menyimpan gambar'
   ];
}

function getAllBerita()
{
   $pdo = getDBConnection();
   $stmt = $pdo->query("SELECT * FROM berita ORDER BY tanggal DESC");
   return $stmt->fetchAll();
}
/**
 * Mengambil data berita (semua atau dengan limit)
 */
function getBeritaData($limit = null)
{
   $pdo = getDBConnection();
   $sql = "SELECT * FROM berita ORDER BY tanggal DESC, id DESC";
   if ($limit) {
      $sql .= " LIMIT " . (int) $limit;
   }
   $stmt = $pdo->query($sql);
   return $stmt->fetchAll();
}

/**
 * Mengambil satu berita berdasarkan ID (untuk Edit/Hapus)
 */
function getBeritaById($id)
{
   $pdo = getDBConnection();
   $stmt = $pdo->prepare("SELECT * FROM berita WHERE id = ?");
   $stmt->execute([$id]);
   return $stmt->fetch();
}

/**
 * Fungsi Hapus Berita + Hapus File Gambar Fisik
 */
function deleteBerita($id)
{
   $pdo = getDBConnection();

   // 1. Cari data beritanya dulu buat dapet nama file gambarnya
   $berita = getBeritaById($id);

   if ($berita) {
      // 2. Hapus file gambar di folder uploads kalau bukan default
      if ($berita['gambar'] != 'default.jpg') {
         $path = '../uploads/berita/' . $berita['gambar'];
         if (file_exists($path)) {
            unlink($path);
         }
      }

      // 3. Hapus data di database
      $stmt = $pdo->prepare("DELETE FROM berita WHERE id = ?");
      return $stmt->execute([$id]);
   }
   return false;
}



?>