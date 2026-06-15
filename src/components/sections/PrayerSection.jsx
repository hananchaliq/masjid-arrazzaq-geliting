import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { FaMoon, FaSun, FaCloudSun, FaCloudMoon, FaClock, FaCalendarAlt } from "react-icons/fa";
import { Sparkles } from "lucide-react"; // Import Sparkles yang sama seperti komponen lainnya
import { getPrayerData } from "../../services/myquran";
import { ThemeContext } from "../../context/ThemeContext";

export default function PrayerSection() {
   const { scrollY } = useScroll();
   const [isDesktop, setIsDesktop] = useState(false);

   // SINKRONISASI TEMA GLOBAL: Menggunakan 'dark' langsung dari context (Persis seperti file finance/zakat)
   const { dark } = useContext(ThemeContext);

   const [jadwal, setJadwal] = useState(null);
   const [hijriah, setHijriah] = useState("-");
   const [activePrayer, setActivePrayer] = useState(0);

   useEffect(() => {
      setIsDesktop(window.innerWidth > 1024);
      const handleResize = () => setIsDesktop(window.innerWidth > 1024);
      window.addEventListener("resize", handleResize);

      async function loadData() {
         try {
            const data = await getPrayerData();
            setJadwal(data.jadwal);
            setHijriah(data.hijriah);
         } catch (error) {
            console.error("Error fetching prayer data:", error);
         }
      }
      loadData();

      return () => window.removeEventListener("resize", handleResize);
   }, []);

   // ANIMASI PARALLAX JADWAL
   const yTextBgJadwal = useTransform(scrollY, [600, 2200], [0, isDesktop ? 80 : 0]);

   const prayers = [
      {
         name: "Subuh",
         time: jadwal?.subuh || "--:--",
         icon: <FaSun />,
         desc: "Fajar Shadiq",
         detail: "Fase krusial terbitnya fajar shadiq di ufuk timur. Menandai batas sakral berakhirnya santap sahur serta titik awal penentuan dimulainya ibadah puasa dan shalat subuh.",
         gradient: "from-[#0F172A] to-[#1E3A8A]",
         accentColor: "#38BDF8",
         art: (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
               <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-sky-500 to-transparent blur-2xl animate-pulse" />
               <FaSun className="absolute text-7xl sm:text-8xl text-sky-200 right-6 sm:right-10 top-6 sm:top-10 transform rotate-45" />
            </div>
         ),
         visualTimeline: (
            <div className="relative w-full h-28 sm:h-32 rounded-2xl overflow-hidden bg-gradient-to-b from-[#070B19] via-[#0F172A] to-[#1E3A8A] border border-white/10 shadow-[inset_0_4px_20px_rgba(0,0,0,0.6)] flex items-end justify-center pb-3 sm:pb-4">
               <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-sky-900/40 to-transparent border-t border-sky-500/20 transform skew-x-[-10deg]" />
               <div className="absolute bottom-0 w-44 h-24 bg-gradient-to-t from-amber-500/30 via-sky-500/5 to-transparent rounded-full blur-xl transform translate-y-4 animate-pulse" />

               <motion.div animate={{ y: [14, -4, 14], scale: [0.95, 1.05, 0.95] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="relative z-10 text-3xl sm:text-4xl text-amber-300 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)] flex flex-col items-center">
                  <FaSun className="animate-spin-slow" style={{ animationDuration: "30s" }} />
                  <span className="text-[8px] sm:text-[9px] font-mono font-black tracking-[0.2em] text-amber-200 bg-sky-950/80 p-1 px-2 sm:px-2.5 rounded-md mt-1.5 sm:mt-2 border border-sky-500/30 shadow-md">FAJAR</span>
               </motion.div>
            </div>
         ),
      },
      {
         name: "Dzuhur",
         time: jadwal?.dzuhur || "--:--",
         icon: <FaSun />,
         desc: "Zawalul Fardh",
         detail: "Waktu utama saat posisi matahari tepat berada di puncaknya (zenit) kemudian mulai tergelincir bergeser sedikit meninggalkan garis tengah langit menuju arah barat.",
         gradient: "from-[#0284C7] to-[#0369A1]",
         accentColor: "#F59E0B",
         art: (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
               <div className="w-60 h-60 rounded-full bg-amber-400 blur-3xl" />
               <FaSun className="absolute text-8xl sm:text-9xl text-amber-300 -right-4 -top-4 sm:-right-5 sm:-top-5" />
            </div>
         ),
         visualTimeline: (
            <div className="relative w-full h-28 sm:h-32 rounded-2xl overflow-hidden bg-gradient-to-b from-[#0EA5E9] via-[#38BDF8] to-[#BAE6FD] border border-white/20 shadow-[inset_0_4px_15px_rgba(255,255,255,0.3)] flex items-center justify-center">
               <div className="absolute bottom-[-20px] w-40 sm:w-48 h-12 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg" />
               <motion.div animate={{ scale: [1, 1.08, 1], rotate: 360 }} transition={{ scale: { repeat: Infinity, duration: 3, ease: "easeInOut" }, rotate: { repeat: Infinity, duration: 25, ease: "linear" } }} className="relative z-10 text-4xl sm:text-5xl text-amber-400 drop-shadow-[0_10px_20px_rgba(245,158,11,0.5)] flex flex-col items-center">
                  <FaSun />
                  <span className="text-[8px] sm:text-[9px] font-mono font-black tracking-[0.2em] text-amber-900 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-md mt-1.5 sm:mt-2 shadow-sm border border-white">ZENIT</span>
               </motion.div>
            </div>
         ),
      },
      {
         name: "Ashar",
         time: jadwal?.ashar || "--:--",
         icon: <FaCloudSun />,
         desc: "Mithliyyah",
         detail: "Fase sore hari di mana proyeksi panjang bayangan dari suatu benda di atas permukaan bumi posisinya telah sama panjang atau melebihi ukuran dari tinggi objek aslinya.",
         gradient: "from-[#EA580C] to-[#C2410C]",
         accentColor: "#FFEDD5",
         art: (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
               <div className="w-52 h-52 rounded-full bg-orange-400 blur-2xl" />
               <FaCloudSun className="absolute text-7xl sm:text-8xl text-orange-200 right-6 sm:right-8 bottom-6 sm:bottom-8" />
            </div>
         ),
         visualTimeline: (
            <div className="relative w-full h-28 sm:h-32 rounded-2xl overflow-hidden bg-gradient-to-b from-[#E65C00] to-[#F9D423] border border-white/10 shadow-[inset_0_4px_20px_rgba(0,0,0,0.3)] flex items-end justify-center pb-3 sm:pb-4">
               <div className="w-2 h-11 sm:w-2.5 sm:h-14 bg-gradient-to-b from-amber-100 to-amber-700/60 absolute bottom-3 left-[30%] sm:left-[35%] rounded-t-full shadow-md z-10 border-t border-white/20" />
               <motion.div animate={{ x: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="relative z-20 text-3xl sm:text-4xl text-orange-100 flex flex-col items-center ml-12 sm:ml-16">
                  <FaCloudSun />
                  <span className="text-[8px] sm:text-[9px] font-mono font-black tracking-[0.2em] text-orange-900 bg-amber-100/90 backdrop-blur-sm px-2 py-0.5 rounded-md mt-1 shadow-sm">MITHLI</span>
               </motion.div>
            </div>
         ),
      },
      {
         name: "Maghrib",
         time: jadwal?.maghrib || "--:--",
         icon: <FaCloudMoon />,
         desc: "Ghurubus Syams",
         detail: "Tenggelamnya seluruh piringan geometri matahari secara sempurna di bawah ufuk barat, memicu langit memunculkan warna mega merah murni penanda buka puasa.",
         gradient: "from-[#4D1D95] to-[#2E1065]",
         accentColor: "#F43F5E",
         art: (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-15 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
               <div className="w-full h-32 bg-gradient-to-t from-rose-500 to-transparent absolute bottom-0 blur-xl" />
               <FaCloudMoon className="absolute text-7xl sm:text-8xl text-rose-300 left-6 sm:left-10 top-6 sm:top-8" />
            </div>
         ),
         visualTimeline: (
            <div className="relative w-full h-28 sm:h-32 rounded-2xl overflow-hidden bg-gradient-to-b from-[#2E1065] via-[#4C1D95] to-[#F43F5E]/80 border border-white/10 shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)] flex items-end justify-center pb-2 sm:pb-3">
               <motion.div animate={{ y: [4, 24, 4] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="relative z-10 text-3xl sm:text-4xl text-rose-100 flex flex-col items-center">
                  <FaCloudMoon />
                  <span className="text-[8px] sm:text-[9px] font-mono font-black tracking-[0.2em] text-rose-200 bg-[#2E1065]/80 border border-rose-500/40 px-2 py-0.5 rounded-md mt-1.5 sm:mt-2 shadow-inner">GHURUB</span>
               </motion.div>
            </div>
         ),
      },
      {
         name: "Isya",
         time: jadwal?.isya || "--:--",
         icon: <FaMoon />,
         desc: "Ghiyabus Syafaq",
         detail: "Hilangnya cahaya merah (syafaq) di langit barat secara total, menandai masuknya fase malam gelap pekat sekaligus menjadi rentang waktu ibadah shalat terpanjang.",
         gradient: "from-[#030712] to-[#111827]",
         accentColor: "#6366F1",
         art: (
            <div className="absolute inset-0 w-full h-full opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
               <FaMoon className="absolute text-6xl sm:text-7xl text-indigo-300 right-8 sm:right-12 bottom-8 sm:bottom-12 -rotate-45" />
            </div>
         ),
         visualTimeline: (
            <div className="relative w-full h-28 sm:h-32 rounded-2xl overflow-hidden bg-gradient-to-b from-[#02040A] via-[#0B0F19] to-[#1E1B4B] border border-white/5 shadow-[inset_0_4px_25px_rgba(0,0,0,0.8)] flex items-center justify-center">
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }} className="relative z-10 text-2xl sm:text-3xl text-indigo-200 flex flex-col items-center gap-1 sm:gap-2">
                  <FaMoon className="-rotate-12" />
                  <span className="text-[8px] sm:text-[9px] font-mono font-black tracking-[0.2em] text-indigo-300 bg-indigo-950/80 border border-indigo-500/20 px-2 py-0.5 rounded-md shadow-md">NIGHT</span>
               </motion.div>
            </div>
         ),
      },
   ];

   return (
      <section id="jadwal" className="relative min-h-screen w-full py-24 sm:py-32 overflow-hidden flex flex-col justify-center transition-colors duration-500">
         {/* Background Glow Deco (PERSIS SEPERTI FILE FINANCE / ZAKAT) */}
         <div className="absolute inset-0 z-0 pointer-events-none">
            <div className={`absolute top-[10%] left-[-5%] w-[600px] h-[600px] rounded-full blur-[130px] transition-colors duration-500 ${dark ? "bg-[#1D5FD0]/3" : "bg-[#1D5FD0]/5"}`} />
            <div className={`absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-500 ${dark ? "bg-[#5FA8FF]/2" : "bg-[#5FA8FF]/4"}`} />
         </div>

         {/* Container Utama disesuaikan max-w-7xl agar simetris dengan Finance */}
         <div className="relative z-10 container mx-auto max-w-7xl px-6 md:px-12 w-full space-y-16">
            {/* HEADING AREA (PERSIS SEPERTI STYLE FINANCE / ZAKAT) */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} viewport={{ once: true }} className="flex flex-col items-center text-center max-w-3xl mx-auto gap-4">
               <div
                  className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.25em] uppercase shadow-sm border transition-colors duration-500
                  ${dark ? "bg-slate-900 border-white/5 text-[#5FA8FF]" : "bg-[#DFF1FF] border-[#5FA8FF]/10 text-[#1D5FD0]"}
               `}>
                  <Sparkles size={12} className="animate-pulse" />
                  <span>{hijriah}</span>
               </div>

               <h2 className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase transition-colors duration-500 ${dark ? "text-white" : "text-[#0F172A]"}`}>
                  SINKRONISASI <span className="text-[#1D5FD0]">WAKTU SHALAT</span>
               </h2>
               <div className="w-12 h-[3px] bg-[#1D5FD0] rounded-full my-1" />
               <p className={`text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-xl transition-colors duration-500 ${dark ? "text-slate-400" : "text-[#94A3B8]"}`}>Panel informasi dinamis penentu batasan astronomis waktu ibadah wajib fardhu realtime wilayah Kabupaten Sikka dan sekitarnya.</p>
            </motion.div>

            {/* CONTAINER UTAMA KONTEN */}
            <div className="relative w-full">
               {/* TEXT BACKGROUND PARALLAX (IDENTIK DENGAN FINANCE) */}
               <div className="absolute left-[-27%] rotate-90 transform flex items-center justify-center pointer-events-none select-none z-0">
                  <motion.h1 style={{ y: yTextBgJadwal }} className={`text-[13vw] font-black tracking-tighter uppercase whitespace-nowrap text-center font-sans transition-colors duration-500 opacity-[0.08] dark:opacity-[0.12] ${dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"}`}>
                     JADWAL
                  </motion.h1>
               </div>

               {/* GRID KONTEN (Mengikuti susunan kolom Finance yang presisi) */}
               <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
                  {/* KOLOM KIRI: SHUTTLE TIMELINE SELECTOR (4 Kolom) */}
                  <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-1 gap-3 w-full">
                     {prayers.map((item, index) => {
                        const isActive = activePrayer === index;
                        return (
                           <motion.div
                              key={index}
                              onClick={() => setActivePrayer(index)}
                              onMouseEnter={() => setActivePrayer(index)}
                              whileHover={{ scale: 1.02, x: isDesktop ? 4 : 0 }}
                              whileTap={{ scale: 0.98 }}
                              className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden select-none flex flex-col sm:flex-row lg:flex-row items-center sm:justify-center lg:justify-between gap-3
                              ${isActive ? (dark ? "bg-slate-900 border-[#5FA8FF] shadow-md ring-2 ring-[#5FA8FF]/20 z-10" : "bg-white border-[#1D5FD0] shadow-md ring-2 ring-[#1D5FD0]/10 z-10") : dark ? "bg-[#0B0F24]/60 backdrop-blur-md border-white/5 hover:bg-slate-900" : "bg-white border-[#E2E8F0] shadow-sm hover:bg-slate-50"}`}>
                              <div className="flex flex-col sm:items-center lg:flex-row lg:items-center gap-3 min-w-0 w-full text-center sm:text-center lg:text-left">
                                 <div className={`w-9 h-9 rounded-xl border flex items-center justify-center text-sm flex-shrink-0 mx-auto sm:mx-auto lg:mx-0 transition-colors ${isActive ? (dark ? "bg-[#5FA8FF] text-slate-950 border-[#5FA8FF]" : "bg-[#1D5FD0] text-white border-[#1D5FD0]") : dark ? "bg-white/5 text-[#5FA8FF] border-white/10" : "bg-slate-50 text-[#1D5FD0] border-[#E2E8F0]"}`}>{item.icon}</div>
                                 <div className="min-w-0 sm:hidden lg:block">
                                    <h3 className={`text-sm font-black leading-tight truncate ${dark ? "text-white" : "text-[#0F172A]"}`}>{item.name}</h3>
                                    <p className={`text-[9px] font-bold tracking-wider uppercase mt-0.5 truncate ${dark ? "text-slate-500" : "text-[#64748B]"}`}>{item.desc}</p>
                                 </div>
                                 {/* Teks Khusus Layar Tablet/Sm agar tidak hancur */}
                                 <span className="hidden sm:block lg:hidden text-xs font-black">{item.name}</span>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0 font-mono font-black text-sm sm:text-base lg:text-lg">
                                 <span className={isActive ? (dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]") : dark ? "text-slate-500" : "text-slate-400"}>{item.time}</span>
                              </div>
                              {isActive && <motion.div layoutId="activePrayerIndicator" className={`absolute right-0 bottom-0 w-2 h-2 rounded-tl-full ${dark ? "bg-[#5FA8FF]" : "bg-[#1D5FD0]"}`} />}
                           </motion.div>
                        );
                     })}
                  </div>

                  {/* KOLOM KANAN: LIVE THEATER DISPLAY COMPONENT (8 Kolom) */}
                  <div className={`lg:col-span-8 border rounded-2xl shadow-sm overflow-hidden flex flex-col w-full min-h-[440px] relative transition-all duration-500 ${dark ? "bg-[#0B0F24]/60 backdrop-blur-md border-white/5 text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"}`}>
                     <AnimatePresence mode="wait">
                        <motion.div key={activePrayer} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: "easeOut" }} className="absolute inset-0 w-full h-full p-6 sm:p-8 flex flex-col justify-between z-10">
                           <div className={`absolute inset-0 bg-gradient-to-br ${prayers[activePrayer].gradient} opacity-[0.03] dark:opacity-[0.05] pointer-events-none`} />

                           {prayers[activePrayer].art}

                           <div className={`relative z-10 flex items-center justify-between gap-4 w-full border-b pb-4 ${dark ? "border-white/5" : "border-slate-200/60"}`}>
                              <div className="min-w-0">
                                 <span className={`text-[9px] font-black tracking-[0.2em] uppercase block mb-0.5 ${dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"}`}>Fase Astronomis</span>
                                 <h4 className="text-lg sm:text-xl font-black tracking-tight truncate">
                                    {prayers[activePrayer].name} ({prayers[activePrayer].desc})
                                 </h4>
                              </div>

                              <div className={`flex items-center gap-2 backdrop-blur-md border px-3 py-1.5 rounded-xl font-mono font-black text-base shadow-sm flex-shrink-0 ${dark ? "bg-slate-900/80 border-white/5 text-white" : "bg-white border-slate-200/50 text-[#0F172A]"}`}>
                                 <FaClock style={{ color: prayers[activePrayer].accentColor }} />
                                 {prayers[activePrayer].time}
                              </div>
                           </div>

                           <div className="relative z-10 my-4">
                              <h5 className={`text-[9px] font-black tracking-widest uppercase mb-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>Edukasi & Pembatasan</h5>
                              <p className={`font-medium text-xs sm:text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{prayers[activePrayer].detail}</p>
                           </div>

                           <div className="relative z-10 w-full my-2">{prayers[activePrayer].visualTimeline}</div>

                           <div className={`relative z-10 mt-auto pt-4 border-t flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between w-full text-[10px] font-mono font-bold uppercase ${dark ? "border-white/5 text-slate-500" : "border-slate-200/60 text-slate-400"}`}>
                              <span className="flex items-center gap-1.5">
                                 <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: prayers[activePrayer].accentColor }} />
                                 Status: Realtime Aktif
                              </span>
                              <span className={dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"}>Zona Waktu WITA</span>
                           </div>
                        </motion.div>
                     </AnimatePresence>
                  </div>
               </div>
            </div>

            {/* FOOTER CAPSULE */}
            <div className="relative z-10 mt-8 flex justify-center w-full">
               <div className={`px-4 py-2 rounded-full border text-[9px] tracking-[0.15em] font-black uppercase flex items-center gap-1.5 shadow-sm transition-colors duration-500 ${dark ? "bg-slate-900 border-white/5 text-slate-500" : "bg-white border-slate-200 text-slate-400"}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D5FD0] dark:bg-[#5FA8FF]" /> Sumber Sinkronisasi API: MyQuran Indonesia
               </div>
            </div>
         </div>
      </section>
   );
}
