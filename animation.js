

// Функция для добавления эффекта свечения к карточкам при наведении
function initCardGlowEffects() {
    const cards = document.querySelectorAll('.product');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Создаем эффект свечения в месте курсора
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // Динамическое изменение тени
            const shadowX = (x / rect.width - 0.5) * 40;
            const shadowY = (y / rect.height - 0.5) * 40;
            
            card.style.boxShadow = `
                ${shadowX}px ${shadowY}px 60px rgba(0, 234, 255, 0.3),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 0 20px rgba(255, 255, 255, 0.05)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
        });
    });
}

// Функция для анимации появления элементов
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                if (entry.target.classList.contains('product')) {
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    }, 100);
                }
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.product, .product-title, .gallery img').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Функция для эффекта параллакса при прокрутке
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const particles = document.querySelectorAll('.glow-particle');
        particles.forEach((particle, index) => {
            const speed = 0.3 + (index * 0.1);
            particle.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// Функция для добавления интерактивности к изображениям галереи
function initGalleryInteractions() {
    const galleryImages = document.querySelectorAll('.gallery img');
    
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            // Создаем эффект вспышки
            const flash = document.createElement('div');
            flash.style.position = 'fixed';
            flash.style.top = '0';
            flash.style.left = '0';
            flash.style.width = '100%';
            flash.style.height = '100%';
            flash.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)';
            flash.style.pointerEvents = 'none';
            flash.style.zIndex = '9999';
            flash.style.opacity = '0';
            flash.style.transition = 'opacity 0.3s';
            
            document.body.appendChild(flash);
            
            // Анимация вспышки
            requestAnimationFrame(() => {
                flash.style.opacity = '1';
                setTimeout(() => {
                    flash.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(flash);
                    }, 300);
                }, 100);
            });
            
            // Создаем модальное окно с увеличенным изображением
            createImageModal(img.src);
        });
    });
}

// Функция для создания модального окна с изображением
function createImageModal(src) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    
    const modalImg = document.createElement('img');
    modalImg.src = src;
    modalImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 10px;
        transform: scale(0.8);
        transition: transform 0.3s;
        box-shadow: 0 0 100px rgba(0, 234, 255, 0.3);
    `;
    
    modal.appendChild(modalImg);
    document.body.appendChild(modal);
    
    // Показываем модальное окно
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        modalImg.style.transform = 'scale(1)';
    });
    
    // Закрытие при клике
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.opacity = '0';
            modalImg.style.transform = 'scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        }
    });
    
    // Закрытие при нажатии ESC
    document.addEventListener('keydown', function closeModal(e) {
        if (e.key === 'Escape') {
            modal.style.opacity = '0';
            modalImg.style.transform = 'scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', closeModal);
            }, 300);
        }
    });
}

// Функция для добавления эффекта печати к заголовку
function animateTitle() {
    const title = document.querySelector('h1');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const typingEffect = setInterval(() => {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typingEffect);
        }
    }, 50);
}

// Функция для создания эффекта волны при загрузке страницы
function createLoadingWave() {
    const wave = document.createElement('div');
    wave.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #ff0080, #00eaff);
        z-index: 99999;
        opacity: 1;
        transform: translateY(0);
        transition: transform 1s cubic-bezier(0.77, 0, 0.175, 1);
    `;
    
    document.body.appendChild(wave);
    
    setTimeout(() => {
        wave.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            document.body.removeChild(wave);
        }, 1000);
    }, 500);
}

// Инициализация всех анимаций при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Создаем световые частицы
    createLightParticles();
    
    // Запускаем анимацию заголовка
    animateTitle();
    
    // Создаем эффект волны при загрузке
    createLoadingWave();
    
    // Инициализируем эффекты для карточек
    initCardGlowEffects();
    
    // Запускаем анимацию при скролле
    animateOnScroll();
    
    // Добавляем эффект параллакса
    initParallaxEffect();
    
    // Добавляем интерактивность галерее
    setTimeout(() => {
        initGalleryInteractions();
    }, 1000);
    
    // Добавляем эффект свечения к бейджам
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        setInterval(() => {
            badge.style.background = `linear-gradient(45deg, 
                hsl(${Math.random() * 360}, 100%, 50%),
                hsl(${Math.random() * 360}, 100%, 50%)
            )`;
        }, 2000);
    });
});

// Дополнительные стили для модального окна
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .image-modal {
        cursor: pointer;
    }
    
    .image-modal img {
        animation: modal-glow 2s infinite alternate;
    }
    
    @keyframes modal-glow {
        from {
            box-shadow: 0 0 100px rgba(0, 234, 255, 0.3);
        }
        to {
            box-shadow: 0 0 150px rgba(255, 0, 128, 0.4),
                       0 0 200px rgba(0, 234, 255, 0.2);
        }
    }
`;
document.head.appendChild(modalStyles);

document.querySelectorAll('.product img, .gallery img').forEach(img => {
    img.addEventListener('contextmenu', e => e.preventDefault());
});

