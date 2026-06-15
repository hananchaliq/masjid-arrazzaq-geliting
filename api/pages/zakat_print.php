<?php
$pdo = getDBConnection();

$sql = "SELECT * FROM zakat ORDER BY tanggal DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$zakatData = $stmt->fetchAll();

/* SUMMARY */
$total = 0;
foreach ($zakatData as $z) {
   $total += $z['jumlah_bayar'];
}
?>

<!DOCTYPE html>
<html>

<head>
   <meta charset="UTF-8">
   <title>Print Zakat</title>

   <style>
      body {
         font-family: Arial;
         margin: 20px;
         color: #111;
      }

      .header {
         text-align: center;
         border-bottom: 2px solid #000;
         padding-bottom: 10px;
         margin-bottom: 20px;
      }

      table {
         width: 100%;
         border-collapse: collapse;
      }

      th,
      td {
         border: 1px solid #ddd;
         padding: 8px;
         font-size: 12px;
      }

      th {
         background: #f3f3f3;
      }

      .right {
         text-align: right;
      }

      @media print {
         .no-print {
            display: none;
         }
      }
   </style>
</head>

<body>

   <div class="header">
      <h1>LAPORAN ZAKAT</h1>
      <div>Dicetak: <?= date('d M Y H:i') ?></div>
   </div>

   <h3>Total Zakat: <?= formatRupiah($total) ?></h3>

   <table>
      <thead>
         <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>Nama Muzakki</th>
            <th>Jenis</th>
            <th class="right">Jumlah</th>
         </tr>
      </thead>

      <tbody>
         <?php $no = 1;
         foreach ($zakatData as $z): ?>
            <tr>
               <td><?= $no++ ?></td>
               <td><?= formatTanggal($z['tanggal']) ?></td>
               <td><?= htmlspecialchars($z['nama_muzakki'] ?? 'Hamba Allah') ?></td>
               <td><?= $z['jenis_zakat'] ?></td>
               <td class="right"><?= formatRupiah($z['jumlah_bayar']) ?></td>
            </tr>
         <?php endforeach; ?>
      </tbody>
   </table>

   <script>
      window.addEventListener("load", () => {
         window.print();
      });

      window.onafterprint = () => {
         window.location.href = "index.php?page=zakat";
      };
   </script>

</body>

</html>