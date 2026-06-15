<?php
/**
 * Kelola Data Kas
 * File: dashboard/kas.php
 */

$pdo = getDBConnection();

/* =========================
   PAGINATION
========================= */
$limit = 10;
$pageNow = isset($_GET['halaman']) ? (int) $_GET['halaman'] : 1;

if ($pageNow < 1) {
   $pageNow = 1;
}

$offset = ($pageNow - 1) * $limit;

/* =========================
   FILTER
========================= */
$sort = $_GET['sort'] ?? 'tanggal_desc';
$jenis = $_GET['jenis'] ?? 'all';
$start = $_GET['start_date'] ?? null;
$end = $_GET['end_date'] ?? null;

/* =========================
   QUERY DASAR
========================= */
$sql = "SELECT * FROM kas WHERE 1=1";
$params = [];

/* FILTER JENIS */
if ($jenis !== 'all') {
   $sql .= " AND jenis = :jenis";
   $params[':jenis'] = $jenis;
}

/* FILTER TANGGAL */
if (!empty($start)) {
   $sql .= " AND DATE(tanggal) >= :start";
   $params[':start'] = $start;
}

if (!empty($end)) {
   $sql .= " AND DATE(tanggal) <= :end";
   $params[':end'] = $end;
}

/* SORT */
$orderBy = "ORDER BY tanggal DESC";

switch ($sort) {

   case 'tanggal_asc':
      $orderBy = "ORDER BY tanggal ASC";
      break;

   case 'tanggal_desc':
      $orderBy = "ORDER BY tanggal DESC";
      break;

   case 'jumlah_asc':
      $orderBy = "ORDER BY jumlah ASC";
      break;

   case 'jumlah_desc':
      $orderBy = "ORDER BY jumlah DESC";
      break;

   case 'created_asc':
      $orderBy = "ORDER BY created_at ASC";
      break;

   case 'created_desc':
      $orderBy = "ORDER BY created_at DESC";
      break;
}

$sql .= " $orderBy";

/* =========================
   TOTAL DATA
========================= */
$countSql = "SELECT COUNT(*) FROM kas WHERE 1=1";

if ($jenis !== 'all') {
   $countSql .= " AND jenis = :jenis";
}

if (!empty($start)) {
   $countSql .= " AND DATE(tanggal) >= :start";
}

if (!empty($end)) {
   $countSql .= " AND DATE(tanggal) <= :end";
}

$countStmt = $pdo->prepare($countSql);

foreach ($params as $key => $value) {
   $countStmt->bindValue($key, $value);
}

$countStmt->execute();

$totalData = $countStmt->fetchColumn();
$totalHalaman = ceil($totalData / $limit);

/* =========================
   PAGINATION LIMIT
========================= */
$sql .= " LIMIT :limit OFFSET :offset";

$stmt = $pdo->prepare($sql);

/* bind filter */
foreach ($params as $key => $value) {
   $stmt->bindValue($key, $value);
}

/* bind pagination */
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

$stmt->execute();

$kasData = $stmt->fetchAll();

$totalMasuk = getTotalMasuk();
$totalKeluar = getTotalKeluar();
$saldo = getSaldo();
?>

<div class="p-4 lg:p-6 mx-auto bg-black">

   <!-- FLASH ERROR ONLY -->
   <?php if (!empty($flash) && $flash['type'] === 'error'): ?>

      <div
         class="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300 backdrop-blur-xl shadow-lg shadow-red-500/5">

         <div class="flex items-start gap-3">

            <div
               class="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">

               <i class="ri-error-warning-line text-red-400"></i>

            </div>

            <div>

               <p class="text-sm font-semibold text-red-200 mb-1">
                  Terjadi Kesalahan
               </p>

               <p class="text-sm text-red-300/80 leading-relaxed">
                  <?= htmlspecialchars($flash['message']); ?>
               </p>

            </div>

         </div>

      </div>

   <?php endif; ?>

   <!-- HEADER -->
   <div class="mb-6 flex flex-row sm:items-center justify-between">
      <div>
         <div class="flex items-center gap-2 mb-2">
            <a href="index.php?page=kas" class="vercel-label">Keuangan</a>
            <span class="text-zinc-700">/</span>
            <span class="text-xs text-zinc-400">Manajemen Kas</span>
         </div>

         <h1 class="text-2xl font-bold tracking-tight text-white">
            Pusat Manajemen Kas
         </h1>

         <p class="text-sm text-zinc-500 mt-1">
            Monitoring pemasukan, pengeluaran, dan saldo kas sistem
         </p>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
         <a href="index.php?page=kas_print
