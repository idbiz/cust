<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", async function () {
    const cardsContainer = document.getElementById("cards-container");
    const imageModal = document.getElementById("image-modal");
=======
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
        redirect("/LoginPage");
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
            <img src="/cust/assets/images/${item.gambar}" alt="${item.nama_desain}" class="w-full h-48 object-cover cursor-pointer" onclick="openModal('/cust/assets/images/${item.gambar}')">
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
>>>>>>> 795c027d87d4156fc4ce8044b6b405e95a47242b
    const modalImage = document.getElementById("modal-image");
    const orderModal = document.getElementById("order-modal");
    const closeModalBtn = document.getElementById("close-modal");
    const orderForm = document.getElementById("order-form");
    const desainInput = document.getElementById("desain_id");
    const namaDesainInput = document.getElementById("nama_desain");
    const hargaInput = document.getElementById("harga");
    const catatanInput = document.getElementById("catatan_pesanan");
    const buktiPembayaranInput = document.getElementById("bukti_pembayaran");

    function getToken() {
        const tokenMatch = document.cookie.match(/(^| )login=([^;]+)/);
        return tokenMatch ? tokenMatch[2] : null;
    }

    async function getUserIdByName(namaPemesan) {
        const token = getToken();
        if (!token) return null;

        try {
            const response = await fetch("https://asia-southeast2-awangga.cloudfunctions.net/idbiz/auth/users/all", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "login": token
                }
            });

            if (!response.ok) throw new Error("Failed to fetch users list");

            const usersData = await response.json();
            const users = usersData.user || [];

            // Cari user berdasarkan nama
            const matchedUser = users.find(user => user.name.toLowerCase() === namaPemesan.toLowerCase());

            return matchedUser ? matchedUser._id : null;

        } catch (error) {
            console.error("Error fetching user ID by name:", error);
            return null;
        }
    }

    async function fetchPortfolios() {
        try {
            const token = getToken();
            if (!token) {
                console.error("No login token found! Redirecting to login...");
                window.location.href = "https://id.biz.id/";
                return;
            }

            const response = await fetch("https://asia-southeast2-awangga.cloudfunctions.net/idbiz/portofolio", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "login": token
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch portfolios");
            }

            const portfolios = await response.json();
            renderPortfolioCards(portfolios);
        } catch (error) {
            console.error("Error fetching portfolio data:", error);
        }
    }

    function renderPortfolioCards(portfolios) {
        cardsContainer.innerHTML = "";
        portfolios.forEach(portfolio => {
            const card = document.createElement("div");
            card.className = "bg-white shadow-md rounded-lg p-4 flex flex-col cursor-pointer";

            card.innerHTML = `
                <img src="/assets/images/${portfolio.gambar}" alt="${portfolio.nama_desain}" class="w-full h-48 object-cover rounded-lg mb-4" onclick="openModal('/assets/images/${portfolio.gambar}')">
                <h3 class="text-lg font-semibold">${portfolio.nama_desain}</h3>
                <p class="text-gray-600 text-sm">${portfolio.deskripsi}</p>
                <p class="text-blue-500 font-bold mt-2">Rp ${parseInt(portfolio.harga).toLocaleString()}</p>
                <button class="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-700 transition duration-200" onclick="openOrderModal('${portfolio._id}')">Pesan</button>
            `;

            cardsContainer.appendChild(card);
        });
    }

    window.openModal = function (imageUrl) {
        modalImage.src = imageUrl;
        imageModal.classList.remove("hidden");
    };

    window.closeModal = function () {
        imageModal.classList.add("hidden");
    };

    window.openOrderModal = async function (desainId) {
        try {
            const token = getToken();
            if (!token) {
                Swal.fire("Unauthorized", "Please log in first.", "error");
                return;
            }
    
            const namaPemesan = localStorage.getItem("namaPemesan");
            if (!namaPemesan) {
                Swal.fire("Error", "Nama pemesan tidak ditemukan di localStorage.", "error");
                return;
            }
    
            const userId = await getUserIdByName(namaPemesan);
            if (!userId) {
                Swal.fire("Error", "User ID tidak ditemukan untuk nama pemesan ini.", "error");
                return;
            }
    
            const response = await fetch(`https://asia-southeast2-awangga.cloudfunctions.net/idbiz/portofolio/?id=${desainId}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "login": token
                }
            });
    
            if (!response.ok) {
                throw new Error("Failed to fetch portfolio details");
            }
    
            const desain = await response.json();
    
            document.getElementById("desain_id").value = desainId;
            document.getElementById("nama_desain").value = desain.nama_desain;
            document.getElementById("harga").value = desain.harga;
            document.getElementById("nama_pemesan").value = namaPemesan;
    
            // 🔥 Set Nomor Rekening Tujuan
            const nomorRekening = "123-456-7890 (Bank XYZ)"; // Gantilah dengan API jika tersedia
            document.getElementById("nomor_rekening").innerText = nomorRekening;
    
            orderModal.setAttribute("data-user-id", userId);
            orderModal.setAttribute("data-nama-pemesan", namaPemesan);
            orderModal.classList.remove("hidden");
    
        } catch (error) {
            console.error("Error fetching portfolio details:", error);
            Swal.fire("Error", "Failed to load design details.", "error");
        }
    };
    
    closeModalBtn.addEventListener("click", function () {
        orderModal.classList.add("hidden");
    });

    orderForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const token = getToken();
        if (!token) {
            Swal.fire("Unauthorized", "Please log in first.", "error");
            return;
        }

        const userId = orderModal.getAttribute("data-user-id");
        const namaPemesan = orderModal.getAttribute("data-nama-pemesan");

        if (!userId || !namaPemesan) {
            Swal.fire("Error", "User ID or Nama Pemesan is missing.", "error");
            return;
        }

        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("nama_pemesan", namaPemesan);
        formData.append("desain_id", desainInput.value);
        formData.append("nama_desain", namaDesainInput.value);
        formData.append("harga", hargaInput.value);
        formData.append("status_pesanan", "Pending");
        formData.append("catatan_pesanan", catatanInput.value);
        formData.append("bukti_pembayaran", buktiPembayaranInput.files[0]);

        try {
            const response = await fetch("https://asia-southeast2-awangga.cloudfunctions.net/idbiz/insert/pembayaran", {
                method: "POST",
                headers: {
                    "login": token
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error("Failed to submit transaction");
            }

            Swal.fire("Success", "Transaction submitted successfully!", "success").then(() => {
                orderModal.classList.add("hidden");
            });

        } catch (error) {
            console.error("Error submitting transaction:", error);
            Swal.fire("Error", "Failed to submit transaction.", "error");
        }
    });

    fetchPortfolios();
});
