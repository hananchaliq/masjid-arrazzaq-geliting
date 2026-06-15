<?php

$pdo = getDBConnection();
$aksi = $_GET['aksi'] ?? '';

/* TAMBAH */
if ($aksi == 'tambah') {

   $tanggal = $_POST['tanggal'];
   $jenis = $_POST['jenis'];
   $keterangan = $_POST['keterangan'];
   $jumlah = $_POST['jumlah'];

   if (!$tanggal || !$jenis || !$keterangan || !$jumlah) {
      $_SESSION['error'] = 'Semua wajib diisi';
      redirect('index.php?page=kas_tambah');
   }

   $stmt = $pdo->prepare("
   INSERT INTO kas (
      tanggal,
      jenis,
      keterangan,
      jumlah
   )
   VALUES (?, ?, ?, ?)
");
   $stmt->execute([$tanggal, $jenis, $keterangan, $jumlah]);

   setFlashMessage('success', 'Berhasil tambah kas');
   redirect('index.php?page=kas');
}

/* EDIT */ elseif ($aksi == 'edit') {

   $id = $_GET['id'];

   $stmt = $pdo->prepare("
      UPDATE kas 
      SET tanggal=?, jenis=?, keterangan=?, jumlah=? 
      WHERE id=?
   ");

   $stmt->execute([
      $_POST['tanggal'],
      $_POST['jenis'],
      $_POST['keterangan'],
      $_POST['jumlah'],
      $id
   ]);

   setFlashMessage('success', 'Berhasil update kas');
   redirect('index.php?page=kas');
}

/* DELETE */ elseif ($aksi == 'hapus') {

   $id = $_GET['id'];

   $stmt = $pdo->prepare("DELETE FROM kas WHERE id=?");
   $stmt->execute([$id]);

   setFlashMessage('success', 'Data dihapus');
   redirect('index.php?page=kas');
} else {
   redirect('index.php?page=kas');
}