const header = document.querySelector('.site-header');
const menu = document.querySelector('.nav-links');
const toggle = document.querySelector('.menu-toggle');
const main = document.querySelector('main');
const siteTopography = document.querySelector('.site-topography');

// A textura fica dentro do conteúdo para manter a profundidade correta em cada seção.
if (main && siteTopography) {
  main.prepend(siteTopography);
  siteTopography.innerHTML = `
    <svg viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g class="contour-flow">
        <path d="M-65 127C30 13 178 3 286 72c90 57 112 146 64 218-45 67-128 95-219 77C33 346-35 249-65 127Z" />
        <path d="M-29 135C47 48 166 44 253 99c69 44 85 111 48 165-37 54-105 77-174 60C51 304-7 228-29 135Z" />
        <path d="M16 146c55-62 140-61 203-20 49 32 60 81 34 120-27 40-76 56-125 42-55-17-96-72-112-142Z" />
        <path d="M67 158c36-35 88-36 127-10 31 21 37 54 19 79-19 28-53 38-86 27-39-13-61-48-60-96Z" />
        <path d="M-70 387c112-65 210-39 278 20 65 56 128 64 193-6 71-77 127-92 189-38 61 53 133 54 217-21 86-77 183-63 278 14 58 47 112 57 171 28" />
        <path d="M-75 433c104-57 190-30 249 19 61 51 120 57 178-8 70-78 139-100 211-45 58 44 125 42 202-26 82-73 171-59 251 7 67 55 128 72 194 46" />
        <path d="M-79 480c94-49 166-25 218 15 57 44 109 49 165-12 66-72 143-105 222-51 57 39 115 32 187-29 73-62 153-48 226 10 73 59 140 82 213 60" />
        <path d="M-80 528c80-38 142-17 188 17 49 37 94 42 144-11 63-67 145-110 228-57 54 35 103 23 171-30 66-53 137-40 201 11 74 60 148 89 221 71" />
        <path d="M-72 578c65-27 113-10 153 17 43 30 81 34 127-10 60-59 146-113 229-61 50 31 94 15 156-27 59-40 121-29 177 14 70 54 148 85 222 73" />
        <path d="M333-55c65 11 109 52 109 106 0 54-37 91-94 119-58 29-75 73-35 125 43 56 49 113-7 158-66 53-86 111-34 171 54 63 58 126-3 187-48 48-63 105-39 176" />
        <path d="M381-58c55 15 91 50 91 93 0 45-32 76-82 101-54 27-65 67-29 115 41 55 42 102-8 142-58 47-75 101-28 156 51 59 50 112-5 167-44 45-55 98-32 159" />
        <path d="M693-40c89-13 172 25 199 88 25 59-4 114-66 147-60 32-73 80-28 130 48 53 49 112-15 160-69 51-86 109-31 169 57 63 51 132-18 184-48 36-64 81-51 142" />
        <path d="M731-4c71-12 138 19 160 70 20 48-4 91-55 118-55 30-64 72-25 115 45 49 42 98-14 140-62 46-75 98-27 151 52 57 44 112-17 158-42 32-54 70-44 120" />
        <path d="M936 56c84-48 182-25 226 46 42 68 15 152-58 195-61 37-88 94-53 147 39 58 114 73 184 44" />
        <path d="M964 97c63-35 137-17 171 37 32 51 12 114-43 146-52 31-71 77-42 118 31 45 90 56 145 35" />
        <path d="M991 135c43-24 94-11 117 27 21 35 7 76-31 98-38 22-49 57-28 86 22 31 60 39 98 26" />
        <path d="M-70 718c96-35 181-17 245 38 58 50 123 48 189-10 72-64 155-66 228-8 67 53 145 58 224 12 83-49 170-43 253 12 55 37 111 46 171 28" />
        <path d="M-68 765c88-27 162-9 217 35 56 45 113 43 172-8 69-59 148-61 215-7 62 49 132 52 204 10 78-45 161-40 237 9 62 40 127 52 196 38" />
        <path d="M-52 812c76-20 140-4 188 33 50 39 99 37 153-7 64-52 136-54 197-5 57 45 120 48 187 10 70-39 145-36 214 5 65 39 135 55 207 46" />
      </g>
    </svg>`;
}

