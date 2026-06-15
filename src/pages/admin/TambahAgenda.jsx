import React, { useState } from "react";
import { RiArrowLeftLine, RiErrorWarningLine, RiCalendarEventLine, RiText, RiCalendarLine, RiCalendarCheckLine, RiMapPinLine, RiSaveLine, RiCloseLine, RiInformationLine, RiLightbulbLine, RiCheckboxCircleLine } from "react-icons/ri";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase"; // Sesuaikan dengan konfigurasi Firebase Anda
import Swal from "sweetalert2";

export default function TambahAgenda() {
   // State Form
   const [judul, setJudul] = useState("");
   const [deskripsi, setDeskripsi] = useState("");
   const [tanggalMulai, setTanggalMulai] = useState("");
   const [tanggalSelesai, setTanggalSelesai] = useState("");
   const [lokasi, setLokasi] = useState("");

   // State UI
   const [error, setError] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);

   // Mengambil nama admin (bisa disesuaikan dengan Auth context Anda nanti)
   const adminNama = localStorage.getItem("admin_nama") || "Administrator";

   const handleSubmit = async e => {
      e.preventDefault();
      setError("");
      setIsSubmitting(true);

      // Validasi Sederhana
      if (!judul || !tanggalMulai) {
         setError("Judul kegiatan dan Tanggal Mulai wajib diisi!");
         setIsSubmitting(false);
         return;
      }

      try {
         // Simpan data ke Firestore di dalam collection 'agenda'
         await addDoc(collection(db, "agenda"), {
            judul,
            deskripsi,
            tanggal_mulai: tanggalMulai, // Format string standard dari input datetime-local
            tanggal_selesai: tanggalSelesai || null,
            lokasi: lokasi || null,
            created_at: new Date().toISOString(),
            created_by: adminNama,
         });

         // SweetAlert Sukses
         Swal.fire({
            title: "Berhasil!",
            text: "Data agenda kegiatan berhasil ditambahkan.",
            icon: "success",
            background: "#18181b",
            color: "#facc15",
            confirmButtonColor: "#eab308",
         }).then(() => {
            // Redirect ke halaman agenda utama
            window.location.href = "/admin/agenda";
         });
      } catch (err) {
         console.error("Error adding document: ", err);
         setError("Gagal menyimpan data agenda ke database cloud.");
         setIsSubmitting(false);
      }
   };

   return (
      <div className="p-4 lg:p-6 max-w-[1500px] mx-auto bg-black text-zinc-200 min-h-screen">
         {/* HEADER */}
         <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
               <div className="flex items-center gap-2 mb-2 text-xs">
                  <a href="/agenda" className="text-[#a1a1a1] font-semibold uppercase tracking-wider hover:text-white transition">
                     Kegiatan
                  </a>
                  <span className="text-zinc-700">/</span>
                  <span className="text-zinc-400">Tambah Agenda</span>
               </div>
               <h1 className="text-2xl font-bold tracking-tight text-white">Tambah Agenda Kegiatan</h1>
               <p className="text-sm text-zinc-500 mt-1">Tambahkan kegiatan atau acara masjid baru</p>
            </div>

            <a href="/agenda" className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 w-fit">
               <RiArrowLeftLine />
               <span>Kembali</span>
            </a>
         </div>

         {/* ERROR DISPLAY */}
         {error && (
            <div className="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300">
               <div className="flex items-center gap-3">
                  <RiErrorWarningLine className="text-lg text-red-400" />
                  <span className="text-sm">{error}</span>
               </div>
            </div>
         )}

         {/* GRID LAYOUT */}
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* FORM SIDE */}
            <div className="xl:col-span-2">
               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                     <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Form Agenda</p>
                        <p className="text-xs text-zinc-500 mt-1">Isi data kegiatan dengan lengkap</p>
                     </div>
                     <div className="w-11 h-11 rounded-xl bg-zinc-950 border border-yellow-500/20 flex items-center justify-center">
                        <RiCalendarEventLine className="text-yellow-400 text-xl" />
                     </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                     {/* JUDUL */}
                     <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-3">Judul Kegiatan</label>
                        <div className="relative">
                           <RiText className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-lg" />
                           <input type="text" required value={judul} onChange={e => setJudul(e.target.value)} placeholder="Masukkan judul kegiatan" className="w-full pl-12 pr-4 py-3 bg-[#050505] border border-[#1f1f1f] rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-yellow-500 transition-all duration-300" />
                        </div>
                     </div>

                     {/* DESKRIPSI */}
                     <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-3">Deskripsi</label>
                        <textarea rows="5" value={deskripsi} onChange={e => setDeskripsi(e.target.value)} placeholder="Masukkan deskripsi kegiatan..." className="w-full px-4 py-3 bg-[#050505] border border-[#1f1f1f] rounded-xl text-white placeholder:text-zinc-600 outline-none resize-none focus:border-yellow-500 transition-all duration-300"></textarea>
                     </div>

                     {/* DUA KOLOM TANGGAL */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* TANGGAL MULAI */}
                        <div>
                           <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-3">Tanggal Mulai</label>
                           <div className="relative">
                              <RiCalendarLine className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 z-10 text-lg" />
                              <input type="datetime-local" required value={tanggalMulai} onChange={e => setTanggalMulai(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-[#050505] border border-[#1f1f1f] rounded-xl text-white outline-none focus:border-yellow-500 transition-all duration-300 [color-scheme:dark]" />
                           </div>
                        </div>

                        {/* TANGGAL SELESAI */}
                        <div>
                           <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-3">Tanggal Selesai</label>
                           <div className="relative">
                              <RiCalendarCheckLine className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 z-10 text-lg" />
                              <input type="datetime-local" value={tanggalSelesai} onChange={e => setTanggalSelesai(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-[#050505] border border-[#1f1f1f] rounded-xl text-white outline-none focus:border-yellow-500 transition-all duration-300 [color-scheme:dark]" />
                           </div>
                        </div>
                     </div>

                     {/* LOKASI */}
                     <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-3">Lokasi</label>
                        <div className="relative">
                           <RiMapPinLine className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-lg" />
                           <input type="text" value={lokasi} onChange={e => setLokasi(e.target.value)} placeholder="Masukkan lokasi kegiatan" className="w-full pl-12 pr-4 py-3 bg-[#050505] border border-[#1f1f1f] rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-yellow-500 transition-all duration-300" />
                        </div>
                     </div>

                     {/* ACTION BUTTONS */}
                     <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button type="submit" disabled={isSubmitting} className="bg-yellow-500 text-black px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(234,179,8,0.2)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100">
                           <RiSaveLine className="text-lg" />
                           <span>{isSubmitting ? "Menyimpan..." : "Simpan Agenda"}</span>
                        </button>

                        <a href="/agenda" className="border border-[#1f1f1f] text-zinc-400 hover:text-white hover:border-zinc-700 px-6 py-3 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2">
                           <RiCloseLine className="text-lg" />
                           <span>Batal</span>
                        </a>
                     </div>
                  </form>
               </div>
            </div>

            {/* SIDEBAR INFO */}
            <div className="space-y-6">
               {/* INFORMASI AGENDA */}
               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-5">
                     <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Informasi Agenda</p>
                        <p className="text-xs text-zinc-500 mt-1">Ringkasan input kegiatan</p>
                     </div>
                     <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                        <RiInformationLine className="text-zinc-300 text-lg" />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Status</span>
                        <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-md border border-yellow-500/20 font-semibold tracking-wide">DRAFT</span>
                     </div>

                     <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Admin</span>
                        <span className="text-sm text-white font-medium">{adminNama}</span>
                     </div>

                     <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Sistem</span>
                        <span className="text-sm text-zinc-300">Aktif</span>
                     </div>
                  </div>
               </div>

               {/* CATATAN */}
               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                        <RiLightbulbLine className="text-zinc-300 text-lg" />
                     </div>
                     <div>
                        <p className="text-sm font-semibold text-white">Catatan</p>
                        <p className="text-xs text-zinc-500">Pastikan data agenda valid</p>
                     </div>
                  </div>

                  <ul className="space-y-3 text-sm text-zinc-500">
                     <li className="flex gap-2">
                        <RiCheckboxCircleLine className="text-zinc-400 mt-0.5 shrink-0 text-base" />
                        <span>Gunakan judul kegiatan yang jelas</span>
                     </li>
                     <li className="flex gap-2">
                        <RiCheckboxCircleLine className="text-zinc-400 mt-0.5 shrink-0 text-base" />
                        <span>Pastikan tanggal kegiatan benar</span>
                     </li>
                     <li className="flex gap-2">
                        <RiCheckboxCircleLine className="text-zinc-400 mt-0.5 shrink-0 text-base" />
                        <span>Tambahkan lokasi bila diperlukan</span>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
   );
}
