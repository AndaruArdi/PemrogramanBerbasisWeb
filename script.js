const judulSitus = document.querySelector("header h1");

// MODUL 9: alamat dasar API (dipakai semua fungsi fetch)
const API_URL = "https://jsonplaceholder.typicode.com";

// B.6 Langkah 5: pesan berbeda berdasarkan status code HTTP
function pesanDariStatus(status) {
    if (status === 404) return "Data tidak ditemukan di server.";
    if (status === 400) return "Data yang dikirim tidak valid.";
    if (status >= 500) return "Server sedang bermasalah, coba lagi nanti.";
    return "Terjadi kesalahan tidak terduga.";
}

// Helper: kirim request, lempar error yang membawa status code jika tidak ok
async function requestKeServer(url, opsi) {
    const response = await fetch(url, opsi);
    if (!response.ok) {
        const error = new Error("Status: " + response.status);
        error.status = response.status;
        throw error;
    }
    return response;
}

// Helper: nonaktifkan tombol selama request agar tidak terklik dua kali
function setSibuk(tombol, sibuk, teks) {
    if (sibuk) {
        tombol.dataset.teksAsli = tombol.textContent;
        tombol.textContent = teks;
        tombol.disabled = true;
    } else {
        tombol.textContent = tombol.dataset.teksAsli || tombol.textContent;
        tombol.disabled = false;
    }
}

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
    // Modul 9: simpan id dari server untuk PATCH like
    if (data.id) article.dataset.postId = data.id;

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
    // Modul 8: data dari API tidak punya tanggal, jadi <time> hanya dipasang kalau ada
    if (data.tanggal) {
        article.appendChild(waktu);
    }
    article.appendChild(isi);
    article.appendChild(tombolLike);
    article.appendChild(tombolHapus);

    containerPortofolio.appendChild(article);
}

// Render data awal saat halaman dimuat
// Modul 8 (B.3): forEach data statis dinonaktifkan, diganti data dari API 
// dataPortofolio.forEach((data) => {
//     buatElemenPortofolio(data);
// });

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
        const article = e.target.closest("article");
        const judulArtikel = article.querySelector("h3").textContent;
        simpanLike(judulArtikel, jumlah);

        // Modul 9 (B.4): kirim jumlah like terbaru ke server dengan PATCH
        // (hanya artikel dari API yang punya id)
        if (article.dataset.postId) {
            perbaruiLikeKeServer(article.dataset.postId, jumlah);
        }
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


// 4. form komentar post patch (EDIT), delete ke server MODUL 9)
const formKomentar = document.querySelector("#form-komentar");
const daftarKomentar = document.querySelector("#daftar-komentar");
const errorPesan = document.querySelector("#error-pesan");
const inputNamaKomentar = document.querySelector("#input-nama");
const inputPesanKomentar = document.querySelector("#input-pesan");
const tombolKirim = formKomentar.querySelector('button[type="submit"]');
const tombolBatalEdit = document.querySelector("#btn-batal-edit");

let liSedangDiedit = null; // komentar yang sedang diedit (null = mode tambah)

const HEADER_JSON = { "Content-Type": "application/json" };

// ---- Fungsi komunikasi dengan server ----

// B.2 Langkah 1: POST komentar baru
async function kirimKomentarKeServer(nama, pesan) {
    const response = await requestKeServer(`${API_URL}/comments`, {
        method: "POST",
        headers: HEADER_JSON,
        body: JSON.stringify({ name: nama, body: pesan, postId: 1 })
    });
    return await response.json(); // server membalas data + id baru
}

// Tugas Mandiri: PATCH komentar (ubah nama & isi)
async function perbaruiKomentarKeServer(id, nama, pesan) {
    const response = await requestKeServer(`${API_URL}/comments/${id}`, {
        method: "PATCH",
        headers: HEADER_JSON,
        body: JSON.stringify({ name: nama, body: pesan })
    });
    return await response.json();
}

// B.5 Langkah 4: DELETE komentar
async function hapusKomentarDariServer(id) {
    await requestKeServer(`${API_URL}/comments/${id}`, { method: "DELETE" });
}

// B.4 Langkah 3: PATCH jumlah like (endpoint /posts/id sebagai simulasi)
async function perbaruiLikeKeServer(postId, jumlahLike) {
    try {
        await requestKeServer(`${API_URL}/posts/${postId}`, {
            method: "PATCH",
            headers: HEADER_JSON,
            body: JSON.stringify({ likes: jumlahLike })
        });
        console.log("Like berhasil diperbarui di server");
    } catch (error) {
        console.error("Gagal memperbarui like:", error);
    }
}

