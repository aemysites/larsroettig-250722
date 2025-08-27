/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards7)'];

  // Defensive: Find the items container
  const itemsContainer = element.querySelector('.cmp-uniquesellingpoint__items');
  if (!itemsContainer) return;

  // Get all card elements directly
  const cardEls = Array.from(itemsContainer.children);

  // Build rows for each card
  const rows = cardEls.map(card => {
    // Each card is expected to have .cmp-teaser
    const teaser = card.querySelector('.cmp-teaser');
    if (!teaser) return null;

    // Image/icon cell: get first <img> inside .cmp-teaser__image
    let imageCell = null;
    const teaserImageDiv = teaser.querySelector('.cmp-teaser__image');
    if (teaserImageDiv) {
      const img = teaserImageDiv.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // Text cell: title [h3] and description [p] from .cmp-teaser__content
    const contentDiv = teaser.querySelector('.cmp-teaser__content');
    let textCellContents = [];
    if (contentDiv) {
      // Title
      const title = contentDiv.querySelector('.cmp-teaser__title');
      if (title) {
        textCellContents.push(title);
      }
      // Description (hold all child nodes of description div)
      const descDiv = contentDiv.querySelector('.cmp-teaser__description');
      if (descDiv) {
        Array.from(descDiv.childNodes).forEach(node => {
          // Retain formatting, so if it's a text node or an element, include as-is
          textCellContents.push(node);
        });
      }
    }

    // If there is no title and description, skip this card
    if (!imageCell && textCellContents.length === 0) return null;

    return [imageCell, textCellContents];
  }).filter(Boolean);

  // Compose the table cells
  const tableCells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  element.replaceWith(table);
}
