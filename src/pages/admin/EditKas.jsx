import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Menggunakan tools navigasi React Router
import { RiArrowLeftLine, RiEdit2Line, RiCalendarLine, RiExchangeFundsLine, RiSaveLine, RiCloseLine, RiFileEditLine, RiLightbulbLine, RiCheckboxCircleLine, RiErrorWarningLine, RiLoader4Line } from "react-icons/ri";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import Swal from "sweetalert2";

export default function EditKas() {
   // Mengambil ID parameter dinamis dari URL (/kas/edit/:id)
   const { id } = useParams();
   const navigate = useNavigate();

   // State Form Data
   const [tanggal, setTanggal] = useState("");
   const [jenis, setJenis] = useState("masuk");
   const [keterangan, setKeterangan] = useState("");
   const [jumlah, setJumlah] = useState("");

   // State UI Management
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   // Mengambil nama admin aktif dari local session / context
   const adminNama = localStorage.getItem("admin_nama") || "Admin Keuangan";

   // Ambil data kas dari Firestore berdasarkan id dari useParams saat komponen dimuat
   useEffect(() => {
      const fetchKasData = async () => {
         if (!id) {
            setErrorMessage("ID Data tidak valid.");
            setIsLoading(false);
            return;
         }

         try {
            const docRef = doc(db, "kas", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
               const data = docSnap.data();
               setTanggal(data.tanggal || "");
               setJenis(data.jenis || "masuk");
               setKeterangan(data.keterangan || "");
               setJumlah(data.jumlah || "");
            } else {
               setErrorMessage("Data transaksi tidak ditemukan di database.");
            }
         } catch (error) {
            console.error("Error fetching doc: ", error);
            setErrorMessage("Gagal mengambil data dari server.");
         } finally {
            setIsLoading(false);
         }
      };

      fetchKasData();
   }, [id]);

   // Handler Kirim Perubahan (Update)
   const handleSubmit = async e => {
      e.preventDefault();
      if (!tanggal || !jenis || !keterangan || !jumlah) {
         setErrorMessage("Semua kolom formulir wajib diisi.");
         return;
      }

      setIsSubmitting(true);
      setErrorMessage("");

      try {
         const docRef = doc(db, "kas", id);

         // Update dokumen di Firestore
         await updateDoc(docRef, {
            tanggal: tanggal,
            jenis: jenis,
            keterangan: keterangan,
            jumlah: Number(jumlah),
            updated_at: new Date().toISOString(),
         });

         // Notifikasi Toast Berhasil menggunakan SweetAlert2
         Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Perubahan data kas berhasil disimpan",
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

         // Kembali ke halaman utama list kas menggunakan react-router
         navigate("/admin/kas");
      } catch (error) {
         console.error("Error updating doc: ", error);
         setErrorMessage("Terjadi kesalahan saat menyimpan perubahan.");
      } finally {
         setIsSubmitting(false);
      }
   };

   if (isLoading) {
      return (
         <div className="p-4 lg:p-6 max-w-[1500px] mx-auto min-h-[50vh] flex flex-col items-center justify-center gap-3">
            <RiLoader4Line className="animate-spin text-3xl text-yellow-500" />
            <p className="text-sm text-zinc-500">Memuat data transaksi...</p>
         </div>
      );
   }

   return (
      <div className="p-4 lg:p-6 max-w-[1500px] mx-auto text-zinc-200">
         {/* HEADER */}
         <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
               <div className="flex items-center gap-2 mb-2">
                  <Link to="/admin/kas" className="text-[10px] font-700 uppercase tracking-[0.1em] text-zinc-500 hover:text-white transition">
                     Keuangan
                  </Link>
                  <span className="text-zinc-700">/</span>
                  <span className="text-xs text-zinc-400">Edit Data Kas</span>
               </div>

               <h1 className="text-2xl font-bold tracking-tight text-white">Edit Transaksi Kas</h1>

               <p className="text-sm text-zinc-500 mt-1">Perbarui data pemasukan atau pengeluaran kas masjid</p>
            </div>

            <button onClick={() => navigate("/admin/kas")} className="bg-transparent border border-[#1f1f1f] rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 w-fit">
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
                        <p className="text-[10px] font-700 uppercase tracking-[0.1em] text-zinc-500">Form Edit Kas</p>
                        <p className="text-xs text-zinc-500 mt-1">Perbarui data transaksi dengan benar</p>
                     </div>

                     <div className="w-11 h-11 rounded-xl bg-zinc-950 border border-yellow-500/20 flex items-center justify-center">
                        <RiEdit2Line className="text-yellow-400 text-xl" />
                     </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* TANGGAL */}
                        <div>
                           <label className="text-[10px] font-700 uppercase tracking-[0.1em] text-zinc-500 block mb-3">Tanggal</label>
                           <div className="relative">
                              <RiCalendarLine className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 z-10" />
                              <input type="date" required value={tanggal} onChange={e => setTanggal(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white outline-none focus:border-yellow-500 transition-all duration-300 colorscheme-dark" />
                           </div>
                        </div>

                        {/* JENIS TRANSAKSI */}
                        <div>
                           <label className="text-[10px] font-700 uppercase tracking-[0.1em] text-zinc-500 block mb-3">Jenis Transaksi</label>
                           <div className="relative">
                              <RiExchangeFundsLine className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                              <select value={jenis} required onChange={e => setJenis(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white outline-none focus:border-yellow-500 transition-all duration-300 appearance-none cursor-pointer">
                                 <option value="masuk" className="bg-black">
                                    Pemasukan
                                 </option>
                                 <option value="keluar" className="bg-black">
                                    Pengeluaran
                                 </option>
                              </select>
                           </div>
                        </div>
                     </div>

                     {/* KETERANGAN */}
                     <div>
                        <label className="text-[10px] font-700 uppercase tracking-[0.1em] text-zinc-500 block mb-3">Keterangan</label>
                        <textarea rows="5" value={keterangan} onChange={e => setKeterangan(e.target.value)} placeholder="Contoh: Infaq Jumat, pembelian kabel speaker, dll..." className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white placeholder:text-zinc-600 outline-none resize-none focus:border-yellow-500 transition-all duration-300"></textarea>
                     </div>

                     {/* JUMLAH */}
                     <div>
                        <label className="text-[10px] font-700 uppercase tracking-[0.1em] text-zinc-500 block mb-3">Jumlah Uang</label>
                        <div className="relative">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">Rp</span>
                           <input type="number" required min="1" value={jumlah} onChange={e => setJumlah(e.target.value)} placeholder="0" className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-yellow-500 transition-all duration-300" />
                        </div>
                     </div>

                     {/* SUBMIT BUTTONS */}
                     <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button type="submit" disabled={isSubmitting} className="bg-yellow-500 text-black px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(234,179,8,0.2)] flex items-center justify-center gap-2 disabled:opacity-50">
                           {isSubmitting ? <RiLoader4Line className="animate-spin text-lg" /> : <RiSaveLine className="text-lg" />}
                           <span>Simpan Perubahan</span>
                        </button>

                        <button type="button" onClick={() => navigate("/admin/kas")} className="border border-[#1f1f1f] text-zinc-400 hover:text-white hover:border-zinc-700 px-6 py-3 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-transparent">
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
                        <p className="text-[10px] font-700 uppercase tracking-[0.1em] text-zinc-500">Informasi Edit</p>
                        <p className="text-xs text-zinc-500 mt-1">Ringkasan perubahan data</p>
                     </div>
                     <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                        <RiFileEditLine className="text-zinc-300 text-lg" />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Status</span>
                        <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-md border border-yellow-500/20 font-semibold tracking-wide">MODE EDIT</span>
                     </div>

                     <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Admin</span>
                        <span className="text-sm text-white font-medium">{adminNama}</span>
                     </div>

                     <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Data ID</span>
                        <span className="text-sm text-zinc-300 font-mono">#{id}</span>
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
                        <p className="text-xs text-zinc-500">Pastikan perubahan benar</p>
                     </div>
                  </div>

                  <ul className="space-y-3 text-sm text-zinc-500">
                     <li className="flex gap-2">
                        <RiCheckboxCircleLine className="text-zinc-400 mt-0.5 flex-shrink-0" />
                        <span>Pastikan nominal sesuai transaksi</span>
                     </li>
                     <li className="flex gap-2">
                        <RiCheckboxCircleLine className="text-zinc-400 mt-0.5 flex-shrink-0" />
                        <span>Jangan salah pilih jenis transaksi</span>
                     </li>
                     <li className="flex gap-2">
                        <RiCheckboxCircleLine className="text-zinc-400 mt-0.5 flex-shrink-0" />
                        <span>Gunakan keterangan yang jelas</span>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
   );
}
