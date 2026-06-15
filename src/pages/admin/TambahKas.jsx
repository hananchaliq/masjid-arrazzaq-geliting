import React, { useState } from "react";
import { db } from "../../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";

import { RiArrowLeftLine, RiErrorWarningLine, RiWallet3Line, RiCalendarLine, RiExchangeFundsLine, RiSaveLine, RiCloseLine, RiFileList3Line, RiLightbulbLine, RiCheckboxCircleLine } from "react-icons/ri";

export default function TambahKas() {
   const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
   const [jenis, setJenis] = useState("");
   const [keterangan, setKeterangan] = useState("");
   const [jumlah, setJumlah] = useState("");
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);

   const adminNama = localStorage.getItem("admin_nama") || "Admin Masjid";

   const handleSubmit = async e => {
      e.preventDefault();
      setError("");
      setLoading(true);

      if (!tanggal || !jenis || !keterangan || !jumlah) {
         setError("Semua kolom form wajib diisi dengan benar!");
         setLoading(false);
         return;
      }

      if (Number(jumlah) <= 0) {
         setError("Jumlah uang transaksi harus lebih besar dari 0!");
         setLoading(false);
         return;
      }

      try {
         const kasCollection = collection(db, "kas");
         await addDoc(kasCollection, {
            tanggal,
            jenis,
            keterangan,
            jumlah: Number(jumlah),
            admin: adminNama,
            created_at: serverTimestamp(),
         });

         Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Data transaksi kas berhasil disimpan!",
            showConfirmButton: false,
            timer: 2200,
            timerProgressBar: true,
            background: "#18181b",
            color: "#facc15",
         });

         setJenis("");
         setKeterangan("");
         setJumlah("");
         setTanggal(new Date().toISOString().split("T")[0]);

         setTimeout(() => {
            window.location.href = "/kas";
         }, 2300);
      } catch (err) {
         console.error("Gagal menyimpan data:", err);
         setError("Terjadi kesalahan sistem saat menyimpan ke database.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="p-4 lg:p-6 max-w-[1500px] mx-auto bg-black text-zinc-200 min-h-screen">
         {/* HEADER */}
         <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
               <div className="flex items-center gap-2 mb-2 text-xs">
                  <a href="/kas" className="text-[#a1a1a1] font-semibold uppercase tracking-wider hover:text-yellow-500 transition">
                     Keuangan
                  </a>
                  <span className="text-zinc-700">/</span>
                  <span className="text-xs text-zinc-400">Tambah Data Kas</span>
               </div>
               <h1 className="text-2xl font-bold tracking-tight text-white">Tambah Transaksi Kas</h1>
               <p className="text-sm text-zinc-500 mt-1">Tambahkan data pemasukan atau pengeluaran kas masjid</p>
            </div>

            <a href="/kas" className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 w-fit">
               <RiArrowLeftLine />
               <span>Kembali</span>
            </a>
         </div>

         {/* BOX ERROR TRACKING */}
         {error && (
            <div className="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300 backdrop-blur-xl">
               <div className="flex items-center gap-3">
                  <RiErrorWarningLine className="text-lg text-red-400 shrink-0" />
                  <span className="text-sm">{error}</span>
               </div>
            </div>
         )}

         {/* GRID LAYOUT */}
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* AREA CONTAINER FORM */}
            <div className="xl:col-span-2">
               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                     <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#a1a1a1]">Form Kas</p>
                        <p className="text-xs text-zinc-500 mt-1">Isi data transaksi dengan benar</p>
                     </div>
                     <div className="w-11 h-11 rounded-xl bg-zinc-950 border border-yellow-500/20 flex items-center justify-center">
                        <RiWallet3Line className="text-yellow-400 text-xl" />
                     </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] block mb-3">Tanggal</label>
                           <div className="relative">
                              <RiCalendarLine className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 z-10" />
                              <input type="date" required value={tanggal} onChange={e => setTanggal(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-[#050505] border border-[#1f1f1f] rounded-xl text-white outline-none focus:border-yellow-500 transition-all duration-300 [color-scheme:dark]" />
                           </div>
                        </div>

                        <div>
                           <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] block mb-3">Jenis Transaksi</label>
                           <div className="relative">
                              <RiExchangeFundsLine className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                              <select required value={jenis} onChange={e => setJenis(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-[#050505] border border-[#1f1f1f] rounded-xl text-white outline-none focus:border-yellow-500 transition-all duration-300 appearance-none cursor-pointer">
                                 <option value="" className="bg-black">
                                    Pilih Jenis
                                 </option>
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

                     <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] block mb-3">Keterangan</label>
                        <textarea required rows="5" value={keterangan} onChange={e => setKeterangan(e.target.value)} placeholder="Contoh: Infaq Jumat, pembelian kabel speaker, dll..." className="w-full px-4 py-3 bg-[#050505] border border-[#1f1f1f] rounded-xl text-white placeholder:text-zinc-600 outline-none resize-none focus:border-yellow-500 transition-all duration-300"></textarea>
                     </div>

                     <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] block mb-3">Jumlah Uang</label>
                        <div className="relative">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">Rp</span>
                           <input type="number" required min="1" value={jumlah} onChange={e => setJumlah(e.target.value)} placeholder="0" className="w-full pl-12 pr-4 py-3 bg-[#050505] border border-[#1f1f1f] rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-yellow-500 transition-all duration-300" />
                        </div>
                     </div>

                     <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button type="submit" disabled={loading} className="bg-yellow-500 text-black px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(234,179,8,0.2)] flex items-center justify-center gap-2 disabled:opacity-50">
                           <RiSaveLine className="text-base" />
                           <span>{loading ? "Menyimpan..." : "Simpan Data"}</span>
                        </button>

                        <a href="/kas" className="border border-[#1f1f1f] text-zinc-400 hover:text-white hover:border-zinc-700 px-6 py-3 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 text-center">
                           <RiCloseLine className="text-lg" />
                           <span>Batal</span>
                        </a>
                     </div>
                  </form>
               </div>
            </div>

            {/* SIDEBAR CONTAINER */}
            <div className="space-y-6">
               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-5">
                     <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#a1a1a1]">Informasi Input</p>
                        <p className="text-xs text-zinc-500 mt-1">Ringkasan transaksi</p>
                     </div>
                     <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                        <RiFileList3Line className="text-zinc-300 text-lg" />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Status</span>
                        <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-md border border-yellow-500/20 font-bold tracking-wide uppercase">{loading ? "PROSES INPUT" : "MENUNGGU INPUT"}</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Admin</span>
                        <span className="text-sm text-white font-medium">{adminNama}</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">Sistem</span>
                        <span className="text-sm text-emerald-500 font-medium">Aktif Realtime</span>
                     </div>
                  </div>
               </div>

               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                        <RiLightbulbLine className="text-zinc-300 text-lg" />
                     </div>
                     <div>
                        <p className="text-sm font-semibold text-white">Catatan</p>
                        <p className="text-xs text-zinc-500">Pastikan data valid</p>
                     </div>
                  </div>

                  <ul className="space-y-3 text-sm text-zinc-500">
                     <li className="flex gap-2 items-start">
                        <RiCheckboxCircleLine className="text-zinc-400 mt-0.5 shrink-0" />
                        <span>Isi nominal tanpa titik atau koma</span>
                     </li>
                     <li className="flex gap-2 items-start">
                        <RiCheckboxCircleLine className="text-zinc-400 mt-0.5 shrink-0" />
                        <span>Pilih jenis transaksi dengan benar</span>
                     </li>
                     <li className="flex gap-2 items-start">
                        <RiCheckboxCircleLine className="text-zinc-400 mt-0.5 shrink-0" />
                        <span>Gunakan keterangan yang jelas</span>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
   );
}
