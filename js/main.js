/* ============================================
   ООО «КАЗАКОV+» — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // Мобильная навигация
    // ============================================
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const isOpen = navLinks.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        // Закрыть меню при клике на ссылку
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ============================================
    // Слайдер изображений
    // ============================================
    const sliderCards = document.querySelectorAll('.slider-card');

    sliderCards.forEach(card => {
        const images = card.querySelectorAll('.slider-image');
        const dots = card.querySelectorAll('.slider-dot');
        const prevBtn = card.querySelector('[data-slider-prev]');
        const nextBtn = card.querySelector('[data-slider-next]');
        const openBtn = card.querySelector('[data-slider-open]');

        let currentSlide = 0;

        function showSlide(index) {
            images.forEach((img, i) => {
                img.classList.toggle('is-active', i === index);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('is-active', i === index);
            });
            currentSlide = index;
        }

        function nextSlide() {
            showSlide((currentSlide + 1) % images.length);
        }

        function prevSlide() {
            showSlide((currentSlide - 1 + images.length) % images.length);
        }

        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => showSlide(i));
        });

        // Автопереключение каждые 5 секунд
        let autoSlide = setInterval(nextSlide, 5000);

        card.addEventListener('mouseenter', () => clearInterval(autoSlide));
        card.addEventListener('mouseleave', () => {
            autoSlide = setInterval(nextSlide, 5000);
        });

        // Открыть в лайтбоксе
        if (openBtn) {
            openBtn.addEventListener('click', () => {
                const activeImg = images[currentSlide];
                openLightbox(activeImg.src, activeImg.alt);
            });
        }
    });

    // ============================================
    // Лайтбокс
    // ============================================
    const lightbox = document.querySelector('[data-lightbox]');
    const lightboxImg = document.querySelector('[data-lightbox-image]');
    const lightboxCloseBtns = document.querySelectorAll('[data-lightbox-close]');

    function openLightbox(src, alt) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.hidden = false;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.hidden = true;
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    lightboxCloseBtns.forEach(btn => {
        btn.addEventListener('click', closeLightbox);
    });

    // Закрыть по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // Открыть лайтбокс по кнопкам с data-open-lightbox
    document.querySelectorAll('[data-open-lightbox]').forEach(btn => {
        btn.addEventListener('click', () => {
            const src = btn.getAttribute('data-open-lightbox');
            const alt = btn.getAttribute('data-lightbox-alt') || '';
            openLightbox(src, alt);
        });
    });

    // ============================================
    // Видео-переключатель
    // ============================================
    const videoGallery = document.querySelector('[data-video-gallery]');

    if (videoGallery) {
        const videoFrame = videoGallery.querySelector('[data-video-frame]');
        const videoTitle = videoGallery.querySelector('[data-video-current-title]');
        const videoOptions = videoGallery.querySelectorAll('[data-video-option]');
        const prevBtn = videoGallery.querySelector('[data-video-prev]');
        const nextBtn = videoGallery.querySelector('[data-video-next]');

        let currentVideo = 0;

        function showVideo(index) {
            const option = videoOptions[index];
            if (!option) return;

            const src = option.getAttribute('data-video-src');
            const title = option.getAttribute('data-video-title');

            // Обновить iframe
            if (src && videoFrame) {
                const iframe = videoFrame.querySelector('iframe');
                if (iframe) {
                    iframe.src = src;
                } else {
                    // Создать iframe если его нет (заменить placeholder)
                    const placeholder = videoFrame.querySelector('.video-placeholder');
                    if (placeholder) {
                        placeholder.remove();
                        const newIframe = document.createElement('iframe');
                        newIframe.src = src;
                        newIframe.title = title;
                        newIframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
                        newIframe.allowFullscreen = true;
                        newIframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;';
                        videoFrame.appendChild(newIframe);
                    }
                }
            }

            // Обновить заголовок
            if (videoTitle && title) {
                videoTitle.textContent = title;
            }

            // Обновить точки
            videoOptions.forEach((opt, i) => {
                opt.classList.toggle('is-active', i === index);
                opt.setAttribute('aria-selected', i === index);
                opt.setAttribute('tabindex', i === index ? '0' : '-1');
            });

            currentVideo = index;
        }

        videoOptions.forEach((option, i) => {
            option.addEventListener('click', () => showVideo(i));
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showVideo((currentVideo - 1 + videoOptions.length) % videoOptions.length);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showVideo((currentVideo + 1) % videoOptions.length);
            });
        }
    }

    // ============================================
    // Плавное появление элементов при скролле
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.glass-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // ============================================
    // Навигация: подсветка активного раздела
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

    function highlightNav() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === '#' + id) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav);
    highlightNav();

    // ============================================
    // Параллакс эффект для Hero
    // ============================================
    const hero = document.querySelector('.hero');

    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const circles = hero.querySelectorAll('.floating-circle');
            circles.forEach((circle, i) => {
                const speed = 0.1 + (i * 0.05);
                circle.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // ============================================
    // Плавная прокрутка для якорных ссылок
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    console.log('Сайт ООО «КАЗАКОV+» загружен успешно!');
});
