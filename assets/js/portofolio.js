import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

async function fetchPortofolio() {
    // Ambil token dari cookie
    const token = getCookie("login");

    // Redirect jika token tidak ditemukan
    if (!token) {
        redirect("/login");
        return; // Berhenti eksekusi lebih lanjut jika token tidak ada
    }

    const endpoint = "http://localhost:8080/portofolio";

    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "login": `${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayPortofolio(data);
    } catch (error) {
        console.error("Error fetching portofolio:", error);
    }
}

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(angka);
}

function displayPortofolio(portofolio) {
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = ''; // Kosongkan kontainer jika ada data sebelumnya

    portofolio.forEach(item => {
        const card = document.createElement('div');
        card.className = "bg-white rounded-lg shadow-lg overflow-hidden";
        card.innerHTML = `
            <img src="../assets/images/${item.gambar}" alt="${item.nama_desain}" class="w-full h-48 object-cover cursor-pointer" onclick="openModal('../assets/images/${item.gambar}')">
            <div class="p-4">
                <h2 class="text-xl font-semibold">${item.nama_desain}</h2>
                <p class="text-gray-600 mt-2">${item.deskripsi}</p>
                <p class="text-lg font-bold mt-4">Harga: ${formatRupiah(item.harga)}</p>
                <p class="text-sm text-gray-500 mt-2">Kategori: ${item.kategori}</p>
                <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none" onclick="handleMessage('${item.nama_desain}')">
                    Pesan Desain
                </button>
            </div>
        `;
        cardsContainer.appendChild(card);
    });
}

function handleMessage(desain) {
    alert(`Anda mengirim pesan untuk desain: ${desain}`);
}

// Function to open modal with fullscreen image
function openModal(imageSrc) {
    const modal = document.getElementById("image-modal");
    const modalImage = document.getElementById("modal-image");
    modalImage.src = imageSrc;
    modal.classList.remove("hidden"); // Tampilkan modal
}

// Function to close modal
function closeModal() {
    const modal = document.getElementById("image-modal");
    modal.classList.add("hidden"); // Sembunyikan modal
}

// Menambahkan event listener untuk menutup modal saat mengklik area gelap
document.getElementById("image-modal").addEventListener("click", function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Panggil fungsi fetch setelah halaman dimuat
document.addEventListener("DOMContentLoaded", function() {
    fetchPortofolio();
});
