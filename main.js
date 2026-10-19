/**
 * DOMBURIYA BY HACHIMITSU — MAIN INTERACTIVE CONTROLLER V2
 * 1. Diagrama Interativo "Anatomia do Bowl" (4 pratos + 4 callouts com setas)
 * 2. Bento Category Filter (24 pratos oficiais)
 * 3. Carrossel de Moldura Inclinada (Reviews reais dos clientes)
 * 4. Relógio Operacional em Tempo Real (Gleba vs. Centro)
 * 5. Consentimento LGPD + Telemetria
 */

'use strict';

/* ==========================================================================
   1. DIAGRAMA INTERATIVO "ANATOMIA DO BOWL" (Estilo Nutella)
   ========================================================================== */
const ANATOMY_DATA = {
  lamen: {
    img: '/assets/ambiente/bowl-lamen-cutout.webp',
    isCutout: true,
    price: 'R$ 54,00',
    c1Title: 'Caldo de Longa Cocção',
    c1Desc: 'Base intensa de missô, shoyu, shio ou gergelim picante fervida lentamente.',
    c2Title: 'Chashu Maçaricado',
    c2Desc: 'Fatias macias de lombo suíno marinadas no tare da casa.',
    c3Title: 'Massa Artesanal',
    c3Desc: 'Macarrão alcalino firme que absorve o caldo até o fim.',
    c4Title: 'Toppings Clássicos',
    c4Desc: 'Ovo cozido, manteiga no milho doce, naruto, nori e cebolinha fresca.'
  },
  kare: {
    img: '/assets/ambiente/bowl-kare-cutout.webp',
    isCutout: true,
    price: 'Normal R$ 69 · Mini R$ 59',
    c1Title: 'Curry Japonês Denso',
    c1Desc: 'Molho aveludado cozido com especiarias japonesas, carne e legumes.',
    c2Title: 'Empanado em Panko',
    c2Desc: 'Lombo suíno (Katsu), frango ou filé bovino frito na hora, ultra crocante.',
    c3Title: 'Gohan no Ponto',
    c3Desc: 'Arroz japonês úmido e quentinho para envolver todo o molho.',
    c4Title: 'Dois Tamanhos',
    c4Desc: 'Disponível nas versões Normal ou Mini para o tamanho da sua fome.'
  },
  donburi: {
    img: '/assets/ambiente/bowl-katsudon-cutout.webp',
    isCutout: true,
    price: 'Normal R$ 53 · Mini R$ 43',
    c1Title: 'Alma do Domburiya',
    c1Desc: 'A tigela japonesa clássica que deu nome ao primeiro restaurante da Hachimitsu.',
    c2Title: 'Ovo & Tare Artesanal',
    c2Desc: 'Cozido rapidamente com cebola e molho dashi-shoyu levemente adocicado.',
    c3Title: 'Proteína Suculenta',
    c3Desc: 'Escolha entre Katsudon, Gyudon, Cheese Gyudon, Gyutamagodon ou Tonkatsudon.',
    c4Title: 'Finalização Fresca',
    c4Desc: 'Cebolinha verde, gengibre beni shoga e gergelim tostado.'
  },
  obento: {
    img: '/assets/ambiente/bowl-obento-cutout.webp',
    isCutout: true,
    price: 'R$ 42,00 a R$ 52,00',
    c1Title: 'Refeição Completa',
    c1Desc: 'Bandeja japonesa dividida com equilíbrio entre proteína, massa e arroz.',
    c2Title: 'Yakisoba no Wok',
    c2Desc: 'Macarrão salteado na chapa com legumes frescos e molho escuro da casa.',
    c3Title: 'Proteína Dupla ou Karague',
    c3Desc: 'Opções com Gyu + Katsu (R$ 52), Katsu (R$ 46) ou Karague (R$ 42).',
    c4Title: 'Salada & Gohan',
    c4Desc: 'Acompanha arroz japonês no vapor, salada cítrica e batata.'
  }
};

