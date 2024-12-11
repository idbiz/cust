// Fungsi untuk mengambil data portofolio
async function fetchPortofolio() {
    try {
        const response = await fetch("https://asia-southeast2-awangga.cloudfunctions.net/idbiz/portofolio");
        const data = await response.json(); // Mengambil data JSON dari API
        
        if (response.ok) {
            renderPortofolio(data); // Jika berhasil, render data ke dalam kartu
        } else {
            console.error("Gagal memuat data portofolio:", data);
        }
    } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data:", error);
    }
}

// Fungsi untuk merender data portofolio ke dalam elemen kartu
function renderPortofolio(portofolioData) {
    const catalogContainer = document.getElementById("catalogDesain");
    
    // Loop melalui setiap item portofolio dan membuat elemen kartu
    portofolioData.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        // Gambar desain
        const img = document.createElement("img");
        img.classList.add("card-img");
        img.src = `./assets/images/${item.design_image}`; // Pastikan gambar ada di folder assets/images
        img.alt = item.design_title;

        // Body kartu
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        // Judul desain
        const title = document.createElement("h3");
        title.classList.add("card-title");
        title.textContent = item.design_title;

        // Nama seller (harus mengambil data seller dari portofolio jika ada)
        const seller = document.createElement("a");
        seller.classList.add("card-seller");
        seller.href = "#"; // Tambahkan link ke halaman seller jika tersedia
        seller.textContent = "Nama Seller"; // Anda bisa menambahkan data seller di sini jika tersedia

        // Deskripsi desain
        const desc = document.createElement("p");
        desc.classList.add("card-desc");
        desc.textContent = item.design_desc;

        // Tombol Detail
        const detailBtn = document.createElement("button");
        detailBtn.classList.add("card-btn");
        detailBtn.textContent = "Detail";

        // Tombol Pesan
        const pesanBtn = document.createElement("button");
        pesanBtn.textContent = "Pesan";

        // Menambahkan elemen ke dalam kartu
        cardBody.appendChild(title);
        cardBody.appendChild(seller);
        cardBody.appendChild(desc);
        cardBody.appendChild(detailBtn);
        cardBody.appendChild(pesanBtn);

        card.appendChild(img);
        card.appendChild(cardBody);

        // Menambahkan kartu ke dalam container katalog
        catalogContainer.appendChild(card);
    });
}

// Memanggil fungsi untuk mengambil data portofolio saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchPortofolio);
