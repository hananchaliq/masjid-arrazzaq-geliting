import React, { useState, useEffect, useRef } from "react";
import { RiErrorWarningLine, RiPrinterLine, RiArrowRightUpLine, RiFundsLine, RiCheckDoubleLine, RiShieldCheckLine, RiLoader4Line, RiTimeLine, RiHandHeartLine, RiCalendarLine, RiUserLine, RiCoinsLine, RiBowlLine, RiQuestionAnswerLine, RiMoneyDollarCircleLine, RiCheckboxCircleLine, RiCheckLine, RiDeleteBinLine } from "react-icons/ri";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useReactToPrint } from "react-to-print";
import { db } from "../../config/firebase"; // Sesuaikan jalur relatif file konfigurasi Firebase Anda
import { PrintTemplate } from "../../components/layout/PrintTemplate"; // Sesuaikan jalur tempat Anda menyimpan PrintTemplate
import Swal from "sweetalert2";

export default function ManajemenZakat() {
   const [zakatAll, setZakatAll] = useState([]);
   const [totalZakat, setTotalZakat] = useState(0);
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(true);

   // Ref untuk menangkap elemen cetak react-to-print
   const componentRef = useRef(null);

   // Mengambil data real-time dari Firestore
   useEffect(() => {
      const q = query(collection(db, "zakat"), orderBy("tanggal", "desc"));

      const unsubscribe = onSnapshot(
         q,
         snapshot => {
            const data = [];
            let totalAccumulated = 0;

            snapshot.forEach(docSnap => {
               const item = { id: docSnap.id, ...docSnap.data() };
               data.push(item);

               // Hitung total akumulasi bayar hanya yang berstatus 'Berhasil'
               if (item.status === "Berhasil") {
                  totalAccumulated += Number(item.jumlah_bayar || 0);
               }
            });

            setZakatAll(data);
            setTotalZakat(totalAccumulated);
            setLoading(false);
         },
         err => {
            console.error(err);
            setError("Gagal memuat data dari cloud database.");
            setLoading(false);
         }
      );

      return () => unsubscribe();
   }, []);

   // Format IDR Rupiah bawaan JavaScript (Tanpa library tambahan)
   const formatRupiah = number => {
      return new Intl.NumberFormat("id-ID", {
         style: "currency",
         currency: "IDR",
         minimumFractionDigits: 0,
      }).format(number);
   };

   // Format Tanggal untuk Tampilan Tabel Dashboard
   const formatTanggal = isoString => {
      if (!isoString) return "-";
      try {
         const date = new Date(isoString);
         const pad = num => String(num).padStart(2, "0");
         return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
      } catch (e) {
         return isoString;
      }
   };

   // Handler Print menggunakan react-to-print
   const handlePrint = useReactToPrint({
      contentRef: componentRef,
      documentTitle: `Laporan_Zakat_${new Date().toISOString().split("T")[0]}`,
   });

   const handleHapusSemua = () => {
      if (zakatAll.length === 0) {
         Swal.fire({ title: "Gagal!", text: "Tidak ada data transaksi zakat.", icon: "info", background: "#18181b", color: "#facc15", confirmButtonColor: "#eab308" });
         return;
      }

      Swal.fire({
         title: "Hapus Semua Data Zakat?",
         text: "Tindakan ini akan menghapus semua rekaman zakat fitrah/maal muzakki dan mustahik.",
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
               html: 'Ketik <b class="text-red-400 select-all">hapuszakatmasjid</b> untuk konfirmasi pembersihan data zakat:',
               input: "text",
               inputAttributes: { autocapitalize: "off", autocomplete: "off" },
               background: "#18181b",
               color: "#fff",
               showCancelButton: true,
               confirmButtonColor: "#ef4444",
               cancelButtonColor: "#3f3f46",
               confirmButtonText: "Hapus Permanen!",
               cancelButtonText: "Batal",
               inputValidator: value => {
                  if (value !== "hapuszakatmasjid") {
                     return "Kata kunci salah!";
                  }
               },
            }).then(async resInput => {
               if (resInput.isConfirmed && resInput.value === "hapuszakatmasjid") {
                  try {
                     setLoading(true);
                     const deletePromises = zakatAll.map(item => deleteDoc(doc(db, "zakat", item.id)));
                     await Promise.all(deletePromises);
                     Swal.fire({ title: "Terhapus!", text: "Seluruh catatan zakat berhasil dihapus.", icon: "success", background: "#18181b", color: "#facc15", confirmButtonColor: "#eab308" });
                  } catch (err) {
                     console.error(err);
                     setError("Gagal membersihkan database cloud.");
                  } finally {
                     setLoading(false);
                  }
               }
            });
         }
      });
   };

   // Handler Konfirmasi Aksi (Verifikasi / Hapus)
   const handleConfirmAction = (type, id) => {
      const isACC = type === "Berhasil";

      Swal.fire({
         title: isACC ? "ACC Laporan Zakat?" : "Hapus Laporan?",
         text: isACC ? "Data akan langsung tampil di beranda utama." : "Data yang dihapus tidak bisa dikembalikan.",
         icon: isACC ? "question" : "warning",
         background: "#18181b",
         color: "#facc15",
         showCancelButton: true,
         confirmButtonColor: isACC ? "#10b981" : "#ef4444",
         cancelButtonColor: "#3f3f46",
         confirmButtonText: isACC ? "Ya, Verifikasi!" : "Ya, Hapus!",
         cancelButtonText: "Batal",
      }).then(async result => {
         if (result.isConfirmed) {
            try {
               const docRef = doc(db, "zakat", id);
               if (isACC) {
                  await updateDoc(docRef, { status: "Berhasil" });
                  Swal.fire({
                     title: "Terverifikasi!",
                     text: "Laporan zakat berhasil disetujui.",
                     icon: "success",
                     background: "#18181b",
                     color: "#facc15",
                     confirmButtonColor: "#10b981",
                  });
               } else {
                  await deleteDoc(docRef);
                  Swal.fire({
                     title: "Terhapus!",
                     text: "Laporan zakat telah dihapus.",
                     icon: "success",
                     background: "#18181b",
                     color: "#facc15",
                     confirmButtonColor: "#eab308",
                  });
               }
            } catch (err) {
               console.error(err);
               setError("Gagal memperbarui database cloud.");
            }
         }
      });
   };

   // Filter pembantu untuk counter badge di grid atas
   const verifiedCount = zakatAll.filter(z => z.status === "Berhasil").length;
   const pendingCount = zakatAll.filter(z => z.status === "Pending").length;

   // Persiapan struktur objek rekap summary untuk dikirim ke PrintTemplate
   const summaryData = {
      total: formatRupiah(totalZakat),
      verified: verifiedCount,
      pending: pendingCount,
   };

   return (
      <div className="p-4 lg:p-6 max-w-[1700px] mx-auto bg-black text-zinc-200 min-h-screen">
         {/* FLASH ERROR ONLY */}
         {error && (
            <div className="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300 backdrop-blur-xl shadow-lg shadow-red-500/5">
               <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                     <RiErrorWarningLine className="text-red-400 text-lg" />
                  </div>
                  <div>
                     <p className="text-sm font-semibold text-red-200 mb-1">Terjadi Kesalahan</p>
                     <p className="text-sm text-red-300/80 leading-relaxed">{error}</p>
                  </div>
               </div>
            </div>
         )}

         {/* HEADER */}
         <div className="mb-6 flex flex-row items-center justify-between gap-4">
            <div>
               <div className="flex items-center gap-2 mb-2 text-xs">
                  <a href="/zakat" className="text-[#a1a1a1] font-semibold uppercase tracking-wider hover:text-white transition">
                     Donasi
                  </a>
                  <span className="text-zinc-700">/</span>
                  <span className="text-xs text-zinc-400">Manajemen Zakat</span>
               </div>
               <h1 className="text-2xl font-bold tracking-tight text-white">Pusat Pengelolaan Zakat</h1>
               <p className="text-sm text-zinc-500 mt-1 hidden sm:block">Monitoring pembayaran, verifikasi, dan distribusi zakat jama'ah</p>
            </div>

            {/* Bagian Tombol Aksi */}
            <div className="flex flex-wrap sm:items-center gap-3 print:hidden">
               {/* TOMBOL HAPUS ALL */}
               <button onClick={handleHapusSemua} className="inline-flex items-center gap-2 whitespace-nowrap bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg text-sm transition font-medium shadow-sm">
                  <RiDeleteBinLine className="text-base" />
                  <span>Hapus Semua Data</span>
               </button>

               {/* TOMBOL PRINT OPTIMIZED */}
               <button onClick={handlePrint} className="inline-flex items-center gap-2 whitespace-nowrap bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black px-3 py-2 rounded-lg text-sm transition font-medium">
                  <RiPrinterLine className="text-base" />
                  <span>Print</span>
               </button>
            </div>
         </div>

         {/* STATS BENTO GRID */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-6">
            {/* TOTAL ZAKAT */}
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl group relative overflow-hidden p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/20">
               <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 blur-3xl rounded-full"></div>
               <div className="space-y-2 relative z-10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Zakat Jama'ah</p>
                  <h2 className="text-3xl font-bold text-white tracking-tight">{formatRupiah(totalZakat)}</h2>
                  <p className="text-xs text-yellow-500 flex items-center gap-1 font-medium">
                     <span>Dana Masuk Aktif</span>
                  </p>
               </div>
               <div className="relative z-10 w-14 h-14 rounded-2xl bg-zinc-950 border border-yellow-500/20 flex items-center justify-center transition-all duration-300 group-hover:bg-yellow-500 group-hover:rotate-6">
                  <RiFundsLine className="text-yellow-400 text-2xl transition-all duration-300 group-hover:text-black" />
               </div>
            </div>

            {/* VERIFIED COUNT */}
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl group relative overflow-hidden p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20">
               <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full"></div>
               <div className="space-y-2 relative z-10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Zakat Terverifikasi</p>
                  <h2 className="text-3xl font-bold text-white tracking-tight">{loading ? "..." : verifiedCount}</h2>
                  <p className="text-xs text-emerald-500 flex items-center gap-1 font-medium">
                     <span>Data Sudah Valid</span>
                  </p>
               </div>
               <div className="relative z-10 w-14 h-14 rounded-2xl bg-zinc-950 border border-emerald-500/20 flex items-center justify-center transition-all duration-300 group-hover:bg-emerald-500 group-hover:rotate-6">
                  <RiShieldCheckLine className="text-emerald-400 text-2xl transition-all duration-300 group-hover:text-black" />
               </div>
            </div>

            {/* PENDING COUNT */}
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl group relative overflow-hidden p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20">
               <div className="absolute top-0 left-0 w-24 h-24 bg-red-500/5 blur-3xl rounded-full"></div>
               <div className="space-y-2 relative z-10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Zakat Pending</p>
                  <h2 className="text-3xl font-bold text-white tracking-tight">{loading ? "..." : pendingCount}</h2>
                  <p className="text-xs text-red-500 flex items-center gap-1 font-medium">
                     <span>Menunggu Verifikasi</span>
                  </p>
               </div>
               <div className="relative z-10 w-14 h-14 rounded-2xl bg-zinc-950 border border-red-500/20 flex items-center justify-center transition-all duration-300 group-hover:bg-red-500 group-hover:rotate-6">
                  <RiTimeLine className="text-red-400 text-2xl transition-all duration-300 group-hover:text-black" />
               </div>
            </div>
         </div>

         {/* TABLE DATA CONTAINER */}
         <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg overflow-hidden w-full">
            {/* TABLE INNER HEADER */}
            <div className="px-4 sm:px-6 py-5 border-b border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
               <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-yellow-400 flex items-center gap-2">
                     <RiHandHeartLine />
                     <span>Data Zakat</span>
                  </h3>
                  <p className="text-[#a1a1a1] text-sm mt-1">Semua laporan zakat masuk ke sistem</p>
               </div>
            </div>

            {/* DATA DATA TABLE */}
            <div className="overflow-x-auto">
               {loading ? (
                  <div className="p-10 text-center text-zinc-500 flex flex-col items-center gap-3">
                     <RiLoader4Line className="animate-spin text-2xl text-yellow-500" />
                     <p className="text-sm">Sinkronisasi Database Cloud...</p>
                  </div>
               ) : (
                  <table className="min-w-[950px] w-full">
                     <thead className="bg-[#0a0a0a]">
                        <tr>
                           <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Tanggal</th>
                           <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Muzakki</th>
                           <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Jenis</th>
                           <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Jumlah</th>
                           <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Status</th>
                           <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Aksi</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#1f1f1f]">
                        {zakatAll.length === 0 ? (
                           <tr>
                              <td colSpan="6" className="px-6 py-10 text-center text-sm text-zinc-600">
                                 Belum ada laporan data transaksi zakat.
                              </td>
                           </tr>
                        ) : (
                           zakatAll.map(z => (
                              <tr key={z.id} className="hover:bg-[#111111] transition">
                                 {/* DATE */}
                                 <td className="px-6 py-5 text-white text-sm whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                       <RiCalendarLine className="text-emerald-400 text-base" />
                                       <span>{formatTanggal(z.tanggal)}</span>
                                    </div>
                                 </td>

                                 {/* MUZAKKI */}
                                 <td className="px-6 py-5 text-white text-sm">
                                    <div className="flex items-center gap-2">
                                       <RiUserLine className="text-yellow-400 text-base" />
                                       <span className="font-medium">{z.nama_muzakki}</span>
                                    </div>
                                 </td>

                                 {/* CATEGORY TYPE */}
                                 <td className="px-6 py-5 text-white text-sm">
                                    <div className="flex items-center gap-2">
                                       {z.jenis_zakat === "maal" ? <RiCoinsLine className="text-yellow-400 text-base" /> : z.jenis_zakat === "fitrah" ? <RiBowlLine className="text-emerald-400 text-base" /> : <RiQuestionAnswerLine className="text-[#a1a1a1] text-base" />}
                                       <span className="text-[#a1a1a1] capitalize">{z.jenis_zakat}</span>
                                    </div>
                                 </td>

                                 {/* AMOUNT */}
                                 <td className="px-6 py-5 text-white text-sm font-semibold">
                                    <div className="flex items-center gap-2">
                                       <RiMoneyDollarCircleLine className="text-emerald-400 text-base" />
                                       <span>{formatRupiah(z.jumlah_bayar)}</span>
                                    </div>
                                 </td>

                                 {/* STATUS BADGE */}
                                 <td className="px-6 py-5 text-sm">
                                    {z.status === "Pending" ? (
                                       <div className="flex items-center gap-2 text-purple-400">
                                          <RiLoader4Line className="animate-spin text-base" />
                                          <span>Pending</span>
                                       </div>
                                    ) : (
                                       <div className="flex items-center gap-2 text-emerald-400">
                                          <RiCheckboxCircleLine className="text-base" />
                                          <span>Diterima</span>
                                       </div>
                                    )}
                                 </td>

                                 {/* ACTION CONTROLS */}
                                 <td className="px-6 py-5">
                                    <div className="flex justify-center gap-2">
                                       {z.status === "Pending" && (
                                          <button onClick={() => handleConfirmAction("Berhasil", z.id)} className="w-9 h-9 flex items-center justify-center border border-[#1f1f1f] text-emerald-400 rounded-md hover:bg-[#111111] transition" title="Verifikasi Transaksi">
                                             <RiCheckLine className="text-base" />
                                          </button>
                                       )}
                                       <button onClick={() => handleConfirmAction("Hapus", z.id)} className="w-9 h-9 flex items-center justify-center border border-[#1f1f1f] text-red-400 rounded-md hover:bg-[#111111] transition" title="Hapus Data">
                                          <RiDeleteBinLine className="text-base" />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               )}
            </div>
         </div>

         {/* AREA SEMBUNYI UNTUK LAYOUT PRINT (HIDDEN DARI WINDOW UTAMA) */}
         <div className="hidden">
            <PrintTemplate ref={componentRef} tipe="ZAKAT" data={zakatAll} summary={summaryData} filter={{ "Status Data": "Semua Kontribusi" }} />
         </div>
      </div>
   );
}
