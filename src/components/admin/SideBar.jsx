import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, onClose, onLogout }) {
   const location = useLocation();
   const currentPath = location.pathname;

   // State dropdown penampung status keaktifan menu kelompok halaman
   const [openMenus, setOpenMenus] = useState({
      kas: false,
      agenda: false,
      zakat: false,
      berita: false,
   });

   // Fungsi pengecekan rute aktif
   const isActive = paths => paths.includes(currentPath);

   // Sync status dropdown otomatis terbuka jika salah satu sub-rutenya sedang diakses
   useEffect(() => {
      setOpenMenus({
         kas: isActive(["/admin/kas", "/admin/kas/tambah", "/admin/kas/print"]),
         agenda: isActive(["/admin/agenda", "/admin/agenda/tambah"]),
         zakat: isActive(["/admin/zakat", "/admin/zakat/print"]),
         berita: isActive(["/admin/berita", "/admin/berita/tambah"]),
      });
   }, [currentPath]);

   const toggleMenu = target => {
      setOpenMenus(prev => ({
         ...prev,
         [target]: !prev[target],
      }));
   };

   return (
      <>
         <aside
            id="sidebar-main"
            className={`fixed inset-y-0 left-0 z-50 w-[clamp(240px,18vw,300px)] bg-black border-r border-zinc-800 shadow-xl 
        transition-transform duration-300 ease-out md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
            {/* HEADER */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-900 md:border-none">
               <div className="flex items-center gap-2">
                  <div className="bg-yellow-600 w-8 h-8 flex items-center justify-center rounded-full">
                     <i className="ri-group-line text-black text-xl"></i>
                  </div>
                  <span className="text-sm font-semibold text-zinc-300">Panel Pengurus Masjid</span>
               </div>
               <button onClick={onClose} className="md:hidden text-zinc-500 hover:text-zinc-300 p-1">
                  <i className="ri-close-line text-xl"></i>
               </button>
            </div>

            {/* CONTAINER NAV */}
            <div className="p-2 overflow-y-auto h-[calc(100vh-60px)] scrollbar-minimalist">
               <nav className="space-y-1 text-sm">
                  {/* DASHBOARD */}
                  <Link to="/admin" className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${currentPath === "/admin" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900"}`}>
                     <i className={`ri-dashboard-line text-lg ${currentPath === "/admin" ? "text-yellow-500" : "text-zinc-500"}`}></i>
                     Dashboard
                  </Link>

                  {/* ================= KAS / KEUANGAN ================= */}
                  <div className="menu">
                     <button type="button" onClick={() => toggleMenu("kas")} className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition ${openMenus.kas ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900"}`}>
                        <div className="flex items-center gap-2">
                           <i className={`ri-wallet-3-line text-lg ${openMenus.kas ? "text-yellow-500" : "text-zinc-500"}`}></i>
                           Keuangan
                        </div>
                        <i className={`ri-arrow-down-s-line text-lg transition-transform duration-300 ${openMenus.kas ? "rotate-180 text-yellow-500" : "text-zinc-500"}`}></i>
                     </button>
                     <div className="transition-all duration-300 pl-9 mt-1 space-y-1 overflow-hidden" style={{ maxHeight: openMenus.kas ? "160px" : "0px", opacity: openMenus.kas ? 1 : 0 }}>
                        <Link to="/admin/kas" className={`flex items-center gap-2 py-1 transition ${currentPath === "/admin/kas" ? "text-white font-medium" : "text-zinc-400 hover:text-white"}`}>
                           <i className={`ri-file-list-line ${currentPath === "/admin/kas" ? "text-yellow-500" : "text-zinc-500"}`}></i>
                           Manajemen Kas
                        </Link>
                        <Link to="/admin/kas/tambah" className={`flex items-center gap-2 py-1 transition ${currentPath === "/admin/kas/tambah" ? "text-white font-medium" : "text-zinc-400 hover:text-white"}`}>
                           <i className={`ri-add-circle-line ${currentPath === "/admin/kas/tambah" ? "text-yellow-500" : "text-zinc-500"}`}></i>
                           Tambah Data Kas
                        </Link>
                        <Link to="/admin/kas/print" className={`flex items-center gap-2 py-1 transition ${currentPath === "/admin/kas/print" ? "text-white font-medium" : "text-zinc-400 hover:text-white"}`}>
                           <i className={`ri-printer-line ${currentPath === "/admin/kas/print" ? "text-yellow-500" : "text-zinc-500"}`}></i>
                           Print Kas
                        </Link>
                     </div>
                  </div>

                  {/* ================= AGENDA / KEGIATAN ================= */}
                  <div className="menu">
                     <button type="button" onClick={() => toggleMenu("agenda")} className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition ${openMenus.agenda ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900"}`}>
                        <div className="flex items-center gap-2">
                           <i className={`ri-calendar-event-line text-lg ${openMenus.agenda ? "text-yellow-500" : "text-zinc-500"}`}></i>
                           Kegiatan
                        </div>
                        <i className={`ri-arrow-down-s-line text-lg transition-transform duration-300 ${openMenus.agenda ? "rotate-180 text-yellow-500" : "text-zinc-500"}`}></i>
                     </button>
                     <div className="transition-all duration-300 pl-9 mt-1 space-y-1 overflow-hidden" style={{ maxHeight: openMenus.agenda ? "120px" : "0px", opacity: openMenus.agenda ? 1 : 0 }}>
                        <Link to="/admin/agenda" className={`flex items-center gap-2 py-1 transition ${currentPath === "/admin/agenda" ? "text-white font-medium" : "text-zinc-400 hover:text-white"}`}>
                           <i className={`ri-calendar-line ${currentPath === "/admin/agenda" ? "text-yellow-500" : "text-zinc-500"}`}></i>
                           Manajemen Agenda
                        </Link>
                        <Link to="/admin/agenda/tambah" className={`flex items-center gap-2 py-1 transition ${currentPath === "/admin/agenda/tambah" ? "text-white font-medium" : "text-zinc-400 hover:text-white"}`}>
                           <i className={`ri-add-circle-line ${currentPath === "/admin/agenda/tambah" ? "text-yellow-500" : "text-zinc-500"}`}></i>
                           Tambah Agenda
                        </Link>
                     </div>
                  </div>

                  {/* ================= ZAKAT / DONASI ================= */}
                  <div className="menu">
                     <button type="button" onClick={() => toggleMenu("zakat")} className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition ${openMenus.zakat ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900"}`}>
                        <div className="flex items-center gap-2">
                           <i className={`ri-hand-heart-line text-lg ${openMenus.zakat ? "text-yellow-500" : "text-zinc-500"}`}></i>
                           Donasi
                        </div>
                        <i className={`ri-arrow-down-s-line text-lg transition-transform duration-300 ${openMenus.zakat ? "rotate-180 text-yellow-500" : "text-zinc-500"}`}></i>
                     </button>
                     <div className="transition-all duration-300 pl-9 mt-1 space-y-1 overflow-hidden" style={{ maxHeight: openMenus.zakat ? "120px" : "0px", opacity: openMenus.zakat ? 1 : 0 }}>
                        <Link to="/admin/zakat" className={`flex items-center gap-2 py-1 transition ${currentPath === "/admin/zakat" ? "text-white font-medium" : "text-zinc-400 hover:text-white"}`}>
                           <i className={`ri-hand-coin-line ${currentPath === "/admin/zakat" ? "text-yellow-500" : "text-zinc-500"}`}></i>
                           Manajemen Zakat
                        </Link>
                        <Link to="/admin/zakat/print" className={`flex items-center gap-2 py-1 transition ${currentPath === "/admin/zakat/print" ? "text-white font-medium" : "text-zinc-400 hover:text-white"}`}>
                           <i className={`ri-printer-line ${currentPath === "/admin/zakat/print" ? "text-yellow-500" : "text-zinc-500"}`}></i>
                           Print Zakat
                        </Link>
                     </div>
                  </div>

                  {/* ================= BERITA / PUBLIKASI ================= */}
                  <div className="menu">
                     <button type="button" onClick={() => toggleMenu("berita")} className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition ${openMenus.berita ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900"}`}>
                        <div className="flex items-center gap-2">
                           <i className={`ri-newspaper-line text-lg ${openMenus.berita ? "text-yellow-500" : "text-zinc-500"}`}></i>
                           Publikasi
                        </div>
                        <i className={`ri-arrow-down-s-line text-lg transition-transform duration-300 ${openMenus.berita ? "rotate-180 text-yellow-500" : "text-zinc-500"}`}></i>
                     </button>
                     <div className="transition-all duration-300 pl-9 mt-1 space-y-1 overflow-hidden" style={{ maxHeight: openMenus.berita ? "120px" : "0px", opacity: openMenus.berita ? 1 : 0 }}>
                        <Link to="/admin/berita" className={`flex items-center gap-2 py-1 transition ${currentPath === "/admin/berita" ? "text-white font-medium" : "text-zinc-400 hover:text-white"}`}>
                           <i className={`ri-file-text-line ${currentPath === "/admin/berita" ? "text-yellow-500" : "text-zinc-500"}`}></i>
                           Manajemen Berita
                        </Link>
                        <Link to="/admin/berita/tambah" className={`flex items-center gap-2 py-1 transition ${currentPath === "/admin/berita/tambah" ? "text-white font-medium" : "text-zinc-400 hover:text-white"}`}>
                           <i className={`ri-add-circle-line ${currentPath === "/admin/berita/tambah" ? "text-yellow-500" : "text-zinc-500"}`}></i>
                           Tambah Berita
                        </Link>
                     </div>
                  </div>

                  <div className="border-t border-zinc-800 my-2"></div>

                  {/* EXTERNAL LINK KE WEBSITE DEPAN */}
                  <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition">
                     <i className="ri-external-link-line text-zinc-500"></i>
                     Website
                  </a>

                  {/* LOGOUT */}
                  <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition text-left">
                     <i className="ri-door-open-line text-zinc-500"></i>
                     Logout
                  </button>
               </nav>
            </div>
         </aside>

         {/* OVERLAY BACKGROUND MOBILE */}
         {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300" />}
      </>
   );
}
