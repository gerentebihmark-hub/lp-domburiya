/**
 * DOMBURIYA BY HACHIMITSU — ENGENHARIA DE INTERAÇÃO, SEGURANÇA E CONVERSÃO
 * - Status operacional ao vivo no fuso de Londrina/PR (America/Sao_Paulo)
 * - Palco interativo "Anatomia da Tigela"
 * - Filtro instantâneo por categoria e busca higienizada dos 24 pratos
 * - Rastreamento GA4 / Meta Pixel condicionado ao consentimento LGPD
 */

const CONSENT_STORAGE_KEY = 'domburiya_lgpd_consent_v1';

// Dados da Anatomia Interativa (3 Pilares da Casa)
const ANATOMY_DATA = {
  lamen: {
    name: 'Missô Lámen',
    origin: 'Origem: Japão (raízes chinesas na família lámen)',
    price: 'R$ 54,00',
    image: '/assets/pratos/misso-lamen.webp',
    alt: 'Missô Lámen visto de cima em tigela preta tradicional do Domburiya',
    callouts: [
      {
        title: 'Caldo Artesanal Encorpado',
        desc: 'Base rica de tonkotsu, missô ou shio com manteiga, servida fumegante para envolver cada fio de macarrão.',
      },
      {
        title: 'Chashu Suíno & Proteínas',
        desc: 'Fatias macias de carne suína marinada e selada, preparando o contraste de textura com a cebolinha fresca recém-cortada.',
      },
      {
        title: 'Ajitsuke Tamago & Naruto',
        desc: 'Ovo cozido com gema cremosa marinado no shoyu da casa, acompanhado do clássico narutomaki japonês em espiral.',
      },
      {
        title: 'Macarrão no Ponto Certo',
        desc: 'Massa oriental com elasticidade firme (koshi), pensada para manter a textura do primeiro ao último gole do caldo.',
      },
    ],
  },
  domburi: {
    name: 'Katsudon Tradicional',
    origin: 'Origem: Clássico do Japão · Opções Padrão e Grande',
    price: 'R$ 43,00 / R$ 53,00',
    image: '/assets/pratos/katsudon.webp',
    alt: 'Tigela de Katsudon com lombo suíno empanado cozido no shoyu, cebola, ovos e gengibre vermelho',
    callouts: [
      {
        title: 'Base de Gohan no Vapor',
        desc: 'Arroz de grão curto japonês cozido no ponto exato para absorver o caldo quente sem perder a estrutura.',
      },
      {
        title: 'Lombo Empanado em Panko',
        desc: 'Corte suíno empanado e dourado, finalizado em redução rápida para unir suculência interna e bordas macias.',
      },
      {
        title: 'Redução de Shoyu, Cebola e Ovos',
        desc: 'Ovos batidos cozidos suavemente sobre o katsu com cebola caramelizada no molho de shoyu da casa.',
      },
      {
        title: 'Beni Shoga & Cebolinha',
        desc: 'Finalização clássica com gengibre vermelho em conserva e cebolinha verde para equilibrar o umami.',
      },
    ],
  },
  obento: {
    name: 'Obentô Gyu Katsu',
    origin: 'Origem: Refeição Executiva Completa · Japão',
    price: 'R$ 52,00',
    image: '/assets/pratos/obento-gyu-katsu.webp',
    alt: 'Bandeja de Obentô Gyu Katsu com arroz furikake, ameixa umeboshi, yakissoba, tamagoyaki e empanado bovino',
    callouts: [
      {
        title: 'Gohan com Furikake & Umeboshi',
        desc: 'Arroz japonês temperado com furikake crocante e coroado com a tradicional ameixa japonesa em conserva (umeboshi).',
      },
      {
        title: 'Proteína Principal Empanada',
        desc: 'Escolha entre Gyu Katsu bovino (R$ 52), Katsu suíno (R$ 46) ou Frango Karaguê crocante (R$ 42).',
      },
      {
        title: 'Yakissoba & Salada Fresca',
        desc: 'Divisória dedicada ao yakissoba quente da casa acompanhado de salada colorida com milho e legumes.',
      },
      {
        title: 'Tamagoyaki Artesanal',
        desc: 'Fatias do autêntico omelete japonês enrolado em camadas delicadas, completando o equilíbrio do obentô.',
      },
    ],
  },
};

