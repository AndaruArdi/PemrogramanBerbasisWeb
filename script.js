const judulSitus = document.querySelector("header h1");

// 1. Fitur Dark Mode
const tombolTema = document.querySelector("#btn-tema");
function toggleTema() {
    document.body.classList.toggle("dark-mode");
}
tombolTema.addEventListener("click", toggleTema);

// 2. Fitur Tampilkan/Sembunyikan Aside (Info Tambahan)
const tombolInfo = document.querySelector("#btn-info");
const kotakAside = document.querySelector("aside");

tombolInfo.addEventListener("click", () => {
    kotakAside.classList.toggle("tersembunyi");
});

// 3. Tugas Mandiri: Render Portofolio dari Array JavaScript
const dataPortofolio = [
    { 
        judul: "Simulasi Algoritma Banker", 
        tanggal: "Mei 2026", 
        isi: "Simulasi Python untuk pencegahan deadlock berbasis skenario pemesanan ruangan dan alat perpustakaan." 
    }
];

const containerPortofolio = document.querySelector(".daftar-portofolio");

// Fungsi pembantu untuk membuat dan me-render item portofolio
function buatElemenPortofolio(data) {
    const article = document.createElement("article");

    const judul = document.createElement("h3");
    judul.textContent = data.judul;

    const waktu = document.createElement("time");
    waktu.textContent = data.tanggal;

    const isi = document.createElement("p");
    isi.textContent = data.isi;

    // Tombol Hapus per Item
    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus";
    tombolHapus.classList.add("btn-hapus");

    article.appendChild(judul);
    article.appendChild(waktu);
    article.appendChild(isi);
    article.appendChild(tombolHapus);

    containerPortofolio.appendChild(article);
}

// Render data awal saat halaman dibuka
dataPortofolio.forEach((data) => {
    buatElemenPortofolio(data);
});

// 4. Tugas Mandiri: Tombol Tambah Portofolio Secara Dinamis
const tombolTambah = document.querySelector("#btn-tambah");
tombolTambah.addEventListener("click", () => {
    const portofolioBaru = {
        judul: "Proyek Pengembangan Web",
        tanggal: "Oktober 2026",
        isi: "Membangun halaman profil interaktif dengan HTML, CSS, dan JavaScript DOM Manipulation."
    };
    
    // Panggil fungsi render untuk data baru
    buatElemenPortofolio(portofolioBaru);
});

// 5. Tugas Mandiri: Tombol Hapus Artikel dengan Event Delegation
containerPortofolio.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.textContent === "Hapus") {
        e.target.closest("article").remove();
    }
});