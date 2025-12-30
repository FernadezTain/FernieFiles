const id = new URLSearchParams(window.location.search).get('id');
const mainPhoto = document.getElementById('main-photo');
const prevBtn = document.querySelector('.prev-photo');
const nextBtn = document.querySelector('.next-photo');
const productName = document.getElementById('product-name');
const productDesc = document.getElementById('product-desc');
const productAuthor = document.getElementById('product-author');
const productSize = document.getElementById('product-size');
const downloadBtn = document.getElementById('download-btn');

let currentIndex = 0;
let images = [];

fetch('./data.json')
  .then(r => r.json())
  .then(data => {
      const product = data.products.find(p => p.id === id);
      if (!product) return;

      localStorage.setItem('viewed_' + id, 'true');

      images = product.images;
      productName.textContent = product.name;
      productDesc.innerHTML = `<strong>Описание:</strong> ${product.description}`;
      productAuthor.innerHTML = `<strong>Автор:</strong> ${product.author}`;
      productSize.innerHTML = `<strong>Вес файла:</strong> ${product.size}`;
      downloadBtn.href = product.download;

      updatePhoto();
  })
  .catch(err => console.error('Ошибка загрузки JSON:', err));

function updatePhoto() {
  if (!images.length) return;
  mainPhoto.style.opacity = 0;
  setTimeout(() => {
      mainPhoto.src = images[currentIndex];
      mainPhoto.style.opacity = 1;
  }, 150);
}

prevBtn.addEventListener('click', () => {
  if (!images.length) return;
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updatePhoto();
});

nextBtn.addEventListener('click', () => {
  if (!images.length) return;
  currentIndex = (currentIndex + 1) % images.length;
  updatePhoto();
});

// ===== DOWNLOAD EFFECT =====
// ===== DOWNLOAD EFFECT =====
downloadBtn.addEventListener('click', e => {
    e.preventDefault();
    const url = downloadBtn.href;
    startDownloadButtonEffect(url);
});

function startDownloadButtonEffect(url) {
    const container = document.createElement('div');
    container.className = 'download-particle-container';
    document.body.appendChild(container);

    const numParticles = 200;
    const particles = [];
    const rect = downloadBtn.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    // создаём частицы случайно по экрану
    for (let i = 0; i < numParticles; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * window.innerWidth + 'px';
        p.style.top = Math.random() * window.innerHeight + 'px';
        container.appendChild(p);
        particles.push({ el: p, x: parseFloat(p.style.left), y: parseFloat(p.style.top), vy: 0, vx: 0 });
    }

    let start = null;
    function animate(time) {
        if (!start) start = time;
        const t = time - start;

        let allReached = true;

        particles.forEach(p => {
            const dx = targetX - p.x;
            const dy = targetY - p.y;

            if (t < 1000) {
                // 0-1 сек: плавное движение к кнопке
                p.x += dx * 0.05;
                p.y += dy * 0.05;
                allReached = false;
            } else if (t < 2000) {
                // 1-2 сек: ускорение + дрожание
                p.x += dx * 0.15 + (Math.random() - 0.5) * 3;
                p.y += dy * 0.15 + (Math.random() - 0.5) * 3;
                allReached = false;
            } else {
                // после 2 сек: только "долетают остатки"
                if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                    p.x += dx * 0.2;
                    p.y += dy * 0.2;
                    allReached = false;
                }
            }

            p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
        });

        if (!allReached) {
            requestAnimationFrame(animate);
        } else {
            // когда последняя частица "долетела"
            downloadBtn.style.transition = 'background 0.5s';
            downloadBtn.style.background = '#0f0'; // кнопка зелёная
            // начинаем скачивание
            const a = document.createElement('a');
            a.href = url;
            a.download = '';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // через 1 сек возвращаем исходный цвет
            setTimeout(() => {
                downloadBtn.style.background = ''; // вернёт к CSS
            }, 1000);

            // удаляем контейнер с частицами
            setTimeout(() => container.remove(), 500);
        }
    }

    requestAnimationFrame(animate);
}

