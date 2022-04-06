import React, { useCallback, useContext, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { TxStatus } from '../../../../../store/global/transactions-store/types';
import { FastBtcButton } from '../FastBtcButton';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { bignumber } from 'mathjs';
import { LinkToExplorer } from '../../../../components/LinkToExplorer';
import { StatusComponent } from '../../../../components/Dialogs/StatusComponent';
import { DepositContext, DepositStep } from '../../contexts/deposit-context';
import { DEPOSIT_FEE_SATS } from '../../constants';
import { CREATE_TICKET_LINK } from 'utils/classifiers';
import { btcInSatoshis } from 'app/constants';
import { getBTCAssetForNetwork } from '../../helpers';
import { NetworkAwareComponentProps } from '../../types';

export const StatusScreen: React.FC<NetworkAwareComponentProps> = ({
  network,
}) => {
  const { step, depositTx, transferTx } = useContext(DepositContext);
  const { t } = useTranslation();
  const history = useHistory();

  const onGoToPortfolio = useCallback(() => history.replace('/wallet'), [
    history,
  ]);

  const feeAmount = useMemo(
    () => bignumber(DEPOSIT_FEE_SATS).div(btcInSatoshis).toString(),
    [],
  );

  const amount = useMemo(() => {
    if (depositTx) {
      return depositTx.value;
    }
    if (transferTx) {
      return bignumber(transferTx?.value || 0)
        .add(feeAmount)
        .toString();
    }
    return 0;
  }, [depositTx, transferTx, feeAmount]);

  const receiveAmount = useMemo(
    () => bignumber(amount).minus(feeAmount).toString(),
    [amount, feeAmount],
  );

  const asset = getBTCAssetForNetwork(network);

  return (
    <>
      <div className="tw-mb-6 tw-text-2xl tw-text-center tw-font-semibold">
        <Trans
          i18nKey={
            translations.fastBtcPage.deposit.statusScreen[
              step === DepositStep.PROCESSING ? 'title' : 'titleCompleted'
            ]
          }
          components={[<AssetSymbolRenderer asset={asset} />]}
        />
      </div>
      <div className="tw-w-full">
        <div className="tw-w-full">
          <StatusComponent
            status={
              step === DepositStep.PROCESSING
                ? TxStatus.PENDING
                : TxStatus.CONFIRMED
            }
            onlyImage
          />

          <div className="tw-w-full tw-px-8 tw-py-4 tw-bg-gray-5 tw-text-center tw-mb-8 tw-rounded">
            <div className="tw-mb-2 tw-text-lg">
              {t(translations.fastBtcPage.deposit.statusScreen.amount)}
            </div>
            <div>{toNumberFormat(amount, 8)} BTC</div>
          </div>

          <div className="tw-w-full tw-px-8 tw-py-4 tw-bg-gray-5 tw-mb-8 tw-rounded">
            <div className="tw-flex tw-flex-row tw-mb-2 tw-justify-start tw-items-center">
              <div className="tw-w-1/2">
                {t(translations.fastBtcPage.deposit.statusScreen.fees)}
              </div>
              <div className="tw-font-semibold">
                {toNumberFormat(feeAmount, 8)}{' '}
                <AssetSymbolRenderer asset={asset} />
              </div>
            </div>
            <div className="tw-flex tw-flex-row tw-mb-2 tw-justify-start tw-items-center">
              <div className="tw-w-1/2">
                {t(translations.fastBtcPage.deposit.statusScreen.received)}
              </div>
              <div className="tw-font-semibold">
                {toNumberFormat(receiveAmount, 8)}{' '}
                <AssetSymbolRenderer asset={asset} />
              </div>
            </div>
            {depositTx && (
              <div className="tw-flex tw-flex-row tw-mb-2 tw-justify-start tw-items-center">
                <div className="tw-w-1/2">
                  {t(translations.fastBtcPage.deposit.statusScreen.txId)}
                </div>
                <div className="tw-font-semibold">
                  <LinkToExplorer
                    txHash={depositTx.txHash}
                    realBtc
                    className="tw-text-primary tw-underline"
                  />
                </div>
              </div>
            )}
            {transferTx && (
              <div className="tw-flex tw-flex-row tw-mb-2 tw-justify-start tw-items-center">
                <div className="tw-w-1/2">
                  {t(translations.fastBtcPage.deposit.statusScreen.txHash)}
                </div>
                <div className="tw-font-semibold">
                  <LinkToExplorer
                    txHash={transferTx.txHash}
                    className="tw-text-primary tw-underline"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="tw-text-center tw-my-8">
            <Trans
              i18nKey={
                translations.fastBtcPage.deposit.statusScreen.description
              }
              tOptions={{ hours: 1.5 }}
              components={[
                <a
                  href={CREATE_TICKET_LINK}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  ticket
                </a>,
              ]}
            />
          </div>

          <div className="tw-px-8 tw-mt-8">
            <FastBtcButton
              text={t(translations.fastBtcPage.deposit.statusScreen.cta)}
              onClick={onGoToPortfolio}
            />
          </div>
        </div>
      </div>
    </>
  );
};
