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

// ===== DOWNLOAD BUTTON EFFECT =====
downloadBtn.addEventListener('click', e => {
    e.preventDefault();
    const url = downloadBtn.href;

    // перекрашиваем кнопку в зелёный
    downloadBtn.style.transition = 'background 0.5s';
    downloadBtn.style.background = '#0f0';

    // начинаем скачивание через 0.5 сек
    setTimeout(() => {
        const a = document.createElement('a');
        a.href = url;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // через 1 сек возвращаем исходный цвет
        setTimeout(() => {
            downloadBtn.style.background = ''; // вернётся к CSS
        }, 1000);
    }, 500);
});
