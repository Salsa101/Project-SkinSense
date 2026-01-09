"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      "News",
      [
        {
          title: "2025 Skincare & Beauty Trends: What's New in Skincare",
          newsImage:
            "https://res.cloudinary.com/dttglvpqh/image/upload/v1766319856/1/news/etswkl1mh684breujsom.png",
          content: `<p>Artikel ini mengulas enam tren perawatan kulit paling populer pada tahun 2020 dengan tinjauan berbasis medis dan bukti ilmiah. Ditulis oleh dokter spesialis kulit bersertifikasi dari California Skin Institute, artikel tersebut menyoroti pergeseran minat masyarakat dari gaya riasan wajah tebal khas media sosial ke pendekatan yang lebih alami, minimalis, dan berfokus pada kesehatan kulit secara mendasar. Tren yang dibahas meliputi pemanfaatan teknologi stem cell dalam produk anti-penuaan, penggunaan growth factor untuk mendukung regenerasi jaringan kulit, inovasi perawatan bibir yang lebih lembut namun tetap efektif, serta kemunculan berbagai bahan aktif baru yang mulai populer di pasaran. Setiap tren dievaluasi berdasarkan efektivitas klinis, tingkat keamanan, serta kesesuaiannya sebagai pilihan perawatan kulit yang bermanfaat, bukan sekadar strategi pemasaran yang mengandalkan sensasi. Artikel ini memberikan panduan yang berharga bagi konsumen yang ingin mengambil keputusan pemilihan produk perawatan kulit secara lebih cermat dan berbasis sains.</p><p><br></p><p>Source: <a href="https://www.garnier.in/skin-care-tips/6-emerging-skincare-trends-of-2025" rel="noopener noreferrer" target="_blank">https://www.garnier.in/skin-care-tips/6-emerging-skincare-trends-of-2025</a></p>`,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: "Perfect Your Skin Care Routine with These 30+ Expert Tips",
          newsImage:
            "https://res.cloudinary.com/dttglvpqh/image/upload/v1766320077/1/news/rx8dqvjrlxbenyfjsdok.png",
          content: `<p>Healthline, sebagai platform kesehatan yang tepercaya, menyajikan lebih dari 30 tips perawatan kulit yang menyeluruh dan berbasis bukti ilmiah, hasil kolaborasi dengan dokter spesialis kulit, praktisi estetika, serta peneliti di bidang perawatan kulit. Artikel tersebut disusun berdasarkan tipe kulit—normal, kering, berminyak, kombinasi, dan sensitif—serta permasalahan kulit spesifik seperti penuaan dini, jerawat, hiperpigmentasi, rosasea, dan iritasi, sehingga memudahkan pembaca menemukan informasi yang paling relevan dengan kondisi mereka. Setiap tips dijelaskan secara rinci, mencakup cara kerja biologis kulit, prinsip menjaga kesehatan lapisan pelindung kulit (skin barrier), pengaruh gaya hidup seperti kecukupan hidrasi tubuh, hubungan konsumsi gula dengan peradangan kulit, serta dampak stres hormon kortisol terhadap kondisi kulit. Keunggulan utama dari artikel ini adalah setiap pernyataan didukung oleh referensi studi ilmiah, sehingga pembaca memperoleh informasi yang valid dan bukan sekadar mitos atau klaim pemasaran.</p><p><br></p><p>Source: <a href="https://www.healthline.com/health/beauty-skin-care/skin-care-tips" rel="noopener noreferrer" target="_blank">https://www.healthline.com/health/beauty-skin-care/skin-care-tips</a></p>`,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: "Acne: Tips for Managing (American Academy of Dermatology)",
          newsImage:
            "https://res.cloudinary.com/dttglvpqh/image/upload/v1766320149/1/news/gq5t6hpkqzpc2ckolw7l.png",
          content: `<p>American Academy of Dermatology (AAD), sebagai organisasi profesional dan otoritas utama di bidang dermatologi di Amerika Serikat, menerbitkan panduan resmi penanganan jerawat yang lengkap, berbasis medis, dan didukung bukti ilmiah. Artikel ini disusun untuk mencakup strategi pencegahan maupun perawatan jerawat aktif, dengan penekanan kuat pada kebiasaan harian yang dianjurkan dan yang harus dihindari. AAD menegaskan larangan memencet, menusuk, atau memecahkan jerawat (picking, popping, squeezing) karena dapat mendorong bakteri masuk lebih dalam ke lapisan kulit, meningkatkan peradangan, serta menimbulkan risiko bekas luka permanen dan hiperpigmentasi pascainflamasi yang dapat bertahan berbulan-bulan hingga bertahun-tahun. Rutinitas pembersihan wajah juga memiliki peran penting, dengan rekomendasi mencuci wajah dua kali sehari menggunakan air hangat kuku (lukewarm), pembersih yang lembut (mild, non-abrasive cleanser), serta menghindari scrub atau penggosokan keras yang justru berisiko memperburuk kondisi kulit.</p><p><br></p><p>Source: <a href="https://www.aad.org/public/diseases/acne/skin-care/tips" rel="noopener noreferrer" target="_blank">https://www.aad.org/public/diseases/acne/skin-care/tips</a></p>`,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: "Managing Acne: Tips for Clearer Skin and a Happier Life",
          newsImage:
            "https://res.cloudinary.com/dttglvpqh/image/upload/v1766320184/1/news/oqpkxdl9z1ulrrrbdica.png",
          content: `<p>Jerawat (acne) dapat memengaruhi kenyamanan fisik dan kondisi emosional, namun perawatan yang konsisten dan berbasis saran dermatologi dapat membantu mengurangi peradangan serta mencegah jerawat baru. Praktik umum yang dianjurkan meliputi penggunaan produk skincare non-comedogenic dengan bahan seperti salicylic acid atau benzoyl peroxide, menjaga hidrasi kulit menggunakan pelembap, menghindari kebiasaan memencet jerawat, serta memperhatikan faktor pemicu iritasi dari kain dan deterjen yang keras. Pola makan seimbang, hidrasi tubuh yang cukup, dan manajemen stres juga dapat mendukung kesehatan kulit secara menyeluruh. Artikel ini disarikan dari referensi kesehatan dan dermatologi eksternal untuk tujuan edukasi, dan tidak menggantikan saran medis profesional.</p><p><br></p><p>Source: <a href="https://www.happi-planet.com/blogs/detergent-an-integral-part-of-skin-care/managing-acne-tips-for-clearer-skin-and-a-happier-life?srsltid=AfmBOooUVfQBeVZeOjirRMUmX6xrUBVDd5NWaxyCZ15JOIzng7yHb7Rg" rel="noopener noreferrer" target="_blank">https://www.happi-planet.com/blogs/detergent-an-integral-part-of-skin-care/managing-acne-tips-for-clearer-skin-and-a-happier-life?srsltid=AfmBOooUVfQBeVZeOjirRMUmX6xrUBVDd5NWaxyCZ15JOIzng7yHb7Rg</a></p>`,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          title:
            "Tren Skincare Masa Depan: Mengarah ke Alami, Cerdas, dan Berkelanjutan",
          newsImage:
            "https://res.cloudinary.com/dttglvpqh/image/upload/v1766319911/1/news/lcdtu2ecbvsxxtynrszq.png",
          content: `<p>Laporan terbaru menunjukkan bahwa masa depan skincare akan ditandai dengan tiga pilar utama: penggunaan bahan alami, pendekatan yang dipersonalisasi, serta pemanfaatan teknologi dalam perawatan kulit. Pendekatan ini diharapkan membuat skincare lebih aman, efisien, dan selaras dengan kebutuhan tiap individu. Ini berarti bahwa pengguna kini semakin terdorong untuk memilih produk yang ramah lingkungan, aman untuk kulit, serta sesuai dengan karakteristik kulit masing-masing, sebuah evolusi penting dalam dunia kecantikan modern.</p><p><br></p><p>Source: <a href="https://rri.co.id/hiburan/1527137/tren-skincare-masa-depan-alami-cerdas-berkelanjutan" rel="noopener noreferrer" target="_blank">https://rri.co.id/hiburan/1527137/tren-skincare-masa-depan-alami-cerdas-berkelanjutan</a></p>`,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: "12 Penyebab Jerawat dan Faktor Risiko yang Tak Disadari",
          newsImage:
            "https://res.cloudinary.com/dttglvpqh/image/upload/v1766320235/1/news/n56fgxfrlat7ednx2myg.png",
          content: `<p>Artikel ini menyajikan penjelasan komprehensif mengenai berbagai penyebab jerawat mulai dari infeksi bakteri, produksi minyak berlebih, penumpukan sel kulit mati, hingga kebiasaan sehari-hari seperti menyentuh wajah dengan tangan kotor atau menggunakan produk skincare yang tidak cocok. Selain itu, artikel ini juga menyoroti faktor risiko lain seperti perubahan hormon, stres, kurang tidur, pola makan, dan penggunaan obat tertentu. Pemahaman mendalam terhadap penyebab ini penting agar perawatan jerawat dan pencegahan bisa dilakukan dengan lebih tepat.</p><p><br></p><p>Source: <a href="https://hellosehat.com/penyakit-kulit/jerawat/penyebab-jerawat/" rel="noopener noreferrer" target="_blank">https://hellosehat.com/penyakit-kulit/jerawat/penyebab-jerawat/</a></p>`,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("News", null, {});
  },
};
