console.log("=== Library Dashboard Script (Kantin HSI) ===");

// ==========================================
// 1. Data Statis & Header KPI (Sesuai Foto)
// ==========================================
document.getElementById("dRange").textContent = "17 Okt 2026 - 23 Okt 2026 · 3 kategori · 10 produk";

document.getElementById("kOmzet").textContent = "Rp1.410.000";
document.getElementById("cOmzet").textContent = "Rata-rata Rp201.429 per hari";

document.getElementById("kItem").textContent = "261";
document.getElementById("cItem").textContent = "Dari 10 produk yang laku";

document.getElementById("kTrx").textContent = "21";
document.getElementById("cTrx").textContent = "Dalam 7 hari";

document.getElementById("tCount").textContent = "10 produk";
document.getElementById("pCount").textContent = "4 aktif";


// ==========================================
// 2. Flatpickr (Pemilih Rentang Tanggal)
// ==========================================
flatpickr('#fDate', {
    mode: "range",
    dateFormat: "d M Y", // Contoh: 17 Okt 2026
    locale: "id",
    defaultDate: ["2026-10-17", "2026-10-23"] // Sesuaikan dengan foto
});


// ==========================================
// 3. Tom Select (Multi-select Kategori)
// ==========================================
new TomSelect("#fKat", {
    plugins: ['remove_button'],
    placeholder: "Pilih kategori...",
    options: [
        { value: "Makanan", text: "Makanan" },
        { value: "Minuman", text: "Minuman" },
        { value: "Snack", text: "Snack" }
    ],
    items: ["Makanan", "Minuman", "Snack"] // Default terpilih semua
});


// ==========================================
// 4. Floating UI (Tooltip Informasi)
// ==========================================
const { computePosition, autoUpdate, offset, flip, shift } = window.FloatingUIDOM;
const tooltip = document.querySelector("#tooltip");
const tipButtons = document.querySelectorAll("[data-tip]");

tipButtons.forEach(btn => {
    let cleanup = null;

    function updateTip() {
        computePosition(btn, tooltip, {
            placement: "top",
            middleware: [offset(8), flip(), shift({ padding: 8 })]
        }).then(({ x, y }) => {
            Object.assign(tooltip.style, { left: `${x}px`, top: `${y}px` });
        });
    }

    function showTip() {
        tooltip.textContent = btn.getAttribute("data-tip");
        tooltip.style.opacity = "1";
        cleanup = autoUpdate(btn, tooltip, updateTip);
    }

    function hideTip() {
        tooltip.style.opacity = "0";
        if (cleanup) {
            cleanup();
            cleanup = null;
        }
    }

    [["mouseenter", showTip], ["mouseleave", hideTip], ["focus", showTip], ["blur", hideTip]]
        .forEach(([event, handler]) => btn.addEventListener(event, handler));
});


// ==========================================
// 5. Chart.js (Grafik Bar & Donat)
// ==========================================
// A. Grafik Bar: Omzet per hari
const ctxBar = document.getElementById('cBar');
new Chart(ctxBar, {
    type: 'bar',
    data: {
        labels: ['Sab, 17', 'Min, 18', 'Sen, 19', 'Sel, 20', 'Rab, 21', 'Kam, 22', 'Jum, 23'],
        datasets: [{
            label: 'Omzet',
            data: [220000, 160000, 200000, 220000, 190000, 155000, 260000], // Sesuai bar pada foto
            backgroundColor: '#357DE8', // Warna biru Atlassian
            borderRadius: 4,
            barThickness: 32
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) { return (value / 1000) + 'rb'; } // Tampilan 100rb, 200rb
                }
            }
        }
    }
});

// B. Grafik Donat: Item per kategori
const ctxDn = document.getElementById('cDn');
new Chart(ctxDn, {
    type: 'doughnut',
    data: {
        labels: ['Makanan', 'Minuman', 'Snack'],
        datasets: [{
            data: [130, 90, 41], // Proporsi seimbang mendekati gambar
            backgroundColor: ['#357DE8', '#82B536', '#BF63F3'], // Biru, Hijau, Ungu
            borderWidth: 2,
            hoverOffset: 4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: { boxWidth: 12, usePointStyle: true, padding: 20 }
            }
        }
    }
});


