/* ==========================================================================
   Prosengit Kundu — Shared site behaviour
   --------------------------------------------------------------------------
   ONE script for the whole website. It injects the same header, footer,
   page loader, back-to-top button and scroll progress bar into every page,
   and wires up the identical loading / reveal / hover interactions.

   Pages only need:
     <link rel="stylesheet" href="assets/css/style.css">
     <script src="assets/js/site.js" defer></script>
   ========================================================================== */
(function () {
    'use strict';

    /* ----------------------------------------------------------------------
       Config
       ---------------------------------------------------------------------- */
    var NAV_ITEMS = [
        { label: 'Home',         href: 'index.html' },
        { label: 'About',        href: 'about.html' },
        { label: 'Services',     href: 'services.html' },
        { label: 'Pricing',      href: 'pricing.html' },
        { label: 'Portfolio',    href: 'portfolio.html' },
        { label: 'Blog',         href: 'blog.html' },
        { label: 'Testimonials', href: 'testimonials.html' },
        { label: 'FAQ',          href: 'faq.html' },
        { label: 'Contact',      href: 'contact.html' }
    ];

    /* Pages that are "children" of a main nav item */
    var NAV_ALIASES = {
        'portfolio-details.html': 'portfolio.html',
        'blog-details.html': 'blog.html',
        'thank-you.html': 'contact.html'
    };

    var CONTACT = {
        phone: '+880 1701-059499',
        phoneHref: 'tel:+8801701059499',
        whatsapp: 'https://wa.me/8801701059499',
        email: 'Prosengit95@gmail.com',
        linkedin: 'https://www.linkedin.com/in/prosengitkundu/',
        facebook: 'https://www.facebook.com/Prosengit95',
        location: 'Khulna, Bangladesh'
    };

    var YEAR = new Date().getFullYear();

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ----------------------------------------------------------------------
       Helpers
       ---------------------------------------------------------------------- */
    function currentPage() {
        var path = window.location.pathname.split('/').pop();
        if (!path) return 'index.html';
        return path;
    }

    function activeNavHref() {
        var page = currentPage();
        return NAV_ALIASES[page] || page;
    }

    function el(html) {
        var t = document.createElement('template');
        t.innerHTML = html.trim();
        return t.content.firstElementChild;
    }

    /* ----------------------------------------------------------------------
       1. Page loader (identical on every page)
       ---------------------------------------------------------------------- */
    function buildLoader() {
        if (document.querySelector('.page-loader')) return;
        var loader = el(
            '<div class="page-loader" id="pageLoader" role="status" aria-live="polite" aria-label="Loading page">' +
                '<div class="page-loader__inner">' +
                    '<div class="page-loader__mark">PK</div>' +
                    '<div class="page-loader__name">Prosengit Kundu</div>' +
                    '<div class="page-loader__tag">Digital Marketing Expert</div>' +
                    '<div class="page-loader__bar"><span></span></div>' +
                '</div>' +
            '</div>'
        );
        document.body.insertBefore(loader, document.body.firstChild);
    }

    function hideLoader() {
        var loader = document.getElementById('pageLoader');
        document.body.classList.remove('is-loading');
        document.body.classList.add('is-ready');
        if (!loader) return;
        loader.classList.add('is-hidden');
        window.setTimeout(function () {
            if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
        }, 700);
    }

    /* ----------------------------------------------------------------------
       2. Header
       ---------------------------------------------------------------------- */
    function navMarkup(active, mobile) {
        return NAV_ITEMS.map(function (item) {
            var isActive = item.href === active;
            var cls = mobile
                ? (isActive ? 'is-active' : '')
                : 'nav-link' + (isActive ? ' is-active' : '');
            var aria = isActive ? ' aria-current="page"' : '';
            return '<a href="' + item.href + '" class="' + cls + '"' + aria + '>' + item.label + '</a>';
        }).join('');
    }

    function buildHeader() {
        if (document.querySelector('.site-header')) return;
        var active = activeNavHref();

        var header = el(
            '<header class="site-header" id="siteHeader">' +
                '<div class="site-header__inner">' +
                    '<a href="index.html" class="brand" aria-label="Prosengit Kundu — home">' +
                        '<span class="brand__mark">PK</span>' +
                        '<span>' +
                            '<span class="brand__name">Prosengit Kundu</span>' +
                            '<span class="brand__role">Digital Marketing Expert</span>' +
                        '</span>' +
                    '</a>' +
                    '<nav class="site-nav" aria-label="Main navigation">' + navMarkup(active, false) + '</nav>' +
                    '<div class="header-actions">' +
                        '<button type="button" class="icon-btn" id="themeToggle" aria-label="Toggle dark mode" title="Toggle dark mode">' +
                            '<span id="themeIcon" aria-hidden="true">🌙</span>' +
                        '</button>' +
                        '<a href="contact.html" class="btn btn-primary hidden-sm" id="headerCta">Hire Me</a>' +
                        '<button type="button" class="icon-btn nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">' +
                            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
                                '<path d="M4 7h16M4 12h16M4 17h16"/>' +
                            '</svg>' +
                        '</button>' +
                    '</div>' +
                '</div>' +
                '<div class="mobile-menu" id="mobileMenu">' +
                    '<div class="mobile-menu__inner">' + navMarkup(active, true) +
                        '<a href="' + CONTACT.whatsapp + '" class="btn btn-primary" target="_blank" rel="noopener">Chat on WhatsApp</a>' +
                    '</div>' +
                '</div>' +
            '</header>'
        );

        var progress = el('<div class="scroll-progress" aria-hidden="true"><span id="scrollProgressBar"></span></div>');

        var shell = document.querySelector('.page-shell');
        if (shell) {
            shell.insertBefore(header, shell.firstChild);
            shell.insertBefore(progress, shell.firstChild);
        } else {
            document.body.insertBefore(header, document.body.firstChild);
            document.body.insertBefore(progress, document.body.firstChild);
        }
    }

    function initHeader() {
        var header = document.getElementById('siteHeader');
        var toggle = document.getElementById('navToggle');
        var menu = document.getElementById('mobileMenu');
        var bar = document.getElementById('scrollProgressBar');
        var backToTop = document.getElementById('backToTop');

        if (toggle && menu) {
            toggle.addEventListener('click', function () {
                var open = menu.classList.toggle('is-open');
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
                toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            });
            menu.addEventListener('click', function (e) {
                if (e.target.tagName === 'A') {
                    menu.classList.remove('is-open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        function onScroll() {
            var y = window.scrollY || document.documentElement.scrollTop;

            if (header) header.classList.toggle('is-scrolled', y > 24);

            if (bar) {
                var docH = document.documentElement.scrollHeight - window.innerHeight;
                var pct = docH > 0 ? Math.min(100, (y / docH) * 100) : 0;
                bar.style.width = pct + '%';
            }

            if (backToTop) backToTop.classList.toggle('is-visible', y > 520);
        }

        var ticking = false;
        window.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(function () {
                onScroll();
                ticking = false;
            });
        }, { passive: true });

        onScroll();
    }

    /* ----------------------------------------------------------------------
       3. Footer
       ---------------------------------------------------------------------- */
    function buildFooter() {
        if (document.querySelector('.site-footer')) return;

        var quick = ['Home', 'About', 'Services', 'Pricing', 'Portfolio'].map(function (label) {
            var item = NAV_ITEMS.filter(function (i) { return i.label === label; })[0];
            return '<a href="' + item.href + '">' + item.label + '</a>';
        }).join('');

        var more = '<a href="blog.html">Blog</a>' +
            '<a href="testimonials.html">Testimonials</a>' +
            '<a href="faq.html">FAQ</a>' +
            '<a href="contact.html">Contact</a>' +
            '<a href="disclaimer.html">Disclaimer</a>';

        var footer = el(
            '<footer class="site-footer">' +
                '<div class="site-footer__inner">' +
                    '<div>' +
                        '<a href="index.html" class="footer-brand">' +
                            '<span class="footer-brand__mark">PK</span>' +
                            '<span>' +
                                '<span class="footer-brand__name">Prosengit Kundu</span>' +
                                '<span class="footer-brand__role">Digital Marketing Expert</span>' +
                            '</span>' +
                        '</a>' +
                        '<p class="site-footer__about">Digital Marketing Expert, SEO Specialist and custom web developer based in Khulna, Bangladesh — helping businesses grow with SEO, paid ads, lead generation and hand-coded websites.</p>' +
                        '<div class="social-row">' +
                            '<a href="' + CONTACT.linkedin + '" target="_blank" rel="noopener" aria-label="LinkedIn">' +
                                '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.07-1.9-3.07-1.9 0-2.2 1.46-2.2 2.97V21H9z"/></svg>' +
                            '</a>' +
                            '<a href="' + CONTACT.facebook + '" target="_blank" rel="noopener" aria-label="Facebook">' +
                                '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.54-1.5h1.66V4.6c-.29-.04-1.28-.13-2.43-.13-2.4 0-4.05 1.47-4.05 4.17v2.26H7.5V14h2.72v8z"/></svg>' +
                            '</a>' +
                            '<a href="' + CONTACT.whatsapp + '" target="_blank" rel="noopener" aria-label="WhatsApp">' +
                                '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.3 4.7 4.83-1.27A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 1 1-4.13 15.06l-.3-.18-2.86.75.76-2.79-.19-.31A8.1 8.1 0 0 1 12.04 3.8zm4.66 10.2c-.25-.13-1.47-.72-1.7-.8-.23-.09-.4-.13-.56.12s-.64.8-.79.97c-.14.16-.29.18-.54.06a6.6 6.6 0 0 1-1.95-1.2 7.3 7.3 0 0 1-1.35-1.68c-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.31-.22.25-.84.82-.84 2s.86 2.32.98 2.48c.12.17 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.5.58.19 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.15.2-.56.2-1.05.14-1.15-.06-.1-.22-.16-.47-.28z"/></svg>' +
                            '</a>' +
                        '</div>' +
                    '</div>' +
                    '<div>' +
                        '<h3>Explore</h3>' +
                        '<div class="site-footer__links">' + quick + '</div>' +
                    '</div>' +
                    '<div>' +
                        '<h3>More</h3>' +
                        '<div class="site-footer__links">' + more + '</div>' +
                    '</div>' +
                    '<div>' +
                        '<h3>Get in touch</h3>' +
                        '<div class="site-footer__links">' +
                            '<a href="' + CONTACT.phoneHref + '">' + CONTACT.phone + '</a>' +
                            '<a href="mailto:' + CONTACT.email + '">' + CONTACT.email + '</a>' +
                            '<a href="' + CONTACT.whatsapp + '" target="_blank" rel="noopener">WhatsApp chat</a>' +
                            '<a href="https://www.google.com/maps/search/Khulna,+Bangladesh" target="_blank" rel="noopener">' + CONTACT.location + '</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="site-footer__bottom">' +
                    '<div>© ' + YEAR + ' Prosengit Kundu. All rights reserved.</div>' +
                    '<div class="site-footer__legal">' +
                        '<a href="privacy-policy.html">Privacy Policy</a>' +
                        '<a href="terms.html">Terms</a>' +
                        '<a href="disclaimer.html">Disclaimer</a>' +
                    '</div>' +
                '</div>' +
            '</footer>'
        );

        var shell = document.querySelector('.page-shell');
        (shell || document.body).appendChild(footer);
    }

    /* ----------------------------------------------------------------------
       4. Floating actions
       ---------------------------------------------------------------------- */
    function buildFloatingActions() {
        if (!document.getElementById('backToTop')) {
            var btn = el(
                '<button type="button" class="back-to-top" id="backToTop" aria-label="Back to top">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                        '<path d="M12 19V5M5 12l7-7 7 7"/>' +
                    '</svg>' +
                '</button>'
            );
            btn.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            });
            document.body.appendChild(btn);
        }

        if (!document.querySelector('.floating-contact')) {
            var wa = el(
                '<a class="floating-contact" href="' + CONTACT.whatsapp + '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">' +
                    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.3 4.7 4.83-1.27A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 1 1-4.13 15.06l-.3-.18-2.86.75.76-2.79-.19-.31A8.1 8.1 0 0 1 12.04 3.8zm4.66 10.2c-.25-.13-1.47-.72-1.7-.8-.23-.09-.4-.13-.56.12s-.64.8-.79.97c-.14.16-.29.18-.54.06a6.6 6.6 0 0 1-1.95-1.2 7.3 7.3 0 0 1-1.35-1.68c-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.31-.22.25-.84.82-.84 2s.86 2.32.98 2.48c.12.17 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.5.58.19 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.15.2-.56.2-1.05.14-1.15-.06-.1-.22-.16-.47-.28z"/></svg>' +
                '</a>'
            );
            document.body.appendChild(wa);
        }
    }

    /* ----------------------------------------------------------------------
       5. Dark mode (shared, no flash — see inline snippet in <head>)
       ---------------------------------------------------------------------- */
    function initTheme() {
        var toggle = document.getElementById('themeToggle');
        var icon = document.getElementById('themeIcon');
        var isDark = document.documentElement.classList.contains('dark');
        if (icon) icon.textContent = isDark ? '☀️' : '🌙';
        if (!toggle) return;

        toggle.addEventListener('click', function () {
            var dark = document.documentElement.classList.toggle('dark');
            try { localStorage.setItem('pk-theme', dark ? 'dark' : 'light'); } catch (e) {}
            if (icon) icon.textContent = dark ? '☀️' : '🌙';
        });
    }

    /* ----------------------------------------------------------------------
       6. Reveal on scroll — the SAME entrance animation everywhere
       ---------------------------------------------------------------------- */
    var REVEAL_SELECTOR = [
        '.reveal',
        'section > .max-w-screen-2xl',
        '.service-card', '.portfolio-card', '.pricing-card', '.package-card',
        '.blog-card', '.modern-card', '.t-card', '.u-card'
    ].join(',');

    function markRevealTargets(root) {
        var scope = root || document;
        var nodes = scope.querySelectorAll(REVEAL_SELECTOR);
        Array.prototype.forEach.call(nodes, function (node) {
            if (!node.classList.contains('reveal')) node.classList.add('reveal');
        });
        return nodes;
    }

    var revealObserver = null;

    function observeReveals(root) {
        if (prefersReducedMotion) {
            markRevealTargets(root);
            Array.prototype.forEach.call((root || document).querySelectorAll('.reveal'), function (n) {
                n.classList.add('is-visible');
            });
            return;
        }

        markRevealTargets(root);

        if (!revealObserver) {
            revealObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry, i) {
                    if (!entry.isIntersecting) return;
                    var delay = Math.min(i, 6) * 70;
                    window.setTimeout(function () {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    revealObserver.unobserve(entry.target);
                });
            }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        }

        var nodes = (root || document).querySelectorAll('.reveal:not(.is-visible)');
        Array.prototype.forEach.call(nodes, function (node) {
            // Anything already in view on load reveals immediately (no blank hero).
            var rect = node.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.92) {
                node.classList.add('is-visible');
            } else {
                revealObserver.observe(node);
            }
        });
    }

    // Public so pages that render cards with JS can re-run it
    window.pkReveal = observeReveals;

    /* Re-scan when JS-rendered content is inserted (portfolio/blog grids etc.) */
    function watchDynamicContent() {
        var containers = document.querySelectorAll('[id$="-grid"], #testimonial-grid, #featured-wrap, #caseStudy, #article-content');
        if (!containers.length) return;
        var mo = new MutationObserver(function () {
            observeReveals(document);
        });
        Array.prototype.forEach.call(containers, function (c) {
            mo.observe(c, { childList: true, subtree: false });
        });
    }

    /* ----------------------------------------------------------------------
       7. Counters (stats) — same animation wherever .stat-number appears
       ---------------------------------------------------------------------- */
    function initCounters() {
        var stats = document.querySelectorAll('.stat-number[data-target]');
        if (!stats.length) return;

        function run(element) {
            var target = parseInt(element.getAttribute('data-target'), 10) || 0;
            if (prefersReducedMotion) {
                element.textContent = target.toLocaleString();
                return;
            }
            var start = null;
            var duration = 1500;
            function step(ts) {
                if (!start) start = ts;
                var progress = Math.min((ts - start) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                element.textContent = Math.round(target * eased).toLocaleString();
                if (progress < 1) window.requestAnimationFrame(step);
            }
            window.requestAnimationFrame(step);
        }

        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                run(entry.target);
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.4 });

        Array.prototype.forEach.call(stats, function (s) { obs.observe(s); });
    }

    /* ----------------------------------------------------------------------
       8. Typing animation (home hero)
       ---------------------------------------------------------------------- */
    function initTyping() {
        var target = document.getElementById('typing-text');
        if (!target) return;

        var titles = [
            'Digital Marketing Expert',
            'SEO Specialist',
            'Web Developer',
            'Professional Trainer',
            'Graphic Designer'
        ];

        if (prefersReducedMotion) {
            target.textContent = titles[0];
            return;
        }

        var i = 0, c = 0, deleting = false;

        function tick() {
            var word = titles[i];
            target.innerHTML = word.substring(0, c) + '<span class="typing-cursor"></span>';

            if (!deleting) {
                c++;
                if (c > word.length) {
                    deleting = true;
                    return window.setTimeout(tick, 1500);
                }
                return window.setTimeout(tick, 80);
            }

            c--;
            if (c === 0) {
                deleting = false;
                i = (i + 1) % titles.length;
                return window.setTimeout(tick, 320);
            }
            window.setTimeout(tick, 35);
        }

        window.setTimeout(tick, 500);
    }

    /* ----------------------------------------------------------------------
       9. Smooth in-page anchors + soft page-exit transition
       ---------------------------------------------------------------------- */
    function initLinks() {
        document.addEventListener('click', function (e) {
            var link = e.target.closest ? e.target.closest('a') : null;
            if (!link) return;

            var href = link.getAttribute('href');
            if (!href) return;

            // In-page anchors
            if (href.charAt(0) === '#' && href.length > 1) {
                var node = document.querySelector(href);
                if (node) {
                    e.preventDefault();
                    node.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
                    history.pushState(null, '', href);
                }
                return;
            }

            // Internal page navigation → fade out, then go (same feel everywhere)
            if (prefersReducedMotion) return;
            if (link.target === '_blank' || link.hasAttribute('download')) return;
            if (/^(https?:)?\/\//i.test(href) && href.indexOf(window.location.host) === -1) return;
            if (/^(mailto:|tel:|javascript:)/i.test(href)) return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            if (href.indexOf('.html') === -1 && href !== '/') return;

            e.preventDefault();
            document.body.classList.add('is-leaving');
            window.setTimeout(function () { window.location.href = href; }, 240);
        });

        // Restore view when navigating back via bfcache
        window.addEventListener('pageshow', function (event) {
            if (event.persisted) {
                document.body.classList.remove('is-leaving');
                hideLoader();
            }
        });
    }

    /* ----------------------------------------------------------------------
       10. FAQ accordions — one open at a time, consistent icon rotation
       ---------------------------------------------------------------------- */
    function initAccordions() {
        var items = document.querySelectorAll('details.faq-item');
        if (!items.length) return;
        Array.prototype.forEach.call(items, function (item) {
            item.addEventListener('toggle', function () {
                if (!item.open) return;
                Array.prototype.forEach.call(items, function (other) {
                    if (other !== item && other.open && other.parentNode === item.parentNode) {
                        other.open = false;
                    }
                });
            });
        });
    }

    /* ----------------------------------------------------------------------
       11. Boot
       ---------------------------------------------------------------------- */
    function boot() {
        document.body.classList.add('site-body', 'is-loading');

        buildLoader();
        buildHeader();
        buildFooter();
        buildFloatingActions();

        initHeader();
        initTheme();
        initLinks();
        initAccordions();
        initTyping();
        initCounters();
        observeReveals(document);
        watchDynamicContent();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    // The loader always disappears — even if an image/CDN is slow.
    var loaderHidden = false;
    function finish() {
        if (loaderHidden) return;
        loaderHidden = true;
        hideLoader();
        observeReveals(document);
    }

    window.addEventListener('load', function () {
        window.setTimeout(finish, prefersReducedMotion ? 0 : 450);
    });

    // Hard safety net: never let the loader trap the page.
    window.setTimeout(finish, 2600);
})();

/* ==========================================================================
   Shared page helpers used by inline page scripts
   ========================================================================== */
function selectPlan(plan) {
    window.location.href = 'contact.html?plan=' + encodeURIComponent(plan);
}

function submitContactForm(e) {
    e.preventDefault();
    var nameField = document.getElementById('name');
    var name = nameField && nameField.value ? nameField.value : 'Friend';
    window.location.href = 'thank-you.html?name=' + encodeURIComponent(name);
}
