const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const progress = document.querySelector('.page-progress span');
const character = document.querySelector('[data-character]');
const pointerLight = document.querySelector('.pointer-light');

document.querySelector('#year').textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.nav__links a').forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { threshold: .15, rootMargin: '-35% 0px -55% 0px' });
document.querySelectorAll('section[id]').forEach(section => sectionObserver.observe(section));

let scrollFrame = null;
const syncScroll = () => {
  scrollFrame = null;
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  progress.style.transform = `scaleX(${Math.min(1, scrollY / max)})`;
  if (!reducedMotion && character && scrollY < innerHeight * 1.2) {
    const heroProgress = Math.min(1, scrollY / innerHeight);
    character.style.setProperty('--char-y', `${heroProgress * 92}px`);
    character.style.setProperty('--char-x', `${heroProgress * 38}px`);
    character.style.setProperty('--char-r', `${heroProgress * 2.4}deg`);
    character.style.opacity = String(1 - heroProgress * .42);
  }
};
addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(syncScroll);
}, { passive: true });
syncScroll();

if (!reducedMotion && matchMedia('(pointer:fine)').matches) {
  addEventListener('pointermove', event => {
    pointerLight.style.opacity = '1';
    pointerLight.style.left = `${event.clientX}px`;
    pointerLight.style.top = `${event.clientY}px`;
  }, { passive: true });
  document.querySelectorAll('.project').forEach(card => {
    const media = card.querySelector('.project__media');
    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      media.style.transform = `perspective(1100px) rotateX(${y * -2.2}deg) rotateY(${x * 2.2}deg)`;
    });
    card.addEventListener('pointerleave', () => { media.style.transform = ''; });
  });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', link.getAttribute('href'));
  });
});


