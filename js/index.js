document.querySelectorAll('#menu a').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
        event.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 50,
                behavior: "smooth"
            });
        }
    });
});

document.documentElement.style.setProperty('--background-color', '#fafafa');
function switchDarkLightMode() {
    let icon = document.querySelector("#switch-container img");

    icon.onclick = () => {
        let darkColor = "#111216";
        let darkTextColor = "#999";
        let darkTextTitleColor = "#eee";
        let darkTextHoverColor = "#ddd";
        let darkAccentColor = "#222";
        icon.onmouseover = () => {
            icon.setAttribute("src", "images/moon-full.svg");
        }
        icon.onmouseout = () => {
            icon.setAttribute("src", "images/moon.svg");
        }
        let color = getComputedStyle(document.documentElement).getPropertyValue("--background-color");
        if (color == "#fafafa") {
            icon.setAttribute("src", "images/sun.svg");
            document.documentElement.style.setProperty('--background-color', darkColor);
            document.documentElement.style.setProperty('--text-color', darkTextColor);
            document.documentElement.style.setProperty('--text-title-color', darkTextTitleColor);
            document.documentElement.style.setProperty('--text-hover-color', darkTextHoverColor);
            document.documentElement.style.setProperty('--light-accent-color', darkAccentColor);
            icon.onmouseover = () => {
                icon.setAttribute("src", "images/sun-filled.svg");
            }
            icon.onmouseout = () => {
                icon.setAttribute("src", "images/sun.svg");
            }

        } else {
            icon.setAttribute("src", "images/moon.svg");
            document.documentElement.style.setProperty('--background-color', '#fafafa');
            document.documentElement.style.setProperty('--text-color', '#111');
            document.documentElement.style.setProperty('--text-hover-color', "#000");
            document.documentElement.style.setProperty('--text-title-color', "#111");
            document.documentElement.style.setProperty('--light-accent-color', "#ccc");

            icon.onmouseover = () => {
                console.log("James");
                icon.setAttribute("src", "images/moon-full.svg");
            }
            icon.onmouseout = () => {
                icon.setAttribute("src", "images/moon.svg");
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible"); // Animasyonu tetikle
                    observer.unobserve(entry.target); // Tekrar animasyon olmasın
                }
            });
        },
        { threshold: 0.2 } // %20'si görünür olunca animasyon başlasın
    );

    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

        if (index % 2 === 0) {
            section.classList.add("fade-in-left"); // Çift index'ler soldan gelir
        } else {
            section.classList.add("fade-in-right"); // Tek index'ler sağdan gelir
        }

        if (isVisible) {
            // Sayfa yüklendiğinde ekranda görünen bölümler animasyonla gelsin
            section.classList.add("visible");
        } else {
            observer.observe(section);
        }
    });
});


  
switchDarkLightMode();
displaySection("about-me", "about-me-section");
displaySection("skills", "skills-section");
displaySection("projects", "projects-section");
displaySection("links", "links-section");