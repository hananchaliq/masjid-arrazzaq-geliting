   <?php
   session_start();
   require_once 'includes/functions.php';

   if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
      redirect('pages/index.php');
   }

   $error = '';

   if ($_SERVER['REQUEST_METHOD'] === 'POST') {

      $username = trim($_POST['username'] ?? '');
      $password = trim($_POST['password'] ?? '');

      if (empty($username) || empty($password)) {

         $error = 'Username dan password wajib diisi.';

      } else {

         try {

            $pdo = getDBConnection();

            $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? LIMIT 1");
            $stmt->execute([$username]);

            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {

               $_SESSION['admin_logged_in'] = true;
               $_SESSION['admin_id'] = $user['id'];
               $_SESSION['admin_username'] = $user['username'];
               $_SESSION['admin_nama'] = $user['nama_lengkap'];

               setFlashMessage('success', 'Selamat datang, ' . $user['nama_lengkap'] . '!');
               redirect('pages/index.php');

            } else {

               $error = 'Akses ditolak. Kredensial tidak valid.';
            }

         } catch (PDOException $e) {

            $error = 'Terjadi kesalahan sistem.';
         }
      }
   }
   ?>

   <!DOCTYPE html>
   <html lang="id">

   <head>

      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">

      <title>Admin Login</title>

      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
         rel="stylesheet">

      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" rel="stylesheet">

      <script src="https://cdn.tailwindcss.com"></script>

      <style>
         :root {
            --bg: #000;
            --card: #0a0a0a;
            --border: #1f1f1f;
            --muted: #71717a;
            --text: #fff;
            --gold: #d4af37;
         }

         * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
         }

         body {
            font-family: 'Inter', sans-serif;
            background:
               radial-gradient(circle at top left, rgba(212, 175, 55, 0.08), transparent 30%),
               radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.03), transparent 30%),
               #000;
            color: var(--text);
            letter-spacing: -0.02em;
            overflow-x: hidden;
         }

         ::-webkit-scrollbar {
            width: 5px;
         }

         ::-webkit-scrollbar-track {
            background: #000;
         }

         ::-webkit-scrollbar-thumb {
            background: #222;
            border-radius: 20px;
         }

         .main-container {
            background: rgba(9, 9, 9, 0.92);
            border: 1px solid #1a1a1a;
            border-radius: 18px;
            backdrop-filter: blur(14px);
         }

         .soft-divider {
            border-color: #1a1a1a;
         }

         .soft-card {
            background: linear-gradient(180deg, #0b0b0b, #070707);
            border: 1px solid #171717;
            border-radius: 12px;
            transition: .3s;
         }

         .soft-card:hover {
            transform: translateY(-3px);
            border-color: #2a2a2a;
         }

         .label-ui {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: .14em;
            color: var(--muted);
            font-weight: 700;
         }

         .input {
            width: 100%;
            background: rgba(5, 5, 5, .9);
            border: 1px solid #1c1c1c;
            border-radius: 12px;
            padding: 14px 14px;
            color: white;
            font-size: 14px;
            transition: .3s;
         }

         .input:focus {
            outline: none;
            border-color: rgba(212, 175, 55, .5);
            box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.08);
         }

         .btn-primary {
            background: linear-gradient(180deg, #fff, #d6d6d6);
            color: black;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 700;
            transition: .3s;
            position: relative;
            overflow: hidden;
         }

         .btn-primary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -120%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg,
                  transparent,
                  rgba(255, 255, 255, 0.4),
                  transparent);
            transition: .6s;
         }

         .btn-primary:hover::before {
            left: 120%;
         }

         .btn-primary:hover {
            transform: translateY(-2px) scale(1.01);
            box-shadow: 0 20px 35px rgba(212, 175, 55, 0.15);
         }

         .status-dot {
            width: 7px;
            height: 7px;
            border-radius: 999px;
            background: #10b981;
            box-shadow: 0 0 12px #10b981;
            animation: pulseGlow 2.5s infinite;
         }

         @keyframes floatSlow {
            0% {
               transform: translateY(0px);
            }

            50% {
               transform: translateY(-8px);
            }

            100% {
               transform: translateY(0px);
            }
         }

         @keyframes pulseGlow {

            0%,
            100% {
               opacity: .4;
               transform: scale(1);
            }

            50% {
               opacity: 1;
               transform: scale(1.12);
            }
         }

         @keyframes slideFade {

            0% {
               opacity: 0;
               transform: translateY(20px);
            }

            100% {
               opacity: 1;
               transform: translateY(0);
            }
         }

         @keyframes scan {

            0% {
               transform: translateY(0);
               opacity: 0;
            }

            10% {
               opacity: 1;
            }

            100% {
               transform: translateY(260px);
               opacity: 0;
            }
         }

         @keyframes move {

            0% {
               transform: translate(0, 0);
            }

            50% {
               transform: translate(40px, 30px);
            }

            100% {
               transform: translate(-20px, 20px);
            }
         }

         .animate-float {
            animation: floatSlow 5s ease-in-out infinite;
         }

         .animate-slide {
            animation: slideFade .8s ease forwards;
         }

         .animate-glow {
            animation: pulseGlow 3s ease-in-out infinite;
         }
      </style>

   </head>

   <body>

      <div class="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10">

         <div
            class="main-container animate-slide w-full max-w-6xl overflow-hidden grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] shadow-[0_0_80px_rgba(255,255,255,0.03)]">

            <!-- LEFT -->
            <div class="p-5 sm:p-7 lg:p-10 border-b lg:border-b-0 lg:border-r soft-divider">

               <div class="max-w-2xl">

                  <div class="flex flex-wrap items-center gap-2 mb-7">

                     <span class="label-ui">
                        Infrastruktur
                     </span>

                     <span class="text-zinc-700">
                        /
                     </span>

                     <span class="text-xs text-zinc-500">
                        Dashboard Admin
                     </span>

                  </div>

                  <h1 class="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight leading-tight">

                     Admin Control Center

                  </h1>

                  <p class="text-sm text-zinc-500 mt-4 leading-relaxed max-w-xl">

                     Sistem internal pengurus dan takmir masjid untuk
                     mengelola transaksi kas, zakat, agenda,
                     dan aktivitas operasional harian.

                  </p>

                  <div class="flex flex-wrap items-center gap-3 mt-8">

                     <div class="soft-card px-4 py-2 flex items-center gap-3">

                        <div class="status-dot"></div>

                        <span class="text-xs font-medium text-zinc-300">
                           Sistem Aktif
                        </span>

                     </div>

                     <div class="soft-card px-4 py-2 flex items-center gap-2">

                        <i class="fa-solid fa-shield-halved text-yellow-500 text-xs"></i>

                        <span class="text-xs text-zinc-400">
                           Protected Access
                        </span>

                     </div>

                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">

                     <div class="soft-card p-4 flex items-start gap-4">

                        <div
                           class="w-10 h-10 rounded-xl bg-black border border-[#202020] flex items-center justify-center shrink-0">

                           <i class="fa-solid fa-user-shield text-yellow-500 text-sm"></i>

                        </div>

                        <div>

                           <h3 class="text-sm font-semibold">
                              Akses Pengurus
                           </h3>

                           <p class="text-sm text-zinc-500 mt-1 leading-relaxed">

                              Hanya akun resmi pengurus dan takmir
                              yang memiliki akses sistem.

                           </p>

                        </div>

                     </div>

                     <div class="soft-card p-4 flex items-start gap-4">

                        <div
                           class="w-10 h-10 rounded-xl bg-black border border-[#202020] flex items-center justify-center shrink-0">

                           <i class="fa-solid fa-database text-yellow-500 text-sm"></i>

                        </div>

                        <div>

                           <h3 class="text-sm font-semibold">
                              Data Terpusat
                           </h3>

                           <p class="text-sm text-zinc-500 mt-1 leading-relaxed">

                              Seluruh transaksi dan laporan tersimpan
                              dalam satu sistem utama.

                           </p>

                        </div>

                     </div>

                     <div class="soft-card p-4 flex items-start gap-4">

                        <div
                           class="w-10 h-10 rounded-xl bg-black border border-[#202020] flex items-center justify-center shrink-0">

                           <i class="fa-solid fa-lock text-yellow-500 text-sm"></i>

                        </div>

                        <div>

                           <h3 class="text-sm font-semibold">
                              Session Security
                           </h3>

                           <p class="text-sm text-zinc-500 mt-1 leading-relaxed">

                              Password dienkripsi menggunakan bcrypt
                              dan session protection.

                           </p>

                        </div>

                     </div>

                     <div class="soft-card p-4 flex items-start gap-4">

                        <div
                           class="w-10 h-10 rounded-xl bg-black border border-[#202020] flex items-center justify-center shrink-0">

                           <i class="fa-solid fa-chart-line text-yellow-500 text-sm"></i>

                        </div>

                        <div>

                           <h3 class="text-sm font-semibold">
                              Monitoring
                           </h3>

                           <p class="text-sm text-zinc-500 mt-1 leading-relaxed">

                              Aktivitas kas dan operasional dipantau
                              secara realtime.

                           </p>

                        </div>

                     </div>

                  </div>

                  <div
                     class="mt-10 pt-5 border-t soft-divider flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                     <div class="text-[10px] uppercase tracking-[0.18em] text-zinc-700">

                        Internal Secure Panel

                     </div>

                     <div class="text-[10px] uppercase tracking-[0.18em] text-zinc-700">

                        Version 2.6.0

                     </div>

                  </div>

               </div>

            </div>

            <!-- RIGHT -->
            <div class="flex items-center justify-center p-5 sm:p-7 lg:p-10">

               <div class="w-full max-w-md">

                  <a href="index.php"
                     class="inline-flex items-center gap-2 mb-6 text-sm text-zinc-500 hover:text-white transition-all duration-300 hover:-translate-x-1">

                     <i class="fa-solid fa-arrow-left text-[12px]"></i>

                     <span>
                        Kembali ke Website
                     </span>

                  </a>

                  <div class="mb-7 animate-slide">

                     <div
                        class="w-11 h-11 rounded-xl bg-black border border-[#1f1f1f] flex items-center justify-center mb-4 animate-float animate-glow">

                        <i class="fa-solid fa-mosque text-yellow-500"></i>

                     </div>

                     <p class="label-ui mb-2">

                        Authentication

                     </p>

                     <h2 class="text-2xl sm:text-3xl font-bold tracking-tight">

                        Login Administrator

                     </h2>

                     <p class="text-sm text-zinc-500 mt-2 leading-relaxed">

                        Masukkan username dan password
                        untuk mengakses dashboard sistem.

                     </p>

                  </div>

                  <?php if ($error): ?>

                     <div
                        class="mb-5 border border-red-500/20 bg-red-500/10 rounded-xl p-4 text-sm text-red-300 animate-slide">

                        <div class="flex items-start gap-3">

                           <i class="fa-solid fa-circle-exclamation mt-0.5"></i>

                           <span>
                              <?= htmlspecialchars($error); ?>
                           </span>

                        </div>

                     </div>

                  <?php endif; ?>

                  <form method="POST" class="space-y-4">

                     <!-- USERNAME -->
                     <div>

                        <label class="label-ui block mb-2">
                           Username
                        </label>

                        <div class="relative group overflow-hidden rounded-xl">

                           <div
                              class="absolute -top-16 -left-16 w-40 h-40 rounded-full bg-yellow-500/10 blur-3xl opacity-0 transition-all duration-500 group-focus-within:opacity-100 animate-[move_10s_infinite_alternate] pointer-events-none">
                           </div>

                           <div
                              class="absolute top-0 left-0 w-full h-[2px] bg-yellow-500/10 opacity-0 group-focus-within:opacity-100 animate-[scan_4s_linear_infinite] pointer-events-none">
                           </div>

                           <i
                              class="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm z-10 transition-all duration-300 group-focus-within:text-yellow-500 group-focus-within:scale-110"></i>

                           <input type="text" name="username" autocomplete="off"
                              class="input pl-11 transition-all duration-300 focus:scale-[1.01] focus:-translate-y-[2px]"
                              placeholder="Masukkan username">

                        </div>

                     </div>

                     <!-- PASSWORD -->
                     <div>

                        <label class="label-ui block mb-2">
                           Password
                        </label>

                        <div class="relative group overflow-hidden rounded-xl">

                           <div
                              class="absolute -top-16 -left-16 w-40 h-40 rounded-full bg-yellow-500/10 blur-3xl opacity-0 transition-all duration-500 group-focus-within:opacity-100 animate-[move_10s_infinite_alternate] pointer-events-none">
                           </div>

                           <div
                              class="absolute top-0 left-0 w-full h-[2px] bg-yellow-500/10 opacity-0 group-focus-within:opacity-100 animate-[scan_4s_linear_infinite] pointer-events-none">
                           </div>

                           <i
                              class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm z-10 transition-all duration-300 group-focus-within:text-yellow-500 group-focus-within:scale-110"></i>

                           <input type="password" name="password"
                              class="input pl-11 transition-all duration-300 focus:scale-[1.01] focus:-translate-y-[2px]"
                              placeholder="Masukkan password">

                        </div>

                     </div>

                     <!-- BUTTON -->
                     <button type="submit" class="btn-primary w-full py-3 mt-2 transition-all duration-300">

                        Login Sekarang

                     </button>

                  </form>

                  <div class="mt-6 pt-5 border-t soft-divider text-center text-xs text-zinc-600 leading-relaxed">

                     Restricted for authorized personnel only.<br>
                     Semua aktivitas login tercatat otomatis.

                  </div>

               </div>

            </div>

         </div>

      </div>

   </body>

   </html>