// Main JavaScript - Prosengit Kundu Premium Portfolio

// Loading Screen
window.onload = function() {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.transition = 'opacity 0.5s ease';
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1200);
    }
    
    // Initialize all features
    initScrollAnimations();
    initStatsCounter();
    initTypingAnimation();
    initDarkMode();
    initNavbar();
    initPortfolioFilters();
    initBackToTop();
    
    // Render dynamic content
    if (document.getElementById('portfolio-grid') && window.location.pathname.includes('index')) {
        renderPortfolioOnHome();
    }
    
    if (document.getElementById('blog-grid') && window.location.pathname.includes('index')) {
        renderBlogOnHome();
    }
};

// Dark Mode Toggle
function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;
    
    const icon = document.getElementById('darkIcon');
    
    if (localStorage.getItem('darkMode') === 'true' || 
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        if (icon) icon.textContent = '☀️';
    }
    
    toggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('darkMode', isDark);
        if (icon) icon.textContent = isDark ? '☀️' : '🌙';
    });
}

// Navbar Scroll Effect
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    });
}

// Typing Animation
function initTypingAnimation() {
    const typingEl = document.getElementById('typing-text');
    if (!typingEl) return;
    
    const titles = [
        "Digital Marketing Expert",
        "Professional Trainer",
        "Graphic Designer",
        "SEO Specialist",
        "Freelancer"
    ];
    
    let index = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const current = titles[index];
        
        if (!isDeleting) {
            typingEl.innerHTML = current.substring(0, charIndex + 1) + '<span class="typing-cursor"></span>';
            charIndex++;
            
            if (charIndex === current.length) {
                isDeleting = true;
                setTimeout(type, 1600);
            } else {
                setTimeout(type, 90);
            }
        } else {
            typingEl.innerHTML = current.substring(0, charIndex - 1) + '<span class="typing-cursor"></span>';
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                index = (index + 1) % titles.length;
                setTimeout(type, 400);
            } else {
                setTimeout(type, 40);
            }
        }
    }
    
    setTimeout(type, 700);
}

// Stats Counter Animation
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stats.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateCounter(stat, target);
                });
                observer.disconnect();
            }
        });
    });
    
    const statsSection = document.querySelector('#home');
    if (statsSection) observer.observe(statsSection);
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target > 100 ? Math.ceil(target / 70) : 1;
    const duration = 1600;
    const stepTime = Math.floor(duration / (target / increment));
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = current.toLocaleString();
        }
    }, stepTime);
}

// Scroll Reveal Animations
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in, .service-card, .portfolio-card, .pricing-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible', 'fade-in');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
}

// Portfolio on Home
function renderPortfolioOnHome() {
    const container = document.getElementById('portfolio-grid');
    if (!container) return;
    
    const projects = [
        {cat: 'seo', title: 'Local SEO Domination', client: 'GreenLeaf Agro', result: '340% traffic'},
        {cat: 'ads', title: 'Meta Ads Lead Campaign', client: 'TechNova Ltd', result: '1,850 leads'},
        {cat: 'design', title: 'Brand Identity Design', client: 'UrbanNest', result: '+65% recognition'}
    ];
    
    container.innerHTML = projects.map(p => `
        <div class="portfolio-card bg-white dark:bg-gray-800 p-7 rounded-3xl border">
            <div class="text-xs font-semibold text-[#0A66C2]">${p.cat.toUpperCase()}</div>
            <div class="font-bold mt-2">${p.title}</div>
            <div class="text-sm mt-1">${p.client}</div>
            <div class="mt-7 text-sm font-medium">${p.result}</div>
        </div>
    `).join('');
}

// Blog on Home
function renderBlogOnHome() {
    const container = document.getElementById('blog-grid');
    if (!container) return;
    
    const blogs = [
        {title: "7 SEO Mistakes Most Bangladeshi Businesses Make", cat: "SEO"},
        {title: "How I Generated 1,850 Leads Using Meta Ads", cat: "Ads"},
        {title: "The Complete Guide to YouTube SEO in 2025", cat: "SEO"}
    ];
    
    container.innerHTML = blogs.map(b => `
        <div class="blog-card bg-white dark:bg-gray-800 p-7 rounded-3xl border">
            <div class="text-xs font-semibold text-[#16A34A]">${b.cat}</div>
            <div class="font-bold mt-3">${b.title}</div>
            <a href="blog.html" class="block mt-4 text-sm text-[#0A66C2]">Read more →</a>
        </div>
    `).join('');
}

// Portfolio Filter
function initPortfolioFilters() {
    // Handled inline in portfolio.html
}

// Back to Top Button
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            btn.style.display = 'flex';
        } else {
            btn.style.display = 'none';
        }
    });
}

// Contact Form Handler
function submitContactForm(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    window.location.href = `thank-you.html?name=${encodeURIComponent(name)}`;
}

// Download CV
function downloadCV() {
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'Prosengit_Kundu_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show confirmation
    const originalText = event.target.innerHTML;
    const btn = event.target;
    btn.innerHTML = '✓ Downloaded!';
    setTimeout(() => {
        if (btn) btn.innerHTML = originalText || 'Download CV';
    }, 1800);
}

// Plan Selection
function selectPlan(plan) {
    window.location.href = `contact.html?plan=${encodeURIComponent(plan)}`;
}