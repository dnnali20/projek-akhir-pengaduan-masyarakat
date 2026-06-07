# TODO Feature 1 & 2

## 1) Lokasi laporan (Google Maps)
- [ ] Pastikan form CreateLaporan mewajibkan input lokasi dan mengirim `latitude`, `longitude`, `location_address`.
- [ ] Tampilkan peta (Google Maps embed) di `DetailLaporan` menggunakan `latitude/longitude` (fallback `location_address`).

## 2) Activity log admin
- [ ] Backend: log aktivitas saat admin mengubah status (`updateStatusLaporan`) dan tindak lanjut (`updateTindakLanjut`).
- [ ] Backend: batasi endpoint activity log hanya untuk `admin`/`super_admin`.
- [ ] Frontend: buat halaman `ActivityLogs` untuk admin menampilkan activity log.
- [ ] Frontend: tambahkan route dan link di sidebar.

## 3) Testing
- [ ] Cek membuat laporan harus isi lokasi.
- [ ] Cek map embed muncul di detail laporan.
- [ ] Cek activity log bertambah saat admin approve/reject/tindak lanjut.
- [ ] Cek user biasa tidak bisa mengakses activity log.