&sort=<?= $_GET['sort'] ?? 'tanggal_desc' ?>
&jenis=<?= $_GET['jenis'] ?? 'all' ?>
&start_date=<?= $_GET['start_date'] ?? '' ?>
&end_date=<?= $_GET['end_date'] ?? '' ?>" target="_blank" rel="opener"
            class="inline-flex items-center gap-2 whitespace-nowrap bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black px-3 py-2 rounded-lg text-sm transition">
            <i class="fas fa-print"></i>
            <span>Print</span>

         </a>
      </div>
   </div>

   <div class="print-header hidden">

      <h1>LAPORAN KAS MASJID</h1>

      <p>
         Dicetak:
         <?= date('d F Y H:i') ?>
      </p>

   </div>

   <!-- STATS -->
   <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-6">

      <!-- PEMASUKAN -->
      <div
         class="vercel-card p-6 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20">

         <p class="vercel-label">Total Pemasukan</p>

         <div>
            <h2 id="totalMasuk" class=" fade-up text-3xl font-bold text-white tracking-tighter">
               0
            </h2>

            <p class="text-xs text-emerald-500 mt-2 font-medium flex items-center gap-1">
               Pertumbuhan Stabil

               <i class="ri-line-chart-line 
               transition-all duration-300 
               group-hover:translate-x-1 
               group-hover:-translate-y-1">
               </i>
            </p>
         </div>
      </div>

      <!-- PENGELUARAN -->
      <div
         class="vercel-card p-6 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20">

         <p class="vercel-label">Total Pengeluaran</p>

         <div>
            <h2 id="totalKeluar" class=" fade-up text-3xl font-bold text-white tracking-tighter">
               0
            </h2>

            <p class="text-xs text-red-500 mt-2 font-medium flex items-center gap-1">
               Aliran Keluar Sistem

               <i class="ri-arrow-right-down-line 
               transition-all duration-300 
               group-hover:translate-x-1 
               group-hover:translate-y-1">
               </i>
            </p>
         </div>
      </div>

      <!-- SALDO -->
      <div
         class="vercel-card p-6 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/20">

         <p class="vercel-label">Total Saldo</p>

         <div>
            <h2 id="saldo" class=" fade-up text-3xl font-bold text-white tracking-tighter">
               0
            </h2>

            <p class="text-xs text-yellow-500 mt-2 font-medium flex items-center gap-1">
               Dana Tersimpan

               <i class="ri-coins-line 
               transition-all duration-300 
               group-hover:rotate-12 
               group-hover:scale-110">
               </i>
            </p>
         </div>
      </div>

   </div>
   <!-- TABLE CARD -->
   <div class="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg overflow-hidden">

      <!-- HEADER -->
      <div
         class="px-4 sm:px-6 py-5 border-b border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

         <div>

            <h3 class="text-lg sm:text-xl font-semibold text-yellow-500 flex items-center">
               <i class="ri-wallet-3-line mr-3"></i>
               Data Transaksi Kas
            </h3>

            <p class="text-[#a1a1a1] text-sm mt-1">
               Semua data pemasukan dan pengeluaran
            </p>

         </div>


         <a href="index.php?page=kas_tambah"
            class="bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black px-3 py-2 rounded-lg text-sm transition text-center group">

            <i class="ri-add-line text-yellow-500 group-hover:text-black"></i>
            Tambah Data

         </a>

      </div>

      <!-- TABLE WRAPPER -->
      <div class="w-full overflow-x-auto">

         <!-- FILTER -->
         <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3 my-4 px-3">

            <form method="GET" class="flex flex-wrap gap-3 items-center w-full">

               <input type="hidden" name="page" value="kas">

               <!-- SORT -->
               <select name="sort" onchange="this.form.submit()"
                  class="px-3 py-2.5 bg-[#0a0a0a] border border-[#1f1f1f] text-white text-xs md:text-sm rounded-md">

                  <option value="tanggal_desc" <?= ($_GET['sort'] ?? '') == 'tanggal_desc' ? 'selected' : '' ?>>
                     Tanggal Terbaru
                  </option>

                  <option value="tanggal_asc" <?= ($_GET['sort'] ?? '') == 'tanggal_asc' ? 'selected' : '' ?>>
                     Tanggal Terlama
                  </option>

                  <option value="jumlah_desc" <?= ($_GET['sort'] ?? '') == 'jumlah_desc' ? 'selected' : '' ?>>
                     Jumlah Besar
                  </option>

                  <option value="jumlah_asc" <?= ($_GET['sort'] ?? '') == 'jumlah_asc' ? 'selected' : '' ?>>
                     Jumlah Kecil
                  </option>

               </select>

               <!-- JENIS -->
               <select name="jenis" onchange="this.form.submit()"
                  class="px-3 py-2.5 bg-[#0a0a0a] border border-[#1f1f1f] text-white text-xs md:text-sm rounded-md">

                  <option value="all" <?= ($_GET['jenis'] ?? '') == 'all' ? 'selected' : '' ?>>
                     Semua
                  </option>

                  <option value="masuk" <?= ($_GET['jenis'] ?? '') == 'masuk' ? 'selected' : '' ?>>
                     Masuk
                  </option>

                  <option value="keluar" <?= ($_GET['jenis'] ?? '') == 'keluar' ? 'selected' : '' ?>>
                     Keluar
                  </option>

               </select>

               <div class=" flex flex-warp gap-3">
                  <!-- START -->
                  <input type="text" name="start_date" id="start_date" value="<?= $_GET['start_date'] ?? '' ?>"
                     placeholder="Tanggal Awal"
                     class="px-3 py-2.5 bg-[#0a0a0a] border border-[#1f1f1f] text-white text-xs md:text-sm rounded-md">

                  <!-- END -->
                  <input type="text" name="end_date" id="end_date" value="<?= $_GET['end_date'] ?? '' ?>"
                     placeholder="Tanggal Akhir"
                     class="px-3 py-2.5 bg-[#0a0a0a] border border-[#1f1f1f] text-white text-xs md:text-sm rounded-md">
                  </table>
               </div>

            </form>

         </div>

         <!-- TABLE -->
         <table class=" min-w-[700px] w-full ">

            <!-- HEAD -->
            <thead class="bg-[#0a0a0a]">

               <tr>

                  <th
                     class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1] hidden md:table-cell">
                     No</th>
                  <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Tanggal</th>
                  <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Keterangan
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Jenis</th>
                  <th class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Jumlah</th>
                  <th class="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Aksi</th>

               </tr>

            </thead>

            <!-- BODY -->
            <tbody class="divide-y divide-[#1f1f1f]">

               <?php if (count($kasData) > 0): ?>

                  <?php $no = 1; ?>
                  <?php foreach ($kasData as $kas): ?>

                     <tr class="hover:bg-[#111111] transition">

                        <td class="px-6 py-5 text-white text-sm hidden md:table-cell"><?= $no++; ?></td>

                        <td class="px-6 py-5 text-white text-sm whitespace-nowrap">
                           <?= formatTanggal($kas['tanggal']); ?>
                        </td>

                        <td class="px-6 py-5 text-white text-sm">
                           <?= sanitize($kas['keterangan']); ?>
                        </td>

                        <!-- JENIS -->
                        <td class="px-6 py-5">

                           <span
                              class="inline-flex items-center px-3 py-1 border border-[#1f1f1f] text-xs rounded-md uppercase gap-1 w-fit">

                              <i
                                 class="fas <?= $kas['jenis'] == 'masuk' ? 'fa-arrow-down text-emerald-500' : 'fa-arrow-up text-red-500'; ?>"></i>

                              <span class="<?= $kas['jenis'] == 'masuk' ? 'text-emerald-500' : 'text-red-500'; ?>">
                                 <?= $kas['jenis']; ?>
                              </span>

                           </span>

                        </td>

                        <!-- JUMLAH -->
                        <td class="px-6 py-5 text-right text-white font-bold text-sm whitespace-nowrap">
                           <?= formatRupiah($kas['jumlah']); ?>
                        </td>

                        <!-- AKSI -->
                        <td class="px-6 py-5">

                           <div class="flex justify-center gap-2">

                              <!-- EDIT -->
                              <a href="index.php?page=kas_edit&id=<?= $kas['id']; ?>"
                                 class="w-9 h-9 flex items-center justify-center border border-[#1f1f1f] text-white rounded-md hover:bg-[#111111] transition">

                                 <i class="fas fa-edit"></i>

                              </a>

                              <!-- DELETE -->
                              <button onclick="confirmDelete(<?= $kas['id']; ?>)"
                                 class="w-9 h-9 flex items-center justify-center border border-[#1f1f1f] text-white rounded-md hover:bg-[#111111] transition">

                                 <i class="fas fa-trash"></i>

                              </button>

                           </div>

                        </td>

                     </tr>

                  <?php endforeach; ?>

               <?php else: ?>

                  <tr>
                     <td colspan="6" class="px-6 py-16 text-center text-[#a1a1a1]">
                        <i class="fas fa-inbox text-5xl opacity-30 mb-4"></i>
                        <p>Belum ada data transaksi</p>
                     </td>
                  </tr>

               <?php endif; ?>

            </tbody>

         </table>

         <!-- PAGINATION -->
         <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5 border-t border-[#1f1f1f]">

            <p class="text-sm text-zinc-500">
               Menampilkan
               <?= count($kasData); ?> dari
               <?= $totalData; ?> data
            </p>

            <div class="flex items-center gap-2 flex-wrap">

               <!-- PREV -->
               <?php if ($pageNow > 1): ?>

                  <a href="?page=kas&halaman=<?= $pageNow - 1; ?>&sort=<?= $sort; ?>&jenis=<?= $jenis; ?>&start_date=<?= $start; ?>&end_date=<?= $end; ?>"
                     class="w-10 h-10 rounded-lg border border-[#1f1f1f] flex items-center justify-center text-white hover:bg-[#111111] transition">

                     <i class="ri-arrow-left-s-line"></i>

                  </a>

               <?php endif; ?>

               <!-- NUMBER -->
               <?php for ($i = 1; $i <= $totalHalaman; $i++): ?>

                  <a href="?page=kas&halaman=<?= $i; ?>&sort=<?= $sort; ?>&jenis=<?= $jenis; ?>&start_date=<?= $start; ?>&end_date=<?= $end; ?>"
                     class="w-10 h-10 rounded-lg border flex items-center justify-center text-sm font-medium transition
            <?= $pageNow == $i
               ? 'bg-yellow-500 text-black border-yellow-500'
               : 'border-[#1f1f1f] text-white hover:bg-[#111111]' ?>">

                     <?= $i; ?>

                  </a>

               <?php endfor; ?>

               <!-- NEXT -->
               <?php if ($pageNow < $totalHalaman): ?>

                  <a href="?page=kas&halaman=<?= $pageNow + 1; ?>&sort=<?= $sort; ?>&jenis=<?= $jenis; ?>&start_date=<?= $start; ?>&end_date=<?= $end; ?>"
                     class="w-10 h-10 rounded-lg border border-[#1f1f1f] flex items-center justify-center text-white hover:bg-[#111111] transition">

                     <i class="ri-arrow-right-s-line"></i>

                  </a>

               <?php endif; ?>

            </div>

         </div>

      </div>

   </div>

   <div class="print-footer hidden">

      Laporan ini dicetak otomatis dari sistem kas masjid.

   </div>

</div>

<script>


   function confirmDelete(id) {

      Swal.fire({
         title: 'Hapus Data?',
         text: 'Data ini tidak bisa dikembalikan!',
         icon: 'warning',
         background: '#18181b',
         color: '#facc15',
         showCancelButton: true,
         confirmButtonColor: '#ef4444',
         cancelButtonColor: '#3f3f46',
         confirmButtonText: 'Ya, Hapus!',
         cancelButtonText: 'Batal'
      }).then((result) => {

         if (result.isConfirmed) {

            window.location.href = 'index.php?page=kas_aksi&aksi=hapus&id=' + id;

         }

      });

   }

   flatpickr("#start_date", {
      dateFormat: "Y-m-d",
      monthSelectorType: "dropdown",
      locale: "id",
      onChange: function () {
         this.element.form.submit();
      }
   });

   flatpickr("#end_date", {
      dateFormat: "Y-m-d",
      monthSelectorType: "dropdown",
      locale: "id",
      onChange: function () {
         this.element.form.submit();
      }
   });
</script>