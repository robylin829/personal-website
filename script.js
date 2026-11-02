const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
if ('IntersectionObserver' in window) {
  const links = [...navigation.querySelectorAll('a')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
document.querySelector('#year').textContent = new Date().getFullYear();

// Render curated public projects locally: no API key or live GitHub request needed.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const grid = document.querySelector('#project-grid');
const filters = document.querySelector('.project-filters');
const projectCount = document.querySelector('#project-count');
const activeAnimations = new Set();

function animateEntry(element, delay = 0) {
  if (reducedMotion.matches || !element.animate) return;
  const animation = element.animate([
    { opacity: 0, transform: 'translateY(22px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration: 600, delay, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
  activeAnimations.add(animation);
  animation.finished.catch(() => {}).finally(() => activeAnimations.delete(animation));
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function projectLink(label, url, className) {
  const link = makeElement('a', className, label);
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

function renderProjects(category = 'all', animate = false) {
  const selected = portfolioProjects.filter(project => category === 'all' || project.category === category);
  const fragment = document.createDocumentFragment();
  selected.forEach(project => {
    const card = makeElement('article', `project-card project-${project.category}`);
    const artwork = makeElement('div', 'project-artwork');
    artwork.setAttribute('aria-hidden', 'true');
    artwork.append(makeElement('span', 'project-symbol', project.symbol), makeElement('span', 'project-art-label', project.slug));
    const body = makeElement('div', 'project-body');
    const title = makeElement('h3', '', project.title);
    const tags = makeElement('div', 'tags');
    project.tags.forEach(tag => tags.append(makeElement('span', '', tag)));
    const details = makeElement('details', 'project-details');
    details.append(makeElement('summary', '', '作品筆記'), makeElement('p', '', project.detail));
    const links = makeElement('div', 'project-links');
    links.append(projectLink('查看原始碼 ↗', `https://github.com/robylin829/${project.slug}`, 'text-link'));
    if (project.demo) links.append(projectLink(`${project.demo.label} ↗`, project.demo.url, 'text-link'));
    body.append(makeElement('span', 'status', project.label), title,
      makeElement('p', 'project-subtitle', project.subtitle),
      makeElement('p', 'project-description', project.description), tags, details, links);
    card.append(artwork, body);
    fragment.append(card);
  });
  grid.replaceChildren(fragment);
  projectCount.textContent = `${selected.length} 件作品`;
  filters.querySelectorAll('button').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.filter === category));
  });
  if (animate) [...grid.children].forEach((card, index) => animateEntry(card, index * 55));
}

if (typeof portfolioProjects !== 'undefined' && grid && filters) {
  renderProjects();
  filters.hidden = false;
  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button || button.getAttribute('aria-pressed') === 'true') return;
    renderProjects(button.dataset.filter, true);
  });
}

// Animate only when a section enters view. Content is never hidden by CSS.
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateEntry(entry.target);
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.section-heading, .about-body, .section-label, .skills-grid article, .experience-row, .teaching-intro, .roadmap li, .life-photo, .life > div, .contact-section .wrap, .project-card').forEach(element => revealObserver.observe(element));
}

