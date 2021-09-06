import { Tooltip } from '@blueprintjs/core';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Button } from 'app/components/Button';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { Input } from 'app/components/Form/Input';
import { TxDialog } from 'app/components/UserAssets/TxDialog';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ResetTxResponseInterface } from 'app/hooks/useSendContractTx';
import classNames from 'classnames';
import { translations } from 'locales/i18n';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { TxStatus } from 'store/global/transactions-store/types';
import { Asset } from 'types';
import { weiTo18 } from 'utils/blockchain/math-helpers';
import { discordInvite } from 'utils/classifiers';
import { weiToNumberFormat } from 'utils/display-text/format';

interface IBaseClaimFormProps {
  className?: string;
  amountToClaim: string;
  tx: ResetTxResponseInterface;
  footer?: JSX.Element;
  onSubmit: () => void;
}

export const BaseClaimForm: React.FC<IBaseClaimFormProps> = ({
  className,
  amountToClaim,
  tx,
  footer,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const rewardsLocked = checkMaintenance(States.CLAIM_REWARDS);

  return (
    <div
      className={classNames(
        className,
        'tw-trading-form-card tw-p-16 tw-mx-auto xl:tw-mx-0 tw-flex tw-flex-col',
      )}
    >
      <div className="tw-text-sm">
        {t(translations.rewardPage.claimForm.title)}
      </div>
      <div className="tw-mt-1 tw-w-full tw-flex-1 tw-flex tw-flex-col tw-justify-center">
        <Tooltip content={`${weiTo18(amountToClaim)} SOV`}>
          <Input
            value={`${weiToNumberFormat(amountToClaim, 6)}...`}
            readOnly={true}
            appendElem={<AssetRenderer asset={Asset.SOV} />}
            inputClassName="tw-text-center tw-text-2xl tw-font-normal"
          />
        </Tooltip>

        <div className="tw-mt-16">
          {rewardsLocked && (
            <ErrorBadge
              content={
                <Trans
                  i18nKey={translations.maintenance.claimRewards}
                  components={[
                    <a
                      href={discordInvite}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="tw-text-Red tw-underline hover:tw-no-underline"
                    >
                      x
                    </a>,
                  ]}
                />
              }
            />
          )}
          {!rewardsLocked && (
            <Button
              disabled={
                parseFloat(amountToClaim) === 0 ||
                !amountToClaim ||
                rewardsLocked ||
                tx.status === TxStatus.PENDING ||
                tx.status === TxStatus.PENDING_FOR_USER
              }
              onClick={onSubmit}
              className="tw-w-full tw-mb-4"
              text={t(translations.rewardPage.claimForm.cta)}
            />
          )}

          <div className="tw-text-tiny tw-font-thin">{footer}</div>
        </div>
      </div>
      <TxDialog tx={tx} />
    </div>
  );
};
