<?php

$pdo = getDBConnection();

$aksi = $_GET['aksi'] ?? '';

if ($aksi == 'tambah') {

   $judul = trim($_POST['judul'] ?? '');
   $deskripsi = trim($_POST['deskripsi'] ?? '');
   $tanggal_mulai = trim($_POST['tanggal_mulai'] ?? '');
   $tanggal_selesai = trim($_POST['tanggal_selesai'] ?? '');
   $lokasi = trim($_POST['lokasi'] ?? '');

   if (empty($judul) || empty($tanggal_mulai)) {

      $_SESSION['error'] = 'Judul dan tanggal mulai wajib diisi!';

      redirect('index.php?page=agenda_tambah');
   }

   try {

      $stmt = $pdo->prepare("
         INSERT INTO agenda 
         (judul, deskripsi, tanggal_mulai, tanggal_selesai, lokasi)
         VALUES (?, ?, ?, ?, ?)
      ");

      $stmt->execute([
         $judul,
         $deskripsi,
         $tanggal_mulai,
         $tanggal_selesai ?: null,
         $lokasi
      ]);

      setFlashMessage('success', 'Agenda berhasil ditambahkan!');

      redirect('index.php?page=agenda');

   } catch (PDOException $e) {

      $_SESSION['error'] = 'Gagal menambahkan agenda!';

      redirect('index.php?page=agenda_tambah');

   }

}

elseif ($aksi == 'edit') {

   $id = (int) ($_GET['id'] ?? 0);

   $judul = trim($_POST['judul'] ?? '');
   $deskripsi = trim($_POST['deskripsi'] ?? '');
   $tanggal_mulai = trim($_POST['tanggal_mulai'] ?? '');
   $tanggal_selesai = trim($_POST['tanggal_selesai'] ?? '');
   $lokasi = trim($_POST['lokasi'] ?? '');

   if (empty($judul) || empty($tanggal_mulai)) {

      $_SESSION['error'] = 'Judul dan tanggal mulai wajib diisi!';

      redirect('index.php?page=agenda_edit&id=' . $id);

   }

   try {

      $stmt = $pdo->prepare("
         UPDATE agenda 
         SET 
            judul = ?,
            deskripsi = ?,
            tanggal_mulai = ?,
            tanggal_selesai = ?,
            lokasi = ?
         WHERE id = ?
      ");

      $stmt->execute([
         $judul,
         $deskripsi,
         $tanggal_mulai,
         $tanggal_selesai ?: null,
         $lokasi,
         $id
      ]);

      setFlashMessage('success', 'Agenda berhasil diperbarui!');

      redirect('index.php?page=agenda');

   } catch (PDOException $e) {

      $_SESSION['error'] = 'Gagal memperbarui agenda!';

      redirect('index.php?page=agenda_edit&id=' . $id);

   }
 
} elseif ($aksi == 'delete') {

   $id = (int) $_GET['id'];

   $stmt = $pdo->prepare("DELETE FROM agenda WHERE id = ?");
   $stmt->execute([$id]);

   setFlashMessage('success', 'Agenda berhasil dihapus!');
   redirect('index.php?page=agenda');

}

else {

   redirect('index.php?page=agenda');

}