// Passive scroll listener, at most one layout read per animation frame.
const progress = document.querySelector('.reading-progress');
let progressFrame = 0;
function updateProgress() {
  progressFrame = 0;
  const range = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0})`;
}
function scheduleProgress() {
  if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
}
window.addEventListener('scroll', scheduleProgress, { passive: true });
window.addEventListener('resize', scheduleProgress);
if ('ResizeObserver' in window) new ResizeObserver(scheduleProgress).observe(document.body);
updateProgress();

// A small Canvas landscape: capped pixel ratio, paused outside the hero or hidden tabs.
const canvas = document.querySelector('#mountain-canvas');
const motionToggle = document.querySelector('#motion-toggle');
const context = canvas?.getContext('2d');
if (context) {
  let width = 0;
  let height = 0;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let inView = true;
  let manuallyPaused = false;

  function draw(time) {
    context.clearRect(0, 0, width, height);
    for (let layer = 0; layer < 4; layer++) {
      context.beginPath();
      context.strokeStyle = `rgba(64, 101, 76, ${0.09 + layer * 0.025})`;
      context.lineWidth = 1;
      for (let x = 0; x <= width + 6; x += 6) {
        const y = height * (0.58 + layer * 0.085)
          + Math.sin(x / 105 + layer * 0.8 + time * 0.14) * (19 + layer * 7)
          + Math.cos(x / 53 + layer + time * 0.09) * 9;
        if (x === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
    }
  }
  function tick(timestamp) {
    frame = 0;
    if (!lastTime || timestamp - lastTime >= 32) {
      elapsed += lastTime ? Math.min(timestamp - lastTime, 80) / 1000 : 0;
      lastTime = timestamp;
      draw(elapsed);
    }
    frame = requestAnimationFrame(tick);
  }
  function syncMotion() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    const paused = manuallyPaused || reducedMotion.matches;
    motionToggle.hidden = reducedMotion.matches;
    motionToggle.setAttribute('aria-pressed', String(paused));
    motionToggle.textContent = paused ? '播放山形動畫 ▷' : '暫停山形動畫 Ⅱ';
    if (!paused && inView && !document.hidden) frame = requestAnimationFrame(tick);
    else draw(elapsed);
  }
  function resizeCanvas() {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(elapsed);
  }
  motionToggle.addEventListener('click', () => {
    manuallyPaused = !manuallyPaused;
    syncMotion();
  });
  document.addEventListener('visibilitychange', syncMotion);
  reducedMotion.addEventListener('change', syncMotion);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      syncMotion();
    }).observe(canvas);
  }
  if ('ResizeObserver' in window) new ResizeObserver(resizeCanvas).observe(canvas);
  else window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  syncMotion();
}
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) activeAnimations.forEach(animation => animation.cancel());
});

// Load SoundCloud on the first music click or when the hiking section enters view.
(() => {
  const track = 'https://soundcloud.com/yuun_191224/surges-orangestar';
  const button = document.querySelector('#music-toggle');
  const panel = document.querySelector('#music-panel');
  const close = document.querySelector('#music-close');
  const status = document.querySelector('#music-status');
  const container = document.querySelector('#soundcloud-container');
  if (!button || !panel || !container) return;
  let widget;
  let iframe;
  let ready = false;
  let requested = false;
  let playing = false;
  let loading = false;
  let timeout;
  let playbackTimeout;
  let userControlled = false;
  let autoAttempted = false;

  function setPlaying(value) {
    playing = value;
    button.setAttribute('aria-pressed', String(value));
    const label = value ? '暫停背景音樂' : '播放背景音樂';
    button.setAttribute('aria-label', label);
    button.title = label;
    button.classList.toggle('is-playing', value);
  }
  function fail(message) {
    clearTimeout(playbackTimeout);
    clearTimeout(timeout);
    requested = false;
    setPlaying(false);
    status.textContent = message;
  }
  function attemptPlayback() {
    requested = true;
    clearTimeout(playbackTimeout);
    status.textContent = '準備播放… 若未開始，請點音符或播放器的播放鍵。';
    widget.play();
    playbackTimeout = setTimeout(() => {
      if (requested && !playing) {
        requested = false;
        status.textContent = '音樂尚未開始，請點一下右下角音符或播放器的播放鍵。';
      }
    }, 5000);
  }
  function connectWidget() {
    if (widget || !iframe) return;
    widget = SC.Widget(iframe);
    const events = SC.Widget.Events;
    widget.bind(events.READY, () => {
      clearTimeout(timeout);
      ready = true;
      status.textContent = '點音符或播放器即可播放。';
      if (requested && !panel.hidden) {
        attemptPlayback();
      }
    });
    widget.bind(events.PLAY, () => {
      clearTimeout(playbackTimeout);
      clearTimeout(timeout);
      requested = true;
      setPlaying(true);
      status.textContent = '播放中 · 再點音符即可暫停';
    });
    widget.bind(events.PAUSE, () => {
      const wasPlaying = playing;
      clearTimeout(playbackTimeout);
      userControlled = true;
      requested = false;
      setPlaying(false);
      status.textContent = wasPlaying
        ? '已暫停 · 點音符繼續播放'
        : '音樂尚未開始，請點一下右下角音符或播放器的播放鍵。';
    });
    widget.bind(events.FINISH, () => {
      requested = false;
      setPlaying(false);
      status.textContent = '播放結束 · 點音符重新聆聽';
    });
    widget.bind(events.ERROR, () => fail('目前無法播放，請使用下方連結前往 SoundCloud 聆聽。'));
  }
  function loadPlayer() {
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'soundcloud-player';
      iframe.title = 'SoundCloud：Surges / Orangestar，Yu 上傳';
      iframe.allow = 'autoplay';
      iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(track)}&color=%2328533f&auto_play=false&show_artwork=true&show_user=true&visual=false`;
      container.append(iframe);
    }
    if (window.SC?.Widget) { connectWidget(); return; }
    if (loading) return;
    loading = true;
    const api = document.createElement('script');
    api.src = 'https://w.soundcloud.com/player/api.js';
    api.async = true;
    api.onload = connectWidget;
    api.onerror = () => {
      loading = false;
      api.remove();
      fail('音符控制未能載入，請直接點播放器播放，或前往 SoundCloud 聆聽。');
    };
    timeout = setTimeout(() => fail('載入較久，請稍候再點音符或直接操作 SoundCloud 播放器。'), 15000);
    document.head.append(api);
  }
  button.hidden = false;
  button.addEventListener('click', () => {
    userControlled = true;
    clearTimeout(playbackTimeout);
    panel.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    if (ready) {
      if (playing || requested) {
        requested = false;
        widget.pause();
      } else {
        requested = true;
        attemptPlayback();
      }
    } else {
      requested = !requested;
      status.textContent = requested ? '正在載入 SoundCloud 音樂…' : '已取消播放，播放器仍會載入。';
      loadPlayer();
    }
  });
  function closePanel() {
    userControlled = true;
    clearTimeout(playbackTimeout);
    requested = false;
    if (widget) widget.pause();
    // If the API failed, unload the iframe so a native playback cannot continue unseen.
    if (!ready && iframe) {
      clearTimeout(timeout);
      if (widget) { widget.unbind(SC.Widget.Events.READY); widget = undefined; }
      iframe.remove();
      iframe = undefined;
    }
    setPlaying(false);
    panel.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    button.focus();
  }
  // One attempt per page visit; a manual play, pause or close takes precedence.
  const hikingSection = document.querySelector('#life');
  if (hikingSection && 'IntersectionObserver' in window) {
    const musicObserver = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.2)) return;
      musicObserver.disconnect();
      if (autoAttempted || userControlled || playing || requested) return;
      autoAttempted = true;
      requested = true;
      panel.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      status.textContent = '讓音樂陪你看山，正在準備播放…';
      if (ready) attemptPlayback();
      else loadPlayer();
    }, { threshold: 0.2 });
    musicObserver.observe(hikingSection);
  }
  close.addEventListener('click', closePanel);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) closePanel();
  });
})();
