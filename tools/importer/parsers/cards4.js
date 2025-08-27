/* global WebImporter */
export default function parse(element, { document }) {
  // The block name for the header row, exactly as specified
  const headerRow = ['Cards (cards4)'];

  // Find the heading text, if available
  let headingContent = null;
  const headingEl = element.querySelector('.cmp-text h4');
  if (headingEl && headingEl.textContent.trim()) {
    // Reference existing heading element
    headingContent = headingEl;
  }

  // Cards: find all logo images in cards row
  // Locate the innermost container with all the .cmp-basic-image
  let cardImagesParent = null;
  const containers = Array.from(element.querySelectorAll('.cmp-container'));
  for (const cont of containers) {
    const images = cont.querySelectorAll('.cmp-basic-image');
    if (images.length >= 5) {
      cardImagesParent = cont;
      break;
    }
  }
  if (!cardImagesParent) {
    // fallback, use root element
    cardImagesParent = element;
  }
  const cardImages = Array.from(cardImagesParent.querySelectorAll('.cmp-basic-image'));

  const rows = [];
  // Only add heading row if heading is present
  if (headingContent) {
    rows.push([headingContent]);
  }
  // Each card gets a row. Only image per card here.
  cardImages.forEach(imgBlock => {
    const img = imgBlock.querySelector('img');
    if (img) {
      rows.push([img]);
    }
  });

  // Compose array for the table: header, then content rows
  const cells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
