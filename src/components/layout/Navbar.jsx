import { Menu, X } from "lucide-react";
import { FaMosque } from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

export default function Navbar() {
   const [open, setOpen] = useState(false);
   const [scrolled, setScrolled] = useState(false);

   // SINKRONISASI TEMA GLOBAL
   const { dark } = useContext(ThemeContext);

   useEffect(() => {
      const handleScroll = () => {
         setScrolled(window.scrollY > 20);
      };

      window.addEventListener("scroll", handleScroll);

      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   const menus = ["Beranda", "Profil", "Jadwal", "Kas", "Zakat", "Agenda", "Berita", "Kontak"];

   return (
      <motion.nav
         initial={{
            y: -40,
            opacity: 0,
         }}
         animate={{
            y: 0,
            opacity: 1,
         }}
         transition={{
            duration: 0.7,
         }}
         className={`
         fixed top-0 left-0 w-full z-50
         transition-all duration-500

         ${scrolled ? (dark ? "bg-[#030712]/75 backdrop-blur-2xl border-b border-white/5" : "bg-[#F8FBFF]/75 backdrop-blur-2xl border-b border-[#DFF1FF]") : "bg-transparent"}

         `}>
         {/* CONTAINER */}

         <div className="max-w-7xl mx-auto px-5">
            <div
               className="
            h-20
            flex items-center justify-between
            ">
               {/* LOGO */}

               <motion.div
                  whileHover={{
                     y: -1,
                  }}
                  className="
                  flex items-center gap-0
                  cursor-pointer cursor-target
                  p-0 m-0
                  ">
                  {/* ICON */}

                  <div
                     className={`
                  w-18 h-18
                  rounded-xl
                  p-0
                  flex items-center justify-center
                  shadow-sm transition-colors duration-500
                  `}>
                     <img src="/favicon.png" alt="mosque icon" width={100} height={100} className={`transition-colors duration-500 ${dark ? "text-[#5FA8FF]" : "text-[#1D5FD0]"}`} />
                  </div>

                  {/* TEXT */}

                  <div>
                     <h1
                        className={`
                     text-[15px]
                     font-semibold
                     leading-none
                     tracking-tight
                     transition-colors duration-500
                     ${dark ? "text-white" : "text-[#0F172A]"}
                     `}>
                        Masjid Ar-Razzaq
                     </h1>

                     <p
                        className={`
                     text-[10px]
                     uppercase
                     tracking-[0.28em]
                     mt-1.5
                     transition-colors duration-500
                     ${dark ? "text-slate-400" : "text-[#5B87C5]"}
                     `}>
                        Desa Geliting
                     </p>
                  </div>
               </motion.div>

               {/* DESKTOP MENU */}

               <div
                  className={`
               hidden lg:flex
               items-center gap-1
               border
               rounded-full
               p-1
               backdrop-blur-xl
               shadow-sm
               transition-all duration-500
               ${dark ? "bg-slate-900/80 border-white/5" : "bg-white/70 border border-[#DFF1FF]"}
               `}>
                  {menus.map((menu, i) => (
                     <motion.a
                        key={i}
                        href={`#${menu.toLowerCase()}`}
                        whileHover={{
                           y: -1,
                        }}
                        className={`
                        px-4 py-2
                        rounded-full
                        text-[13px]
                        font-medium
                        transition-all duration-300
                        cursor-target
                        ${dark ? "text-slate-300 hover:bg-slate-800 hover:text-[#5FA8FF]" : "text-[#475569] hover:bg-[#DFF1FF] hover:text-[#1D5FD0]"}
                        `}>
                        {menu}
                     </motion.a>
                  ))}
               </div>

               {/* BUTTON */}

               <div
                  className="
               hidden lg:flex items-center
               ">
                  <motion.a
                     whileHover={{
                        y: -1,
                     }}
                     whileTap={{
                        scale: 0.98,
                     }}
                     href="/login"
                     className={`
                     px-5 py-2.5
                     rounded-full
                     text-sm
                     font-medium
                     transition-all
                     shadow-sm
                     cursor-target
                     ${dark ? "bg-[#5FA8FF] hover:bg-[#468ee6] text-slate-950" : "bg-[#1D5FD0] hover:bg-[#174EB0] text-white"}
                     `}>
                     Login Admin
                  </motion.a>
               </div>

               {/* MOBILE BUTTON */}

               <button
                  onClick={() => setOpen(!open)}
                  className={`
                  lg:hidden
                  w-11 h-11
                  rounded-2xl
                  backdrop-blur-xl
                  flex items-center justify-center
                  shadow-sm
                  cursor-target
                  transition-all duration-500
                  ${dark ? "border border-white/5 bg-slate-900 text-[#5FA8FF]" : "border border-[#DFF1FF] bg-white/80 text-[#1D5FD0]"}
                  `}>
                  {open ? <X size={20} /> : <Menu size={20} />}
               </button>
            </div>
         </div>

         {/* MOBILE MENU */}

         <AnimatePresence>
            {open && (
               <motion.div
                  initial={{
                     opacity: 0,
                     y: -10,
                  }}
                  animate={{
                     opacity: 1,
                     y: 0,
                  }}
                  exit={{
                     opacity: 0,
                     y: -10,
                  }}
                  transition={{
                     duration: 0.25,
                  }}
                  className="
                  lg:hidden
                  px-5 pb-5
                  ">
                  <div
                     className={`
                  backdrop-blur-2xl
                  border
                  rounded-3xl
                  p-3
                  shadow-xl
                  transition-all duration-500
                  ${dark ? "bg-slate-950/95 border-white/5" : "bg-white/90 border border-[#DFF1FF]"}
                  `}>
                     {/* MENU */}

                     <div
                        className="
                     flex flex-col
                     ">
                        {menus.map((menu, i) => (
                           <a
                              key={i}
                              href={`#${menu.toLowerCase()}`}
                              onClick={() => setOpen(false)}
                              className={`
                              px-4 py-3.5
                              rounded-2xl
                              text-[14px]
                              font-medium
                              transition-all
                              cursor-target
                              ${dark ? "text-slate-300 hover:bg-slate-900 hover:text-[#5FA8FF]" : "text-[#334155] hover:bg-[#DFF1FF] hover:text-[#1D5FD0]"}
                              `}>
                              {menu}
                           </a>
                        ))}
                     </div>

                     {/* CTA */}

                     <motion.a
                        whileHover={{
                           y: -1,
                        }}
                        whileTap={{
                           scale: 0.98,
                        }}
                        href="/login"
                        className={`
        block w-full
        px-5 py-2.5
        rounded-full
        text-sm
        font-medium
        transition-all
        shadow-sm
        cursor-target
        text-center
        ${dark ? "bg-[#5FA8FF] hover:bg-[#468ee6] text-slate-950" : "bg-[#1D5FD0] hover:bg-[#174EB0] text-white"}
    `}>
                        Login Admin
                     </motion.a>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </motion.nav>
   );
}