function initAnatomySwitcher() {
  const buttons = document.querySelectorAll('.anatomy-btn');
  const mainImg = document.getElementById('anatomy-main-img');
  const priceTag = document.getElementById('anatomy-price-tag');
  const c1Title = document.getElementById('callout-1-title');
  const c1Desc = document.getElementById('callout-1-desc');
  const c2Title = document.getElementById('callout-2-title');
  const c2Desc = document.getElementById('callout-2-desc');
  const c3Title = document.getElementById('callout-3-title');
  const c3Desc = document.getElementById('callout-3-desc');
  const c4Title = document.getElementById('callout-4-title');
  const c4Desc = document.getElementById('callout-4-desc');

  if (!buttons.length || !mainImg) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-anatomy');
      const data = ANATOMY_DATA[key];
      if (!data) return;

      buttons.forEach((b) => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });

      mainImg.src = data.img;
      mainImg.classList.toggle('is-cutout', Boolean(data.isCutout));
      if (priceTag) priceTag.textContent = data.price;
      if (c1Title) c1Title.textContent = data.c1Title;
      if (c1Desc) c1Desc.textContent = data.c1Desc;
      if (c2Title) c2Title.textContent = data.c2Title;
      if (c2Desc) c2Desc.textContent = data.c2Desc;
      if (c3Title) c3Title.textContent = data.c3Title;
      if (c3Desc) c3Desc.textContent = data.c3Desc;
      if (c4Title) c4Title.textContent = data.c4Title;
      if (c4Desc) c4Desc.textContent = data.c4Desc;
    });
  });
}

/* ==========================================================================
   2. FILTRO VISUAL DO CARDÁPIO BENTO (24 PRATOS)
   ========================================================================== */
const CATEGORY_LABELS = {
  lamen: 'Exibindo: Lámen (5 pratos)',
  kare: 'Exibindo: Karê — Curry Japonês (5 pratos)',
  donburi: 'Exibindo: Donburi — Tigelas de Gohan (5 pratos)',
  obento: 'Exibindo: Obentô Executivo (3 pratos)',
  entradas: 'Exibindo: Porções & Entradas (6 pratos)',
  todos: 'Exibindo: Cardápio Completo (24 pratos)'
};

function initBentoMenuFilter() {
  const catTiles = document.querySelectorAll('.cat-tile');
  const showAllBtn = document.querySelector('.btn-show-all');
  const dishes = document.querySelectorAll('.dish-tile');
  const activeLabel = document.getElementById('menu-active-label');

  if (!dishes.length) return;

  function applyFilter(category) {
    catTiles.forEach((tile) => {
      const isMatch = tile.getAttribute('data-filter') === category;
      tile.classList.toggle('is-active', isMatch);
      tile.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    dishes.forEach((dish) => {
      const dishCat = dish.getAttribute('data-category');
      const visible = category === 'todos' || dishCat === category;
      dish.hidden = !visible;
    });

    if (activeLabel && CATEGORY_LABELS[category]) {
      activeLabel.textContent = CATEGORY_LABELS[category];
    }
  }

  catTiles.forEach((tile) => {
    tile.addEventListener('click', () => {
      const cat = tile.getAttribute('data-filter');
      if (cat) applyFilter(cat);
    });
  });

  if (showAllBtn) {
    showAllBtn.addEventListener('click', () => applyFilter('todos'));
  }
}

/* ==========================================================================
   3. MOLDURA INCLINADA INTERATIVA — AVALIAÇÕES REAIS DOS CLIENTES
   ========================================================================== */
const REVIEWS = [
  {
    img: '/assets/pratos/katsudon.webp',
    quote: '“Provei o Katsudon e o Cheese Gyudon: deliciosos, porção generosa e saem rapidinho no painel.”',
    author: 'Lucas D. · Alameda Jardino'
  },
  {
    img: '/assets/pratos/obento-gyu-katsu.webp',
    quote: '“Os pratos estavam muito bem preparados e o tempero é bem suave. O atendimento também foi ótimo!”',
    author: 'Natália · Londrina/PR'
  },
  {
    img: '/assets/pratos/karague-sweet-chili.webp',
    quote: '“Foi muito bom desde o atendimento via WhatsApp até pessoalmente. Tudo que experimentamos estava muito saboroso!”',
    author: 'Laisa Pizzo · Londrina/PR'
  }
];

function initReviewCarousel() {
  const imgEl = document.getElementById('review-slide-img');
  const quoteEl = document.getElementById('review-slide-quote');
  const authorEl = document.getElementById('review-slide-author');
  const prevBtn = document.getElementById('review-prev');
  const nextBtn = document.getElementById('review-next');

  if (!imgEl || !quoteEl || !authorEl) return;

  let index = 0;

  function renderSlide(idx) {
    const item = REVIEWS[idx];
    imgEl.src = item.img;
    quoteEl.textContent = item.quote;
    authorEl.textContent = item.author;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      index = (index - 1 + REVIEWS.length) % REVIEWS.length;
      renderSlide(index);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      index = (index + 1) % REVIEWS.length;
      renderSlide(index);
    });
  }
}

