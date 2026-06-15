<?php
$pdo = getDBConnection();

/* ======================
   FILTER (SESUIKAN LIST)
====================== */
$sort = $_GET['sort'] ?? 'tanggal_desc';
$start = $_GET['start_date'] ?? null;
$end = $_GET['end_date'] ?? null;

/* ======================
   QUERY BASE
====================== */
$sql = "SELECT * FROM berita WHERE 1=1";
$params = [];

/* filter tanggal */
if ($start && $end) {
   $sql .= " AND DATE(tanggal) BETWEEN ? AND ?";
   $params[] = $start;
   $params[] = $end;
}

/* sorting */
if ($sort === 'tanggal_asc') {
   $sql .= " ORDER BY tanggal ASC";
} else {
   $sql .= " ORDER BY tanggal DESC";
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="id">

<head>
   <meta charset="UTF-8">
   <title>Print Berita</title>

   <style>
      body {
         font-family: Arial, sans-serif;
         padding: 20px;
         color: #111;
      }

      h2 {
         text-align: center;
         margin-bottom: 20px;
         font-size: 18px;
      }

      table {
         width: 100%;
         border-collapse: collapse;
         font-size: 12px;
      }

      th,
      td {
         border: 1px solid #000;
         padding: 8px;
         vertical-align: top;
      }

      th {
         background: #f2f2f2;
      }

      img {
         width: 80px;
         height: auto;
         border-radius: 4px;
      }
   </style>
</head>

<body>

   <h2>DATA BERITA</h2>

   <table>
      <thead>
         <tr>
            <th>ID</th>
            <th>Judul</th>
            <th>Isi Berita</th>
            <th>Gambar</th>
            <th>Tanggal</th>
            <th>Penulis</th>
         </tr>
      </thead>

      <tbody>
         <?php if ($data): ?>
            <?php foreach ($data as $row): ?>
               <tr>
                  <td><?= $row['id']; ?></td>
                  <td><?= htmlspecialchars($row['judul']); ?></td>
                  <td><?= htmlspecialchars($row['isi_berita']); ?></td>
                  <td>
                     <?php if (!empty($row['gambar'])): ?>
                        <?php
$img = "/uploads/news/" . $row['gambar'];
if (!empty($row['gambar']) && file_exists(__DIR__ . '/../uploads/news/' . $row['gambar'])): ?>
   <img src="<?= $img ?>" width="80">
<?php else: ?>
   <span style="color:red;">No Image</span>
<?php endif; ?>
                     <?php endif; ?>
                  </td>
                  <td><?= date('d-m-Y H:i', strtotime($row['tanggal'])); ?></td>
                  <td><?= htmlspecialchars($row['penulis']); ?></td>
               </tr>
            <?php endforeach; ?>
         <?php else: ?>
            <tr>
               <td colspan="6" style="text-align:center;">Data kosong</td>
            </tr>
         <?php endif; ?>
      </tbody>
   </table>

   <script>
      window.addEventListener("load", () => {
         window.print();
      });

      window.onafterprint = () => {
         window.location.href = "index.php?page=berita";
      };
   </script>

</body>

</html>