// ---- Tampilan pesan error ----
function tampilkanError(error, aksi) {
    const pesan = error.status
        ? pesanDariStatus(error.status)
        : "Tidak dapat terhubung ke server, periksa koneksi internet.";
    errorPesan.textContent = `Gagal ${aksi}. ${pesan}`;
    errorPesan.style.display = "block";
    console.error(error);
}

// ---- localStorage komentar buatan pengguna (Modul 6) ----
function ambilKomentarTersimpan() {
    return JSON.parse(localStorage.getItem("komentar")) || [];
}

// Hanya komentar buatan pengguna (dataset.lokal) yang disimpan ke localStorage
function perbaruiStorageKomentar() {
    const daftar = [];
    daftarKomentar.querySelectorAll("li").forEach((li) => {
        if (li.dataset.lokal === "true") {
            daftar.push({ id: li.dataset.id, nama: li.dataset.nama, pesan: li.dataset.pesan });
        }
    });
    localStorage.setItem("komentar", JSON.stringify(daftar));
}

// ---- Render komentar ----
// B.3 Langkah 2: dataset.id menyimpan id dari server untuk PATCH & DELETE
function isiTeksKomentar(li) {
    const spanTeks = li.querySelector("span");
    spanTeks.textContent = "";
    const nama = document.createElement("strong");
    nama.textContent = li.dataset.nama;           // textContent: aman dari HTML injection
    spanTeks.appendChild(nama);
    spanTeks.appendChild(document.createTextNode(": " + li.dataset.pesan));
}

function buatItemKomentar(k) {
    const li = document.createElement("li");
    if (k.id !== undefined && k.id !== null) li.dataset.id = k.id;
    li.dataset.nama = k.nama;
    li.dataset.pesan = k.pesan;
    if (k.lokal) li.dataset.lokal = "true";

    const spanTeks = document.createElement("span");

    const tombolEdit = document.createElement("button");
    tombolEdit.textContent = "Edit";
    tombolEdit.classList.add("edit-komentar");

    const tombolHapusKomentar = document.createElement("button");
    tombolHapusKomentar.textContent = "Hapus";
    tombolHapusKomentar.classList.add("hapus-komentar");

    const aksi = document.createElement("div");
    aksi.classList.add("aksi-komentar");
    aksi.appendChild(tombolEdit);
    aksi.appendChild(tombolHapusKomentar);

    li.appendChild(spanTeks);
    li.appendChild(aksi);
    isiTeksKomentar(li);
    return li;
}

// Memuat komentar buatan pengguna yang tersimpan saat halaman dibuka
function muatKomentar() {
    ambilKomentarTersimpan().forEach((k) => {
        daftarKomentar.appendChild(buatItemKomentar({ ...k, lokal: true }));
    });
}
muatKomentar();

// ---- Mode edit (Tugas Mandiri) ----
function mulaiEdit(li) {
    liSedangDiedit = li;
    inputNamaKomentar.value = li.dataset.nama;
    inputPesanKomentar.value = li.dataset.pesan;
    tombolKirim.textContent = "Simpan Perubahan";
    tombolBatalEdit.style.display = "inline-block";
    inputPesanKomentar.focus();
}

function keluarModeEdit() {
    liSedangDiedit = null;
    formKomentar.reset();
    tombolKirim.textContent = "Kirim";
    tombolBatalEdit.style.display = "none";
}
tombolBatalEdit.addEventListener("click", keluarModeEdit);

// ---- Submit: POST (komentar baru) atau PATCH (mode edit) ----
formKomentar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nama = inputNamaKomentar.value.trim();
    const pesan = inputPesanKomentar.value.trim();

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

    const sedangEdit = liSedangDiedit !== null;
    setSibuk(tombolKirim, true, sedangEdit ? "Menyimpan..." : "Mengirim...");

    try {
        if (sedangEdit) {
            // PATCH: perbarui komentar di server
            const li = liSedangDiedit;
            if (li.dataset.id) await perbaruiKomentarKeServer(li.dataset.id, nama, pesan);
            li.dataset.nama = nama;
            li.dataset.pesan = pesan;
            isiTeksKomentar(li);
            perbaruiStorageKomentar();
            setSibuk(tombolKirim, false);
            keluarModeEdit();
        } else {
            // POST: kirim komentar baru, tampilkan dengan id dari server
            const hasil = await kirimKomentarKeServer(nama, pesan);
            const li = buatItemKomentar({ id: hasil.id, nama, pesan, lokal: true });
            daftarKomentar.appendChild(li);
            perbaruiStorageKomentar();
            formKomentar.reset();
            console.log("Komentar tersimpan di server dengan id:", hasil.id);
        }
    } catch (error) {
        tampilkanError(error, sedangEdit ? "memperbarui komentar" : "mengirim komentar");
    } finally {
        // tombol selalu diaktifkan kembali (aman dipanggil dua kali)
        if (tombolKirim.disabled) setSibuk(tombolKirim, false);
    }
});

