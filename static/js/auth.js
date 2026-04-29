// static/js/auth.js
let selectedRole = 'individual';

export function initAuth(loginCallback) {
    // Дожидаемся загрузки DOM
    document.addEventListener('DOMContentLoaded', () => {
        const showRegisterBtn = document.getElementById('showRegisterBtn');
        const backToLoginBtn = document.getElementById('backToLoginBtn');
        const loginScreen = document.getElementById('loginScreen');
        const registerScreen = document.getElementById('registerScreen');

        if (!showRegisterBtn || !backToLoginBtn || !loginScreen || !registerScreen) {
            console.error('Ошибка: не найдены элементы для переключения экранов');
            return;
        }

        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginScreen.classList.add('hidden');
            registerScreen.classList.remove('hidden');
        });

        backToLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerScreen.classList.add('hidden');
            loginScreen.classList.remove('hidden');
        });

        // Выбор роли на экране регистрации
        const regRoleOptions = document.querySelectorAll('#regRoleSelector .role-option');
        regRoleOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                regRoleOptions.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                selectedRole = opt.getAttribute('data-role');
            });
        });

        // Кнопка регистрации
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.addEventListener('click', async () => {
                const username = document.getElementById('regName').value.trim();
                const password = document.getElementById('regPassword').value;
                if (!username) return alert('Введите имя пользователя');
                if (!password) return alert('Введите пароль');
                try {
                    const resp = await fetch('/api/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password, role: selectedRole })
                    });
                    if (!resp.ok) {
                        const err = await resp.json();
                        throw new Error(err.detail || 'Ошибка регистрации');
                    }
                    alert('Регистрация успешна! Теперь войдите.');
                    // Возврат на экран входа
                    registerScreen.classList.add('hidden');
                    loginScreen.classList.remove('hidden');
                    document.getElementById('regName').value = '';
                    document.getElementById('regPassword').value = '';
                } catch (err) {
                    alert(err.message);
                }
            });
        }

        // Кнопка входа
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', async () => {
                const username = document.getElementById('loginName').value.trim();
                const password = document.getElementById('loginPassword').value;
                if (!username) return alert('Введите имя пользователя');
                try {
                    const resp = await fetch('/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    });
                    if (!resp.ok) {
                        const err = await resp.json();
                        throw new Error(err.detail || 'Ошибка входа');
                    }
                    const data = await resp.json();
                    localStorage.setItem('access_token', data.access_token);
                    loginCallback(data.user);
                } catch (err) {
                    alert(err.message);
                }
            });
        }
    });
}

export function getToken() {
    return localStorage.getItem('access_token');
}