const scrollProgress = document.querySelector('.scroll-progress span');
const navSectionLinks = [...menu.querySelectorAll('a[href^="#"]')];
const trackedSections = navSectionLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const syncScrollUi = () => {
  header.classList.toggle('scrolled', scrollY > 18);
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  const progress = scrollable > 0 ? Math.min(1, Math.max(0, scrollY / scrollable)) : 0;
  scrollProgress?.style.setProperty('--scroll-progress', progress);

  const marker = scrollY + Math.min(innerHeight * .36, 330);
  let activeId = '';
  trackedSections.forEach(section => {
    if (section.offsetTop <= marker) activeId = section.id;
  });
  navSectionLinks.forEach(link => {
    const active = link.getAttribute('href') === `#${activeId}`;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
};
addEventListener('scroll', syncScrollUi, { passive: true });
addEventListener('resize', syncScrollUi, { passive: true });
syncScrollUi();

toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open'); toggle.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
}));

document.querySelectorAll('.brand[href="#topo"]').forEach(brand => brand.addEventListener('click', event => {
  event.preventDefault();
  menu.classList.remove('open');
  toggle.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', '#topo');
}));

// A grade de redes entra como um conjunto, no mesmo ritmo do setup.
const socialGrid = document.querySelector('#redes .social-grid');
if (socialGrid) {
  socialGrid.classList.add('reveal', 'delay-1');
  socialGrid.querySelectorAll('.social-card').forEach(card => {
    card.classList.remove('reveal', 'visible', 'exit-up', 'delay-1', 'delay-2', 'delay-3', 'delay-4');
  });
}

document.querySelectorAll('[data-social-tabs]').forEach(tabGroup => {
  const controls = [...tabGroup.querySelectorAll('[data-social-tab]')];
  const panels = [...tabGroup.querySelectorAll('[role="tabpanel"]')];
  const activateTab = name => {
    controls.forEach(control => {
      const active = control.dataset.socialTab === name;
      control.setAttribute('aria-selected', String(active));
      control.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => {
      const active = panel.id === `tab-${name}`;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
  };
  controls.forEach((control, index) => {
    control.addEventListener('click', () => activateTab(control.dataset.socialTab));
    control.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return;
      event.preventDefault();
      const next = (index + (event.key === 'ArrowRight' ? 1 : controls.length - 1)) % controls.length;
      controls[next].focus();
      activateTab(controls[next].dataset.socialTab);
    });
  });
});

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
  } else {
    entry.target.classList.remove('visible');
    entry.target.classList.toggle('exit-up', entry.boundingClientRect.bottom <= 0);
  }
}), { threshold: .12 });
const revealElements = [...document.querySelectorAll('.reveal')];
revealElements.forEach(el => observer.observe(el));

// Fallback leve para navegadores que atrasam o Intersection Observer perto do fim da página.
let revealFrame;
const syncReveals = () => {
  revealFrame = null;
  revealElements.forEach(el => {
    const bounds = el.getBoundingClientRect();
    const inView = bounds.top < innerHeight * .88 && bounds.bottom > innerHeight * .12;
    if (inView) el.classList.add('visible');
    else {
      el.classList.remove('visible');
      el.classList.toggle('exit-up', bounds.bottom <= 0);
    }
  });
};
const queueRevealSync = () => {
  if (!revealFrame) revealFrame = requestAnimationFrame(syncReveals);
};
addEventListener('scroll', queueRevealSync, { passive: true });
addEventListener('resize', queueRevealSync, { passive: true });
queueRevealSync();

document.querySelector('#year').textContent = new Date().getFullYear();
// A contagem é consultada pela função segura da Vercel; a chave não fica exposta no navegador.
const youtubeSubscribersEndpoint = document.body.dataset.youtubeSubscribersEndpoint || '/api/youtube-subscribers';
const subscriberTargets = document.querySelectorAll('[data-youtube-subscribers]');
const numberFormatter = new Intl.NumberFormat('pt-BR');
const subscriberAnimations = new WeakMap();
const animateSubscriberCount = (target, endValue) => {
  const end = Number(endValue);
  if (!Number.isFinite(end)) return;
  const current = Number(target.textContent.replace(/\D/g, ''));
  const firstAnimation = target.dataset.countAnimated !== 'true';
  const start = firstAnimation ? Math.max(0, Math.round(end * .84)) : (Number.isFinite(current) ? current : 0);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || start === end) {
    target.textContent = numberFormatter.format(end);
    target.dataset.countAnimated = 'true';
    return;
  }
  cancelAnimationFrame(subscriberAnimations.get(target));
  const startedAt = performance.now();
  const duration = 1050;
  const step = now => {
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    target.textContent = numberFormatter.format(Math.round(start + (end - start) * eased));
    if (progress < 1) subscriberAnimations.set(target, requestAnimationFrame(step));
    else target.dataset.countAnimated = 'true';
  };
  subscriberAnimations.set(target, requestAnimationFrame(step));
};
const updateSubscriberCount = async () => {
  if (!subscriberTargets.length || location.protocol === 'file:') return;
  try {
    const response = await fetch(youtubeSubscribersEndpoint, { cache: 'no-store' });
    if (!response.ok) throw new Error('Não foi possível consultar o YouTube.');
    const { subscriberCount } = await response.json();
    const count = Number(subscriberCount);
    if (!Number.isFinite(count)) return;
    subscriberTargets.forEach(target => animateSubscriberCount(target, count));
  } catch (error) {
    console.warn('A contagem de inscritos não foi atualizada.', error);
  }
};
updateSubscriberCount();
setInterval(updateSubscriberCount, 5 * 60 * 1000);

