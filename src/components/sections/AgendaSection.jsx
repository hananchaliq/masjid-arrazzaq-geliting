import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, MapPin, Sparkles, Inbox } from "lucide-react";

// 🚀 Import koneksi Firebase langsung di sini
import { db } from "../../config/firebase";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";

export default function AgendaSection({ dark }) {
   const [agenda, setAgenda] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      // 1. Ambil tanggal hari ini (set jam ke 00:00:00 biar adil)
      const hariIni = new Date();
      hariIni.setHours(0, 0, 0, 0);
      const isoHariIni = hariIni.toISOString();

      // 2. Query Firebase: Hanya ambil agenda yang tanggal_mulai >= hari ini
      const qAgenda = query(collection(db, "agenda"), where("tanggal_mulai", ">=", isoHariIni), orderBy("tanggal_mulai", "asc"));

      // 3. Ambil data secara realtime
      const unsubAgenda = onSnapshot(
         qAgenda,
         snapshot => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAgenda(data);
            setLoading(false);
         },
         error => {
            console.error("Gagal ambil data agenda:", error);
            setLoading(false);
         }
      );

      // Cleanup listener pas komponen di-unmount
      return () => unsubAgenda();
   }, []);

   // Menampilkan tanggal utama di bagian atas kartu
   const formatTanggalUtama = tanggal => {
      if (!tanggal) return "-";
      return new Date(tanggal).toLocaleDateString("id-ID", {
         day: "numeric",
         month: "long",
         year: "numeric",
      });
   };

   // Fungsi pintar bawaan lu untuk mendeteksi tanggal sama atau berbeda
   const formatRentangWaktuLengkap = (mulaiStr, selesaiStr) => {
      if (!mulaiStr) return "-";
      const optTanggal = { day: "numeric", month: "long", year: "numeric" };
      const optJam = { hour: "2-digit", minute: "2-digit" };

      const mulai = new Date(mulaiStr);
      const jamMulai = mulai.toLocaleTimeString("id-ID", optJam).replace(".", ":");

      if (!selesaiStr) {
         return `${jamMulai} WIB`;
      }

      const selesai = new Date(selesaiStr);
      const jamSelesai = selesai.toLocaleTimeString("id-ID", optJam).replace(".", ":");

      const tglMulaiCek = mulai.toLocaleDateString("id-ID", optTanggal);
      const tglSelesaiCek = selesai.toLocaleDateString("id-ID", optTanggal);

      if (tglMulaiCek === tglSelesaiCek) {
         return `${jamMulai} s/d ${jamSelesai} WIB`;
      }

      return `${jamMulai} WIB s/d ${tglSelesaiCek} ${jamSelesai} WIB`;
   };

   return (
      <section id="agenda" className="relative min-h-screen w-full py-24 sm:py-32 overflow-hidden flex flex-col justify-center transition-colors duration-500">
         {/* Background Glow Deco */}
         <div className="absolute inset-0 z-0 pointer-events-none">
            <div className={`absolute top-[10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[130px] transition-colors duration-500 ${dark ? "bg-[#5FA8FF]/3" : "bg-[#5FA8FF]/5"}`} />
            <div className={`absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-500 ${dark ? "bg-[#1D5FD0]/2" : "bg-[#1D5FD0]/4"}`} />
         </div>

         <div className="relative z-10 container mx-auto max-w-7xl px-6 md:px-12 w-full">
            {/* HEADING AREA */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} viewport={{ once: true }} className="flex flex-col items-center text-center mb-20 sm:mb-28 max-w-3xl mx-auto gap-4">
               <div className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.25em] uppercase shadow-sm border transition-colors duration-500 ${dark ? "bg-slate-900 border-white/5 text-[#5FA8FF]" : "bg-[#DFF1FF] border-[#5FA8FF]/10 text-[#1D5FD0]"}`}>
                  <Sparkles size={12} />
                  <span>Aktivitas & Syiar</span>
               </div>

               <h2 className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase transition-colors duration-500 ${dark ? "text-white" : "text-[#0F172A]"}`}>
                  Agenda <span className="text-[#1D5FD0]">Mendatang</span>
               </h2>
               <div className="w-12 h-[3px] bg-[#1D5FD0] rounded-full my-1" />
               <p className={`text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-xl transition-colors duration-500 ${dark ? "text-slate-400" : "text-[#94A3B8]"}`}>Jadwal kajian, kegiatan sosial, dan aktivitas ekosistem masjid yang dirancang untuk menghadirkan kemudahan akses spiritualitas modern.</p>
            </motion.div>

            {/* KONTEN UTAMA */}
            {loading ? (
               <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-4 border-[#1D5FD0] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold tracking-widest text-[#94A3B8] uppercase">Memuat Agenda...</span>
               </div>
            ) : agenda.length === 0 ? (
               <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className={`max-w-xl mx-auto p-12 text-center rounded-3xl border shadow-[0_15px_40px_-20px_rgba(15,23,42,0.05)] flex flex-col items-center transition-colors duration-500 ${dark ? "bg-[#0B0F24]/40 border-white/5" : "bg-white border-[#E2E8F0]"}`}>
                  <div className={`p-4 rounded-2xl mb-5 transition-colors duration-500 ${dark ? "bg-slate-900 text-[#5FA8FF]" : "bg-[#DFF1FF] text-[#1D5FD0]"}`}>
                     <Inbox size={28} />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 transition-colors duration-500 ${dark ? "text-white" : "text-[#0F172A]"}`}>Belum Ada Agenda Terjadwal</h3>
                  <p className="text-[#94A3B8] text-xs sm:text-sm font-light max-w-xs">Seluruh kegiatan sedang dipersiapkan secara komprehensif oleh pengurus masjid untuk kenyamanan jamaah.</p>
               </motion.div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 pb-12">
                  {agenda.map((item, index) => (
                     <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                        whileHover={{
                           y: -4,
                           borderColor: "#1D5FD0",
                           boxShadow: dark ? "0 30px 50px -20px rgba(29, 95, 208, 0.25)" : "0 30px 50px -20px rgba(29, 95, 208, 0.12)",
                        }}
                        className={`p-8 rounded-2xl shadow-[0_8px_30px_rgb(15,23,42,0.015)] flex flex-col justify-between min-h-[420px] cursor-pointer group transition-all duration-300 sm:even:translate-y-6 border ${dark ? "bg-[#0B0F24]/60 backdrop-blur-md border-white/5" : "bg-white border-[#E2E8F0]"}`}>
                        <div className="w-full">
                           <div className="flex justify-between items-start mb-6">
                              <div className="flex flex-col gap-1">
                                 <span className={`text-[10px] font-bold tracking-widest uppercase group-hover:text-[#1D5FD0] transition-colors duration-300 ${dark ? "text-slate-500" : "text-[#94A3B8]"}`}>WAKTU PELAKSANAAN</span>
                                 <span className="text-xs font-semibold text-[#5FA8FF]">{formatTanggalUtama(item.tanggal_mulai)}</span>
                              </div>
                              <div className={`p-3 rounded-xl transition-all duration-300 shadow-sm group-hover:bg-[#1D5FD0] group-hover:text-white ${dark ? "bg-slate-900 text-[#5FA8FF]" : "bg-[#DFF1FF] text-[#1D5FD0]"}`}>
                                 <CalendarDays size={18} />
                              </div>
                           </div>

                           <h3 className={`text-xl font-extrabold tracking-tight mb-4 line-clamp-2 leading-snug group-hover:text-[#1D5FD0] transition-colors duration-300 ${dark ? "text-white" : "text-[#0F172A]"}`}>{item.judul}</h3>
                           <p className={`text-xs sm:text-sm font-light leading-relaxed line-clamp-4 transition-colors duration-500 ${dark ? "text-slate-400" : "text-[#94A3B8]"}`}>{item.deskripsi}</p>
                        </div>

                        <div className="w-full mt-6">
                           <div className={`border-t pt-5 space-y-3 transition-colors duration-500 ${dark ? "border-white/5" : "border-[#E2E8F0]"}`}>
                              <div className={`flex items-start gap-3 text-xs transition-colors duration-500 ${dark ? "text-slate-300" : "text-[#0F172A]"}`}>
                                 <Clock size={14} className="text-[#1D5FD0] mt-0.5 flex-shrink-0" />
                                 <span className="font-semibold leading-relaxed">{formatRentangWaktuLengkap(item.tanggal_mulai, item.tanggal_selesai)}</span>
                              </div>

                              {item.lokasi && (
                                 <div className={`flex items-center gap-3 text-xs transition-colors duration-500 ${dark ? "text-slate-300" : "text-[#0F172A]"}`}>
                                    <MapPin size={14} className="text-[#5FA8FF] flex-shrink-0" />
                                    <span className={`font-medium truncate max-w-[220px] ${dark ? "text-slate-400" : "text-[#475569]"}`}>{item.lokasi}</span>
                                 </div>
                              )}
                           </div>
                           <div className="h-[3px] w-0 bg-[#1D5FD0] rounded-full mt-6 group-hover:w-full transition-all duration-500 ease-out" />
                        </div>
                     </motion.div>
                  ))}
               </div>
            )}
         </div>
      </section>
   );
}
