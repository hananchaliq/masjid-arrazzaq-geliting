<?php
/**
 * Dashboard Admin
 * File: dashboard/index.php
 */

session_start();
require_once '../includes/functions.php';

// Cek login
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
   redirect('../login.php');
}

$page = $_GET['page'] ?? 'dashboard';

$allowedPages = [
   'dashboard',

   'tes',

   'kas',
   'kas_tambah',
   'kas_edit',
   'kas_print',
   'kas_aksi',

   'agenda',
   'agenda_tambah',
   'agenda_edit',
   'agenda_aksi',

   'berita',
   'berita_tambah',
   'berita_edit',
   'berita_print',
   'berita_aksi',

   'zakat',
   'zakat_aksi',
   'zakat_print',
   'kas_aksi',
];

if (!in_array($page, $allowedPages)) {
   $page = 'dashboard';
}

$actionPages = [
   'zakat_aksi',
   'kas_aksi',
   'agenda_aksi',
   'berita_aksi',
];

if (in_array($page, $actionPages)) {
   include "$page.php";
   exit;
}

$totalMasuk = getTotalMasuk();
$totalKeluar = getTotalKeluar();
$saldo = getSaldo();

$pdo = getDBConnection();
$jumlahKas = $pdo->query("SELECT COUNT(*) FROM kas")->fetchColumn();
$jumlahAgenda = $pdo->query("SELECT COUNT(*) FROM agenda WHERE tanggal_mulai >= NOW()")->fetchColumn();
$jumlahZakatPending = $pdo->query("SELECT COUNT(*) FROM zakat WHERE status = 'Pending'")->fetchColumn();
$jumlahBerita = $pdo->query("SELECT COUNT(*) FROM berita")->fetchColumn();

$totalZakat = $pdo->query("SELECT SUM(jumlah_bayar) FROM zakat WHERE status = 'Berhasil'")->fetchColumn() ?? 0;

$flash = null;

if (isset($_SESSION['flash'])) {
   $flash = getFlashMessage();
}
?>

<?php include 'layout/header.php'; ?>

<style>
   /* ===== ANIMASI TAMBAHAN ===== */

   body {
      animation: pageIn .6s ease-out;
   }

   @keyframes pageIn {
      from {
         opacity: 0;
         transform: translateY(10px);
      }

      to {
         opacity: 1;
         transform: translateY(0);
      }
   }

   main {
      animation: fadeUp .7s ease-out;
   }

   @keyframes fadeUp {
      from {
         opacity: 0;
         transform: translateY(20px);
      }

      to {
         opacity: 1;
         transform: translateY(0);
      }
   }

   /* hover card biar gak mati rasa */
   .soft-card {
      transition: .25s ease;
   }

   .soft-card:hover {
      transform: translateY(-4px) scale(1.01);
      box-shadow: 0 10px 30px rgba(255, 255, 255, 0.04);
   }

   /* nav floating feel */
   nav {
      backdrop-filter: blur(10px);
      animation: navDrop .5s ease-out;
   }

   @keyframes navDrop {
      from {
         transform: translateY(-10px);
         opacity: 0;
      }

      to {
         transform: translateY(0);
         opacity: 1;
      }
   }
</style>

