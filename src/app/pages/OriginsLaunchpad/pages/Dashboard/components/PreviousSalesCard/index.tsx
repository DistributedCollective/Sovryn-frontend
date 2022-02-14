import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { InfoRow } from './InfoRow';
import classNames from 'classnames';
import styles from './index.module.scss';

interface IPreviousSalesCardProps {
  saleName: string;
  saleAllocation: string;
  totalRaised: string;
  participatingWallets: string;
  date: string;
  saleDuration: string;
  backgroundImage?: string;
  backgroundElem?: React.ReactNode;
  price: string;
  className?: string;
  cardClassName?: string;
}

export const PreviousSalesCard: React.FC<IPreviousSalesCardProps> = ({
  saleName,
  saleAllocation,
  totalRaised,
  participatingWallets,
  date,
  saleDuration,
  backgroundImage,
  backgroundElem,
  price,
  className,
  cardClassName,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={classNames(
        'tw-flex sm:tw-w-full xl:tw-w-1/2 3xl:tw-w-1/3 tw-flex-col tw-items-center sm:tw-flex-row',
        className,
      )}
    >
      {backgroundImage && (
        <div
          style={{ backgroundImage: `url(${backgroundImage})` }}
          className={classNames(styles.cardImage, cardClassName)}
        />
      )}
      {backgroundElem && <div className={cardClassName}>{backgroundElem}</div>}
      <div className="tw-flex tw-flex-col tw-justify-center tw-ml-6 xl:tw-ml-4 2xl:tw-ml-11">
        <InfoRow
          label={t(
            translations.originsLaunchpad.previousSales.projectCard.date,
          )}
          value={date}
          className="tw-mb-4"
        />

        <InfoRow
          label={t(
            translations.originsLaunchpad.previousSales.projectCard.saleName,
          )}
          value={saleName}
          className="tw-mb-4"
        />

        <InfoRow
          label={t(
            translations.originsLaunchpad.previousSales.projectCard
              .saleAllocation,
          )}
          value={saleAllocation}
          className="tw-mb-4"
        />

        <InfoRow
          label={t(
            translations.originsLaunchpad.previousSales.projectCard.price,
          )}
          value={price}
          className="tw-mb-4"
        />

        <InfoRow
          label={t(
            translations.originsLaunchpad.previousSales.projectCard.totalRaised,
          )}
          value={totalRaised}
          className="tw-mb-4"
        />

        <InfoRow
          label={t(
            translations.originsLaunchpad.previousSales.projectCard
              .participatingWallets,
          )}
          value={participatingWallets}
          className="tw-mb-4"
        />

        <InfoRow
          label={t(
            translations.originsLaunchpad.previousSales.projectCard
              .saleDuration,
          )}
          value={saleDuration}
        />
      </div>
    </div>
  );
};
