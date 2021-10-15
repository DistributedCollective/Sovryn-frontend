import React from 'react';
import styles from './index.module.scss';

interface INoRewardInfoProps {
  image: string;
  text: React.ReactNode;
}

export const NoRewardInfo: React.FC<INoRewardInfoProps> = ({ image, text }) => {
  return (
    <div className={styles.noRewardWrapper}>
      <img src={image} alt="No rewards" />
      <div className={styles.noRewardText}>{text}</div>
    </div>
  );
};
