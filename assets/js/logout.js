document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");

    logoutBtn.addEventListener("click", () => {
        // Hapus token atau data login dari localStorage/sessionStorage (jika digunakan)
        localStorage.removeItem("login");  // Sesuaikan dengan nama token yang Anda simpan

        // Atau Anda bisa menggunakan sessionStorage:
        sessionStorage.removeItem("login");

        // Redirect ke halaman login atau beranda
        window.location.href = "/"; // Ganti dengan halaman login yang sesuai
    });
});
