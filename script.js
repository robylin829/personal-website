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
