<?php
/**
 * Edit Data Agenda
 * File: dashboard/agenda_edit.php
 */

// VALIDASI ID
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {

   setFlashMessage('error', 'ID tidak valid!');
   redirect('index.php?page=agenda');

}

$id = (int) $_GET['id'];

$pdo = getDBConnection();

$stmt = $pdo->prepare("SELECT * FROM agenda WHERE id = ?");
$stmt->execute([$id]);

$agenda = $stmt->fetch();

if (!$agenda) {

   setFlashMessage('error', 'Data agenda tidak ditemukan!');
   redirect('index.php?page=agenda');

}

$error = $_SESSION['error'] ?? '';
unset($_SESSION['error']);

// FORMAT DATETIME
function formatDateTimeLocal($datetime)
{
   return date('Y-m-d H:i', strtotime($datetime));
}
?>

<div class="p-4 lg:p-6 max-w-[1500px] mx-auto">

   <!-- HEADER -->
   <div class="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">

      <div>

         <div class="flex items-center gap-2 mb-2">
            <a href="index.php?page=agenda" class="vercel-label">Kegiatan</a>
            <span class="text-zinc-700">/</span>
            <span class="text-xs text-zinc-400">Edit Agenda</span>
         </div>

         <h1 class="text-2xl font-bold tracking-tight text-white">
            Edit Agenda Kegiatan
         </h1>

         <p class="text-sm text-zinc-500 mt-1">
            Perbarui data kegiatan dan jadwal agenda masjid
         </p>

      </div>

      <a href="index.php?page=agenda"
         class="vercel-card px-4 py-3 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 w-fit">

         <i class="ri-arrow-left-line"></i>
         Kembali

      </a>

   </div>

   <!-- ERROR -->
   <?php if ($error): ?>

      <div class="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300">

         <div class="flex items-center gap-3">

            <i class="ri-error-warning-line text-lg"></i>

            <span class="text-sm">
               <?php echo $error; ?>
            </span>

         </div>

      </div>

   <?php endif; ?>

   <!-- GRID -->
   <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">

      <!-- FORM -->
      <div class="xl:col-span-2">

         <div class="vercel-card p-5 sm:p-6">

            <div class="flex items-center justify-between mb-6">

               <div>

                  <p class="vercel-label">
                     Form Agenda
                  </p>

                  <p class="text-xs text-zinc-500 mt-1">
                     Edit data agenda dengan benar
                  </p>

               </div>

               <div
                  class="w-11 h-11 rounded-xl bg-zinc-950 border border-yellow-500/20 flex items-center justify-center">

                  <i class="ri-calendar-event-line text-yellow-400 text-xl"></i>

               </div>

            </div>

            <form method="POST" action="index.php?page=agenda_aksi&aksi=edit&id=<?= $agenda['id']; ?>">

               <!-- JUDUL -->
               <div>

                  <label class="vercel-label block mb-3">
                     Judul Kegiatan
                  </label>

                  <div class="relative">

                     <i class="ri-text absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"></i>

                     <input type="text" id="judul" name="judul" required
                        value="<?php echo htmlspecialchars($agenda['judul']); ?>" placeholder="Masukkan judul kegiatan"
                        class="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-yellow-500 transition-all duration-300">

                  </div>

               </div>

               <!-- DESKRIPSI -->
               <div>

                  <label class="vercel-label block mb-3">
                     Deskripsi
                  </label>

                  <textarea id="deskripsi" name="deskripsi" rows="5" placeholder="Masukkan deskripsi kegiatan..."
                     class="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white placeholder:text-zinc-600 outline-none resize-none focus:border-yellow-500 transition-all duration-300"><?php echo htmlspecialchars($agenda['deskripsi']); ?></textarea>

               </div>

               <!-- GRID -->
               <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <!-- TANGGAL MULAI -->
                  <div>

                     <label class="vercel-label block mb-3">
                        Tanggal Mulai
                     </label>

                     <div class="relative">

                        <i class="ri-calendar-line absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 z-10"></i>

                        <input type="text" id="tanggal_mulai" name="tanggal_mulai" required autocomplete="off"
                           value="<?php echo formatDateTimeLocal($agenda['tanggal_mulai']); ?>"
                           placeholder="Pilih tanggal mulai"
                           class="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white outline-none focus:border-yellow-500 transition-all duration-300">

                     </div>

                  </div>

                  <!-- TANGGAL SELESAI -->
                  <div>

                     <label class="vercel-label block mb-3">
                        Tanggal Selesai
                     </label>

                     <div class="relative">

                        <i
                           class="ri-calendar-check-line absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 z-10"></i>

                        <input type="text" id="tanggal_selesai" name="tanggal_selesai" autocomplete="off"
                           value="<?php echo $agenda['tanggal_selesai'] ? formatDateTimeLocal($agenda['tanggal_selesai']) : ''; ?>"
                           placeholder="Pilih tanggal selesai"
                           class="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white outline-none focus:border-yellow-500 transition-all duration-300">

                     </div>

                     <p class="text-xs text-zinc-500 mt-2">
                        Kosongkan jika kegiatan hanya berlangsung satu hari
                     </p>

                  </div>

               </div>

               <!-- LOKASI -->
               <div>

                  <label class="vercel-label block mb-3">
                     Lokasi
                  </label>

                  <div class="relative">

                     <i class="ri-map-pin-line absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"></i>

                     <input type="text" id="lokasi" name="lokasi"
                        value="<?php echo htmlspecialchars($agenda['lokasi']); ?>"
                        placeholder="Masukkan lokasi kegiatan"
                        class="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-yellow-500 transition-all duration-300">

                  </div>

               </div>

               <!-- BUTTON -->
               <div class="flex flex-col sm:flex-row gap-3 pt-2">

                  <button type="submit"
                     class="bg-yellow-500 text-black px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(234,179,8,0.2)] flex items-center justify-center gap-2">

                     <i class="ri-save-line"></i>
                     Simpan Perubahan

                  </button>

                  <a href="index.php?page=agenda"
                     class="border border-[#1f1f1f] text-zinc-400 hover:text-white hover:border-zinc-700 px-6 py-3 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2">

                     <i class="ri-close-line"></i>
                     Batal

                  </a>

               </div>

            </form>

         </div>

      </div>

      <!-- SIDEBAR -->
      <div class="space-y-6">

         <!-- INFO -->
         <div class="vercel-card p-5 sm:p-6">

            <div class="flex items-center justify-between mb-5">

               <div>

                  <p class="vercel-label">
                     Informasi Agenda
                  </p>

                  <p class="text-xs text-zinc-500 mt-1">
                     Ringkasan data agenda
                  </p>

               </div>

               <div class="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">

                  <i class="ri-information-line text-zinc-300 text-lg"></i>

               </div>

            </div>

            <div class="space-y-4">

               <div class="flex items-center justify-between">

                  <span class="text-sm text-zinc-500">
                     Status
                  </span>

                  <span
                     class="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-md border border-yellow-500/20 font-semibold tracking-wide">

                     SEDANG DIEDIT

                  </span>

               </div>

               <div class="flex items-center justify-between">

                  <span class="text-sm text-zinc-500">
                     Admin
                  </span>

                  <span class="text-sm text-white font-medium">
                     <?php echo $_SESSION['admin_nama']; ?>
                  </span>

               </div>

               <div class="flex items-center justify-between">

                  <span class="text-sm text-zinc-500">
                     Sistem
                  </span>

                  <span class="text-sm text-zinc-300">
                     Aktif
                  </span>

               </div>

            </div>

         </div>

         <!-- TIPS -->
         <div class="vercel-card p-5 sm:p-6">

            <div class="flex items-center gap-3 mb-4">

               <div class="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">

                  <i class="ri-lightbulb-line text-zinc-300"></i>

               </div>

               <div>

                  <p class="text-sm font-semibold text-white">
                     Catatan
                  </p>

                  <p class="text-xs text-zinc-500">
                     Pastikan agenda valid
                  </p>

               </div>

            </div>

            <ul class="space-y-3 text-sm text-zinc-500">

               <li class="flex gap-2">
                  <i class="ri-checkbox-circle-line text-zinc-400 mt-0.5"></i>
                  Gunakan judul yang jelas dan singkat
               </li>

               <li class="flex gap-2">
                  <i class="ri-checkbox-circle-line text-zinc-400 mt-0.5"></i>
                  Pastikan jadwal agenda sudah benar
               </li>

               <li class="flex gap-2">
                  <i class="ri-checkbox-circle-line text-zinc-400 mt-0.5"></i>
                  Isi lokasi dengan benar dan jelas
               </li>

            </ul>

         </div>

      </div>

   </div>

</div>

<script>

   flatpickr("#tanggal_mulai", {
      enableTime: true,
      time_24hr: true,
      dateFormat: "Y-m-d H:i",
      monthSelectorType: "dropdown",
      locale: "id"
   });

   flatpickr("#tanggal_selesai", {
      enableTime: true,
      time_24hr: true,
      dateFormat: "Y-m-d H:i",
      monthSelectorType: "dropdown",
      locale: "id"
   });

</script>

</body>

</html>