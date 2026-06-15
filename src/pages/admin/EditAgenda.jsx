import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { RiArrowLeftLine, RiCalendarEventLine, RiText, RiCalendarLine, RiCalendarCheckLine, RiMapPinLine, RiSaveLine, RiCloseLine, RiInformationLine, RiLightbulbLine, RiCheckboxCircleLine, RiErrorWarningLine, RiLoader4Line } from "react-icons/ri";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import Swal from "sweetalert2";

export default function EditAgenda() {
   // Mengambil ID dinamis dari URL (/agenda/edit/:id)
   const { id } = useParams();
   const navigate = useNavigate();

   // State Form Data
   const [judul, setJudul] = useState("");
   const [deskripsi, setDeskripsi] = useState("");
   const [tanggalMulai, setTanggalMulai] = useState("");
   const [tanggalSelesai, setTanggalSelesai] = useState("");
   const [lokasi, setLokasi] = useState("");

   // State UI Management
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   // Mengambil nama admin aktif dari session
   const adminNama = localStorage.getItem("admin_nama") || "Admin Masjid";

   // Ambil data agenda dari Firestore berdasarkan ID saat komponen dimuat
   useEffect(() => {
      const fetchAgendaData = async () => {
         if (!id) {
            setErrorMessage("ID Agenda tidak valid.");
            setIsLoading(false);
            return;
         }

         try {
            const docRef = doc(db, "agenda", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
               const data = docSnap.data();
               setJudul(data.judul || "");
               setDeskripsi(data.deskripsi || "");
               setTanggalMulai(data.tanggal_mulai || "");
               setTanggalSelesai(data.tanggal_selesai || "");
               setLokasi(data.lokasi || "");
            } else {
               setErrorMessage("Data agenda tidak ditemukan di database.");
            }
         } catch (error) {
            console.error("Error fetching agenda doc: ", error);
            setErrorMessage("Gagal mengambil data dari server.");
         } finally {
            setIsLoading(false);
         }
      };

      fetchAgendaData();
   }, [id]);

   // Handler Kirim Perubahan (Update)
   const handleSubmit = async e => {
      e.preventDefault();

      // Validasi kolom wajib (tanggal_selesai opsional)
      if (!judul || !tanggalMulai) {
         setErrorMessage("Kolom Judul Kegiatan dan Tanggal Mulai wajib diisi.");
         return;
      }

      setIsSubmitting(true);
      setErrorMessage("");

      try {
         const docRef = doc(db, "agenda", id);

         // Update dokumen di Firestore
         await updateDoc(docRef, {
            judul: judul,
            deskripsi: deskripsi,
            tanggal_mulai: tanggalMulai,
            tanggal_selesai: tanggalSelesai, // Bisa string kosong jika tidak diisi
            lokasi: lokasi,
            updated_at: new Date().toISOString(),
         });

         // Notifikasi Sukses menggunakan SweetAlert2
         Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Perubahan data agenda berhasil disimpan",
            showConfirmButton: false,
            timer: 2200,
            timerProgressBar: true,
            background: "#0a0a0a",
            color: "#fff",
            iconColor: "#eab308",
            customClass: {
               popup: "border border-[#1f1f1f]",
            },
         });

         // Redirect kembali ke halaman list agenda
         navigate("/admin/agenda");
      } catch (error) {
         console.error("Error updating agenda doc: ", error);
         setErrorMessage("Terjadi kesalahan saat menyimpan perubahan.");
      } finally {
         setIsSubmitting(false);
      }
   };

   if (isLoading) {
      return (
         <div className="p-4 lg:p-6 max-w-[1500px] mx-auto min-h-[50vh] flex flex-col items-center justify-center gap-3">
            <RiLoader4Line className="animate-spin text-3xl text-yellow-500" />
            <p className="text-sm text-zinc-500">Memuat data agenda...</p>
         </div>
      );
   }

   return (
      <div className="p-4 lg:p-6 max-w-[1500px] mx-auto text-zinc-200">
         {/* HEADER */}
         <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
               <div className="flex items-center gap-2 mb-2">
                  <Link to="/admin/agenda" className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 hover:text-white transition">
                     Kegiatan
                  </Link>
                  <span className="text-zinc-700">/</span>
                  <span className="text-xs text-zinc-400">Edit Agenda</span>
               </div>

               <h1 className="text-2xl font-bold tracking-tight text-white">Edit Agenda Kegiatan</h1>
               <p className="text-sm text-zinc-500 mt-1">Perbarui data kegiatan dan jadwal agenda masjid</p>
            </div>

            <button onClick={() => navigate("/admin/agenda")} className="bg-transparent border border-[#1f1f1f] rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 w-fit">
               <RiArrowLeftLine />
               Kembali
            </button>
         </div>

         {/* ERROR MESSAGE BAR */}
         {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300">
               <div className="flex items-center gap-3">
                  <RiErrorWarningLine className="text-lg" />
                  <span className="text-sm">{errorMessage}</span>
               </div>
            </div>
         )}

         {/* GRID */}
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* FORM CONTAINER */}
            <div className="xl:col-span-2">
               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">Form Agenda</p>
                        <p className="text-xs text-zinc-500 mt-1">Edit data agenda dengan benar</p>
                     </div>

                     <div className="w-11 h-11 rounded-xl bg-zinc-950 border border-yellow-500/20 flex items-center justify-center">
                        <RiCalendarEventLine className="text-yellow-400 text-xl" />
                     </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                     {/* JUDUL KEGIATAN */}
                     <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 block mb-3">Judul Kegiatan</label>
                        <div className="relative">
                           <RiText className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                           <input type="text" required value={judul} onChange={e => setJudul(e.target.value)} placeholder="Masukkan judul kegiatan" className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-yellow-500 transition-all duration-300" />
                        </div>
                     </div>

                     {/* DESKRIPSI */}
                     <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 block mb-3">Deskripsi</label>
                        <textarea rows="5" value={deskripsi} onChange={e => setDeskripsi(e.target.value)} placeholder="Masukkan deskripsi kegiatan..." className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white placeholder:text-zinc-600 outline-none resize-none focus:border-yellow-500 transition-all duration-300"></textarea>
                     </div>

                     {/* DATES GRID */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* TANGGAL MULAI */}
                        <div>
                           <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 block mb-3">Tanggal Mulai</label>
                           <div className="relative">
                              <RiCalendarLine className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 z-10" />
                              {/* Menggunakan datetime-local bawaan browser dengan styling serasi */}
                              <input type="datetime-local" required value={tanggalMulai} onChange={e => setTanggalMulai(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white outline-none focus:border-yellow-500 transition-all duration-300 colorscheme-dark" />
                           </div>
                        </div>

                        {/* TANGGAL SELESAI */}
                        <div>
                           <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 block mb-3">Tanggal Selesai</label>
                           <div className="relative">
                              <RiCalendarCheckLine className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 z-10" />
                              <input type="datetime-local" value={tanggalSelesai} onChange={e => setTanggalSelesai(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white outline-none focus:border-yellow-500 transition-all duration-300 colorscheme-dark" />
                           </div>
                           <p className="text-xs text-zinc-500 mt-2">Kosongkan jika kegiatan hanya berlangsung satu hari</p>
                        </div>
                     </div>

                     {/* LOKASI */}
                     <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 block mb-3">Lokasi</label>
                        <div className="relative">
                           <RiMapPinLine className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                           <input type="text" value={lokasi} onChange={e => setLokasi(e.target.value)} placeholder="Masukkan lokasi kegiatan" className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-yellow-500 transition-all duration-300" />
                        </div>
                     </div>

                     {/* SUBMIT BUTTONS */}
                     <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button type="submit" disabled={isSubmitting} className="bg-yellow-500 text-black px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(234,179,8,0.2)] flex items-center justify-center gap-2 disabled:opacity-50">
                           {isSubmitting ? <RiLoader4Line className="animate-spin text-lg" /> : <RiSaveLine className="text-lg" />}
                           <span>Simpan Perubahan</span>
                        </button>

                        <button type="button" onClick={() => navigate("/admin/agenda")} className="border border-[#1f1f1f] text-zinc-400 hover:text-white hover:border-zinc-700 px-6 py-3 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-transparent">
                           <RiCloseLine className="text-lg" />
                           <span>Batal</span>
                        </button>
                     </div>
                  </form>
               </div>
            </div>

            {/* SIDEBAR CONTAINER */}
            <div className="space-y-6">
               {/* INFO SUMMARY */}
               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-5">
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">Informasi Agenda</p>
                        <p className="text-xs text-zinc-500 mt-1">Ringkasan data agenda</p>
                     </div>
                     <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                        <RiInformationLine className="text-zinc-300 text-lg" />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Status</span>
                        <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-md border border-yellow-500/20 font-semibold tracking-wide">SEDANG DIEDIT</span>
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

               {/* TIPS SIDEBAR */}
               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                        <RiLightbulbLine className="text-zinc-300" />
                     </div>
                     <div>
                        <p className="text-sm font-semibold text-white">Catatan</p>
                        <p className="text-xs text-zinc-500">Pastikan agenda valid</p>
                     </div>
                  </div>

                  <ul className="space-y-3 text-sm text-zinc-500">
                     <li className="flex gap-2">
                        <RiCheckboxCircleLine className="text-zinc-400 mt-0.5 flex-shrink-0" />
                        <span>Gunakan judul yang jelas dan singkat</span>
                     </li>
                     <li className="flex gap-2">
                        <RiCheckboxCircleLine className="text-zinc-400 mt-0.5 flex-shrink-0" />
                        <span>Pastikan jadwal agenda sudah benar</span>
                     </li>
                     <li className="flex gap-2">
                        <RiCheckboxCircleLine className="text-zinc-400 mt-0.5 flex-shrink-0" />
                        <span>Isi lokasi dengan benar dan jelas</span>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
   );
}
