document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");

    if (!logoutBtn) {
        console.error("Logout button not found.");
        return;
    }

    logoutBtn.addEventListener("click", () => {
        // Ensure the request includes credentials (cookies)
        fetch("https://asia-southeast2-awangga.cloudfunctions.net/idbiz/auth/logout", {
            method: "POST",
            credentials: "include", // Ensures cookies are sent with the request
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                // Remove token from storage
                localStorage.removeItem("login");
                sessionStorage.removeItem("login");

                // Redirect to login page
                window.location.href = "/LoginPage";
            })
            .catch((error) => {
                console.error("Error during logout:", error);
                alert("Terjadi kesalahan saat logout. Silakan coba lagi.");
            });
    });
});
