// static/js/qr.js
let currentImageUrl = null;

export function clearQR() {
    const container = document.getElementById('qrcode-container');
    if (container) container.innerHTML = '';
    currentImageUrl = null;
    const qrArea = document.getElementById('qrArea');
    if (qrArea) qrArea.classList.add('hidden');
}

export async function generateQrCode(text) {
    const container = document.getElementById('qrcode-container');
    if (!container) {
        console.error('Контейнер #qrcode-container не найден');
        return;
    }

    container.innerHTML = '';

    if (!text || typeof text !== 'string' || text.trim() === '') {
        container.innerHTML = '<p style="color: red;">Нет данных для QR-кода</p>';
        const qrArea = document.getElementById('qrArea');
        if (qrArea) qrArea.classList.remove('hidden');
        return;
    }

    if (typeof QRCode === 'undefined') {
        container.innerHTML = '<p style="color: red;">Библиотека QRCode не загружена. Проверьте подключение CDN.</p>';
        return;
    }

    try {
        // Используем toDataURL – он проще и не вызывает проблем с errorCorrectionLevel
        const dataUrl = await QRCode.toDataURL(text, {
            width: 180,
            margin: 1
        });
        const img = document.createElement('img');
        img.src = dataUrl;
        img.style.width = '180px';
        img.style.height = '180px';
        container.appendChild(img);
        currentImageUrl = dataUrl;

        const qrArea = document.getElementById('qrArea');
        if (qrArea) qrArea.classList.remove('hidden');
    } catch (err) {
        console.error('QR generation error:', err);
        container.innerHTML = `<p style="color: red;">Ошибка генерации QR: ${err.message || err}</p>`;
    }
}