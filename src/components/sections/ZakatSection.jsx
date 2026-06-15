import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { FaBookOpen, FaUserCheck, FaCoins, FaCheck, FaChartLine, FaPaperPlane, FaInfoCircle } from "react-icons/fa";
import { Sparkles } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import Swal from "sweetalert2";

import { db } from "../../config/firebase";
import { collection, addDoc, query, where, onSnapshot, orderBy } from "firebase/firestore";

export default function ZakatSection() {
   const { scrollY } = useScroll();
   const [isDesktop, setIsDesktop] = useState(false);
   const { dark } = useContext(ThemeContext);

   const [activeTab, setActiveTab] = useState("maal");
   const [zakatData, setZakatData] = useState([]);
   const [loading, setLoading] = useState(true);

   const [nama, setNama] = useState("");
   const [harta, setHarta] = useState("");
   const [jiwa, setJiwa] = useState("");
   const [beras, setBeras] = useState("15.000");
   const [hasil, setHasil] = useState(0);

   const [isSubmitting, setIsSubmitting] = useState(false);

   useEffect(() => {
      setIsDesktop(window.innerWidth > 1024);
      const handleResize = () => setIsDesktop(window.innerWidth > 1024);
      window.addEventListener("resize", handleResize);

      const zakatRef = collection(db, "zakat");
      const q = query(zakatRef, where("status", "==", "Berhasil"), orderBy("tanggal", "desc"));

      const unsubscribe = onSnapshot(
         q,
         snapshot => {
            const data = [];
            snapshot.forEach(doc => {
               data.push({ id: doc.id, ...doc.data() });
            });
            setZakatData(data);
            setLoading(false);
         },
         error => {
            console.error("Error fetching Firebase data:", error);
            setLoading(false);
         }
      );

      return () => {
         window.removeEventListener("resize", handleResize);
         unsubscribe();
      };
   }, []);

   useEffect(() => {
      if (activeTab === "maal") {
         const cleanHarta = Number(harta.replace(/\D/g, ""));
         const total = cleanHarta * 0.025;
         setHasil(total || 0);
      } else {
         const cleanBeras = Number(beras.replace(/\D/g, ""));
         const total = Number(jiwa || 0) * cleanBeras * 2.5;
         setHasil(total || 0);
      }
   }, [harta, jiwa, beras, activeTab]);

   // === BG TITLE PARALLAX ===
   // Posisi unik: kanan atas, miring -12deg, bergerak ke bawah saat scroll
   // Berbeda dari section lain yang biasanya left/bottom — ini right-side, top-anchored
   const yBgTitle = useTransform(scrollY, [400, 1800], [isDesktop ? -30 : 0, isDesktop ? 80 : 0]);
   const opacityBgTitle = useTransform(scrollY, [300, 700, 1600, 1900], [0, 1, 1, 0]);

   const formatRupiah = number => {
      return new Intl.NumberFormat("id-ID").format(number);
   };

   const handleMoneyInputChange = (value, setter) => {
      const formatted = value.replace(/\D/g, "");
      setter(formatted ? new Intl.NumberFormat("id-ID").format(formatted) : "");
   };

   const handleSubmitZakat = async e => {
      e.preventDefault();

      const swalConfig = {
         background: dark ? "#0B0F24" : "#ffffff",
         color: dark ? "#E2E8F0" : "#0F172A",
         customClass: {
            popup: `rounded-[2rem] border ${dark ? "border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)]" : "border-[#E2E8F0] shadow-md"}`,
         },
      };

      if (!nama.trim()) {
         Swal.fire({ ...swalConfig, icon: "warning", title: "Nama Kosong", text: "Mohon isi nama Muzakki terlebih dahulu." });
         return;
      }

      if (hasil <= 0) {
         Swal.fire({ ...swalConfig, icon: "warning", title: "Nilai Zakat Tidak Valid", text: "Silakan masukkan nominal asset atau jumlah jiwa dengan benar." });
         return;
      }

      setIsSubmitting(true);

      try {
         await addDoc(collection(db, "zakat"), {
            nama_muzakki: nama,
            jenis_zakat: activeTab === "maal" ? "harta" : "fitrah",
            jumlah_bayar: Number(hasil),
            status: "Pending",
            tanggal: new Date().toISOString(),
         });

         Swal.fire({
            ...swalConfig,
            icon: "success",
            title: "Berhasil Dikirim!",
            text: "Data laporan zakat Anda aman tersimpan di cloud database.",
            confirmButtonColor: "#10b981",
         });

         setNama("");
         setHarta("");
         setJiwa("");
         setBeras("15.000");
      } catch (error) {
         console.error("Error Firebase Insert:", error);
         Swal.fire({ ...swalConfig, icon: "error", title: "Error Database", text: "Gagal menyimpan data." });
      } finally {
         setIsSubmitting(false);
      }
   };

   const tipeZakatOptions = {
      maal: {
         name: "Zakat Maal",
         title: "Zakat Harta Simpanan",
         desc: "Pembersih Harta Kekayaan",
         detail: "Kewajiban mulia atas kepemilikan harta kekayaan pribadi (emas, tabungan, simpanan, atau aset lancar) yang telah mengendap selama haul (1 tahun) serta mencapai batas nishab minimum syariat.",
      },
      fitrah: {
         name: "Zakat Fitrah",
         title: "Zakat Penyuci Jiwa",
         desc: "Pembersih Diri Ramadhan",
         detail: "Zakat fitrah wajib ditunaikan pada akhir bulan suci Ramadhan untuk mensucikan diri dari noda dosa, dengan takaran senilai 2.5 Kg makanan pokok / beras, atau berupa nominal uang tunai yang setara.",
      },
   };

   const ketentuanZakat = [
      { jenis: "Zakat Maal", nishab: "85g Emas", kadar: "2.5%", haul: "1 Thn" },
      { jenis: "Zakat Profesi", nishab: "522kg Gabah", kadar: "2.5%", haul: "Bulan" },
      { jenis: "Zakat Dagang", nishab: "85g Emas", kadar: "2.5%", haul: "1 Thn" },
      { jenis: "Zakat Fitrah", nishab: "Bahan Pokok", kadar: "2.5 Kg", haul: "Ramadhan" },
   ];

   return (
      <section id="zakat" className="relative min-h-screen w-full py-24 sm:py-32 overflow-hidden flex flex-col justify-center transition-colors duration-500">
         {/* Background Glow Deco */}
         <div className="absolute inset-0 z-0 pointer-events-none">
            <div className={`absolute top-[10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[130px] transition-colors duration-500 ${dark ? "bg-[#5FA8FF]/3" : "bg-[#5FA8FF]/5"}`} />
            <div className={`absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-500 ${dark ? "bg-[#1D5FD0]/2" : "bg-[#1D5FD0]/4"}`} />
         </div>

         {/*
          * ═══════════════════════════════════════════════════════
          * BG TITLE — POSISI & ROTASI UNIK UNTUK SECTION ZAKAT
          * ───────────────────────────────────────────────────────
          * Karakteristik khusus section ini:
          *  • Anchor: kanan atas (right-[-8%] top-[8%])
          *  • Rotasi: -12deg (condong kiri-atas ke kanan-bawah)
          *  • Parallax: bergerak KE BAWAH saat scroll (lawannya section lain)
          *  • Origin transform: kanan (transform-origin: right center)
          *  • Opacity fade-in on enter, fade-out on exit
          *
          * Catatan responsive:
          *  • font-size pakai clamp via style agar tidak overflow di mobile
          *  • Di mobile parallax dinonaktifkan (translateY = 0)
          *  • right offset dikurangi di mobile agar tidak terlalu terpotong
          * ═══════════════════════════════════════════════════════
          */}
         <motion.div
            style={{ y: yBgTitle, opacity: opacityBgTitle }}
            className="absolute z-0 pointer-events-none select-none"
            aria-hidden="true"
            // Posisi: sudut kanan-atas, sedikit terpotong layar (efek disengaja)
            // Rotasi -12deg: miring seperti stempel/watermark premium
            // Berbeda dari section lain yang umumnya center-bottom atau left-bottom
            style={{
               y: yBgTitle,
               opacity: opacityBgTitle,
               top: "6%",
               right: "-6%",
               transform: "rotate(-12deg)",
               transformOrigin: "right center",
            }}>
            <span
               className={`block font-black tracking-tighter uppercase whitespace-nowrap font-sans leading-none transition-colors duration-500 ${dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"}`}
               style={{
                  // clamp: min 80px (mobile), preferred 14vw, max 220px (desktop)
                  // Ini mencegah overflow horizontal di layar kecil
                  fontSize: "clamp(72px, 14vw, 220px)",
                  opacity: 0.055,
               }}>
               ZAKAT
            </span>
         </motion.div>

         <div className="relative z-10 container mx-auto max-w-7xl px-6 md:px-12 w-full space-y-16">
            {/* HEADING AREA */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} viewport={{ once: true }} className="flex flex-col items-center text-center max-w-3xl mx-auto gap-4">
               <div className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.25em] uppercase shadow-sm border transition-colors duration-500 ${dark ? "bg-slate-900 border-white/5 text-[#5FA8FF]" : "bg-[#DFF1FF] border-[#5FA8FF]/10 text-[#1D5FD0]"}`}>
                  <Sparkles size={12} className="animate-pulse" />
                  <span>Rukun Islam ke-4</span>
               </div>

               <h2 className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase transition-colors duration-500 ${dark ? "text-white" : "text-[#0F172A]"}`}>
                  KALKULATOR & PANDUAN <span className="text-[#1D5FD0]">ZAKAT</span>
               </h2>
               <div className="w-12 h-[3px] bg-[#1D5FD0] rounded-full my-1" />
               <p className={`text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-xl transition-colors duration-500 ${dark ? "text-slate-400" : "text-[#94A3B8]"}`}>Hitung takaran kewajiban zakat Anda secara transparan dan akurat sesuai aturan ketetapan Dewan Syariah Nasional.</p>
            </motion.div>

            {/* CONTAINER UTAMA KONTEN */}
            <div className="relative w-full">
               {/* Grid Content Form + Ketentuan */}
               <motion.div className={`relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-[0_8px_30px_rgba(15,23,42,0.015)] border rounded-[2rem] p-6 sm:p-8 lg:p-10 overflow-hidden transition-all duration-500 ${dark ? "bg-[#0B0F24]/60 backdrop-blur-md border-white/5" : "bg-white border-[#E2E8F0]"}`}>
                  {/* KIRI: Formulir Perhitungan */}
                  <div className={`lg:col-span-8 space-y-6 lg:border-r lg:pr-8 transition-colors duration-500 ${dark ? "border-white/5" : "border-slate-200/60"}`}>
                     <div className={`inline-flex p-1 border rounded-2xl w-full max-w-md transition-colors duration-500 ${dark ? "bg-slate-900 border-white/5" : "bg-slate-200/50 border-slate-300/30"}`}>
                        <button type="button" onClick={() => setActiveTab("maal")} className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${activeTab === "maal" ? (dark ? "bg-[#1E293B] text-[#5FA8FF] shadow-sm" : "bg-white text-[#1D5FD0] shadow-sm") : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`}>
                           Zakat Maal (Harta)
                        </button>
                        <button type="button" onClick={() => setActiveTab("fitrah")} className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${activeTab === "fitrah" ? (dark ? "bg-[#1E293B] text-[#5FA8FF] shadow-sm" : "bg-white text-[#1D5FD0] shadow-sm") : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`}>
                           Zakat Fitrah (Jiwa)
                        </button>
                     </div>

                     <div className={`p-4 rounded-2xl border text-left transition-colors duration-500 ${dark ? "border-blue-900/40 bg-blue-950/10" : "border-blue-100/70 bg-blue-50/30"}`}>
                        <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded tracking-wider transition-colors duration-500 ${dark ? "text-[#5FA8FF] bg-blue-900/40" : "text-[#1D5FD0] bg-blue-100/70"}`}>{tipeZakatOptions[activeTab].desc}</span>
                        <h3 className={`text-sm font-black uppercase tracking-tight mt-2 transition-colors duration-500 ${dark ? "text-[#E2E8F0]" : "text-slate-800"}`}>{tipeZakatOptions[activeTab].title}</h3>
                        <p className={`text-xs mt-1 leading-relaxed transition-colors duration-500 ${dark ? "text-slate-400" : "text-slate-500"}`}>{tipeZakatOptions[activeTab].detail}</p>
                     </div>

                     <form onSubmit={handleSubmitZakat} className="space-y-5">
                        <div>
                           <label className={`block text-[10px] uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1.5 transition-colors duration-500 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                              <FaUserCheck className={dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"} /> Nama Muzakki
                           </label>
                           <input type="text" value={nama} onChange={e => setNama(e.target.value)} placeholder="Hamba Allah / Anonim" className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold outline-none transition duration-300 ${dark ? "bg-[#0F172A]/80 border-white/5 text-[#E2E8F0] focus:border-[#5FA8FF] focus:bg-[#0F172A]" : "bg-slate-50/80 border-slate-200 text-[#0F172A] focus:border-[#1D5FD0] focus:bg-white"}`} />
                        </div>

                        <AnimatePresence mode="wait">
                           {activeTab.toLowerCase() === "maal" ? (
                              <motion.div key="maal-inputs" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                                 <div>
                                    <label className={`block text-[10px] uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1.5 transition-colors duration-500 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                                       <FaCoins className={dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"} /> Total Nilai Aset/Harta Kekayaan
                                    </label>
                                    <div className="relative">
                                       <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-400 dark:text-slate-500">Rp.</span>
                                       <input type="text" value={harta} onChange={e => handleMoneyInputChange(e.target.value, setHarta)} placeholder="0" className={`w-full pl-12 pr-4 py-2.5 rounded-xl border font-mono font-bold outline-none transition duration-300 ${dark ? "bg-[#0F172A]/80 border-white/5 text-[#E2E8F0] focus:border-[#5FA8FF] focus:bg-[#0F172A]" : "bg-slate-50/80 border-slate-200 text-[#0F172A] focus:border-[#1D5FD0] focus:bg-white"}`} />
                                    </div>
                                 </div>
                              </motion.div>
                           ) : (
                              <motion.div key="fitrah-inputs" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 <div>
                                    <label className={`block text-[10px] uppercase tracking-widest font-bold mb-1.5 transition-colors duration-500 ${dark ? "text-slate-400" : "text-slate-500"}`}>Jumlah Jiwa Tanggungan</label>
                                    <input type="text" value={jiwa} onChange={e => setJiwa(e.target.value.replace(/\D/g, ""))} placeholder="0 Orang" className={`w-full px-4 py-2.5 rounded-xl border font-mono font-bold outline-none transition duration-300 ${dark ? "bg-[#0F172A]/80 border-white/5 text-[#E2E8F0] focus:border-[#5FA8FF] focus:bg-[#0F172A]" : "bg-slate-50/80 border-slate-200 text-[#0F172A] focus:border-[#1D5FD0] focus:bg-white"}`} />
                                 </div>
                                 <div>
                                    <label className={`block text-[10px] uppercase tracking-widest font-bold mb-1.5 transition-colors duration-500 ${dark ? "text-slate-400" : "text-slate-500"}`}>Harga Beras Pasar (Per Kg)</label>
                                    <div className="relative">
                                       <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-400 dark:text-slate-500">Rp.</span>
                                       <input type="text" value={beras} onChange={e => handleMoneyInputChange(e.target.value, setBeras)} className={`w-full pl-10 pr-4 py-2.5 rounded-xl border font-mono font-bold outline-none transition duration-300 ${dark ? "bg-[#0F172A]/80 border-white/5 text-[#E2E8F0] focus:border-[#5FA8FF] focus:bg-[#0F172A]" : "bg-slate-50/80 border-slate-200 text-[#0F172A] focus:border-[#1D5FD0] focus:bg-white"}`} />
                                    </div>
                                 </div>
                              </motion.div>
                           )}
                        </AnimatePresence>

                        <div className={`pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center p-4 rounded-2xl border transition-colors duration-500 ${dark ? "bg-slate-900/40 border-white/5" : "bg-slate-100/60 border-slate-200/40"}`}>
                           <div className="text-left">
                              <span className="text-[9px] font-mono font-black uppercase tracking-widest block text-slate-400 dark:text-slate-500">Kewajiban Pengeluaran</span>
                              <h3 className={`text-xl font-mono font-black tracking-tight transition-colors duration-500 ${dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"}`}>Rp {formatRupiah(hasil)}</h3>
                           </div>
                           <button type="submit" disabled={isSubmitting} className={`w-full py-3 px-6 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${isSubmitting ? "bg-slate-400 dark:bg-slate-700 cursor-not-allowed" : "bg-[#1D5FD0] hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95"}`}>
                              <FaPaperPlane className={isSubmitting ? "animate-spin" : ""} />
                              {isSubmitting ? "Mengirim..." : "Laporkan Ke Admin"}
                           </button>
                        </div>
                     </form>
                  </div>

                  {/* KANAN: Ketetapan Syariat */}
                  <div className="lg:col-span-4 flex flex-col justify-between space-y-5">
                     <div className="space-y-4">
                        <div className={`flex items-center gap-2 border-b pb-2.5 transition-colors duration-500 ${dark ? "border-white/5" : "border-slate-200"}`}>
                           <FaBookOpen className={`text-sm ${dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"}`} />
                           <h4 className={`text-xs font-black uppercase tracking-wider ${dark ? "text-[#E2E8F0]" : "text-slate-800"}`}>Ketetapan Syariat</h4>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left text-[11px]">
                              <thead>
                                 <tr className={`uppercase font-bold border-b transition-colors duration-500 ${dark ? "text-slate-500 border-white/5" : "text-slate-400 border-slate-200"}`}>
                                    <th className="pb-2">Jenis</th>
                                    <th className="pb-2">Nishab</th>
                                    <th className="pb-2 text-center">Kadar</th>
                                    <th className="pb-2 text-right">Haul</th>
                                 </tr>
                              </thead>
                              <tbody className={`divide-y font-medium transition-colors duration-500 ${dark ? "divide-slate-800 text-slate-400" : "divide-slate-100 text-slate-600"}`}>
                                 {ketentuanZakat.map((item, idx) => (
                                    <tr key={idx} className={`transition-colors duration-300 ${dark ? "hover:bg-slate-800/40" : "hover:bg-slate-100/40"}`}>
                                       <td className={`py-2.5 font-bold ${dark ? "text-[#F8FAFC]" : "text-slate-800"}`}>{item.jenis}</td>
                                       <td className={`py-2.5 font-mono ${dark ? "text-slate-400" : "text-slate-500"}`}>{item.nishab}</td>
                                       <td className={`py-2.5 text-center font-bold ${dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"}`}>{item.kadar}</td>
                                       <td className={`py-2.5 text-right ${dark ? "text-slate-500" : "text-slate-400"}`}>{item.haul}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>

                     <div className={`p-4 rounded-2xl border text-left flex gap-2.5 items-start backdrop-blur-sm transition-colors duration-500 ${dark ? "bg-amber-950/20 border-amber-900/40" : "bg-amber-50/70 border-amber-200/50"}`}>
                        <FaInfoCircle className={`mt-0.5 flex-shrink-0 text-sm ${dark ? "text-amber-500" : "text-amber-600"}`} />
                        <p className={`text-[11px] leading-relaxed font-medium transition-colors duration-500 ${dark ? "text-amber-400" : "text-amber-800"}`}>
                           Pastikan total nilai harta simpanan Anda telah mencapai nilai setara dengan <strong>85 Gram Emas murni</strong> sebelum menunaikan kewajiban Zakat Maal.
                        </p>
                     </div>
                  </div>
               </motion.div>
            </div>

            {/* TABEL BAWAH: Laporan Transaksi Amanah Warga */}
            <motion.div className={`backdrop-blur-lg border shadow-xl rounded-2xl p-6 space-y-4 w-full relative z-10 transition-all duration-500 ${dark ? "bg-[#111A30]/70 border-white/5" : "bg-white/70 border-slate-100"}`}>
               <div className={`flex items-center gap-2 border-b pb-3 transition-colors duration-500 ${dark ? "border-white/5" : "border-slate-100"}`}>
                  <FaChartLine className="text-[#5FA8FF] text-sm" />
                  <h4 className={`text-xs font-black uppercase tracking-wider ${dark ? "text-[#E2E8F0]" : "text-slate-800"}`}>Amanah Penerimaan Warga Teranyar</h4>
               </div>

               <div className="overflow-auto max-h-[220px] pr-1 scrollbar-thin">
                  {loading ? (
                     <div className={`text-center py-8 font-mono text-[11px] animate-pulse ${dark ? "text-slate-500" : "text-slate-400"}`}>Menghubungkan ke basis data Cloud Firebase...</div>
                  ) : zakatData.length === 0 ? (
                     <div className={`text-center py-8 text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>Belum ada laporan data masuk terverifikasi.</div>
                  ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {zakatData.map(item => (
                           <div key={item.id} className={`flex justify-between items-center p-3 rounded-xl border transition duration-300 ${dark ? "bg-[#0F172A]/60 hover:bg-blue-950/20 border-white/5" : "bg-slate-50 hover:bg-blue-50/30 border-slate-100"}`}>
                              <div>
                                 <p className={`text-[11px] font-bold uppercase transition-colors duration-500 ${dark ? "text-[#F8FAFC]" : "text-slate-800"}`}>{"Hamba Allah"}</p>
                                 <p className={`text-[9px] uppercase tracking-tight font-semibold transition-colors duration-500 ${dark ? "text-slate-500" : "text-slate-400"}`}>Zakat {item.jenis_zakat || "Harta"}</p>
                              </div>
                              <div className="flex items-center gap-2.5">
                                 <span className={`font-mono text-xs font-black ${dark ? "text-emerald-400" : "text-emerald-600"}`}>Rp {formatRupiah(item.jumlah_bayar)}</span>
                                 <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] transition-colors duration-500 ${dark ? "bg-emerald-950/60 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`}>
                                    <FaCheck />
                                 </span>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </motion.div>

            {/* Footer Penutup */}
            <motion.div className="text-center pt-2 relative z-10">
               <div className={`inline-block px-4 py-1.5 rounded-full border text-[9px] tracking-widest font-bold uppercase shadow-sm transition-colors duration-500 ${dark ? "border-white/5 bg-[#0F172A] text-slate-500" : "border-slate-200 bg-white text-slate-400"}`}>Standar Sesuai Kompilasi Hukum Islam Kemenag RI & BAZNAS Nasional</div>
            </motion.div>
         </div>
      </section>
   );
}
