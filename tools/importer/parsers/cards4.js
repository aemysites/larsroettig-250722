/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: use block name exactly as given
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Find title (h4) if present
  let title = null;
  const h4 = element.querySelector('h4');
  if (h4) {
    title = h4;
  }

  // Find all logo cards (images)
  // Each .cmp-image corresponds to a company logo
  const imageBlocks = Array.from(element.querySelectorAll('.cmp-image'));

  // Edge case: If no images found, do nothing
  if (imageBlocks.length === 0) {
    // Nothing to output
    return;
  }

  // If title exists, put as a single row after header
  if (title) {
    rows.push([title]);
  }

  // For each logo, create a row in the table (1 column, image only)
  imageBlocks.forEach(imgBlock => {
    rows.push([imgBlock]);
  });

  // Create table block and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
