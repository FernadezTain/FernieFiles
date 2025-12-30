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

    showDownloadCompleteEffect(() => {
        const a = document.createElement('a');
        a.href = url;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});

function showDownloadCompleteEffect(callback) {
    // Создаем overlay поверх всего
    const overlay = document.createElement('div');
    overlay.className = 'download-overlay';
    overlay.innerHTML = `
        <div class="drop"></div>
        <div class="circle">
            <svg viewBox="0 0 52 52" class="checkmark">
                <circle cx="26" cy="26" r="25" fill="none"/>
                <path d="M14 27l7 7 16-16"/>
            </svg>
        </div>
    `;
    document.body.appendChild(overlay);

    // Запуск анимации
    setTimeout(() => overlay.classList.add('animate'), 50);

    // Скачивание через 2 секунды
    setTimeout(() => callback(), 2000);

    // Удаление overlay через 3 секунды
    setTimeout(() => overlay.remove(), 3000);
}
