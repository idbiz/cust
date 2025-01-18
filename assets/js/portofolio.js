document.addEventListener("DOMContentLoaded", function() {
    fetchPortofolio();
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

async function fetchPortofolio() {
    const token = getCookie("login");
    if (!token) {
        redirect("/login");
        return;
    }

    const endpoint = "https://asia-southeast2-awangga.cloudfunctions.net/idbiz/portofolio";
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
    cardsContainer.innerHTML = '';
    portofolio.forEach(item => {
        const card = document.createElement('div');
        card.className = "bg-white rounded-lg shadow-lg overflow-hidden";
        card.innerHTML = `
            <img src="./cust/assets/images/${item.gambar}" alt="${item.nama_desain}" class="w-full h-48 object-cover cursor-pointer" onclick="openModal('./cust/assets/images/${item.gambar}')">
            <div class="p-4">
                <h2 class="text-xl font-semibold">${item.nama_desain}</h2>
                <p class="text-gray-600 mt-2">${item.deskripsi}</p>
                <p class="text-lg font-bold mt-4">Harga: ${formatRupiah(item.harga)}</p>
                <p class="text-sm text-gray-500 mt-2">Kategori: ${item.kategori}</p>
                <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none">
                    Pesan Desain
                </button>
            </div>
        `;
        const button = card.querySelector('button');
        button.addEventListener('click', function() {
            handleOrder(item);
        });
        cardsContainer.appendChild(card);
    });
}

function openModal(imageSrc) {
    const modal = document.getElementById("image-modal");
    const modalImage = document.getElementById("modal-image");
    modalImage.src = imageSrc;
    modal.classList.remove("hidden");
}

function closeModal() {
    const modal = document.getElementById("image-modal");
    modal.classList.add("hidden");
}

document.getElementById("image-modal").addEventListener("click", function(e) {
    if (e.target === this) {
        closeModal();
    }
});

function handleOrder(item) {
    const name = localStorage.getItem("namaPemesan") || "";
    showOrderForm(item, name);
}

function showOrderForm(item, name) {
    document.getElementById('namaPemesan').value = name || ''; 
    document.getElementById('catatan').value = ''; 
    document.getElementById('pembayaran').value = 'Transfer'; 

    window.currentOrder = {
        _id: item._id,
        namaDesain: item.nama_desain,
        deskripsi: item.deskripsi,
        gambar: item.gambar,
        kategori: item.kategori,
        harga: item.harga
    };

    const orderModal = document.getElementById('order-modal');
    orderModal.classList.remove('hidden');
}

function closeOrderModal() {
    const orderModal = document.getElementById('order-modal');
    orderModal.classList.add('hidden');
}

document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const namaPemesan = document.getElementById('namaPemesan').value;
    const catatan = document.getElementById('catatan').value;
    const pembayaran = document.getElementById('pembayaran').value;

    if (!namaPemesan) {
        alert("Nama Pemesan harus diisi.");
        return;
    }

    const pesanan = {
        nama_pemesan: namaPemesan,
        daftar_desain: [
            {
                _id: window.currentOrder._id,
                nama_desain: window.currentOrder.namaDesain,
                deskripsi: window.currentOrder.deskripsi,
                gambar: window.currentOrder.gambar,
                kategori: window.currentOrder.kategori,
                harga: window.currentOrder.harga
            }
        ],
        tanggal_pesanan: new Date().toISOString(),
        status_pesanan: "Belum dilayani",
        pembayaran: pembayaran,
        catatan_pesanan: catatan,
        total_harga: window.currentOrder.harga
    };

    fetch('https://asia-southeast2-awangga.cloudfunctions.net/idbiz/insert/pesanan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'login': `${getCookie("login")}`
        },
        body: JSON.stringify(pesanan)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert("Pesanan berhasil dibuat!");
            closeOrderModal();
        } else {
            alert(`Terjadi kesalahan: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Terjadi kesalahan. Silakan coba lagi.");
    });
});
