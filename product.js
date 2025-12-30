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
    e.preventDefault(); // отменяем стандартное скачивание
    const url = downloadBtn.href;

    showDownloadCompleteEffect(() => {
        // Начинаем скачивание после анимации
        const a = document.createElement('a');
        a.href = url;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});

function showDownloadCompleteEffect(callback) {
    const container = document.getElementById('download-effect-container');

    // Создаем каплю
    const drop = document.createElement('div');
    drop.className = 'drop';
    container.appendChild(drop);

    // Анимация капли
    drop.animate([
        { transform: 'translateY(-200px) scale(0.2)', opacity: 0 },
        { transform: 'translateY(0) scale(1)', opacity: 1 }
    ], {
        duration: 600,
        easing: 'ease-out'
    });

    // Через 600ms превращаем каплю в круг с галочкой
    setTimeout(() => {
        drop.className = 'circle';
        drop.innerHTML = '&#10003;'; // галочка
        drop.style.opacity = 0;

        drop.animate([
            { opacity: 0, transform: 'scale(0.8)' },
            { opacity: 1, transform: 'scale(1.2)' },
            { opacity: 1, transform: 'scale(1)' },
            { opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-in-out'
        }).onfinish = () => {
            container.removeChild(drop);
            callback(); // запускаем скачивание после анимации
        };
    }, 600);
}
