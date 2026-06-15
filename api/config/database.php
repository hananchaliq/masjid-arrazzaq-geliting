<?php

$conn = mysqli_connect(
   "localhost",
   "root",
   "",
   "masjid_db"
);

if(!$conn){
   die("Koneksi gagal");
}