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

header.addEventListener('mousemove',(event)=>{
    const box = header.getBoundingClientRect();
     header.style.setProperty('--x', event.clientX-box.left +'px')
    header.style.setProperty('--y', event.clientY -box.top +'px')

})
window.addEventListener('mousemove',(event)=>{
    body.style.setProperty('--x', event.clientX+'px')
    body.style.setProperty('--y', event.clientY+'px')
})

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const loaderCount = document.querySelector('.loader-count');
const loaderPath = document.querySelector('.loader-logo path');
let loaderValue = 0;

if (reduceMotion) {
    body.classList.add('ready');
} else {
    const loaderTimer = setInterval(() => {
        loaderValue = Math.min(100, loaderValue + 1 + Math.floor(Math.random() * 4));
        loaderCount.textContent = loaderValue + '%';
        loaderPath.style.strokeDashoffset = 1 - loaderValue / 100;
        if (loaderValue === 100) {
            clearInterval(loaderTimer);
            setTimeout(() => body.classList.add('ready'), 350);
        }
    }, 30);
}

let letterNumber = 0;
document.querySelectorAll('.hero-title .word').forEach((word) => {
    const text = word.textContent;
    word.textContent = '';
    text.split('').forEach((char) => {
        const letter = document.createElement('i');
        letter.textContent = char;
        letter.setAttribute('aria-hidden', 'true');
        letter.style.setProperty('--i', letterNumber);
        word.appendChild(letter);
        letterNumber++;
    });
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const copyButton = document.querySelector('.copy-email');
const copyNotice = document.querySelector('.copy-notice');
let noticeTimer;

function showNotice(message) {
    copyNotice.textContent = message;
    copyNotice.classList.add('is-shown');
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => copyNotice.classList.remove('is-shown'), 2200);
}

copyButton.addEventListener('click', async () => {
    const email = document.querySelector('.contact-email').textContent;
    try {
        await navigator.clipboard.writeText(email);
        showNotice('Email copied to clipboard');
    } catch (error) {
        showNotice('Could not copy. Please select the email instead.');
    }
});

function timeAgo(dateString) {
    const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
    const units = [
        ['year', 31536000],
        ['month', 2592000],
        ['day', 86400],
        ['hour', 3600],
        ['minute', 60]
    ];
    for (const [name, size] of units) {
        const amount = Math.floor(seconds / size);
        if (amount >= 1) {
            return amount + ' ' + name + (amount > 1 ? 's' : '') + ' ago';
        }
    }
    return 'just now';
}

async function loadGithub() {
    const count = document.querySelector('.gh-count');
    const lastPush = document.querySelector('.gh-last-push');
    const since = document.querySelector('.gh-since');
    const list = document.querySelector('.gh-list');
    try {
        const response = await fetch('https://api.github.com/users/rehmanali-aidev/repos?sort=pushed&per_page=100');
        if (!response.ok) {
            throw new Error('GitHub request failed');
        }
        const repos = await response.json();
        count.textContent = repos.length;
        lastPush.textContent = timeAgo(repos[0].pushed_at);
        const firstDate = repos.map((repo) => new Date(repo.created_at)).sort((a, b) => a - b)[0];
        since.textContent = firstDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        list.innerHTML = '';
        repos.slice(0, 6).forEach((repo) => {
            const item = document.createElement('li');
            const info = document.createElement('div');
            const link = document.createElement('a');
            const meta = document.createElement('span');
            link.href = repo.html_url;
            link.textContent = repo.name;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            info.appendChild(link);
            if (repo.description) {
                const description = document.createElement('p');
                description.textContent = repo.description;
                info.appendChild(description);
            }
            meta.textContent = (repo.language ? repo.language + ' - ' : '') + timeAgo(repo.pushed_at);
            item.appendChild(info);
            item.appendChild(meta);
            list.appendChild(item);
        });
    } catch (error) {
        lastPush.textContent = 'Unavailable';
        since.textContent = 'Unavailable';
        list.innerHTML = '<li>Could not load repositories right now. You can see them on my GitHub profile.</li>';
    }
}

loadGithub();
