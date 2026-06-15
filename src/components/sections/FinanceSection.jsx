import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { FaArrowDown, FaArrowUp, FaWallet, FaSearch, FaSync } from "react-icons/fa";
import { Sparkles } from "lucide-react";

// 🚀 Hubungkan ke modul Firebase Firestore bawaan lu
import { db } from "../../config/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function FinanceSection({ dark }) {
   const { scrollY } = useScroll();

   const [summary, setSummary] = useState({ masuk: 0, keluar: 0, saldo: 0 });
   const [transactions, setTransactions] = useState([]);
   const [loading, setLoading] = useState(true);

   // State Filter Kontrol
   const [searchQuery, setSearchQuery] = useState("");
   const [typeFilter, setTypeFilter] = useState("semua"); // semua, masuk, keluar

   // 1. useEffect untuk Mengambil Data Transaksi Secara Realtime dari Firestore
   useEffect(() => {
      // Query collection "kas" dan urutkan berdasarkan field "tanggal" dari yang terbaru
      const qKas = query(collection(db, "kas"), orderBy("tanggal", "desc"));

      const unsubKas = onSnapshot(
         qKas,
         snapshot => {
            let totalMasuk = 0;
            let totalKeluar = 0;

            const dataMutasi = snapshot.docs.map(doc => {
               const data = doc.data();
               const jumlah = Number(data.jumlah || 0);

               // Kalkulasi akumulasi total untuk Ringkasan Card secara dynamic
               if (data.jenis === "masuk") {
                  totalMasuk += jumlah;
               } else if (data.jenis === "keluar") {
                  totalKeluar += jumlah;
               }

               return {
                  id: doc.id,
                  ...data,
                  jumlah, // pastikan tipe datanya number
               };
            });

            // Update State Ringkasan (Summary)
            setSummary({
               masuk: totalMasuk,
               keluar: totalKeluar,
               saldo: totalMasuk - totalKeluar,
            });

            // Update State List Transaksi
            setTransactions(dataMutasi);
            setLoading(false);
         },
         error => {
            console.error("Firebase Finance Error:", error);
            setLoading(false);
         }
      );

      // Cleanup listener pas komponen di-unmount
      return () => unsubKas();
   }, []);

   // Animasi parallax text background disesuaikan agar posisinya stabil di area bawah container
   const yTextBgFinance = useTransform(scrollY, [1000, 2500], [50, 150]);

   const formatRupiah = number => {
      return new Intl.NumberFormat("id-ID").format(Number(number));
   };

   const formatTanggal = tanggal => {
      if (!tanggal) return "-";
      return new Date(tanggal).toLocaleDateString("id-ID", {
         day: "numeric",
         month: "short",
         year: "numeric",
      });
   };

   // 2. Logika Filter Multi-Kriteria dioptimasi dengan useMemo
   const filteredTransactions = useMemo(() => {
      const dataCopy = transactions || [];
      return dataCopy.filter(item => {
         const keteranganSafe = item.keterangan ? item.keterangan.toLowerCase() : "";
         const matchesSearch = keteranganSafe.includes(searchQuery.toLowerCase());
         const matchesType = typeFilter === "semua" || item.jenis === typeFilter;
         return matchesSearch && matchesType;
      });
   }, [transactions, searchQuery, typeFilter]);

   return (
      <section id="kas" className="relative min-h-screen w-full py-24 sm:py-32 overflow-hidden flex flex-col justify-center transition-colors duration-500">
         {/* Background Glow Deco */}
         <div className="absolute inset-0 z-0 pointer-events-none">
            <div className={`absolute top-[10%] left-[-5%] w-[600px] h-[600px] rounded-full blur-[130px] transition-colors duration-500 ${dark ? "bg-[#1D5FD0]/3" : "bg-[#1D5FD0]/5"}`} />
            <div className={`absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-500 ${dark ? "bg-[#5FA8FF]/2" : "bg-[#5FA8FF]/4"}`} />
         </div>

         {/* Container Utama disesuaikan max-w-7xl agar simetris */}
         <div className="relative z-10 container mx-auto max-w-7xl px-6 md:px-12 w-full space-y-16">
            {/* HEADING AREA */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} viewport={{ once: true }} className="flex flex-col items-center text-center max-w-3xl mx-auto gap-4">
               <div
                  className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.25em] uppercase shadow-sm border transition-colors duration-500
                  ${dark ? "bg-slate-900 border-white/5 text-[#5FA8FF]" : "bg-[#DFF1FF] border-[#5FA8FF]/10 text-[#1D5FD0]"}
               `}>
                  <Sparkles size={12} className="animate-pulse" />
                  <span>Transparansi Dana Realtime</span>
               </div>

               <h2 className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase transition-colors duration-500 ${dark ? "text-white" : "text-[#0F172A]"}`}>
                  Arus Kas <span className="text-[#1D5FD0]">Amanah Jemaah</span>
               </h2>
               <div className="w-12 h-[3px] bg-[#1D5FD0] rounded-full my-1" />
               <p className={`text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-xl transition-colors duration-500 ${dark ? "text-slate-400" : "text-[#94A3B8]"}`}>Klik pada kartu ringkasan untuk memfilter riwayat transaksi secara langsung dan cepat.</p>
            </motion.div>

            {/* CONTAINER UTAMA KONTEN */}
            <div className="relative w-full">
               {/* TEXT BACKGROUND PARALLAX */}
               <div className="absolute top-[-30%] transform flex items-center justify-center pointer-events-none select-none z-0">
                  <motion.h1 style={{ y: yTextBgFinance }} className={`text-[13vw] font-black tracking-tighter uppercase whitespace-nowrap text-center font-sans transition-colors duration-500 opacity-[0.08] dark:opacity-[0.12] ${dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"}`}>
                     MUTASI KAS
                  </motion.h1>
               </div>

               {/* GRID UTAMA */}
               <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
                  {/* KOLOM KIRI: TIGA KARTU INTERAKTIF (4 Kolom) */}
                  <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 w-full">
                     {/* Card Pemasukan */}
                     <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setTypeFilter(typeFilter === "masuk" ? "semua" : "masuk")}
                        className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden select-none 
                        ${typeFilter === "masuk" ? (dark ? "bg-slate-900 border-emerald-500 shadow-md ring-2 ring-emerald-500/20" : "bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20") : dark ? "bg-[#0B0F24]/60 backdrop-blur-md border-white/5 hover:bg-slate-900" : "bg-white border-[#E2E8F0] shadow-sm hover:bg-slate-50"}`}>
                        <div className="flex lg:items-center justify-between gap-4">
                           <div className="min-w-0">
                              <span className={`text-[9px] font-black tracking-wider block uppercase mb-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>Total Pemasukan</span>
                              <h3 className="text-lg sm:text-xl lg:text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400 truncate">Rp{formatRupiah(summary.masuk)}</h3>
                           </div>
                           <motion.div animate={{ scale: typeFilter === "masuk" ? 1.1 : 1 }} className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 transition-colors ${typeFilter === "masuk" ? "bg-emerald-500 text-white border-emerald-500" : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50"}`}>
                              <FaArrowDown />
                           </motion.div>
                        </div>
                        {typeFilter === "masuk" && <motion.div layoutId="activeTabIndicator" className="absolute right-0 bottom-0 w-3 h-3 bg-emerald-500 rounded-tl-full" />}
                     </motion.div>

                     {/* Card Pengeluaran */}
                     <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setTypeFilter(typeFilter === "keluar" ? "semua" : "keluar")}
                        className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden select-none 
                        ${typeFilter === "keluar" ? (dark ? "bg-slate-900 border-rose-500 shadow-md ring-2 ring-rose-500/20" : "bg-white border-rose-500 shadow-md ring-2 ring-rose-500/20") : dark ? "bg-[#0B0F24]/60 backdrop-blur-md border-white/5 hover:bg-slate-900" : "bg-white border-[#E2E8F0] shadow-sm hover:bg-slate-50"}`}>
                        <div className="flex lg:items-center justify-between gap-4">
                           <div className="min-w-0">
                              <span className={`text-[9px] font-black tracking-wider block uppercase mb-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>Total Pengeluaran</span>
                              <h3 className="text-lg sm:text-xl lg:text-2xl font-mono font-black text-rose-600 dark:text-rose-400 truncate">Rp{formatRupiah(summary.keluar)}</h3>
                           </div>
                           <motion.div animate={{ scale: typeFilter === "keluar" ? 1.1 : 1 }} className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 transition-colors ${typeFilter === "keluar" ? "bg-rose-500 text-white border-rose-500" : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50"}`}>
                              <FaArrowUp />
                           </motion.div>
                        </div>
                        {typeFilter === "keluar" && <motion.div layoutId="activeTabIndicator" className="absolute right-0 bottom-0 w-3 h-3 bg-rose-500 rounded-tl-full" />}
                     </motion.div>

                     {/* Card Saldo Bersih */}
                     <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setTypeFilter("semua")}
                        className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden select-none 
                        ${typeFilter === "semua" ? (dark ? "bg-slate-900 border-amber-400 shadow-md ring-2 ring-amber-500/10" : "bg-white border-amber-400 shadow-md ring-2 ring-amber-500/10") : dark ? "bg-[#0B0F24]/60 backdrop-blur-md border-white/5 hover:bg-slate-900" : "bg-white border-[#E2E8F0] shadow-sm hover:bg-slate-50"}`}>
                        <div className="flex lg:items-center justify-between gap-4">
                           <div className="min-w-0">
                              <span className={`text-[9px] font-black tracking-wider block uppercase mb-1 ${dark ? "text-amber-500" : "text-amber-800"}`}>Sisa Saldo Kas</span>
                              <h3 className="text-xl sm:text-xl lg:text-2xl font-mono font-black text-amber-600 dark:text-amber-400 truncate">Rp{formatRupiah(summary.saldo)}</h3>
                           </div>
                           <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg flex-shrink-0 shadow-sm transition-colors ${typeFilter === "semua" ? "bg-amber-500 text-white border-amber-500" : "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50"}`}>
                              <FaWallet />
                           </div>
                        </div>
                     </motion.div>
                  </div>

                  {/* KOLOM KANAN: LIVE LEDGER BOARD (8 Kolom) */}
                  <div
                     className={`lg:col-span-8 border rounded-2xl shadow-sm overflow-hidden flex flex-col w-full h-[440px] transition-all duration-500
                     ${dark ? "bg-[#0B0F24]/60 backdrop-blur-md border-white/5" : "bg-white border-[#E2E8F0]"}
                  `}>
                     {/* BAR KONTROL INTERAKTIF */}
                     <div className={`p-4 border-b flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between transition-colors duration-500 ${dark ? "border-white/5 bg-slate-900/60" : "border-slate-200/60 bg-slate-50/60"}`}>
                        {/* Input Pencarian */}
                        <div className="relative flex-1 min-w-0">
                           <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xs" />
                           <input
                              type="text"
                              placeholder="Ketik kata kunci deskripsi..."
                              value={searchQuery}
                              onChange={e => setSearchQuery(e.target.value)}
                              className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs font-semibold outline-none transition duration-300
                                 ${dark ? "bg-[#0F172A]/80 border-white/5 text-[#E2E8F0] focus:border-[#5FA8FF]" : "bg-white border-slate-200 text-[#0F172A] focus:border-[#1D5FD0]"}
                              `}
                           />
                        </div>

                        {/* Indikator Filter Aktif / Reset Quick Button */}
                        {typeFilter !== "semua" && (
                           <motion.button
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setTypeFilter("semua")}
                              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase transition-colors flex-shrink-0 cursor-pointer
                                 ${dark ? "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700" : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200"}
                              `}>
                              <FaSync className="text-[8px]" /> Reset Filter
                           </motion.button>
                        )}
                     </div>

                     {/* AREA TABEL MUTASI DENGAN ANIMASI ANIMATEPRESENCE */}
                     <div className="flex-1 overflow-auto custom-scrollbar">
                        <table className="w-full border-collapse">
                           <thead
                              className={`sticky top-0 z-20 backdrop-blur border-b text-[10px] uppercase font-black tracking-wider transition-colors duration-500
                              ${dark ? "bg-slate-900/95 border-white/5 text-slate-500" : "bg-slate-50/95 border-slate-200 text-slate-400"}
                           `}>
                              <tr>
                                 <th className="px-4 py-2.5 text-left">Tanggal</th>
                                 <th className="px-4 py-2.5 text-left">Keterangan</th>
                                 <th className="px-4 py-2.5 text-right">Nominal</th>
                              </tr>
                           </thead>
                           <tbody>
                              {loading ? (
                                 <tr>
                                    <td colSpan="3" className="py-16 text-center text-xs font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                                       Menghubungkan ke Ledger Utama...
                                    </td>
                                 </tr>
                              ) : filteredTransactions.length > 0 ? (
                                 <AnimatePresence mode="popLayout">
                                    {filteredTransactions.map(item => (
                                       <motion.tr
                                          key={item.id}
                                          layout
                                          initial={{ opacity: 0, y: 8 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, x: -10, scale: 0.98 }}
                                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                          className={`border-b transition-colors duration-150 text-xs
                                             ${dark ? "hover:bg-slate-900/60 border-white/5 text-slate-300" : "hover:bg-slate-50 border-slate-100 text-slate-700"}
                                          `}>
                                          <td className="px-4 py-3 text-slate-400 dark:text-slate-500 font-mono font-bold whitespace-nowrap">{formatTanggal(item.tanggal)}</td>
                                          <td className="px-4 py-3 font-semibold leading-snug">{item.keterangan}</td>
                                          <td className={`px-4 py-3 text-right font-mono font-black whitespace-nowrap ${item.jenis === "masuk" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                                             {item.jenis === "masuk" ? "+ " : "- "}Rp{formatRupiah(item.jumlah)}
                                          </td>
                                       </motion.tr>
                                    ))}
                                 </AnimatePresence>
                              ) : (
                                 <tr>
                                    <td colSpan="3" className="py-16 text-center text-xs font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                                       Data kosong atau filter tidak cocok.
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     </div>

                     {/* CONTROL BAR BAWAH */}
                     <div
                        className={`px-4 py-2.5 border-t flex items-center justify-between text-[10px] font-mono font-bold uppercase transition-colors duration-500
                        ${dark ? "bg-slate-900/60 border-white/5 text-slate-500" : "bg-slate-50 border-slate-200/60 text-slate-400"}
                     `}>
                        <span>
                           Mode Filter: <b className="text-[#1D5FD0] dark:text-[#5FA8FF]">{typeFilter}</b>
                        </span>
                        <span>Ditemukan: {filteredTransactions.length} Baris</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* FOOTER CAPSULE */}
            <div className="relative z-10 mt-8 flex justify-center w-full">
               <div
                  className={`px-4 py-2 rounded-full border text-[9px] tracking-[0.15em] font-black uppercase flex items-center gap-1.5 shadow-sm transition-colors duration-500
                  ${dark ? "bg-slate-900 border-white/5 text-slate-500" : "bg-white border-slate-200 text-slate-400"}
               `}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D5FD0] dark:bg-[#5FA8FF]" /> Validated System Ledger
               </div>
            </div>
         </div>
      </section>
   );
}
