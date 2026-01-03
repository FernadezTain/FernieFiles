// ================== Получаем id продукта из URL ==================
const id = new URLSearchParams(window.location.search).get('id');

// ================== DOM элементы ==================
const mainPhoto = document.getElementById('main-photo');
const prevBtn = document.querySelector('.prev-photo');
const nextBtn = document.querySelector('.next-photo');

const productName = document.getElementById('product-name');
const productDesc = document.getElementById('product-desc');
const productAuthor = document.getElementById('product-author');
const productSize = document.getElementById('product-size');

const downloadBtn = document.getElementById('download-btn');
const downloadGDriveBtn = document.getElementById('download-gdrive-btn');
const youtubeBtn = document.getElementById('youtube-btn');

let currentIndex = 0;
let images = [];

// ================== Загрузка данных продукта ==================
fetch('./data.json')
    .then(r => r.json())
    .then(data => {
        const product = data.products.find(p => p.id === id);

        if (!product) {
            showError('Продукт не найден.');
            return;
        }

        // Сохраняем просмотренный продукт
        localStorage.setItem('viewed_' + id, 'true');

        // ================== Заполняем информацию ==================
        productName.textContent = product.name;
        productDesc.innerHTML = `<strong>Описание:</strong> ${product.description}`;
        productAuthor.innerHTML = `<strong>Автор:</strong> ${product.author}`;
        productSize.innerHTML = `<strong>Вес файла:</strong> ${product.size}`;

        // ================== Ссылки на скачивание ==================
        if (product.download) {
            downloadBtn.href = product.download;
            downloadBtn.style.display = 'inline-block';
            setupDownloadButton(downloadBtn);
        } else {
            downloadBtn.style.display = 'none';
        }

        if (product.download_GDrive) {
            downloadGDriveBtn.href = product.download_GDrive;
            downloadGDriveBtn.style.display = 'inline-block';
            setupDownloadButton(downloadGDriveBtn, true);
        } else {
            downloadGDriveBtn.style.display = 'none';
        }

        if (product.youtube) {
            youtubeBtn.href = product.youtube;
            youtubeBtn.style.display = 'inline-block';
        } else {
            youtubeBtn.style.display = 'none';
        }

        // ================== Галерея изображений ==================
        images = product.images || [];
        if (!images.length) {
            mainPhoto.src = 'placeholder.jpg';
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            mainPhoto.src = images[0];

            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updatePhoto();
            });

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % images.length;
                updatePhoto();
            });
        }
    })
    .catch(err => {
        console.error(err);
        showError('Не удалось загрузить данные.');
    });

// ================== Функция обновления фото ==================
function updatePhoto() {
    mainPhoto.style.opacity = 0;
    setTimeout(() => {
        mainPhoto.src = images[currentIndex];
        mainPhoto.style.opacity = 1;
    }, 150);
}

// ================== Функция отображения ошибки ==================
function showError(message) {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div style="text-align:center; padding:50px;">
            <h2>Ошибка</h2>
            <p>${message}</p>
            <button onclick="window.location.reload()" style="
                padding:10px 20px;
                border:none;
                border-radius:6px;
                background:#00eaff;
                color:white;
                cursor:pointer;
            ">Попробовать снова</button>
        </div>
    `;
}

// ================== Настройка кнопок скачивания ==================
function setupDownloadButton(btn, isGDrive = false) {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const url = btn.href;
        if (!url) return;

        // Эффект нажатия
        btn.style.transition = 'background 0.3s';
        btn.style.background = '#0f0';

        setTimeout(() => {
            if (isGDrive) {
                window.open(url, '_blank'); // Google Drive в новой вкладке
            } else {
                window.location.href = url; // Dropbox/прямые ссылки
            }

            // Сброс цвета
            setTimeout(() => {
                btn.style.background = '';
            }, 800);
        }, 300);
    });
}
