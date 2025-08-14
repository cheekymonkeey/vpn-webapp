const tg = window.Telegram.WebApp;
tg.expand();

// Определяем ОС
function getOSName() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/windows phone/i.test(userAgent)) return "Windows Phone";
  if (/android/i.test(userAgent)) return "Android";
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return "iOS";
  if (/Macintosh/i.test(userAgent)) return "MacOS";
  if (/Windows/i.test(userAgent)) return "Windows";
  return "Вашей ОС";
}

document.addEventListener("DOMContentLoaded", () => {
  // === index.html ===
  const guideBtn = document.getElementById("guideBtn");
  const buyBtn = document.getElementById("buyBtn");
  const supportBtn = document.getElementById("supportBtn");
  const profileBtn = document.getElementById("profileBtn");

  if (guideBtn) guideBtn.textContent = `📘 Настройка и установка (${getOSName()})`;
  if (buyBtn) buyBtn.addEventListener("click", () => location.href = "plans.html");
  if (guideBtn) guideBtn.addEventListener("click", () => location.href = "setup.html");
  if (supportBtn) supportBtn.addEventListener("click", () => alert("Саппорт: @support"));
  if (profileBtn) profileBtn.addEventListener("click", () => {
    const user = tg.initDataUnsafe.user;
    alert(`Вы: ${user?.first_name ?? 'Гость'}`);
  });

  // === plans.html ===
  const tariffButtons = document.querySelectorAll(".tariff-btn");
  let selectedPlan = null;

  tariffButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tariffButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedPlan = btn.textContent;
    });
  });

  const deviceRange = document.getElementById("deviceRange");
  const deviceCount = document.getElementById("deviceCount");
  if (deviceRange && deviceCount) {
    deviceRange.addEventListener("input", e => {
      deviceCount.textContent = e.target.value;
    });
  }

  const proceedBtn = document.getElementById("proceedBtn");
  if (proceedBtn) {
    proceedBtn.addEventListener("click", async () => {
      if (!selectedPlan) {
        alert("Выберите тариф");
        return;
      }

      const devices = deviceRange ? deviceRange.value : 1;
      const payload = {
        plan: selectedPlan,
        devices: devices,
        user_id: tg.initDataUnsafe.user?.id
      };

      try {
        const res = await fetch("/api/select-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          alert(`Тариф сохранён! ID заказа: ${data.order_id}`);
        } else {
          alert("Ошибка при отправке данных");
        }
      } catch (err) {
        console.error(err);
        alert("Сервер недоступен");
      }
    });
  }
});
