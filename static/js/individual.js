// static/js/individual.js

// Функция расчёта скидки в зависимости от суммы накоплений
export function getIndividualDiscount(totalSpent) {
    if (totalSpent < 5000) return 3;
    if (totalSpent < 15000) return 5;
    if (totalSpent < 30000) return 7;
    return 10;
}

// Прогресс до следующего уровня (процент от 30000)
function getProgressPercent(total) {
    return Math.min((total / 30000) * 100, 100);
}

// Рендер UI для физического лица
export function renderIndividual(user, onUpdate) {
    const container = document.getElementById('roleSpecificContent');
    if (!container) return;

    const total = user.total_spent || 0;
    const discount = getIndividualDiscount(total);
    const progressPercent = getProgressPercent(total);

    // Формируем текст подсказки
    let nextLevelText = "";
    if (total < 5000) {
        nextLevelText = `До скидки 5% осталось: ${(5000 - total).toLocaleString()} ₽`;
    } else if (total < 15000) {
        nextLevelText = `До скидки 7% осталось: ${(15000 - total).toLocaleString()} ₽`;
    } else if (total < 30000) {
        nextLevelText = `До скидки 10% осталось: ${(30000 - total).toLocaleString()} ₽`;
    } else {
        nextLevelText = "Максимальная скидка 10% достигнута!";
    }

    // Отрисовываем HTML
    container.innerHTML = `
        <div class="card">
            <h3><i class="fas fa-chart-line"></i> Накопительная скидка</h3>
            <p>Ваша текущая скидка: <strong style="color:#FFC107; font-size:1.6rem;">${discount}%</strong></p>
            <div class="progress-container">
                <div class="progress-fill" style="width: ${progressPercent}%;"></div>
            </div>
            <div class="flex-row" style="justify-content:space-between;">
                <span>💰 Накоплено: ${total.toLocaleString()} ₽</span>
                <span>🎯 Цель: 30 000 ₽</span>
            </div>
            <p style="font-size:0.8rem;">${nextLevelText}</p>
            <div class="divider"></div>
            <label><i class="fas fa-coins"></i> Добавить сумму покупки:</label>
            <div class="sum-input-group">
                <input type="number" id="addAmountInput" placeholder="Сумма в ₽" value="1000" step="500">
                <button id="addAmountBtn" class="btn-small btn" style="width:auto;">Добавить</button>
            </div>
            <div class="flex-row">
                <button id="addQuick1000" class="btn-small btn-outline" style="flex:1;">+1 000 ₽</button>
                <button id="addQuick5000" class="btn-small btn-outline" style="flex:1;">+5 000 ₽</button>
            </div>
        </div>
    `;

    // Функция добавления суммы и обновления
    const addAmount = (amount) => {
        const newTotal = (user.total_spent || 0) + amount;
        user.total_spent = newTotal;
        onUpdate(user);  // Вызываем колбэк, который отправит данные на сервер и вызовет перерисовку
    };

    // Обработчики кнопок
    document.getElementById('addAmountBtn')?.addEventListener('click', () => {
        const input = document.getElementById('addAmountInput');
        let val = parseInt(input.value);
        if (isNaN(val) || val <= 0) val = 0;
        if (val > 0) addAmount(val);
    });

    document.getElementById('addQuick1000')?.addEventListener('click', () => addAmount(1000));
    document.getElementById('addQuick5000')?.addEventListener('click', () => addAmount(5000));
}