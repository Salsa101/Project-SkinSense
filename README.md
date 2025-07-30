# Menjalankan Project (Setelah semua terinstall)
1. Buka terminal di vscode
2. Ketik "cd BackEnd" (ini wajib diperhatiin biar gak salah!)
3. Setelah kamu ada di direktori BackEnd, jalankan "npm run dev"
4. Kemudian tambah terminal baru lagi
5. Ketik "cd FrontEnd" (ini wajib diperhatiin biar gak salah!)
6. Setelah kamu ada di direktori FrontEnd, jalankan "npx react-native run-android"

# Clone Project SkinSense
1. Buka tempat dimana folder project mau ditaruh (wajib di C:\NAMA_FOLDER_BEBAS)
2. Buka cmd di folder tersebut
3. Copas "git clone https://github.com/Salsa101/Project-SkinSense.git"
4. Buka Sourcetree, klik "Add"
5. Browse path project ini lalu klik Add
6. Di panel sebelah kiri buka Remotes > Origin lalu double klik "dev" maka akan muncul popup Checkout, klik OK saja
7. Klik "Fetch" lalu "OK"
8. Klik "Pull" lalu "OK"

# Setup Project SkinSense (FrontEnd)
1. Cari C:\Users\YOUR_NAME\AppData\Local\Android\Sdk\emulator
2. Ketik "emulator -list-avds" di file path
3. Nanti keluar emulator apa aja yang udah kamu install
4. Setelah itu ketik emulator -avd NAMA_EMULATOR_KAMU
5. Kalo udah bisa kebuka emulatornya, berarti aman, minimize aja
6. Buka project di file explorer
7. Ketik cmd di file path
8. Setelah command prompt terbuka, ketik "code ." maka project akan terbuka di vscode
9. Kembali ke command prompt, lalu copas "cd FrontEnd"
10. Setelah itu ketik "npm install"
11. Buka codenya di vscode, masuk ke folder Android, buat file dengan nama "local.properties" lalu isi "sdk.dir=C:\\Users\\YOUR_NAME\\AppData\\Local\\Android\\Sdk" (ini \ nya double ya, gtau knp di viewnya jadi 1 \ doang padahal gw tulis double"
12. Dibawah sdk.dir tadi tambahkan ndk.version=ISI_PAKAI_NDK_VER_KAMU
13. Untuk cek ndk versi punyamu, kamu bisa coba akses di "C:\Users\NAMA_KAMU\AppData\Local\Android\Sdk\ndk", nanti disitu ada folder dengan judul "27.1.12297006" (contoh punya gw)
14. Setelah itu buka terminal di vscode, masukkan "mkdir android\app\src\main\assets"
15. Setelah itu jalankan "npx react-native start --reset-cache"
16. Setelah itu buka terminal baru, jalankan "npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res"
17. Setelah berhasil, ketik cd Android
18. Jalankan "./gradlew clean"
19. Setelah itu jalankan "./gradlew installdebug"
20. Setelah sukses, ketik "npx react-native run-android"

# Setup Project SkinSense (BackEnd)
1. Buka terminal baru lalu "cd BackEnd"
2. Jalankan "npm install"
3. Setelah itu jalankan "npm run dev"
4. Kalau udah ada kalimat "Server running at http://localhost:3000" berarti udah berhasil, tinggalin aja jangan diapa-apain lagi

# Cara Push/Pull Perubahan ke Sourcetree
1. Untuk push perubahan, klik "Commit"
2. Setelah itu klik "Stage All"
3. Ketik perubahan apa yang dilakukan di bawah, misal "Add login page" lalu klik "Commit"
4. Setelah itu klik "Push" dan perubahan yang kamu lakukan sudah masuk ke sourcetree
5. Jika rekan tim lain melakukan perubahan dan push perubahan ke sourcetree, maka kamu bisa klik "pull" dan perubahan yang dilakukan rekan lain akan masuk ke projectmu
6. Jika rekan tim lain sudah bilang "aku udah push perubahan di sourcetree" tapi di kamu belum ada notif pada opsi "pull" maka klik dulu "fetch" untuk mengambil latest commit yang dilakukan di seluruh project

# Notes Untuk Pull dan Push di Sourcetree
Setiap kali tim lain push perubahan dan kamu ingin push perubahan yang kamu lakukan di lokal, tolong !!!pull terlebih dahulu baru push perubahan lokal agar tidak bentrok!!!
