/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards2) block table
  const headerRow = ['Cards (cards2)'];
  const cells = [headerRow];

  // Find the Add-ons section heading and subheading, if present (above the card list)
  // The heading for the cards block is typically a .cmp-basic-text--alignment-center + .cmp-text
  // We want the closest heading h4 (and its <p>, optional) that is an ancestor or direct parent of the .cmp-benefitsoverview__list
  let mainHeading = null;
  let mainSubheading = null;
  const textBlocks = Array.from(element.querySelectorAll('.cmp-text'));
  const cardsListUl = element.querySelector('.cmp-benefitsoverview__list');
  if (cardsListUl) {
    // Find the closest .cmp-text block above the list
    let textBlock = null;
    for (let i = 0; i < textBlocks.length; i++) {
      if (textBlocks[i].compareDocumentPosition(cardsListUl) & Node.DOCUMENT_POSITION_FOLLOWING) {
        textBlock = textBlocks[i];
        break;
      }
    }
    if (textBlock) {
      mainHeading = textBlock.querySelector('h4');
      mainSubheading = textBlock.querySelector('p');
      // If there's a heading (h4), create a "row" for it (keep in second col like a heading block)
      if (mainHeading) {
        const headingCell = [mainHeading];
        if (mainSubheading) headingCell.push(mainSubheading);
        cells.push(['', headingCell]);
      }
    }
  }

  // Now extract each card row
  if (cardsListUl) {
    Array.from(cardsListUl.querySelectorAll(':scope > li')).forEach((li) => {
      // Left cell: image (mandatory)
      let image = li.querySelector('.cmp-benefitsitem__image img');
      // Right cell: tagline (optional), headline (optional), abstract (may include p, ul, li)
      let rightCell = [];
      const tagline = li.querySelector('.cmp-benefitsitem__tagline');
      if (tagline) rightCell.push(tagline);
      const title = li.querySelector('.cmp-benefitsitem__headline');
      if (title) rightCell.push(title);
      // Abstract block: preserve all children (for p+ul combos)
      const abstract = li.querySelector('.cmp-benefitsitem__abstract');
      if (abstract) {
        if (abstract.children.length > 0) {
          rightCell.push(...abstract.children);
        } else {
          rightCell.push(abstract);
        }
      }
      // Fallback: If all above missing, use all textContent
      if (!image && rightCell.length === 0) {
        rightCell.push(document.createTextNode(li.textContent.trim()));
      }
      cells.push([
        image || '',
        rightCell.length > 0 ? rightCell : ''
      ]);
    });
  }

  // Replace original element with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}