import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // 1. Tambahkan useNavigate di sini
import { RiArrowLeftLine, RiUploadCloud2Line, RiCloseLine, RiImageLine, RiFileInfoLine, RiInformationLine, RiCheckboxCircleLine, RiLoader4Line } from "react-icons/ri";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import Swal from "sweetalert2";

const CLOUDINARY_CLOUD_NAME = "dj8ml3mjv";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

export default function EditBerita() {
   // 2. Hapus prop { setPage } karena sudah tidak dipakai
   const { id } = useParams();
   const navigate = useNavigate(); // 3. Inisialisasi hook navigate
   const idBerita = id;

   // State Form Data
   const [judul, setJudul] = useState("");
   const [isiBerita, setIsiBerita] = useState("");
   const [gambarFile, setGambarFile] = useState(null);

   // State UI & Loading
   const [previewSrc, setPreviewSrc] = useState("");
   const [fileName, setFileName] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [uploadProgress, setUploadProgress] = useState(0);
   const [isFetching, setIsFetching] = useState(true);

   const [oldImageUrl, setOldImageUrl] = useState("");
   const [adminNama, setAdminNama] = useState("Admin Masjid");

   // 4. Ubah fungsi handleBack untuk navigasi ke /admin/berita
   const handleBack = () => navigate("/admin/berita");

   // 1. Ambil Data Berita yang Akan Diedit Berdasarkan ID
   useEffect(() => {
      const fetchBerita = async () => {
         if (!idBerita) {
            await Swal.fire({ title: "ID Tidak Ditemukan", text: "Parameter berita bermasalah.", icon: "error", background: "#18181b", color: "#ef4444" });
            handleBack();
            return;
         }

         try {
            const docRef = doc(db, "berita", idBerita);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
               const data = docSnap.data();
               setJudul(data.judul || "");
               setIsiBerita(data.isi_berita || "");
               setAdminNama(data.penulis || "Admin Masjid");

               if (data.gambar) {
                  setOldImageUrl(data.gambar);
                  setPreviewSrc(data.gambar);
                  setFileName("Arsip_Gambar_Aktif.png");
               }
            } else {
               await Swal.fire({ title: "Data Hilang", text: "Artikel berita tidak ditemukan di cloud.", icon: "error", background: "#18181b", color: "#ef4444" });
               handleBack();
            }
         } catch (error) {
            console.error("Error fetching news:", error);
            Swal.fire({ title: "Gagal Memuat", text: "Terjadi gangguan koneksi ke cloud.", icon: "error", background: "#18181b", color: "#ef4444" });
         } finally {
            setIsFetching(false);
         }
      };

      fetchBerita();
   }, [idBerita]);

   // Handler Preview Gambar Baru jika Diganti
   const handleImageChange = e => {
      const file = e.target.files[0];
      if (!file) return;

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

   // Handler Simpan Perubahan Data (Update Berita)
   const handleSubmit = async e => {
      e.preventDefault();
      if (!judul.trim() || !isiBerita.trim()) return;

      setIsSubmitting(true);

      try {
         let finalDownloadURL = oldImageUrl;

         if (gambarFile) {
            await new Promise((resolve, reject) => {
               const formData = new FormData();
               formData.append("file", gambarFile);
               formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
               formData.append("folder", "news");

               // TIMPA GAMBAR LAMA: Gunakan ID Berita sebagai Public ID di Cloudinary
               // Ini akan otomatis menggantikan file lama tanpa perlu memanggil fungsi delete eksplisit
               formData.append("public_id", idBerita);

               const xhr = new XMLHttpRequest();

               xhr.upload.addEventListener("progress", event => {
                  if (event.lengthComputable) {
                     const progress = Math.round((event.loaded / event.total) * 100);
                     setUploadProgress(progress);
                  }
               });

               xhr.addEventListener("load", () => {
                  const response = JSON.parse(xhr.responseText);
                  if (xhr.status === 200) {
                     // Tambahkan timestamp unik di akhir URL agar browser tidak melakukan caching gambar lama
                     finalDownloadURL = `${response.secure_url}?t=${new Date().getTime()}`;
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
         }

         const docRef = doc(db, "berita", idBerita);
         await updateDoc(docRef, {
            judul: judul.trim(),
            isi_berita: isiBerita.trim(),
            gambar: finalDownloadURL,
            penulis: adminNama,
            updated_at: new Date().toISOString(),
         });

         await Swal.fire({
            title: "Berhasil Diperbarui!",
            text: "Perubahan berita telah sukses disimpan ke sistem.",
            icon: "success",
            background: "#18181b",
            color: "#facc15",
            confirmButtonColor: "#eab308",
         });

         handleBack();
      } catch (error) {
         console.error("Error updating news:", error);
         Swal.fire({
            title: "Gagal!",
            text: error.message || "Terjadi kesalahan saat memperbarui data.",
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

   if (isFetching) {
      return (
         <div className="p-4 lg:p-6 max-w-[1500px] mx-auto bg-black text-zinc-200 min-h-screen flex flex-col items-center justify-center gap-3">
            <RiLoader4Line className="animate-spin text-3xl text-yellow-500" />
            <p className="text-sm text-zinc-500">Menarik arsip data berita dari cloud...</p>
         </div>
      );
   }

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
                  <span className="text-xs text-zinc-400">Edit Berita</span>
               </div>

               <h1 className="text-2xl font-bold tracking-tight text-white">Edit Artikel Berita</h1>
               <p className="text-sm text-zinc-500 mt-1">Perbarui informasi warta jemaah atau dokumentasi kegiatan</p>
            </div>

            <button onClick={handleBack} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 w-fit">
               <RiArrowLeftLine />
               <span>Kembali</span>
            </button>
         </div>

         {/* GRID FORM */}
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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
                              <span>Menyimpan Perubahan ({uploadProgress}%)</span>
                           </>
                        ) : (
                           <>
                              <RiUploadCloud2Line className="text-lg" />
                              <span>Simpan Perubahan</span>
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
               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-5">
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Media Utama</p>
                        <p className="text-xs text-zinc-500 mt-1">Ganti atau pertahankan gambar</p>
                     </div>
                     <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-yellow-500/20 flex items-center justify-center">
                        <RiImageLine className="text-yellow-400 text-lg" />
                     </div>
                  </div>

                  <div className="relative group">
                     <div className="border-2 border-dashed border-[#1f1f1f] rounded-2xl p-6 text-center transition-all duration-300 hover:border-yellow-500/30 bg-[#000]">
                        {!previewSrc && (
                           <div>
                              <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-950 border border-[#1f1f1f] flex items-center justify-center mb-4">
                                 <RiUploadCloud2Line className="text-2xl text-zinc-600" />
                              </div>
                              <p className="text-sm text-zinc-300 font-medium">Ganti Gambar</p>
                              <p className="text-xs text-zinc-500 mt-1">JPG, PNG, WEBP</p>
                           </div>
                        )}

                        {previewSrc && (
                           <div>
                              <img src={previewSrc} alt="Preview Berita" className="w-full h-52 object-cover rounded-xl border border-[#1f1f1f] mb-3" />
                              <p className="text-[10px] text-yellow-500 font-mono truncate">{fileName || "Gambar Aktif"}</p>
                           </div>
                        )}

                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                     </div>
                  </div>

                  <div className="space-y-2 mt-5">
                     <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <RiInformationLine />
                        <span>Biarkan jika tidak ingin mengganti gambar</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <RiCheckboxCircleLine />
                        <span>Maksimal ukuran file 2MB</span>
                     </div>
                  </div>
               </div>

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
                        <span className="text-sm text-zinc-500">Penulis Original</span>
                        <span className="text-sm text-white font-medium">{adminNama}</span>
                     </div>

                     <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Status Modul</span>
                        <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-md border border-yellow-500/20 font-semibold tracking-wide">EDIT MODE</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
