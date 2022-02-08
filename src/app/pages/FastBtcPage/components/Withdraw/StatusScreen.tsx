import React, { useCallback, useContext, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { WithdrawContext, WithdrawStep } from '../../contexts/withdraw-context';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { Asset } from '../../../../../types';
import { SendTxResponse } from '../../../../hooks/useSendContractTx';
import { WalletTxHelper } from './WalletTxHelper';
import { TxStatus } from '../../../../../store/global/transactions-store/types';
import { FastBtcButton } from '../FastBtcButton';
import {
  toNumberFormat,
  weiToNumberFormat,
} from '../../../../../utils/display-text/format';
import { LoadableValue } from '../../../../components/LoadableValue';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useCacheCallWithValue } from '../../../../hooks/useCacheCallWithValue';
import { bignumber } from 'mathjs';
import { LinkToExplorer } from '../../../../components/LinkToExplorer';
import { StatusComponent } from '../../../../components/Dialogs/TxDialog';
import { NetworkAwareComponentProps } from '../../types';

type StatusScreenProps = {
  tx: SendTxResponse;
} & NetworkAwareComponentProps;

export const StatusScreen: React.FC<StatusScreenProps> = ({ tx }) => {
  const { set, amount } = useContext(WithdrawContext);
  const { t } = useTranslation();
  const history = useHistory();

  const weiAmount = useWeiAmount(amount);
  const { value: feesPaid, loading } = useCacheCallWithValue(
    'fastBtcBridge',
    'calculateCurrentFeeWei',
    '0',
    weiAmount,
  );

  const receiveAmount = useMemo(
    () => bignumber(weiAmount).minus(feesPaid).toString(),
    [weiAmount, feesPaid],
  );

  const onGoBack = useCallback(
    () => set(prevState => ({ ...prevState, step: WithdrawStep.REVIEW })),
    [set],
  );

  const onGoToPortfolio = useCallback(() => history.replace('/wallet'), [
    history,
  ]);

  const expandedTxInfo = useMemo(
    () => [TxStatus.PENDING, TxStatus.CONFIRMED].includes(tx.status),
    [tx.status],
  );

  return (
    <>
      <div className="tw-mb-6 tw-text-2xl tw-text-center tw-font-semibold">
        <Trans
          i18nKey={
            translations.fastBtcPage.withdraw.statusScreen.titles[tx.status]
          }
          components={[<AssetSymbolRenderer asset={Asset.RBTC} />]}
        />
      </div>
      <div className="tw-w-full">
        {expandedTxInfo ? (
          <>
            <div className="tw-w-full">
              <StatusComponent status={tx.status} onlyImage />

              <div className="tw-w-full tw-px-8 tw-py-4 tw-bg-gray-5 tw-text-center tw-mb-8 tw-rounded">
                <div className="tw-mb-2 tw-text-lg">
                  {t(translations.fastBtcPage.withdraw.reviewScreen.amount)}
                </div>
                <div>
                  {toNumberFormat(amount, 8)}{' '}
                  <AssetSymbolRenderer asset={Asset.RBTC} />
                </div>
              </div>

              <div className="tw-w-full tw-px-8 tw-py-4 tw-bg-gray-5 tw-mb-8 tw-rounded">
                <div className="tw-flex tw-flex-row tw-mb-2 tw-justify-start tw-items-center">
                  <div className="tw-w-1/2">
                    {t(translations.fastBtcPage.withdraw.reviewScreen.fees)}
                  </div>
                  <div className="tw-font-semibold">
                    <LoadableValue
                      value={<>{weiToNumberFormat(feesPaid, 8)} BTC</>}
                      loading={loading}
                    />
                  </div>
                </div>
                <div className="tw-flex tw-flex-row tw-mb-2 tw-justify-start tw-items-center">
                  <div className="tw-w-1/2">
                    {t(translations.fastBtcPage.withdraw.reviewScreen.received)}
                  </div>
                  <div className="tw-font-semibold">
                    <LoadableValue
                      value={<>{weiToNumberFormat(receiveAmount, 8)} BTC</>}
                      loading={loading}
                    />
                  </div>
                </div>
                <div className="tw-flex tw-flex-row tw-mb-2 tw-justify-start tw-items-center">
                  <div className="tw-w-1/2">
                    {t(translations.fastBtcPage.withdraw.reviewScreen.tx)}
                  </div>
                  <div className="tw-font-semibold">
                    <LinkToExplorer
                      txHash={tx.txHash}
                      className="tw-text-primary tw-underline"
                    />
                  </div>
                </div>
              </div>

              <div className="tw-text-center tw-my-8">
                <Trans
                  i18nKey={
                    translations.fastBtcPage.withdraw.reviewScreen.description
                  }
                  tOptions={{ hours: 1.5 }}
                  components={[
                    <a href="/" target="_blank" rel="noreferrer noopener">
                      ticket
                    </a>,
                  ]}
                />
              </div>

              <div className="tw-px-8 tw-mt-8">
                <FastBtcButton
                  text={t(translations.fastBtcPage.withdraw.statusScreen.cta)}
                  onClick={onGoToPortfolio}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="tw-full tw-flex tw-flex-col tw-justify-center tw-items-center">
              <WalletTxHelper tx={tx} />
              {tx.status === TxStatus.FAILED && (
                <div className="tw-px-8 tw-mt-8">
                  <FastBtcButton
                    text={t(translations.common.retry)}
                    onClick={onGoBack}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
