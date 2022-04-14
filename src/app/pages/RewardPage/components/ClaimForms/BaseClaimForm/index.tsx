import { Tooltip } from '@blueprintjs/core';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Button, ButtonSize } from 'app/components/Button';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { Input } from 'app/components/Form/Input';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ResetTxResponseInterface } from 'app/hooks/useSendContractTx';
import classNames from 'classnames';
import { translations } from 'locales/i18n';
import { bignumber } from 'mathjs';
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { TxStatus } from 'store/global/transactions-store/types';
import { Asset } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { weiTo18 } from 'utils/blockchain/math-helpers';
import { discordInvite } from 'utils/classifiers';
import { weiToNumberFormat } from 'utils/display-text/format';

interface IBaseClaimFormProps {
  className?: string;
  amountToClaim: string;
  tx: ResetTxResponseInterface;
  footer?: JSX.Element;
  onSubmit: () => void;
  claimAsset?: Asset;
  claimLocked?: boolean;
}

export const BaseClaimForm: React.FC<IBaseClaimFormProps> = ({
  className,
  amountToClaim,
  tx,
  footer,
  onSubmit,
  claimLocked,
  claimAsset = Asset.SOV,
}) => {
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const rewardsLocked = checkMaintenance(States.CLAIM_REWARDS);
  const { address } = getContract('stakingRewards');
  const { value: tokenBalance } = useCacheCallWithValue(
    'SOV_token',
    'balanceOf',
    '0',
    address,
  );

  const isTokenBalance = useMemo(() => {
    return bignumber(tokenBalance).greaterThanOrEqualTo(amountToClaim);
  }, [amountToClaim, tokenBalance]);

  const isDisabled = useMemo(
    () =>
      parseFloat(amountToClaim) === 0 ||
      !amountToClaim ||
      rewardsLocked ||
      claimLocked ||
      tx.status === TxStatus.PENDING ||
      tx.status === TxStatus.PENDING_FOR_USER,
    [amountToClaim, rewardsLocked, claimLocked, tx.status],
  );

  return (
    <div
      className={classNames(
        className,
        'tw-trading-form-card tw-p-16 tw-px-10 tw-mx-auto xl:tw-mx-0 tw-flex tw-flex-col',
      )}
    >
      <div className="tw-text-sm">
        {t(translations.rewardPage.claimForm.title)}
      </div>
      <div className="tw-mt-1 tw-w-full tw-flex-1 tw-flex tw-flex-col tw-justify-center">
        {bignumber(amountToClaim).greaterThan(0) ? (
          <Tooltip content={`${weiTo18(amountToClaim)} ${claimAsset}`}>
            <Input
              value={`${weiToNumberFormat(amountToClaim, 6)}...`}
              readOnly={true}
              appendElem={<AssetRenderer asset={claimAsset} />}
              inputClassName="tw-text-center tw-text-2xl tw-font-normal"
            />
          </Tooltip>
        ) : (
          <Input
            value="0"
            readOnly={true}
            appendElem={<AssetRenderer asset={claimAsset} />}
            inputClassName="tw-text-center tw-text-2xl tw-font-normal"
          />
        )}

        <>
          {(rewardsLocked || claimLocked) && (
            <ErrorBadge
              content={
                <Trans
                  i18nKey={translations.maintenance.claimRewards}
                  components={[
                    <a
                      href={discordInvite}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="tw-text-warning tw-underline hover:tw-no-underline"
                    >
                      x
                    </a>,
                  ]}
                />
              }
            />
          )}
          {!(rewardsLocked || claimLocked) && (
            <Tooltip
              position="bottom"
              className="tw-max-w-lg tw-block"
              disabled={isTokenBalance}
              interactionKind="hover"
              content={
                <>{t(translations.rewardPage.claimForm.claimDisabled)}</>
              }
            >
              <Button
                disabled={isDisabled || !isTokenBalance}
                onClick={onSubmit}
                className="tw-w-full tw-mb-4 tw-mt-16"
                size={ButtonSize.lg}
                text={t(translations.rewardPage.claimForm.cta)}
              />
            </Tooltip>
          )}

          <div className="tw-text-xs">{footer}</div>
        </>
      </div>
      <TransactionDialog tx={tx} />
    </div>
  );
};
