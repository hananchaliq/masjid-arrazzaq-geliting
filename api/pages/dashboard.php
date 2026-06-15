<?php

$range = $_GET['range'] ?? 'week';

$where = "1=1";

$start = $_GET['tanggal_mulai'] ?? null;
$end = $_GET['tanggal_selesai'] ?? null;

$where = "1=1";

if ($start && $end) {
   $where .= " AND tanggal BETWEEN '$start' AND '$end' ";
} elseif ($start) {
   $where .= " AND tanggal >= '$start' ";
} elseif ($end) {
   $where .= " AND tanggal <= '$end' ";
}

$sql = "
SELECT 
   DATE(tanggal) as hari,
   SUM(CASE WHEN jenis='masuk' THEN jumlah ELSE 0 END) as masuk,
   SUM(CASE WHEN jenis='keluar' THEN jumlah ELSE 0 END) as keluar
FROM kas
WHERE $where
GROUP BY DATE(tanggal)
ORDER BY hari ASC
";

$stmt = $pdo->query($sql);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$labels = [];
$dataMasuk = [];
$dataKeluar = [];

foreach ($rows as $r) {
   $labels[] = date('d M', strtotime($r['hari']));
   $fullLabels[] = date('d M Y', strtotime($r['hari']));

   $dataMasuk[] = (float) $r['masuk'];
   $dataKeluar[] = (float) $r['keluar'];
}

$labels = $labels ?? [];
$dataMasuk = $dataMasuk ?? [];
$dataKeluar = $dataKeluar ?? [];

?>


<style>
   :root {
      --v-card: #0a0a0a;
      --v-border: #1f1f1f;
      --v-text-main: #ffffff;
      --v-text-muted: #a1a1a1;
      --v-blue: #0070f3;
      --v-success: #10b981;
      --v-error: #ef4444;
   }

   body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: var(--v-text-main);
      letter-spacing: -0.02em;
   }

   /* Scrollbar Minimalist */
   ::-webkit-scrollbar {
      width: 5px;
   }

   ::-webkit-scrollbar-track {
      background: var(--v-bg);
   }

   ::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 10px;
   }

   .vercel-card {
      background: var(--v-card);
      border: 1px solid var(--v-border);
      border-radius: 8px;
      transition: border-color 0.2s all, background 0.2s all;
   }

   .vercel-card:hover {
      border-color: #333;
   }

   .vercel-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--v-text-muted);
   }

   .btn-vercel-primary {
      background: #fff;
      color: #000;
      font-weight: 600;
      font-size: 13px;
      transition: opacity 0.2s;
   }

   .btn-vercel-primary:hover {
      opacity: 0.8;
   }

   .btn-vercel-secondary {
      background: transparent;
      border: 1px solid var(--v-border);
      color: #fff;
      font-weight: 500;
      font-size: 13px;
      transition: background 0.2s;
   }

   .btn-vercel-secondary:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: #444;
   }

   /* Glow Effect like Vercel */
   .status-dot {
      height: 8px;
      width: 8px;
      background-color: var(--v-success);
      border-radius: 50%;
      display: inline-block;
      box-shadow: 0 0 8px var(--v-success);
   }
</style>

