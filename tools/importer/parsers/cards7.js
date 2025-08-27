/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches example, no Section Metadata block in example
  const headerRow = ['Cards (cards7)'];

  // 2. Get all card items in this block
  const itemsContainer = element.querySelector('.cmp-uniquesellingpoint__items');
  if (!itemsContainer) return;

  const cards = Array.from(itemsContainer.children).filter(
    c => c.classList.contains('cmp-uniquesellingpoint__item')
  );

  const rows = cards.map(card => {
    // image: first img inside .cmp-teaser__image
    const imgEl = card.querySelector('.cmp-teaser__image img');
    // text: all children of .cmp-teaser__content (h3, .cmp-teaser__description)
    const content = card.querySelector('.cmp-teaser__content');
    let textEls = [];
    if (content) {
      // Reference the title
      const title = content.querySelector('.cmp-teaser__title');
      if (title) textEls.push(title);
      // Reference the description
      const desc = content.querySelector('.cmp-teaser__description');
      if (desc) textEls.push(desc);
    }
    // Always put image in first cell, text in second
    return [imgEl, textEls];
  });

  // 3. Build table: header row + each card row
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 4. Replace original block with table
  element.replaceWith(table);
}
