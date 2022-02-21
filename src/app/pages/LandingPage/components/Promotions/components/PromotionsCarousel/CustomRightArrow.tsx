import React from 'react';
import { ArrowProps } from 'react-multi-carousel';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './index.module.scss';
import classNames from 'classnames';

export const CustomRightArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <div className={classNames(styles.arrow, 'tw-right-4')} onClick={onClick}>
    <FontAwesomeIcon icon={faChevronRight} size="2x" />
  </div>
);
