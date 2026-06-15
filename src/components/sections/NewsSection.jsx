import { motion, useMotionTemplate, useMotionValue, AnimatePresence, useTransform, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { Newspaper, ArrowLeft, ArrowRight, CalendarDays, Bookmark } from "lucide-react";

// 🚀 Hubungkan ke konfigurasi Firebase Firestore lu
import { db } from "../../config/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

function InteractiveNewsCard({ item, index, isFeatured, dark }) {
   let mouseX = useMotionValue(0);
   let mouseY = useMotionValue(0);

   function handleMouseMove({ currentTarget, clientX, clientY }) {
      let { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
   }

   const formatTanggal = tanggal => {
      if (!tanggal) return "-";
      // Handle jika tanggal berbentuk Firestore Timestamp atau String ISO biasa
      const dateObj = tanggal?.seconds ? new Date(tanggal.seconds * 1000) : new Date(tanggal);
      return dateObj.toLocaleDateString("id-ID", {
         day: "numeric",
         month: "long",
         year: "numeric",
      });
   };

   return (
      <motion.div
         layout
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, scale: 0.98 }}
         transition={{ duration: 0.4, ease: "easeInOut" }}
         whileHover={{ y: -4 }}
         onMouseMove={handleMouseMove}
         className={`group relative overflow-hidden rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-500 w-full z-20
            ${dark ? "bg-[#0B0F24]/60 backdrop-blur-md border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]" : "bg-white border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.02)]"}
            ${isFeatured ? "md:col-span-2 lg:col-span-2 row-span-2 min-h-[440px] sm:min-h-[480px]" : "min-h-[380px]"}
         `}>
         {/* Spotlight Glow Effect */}
         <motion.div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 z-10"
            style={{
               background: useMotionTemplate`
                  radial-gradient(
                     400px circle at ${mouseX}px ${mouseY}px,
                     ${dark ? "rgba(95, 168, 255, 0.08)" : "rgba(29, 95, 208, 0.05)"},
                     transparent 80%
                  )
               `,
            }}
         />

         <div className="w-full flex flex-col gap-4">
            <div
               className={`relative w-full overflow-hidden rounded-xl transition-all duration-500
               ${dark ? "bg-slate-900" : "bg-slate-100"}
               ${isFeatured ? "h-48 sm:h-56 md:h-64" : "h-40"}
            `}>
               {/* 💡 TRICK: Menggunakan item.gambar langsung sebagai full URL Image dari Firestore text field */}
               <img src={item.gambar || "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000"} alt={item.judul} className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500 ease-out" />

               <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-lg backdrop-blur-md text-[10px] font-semibold tracking-wider shadow-sm flex items-center gap-1.5 transition-colors duration-500 ${dark ? "bg-slate-950/80 text-white" : "bg-slate-900/80 text-white"}`}>
                  <CalendarDays size={11} className="text-[#5FA8FF]" />
                  <span>{formatTanggal(item.tanggal)}</span>
               </div>

               <div className={`absolute top-3 right-3 p-1.5 rounded-lg backdrop-blur-md transition-colors duration-300 shadow-sm ${dark ? "bg-slate-950/80 text-slate-400 hover:text-[#5FA8FF]" : "bg-white/90 text-slate-400 group-hover:text-[#1D5FD0]"}`}>
                  <Bookmark size={13} />
               </div>
            </div>

            <div className="space-y-2">
               <h3
                  className={`font-extrabold tracking-tight leading-snug transition-colors duration-300 line-clamp-2
                  ${dark ? "text-white group-hover:text-[#5FA8FF]" : "text-slate-900 group-hover:text-[#1D5FD0]"}
                  ${isFeatured ? "text-xl sm:text-2xl" : "text-base"}
               `}>
                  {item.judul}
               </h3>
               <p className={`text-xs font-normal leading-relaxed line-clamp-2 sm:line-clamp-3 transition-colors duration-500 ${dark ? "text-slate-400" : "text-slate-500"}`}>{item.isi_berita?.replace(/<[^>]*>?/gm, "")}</p>
            </div>
         </div>

         <div className={`mt-4 pt-4 flex items-center justify-between w-full transition-colors duration-500 ${dark ? "border-t border-white/5" : "border-t border-slate-100"}`}>
            <span className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-500 ${dark ? "text-slate-500" : "text-slate-400"}`}>WARTA MASJID</span>
            <a href={`/berita/${item.id}`} className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 shadow-sm group-hover:rotate-45 ${dark ? "bg-slate-900 text-white hover:bg-[#5FA8FF]" : "bg-slate-100 text-slate-800 hover:bg-[#1D5FD0] hover:text-white"}`}>
               <ArrowLeft className="scale-x-[-1]" size={14} />
            </a>
         </div>
      </motion.div>
   );
}

export default function NewsSection({ dark }) {
   const [news, setNews] = useState([]);
   const [loading, setLoading] = useState(true);
   const [startIndex, setStartIndex] = useState(0);

   const { scrollY } = useScroll();

   // Mengambil data Berita / Warta secara realtime dari Firestore
   useEffect(() => {
      const qBerita = query(collection(db, "berita"), orderBy("tanggal", "desc"));

      const unsubBerita = onSnapshot(
         qBerita,
         snapshot => {
            const dataBerita = snapshot.docs.map(doc => ({
               id: doc.id,
               ...doc.data(),
            }));
            setNews(dataBerita);
            setLoading(false);
         },
         error => {
            console.error("Firebase News Error:", error);
            setLoading(false);
         }
      );

      return () => unsubBerita();
   }, []);

   const handleNext = () => {
      if (news.length === 0) return;
      setStartIndex(prevIndex => (prevIndex + 1) % news.length);
   };

   const handlePrev = () => {
      if (news.length === 0) return;
      setStartIndex(prevIndex => (prevIndex - 1 + news.length) % news.length);
   };

   const getVisibleNews = () => {
      if (news.length === 0) return [];
      let visibleItems = [];
      for (let i = 0; i < Math.min(3, news.length); i++) {
         const targetIndex = (startIndex + i) % news.length;
         visibleItems.push(news[targetIndex]);
      }
      return visibleItems;
   };

   const visibleNews = getVisibleNews();
   const yTextBgNews = useTransform(scrollY, [1000, 2500], [50, 150]);

   return (
      <section id="berita" className="relative min-h-screen w-full py-20 sm:py-28 overflow-hidden flex flex-col justify-center transition-colors duration-500">
         {/* VISUAL LAYERING: TEXT BG SOLID */}
         <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
            <div
               className="absolute right-0 top-[2%] font-black text-[8rem] md:text-[12rem] tracking-tighter uppercase leading-none select-none hidden lg:block"
               style={{
                  WebkitTextStroke: dark ? "2px rgba(29, 95, 208, 0.2)" : "2px #1D5FD0",
                  textFillColor: "transparent",
               }}>
               <motion.h1 style={{ y: yTextBgNews }} className={`text-[13vw] font-black tracking-tighter uppercase whitespace-nowrap text-center font-sans transition-colors duration-500 opacity-[0.08] dark:opacity-[0.12] ${dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"}`}>
                  Berita
               </motion.h1>
            </div>

            {/* Efek Gradasi Blur Pendukung */}
            <div className={`absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full blur-3xl z-0 transition-colors duration-500 ${dark ? "bg-[#1D5FD0]/5" : "bg-[#1D5FD0]/10"}`} />
            <div className={`absolute bottom-[5%] left-[-5%] w-[400px] h-[400px] rounded-full blur-3xl z-0 transition-colors duration-500 ${dark ? "bg-[#5FA8FF]/4" : "bg-[#5FA8FF]/8"}`} />
         </div>

         {/* FRONT CONTAINER */}
         <div className="relative z-10 container mx-auto max-w-6xl px-4 md:px-8 w-full">
            {/* HEADER AREA CONTAINER */}
            <div
               className={`relative w-full rounded-3xl backdrop-blur-md p-6 sm:p-10 mb-10 shadow-[0_8px_32px_rgba(15,23,42,0.02)] flex flex-col md:flex-row md:items-center md:justify-between gap-6 overflow-hidden transition-all duration-500
               ${dark ? "bg-[#0B0F24]/40 border border-white/5" : "bg-white/50 border border-white/60"}
            `}>
               <div className="absolute top-0 left-10 w-20 h-[3px] bg-[#1D5FD0]" />

               <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="flex flex-col items-start gap-3 max-w-2xl z-10">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#1D5FD0] text-white text-[10px] font-bold tracking-widest uppercase shadow-sm">
                     <Newspaper size={11} />
                     <span>Warta Masjid</span>
                  </div>
                  <h2 className={`text-3xl sm:text-4xl font-black tracking-tight uppercase leading-none transition-colors duration-500 ${dark ? "text-white" : "text-slate-900"}`}>
                     Warta & <span className="text-[#1D5FD0]">Informasi</span> Masjid
                  </h2>
                  <p className={`text-xs sm:text-sm font-normal leading-relaxed mt-1 transition-colors duration-500 ${dark ? "text-slate-400" : "text-slate-500"}`}>Media informasi resmi seputar agenda kegiatan, laporan transparansi, pengumuman berkala, serta rekam jejak dokumentasi aktivitas sosial keagamaan di lingkungan ekosistem masjid kita.</p>
               </motion.div>

               <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }} className="flex flex-col items-start justify-end gap-4 z-10 shrink-0">
                  {news.length > 1 && (
                     <div className="flex items-center gap-2">
                        <button onClick={handlePrev} className={`w-11 h-11 rounded-xl border flex items-center justify-center active:scale-95 transition-all duration-300 shadow-sm cursor-pointer ${dark ? "border-white/10 bg-slate-900 text-white hover:bg-[#1D5FD0]" : "border-slate-200 bg-white text-slate-800 hover:bg-[#1D5FD0] hover:text-white"}`}>
                           <ArrowLeft size={16} />
                        </button>
                        <button onClick={handleNext} className={`w-11 h-11 rounded-xl border flex items-center justify-center active:scale-95 transition-all duration-300 shadow-sm cursor-pointer ${dark ? "border-white/10 bg-slate-900 text-white hover:bg-[#1D5FD0]" : "border-slate-200 bg-white text-slate-800 hover:bg-[#1D5FD0] hover:text-white"}`}>
                           <ArrowRight size={16} />
                        </button>
                     </div>
                  )}
               </motion.div>
            </div>

            {/* MAIN BENTO GRID */}
            {loading ? (
               <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
                  <div className="w-6 h-6 border-2 border-[#1D5FD0] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Loading...</span>
               </div>
            ) : news.length === 0 ? (
               <div className={`max-w-md mx-auto p-8 text-center rounded-2xl border shadow-sm flex flex-col items-center transition-colors duration-500 ${dark ? "bg-[#0B0F24]/40 border-white/5" : "bg-white border-slate-200"}`}>
                  <div className="p-3 rounded-xl bg-slate-100 text-slate-400 mb-4">
                     <Newspaper size={22} />
                  </div>
                  <h3 className={`text-sm font-bold mb-1 ${dark ? "text-white" : "text-slate-900"}`}>Belum Ada Publikasi</h3>
                  <p className="text-slate-400 text-xs font-normal">Seluruh berita sedang dalam kurasi editorial.</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-6">
                  <AnimatePresence mode="popLayout">
                     {visibleNews.map((item, index) => (
                        <InteractiveNewsCard key={item.id} item={item} index={index} isFeatured={index === 0} dark={dark} />
                     ))}
                  </AnimatePresence>
               </div>
            )}
         </div>
      </section>
   );
}
