// static/js/app.js
import { initAuth, getToken } from './auth.js';
import { renderIndividual, getIndividualDiscount } from './individual.js';
import { renderInstaller } from './installer.js';
import { generateQrCode, clearQR } from './qr.js';

let currentUser = null;

async function fetchCurrentUser() {
    const token = getToken();
    if (!token) return null;
    const resp = await fetch('/api/me', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (resp.ok) return await resp.json();
    return null;
}

async function updateUserOnServer(updatedData) {
    const token = getToken();
    await fetch('/api/me', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
    });
}

async function updateUI() {
    if (!currentUser) return;
    document.getElementById('dashboardUserName').innerText = currentUser.username;
    document.getElementById('dashboardUserRole').innerText =
        currentUser.role === 'individual' ? 'Физическое лицо' : 'Монтажник';

    if (currentUser.role === 'individual') {
        renderIndividual(currentUser, async (updatedUser) => {
            await updateUserOnServer({ total_spent: updatedUser.total_spent });
            currentUser = updatedUser;
            updateUI();
        });
    } else {
        renderInstaller(currentUser, async (updatedUser) => {
            await updateUserOnServer({
                bonus_points: updatedUser.bonus_points,
                discount_type: updatedUser.installerDiscountType
            });
            currentUser = updatedUser;
            updateUI();
        });
    }
    updateQRDescription();
    clearQR();
}

function updateQRDescription() {
    const descEl = document.getElementById('qrDescriptionText');
    if (!currentUser) return;
    if (currentUser.role === 'individual') {
        let discount = getIndividualDiscount(currentUser.total_spent || 0);
        descEl.innerHTML = `🎫 Накопительная скидка: ${discount}% · QR для предъявления`;
    } else {
        let type = currentUser.discount_type || 'discount10';
        if (type === 'discount10') descEl.innerHTML = `🔧 Скидка 10% для монтажника`;
        else if (type === 'discount5_cashback5') descEl.innerHTML = `⚡ Скидка 5% + Кэшбэк 5%`;
        else descEl.innerHTML = `💰 Только кэшбэк 10%`;
    }
}

function getMainQRText() {
    if (!currentUser) return "";
    if (currentUser.role === 'individual') {
        let disc = getIndividualDiscount(currentUser.total_spent || 0);
        return `Скидка ${disc}% | ФЛ ${currentUser.username} | Накопительная система`;
    } else {
        const type = currentUser.discount_type || 'discount10';
        if (type === 'discount10') return `Скидка 10% для монтажника ${currentUser.username}`;
        if (type === 'discount5_cashback5') return `Скидка 5% + Кэшбэк 5% | Монтажник ${currentUser.username}`;
        return `Кэшбэк 10% (без скидки) | Монтажник ${currentUser.username}`;
    }
}

function onGenerateMainQR() {
    if (!currentUser) return;
    const text = getMainQRText();
    if (text) generateQrCode(text);
    else alert("Ошибка генерации QR");
}

// Обработчик после успешного входа
async function onLoginSuccess(userData) {
    currentUser = userData;
    // Дополнительно загрузим свежие данные с сервера (на случай, если они уже изменились)
    const fresh = await fetchCurrentUser();
    if (fresh) currentUser = fresh;
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboardScreen').classList.remove('hidden');
    await updateUI();
}

// Выход
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('access_token');
    currentUser = null;
    document.getElementById('dashboardScreen').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
    clearQR();
    // Очищаем поля входа
    document.getElementById('loginName').value = '';
    document.getElementById('loginPassword').value = '';
});

// Инициализация модуля авторизации
initAuth(onLoginSuccess);
document.getElementById('generateQRBtn').addEventListener('click', onGenerateMainQR);