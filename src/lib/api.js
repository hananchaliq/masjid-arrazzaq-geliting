import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost/backend/api",
});
useEffect(() => {
   api.get("/jadwal.php")
      .then(res => {
         setPrayer(res.data);
      });
   api.get("/zakat.php")
      .then(res => {
         setPrayer(res.data);
      });
   api.get("/berita.php")
      .then(res => {
         setPrayer(res.data);
      });
   api.get("/agenda.php")
      .then(res => {
         setPrayer(res.data);
      });
}, []);