<div class="p-4 lg:p-6 max-w-[1700px] mx-auto min-h-screen bg-black">

   <!-- FLASH ERROR ONLY -->
   <?php if (!empty($flash) && $flash['type'] === 'error'): ?>

      <div
         class="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300 backdrop-blur-xl shadow-lg shadow-red-500/5">

         <div class="flex items-start gap-3">

            <div
               class="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">

               <i class="ri-error-warning-line text-red-400"></i>

            </div>

            <div>

               <p class="text-sm font-semibold text-red-200 mb-1">
                  Terjadi Kesalahan
               </p>

               <p class="text-sm text-red-300/80 leading-relaxed">
                  <?= htmlspecialchars($flash['message']); ?>
               </p>

            </div>

         </div>

      </div>

   <?php endif; ?>

   <div class="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      <div>
         <div class="flex items-center gap-2 mb-2">
            <span class="vercel-label">Infrastruktur</span>
            <span class="text-zinc-700">/</span>
            <span class="text-xs text-zinc-400">Dasbor Admin</span>
         </div>
         <h1 class="text-2xl font-bold tracking-tight text-white">Financial Control Center</h1>
         <p class="text-sm text-zinc-500 mt-1">Monitoring arus kas & aktivitas sistem realtime</p>
      </div>

      <div class="flex flex-wrap items-center gap-3">

         <div
            class="vercel-card group py-2.5 px-4 flex items-center gap-3 transition-all duration-300 hover:border-emerald-500/20 hover:-translate-y-0.5">
            <div class="relative flex items-center justify-center">
               <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
               <div class="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
            </div>
            <span class="text-xs font-semibold text-zinc-300 uppercase tracking-tight">Sistem Siap</span>
         </div>

         <div
            class="vercel-card py-2.5 px-4 hidden sm:flex items-center gap-2 transition-all duration-300 hover:border-yellow-500/20 hover:-translate-y-0.5">
            <i class="ri-shield-user-line text-yellow-400 text-sm"></i>
            <span class="text-xs text-zinc-500">Login :</span>
            <span class="text-xs font-mono text-zinc-300"><?php echo $_SESSION['admin_nama']; ?></span>
         </div>

      </div>
   </div>

   <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">

      <div class="lg:col-span-2 vercel-card p-5 relative overflow-hidden">

         <div class="absolute top-0 right-0 w-52 h-52 bg-yellow-500/5 blur-3xl rounded-full"></div>

         <div class="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-5">

            <div>
               <p class="vercel-label mb-2">Analitik Arus Kas</p>

               <div class="flex items-end gap-3">
                  <h3 id="saldo" class=" fade-up text-3xl font-bold tracking-tight text-white"
                     style="font-variant-numeric: tabular-nums;">
                     0
                  </h3>

                  <span
                     class="mb-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/20 font-semibold">
                     LIVE
                  </span>
               </div>
            </div>

            <form method="GET" id="filterForm">

               <div class="flex flex-col sm:flex-row gap-2">

                  <div class="relative">
                     <i class="ri-calendar-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm"></i>

                     <input type="text" id="tanggal_mulai" name="tanggal_mulai"
                        value="<?= $_GET['tanggal_mulai'] ?? '' ?>" placeholder="Tanggal Awal"
                        class="w-full sm:w-[150px] pl-10 pr-3 py-2.5 bg-[#0a0a0a] border border-[#1f1f1f] text-white text-sm rounded-xl focus:border-yellow-500 outline-none transition-all duration-300" />
                  </div>

                  <div class="relative">
                     <i
                        class="ri-calendar-event-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm"></i>

                     <input type="text" id="tanggal_selesai" name="tanggal_selesai"
                        value="<?= $_GET['tanggal_selesai'] ?? '' ?>" placeholder="Tanggal Akhir"
                        class="w-full sm:w-[150px] pl-10 pr-3 py-2.5 bg-[#0a0a0a] border border-[#1f1f1f] text-white text-sm rounded-xl focus:border-yellow-500 outline-none transition-all duration-300" />
                  </div>

               </div>

            </form>

         </div>

         <div class="relative h-[250px] w-full">
            <canvas id="observabilityChart"></canvas>
         </div>

      </div>

      <div class="flex flex-col gap-5">

         <div
            class="vercel-card group p-5 flex-1 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20">

            <div
               class="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 blur-3xl rounded-full transition-all duration-500 group-hover:scale-125">
            </div>

            <div class="relative z-10 flex items-start justify-between">

               <div>
                  <p class="vercel-label mb-3">Total Pemasukan</p>

                  <h2 id="totalMasuk"
                     class=" text-3xl font-bold text-white tracking-tight transition-all duration-300 group-hover:scale-[1.02] origin-left">
                     0
                  </h2>

                  <div class="flex items-center gap-1 text-xs text-emerald-400 font-medium mt-4">
                     Pertumbuhan Stabil

                     <i
                        class="ri-line-chart-line transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"></i>
                  </div>

               </div>

               <div
                  class="w-12 h-12 rounded-xl bg-zinc-950 border border-emerald-500/20 flex items-center justify-center transition-all duration-300 group-hover:bg-emerald-500 group-hover:rotate-6">
                  <i
                     class="ri-funds-line text-emerald-400 text-2xl transition-all duration-300 group-hover:text-black"></i>
               </div>

            </div>

         </div>

         <div
            class="vercel-card group p-5 flex-1 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20">

            <div
               class="absolute bottom-0 left-0 w-28 h-28 bg-red-500/10 blur-3xl rounded-full transition-all duration-500 group-hover:scale-125">
            </div>

            <div class="relative z-10 flex items-start justify-between">

               <div>
                  <p class="vercel-label mb-3">Total Pengeluaran</p>

                  <h2 id="totalKeluar"
                     class=" text-3xl font-bold text-white tracking-tight transition-all duration-300 group-hover:scale-[1.02] origin-left">
                     0
                  </h2>

                  <div class="flex items-center gap-1 text-xs text-red-400 font-medium mt-4">
                     Aliran Keluar Sistem

                     <i
                        class="ri-arrow-right-down-line transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1"></i>
                  </div>

               </div>

               <div
                  class="w-12 h-12 rounded-xl bg-zinc-950 border border-red-500/20 flex items-center justify-center transition-all duration-300 group-hover:bg-red-500 group-hover:-rotate-6">
                  <i
                     class="ri-wallet-3-line text-red-400 text-2xl transition-all duration-300 group-hover:text-black"></i>
               </div>

            </div>

         </div>

      </div>

   </div>

   <div class="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-12">
      <div class="vercel-card p-5 border-l-2 border-l-blue-600">
         <p class="vercel-label">Agenda Aktif</p>
         <h2 class="text-2xl font-bold mt-2"><?php echo $jumlahAgenda; ?> <span
               class="text-sm font-normal text-zinc-500 ml-1">Acara</span></h2>
      </div>
      <div class="vercel-card p-5 border-l-2 border-l-purple-600">
         <p class="vercel-label">Zakat Tertunda</p>
         <h2 class="text-2xl font-bold mt-2"><?php echo $jumlahZakatPending; ?> <span
               class="text-sm font-normal text-zinc-500 ml-1">Perlu Tindakan</span></h2>
      </div>
      <div class="vercel-card p-5 border-l-2 border-l-zinc-100">
         <p class="vercel-label">Total Berita</p>
         <h2 class="text-2xl font-bold mt-2"><?php echo $jumlahBerita; ?> <span
               class="text-sm font-normal text-zinc-500 ml-1">Artikel</span></h2>
      </div>
   </div>

   <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

      <div class="vercel-card flex flex-col">
         <div class="p-8 border-b border-[#1f1f1f]">
            <div class="flex items-center gap-3 mb-4">
               <div class="w-8 h-8 bg-white/5 rounded-md border border-[#333] flex items-center justify-center">
                  <i class="ri-file-chart-line text-sm text-zinc-300"></i>
               </div>
               <h3 class="text-lg font-bold tracking-tight">Rekaman Keuangan</h3>
            </div>
            <p class="text-zinc-500 text-sm leading-relaxed">Kelola seluruh transaksi masuk dan keluar. Laporan akan
               otomatis diperbarui ke sistem utama.</p>
         </div>
         <div class="p-8 bg-[#0d0d0d]/50 flex gap-4">
            <a href="index.php?page=kas" class="btn-vercel-secondary flex-1 py-2.5 rounded-md text-center">Riwayat</a>
            <a href="index.php?page=kas_tambah" class="btn-vercel-primary flex-1 py-2.5 rounded-md text-center">Tambah
               Data</a>
         </div>
      </div>

      <div class="vercel-card flex flex-col">
         <div class="p-8 border-b border-[#1f1f1f]">
            <div class="flex items-center gap-3 mb-4">
               <div class="w-8 h-8 bg-white/5 rounded-md border border-[#333] flex items-center justify-center">
                  <i class="ri-calendar-todo-line text-sm text-zinc-300"></i>
               </div>
               <h3 class="text-lg font-bold tracking-tight">Manajemen Acara</h3>
            </div>
            <p class="text-zinc-500 text-sm leading-relaxed">Terbitkan jadwal kajian, kegiatan rutin, dan agenda besar
               masyarakat secara berkala.</p>
         </div>
         <div class="p-8 bg-[#0d0d0d]/50 flex gap-4">
            <a href="index.php?page=agenda" class="btn-vercel-secondary flex-1 py-2.5 rounded-md text-center">Buka
               Kalender</a>
            <a href="index.php?page=agenda_tambah" class="btn-vercel-primary flex-1 py-2.5 rounded-md text-center">Buat
               Acara</a>
         </div>
      </div>

      <div class="vercel-card p-8 group">
         <div class="flex items-start justify-between">
            <div>
               <h3 class="text-lg font-semibold tracking-tight flex items-center gap-3 mb-2">
                  <i class="ri-funds-line text-zinc-300"></i>
                  Sistem Zakat
               </h3>
               <p class="text-zinc-500 text-sm">Tinjau dan verifikasi laporan zakat dari muzakki.</p>
            </div>
            <a href="index.php?page=zakat"
               class="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition">
               <i class="fas fa-arrow-right text-xs"></i>
            </a>
         </div>
      </div>

      <div class="vercel-card p-8 group">
         <div class="flex items-start justify-between">
            <div>
               <h3 class="text-lg font-bold tracking-tight flex items-center gap-3 mb-2">
                  <i class="ri-quill-pen-line text-zinc-400"></i>
                  Penerbit Berita
               </h3>
               <p class="text-zinc-500 text-sm">Tulis dan kelola artikel informatif untuk masyarakat.</p>
            </div>
            <a href="index.php?page=berita"
               class="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition">
               <i class="fas fa-arrow-right text-xs"></i>
            </a>
         </div>
      </div>

   </div>

   <?php if ($jumlahZakatPending > 0): ?>
      <div class="bg-white rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
         <div class="flex items-center gap-6">
            <div class="w-12 h-12 bg-black rounded-full flex items-center justify-center">
               <i class="fas fa-bell text-white text-lg"></i>
            </div>
            <div>
               <h4 class="text-black text-xl font-black tracking-tight">Verifikasi Diperlukan</h4>
               <p class="text-zinc-600 text-sm font-medium">Ada <?php echo $jumlahZakatPending; ?> data zakat baru yang
                  perlu Anda tinjau sekarang.</p>
            </div>
         </div>
         <a href="index.php?page=zakat"
            class="bg-black text-white px-8 py-3 rounded-md font-bold hover:bg-zinc-800 transition shadow-xl">
            Verify Now
         </a>
      </div>
   <?php endif; ?>

   <div class="vercel-card overflow-hidden">
      <div class="px-8 py-4 border-b border-[#1f1f1f] bg-[#0d0d0d]">
         <p class="vercel-label text-[9px]">Informasi Server</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#1f1f1f]">
         <div class="p-8">
            <p class="text-zinc-500 text-[10px] font-bold uppercase mb-2">Total Transaksi</p>
            <p class="text-xl font-bold"><?php echo $jumlahKas; ?></p>
         </div>
         <div class="p-8">
            <p class="text-zinc-500 text-[10px] font-bold uppercase mb-2">Admin Aktif</p>
            <p class="text-xl font-bold"><?php echo explode(' ', $_SESSION['admin_nama'])[0]; ?></p>
         </div>
         <div class="p-8">
            <p class="text-zinc-500 text-[10px] font-bold uppercase mb-2">Status Node</p>
            <p class="text-xl font-bold text-emerald-500">Terhubung</p>
         </div>
         <div class="p-8">
            <p class="text-zinc-500 text-[10px] font-bold uppercase mb-2">Rilis</p>
            <p class="text-xl font-bold">V.2.6.0</p>
         </div>
      </div>
   </div>

   <p class="mt-16 text-center text-zinc-700 text-[10px] font-medium uppercase tracking-[0.3em]">
      &copy; 2026 Geist Manajemen Infrastruktur
   </p>