/**
 * Sanitiza texto livre contra injeção de HTML/scripts
 */
function sanitizeInput(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/[<>]/g, '').trim();
}

/**
 * Dispara eventos de telemetria (GA4 / GTM / Meta) respeitando o opt-in da LGPD
 */
function trackEvent(eventName, params = {}) {
  try {
    const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!saved) return;
    const consent = JSON.parse(saved);
    if (consent.analytics && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
    if (consent.marketing && typeof window.fbq === 'function') {
      window.fbq('trackCustom', eventName, params);
    }
  } catch {
    // Falha silenciosa segura caso storage esteja bloqueado
  }
}

/**
 * Atualiza o indicador ao vivo de horário de funcionamento em Londrina/PR
 * - Segunda a Sábado:
 *   - Buffet Centro: 11h00 às 14h30
 *   - À La Carte (Gleba e Centro): 11h00 às 15h30 e 17h00 às 22h00
 * - Domingo: Fechado
 */
function initLiveOperationalStatus() {
  const dotEl = document.getElementById('live-status-dot');
  const textEl = document.getElementById('live-status-text');
  if (!dotEl || !textEl) return;

  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const map = {};
    parts.forEach((p) => {
      map[p.type] = p.value;
    });

    const weekday = map.weekday; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
    const hour = parseInt(map.hour || '0', 10);
    const minute = parseInt(map.minute || '0', 10);
    const totalMinutes = hour * 60 + minute;

    if (weekday === 'Sun') {
      dotEl.classList.remove('is-open');
      textEl.textContent =
        'Domingo: Unidades fechadas hoje · Retornamos segunda-feira às 11h00 (Gleba e Centro)';
      return;
    }

    const isBuffetOpen = totalMinutes >= 11 * 60 && totalMinutes < 14 * 60 + 30;
    const isLunchAlaCarte = totalMinutes >= 11 * 60 && totalMinutes <= 15 * 60 + 30;
    const isDinnerAlaCarte = totalMinutes >= 17 * 60 && totalMinutes <= 22 * 60;

    if (isBuffetOpen) {
      dotEl.classList.add('is-open');
      textEl.textContent =
        'Aberto agora em Londrina · Buffet no Centro (até 14h30) e À La Carte na Gleba e Centro (até 15h30)';
    } else if (isLunchAlaCarte) {
      dotEl.classList.add('is-open');
      textEl.textContent =
        'Aberto agora para Almoço À La Carte até 15h30 (Gleba e Centro · Buffet do Centro encerrou às 14h30)';
    } else if (isDinnerAlaCarte) {
      dotEl.classList.add('is-open');
      textEl.textContent =
        'Aberto agora para Jantar À La Carte até 22h00 (Unidade Gleba Palhano e Unidade Centro)';
    } else if (totalMinutes > 15 * 60 + 30 && totalMinutes < 17 * 60) {
      dotEl.classList.remove('is-open');
      textEl.textContent =
        'Intervalo entre turnos · Reabrimos hoje às 17h00 para o jantar (Gleba Palhano e Centro)';
    } else {
      dotEl.classList.remove('is-open');
      textEl.textContent =
        'Horário de atendimento: Segunda a Sábado das 11h às 15h30 e das 17h às 22h (Buffet Centro: 11h–14h30)';
    }
  } catch {
    // Mantém texto padrão estático se Intl falhar
  }
}

/**
 * Menu Mobile Acessível
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    nav.classList.toggle('is-open', !isExpanded);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    });
  });
}

/**
 * Palco Interativo "Anatomia da Tigela"
 */
