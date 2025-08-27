/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per the requirements
  const headerRow = ['Accordion'];

  // Locate the main accordion container
  // Search robustly in case of HTML structure variation
  let accordion = element.querySelector('.cmp-accordion');
  if (!accordion) {
    // Fallback: search for a descendant with accordion items and take its parent
    const firstItem = element.querySelector('[data-cmp-hook-accordion="item"]');
    if (firstItem) {
      accordion = firstItem.parentElement;
    }
  }
  if (!accordion) return;

  // Find all immediate accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  const rows = [headerRow];

  items.forEach((item) => {
    // Title cell: extract from the button span
    const titleBtn = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
    let titleCell = '';
    if (titleBtn) {
      titleCell = titleBtn.textContent.trim();
    }
    // Content cell: use the .cmp-text element if present, else the panel
    let contentCell = '';
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // Try to find cmp-text inside panel for rich content
      const cmpText = panel.querySelector(':scope > .text > .cmp-text, :scope > .cmp-text');
      if (cmpText) {
        contentCell = cmpText;
      } else {
        // If no cmp-text, fallback to panel's main content
        // Remove hidden classes so content is visible in output
        panel.classList.remove('cmp-accordion__panel--hidden');
        contentCell = panel;
      }
    }
    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
