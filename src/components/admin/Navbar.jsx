import React, { useState, useEffect } from "react";

export default function Navbar({ onMenuClick }) {
   const [time, setTime] = useState(new Date());

   useEffect(() => {
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
   }, []);

   const formatClock = dateObj => {
      return dateObj
         .toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
         })
         .replace(",", " -")
         .replace(/\./g, ":");
   };

   return (
      <nav className="sticky top-0 z-40 bg-black border-b border-zinc-700 px-3 py-1.5 md:px-4 md:py-2.5 flex items-center justify-between w-full">
         <span className="font-bold text-zinc-300 text-sm sm:text-lg tracking-tight">Masjid Ar-Razzaq</span>

         <div className="flex items-center gap-2">
            <div className="bg-yellow-500/10 border md:text-sm border-yellow-500/20 text-yellow-400 px-2 py-1 rounded-2xl sm:text-xs text-[10px] font-semibold font-mono">
               <span>{formatClock(time)}</span>
            </div>

            <button onClick={onMenuClick} className="md:hidden text-yellow-400 p-0.5 hover:bg-zinc-800 rounded-lg transition">
               <i className="ri-menu-line text-xl"></i>
            </button>
         </div>
      </nav>
   );
}
