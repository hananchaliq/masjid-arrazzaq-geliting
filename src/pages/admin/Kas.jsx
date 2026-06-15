import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { db } from "../../config/firebase";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useReactToPrint } from "react-to-print";
import { PrintTemplate } from "../../components/layout/PrintTemplate"; 

// Import React Icons
import { RiDeleteBinLine, RiErrorWarningLine, RiWallet3Line, RiAddLine, RiArrowLeftSLine, RiArrowRightSLine, RiLineChartLine, RiArrowRightDownLine, RiCoinsLine, RiPrinterLine } from "react-icons/ri";
import { FaEdit, FaTrash, FaInbox, FaArrowDown, FaArrowUp } from "react-icons/fa";

export default function ManajemenKas() {
   // State Data Master
   const [kasData, setKasData] = useState([]);
   const [loading, setLoading] = useState(true);
   const [flashError, setFlashError] = useState(null);

   // States Filter & Pagination
   const [sort, setSort] = useState("tanggal_desc");
   const [jenis, setJenis] = useState("all");
   const [startDate, setStartDate] = useState("");
   const [endDate, setEndDate] = useState("");
   const [pageNow, setPageNow] = useState(1);
   const limit = 10;

   // Ref untuk menangkap komponen PrintTemplate
   const componentRef = useRef(null);

   // Real-time Fetch Data Cloud Firestore
   useEffect(() => {
      const kasCollection = collection(db, "kas");
      const unsubscribe = onSnapshot(
         kasCollection,
         snapshot => {
            try {
               const listData = [];
               snapshot.forEach(doc => {
                  listData.push({ id: doc.id, ...doc.data() });
               });
               setKasData(listData);
               setLoading(false);
            } catch (error) {
               console.error("Gagal mengambil data Firestore:", error);
               setFlashError("Gagal memuat sinkronisasi database secara real-time.");
               setLoading(false);
            }
         },
         error => {
            setFlashError(error.message);
            setLoading(false);
         }
      );
      return () => unsubscribe();
   }, []);

   // Utilities Format
   const formatRupiah = angka => {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
   };

   const formatTanggal = stringTanggal => {
      if (!stringTanggal) return "-";
      return new Date(stringTanggal).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
   };

   // Prosedur Ringkasan Statistik (Seluruh data di DB sebelum di-filter)
   const totalMasuk = kasData.filter(item => item.jenis === "masuk").reduce((sum, item) => sum + Number(item.jumlah || 0), 0);
   const totalKeluar = kasData.filter(item => item.jenis === "keluar").reduce((sum, item) => sum + Number(item.jumlah || 0), 0);
   const saldo = totalMasuk - totalKeluar;

   // Filter Data Berdasarkan Jenis dan Rentang Tanggal
   const filteredData = kasData.filter(item => {
      if (jenis !== "all" && item.jenis !== jenis) return false;
      if (startDate && item.tanggal < startDate) return false;
      if (endDate && item.tanggal > endDate) return false;
      return true;
   });

   // Logika Pengurutan Data
   const sortedData = [...filteredData].sort((a, b) => {
      switch (sort) {
         case "tanggal_asc":
            return new Date(a.tanggal) - new Date(b.tanggal);
         case "tanggal_desc":
            return new Date(b.tanggal) - new Date(a.tanggal);
         case "jumlah_asc":
            return Number(a.jumlah) - Number(b.jumlah);
         case "jumlah_desc":
            return Number(b.jumlah) - Number(a.jumlah);
         case "created_asc":
            return new Date(a.created_at || 0) - new Date(b.created_at || 0);
         case "created_desc":
            return new Date(b.created_at || 0) - new Date(b.created_at || 0);
         default:
            return new Date(b.tanggal) - new Date(a.tanggal);
      }
   });

   // Pembagian Halaman untuk Tampilan Web
   const totalData = sortedData.length;
   const totalHalaman = Math.ceil(totalData / limit) || 1;
   const offset = (pageNow - 1) * limit;
   const paginatedData = sortedData.slice(offset, offset + limit);

   // Ambil Data yang Siap Dicetak (Memakai data terfilter, tapi semua baris dicetak tanpa terpotong limit pagination)
   const dataToPrint = sortedData.map(item => ({
      ...item,
      tanggal: formatTanggal(item.tanggal),
      jumlah: formatRupiah(item.jumlah),
   }));

   // Fungsi Print Pemicu React To Print
   const handlePrint = useReactToPrint({
      contentRef: componentRef,
      documentTitle: `Laporan_Kas_Masjid_${new Date().toISOString().slice(0, 10)}`,
   });

   // Prosedur Hapus Semua Data
   const handleHapusSemua = () => {
      if (kasData.length === 0) {
         Swal.fire({ title: "Gagal!", text: "Tidak ada data kas yang bisa dihapus.", icon: "info", background: "#18181b", color: "#facc15", confirmButtonColor: "#eab308" });
         return;
      }
      Swal.fire({
         title: "Hapus Semua Data Kas?",
         text: "Tindakan ini akan membersihkan seluruh data kas. Jika yakin, lanjut ke verifikasi berikutnya.",
         icon: "warning",
         background: "#18181b",
         color: "#facc15",
         showCancelButton: true,
         confirmButtonColor: "#ef4444",
         cancelButtonColor: "#3f3f46",
         confirmButtonText: "Lanjut Verifikasi",
         cancelButtonText: "Batal",
      }).then(result => {
         if (result.isConfirmed) {
            Swal.fire({
               title: "Verifikasi Keamanan Utama",
               html: 'Ketik <b class="text-red-400 select-all">hapuskasmasjid</b> di bawah untuk menyetujui penghapusan massal:',
               input: "text",
               background: "#18181b",
               color: "#fff",
               showCancelButton: true,
               confirmButtonColor: "#ef4444",
               cancelButtonColor: "#3f3f46",
               confirmButtonText: "Hapus Permanen!",
               cancelButtonText: "Batal",
               inputValidator: value => {
                  if (value !== "hapuskasmasjid") return "Kata kunci yang Anda masukkan salah!";
               },
            }).then(async resInput => {
               if (resInput.isConfirmed && resInput.value === "hapuskasmasjid") {
                  try {
                     setLoading(true);
                     const deletePromises = kasData.map(item => deleteDoc(doc(db, "kas", item.id)));
                     await Promise.all(deletePromises);
                     Swal.fire({ title: "Berhasil Terhapus!", text: "Seluruh data kas telah dibersihkan.", icon: "success", background: "#18181b", color: "#facc15", confirmButtonColor: "#eab308" });
                  } catch (err) {
                     setFlashError("Gagal menghapus data dari database cloud.");
                  } finally {
                     setLoading(false);
                  }
               }
            });
         }
      });
   };

   // Fungsi Hapus Satu Data
   const confirmDelete = id => {
      Swal.fire({
         title: "Hapus Data?",
         text: "Data ini tidak bisa dikembalikan!",
         icon: "warning",
         background: "#18181b",
         color: "#facc15",
         showCancelButton: true,
         confirmButtonColor: "#ef4444",
         cancelButtonColor: "#3f3f46",
         confirmButtonText: "Ya, Hapus!",
         cancelButtonText: "Batal",
      }).then(result => {
         if (result.isConfirmed) {
            deleteDoc(doc(db, "kas", id))
               .then(() => {
                  Swal.fire({ title: "Berhasil!", text: "Data kas telah terhapus.", icon: "success", background: "#18181b", color: "#facc15", confirmButtonColor: "#eab308" });
               })
               .catch(error => {
                  setFlashError("Gagal menghapus data dari server.");
               });
         }
      });
   };

   if (loading) {
      return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-500 font-medium tracking-wide">Memuat Sistem Pusat Kas...</div>;
   }

   return (
      <div className="p-4 lg:p-6 max-w-[1500px] mx-auto bg-black text-zinc-200 min-h-screen">
         {/* INJEKSI STYLE MEDIA PRINT AGAR ELEMENT LAYAR TIDAK BOCOR SAAT PRINT */}
         <style>{`
            @media print {
               .no-print-wrapper { display: none !important; }
               .print-template-wrapper { display: block !important; }
            }
         `}</style>

         {/* WRAPPER UTAMA SCREEN (Hanya muncul di browser) */}
         <div className="no-print-wrapper">
            {/* FLASH ERROR */}
            {flashError && (
               <div className="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300 backdrop-blur-xl shadow-lg shadow-red-500/5">
                  <div className="flex items-start gap-3">
                     <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                        <RiErrorWarningLine className="text-red-400 text-lg" />
                     </div>
                     <div>
                        <p className="text-sm font-semibold text-red-200 mb-1">Terjadi Kesalahan</p>
                        <p className="text-sm text-red-300/80 leading-relaxed">{flashError}</p>
                     </div>
                  </div>
               </div>
            )}

            {/* HEADER UTAMA */}
            <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
               <div>
                  <div className="flex items-center gap-2 mb-2 text-xs">
                     <span className="text-[#a1a1a1] font-semibold uppercase tracking-wider">Keuangan</span>
                     <span className="text-zinc-700">/</span>
                     <span className="text-zinc-400">Manajemen Kas</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">Pusat Manajemen Kas</h1>
                  <p className="text-sm text-zinc-500 mt-1">Monitoring pemasukan, pengeluaran, dan saldo kas sistem</p>
               </div>

               <div className="flex flex-wrap sm:items-center gap-3">
                  <button onClick={handleHapusSemua} className="inline-flex items-center gap-2 whitespace-nowrap bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg text-sm transition font-medium shadow-sm">
                     <RiDeleteBinLine className="text-base" />
                     <span>Hapus Semua Data</span>
                  </button>

                  {/* BUTTON ACTION PRINT TEMPLATE */}
                  <button onClick={handlePrint} className="inline-flex items-center gap-2 whitespace-nowrap bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black px-3 py-2 rounded-lg text-sm transition font-medium">
                     <RiPrinterLine className="text-base" />
                     <span>Print Laporan</span>
                  </button>
               </div>
            </div>

            {/* STATS BENTO CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
               <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-5 sm:p-6 rounded-xl flex flex-col justify-between group transition-all duration-300 hover:border-emerald-500/20">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#a1a1a1]">Total Pemasukan</p>
                  <div className="mt-4">
                     <h2 className="text-3xl font-bold text-white tracking-tighter">{formatRupiah(totalMasuk)}</h2>
                     <p className="text-xs text-emerald-500 mt-2 font-medium flex items-center gap-1">
                        Pertumbuhan Stabil <RiLineChartLine />
                     </p>
                  </div>
               </div>

               <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-5 sm:p-6 rounded-xl flex flex-col justify-between group transition-all duration-300 hover:border-red-500/20">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#a1a1a1]">Total Pengeluaran</p>
                  <div className="mt-4">
                     <h2 className="text-3xl font-bold text-white tracking-tighter">{formatRupiah(totalKeluar)}</h2>
                     <p className="text-xs text-red-500 mt-2 font-medium flex items-center gap-1">
                        Aliran Keluar Sistem <RiArrowRightDownLine />
                     </p>
                  </div>
               </div>

               <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-5 sm:p-6 rounded-xl flex flex-col justify-between group transition-all duration-300 hover:border-yellow-500/20">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#a1a1a1]">Total Saldo</p>
                  <div className="mt-4">
                     <h2 className="text-3xl font-bold text-white tracking-tighter">{formatRupiah(saldo)}</h2>
                     <p className="text-xs text-yellow-500 mt-2 font-medium flex items-center gap-1">
                        Dana Tersimpan <RiCoinsLine />
                     </p>
                  </div>
               </div>
            </div>

            {/* TABLE CARD CONTAINER */}
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl overflow-hidden">
               <div className="p-5 sm:p-6 border-b border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                     <h3 className="text-base font-semibold text-white flex items-center gap-3">
                        <RiWallet3Line className="text-yellow-400 text-lg" /> Data Transaksi Kas
                     </h3>
                     <p className="text-[#a1a1a1] text-xs mt-1">Semua data pemasukan dan pengeluaran</p>
                  </div>
                  <a href="/admin/kas/tambah" className="inline-flex items-center gap-2 bg-yellow-500 text-black px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(234,179,8,0.2)] text-center">
                     <RiAddLine className="text-lg" />
                     <span>Tambah Data</span>
                  </a>
               </div>

               {/* FILTER CONTROLS */}
               <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3 p-5 sm:p-6 pt-4 pb-2">
                  <div className="flex flex-wrap gap-3 items-center w-full">
                     <select
                        value={sort}
                        onChange={e => {
                           setSort(e.target.value);
                           setPageNow(1);
                        }}
                        className="px-3 py-2 bg-[#050505] border border-[#1f1f1f] text-white text-xs md:text-sm rounded-xl outline-none focus:border-yellow-500">
                        <option value="tanggal_desc">Tanggal Terbaru</option>
                        <option value="tanggal_asc">Tanggal Terlama</option>
                        <option value="jumlah_desc">Jumlah Besar</option>
                        <option value="jumlah_asc">Jumlah Kecil</option>
                     </select>

                     <select
                        value={jenis}
                        onChange={e => {
                           setJenis(e.target.value);
                           setPageNow(1);
                        }}
                        className="px-3 py-2 bg-[#050505] border border-[#1f1f1f] text-white text-xs md:text-sm rounded-xl outline-none focus:border-yellow-500">
                        <option value="all">Semua Jenis</option>
                        <option value="masuk">Pemasukan</option>
                        <option value="keluar">Pengeluaran</option>
                     </select>

                     <div className="flex flex-wrap gap-3">
                        <input
                           type="date"
                           value={startDate}
                           onChange={e => {
                              setStartDate(e.target.value);
                              setPageNow(1);
                           }}
                           className="px-3 py-1.5 bg-[#050505] border border-[#1f1f1f] text-white text-xs md:text-sm rounded-xl outline-none focus:border-yellow-500 [color-scheme:dark]"
                        />
                        <input
                           type="date"
                           value={endDate}
                           onChange={e => {
                              setEndDate(e.target.value);
                              setPageNow(1);
                           }}
                           className="px-3 py-1.5 bg-[#050505] border border-[#1f1f1f] text-white text-xs md:text-sm rounded-xl outline-none focus:border-yellow-500 [color-scheme:dark]"
                        />
                     </div>
                  </div>
               </div>

               {/* DATA TABLE WRAPPER */}
               <div className="w-full overflow-x-auto">
                  <table className="min-w-[700px] w-full">
                     <thead className="bg-[#060606] border-b border-[#1f1f1f]">
                        <tr>
                           <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1] w-16 hidden md:table-cell">No</th>
                           <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Tanggal</th>
                           <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Keterangan</th>
                           <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1] w-32">Jenis</th>
                           <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Jumlah</th>
                           <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-[#a1a1a1] w-28">Aksi</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#1f1f1f]">
                        {paginatedData.length > 0 ? (
                           paginatedData.map((kas, index) => (
                              <tr key={kas.id} className="hover:bg-[#111111] transition duration-150">
                                 <td className="px-6 py-5 text-zinc-500 text-sm hidden md:table-cell">{offset + index + 1}</td>
                                 <td className="px-6 py-5 text-white text-sm whitespace-nowrap">{formatTanggal(kas.tanggal)}</td>
                                 <td className="px-6 py-5 text-zinc-300 text-sm max-w-xs truncate">{kas.keterangan}</td>
                                 <td className="px-6 py-5">
                                    <span className="inline-flex items-center px-3 py-1 border border-[#1f1f1f] text-xs rounded-md uppercase gap-1.5 w-fit font-medium">
                                       {kas.jenis === "masuk" ? (
                                          <>
                                             <FaArrowDown className="text-emerald-500 text-[10px]" />
                                             <span className="text-emerald-500">masuk</span>
                                          </>
                                       ) : (
                                          <>
                                             <FaArrowUp className="text-red-500 text-[10px]" />
                                             <span className="text-red-500">keluar</span>
                                          </>
                                       )}
                                    </span>
                                 </td>
                                 <td className={`px-6 py-5 text-right font-bold text-sm whitespace-nowrap ${kas.jenis === "masuk" ? "text-emerald-400" : "text-zinc-200"}`}>{formatRupiah(kas.jumlah)}</td>
                                 <td className="px-6 py-5">
                                    <div className="flex justify-center gap-2">
                                       <Link to={`/admin/kas/edit/${kas.id}`} className="w-9 h-9 flex items-center justify-center border border-[#1f1f1f] text-zinc-400 hover:text-white rounded-md hover:bg-[#1c1c1f] transition">
                                          <FaEdit className="text-xs" />
                                       </Link>
                                       <button onClick={() => confirmDelete(kas.id)} className="w-9 h-9 flex items-center justify-center border border-[#1f1f1f] text-zinc-400 hover:text-red-400 rounded-md hover:bg-[#1c1c1f] transition">
                                          <FaTrash className="text-xs" />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan="6" className="px-6 py-16 text-center text-[#a1a1a1]">
                                 <div className="flex flex-col items-center justify-center gap-3">
                                    <FaInbox className="text-4xl opacity-20" />
                                    <p className="text-sm">Belum ada data transaksi</p>
                                 </div>
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>

               {/* PAGINATION PANEL */}
               {totalData > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 border-t border-[#1f1f1f]">
                     <p className="text-sm text-zinc-500">
                        Menampilkan {paginatedData.length} dari {totalData} data
                     </p>
                     <div className="flex items-center gap-2 flex-wrap">
                        {pageNow > 1 && (
                           <button onClick={() => setPageNow(prev => Math.max(prev - 1, 1))} className="w-10 h-10 rounded-lg border border-[#1f1f1f] flex items-center justify-center text-white hover:bg-[#111111] transition">
                              <RiArrowLeftSLine className="text-lg" />
                           </button>
                        )}
                        {Array.from({ length: totalHalaman }, (_, idx) => idx + 1).map(pageNumber => (
                           <button key={pageNumber} onClick={() => setPageNow(pageNumber)} className={`w-10 h-10 rounded-lg border text-sm font-medium transition ${pageNow === pageNumber ? "bg-yellow-500 text-black border-yellow-500 font-bold" : "border-[#1f1f1f] text-white hover:bg-[#111111]"}`}>
                              {pageNumber}
                           </button>
                        ))}
                        {pageNow < totalHalaman && (
                           <button onClick={() => setPageNow(prev => Math.min(prev + 1, totalHalaman))} className="w-10 h-10 rounded-lg border border-[#1f1f1f] flex items-center justify-center text-white hover:bg-[#111111] transition">
                              <RiArrowRightSLine className="text-lg" />
                           </button>
                        )}
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* COMPONENT TERSEMBUNYI DI LAYAR, AKTIF HANYA SAAT PRINT BERJALAN */}
         <div className="hidden print-template-wrapper">
            <PrintTemplate
               ref={componentRef}
               tipe="KAS"
               data={dataToPrint}
               summary={{
                  masuk: formatRupiah(totalMasuk),
                  keluar: formatRupiah(totalKeluar),
                  saldo: formatRupiah(saldo),
               }}
            />
         </div>
      </div>
   );
}
