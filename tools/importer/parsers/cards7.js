/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as in the example
  const headerRow = ['Cards (cards7)'];

  // Safely query the card items container
  const itemsContainer = element.querySelector('.cmp-uniquesellingpoint__items');
  if (!itemsContainer) return;

  // Collect rows for each card
  const cardRows = [];

  // Each immediate child of itemsContainer is a card
  Array.from(itemsContainer.children).forEach((card) => {
    // First cell: image (reference existing <img>)
    let imgEl = null;
    const imageContainer = card.querySelector('.cmp-teaser__image');
    if (imageContainer) {
      imgEl = imageContainer.querySelector('img');
    }
    // Second cell: title and description, using element references
    const contentContainer = card.querySelector('.cmp-teaser__content');
    const cellContent = [];
    if (contentContainer) {
      const titleEl = contentContainer.querySelector('.cmp-teaser__title');
      if (titleEl) {
        // Use a <strong> for semantic emphasis, but do not clone, just reference
        // If the heading is a <h3>, reference it directly
        cellContent.push(titleEl);
      }
      const descEl = contentContainer.querySelector('.cmp-teaser__description');
      if (descEl) {
        // Reference all child nodes (e.g., <p>)
        Array.from(descEl.childNodes).forEach((node) => {
          // Only include element and text nodes
          if (node.nodeType === 1 || node.nodeType === 3) {
            cellContent.push(node);
          }
        });
      }
    }
    // Row: [image, [title, description]]
    cardRows.push([imgEl, cellContent]);
  });

  // Compose the block table
  const tableData = [headerRow, ...cardRows];
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(blockTable);
}
