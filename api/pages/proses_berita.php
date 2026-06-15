<?php
require_once '../includes/functions.php';

$aksi = $_GET['aksi'] ?? '';

if ($aksi == 'tambah') {
    $judul = sanitize($_POST['judul']);
    $penulis = sanitize($_POST['penulis']);
    $isi_berita = $_POST['isi_berita'];
    $tanggal = date('Y-m-d');

    $gambar = uploadGambarBerita($_FILES['gambar']);

    if ($gambar !== false) {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("INSERT INTO berita (judul, isi_berita, gambar, tanggal, penulis) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$judul, $isi_berita, $gambar, $tanggal, $penulis]);
        
        setFlashMessage('success', 'Berita berhasil ditambahkan!');
        redirect('berita.php');
    } else {
        setFlashMessage('error', 'Gagal upload gambar (Max 2MB, format JPG/PNG)');
        redirect('berita_tambah.php');
    }

} elseif ($aksi == 'hapus') {
    $id = $_GET['id'];
    if (hapusBerita($id)) {
        setFlashMessage('success', 'Berita berhasil dihapus!');
    }
    redirect('berita.php');
}