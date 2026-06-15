<?php
$error = $_SESSION['error'] ?? '';
unset($_SESSION['error']);
?>

<div class="p-4 lg:p-6 max-w-[1500px] mx-auto">

   <!-- HEADER -->
   <div class="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">

      <div>

         <div class="flex items-center gap-2 mb-2">
            <a href="index.php?page=kas" class="vercel-label">Keuangan</a>
            <span class="text-zinc-700">/</span>
            <span class="text-xs text-zinc-400">Tambah Data Kas</span>
         </div>

         <h1 class="text-2xl font-bold tracking-tight text-white">
            Tambah Transaksi Kas
         </h1>

         <p class="text-sm text-zinc-500 mt-1">
            Tambahkan data pemasukan atau pengeluaran kas masjid
         </p>

      </div>

      <a href="index.php?page=kas"
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
                     Form Kas
                  </p>

                  <p class="text-xs text-zinc-500 mt-1">
                     Isi data transaksi dengan benar
                  </p>

               </div>

               <div
                  class="w-11 h-11 rounded-xl bg-zinc-950 border border-yellow-500/20 flex items-center justify-center">

                  <i class="ri-wallet-3-line text-yellow-400 text-xl"></i>

               </div>

            </div>

            <form method="POST" action="index.php?page=kas_aksi&aksi=tambah" class="space-y-6">

               <div class=" grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <!-- TANGGAL -->
                  <div>

                     <label class="vercel-label block mb-3">
                        Tanggal
                     </label>

                     <div class="relative">

                        <i class="ri-calendar-line absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 z-10"></i>

                        <input type="text" id="tanggal" name="tanggal" required value="<?php echo date('Y-m-d'); ?>"
                           placeholder="Pilih tanggal" autocomplete="off"
                           class="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white outline-none focus:border-yellow-500 transition-all duration-300">

                     </div>

                  </div>

                  <!-- JENIS -->
                  <div>

                     <label class="vercel-label block mb-3">
                        Jenis Transaksi
                     </label>

                     <div class="relative">

                        <i class="ri-exchange-funds-line absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"></i>

                        <select id="jenis" name="jenis" required
                           class="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white outline-none focus:border-yellow-500 transition-all duration-300 appearance-none">

                           <option value="" class="bg-black">
                              Pilih Jenis
                           </option>

                           <option value="masuk" class="bg-black">
                              Pemasukan
                           </option>

                           <option value="keluar" class="bg-black">
                              Pengeluaran
                           </option>

                        </select>

                     </div>

                  </div>
               </div>

               <!-- KETERANGAN -->
               <div>

                  <label class="vercel-label block mb-3">
                     Keterangan
                  </label>

                  <textarea id="keterangan" name="keterangan" required rows="5"
                     placeholder="Contoh: Infaq Jumat, pembelian kabel speaker, dll..."
                     class="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white placeholder:text-zinc-600 outline-none resize-none focus:border-yellow-500 transition-all duration-300"></textarea>

               </div>

               <!-- JUMLAH -->
               <div>

                  <label class="vercel-label block mb-3">
                     Jumlah Uang
                  </label>

                  <div class="relative">

                     <span class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                        Rp
                     </span>

                     <input type="number" id="jumlah" name="jumlah" required min="1" placeholder="0"
                        class="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-yellow-500 transition-all duration-300">

                  </div>

               </div>

               <!-- BUTTON -->
               <div class="flex flex-col sm:flex-row gap-3 pt-2">

                  <button type="submit"
                     class="bg-yellow-500 text-black px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(234,179,8,0.2)] flex items-center justify-center gap-2">

                     <i class="ri-save-line"></i>
                     Simpan Data

                  </button>

                  <a href="index.php?page=kas"
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
                     Informasi Input
                  </p>

                  <p class="text-xs text-zinc-500 mt-1">
                     Ringkasan transaksi
                  </p>

               </div>

               <div class="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">

                  <i class="ri-file-list-3-line text-zinc-300 text-lg"></i>

               </div>

            </div>

            <div class="space-y-4">

               <div class="flex items-center justify-between">

                  <span class="text-sm text-zinc-500">
                     Status
                  </span>

                  <span
                     class="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-md border border-yellow-500/20 font-semibold tracking-wide">

                     MENUNGGU INPUT

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
                     Pastikan data valid
                  </p>

               </div>

            </div>

            <ul class="space-y-3 text-sm text-zinc-500">

               <li class="flex gap-2">
                  <i class="ri-checkbox-circle-line text-zinc-400 mt-0.5"></i>
                  Isi nominal tanpa titik atau koma
               </li>

               <li class="flex gap-2">
                  <i class="ri-checkbox-circle-line text-zinc-400 mt-0.5"></i>
                  Pilih jenis transaksi dengan benar
               </li>

               <li class="flex gap-2">
                  <i class="ri-checkbox-circle-line text-zinc-400 mt-0.5"></i>
                  Gunakan keterangan yang jelas
               </li>

            </ul>

         </div>

      </div>

   </div>

</div>

<script>

   flatpickr("#tanggal", {
      dateFormat: "Y-m-d",
      defaultDate: "today",
      monthSelectorType: "dropdown",
      locale: "id",
      allowInput: true
   });

   <?php if (!empty($flash) && $flash['type'] === 'success'): ?>

      Swal.fire({
         toast: true,
         position: 'top-end',
         icon: 'success',
         title: '<?= $flash['message']; ?>',
         showConfirmButton: false,
         timer: 2200,
         timerProgressBar: true,
         customClass: {
            popup: 'swal-gold'
         }
      });

   <?php endif; ?>

</script>

</body>

</html>