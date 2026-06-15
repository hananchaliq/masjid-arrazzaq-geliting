<?php
/**
 * Kelola Data Agenda
 * File: dashboard/agenda.php
 */

if (isset($_GET['hapus']) && is_numeric($_GET['hapus'])) {

   $id = (int) $_GET['hapus'];

   try {

      $pdo = getDBConnection();

      $stmt = $pdo->prepare("DELETE FROM agenda WHERE id = ?");

      $stmt->execute([$id]);

      setFlashMessage('success', 'Data agenda berhasil dihapus!');

   } catch (PDOException $e) {

      setFlashMessage('error', 'Gagal menghapus data agenda!');

   }

   redirect('index.php?page=agenda');

}

$agendaData = getAgendaData();

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
            <a href="index.php?page=agenda" class="vercel-label">Kegiatan</a>
            <span class="text-zinc-700">/</span>
            <span class="text-xs text-zinc-400">Manajemen Agenda</span>
         </div>

         <h1 class="text-2xl font-bold tracking-tight text-white">
            Pusat Jadwal Kegiatan
         </h1>

         <p class="text-sm text-zinc-500 mt-1">
            Atur agenda kegiatan, jadwal acara, dan aktivitas masjid
         </p>
      </div>
   </div>

   <!-- CARD -->
   <div class="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg overflow-hidden w-full">

      <!-- HEADER -->
      <div
         class="px-4 sm:px-6 py-5 border-b border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

         <div>

            <h3 class="text-lg sm:text-xl font-semibold text-yellow-500 flex items-center">
               <i class="ri-calendar-event-line mr-3"></i>
               Daftar Agenda
            </h3>

            <p class="text-[#a1a1a1] text-sm mt-1">
               Semua data pemasukan dan pengeluaran
            </p>

         </div>


         <a href="index.php?page=agenda_tambah"
            class="bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black px-3 py-2 rounded-lg text-sm transition text-center group">

            <i class="ri-add-line text-yellow-500 group-hover:text-black"></i>
            Tambah Data

         </a>

      </div>

      <!-- TABLE -->
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
         <table class="min-w-[700px] w-full">

            <!-- HEAD (HANYA GANTI STYLE KE KAS) -->
            <thead class="bg-[#0a0a0a]">

               <tr>

                  <th
                     class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1] hidden md:table-cell">
                     No
                  </th>

                  <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">
                     Judul
                  </th>

                  <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">
                     Tanggal & Waktu
                  </th>

                  <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">
                     Lokasi
                  </th>

                  <th class="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">
                     Aksi
                  </th>

               </tr>

            </thead>

            <!-- BODY (HANYA STYLE KAS) -->
            <tbody class="divide-y divide-[#1f1f1f]">

               <?php if (!empty($agendaData)): ?>

                  <?php $no = 1; ?>

                  <?php foreach ($agendaData as $agenda): ?>

                     <tr class="hover:bg-[#111111] transition">

                        <!-- NO -->
                        <td class="px-6 py-5 text-white text-sm hidden md:table-cell">
                           <?= $no++; ?>
                        </td>

                        <!-- JUDUL (TETAP, CUMA DIHIAS KAS STYLE + ICON REMIX) -->
                        <td class="px-6 py-5 text-white text-sm">

                           <div class="flex items-center gap-2 text-yellow-400 font-semibold">

                              <i class="ri-calendar-event-line"></i>

                              <?= sanitize($agenda['judul']); ?>

                           </div>

                           <div class="text-[#a1a1a1] text-xs mt-1">
                              <?= sanitize($agenda['deskripsi']); ?>
                           </div>

                        </td>

                        <!-- TANGGAL (STYLE KAS CLEAN) -->
                        <td class="px-6 py-5 text-white text-sm whitespace-nowrap">

                           <div class="flex items-center gap-2">

                              <i class="ri-calendar-line text-emerald-400"></i>

                              <?= formatTanggalWaktu($agenda['tanggal_mulai']); ?>

                           </div>

                           <?php if (!empty($agenda['tanggal_selesai'])): ?>

                              <div class="text-[#a1a1a1] text-xs mt-1">
                                 s/d <?= formatTanggalWaktu($agenda['tanggal_selesai']); ?>
                              </div>

                           <?php endif; ?>

                        </td>

                        <!-- LOKASI (STYLE KAS CLEAN) -->
                        <td class="px-6 py-5 text-white text-sm">

                           <?php if (!empty($agenda['lokasi'])): ?>

                              <div class="flex items-center gap-2">

                                 <i class="ri-map-pin-line text-red-500"></i>

                                 <?= sanitize($agenda['lokasi']); ?>

                              </div>

                           <?php else: ?>

                              <span class="text-[#a1a1a1]">-</span>

                           <?php endif; ?>

                        </td>

                        <!-- AKSI (KAS STYLE) -->
                        <td class="px-6 py-5">

                           <div class="flex justify-center gap-2">

                              <a href="index.php?page=agenda_edit&id=<?= $agenda['id']; ?>"
                                 class="w-9 h-9 flex items-center justify-center border border-[#1f1f1f] text-white rounded-md hover:bg-[#111111] transition">

                                 <i class="ri-edit-line"></i>

                              </a>

                              <button onclick="confirmDelete(<?= $agenda['id']; ?>)"
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
                        <i class="ri-inbox-line text-5xl opacity-30 mb-4"></i>
                        <p>Belum ada data agenda</p>
                     </td>
                  </tr>

               <?php endif; ?>

            </tbody>

         </table>

      </div>

   </div>

</div>



<script>

   function confirmDelete(id) {

      Swal.fire({
         title: 'Hapus Agenda?',
         text: 'Data tidak bisa dikembalikan!',
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

            window.location.href = 'index.php?page=agenda_aksi&aksi=delete&id=' + id;

         }

      });

   };
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