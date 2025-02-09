const namaPemesan = localStorage.getItem("namaPemesan");

async function fetchTransactions() {
    try {
        const response = await fetch("https://asia-southeast2-awangga.cloudfunctions.net/idbiz/data/transaksi");
        const transactions = await response.json();

        // Filter transaksi berdasarkan nama pemesan
        return transactions.filter(tx => tx.nama_pemesan.toLowerCase() === namaPemesan.toLowerCase());
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }
}

function checkRecentTransactions(filteredTransactions) {
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000); // 10 menit

    // Filter transaksi yang terjadi dalam 10 menit terakhir
    const recentTransactions = filteredTransactions.filter(transaction => {
        const orderDate = new Date(transaction.tanggal_pesanan);
        return orderDate > tenMinutesAgo;
    });

    return recentTransactions.length;
}

async function updateNotification() {
    try {
        const filteredTransactions = await fetchTransactions();
        const recentCount = checkRecentTransactions(filteredTransactions);

        const notificationBadge = document.querySelector(".notification-badge");

        if (recentCount > 0) {
            notificationBadge.textContent = recentCount;
            notificationBadge.style.display = "flex"; // Menampilkan notifikasi jika ada transaksi baru
        } else {
            notificationBadge.style.display = "none"; // Sembunyikan jika tidak ada transaksi baru
        }
    } catch (error) {
        console.error("Error updating notification:", error);
    }
}

// Jalankan saat halaman dimuat dan setiap 30 detik
updateNotification();
setInterval(updateNotification, 30000);
