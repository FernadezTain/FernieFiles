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
        productName.textContent = product.name;
        productDesc.innerHTML = `<strong>Описание:</strong> ${product.description}`;
        productAuthor.innerHTML = `<strong>Автор:</strong> ${product.author}`;
        productSize.innerHTML = `<strong>Вес файла:</strong> ${product.size}`;
        downloadBtn.href = product.download;

        updatePhoto();
    });

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
    e.preventDefault(); // отменяем стандартное поведение ссылки
    const url = downloadBtn.href;

    showDownloadCompleteEffect(() => {
        // Создаем динамический элемент <a> для скачивания
        const a = document.createElement('a');
        a.href = url;
        a.download = ''; // указываем что это скачивание
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});


function showDownloadCompleteEffect(callback) {
    const container = document.createElement('div');
    container.className = 'download-complete';

    const drop = document.createElement('div');
    drop.className = 'drop';

    const circle = document.createElement('div');
    circle.className = 'circle';

    const check = document.createElement('div');
    check.className = 'checkmark';

    container.appendChild(drop);
    container.appendChild(circle);
    container.appendChild(check);
    document.body.appendChild(container);

    setTimeout(() => {
        container.classList.add('fade-out');
    }, 2600);

    setTimeout(() => {
        document.body.removeChild(container);
        if (callback) callback();
    }, 3200);
}
