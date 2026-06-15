import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
// Import ikon spinner dari react-icons/fa6
import { FaSpinner } from "react-icons/fa6";

export default function ProtectedRoute({ children }) {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      // Mengecek status login secara realtime dari Firebase Auth
      const unsubscribe = onAuthStateChanged(auth, currentUser => {
         setUser(currentUser);
         setLoading(false);
      });

      return () => unsubscribe();
   }, []);

   // Tampilkan loading sebentar saat Firebase sedang mengecek session
   if (loading) {
      return (
         <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-3">
            {/* Komponen React Icon dengan kelas animasi spin dari Tailwind */}
            <FaSpinner className="animate-spin text-3xl text-yellow-500" />
            <span className="text-sm font-medium text-zinc-400 tracking-wider">Memuat Autentikasi...</span>
         </div>
      );
   }

   // Jika tidak ada user yang login, kunci halaman dan tendang ke /login
   if (!user) {
      return <Navigate to="/login" replace />;
   }

   return children;
}
