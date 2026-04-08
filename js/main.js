'use strict';

/* ========================
   Header — scroll class
======================== */
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ========================
   Mobile Menu Toggle
======================== */
const toggle = document.getElementById('mobile-menu-toggle');
const navMenu = document.getElementById('nav-menu');

toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navMenu.classList.toggle('open');
});

// Close menu on nav link click
navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        toggle.classList.remove('active');
        navMenu.classList.remove('open');
    });
});

/* ========================
   Reveal on Scroll
======================== */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ========================
   Gallery Slider
======================== */
const track = document.querySelector('.gallery-track');
const slides = document.querySelectorAll('.gallery-slide');
const prevBtn = document.querySelector('.gallery-btn.prev');
const nextBtn = document.querySelector('.gallery-btn.next');

if (track && slides.length > 0) {
    let current = 0;
    const total = slides.length;

    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Auto-advance every 5 seconds
    let autoPlay = setInterval(() => goTo(current + 1), 5000);

    // Pause on hover
    track.closest('.gallery-wrap').addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.closest('.gallery-wrap').addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => goTo(current + 1), 5000);
    });

    // Touch swipe support
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
    }, { passive: true });
}
