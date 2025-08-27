/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row: must match example exactly
  const cells = [['Cards (cards2)']];

  // Find the card list (UL) inside a known benefits overview block
  let cardList = element.querySelector('ul.cmp-benefitsoverview__list');
  if (!cardList) {
    // Fallback: any UL inside a .cmp-benefitsoverview
    const overview = element.querySelector('.cmp-benefitsoverview');
    if (overview) {
      cardList = overview.querySelector('ul');
    }
  }
  if (!cardList) return;

  // For each card LI
  Array.from(cardList.querySelectorAll('li.cmp-benefitsitem')).forEach(card => {
    // Image cell - find first <img> descendant, use its image wrapper
    let imgCell = '';
    const img = card.querySelector('img');
    if (img) {
      // Use closest image wrapper, typically .cmp-benefitsitem__image or .cmp-image
      const imgWrap = img.closest('.cmp-benefitsitem__image, .cmp-image');
      imgCell = imgWrap || img;
    }

    // Text cell - collect all text-related elements in card, keeping semantic structure
    // Start with tagline
    const tagline = card.querySelector('.cmp-benefitsitem__tagline');
    // Headline
    const headline = card.querySelector('.cmp-benefitsitem__headline');
    // Abstract (may contain <p> and <ul>)
    const abstract = card.querySelector('.cmp-benefitsitem__abstract');

    // Compose text content for cell, referencing real elements only
    const textContent = [];
    if (tagline) textContent.push(tagline);
    if (headline) textContent.push(headline);
    if (abstract) textContent.push(abstract);

    // As fallback, if nothing found, grab all child nodes except image wrappers
    if (textContent.length === 0) {
      Array.from(card.children).forEach(child => {
        if (!child.classList.contains('cmp-benefitsitem__image')) {
          textContent.push(child);
        }
      });
    }

    cells.push([
      imgCell || '',
      textContent.length > 0 ? textContent : ''
    ]);
  });

  // Build and replace with table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
