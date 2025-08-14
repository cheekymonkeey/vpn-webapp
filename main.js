// main.js

const tg = window.Telegram.WebApp;
tg.expand();

let selectedPlan = null;
let deviceCount = 1;

// Определение ОС пользователя
function getOSName() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/windows phone/i.test(userAgent)) return "Windows Phone";
  if (/android/i.test(userAgent)) return "Android";
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return "iOS";
  if (/Macintosh/i.test(userAgent)) return "MacOS";
  if (/Windows/i.test(userAgent)) return "Windows";
  return "Вашей ОС";
}

// Добавление кнопки "Назад"
function addBackButton() {
  const container = document.querySelector('.back-btn-container');
  if (!container) return;
  // Не добавляем кнопку на главную страницу
  if (document.querySelector('.subscription-status')) return;

  const btn = document.createElement('button');
  btn.className = 'btn btn-secondary';
  btn.textContent = '⬅ Назад';
  btn.onclick = () => window.history.back();
  container.appendChild(btn);
}


// Обновление кнопки "Настройка и установка" на главной странице
function updateGuideBtn() {
  const guideBtn = document.getElementById("guideBtn");
  if (guideBtn) {
    guideBtn.innerText = `📘 Настройка и установка (${getOSName()})`;
  }
}

// Страница index.html
function initIndexPage() {
  addBackButton();

  // Поддержка
  const supportBtn = document.querySelector(".row-buttons .btn-secondary:nth-child(1)");
  if (supportBtn) supportBtn.onclick = () => alert("Саппорт в Telegram: @support");

  // Профиль
  const profileBtn = document.querySelector(".row-buttons .btn-secondary:nth-child(2)");
  if (profileBtn) profileBtn.onclick = () => {
    const user = tg.initDataUnsafe.user;
    alert(`Вы: ${user?.first_name ?? 'Гость'}`);
  };

  // Пример даты подписки
  const subDate = document.getElementById("sub-date");
  if (subDate) subDate.textContent = "до 15.08.2025";
}

// Страница plans.html
function initPlansPage() {
  addBackButton();

  // Кнопки выбора тарифа
  document.querySelectorAll('.tariff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedPlan = btn.textContent;
      document.querySelectorAll('.tariff-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Ползунок устройств
  const range = document.getElementById('deviceRange');
  const deviceCountLabel = document.getElementById('deviceCount');
  if (range && deviceCountLabel) {
    range.addEventListener('input', (e) => {
      deviceCount = e.target.value;
      deviceCountLabel.textContent = deviceCount;
    });
  }

  // Кнопка Продолжить
  const proceedBtn = document.getElementById('proceedBtn');
  if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
      if (!selectedPlan) {
        alert("Пожалуйста, выберите тариф.");
        return;
      }
      alert(`Вы выбрали тариф: ${selectedPlan}\nУстройств: ${deviceCount}`);
      // Здесь можно отправить данные на сервер через API
    });
  }
}

// Страница setup.html
function initSetupPage() {
  addBackButton();

  const thisBtn = document.getElementById("thisDeviceBtn");
  const otherBtn = document.getElementById("otherDeviceBtn");

  if (thisBtn) thisBtn.addEventListener('click', () => alert("Инструкция для текущего устройства"));
  if (otherBtn) otherBtn.addEventListener('click', () => alert("Инструкция для другого устройства"));

  const setupTitle = document.getElementById("os-title");
  if (setupTitle) setupTitle.textContent = `Настройка на ${getOSName()}`;
}

// Инициализация страницы
window.addEventListener('DOMContentLoaded', () => {
  updateGuideBtn();
  if (document.getElementById('proceedBtn')) initPlansPage();
  if (document.getElementById('thisDeviceBtn')) initSetupPage();
  if (document.querySelector('.subscription-status')) initIndexPage();
});
