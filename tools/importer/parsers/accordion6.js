/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Accordion'];

  // Find the main accordion block
  let accordion = element.querySelector('.cmp-accordion');
  if (!accordion) {
    // Try fallback selector
    accordion = element.querySelector('[data-cmp-hook-accordion]');
    if (!accordion) return; // nothing to do
  }

  // Get all items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  const rows = [];

  items.forEach(item => {
    // 1. Title cell: Use the actual title span (preserves formatting)
    let titleCell;
    const titleSpan = item.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      titleCell = titleSpan; // reference only, do NOT clone
    } else {
      // fallback: take button text
      const button = item.querySelector('button');
      titleCell = document.createElement('span');
      titleCell.textContent = button ? button.textContent.trim() : '';
    }

    // 2. Content cell: Use all content inside panel
    let contentCell;
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Find the .cmp-text node inside the panel (if any)
      let contentBox = panel.querySelector('.cmp-text');
      if (!contentBox) {
        // Sometimes content is directly under .text
        contentBox = panel.querySelector('.text');
      }
      if (!contentBox) {
        // fallback: everything inside panel
        contentBox = panel;
      }
      // Collect all relevant nodes inside contentBox
      const nodes = Array.from(contentBox.childNodes).filter(node => {
        if (node.nodeType === Node.ELEMENT_NODE) return true;
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) return true;
        return false;
      });
      // If just one node, use that, if multiple, use array
      contentCell = nodes.length === 1 ? nodes[0] : nodes;
    } else {
      contentCell = '';
    }

    // Push row
    rows.push([titleCell, contentCell]);
  });

  // Compose block table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
