   import React, { useEffect, useState, useRef } from "react";
   import Chart from "chart.js/auto";
   import flatpickr from "flatpickr";
   import "flatpickr/dist/flatpickr.min.css";

   // Integrasi Icons modern lewat paket React Icons
   import { RiErrorWarningLine, RiShieldUserLine, RiCalendarLine, RiCalendarEventLine, RiFundsLine, RiWallet3Line, RiFileChartLine, RiCalendarTodoLine, RiQuillPenLine } from "react-icons/ri";
   import { FaArrowRight, FaBell } from "react-icons/fa";

   // Koneksi Cloud Firestore SDK
   import { collection, onSnapshot, query, where } from "firebase/firestore";
   import { db } from "../../config/firebase"; // Sesuaikan lokasi file config Firebase pusat lu, bre

   const Dashboard = () => {
      // --- STATES ---
      const [databaseKasMentah, setDatabaseKasMentah] = useState([]);
      const [stats, setStats] = useState({
         agenda: 0,
         berita: 0,
         zakatPending: 0,
         totalKasCount: 0,
         error: null,
      });

      // State Filter Sinkronisasi Form
      const [filter, setFilter] = useState({
         tanggalMulai: "",
         tanggalSelesai: "",
      });

      // Komponen Ringkasan Finansial untuk Canvas Chart & Metric Card
      const [finansial, setFinansial] = useState({
         masuk: 0,
         keluar: 0,
         saldo: 0,
      });

      // --- REFS FOR DOM MANIPULATION ---
      const chartRef = useRef(null);
      const chartInstanceRef = useRef(null);
      const tglMulaiRef = useRef(null);
      const tglSelesaiRef = useRef(null);

      // Helper Formatter Rupiah Indonesia (Sesuai Kebutuhan)
      const formatIDR = num => "Rp " + Number(num).toLocaleString("id-ID");

      // 1. Hook: Pipeline Realtime Listener Node Firebase
      useEffect(() => {
         // Jalur Realtime: Agenda
         const unsubAgenda = onSnapshot(collection(db, "agenda"), snap => {
            setStats(prev => ({ ...prev, agenda: snap.size }));
         });

         // Jalur Realtime: Berita
         const unsubBerita = onSnapshot(collection(db, "berita"), snap => {
            setStats(prev => ({ ...prev, berita: snap.size }));
         });

         // Jalur Realtime: Zakat (Hanya hitung status yang butuh tindakan / pending)
         const qZakat = query(collection(db, "zakat"), where("status", "==", "Pending"));
         const unsubZakat = onSnapshot(qZakat, snap => {
            setStats(prev => ({ ...prev, zakatPending: snap.size }));
         });

         // Jalur Realtime Inti: Rekaman Log Kas Keuangan
         const unsubKas = onSnapshot(
            collection(db, "kas"),
            snap => {
               const dataKas = [];
               snap.forEach(doc => {
                  const d = doc.data();
                  dataKas.push({
                     id: doc.id,
                     tanggal: d.tanggal, // Ekspektasi data string format: YYYY-MM-DD
                     jenis: d.jenis, // Value: 'masuk' atau 'keluar'
                     jumlah: parseFloat(d.jumlah || 0),
                     keterangan: d.keterangan,
                  });
               });

               setDatabaseKasMentah(dataKas);
               setStats(prev => ({ ...prev, totalKasCount: dataKas.length, error: null }));
            },
            error => {
               setStats(prev => ({ ...prev, error: error.message }));
            }
         );

         // Clean up kueri memori stream pas ganti halaman
         return () => {
            unsubAgenda();
            unsubBerita();
            unsubZakat();
            unsubKas();
         };
      }, []);

      // 2. Hook: Konfigurasi Kalender Flatpickr
      useEffect(() => {
         const fpMulai = flatpickr(tglMulaiRef.current, {
            dateFormat: "Y-m-d",
            monthSelectorType: "dropdown",
            onChange: (selectedDates, dateStr) => {
               setFilter(prev => ({ ...prev, tanggalMulai: dateStr }));
            },
         });

         const fpSelesai = flatpickr(tglSelesaiRef.current, {
            dateFormat: "Y-m-d",
            monthSelectorType: "dropdown",
            onChange: (selectedDates, dateStr) => {
               setFilter(prev => ({ ...prev, tanggalSelesai: dateStr }));
            },
         });

         return () => {
            fpMulai.destroy();
            fpSelesai.destroy();
         };
      }, []);

      // 3. Hook: Logic Filter SQL SQL BETWEEN & Render Grafis ChartJS
      useEffect(() => {
         // Filter internal sisi client menggantikan klausa WHERE SQL PHP
         let filteredData = databaseKasMentah.filter(item => {
            if (filter.tanggalMulai && item.tanggal < filter.tanggalMulai) return false;
            if (filter.tanggalSelesai && item.tanggal > filter.tanggalSelesai) return false;
            return true;
         });

         // Akumulasi Finansial dari Data Hasil Filter (Sama seperti kalkulasi dinamis SQL)
         let totalMasuk = 0;
         let totalKeluar = 0;
         filteredData.forEach(item => {
            if (item.jenis === "masuk") totalMasuk += item.jumlah;
            if (item.jenis === "keluar") totalKeluar += item.jumlah;
         });

         setFinansial({
            masuk: totalMasuk,
            keluar: totalKeluar,
            saldo: totalMasuk - totalKeluar,
         });

         if (filteredData.length === 0) {
            if (chartInstanceRef.current) chartInstanceRef.current.destroy();
            return;
         }

         // Urutkan data berdasarkan rentang Tanggal Ascending
         filteredData.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

         // Eksekusi logic GROUP BY DATE(tanggal) di JavaScript
         const grupTanggal = {};
         filteredData.forEach(item => {
            if (!grupTanggal[item.tanggal]) {
               grupTanggal[item.tanggal] = { masuk: 0, keluar: 0 };
            }
            grupTanggal[item.tanggal][item.jenis] += item.jumlah;
         });

         const labels = [];
         const fullLabels = [];
         const dataMasuk = [];
         const dataKeluar = [];
         const listBulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

         Object.keys(grupTanggal).forEach(tgl => {
            const d = new Date(tgl);
            const tglPendek = `${String(d.getDate()).padStart(2, "0")} ${listBulan[d.getMonth()]}`;
            const tglLengkap = `${String(d.getDate()).padStart(2, "0")} ${listBulan[d.getMonth()]} ${d.getFullYear()}`;

            labels.push(tglPendek);
            fullLabels.push(tglLengkap);
            dataMasuk.push(grupTanggal[tgl].masuk);
            dataKeluar.push(grupTanggal[tgl].keluar);
         });

         // Setup Engine Canvas Grafik Chart
         const ctx = chartRef.current.getContext("2d");
         const goldGradient = ctx.createLinearGradient(0, 0, 0, 400);
         goldGradient.addColorStop(0, "rgba(212, 175, 55, 0.25)");
         goldGradient.addColorStop(1, "rgba(212, 175, 55, 0)");

         const redGradient = ctx.createLinearGradient(0, 0, 0, 400);
         redGradient.addColorStop(0, "rgba(255, 80, 80, 0.25)");
         redGradient.addColorStop(1, "rgba(255, 80, 80, 0)");

         const isMobile = window.innerWidth < 768;

         if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
         }

         chartInstanceRef.current = new Chart(ctx, {
            type: "line",
            data: {
               labels: labels,
               datasets: [
                  {
                     label: "Masuk",
                     data: dataMasuk,
                     borderColor: "#d4af37",
                     backgroundColor: goldGradient,
                     borderWidth: 2,
                     fill: true,
                     tension: 0,
                     pointRadius: 0,
                  },
                  {
                     label: "Keluar",
                     data: dataKeluar,
                     borderColor: "#ff5050",
                     backgroundColor: redGradient,
                     borderWidth: 2,
                     fill: true,
                     tension: 0,
                     pointRadius: 0,
                  },
               ],
            },
            options: {
               responsive: true,
               maintainAspectRatio: false,
               plugins: {
                  legend: { display: false },
                  tooltip: {
                     enabled: true,
                     mode: "index",
                     intersect: false,
                     backgroundColor: "#000",
                     titleColor: "#fff",
                     bodyColor: "#fff",
                     titleFont: { size: 14, weight: "bold" },
                     bodyFont: { size: 13 },
                     borderColor: "#333",
                     borderWidth: 1,
                     padding: 10,
                     cornerRadius: 6,
                     callbacks: {
                        title: context => fullLabels[context[0].dataIndex],
                        label: context => context.dataset.label + ": " + formatIDR(context.raw || 0),
                     },
                  },
               },
               scales: {
                  x: {
                     grid: { display: false },
                     ticks: {
                        autoSkip: true,
                        autoSkipPadding: 20,
                        maxRotation: 0,
                        maxTicksLimit: isMobile ? 7 : 20,
                        color: "#888",
                        font: { size: isMobile ? 10 : 11 },
                     },
                  },
                  y: {
                     grid: { color: "#111" },
                     ticks: {
                        color: "#888",
                        font: { size: isMobile ? 10 : 11 },
                        callback: value => formatIDR(value),
                     },
                  },
               },
            },
         });
      }, [databaseKasMentah, filter]);

      return (
         <div className="p-4 lg:p-6 max-w-[1700px] mx-auto min-h-screen bg-black text-white font-sans antialiased tracking-tight">
            {/* CAPTURE ERROR HANDLER */}
            {stats.error && (
               <div className="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300 backdrop-blur-xl shadow-lg">
                  <div className="flex items-start gap-3">
                     <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                        <RiErrorWarningLine className="text-red-400 text-lg" />
                     </div>
                     <div>
                        <p className="text-sm font-semibold text-red-200 mb-1">Terjadi Kesalahan Node</p>
                        <p className="text-sm text-red-300/80 leading-relaxed">{stats.error}</p>
                     </div>
                  </div>
               </div>
            )}

            {/* HEADER DASBOR */}
            <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Infrastruktur</span>
                     <span className="text-zinc-700">/</span>
                     <span className="text-xs text-zinc-400">Dasbor Admin</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">Financial Control Center</h1>
                  <p className="text-sm text-zinc-500 mt-1">Monitoring arus kas & aktivitas sistem realtime</p>
               </div>

               <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg py-2.5 px-4 flex items-center gap-3 transition-all hover:border-emerald-500/20">
                     <div className="relative flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <div className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
                     </div>
                     <span className="text-xs font-semibold text-zinc-300 uppercase tracking-tight">Sistem Siap</span>
                  </div>

                  <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg py-2.5 px-4 hidden sm:flex items-center gap-2 transition-all hover:border-yellow-500/20">
                     <RiShieldUserLine className="text-yellow-400 text-sm" />
                     <span className="text-xs text-zinc-500">Login :</span>
                     <span className="text-xs font-mono text-zinc-300">Admin Root</span>
                  </div>
               </div>
            </div>

            {/* CORE FINANCIAL CONTROL GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
               {/* Box Chart Analitik */}
               <div className="lg:col-span-2 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-5 relative overflow-hidden group hover:border-[#333] transition-all">
                  <div className="absolute top-0 right-0 w-52 h-52 bg-yellow-500/5 blur-3xl rounded-full"></div>

                  <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-5">
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Analitik Arus Kas</p>
                        <div className="flex items-end gap-3">
                           <h3 className="text-3xl font-bold tracking-tight text-white tabular-nums">{formatIDR(finansial.saldo)}</h3>
                           <span className="mb-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/20 font-semibold">LIVE</span>
                        </div>
                     </div>

                     {/* Input Kalender React Filter */}
                     <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative">
                           <RiCalendarLine className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
                           <input type="text" ref={tglMulaiRef} placeholder="Tanggal Awal" className="w-full sm:w-[150px] pl-10 pr-3 py-2.5 bg-[#0a0a0a] border border-[#1f1f1f] text-white text-sm rounded-xl focus:border-yellow-500 outline-none transition-all duration-300" />
                        </div>
                        <div className="relative">
                           <RiCalendarEventLine className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
                           <input type="text" ref={tglSelesaiRef} placeholder="Tanggal Akhir" className="w-full sm:w-[150px] pl-10 pr-3 py-2.5 bg-[#0a0a0a] border border-[#1f1f1f] text-white text-sm rounded-xl focus:border-yellow-500 outline-none transition-all duration-300" />
                        </div>
                     </div>
                  </div>

                  <div className="relative h-[250px] w-full">
                     <canvas ref={chartRef}></canvas>
                  </div>
               </div>

               {/* Counter Pemasukan & Pengeluaran */}
               <div className="flex flex-col gap-5">
                  <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg group p-5 flex-1 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20">
                     <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 blur-3xl rounded-full transition-all duration-500 group-hover:scale-125"></div>
                     <div className="relative z-10 flex items-start justify-between">
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Total Pemasukan</p>
                           <h2 className="text-3xl font-bold text-white tracking-tight tabular-nums transition-all group-hover:scale-[1.02] origin-left">{formatIDR(finansial.masuk)}</h2>
                           <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium mt-4">
                              Pertumbuhan Stabil <RiFundsLine className="transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                           </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-emerald-500/20 flex items-center justify-center transition-all group-hover:bg-emerald-500 group-hover:rotate-6">
                           <RiFundsLine className="text-emerald-400 text-2xl transition-all group-hover:text-black" />
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg group p-5 flex-1 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20">
                     <div className="absolute bottom-0 left-0 w-28 h-28 bg-red-500/10 blur-3xl rounded-full transition-all duration-500 group-hover:scale-125"></div>
                     <div className="relative z-10 flex items-start justify-between">
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Total Pengeluaran</p>
                           <h2 className="text-3xl font-bold text-white tracking-tight tabular-nums transition-all group-hover:scale-[1.02] origin-left">{formatIDR(finansial.keluar)}</h2>
                           <div className="flex items-center gap-1 text-xs text-red-400 font-medium mt-4">
                              Aliran Keluar Sistem <RiWallet3Line className="transition-all group-hover:translate-x-1 group-hover:translate-y-1" />
                           </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-red-500/20 flex items-center justify-center transition-all group-hover:bg-red-500 group-hover:-rotate-6">
                           <RiWallet3Line className="text-red-400 text-2xl transition-all group-hover:text-black" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* METADATA SUB-STATS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-12">
               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-5 border-l-2 border-l-zinc-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Agenda Aktif</p>
                  <h2 className="text-2xl font-bold mt-2 tabular-nums">
                     {stats.agenda} <span className="text-sm font-normal text-zinc-500 ml-1">Acara</span>
                  </h2>
               </div>
               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-5 border-l-2 border-l-zinc-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Zakat Tertunda</p>
                  <h2 className="text-2xl font-bold mt-2 tabular-nums">
                     {stats.zakatPending} <span className="text-sm font-normal text-zinc-500 ml-1">Perlu Tindakan</span>
                  </h2>
               </div>
               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-5 border-l-2 border-l-zinc-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total Berita</p>
                  <h2 className="text-2xl font-bold mt-2 tabular-nums">
                     {stats.berita} <span className="text-sm font-normal text-zinc-500 ml-1">Artikel</span>
                  </h2>
               </div>
            </div>

            {/* BOTTOM HUB MANAGEMENT CARD */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg flex flex-col">
                  <div className="p-8 border-b border-[#1f1f1f]">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-white/5 rounded-md border border-[#333] flex items-center justify-center">
                           <RiFileChartLine className="text-sm text-zinc-300" />
                        </div>
                        <h3 className="text-lg font-bold tracking-tight">Rekaman Keuangan</h3>
                     </div>
                     <p className="text-zinc-500 text-sm leading-relaxed">Kelola seluruh transaksi masuk dan keluar. Laporan akan otomatis diperbarui ke sistem utama.</p>
                  </div>
                  <div className="p-8 bg-[#0d0d0d]/50 flex gap-4">
                     <button className="flex-1 py-2.5 border border-[#1f1f1f] bg-transparent text-white text-sm font-medium rounded-md transition hover:bg-white/5 hover:border-[#444]">Riwayat</button>
                     <button className="flex-1 py-2.5 bg-white text-black text-sm font-semibold rounded-md transition hover:opacity-80">Tambah Data</button>
                  </div>
               </div>

               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg flex flex-col">
                  <div className="p-8 border-b border-[#1f1f1f]">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-white/5 rounded-md border border-[#333] flex items-center justify-center">
                           <RiCalendarTodoLine className="text-sm text-zinc-300" />
                        </div>
                        <h3 className="text-lg font-bold tracking-tight">Manajemen Acara</h3>
                     </div>
                     <p className="text-zinc-500 text-sm leading-relaxed">Terbitkan jadwal kajian, kegiatan rutin, dan agenda besar masyarakat secara berkala.</p>
                  </div>
                  <div className="p-8 bg-[#0d0d0d]/50 flex gap-4">
                     <button className="flex-1 py-2.5 border border-[#1f1f1f] bg-transparent text-white text-sm font-medium rounded-md transition hover:bg-white/5 hover:border-[#444]">Buka Kalender</button>
                     <button className="flex-1 py-2.5 bg-white text-black text-sm font-semibold rounded-md transition hover:opacity-80">Buat Acara</button>
                  </div>
               </div>

               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-8 group">
                  <div className="flex items-start justify-between">
                     <div>
                        <h3 className="text-lg font-semibold tracking-tight flex items-center gap-3 mb-2">
                           <RiFundsLine className="text-zinc-300" /> Sistem Zakat
                        </h3>
                        <p className="text-zinc-500 text-sm">Tinjau dan verifikasi laporan zakat dari muzakki.</p>
                     </div>
                     <button className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center transition hover:bg-white hover:text-black">
                        <FaArrowRight className="text-xs" />
                     </button>
                  </div>
               </div>

               <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-8 group">
                  <div className="flex items-start justify-between">
                     <div>
                        <h3 className="text-lg font-bold tracking-tight flex items-center gap-3 mb-2">
                           <RiQuillPenLine className="text-zinc-400" /> Penerbit Berita
                        </h3>
                        <p className="text-zinc-500 text-sm">Tulis dan kelola artikel informatif untuk masyarakat.</p>
                     </div>
                     <button className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center transition hover:bg-white hover:text-black">
                        <FaArrowRight className="text-xs" />
                     </button>
                  </div>
               </div>
            </div>

            {/* ALERT PANEL DI VERIFIKASI ZAKAT (Dinamis Sesuai State Firebase) */}
            {stats.zakatPending > 0 && (
               <div className="bg-white rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-12 shadow-xl">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                        <FaBell className="text-white text-lg" />
                     </div>
                     <div>
                        <h4 class="text-black text-xl font-black tracking-tight">Verifikasi Diperlukan</h4>
                        <p className="text-zinc-600 text-sm font-medium">Ada {stats.zakatPending} data zakat baru yang perlu Anda tinjau sekarang.</p>
                     </div>
                  </div>
                  <button className="bg-black text-white px-8 py-3 rounded-md font-bold transition hover:bg-zinc-800 whitespace-nowrap shadow-xl">Verify Now</button>
               </div>
            )}

            {/* SERVER DETAILS GRID FOOTER */}
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg overflow-hidden">
               <div className="px-8 py-4 border-b border-[#1f1f1f] bg-[#0d0d0d]">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Informasi Server</p>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#1f1f1f]">
                  <div className="p-8">
                     <p className="text-zinc-500 text-[10px] font-bold uppercase mb-2">Total Transaksi</p>
                     <p className="text-xl font-bold tabular-nums">{stats.totalKasCount}</p>
                  </div>
                  <div className="p-8">
                     <p className="text-zinc-500 text-[10px] font-bold uppercase mb-2">Admin Aktif</p>
                     <p className="text-xl font-bold">Admin</p>
                  </div>
                  <div className="p-8">
                     <p className="text-zinc-500 text-[10px] font-bold uppercase mb-2">Status Node</p>
                     <p className="text-xl font-bold text-emerald-500">Terhubung</p>
                  </div>
                  <div className="p-8">
                     <p className="text-zinc-500 text-[10px] font-bold uppercase mb-2">Rilis</p>
                     <p className="text-xl font-bold">V.4.0.0-React-Mesh</p>
                  </div>
               </div>
            </div>

            <p className="mt-16 text-center text-zinc-700 text-[10px] font-medium uppercase tracking-[0.3em]">&copy; 2026 Geist Manajemen Infrastruktur</p>
         </div>
      );
   };

   export default Dashboard;
