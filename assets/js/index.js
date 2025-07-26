let websiteMode = true;

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

let lastScrollY = window.pageYOffset;
const header = document.getElementById('menu');

window.addEventListener('scroll', () => {
  const currentScrollY = window.pageYOffset;
  
  if (currentScrollY > lastScrollY) {
    header.classList.add('hide-header');
  } else {
    header.classList.remove('hide-header');
  }
  
  lastScrollY = currentScrollY;
});