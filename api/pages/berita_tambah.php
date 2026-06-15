<?php
/**
 * Tambah Data Berita - Vercel Industrial Style
 * File: dashboard/berita_tambah.php
 */

?>

<style>
   :root {
      --v-bg: #000000;
      --v-card: #0a0a0a;
      --v-border: #1f1f1f;
      --v-text-main: #ffffff;
      --v-text-muted: #a1a1a1;
      --v-blue: #0070f3;
   }

   .vercel-input {
      background: #000;
      border: 1px solid var(--v-border);
      color: white;
      transition: border-color 0.2s ease, ring 0.2s ease;
   }

   .vercel-input:focus {
      outline: none;
      border-color: #444;
      box-shadow: 0 0 0 1px #444;
   }

   .vercel-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--v-text-muted);
   }

   .btn-vercel-primary {
      background: #fff;
      color: #000;
      font-weight: 600;
      font-size: 13px;
   }

   .btn-vercel-secondary {
      background: transparent;
      border: 1px solid var(--v-border);
      color: #fff;
      font-weight: 500;
      font-size: 13px;
   }

   .btn-vercel-secondary:hover {
      background: rgba(255, 255, 255, 0.05);
   }
</style>

<div class="p-4 lg:p-6 max-w-[1500px] mx-auto">

   <!-- HEADER -->
   <div class="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">

      <div>

         <div class="flex items-center gap-2 mb-2">
            <a href="index.php?page=berita" class="vercel-label">Publikasi</a>
            <span class="text-zinc-700">/</span>
            <span class="text-xs text-zinc-400">Tambah Berita</span>
         </div>

         <h1 class="text-2xl font-bold tracking-tight text-white">
            Pusat Publikasi Berita
         </h1>

         <p class="text-sm text-zinc-500 mt-1">
            Buat dan publikasikan informasi terbaru untuk jama'ah
         </p>

      </div>

      <a href="index.php?page=berita"
         class="vercel-card px-4 py-3 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 w-fit">

         <i class="ri-arrow-left-line"></i>
         Kembali

      </a>

   </div>

   <!-- GRID -->
   <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">

      <!-- FORM -->
      <div class="xl:col-span-2">

         <form id="form-tambah-berita" action="index.php?page=berita_aksi&aksi=tambah" method="POST"
            enctype="multipart/form-data" class="flex flex-col gap-6">

            <!-- JUDUL -->
            <div class="vercel-card p-5 sm:p-6">

               <label class="vercel-label block mb-4">
                  Judul Berita
               </label>

               <input type="text" name="judul" required placeholder="Tuliskan judul berita..."
                  class="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white text-lg font-semibold tracking-tight outline-none focus:border-yellow-500 transition-all duration-300">

            </div>

            <!-- ISI -->
            <div class="vercel-card p-5 sm:p-6">

               <label class="vercel-label block mb-4">
                  Isi Konten
               </label>

               <textarea name="isi_berita" rows="14" required placeholder="Mulai menulis isi berita..."
                  class="w-full px-4 py-3 h-56 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white text-sm leading-relaxed outline-none resize-none focus:border-yellow-500 transition-all duration-300"></textarea>

            </div>

            <!-- BUTTON -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

               <button type="submit"
                  class="bg-yellow-500 text-black px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(234,179,8,0.2)] flex items-center justify-center gap-2">

                  <i class="ri-upload-cloud-2-line"></i>
                  Publish Berita

               </button>

               <a href="index.php?page=berita"
                  class="border border-[#1f1f1f] text-zinc-400 hover:text-white hover:border-zinc-700 px-6 py-3 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2">

                  <i class="ri-close-line"></i>
                  Batal

               </a>

            </div>

         </form>

      </div>

      <!-- SIDEBAR -->
      <div class="space-y-6">

         <!-- UPLOAD -->
         <div class="vercel-card p-5 sm:p-6">

            <div class="flex items-center justify-between mb-5">

               <div>
                  <p class="vercel-label">
                     Media Utama
                  </p>

                  <p class="text-xs text-zinc-500 mt-1">
                     Upload thumbnail berita
                  </p>
               </div>

               <div
                  class="w-10 h-10 rounded-xl bg-zinc-950 border border-yellow-500/20 flex items-center justify-center">

                  <i class="ri-image-line text-yellow-400 text-lg"></i>

               </div>

            </div>

            <div class="relative group">

               <div id="drop-area"
                  class="border-2 border-dashed border-[#1f1f1f] rounded-2xl p-6 text-center transition-all duration-300 hover:border-yellow-500/30 bg-[#0a0a0a]">

                  <!-- PLACEHOLDER -->
                  <div id="preview-placeholder">

                     <div
                        class="w-16 h-16 mx-auto rounded-2xl bg-zinc-950 border border-[#1f1f1f] flex items-center justify-center mb-4">

                        <i class="ri-upload-cloud-2-line text-2xl text-zinc-600"></i>

                     </div>

                     <p class="text-sm text-zinc-300 font-medium">
                        Upload Gambar
                     </p>

                     <p class="text-xs text-zinc-500 mt-1">
                        JPG, PNG, WEBP
                     </p>

                  </div>

                  <!-- PREVIEW -->
                  <div id="preview-wrapper" class="hidden">

                     <img id="img-preview" class="w-full h-52 object-cover rounded-xl border border-[#1f1f1f] mb-3">

                     <p class="text-[10px] text-yellow-500 font-mono truncate">
                        media_ready_to_upload.tmp
                     </p>

                  </div>

                  <input type="file" name="gambar" accept="image/*" required onchange="previewImage(event)"
                     class="absolute inset-0 opacity-0 cursor-pointer" form="form-tambah-berita">

               </div>

            </div>

            <!-- INFO -->
            <div class="space-y-2 mt-5">

               <div class="flex items-center gap-2 text-xs text-zinc-500">
                  <i class="ri-information-line"></i>
                  Maksimal ukuran 2MB
               </div>

               <div class="flex items-center gap-2 text-xs text-zinc-500">
                  <i class="ri-checkbox-circle-line"></i>
                  Format JPG, PNG, WEBP
               </div>

            </div>

         </div>

         <!-- META -->
         <div class="vercel-card p-5 sm:p-6">

            <div class="flex items-center justify-between mb-5">

               <div>
                  <p class="vercel-label">
                     Informasi Publikasi
                  </p>

                  <p class="text-xs text-zinc-500 mt-1">
                     Metadata berita
                  </p>
               </div>

               <div class="w-10 h-10 rounded-xl bg-zinc-950 border border-blue-500/20 flex items-center justify-center">

                  <i class="ri-file-info-line text-blue-400 text-lg"></i>

               </div>

            </div>

            <div class="space-y-4">

               <div class="flex items-center justify-between">

                  <span class="text-sm text-zinc-500">
                     Penulis
                  </span>

                  <span class="text-sm text-white font-medium">
                     <?php echo $_SESSION['admin_nama']; ?>
                  </span>

               </div>

               <div class="flex items-center justify-between">

                  <span class="text-sm text-zinc-500">
                     Status
                  </span>

                  <span
                     class="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md border border-blue-500/20 font-semibold tracking-wide">

                     DRAFT

                  </span>

               </div>

            </div>

         </div>

      </div>

   </div>

</div>

<script>
   function previewImage(event) {
      const file = event.target.files[0];

      if (!file) return; // 🔥 ini yang hilang dari hidupmu

      const reader = new FileReader();
      const preview = document.getElementById('img-preview');
      const wrapper = document.getElementById('preview-wrapper');
      const placeholder = document.getElementById('preview-placeholder');

      reader.onload = function () {
         preview.src = reader.result;
         wrapper.classList.remove('hidden');
         placeholder.classList.add('hidden');
      };

      reader.readAsDataURL(file);
   }
</script>