<body class="bg-black text-zinc-100 antialiased">

   <div class="flex min-h-screen">

      <?php include 'layout/sidebar.php'; ?>

      <div class="ml-0 md:ml-[clamp(200px,18vw,300px)] flex-1 flex flex-col min-w-0 transition-all">

         <nav
            class="sticky top-0 z-40 bg-black border-b border-zinc-700 px-3 py-1.5 md:px-4 md:py-2.5 flex items-center justify-between w-full">

            <span class="font-bold text-zinc-300 text-sm sm:text-lg">
               Masjid Ar-Razzaq
            </span>

            <div class="flex items-center gap-2">
               <div
                  class="bg-yellow-500/10 border md:text-sm border-yellow-500/20 text-yellow-400 px-2 py-1 rounded-2xl sm:text-xs text-[10px] font-semibold">
                  <span id="realtime-clock"></span>
               </div>

               <button id="mobile-menu-btn"
                  class="md:hidden text-yellow-400 p-0.5 hover:bg-zinc-800 rounded-lg transition">
                  <i class="fas fa-bars text-xl"></i>
               </button>
            </div>

         </nav>

         <main class="w-full overflow-x-hidden">

            <?php include "$page.php"; ?>

         </main>

      </div>

   </div>

   <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

   <script>

      const sidebar = document.getElementById('sidebar-main');
      const overlay = document.getElementById('sidebar-overlay');
      const mobileBtn = document.getElementById('mobile-menu-btn');
      const closeBtn = document.getElementById('close-sidebar');

      function openSidebar() {

         if (window.innerWidth >= 768) return;

         sidebar.classList.remove('-translate-x-full');

         overlay.classList.remove('opacity-0', 'pointer-events-none');
         overlay.classList.add('opacity-100', 'pointer-events-auto');

         document.body.classList.add('overflow-hidden');

      }

      function closeSidebar() {

         sidebar.classList.add('-translate-x-full');

         overlay.classList.add('opacity-0', 'pointer-events-none');
         overlay.classList.remove('opacity-100', 'pointer-events-auto');

         document.body.classList.remove('overflow-hidden');

      }

      mobileBtn?.addEventListener('click', openSidebar);
      closeBtn?.addEventListener('click', closeSidebar);
      overlay?.addEventListener('click', closeSidebar);

      window.addEventListener('resize', () => {
         if (window.innerWidth >= 768) closeSidebar();
      });


      document.querySelectorAll('.menu-toggle').forEach(btn => {
         btn.addEventListener('click', () => {
            const submenu = btn.parentElement.nextElementSibling;
            const icon = btn.querySelector('i');

            submenu.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
         });
      });

      <?php if (!empty($flash) && $flash['type'] === 'success'): ?>
         Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: '<?= addslashes($flash['message']); ?>',
            toast: true,
            position: window.innerWidth < 640 ? 'top-start' : 'top-end',
            width: window.innerWidth < 640 ? '220px' : '380px',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#000000',
            color: '#e5e5e5',
            customClass: {
               popup: 'swal-gold'
            }
         });
         <?php unset($_SESSION['flash']); endif; ?>

      const easeOutCubic = (t, b, c, d) => {
         t /= d;
         t--;
         return c * (t * t * t + 1) + b;
      };

      function animate(id, value) {

         const counter = new countUp.CountUp(id, value, {
            startVal: 0,
            duration: 3,
            useEasing: true,
            easingFn: easeOutCubic,
            separator: '.',
            prefix: 'Rp ',
            useGrouping: true
         });

         counter.start();
      }

      animate('saldo', <?= $saldo ?>);
      animate('totalMasuk', <?= $totalMasuk ?>);
      animate('totalKeluar', <?= $totalKeluar ?>);
      animate('totalZakat', <?= $totalZakat ?>);

      function updateClock() {

         const now = new Date();

         const options = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
         };

         document.getElementById('realtime-clock').innerHTML =
            now.toLocaleDateString('id-ID', options)
               .replace(',', ' -')
               .replace(/\./g, ':');
      }

      updateClock();
      setInterval(updateClock, 1000);

      function confirmLogout() {

         Swal.fire({

            position: 'center',

            title: 'Keluar Dari Dashboard?',

            html: `
   <div style="
            font-size:13px;
            line-height:1.7;
            color:#a1a1aa;
            text-align:center;
         ">
      Anda akan mengakhiri sesi administrator saat ini.<br>
      Semua akses dashboard akan ditutup.
   </div>
   `,

            icon: 'warning',

            width: window.innerWidth < 640 ? '300px' : '430px', padding: '1.6rem', showCancelButton: true,
            confirmButtonText: 'Ya, Logout', cancelButtonText: 'Batal', background: '#0a0a0a', color: '#e5e5e5',
            confirmButtonColor: '#eab308', cancelButtonColor: '#27272a', allowOutsideClick: false, showClass: {
               popup: `
      animate__animated animate__fadeInUp animate__faster ` }, hideClass: {
               popup: ` animate__animated
      animate__fadeOutDown animate__faster ` }, customClass: {
               popup: 'swal-gold',
               title: 'text-lg font-bold text-center', htmlContainer: 'text-center', confirmButton: 'rounded-xl px-5 py-2',
               cancelButton: 'rounded-xl px-5 py-2'
            }
         }).then((result) => {

            if (result.isConfirmed) {

               Swal.fire({
                  title: 'Logging Out...',
                  html: `
         <div class="mt-3 text-sm text-zinc-400">
            Mengakhiri sesi administrator
         </div>
      `,

                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  showConfirmButton: false,

                  background: '#0a0a0a',
                  color: '#e5e5e5',

                  width: window.innerWidth < 640 ? '260px' : '320px',

                  didOpen: () => {
                     Swal.showLoading();

                     setTimeout(() => {
                        window.location.href = 'logout.php';
                     }, 1200);
                  }
               });

            }
         });

      }

      document.querySelectorAll('.menu-trigger').forEach(btn => {
         btn.addEventListener('click', () => {

            const target = document.getElementById(btn.dataset.target);
            const arrow = btn.querySelector('.arrow');

            const isOpen = target.classList.contains('open');

            // toggle state
            if (isOpen) {
               target.classList.remove('open');
               target.style.maxHeight = "0px";
               target.style.opacity = "0";
               arrow.classList.remove('rotate-180');
            } else {
               target.classList.add('open');
               target.style.maxHeight = target.scrollHeight + "px";
               target.style.opacity = "1";
               arrow.classList.add('rotate-180');
            }

         });
      });

   </script>

</body>

</html>