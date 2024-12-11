document.addEventListener("DOMContentLoaded", () => {
    const burgerBtn = document.querySelector(".burger-btn");
    const navLinks = document.querySelector(".nav-links");

    burgerBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        burgerBtn.classList.toggle("active");
    });
});
