import React, { FC } from 'react';
import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      <button
        className={styles.button}
        onClick={onPreviousPage}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        Previous
      </button>
      <span className={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </span>
      <button
        className={styles.button}
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};
