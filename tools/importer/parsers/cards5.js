/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches the block name exactly
  const headerRow = ['Cards (cards5)'];
  const cells = [headerRow];

  // Find all card elements
  const cardElements = element.querySelectorAll('ul.cmp-benefitsoverview__list > li.cmp-benefitsitem');

  cardElements.forEach((card) => {
    // Image: find the first img in the card (mandatory for first column)
    let image = null;
    const imageWrapper = card.querySelector('.cmp-benefitsitem__image');
    if (imageWrapper) {
      image = imageWrapper.querySelector('img');
    }

    // Text Content: tagline, headline, abstract (keep semantic structure)
    const textContent = [];

    // Tagline (reference existing element if present)
    const taglineDiv = card.querySelector('.cmp-benefitsitem__tagline');
    if (taglineDiv) {
      textContent.push(taglineDiv);
    }

    // Headline (reference existing element if present)
    const headline = card.querySelector('.cmp-benefitsitem__headline');
    if (headline) {
      textContent.push(headline);
    }

    // Abstract (reference existing element if present)
    const abstract = card.querySelector('.cmp-benefitsitem__abstract');
    if (abstract) {
      textContent.push(abstract);
    }

    // Add row: [image, [tagline, headline, abstract]]
    cells.push([
      image || '',
      textContent
    ]);
  });

  // Create and replace with the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
