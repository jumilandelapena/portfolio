/**
 * The one script behind the scroll behaviour: scrollspy, the scrolled header,
 * and the reveal fallback for browsers without scroll-driven animations.
 * Everything here is an enhancement; the page is complete without it.
 */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');

/** Runs `fn` at most once per frame while the document scrolls, and once now. */
function onScroll(fn: () => void): void {
  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        fn();
        ticking = false;
      });
    },
    { passive: true },
  );
  fn();
}

/**
 * Scrollspy: the nav link for the section in view gets aria-current="location".
 * "In view" means the last section whose top has passed a line 35% down the
 * viewport, or the last section once the page is scrolled to its end.
 */
function initScrollspy(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-link[href*="#"]'));
  const pairs = links
    .map((link) => ({ link, section: document.getElementById(link.hash.slice(1)) }))
    .filter((p): p is { link: HTMLAnchorElement; section: HTMLElement } => p.section !== null);
  if (pairs.length === 0) return;

  const update = (): void => {
    const line = window.innerHeight * 0.35;
    const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    let current: HTMLElement | null = null;
    for (const { section } of pairs) {
      if (section.getBoundingClientRect().top <= line) current = section;
    }
    if (atEnd) current = pairs[pairs.length - 1]?.section ?? current;
    for (const { link, section } of pairs) {
      if (section === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };
  onScroll(update);
  window.addEventListener('resize', update, { passive: true });
}

/** After 40px the header gets its translucent background and hairline. */
function initHeader(): void {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;
  onScroll(() => {
    header.dataset['scrolled'] = window.scrollY > 40 ? 'true' : 'false';
  });
}

/**
 * Reveal fallback. Only runs where CSS scroll-driven animations are missing and
 * motion is allowed. `data-reveal` is added to <html> only after the observer
 * exists, so content is never hidden without something to show it again, and a
 * safety timeout reveals everything if an observer never fires.
 */
function initRevealFallback(): void {
  if (REDUCED.matches) return;
  if (typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()')) return;
  if (!('IntersectionObserver' in window)) return;

  const items = Array.from(document.querySelectorAll<HTMLElement>('.reveal, .reveal-stagger > *'));
  if (items.length === 0) return;

  const root = document.documentElement;
  const revealAll = (): void => {
    for (const item of items) item.classList.add('is-visible');
    delete root.dataset['reveal'];
  };

  try {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );
    for (const item of items) observer.observe(item);
    root.dataset['reveal'] = 'true';
    // Anything still unrevealed after this long is shown no matter what.
    window.setTimeout(revealAll, 4000);
    REDUCED.addEventListener('change', (event) => {
      if (event.matches) revealAll();
    });
  } catch {
    revealAll();
  }
}

initScrollspy();
initHeader();
initRevealFallback();
