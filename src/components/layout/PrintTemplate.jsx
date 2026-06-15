import React from "react";

/**
 * PrintTemplate — Universal print layout for all admin sections (Optimized for react-to-print).
 */
export const PrintTemplate = React.forwardRef(({ tipe, data = [], summary = {}, filter = {} }, ref) => {
   // ── Helpers ───────────────────────────────────────────
   const currentDate = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
   });

   const formatTanggal = isoString => {
      if (!isoString) return "-";
      try {
         const d = new Date(isoString);
         const p = n => String(n).padStart(2, "0");
         return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
      } catch {
         return isoString;
      }
   };

   const formatTanggalWaktu = isoString => {
      if (!isoString) return "-";
      try {
         const d = new Date(isoString);
         const p = n => String(n).padStart(2, "0");
         return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
      } catch {
         return isoString;
      }
   };

   const stripTags = html => {
      if (!html) return "";
      return html.replace(/<\/?[^>]+(>|$)/g, "");
   };

   const formatRupiah = number =>
      new Intl.NumberFormat("id-ID", {
         style: "currency",
         currency: "IDR",
         minimumFractionDigits: 0,
      }).format(number || 0);

   // Menghitung jumlah kolom agar colspan td 'Tidak ada data' tidak bocor keluar
   const getColSpan = () => {
      switch (tipe) {
         case "KAS":
            return 5;
         case "BERITA":
            return 5;
         case "AGENDA":
            return 6;
         case "ZAKAT":
            return 6;
         default:
            return 5;
      }
   };

   const filterEntries = Object.entries(filter).filter(([, v]) => v && v !== "Semua" && v !== "");

   const titleMap = {
      KAS: "LAPORAN KAS MASJID",
      BERITA: "LAPORAN DATA BERITA & ARTIKEL",
      AGENDA: "LAPORAN JADWAL AGENDA KEGIATAN",
      ZAKAT: "LAPORAN PENGUMPULAN DATA ZAKAT",
   };

   // ── 1. Render Table Header (Thead) ─────────────────────
   const renderThead = () => {
      switch (tipe) {
         case "KAS":
            return (
               <tr className="bg-gray-100 font-sans">
                  <th className="border border-black py-2 px-2 w-12 text-center font-bold text-black text-xs">No</th>
                  <th className="border border-black py-2 px-2 text-left w-28 font-bold text-black text-xs">Tanggal</th>
                  <th className="border border-black py-2 px-2 text-left font-bold text-black text-xs">Keterangan / Deskripsi</th>
                  <th className="border border-black py-2 px-2 text-center w-24 font-bold text-black text-xs">Jenis</th>
                  <th className="border border-black py-2 px-2 text-right w-40 font-bold text-black text-xs">Jumlah (Rp)</th>
               </tr>
            );
         case "BERITA":
            return (
               <tr className="bg-gray-100 font-sans">
                  <th className="border border-black py-2 px-2 w-12 text-center font-bold text-black text-xs">No</th>
                  <th className="border border-black py-2 px-2 text-left w-56 font-bold text-black text-xs">Judul Berita</th>
                  <th className="border border-black py-2 px-2 text-left font-bold text-black text-xs">Ringkasan Isi</th>
                  <th className="border border-black py-2 px-2 text-left w-36 font-bold text-black text-xs">Penulis</th>
                  <th className="border border-black py-2 px-2 text-left w-40 font-bold text-black text-xs">Tanggal Rilis</th>
               </tr>
            );
         case "AGENDA":
            return (
               <tr className="bg-gray-100 font-sans">
                  <th className="border border-black py-2 px-2 w-12 text-center font-bold text-black text-xs">No</th>
                  <th className="border border-black py-2 px-2 text-left w-48 font-bold text-black text-xs">Judul Kegiatan</th>
                  <th className="border border-black py-2 px-2 text-left font-bold text-black text-xs">Deskripsi Agenda</th>
                  <th className="border border-black py-2 px-2 text-left w-32 font-bold text-black text-xs">Tanggal Mulai</th>
                  <th className="border border-black py-2 px-2 text-left w-32 font-bold text-black text-xs">Tanggal Selesai</th>
                  <th className="border border-black py-2 px-2 text-left w-36 font-bold text-black text-xs">Lokasi</th>
               </tr>
            );
         case "ZAKAT":
            return (
               <tr className="bg-gray-100 font-sans">
                  <th className="border border-black py-2 px-2 w-12 text-center font-bold text-black text-xs">No</th>
                  <th className="border border-black py-2 px-2 text-left w-36 font-bold text-black text-xs">Waktu Transaksi</th>
                  <th className="border border-black py-2 px-2 text-left font-bold text-black text-xs">Nama Muzakki</th>
                  <th className="border border-black py-2 px-2 text-center w-32 font-bold text-black text-xs">Jenis Zakat</th>
                  <th className="border border-black py-2 px-2 text-right w-40 font-bold text-black text-xs">Jumlah Nominal</th>
                  <th className="border border-black py-2 px-2 text-center w-28 font-bold text-black text-xs">Status</th>
               </tr>
            );
         default:
            return null;
      }
   };

   // ── 2. Render Table Row (Tbody) ────────────────────────
   const renderRow = (item, index) => {
      switch (tipe) {
         case "KAS":
            return (
               <tr key={index} className="bg-white dynamic-row">
                  <td className="border border-black p-2 text-center align-top text-xs text-black">{index + 1}</td>
                  <td className="border border-black p-2 whitespace-nowrap align-top text-xs text-black">{formatTanggal(item.tanggal)}</td>
                  <td className="border border-black p-2 align-top text-xs text-black">{item.keterangan || "-"}</td>
                  <td className="border border-black p-2 text-center font-sans font-semibold uppercase text-[10px] align-top text-black">{item.jenis}</td>
                  <td className="border border-black p-2 text-right font-mono align-top text-xs text-black">{typeof item.jumlah === "number" ? formatRupiah(item.jumlah) : item.jumlah}</td>
               </tr>
            );

         case "BERITA":
            return (
               <tr key={index} className="bg-white dynamic-row">
                  <td className="border border-black p-2 text-center align-top text-xs text-black">{index + 1}</td>
                  <td className="border border-black p-2 font-bold align-top text-xs text-black" style={{ wordBreak: "break-word" }}>
                     {item.judul}
                  </td>
                  <td className="border border-black p-2 text-black align-top text-xs" style={{ wordBreak: "break-word" }}>
                     {stripTags(item.isi_berita) || "-"}
                  </td>
                  <td className="border border-black p-2 align-top text-xs text-black">{item.penulis || "Anonim"}</td>
                  <td className="border border-black p-2 text-xs whitespace-nowrap align-top text-black">{formatTanggalWaktu(item.tanggal)}</td>
               </tr>
            );

         case "AGENDA":
            return (
               <tr key={index} className="bg-white dynamic-row">
                  <td className="border border-black p-2 text-center align-top text-xs text-black">{index + 1}</td>
                  <td className="border border-black p-2 font-bold align-top text-xs text-black" style={{ wordBreak: "break-word" }}>
                     {item.judul}
                  </td>
                  <td className="border border-black p-2 text-black align-top text-xs" style={{ wordBreak: "break-word" }}>
                     {item.deskripsi || "-"}
                  </td>
                  <td className="border border-black p-2 text-xs whitespace-nowrap align-top text-black">{item.tanggal_mulai ? new Date(item.tanggal_mulai).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}</td>
                  <td className="border border-black p-2 text-xs whitespace-nowrap align-top text-black">{item.tanggal_selesai ? new Date(item.tanggal_selesai).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}</td>
                  <td className="border border-black p-2 align-top text-xs text-black">{item.lokasi || "-"}</td>
               </tr>
            );

         case "ZAKAT":
            return (
               <tr key={index} className="bg-white dynamic-row">
                  <td className="border border-black p-2 text-center align-top text-xs text-black">{index + 1}</td>
                  <td className="border border-black p-2 text-xs whitespace-nowrap align-top text-black">{formatTanggalWaktu(item.tanggal)}</td>
                  <td className="border border-black p-2 font-bold align-top text-xs text-black">{item.nama_muzakki}</td>
                  <td className="border border-black p-2 text-center capitalize text-xs align-top text-black">{item.jenis_zakat}</td>
                  <td className="border border-black p-2 text-right font-mono font-semibold align-top text-xs text-black">{formatRupiah(item.jumlah_bayar)}</td>
                  <td className="border border-black p-2 text-center text-xs font-sans font-bold align-top text-black">{item.status === "Berhasil" ? "Diterima / Sah" : "Pending"}</td>
               </tr>
            );

         default:
            return null;
      }
   };

   // ── 3. Render Summary Block ────────────────────────────
   const renderSummary = () => {
      switch (tipe) {
         case "KAS":
            return (
               <div className="w-72 ml-auto text-xs border border-black font-sans">
                  <div className="flex justify-between py-1.5 px-2.5 border-b border-black bg-gray-50">
                     <span className="font-semibold text-black">Total Pemasukan</span>
                     <span className="font-mono text-black">{summary.masuk || formatRupiah(0)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 px-2.5 border-b border-black">
                     <span className="font-semibold text-black">Total Pengeluaran</span>
                     <span className="font-mono text-black">{summary.keluar || formatRupiah(0)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 px-2.5 font-bold bg-gray-100">
                     <span className="text-black">Saldo Akhir Bersih</span>
                     <span className="font-mono text-black">{summary.saldo || formatRupiah(0)}</span>
                  </div>
               </div>
            );

         case "BERITA":
            return (
               <div className="w-72 ml-auto text-xs border border-black font-sans">
                  <div className="flex justify-between py-1.5 px-2.5 font-bold bg-gray-100">
                     <span className="text-black">Total Berita Dipublikasi</span>
                     <span className="text-black font-bold">{data.length} Artikel</span>
                  </div>
               </div>
            );

         case "AGENDA":
            return (
               <div className="w-72 ml-auto text-xs border border-black font-sans">
                  <div className="flex justify-between py-1.5 px-2.5 font-bold bg-gray-100">
                     <span className="text-black">Total Agenda Terjadwal</span>
                     <span className="text-black">{data.length} Kegiatan</span>
                  </div>
               </div>
            );

         case "ZAKAT":
            return (
               <div className="w-72 ml-auto text-xs border border-black font-sans">
                  <div className="flex justify-between py-1.5 px-2.5 border-b border-black bg-gray-50">
                     <span className="font-semibold text-black">Total Dana Zakat Masuk</span>
                     <span className="font-mono text-black">{summary.total || formatRupiah(0)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 px-2.5 border-b border-black">
                     <span className="font-semibold text-black">Transaksi Terverifikasi</span>
                     <span className="text-black">{summary.verified ?? 0} Sukses</span>
                  </div>
                  <div className="flex justify-between py-1.5 px-2.5 font-bold bg-gray-100">
                     <span className="text-black">Transaksi Tertunda</span>
                     <span className="text-black">{summary.pending ?? 0} Pending</span>
                  </div>
               </div>
            );

         default:
            return null;
      }
   };

   // ── Main Layout Render ─────────────────────────────────
   return (
      <div ref={ref} className="p-4 print:p-0 bg-white text-black font-serif text-xs w-full">
         <style>{`
            @media print {
               .dynamic-row td, th {
                  border: 1px solid #000000 !important;
                  color: #000000 !important;
               }
            }
         `}</style>

         {/* KOP SURAT RESMI */}
         <div className="text-center border-b-4 border-double border-black pb-1.5 mb-4">
            <h1 className="text-xl font-bold uppercase m-0 tracking-wide text-black">TAKMIR MASJID AR-RAZZAQ</h1>
            <p className="m-0 text-[10px] mt-0.5 font-sans tracking-wide text-black">Geliting, Kecamatan Kewapante, Sikka, Maumere, Nusa Tenggara Timur</p>
         </div>

         {/* JUDUL LAPORAN */}
         <div className="text-center mb-4">
            <h2 className="font-bold uppercase underline text-sm tracking-wider text-black">{titleMap[tipe] || `LAPORAN ${tipe}`}</h2>
            <p className="text-[10px] mt-0.5 font-sans text-black">Tanggal Cetak: {currentDate}</p>

            {filterEntries.length > 0 && (
               <p className="text-[10px] mt-1 font-sans text-black bg-gray-50 inline-block px-2 py-0.5 border border-gray-200 rounded">
                  <strong>Filter Cetak:</strong> {filterEntries.map(([k, v]) => `${k}: ${v}`).join(" | ")}
               </p>
            )}
         </div>

         {/* TABEL DATA INDUK */}
         <table className="w-full border-collapse border border-black mb-4 text-[11px]">
            <thead>{renderThead()}</thead>
            <tbody>
               {data.length === 0 ? (
                  <tr>
                     <td colSpan={getColSpan()} className="border border-black p-4 text-center text-black italic bg-gray-50 font-sans">
                        Tidak ada data yang tersedia dalam rentang parameter cetak ini.
                     </td>
                  </tr>
               ) : (
                  data.map((item, index) => renderRow(item, index))
               )}
            </tbody>
         </table>

         {/* RINGKASAN DATA (STRUKTUR REKAP) */}
         <div className="mb-6 block clearfix">{renderSummary()}</div>

         {/* BLOK TANDA TANGAN FORMAL */}
         <div className="mt-8 flex justify-between text-xs font-sans px-4" style={{ pageBreakInside: "avoid" }}>
            <div className="text-center w-48">
               <div className="mb-12">
                  <p className="m-0 text-black">Mengetahui,</p>
                  <p className="font-bold m-0 text-black">Ketua Takmir Masjid</p>
               </div>
               <p className="font-bold underline uppercase m-0 text-black">H. Hasanudin Chaliq</p>
               <p className="text-black text-[10px] m-0">NIP / ID. BKM-01</p>
            </div>
            <div className="text-center w-48">
               <div className="mb-12">
                  <p className="m-0 text-black">Dibuat Oleh,</p>
                  <p className="font-bold m-0 text-black">Bendahara / Admin Pusat</p>
               </div>
               <p className="font-bold underline uppercase m-0 text-black">(Nama Bendahara)</p>
               <p className="text-black text-[10px] m-0">Staf Administrasi</p>
            </div>
         </div>
      </div>
   );
});

PrintTemplate.displayName = "PrintTemplate";
