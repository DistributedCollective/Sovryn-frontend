import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { InfoRow } from './InfoRow';
import { CardImage } from './styled';
import cn from 'classnames';

interface IPreviousSalesCardProps {
  saleName: string;
  saleAllocation: string;
  totalRaised: string;
  participatingWallets: string;
  date: string;
  saleDuration: string;
  backgroundImage: string;
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
  price,
  className,
  cardClassName,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        'tw-flex tw-min-w-122 tw-flex-col tw-items-center sm:tw-flex-row xl:tw-max-w-50',
        className,
      )}
    >
      <CardImage
        style={{ backgroundImage: `url(${backgroundImage})` }}
        className={cn(cardClassName)}
      />
      <div className="tw-flex tw-flex-col tw-justify-center tw-ml-6 2xl:tw-ml-11">
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
