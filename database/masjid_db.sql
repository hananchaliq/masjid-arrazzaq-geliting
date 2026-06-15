-- phpMyAdmin SQL Dump
-- version 6.0.0-dev+20251026.88b7dfd0f0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 29, 2026 at 01:35 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `masjid_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `agenda`
--

CREATE TABLE `agenda` (
  `id` int NOT NULL,
  `judul` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `tanggal_mulai` datetime NOT NULL,
  `tanggal_selesai` datetime DEFAULT NULL,
  `lokasi` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `agenda`
--

INSERT INTO `agenda` (`id`, `judul`, `deskripsi`, `tanggal_mulai`, `tanggal_selesai`, `lokasi`, `created_at`, `updated_at`) VALUES
(1, 'Pengajian Rutin Malam Selasa', 'Pengajian rutin bersama Ustadz Ahmad dengan tema \'Keutamaan Sholat\'', '2026-04-12 21:00:00', NULL, 'Ruang Utama Masjid', '2026-04-07 12:53:08', '2026-05-13 02:20:32'),
(2, 'Buka Bersama Ramadhan', 'Acara buka puasa bersama jamaah masjid', '2025-03-15 17:30:00', '2025-03-15 19:00:00', 'Halaman Masjid', '2026-04-07 12:53:08', '2026-04-07 12:53:08'),
(3, 'Sholat Idul Fitri', 'Pelaksanaan sholat Idul Fitri 1446 H', '2025-03-31 07:00:00', '2025-03-31 09:00:00', 'Lapangan Masjid', '2026-04-07 12:53:08', '2026-04-07 12:53:08'),
(4, 'Pengajian Anak-anak', 'Pengajian khusus anak-anak dengan metode yang menyenangkan', '2025-02-19 16:00:00', '2026-05-21 12:00:00', 'Ruang Belajar Masjid', '2026-04-07 12:53:08', '2026-05-18 15:25:57'),
(5, 'Tabligh Akbar', 'Tabligh akbar bersama Ustadz terkenal', '2026-04-12 19:00:00', '2026-04-12 21:30:00', 'Ruang Utama Masjid', '2026-04-07 12:53:08', '2026-04-12 00:19:30'),
(7, 'Pengajian Rutin Malam Selasa', 'tes', '2026-05-18 12:00:00', '2026-05-19 12:00:00', 'Ruang Utama Masjid', '2026-05-18 13:21:22', '2026-05-18 13:21:22'),
(8, 'Pengajian Rutin Malam Selasa', 'Bahasanya sudah dibikin formal gaya karya ilmiah sekolah. Struktur juga rapi dan aman buat tugas. Tinggal lu edit dikit kalau guru lu tipe manusia perfeksionis penggemar margin 4-4-3-3 dan font Times New Roman ukuran sakral 12.', '2026-05-26 12:00:00', '2026-05-27 16:00:00', 'Ruang Utama Masjid', '2026-05-25 05:03:26', '2026-05-25 05:12:00'),
(9, 'Pengajian Rutin Malam Selasa', 'tes', '2026-05-30 12:00:00', '2026-05-31 14:00:00', 'Ruang Utama Masjid', '2026-05-29 00:33:22', '2026-05-29 00:34:16');

-- --------------------------------------------------------

--
-- Table structure for table `berita`
--

CREATE TABLE `berita` (
  `id` int NOT NULL,
  `judul` varchar(255) NOT NULL,
  `isi_berita` text NOT NULL,
  `gambar` varchar(255) DEFAULT 'default.jpg',
  `tanggal` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `penulis` varchar(100) DEFAULT 'Admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `berita`
--

INSERT INTO `berita` (`id`, `judul`, `isi_berita`, `gambar`, `tanggal`, `penulis`) VALUES
(2, 'Update Program Pendidikan', 'Isi berita mengenai beasiswa santri...', 'berita2.jpg', '2026-04-12 16:00:00', 'Admin'),
(3, 'Gema Ramadhan di Masjid Ar-Razzaq', 'Kegiatan santri selama bulan ramadhan sangat padat...', 'berita3.jpg', '2026-04-12 16:00:00', 'Admin'),
(5, 'Kunjungan Ust. Abdul Somat', 'Pengajian dengan topik malam lailatur qadr', 'news_6a051bfd27daf.png', '2026-04-13 12:39:48', 'Administrator Masjid'),
(23, 'Gema Ramadhan di Masjid Ar-Razzaq', 'tes', 'news_6a067e54e544f.png', '2026-05-14 13:10:07', 'Administrator Masjid');

-- --------------------------------------------------------

--
-- Table structure for table `kas`
--

CREATE TABLE `kas` (
  `id` int NOT NULL,
  `tanggal` date NOT NULL,
  `jenis` enum('masuk','keluar') COLLATE utf8mb4_unicode_ci NOT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `jumlah` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kas`
--

