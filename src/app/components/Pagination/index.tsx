import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import iconBack from 'assets/images/genesis/arrow_back.svg';

interface ChangeEvent {
  currentPage: number;
  totalPages: number;
  pageLimit: number;
  totalRecords: number;
}

interface Props {
  totalRecords: number;
  pageLimit: number;
  pageNeighbours: number;
  onChange: (value: ChangeEvent) => void;
}

export function Pagination(props: Props) {
  const [mount, setMount] = useState(false);
  const totalPages = Math.ceil(props.totalRecords / props.pageLimit);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const LEFT_PAGE = 'LEFT';
  const RIGHT_PAGE = 'RIGHT';

  /**
   * Helper method for creating a range of numbers
   * range(1, 5) => [1, 2, 3, 4, 5]
   */
  const range = (from: number, to: number, step = 1) => {
    let i = from;
    const range: number[] = [];

    while (i <= to) {
      range.push(i);
      i += step;
    }

    return range;
  };

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

  const fetchPageNumbers = () => {
    const pageNeighbours = props.pageNeighbours;
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

      switch (true) {
        // handle: (1) < {5 6} [7] {8 9} (10)
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pages = [LEFT_PAGE, ...extraPages, ...pages];
          break;
        }

        // handle: (1) {2 3} [4] {5 6} > (10)
        case !hasLeftSpill && hasRightSpill: {
          const extraPages = range(endPage + 1, endPage + spillOffset);
          pages = [...pages, ...extraPages, RIGHT_PAGE];
          break;
        }

        // handle: (1) < {4 5} [6] {7 8} > (10)
        case hasLeftSpill && hasRightSpill:
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
          break;
        }
      }

      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  };

  const pages = fetchPageNumbers();

  const gotoPage = useCallback(
    page => {
      const { onChange = f => f } = props;
      const currentPage = Math.max(0, Math.min(page, totalPages));
      setCurrentPage(currentPage);
      const paginationData = {
        currentPage,
        totalPages: totalPages,
        pageLimit: props.pageLimit,
        totalRecords: props.totalRecords,
      };
      onChange(paginationData);
    },
    [props, totalPages],
  );

  useEffect(() => {
    if (!mount && totalPages > 0) {
      setMount(true);
      gotoPage(1);
    }
  }, [totalPages, gotoPage, mount]);

  if (!props.totalRecords || totalPages === 1) return null;

  const handleClick = page => evt => {
    evt.preventDefault();
    gotoPage(page);
  };

  const handleMoveLeft = evt => {
    evt.preventDefault();
    gotoPage(currentPage - props.pageNeighbours * 2 - 1);
  };

  const handleMoveRight = evt => {
    evt.preventDefault();
    gotoPage(currentPage + props.pageNeighbours * 2 + 1);
  };

  return (
    <>
      <nav aria-label="Pagination">
        <StyledList>
          {pages.map((page, index) => {
            if (page === LEFT_PAGE)
              return (
                <li key={index + 'pagination'} className="page-item">
                  <a
                    className="page-link"
                    href="#!"
                    aria-label="Previous"
                    onClick={handleMoveLeft}
                  >
                    <img src={iconBack} alt="Previous" />
                    <span className="sr-only">Previous</span>
                  </a>
                </li>
              );
            if (page === RIGHT_PAGE)
              return (
                <li key={index} className="page-item">
                  <a
                    className="page-link"
                    href="#!"
                    aria-label="Next"
                    onClick={handleMoveRight}
                  >
                    <img src={iconBack} className="icon-rotated" alt="Next" />
                    <span className="sr-only">Next</span>
                  </a>
                </li>
              );
            return (
              <li
                key={index}
                className={`page-item${currentPage === page ? ' active' : ''}`}
              >
                <a className="page-link" href="#!" onClick={handleClick(page)}>
                  {page}
                </a>
              </li>
            );
          })}
        </StyledList>
      </nav>
    </>
  );
}

const StyledList = styled.ul.attrs(_ => ({
  className: 'pagination',
}))`
  margin-top: 1.5rem;
  justify-content: center;
  display: flex;
  align-items: center;
  margin-bottom: 0;
  li.page-item.active a.page-link {
    background-color: #2274a5;
  }
  .page-item:last-child .page-link,
  .page-item:first-child .page-link {
    border-radius: 50%;
  }
  .page-link {
    padding: 0;
    min-height: 35px;
    min-width: 35px;
    text-align: center;
    color: white;
    align-items: center;
    justify-content: center;
    display: flex;
    font-weight: 500;
    font-size: 18px;
    border: none;
    background: transparent;
    margin: 0 0.1rem;
    transition: all 0.3s;
    border-radius: 50%;
    &:hover {
      background-color: #2274a5;
    }
    img {
      max-width: 32px;
    }
  }
  .icon-rotated {
    transform: rotate(180deg);
  }
`;
