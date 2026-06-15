<?php

$id = $_GET['id'] ?? null;
$status = $_GET['status'] ?? null;

if ($id && $status) {
    $pdo = getDBConnection();
    
    if ($status === 'Berhasil') {
        $stmt = $pdo->prepare("UPDATE zakat SET status = 'Berhasil' WHERE id = ?");
        $stmt->execute([$id]);
        setFlashMessage('success', 'Zakat berhasil diverifikasi!');
    } elseif ($status === 'Hapus') {
        $stmt = $pdo->prepare("DELETE FROM zakat WHERE id = ?");
        $stmt->execute([$id]);
        setFlashMessage('success', 'Laporan zakat berhasil dihapus.');
    }
}

redirect('index.php?page=zakat');