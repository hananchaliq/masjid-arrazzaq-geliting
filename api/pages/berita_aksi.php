<?php

$pdo = getDBConnection();
$aksi = $_GET['aksi'] ?? '';

/* ======================
   TAMBAH
====================== */
if ($aksi === 'tambah') {

   $judul   = trim($_POST['judul'] ?? '');
   $isi     = trim($_POST['isi_berita'] ?? '');
   $penulis = $_SESSION['admin_nama'] ?? 'admin';

   $upload = uploadGambarBerita($_FILES['gambar']);

   if (!$upload['status']) {
      setFlashMessage('error', $upload['message']);
      redirect('index.php?page=berita_tambah');
      exit;
   }

   $gambar = $upload['filename'];

   $stmt = $pdo->prepare("
      INSERT INTO berita (judul, isi_berita, gambar, tanggal, penulis)
      VALUES (?, ?, ?, NOW(), ?)
   ");

   $stmt->execute([$judul, $isi, $gambar, $penulis]);

   setFlashMessage('success', 'Berita berhasil ditambahkan');
   redirect('index.php?page=berita');
   exit;
}

/* ======================
   EDIT
====================== */
if ($aksi === 'edit') {

   $id = (int) $_GET['id'];

   $judul = trim($_POST['judul'] ?? '');
   $isi   = trim($_POST['isi_berita'] ?? '');

   $stmt = $pdo->prepare("SELECT gambar FROM berita WHERE id=?");
   $stmt->execute([$id]);
   $row = $stmt->fetch(PDO::FETCH_ASSOC);

   $gambar = $row['gambar'] ?? null;

   if (!empty($_FILES['gambar']['name'])) {

      $upload = uploadGambarBerita($_FILES['gambar']);

      if (!$upload['status']) {
         setFlashMessage('error', $upload['message']);
         redirect('index.php?page=berita_edit&id=' . $id);
         exit;
      }

      $newImage = $upload['filename'];

      if ($newImage) {

         if ($gambar && file_exists(__DIR__ . '/../uploads/news/' . $gambar)) {
            unlink(__DIR__ . '/../uploads/news/' . $gambar);
         }

         $gambar = $newImage;
      }
   }

   $stmt = $pdo->prepare("
      UPDATE berita 
      SET judul=?, isi_berita=?, gambar=?
      WHERE id=?
   ");

   $stmt->execute([$judul, $isi, $gambar, $id]);

   setFlashMessage('success', 'Berita diupdate');
   redirect('index.php?page=berita');
   exit;
}

/* ======================
   HAPUS
====================== */
if ($aksi === 'hapus') {

   $id = (int) $_GET['id'];

   $stmt = $pdo->prepare("SELECT gambar FROM berita WHERE id=?");
   $stmt->execute([$id]);
   $row = $stmt->fetch(PDO::FETCH_ASSOC);

   if (!empty($row['gambar']) && file_exists(__DIR__ . '/../uploads/news/' . $row['gambar'])) {
      unlink(__DIR__ . '/../uploads/news/' . $row['gambar']);
   }

   $stmt = $pdo->prepare("DELETE FROM berita WHERE id=?");
   $stmt->execute([$id]);

   setFlashMessage('success', 'Berita dihapus');
   redirect('index.php?page=berita');
   exit;
}