# Clone Project SkinSense
1. Buka tempat dimana folder project mau ditaruh (wajib di C:\NAMA_FOLDER_BEBAS)
2. Buka cmd di folder tersebut
3. Copas "git clone https://github.com/Salsa101/SkinSense-Project.git"
4. Buka Sourcetree, klik "Add"
5. Browse path project ini lalu klik Add
6. Di panel sebelah kiri buka Remotes > Origin lalu double klik "dev" maka akan muncul popup Checkout, klik OK saja
7. Klik "Fetch" lalu "OK"
8. Klik "Pull" lalu "OK"

# Setup Project SkinSense
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
11. Buka codenya di vscode, masuk ke folder Android, buat file dengan nama "local.properties" lalu isi sdk.dir=C:\\Users\\YOUR_NAME\\AppData\\Local\\Android\\Sdk
12. Setelah itu buka terminal di vscode, masukkan "mkdir android\app\src\main\assets"
13. Setelah itu jalankan "npx react-native start --reset-cache"
14. Setelah itu buka terminal baru, jalankan "npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res"
15. Setelah berhasil, ketik cd Android
16. Jalankan "./gradlew clean"
17. Setelah itu jalankan "./grandlew installdebug"
18. Setelah sukses, ketik "npx react-native run-android"
19. Daaannn project siap dicoding

# Cara Push Perubahan ke Sourcetree
1. Klik "Commit"
2. Klik "Stage All"
3. Ketik perubahan apa yang dilakukan, misal "Add login page" lalu klik "Commit"
4. Setelah itu klik "Push" (pastikan yang tercentang hanya dev) kemudian push
5. Daan perubahan yang kamu lakukan sudah bisa diakses oleh rekan tim mu~

# Notes Untuk Pull dan Push di Sourcetree
Setiap kali tim lain push perubahan dan kamu ingin push perubahan yang kamu lakukan di lokal, tolong !!!pull terlebih dahulu baru push perubahan lokal agar tidak bentrok!!!
