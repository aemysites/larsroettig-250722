/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: block name as in example
  const headerRow = ['Cards (cards7)'];

  // Find the container that holds the cards
  const itemsContainer = element.querySelector('.cmp-uniquesellingpoint__items');
  const cardNodes = itemsContainer ? Array.from(itemsContainer.children) : [];

  const rows = [headerRow];

  cardNodes.forEach(cardEl => {
    // Extract image element
    let imgEl = null;
    const imgWrapper = cardEl.querySelector('.cmp-teaser__image');
    if (imgWrapper) {
      imgEl = imgWrapper.querySelector('img');
    }
    // Compose content cell: Heading, Description (keep original elements, preserve semantic structure)
    const contentWrapper = cardEl.querySelector('.cmp-teaser__content');
    const contentEls = [];
    if (contentWrapper) {
      // Heading (keep heading level as in source, if present)
      const titleEl = contentWrapper.querySelector('.cmp-teaser__title');
      if (titleEl) {
        contentEls.push(titleEl);
      }
      // Description (all children of .cmp-teaser__description)
      const descEl = contentWrapper.querySelector('.cmp-teaser__description');
      if (descEl) {
        // Ensure we include all children elements, not just <p>
        Array.from(descEl.childNodes).forEach(child => {
          if (child.nodeType === 1) {
            contentEls.push(child);
          } else if (child.nodeType === 3 && child.textContent.trim()) {
            // In case there are direct text nodes
            const span = document.createElement('span');
            span.textContent = child.textContent;
            contentEls.push(span);
          }
        });
      }
    }
    // Add the row with image and content
    rows.push([imgEl, contentEls]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}