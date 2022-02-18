import React from 'react';
import { ArrowProps } from 'react-multi-carousel';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './index.module.scss';
import classNames from 'classnames';

export const CustomLeftArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <div className={classNames(styles.arrow, 'tw-left-4')} onClick={onClick}>
      <FontAwesomeIcon icon={faChevronLeft} size="2x" />
    </div>
  );
};
