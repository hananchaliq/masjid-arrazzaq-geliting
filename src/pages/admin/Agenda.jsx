import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiErrorWarningLine, RiPrinterLine, RiCalendarEventLine, RiAddLine, RiCalendarLine, RiMapPinLine, RiEditLine, RiDeleteBinLine, RiInboxLine, RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useReactToPrint } from "react-to-print";
import { PrintTemplate } from "../../components/layout/PrintTemplate";
import Swal from "sweetalert2";

export default function Agenda() {
   const navigate = useNavigate();

   // State Data Master
   const [agendaData, setAgendaData] = useState([]);
   const [loading, setLoading] = useState(true);
   const [flashError, setFlashError] = useState(null);

   // State Filter, Sort & Pagination
   const [sort, setSort] = useState("tanggal_desc");
   const [startDate, setStartDate] = useState("");
   const [endDate, setEndDate] = useState("");
   const [pageNow, setPageNow] = useState(1);
   const limit = 10;

   // Ref untuk menangkap komponen PrintTemplate sesuai arsitektur Kas
   const componentRef = useRef(null);

   // Real-time Fetch Data Cloud Firestore (Menggunakan onSnapshot sama seperti Kas)
   useEffect(() => {
      const agendaCollection = collection(db, "agenda");
      const unsubscribe = onSnapshot(
         agendaCollection,
         snapshot => {
            try {
               const listData = [];
               snapshot.forEach(doc => {
                  listData.push({ id: doc.id, ...doc.data() });
               });
               setAgendaData(listData);
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

   const formatTanggalWaktu = dateString => {
      if (!dateString) return "-";
      return new Date(dateString).toLocaleDateString("id-ID", {
         year: "numeric",
         month: "long",
         day: "numeric",
      });
   };

   // Filter Data Berdasarkan Rentang Tanggal Mulai
   const filteredData = agendaData.filter(item => {
      if (startDate && item.tanggal_mulai < startDate) return false;
      if (endDate && item.tanggal_mulai > endDate) return false;
      return true;
   });

   // Logika Pengurutan Data
   const sortedData = [...filteredData].sort((a, b) => {
      if (sort === "tanggal_asc") {
         return new Date(a.tanggal_mulai) - new Date(b.tanggal_mulai);
      } else {
         return new Date(b.tanggal_mulai) - new Date(a.tanggal_mulai);
      }
   });

   // Logika Pembagian Halaman (Pagination) untuk tampilan layar
   const totalData = sortedData.length;
   const totalHalaman = Math.ceil(totalData / limit) || 1;
   const offset = (pageNow - 1) * limit;
   const paginatedData = sortedData.slice(offset, offset + limit);

   // Menghitung parameter filter dan summary untuk dikirim ke PrintTemplate
   const agendaFilter = useMemo(
      () => ({
         "Urutan urut": sort === "tanggal_desc" ? "Terbaru" : "Terlama",
         "Mulai Dari": startDate || "Semua",
         "Sampai Dengan": endDate || "Semua",
      }),
      [sort, startDate, endDate]
   );

   const agendaSummary = useMemo(
      () => ({
         total: sortedData.length,
      }),
      [sortedData.length]
   );

   // Struktur data terfilter bersih tanpa batas pagination untuk dikirim ke PrintTemplate
   const dataToPrint = sortedData.map(item => ({
      ...item,
      judul: item.judul,
      deskripsi: item.deskripsi,
      tanggal_mulai: item.tanggal_mulai,
      tanggal_selesai: item.tanggal_selesai,
      lokasi: item.lokasi || "-",
   }));

   // Fungsi Print Pemicu React To Print Resmi
   const handlePrint = useReactToPrint({
      contentRef: componentRef,
      documentTitle: `Laporan_Agenda_Masjid_${new Date().toISOString().slice(0, 10)}`,
   });

   // Prosedur Hapus Semua Data
   const handleHapusSemua = () => {
      if (agendaData.length === 0) {
         Swal.fire({ title: "Gagal!", text: "Tidak ada jadwal agenda.", icon: "info", background: "#18181b", color: "#facc15", confirmButtonColor: "#eab308" });
         return;
      }

      Swal.fire({
         title: "Hapus Semua Agenda?",
         text: "Seluruh jadwal kegiatan dan kalender masjid akan dikosongkan.",
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
               html: 'Ketik <b class="text-red-400 select-all">hapusagendamasjid</b> untuk menyetujui reset data agenda:',
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
                  if (value !== "hapusagendamasjid") {
                     return "Kata kunci salah!";
                  }
               },
            }).then(async resInput => {
               if (resInput.isConfirmed && resInput.value === "hapusagendamasjid") {
                  try {
                     setLoading(true);
                     const deletePromises = agendaData.map(item => deleteDoc(doc(db, "agenda", item.id)));
                     await Promise.all(deletePromises);
                     Swal.fire({ title: "Terhapus!", text: "Seluruh jadwal agenda dibersihkan.", icon: "success", background: "#18181b", color: "#facc15", confirmButtonColor: "#eab308" });
                     setPageNow(1);
                  } catch (err) {
                     console.error(err);
                     setFlashError("Gagal menghapus seluruh data dari server.");
                  } finally {
                     setLoading(false);
                  }
               }
            });
         }
      });
   };

   // Fungsi Hapus Satu Data
   const handleDelete = id => {
      Swal.fire({
         title: "Hapus Agenda?",
         text: "Data ini tidak bisa dikembalikan!",
         icon: "warning",
         background: "#18181b",
         color: "#facc15",
         showCancelButton: true,
         confirmButtonColor: "#ef4444",
         cancelButtonColor: "#3f3f46",
         confirmButtonText: "Ya, Hapus!",
         cancelButtonText: "Batal",
      }).then(async result => {
         if (result.isConfirmed) {
            try {
               await deleteDoc(doc(db, "agenda", id));
               setFlashError(null);
               if (paginatedData.length === 1 && pageNow > 1) {
                  setPageNow(prev => prev - 1);
               }
               Swal.fire({
                  title: "Berhasil!",
                  text: "Data agenda telah terhapus.",
                  icon: "success",
                  background: "#18181b",
                  color: "#facc15",
                  confirmButtonColor: "#eab308",
               });
            } catch (error) {
               setFlashError("Gagal menghapus data dari server.");
            }
         }
      });
   };

   if (loading) {
      return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-500 font-medium tracking-wide">Memuat Sistem Pusat Agenda...</div>;
   }

   return (
      <div className="p-4 lg:p-6 max-w-[1500px] mx-auto bg-black text-zinc-200 min-h-screen">
         {/* INJEKSI STYLE MEDIA PRINT AGAR LAYAR TERSEMBUNYI SAAT BERKAS PRINT DIBUKA */}
         <style>{`
            @media print {
               .no-print-wrapper { display: none !important; }
               .print-template-wrapper { display: block !important; }
            }
         `}</style>

         {/* WRAPPER UTAMA SCREEN (Hanya muncul di monitor browser) */}
         <div className="no-print-wrapper">
            {/* FLASH ERROR DI ATAS */}
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
                     <span className="text-[#a1a1a1] font-semibold uppercase tracking-wider">Kegiatan</span>
                     <span className="text-zinc-700">/</span>
                     <span className="text-zinc-400">Manajemen Agenda</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">Pusat Jadwal Kegiatan</h1>
                  <p className="text-sm text-zinc-500 mt-1">Atur agenda kegiatan, jadwal acara, dan aktivitas masjid</p>
               </div>
               <div className="flex flex-wrap sm:items-center gap-3">
                  <button onClick={handleHapusSemua} className="inline-flex items-center gap-2 whitespace-nowrap bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg text-sm transition font-medium shadow-sm">
                     <RiDeleteBinLine className="text-base" />
                     <span>Hapus Semua Data</span>
                  </button>

                  <button onClick={handlePrint} className="inline-flex items-center gap-2 whitespace-nowrap bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black px-3 py-2 rounded-lg text-sm transition font-medium">
                     <RiPrinterLine className="text-base" />
                     <span>Print</span>
                  </button>
               </div>
            </div>

            {/* TABLE CARD CONTAINER */}
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl overflow-hidden">
               <div className="p-5 sm:p-6 border-b border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                     <h3 className="text-base font-semibold text-white flex items-center gap-3">
                        <RiCalendarEventLine className="text-yellow-400 text-lg" />
                        Daftar Agenda Kegiatan
                     </h3>
                     <p className="text-[#a1a1a1] text-xs mt-1">Semua jadwal aktivitas dan manajemen acara</p>
                  </div>
                  <Link to="/admin/agenda/tambah" className="inline-flex items-center gap-2 bg-yellow-500 text-black px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(234,179,8,0.2)] text-center">
                     <RiAddLine className="text-lg" />
                     <span>Tambah Data</span>
                  </Link>
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
                           <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Judul & Deskripsi</th>
                           <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Tanggal & Waktu</th>
                           <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Lokasi</th>
                           <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-[#a1a1a1] w-28">Aksi</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#1f1f1f]">
                        {paginatedData.length > 0 ? (
                           paginatedData.map((agenda, index) => (
                              <tr key={agenda.id} className="hover:bg-[#111111] transition duration-150">
                                 <td className="px-6 py-5 text-zinc-500 text-sm hidden md:table-cell">{offset + index + 1}</td>
                                 <td className="px-6 py-5 text-sm">
                                    <div className="flex items-center gap-2 text-yellow-400 font-semibold">
                                       <RiCalendarEventLine className="text-base shrink-0" />
                                       <span className="text-white">{agenda.judul}</span>
                                    </div>
                                    <div className="text-[#a1a1a1] text-xs mt-1 max-w-sm truncate">{agenda.deskripsi}</div>
                                 </td>
                                 <td className="px-6 py-5 text-white text-sm whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                       <RiCalendarLine className="text-emerald-400" />
                                       <span>{formatTanggalWaktu(agenda.tanggal_mulai)}</span>
                                    </div>
                                    {agenda.tanggal_selesai && <div className="text-[#a1a1a1] text-xs mt-1 pl-6">s/d {formatTanggalWaktu(agenda.tanggal_selesai)}</div>}
                                 </td>
                                 <td className="px-6 py-5 text-sm">
                                    {agenda.lokasi ? (
                                       <div className="flex items-center gap-2 text-zinc-300">
                                          <RiMapPinLine className="text-red-500 shrink-0" />
                                          <span>{agenda.lokasi}</span>
                                       </div>
                                    ) : (
                                       <span className="text-zinc-600">-</span>
                                    )}
                                 </td>
                                 <td className="px-6 py-5">
                                    <div className="flex justify-center gap-2">
                                       <Link to={`/admin/agenda/edit/${agenda.id}`} className="w-9 h-9 flex items-center justify-center border border-[#1f1f1f] text-zinc-400 hover:text-white rounded-md hover:bg-[#1c1c1f] transition">
                                          <RiEditLine className="text-base" />
                                       </Link>
                                       <button onClick={() => handleDelete(agenda.id)} className="w-9 h-9 flex items-center justify-center border border-[#1f1f1f] text-zinc-400 hover:text-red-400 rounded-md hover:bg-[#1c1c1f] transition">
                                          <RiDeleteBinLine className="text-base" />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan="5" className="px-6 py-16 text-center text-[#a1a1a1]">
                                 <div className="flex flex-col items-center justify-center gap-3">
                                    <RiInboxLine className="text-4xl opacity-20" />
                                    <p className="text-sm">Belum ada data agenda kegiatan</p>
                                 </div>
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>

               {/* PAGINATION */}
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

         {/* KONTAINER KHUSUS UNTUK REACT-TO-PRINT (Tersembunyi total di monitor, direndor murni oleh extension printer) */}
         <div className="hidden print-template-wrapper">
            <PrintTemplate ref={componentRef} tipe="AGENDA" data={dataToPrint} summary={agendaSummary} filter={agendaFilter} />
         </div>
      </div>
   );
}
   