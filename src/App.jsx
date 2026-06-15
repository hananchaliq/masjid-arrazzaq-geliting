import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Kas from "./pages/admin/Kas";
import TambahKas from "./pages/admin/TambahKas";
import EditKas from "./pages/admin/EditKas";
import Agenda from "./pages/admin/Agenda";
import TambahAgenda from "./pages/admin/TambahAgenda";
import EditAgenda from "./pages/admin/EditAgenda";
import Zakat from "./pages/admin/Zakat";
import Berita from "./pages/admin/Berita";
import TambahBerita from "./pages/admin/TambahBerita";
import EditBerita from "./pages/admin/EditBerita";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomCursor from "./components/ui/CustomCursor";

// Komponen helper khusus untuk mendeteksi perubahan URL di dalam BrowserRouter
function ScrollbarThemeHandler() {
   const location = useLocation();

   useEffect(() => {
      if (location.pathname.includes("/admin")) {
         document.body.classList.add("admin-mode");
         document.documentElement.classList.add("admin-mode");
      } else {
         document.body.classList.remove("admin-mode");
         document.documentElement.classList.remove("admin-mode");
      }
   }, [location]);

   return null; // Komponen ini hanya menjalankan side-effect, tidak perlu merender HTML
}

export default function App() {
   return (
      <BrowserRouter>
         {/* Handler tema ditaruh di sini agar berada di dalam konteks BrowserRouter */}
         <ScrollbarThemeHandler />
         <CustomCursor />

         <Routes>
            {/* Halaman Publik Utama */}
            <Route path="/" element={<Home />} />

            {/* Halaman Login Admin */}
            <Route path="/login" element={<Login />} />

            {/* Cluster Admin */}
            <Route
               path="/admin"
               element={
                  <ProtectedRoute>
                     <AdminLayout />
                  </ProtectedRoute>
               }>
               <Route index element={<Dashboard />} />
               <Route path="dashboard" element={<Dashboard />} />
               <Route path="kas" element={<Kas />} />
               <Route path="kas/tambah" element={<TambahKas />} />
               <Route path="kas/edit/:id" element={<EditKas />} />
               <Route path="zakat" element={<Zakat />} />
               <Route path="agenda" element={<Agenda />} />
               <Route path="agenda/tambah" element={<TambahAgenda />} />
               <Route path="agenda/edit/:id" element={<EditAgenda />} />
               <Route path="berita" element={<Berita />} />
               <Route path="berita/tambah" element={<TambahBerita />} />
               <Route path="berita/edit/:id" element={<EditBerita />} />
            </Route>

            {/* Fallback global */}
            <Route path="*" element={<Navigate to="/" replace />} />
         </Routes>
      </BrowserRouter>
   );
}
