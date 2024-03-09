const currentUrl = window.location.pathname;
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
    if (currentUrl.startsWith("/user") && !currentUrl.endsWith("/settings")) {
        if (link.getAttribute('href') === "/user") {
            link.classList.add('disabledbtn');
        }
    } else if (currentUrl.startsWith("/user") && currentUrl.endsWith("/settings")) {
        if (link.getAttribute('href') === "/user/settings") {
            link.classList.add('disabledbtn');
        }
    } else if (link.getAttribute('href') === currentUrl) {
        link.classList.add('disabledbtn');
    }
});