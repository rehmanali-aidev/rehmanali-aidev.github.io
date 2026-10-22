const body = document.body;
const themeBtn = document.getElementById('theme-btn');

function applyTheme(isDark) {
    if (isDark) {
        body.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
    }
}

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'dark') {
    applyTheme(true);
} else if (savedTheme === 'light') {
    applyTheme(false);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme(true);
}

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const currentlyDark = body.classList.contains('dark-theme');
        const nextDark = !currentlyDark;
        applyTheme(nextDark);
        localStorage.setItem('portfolio-theme', nextDark ? 'dark' : 'light');
    });
}

const copyButton = document.querySelector('.copy-email');
const copyNotice = document.querySelector('.copy-notice');
let noticeTimer;

function showNotice(message) {
    if (!copyNotice) return;
    copyNotice.textContent = message;
    copyNotice.classList.add('is-shown');
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => copyNotice.classList.remove('is-shown'), 2400);
}

if (copyButton) {
    copyButton.addEventListener('click', async () => {
        const emailEl = document.querySelector('.contact-email');
        const email = emailEl ? emailEl.textContent.trim() : 'rehmanali.aidev@gmail.com';
        try {
            await navigator.clipboard.writeText(email);
            showNotice('Email copied to clipboard!');
        } catch (error) {
            showNotice('Select email to copy: ' + email);
        }
    });
}

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

    if (!list) return;

    try {
        const response = await fetch('https://api.github.com/users/rehmanali-aidev/repos?sort=pushed&per_page=100');
        if (!response.ok) {
            throw new Error('GitHub API response not OK');
        }
        const repos = await response.json();
        console.log(repos)
        if (count) count.textContent = repos.length;
        if (lastPush && repos.length > 0) lastPush.textContent = timeAgo(repos[0].pushed_at);

        if (since && repos.length > 0) {
            const firstDate = repos.map((repo) => new Date(repo.created_at)).sort((a, b) => a - b)[0];
            since.textContent = firstDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }

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

            meta.textContent = (repo.language ? repo.language + ' • ' : '') + timeAgo(repo.pushed_at);
            item.appendChild(info);
            item.appendChild(meta);
            list.appendChild(item);
        });
    } catch (error) {
        if (lastPush) lastPush.textContent = 'Active this month';
        if (since) since.textContent = 'Early 2026';
        list.innerHTML = '<li><div><a href="https://github.com/rehmanali-aidev" target="_blank" rel="noopener noreferrer">rehmanali-aidev repositories</a><p>Explore all active projects, commits, and code directly on GitHub.</p></div><span>Updated</span></li>';
    }
}

loadGithub();
