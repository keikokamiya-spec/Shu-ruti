'use strict';

/* ========================
   Header — scroll class
======================== */
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ========================
   Mobile Menu Toggle
======================== */
const toggle = document.getElementById('mobile-menu-toggle');
const navMenu = document.getElementById('nav-menu');

toggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
});

navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
    });
});

/* ========================
   Smooth Scroll for anchor links
======================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 72; // header height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ========================
   Reveal on Scroll
======================== */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ========================
   Gallery Slider
======================== */
const track = document.getElementById('gallery-track');
const dotsContainer = document.getElementById('gallery-dots');

if (track) {
    const slides = track.querySelectorAll('.gallery-slide');
    const prevBtn = document.querySelector('.gallery-btn.prev');
    const nextBtn = document.querySelector('.gallery-btn.next');
    const total = slides.length;
    let current = 0;
    let autoPlay;

    // Build dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `スライド ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    function updateDots() {
        dotsContainer.querySelectorAll('.gallery-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
        });
    }

    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        updateDots();
    }

    prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoPlay(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoPlay(); });

    function startAutoPlay() {
        autoPlay = setInterval(() => goTo(current + 1), 5000);
    }
    function resetAutoPlay() {
        clearInterval(autoPlay);
        startAutoPlay();
    }
    startAutoPlay();

    // Pause on hover
    const wrap = track.closest('.gallery-wrap');
    wrap.addEventListener('mouseenter', () => clearInterval(autoPlay));
    wrap.addEventListener('mouseleave', startAutoPlay);

    // Touch swipe
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { goTo(current + (diff > 0 ? 1 : -1)); resetAutoPlay(); }
    }, { passive: true });
}
