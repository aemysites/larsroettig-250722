/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row per requirements
  const cells = [['Cards (cards5)']];

  // Get the list of cards (li elements)
  const ul = element.querySelector('ul.cmp-benefitsoverview__list');
  if (!ul) return;
  const lis = ul.querySelectorAll(':scope > li.cmp-benefitsitem');
  lis.forEach((li) => {
    // IMAGE
    let imageCell = '';
    const imageOuter = li.querySelector('.cmp-benefitsitem__image .cmp-image');
    if (imageOuter) {
      const img = imageOuter.querySelector('img');
      if (img) imageCell = img;
    }

    // TEXT CELL
    const textCellParts = [];
    // Tagline badge (e.g., 30 Tage kostenlos testen)
    const tagline = li.querySelector('.cmp-benefitsitem__tagline');
    if (tagline) textCellParts.push(tagline);
    // Headline (h3)
    const headline = li.querySelector('.cmp-benefitsitem__headline');
    if (headline) textCellParts.push(headline);
    // Abstract (p and ul)
    const abstract = li.querySelector('.cmp-benefitsitem__abstract');
    if (abstract) textCellParts.push(abstract);

    cells.push([imageCell, textCellParts]);
  });

  // Create table with the structured card block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
