document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.getElementById("historyTableBody");
    const doneTableBody = document.getElementById("doneHistoryTableBody");
    const namaPemesan = localStorage.getItem("namaPemesan");

    if (!namaPemesan) {
        console.error("Nama pemesan tidak ditemukan di localStorage.");
        return;
    }

    function getToken() {
        const tokenMatch = document.cookie.match(/(^| )login=([^;]+)/);
        return tokenMatch ? tokenMatch[2] : null;
    }

    async function fetchHistory() {
        try {
            const token = getToken();
            if (!token) {
                console.error("No login token found! Redirecting to login...");
                window.location.href = "https://id.biz.id/";
                return;
            }

            const response = await fetch("https://asia-southeast2-awangga.cloudfunctions.net/idbiz/data/transaksi", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "login": token
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch transaction history");
            }

            const transactions = await response.json();
            const filteredTransactions = transactions.filter(tx => 
                tx.nama_pemesan.toLowerCase() === namaPemesan.toLowerCase()
            );

            // Pisahkan transaksi berdasarkan status
            const pendingTransactions = filteredTransactions.filter(tx => tx.status_pesanan.toLowerCase() !== "done");
            const doneTransactions = filteredTransactions.filter(tx => tx.status_pesanan.toLowerCase() === "done");

            renderHistoryTable(tableBody, pendingTransactions);
            renderHistoryTable(doneTableBody, doneTransactions);
        } catch (error) {
            console.error("Error fetching transaction history:", error);
        }
    }

    function renderHistoryTable(targetTable, transactions) {
        targetTable.innerHTML = "";
        
        if (transactions.length === 0) {
            targetTable.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-gray-500 py-4 px-2">Tidak ada transaksi ditemukan.</td>
                </tr>
            `;
            return;
        }

        transactions.forEach(transaction => {
            const formattedDate = new Date(transaction.tanggal_pesanan).toLocaleDateString("id-ID", {
                day: "2-digit", month: "long", year: "numeric"
            });

            const statusClass = getStatusClass(transaction.status_pesanan);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="py-4 px-2">${formattedDate}</td>
                <td class="py-4 px-2">${transaction.nama_desain}</td>
                <td class="py-4 px-2">Rp ${parseInt(transaction.harga).toLocaleString()}</td>
                <td class="py-4 px-2">${transaction.catatan_pesanan}</td>
                <td class="py-4 px-2"><a href="${transaction.bukti_pembayaran}" target="_blank" class="text-blue-500 underline">Lihat Bukti</a></td>
                <td class="py-4 px-2"><span class="${statusClass}">${transaction.status_pesanan}</span></td>
            `;

            targetTable.appendChild(row);
        });
    }

    function getStatusClass(status) {
        switch (status.toLowerCase()) {
            case "pending": return "bg-yellow-500 text-white px-2 py-1 rounded";
            case "done": return "bg-green-500 text-white px-2 py-1 rounded";
            case "return": return "bg-red-500 text-white px-2 py-1 rounded";
            case "in progress": return "bg-blue-500 text-white px-2 py-1 rounded";
            default: return "bg-gray-500 text-white px-2 py-1 rounded";
        }
    }

    fetchHistory();
});