// O status é consultado pela função segura da Vercel; nenhuma credencial fica exposta no navegador.
const twitchStatusEndpoint = document.body.dataset.twitchStatusEndpoint || '/api/twitch-status';
const twitchStatuses = [...document.querySelectorAll('[data-twitch-status]')];
const twitchTag = document.querySelector('.tag-live');
const twitchDetails = document.querySelector('[data-twitch-details]');
const twitchTitle = document.querySelector('[data-twitch-title]');
const twitchGame = document.querySelector('[data-twitch-game]');
const twitchViewers = document.querySelector('[data-twitch-viewers]');
const setTwitchState = stream => {
  const live = Boolean(stream?.live);
  const text = live ? 'Twitch · Ao vivo' : 'Twitch · Offline';
  twitchStatuses.forEach(status => { status.textContent = text; });
  twitchTag.classList.toggle('is-live', live);
  twitchTag.setAttribute('aria-label', live ? `Twitch ao vivo: ${stream.title || 'Live agora'}` : 'Twitch de Yuuketts: offline');
  if (!twitchDetails) return;
  twitchDetails.hidden = !live;
  if (!live) return;
  twitchTitle.textContent = stream.title || 'Live agora';
  twitchGame.textContent = stream.gameName || 'Ao vivo';
  twitchViewers.textContent = numberFormatter.format(Number(stream.viewerCount) || 0);
};
const updateTwitchStatus = async () => {
  if (!twitchStatuses.length || !twitchTag) return;
  if (location.protocol === 'file:') {
    setTwitchState({ live: false });
    return;
  }
  try {
    const response = await fetch(twitchStatusEndpoint, { cache: 'no-store' });
    if (!response.ok) throw new Error('Não foi possível consultar a Twitch.');
    const stream = await response.json();
    setTwitchState(stream);
  } catch (error) {
    setTwitchState({ live: false });
    console.warn('O status da Twitch não foi atualizado.', error);
  }
};
updateTwitchStatus();
setInterval(updateTwitchStatus, 90 * 1000);

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
const cursorGlow = document.querySelector('.cursor-glow');
const heroVisual = document.querySelector('.hero-visual');
let cursorFrame;
let latestPointer;

const renderPointerEffects = () => {
  cursorFrame = null;
  if (!latestPointer) return;
  const { clientX, clientY } = latestPointer;
  cursorGlow.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
  if (!heroVisual) return;
  const bounds = heroVisual.getBoundingClientRect();
  const insideHero = clientX >= bounds.left && clientX <= bounds.right && clientY >= bounds.top && clientY <= bounds.bottom;
  if (!insideHero) return;
  heroVisual.style.setProperty('--parallax-x', `${((clientX - (bounds.left + bounds.width / 2)) / bounds.width) * 18}px`);
  heroVisual.style.setProperty('--parallax-y', `${((clientY - (bounds.top + bounds.height / 2)) / bounds.height) * 14}px`);
  heroVisual.style.setProperty('--hero-tilt-x', `${((clientY - (bounds.top + bounds.height / 2)) / bounds.height) * -7}deg`);
  heroVisual.style.setProperty('--hero-tilt-y', `${((clientX - (bounds.left + bounds.width / 2)) / bounds.width) * 8}deg`);
};

