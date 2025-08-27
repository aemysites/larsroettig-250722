/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: must match the block name exactly
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Find all .cmp-image elements with an <img> tag (each is a card logo)
  const logoImages = Array.from(element.querySelectorAll('.cmp-image'));

  // For each logo image, make a row: [image, company name (strong)]
  logoImages.forEach(imgWrapper => {
    const img = imgWrapper.querySelector('img');
    let textCell = '';
    if (img && img.alt) {
      // Company name is always the alt text minus 'Logo von '
      let name = img.alt.replace(/^Logo von /i, '').trim();
      // Use <strong> as in the visual example
      const strong = document.createElement('strong');
      strong.textContent = name;
      textCell = strong;
    }
    rows.push([img, textCell]);
  });

  // Create the table block and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