function initAnatomyTabs() {
  const buttons = document.querySelectorAll('.anatomy-tab-btn');
  const panel = document.getElementById('painel-anatomia');
  const mainImg = document.getElementById('anatomy-main-img');
  const dishName = document.getElementById('anatomy-dish-name');
  const dishOrigin = document.getElementById('anatomy-dish-origin');
  const dishPrice = document.getElementById('anatomy-dish-price');

  if (!buttons.length || !panel || !mainImg) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-anatomy-key');
      const data = ANATOMY_DATA[key];
      if (!data) return;

      buttons.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      panel.setAttribute('aria-labelledby', btn.id);

      mainImg.src = data.image;
      mainImg.alt = data.alt;
      dishName.textContent = data.name;
      dishOrigin.textContent = data.origin;
      dishPrice.textContent = data.price;

      data.callouts.forEach((item, index) => {
        const idx = index + 1;
        const titleEl = document.getElementById(`callout-${idx}-title`);
        const descEl = document.getElementById(`callout-${idx}-desc`);
        if (titleEl) titleEl.textContent = item.title;
        if (descEl) descEl.textContent = item.desc;
      });

      trackEvent('anatomy_tab_select', { dish_pillar: key });
    });
  });
}

/**
 * Filtro por Categoria + Busca nos 24 Pratos do Cardápio
 */
