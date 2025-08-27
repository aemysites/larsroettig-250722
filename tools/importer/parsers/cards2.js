/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first visible list of cards (benefits overview)
  const benefitsLists = Array.from(element.querySelectorAll('ul.cmp-benefitsoverview__list'));
  let listEl = null;
  for (const ul of benefitsLists) {
    if (ul.querySelector('li.cmp-benefitsitem')) {
      listEl = ul;
      break;
    }
  }
  if (!listEl) return;
  
  const rows = [['Cards (cards2)']]; // Header row matches the example exactly
  
  // Each card row
  const items = Array.from(listEl.querySelectorAll('li.cmp-benefitsitem'));
  items.forEach((li) => {
    // First cell: image - prefer the <img> element directly
    let image = li.querySelector('.cmp-benefitsitem__image img');
    // If not found, fallback to first img in card
    if (!image) image = li.querySelector('img');
    
    // Second cell: all textual content of the card, preserving structure
    // Reference the .cmp-benefitsitem__content directly if present (preserves <h3>, <div>, <ul>, etc.)
    let textContent = li.querySelector('.cmp-benefitsitem__content');
    if (!textContent) textContent = li; // fallback if structure changes
    
    rows.push([
      image,
      textContent
    ]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
