/**
 * DOMBURIYA BY HACHIMITSU — BLINK INTERACTIVITY MODULE
 * - Efeito do ícone iFood piscando (Hover na Web + Ao abrir a página no Celular)
 * - Carrossel tátil de 4 pratos principais (Swipe + Setas + Barras retangulares)
 * - Status de funcionamento ao vivo no fuso de Brasília (America/Sao_Paulo)
 * - Modais funcionais de Política de Privacidade, Termos de Uso e Consentimento LGPD
 */

(function () {
  'use strict';

  /* ========================================================================
     1. EFEITO DO ÍCONE DO IFOOD PISCANDO (WEB HOVER + MOBILE PAGE OPEN)
     ======================================================================== */
  function initIfoodWink() {
    var ifoodBtns = document.querySelectorAll('.btn-ifood');
    if (!ifoodBtns.length) return;

    var isMobileOrTouch =
      window.matchMedia('(hover: none), (pointer: coarse), (max-width: 900px)').matches;

    function triggerMobileWink() {
      ifoodBtns.forEach(function (btn) {
        btn.classList.add('is-mobile-winking');
      });
    }

    if (isMobileOrTouch) {
      triggerMobileWink();
    }

    // Caso o usuário redimensione ou abra em webview mobile
    window.addEventListener('load', function () {
      if (window.matchMedia('(hover: none), (pointer: coarse), (max-width: 900px)').matches) {
        triggerMobileWink();
      }
    });
  }

  /* ========================================================================
     2. STATUS DE FUNCIONAMENTO AO VIVO (GLEBA, CENTRO, MARINGÁ)
     ======================================================================== */
  function initLiveUnitStatus() {
    var statusBadge = document.getElementById('unit-live-status');
    var statusText = document.getElementById('unit-live-text');
    if (!statusBadge || !statusText) return;

    var unitType = statusBadge.getAttribute('data-unit') || 'gleba';
    if (unitType === 'maringa') {
      // Unidade Maringá em fase de pré-inauguração
      return;
    }

    try {
      var now = new Date();
      var spString = now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' });
      var spDate = new Date(spString);
      var day = spDate.getDay(); // 0 = Dom, 1..6 = Seg..Sáb
      var minutes = spDate.getHours() * 60 + spDate.getMinutes();

      var lunchStart = 11 * 60;       // 11:00
      var buffetEnd = 14 * 60 + 30;   // 14:30
      var lunchEnd = 15 * 60 + 30;    // 15:30
      var dinnerStart = 17 * 60;      // 17:00
      var dinnerEnd = 22 * 60;        // 22:00

      var isWeekdayOrSat = day >= 1 && day <= 6;
      var isLunch = isWeekdayOrSat && minutes >= lunchStart && minutes < lunchEnd;
      var isDinner = isWeekdayOrSat && minutes >= dinnerStart && minutes < dinnerEnd;

      statusBadge.classList.remove('is-open', 'is-closed');

      if (isLunch || isDinner) {
        statusBadge.classList.add('is-open');
        if (unitType === 'centro' && isLunch && minutes < buffetEnd) {
          statusText.textContent = 'Aberto Agora · Buffet & À La Carte';
        } else if (isLunch) {
          statusText.textContent = 'Aberto Agora · Almoço até 15h30';
        } else {
          statusText.textContent = 'Aberto Agora · Jantar até 22h';
        }
      } else {
        statusBadge.classList.add('is-closed');
        if (day === 0) {
          statusText.textContent = 'Fechado hoje · Abre Seg às 11h';
        } else if (minutes < lunchStart) {
          statusText.textContent = 'Abre hoje às 11h00';
        } else if (minutes >= lunchEnd && minutes < dinnerStart) {
          statusText.textContent = 'Reabre hoje às 17h00';
        } else {
          statusText.textContent = day === 6 ? 'Abre Seg às 11h00' : 'Abre amanhã às 11h00';
        }
      }
    } catch (e) {
      // Mantém texto padrão caso o navegador bloqueie Intl timeZone
    }
  }

  /* ========================================================================
     3. CARROSSEL COM 4 PRODUTOS PRINCIPAIS (SWIPE + SETAS + BARRAS)
     ======================================================================== */
  function initDishesCarousel() {
    var track = document.getElementById('blink-carousel-track');
    var prevBtn = document.getElementById('carousel-prev');
    var nextBtn = document.getElementById('carousel-next');
    var bars = document.querySelectorAll('.carousel-bar');
    var viewport = document.getElementById('blink-carousel-viewport');

    if (!track || !bars.length) return;

    var total = bars.length;
    var current = 0;
    var autoTimer = null;
    var touchStartX = 0;
    var touchEndX = 0;

    function goToSlide(index) {
      current = (index + total) % total;
      track.style.transform = 'translateX(-' + current * 100 + '%)';
      bars.forEach(function (bar, i) {
        var active = i === current;
        bar.classList.toggle('is-active', active);
        bar.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }

    function startAuto() {
      stopAuto();
      autoTimer = window.setInterval(function () {
        goToSlide(current + 1);
      }, 4800);
    }

    function stopAuto() {
      if (autoTimer) {
        window.clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goToSlide(current - 1);
        startAuto();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goToSlide(current + 1);
        startAuto();
      });
    }

    bars.forEach(function (bar, idx) {
      bar.addEventListener('click', function () {
        goToSlide(idx);
        startAuto();
      });
    });

    if (viewport) {
      viewport.addEventListener('mouseenter', stopAuto);
      viewport.addEventListener('mouseleave', startAuto);

      viewport.addEventListener(
        'touchstart',
        function (e) {
          stopAuto();
          if (e.changedTouches && e.changedTouches[0]) {
            touchStartX = e.changedTouches[0].screenX;
          }
        },
        { passive: true }
      );

      viewport.addEventListener(
        'touchend',
        function (e) {
          if (e.changedTouches && e.changedTouches[0]) {
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 36) {
              if (diff > 0) {
                goToSlide(current + 1);
              } else {
                goToSlide(current - 1);
              }
            }
          }
          startAuto();
        },
        { passive: true }
      );
    }

    startAuto();
  }

  /* ========================================================================
     4. RODAPÉ FUNCIONAL: MODAIS DE PRIVACIDADE, TERMOS E BANNER LGPD
     ======================================================================== */
  function initLegalAndCompliance() {
    var yearEl = document.getElementById('blink-current-year');
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }

    // Abertura e fechamento de <dialog>
    var openButtons = document.querySelectorAll('[data-open-dialog]');
    openButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-open-dialog');
        var dialog = document.getElementById(targetId);
        if (dialog && typeof dialog.showModal === 'function') {
          dialog.showModal();
        } else if (dialog) {
          dialog.setAttribute('open', 'open');
        }
      });
    });

    var closeButtons = document.querySelectorAll('[data-close-dialog]');
    closeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dialog = btn.closest('dialog');
        if (dialog && typeof dialog.close === 'function') {
          dialog.close();
        } else if (dialog) {
          dialog.removeAttribute('open');
        }
      });
    });

    var dialogs = document.querySelectorAll('dialog.legal-dialog');
    dialogs.forEach(function (dialog) {
      dialog.addEventListener('click', function (e) {
        var rect = dialog.getBoundingClientRect();
        var clickedOutside =
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom;
        if (clickedOutside && typeof dialog.close === 'function') {
          dialog.close();
        }
      });
    });

    // Consentimento LGPD
    var STORAGE_KEY = 'domburiya_blink_lgpd_v1';
    var banner = document.getElementById('blink-cookie-banner');
    var acceptBtn = document.getElementById('blink-cookie-accept');
    var rejectBtn = document.getElementById('blink-cookie-reject');
    var prefsBtn = document.getElementById('blink-cookie-prefs');

    if (!banner) return;

    var savedConsent = null;
    try {
      savedConsent = window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      savedConsent = null;
    }

    if (!savedConsent) {
      banner.hidden = false;
    }

    function saveChoice(value) {
      try {
        window.localStorage.setItem(STORAGE_KEY, value);
      } catch (e) {
        // Ignora erro de storage em modo privado
      }
      banner.hidden = true;
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        saveChoice('accepted');
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', function () {
        saveChoice('essential_only');
      });
    }

    if (prefsBtn) {
      prefsBtn.addEventListener('click', function () {
        banner.hidden = false;
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initIfoodWink();
      initLiveUnitStatus();
      initDishesCarousel();
      initLegalAndCompliance();
    });
  } else {
    initIfoodWink();
    initLiveUnitStatus();
    initDishesCarousel();
    initLegalAndCompliance();
  }
})();
