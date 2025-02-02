document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");

    if (!logoutBtn) {
        console.error("Logout button not found.");
        return;
    }

    logoutBtn.addEventListener("click", () => {
        // Retrieve the token from cookies
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('login='))
            ?.split('=')[1];

        // If token is found in cookies, add it to headers
        const headers = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["login"] = token;
        }

        // Send logout request to backend
        fetch("https://asia-southeast2-awangga.cloudfunctions.net/idbiz/auth/logout", {
            method: "POST",
            credentials: "include", // Ensures cookies are sent with the request
            headers: headers,
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

                // Clear login cookie
                document.cookie = "login=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; HttpOnly;";

                // Redirect to login page
                window.location.href = "/LoginPage";
            })
            .catch((error) => {
                console.error("Error during logout:", error);
                alert("Terjadi kesalahan saat logout. Silakan coba lagi.");
            });
    });
});
