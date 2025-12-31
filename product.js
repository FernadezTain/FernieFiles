const id = new URLSearchParams(window.location.search).get('id');

const mainPhoto = document.getElementById('main-photo');
const prevBtn = document.querySelector('.prev-photo');
const nextBtn = document.querySelector('.next-photo');

const productName = document.getElementById('product-name');
const productDesc = document.getElementById('product-desc');
const productAuthor = document.getElementById('product-author');
const productSize = document.getElementById('product-size');

const downloadBtn = document.getElementById('download-btn');
const downloadGDriveBtn = document.getElementById('download-gdrive-btn');

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

        localStorage.setItem('viewed_' + id, 'true');

        images = product.images || [];

        productName.textContent = product.name;
        productDesc.innerHTML = `<strong>Описание:</strong> ${product.description}`;
        productAuthor.innerHTML = `<strong>Автор:</strong> ${product.author}`;
        productSize.innerHTML = `<strong>Вес файла:</strong> ${product.size}`;

        // ссылки на скачивание
        downloadBtn.href = product.download;

        if (product.download_GDrive) {
            downloadGDriveBtn.href = product.download_GDrive;
            downloadGDriveBtn.style.display = 'inline-block';
        } else {
            downloadGDriveBtn.style.display = 'none';
        }

        updatePhoto();
    })
    .catch(err => {
        console.error(err);
        showError('Не удалось загрузить данные.');
    });

// ================== Обновление фото ==================
function updatePhoto() {
    if (!images.length) return;

    mainPhoto.style.opacity = 0;
    setTimeout(() => {
        mainPhoto.src = images[currentIndex];
        mainPhoto.style.opacity = 1;
    }, 150);
}

// ================== Переключение фото ==================
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

// ================== Ошибка ==================
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

// ================== Кнопки скачивания ==================
function setupDownloadButton(btn, isGDrive = false) {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const url = btn.href;
        if (!url) return;

        // эффект нажатия
        btn.style.transition = 'background 0.3s';
        btn.style.background = '#0f0';

        setTimeout(() => {
            if (isGDrive) {
                // Google Drive — новая вкладка
                window.open(url, '_blank');
            } else {
                // Dropbox / прямые ссылки — обычный переход
                window.location.href = url;
            }

            // вернуть цвет
            setTimeout(() => {
                btn.style.background = '';
            }, 800);
        }, 300);
    });
}

// ================== Применяем ==================
setupDownloadButton(downloadBtn);
setupDownloadButton(downloadGDriveBtn, true);
