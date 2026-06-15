<?php
$current_page = $_GET['page'] ?? 'dashboard';

function isActive($pages, $current_page)
{
   return in_array($current_page, (array) $pages);
}
$kas_active = isActive(['kas', 'kas_tambah', 'kas_print'], $current_page);
$agenda_active = isActive(['agenda', 'agenda_tambah'], $current_page);
$zakat_active = isActive(['zakat', 'zakat_print'], $current_page);
$berita_active = isActive(['berita', 'berita_tambah'], $current_page);
?>

<aside id="sidebar-main"
   class="fixed inset-y-0 left-0 z-50 w-[clamp(240px,18vw,300px)] bg-black border-r border-zinc-800 shadow-xl -translate-x-full md:translate-x-0 transition-transform duration-300 ease-out">

   <!-- HEADER -->
   <div class="flex items-center justify-between px-3 py-2">

      <div class="flex items-center gap-2">
         <div class="bg-yellow-600 w-8 h-8 flex items-center justify-center rounded-full">
            <i class="ri-group-line text-black text-xl"></i>
         </div>

         <span class="text-sm font-semibold text-zinc-300">
            Panel Pengurus Masjid
         </span>
      </div>

      <button id="close-sidebar" class="md:hidden text-zinc-500 hover:text-zinc-300">
         <i class="fas fa-times text-sm"></i>
      </button>

   </div>

   <div class="p-2 overflow-y-auto h-[calc(100vh-60px)]">

      <nav class="space-y-1 text-sm">

         <!-- DASHBOARD -->
         <a href="index.php?page=dashboard"
            class="flex items-center gap-2 px-3 py-2 rounded-md transition
            <?= isActive(['dashboard'], $current_page) ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900' ?>">

            <i class="ri-dashboard-line text-lg
               <?= isActive(['dashboard'], $current_page) ? 'text-yellow-500' : 'text-zinc-500' ?>"></i>

            Dashboard
         </a>

         <!-- ================= KAS ================= -->
         <div class="menu">

            <button type="button" class="menu-trigger w-full flex items-center justify-between px-3 py-2 rounded-md transition
      <?= $kas_active ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900' ?>" data-target="kas-menu">

               <div class="flex items-center gap-2">
                  <i class="ri-wallet-3-line text-lg <?= $kas_active ? 'text-yellow-500' : 'text-zinc-500' ?>"></i>
                  Keuangan
               </div>

               <i class="ri-arrow-down-s-line arrow text-lg transition-transform duration-300
         <?= $kas_active ? 'rotate-180 text-yellow-500' : 'text-zinc-500' ?>"></i>

            </button>

            <div id="kas-menu" class="submenu overflow-hidden transition-all duration-300 pl-9 mt-1 space-y-1
      <?= $kas_active ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0' ?>">

               <a href="index.php?page=kas" class="flex items-center gap-2 py-1 text-sm transition
         <?= $current_page == 'kas' ? 'text-white' : 'text-zinc-400 hover:text-white' ?>">

                  <i class="ri-file-list-line
            <?= $current_page == 'kas' ? 'text-yellow-500' : 'text-zinc-500' ?>"></i>

                  Manajemen Kas
               </a>

               <a href="index.php?page=kas_tambah" class="flex items-center gap-2 py-1 text-sm transition
         <?= $current_page == 'kas_tambah' ? 'text-white' : 'text-zinc-400 hover:text-white' ?>">

                  <i class="ri-add-circle-line
            <?= $current_page == 'kas_tambah' ? 'text-yellow-500' : 'text-zinc-500' ?>"></i>

                  Tambah Data Kas
               </a>

               <a href="index.php?page=kas_print" class="flex items-center gap-2 py-1 text-sm transition
         <?= $current_page == 'kas_print' ? 'text-white' : 'text-zinc-400 hover:text-white' ?>">

                  <i class="ri-printer-line
            <?= $current_page == 'kas_print' ? 'text-yellow-500' : 'text-zinc-500' ?>"></i>

                  Print Kas
               </a>

            </div>

         </div>

         <!-- ================= AGENDA ================= -->
         <div class="menu">

            <button type="button" class="menu-trigger w-full flex items-center justify-between px-3 py-2 rounded-md transition
      <?= $agenda_active ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900' ?>" data-target="agenda-menu">

               <div class="flex items-center gap-2">
                  <i
                     class="ri-calendar-event-line text-lg <?= $agenda_active ? 'text-yellow-500' : 'text-zinc-500' ?>"></i>
                  Kegiatan
               </div>

               <i class="ri-arrow-down-s-line arrow text-lg transition-transform duration-300
         <?= $agenda_active ? 'rotate-180 text-yellow-500' : 'text-zinc-500' ?>"></i>

            </button>

            <div id="agenda-menu" class="submenu overflow-hidden transition-all duration-300 pl-9 mt-1 space-y-1
      <?= $agenda_active ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0' ?>">

               <a href="index.php?page=agenda" class="flex items-center gap-2 py-1 text-sm transition
         <?= $current_page == 'agenda' ? 'text-white' : 'text-zinc-400 hover:text-white' ?>">

                  <i class="ri-calendar-line
            <?= $current_page == 'agenda' ? 'text-yellow-500' : 'text-zinc-500' ?>"></i>

                  Manajemen Agenda
               </a>

               <a href="index.php?page=agenda_tambah" class="flex items-center gap-2 py-1 text-sm transition
         <?= $current_page == 'agenda_tambah' ? 'text-white' : 'text-zinc-400 hover:text-white' ?>">

                  <i class="ri-add-circle-line
            <?= $current_page == 'agenda_tambah' ? 'text-yellow-500' : 'text-zinc-500' ?>"></i>

                  Tambah Agenda
               </a>

            </div>

         </div>

         <!-- ================= ZAKAT ================= -->
         <div class="menu">

            <button type="button" class="menu-trigger w-full flex items-center justify-between px-3 py-2 rounded-md transition
      <?= $zakat_active ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900' ?>" data-target="zakat-menu">

               <div class="flex items-center gap-2">
                  <i class="ri-hand-heart-line text-lg <?= $zakat_active ? 'text-yellow-500' : 'text-zinc-500' ?>"></i>
                  Donasi
               </div>

               <i class="ri-arrow-down-s-line arrow text-lg transition-transform duration-300
         <?= $zakat_active ? 'rotate-180 text-yellow-500' : 'text-zinc-500' ?>"></i>

            </button>

            <div id="zakat-menu" class="submenu overflow-hidden transition-all duration-300 pl-9 mt-1 space-y-1
      <?= $zakat_active ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0' ?>">

               <a href="index.php?page=zakat" class="flex items-center gap-2 py-1 text-sm transition
         <?= $current_page == 'zakat' ? 'text-white' : 'text-zinc-400 hover:text-white' ?>">

                  <i class="ri-hand-coin-line
            <?= $current_page == 'zakat' ? 'text-yellow-500' : 'text-zinc-500' ?>"></i>

                  Manajemen Zakat
               </a>

               <a href="index.php?page=zakat_print" class="flex items-center gap-2 py-1 text-sm transition
         <?= $current_page == 'zakat_print' ? 'text-white' : 'text-zinc-400 hover:text-white' ?>">

                  <i class="ri-printer-line
            <?= $current_page == 'zakat_print' ? 'text-yellow-500' : 'text-zinc-500' ?>"></i>

                  Print Zakat
               </a>

            </div>

         </div>

         <!-- ================= BERITA ================= -->
         <div class="menu">

            <button type="button" class="menu-trigger w-full flex items-center justify-between px-3 py-2 rounded-md transition
      <?= $berita_active ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900' ?>" data-target="berita-menu">

               <div class="flex items-center gap-2">
                  <i class="ri-newspaper-line text-lg <?= $berita_active ? 'text-yellow-500' : 'text-zinc-500' ?>"></i>
                  Publikasi
               </div>

               <i class="ri-arrow-down-s-line arrow text-lg transition-transform duration-300
         <?= $berita_active ? 'rotate-180 text-yellow-500' : 'text-zinc-500' ?>"></i>

            </button>

            <div id="berita-menu" class="submenu overflow-hidden transition-all duration-300 pl-9 mt-1 space-y-1
      <?= $berita_active ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0' ?>">

               <a href="index.php?page=berita" class="flex items-center gap-2 py-1 text-sm transition
         <?= $current_page == 'berita' ? 'text-white' : 'text-zinc-400 hover:text-white' ?>">

                  <i class="ri-file-text-line
            <?= $current_page == 'berita' ? 'text-yellow-500' : 'text-zinc-500' ?>"></i>

                  Manajemen Berita
               </a>

               <a href="index.php?page=berita_tambah" class="flex items-center gap-2 py-1 text-sm transition
         <?= $current_page == 'berita_tambah' ? 'text-white' : 'text-zinc-400 hover:text-white' ?>">

                  <i class="ri-add-circle-line
            <?= $current_page == 'berita_tambah' ? 'text-yellow-500' : 'text-zinc-500' ?>"></i>

                  Tambah Berita
               </a>

            </div>

         </div>

         <div class="border-t border-zinc-800 my-2"></div>

         <!-- WEBSITE -->
         <a href="../index.php" target="_blank"
            class="flex items-center gap-2 px-3 py-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition">

            <i class="ri-external-link-line text-zinc-500"></i>
            Website
         </a>

         <!-- LOGOUT -->
         <button onclick="confirmLogout()"
            class="w-full flex items-center gap-2 px-3 py-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition">

            <i class="ri-door-open-line text-zinc-500"></i>
            Logout
         </button>

      </nav>

   </div>

</aside>

<div id="sidebar-overlay"
   class="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300">
</div>