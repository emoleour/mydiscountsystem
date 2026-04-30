// static/js/installer.js
export function renderInstaller(user, onUpdate) {
    const container = document.getElementById('roleSpecificContent');
    if (!container) return;
    let bonus = user.bonus_points ?? 0;
    const maxBonusGoal = 10000;
    let bonusPercent = Math.min((bonus / maxBonusGoal) * 100, 100);
    let currentType = user.discount_type || 'discount10';

    container.innerHTML = `
        <div class="card">
            <h3><i class="fas fa-wrench"></i> Доступные опции монтажника</h3>
            <div class="option-group">
                <div data-type="discount10" class="option-btn ${currentType === 'discount10' ? 'active' : ''}">🔻 Скидка 10%</div>
                <div data-type="discount5_cashback5" class="option-btn ${currentType === 'discount5_cashback5' ? 'active' : ''}">⚡ Скидка 5% + Кэшбэк 5%</div>
                <div data-type="cashback5" class="option-btn ${currentType === 'cashback5' ? 'active' : ''}">💰 Только кэшбэк 10%</div>
            </div>
        </div>
        <div class="card">
            <h3><i class="fas fa-gift"></i> Бонусный счёт (кэшбэк)</h3>
            <div class="bonus-stats">
                <span class="bonus-amount">${bonus} баллов</span>
                <span class="bonus-goal">Цель: ${maxBonusGoal} баллов</span>
            </div>
            <div class="progress-container">
                <div class="progress-fill" style="width: ${bonusPercent}%;"></div>
            </div>
            <div class="progress-label">
                <span>0</span><span>${Math.round(bonusPercent)}%</span><span>${maxBonusGoal}</span>
            </div>
            <div class="flex-row" style="margin: 16px 0;">
                <button id="addBonus100" class="btn-small btn-outline">+100</button>
                <button id="addBonus500" class="btn-small btn-outline">+500</button>
            </div>
            <div class="bonus-input-group">
                <input type="number" id="customBonusInput" placeholder="Начислить баллы" value="200">
                <button id="addCustomBonusBtn" class="btn-small btn">Начислить</button>
            </div>
            <div class="divider"></div>
            <label><i class="fas fa-credit-card"></i> Списание бонусов (QR-код):</label>
            <div class="bonus-input-group">
                <input type="number" id="spendBonusInput" placeholder="Сумма списания" value="100" max="${bonus}">
                <button id="spendBonusQRBtn" class="btn-small" style="background:#FFC107; color:#1e1e1e;">Списать бонусы (QR)</button>
            </div>
        </div>
    `;

    // Выбор типа скидки – теперь используем discount_type
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            if (type) {
                user.discount_type = type;   // было installerDiscountType
                onUpdate(user);
            }
        });
    });

    // Начисление бонусов (оставляем bonus_points)
    document.getElementById('addBonus100')?.addEventListener('click', () => {
        user.bonus_points = (user.bonus_points || 0) + 100;
        onUpdate(user);
    });
    document.getElementById('addBonus500')?.addEventListener('click', () => {
        user.bonus_points = (user.bonus_points || 0) + 500;
        onUpdate(user);
    });
    document.getElementById('addCustomBonusBtn')?.addEventListener('click', () => {
        let input = document.getElementById('customBonusInput');
        let val = parseInt(input.value);
        if (!isNaN(val) && val > 0) {
            user.bonus_points = (user.bonus_points || 0) + val;
            onUpdate(user);
        }
    });

    // Списание бонусов
    document.getElementById('spendBonusQRBtn')?.addEventListener('click', () => {
        let spendInput = document.getElementById('spendBonusInput');
        let spendAmount = parseInt(spendInput.value);
        let currentBonus = user.bonus_points || 0;
        if (isNaN(spendAmount) || spendAmount <= 0) {
            alert("Введите корректную сумму списания");
            return;
        }
        if (spendAmount > currentBonus) {
            alert(`Недостаточно бонусов. Доступно: ${currentBonus} баллов.`);
            return;
        }
        if (window.onBonusSpend) {
            window.onBonusSpend(spendAmount);
        } else {
            alert("Функция списания не настроена");
        }
    });
}