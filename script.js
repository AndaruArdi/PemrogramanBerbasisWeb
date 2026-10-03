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

    // B.3 Langkah 2 - Tombol Like
    const tombolLike = document.createElement("button");
    let jumlahLike = 0;
    tombolLike.textContent = `Like (${jumlahLike})`;
    tombolLike.dataset.like = jumlahLike; // Menyimpan data like
    tombolLike.style.marginRight = "10px";

    // Tombol Hapus per Item
    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus";
    tombolHapus.classList.add("btn-hapus");

    article.appendChild(judul);
    article.appendChild(waktu);
    article.appendChild(isi);
    article.appendChild(tombolLike);
    article.appendChild(tombolHapus);

    containerPortofolio.appendChild(article);
}

// Render data awal saat halaman dimuat
dataPortofolio.forEach((data) => {
    buatElemenPortofolio(data);
});

// Tugas Mandiri: Tombol Tambah Portofolio
const tombolTambah = document.querySelector("#btn-tambah");
tombolTambah.addEventListener("click", () => {
    const portofolioBaru = {
        judul: "Proyek Pengembangan Web",
        tanggal: "Oktober 2026",
        isi: "Membangun halaman profil interaktif dengan HTML, CSS, dan JavaScript DOM Manipulation."
        };
    buatElemenPortofolio(portofolioBaru);
});

// Event Delegation Container Portofolio (Hapus & Like & Hover)
containerPortofolio.addEventListener("click", (e) => {
    // Logika Hapus
    if (e.target.tagName === "BUTTON" && e.target.textContent === "Hapus") {
        e.target.closest("article").remove();
    }
    
    // B.3 Langkah 2 - Logika Like via Delegation
    if (e.target.tagName === "BUTTON" && e.target.textContent.startsWith("Like")) {
        let jumlah = parseInt(e.target.dataset.like || 0);
        jumlah++;
        e.target.dataset.like = jumlah;
        e.target.textContent = `Like (${jumlah})`;
    }
});

// B.2 Langkah 1 - Efek Hover pada Artikel (Event mouseover & mouseout)
containerPortofolio.addEventListener("mouseover", (e) => {
    const article = e.target.closest("article");
    if (article) article.classList.add("artikel-hover");
});
containerPortofolio.addEventListener("mouseout", (e) => {
    const article = e.target.closest("article");
    if (article) article.classList.remove("artikel-hover");
});

// B.4 & B.5 FORM KOMENTAR

const formKomentar = document.querySelector("#form-komentar");
const daftarKomentar = document.querySelector("#daftar-komentar");
const errorPesan = document.querySelector("#error-pesan");

formKomentar.addEventListener("submit", (e) => {
    e.preventDefault(); // Mencegah form reload halaman

    const nama = document.querySelector("#input-nama").value.trim();
    const pesan = document.querySelector("#input-pesan").value.trim();

    // Tugas Mandiri: Validasi minimal 5 karakter, dimunculkan di DOM (bukan alert)
    if (nama === "" || pesan === "") {
        errorPesan.textContent = "Nama dan komentar wajib diisi!";
        errorPesan.style.display = "block";
        return;
    }
    
    if (pesan.length < 5) {
        errorPesan.textContent = "Komentar minimal 5 karakter!";
        errorPesan.style.display = "block";
        return;
    }

    // Jika sukses, sembunyikan error
    errorPesan.style.display = "none";

    // B.5 Langkah 4 - Render Komentar ke DOM
    const itemKomentar = document.createElement("li");
    
    const spanTeks = document.createElement("span");
    spanTeks.innerHTML = `<strong>${nama}</strong>: ${pesan}`;
    
    // Tugas Mandiri: Event delegation agar komentar punya tombol hapus
    const tombolHapusKomentar = document.createElement("button");
    tombolHapusKomentar.textContent = "Hapus";
    tombolHapusKomentar.classList.add("hapus-komentar");

    itemKomentar.appendChild(spanTeks);
    itemKomentar.appendChild(tombolHapusKomentar);
    
    daftarKomentar.appendChild(itemKomentar);
    
    formKomentar.reset();
});

// Tugas Mandiri: Event Delegation Hapus per Komentar
daftarKomentar.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.classList.contains("hapus-komentar")) {
        e.target.closest("li").remove();
    }
});

// Tugas Mandiri: Hapus semua komentar
const btnHapusSemua = document.querySelector("#btn-hapus-semua");
btnHapusSemua.addEventListener("click", () => {
    daftarKomentar.innerHTML = "";
});

// B.6 Langkah 5 - Keyboard Shortcut Dark Mode
document.addEventListener("keydown", (e) => {
    // Cek apakah tombol "d" atau "D" ditekan
    if (e.key.toLowerCase() === "d") {
        // Mencegah dark mode tertoggle saat user mengetik huruf "d" di dalam form input/textarea
        if (document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
            document.body.classList.toggle("dark-mode");
        }
    }
});