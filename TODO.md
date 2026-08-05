# TODO - Perbaikan Laporan (Hapus Latitude/Longitude)

## [x] 1. Backend: `backend/controllers/laporanController.js`
   - [x] Hapus validasi wajib latitude & longitude
   - [x] Jadikan latitude & longitude opsional (nullable) di INSERT query
   - [x] Ganti validasi dengan wajib `location_address` saja

## [x] 2. Frontend Mobile: `web/src/mobile/MobileCreateLaporanForm.jsx`
   - [x] Hapus setForm untuk latitude/longitude di fungsi `getCurrentLocation`
   - [x] Hapus tampilan koordinat lat/lng
   - [x] Ubah geolocation hanya mengisi `location_address` dengan nama lokasi
