const ID_SIKKA = "8e98d81f8217304975ccb23337bb5761";

export async function getPrayerData() {
  try {
    // Jadwal Sholat
    const jadwalRes = await fetch(
      `https://api.myquran.com/v3/sholat/jadwal/${ID_SIKKA}/today?tz=Asia%2FMakassar`
    );

    const jadwalJson = await jadwalRes.json();

    // Kalender Hijriah
    const hijriRes = await fetch(
      "https://api.myquran.com/v3/cal/today?adj=0&tz=Asia/Makassar"
    );

    const hijriJson = await hijriRes.json();

    const jadwal =
      jadwalJson?.data?.jadwal &&
      Object.values(jadwalJson.data.jadwal)[0];

    return {
      jadwal,

      hijriah:
        hijriJson?.data?.hijr?.today || "-",
    };
  } catch (error) {
    console.error(error);

    return {
      jadwal: null,
      hijriah: "-",
    };
  }
}