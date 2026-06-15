<?php
/**
 * Kelola Data Berita
 * File: dashboard/berita.php
 */

$pdo = getDBConnection();

$stmt = $pdo->query("SELECT * FROM berita ORDER BY id DESC");
$beritaData = $stmt->fetchAll();

?>

<div class="p-4 lg:p-6 max-w-[1700px] mx-auto bg-black">

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
            <a href="index.php?page=berita" class="vercel-label">Publikasi</a>
            <span class="text-zinc-700">/</span>
            <span class="text-xs text-zinc-400">Manajemen Berita</span>
         </div>

         <h1 class="text-2xl font-bold tracking-tight text-white">
            Pusat Publikasi Berita
         </h1>

         <p class="text-sm text-zinc-500 mt-1">
            Kelola berita, informasi, dan publikasi jama'ah secara realtime
         </p>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
         <a href="index.php?page=berita_print
&sort=<?= $_GET['sort'] ?? 'tanggal_desc' ?>
&start_date=<?= $_GET['start_date'] ?? '' ?>
&end_date=<?= $_GET['end_date'] ?? '' ?>" target="_blank" rel="opener"
            class="inline-flex items-center gap-2 whitespace-nowrap bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black px-3 py-2 rounded-lg text-sm transition">
            <i class="fas fa-print"></i>
            <span>Print</span>

         </a>
      </div>
   </div>

   <!-- STATS -->
   <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-6">

      <!-- BERITA TERBARU -->
      <div
         class="vercel-card group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/20">

         <!-- glow -->
         <div
            class="absolute -top-10 -right-10 w-28 h-28 bg-sky-500/10 blur-3xl rounded-full transition-all duration-500 group-hover:scale-125">
         </div>

         <div class="relative z-10 flex items-start justify-between gap-4">

            <!-- content -->
            <div class="flex-1 min-w-0">

               <p class="vercel-label mb-3">
                  Berita Terbaru
               </p>

               <h2
                  class="text-base font-semibold text-white leading-relaxed line-clamp-2 transition-all duration-300 group-hover:text-sky-100">

                  <?php echo !empty($beritaData)
                     ? sanitize($beritaData[0]['judul'])
                     : '-'; ?>

               </h2>

               <div class="flex items-center gap-1 text-xs text-sky-400 font-medium mt-4">

                  Headline Aktif

                  <i class="ri-arrow-right-up-line 
                  transition-all duration-300 
                  group-hover:translate-x-1 
                  group-hover:-translate-y-1">
                  </i>

               </div>

            </div>

            <!-- icon -->
            <div class="w-12 h-12 rounded-xl bg-zinc-950 border border-sky-500/20 
            flex items-center justify-center shrink-0 
            transition-all duration-300 
            group-hover:bg-sky-500 
            group-hover:rotate-6 
            group-hover:scale-105">

               <i class="ri-megaphone-line 
               text-sky-400 text-2xl 
               transition-all duration-300 
               group-hover:text-black 
               group-hover:scale-110">
               </i>

            </div>

         </div>
      </div>

      <!-- TOTAL BERITA -->
      <div
         class="vercel-card group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/20">

         <!-- glow -->
         <div
            class="absolute bottom-0 left-0 w-28 h-28 bg-violet-500/10 blur-3xl rounded-full transition-all duration-500 group-hover:scale-125">
         </div>

         <div class="relative z-10 flex items-start justify-between gap-4">

            <!-- content -->
            <div>

               <p class="vercel-label mb-3">
                  Total Berita
               </p>

               <h2
                  class="text-4xl font-bold text-white tracking-tight leading-none transition-all duration-300 group-hover:scale-[1.03] origin-left">

                  <?php echo count($beritaData); ?>

               </h2>

               <div class="flex items-center gap-1 text-xs text-violet-400 font-medium mt-4">

                  Arsip Dipublikasikan

                  <i class="ri-stack-line 
                  transition-all duration-300 
                  group-hover:rotate-12 
                  group-hover:scale-110">
                  </i>

               </div>

            </div>

            <!-- icon -->
            <div class="w-12 h-12 rounded-xl bg-zinc-950 border border-violet-500/20 
            flex items-center justify-center shrink-0 
            transition-all duration-300 
            group-hover:bg-violet-500 
            group-hover:-rotate-6 
            group-hover:scale-105">

               <i class="ri-newspaper-line 
               text-violet-400 text-2xl 
               transition-all duration-300 
               group-hover:text-black 
               group-hover:scale-110">
               </i>

            </div>

         </div>
      </div>

      <!-- TOTAL PENERBIT -->
      <div
         class="vercel-card group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/20">

         <!-- glow -->
         <div
            class="absolute top-0 left-0 w-28 h-28 bg-pink-500/10 blur-3xl rounded-full transition-all duration-500 group-hover:scale-125">
         </div>

         <div class="relative z-10 flex items-start justify-between gap-4">

            <!-- content -->
            <div>

               <p class="vercel-label mb-3">
                  Total Penerbit
               </p>

               <h2
                  class="text-4xl font-bold text-white tracking-tight leading-none transition-all duration-300 group-hover:scale-[1.03] origin-left">

                  <?php
                  $penulis = array_unique(array_column($beritaData, 'penulis'));
                  echo count($penulis);
                  ?>

               </h2>

               <div class="flex items-center gap-1 text-xs text-pink-400 font-medium mt-4">

                  Penulis Aktif

                  <i class="ri-quill-pen-line 
                  transition-all duration-300 
                  group-hover:-rotate-12 
                  group-hover:translate-x-1">
                  </i>

               </div>

            </div>

            <!-- icon -->
            <div class="w-12 h-12 rounded-xl bg-zinc-950 border border-pink-500/20 
            flex items-center justify-center shrink-0 
            transition-all duration-300 
            group-hover:bg-pink-500 
            group-hover:rotate-6 
            group-hover:scale-105">

               <i class="ri-user-star-line 
               text-pink-400 text-2xl 
               transition-all duration-300 
               group-hover:text-black 
               group-hover:scale-110">
               </i>

            </div>

         </div>
      </div>

   </div>

   <!-- CARD -->
   <div class="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg overflow-hidden w-full">

      <!-- HEADER -->
      <div
         class="px-4 sm:px-6 py-5 border-b border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

         <div>

            <h3 class="text-lg sm:text-xl font-semibold text-yellow-500 flex items-center">
               <i class="ri-newspaper-line mr-3"></i>
               Data Penerbit
            </h3>

            <p class="text-[#a1a1a1] text-sm mt-1">
               Seluruh Data Penerbit akan muncul dibawah ini.
            </p>

         </div>


         <a href="index.php?page=berita_tambah"
            class="bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black px-3 py-2 rounded-lg text-sm transition text-center group">

            <i class="ri-add-line text-yellow-500 group-hover:text-black"></i>
            Tambah Data

         </a>

      </div>

      <!-- TABLE -->
      <div class="overflow-x-auto">

         <table class="min-w-[1100px] w-full">

            <!-- HEAD -->
            <thead class="bg-[#0a0a0a]">

               <tr>

                  <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">
                     No
                  </th>

                  <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">
                     Gambar
                  </th>

                  <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">
                     Judul & Konten
                  </th>

                  <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">
                     Penulis & Tanggal
                  </th>

                  <th class="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">
                     Aksi
                  </th>

               </tr>

            </thead>

            <!-- BODY -->
            <tbody class="divide-y divide-[#1f1f1f]">

               <?php if (count($beritaData) > 0): ?>
                  <?php $no = 1; ?>

                  <?php foreach ($beritaData as $row): ?>

                     <tr class="hover:bg-[#111111] transition">

                        <!-- NO -->
                        <td class="px-6 py-5 text-sm text-white">
                           <?= $no++; ?>
                        </td>

                        <!-- GAMBAR -->
                        <td class="px-6 py-5">

                           <div class="w-24 h-16 rounded-xl overflow-hidden border border-[#1f1f1f]">

                              <img src="../uploads/news/<?= $row['gambar']; ?>"
                                 class="w-full h-full object-cover hover:scale-105 transition">

                           </div>

                        </td>

                        <!-- JUDUL -->
                        <td class="px-6 py-5">

                           <p class="text-white font-semibold flex items-center gap-2">

                              <i class="ri-newspaper-line text-yellow-400"></i>

                              <?= sanitize($row['judul']); ?>

                           </p>

                           <p class="text-[#a1a1a1] text-xs mt-1 line-clamp-2">
                              <?= strip_tags($row['isi_berita']); ?>
                           </p>

                        </td>

                        <!-- PENULIS -->
                        <td class="px-6 py-5 text-sm text-white">

                           <div class="flex items-center gap-2">

                              <i class="ri-user-line text-emerald-400"></i>

                              <?= sanitize($row['penulis']); ?>

                           </div>

                           <div class="text-[#a1a1a1] text-xs mt-1 flex items-center gap-2">

                              <i class="ri-calendar-line"></i>

                              <?= formatTanggal($row['tanggal']); ?>

                           </div>

                        </td>

                        <!-- AKSI -->
                        <td class="px-6 py-5">

                           <div class="flex justify-center gap-2">

                              <a href="index.php?page=berita_edit&id=<?= $row['id']; ?>"
                                 class="w-9 h-9 flex items-center justify-center border border-[#1f1f1f] text-white rounded-md hover:bg-[#111111] transition">

                                 <i class="ri-edit-line"></i>

                              </a>

                              <button onclick="konfirmasiHapus(<?= $row['id']; ?>)"
                                 class="w-9 h-9 flex items-center justify-center border border-[#1f1f1f] text-white rounded-md hover:bg-[#111111] transition">

                                 <i class="ri-delete-bin-line"></i>

                              </button>

                           </div>

                        </td>

                     </tr>

                  <?php endforeach; ?>

               <?php else: ?>

                  <tr>
                     <td colspan="5" class="px-6 py-16 text-center text-[#a1a1a1]">

                        <i class="ri-newspaper-line text-5xl opacity-30 mb-4"></i>
                        <p>Belum ada berita</p>

                     </td>
                  </tr>

               <?php endif; ?>

            </tbody>

         </table>

      </div>

   </div>

</div>

<script>

   function konfirmasiHapus(id) {

      Swal.fire({
         title: 'Hapus Berita?',
         text: 'Berita yang dihapus tidak bisa dikembalikan.',
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

            window.location.href = "index.php?page=berita_aksi&aksi=hapus&id=" + id;

         }

      });

   }

</script>