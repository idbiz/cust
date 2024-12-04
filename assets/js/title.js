async function fetchUser() {
    try {
        const response = await fetch('https://id.biz.id/user/data');
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const user = await response.json();
        document.title = `${user.name} (${user.role})`;
    }

    catch (error) {
        console.error("Failed to fetch", error);
    }
}

fetchUser();