# 🗡️ Toram Fill Stats Simulator 🛡️

Simulator lengkap untuk menghitung fill stats Toram Online dengan interface modern dan user-friendly.

⚠️ **Ini hanyalah simulasi saja, bisa terjadi perbedaan di dalam game**

## ✨ Fitur Utama

- 🎯 **Simulasi Fill Stats** - Untuk Weapon dan Armor dengan perhitungan akurat
- 📊 **Success Rate Calculator** - Menghitung tingkat keberhasilan berdasarkan POT dan TEC
- 💎 **Material Cost Tracking** - Tracking semua material (Metal/Logam, Cloth/Kain, Beast/Fauna, Wood/Kayu, Medicine/Obat, Mana)
- 🔄 **Undo/Redo System** - Eksperimen dengan berbagai kombinasi stats
- ⚙️ **Advanced Settings** - Support TEC, Proficiency, dan Material Reduction 10%
- 📱 **Responsive Design** - Optimal untuk mobile dan desktop
- 💾 **Auto-Save** - Progress tersimpan otomatis setiap 30 detik
- 🎨 **Modern Interface** - UI dengan font JetBrains Mono dan animasi smooth
- 🔍 **Debug Tools** - Tools debugging untuk troubleshooting

## 🎮 Cara Penggunaan

### 1. Setup Awal

1. Buka `index.html` untuk demo atau langsung `fillstat-simulator.html`
2. Pilih tipe item:
   - **Weapon (Senjata)** - untuk simulasi senjata
   - **Armor (Zirah)** - untuk simulasi armor/pelindung

### 2. Konfigurasi Parameter

- **POT Awal**: Masukkan potential awal item Anda (default: 99)
- **POT Resep**: Potential dari resep (default: 46)
- **TEC**: Nilai TEC character (0-255, default: 255)
- **Proficiency**: Nilai proficiency smithing (0-999, default: 0)
- **10% Mat Reduction**: Centang jika memiliki passive 10% material reduction

### 3. Simulasi Fill Stats

1. Klik **"🚀 Mulai Simulasi"** untuk memulai
2. Pilih stat yang ingin ditambahkan dari dropdown (79 pilihan stat tersedia)
3. Masukkan nilai stat yang diinginkan
4. Lihat real-time success rate dan material costs
5. Klik **"✅ Confirm"** untuk mengonfirmasi step

### 4. Kontrol Simulasi

- **✅ Confirm**: Konfirmasi step yang sedang dipilih
- **🔄 Repeat**: Ulangi step terakhir
- **↶ Undo**: Batalkan step terakhir
- **↷ Redo**: Ulangi step yang telah di-undo
- **🔍 Debug Steps**: Tampilkan informasi debug untuk troubleshooting

## 📋 Kategori Stats (79 Pilihan)

### 🔥 Enhance Stats

- STR, STR % - Meningkatkan Strength
- INT, INT % - Meningkatkan Intelligence
- VIT, VIT % - Meningkatkan Vitality
- AGI, AGI % - Meningkatkan Agility
- DEX, DEX % - Meningkatkan Dexterity

### ❤️ Enhance HP/MP

- Natural HP/MP Regen - Regenerasi HP/MP alami
- MaxHP, MaxHP % - Maximum HP
- MaxMP - Maximum MP

### ⚔️ Enhance Attack

- ATK, ATK % - Physical Attack
- MATK, MATK % - Magic Attack
- Stability % - Stabilitas serangan
- Physical/Magic Pierce % - Penetrasi fisik/magic

### 🛡️ Enhance Defense

- DEF, DEF % - Physical Defense
- MDEF, MDEF % - Magic Defense
- Physical/Magical Resistance % - Resistensi
- Reduce Damage dari berbagai tipe serangan

### 🎯 Enhance Accuracy & Dodge

- Accuracy, Accuracy % - Tingkat akurasi
- Dodge, Dodge % - Tingkat penghindaran

### ⚡ Enhance Speed

- ASPD, ASPD % - Attack Speed
- CSPD, CSPD % - Casting Speed

### 💥 Enhance Critical

- Critical Rate, Critical Rate % - Tingkat critical
- Critical Damage, Critical Damage % - Damage critical

