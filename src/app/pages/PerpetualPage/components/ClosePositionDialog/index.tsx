import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import cn from 'classnames';
import {
  calculateProfit,
  weiToNumberFormat,
  toNumberFormat,
  numberToPercent,
  stringToFixedPrecision,
} from 'utils/display-text/format';
import { DummyInput } from 'app/components/Form/Input';
import {
  toWei,
  weiTo18,
  fromWei,
  weiToFixed,
} from 'utils/blockchain/math-helpers';
import { AmountInput } from 'app/components/Form/AmountInput';
import { Input } from 'app/components/Form/Input';
import { DialogButton } from 'app/components/Form/DialogButton';
import { FormGroup } from 'app/components/Form/FormGroup';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { leverageFromMargin } from 'utils/blockchain/leverage-from-start-margin';
import { LoadableValue } from 'app/components/LoadableValue';
import { translations } from 'locales/i18n';
import { TxType } from 'store/global/transactions-store/types';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { gasLimit } from 'utils/classifiers';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { Dialog } from 'app/containers/Dialog/Loadable';
import { useCloseWithSwap } from 'app/hooks/protocol/useCloseWithSwap';
import { useAccount } from 'app/hooks/useAccount';
import { useIsAmountWithinLimits } from 'app/hooks/useIsAmountWithinLimits';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { CollateralAssets } from '../CollateralAssets';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { useCurrentPositionPrice } from 'app/hooks/trading/useCurrentPositionPrice';
import type { ActiveLoan } from 'types/active-loan';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { useTrading_testRates } from '../../../../hooks/trading/useTrading_testRates';
import { discordInvite } from 'utils/classifiers';
import { useSlippage } from './useSlippage';
import { SlippageDialog } from './Dialogs/SlippageDialog';
import settingIcon from 'assets/images/settings-blue.svg';
import { ActionButton } from 'app/components/Form/ActionButton';
import { OpenPositionEntry } from '../../hooks/usePerpetual_OpenPositions';
import { Asset } from 'types';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from 'utils/dictionaries/perpatual-pair-dictionary';
import { AssetValue } from 'app/components/AssetValue';

interface IClosePositionDialogProps {
  item: OpenPositionEntry;
  showModal: boolean;
  onCloseModal: () => void;
  positionSize?: string;
}

const getOptions = (item: ActiveLoan) => {
  if (!item.collateralToken || !item.loanToken) {
    return [];
  }
  return [
    assetByTokenAddress(item.collateralToken),
    assetByTokenAddress(item.loanToken),
  ];
};

export function ClosePositionDialog({
  showModal,
  onCloseModal,
  item,
  positionSize,
}: IClosePositionDialogProps) {
  const [amount, setAmount] = useState<string>('0');
  const [openSlippage, setOpenSlippage] = useState(false);

  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const closeTradesLocked = checkMaintenance(States.CLOSE_MARGIN_TRADES);

  const pair = PerpetualPairDictionary.get(item.pair as PerpetualPairType);
  if (pair === undefined) return null;

  return (
    <>
      <Dialog isOpen={showModal} onClose={() => onCloseModal()}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-text-sov-white tw-text-center">
            {t(translations.closeTradingPositionHandler.title)}
          </h1>

          <div className="tw-py-4 tw-px-4 tw-bg-gray-2 sm:tw--mx-11 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
            <div className="tw-grid tw-grid-cols-2 tw-mb-1 tw-justify-start">
              <div className="tw-text-gray-10">
                {t(translations.perpetualPage.closePositionDialog.positionSize)}
                :
              </div>
              <div
                className={cn('tw-text-sov-white ', {
                  'tw-text-trade-short': item.position < 0,
                  'tw-text-trade-long': item.position > 0,
                })}
              >
                <AssetValue value={item.position} asset={pair.longAsset} />
              </div>
            </div>
            <div className="tw-grid tw-grid-cols-2 tw-mb-1 tw-justify-start">
              <div className="tw-text-gray-10">
                {t(translations.perpetualPage.closePositionDialog.marginSize)}:
              </div>
              <div className={'tw-text-sov-white '}>
                <AssetValue value={item.margin} asset={pair.shortAsset} />
                {` ${toNumberFormat(item.leverage, 2)}x`}
              </div>
            </div>
            <div className="tw-grid tw-grid-cols-2 tw-mb-1 tw-justify-start">
              <div className="tw-text-gray-10">
                {t(translations.perpetualPage.closePositionDialog.netPL)}:
              </div>
              <div
                className={cn('tw-text-sov-white ', {
                  'tw-text-trade-short': item.position < 0,
                  'tw-text-trade-long': item.position > 0,
                })}
              >
                <AssetValue
                  className="tw-block"
                  value={item.unrealized.shortValue}
                  asset={pair.shortAsset}
                />
              </div>
            </div>
          </div>
          {/* 
          <CollateralAssets
            label={t(translations.closeTradingPositionHandler.withdrawIn)}
            value={collateral}
            onChange={value => setCollateral(value)}
            options={options}
          /> */}

          <FormGroup
            label={t(
              translations.perpetualPage.closePositionDialog.closeAmount,
            )}
            className="tw-mt-7"
          >
            <Input
              value={stringToFixedPrecision(amount, 6)}
              onChange={value => setAmount(value)}
              type="number"
              appendElem={<AssetRenderer asset={pair.longAsset} />}
              className="tw-rounded-lg"
            />
          </FormGroup>

          <div className="tw-input-wrapper tw-text-sm tw-px-6 tw-flex tw-items-center tw-justify-between tw-h-8 readonly">
            <div className="tw-text-xs tw-font-light">
              {t(translations.perpetualPage.closePositionDialog.totalReceive)}:
            </div>
            <div
              className={cn('tw-text-sov-white', {
                'tw-text-trade-short': item.position < 0,
                'tw-text-trade-long': item.position > 0,
              })}
            >
              <AssetValue value={item.position} asset={pair.longAsset} />
            </div>
          </div>

          {/* <TxFeeCalculator
            args={args}
            methodName="closeWithSwap"
            contractName="sovrynProtocol"
            txConfig={{ gas: gasLimit[TxType.CLOSE_WITH_SWAP] }}
          />

          <SlippageDialog
            isOpen={openSlippage}
            onClose={() => setOpenSlippage(false)}
            amount={toWei(totalAmount)}
            value={slippage}
            asset={assetByTokenAddress(item.collateralToken)}
            onChange={value => setSlippage(value)}
          /> */}

          {closeTradesLocked && (
            <ErrorBadge
              content={
                closeTradesLocked ? (
                  <Trans
                    i18nKey={translations.maintenance.closeMarginTrades}
                    components={[
                      <a
                        href={discordInvite}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="tw-text-warning tw-text-xs tw-underline hover:tw-no-underline"
                      >
                        x
                      </a>,
                    ]}
                  />
                ) : undefined
              }
            />
          )}
          {/* <DialogButton
            confirmLabel={t(translations.common.confirm)}
            onConfirm={() => handleConfirmSwap()}
            disabled={rest.loading || !valid || closeTradesLocked}
            cancelLabel={t(translations.common.cancel)}
            onCancel={onCloseModal}
          /> */}
        </div>
      </Dialog>
      {/* <TxDialog tx={rest} onUserConfirmed={() => onCloseModal()} /> */}
    </>
  );
}

ClosePositionDialog.defaultProps = {
  item: {
    collateral: '0',
  },
};
