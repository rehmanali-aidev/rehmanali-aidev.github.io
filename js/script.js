const body = document.body;
const header = document.querySelector('.site-header')

body.addEventListener('click', (e) => {
    const themeIcon = e.target.closest('.toggle-theme');
    if (!themeIcon) return;
    const visualIcon = themeIcon.previousElementSibling;
    const isDark = document.body.classList.toggle('dark-theme');
    if (isDark) {
        themeIcon.classList.remove('fa-toggle-off');
        themeIcon.classList.add('fa-toggle-on');
    } else {
        themeIcon.classList.remove('fa-toggle-on');
        themeIcon.classList.add('fa-toggle-off');
    }
    const upvisual = visualIcon.classList.toggle('fa-moon')
    if (upvisual) {
       visualIcon.classList.remove('fa-sun');
       visualIcon.classList.add('fa-moon');
   } else {
       visualIcon.classList.remove('fa-moon');
       visualIcon.classList.add('fa-sun');
   }
});

const siteNav = document.querySelector('.nav');
const heroTitle = document.querySelector('.hero-title');
if (siteNav && heroTitle) {
    const updateStickyNav = () => {
        siteNav.classList.toggle('is-sticky', heroTitle.getBoundingClientRect().top <= -100);
    };

    window.addEventListener('scroll', updateStickyNav, { passive: true });
}

header.addEventListener('mousemove',(event)=>{
    const box = header.getBoundingClientRect();
     header.style.setProperty('--x', event.clientX-box.left +'px')
    header.style.setProperty('--y', event.clientY -box.top +'px')
    
})
window.addEventListener('mousemove',(event)=>{
    body.style.setProperty('--x', event.clientX+'px')
    body.style.setProperty('--y', event.clientY+'px')
})