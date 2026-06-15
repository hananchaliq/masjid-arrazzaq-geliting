import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// IMPORT REACT ICONS SESUAI KODE PHP NATIVE LU
import { RiGroupLine, RiDashboardLine, RiWallet3Line, RiArrowDownSLine, RiFileListLine, RiAddCircleLine, RiPrinterLine, RiCalendarEventLine, RiCalendarLine, RiHandHeartLine, RiHandCoinLine, RiNewspaperLine, RiFileTextLine, RiExternalLinkLine, RiDoorOpenLine, RiTimeLine, RiMenu4Line, RiCloseLine } from "react-icons/ri";

export default function AdminLayout() {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [realtimeClock, setRealtimeClock] = useState("");

   const location = useLocation();
   const navigate = useNavigate();
   const currentPath = location.pathname;

   // --- LOGIC DETEKSI SUBMENU AKTIF (11-12 dengan logic PHP Native lu) ---
   const isKasActive = ["/admin/kas", "/admin/kas/tambah", "/admin/kas/print"].includes(currentPath);
   const isAgendaActive = ["/admin/agenda", "/admin/agenda/tambah"].includes(currentPath);
   const isZakatActive = ["/admin/zakat", "/admin/zakat/print"].includes(currentPath);
   const isBeritaActive = ["/admin/berita", "/admin/berita/tambah"].includes(currentPath);

   // State dropdown menu (otomatis kebuka kalau halamannya lagi diakses)
   const [dropdowns, setDropdowns] = useState({
      kas: isKasActive,
      agenda: isAgendaActive,
      zakat: isZakatActive,
      berita: isBeritaActive,
   });

   // Sinkronisasi state dropdown pas user pindah halaman secara internal
   useEffect(() => {
      setDropdowns({
         kas: isKasActive,
         agenda: isAgendaActive,
         zakat: isZakatActive,
         berita: isBeritaActive,
      });
   }, [currentPath]);

   // Toggle Dropdown Manual
   const toggleDropdown = menu => {
      setDropdowns(prev => ({ ...prev, [menu]: !prev[menu] }));
   };

   // Logic Jam Realtime
   useEffect(() => {
      const updateClock = () => {
         const now = new Date();
         const options = {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
         };
         const formatted = now.toLocaleDateString("id-ID", options).replace(",", " -").replace(/\./g, ":");
         setRealtimeClock(formatted);
      };

      updateClock();
      const interval = setInterval(updateClock, 1000);
      return () => clearInterval(interval);
   }, []);

   // SweetAlert2 Logout
   const confirmLogout = () => {
      Swal.fire({
         title: "Keluar Dari Dashboard?",
         html: `
        <div style="font-size:13px; line-height:1.7; color:#a1a1aa; text-align:center;">
          Anda akan mengakhiri sesi administrator saat ini.<br>
          Semua akses dashboard akan ditutup.
        </div>
      `,
         icon: "warning",
         width: window.innerWidth < 640 ? "300px" : "430px",
         padding: "1.6rem",
         showCancelButton: true,
         confirmButtonText: "Ya, Logout",
         cancelButtonText: "Batal",
         background: "#0a0a0a",
         color: "#e5e5e5",
         confirmButtonColor: "#eab308",
         cancelButtonColor: "#27272a",
         allowOutsideClick: false,
         customClass: {
            popup: "border border-zinc-800 rounded-xl",
            confirmButton: "rounded-xl px-5 py-2 font-medium",
            cancelButton: "rounded-xl px-5 py-2 font-medium",
         },
      }).then(result => {
         if (result.isConfirmed) {
            Swal.fire({
               title: "Logging Out...",
               html: `<div class="mt-3 text-sm text-zinc-400">Mengakhiri sesi administrator</div>`,
               allowOutsideClick: false,
               allowEscapeKey: false,
               showConfirmButton: false,
               background: "#0a0a0a",
               color: "#e5e5e5",
               width: window.innerWidth < 640 ? "260px" : "320px",
               didOpen: () => {
                  Swal.showLoading();
                  setTimeout(() => {
                     navigate("/login");
                  }, 1200);
               },
            });
         }
      });
   };

   const isDashboardActive = currentPath === "/admin" || currentPath === "/admin/dashboard";

   return (
      <div className="bg-black text-zinc-100 antialiased min-h-screen font-sans">
         {/* ================= ASIDE SIDEBAR MAIN ================= */}
         <aside id="sidebar-main" className={`fixed inset-y-0 left-0 z-50 w-[clamp(240px,18vw,300px)] bg-black border-r border-zinc-800 shadow-xl transform transition-transform duration-300 ease-out md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            {/* HEADER SIDEBAR */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-900 md:border-none">
               <div className="flex items-center gap-2">
                  <div className="bg-yellow-600 w-8 h-8 flex items-center justify-center rounded-full">
                     <RiGroupLine className="text-black text-xl" />
                  </div>
                  <span className="text-sm font-semibold text-zinc-300">Panel Pengurus Masjid</span>
               </div>

               <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-zinc-500 hover:text-zinc-300 transition-colors">
                  <RiCloseLine className="text-xl" />
               </button>
            </div>

            {/* CONTAINER NAV LINKS */}
            <div className="p-2 overflow-y-auto h-[calc(100vh-60px)]">
               <nav className="space-y-1 text-sm">
                  {/* DASHBOARD LINK */}
                  <Link to="/admin/dashboard" className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${isDashboardActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900"}`}>
                     <RiDashboardLine className={`text-lg ${isDashboardActive ? "text-yellow-500" : "text-zinc-500"}`} />
                     Dashboard
                  </Link>

                  {/* ================= DROPDOWN KAS ================= */}
                  <div className="menu">
                     <button type="button" onClick={() => toggleDropdown("kas")} className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition ${isKasActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900"}`}>
                        <div className="flex items-center gap-2">
                           <RiWallet3Line className={`text-lg ${isKasActive ? "text-yellow-500" : "text-zinc-500"}`} />
                           Keuangan
                        </div>
                        <RiArrowDownSLine className={`text-lg transition-transform duration-300 ${dropdowns.kas ? "rotate-180 text-yellow-500" : "text-zinc-500"}`} />
                     </button>

                     <div className={`submenu overflow-hidden transition-all duration-300 pl-9 mt-1 space-y-1 ${dropdowns.kas ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                        <SubMenuLink to="/admin/kas" label="Manajemen Kas" active={currentPath === "/admin/kas"} icon={<RiFileListLine />} />
                        <SubMenuLink to="/admin/kas/tambah" label="Tambah Data Kas" active={currentPath === "/admin/kas/tambah"} icon={<RiAddCircleLine />} />
                        <SubMenuLink to="/admin/kas/print" label="Print Kas" active={currentPath === "/admin/kas/print"} icon={<RiPrinterLine />} />
                     </div>
                  </div>

                  {/* ================= DROPDOWN AGENDA ================= */}
                  <div className="menu">
                     <button type="button" onClick={() => toggleDropdown("agenda")} className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition ${isAgendaActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900"}`}>
                        <div className="flex items-center gap-2">
                           <RiCalendarEventLine className={`text-lg ${isAgendaActive ? "text-yellow-500" : "text-zinc-500"}`} />
                           Kegiatan
                        </div>
                        <RiArrowDownSLine className={`text-lg transition-transform duration-300 ${dropdowns.agenda ? "rotate-180 text-yellow-500" : "text-zinc-500"}`} />
                     </button>

                     <div className={`submenu overflow-hidden transition-all duration-300 pl-9 mt-1 space-y-1 ${dropdowns.agenda ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                        <SubMenuLink to="/admin/agenda" label="Manajemen Agenda" active={currentPath === "/admin/agenda"} icon={<RiCalendarLine />} />
                        <SubMenuLink to="/admin/agenda/tambah" label="Tambah Agenda" active={currentPath === "/admin/agenda/tambah"} icon={<RiAddCircleLine />} />
                     </div>
                  </div>

                  {/* ================= DROPDOWN ZAKAT ================= */}
                  <div className="menu">
                     <button type="button" onClick={() => toggleDropdown("zakat")} className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition ${isZakatActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900"}`}>
                        <div className="flex items-center gap-2">
                           <RiHandHeartLine className={`text-lg ${isZakatActive ? "text-yellow-500" : "text-zinc-500"}`} />
                           Donasi
                        </div>
                        <RiArrowDownSLine className={`text-lg transition-transform duration-300 ${dropdowns.zakat ? "rotate-180 text-yellow-500" : "text-zinc-500"}`} />
                     </button>

                     <div className={`submenu overflow-hidden transition-all duration-300 pl-9 mt-1 space-y-1 ${dropdowns.zakat ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                        <SubMenuLink to="/admin/zakat" label="Manajemen Zakat" active={currentPath === "/admin/zakat"} icon={<RiHandCoinLine />} />
                        <SubMenuLink to="/admin/zakat/print" label="Print Zakat" active={currentPath === "/admin/zakat/print"} icon={<RiPrinterLine />} />
                     </div>
                  </div>

                  {/* ================= DROPDOWN PUBLIKASI ================= */}
                  <div className="menu">
                     <button type="button" onClick={() => toggleDropdown("berita")} className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition ${isBeritaActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900"}`}>
                        <div className="flex items-center gap-2">
                           <RiNewspaperLine className={`text-lg ${isBeritaActive ? "text-yellow-500" : "text-zinc-500"}`} />
                           Publikasi
                        </div>
                        <RiArrowDownSLine className={`text-lg transition-transform duration-300 ${dropdowns.berita ? "rotate-180 text-yellow-500" : "text-zinc-500"}`} />
                     </button>

                     <div className={`submenu overflow-hidden transition-all duration-300 pl-9 mt-1 space-y-1 ${dropdowns.berita ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                        <SubMenuLink to="/admin/berita" label="Manajemen Berita" active={currentPath === "/admin/berita"} icon={<RiFileTextLine />} />
                        <SubMenuLink to="/admin/berita/tambah" label="Tambah Berita" active={currentPath === "/admin/berita/tambah"} icon={<RiAddCircleLine />} />
                     </div>
                  </div>

                  <div className="border-t border-zinc-800 my-2"></div>

                  {/* WEBSITE LINK EXTERNAL */}
                  <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition">
                     <RiExternalLinkLine className="text-lg text-zinc-500" />
                     Website
                  </a>

                  {/* LOGOUT BUTTON */}
                  <button onClick={confirmLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition text-left">
                     <RiDoorOpenLine className="text-lg text-zinc-500" />
                     Logout
                  </button>
               </nav>
            </div>
         </aside>

         {/* ================= SIDEBAR BACKDROP OVERLAY (MOBILE) ================= */}
         <div id="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} className={`fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} />

         {/* ================= RIGHT VIEW WRAPPER ================= */}
         <div className="ml-0 md:ml-[clamp(240px,18vw,300px)] flex-1 flex flex-col min-w-0 transition-all duration-300">
            {/* GLOBAL NAVBAR TOP */}
            <nav className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-zinc-900 px-4 py-3 md:px-6 flex items-center justify-between w-full">
               <span className="font-bold text-zinc-300 text-sm md:text-base tracking-wide">Masjid Ar-Razzaq</span>

               <div className="flex items-center gap-2">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-3 py-1 rounded-2xl text-[10px] sm:text-xs font-semibold font-mono tracking-wider flex items-center gap-1.5">
                     <RiTimeLine className="text-sm" />
                     <span>{realtimeClock || "Memuat..."}</span>
                  </div>

                  <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-yellow-400 p-1 hover:bg-zinc-800 rounded-lg transition">
                     <RiMenu4Line className="text-xl" />
                  </button>
               </div>
            </nav>

            {/* CONTAINER MAIN ELEMENT */}
            <main className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto overflow-x-hidden">
               <Outlet />
            </main>
         </div>
      </div>
   );
}

// --- SUB-KOMPONEN REUSABLE SUBMENU LINK ---
function SubMenuLink({ to, label, active, icon }) {
   return (
      <Link to={to} className={`flex items-center gap-2 py-1 text-sm transition ${active ? "text-white" : "text-zinc-400 hover:text-white"}`}>
         <span className={`text-base flex items-center ${active ? "text-yellow-500" : "text-zinc-500"}`}>{icon}</span>
         <span>{label}</span>
      </Link>
   );
}
