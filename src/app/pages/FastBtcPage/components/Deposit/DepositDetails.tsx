import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { LoadableValue } from '../../../../components/LoadableValue';
import { DepositContext } from '../../contexts/deposit-context';

export const DepositDetails: React.FC = () => {
  const { t } = useTranslation();
  const { limits } = useContext(DepositContext);

  return (
    <section className="tw-py-4 tw-px-8 tw-bg-gray-6 tw-text-white tw-rounded tw-mb-4">
      <h4 className="tw-text-base tw-text-white tw-mb-4 tw-normal-case tw-font-semibold">
        {t(translations.fastBtcPage.deposit.depositDetails.title)}
      </h4>
      <ul className="tw-pl-4 tw-list-disc">
        <li>
          {t(translations.fastBtcPage.deposit.depositDetails.min)}{' '}
          <LoadableValue
            value={<>{toNumberFormat(limits.min, 5)} BTC</>}
            loading={limits.loading}
          />
        </li>
        <li>
          {t(translations.fastBtcPage.deposit.depositDetails.max)}{' '}
          <LoadableValue
            value={<>{toNumberFormat(limits.max, 3)} BTC</>}
            loading={limits.loading}
          />
        </li>
      </ul>
    </section>
  );
};
