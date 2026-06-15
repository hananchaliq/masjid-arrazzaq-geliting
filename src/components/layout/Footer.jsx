import { useContext } from "react";
import { RiHome4Line, RiMapPinLine, RiMailLine, RiPhoneLine, RiInstagramFill, RiFacebookBoxFill, RiTwitterXFill, RiArrowRightSLine, RiTimeLine } from "react-icons/ri";
import { motion } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

export default function Footer() {
   const { dark } = useContext(ThemeContext);

   const socialLinks = [
      { icon: <RiInstagramFill size={18} />, href: "#", label: "Instagram" },
      { icon: <RiFacebookBoxFill size={18} />, href: "#", label: "Facebook" },
      { icon: <RiTwitterXFill size={18} />, href: "#", label: "Twitter" },
   ];

   const navigation = [
      { name: "Profil", href: "#profil" },
      { name: "Jadwal", href: "#jadwal" },
      { name: "Kas", href: "#kas" },
      { name: "Zakat", href: "#zakat" },
      { name: "Agenda", href: "#agenda" },
      { name: "Berita", href: "#berita" },
      { name: "Kontak", href: "#kontak" },
   ];

   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: { staggerChildren: 0.06 },
      },
   };

   const itemVariants = {
      hidden: { opacity: 0, y: 15 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
   };

   return (
      <footer className={`relative border-t overflow-hidden transition-colors duration-500 ${dark ? "bg-[#030712] border-white/5 text-slate-400" : "bg-[#F8FBFF] border-[#DFF1FF] text-slate-600"}`}>
         {/* Efek Glow Background Soft */}
         <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className={`absolute top-0 left-1/4 -translate-x-1/2 w-80 h-80 blur-[120px] rounded-full opacity-15 transition-colors duration-500 ${dark ? "bg-[#5FA8FF]" : "bg-[#1D5FD0]"}`} />
         </div>

         <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">
            {/* GRID UTAMA - 3 Kolom Proporsional */}
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-slate-500/10">
               {/* KOLOM 1: TENTANG MASJID */}
               <motion.div variants={itemVariants} className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors duration-500 ${dark ? "bg-slate-900 border-white/5 text-[#5FA8FF]" : "bg-[#DFF1FF] border-[#B9DCFF] text-[#1D5FD0]"}`}>
                        <RiHome4Line size={20} />
                     </div>
                     <div>
                        <h2 className={`text-base font-semibold tracking-tight transition-colors duration-500 ${dark ? "text-white" : "text-[#0F172A]"}`}>Masjid Ar-Razzaq</h2>
                        <p className={`text-[10px] uppercase tracking-[0.2em] font-medium transition-colors duration-500 ${dark ? "text-slate-500" : "text-[#5B87C5]"}`}>Desa Geliting</p>
                     </div>
                  </div>

                  <p className="text-xs leading-relaxed opacity-85">Sistem Informasi Digital Masjid Ar-Razzaq Desa Geliting. Wadah keterbukaan informasi manajemen kas, pengelolaan zakat, serta media publikasi seluruh agenda umat secara real-time dan transparan.</p>

                  <div className="flex items-center gap-2.5 pt-1">
                     {socialLinks.map((soc, i) => (
                        <motion.a key={i} href={soc.href} aria-label={soc.label} whileHover={{ y: -3, scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300 ${dark ? "bg-slate-900/50 border-white/5 text-slate-400 hover:text-white" : "bg-white border-[#DFF1FF] text-slate-500 hover:text-[#1D5FD0]"}`}>
                           {soc.icon}
                        </motion.a>
                     ))}
                  </div>
               </motion.div>

               {/* KOLOM 2: MENU UTAMA (Dibuat Grid 2 Kolom di Dalamnya) */}
               <motion.div variants={itemVariants}>
                  <h3 className={`text-xs font-bold tracking-wider uppercase mb-5 ${dark ? "text-slate-200" : "text-slate-900"}`}>Menu Utama</h3>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                     {navigation.map(item => (
                        <li key={item.name}>
                           <motion.a href={item.href} className="flex items-center gap-1 group transition-colors duration-300 hover:text-[#1D5FD0] dark:hover:text-[#5FA8FF]" whileHover={{ x: 4 }}>
                              <RiArrowRightSLine className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-[#1D5FD0] dark:text-[#5FA8FF]" size={14} />
                              <span>{item.name}</span>
                           </motion.a>
                        </li>
                     ))}
                  </ul>
               </motion.div>

               {/* KOLOM 3: DETAIL INFO KONTAK */}
               <motion.div variants={itemVariants}>
                  <h3 className={`text-xs font-bold tracking-wider uppercase mb-5 ${dark ? "text-slate-200" : "text-slate-900"}`}>Informasi Kontak</h3>
                  <ul className="space-y-3.5 text-xs">
                     <li className="flex items-start gap-3">
                        <RiMapPinLine className={`mt-0.5 shrink-0 ${dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"}`} size={16} />
                        <span className="opacity-85 leading-relaxed">Desa Geliting, Kec. Kewapante, Kab. Sikka, NTT</span>
                     </li>
                     <li className="flex items-center gap-3">
                        <RiMailLine className={dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"} size={16} />
                        <a href="mailto:masjidarrazzaqgeliting@gmail.com" className="opacity-85 hover:underline">
                           masjidarrazzaqgeliting@gmail.com
                        </a>
                     </li>
                     <li className="flex items-center gap-3">
                        <RiPhoneLine className={dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"} size={16} />
                        <a href="tel:+6281234567890" className="opacity-85 hover:underline">
                           +62 812-3456-7890
                        </a>
                     </li>
                  </ul>
               </motion.div>
            </motion.div>

            {/* BARIS BAWAH TAMBAHAN (VERIFIKASI): JAM OPERASIONAL & HAK CIPTA */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 text-[11px] font-medium opacity-70">
               <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
                  <p>© {new Date().getFullYear()} Masjid Ar-Razzaq. All rights reserved.</p>
                  <span className="hidden md:inline text-slate-400">|</span>
                  <p className="flex items-center gap-1 opacity-80">
                     <RiTimeLine size={13} /> Pelayanan Sekretariat: Setiap Hari (04:00 - 21:00 WITA)
                  </p>
               </div>
               <div className="flex gap-5 text-xs">
                  <a href="#" className="hover:underline transition-all">
                     Kebijakan Privasi
                  </a>
                  <a href="#" className="hover:underline transition-all">
                     Bantuan
                  </a>
               </div>
            </div>
         </div>
      </footer>
   );
}
