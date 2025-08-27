/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header EXACT match
  const headerRow = ['Cards (cards5)'];
  const cells = [headerRow];

  // 2. Get the cards list
  const ul = element.querySelector('ul.cmp-benefitsoverview__list');
  if (!ul) return;

  // 3. For each card
  const items = Array.from(ul.children).filter(e => e.tagName === 'LI');
  items.forEach(li => {
    const content = li.querySelector('article.cmp-benefitsitem__content');
    if (!content) return;

    // First column: image (reference existing element only)
    let imgEl = null;
    const imgWrapper = content.querySelector('.cmp-benefitsitem__image');
    if (imgWrapper) {
      const img = imgWrapper.querySelector('img');
      if (img) imgEl = img;
    }

    // Second column: text content, reference existing elements, preserve semantics
    const textElements = [];

    // Tagline badge (as div, not hardcoded)
    const tagline = content.querySelector('.cmp-benefitsitem__tagline');
    if (tagline) {
      textElements.push(tagline); // reuse existing element
    }

    // Headline (use original heading element)
    const headline = content.querySelector('.cmp-benefitsitem__headline');
    if (headline) {
      textElements.push(headline);
    }

    // Abstract description (paragraph and list)
    const abstract = content.querySelector('.cmp-benefitsitem__abstract');
    if (abstract) {
      // Use all children of abstract preserving order
      Array.from(abstract.children).forEach(child => {
        textElements.push(child); // reference original p and ul elements
      });
    }

    cells.push([
      imgEl || '',
      textElements
    ]);
  });

  // 4. Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