</div>

<script>

   flatpickr("#tanggal_mulai", {
      enableTime: false,
      dateFormat: "Y-m-d",
      monthSelectorType: "dropdown",
      locale: "id"
   });

   flatpickr("#tanggal_selesai", {
      enableTime: false,
      dateFormat: "Y-m-d",
      monthSelectorType: "dropdown",
      locale: "id"
   });

   const ctx = document.getElementById('observabilityChart').getContext('2d');

   const goldGradient = ctx.createLinearGradient(0, 0, 0, 400);
   goldGradient.addColorStop(0, 'rgba(212, 175, 55, 0.25)');
   goldGradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

   const redGradient = ctx.createLinearGradient(0, 0, 0, 400);
   redGradient.addColorStop(0, 'rgba(255, 80, 80, 0.25)');
   redGradient.addColorStop(1, 'rgba(255, 80, 80, 0)');

   const labels = <?= json_encode($labels ?? []) ?>;
   const fullLabels = <?= json_encode($fullLabels ?? []) ?>;
   const dataMasuk = <?= json_encode($dataMasuk ?? []) ?>;
   const dataKeluar = <?= json_encode($dataKeluar ?? []) ?>;

   const isMobile = window.innerWidth < 768;

   new Chart(ctx, {
      type: 'line',
      data: {
         labels: labels,
         datasets: [
            {
               label: 'Masuk',
               data: dataMasuk,
               borderColor: '#d4af37',
               backgroundColor: goldGradient,
               borderWidth: 2,
               fill: true,
               tension: 0,
               pointRadius: 0
            },
            {
               label: 'Keluar',
               data: dataKeluar,
               borderColor: '#ff5050',
               backgroundColor: redGradient,
               borderWidth: 2,
               fill: true,
               tension: 0,
               pointRadius: 0
            }
         ]
      },
      options: {
         responsive: true,
         maintainAspectRatio: false,
         // Tips: onResize ditaruh di sini hanya jika ingin update font saat window ditarik-tarik
         onResize: function (chart, size) {
            const mobileMode = size.width < 768;
            chart.options.scales.x.ticks.font.size = mobileMode ? 10 : 11;
            chart.options.scales.y.ticks.font.size = mobileMode ? 10 : 11;
         },

         plugins: {
            legend: { display: false },
            tooltip: {
               enabled: true,
               mode: 'index',
               intersect: false,
               backgroundColor: '#000',
               titleColor: '#fff',
               bodyColor: '#fff',
               titleFont: {
                  size: 14,
                  weight: 'bold'
               },
               bodyFont: {
                  size: 13
               },
               borderColor: '#333',
               borderWidth: 1,
               padding: 10,
               cornerRadius: 6,
               displayColors: true,
               callbacks: {
                  title: function (context) {
                     const index = context[0].dataIndex;
                     return fullLabels[index];
                  },
                  label: function (context) {
                     let value = context.raw || 0;
                     return context.dataset.label + ': Rp ' + Number(value).toLocaleString('id-ID');
                  }
               }
            }
         },

         scales: {
            x: {
               grid: { display: false },
               ticks: {
                  autoSkip: true,
                  autoSkipPadding: 20,
                  maxRotation: 0,
                  minRotation: 0,
                  // Batasi label hanya jika di layar HP
                  maxTicksLimit: isMobile ? 7 : 20,
                  font: {
                     size: isMobile ? 10 : 11
                  },
                  color: '#888'
               }
            },
            y: {
               grid: { color: '#111' },
               ticks: {
                  font: {
                     size: isMobile ? 10 : 11
                  },
                  color: '#888'
               }
            }
         },

         interaction: {
            mode: 'index',
            intersect: false
         }
      }
   });

   let timer;

   function autoFilter() {
      clearTimeout(timer);

      timer = setTimeout(() => {
         document.querySelector('form').submit();
      }, 600);
   }

   document.querySelectorAll('#tanggal_mulai, #tanggal_selesai')
      .forEach(input => {
         input.addEventListener('change', autoFilter);
      });

</script>