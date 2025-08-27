/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row as a single cell (matches example exactly)
  const headerRow = ['Cards (cards4)'];

  // Find all logo cards: .cmp-image elements inside the element
  const imageBlocks = Array.from(element.querySelectorAll('.cmp-image'));

  // For each card, use the <img> and the logo name (from alt or data-title)
  const cardRows = imageBlocks.map(imgBlock => {
    const img = imgBlock.querySelector('img');
    let logoName = '';
    if (img && img.getAttribute('alt')) {
      logoName = img.getAttribute('alt').replace(/^Logo von /, '').trim();
    } else if (imgBlock.hasAttribute('data-title')) {
      logoName = imgBlock.getAttribute('data-title').replace(/^Logo von /, '').trim();
    }
    // Use a heading element to match the semantic meaning
    const h4 = document.createElement('h4');
    h4.textContent = logoName;
    // Reference the existing <img> element directly
    return [img, h4];
  });

  // Build cells: header plus all card rows
  const cells = [headerRow, ...cardRows];

  // Create the table using the provided helper
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