INSERT INTO `kas` (`id`, `tanggal`, `jenis`, `keterangan`, `jumlah`, `created_at`, `updated_at`) VALUES
(1, '2026-01-03', 'masuk', 'Infak Jumat', 820000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(2, '2026-01-03', 'keluar', 'Beli air galon', 120000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(3, '2026-01-07', 'masuk', 'Donasi warga', 1450000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(4, '2026-01-10', 'masuk', 'Kotak amal', 680000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(5, '2026-01-10', 'keluar', 'Bayar listrik', 430000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(6, '2026-01-14', 'masuk', 'Infak pengajian', 920000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(7, '2026-01-17', 'keluar', 'Beli alat kebersihan', 210000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(8, '2026-01-20', 'masuk', 'Sedekah subuh', 610000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(9, '2026-01-20', 'keluar', 'Snack rapat', 160000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(10, '2026-01-24', 'masuk', 'Donatur tetap', 1850000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(11, '2026-01-27', 'keluar', 'Bayar PDAM', 310000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(12, '2026-01-30', 'masuk', 'Kotak amal Jumat', 1050000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(13, '2026-01-30', 'keluar', 'Servis speaker', 280000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(14, '2026-02-02', 'masuk', 'Infak Jumat', 870000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(15, '2026-02-05', 'keluar', 'Beli lampu', 190000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(16, '2026-02-08', 'masuk', 'Donasi warga', 1650000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(17, '2026-02-08', 'keluar', 'Bayar listrik', 450000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(18, '2026-02-12', 'masuk', 'Kotak amal', 740000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(19, '2026-02-15', 'keluar', 'Kebersihan masjid', 230000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(20, '2026-02-18', 'masuk', 'Infak pengajian', 1180000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(21, '2026-02-18', 'keluar', 'Transport ustaz', 170000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(22, '2026-02-22', 'masuk', 'Sedekah subuh', 650000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(23, '2026-02-25', 'keluar', 'Servis kipas', 260000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(24, '2026-02-27', 'masuk', 'Donatur tetap', 2050000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(25, '2026-02-27', 'keluar', 'Snack kegiatan', 180000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(26, '2026-03-03', 'masuk', 'Infak Jumat', 910000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(27, '2026-03-03', 'keluar', 'Beli air galon', 130000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(28, '2026-03-06', 'masuk', 'Donasi warga', 1950000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(29, '2026-03-10', 'masuk', 'Kotak amal', 790000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(30, '2026-03-10', 'keluar', 'Bayar listrik', 470000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(31, '2026-03-13', 'masuk', 'Infak pengajian', 1260000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(32, '2026-03-16', 'keluar', 'Perbaikan atap', 680000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(33, '2026-03-19', 'masuk', 'Sedekah subuh', 720000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(34, '2026-03-19', 'keluar', 'Beli kabel audio', 240000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(35, '2026-03-23', 'masuk', 'Donatur tetap', 2200000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(36, '2026-03-26', 'keluar', 'Bayar PDAM', 330000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(37, '2026-03-29', 'masuk', 'Kotak amal Jumat', 1320000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(38, '2026-03-29', 'keluar', 'Konsumsi buka puasa', 420000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(39, '2026-04-02', 'masuk', 'Infak Jumat', 950000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(40, '2026-04-02', 'keluar', 'Beli alat kebersihan', 220000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(41, '2026-04-06', 'masuk', 'Donasi warga', 2100000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(42, '2026-04-09', 'masuk', 'Kotak amal', 830000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(43, '2026-04-09', 'keluar', 'Bayar listrik', 500000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(44, '2026-04-13', 'masuk', 'Infak pengajian', 1380000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(45, '2026-04-16', 'keluar', 'Honor marbot', 410000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(46, '2026-04-19', 'masuk', 'Sedekah subuh', 760000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(47, '2026-04-19', 'keluar', 'Snack rapat', 190000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(48, '2026-04-23', 'masuk', 'Donatur tetap', 2350000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(49, '2026-04-26', 'keluar', 'Bayar PDAM', 340000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(50, '2026-04-29', 'keluar', 'Kotak amal Jumat', 1420000.00, '2026-05-15 02:20:44', '2026-05-24 14:34:51'),
(51, '2026-04-29', 'keluar', 'Servis sound system', 390000.00, '2026-05-15 02:20:44', '2026-05-15 02:20:44'),
(52, '2026-05-29', 'keluar', 'Pemabayaran tagihan wifi d& listrik', 1000000.00, '2026-05-29 00:37:18', '2026-05-29 00:37:18'),
(53, '2026-05-29', 'masuk', 'Infaq Masjid', 300000.00, '2026-05-29 00:37:54', '2026-05-29 00:37:54');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_lengkap` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `nama_lengkap`, `email`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2y$10$pIA73bgfoa9n7Nzt4ySYMObSjjxq96jeKAI7HcENryNgCKKpzkFk2', 'Administrator Masjid', 'admin@masjid.com', '2026-04-07 12:53:08', '2026-04-07 12:57:30');

-- --------------------------------------------------------

--
-- Table structure for table `zakat`
--

CREATE TABLE `zakat` (
  `id` int NOT NULL,
  `nama_muzakki` varchar(100) COLLATE utf8mb4_general_ci DEFAULT 'Hamba Allah',
  `jenis_zakat` enum('maal','fitrah') COLLATE utf8mb4_general_ci NOT NULL,
  `jumlah_bayar` decimal(15,2) NOT NULL,
  `tanggal` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('Pending','Berhasil') COLLATE utf8mb4_general_ci DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `zakat`
--

INSERT INTO `zakat` (`id`, `nama_muzakki`, `jenis_zakat`, `jumlah_bayar`, `tanggal`, `status`) VALUES
(26, 'Hanan Nurdin Ramadhan Chaliq', 'maal', 12500000.00, '2026-05-14 13:37:30', 'Berhasil'),
(27, 'Ariful Fahmi', 'fitrah', 52500000.00, '2026-05-14 13:37:48', 'Berhasil'),
(34, 'Hanan', 'fitrah', 187500.00, '2026-05-29 00:30:46', 'Berhasil'),
(35, 'Sekar Aulia Putri Al Fajri', 'fitrah', 175000.00, '2026-05-29 01:20:28', 'Berhasil');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agenda`
--
ALTER TABLE `agenda`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `berita`
--
ALTER TABLE `berita`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kas`
--
ALTER TABLE `kas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `zakat`
--
ALTER TABLE `zakat`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agenda`
--
ALTER TABLE `agenda`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `berita`
--
ALTER TABLE `berita`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `kas`
--
ALTER TABLE `kas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `zakat`
--
ALTER TABLE `zakat`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
