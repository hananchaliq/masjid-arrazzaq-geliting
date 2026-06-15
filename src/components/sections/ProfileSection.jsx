import React, { useState, useEffect, useContext } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaMosque, FaMapMarkerAlt, FaPhoneAlt, FaUserTie, FaEnvelope, FaInstagram, FaCalendarAlt, FaUsers } from "react-icons/fa";
import { Sparkles } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

export default function ProfileSection() {
   const { scrollY } = useScroll();
   const [isDesktop, setIsDesktop] = useState(false);

   // SINKRONISASI TEMA LU
   const { dark } = useContext(ThemeContext);

   useEffect(() => {
      setIsDesktop(window.innerWidth > 1024);
      const handleResize = () => setIsDesktop(window.innerWidth > 1024);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   const [masjidData] = useState({
      nama: "Masjid Ar-Razzaq",
      alamat: "Jl. Nasional Maumere - Larantuka, Geliting, Kecamatan Kewapante",
      kota: "Sikka, Maumere",
      telepon: "(+62) 813-8080-0874",
      email: "masjidarrazzaqgeliting@gmail.com",
      ig: "masjidarrazzaqgeliting",
      tahunBerdiri: 1985,
      pengurus: "Dewan Kemakmuran Masjid (DKM) Ar-Razzaq",
      ketua: "H. Hasanudin Chaliq",
      imam: "Bapak Ismail Hamidung",
      muadzin: "Bapak Abdul Malik & Ananda Farras Naufal Chaliq",
   });

   // ANIMASI PARALLAX PROFILE
   const yTextBgProfile = useTransform(scrollY, [0, 1500], [0, isDesktop ? 60 : 0]);
   const fadeOutHeader = useTransform(scrollY, [200, 800], [1, 0.8]);

   return (
      <section id="profil" className={`relative py-28 md:py-36 overflow-hidden transition-colors duration-500 ${dark ? "bg-[#030712] text-[#E2E8F0]" : "bg-[#F8FBFF] text-[#0F172A]"}`}>
         {/* LAPISAN LATAR BELAKANG: GRID PATTERN YANG DISINKRONKAN */}
         <div className="absolute inset-0 z-0 pointer-events-none">
            {/* GRID MASTER LAYER */}
            <div
               className="absolute inset-0 transition-opacity duration-500"
               style={{
                  backgroundImage: dark ? `linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px)` : `linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px)`,
                  backgroundSize: "32px 32px",
               }}
            />
            {/* GRID MASKING MURNI */}
            <div className={`absolute inset-0 ${dark ? "bg-gradient-to-b from-[#030712] via-transparent to-[#030712] opacity-60" : "bg-gradient-to-b from-[#F8FBFF] via-transparent to-[#F8FBFF] opacity-60"}`} />

            {/* GLOW EFFECT */}
            <div className={`absolute top-[25%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[140px] transition-colors duration-500 ${dark ? "bg-[#1D5FD0]/8" : "bg-[#1D5FD0]/10"}`} />
            <div className={`absolute bottom-[5%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-500 ${dark ? "bg-[#5FA8FF]/6" : "bg-[#5FA8FF]/10"}`} />
         </div>

         {/* WADAH UTAMA KONTEN */}
         <div className="relative z-10 container mx-auto max-w-7xl px-6 md:px-12 w-full flex flex-col justify-center">
            {/* TULISAN BACKGROUND RAKSASA DENGAN ANIMASI PARALLAX VERTIKAL */}
            <motion.div style={{ y: yTextBgProfile }} className="absolute right-[-2%] left-auto bottom-10 w-auto h-auto pointer-events-none select-none z-0 hidden xl:block text-right overflow-hidden leading-none">
               <h1 style={{ writingMode: "vertical-rl" }} className={`text-[13vw] font-black tracking-tight uppercase whitespace-nowrap rotate-180 transition-colors duration-500 ${dark ? "text-[#1D5FD0]/10" : "text-[#1D5FD0]"}`}>
                  PROFIL
               </h1>
            </motion.div>

            {/* TATA LETAK UTAMA: GRID ASIMETRIS */}
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-16 items-center w-full z-10 pb-32">
               {/* SISI KIRI: IDENTITAS & TEKS UTAMA */}
               <motion.div style={{ opacity: fadeOutHeader }} className="flex flex-col gap-6 lg:sticky lg:top-28 z-10">
                  <div className="flex items-center gap-3">
                     <span className={`h-[2px] w-8 transition-colors duration-500 ${dark ? "bg-[#5FA8FF]" : "bg-[#1D5FD0]"}`} />
                     <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs uppercase tracking-[0.25em] font-bold border transition-all duration-500 ${dark ? "bg-slate-900/80 border-white/5 text-[#5FA8FF]" : "bg-[#DFF1FF]/10 border-transparent text-[#1D5FD0]"}`}>
                        <Sparkles size={12} className="animate-pulse mr-1 inline" />
                        <span>Mengenal Lebih Dekat</span>
                     </div>
                  </div>

                  <h2 className={`text-4xl md:text-5xl font-black tracking-tight uppercase leading-tight transition-colors duration-500 ${dark ? "text-white" : "text-[#0F172A]"}`}>
                     Profil <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D5FD0] to-[#5FA8FF]">{masjidData.nama}</span>
                  </h2>

                  <p className={`text-base md:text-lg font-normal leading-relaxed transition-colors duration-500 ${dark ? "text-[#94A3B8]" : "text-[#475569]"}`}>Berdiri kukuh melayani umat sejak tahun {masjidData.tahunBerdiri}, Masjid Ar-Razzaq menjadi pusat kegiatan ibadah, pembinaan akhlak, serta pengembangan ekosistem sosial masyarakat di wilayah Geliting, Kewapante, Sikka, Maumere.</p>

                  {/* Info Pendukung List Kaca */}
                  <div className={`flex flex-col gap-4 mt-2 border-t pt-6 transition-colors duration-500 ${dark ? "border-white/5" : "border-[#E2E8F0]"}`}>
                     <div className={`flex items-center gap-4 p-4 rounded-xl backdrop-blur-md border shadow-sm transition-all duration-500 ${dark ? "bg-slate-900/40 border-white/5" : "bg-white/60 border-white/80"}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow-inner flex-shrink-0 transition-colors duration-500 ${dark ? "bg-slate-900 text-[#5FA8FF]" : "bg-[#DFF1FF] text-[#1D5FD0]"}`}>
                           <FaCalendarAlt />
                        </div>
                        <div>
                           <p className={`text-[10px] font-bold tracking-wider uppercase transition-colors duration-500 ${dark ? "text-slate-500" : "text-[#64748B]"}`}>Tahun Berdiri</p>
                           <p className={`text-base font-black transition-colors duration-500 ${dark ? "text-white" : "text-[#0F172A]"}`}>{masjidData.tahunBerdiri} Masehi</p>
                        </div>
                     </div>

                     <div className={`flex items-center gap-4 p-4 rounded-xl backdrop-blur-md border shadow-sm transition-all duration-500 ${dark ? "bg-slate-900/40 border-white/5" : "bg-white/60 border-white/80"}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow-inner flex-shrink-0 transition-colors duration-500 ${dark ? "bg-slate-900 text-[#5FA8FF]" : "bg-[#DFF1FF] text-[#1D5FD0]"}`}>
                           <FaUsers />
                        </div>
                        <div>
                           <p className={`text-[10px] font-bold tracking-wider uppercase transition-colors duration-500 ${dark ? "text-slate-500" : "text-[#64748B]"}`}>Organisasi Pengurus</p>
                           <p className={`text-sm font-bold leading-snug transition-colors duration-500 ${dark ? "text-slate-200" : "text-[#0F172A]"}`}>{masjidData.pengurus}</p>
                        </div>
                     </div>
                  </div>
               </motion.div>

               {/* SISI KANAN: GRID KARTU BENTO GLASSMORPHISM */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full z-10">
                  {/* Kartu 1: Lokasi Lengkap */}
                  <motion.div whileHover={{ y: -6, borderColor: "#1D5FD0" }} className={`p-6 rounded-2xl backdrop-blur-md border shadow-lg flex flex-col justify-between min-h-[180px] group cursor-pointer transition-all duration-500 ${dark ? "bg-slate-900/40 border-white/5" : "bg-white/40 border-white/80"}`}>
                     <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg shadow-sm transition-colors duration-500 ${dark ? "bg-slate-900 text-[#5FA8FF] border-white/5" : "bg-white text-[#1D5FD0] border-[#E2E8F0]"}`}>
                        <FaMapMarkerAlt />
                     </div>
                     <div className="mt-6">
                        <p className={`text-[9px] font-extrabold tracking-widest uppercase mb-1 transition-colors duration-500 ${dark ? "text-slate-500" : "text-[#475569]"}`}>LOKASI & ALAMAT</p>
                        <h3 className={`text-sm font-black leading-relaxed mb-0.5 transition-colors duration-500 ${dark ? "text-slate-200" : "text-[#0F172A]"}`}>{masjidData.alamat}</h3>
                        <span className={`text-xs font-bold transition-colors duration-500 ${dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"}`}>{masjidData.kota}</span>
                     </div>
                  </motion.div>

                  {/* Kartu 2: Kontak & Media Sosial */}
                  <motion.div whileHover={{ y: -6, borderColor: "#1D5FD0" }} className={`p-6 rounded-2xl backdrop-blur-md border shadow-lg flex flex-col justify-between min-h-[180px] sm:translate-y-4 group cursor-pointer transition-all duration-500 ${dark ? "bg-slate-900/40 border-white/5" : "bg-white/40 border-white/80"}`}>
                     <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg shadow-sm transition-colors duration-500 ${dark ? "bg-slate-900 text-[#5FA8FF] border-white/5" : "bg-white text-[#1D5FD0] border-[#E2E8F0]"}`}>
                        <FaPhoneAlt />
                     </div>
                     <div className="mt-6 flex flex-col gap-1">
                        <p className={`text-[9px] font-extrabold tracking-widest uppercase mb-1 transition-colors duration-500 ${dark ? "text-slate-500" : "text-[#475569]"}`}>HUBUNGI & IKUTI</p>
                        <span className={`text-sm font-black flex items-center gap-2 transition-colors duration-500 ${dark ? "text-slate-200" : "text-[#0F172A]"}`}>{masjidData.telepon}</span>
                        <span className={`text-xs font-medium flex items-center gap-2 break-all transition-colors duration-500 ${dark ? "text-slate-400" : "text-[#0F172A]"}`}>
                           <FaEnvelope className={`transition-colors duration-500 ${dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"}`} /> {masjidData.email}
                        </span>
                        <span className={`text-xs font-black flex items-center gap-1.5 mt-0.5 transition-colors duration-500 ${dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"}`}>
                           <FaInstagram /> @{masjidData.ig}
                        </span>
                     </div>
                  </motion.div>

                  {/* Kartu 3: Ketua */}
                  <motion.div whileHover={{ y: -6, borderColor: "#1D5FD0" }} className={`p-6 rounded-2xl backdrop-blur-md border shadow-lg flex flex-col justify-between min-h-[180px] group cursor-pointer transition-all duration-500 ${dark ? "bg-slate-900/40 border-white/5" : "bg-white/40 border-white/80"}`}>
                     <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg shadow-sm transition-colors duration-500 ${dark ? "bg-slate-900 text-[#5FA8FF] border-white/5" : "bg-white text-[#1D5FD0] border-[#E2E8F0]"}`}>
                        <FaUserTie />
                     </div>
                     <div className="mt-6">
                        <p className={`text-[9px] font-extrabold tracking-widest uppercase mb-1 transition-colors duration-500 ${dark ? "text-slate-500" : "text-[#475569]"}`}>KETUA DKM</p>
                        <h3 className={`text-base font-black tracking-wide transition-colors duration-500 ${dark ? "text-white" : "text-[#0F172A]"}`}>{masjidData.ketua}</h3>
                        <p className={`text-xs font-semibold mt-0.5 transition-colors duration-500 ${dark ? "text-slate-400" : "text-[#64748B]"}`}>Penanggung Jawab Utama Kegiatan</p>
                     </div>
                  </motion.div>

                  {/* Kartu 4: Struktur Imam & Muadzin */}
                  <motion.div whileHover={{ y: -6, borderColor: "#5FA8FF" }} className={`p-6 rounded-2xl backdrop-blur-md border shadow-lg flex flex-col justify-between min-h-[180px] sm:translate-y-4 group cursor-pointer transition-all duration-500 ${dark ? "bg-slate-900/60 border-white/5" : "bg-[#DFF1FF]/40 border-white/80"}`}>
                     <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg shadow-sm transition-colors duration-500 ${dark ? "bg-slate-900 text-[#5FA8FF] border-white/5" : "bg-white text-[#5FA8FF] border-[#E2E8F0]"}`}>
                        <FaMosque />
                     </div>
                     <div className="mt-6 flex flex-col gap-2">
                        <div>
                           <p className={`text-[9px] font-extrabold tracking-widest uppercase mb-0.5 transition-colors duration-500 ${dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"}`}>IMAM UTAMA</p>
                           <h4 className={`text-sm font-black transition-colors duration-500 ${dark ? "text-slate-200" : "text-[#0F172A]"}`}>{masjidData.imam}</h4>
                        </div>
                        <div className={`border-t pt-2 transition-colors duration-500 ${dark ? "border-white/5" : "border-[#1D5FD0]/10"}`}>
                           <p className={`text-[9px] font-extrabold tracking-widest uppercase mb-0.5 transition-colors duration-500 ${dark ? "text-slate-500" : "text-[#475569]"}`}>MUADZIN TERPILIH</p>
                           <h4 className={`text-xs font-bold leading-relaxed transition-colors duration-500 ${dark ? "text-slate-300" : "text-[#0F172A]"}`}>{masjidData.muadzin}</h4>
                        </div>
                     </div>
                  </motion.div>
               </div>
            </div>
         </div>
      </section>
   );
}
