/**
 * Progressive filter for a group of items tagged with `data-areas`.
 * Without JavaScript every item is visible; with it, pressing a chip hides the
 * items that do not carry that area and announces the count.
 */
export function initFilter(name: string): void {
  const group = document.querySelector<HTMLElement>(`[data-filter-group="${name}"]`);
  const section = group?.closest('section');
  if (!group || !section) return;

  const chips = Array.from(group.querySelectorAll<HTMLButtonElement>('button[data-filter]'));
  const items = Array.from(section.querySelectorAll<HTMLElement>('[data-filter-items] > [data-areas]'));
  const count = group.querySelector<HTMLElement>('[data-filter-count]');

  function apply(filter: string): void {
    let shown = 0;
    for (const item of items) {
      const areas = (item.dataset['areas'] ?? '').split(/\s+/);
      const visible = filter === 'all' || areas.includes(filter);
      item.hidden = !visible;
      if (visible) shown += 1;
    }
    for (const chip of chips) chip.setAttribute('aria-pressed', chip.dataset['filter'] === filter ? 'true' : 'false');
    if (count) count.textContent = `${shown} of ${items.length}`;
  }

  for (const chip of chips) {
    chip.addEventListener('click', () => apply(chip.dataset['filter'] ?? 'all'));
  }
}
