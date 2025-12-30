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

fetch('data.json')
.then(r => r.json())
.then(data => {
    const product = data.products.find(p => p.id === id);
    if (!product) return;

    localStorage.setItem('viewed_' + id, 'true');

    images = product.images;
    updatePhoto();

    // Заполняем информацию справа
    productName.textContent = product.name;
    productDesc.innerHTML = `<strong>Описание:</strong> ${product.description || 'Нет описания'}`;
    productAuthor.innerHTML = `<strong>Автор:</strong> ${product.author || 'Неизвестно'}`;
    productSize.innerHTML = `<strong>Вес файла:</strong> ${product.size || '0 MB'}`;
    downloadBtn.href = product.download || '#';
});

function updatePhoto() {
    mainPhoto.src = images[currentIndex];
    mainPhoto.style.opacity = 0;
    setTimeout(() => mainPhoto.style.opacity = 1, 50);
}

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updatePhoto();
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updatePhoto();
});
