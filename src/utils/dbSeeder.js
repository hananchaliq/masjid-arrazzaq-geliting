import { db } from "../config/firebase"; // Pastikan path config firebase lu bener, bre
import { collection, doc, setDoc } from "firebase/firestore";

const agendaData = [
   { id: "1", judul: "Pengajian Rutin Malam Selasa", deskripsi: "Pengajian rutin bersama Ustadz Ahmad dengan tema 'Keutamaan Sholat'", tanggal_mulai: "2026-04-12T21:00:00", tanggal_selesai: null, lokasi: "Ruang Utama Masjid" },
   { id: "2", judul: "Buka Bersama Ramadhan", deskripsi: "Acara buka puasa bersama jamaah masjid", tanggal_mulai: "2025-03-15T17:30:00", tanggal_selesai: "2025-03-15T19:00:00", lokasi: "Halaman Masjid" },
   { id: "3", judul: "Sholat Idul Fitri", deskripsi: "Pelaksanaan sholat Idul Fitri 1446 H", tanggal_mulai: "2025-03-31T07:00:00", tanggal_selesai: "2025-03-31T09:00:00", lokasi: "Lapangan Masjid" },
   { id: "4", judul: "Pengajian Anak-anak", deskripsi: "Pengajian khusus anak-anak dengan metode yang menyenangkan", tanggal_mulai: "2025-02-19T16:00:00", tanggal_selesai: "2026-05-21T12:00:00", lokasi: "Ruang Belajar Masjid" },
   { id: "5", judul: "Tabligh Akbar", deskripsi: "Tabligh akbar bersama Ustadz terkenal", tanggal_mulai: "2026-04-12T19:00:00", tanggal_selesai: "2026-04-12T21:30:00", lokasi: "Ruang Utama Masjid" },
   { id: "7", judul: "Pengajian Rutin Malam Selasa", deskripsi: "tes", tanggal_mulai: "2026-05-18T12:00:00", tanggal_selesai: "2026-05-19T12:00:00", lokasi: "Ruang Utama Masjid" },
   { id: "8", judul: "Pengajian Rutin Malam Selasa", deskripsi: "Bahasanya sudah dibikin formal gaya karya ilmiah sekolah. Struktur juga rapi dan aman buat tugas.", tanggal_mulai: "2026-05-26T12:00:00", tanggal_selesai: "2026-05-27T16:00:00", lokasi: "Ruang Utama Masjid" },
   { id: "9", judul: "Pengajian Rutin Malam Selasa", deskripsi: "tes", tanggal_mulai: "2026-05-30T12:00:00", tanggal_selesai: "2026-05-31T14:00:00", lokasi: "Ruang Utama Masjid" },
];

const beritaData = [
   { id: "2", judul: "Update Program Pendidikan", isi_berita: "Isi berita mengenai beasiswa santri...", gambar: "berita2.jpg", tanggal: "2026-04-12T16:00:00", penulis: "Admin" },
   { id: "3", judul: "Gema Ramadhan di Masjid Ar-Razzaq", isi_berita: "Kegiatan santri selama bulan ramadhan sangat padat...", gambar: "berita3.jpg", tanggal: "2026-04-12T16:00:00", penulis: "Admin" },
   { id: "5", judul: "Kunjungan Ust. Abdul Somat", isi_berita: "Pengajian dengan topik malam lailatur qadr", gambar: "news_6a051bfd27daf.png", tanggal: "2026-04-13T12:39:48", penulis: "Administrator Masjid" },
   { id: "23", judul: "Gema Ramadhan di Masjid Ar-Razzaq", isi_berita: "tes", gambar: "news_6a067e54e544f.png", tanggal: "2026-05-14T13:10:07", penulis: "Administrator Masjid" },
];