// ==========================================
// 6. Tabulator & SweetAlert2 (Tabel Produk)
// ==========================================
const produkData = [
    { id: 1, nama: "Nasi Goreng", kategori: "MAKANAN", terjual: 38, omzet: 380000 },
    { id: 2, nama: "Mie Ayam", kategori: "MAKANAN", terjual: 23, omzet: 184000 },
    { id: 3, nama: "Nasi Uduk", kategori: "MAKANAN", terjual: 23, omzet: 161000 },
    { id: 4, nama: "Air Mineral", kategori: "MINUMAN", terjual: 34, omzet: 136000 },
    { id: 5, nama: "Es Teh Manis", kategori: "MINUMAN", terjual: 42, omzet: 126000 },
    // Tambahkan data dummy lainnya jika diperlukan untuk mencapai "10 produk"
];

const tabelProduk = new Tabulator("#tProd", {
    data: produkData,
    layout: "fitColumns",
    height: 250, // Menyesuaikan tinggi
    pagination: "local",
    paginationSize: 5,
    columns: [
        { title: "Produk", field: "nama", widthGrow: 2, headerFilter: "input", headerFilterPlaceholder: "Cari produk..." },
        { title: "Kategori", field: "kategori", formatter: function(cell) {
            let val = cell.getValue();
            let color = val === 'MAKANAN' ? 'blue' : (val === 'MINUMAN' ? 'green' : 'purple');
            return `<span class="lozenge ${color}">${val}</span>`;
        }},
        { title: "Terjual", field: "terjual" },
        { title: "Omzet", field: "omzet", formatter: "money", formatterParams: { symbol: "Rp", thousand: ".", precision: false } },
        { title: "", field: "action", width: 50, hozAlign: "center", headerSort: false, formatter: function() {
            // Ikon Tempat Sampah (Hapus)
            return `<button class="icon-btn del" aria-label="Hapus"><svg class="ic" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>`;
        }, cellClick: function(e, cell) {
            // SweetAlert2 Konfirmasi Hapus Data
            Swal.fire({
                title: "Hapus produk?",
                text: "Apakah Anda yakin ingin menghapus " + cell.getRow().getData().nama + "?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#C9372C", // Warna merah sesuai style Atlassian
                cancelButtonColor: "#8C8F97",
                confirmButtonText: "Ya, hapus!",
                cancelButtonText: "Batal",
                customClass: { popup: 'ads-modal' } // Style tambahan dari file CSS HTML
            }).then((result) => {
                if (result.isConfirmed) {
                    cell.getRow().delete();
                    Swal.fire({
                        title: "Terhapus!",
                        text: "Produk berhasil dihapus.",
                        icon: "success",
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        customClass: { popup: 'ads-flag' }
                    });
                }
            });
        }}
    ]
});


// ==========================================
// 7. Inject Data Promo Minggu Ini
// ==========================================
const listPromo = [
    { emoji: "🍜", title: "Senin Hemat", desc: "Mie Ayam cuma Rp7.000", tag: "SENIN", warna: "blue" },
    { emoji: "🍳", title: "Paket Sarapan", desc: "Nasi Uduk + Es Teh Rp9.000", tag: "SETIAP HARI", warna: "yellow" },
    { emoji: "🍌", title: "Menu Baru", desc: "Pisang Goreng Coklat", tag: "MINGGU INI", warna: "blue" },
    { emoji: "💧", title: "Jumat Berkah", desc: "Air mineral gratis tiap beli makanan", tag: "JUMAT", warna: "red" }
];

const promoHTML = listPromo.map(p => `
    <li>
        <div class="p-emoji" style="background:var(--ds-surface-sunken);">${p.emoji}</div>
        <div class="p-body">
            <b>${p.title}</b>
            <small>${p.desc}</small>
        </div>
        <span class="lozenge ${p.warna}">${p.tag}</span>
    </li>
`).join('');

document.getElementById('promo').innerHTML = promoHTML;


// ==========================================
// 8. Dark Mode Toggle
// ==========================================
const btnTheme = document.getElementById("btnTheme");
if (btnTheme) {
    btnTheme.addEventListener("click", () => {
        const root = document.documentElement;
        let mode = root.getAttribute("data-color-mode") === "light" ? "dark" : "light";
        root.setAttribute("data-color-mode", mode);
        localStorage.setItem("kantin-color-mode", mode);
    });
}