const dishes = [
  {
    name: "ก๋วยเตี๋ยวเรือ",
    image: "ก๋วยเตี๋ยวเรือ.jpg",
    description: "เส้นเล็กนุ่มพอดี พร้อมน้ำซุปข้นนัวเลือด และเนื้อสัตว์",
    price: "40 - 50 บาท"
  },
  {
    name: "ข้าวเหนียวไก่ทอด",
    image: "ข้าวเหนียวไก่ทอด.jpg",
    description: "ข้าวเหนียวนุ่ม ไก่ทอดร้อน ๆ จากกระทะ",
    price: "25 - 45 บาท"
  },
  {
    name: "ข้าวกะเพราหมูกรอบไข่ดาว",
    image: "ข้าวกะเพราหมูกรอบไข่ดาว.jpg",
    description: "ผัดกะเพรารสเด็ด หมูกรอบหนังฟู พร้อมไข่ดาวเยิ้ม",
    price: "45 - 65 บาท"
  },
  {
    name: "ข้าวซอยไก่",
    image: "ข้าวซอยไก่.jpg",
    description: "น้ำซุปรสเด็ดเผ็ดกลมกล่อมสไตล์เหนือ ไก่นุ่ม เส้นกรอบ",
    price: "50 - 60 บาท"
  },
  {
    name: "ข้าวหน้าปลาแกะ",
    image: "ข้าวหน้าปลาแกะ.jpg",
    description: "ข้าวสวยร้อนๆ กับปลาทอดแกะพร้อมกิน น้ำจิ้มรสเด็ด",
    price: "40 - 50 บาท"
  },
  {
    name: "คอหมูย่างจิ้มแจ่ว",
    image: "คอหมูย่างจิ้มแจ่ว.png",
    description: "สันคอหมูย่างนุ่มรสชาติกลมกล่อม จิ้มแจ่วแซ่บนัว",
    price: "60 - 90 บาท"
  },
  {
    name: "ข้าวผัดปู",
    image: "ข้าวผัดปู.png",
    description: "ข้าวผัดร้อนๆ มาพร้อมเนื้อปู รสชาติกลมกล่อมทานง่าย",
    price: "45 - 90 บาท"
  }
];

const dishCard = document.querySelector("#dishCard");
const dishImage = document.querySelector("#dishImage");
const dishName = document.querySelector("#dishName");
const dishDesc = document.querySelector("#dishDesc");
const dishPrice = document.querySelector("#dishPrice");
const emptyState = document.querySelector("#emptyState");
const pickButton = document.querySelector("#pickButton");
const liveResult = document.querySelector("#liveResult");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const shuffleInterval = 70;
const shuffleDuration = 480;
let lastIndex = -1;
let isPicking = false;
let imageRequest = 0;

const xmlEntities = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;"
};

function escapeXml(value) {
  return value.replace(/[&<>"']/g, (character) => xmlEntities[character]);
}

function getImagePath(dish) {
  return `menu/${encodeURIComponent(dish.image)}`;
}

function createFallbackImage(name) {
  const safeName = escapeXml(name);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ffd166"/>
          <stop offset=".55" stop-color="#ff9a56"/>
          <stop offset="1" stop-color="#e8523f"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="600" fill="url(#bg)"/>
      <circle cx="600" cy="250" r="165" fill="#fff9ee" fill-opacity=".38"/>
      <circle cx="600" cy="250" r="145" fill="#fff9ee"/>
      <circle cx="600" cy="250" r="108" fill="#ffe8a8"/>
      <path d="M495 250h210c-6 66-47 104-105 104s-99-38-105-104Z" fill="#e8523f"/>
      <ellipse cx="600" cy="250" rx="105" ry="21" fill="#ffd166"/>
      <path d="M538 243c16-12 31 10 47-2s31 10 47-2" stroke="#fffaf0" stroke-width="8" stroke-linecap="round" fill="none"/>
      <circle cx="550" cy="268" r="8" fill="#7fae62"/>
      <circle cx="640" cy="264" r="7" fill="#7fae62"/>
      <text x="600" y="500" text-anchor="middle" font-family="Mali, sans-serif" font-size="52" font-weight="700" fill="#fffaf0">${safeName}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function showImage(dish) {
  const requestId = ++imageRequest;
  const candidate = new Image();

  candidate.onload = () => {
    if (requestId !== imageRequest) {
      return;
    }

    dishImage.src = candidate.src;
    dishImage.alt = `รูปเมนู${dish.name}`;
    dishCard.classList.add("has-image");
    emptyState.setAttribute("aria-hidden", "true");
  };

  candidate.onerror = () => {
    if (requestId !== imageRequest) {
      return;
    }

    dishImage.src = createFallbackImage(dish.name);
    dishImage.alt = `ภาพประกอบเมนู${dish.name}`;
    dishCard.classList.add("has-image");
    emptyState.setAttribute("aria-hidden", "true");
  };

  candidate.src = getImagePath(dish);
}

function renderDish(dish) {
  dishName.textContent = dish.name;
  dishDesc.textContent = dish.description;
  dishPrice.textContent = dish.price;
  showImage(dish);
}

function getRandomIndex() {
  if (dishes.length < 2) {
    return 0;
  }

  let index = Math.floor(Math.random() * dishes.length);

  while (index === lastIndex) {
    index = Math.floor(Math.random() * dishes.length);
  }

  return index;
}

function finishPick() {
  const index = getRandomIndex();
  const dish = dishes[index];

  lastIndex = index;
  renderDish(dish);
  dishCard.classList.remove("is-picking");
  dishCard.classList.add("is-revealed");
  pickButton.classList.remove("is-loading");
  pickButton.removeAttribute("aria-busy");
  pickButton.disabled = false;
  isPicking = false;
  liveResult.textContent = `สุ่มได้เมนู ${dish.name} ราคา ${dish.price}`;

  window.setTimeout(() => {
    dishCard.classList.remove("is-revealed");
  }, 700);
}

function pickDish() {
  if (isPicking) {
    return;
  }

  isPicking = true;
  pickButton.disabled = true;
  pickButton.classList.add("is-loading");
  pickButton.setAttribute("aria-busy", "true");
  dishCard.classList.remove("is-revealed");
  dishCard.classList.add("is-picking");
  liveResult.textContent = "กำลังสุ่มเมนู";

  if (reducedMotion.matches) {
    finishPick();
    return;
  }

  const startedAt = performance.now();

  const shuffle = () => {
    const preview = dishes[Math.floor(Math.random() * dishes.length)];

    dishName.textContent = preview.name;
    dishDesc.textContent = preview.description;
    dishPrice.textContent = preview.price;
    showImage(preview);

    if (performance.now() - startedAt < shuffleDuration) {
      window.setTimeout(shuffle, shuffleInterval);
      return;
    }

    finishPick();
  };

  shuffle();
}

function preloadImages() {
  dishes.forEach((dish) => {
    const image = new Image();
    image.src = getImagePath(dish);
  });
}

pickButton.addEventListener("click", pickDish);

window.addEventListener("load", () => {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(preloadImages, { timeout: 1200 });
    return;
  }

  window.setTimeout(preloadImages, 200);
});
