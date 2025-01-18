document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");

    logoutBtn.addEventListener("click", () => {
        const token = localStorage.getItem("login") || sessionStorage.getItem("login");

        // Kirim permintaan logout ke server
        fetch("https://asia-southeast2-awangga.cloudfunctions.net/idbiz/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "login": token, // Header yang berisi token
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                // Berhasil logout, hapus token dari storage
                localStorage.removeItem("login");
                sessionStorage.removeItem("login");

                // Arahkan ke halaman login
                window.location.href = "/login";
            })
            .catch((error) => {
                console.error("Error during logout:", error);
                alert("Terjadi kesalahan saat logout. Silakan coba lagi.");
            });
    });
});
