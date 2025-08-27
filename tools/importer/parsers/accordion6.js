/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block. We look for the cmp-accordion class inside the provided element.
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Prepare header row
  const rows = [['Accordion']];

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: take the button's text (inside .cmp-accordion__title)
    const button = item.querySelector('.cmp-accordion__button');
    let titleSpan = button && button.querySelector('.cmp-accordion__title');
    let titleNode;
    if (titleSpan) {
      // Use the span directly from the live DOM (do NOT clone)
      titleNode = titleSpan;
    } else {
      // Fallback: use button text
      titleNode = document.createElement('span');
      titleNode.textContent = button ? button.textContent.trim() : '';
    }

    // Content cell: find the panel and all its visible content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentNodes = [];
    if (panel) {
      // Find the text container (may be .text or .cmp-text) and take its children
      // We'll collect all direct child nodes of .cmp-text inside .text
      const text = panel.querySelector('.cmp-text');
      if (text) {
        Array.from(text.childNodes).forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            contentNodes.push(node);
          }
        });
      } else {
        // Fallback: push all direct children of panel
        Array.from(panel.childNodes).forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            contentNodes.push(node);
          }
        });
      }
    }
    // If there's only one content node, use it directly
    rows.push([
      titleNode,
      contentNodes.length === 1 ? contentNodes[0] : contentNodes
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the table
  element.replaceWith(table);
}
