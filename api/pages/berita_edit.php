<?php
/**
 * Edit Data Berita
 * File: dashboard/berita_edit.php
 */

$pdo = getDBConnection();

$id = (int) $_GET['id'];

$stmt = $pdo->prepare("SELECT * FROM berita WHERE id = ?");
$stmt->execute([$id]);

$berita = $stmt->fetch();
?>

<!-- Main -->
<div class="p-4 lg:p-6 max-w-[1500px] mx-auto">

   <!-- HEADER -->
   <div class="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">

      <div>

         <div class="flex items-center gap-2 mb-2">
            <a href="index.php?page=berita" class="vercel-label">Publikasi</a>
            <span class="text-zinc-700">/</span>
            <span class="text-xs text-zinc-400">Edit Berita</span>
         </div>

         <h1 class="text-2xl font-bold tracking-tight text-white">
            Edit Publikasi Berita
         </h1>

         <p class="text-sm text-zinc-500 mt-1">
            Perbarui informasi dan media berita masjid
         </p>

      </div>

      <a href="index.php?page=berita"
         class="vercel-card px-4 py-3 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 w-fit">

         <i class="ri-arrow-left-line"></i>
         Kembali

      </a>

   </div>

   <!-- GRID -->
   <div class="grid grid-cols-1 lg:grid-cols-3 items-start gap-6">

      <!-- FORM -->
      <div class="lg:col-span-2">

         <form action="index.php?page=berita_aksi&aksi=edit&id=<?= $berita['id']; ?>" method="POST"
            enctype="multipart/form-data" id="form-edit-berita">

            <!-- hidden gambar lama -->
            <input type="hidden" name="gambar_lama" value="<?= htmlspecialchars($berita['gambar']); ?>">

            <!-- JUDUL -->
            <div class="vercel-card p-5 sm:p-6 mb-6">

               <label class="vercel-label block mb-4">Judul Berita</label>

               <input type="text" name="judul" required value="<?= htmlspecialchars($berita['judul']); ?>"
                  placeholder="Masukkan judul berita..."
                  class="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white text-lg font-semibold outline-none focus:border-yellow-500">

            </div>

            <!-- ISI -->
            <div class="vercel-card p-5 sm:p-6 mb-6">

               <label class="vercel-label block mb-4">Isi Konten</label>

               <textarea name="isi_berita" rows="14" required
                  class="w-full px-4 py-3 h-56 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white text-sm outline-none resize-none focus:border-yellow-500"><?= htmlspecialchars($berita['isi_berita']); ?></textarea>

            </div>

            <!-- BUTTON -->
            <div class="flex flex-col sm:flex-row gap-3">

               <button type="submit"
                  class="bg-yellow-500 text-black px-6 py-3 rounded-xl text-sm font-semibold hover:scale-[1.02] transition">
                  <i class="ri-save-line"></i> Simpan Perubahan
               </button>

               <a href="index.php?page=berita"
                  class="border border-[#1f1f1f] text-zinc-400 hover:text-white px-6 py-3 rounded-xl text-sm text-center">
                  Batal
               </a>

            </div>

         </form>

      </div>

      <!-- SIDEBAR -->
      <div class="space-y-6">

         <!-- MEDIA UPLOAD -->
         <div class="vercel-card p-5 sm:p-6">

            <div class="flex items-center justify-between mb-5">

               <div>
                  <p class="vercel-label">Media Berita</p>
                  <p class="text-xs text-zinc-500 mt-1">Preview & upload gambar</p>
               </div>

               <i class="ri-image-edit-line text-yellow-400 text-lg"></i>

            </div>

            <!-- PREVIEW -->
            <div class="relative rounded-2xl overflow-hidden border border-[#1f1f1f] bg-black">

               <img id="img-preview" src="../uploads/news/<?= htmlspecialchars($berita['gambar']); ?>"
                  class="w-full h-56 object-cover">

            </div>

            <!-- INPUT FILE (DI DALAM FORM SECARA LOGIK, TAPI MASIH CONNECT KE FORM UTAMA) -->
            <label
               class="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#1f1f1f] cursor-pointer text-sm text-zinc-400 hover:text-white hover:border-yellow-500/30 transition">

               <i class="ri-upload-cloud-2-line"></i>
               Ganti Gambar

               <input type="file" name="gambar" accept="image/*" onchange="previewImage(event)" class="hidden"
                  form="form-edit-berita">

            </label>

            <p class="text-xs text-zinc-500 mt-3">
               Kosongkan kalau tidak mau ganti gambar
            </p>

         </div>

         <!-- META -->
         <div class="vercel-card p-5 sm:p-6">

            <p class="vercel-label mb-4">Informasi Berita</p>

            <div class="flex justify-between text-sm mb-2">
               <span class="text-zinc-500">Penulis</span>
               <span class="text-white"><?= $_SESSION['admin_nama']; ?></span>
            </div>

            <div class="flex justify-between text-sm">
               <span class="text-zinc-500">Status</span>
               <span class="text-emerald-400 text-[10px] px-2 py-1 bg-emerald-500/10 rounded">
                  DIPUBLIKASIKAN
               </span>
            </div>

         </div>

      </div>

   </div>

</div>

<script>

   function previewImage(event) {

      const file = event.target.files[0];

      if (!file) return;

      const reader = new FileReader();
      const preview = document.getElementById('img-preview');

      reader.onload = function () {
         preview.src = reader.result;
      };

      reader.readAsDataURL(file);
   }

   // Flash Message
   <?php if ($flash): ?>

      Swal.fire({
         icon: '<?php echo $flash['type']; ?>',
         title: '<?php echo $flash['type'] === 'success' ? 'Berhasil' : 'Error'; ?>',
         text: '<?php echo $flash['message']; ?>',
         timer: 2000,
         showConfirmButton: false
      });

   <?php endif; ?>

</script>