/* ==========================================================================
   4. RELÓGIO OPERACIONAL EM TEMPO REAL (LONDRINA / HORÁRIO DE BRASÍLIA)
   ========================================================================== */
function initOperationalStatus() {
  const headerDot = document.getElementById('header-status-dot');
  const headerText = document.getElementById('header-status-text');
  const statusGleba = document.getElementById('status-gleba');
  const statusCentro = document.getElementById('status-centro');

  function updateClock() {
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Sao_Paulo',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      });
      const parts = formatter.formatToParts(now);
      const map = {};
      parts.forEach((p) => { map[p.type] = p.value; });

      const weekday = map.weekday; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
      const hour = parseInt(map.hour, 10);
      const minute = parseInt(map.minute, 10);
      const mins = hour * 60 + minute;

      const isSunday = weekday === 'Sun';
      const inLunch = !isSunday && mins >= 660 && mins <= 930;   // 11:00 - 15:30
      const inBuffet = !isSunday && mins >= 660 && mins <= 870;  // 11:00 - 14:30
      const inDinner = !isSunday && mins >= 1020 && mins <= 1320; // 17:00 - 22:00
      const isOpen = inLunch || inDinner;

      if (headerDot && headerText) {
        headerDot.classList.toggle('is-closed', !isOpen);
        if (isOpen) {
          headerText.textContent = inBuffet
            ? 'Aberto Agora · Almoço & Buffet Centro'
            : 'Aberto Agora · Salão & Delivery';
        } else if (isSunday) {
          headerText.textContent = 'Domingo Fechado · Abre Seg às 11h';
        } else if (mins > 930 && mins < 1020) {
          headerText.textContent = 'Intervalo · Reabre hoje às 17h';
        } else {
          headerText.textContent = 'Seg–Sáb · 11h–15h30 e 17h–22h';
        }
      }

      if (statusGleba) {
        statusGleba.classList.toggle('is-closed', !isOpen);
        statusGleba.textContent = isOpen ? '● Aberto Agora' : (isSunday ? 'Dom Fechado' : 'Fechado Agora');
      }

      if (statusCentro) {
        statusCentro.classList.toggle('is-closed', !isOpen);
        if (inBuffet) {
          statusCentro.textContent = '● Buffet + À La Carte';
        } else if (isOpen) {
          statusCentro.textContent = '● À La Carte Aberto';
        } else {
          statusCentro.textContent = isSunday ? 'Dom Fechado' : 'Fechado Agora';
        }
      }
    } catch (_) {
      // Fallback silencioso
    }
  }

  updateClock();
  setInterval(updateClock, 60000);
}

/* ==========================================================================
   5. CONSENTIMENTO LGPD & ANO ATUAL
   ========================================================================== */
function initConsentAndFooter() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const STORAGE_KEY = 'domburiya_lgpd_v2';
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');
  const openPrefsBtn = document.getElementById('open-cookie-prefs');

  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved && banner) {
    banner.hidden = false;
  }

  if (acceptBtn && banner) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, 'accepted');
      banner.hidden = true;
    });
  }

  if (rejectBtn && banner) {
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, 'essential');
      banner.hidden = true;
    });
  }

  if (openPrefsBtn && banner) {
    openPrefsBtn.addEventListener('click', () => {
      banner.hidden = false;
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initAnatomySwitcher();
  initBentoMenuFilter();
  initReviewCarousel();
  initOperationalStatus();
  initConsentAndFooter();
});
