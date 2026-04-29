// Модуль работы с QR-кодами
let currentQr = null;

export function clearQR() {
    const container = document.getElementById('qrcode-container');
    if (container) container.innerHTML = '';
    currentQr = null;
    const qrArea = document.getElementById('qrArea');
    if (qrArea) qrArea.classList.add('hidden');
}

export function generateQrCode(text) {
    const container = document.getElementById('qrcode-container');
    if (!container) return;
    container.innerHTML = '';
    try {
        // Библиотека QRCode доступна глобально (из CDN)
        new QRCode(container, {
            text: text,
            width: 180,
            height: 180,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });
        const qrArea = document.getElementById('qrArea');
        if (qrArea) qrArea.classList.remove('hidden');
    } catch(err) {
        console.error(err);
        container.innerHTML = '<p style="color:red;">Ошибка генерации QR</p>';
    }
}