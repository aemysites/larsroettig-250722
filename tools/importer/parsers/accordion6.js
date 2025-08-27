/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual accordion block
  // It is nested inside several divs; look for the first .cmp-accordion inside 'element'
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  const rows = [];

  // Header row
  rows.push(['Accordion']);

  // For each item, extract the title and panel/body
  items.forEach(item => {
    // Title: inside cmp-accordion__title
    const titleSpan = item.querySelector('.cmp-accordion__title');
    let titleNode;
    if (titleSpan) {
      // Reference the text with a <p>
      // We want to preserve formatting, so use innerHTML
      const titleP = document.createElement('p');
      titleP.innerHTML = titleSpan.innerHTML;
      titleNode = titleP;
    } else {
      // fallback: use the button text
      const button = item.querySelector('button');
      if (button) {
        const titleP = document.createElement('p');
        titleP.textContent = button.textContent;
        titleNode = titleP;
      } else {
        titleNode = '';
      }
    }

    // Content: panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentNode;
    if (panel) {
      // If there is a .cmp-text (the answer block), use that, else use the panel itself
      const cmpText = panel.querySelector('.cmp-text');
      if (cmpText) {
        contentNode = cmpText;
      } else {
        contentNode = panel;
      }
    } else {
      contentNode = '';
    }

    rows.push([titleNode, contentNode]);
  });

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