const kasData = [
   { id: "1", tanggal: "2026-01-03", jenis: "masuk", keterangan: "Infak Jumat", jumlah: 820000.0 },
   { id: "2", tanggal: "2026-01-03", jenis: "keluar", keterangan: "Beli air galon", jumlah: 120000.0 },
   { id: "3", tanggal: "2026-01-07", jenis: "masuk", keterangan: "Donasi warga", jumlah: 1450000.0 },
   { id: "4", tanggal: "2026-01-10", jenis: "masuk", keterangan: "Kotak amal", jumlah: 680000.0 },
   { id: "5", tanggal: "2026-01-10", jenis: "keluar", keterangan: "Bayar listrik", jumlah: 430000.0 },
   { id: "6", tanggal: "2026-01-14", jenis: "masuk", keterangan: "Infak pengajian", jumlah: 920000.0 },
   { id: "7", tanggal: "2026-01-17", jenis: "keluar", keterangan: "Beli alat kebersihan", jumlah: 210000.0 },
   { id: "8", tanggal: "2026-01-20", jenis: "masuk", keterangan: "Sedekah subuh", jumlah: 610000.0 },
   { id: "9", tanggal: "2026-01-20", jenis: "keluar", keterangan: "Snack rapat", jumlah: 160000.0 },
   { id: "10", tanggal: "2026-01-24", jenis: "masuk", keterangan: "Donatur tetap", jumlah: 1850000.0 },
   { id: "11", tanggal: "2026-01-27", jenis: "keluar", keterangan: "Bayar PDAM", jumlah: 310000.0 },
   { id: "12", tanggal: "2026-01-30", jenis: "masuk", keterangan: "Kotak amal Jumat", jumlah: 1050000.0 },
   { id: "13", tanggal: "2026-01-30", jenis: "keluar", keterangan: "Servis speaker", jumlah: 280000.0 },
   { id: "14", tanggal: "2026-02-02", jenis: "masuk", keterangan: "Infak Jumat", jumlah: 870000.0 },
   { id: "15", tanggal: "2026-02-05", jenis: "keluar", keterangan: "Beli lampu", jumlah: 190000.0 },
   { id: "16", tanggal: "2026-02-08", jenis: "masuk", keterangan: "Donasi warga", jumlah: 1650000.0 },
   { id: "17", tanggal: "2026-02-08", jenis: "keluar", keterangan: "Bayar listrik", jumlah: 450000.0 },
   { id: "18", tanggal: "2026-02-12", jenis: "masuk", keterangan: "Kotak amal", jumlah: 740000.0 },
   { id: "19", tanggal: "2026-02-15", jenis: "keluar", keterangan: "Kebersihan masjid", jumlah: 230000.0 },
   { id: "20", tanggal: "2026-02-18", jenis: "masuk", keterangan: "Infak pengajian", jumlah: 1180000.0 },
   { id: "21", tanggal: "2026-02-18", jenis: "keluar", keterangan: "Transport ustaz", jumlah: 170000.0 },
   { id: "22", tanggal: "2026-02-22", jenis: "masuk", keterangan: "Sedekah subuh", jumlah: 650000.0 },
   { id: "23", tanggal: "2026-02-25", jenis: "keluar", keterangan: "Servis kipas", jumlah: 260000.0 },
   { id: "24", tanggal: "2026-02-27", jenis: "masuk", keterangan: "Donatur tetap", jumlah: 2050000.0 },
   { id: "25", tanggal: "2026-02-27", jenis: "keluar", keterangan: "Snack kegiatan", jumlah: 180000.0 },
   { id: "26", tanggal: "2026-03-03", jenis: "masuk", keterangan: "Infak Jumat", jumlah: 910000.0 },
   { id: "27", tanggal: "2026-03-03", jenis: "keluar", keterangan: "Beli air galon", jumlah: 130000.0 },
   { id: "28", tanggal: "2026-03-06", jenis: "masuk", keterangan: "Donasi warga", jumlah: 1950000.0 },
   { id: "29", tanggal: "2026-03-10", jenis: "masuk", keterangan: "Kotak amal", jumlah: 790000.0 },
   { id: "30", tanggal: "2026-03-10", jenis: "keluar", keterangan: "Bayar listrik", jumlah: 470000.0 },
   { id: "31", tanggal: "2026-03-13", jenis: "masuk", keterangan: "Infak pengajian", jumlah: 1260000.0 },
   { id: "32", tanggal: "2026-03-16", jenis: "keluar", keterangan: "Perbaikan atap", jumlah: 680000.0 },
   { id: "33", tanggal: "2026-03-19", jenis: "masuk", keterangan: "Sedekah subuh", jumlah: 720000.0 },
   { id: "34", tanggal: "2026-03-19", jenis: "keluar", keterangan: "Beli kabel audio", jumlah: 240000.0 },
   { id: "35", tanggal: "2026-03-23", jenis: "masuk", keterangan: "Donatur tetap", jumlah: 2200000.0 },
   { id: "36", tanggal: "2026-03-26", jenis: "keluar", keterangan: "Bayar PDAM", jumlah: 330000.0 },
   { id: "37", tanggal: "2026-03-29", jenis: "masuk", keterangan: "Kotak amal Jumat", jumlah: 1320000.0 },
   { id: "38", tanggal: "2026-03-29", jenis: "keluar", keterangan: "Konsumsi buka puasa", jumlah: 420000.0 },
   { id: "39", tanggal: "2026-04-02", jenis: "masuk", keterangan: "Infak Jumat", jumlah: 950000.0 },
   { id: "40", tanggal: "2026-04-02", jenis: "keluar", keterangan: "Beli alat kebersihan", jumlah: 220000.0 },
   { id: "41", tanggal: "2026-04-06", jenis: "masuk", keterangan: "Donasi warga", jumlah: 2100000.0 },
   { id: "42", tanggal: "2026-04-09", jenis: "masuk", keterangan: "Kotak amal", jumlah: 830000.0 },
   { id: "43", tanggal: "2026-04-09", jenis: "keluar", keterangan: "Bayar listrik", jumlah: 500000.0 },
   { id: "44", tanggal: "2026-04-13", jenis: "masuk", keterangan: "Infak pengajian", jumlah: 1380000.0 },
   { id: "45", tanggal: "2026-04-16", jenis: "keluar", keterangan: "Honor marbot", jumlah: 410000.0 },
   { id: "46", tanggal: "2026-04-19", jenis: "masuk", keterangan: "Sedekah subuh", jumlah: 760000.0 },
   { id: "47", tanggal: "2026-04-19", jenis: "keluar", keterangan: "Snack rapat", jumlah: 190000.0 },
   { id: "48", tanggal: "2026-04-23", jenis: "masuk", keterangan: "Donatur tetap", jumlah: 2350000.0 },
   { id: "49", tanggal: "2026-04-26", jenis: "keluar", keterangan: "Bayar PDAM", jumlah: 340000.0 },
   { id: "50", tanggal: "2026-04-29", jenis: "keluar", keterangan: "Kotak amal Jumat", jumlah: 1420000.0 },
   { id: "51", tanggal: "2026-04-29", jenis: "keluar", keterangan: "Servis sound system", jumlah: 390000.0 },
   { id: "52", tanggal: "2026-05-29", jenis: "keluar", keterangan: "Pemabayaran tagihan wifi d& listrik", jumlah: 1000000.0 },
   { id: "53", tanggal: "2026-05-29", jenis: "masuk", keterangan: "Infaq Masjid", jumlah: 300000.0 },
];

