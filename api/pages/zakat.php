<?php

$pdo = getDBConnection();

$stmt = $pdo->query("SELECT * FROM zakat ORDER BY tanggal DESC");
$zakatAll = $stmt->fetchAll();

$totalZakat = $pdo->query("SELECT SUM(jumlah_bayar) FROM zakat WHERE status = 'Berhasil'")->fetchColumn() ?? 0;

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
            <a href="index.php?page=zakat" class="vercel-label">Donasi</a>
            <span class="text-zinc-700">/</span>
            <span class="text-xs text-zinc-400">Manajemen Zakat</span>
         </div>

         <h1 class="text-2xl font-bold tracking-tight text-white">
            Pusat Pengelolaan Zakat
         </h1>

         <p class="text-sm text-zinc-500 mt-1">
            Monitoring pembayaran, verifikasi, dan distribusi zakat jama'ah
         </p>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
         <a href="index.php?page=zakat_print
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

   <!-- STATS -->
   <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-6">

      <!-- TOTAL ZAKAT -->
      <div
         class="vercel-card group relative overflow-hidden p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/20">

         <div class="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 blur-3xl rounded-full"></div>

         <div class="space-y-2 relative z-10">
            <p class="vercel-label">Total Zakat Jama'ah</p>

            <h2 id="totalZakat" class=" fade-up text-3xl font-bold text-white tracking-tight">
               0
            </h2>

            <p class="text-xs text-yellow-500 flex items-center gap-1 font-medium">
               Dana Masuk Aktif

               <i class="ri-arrow-right-up-line 
               transition-all duration-300 
               group-hover:-translate-y-1 
               group-hover:translate-x-1">
               </i>
            </p>
         </div>

         <div
            class="relative z-10 w-14 h-14 rounded-2xl bg-zinc-950 border border-yellow-500/20 flex items-center justify-center transition-all duration-300 group-hover:bg-yellow-500 group-hover:rotate-6">

            <i class="ri-funds-line text-yellow-400 text-2xl transition-all duration-300 group-hover:text-black"></i>
         </div>
      </div>

      <!-- VERIFIED -->
      <div
         class="vercel-card group relative overflow-hidden p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20">

         <div class="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full"></div>

         <div class="space-y-2 relative z-10">
            <p class="vercel-label">Zakat Terverifikasi</p>

            <h2 class="text-3xl font-bold text-white tracking-tight">
               <?php
               $pending = array_filter($zakatAll, fn($z) => $z['status'] == 'Berhasil');
               echo count($pending);
               ?>
            </h2>

            <p class="text-xs text-emerald-500 flex items-center gap-1 font-medium">
               Data Sudah Valid

               <i class="ri-check-double-line 
               transition-all duration-300 
               group-hover:scale-110">
               </i>
            </p>
         </div>

         <div
            class="relative z-10 w-14 h-14 rounded-2xl bg-zinc-950 border border-emerald-500/20 flex items-center justify-center transition-all duration-300 group-hover:bg-emerald-500 group-hover:rotate-6">

            <i
               class="ri-shield-check-line text-emerald-400 text-2xl transition-all duration-300 group-hover:text-black"></i>
         </div>
      </div>

      <!-- PENDING -->
      <div
         class="vercel-card group relative overflow-hidden p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20">

         <div class="absolute top-0 left-0 w-24 h-24 bg-red-500/5 blur-3xl rounded-full"></div>

         <div class="space-y-2 relative z-10">
            <p class="vercel-label">Zakat Pending</p>

            <h2 class="text-3xl font-bold text-white tracking-tight">
               <?php
               $pending = array_filter($zakatAll, fn($z) => $z['status'] == 'Pending');
               echo count($pending);
               ?>
            </h2>

            <p class="text-xs text-red-500 flex items-center gap-1 font-medium">
               Menunggu Verifikasi

               <i class="ri-loader-4-line 
               transition-all duration-700 
               group-hover:rotate-180">
               </i>
            </p>
         </div>

         <div
            class="relative z-10 w-14 h-14 rounded-2xl bg-zinc-950 border border-red-500/20 flex items-center justify-center transition-all duration-300 group-hover:bg-red-500 group-hover:rotate-6">

            <i class="ri-time-line text-red-400 text-2xl transition-all duration-300 group-hover:text-black"></i>
         </div>
      </div>

   </div>

   <!-- TABLE -->
   <div class="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg overflow-hidden w-full">
      <!-- HEADER -->
      <div
         class="px-4 sm:px-6 py-5 border-b border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

         <div>

            <h3 class="text-lg sm:text-xl font-semibold text-yellow-400 flex items-center gap-2">

               <i class="ri-hand-heart-line"></i>

               Data Zakat

            </h3>

            <p class="text-[#a1a1a1] text-sm mt-1">
               Semua laporan zakat masuk ke sistem
            </p>

         </div>

      </div>

      <!-- TABLE -->
      <div class="overflow-x-auto">

         <table class="min-w-[950px] w-full" id="tabel_zakat">

            <!-- HEAD (ikut style agenda) -->
            <thead class="bg-[#0a0a0a]">

               <tr>

                  <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">
                     Tanggal
                  </th>

                  <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">
                     Muzakki
                  </th>

                  <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">
                     Jenis
                  </th>

                  <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">
                     Jumlah
                  </th>

                  <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">
                     Status
                  </th>

                  <th class="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">
                     Aksi
                  </th>

               </tr>

            </thead>

            <!-- BODY -->
            <tbody class="divide-y divide-[#1f1f1f]">

               <?php foreach ($zakatAll as $z): ?>

                  <tr class="hover:bg-[#111111] transition">

                     <!-- TANGGAL -->
                     <td class="px-6 py-5 text-white text-sm whitespace-nowrap">

                        <div class="flex items-center gap-2">
                           <i class="ri-calendar-line text-emerald-400"></i>
                           <?= date('d/m/Y H:i', strtotime($z['tanggal'])); ?>
                        </div>

                     </td>

                     <!-- MUZAKKI -->
                     <td class="px-6 py-5 text-white text-sm">

                        <div class="flex items-center gap-2">

                           <i class="ri-user-line text-yellow-400"></i>

                           <span class="font-medium">
                              <?= htmlspecialchars($z['nama_muzakki']); ?>
                           </span>

                        </div>

                     </td>

                     <!-- JENIS -->
                     <td class="px-6 py-5 text-white text-sm">

                        <div class="flex items-center gap-2">

                           <?php if ($z['jenis_zakat'] == 'maal'): ?>

                              <i class="ri-coins-line text-yellow-400"></i>

                           <?php elseif ($z['jenis_zakat'] == 'fitrah'): ?>

                              <i class="ri-bowl-line text-emerald-400"></i>

                           <?php else: ?>

                              <i class="ri-question-answer-line text-[#a1a1a1]"></i>

                           <?php endif; ?>

                           <span class="text-[#a1a1a1]">
                              <?= ucfirst($z['jenis_zakat']); ?>
                           </span>

                        </div>

                     </td>

                     <!-- JUMLAH -->
                     <td class="px-6 py-5 text-white text-sm font-semibold">

                        <div class="flex items-center gap-2">

                           <i class="ri-money-dollar-circle-line text-emerald-400"></i>

                           <?= formatRupiah($z['jumlah_bayar']); ?>

                        </div>

                     </td>

                     <!-- STATUS -->
                     <td class="px-6 py-5 text-sm">

                        <?php if ($z['status'] == 'Pending'): ?>

                           <div class="flex items-center gap-2 text-purple-400">

                              <i class="ri-loader-4-line animate-spin"></i>
                              Pending

                           </div>

                        <?php else: ?>

                           <div class="flex items-center gap-2 text-emerald-400">

                              <i class="ri-checkbox-circle-line"></i>
                              Diterima

                           </div>

                        <?php endif; ?>

                     </td>

                     <!-- AKSI -->
                     <td class="px-6 py-5">

                        <div class="flex justify-center gap-2">

                           <?php if ($z['status'] == 'Pending'): ?>

                              <button onclick="confirmAction('Berhasil', <?= $z['id']; ?>)" class="w-9 h-9 flex items-center justify-center border border-[#1f1f1f]
                        text-emerald-400 rounded-md hover:bg-[#111111] transition">

                                 <i class="ri-check-line"></i>

                              </button>

                           <?php endif; ?>

                           <button onclick="confirmAction('Hapus', <?= $z['id']; ?>)" class="w-9 h-9 flex items-center justify-center border border-[#1f1f1f]
                     text-red-400 rounded-md hover:bg-[#111111] transition">

                              <i class="ri-delete-bin-line"></i>

                           </button>

                        </div>

                     </td>

                  </tr>

               <?php endforeach; ?>

            </tbody>

         </table>

      </div>

   </div>

</div>

<script>
   
   function confirmAction(type, id) {

      const isACC = type === 'Berhasil';

      Swal.fire({
         title: isACC ? 'ACC Laporan Zakat?' : 'Hapus Laporan?',
         text: isACC
            ? 'Data akan langsung tampil di beranda utama.'
            : 'Data yang dihapus tidak bisa dikembalikan.',
         icon: isACC ? 'question' : 'warning',
         background: '#18181b',
         color: '#facc15',
         showCancelButton: true,
         confirmButtonColor: isACC ? '#10b981' : '#ef4444',
         cancelButtonColor: '#3f3f46',
         confirmButtonText: isACC ? 'Ya, Verifikasi!' : 'Ya, Hapus!',
         cancelButtonText: 'Batal'
      }).then((result) => {

         if (result.isConfirmed) {

            window.location.href = `index.php?page=zakat_aksi&id=${id}&status=${type}`;

         }

      });

   }

</script>