function initMenuFilterAndSearch() {
  const filterBtns = document.querySelectorAll('.menu-filter-btn');
  const searchInput = document.getElementById('menu-search-input');
  const cards = document.querySelectorAll('.dish-card');
  const emptyState = document.getElementById('menu-empty-state');
  const resetBtn = document.getElementById('reset-menu-search');

  if (!cards.length) return;

  let activeCategory = 'todos';
  let searchQuery = '';

  function normalizeText(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function applyFilter() {
    let visibleCount = 0;
    const cleanQuery = normalizeText(sanitizeInput(searchQuery));

    cards.forEach((card) => {
      const cat = card.getAttribute('data-category') || '';
      const searchable = normalizeText(
        (card.getAttribute('data-search') || '') + ' ' + card.textContent
      );

      const matchesCategory = activeCategory === 'todos' || cat === activeCategory;
      const matchesSearch = !cleanQuery || searchable.includes(cleanQuery);

      if (matchesCategory && matchesSearch) {
        card.hidden = false;
        visibleCount++;
      } else {
        card.hidden = true;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-filter') || 'todos';
      filterBtns.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      applyFilter();
      trackEvent('menu_filter_click', { category: activeCategory });
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value || '';
      applyFilter();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeCategory = 'todos';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      filterBtns.forEach((b) => {
        const isAll = b.getAttribute('data-filter') === 'todos';
        b.classList.toggle('is-active', isAll);
        b.setAttribute('aria-pressed', String(isAll));
      });
      applyFilter();
    });
  }
}

/**
 * Validação, Sanitização e Honeypot do Formulário de Contato Institucional
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form || !feedback) return;

  let lastSubmitTimestamp = 0;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    feedback.hidden = true;
    feedback.className = 'form-feedback';

    // Proteção Honeypot contra bots
    const hp = document.getElementById('website_hp');
    if (hp && hp.value.trim() !== '') {
      return;
    }

    // Rate limiting client-side contra submissões repetidas em menos de 5s
    const now = Date.now();
    if (now - lastSubmitTimestamp < 5000) {
      feedback.textContent = 'Aguarde alguns segundos antes de enviar uma nova mensagem.';
      feedback.classList.add('is-error');
      feedback.hidden = false;
      return;
    }

    const nameEl = document.getElementById('contact-name');
    const phoneEl = document.getElementById('contact-phone');
    const unitEl = document.getElementById('contact-unit');
    const msgEl = document.getElementById('contact-message');
    const lgpdEl = document.getElementById('contact-lgpd');

    const name = sanitizeInput(nameEl?.value || '');
    const phone = sanitizeInput(phoneEl?.value || '');
    const unit = sanitizeInput(unitEl?.value || '');
    const message = sanitizeInput(msgEl?.value || '');
    const consent = Boolean(lgpdEl?.checked);

    if (name.length < 2) {
      feedback.textContent = 'Informe seu nome para que possamos identificar seu contato.';
      feedback.classList.add('is-error');
      feedback.hidden = false;
      nameEl?.focus();
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      feedback.textContent = 'Informe um telefone ou WhatsApp válido com DDD (ex: 43 99999-9999).';
      feedback.classList.add('is-error');
      feedback.hidden = false;
      phoneEl?.focus();
      return;
    }

    if (message.length < 5) {
      feedback.textContent = 'Escreva brevemente sua mensagem ou solicitação.';
      feedback.classList.add('is-error');
      feedback.hidden = false;
      msgEl?.focus();
      return;
    }

    if (!consent) {
      feedback.textContent =
        'Marque a caixa de concordância com a Política de Privacidade (LGPD) para prosseguir.';
      feedback.classList.add('is-error');
      feedback.hidden = false;
      lgpdEl?.focus();
      return;
    }

    lastSubmitTimestamp = now;
    trackEvent('form_submit', { unit_reference: unit });

    // Armazena resumo seguro em sessionStorage para exibir na página de confirmação (obrigado.html)
    try {
      sessionStorage.setItem(
        'domburiya_contact_summary',
        JSON.stringify({ name, unit, phone, message })
      );
    } catch {
      // Ignora se sessionStorage indisponível
    }

    window.location.href = `/obrigado.html?unidade=${encodeURIComponent(unit)}`;
  });
}

/**
 * Gerenciamento de Consentimento de Cookies (LGPD) e Modal de Privacidade
 */
function initPrivacyAndCookies() {
  const banner = document.getElementById('cookie-banner');
  const modal = document.getElementById('privacy-modal');
  const openModalBtn = document.getElementById('open-privacy-modal');
  const footerPrivacyBtn = document.getElementById('footer-privacy-btn');
  const closeModalBtn = document.getElementById('close-privacy-modal');
  const configureBtn = document.getElementById('cookie-configure-btn');
  const essentialBtn = document.getElementById('cookie-essential-btn');
  const acceptBtn = document.getElementById('cookie-accept-btn');
  const saveCustomBtn = document.getElementById('save-custom-cookies');
  const acceptAllModalBtn = document.getElementById('accept-all-modal-cookies');
  const analyticsCheck = document.getElementById('consent-analytics');
  const marketingCheck = document.getElementById('consent-marketing');

  function saveConsent(analytics, marketing) {
    const payload = {
      necessary: true,
      analytics: Boolean(analytics),
      marketing: Boolean(marketing),
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Storage indisponível
    }
    if (banner) banner.hidden = true;
    if (modal) modal.hidden = true;
  }

  function openModal() {
    if (!modal) return;
    try {
      const saved = JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) || '{}');
      if (analyticsCheck) analyticsCheck.checked = Boolean(saved.analytics);
      if (marketingCheck) marketingCheck.checked = Boolean(saved.marketing);
    } catch {
      // Default desmarcado (opt-in explícito)
    }
    modal.hidden = false;
    closeModalBtn?.focus();
  }

  function closeModal() {
    if (modal) modal.hidden = true;
  }

  try {
    const existing = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!existing && banner) {
      banner.hidden = false;
    }
  } catch {
    if (banner) banner.hidden = false;
  }

  openModalBtn?.addEventListener('click', openModal);
  footerPrivacyBtn?.addEventListener('click', openModal);
  configureBtn?.addEventListener('click', openModal);
  closeModalBtn?.addEventListener('click', closeModal);

  essentialBtn?.addEventListener('click', () => saveConsent(false, false));
  acceptBtn?.addEventListener('click', () => saveConsent(true, true));
  acceptAllModalBtn?.addEventListener('click', () => saveConsent(true, true));
  saveCustomBtn?.addEventListener('click', () => {
    saveConsent(analyticsCheck?.checked, marketingCheck?.checked);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hidden) {
      closeModal();
    }
  });
}

/**
 * Rastreamento de Cliques em CTAs e Profundidade de Rolagem (GA4)
 */
function initTelemetryBindings() {
  document.querySelectorAll('[data-track-cta]').forEach((el) => {
    el.addEventListener('click', () => {
      const label = el.getAttribute('data-track-cta') || 'cta';
      trackEvent('cta_click', {
        cta_location: label,
        cta_label: (el.textContent || '').trim().slice(0, 60),
      });
    });
  });

  const thresholds = [25, 50, 75, 100];
  const fired = new Set();

  window.addEventListener(
    'scroll',
    () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((window.scrollY / docHeight) * 100);
      thresholds.forEach((t) => {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          trackEvent('scroll_depth', { percent_scrolled: t });
        }
      });
    },
    { passive: true }
  );
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  initLiveOperationalStatus();
  initMobileNav();
  initAnatomyTabs();
  initMenuFilterAndSearch();
  initContactForm();
  initPrivacyAndCookies();
  initTelemetryBindings();
});
