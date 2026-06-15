import React, { useRef, useEffect, useState, useContext } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Compass, Calendar, BookOpen, ArrowDown } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import masjidImg from "@/assets/img/masjid.png";

export default function HeroSection() {
   const containerRef = useRef(null);

   // 1. Ambil target scroll dari containerRef agar tracking presisi di layar desktop/mobile
   const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start start", "end start"],
   });

   const heroImage = masjidImg;

   // SINKRONISASI TEMA GLOBAL
   const { dark } = useContext(ThemeContext);

   const [contentData] = useState({
      titlePrimary: "MASJID",
      titleSecondary: "AR-RAZZAQ",
      tagline: "EKOSISTEM DIGITAL MASJID",
      description: "Sebuah ruang kontemplasi digital yang menyatukan kedalaman nilai spiritual dengan kesederhanaan akses modern. Dirancang secara arsitektural untuk menghadirkan ketenangan visual bagi jamaah.",
      featuredEvent: "Kajian Akbar Syawal",
      eventTime: "Ahad, 09:00 WIB",
      dailyVerse: "Al-Baqarah: 152",
      verseExcerpt: "Ingatlah kepada-Ku, Aku pun ingat kepadamu...",
   });

   const [isDesktop, setIsDesktop] = useState(false);
   useEffect(() => {
      setIsDesktop(window.innerWidth > 1024);
      const handleResize = () => setIsDesktop(window.innerWidth > 1024);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   // 2. Gunakan scrollYProgress (0 hingga 1) dikombinasikan dengan useSpring agar pergerakan super halus (smooth)
   const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };

   const yImageRaw = useTransform(scrollYProgress, [0, 1], [0, isDesktop ? -80 : 0]);
   const yTextBgRaw = useTransform(scrollYProgress, [0, 1], [0, isDesktop ? 120 : 0]);
   const fadeOutRaw = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

   // Mencegah patah-patah saat scroll dimainkan dengan cepat
   const yImage = useSpring(yImageRaw, springConfig);
   const yTextBg = useSpring(yTextBgRaw, springConfig);
   const fadeOut = useSpring(fadeOutRaw, springConfig);

   return (
      <section id="beranda" ref={containerRef} className={`relative min-h-screen w-full overflow-hidden flex flex-col justify-between pt-32 pb-12 transition-colors duration-500 ${dark ? "bg-[#030712] text-[#E2E8F0]" : "bg-[#F8FBFF] text-[#0F172A]"}`}>
         {/* LAPISAN LATAR BELAKANG: GRID PATTERN & GRADASI ABSTRAK */}
         <div className="absolute inset-0 z-0 pointer-events-none">
            {/* CANVAS GRID MASTER LAYER (SINKRON 32px) */}
            <div
               className="absolute inset-0 transition-opacity duration-500"
               style={{
                  backgroundImage: dark ? `linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px)` : `linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px)`,
                  backgroundSize: "32px 32px",
               }}
            />
            {/* GRID MASKING */}
            <div className={`absolute inset-0 ${dark ? "bg-gradient-to-b from-[#030712] via-transparent to-[#030712] opacity-60" : "bg-gradient-to-b from-[#F8FBFF] via-transparent to-[#F8FBFF] opacity-60"}`} />

            {/* BLUR EFFECT */}
            <div className={`absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-500 ${dark ? "bg-[#5FA8FF]/4" : "bg-[#5FA8FF]/5"}`} />
            <div className={`absolute bottom-0 right-0 w-[40vw] h-full transition-colors duration-500 ${dark ? "bg-[#1E293B]/20" : "bg-[#DFF1FF]/20"}`} />
         </div>

         {/* WADAH UTAMA INTERAKTIF */}
         <div className="relative z-10 container mx-auto max-w-7xl px-6 md:px-12 w-full flex-grow flex flex-col justify-between">
            {/* LAPISAN 1: TIPOGRAFI LATAR BELAKANG RAKSASA */}
            <motion.div style={{ y: yTextBg, opacity: fadeOut }} className="absolute right-6 top-24 lg:top-12 pointer-events-none select-none z-0 hidden sm:block">
               {/* Ditambahkan kelas font-sans agar menggunakan font baru dari index.css */}
               <h1 className={`text-[16vw] font-sans font-black tracking-tighter leading-none text-right transition-colors duration-500 opacity-[0.04] ${dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"}`}>AR RAZZAQ</h1>
            </motion.div>

            {/* LAPISAN 2: GRID KONTEN INTERAKTIF */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16 lg:gap-4 items-stretch w-full my-auto z-10">
               {/* KIRI: IDENTITAS, PERNYATAAN, & KARTU INTERAKTIF BERTINGKAT */}
               <div className="flex flex-col justify-center gap-10 max-w-2xl">
                  {/* Info Header */}
                  <motion.div style={{ opacity: fadeOut }} className="flex flex-col gap-3">
                     <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full transition-colors duration-500 ${dark ? "bg-[#5FA8FF]" : "bg-[#1D5FD0]"}`} />
                        <span className={`text-[11px] font-bold tracking-[0.3em] uppercase transition-colors duration-500 ${dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"}`}>{contentData.tagline}</span>
                     </div>
                     <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tight transition-colors duration-500 ${dark ? "text-white" : "text-[#0F172A]"}`}>
                        {contentData.titlePrimary} {contentData.titleSecondary}
                     </h2>
                  </motion.div>

                  {/* Deskripsi Utama */}
                  <p className={`text-base md:text-xl font-light leading-relaxed tracking-wide max-w-xl transition-colors duration-500 ${dark ? "text-[#94A3B8]" : "text-[#475569]"}`}>{contentData.description}</p>

                  {/* Tombol Aksi Utama */}
                  <div>
                     <motion.button
                        onClick={() => {
                           document.getElementById("profil")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        whileHover={{
                           scale: 1.02,
                           backgroundColor: dark ? "#5FA8FF" : "#1D5FD0",
                           color: "#FFF",
                           borderColor: dark ? "#5FA8FF" : "#1D5FD0",
                        }}
                        whileTap={{ scale: 0.98 }}
                        className={` cursor-target flex items-center gap-4 px-7 py-4 rounded-xl border-2 text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-sm ${dark ? "border-[#5FA8FF] text-[#5FA8FF] bg-transparent" : "border-[#1D5FD0] text-[#1D5FD0] bg-white"}`}>
                        Masuki Ruang Digital
                        <ArrowRight size={16} />
                     </motion.button>
                  </div>

                  {/* KARTU BENTO BERTINGKAT */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 w-full">
                     {/* Kartu 1: Agenda */}
                     <motion.div whileHover={{ y: -8, borderColor: dark ? "#5FA8FF" : "#1D5FD0", boxShadow: dark ? "0 20px 30px -10px rgba(95, 168, 255, 0.15)" : "0 20px 30px -10px rgba(29, 95, 208, 0.1)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className={`p-6 rounded-2xl border flex flex-col justify-between h-36 cursor-pointer group transition-all duration-500 ${dark ? "bg-slate-900/50 backdrop-blur-sm border-white/5 shadow-none" : "bg-white border-[#E2E8F0] shadow-[0_4px_12px_rgba(15,23,42,0.02)]"}`}>
                        <div className="flex justify-between items-center">
                           <div className={`p-2.5 rounded-xl transition-colors duration-500 ${dark ? "bg-slate-800 text-[#5FA8FF]" : "bg-[#DFF1FF] text-[#1D5FD0]"}`}>
                              <Calendar size={18} />
                           </div>
                           <span className={`text-[9px] font-bold tracking-widest uppercase transition-colors duration-500 ${dark ? "text-slate-500 group-hover:text-[#5FA8FF]" : "text-[#94A3B8] group-hover:text-[#1D5FD0]"}`}>AGENDA TERDEKAT</span>
                        </div>
                        <div>
                           <span className={`text-[10px] font-semibold block mb-1 transition-colors duration-500 ${dark ? "text-[#5FA8FF]" : "text-[#5FA8FF]"}`}>{contentData.eventTime}</span>
                           <h3 className={`text-base font-bold transition-colors duration-500 ${dark ? "text-slate-200" : "text-[#0F172A]"}`}>{contentData.featuredEvent}</h3>
                        </div>
                     </motion.div>

                     {/* Kartu 2: Ayat Hari Ini */}
                     <motion.div whileHover={{ y: -8, borderColor: dark ? "#1D5FD0" : "#5FA8FF", boxShadow: dark ? "0 20px 30px -10px rgba(29, 95, 208, 0.15)" : "0 20px 30px -10px rgba(95, 168, 255, 0.1)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className={`p-6 rounded-2xl border flex flex-col justify-between h-36 cursor-pointer sm:translate-y-4 group backdrop-blur-sm transition-all duration-500 ${dark ? "bg-slate-900/20 border-white/5" : "bg-[#DFF1FF]/30 border-[#E2E8F0]"}`}>
                        <div className="flex justify-between items-center">
                           <div className={`p-2.5 rounded-xl shadow-sm transition-colors duration-500 ${dark ? "bg-slate-800 text-[#5FA8FF]" : "bg-white text-[#5FA8FF]"}`}>
                              <BookOpen size={18} />
                           </div>
                           <span className={`text-[9px] font-bold tracking-widest uppercase transition-colors duration-500 ${dark ? "text-slate-500" : "text-[#94A3B8]"}`}>AYAT HARI INI</span>
                        </div>
                        <div>
                           <span className={`text-[10px] font-semibold block mb-1 transition-colors duration-500 ${dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"}`}>{contentData.dailyVerse}</span>
                           <h3 className={`text-xs font-normal italic line-clamp-2 transition-colors duration-500 ${dark ? "text-slate-300" : "text-[#0F172A]/80"}`}>"{contentData.verseExcerpt}"</h3>
                        </div>
                     </motion.div>
                  </div>
               </div>

               {/* KANAN: PUSAT VISUAL "BENTUK MIHRAB" */}
               <div className="relative w-full flex justify-center lg:justify-end items-center min-h-[40vh] lg:min-h-none">
                  {/* Garis Bingkai Dekoratif */}
                  <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-[90%] h-[105%] border rounded-t-[240px] pointer-events-none hidden lg:block transition-colors duration-500 ${dark ? "border-white/5" : "border-[#1D5FD0]/10"}`} />

                  {/* Bingkai Utama Lengkung */}
                  <div className={`relative w-full max-w-sm h-[50vh] lg:h-[65vh] rounded-t-[200px] border-4 p-2 overflow-hidden group transition-all duration-500 ${dark ? "border-slate-900 bg-slate-900 shadow-none" : "border-white bg-white shadow-[0_30px_60px_-15px_rgba(15,23,42,0.08)]"}`}>
                     {/* Penanda Mengapung */}
                     <div className={`absolute top-6 left-6 z-30 flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] tracking-widest uppercase font-medium shadow-md transition-colors duration-500 ${dark ? "bg-slate-800 text-slate-200" : "bg-[#0F172A] text-white"}`}>
                        <Compass size={12} className="text-[#5FA8FF]" /> RUANG UTAMA
                     </div>

                     {/* Bingkai Gambar dengan Parallaks Scroll */}
                     <motion.div style={{ y: yImage }} className="relative cursor-target w-full h-[120%] overflow-hidden rounded-t-[190px] z-10">
                        <img src={heroImage} alt="Arsitektur Utama Masjid" className="w-full h-full object-cover group-hover:scale-[1.04] transition-all duration-[2s] ease-out object-center opacity-95" />
                        <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-40 transition-colors duration-500 ${dark ? "from-[#030712]/80" : "from-[#F8FBFF]/80"}`} />
                     </motion.div>
                  </div>
               </div>
            </div>

            {/* LAPISAN 3: KAKI HALAMAN BERSIH */}
            <div className={`w-full flex flex-col sm:flex-row justify-between items-center border-t pt-6 mt-16 gap-4 text-xs font-medium transition-colors duration-500 ${dark ? "border-white/5 text-slate-500" : "border-[#E2E8F0] text-[#94A3B8]"}`}>
               <div className="tracking-wide">© 2026 AR-RAZZAQ — HAK CIPTA DILINDUNGI</div>

               {/* Tetap motion.div, tapi ditambah fungsi onClick untuk scroll */}
               <motion.div
                  onClick={() => {
                     document.getElementById("profil")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className={`flex items-center gap-2 cursor-pointer transition-colors duration-500 ${dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"} hover:cursor-auto`}>
                  <span className="text-[10px] uppercase tracking-widest font-bold">Gulir untuk Eksplorasi</span>
                  <ArrowDown size={14} />
               </motion.div>
            </div>
         </div>
      </section>
   );
}
