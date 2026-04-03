(() => {
  const stripRoleEmojiFromCardCopy = (value = '') => String(value).replace(/(^|[\s（(【《“'‘])(?:[\u{1F300}-\u{1FAFF}\u2600-\u27BF]\uFE0F?\s*)+(?=[\u4E00-\u9FFF])/gu, '$1');
  const PANEL_THEME_CLASSES = ['theme-academy', 'theme-garden'];
  let panelObserver = null;

  const disconnectPanelObserver = () => {
    if (panelObserver) {
      panelObserver.disconnect();
      panelObserver = null;
    }
  };

  const cleanupMiniThemes = () => {
    const panel = document.getElementById('minigame-panel');
    if (!panel) return null;
    panel.classList.remove(...PANEL_THEME_CLASSES);
    return panel;
  };

  const setPanelTheme = (theme) => {
    const panel = cleanupMiniThemes();
    if (!panel) return null;
    panel.classList.add(`theme-${theme}`);
    return panel;
  };

  const ensureThemeStyleSheet = () => {
    if (document.getElementById('cb-mini-theme-style')) return;
    const style = document.createElement('style');
    style.id = 'cb-mini-theme-style';
    style.textContent = `
#minigame-panel.theme-academy .mg-icon{color:#8faec8}
#minigame-panel.theme-academy h3{color:#6f8fae;letter-spacing:0.16em}
#minigame-panel.theme-academy .mg-subtitle{color:var(--ui-muted);line-height:1.72}
#minigame-panel.theme-academy .mg-outfit{border-color:rgba(191,212,238,0.76);background-color:rgba(255,250,245,0.94)}
#minigame-panel.theme-academy .mg-outfit:hover,#minigame-panel.theme-academy .mg-outfit.selected{border-color:#bfd4ee;box-shadow:0 12px 24px rgba(191,212,238,0.2)}
#minigame-panel.theme-academy .outfit-icon{font-size:2rem;margin-bottom:0.28rem}
#minigame-panel.theme-academy .outfit-name{font-size:0.88rem;line-height:1.45;font-weight:700;color:var(--ui-text)}
#minigame-panel.theme-academy .outfit-desc{font-size:0.74rem;line-height:1.62;color:var(--ui-muted);margin-top:0.14rem}
#minigame-panel.theme-academy .academy-price{margin-top:0.4rem;font-size:0.76rem;line-height:1.5;font-weight:700;color:#6f8fae}
#minigame-panel.theme-academy .academy-old-price{font-size:0.68rem;color:var(--ui-muted);text-decoration:line-through}
#minigame-panel.theme-academy .academy-skip-btn{background:rgba(255,255,255,0.64);border-color:var(--panel-border);color:var(--ui-text)}
#minigame-panel.theme-academy .academy-skip-btn:hover{background:#f4ece5;border-color:#d8b38d}
#minigame-panel.theme-academy .mg-result{font-size:0.94rem;line-height:1.72}
#minigame-panel.theme-academy .mg-result.win{background:rgba(191,212,238,0.2);border:1px solid #bfd4ee;color:var(--ui-text)}
#minigame-panel.theme-academy .mg-result.win strong{color:#6f8fae}
#minigame-panel.theme-academy .mg-close-btn{background:#bfd4ee;border-color:#bfd4ee;color:#fffaf7}
#minigame-panel.theme-academy .mg-close-btn:hover{background:#aac6e2}
#minigame-panel.theme-garden .mg-icon{color:#8dad90}
#minigame-panel.theme-garden h3{color:#6f9672;letter-spacing:0.16em}
#minigame-panel.theme-garden .mg-subtitle{color:var(--ui-muted);line-height:1.72}
#minigame-panel.theme-garden .garden-subnote{display:block;margin-top:0.18rem;font-size:0.78rem;color:var(--ui-muted)}
#minigame-panel.theme-garden .mg-outfit-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:0.85rem}
#minigame-panel.theme-garden .mg-outfit{padding:0.95rem 0.72rem;border-color:rgba(199,226,202,0.78);background-color:rgba(255,250,245,0.94);text-align:center}
#minigame-panel.theme-garden .mg-outfit:hover,#minigame-panel.theme-garden .mg-outfit.selected{border-color:#c7e2ca;box-shadow:0 12px 24px rgba(154,205,189,0.18)}
#minigame-panel.theme-garden .garden-choice-icon{font-size:2.05rem;margin-bottom:0.34rem}
#minigame-panel.theme-garden .garden-choice-title{font-size:0.88rem;line-height:1.42;font-weight:700}
#minigame-panel.theme-garden .garden-choice-desc{font-size:0.74rem;line-height:1.58;color:var(--ui-muted);margin-top:0.16rem}
#minigame-panel.theme-garden .garden-choice-bias{margin-top:0.34rem;font-size:0.72rem;line-height:1.45;font-weight:600}
#minigame-panel.theme-garden .tone-awakening{color:#b186b0}
#minigame-panel.theme-garden .tone-favor{color:#c88a90}
#minigame-panel.theme-garden .tone-treasure{color:#ba9562}
`;
    document.head.appendChild(style);
  };

  const normalizeAcademyPanel = (panel) => {
    if (!panel) return;

    const title = panel.querySelector('h3');
    if (title) {
      if (title.textContent !== '学堂') title.textContent = '学堂';
      if (title.hasAttribute('style')) title.removeAttribute('style');
    }

    const icon = panel.querySelector('.mg-icon');
    if (icon && !icon.classList.contains('mg-board-icon-wrap') && icon.textContent !== '📖') icon.textContent = '📖';


    panel.querySelectorAll('.mg-outfit .outfit-name, .mg-outfit .outfit-desc').forEach((el) => {
      el.removeAttribute('style');
    });

    panel.querySelectorAll('.mg-outfit').forEach((card) => {
      const priceLine = Array.from(card.children).find((child) => /两/.test(child.textContent || ''));
      if (priceLine) {
        priceLine.classList.add('academy-price');
        priceLine.removeAttribute('style');
        priceLine.querySelectorAll('span').forEach((span) => {
          if (span.hasAttribute('style')) {
            span.classList.add('academy-old-price');
            span.removeAttribute('style');
          }
        });
      }
    });

    const leaveBtn = panel.querySelector('#mg-leave');
    if (leaveBtn) {
      leaveBtn.classList.add('academy-skip-btn');
      if (leaveBtn.hasAttribute('style')) leaveBtn.removeAttribute('style');
      if (leaveBtn.textContent !== '今天不学，跳过') leaveBtn.textContent = '今天不学，跳过';
    }

    const closeBtn = panel.querySelector('#mg-close');
    if (closeBtn) {
      if (closeBtn.hasAttribute('style')) closeBtn.removeAttribute('style');
      if (closeBtn.textContent !== '继续游戏') closeBtn.textContent = '继续游戏';
    }

    const result = panel.querySelector('.mg-result');
    if (result && result.hasAttribute('style')) result.removeAttribute('style');
  };

  const normalizeGardenPanel = (panel) => {
    if (!panel) return;

    const title = panel.querySelector('h3');
    if (title) {
      if (title.textContent !== '御花园') title.textContent = '御花园';
      if (title.hasAttribute('style')) title.removeAttribute('style');
    }


    const subNote = panel.querySelector('.mg-subtitle span');
    if (subNote) {
      subNote.classList.add('garden-subnote');
      if (subNote.hasAttribute('style')) subNote.removeAttribute('style');
    }

    const grid = panel.querySelector('.mg-outfit-grid');
    if (grid && grid.hasAttribute('style')) grid.removeAttribute('style');


    panel.querySelectorAll('.mg-outfit').forEach((card) => {
      const toneClass = card.dataset.choice === 'awakening'
        ? 'tone-awakening'
        : card.dataset.choice === 'favor'
          ? 'tone-favor'
          : 'tone-treasure';

      card.removeAttribute('style');
      card.classList.add('garden-choice');

      const icon = card.querySelector('.outfit-icon');
      if (icon) {
        icon.classList.add('garden-choice-icon');
        icon.removeAttribute('style');
      }

      const titleEl = card.querySelector('.outfit-name');
      if (titleEl) {
        titleEl.classList.add('garden-choice-title', toneClass);
        titleEl.removeAttribute('style');
      }

      const desc = card.querySelector('.outfit-desc');
      if (desc) {
        desc.classList.add('garden-choice-desc');
        desc.removeAttribute('style');
      }

      const bias = Array.from(card.children).find((child) => /^偏向/.test((child.textContent || '').trim()));
      if (bias) {
        bias.classList.add('garden-choice-bias', toneClass);
        bias.removeAttribute('style');
      }
    });
  };

  const watchPanel = (theme, normalize) => {
    disconnectPanelObserver();
    const panel = document.getElementById('minigame-panel');
    if (!panel) return;

    const themeClass = `theme-${theme}`;
    let normalizing = false;

    const applyNormalization = () => {
      if (normalizing) return;
      normalizing = true;
      panel.classList.add(themeClass);
      normalize(panel);
      normalizing = false;
    };

    applyNormalization();

    panelObserver = new MutationObserver(() => {
      applyNormalization();
    });

    panelObserver.observe(panel, {
      childList: true,
      subtree: true,
    });
  };


  const wrapCleanupOnly = (fnName) => {
    if (typeof window[fnName] !== 'function') return;
    const original = window[fnName];
    window[fnName] = function(...args) {
      disconnectPanelObserver();
      cleanupMiniThemes();
      return original.apply(this, args);
    };
  };

  const installUiPatch = () => {
    if (window.__uiConsistencyPatched) return;
    window.__uiConsistencyPatched = true;
    ensureThemeStyleSheet();

    if (typeof window.showEventCard === 'function') {
      const originalShowEventCard = window.showEventCard;
      window.showEventCard = function(opts = {}) {
        const effect = String(opts.effect ?? '');
        if (effect.includes('→') && /两/.test(effect)) {
          opts = {
            ...opts,
            text: stripRoleEmojiFromCardCopy(opts.text ?? ''),
            effect: stripRoleEmojiFromCardCopy(effect),
          };
        }
        return originalShowEventCard(opts);
      };
    }

    if (typeof window.showAcademyMenu === 'function') {
      const originalShowAcademyMenu = window.showAcademyMenu;
      window.showAcademyMenu = function(...args) {
        disconnectPanelObserver();
        const result = originalShowAcademyMenu.apply(this, args);
        const panel = setPanelTheme('academy');
        if (panel) watchPanel('academy', normalizeAcademyPanel);
        return result;
      };
    }

    if (typeof window.showGardenMenu === 'function') {
      const originalShowGardenMenu = window.showGardenMenu;
      window.showGardenMenu = function(...args) {
        disconnectPanelObserver();
        const result = originalShowGardenMenu.apply(this, args);
        const panel = setPanelTheme('garden');
        if (panel) watchPanel('garden', normalizeGardenPanel);
        return result;
      };
    }

    ['showArenaMenu', 'startGuessGame', 'startRPSGame', 'showBeautyMenu', 'showBeautyJudging', 'handleBanquet'].forEach(wrapCleanupOnly);

    if (typeof window.showWheelResult === 'function') {
      const originalShowWheelResult = window.showWheelResult;
      window.showWheelResult = function(...args) {
        disconnectPanelObserver();
        cleanupMiniThemes();
        return originalShowWheelResult.apply(this, args);
      };
    }

    if (typeof window.startWheelGame === 'function') {
      window.startWheelGame = function(player) {
        disconnectPanelObserver();
        cleanupMiniThemes();

        const panel = document.getElementById('minigame-panel');
        const numSections = WHEEL_SECTIONS.length;
        const anglePerSection = 360 / numSections;
        const wheelSrc = './比武游戏/转盘圆盘.png';

        panel.innerHTML = `
          ${getArenaGameHeaderIconHTML('wheel','命运转盘')}
          <h3>命运转盘</h3>
          <div class="mg-subtitle">点击转盘，看命运如何安排！</div>
          <div class="mg-wheel-container">
            <div class="mg-wheel-pointer">🔻</div>
            <div class="mg-wheel-img-wrap">
              <img id="mg-wheel-img" class="mg-wheel-img" src="${wheelSrc}" style="cursor:pointer" />
            </div>
          </div>
          <div class="mg-subtitle" id="mg-wheel-hint" style="margin-top:0.5rem">点击转盘开始</div>
        `;

        const wheelImg = document.getElementById('mg-wheel-img');

        wheelImg.addEventListener('click', () => {
          wheelImg.style.pointerEvents = 'none';
          document.getElementById('mg-wheel-hint').textContent = '转盘旋转中...';
          const resultIdx = Math.floor(Math.random() * numSections);
          const targetSectionAngle = resultIdx * anglePerSection;
          const totalSpin = 360 * 5 + (360 - targetSectionAngle + anglePerSection / 2);
          let startTime = null;
          const duration = 3500;

          function animateSpin(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const angle = eased * totalSpin;
            wheelImg.style.transform = 'rotate(' + angle + 'deg)';

            if (progress < 1) {
              requestAnimationFrame(animateSpin);
            } else {
              setTimeout(() => showWheelResult(player, resultIdx), 500);
            }
          }

          requestAnimationFrame(animateSpin);
        }, { once: true });
      };
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installUiPatch, { once: true });
  } else {
    installUiPatch();
  }
})();
