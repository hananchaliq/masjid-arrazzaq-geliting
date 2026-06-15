import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowLeftLine, RiUploadCloud2Line, RiCloseLine, RiImageLine, RiFileInfoLine, RiInformationLine, RiCheckboxCircleLine, RiLoader4Line } from "react-icons/ri";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import Swal from "sweetalert2";

// =============================================================
// KONFIGURASI CLOUDINARY
// =============================================================
const CLOUDINARY_CLOUD_NAME = "dj8ml3mjv";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";
// =============================================================

export default function TambahBerita() {
   const navigate = useNavigate();

   // State Form Data
   const [judul, setJudul] = useState("");
   const [isiBerita, setIsiBerita] = useState("");
   const [gambarFile, setGambarFile] = useState(null);

   // State UI & Loading
   const [previewSrc, setPreviewSrc] = useState("");
   const [fileName, setFileName] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [uploadProgress, setUploadProgress] = useState(0);

   // Mengambil nama admin aktif dari local storage
   const adminNama = localStorage.getItem("admin_nama") || "Admin Masjid";

   // Fungsi pembantu untuk kembali ke halaman utama manajemen berita
   const handleBack = () => navigate("/admin/berita");

   // Handler Preview Gambar & Validasi
   const handleImageChange = e => {
      const file = e.target.files[0];
      if (!file) return;

      // Validasi Ukuran (Maksimal 2MB)
      if (file.size > 2 * 1024 * 1024) {
         Swal.fire({
            title: "Ukuran File Terlalu Besar",
            text: "Maksimal ukuran file gambar adalah 2MB.",
            icon: "error",
            background: "#18181b",
            color: "#ef4444",
            confirmButtonColor: "#3f3f46",
         });
         return;
      }

      setGambarFile(file);
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = () => {
         setPreviewSrc(reader.result);
      };
      reader.readAsDataURL(file);
   };

   // Handler Kirim Data (Publish Berita)
   const handleSubmit = async e => {
      e.preventDefault();

      // Validasi wajib isi untuk data utama
      if (!judul.trim() || !isiBerita.trim()) return;
      if (!gambarFile) {
         Swal.fire({
            title: "Gambar Wajib Diisi",
            text: "Silakan pilih media utama/thumbnail terlebih dahulu.",
            icon: "warning",
            background: "#18181b",
            color: "#facc15",
            confirmButtonColor: "#3f3f46",
         });
         return;
      }

      setIsSubmitting(true);

      try {
         let downloadURL = "";
         let cloudinaryId = ""; // Variabel penampung ID unik Cloudinary

         // 1. Proses Unggah Gambar ke Cloudinary via XMLHttpRequest
         await new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", gambarFile);
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            formData.append("folder", "news");

            const xhr = new XMLHttpRequest();

            // Pantau progress upload byte per byte
            xhr.upload.addEventListener("progress", event => {
               if (event.lengthComputable) {
                  const progress = Math.round((event.loaded / event.total) * 100);
                  setUploadProgress(progress);
               }
            });

            xhr.addEventListener("load", () => {
               const response = JSON.parse(xhr.responseText);
               if (xhr.status === 200) {
                  downloadURL = response.secure_url;
                  cloudinaryId = response.public_id; // <-- Berhasil dapet public_id (misal: 'news/a8sh7d...')
                  resolve();
               } else {
                  const errMsg = response.error?.message || `Status: ${xhr.status}`;
                  reject(new Error(`Cloudinary Error: ${errMsg}`));
               }
            });

            xhr.addEventListener("error", () => {
               reject(new Error("Koneksi terputus saat upload ke Cloudinary."));
            });

            xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
            xhr.send(formData);
         });

         // 2. Simpan Dokumen Baru ke Firestore Collection "berita"
         await addDoc(collection(db, "berita"), {
            judul: judul.trim(),
            isi_berita: isiBerita.trim(),
            gambar: downloadURL,
            cloudinary_id: cloudinaryId, // <-- Titip ID ini di Firestore biar Cloud Functions bisa baca
            penulis: adminNama,
            tanggal: new Date().toISOString(),
         });

         // 3. Notifikasi Sukses Berhasil
         await Swal.fire({
            title: "Berhasil!",
            text: "Berita baru telah sukses dipublikasikan.",
            icon: "success",
            background: "#18181b",
            color: "#facc15",
            confirmButtonColor: "#eab308",
         });

         // 4. Alihkan kembali ke halaman tabel berita
         handleBack();
      } catch (error) {
         console.error("Error publishing news:", error);
         Swal.fire({
            title: "Gagal!",
            text: error.message || "Terjadi kesalahan saat memproses data ke cloud server.",
            icon: "error",
            background: "#18181b",
            color: "#ef4444",
            confirmButtonColor: "#3f3f46",
         });
      } finally {
         setIsSubmitting(false);
         setUploadProgress(0);
      }
   };

   return (
      <div className="p-4 lg:p-6 max-w-[1500px] mx-auto bg-black text-zinc-200 min-h-screen">
         {/* HEADER */}
         <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
               <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  <button onClick={handleBack} className="hover:text-white transition">
                     Publikasi
                  </button>
                  <span className="text-zinc-700">/</span>
                  <span className="text-xs text-zinc-400 normal-case font-normal">Tambah Berita</span>
               </div>

               <h1 className="text-2xl font-bold tracking-tight text-white">Pusat Publikasi Berita</h1>
               <p className="text-sm text-zinc-500 mt-1">Buat dan publikasikan informasi terbaru untuk jama'ah</p>
            </div>

            <button onClick={handleBack} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 w-fit">
               <RiArrowLeftLine />
               <span>Kembali</span>
            </button>
         </div>

         {/* GRID */}
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* FORM CONTAINER */}
            <div className="xl:col-span-2">
               <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* JUDUL */}
                  <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-5 sm:p-6">
                     <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-4">Judul Berita</label>
                     <input type="text" value={judul} onChange={e => setJudul(e.target.value)} required placeholder="Tuliskan judul berita..." className="w-full px-4 py-3 bg-[#000] border border-[#1f1f1f] rounded-xl text-white text-lg font-semibold tracking-tight outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all duration-300" />
                  </div>

                  {/* ISI KONTEN */}
                  <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-5 sm:p-6">
                     <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-4">Isi Konten</label>
                     <textarea value={isiBerita} onChange={e => setIsiBerita(e.target.value)} required placeholder="Mulai menulis isi berita..." className="w-full px-4 py-3 min-h-[200px] bg-[#000] border border-[#1f1f1f] rounded-xl text-white text-sm leading-relaxed outline-none resize-y focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all duration-300"></textarea>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                     <button type="submit" disabled={isSubmitting} className="bg-yellow-500 text-black px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(234,179,8,0.2)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? (
                           <>
                              <RiLoader4Line className="animate-spin text-lg" />
                              <span>Publishing ({uploadProgress}%)</span>
                           </>
                        ) : (
                           <>
                              <RiUploadCloud2Line className="text-lg" />
                              <span>Publish Berita</span>
                           </>
                        )}
                     </button>

                     <button type="button" onClick={handleBack} className="border border-[#1f1f1f] text-zinc-400 hover:text-white hover:border-zinc-700 px-6 py-3 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-transparent">
                        <RiCloseLine className="text-lg" />
                        <span>Batal</span>
                     </button>
                  </div>
               </form>
            </div>

            {/* SIDEBAR CONTAINER */}
            <div className="space-y-6">
               {/* UPLOAD THUMBNAIL */}
               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-5">
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Media Utama</p>
                        <p className="text-xs text-zinc-500 mt-1">Upload thumbnail berita</p>
                     </div>
                     <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-yellow-500/20 flex items-center justify-center">
                        <RiImageLine className="text-yellow-400 text-lg" />
                     </div>
                  </div>

                  <div className="relative group">
                     <div className="border-2 border-dashed border-[#1f1f1f] rounded-2xl p-6 text-center transition-all duration-300 hover:border-yellow-500/30 bg-[#000]">
                        {/* PLACEHOLDER */}
                        {!previewSrc && (
                           <div>
                              <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-950 border border-[#1f1f1f] flex items-center justify-center mb-4">
                                 <RiUploadCloud2Line className="text-2xl text-zinc-600" />
                              </div>
                              <p className="text-sm text-zinc-300 font-medium">Upload Gambar</p>
                              <p className="text-xs text-zinc-500 mt-1">JPG, PNG, WEBP</p>
                           </div>
                        )}

                        {/* PREVIEW */}
                        {previewSrc && (
                           <div>
                              <img src={previewSrc} alt="Preview" className="w-full h-52 object-cover rounded-xl border border-[#1f1f1f] mb-3" />
                              <p className="text-[10px] text-yellow-500 font-mono truncate">{fileName || "Gambar terpilih"}</p>
                           </div>
                        )}

                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                     </div>
                  </div>

                  {/* INFO FILE */}
                  <div className="space-y-2 mt-5">
                     <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <RiInformationLine />
                        <span>Maksimal ukuran 2MB</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <RiCheckboxCircleLine />
                        <span>Format JPG, PNG, WEBP</span>
                     </div>
                  </div>
               </div>

               {/* METADATA INFO */}
               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-5">
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Informasi Publikasi</p>
                        <p className="text-xs text-zinc-500 mt-1">Metadata berita</p>
                     </div>
                     <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-blue-500/20 flex items-center justify-center">
                        <RiFileInfoLine className="text-blue-400 text-lg" />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Penulis</span>
                        <span className="text-sm text-white font-medium">{adminNama}</span>
                     </div>

                     <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Status</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/20 font-semibold tracking-wide">READY TO FLY</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
