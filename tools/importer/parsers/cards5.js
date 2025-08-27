/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card <li> elements
  const list = element.querySelector('.cmp-benefitsoverview__list');
  if (!list) return;
  const items = Array.from(list.children).filter(li => li.classList.contains('cmp-benefitsitem'));

  // Table header: must exactly match example
  const cells = [['Cards (cards5)']];

  items.forEach((item) => {
    // Image extraction (first column)
    let img = null;
    const imageContainer = item.querySelector('.cmp-benefitsitem__image');
    if (imageContainer) {
      const foundImg = imageContainer.querySelector('img');
      if (foundImg) img = foundImg;
    }

    // Text content: tagline, headline, and abstract (second column)
    const textElements = [];
    // Tagline
    const tagline = item.querySelector('.cmp-benefitsitem__tagline');
    if (tagline) textElements.push(tagline);
    // Headline (h3)
    const headline = item.querySelector('.cmp-benefitsitem__headline');
    if (headline) textElements.push(headline);
    // Abstract (contains <p> and <ul>)
    const abstract = item.querySelector('.cmp-benefitsitem__abstract');
    if (abstract) textElements.push(abstract);

    // If all text content missing, push empty string to avoid empty cell
    let textCell = textElements.length ? textElements : '';

    cells.push([
      img || '',
      textCell
    ]);
  });

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
