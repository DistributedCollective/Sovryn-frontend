import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import iconBack from 'assets/images/genesis/arrow_back.svg';
import {
  generatePageNumbers,
  PAGINATION_LEFT_PAGE,
  PAGINATION_RIGHT_PAGE,
} from './index.utils';
import styles from './index.module.scss';

interface ChangeEvent {
  currentPage: number;
  totalPages: number;
  pageLimit: number;
  totalRecords: number;
}

interface IPaginationProps {
  totalRecords: number;
  pageLimit: number;
  pageNeighbours: number;
  onChange: (value: ChangeEvent) => void;
  className?: string;
}

export const Pagination: React.FC<IPaginationProps> = ({
  totalRecords,
  pageLimit,
  pageNeighbours,
  onChange,
  className,
}) => {
  const [mount, setMount] = useState(false);
  const totalPages = useMemo(() => Math.ceil(totalRecords / pageLimit), [
    totalRecords,
    pageLimit,
  ]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const pages = generatePageNumbers(currentPage, totalPages, pageNeighbours);

  const gotoPage = useCallback(
    page => {
      const currentPage = Math.max(0, Math.min(page, totalPages));
      setCurrentPage(currentPage);
      const paginationData = {
        currentPage,
        totalPages: totalPages,
        pageLimit: pageLimit,
        totalRecords: totalRecords,
      };
      onChange(paginationData);
    },
    [totalPages, pageLimit, totalRecords, onChange],
  );

  useEffect(() => {
    if (!mount && totalPages > 0) {
      setMount(true);
      gotoPage(1);
    }
  }, [totalPages, gotoPage, mount]);

  const handleClick = useCallback(
    page => evt => {
      evt.preventDefault();
      gotoPage(page);
    },
    [gotoPage],
  );

  const handleMoveLeft = useCallback(
    evt => {
      evt.preventDefault();
      gotoPage(currentPage - pageNeighbours * 2 - 1);
    },
    [currentPage, pageNeighbours, gotoPage],
  );

  const handleMoveRight = useCallback(
    evt => {
      evt.preventDefault();
      gotoPage(currentPage + pageNeighbours * 2 + 1);
    },
    [currentPage, pageNeighbours, gotoPage],
  );

  if (!totalRecords || totalPages === 1) return null;

  return (
    <>
      <nav className={className} aria-label="Pagination">
        <ul className="tw-flex tw-justify-center tw-items-center tw-mt-6 tw-mb-0">
          {pages.map((page, index) => {
            if (page === PAGINATION_LEFT_PAGE)
              return (
                <li key={page}>
                  <button
                    className={styles.pageButton}
                    aria-label="Previous Page"
                    onClick={handleMoveLeft}
                  >
                    <img className="tw-max-w-8" src={iconBack} alt="Previous" />
                    <span className="tw-sr-only">Previous</span>
                  </button>
                </li>
              );
            if (page === PAGINATION_RIGHT_PAGE)
              return (
                <li key={page}>
                  <button
                    className={styles.pageButton}
                    aria-label="Next Page"
                    onClick={handleMoveRight}
                  >
                    <img
                      src={iconBack}
                      className="tw-max-w-8 tw-transform tw-rotate-180"
                      alt="Next"
                    />
                    <span className="tw-sr-only">Next</span>
                  </button>
                </li>
              );
            return (
              <li key={page}>
                <button
                  className={classNames(
                    styles.pageButton,
                    currentPage === page && 'tw-bg-secondary',
                  )}
                  onClick={handleClick(page)}
                >
                  {page}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};
