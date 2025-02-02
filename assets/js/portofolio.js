document.addEventListener("DOMContentLoaded", async function () {
    const cardsContainer = document.getElementById("cards-container");
    const imageModal = document.getElementById("image-modal");
    const modalImage = document.getElementById("modal-image");

    async function fetchPortfolios() {
        try {
            // Ambil token dari cookie
            const tokenMatch = document.cookie.match(/(^| )login=([^;]+)/);
            const token = tokenMatch ? tokenMatch[2] : null;

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
                <button class="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-700 transition duration-200" onclick="orderNow('${portfolio.nama_desain}', '${portfolio.harga}')">Pesan</button>
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

    window.orderNow = function (namaDesain, harga) {
        Swal.fire({
            title: "Pesan Desain",
            text: `Anda ingin memesan desain "${namaDesain}" seharga Rp ${parseInt(harga).toLocaleString()}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Pesan!",
            cancelButtonText: "Batal"
        }).then((result) => {
            if (result.isConfirmed) {
                // Simulasi pemesanan, bisa diarahkan ke halaman checkout atau API pemesanan
                Swal.fire("Pesanan Berhasil!", "Desain telah dipesan.", "success");
            }
        });
    };

    fetchPortfolios();
});
