const judulSitus = document.querySelector("header h1");

// 1. FITUR DARK MODE & LOCALSTORAGE 

const tombolTema = document.querySelector("#btn-tema");

function toggleTema() {
    document.body.classList.toggle("dark-mode");
    const temaSekarang = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("tema", temaSekarang);
}

tombolTema.addEventListener("click", toggleTema);

// Memuat preferensi tema saat halaman dimuat
function muatPreferensiTema() {
    const tema = localStorage.getItem("tema");
    if (tema === "dark") {
        document.body.classList.add("dark-mode");
    }
}
muatPreferensiTema();


// 2. FITUR ASIDE (INFO TAMBAHAN) + LOCALSTORAGE

const tombolInfo = document.querySelector("#btn-info");
const kotakAside = document.querySelector("aside");

// Memuat status aside dari localStorage
function muatStatusAside() {
    const statusAside = localStorage.getItem("asideTersembunyi");
    if (statusAside === "true") {
        kotakAside.classList.add("tersembunyi");
    }
}
muatStatusAside();

tombolInfo.addEventListener("click", () => {
    kotakAside.classList.toggle("tersembunyi");
    const isTersembunyi = kotakAside.classList.contains("tersembunyi");
    localStorage.setItem("asideTersembunyi", isTersembunyi);
});


// 3. RENDER PORTOFOLIO & LOCALSTORAGE LIKE

const dataPortofolio = [
    { 
        judul: "Simulasi Algoritma Banker", 
        tanggal: "Mei 2026", 
        isi: "Simulasi Python untuk pencegahan deadlock berbasis skenario pemesanan ruangan dan alat perpustakaan." 
    }
];

const containerPortofolio = document.querySelector(".daftar-portofolio");

function simpanLike(judulArtikel, jumlah) {
    const semuaLike = JSON.parse(localStorage.getItem("semuaLike")) || {};
    semuaLike[judulArtikel] = jumlah;
    localStorage.setItem("semuaLike", JSON.stringify(semuaLike));
}

function buatElemenPortofolio(data) {
    const article = document.createElement("article");

    const judul = document.createElement("h3");
    judul.textContent = data.judul;

    const waktu = document.createElement("time");
    waktu.textContent = data.tanggal;

    const isi = document.createElement("p");
    isi.textContent = data.isi;

    // Memuat kembali jumlah like dari localStorage
    const semuaLike = JSON.parse(localStorage.getItem("semuaLike")) || {};
    let jumlahLike = semuaLike[data.judul] || 0;

    const tombolLike = document.createElement("button");
    tombolLike.textContent = `Like (${jumlahLike})`;
    tombolLike.dataset.like = jumlahLike;
    tombolLike.style.marginRight = "10px";

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

// Tombol Tambah Portofolio
const tombolTambah = document.querySelector("#btn-tambah");
tombolTambah.addEventListener("click", () => {
    const portofolioBaru = {
        judul: "Proyek Pengembangan Web",
        tanggal: "Oktober 2026",
        isi: "Membangun halaman profil interaktif dengan HTML, CSS, dan JavaScript DOM Manipulation."
    };
    buatElemenPortofolio(portofolioBaru);
});

// Event Delegation Container Portofolio (Hapus & Like)
containerPortofolio.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.textContent === "Hapus") {
        e.target.closest("article").remove();
    }
    
    if (e.target.tagName === "BUTTON" && e.target.textContent.startsWith("Like")) {
        let jumlah = parseInt(e.target.dataset.like || 0);
        jumlah++;
        e.target.dataset.like = jumlah;
        e.target.textContent = `Like (${jumlah})`;

        // Simpan like ke localStorage berdasarkan judul artikel
        const judulArtikel = e.target.closest("article").querySelector("h3").textContent;
        simpanLike(judulArtikel, jumlah);
    }
});

// Efek Hover pada Artikel
containerPortofolio.addEventListener("mouseover", (e) => {
    const article = e.target.closest("article");
    if (article) article.classList.add("artikel-hover");
});
containerPortofolio.addEventListener("mouseout", (e) => {
    const article = e.target.closest("article");
    if (article) article.classList.remove("artikel-hover");
});


// 4. FORM KOMENTAR & LOCALSTORAGE 
const formKomentar = document.querySelector("#form-komentar");
const daftarKomentar = document.querySelector("#daftar-komentar");
const errorPesan = document.querySelector("#error-pesan");

// Fungsi menyimpan komentar baru ke array localStorage
function simpanKomentar(nama, pesan) {
    const daftar = JSON.parse(localStorage.getItem("komentar")) || [];
    daftar.push({ nama, pesan });
    localStorage.setItem("komentar", JSON.stringify(daftar));
}

// Fungsi untuk membuat elemen HTML komentar & memasukkannya ke DOM
function renderKomentarItem(nama, pesan) {
    const itemKomentar = document.createElement("li");
    itemKomentar.dataset.nama = nama;
    itemKomentar.dataset.pesan = pesan;
    
    const spanTeks = document.createElement("span");
    spanTeks.innerHTML = `<strong>${nama}</strong>: ${pesan}`;
    
    const tombolHapusKomentar = document.createElement("button");
    tombolHapusKomentar.textContent = "Hapus";
    tombolHapusKomentar.classList.add("hapus-komentar");

    itemKomentar.appendChild(spanTeks);
    itemKomentar.appendChild(tombolHapusKomentar);
    daftarKomentar.appendChild(itemKomentar);
}

// Memuat daftar komentar tersimpan dari localStorage saat pertama kali halaman dimuat
function muatKomentar() {
    const daftar = JSON.parse(localStorage.getItem("komentar")) || [];
    daftar.forEach((k) => {
        renderKomentarItem(k.nama, k.pesan);
    });
}
muatKomentar();

// Event Listener Submit Komentar
formKomentar.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = document.querySelector("#input-nama").value.trim();
    const pesan = document.querySelector("#input-pesan").value.trim();

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

    errorPesan.style.display = "none";

    // 1. Tambahkan langsung ke tampilan HTML
    renderKomentarItem(nama, pesan);

    // 2. Tambahkan ke data tersimpan di localStorage (Array push)
    simpanKomentar(nama, pesan);
    
    formKomentar.reset();
});

// Sync data localStorage jika ada komentar yang dihapus individual
function perbaruiStorageKomentar() {
    const semuaLi = daftarKomentar.querySelectorAll("li");
    const daftar = [];
    semuaLi.forEach(li => {
        const nama = li.dataset.nama;
        const pesan = li.dataset.pesan;
        if (nama && pesan) {
            daftar.push({ nama, pesan });
        }
    });
    localStorage.setItem("komentar", JSON.stringify(daftar));
}

// Event Delegation Hapus per Komentar
daftarKomentar.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.classList.contains("hapus-komentar")) {
        e.target.closest("li").remove();
        perbaruiStorageKomentar();
    }
});

// Tombol Hapus Semua Komentar
const btnHapusSemua = document.querySelector("#btn-hapus-semua");
btnHapusSemua.addEventListener("click", () => {
    daftarKomentar.innerHTML = "";
    localStorage.removeItem("komentar");
});

// 5. TOMBOL RESET SEMUA DATA & SHORTCUT
const btnReset = document.querySelector("#btn-reset");
btnReset.addEventListener("click", () => {
    const konfirmasi = confirm("Hapus semua data tersimpan (tema, like, komentar, pengaturan)?");
    if (konfirmasi) {
        localStorage.clear();
        location.reload();
    }
});

// Shortcut Keyboard Dark Mode (Huruf "d")
document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "d") {
        if (document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
            toggleTema();
        }
    }
});