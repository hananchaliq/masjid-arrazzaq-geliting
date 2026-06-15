import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiErrorWarningLine, RiPrinterLine, RiInboxLine, RiArrowLeftSLine, RiArrowRightSLine, RiNewspaperLine, RiAddLine, RiEditLine, RiDeleteBinLine, RiArrowRightUpLine, RiMegaphoneLine, RiStackLine, RiQuillPenLine, RiUserStarLine } from "react-icons/ri";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useReactToPrint } from "react-to-print";
import { PrintTemplate } from "../../components/layout/PrintTemplate";
import Swal from "sweetalert2";

export default function ManajemenBerita() {
   const navigate = useNavigate();

   // State Data Master
   const [beritaData, setBeritaData] = useState([]);
   const [loading, setLoading] = useState(true);
   const [flashError, setFlashError] = useState(null);

   // State Pagination & Urutan ringkas
   const [sort, setSort] = useState("tanggal_desc");
   const [pageNow, setPageNow] = useState(1);
   const limit = 10;

   // Ref penampung cetak react-to-print resmi
   const componentRef = useRef(null);

   // Mengambil data real-time dari Firestore
   useEffect(() => {
      const q = query(collection(db, "berita"), orderBy("tanggal", "desc"));

      const unsubscribe = onSnapshot(
         q,
         snapshot => {
            try {
               const data = [];
               snapshot.forEach(docSnap => {
                  data.push({ id: docSnap.id, ...docSnap.data() });
               });
               setBeritaData(data);
               setLoading(false);
            } catch (err) {
               console.error(err);
               setFlashError("Gagal memuat sinkronisasi database berita secara real-time.");
               setLoading(false);
            }
         },
         err => {
            setFlashError(err.message);
            setLoading(false);
         }
      );

      return () => unsubscribe();
   }, []);

   const formatTanggalWaktu = isoString => {
      if (!isoString) return "-";
      return new Date(isoString).toLocaleDateString("id-ID", {
         year: "numeric",
         month: "long",
         day: "numeric",
      });
   };

   // Fungsi Strip HTML Tags untuk deskripsi/ringkasan bersih
   const stripTags = html => {
      if (!html) return "";
      return html.replace(/<\/?[^>]+(>|$)/g, "");
   };

   // Logika Pengurutan Data Berita
   const sortedData = [...beritaData].sort((a, b) => {
      if (sort === "tanggal_asc") {
         return new Date(a.tanggal) - new Date(b.tanggal);
      } else {
         return new Date(b.tanggal) - new Date(a.tanggal);
      }
   });

   // Logika Hitung Total Penerbit Unik dari Data Berita
   const totalPenerbit = useMemo(() => {
      const penerbitSet = new Set();
      beritaData.forEach(item => {
         if (item.penulis && item.penulis.trim() !== "") {
            penerbitSet.add(item.penulis.trim().toLowerCase());
         }
      });
      return penerbitSet.size || 0;
   }, [beritaData]);

   // Logika Pagination Screen
   const totalData = sortedData.length;
   const totalHalaman = Math.ceil(totalData / limit) || 1;
   const offset = (pageNow - 1) * limit;
   const paginatedData = sortedData.slice(offset, offset + limit);

   // Menghitung parameter filter untuk dikirim ke PrintTemplate
   const beritaFilter = useMemo(
      () => ({
         "Urutan urut": sort === "tanggal_desc" ? "Terbaru" : "Terlama",
      }),
      [sort]
   );

   // Menghitung summary total artikel untuk footer print template
   const beritaSummary = useMemo(
      () => ({
         total: sortedData.length,
      }),
      [sortedData.length]
   );

   // Struktur data terfilter bersih tanpa batas pagination untuk dilempar ke PrintTemplate
   const dataToPrint = sortedData.map(item => ({
      ...item,
      judul: item.judul,
      deskripsi: stripTags(item.ringkasan || item.konten),
      tanggal_mulai: item.tanggal,
      lokasi: item.penulis || "Anonim",
   }));

   // Pemicu React To Print Resmi
   const handlePrint = useReactToPrint({
      contentRef: componentRef,
      documentTitle: `Laporan_Data_Berita_Masjid_${new Date().toISOString().slice(0, 10)}`,
   });

   // Handler Hapus Semua Berita
   const handleHapusSemua = () => {
      if (beritaData.length === 0) {
         Swal.fire({ title: "Gagal!", text: "Tidak ada data berita.", icon: "info", background: "#18181b", color: "#facc15", confirmButtonColor: "#eab308" });
         return;
      }

      Swal.fire({
         title: "Hapus Semua Berita?",
         text: "Seluruh artikel, berita, dan headline akan terhapus permanen.",
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
               html: 'Ketik <b class="text-red-400 select-all">hapusberitamasjid</b> untuk menghapus seluruh arsip berita:',
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
                  if (value !== "hapusberitamasjid") {
                     return "Kata kunci salah!";
                  }
               },
            }).then(async resInput => {
               if (resInput.isConfirmed && resInput.value === "hapusberitamasjid") {
                  try {
                     setLoading(true);
                     const deletePromises = beritaData.map(item => deleteDoc(doc(db, "berita", item.id)));
                     await Promise.all(deletePromises);
                     Swal.fire({ title: "Terhapus!", text: "Semua berita berhasil dibersihkan.", icon: "success", background: "#18181b", color: "#facc15", confirmButtonColor: "#eab308" });
                     setPageNow(1);
                  } catch (err) {
                     console.error(err);
                     setFlashError("Gagal menghapus seluruh arsip berita dari server.");
                  } finally {
                     setLoading(false);
                  }
               }
            });
         }
      });
   };

   // Handler Konfirmasi Hapus Data Satuan
   const konfirmasiHapus = id => {
      Swal.fire({
         title: "Hapus Berita?",
         text: "Berita yang dihapus tidak bisa dikembalikan.",
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
               await deleteDoc(doc(db, "berita", id));
               if (paginatedData.length === 1 && pageNow > 1) {
                  setPageNow(prev => prev - 1);
               }
               Swal.fire({ title: "Terhapus!", text: "Berita berhasil dihapus.", icon: "success", background: "#18181b", color: "#facc15", confirmButtonColor: "#eab308" });
            } catch (err) {
               console.error(err);
               setFlashError("Gagal menghapus berita dari database cloud.");
            }
         }
      });
   };

   if (loading) {
      return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-500 font-medium tracking-wide">Memuat Sistem Pusat Berita...</div>;
   }

   return (
      <div className="p-4 lg:p-6 max-w-[1500px] mx-auto bg-black text-zinc-200 min-h-screen">
         {/* INJEKSI STYLE MEDIA PRINT AGAR LAYAR SCREEN TERSEMBUNYI SAAT TOMBOL PRINT DIAKTIFKAN */}
         <style>{`
            @media print {
               .no-print-wrapper { display: none !important; }
               .print-template-wrapper { display: block !important; }
            }
         `}</style>

         {/* WRAPPER UTAMA SCREEN MONITOR */}
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
                     <span className="text-[#a1a1a1] font-semibold uppercase tracking-wider">Publikasi</span>
                     <span className="text-zinc-700">/</span>
                     <span className="text-zinc-400">Manajemen Berita</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">Pusat Informasi & Berita</h1>
                  <p className="text-sm text-zinc-500 mt-1">Kelola konten artikel warta jemaah dan headline informasi masjid</p>
               </div>
               <div className="flex flex-wrap sm:items-center gap-3">
                  <button onClick={handleHapusSemua} className="inline-flex items-center gap-2 whitespace-nowrap bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg text-sm transition font-medium shadow-sm">
                     <RiDeleteBinLine className="text-base" />
                     <span>Hapus Semua Berita</span>
                  </button>

                  <button onClick={handlePrint} className="inline-flex items-center gap-2 whitespace-nowrap bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black px-3 py-2 rounded-lg text-sm transition font-medium">
                     <RiPrinterLine className="text-base" />
                     <span>Print Laporan</span>
                  </button>
               </div>
            </div>

            {/* STATS (Sembunyikan saat di-print) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-6 print:hidden">
               {/* BERITA TERBARU */}
               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/20">
                  <div className="absolute -top-10 -right-10 w-28 h-28 bg-sky-500/10 blur-3xl rounded-full transition-all duration-500 group-hover:scale-125"></div>
                  <div className="relative z-10 flex items-start justify-between gap-4">
                     <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Berita Terbaru</p>
                        <h2 className="text-base font-semibold text-white leading-relaxed line-clamp-2 transition-all duration-300 group-hover:text-sky-100">{beritaData.length > 0 ? beritaData[0].judul : "-"}</h2>
                        <div className="flex items-center gap-1 text-xs text-sky-400 font-medium mt-4">
                           <span>Headline Aktif</span>
                           <RiArrowRightUpLine className="transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-sky-500/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-sky-500 group-hover:rotate-6 group-hover:scale-105">
                        <RiMegaphoneLine className="text-sky-400 text-2xl transition-all duration-300 group-hover:text-black group-hover:scale-110" />
                     </div>
                  </div>
               </div>

               {/* TOTAL BERITA */}
               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/20">
                  <div className="absolute bottom-0 left-0 w-28 h-28 bg-violet-500/10 blur-3xl rounded-full transition-all duration-500 group-hover:scale-125"></div>
                  <div className="relative z-10 flex items-start justify-between gap-4">
                     <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Total Berita</p>
                        <h2 className="text-4xl font-bold text-white tracking-tight leading-none transition-all duration-300 group-hover:scale-[1.03] origin-left">{loading ? "..." : beritaData.length}</h2>
                        <div className="flex items-center gap-1 text-xs text-violet-400 font-medium mt-4">
                           <span>Arsip Dipublikasikan</span>
                           <RiStackLine className="transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                        </div>
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-violet-500/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-violet-500 group-hover:-rotate-6 group-hover:scale-105">
                        <RiNewspaperLine className="text-violet-400 text-2xl transition-all duration-300 group-hover:text-black group-hover:scale-110" />
                     </div>
                  </div>
               </div>

               {/* TOTAL PENERBIT */}
               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/20">
                  <div className="absolute top-0 left-0 w-28 h-28 bg-pink-500/10 blur-3xl rounded-full transition-all duration-500 group-hover:scale-125"></div>
                  <div className="relative z-10 flex items-start justify-between gap-4">
                     <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Total Penerbit</p>
                        <h2 className="text-4xl font-bold text-white tracking-tight leading-none transition-all duration-300 group-hover:scale-[1.03] origin-left">{loading ? "..." : totalPenerbit}</h2>
                        <div className="flex items-center gap-1 text-xs text-pink-400 font-medium mt-4">
                           <span>Penulis Aktif</span>
                           <RiQuillPenLine className="transition-all duration-300 group-hover:-rotate-12 group-hover:translate-x-1" />
                        </div>
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-pink-500/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-pink-500 group-hover:rotate-6 group-hover:scale-105">
                        <RiUserStarLine className="text-pink-400 text-2xl transition-all duration-300 group-hover:text-black group-hover:scale-110" />
                     </div>
                  </div>
               </div>
            </div>

            {/* TABLE CARD CONTAINER */}
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl overflow-hidden">
               <div className="p-5 sm:p-6 border-b border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                     <h3 className="text-base font-semibold text-white flex items-center gap-3">
                        <RiNewspaperLine className="text-yellow-400 text-lg" />
                        Daftar Berita & Artikel
                     </h3>
                     <p className="text-[#a1a1a1] text-xs mt-1">Semua arsip data publikasi informasi jemaah</p>
                  </div>
                  <Link to="/admin/berita/tambah" className="inline-flex items-center gap-2 bg-yellow-500 text-black px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(234,179,8,0.2)] text-center">
                     <RiAddLine className="text-lg" />
                     <span>Tambah Artikel</span>
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
                        <option value="tanggal_desc">Berita Terbaru</option>
                        <option value="tanggal_asc">Berita Terlama</option>
                     </select>
                  </div>
               </div>

               {/* DATA TABLE WRAPPER */}
               <div className="w-full overflow-x-auto">
                  <table className="min-w-[800px] w-full">
                     <thead className="bg-[#060606] border-b border-[#1f1f1f]">
                        <tr>
                           <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1] w-16 hidden md:table-cell">No</th>
                           <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1] w-24">Gambar</th>
                           <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Judul & Ringkasan</th>
                           <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Penulis</th>
                           <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#a1a1a1]">Tanggal Rilis</th>
                           <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-[#a1a1a1] w-28">Aksi</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#1f1f1f]">
                        {paginatedData.length > 0 ? (
                           paginatedData.map((berita, index) => (
                              <tr key={berita.id} className="hover:bg-[#111111] transition duration-150">
                                 <td className="px-6 py-5 text-zinc-500 text-sm hidden md:table-cell">{offset + index + 1}</td>

                                 {/* KOLOM GAMBAR BARU */}
                                 <td className="px-6 py-5">
                                    <div className="h-28 w-48 rounded-lg overflow-hidden border border-[#1f1f1f] bg-[#0d0d0d] flex items-center justify-center shrink-0">
                                       {berita.imageUrl || berita.gambar ? (
                                          <img
                                             src={berita.imageUrl || berita.gambar}
                                             alt={berita.judul}
                                             className="w-full h-full object-cover"
                                             onError={e => {
                                                e.target.onerror = null;
                                                e.target.src = ""; // memicu render fallback icon jika url gambar corrupt
                                             }}
                                          />
                                       ) : (
                                          <RiNewspaperLine className="text-zinc-600 text-lg" />
                                       )}
                                    </div>
                                 </td>

                                 <td className="px-6 py-5 text-sm">
                                    <div className="flex items-center gap-2 font-semibold text-white">
                                       <span>{berita.judul}</span>
                                    </div>
                                    <div className="text-[#a1a1a1] text-xs mt-1 max-w-sm truncate">{stripTags(berita.ringkasan || berita.konten)}</div>
                                 </td>
                                 <td className="px-6 py-5 text-zinc-300 text-sm whitespace-nowrap">{berita.penulis || "Anonim"}</td>
                                 <td className="px-6 py-5 text-white text-sm whitespace-nowrap">
                                    <span>{formatTanggalWaktu(berita.tanggal)}</span>
                                 </td>
                                 <td className="px-6 py-5">
                                    <div className="flex justify-center gap-2">
                                       <Link to={`/admin/berita/edit/${berita.id}`} className="w-9 h-9 flex items-center justify-center border border-[#1f1f1f] text-zinc-400 hover:text-white rounded-md hover:bg-[#1c1c1f] transition">
                                          <RiEditLine className="text-base" />
                                       </Link>
                                       <button onClick={() => konfirmasiHapus(berita.id)} className="w-9 h-9 flex items-center justify-center border border-[#1f1f1f] text-zinc-400 hover:text-red-400 rounded-md hover:bg-[#1c1c1f] transition">
                                          <RiDeleteBinLine className="text-base" />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan="6" className="px-6 py-16 text-center text-[#a1a1a1]">
                                 <div className="flex flex-col items-center justify-center gap-3">
                                    <RiInboxLine className="text-4xl opacity-20" />
                                    <p className="text-sm">Belum ada arsip data berita masjid</p>
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
                        Menampilkan {paginatedData.length} dari {totalData} berita
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

         {/* KONTAINER UTAMA PEMICU PRINT TEMPLATE */}
         <div className="hidden print-template-wrapper">
            <PrintTemplate ref={componentRef} tipe="BERITA" data={dataToPrint} summary={beritaSummary} filter={beritaFilter} />
         </div>
      </div>
   );
}
