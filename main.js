const tg = window.Telegram.WebApp;
tg.expand();

let selectedPlan = null;
let deviceCount = 1;

// Определение ОС
function getOSName() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  if (/windows phone/i.test(ua)) return "Windows Phone";
  if (/android/i.test(ua)) return "Android";
  if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return "iOS";
  if (/Macintosh/i.test(ua)) return "MacOS";
  if (/Windows/i.test(ua)) return "Windows";
  return "Вашей ОС";
}

// Выбор тарифа
function selectPlan(plan) {
  selectedPlan = plan;
  document.querySelectorAll('.tariff-btn').forEach(btn => {
    btn.classList.remove('selected');
    if (btn.textContent === plan) btn.classList.add('selected');
  });
}

// Счётчик устройств
const range = document.getElementById('deviceRange');
const deviceCountLabel = document.getElementById('deviceCount');
range.addEventListener('input', (e) => {
  deviceCount = e.target.value;
  deviceCountLabel.textContent = deviceCount;
});

// Кнопка Продолжить
const proceedBtn = document.getElementById('proceedBtn');
proceedBtn.addEventListener('click', () => {
  if (!selectedPlan) {
    alert("Пожалуйста, выберите тариф.");
    return;
  }

  // Отправка данных боту
  const data = { plan: selectedPlan, devices: deviceCount };
  tg.sendData(JSON.stringify(data));
});

// Кнопка Назад
function addBackButton() {
  const container = document.querySelector('.back-btn-container');
  if (!container) return;

  const btn = document.createElement('button');
  btn.className = 'btn btn-secondary';
  btn.textContent = '⬅ Назад';
  btn.onclick = () => window.history.back();
  container.appendChild(btn);
}

// Добавляем кнопку Назад на plans и setup страницы
addBackButton();

// Обновляем заголовки/кнопки для OS
window.addEventListener('DOMContentLoaded', () => {
  const guideBtn = document.getElementById("guideBtn");
  if (guideBtn) {
    guideBtn.innerText = `📘 Настройка и установка (${getOSName()})`;
  }
  const setupTitle = document.getElementById("os-title");
  if (setupTitle) {
    setupTitle.textContent = `Настройка на ${getOSName()}`;
  }
});