### 🌟 Enhance Elements

- Element Strength % - Kekuatan terhadap elemen
- Element Resistance % - Resistensi terhadap elemen
- Awaken Elements - Memberikan elemen pada equipment (khusus weapon)

### ✨ Special Enhancement

- Ailment Resistance % - Resistensi terhadap status ailment
- Guard Power/Rate % - Kekuatan dan tingkat guard
- Evasion Rate % - Tingkat evasion
- Aggro % - Tingkat aggro

## 🔧 File Structure

```
toram-fillstat-simulator/
├── index.html                    # Landing page dengan demo dan info
├── fillstat-simulator.html       # Main simulator application
├── math.js                      # Math calculation utilities
├── t4stat.js                    # Core fillstat logic dan database stats
├── interface-integration.js     # Integration layer untuk modern UI
└── README.md                    # Dokumentasi ini
```

## 💡 Tips Penggunaan

### Strategy Tips

1. **POT Management**: Mulai dengan POT 99 (default) untuk hasil optimal
2. **Material Planning**: Perhatikan material costs untuk estimasi budget crafting
3. **Success Rate**: Target success rate 70-80% untuk keamanan
4. **TEC Optimization**: TEC 255 memberikan hasil terbaik
5. **Step Planning**: Gunakan Undo/Redo untuk eksperimen kombinasi terbaik

### Interface Tips

- Dropdown stats dikelompokkan berdasarkan kategori untuk kemudahan
- Material costs ditampilkan dalam bahasa bilingual (English/Indonesia)
- Success rate berubah warna: Hijau (80%+), Kuning (60-79%), Merah (<60%)
- Auto-save berjalan setiap 30 detik, tidak perlu manual save

## 🐛 Troubleshooting

### Simulator tidak muncul

- Pastikan semua file JavaScript ter-load dengan benar
- Buka Developer Tools (F12) dan cek console untuk error
- Refresh halaman dan coba lagi

### Stats tidak tersimpan

- Pastikan browser mendukung localStorage
- Cek apakah ada error di console browser
- Auto-save aktif setiap 30 detik setelah simulasi dimulai

### Perhitungan tidak akurat

- Verifikasi parameter input (POT awal, POT resep, TEC, proficiency)
- Gunakan tombol "🔍 Debug Steps" untuk informasi detail
- Bandingkan dengan hasil in-game untuk validasi

### Button tidak berfungsi

- Pastikan simulasi sudah dimulai dengan "🚀 Mulai Simulasi"
- Cek apakah ada error di console browser
- Refresh halaman jika masalah persisten

## 🆕 Changelog

### Version 1.0.0 (Current)

- ✅ Interface modern dengan JetBrains Mono font
- ✅ POT default 99 untuk kemudahan penggunaan
- ✅ Material names dalam bahasa bilingual (Indonesia/English)
- ✅ Peringatan disclaimer tentang perbedaan dengan game asli
- ✅ Integration penuh dengan t4stat.js engine
- ✅ Support 79 pilihan stats dengan kategorisasi
- ✅ Auto-save functionality setiap 30 detik
- ✅ Responsive design untuk mobile dan desktop
- ✅ Debug tools untuk troubleshooting
- ✅ Success rate calculation dengan color coding
- ✅ Undo/Redo system dengan queue management

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- 📱 Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Jika ingin berkontribusi pada proyek ini:

1. Fork repository ini
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Free to use untuk komunitas Toram Online Indonesia.

## 🙏 Credits

- Core fillstat calculation engine dari komunitas Toram
- Original repository: [sparkychildcharlie](https://github.com/sparkychildcharlie)
- Modern UI/UX design dengan inspirasi dari material design
- Font JetBrains Mono untuk tampilan monospace yang clean
- Dibuat dengan ❤️ untuk komunitas Toram Online Indonesia

## 🔗 Links

- **Demo**: Buka `index.html` untuk preview
- **Simulator**: Langsung gunakan `fillstat-simulator.html`
- **Support**: Laporkan bug atau request fitur melalui issues

---

**Happy Statting! 🎮✨**

_Ingat: Ini hanya simulasi, hasil di game bisa berbeda!_
