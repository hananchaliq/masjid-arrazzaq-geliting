import { useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";

// Import Koneksi Firebase
import { db } from "../config/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import HeroSection from "../components/sections/HeroSection";
import ProfileSection from "../components/sections/ProfileSection";
import PrayerSection from "../components/sections/PrayerSection";
import FinanceSection from "../components/sections/FinanceSection";
import ZakatSection from "../components/sections/ZakatSection";
import AgendaSection from "../components/sections/AgendaSection";
import NewsSection from "../components/sections/NewsSection";

export default function Home() {
   const [dark, setDark] = useState(true);

   // 🚀 State Global untuk nampung data dari Cloud Firebase
   const [kasList, setKasList] = useState([]);
   const [zakatList, setZakatList] = useState([]);
   const [agendaList, setAgendaList] = useState([]);
   const [newsList, setNewsList] = useState([]);

   useEffect(() => {
      // 1. Dengerin data KAS secara realtime
      const unsubKas = onSnapshot(collection(db, "kas"), snapshot => {
         setKasList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      // 2. Dengerin data ZAKAT secara realtime (Urut tanggal terbaru)
      const qZakat = query(collection(db, "zakat"), orderBy("tanggal", "desc"));
      const unsubZakat = onSnapshot(qZakat, snapshot => {
         setZakatList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      // 3. Dengerin data AGENDA secara realtime (Urut jadwal mulai)
      const qAgenda = query(collection(db, "agenda"), orderBy("tanggal_mulai", "asc"));
      const unsubAgenda = onSnapshot(qAgenda, snapshot => {
         setAgendaList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      // 4. Dengerin data BERITA secara realtime
      const qNews = query(collection(db, "berita"), orderBy("tanggal", "desc"));
      const unsubNews = onSnapshot(qNews, snapshot => {
         setNewsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      // Cleanup listener biar gak memory leak
      return () => {
         unsubKas();
         unsubZakat();
         unsubAgenda();
         unsubNews();
      };
   }, []);

   return (
      <ThemeContext.Provider value={{ dark, setDark }}>
         <div className={`relative overflow-hidden transition-colors duration-500 ${dark ? "bg-[#050816] text-white" : "bg-[#f3f6fb] text-[#0f172a]"}`}>
            {/* Global Background Deco */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] [background-size:40px_40px] [background-image:linear-gradient(to_right,#94a3b8_1px,transparent_1px),linear-gradient(to_bottom,#94a3b8_1px,transparent_1px)]" />
            <div className="fixed inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <Navbar />

            {/* Main Content Layout */}
            <main className="relative z-10">
               <HeroSection />
               <SectionDivider dark={dark} />

               <ProfileSection />
               <SectionDivider dark={dark} />

               <PrayerSection />
               <SectionDivider dark={dark} />

               {/* 🚀 OPER DATA KAS KE COMPONENT FINANCE */}
               <FinanceSection kasData={kasList} dark={dark} />
               <SectionDivider dark={dark} />

               {/* 🚀 OPER DATA ZAKAT KE COMPONENT ZAKAT */}
               <ZakatSection zakatData={zakatList} dark={dark} />
               <SectionDivider dark={dark} />

               {/* 🚀 OPER DATA AGENDA KE COMPONENT AGENDA */}
               <AgendaSection agendaData={agendaList} dark={dark} />
               <SectionDivider dark={dark} />

               {/* 🚀 OPER DATA BERITA KE COMPONENT NEWS */}
               <NewsSection newsData={newsList} dark={dark} />
            </main>

            <Footer />
         </div>
      </ThemeContext.Provider>
   );
}

/* Section Divider Line Component */
function SectionDivider({ dark }) {
   return (
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-6">
         <div className={`h-px w-full ${dark ? "bg-white/5" : "bg-slate-200"}`} />
         <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${dark ? "bg-[#111827] border border-white/10" : "bg-white border border-slate-200"}`} />
      </div>
   );
}