if (finePointer && !reducedMotion && cursorGlow) {
  addEventListener('pointermove', event => {
    latestPointer = event;
    cursorGlow.style.opacity = '1';
    if (!cursorFrame) cursorFrame = requestAnimationFrame(renderPointerEffects);
  }, { passive: true });
  addEventListener('mouseout', event => {
    if (!event.relatedTarget) cursorGlow.style.opacity = '0';
  });
  heroVisual?.addEventListener('pointerleave', () => {
    heroVisual.style.setProperty('--parallax-x', '0px');
    heroVisual.style.setProperty('--parallax-y', '0px');
    heroVisual.style.setProperty('--hero-tilt-x', '0deg');
    heroVisual.style.setProperty('--hero-tilt-y', '0deg');
  });
  const bindCardTilt = (selector, intensity) => document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();
      const horizontal = (event.clientX - (bounds.left + bounds.width / 2)) / bounds.width;
      const vertical = (event.clientY - (bounds.top + bounds.height / 2)) / bounds.height;
      card.style.setProperty('--mouse-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--mouse-y', `${event.clientY - bounds.top}px`);
      card.style.setProperty('--tilt-x', `${vertical * -intensity}deg`);
      card.style.setProperty('--tilt-y', `${horizontal * intensity}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
  bindCardTilt('.social-card', 4);
  bindCardTilt('.setup-card', 2.4);
  bindCardTilt('.video-player, .support-box', 1.8);
  bindCardTilt('.social-tab-panel', 2.1);
  bindCardTilt('.social-tab-panel__aside', 1.3);
  bindCardTilt('.app-card', 2.4);
}

// Curvas topográficas: desenhadas uma única vez em toda a página.
// Assim, elas fazem parte do documento e acompanham o scroll sem atraso ou blocos de redesenho.
const topoCanvas = document.querySelector('main > .topography-canvas');
if (topoCanvas) {
  const context = topoCanvas.getContext('2d', { alpha: true });
  const segments = {
    0: [], 1: [[3, 0]], 2: [[0, 1]], 3: [[3, 1]], 4: [[1, 2]],
    5: [[3, 2], [0, 1]], 6: [[0, 2]], 7: [[3, 2]], 8: [[2, 3]],
    9: [[0, 2]], 10: [[0, 3], [1, 2]], 11: [[1, 2]], 12: [[1, 3]],
    13: [[0, 1]], 14: [[3, 0]], 15: []
  };
  let viewportWidth = 0;
  let viewportHeight = 0;
  let cellSize = 42;

  const resizeTopography = () => {
    const host = topoCanvas.parentElement;
    viewportWidth = Math.ceil(host.clientWidth);
    viewportHeight = Math.ceil(host.scrollHeight);
    // Uma resolução lógica evita um canvas gigantesco em páginas longas e mantém o scroll leve.
    cellSize = Math.max(38, Math.round(viewportWidth / 32));
    topoCanvas.width = viewportWidth;
    topoCanvas.height = viewportHeight;
    context.setTransform(1, 0, 0, 1, 0, 0);
  };

  const field = (x, y) => {
    const wave = Math.sin(x * .0055) * .68 + Math.cos(y * .0068) * .56;
    const fold = Math.sin((x + y) * .0042) * .42 + Math.cos((x - y) * .0032) * .32;
    const blobOne = Math.hypot(x - viewportWidth * .24, y - viewportHeight * .21);
    const blobTwo = Math.hypot(x - viewportWidth * .73, y - viewportHeight * .57);
    return wave + fold + Math.sin(blobOne * .0095) * .45 + Math.cos(blobTwo * .0085) * .4;
  };

  const edgePoint = (edge, values, threshold, x, y) => {
    const corners = [[x, y], [x + cellSize, y], [x + cellSize, y + cellSize], [x, y + cellSize]];
    const pairs = [[0, 1], [1, 2], [2, 3], [3, 0]];
    const [first, second] = pairs[edge];
    const amount = (threshold - values[first]) / (values[second] - values[first]);
    return [corners[first][0] + (corners[second][0] - corners[first][0]) * amount, corners[first][1] + (corners[second][1] - corners[first][1]) * amount];
  };

  const drawTopography = () => {
    context.clearRect(0, 0, viewportWidth, viewportHeight);
    context.lineWidth = .78;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = '#1a1a1a';
    const levels = [-1.12, -.7, -.28, .14, .56];
    for (const threshold of levels) {
      context.beginPath();
      for (let y = -cellSize; y < viewportHeight + cellSize; y += cellSize) {
        for (let x = -cellSize; x < viewportWidth + cellSize; x += cellSize) {
          const values = [field(x, y), field(x + cellSize, y), field(x + cellSize, y + cellSize), field(x, y + cellSize)];
          const index = (values[0] > threshold ? 1 : 0) | (values[1] > threshold ? 2 : 0) | (values[2] > threshold ? 4 : 0) | (values[3] > threshold ? 8 : 0);
          for (const [from, to] of segments[index]) {
            const start = edgePoint(from, values, threshold, x, y);
            const end = edgePoint(to, values, threshold, x, y);
            context.moveTo(start[0], start[1]);
            context.lineTo(end[0], end[1]);
          }
        }
      }
      context.stroke();
    }
  };

  const redrawTopography = () => {
    resizeTopography();
    drawTopography();
  };

  let resizeFrame;
  addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(redrawTopography);
  }, { passive: true });

  redrawTopography();
  // Fontes e imagens podem ajustar a altura final logo após a primeira pintura.
  addEventListener('load', () => requestAnimationFrame(redrawTopography), { once: true });
}
