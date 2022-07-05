import React, { useCallback, useContext, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { TxStatus } from '../../../../../store/global/transactions-store/types';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { bignumber } from 'mathjs';
import { LinkToExplorer } from '../../../../components/LinkToExplorer';
import { DepositContext, DepositStep } from '../../contexts/deposit-context';
import { DEPOSIT_FEE_SATS } from '../../constants';
import { CREATE_TICKET_LINK } from 'utils/classifiers';
import { btcInSatoshis } from 'app/constants';
import { getBTCAssetForNetwork } from '../../helpers';
import { NetworkAwareComponentProps } from '../../types';
import { StatusComponent } from 'app/components/Dialogs/StatusComponent';
import { Chain } from 'types';
import { Button, ButtonColor, ButtonSize } from 'app/components/Button';

export const StatusScreen: React.FC<NetworkAwareComponentProps> = ({
  network,
}) => {
  const { step, depositTx, transferTx } = useContext(DepositContext);
  const { t } = useTranslation();
  const history = useHistory();

  const backToUrl = useMemo(
    () => (network === Chain.BSC ? '/perpetuals' : '/portfolio'),
    [network],
  );

  const backToTitle = useMemo(
    () =>
      network === Chain.BSC
        ? t(translations.fastBtcPage.backToPerpetuals)
        : t(translations.fastBtcPage.backToPortfolio),
    [network, t],
  );

  const onGoToPortfolio = useCallback(() => history.replace(backToUrl), [
    backToUrl,
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

  const items = [
    {
      label: t(translations.fastBtcPage.withdraw.reviewScreen.dateTime),
      value: new Date().toLocaleDateString(),
    },
    {
      label: t(translations.fastBtcPage.deposit.statusScreen.amount),
      value: <>{toNumberFormat(amount, 8)} BTC</>,
    },

    {
      label: t(translations.fastBtcPage.withdraw.reviewScreen.fees),
      value: (
        <>
          {toNumberFormat(feeAmount, 8)} <AssetSymbolRenderer asset={asset} />
        </>
      ),
    },

    {
      label: t(translations.fastBtcPage.deposit.statusScreen.received),
      value: (
        <>
          {toNumberFormat(receiveAmount, 8)}{' '}
          <AssetSymbolRenderer asset={asset} />
        </>
      ),
    },
  ];

  return (
    <>
      <div className="tw-mb-4 tw-text-base tw-text-center tw-font-semibold">
        <Trans
          i18nKey={
            translations.fastBtcPage.deposit.statusScreen[
              step === DepositStep.PROCESSING ? 'title' : 'titleCompleted'
            ]
          }
          components={[<AssetSymbolRenderer asset={asset} />]}
        />
      </div>
      <div className="tw-w-full tw-max-w-80 tw-mb-10">
        <div className="tw-w-full">
          <StatusComponent
            status={
              step === DepositStep.PROCESSING
                ? TxStatus.PENDING
                : TxStatus.CONFIRMED
            }
            showLabel={false}
          />

          <table className="tw-mx-auto tw-text-left tw-text-sm tw-font-medium tw-w-full">
            <tbody>
              {items.map(({ label, value }) => (
                <tr>
                  <td className="tw-py-0.5">{label}:</td>
                  <td className="tw-py-0.5 tw-text-right">{value}</td>
                </tr>
              ))}

              {depositTx && (
                <tr>
                  <td className="tw-py-0.5">
                    {t(translations.fastBtcPage.deposit.statusScreen.txId)}:
                  </td>
                  <td className="tw-text-right tw-py-0.5">
                    <LinkToExplorer
                      txHash={depositTx.txHash}
                      realBtc
                      className="tw-text-primary tw-underline"
                    />
                  </td>
                </tr>
              )}

              {transferTx && (
                <tr>
                  <td className="tw-py-0.5">
                    {t(translations.fastBtcPage.deposit.statusScreen.txHash)}:
                  </td>
                  <td className="tw-text-right tw-py-0.5">
                    <LinkToExplorer
                      txHash={transferTx.txHash}
                      className="tw-text-primary tw-underline"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="tw-text-center tw-mb-8 tw-mt-4">
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

          <Button
            className={
              'tw-w-42 tw-font-semibold tw-absolute tw-right-0 tw-left-0 tw-bottom-8 tw-mx-auto'
            }
            size={ButtonSize.sm}
            text={backToTitle}
            onClick={onGoToPortfolio}
            color={ButtonColor.primary}
          />
        </div>
      </div>
    </>
  );
};
