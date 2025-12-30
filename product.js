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
downloadBtn.addEventListener('click', e => {
    e.preventDefault();
    const url = downloadBtn.href;

    showDownloadParticleEffect(url);
});

function showDownloadParticleEffect(url) {
    const container = document.createElement('div');
    container.className = 'download-particle-container';
    document.body.appendChild(container);

    const numParticles = 150;
    const particles = [];

    // создаём частицы в случайных местах
    for (let i = 0; i < numParticles; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * window.innerWidth + 'px';
        p.style.top = Math.random() * window.innerHeight + 'px';
        container.appendChild(p);
        particles.push({
            el: p,
            x: parseFloat(p.style.left),
            y: parseFloat(p.style.top),
            vx: 0,
            vy: 0
        });
    }

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    let start = null;

    function animate(time) {
        if (!start) start = time;
        const t = time - start;

        particles.forEach(p => {
            const dx = centerX - p.x;
            const dy = centerY - p.y;

            if (t < 1000) {
                // втягивание к центру (0-1 сек)
                p.x += dx * 0.05;
                p.y += dy * 0.05;
            } else if (t < 2000) {
                // дрожание в центре (1-2 сек)
                p.x += dx * 0.1 + (Math.random() - 0.5) * 4;
                p.y += dy * 0.1 + (Math.random() - 0.5) * 4;
            } else {
                // падение вниз
                p.vy = (p.vy || 0) + 0.5;
                p.y += p.vy;
            }

            p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
        });

        if (t < 2500) {
            requestAnimationFrame(animate);
        } else {
            // создаем галочку в центре
            const check = document.createElement('div');
            check.className = 'particle-check';
            container.appendChild(check);

            setTimeout(() => {
                // очищаем контейнер и запускаем скачивание
                container.remove();
                const a = document.createElement('a');
                a.href = url;
                a.download = '';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }, 1000);
        }
    }

    requestAnimationFrame(animate);
}
