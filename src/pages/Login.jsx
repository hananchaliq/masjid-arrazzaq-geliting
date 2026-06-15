import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import CustomCursor from "../components/ui/CustomCursor";

// 🚀 DI-IMPORT LANGSUNG BIAR ANTI KOTAK KOSONG, BRE!
import { ArrowLeft, User, Lock, ShieldAlert, UserCheck, Database, ShieldCheck, TrendingUp, LayoutGrid } from "lucide-react";

export default function Login() {
   // 🛠️ Mengubah 'username' menjadi 'email' agar klop dengan metode bawaan Firebase Auth
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const handleLogin = async e => {
      e.preventDefault();
      setError("");

      if (!email || !password) {
         setError("Email dan password wajib diisi, bre.");
         return;
      }

      try {
         setLoading(true);
         // 🚀 Sekarang Firebase menerima format email yang valid
         await signInWithEmailAndPassword(auth, email, password);
         navigate("/admin/dashboard");
      } catch (err) {
         console.error(err);
         // Memberikan pesan error yang ramah dan jelas
         setError("Akses ditolak. Email atau password salah.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div
         className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-[#000] text-[#fff] antialiased relative"
         style={{
            backgroundImage: `
              radial-gradient(circle at top left, rgba(212, 175, 55, 0.08), transparent 30%),
              radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.03), transparent 30%),
              #000
            `,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "-0.02em",
         }}>
         <style>{`
         @keyframes slideFade { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
         @keyframes pulseGlow { 0%, 100% { opacity: .4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.12); } }
         @keyframes floatSlow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
         .soft-card { background: linear-gradient(180deg, #0b0b0b, #070707); border: 1px solid #171717; border-radius: 12px; transition: .3s; }
         .soft-card:hover { transform: translateY(-3px); border-color: #2a2a2a; }
       `}</style>

         <div className="bg-[rgba(9,9,9,0.92)] border border-[#1a1a1a] rounded-[18px] backdrop-blur-[14px] w-full max-w-6xl overflow-hidden grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] shadow-[0_0_80px_rgba(255,255,255,0.03)] opacity-0 animate-[slideFade_0.8s_ease_forwards]">
            {/* LEFT COLUMN */}
            <div className="p-5 sm:p-7 lg:p-10 border-b lg:border-b-0 lg:border-r border-[#1a1a1a]">
               <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 mb-7">
                     <span className="text-[10px] uppercase tracking-[0.14em] text-[#71717a] font-bold">Infrastruktur</span>
                     <span className="text-zinc-700">/</span>
                     <span className="text-xs text-zinc-500">Dashboard Admin</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight leading-tight">Admin Control Center</h1>
                  <p className="text-sm text-zinc-500 mt-4 leading-relaxed max-w-xl">Sistem internal pengurus dan takmir masjid untuk mengelola transaksi kas, zakat, agenda, dan aktivitas operasional harian.</p>

                  <div className="flex flex-wrap items-center gap-3 mt-8">
                     <div className="soft-card px-4 py-2 flex items-center gap-3">
                        <div className="w-[7px] h-[7px] rounded-full bg-[#10b981] shadow-[0_0_12px_#10b981] animate-[pulseGlow_2.5s_infinite]"></div>
                        <span className="text-xs font-medium text-zinc-300">Sistem Aktif</span>
                     </div>
                     <div className="soft-card px-4 py-2 flex items-center gap-2">
                        <ShieldCheck className="text-[#d4af37] w-3.5 h-3.5" />
                        <span className="text-xs text-zinc-400">Protected Access</span>
                     </div>
                  </div>

                  {/* Bento Grid Info Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                     <div className="soft-card p-4 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-black border border-[#202020] flex items-center justify-center shrink-0">
                           <UserCheck className="text-[#d4af37] w-5 h-5" />
                        </div>
                        <div>
                           <h3 className="text-sm font-semibold">Akses Pengurus</h3>
                           <p className="text-sm text-zinc-500 mt-1 leading-relaxed">Hanya akun resmi pengurus dan takmir yang memiliki akses sistem.</p>
                        </div>
                     </div>

                     <div className="soft-card p-4 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-black border border-[#202020] flex items-center justify-center shrink-0">
                           <Database className="text-[#d4af37] w-5 h-5" />
                        </div>
                        <div>
                           <h3 className="text-sm font-semibold">Data Terpusat</h3>
                           <p className="text-sm text-zinc-500 mt-1 leading-relaxed">Seluruh transaksi dan laporan tersimpan dalam satu sistem utama.</p>
                        </div>
                     </div>

                     <div className="soft-card p-4 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-black border border-[#202020] flex items-center justify-center shrink-0">
                           <Lock className="text-[#d4af37] w-5 h-5" />
                        </div>
                        <div>
                           <h3 className="text-sm font-semibold">Session Security</h3>
                           <p className="text-sm text-zinc-500 mt-1 leading-relaxed">Keamanan otentikasi diproteksi penuh oleh Firebase Auth Session.</p>
                        </div>
                     </div>

                     <div className="soft-card p-4 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-black border border-[#202020] flex items-center justify-center shrink-0">
                           <TrendingUp className="text-[#d4af37] w-5 h-5" />
                        </div>
                        <div>
                           <h3 className="text-sm font-semibold">Monitoring</h3>
                           <p className="text-sm text-zinc-500 mt-1 leading-relaxed">Aktivitas kas dan operasional dipantau secara realtime.</p>
                        </div>
                     </div>
                  </div>

                  <div className="mt-10 pt-5 border-t border-[#1a1a1a] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                     <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-700">Internal Secure Panel</div>
                     <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-700">Version 2.6.0</div>
                  </div>
               </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex items-center justify-center p-5 sm:p-7 lg:p-10">
               <div className="w-full max-w-md">
                  <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 mb-6 text-sm text-zinc-500 hover:text-white transition-all duration-300 hover:-translate-x-1">
                     <ArrowLeft className="w-3.5 h-3.5" />
                     <span>Kembali ke Website</span>
                  </button>

                  <div className="mb-7">
                     <div className="w-11 h-11 rounded-xl bg-black border border-[#1f1f1f] flex items-center justify-center mb-4 animate-[floatSlow_5s_ease-in-out_infinite]">
                        <LayoutGrid className="text-[#d4af37] w-5 h-5" />
                     </div>
                     <p className="text-[10px] uppercase tracking-[0.14em] text-[#71717a] font-bold mb-2">Authentication</p>
                     <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Login Administrator</h2>
                     <p className="text-sm text-zinc-500 mt-2 leading-relaxed">Masukkan email dan password untuk mengakses dashboard sistem.</p>
                  </div>

                  {/* ERROR BOX */}
                  {error && (
                     <div className="mb-5 border border-red-500/20 bg-red-500/10 rounded-xl p-4 text-sm text-red-300">
                        <div className="flex items-start gap-3">
                           <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                           <span>{error}</span>
                        </div>
                     </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4">
                     {/* EMAIL INPUT */}
                     <div>
                        <label className="text-[10px] uppercase tracking-[0.14em] text-[#71717a] font-bold block mb-2">Email Admin</label>
                        <div className="relative group overflow-hidden rounded-xl">
                           <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4 transition-all duration-300 group-focus-within:text-[#d4af37] group-focus-within:scale-110 z-10" />
                           <input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" className="w-full bg-[rgba(5,5,5,0.9)] border border-[#1c1c1c] rounded-xl py-[14px] pl-11 pr-4 text-white text-sm transition-all duration-300 focus:outline-none focus:border-[rgba(212,175,55,0.5)] focus:scale-[1.01] focus:-translate-y-[2px]" placeholder="admin@masjid.com" required />
                        </div>
                     </div>

                     {/* PASSWORD INPUT */}
                     <div>
                        <label className="text-[10px] uppercase tracking-[0.14em] text-[#71717a] font-bold block mb-2">Password</label>
                        <div className="relative group overflow-hidden rounded-xl">
                           <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4 transition-all duration-300 group-focus-within:text-[#d4af37] group-focus-within:scale-110 z-10" />
                           <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[rgba(5,5,5,0.9)] border border-[#1c1c1c] rounded-xl py-[14px] pl-11 pr-4 text-white text-sm transition-all duration-300 focus:outline-none focus:border-[rgba(212,175,55,0.5)] focus:scale-[1.01] focus:-translate-y-[2px]" placeholder="Masukkan password" required />
                        </div>
                     </div>

                     {/* BUTTON SUBMIT */}
                     <button type="submit" disabled={loading} className="w-full py-3 mt-2 bg-gradient-to-b from-white to-[#d6d6d6] text-black rounded-xl text-sm font-bold transition-all duration-300 hover:translate-y-[-2px] hover:scale-[1.01] hover:shadow-[0_20px_35px_rgba(212,175,55,0.15)] disabled:opacity-50 cursor-pointer">
                        {loading ? "Memverifikasi..." : "Login Sekarang"}
                     </button>
                  </form>

                  <div className="mt-6 pt-5 border-t border-[#1a1a1a] text-center text-xs text-zinc-600 leading-relaxed">
                     Restricted for authorized personnel only.
                     <br />
                     Semua aktivitas login tercatat otomatis.
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