const zakatData = [
   { id: "26", nama_muzakki: "Hanan Nurdin Ramadhan Chaliq", jenis_zakat: "maal", jumlah_bayar: 12500000.0, status: "Berhasil", tanggal: "2026-05-14T13:37:30" },
   { id: "27", nama_muzakki: "Ariful Fahmi", jenis_zakat: "fitrah", jumlah_bayar: 52500000.0, status: "Berhasil", tanggal: "2026-05-14T13:37:48" },
   { id: "34", nama_muzakki: "Hanan", jenis_zakat: "fitrah", jumlah_bayar: 187500.0, status: "Berhasil", tanggal: "2026-05-29T00:30:46" },
   { id: "35", nama_muzakki: "Sekar Aulia Putri Al Fajri", jenis_zakat: "fitrah", jumlah_bayar: 175000.0, status: "Berhasil", tanggal: "2026-05-29T01:20:28" },
];

export const jalankanSeederMasjid = async () => {
   try {
      console.log("Memulai proses suntik data ke Firebase...");

      // 1. Seed Agenda
      for (const item of agendaData) {
         await setDoc(doc(collection(db, "agenda"), item.id), item);
      }
      // 2. Seed Berita
      for (const item of beritaData) {
         await setDoc(doc(collection(db, "berita"), item.id), item);
      }
      // 3. Seed Kas
      for (const item of kasData) {
         await setDoc(doc(collection(db, "kas"), item.id), item);
      }
      // 4. Seed Zakat
      for (const item of zakatData) {
         await setDoc(doc(collection(db, "zakat"), item.id), item);
      }

      console.log("🚀 MANTAP BRE! Semua data SQL berhasil bermigrasi ke Cloud Firestore!");
      alert("Database Berhasil Diisi, bre!");
   } catch (error) {
      console.error("Aduh gagal bre, cek rule firestore lu: ", error);
   }
};
