<?php
$pdo = getDBConnection();

/* ======================
   FILTER
====================== */
$sort = $_GET['sort'] ?? 'tanggal_desc';
$jenis = $_GET['jenis'] ?? 'all';
$start = $_GET['start_date'] ?? null;
$end = $_GET['end_date'] ?? null;

/* ======================
   DATA
====================== */
$sql = "SELECT * FROM kas WHERE 1=1";
$params = [];

if ($jenis !== 'all') {
   $sql .= " AND jenis = :jenis";
   $params[':jenis'] = $jenis;
}

if (!empty($start)) {
   $sql .= " AND DATE(tanggal) >= :start";
   $params[':start'] = $start;
}

if (!empty($end)) {
   $sql .= " AND DATE(tanggal) <= :end";
   $params[':end'] = $end;
}

switch ($sort) {
   case 'tanggal_asc':
      $sql .= " ORDER BY tanggal ASC";
      break;
   case 'jumlah_asc':
      $sql .= " ORDER BY jumlah ASC";
      break;
   case 'jumlah_desc':
      $sql .= " ORDER BY jumlah DESC";
      break;
   default:
      $sql .= " ORDER BY tanggal DESC";
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$kasData = $stmt->fetchAll();

/* ======================
   SUMMARY
====================== */
$totalMasuk = 0;
$totalKeluar = 0;

foreach ($kasData as $k) {
   if ($k['jenis'] == 'masuk')
      $totalMasuk += $k['jumlah'];
   if ($k['jenis'] == 'keluar')
      $totalKeluar += $k['jumlah'];
}

$saldo = $totalMasuk - $totalKeluar;
?>

<!DOCTYPE html>
<html>

<head>
   <meta charset="UTF-8">
   <title>Print Kas</title>

   <style>
      body {
         font-family: Arial, sans-serif;
         margin: 24px;
         color: #111;
         background: #fff;
      }

      /* HEADER */
      .header {
         text-align: center;
         border-bottom: 2px solid #111;
         padding-bottom: 14px;
         margin-bottom: 22px;
      }

      .header h1 {
         margin: 0;
         font-size: 22px;
         letter-spacing: 1px;
         font-weight: 800;
      }

      .meta {
         text-align: center;
         font-size: 12px;
         margin-top: 6px;
         color: #666;
      }

      /* SUMMARY */
      .summary {
         display: grid;
         grid-template-columns: repeat(3, 1fr);
         gap: 12px;
         margin: 18px 0;
      }

      .box {
         border: 1px solid #e5e5e5;
         background: #fafafa;
         padding: 12px;
         border-radius: 10px;
         font-size: 13px;
      }

      .box b {
         display: block;
         margin-top: 6px;
         font-size: 15px;
         font-weight: 700;
      }

      /* TABLE */
      table {
         width: 100%;
         border-collapse: collapse;
         margin-top: 12px;
         font-size: 11px;

         /* FIX UTAMA BIAR GAK NGEWRAP ANEH */
         table-layout: fixed;
      }

      th,
      td {
         border: 1px solid #e6e6e6;
         padding: 8px;
         white-space: nowrap;
         /* ANTI KEPOTONG / TURUN BARIS */
         overflow: hidden;
         text-overflow: ellipsis;
      }

      th {
         background: #f5f5f5;
         text-transform: uppercase;
         font-size: 10px;
         letter-spacing: .5px;
         font-weight: 700;
      }

      td {
         vertical-align: middle;
      }

      /* LEBAR KOLOM FIX */
      th:nth-child(1),
      td:nth-child(1) {
         width: 40px;
         text-align: center;
      }

      th:nth-child(2),
      td:nth-child(2) {
         width: 110px;
      }

      th:nth-child(3),
      td:nth-child(3) {
         width: auto;
      }

      th:nth-child(4),
      td:nth-child(4) {
         width: 80px;
         text-align: center;
      }

      th:nth-child(5),
      td:nth-child(5) {
         width: 140px;
         text-align: right;
         font-weight: 600;
      }

      /* JENIS */
      .masuk {
         color: #16a34a;
         font-weight: 700;
      }

      .keluar {
         color: #dc2626;
         font-weight: 700;
      }

      /* FOOTER */
      .footer {
         margin-top: 18px;
         font-size: 11px;
         color: #777;
         text-align: center;
         border-top: 1px solid #e5e5e5;
         padding-top: 10px;
      }

      /* PRINT MODE */
      @media print {
         body {
            margin: 0;
         }

         table {
            font-size: 10px;
         }

         th,
         td {
            padding: 6px;
         }

         .summary {
            gap: 8px;
         }
      }
   </style>
</head>

<body>

   <div class="header">
      <h1>LAPORAN KAS MASJID</h1>
      <div class="meta">
         Dicetak: <?= date('d M Y H:i') ?>
      </div>
   </div>

   <div class="summary">
      <div class="box">Pemasukan<br><b><?= formatRupiah($totalMasuk) ?></b></div>
      <div class="box">Pengeluaran<br><b><?= formatRupiah($totalKeluar) ?></b></div>
      <div class="box">Saldo<br><b><?= formatRupiah($saldo) ?></b></div>
   </div>

   <table>
      <thead>
         <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>Keterangan</th>
            <th>Jenis</th>
            <th class="right">Jumlah</th>
         </tr>
      </thead>

      <tbody>
         <?php if ($kasData): ?>
            <?php $no = 1;
            foreach ($kasData as $k): ?>
               <tr>
                  <td><?= $no++ ?></td>
                  <td><?= formatTanggal($k['tanggal']) ?></td>
                  <td><?= sanitize($k['keterangan']) ?></td>
                  <td class="<?= $k['jenis'] ?>"><?= ucfirst($k['jenis']) ?></td>
                  <td class="right"><?= formatRupiah($k['jumlah']) ?></td>
               </tr>
            <?php endforeach; ?>
         <?php else: ?>
            <tr>
               <td colspan="5" style="text-align:center;">Tidak ada data</td>
            </tr>
         <?php endif; ?>
      </tbody>
   </table>

   <script>
      window.addEventListener("load", () => {
         window.print();
      });

      window.onafterprint = () => {
         window.location.href = "index.php?page=kas";
      };
   </script>

</body>

</html>