// ---- Event delegation: Edit & Hapus (DELETE) ----
daftarKomentar.addEventListener("click", async (e) => {
    const tombol = e.target.closest("button");
    if (!tombol) return;
    const li = tombol.closest("li");

    if (tombol.classList.contains("edit-komentar")) {
        mulaiEdit(li);
        return;
    }

    if (tombol.classList.contains("hapus-komentar")) {
        errorPesan.style.display = "none";
        tombol.disabled = true; // cegah klik ganda
        try {
            if (li.dataset.id) await hapusKomentarDariServer(li.dataset.id);
            if (li === liSedangDiedit) keluarModeEdit();
            li.remove();
            perbaruiStorageKomentar();
        } catch (error) {
            tombol.disabled = false;
            tampilkanError(error, "menghapus komentar");
        }
    }
});

// Tombol Hapus Semua Komentar (hanya tampilan & localStorage)
const btnHapusSemua = document.querySelector("#btn-hapus-semua");
btnHapusSemua.addEventListener("click", () => {
    daftarKomentar.innerHTML = "";
    localStorage.removeItem("komentar");
    keluarModeEdit();
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


// 6. FETCH API & JSON (GET, MODUL 8)

// B.2 Langkah 1: Fetch dasar ke console 
async function ujiFetch() {
    const response = await fetch(`${API_URL}/posts?_limit=3`);
    const data = await response.json();
    console.log(data);
}
ujiFetch();

// B.3 - B.5 Langkah 2-4: Ganti data artikel dari API + loading + penanganan error
async function muatArtikelDariAPI() {
    const loading = document.querySelector("#loading");
    loading.style.display = "block";

    try {
        const response = await fetch(`${API_URL}/posts?_limit=5`);

        // fetch tidak otomatis error di status 404/500, jadi dicek manual
        if (!response.ok) {
            throw new Error("Status: " + response.status);
        }

        const daftarPost = await response.json();

        // Memakai buatElemenPortofolio() supaya tombol Like/Hapus (Modul 4)
        // dan penyimpanan like ke localStorage (Modul 6) tetap jalan
        daftarPost.forEach((post) => {
            buatElemenPortofolio({
                id: post.id,
                judul: post.title,
                isi: post.body
            });
        });
    } catch (error) {
        containerPortofolio.innerHTML =
            "<p>Gagal memuat artikel, silakan coba lagi nanti.</p>";
        console.error("Gagal mengambil data:", error);
    } finally {
        // finally selalu jalan, baik berhasil maupun gagal
        loading.style.display = "none";
    }
}
muatArtikelDariAPI();

// B.6 Langkah 5: Data pengguna untuk aside (Tentang Penulis)
async function muatProfilPenulis() {
    const namaPenulis = document.querySelector("#nama-penulis");
    const emailPenulis = document.querySelector("#email-penulis");

    try {
        const response = await fetch(`${API_URL}/users/1`);
        if (!response.ok) throw new Error("Status: " + response.status);

        const user = await response.json();
        namaPenulis.textContent = user.name;
        emailPenulis.textContent = user.email;
    } catch (error) {
        namaPenulis.textContent = "Tidak tersedia";
        emailPenulis.textContent = "Tidak tersedia";
        console.error("Gagal memuat profil penulis:", error);
    }
}
muatProfilPenulis();

// B.7 Tugas Mandiri: komentar awal dari endpoint /posts/1/comments
async function muatKomentarDariAPI() {
    const loadingKomentar = document.querySelector("#loading-komentar");
    const errorKomentar = document.querySelector("#error-komentar");

    loadingKomentar.style.display = "block";
    errorKomentar.style.display = "none";

    try {
        const response = await fetch(`${API_URL}/posts/1/comments`);
        if (!response.ok) throw new Error("Status: " + response.status);

        const daftarKomentarAPI = await response.json();
        const fragment = document.createDocumentFragment();

        daftarKomentarAPI.forEach((komentar) => {
            // lokal = false: komentar dari API tidak ikut disimpan ke localStorage,
            // tetapi tetap punya id server sehingga bisa di-PATCH & di-DELETE
            fragment.appendChild(buatItemKomentar({
                id: komentar.id,
                nama: komentar.email,
                pesan: komentar.body,
                lokal: false
            }));
        });

        // Komentar API ditaruh di paling atas sebagai komentar awal
        daftarKomentar.prepend(fragment);
    } catch (error) {
        errorKomentar.textContent = "Gagal memuat komentar awal, silakan coba lagi nanti.";
        errorKomentar.style.display = "block";
        console.error("Gagal mengambil komentar:", error);
    } finally {
        loadingKomentar.style.display = "none";
    }
}
muatKomentarDariAPI();
