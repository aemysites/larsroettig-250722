/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, must match exactly and be a single column
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  // Find the add-ons intro block (looks for a heading with "Add-ons" in text)
  let introBlock = null;
  element.querySelectorAll('h4').forEach((h4) => {
    if (/Add-ons|praktischen Add-ons/.test(h4.textContent)) {
      introBlock = h4.closest('.cmp-text, .cmp-basic-text, .basic-text');
    }
  });
  if (introBlock) {
    rows.push(['', introBlock]);
  }

  // Find all cards: li.cmp-benefitsitem
  element.querySelectorAll('li.cmp-benefitsitem').forEach((li) => {
    // Image cell: find .cmp-image inside .cmp-benefitsitem__image
    let imageCell = null;
    const imageDiv = li.querySelector('.cmp-benefitsitem__image .cmp-image');
    if (imageDiv) {
      imageCell = imageDiv;
    } else {
      // fallback: any img inside the card
      const img = li.querySelector('img');
      if (img) {
        imageCell = img.closest('.cmp-image') || img;
      }
    }

    // Text cell: get article.cmp-benefitsitem__content, or li itself
    let textCell = null;
    const article = li.querySelector('article.cmp-benefitsitem__content');
    textCell = article ? article : li;

    rows.push([imageCell, textCell]);
  });

  // Replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
