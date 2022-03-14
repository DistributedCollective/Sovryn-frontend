/**
 * Helper method for creating a range of numbers
 * range(1, 5) => [1, 2, 3, 4, 5]
 */
export const range = (from: number, to: number, step = 1) => {
  let i = from;
  const range: number[] = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
};

export const PAGINATION_LEFT_PAGE = 'LEFT';
export const PAGINATION_RIGHT_PAGE = 'RIGHT';

/**
 * Let's say we have 10 pages and we set pageNeighbours to 2
 * Given that the current page is 6
 * The pagination control will look like the following:
 *
 * (1) < {4 5} [6] {7 8} > (10)
 *
 * (x) => terminal pages: first and last page(always visible)
 * [x] => represents current page
 * {...x} => represents page neighbours
 */
export const generatePageNumbers = (
  currentPage: number,
  totalPages: number,
  pageNeighbours: number,
) => {
  /**
   * totalNumbers: the total page numbers to show on the control
   * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
   */
  const totalNumbers = pageNeighbours * 2 + 3;
  const totalBlocks = totalNumbers + 2;

  if (totalPages > totalBlocks) {
    const startPage = Math.max(2, currentPage - pageNeighbours);
    const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
    let pages: (string | number)[] = range(startPage, endPage);

    /**
     * hasLeftSpill: has hidden pages to the left
     * hasRightSpill: has hidden pages to the right
     * spillOffset: number of hidden pages either to the left or to the right
     */
    const hasLeftSpill = startPage > 2;
    const hasRightSpill = totalPages - endPage > 1;
    const spillOffset = totalNumbers - (pages.length + 1);

    if (hasLeftSpill && !hasRightSpill) {
      // handle: (1) < {5 6} [7] {8 9} (10)
      pages = [
        PAGINATION_LEFT_PAGE,
        ...range(startPage - spillOffset, startPage - 1),
        ...pages,
      ];
    } else if (!hasLeftSpill && hasRightSpill) {
      // handle: (1) {2 3} [4] {5 6} > (10)
      pages = [
        ...pages,
        ...range(endPage + 1, endPage + spillOffset),
        PAGINATION_RIGHT_PAGE,
      ];
    } else if (hasLeftSpill && hasRightSpill) {
      // handle: (1) < {4 5} [6] {7 8} > (10)
      pages = [PAGINATION_LEFT_PAGE, ...pages, PAGINATION_RIGHT_PAGE];
    }

    return [1, ...pages, totalPages];
  }

  return range(1, totalPages);
};
