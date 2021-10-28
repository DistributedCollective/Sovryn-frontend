import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { AmountInput } from 'app/components/Form/AmountInput';
import { DialogButton } from 'app/components/Form/DialogButton';
import { FormGroup } from 'app/components/Form/FormGroup';

import { translations } from '../../../../../locales/i18n';
import { assetByTokenAddress } from '../../../../../utils/blockchain/contract-helpers';
import { VAULT_WITHDRAW_LOG_SIGNATURE_HASH } from '../../../../../utils/classifiers';
import { useCloseWithSwap } from '../../../../hooks/protocol/useCloseWithSwap';
import { useAccount } from '../../../../hooks/useAccount';
import { useIsAmountWithinLimits } from '../../../../hooks/useIsAmountWithinLimits';
import { useMaintenance } from '../../../../hooks/useMaintenance';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { CollateralAssets } from '../CollateralAssets';

import { ActiveLoan } from 'types/active-loan';
import { TxFeeCalculator } from '../TxFeeCalculator';
import { useSimulator } from '../../../../hooks/simulator/useSimulator';
import { ResetTxResponseInterface } from '../../../../hooks/useSendContractTx';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { DummyInput } from '../../../../components/Form/Input';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { ErrorBadge } from '../../../../components/Form/ErrorBadge';
import { LoadableValue } from '../../../../components/LoadableValue';
import {
  SimulationStatus,
  useFilterSimulatorResponseLogs,
} from '../../../../hooks/simulator/useFilterSimulatorResponseLogs';

interface IDialogContentProps {
  item: ActiveLoan;
  onCloseModal: () => void;
  onTx: (tx: ResetTxResponseInterface) => void;
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

const VaultWithdrawLogInput = [
  {
    indexed: true,
    name: 'asset',
    type: 'address',
  },
  {
    indexed: true,
    name: 'to',
    type: 'address',
  },
  {
    indexed: false,
    name: 'amount',
    type: 'uint256',
  },
];

export function DialogContent(props: IDialogContentProps) {
  const receiver = useAccount();

  const [amount, setAmount] = useState('');
  const [collateral, setCollateral] = useState(
    assetByTokenAddress(props.item.collateralToken),
  );

  useEffect(() => {
    setAmount('');
  }, [props.item.collateral]);

  const options = useMemo(() => getOptions(props.item), [props.item]);
  const isCollateral = useMemo(
    () => collateral === assetByTokenAddress(props.item.collateralToken),
    [collateral, props.item.collateralToken],
  );

  const weiAmount = useWeiAmount(amount);

  const { send, ...rest } = useCloseWithSwap(
    props.item.loanId,
    receiver,
    weiAmount,
    isCollateral,
    '0x',
  );

  const handleConfirmSwap = useCallback(() => send(), [send]);

  const valid = useIsAmountWithinLimits(weiAmount, '1', props.item.collateral);

  const { t } = useTranslation();

  const { checkMaintenance, States } = useMaintenance();
  const closeTradesLocked = checkMaintenance(States.CLOSE_MARGIN_TRADES);

  const args = useMemo(
    () => [props.item.loanId, receiver, weiAmount, isCollateral, '0x'],
    [props.item.loanId, receiver, weiAmount, isCollateral],
  );

  const simulator = useSimulator(
    'sovrynProtocol',
    'closeWithSwap',
    args,
    '0',
    weiAmount !== '0',
  );

  const simulation = useFilterSimulatorResponseLogs<{
    to: string;
    asset: string;
    amount: string;
  }>(simulator, VAULT_WITHDRAW_LOG_SIGNATURE_HASH, VaultWithdrawLogInput);

  const result = useMemo(
    () =>
      simulation.logs
        .filter(
          item => item.decoded.to.toLowerCase() === receiver.toLowerCase(),
        )
        .map(item => ({
          asset: assetByTokenAddress(item.decoded.asset),
          value: item.decoded.amount,
        })),
    [simulation, receiver],
  );

  return (
    <>
      <div className="tw-mw-340 tw-mx-auto">
        <h1 className="tw-mb-6 tw-text-sov-white tw-text-center tw-tracking-normal">
          {t(translations.closeTradingPositionHandler.title)}
        </h1>

        <FormGroup
          label={t(translations.closeTradingPositionHandler.amountToClose)}
          className="tw-mt-7"
        >
          <AmountInput
            onChange={value => setAmount(value)}
            value={amount}
            maxAmount={props.item.collateral}
          />
        </FormGroup>

        <CollateralAssets
          label={t(translations.closeTradingPositionHandler.withdrawIn)}
          value={collateral}
          onChange={setCollateral}
          options={options}
        />

        {simulation.status !== SimulationStatus.NONE && (
          <>
            {simulation.status === SimulationStatus.PENDING ? (
              <div className="bp3-skeleton tw-h-6 tw-w-full tw-mb-2" />
            ) : (
              <>
                {simulation.status === SimulationStatus.SUCCESS ? (
                  <FormGroup
                    label={t(
                      translations.closeTradingPositionHandler.withdrawAmount,
                    )}
                  >
                    {result.map(item => (
                      <DummyInput
                        key={item.asset}
                        value={
                          <LoadableValue
                            loading={false}
                            value={weiToNumberFormat(item.value, 6)}
                            tooltip={weiToNumberFormat(item.value, 18)}
                          />
                        }
                        appendElem={<AssetSymbolRenderer asset={item.asset} />}
                      />
                    ))}
                  </FormGroup>
                ) : (
                  <ErrorBadge
                    content={t(
                      translations.closeTradingPositionHandler.simulationFailed,
                      { error: simulation.error },
                    )}
                  />
                )}
              </>
            )}
          </>
        )}

        <TxFeeCalculator
          args={args}
          methodName="closeWithSwap"
          contractName="sovrynProtocol"
          txConfig={{ gas: simulation.gasUsed }}
        />

        <DialogButton
          confirmLabel={t(translations.common.confirm)}
          onConfirm={() => handleConfirmSwap()}
          disabled={
            rest.loading || !valid || closeTradesLocked || simulator.loading
          }
          cancelLabel={t(translations.common.cancel)}
          onCancel={props.onCloseModal}
        />
      </div>
    </>
  );
}
