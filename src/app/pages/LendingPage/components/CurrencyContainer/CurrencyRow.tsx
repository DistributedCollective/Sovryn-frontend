import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LendingPool } from 'utils/models/lending-pool';
import { translations } from 'locales/i18n';
import styled from 'styled-components/macro';
import { useIsConnected } from 'app/hooks/useAccount';
import { PoolChart } from './PoolChart';
import { CardRow } from 'app/components/FinanceV2Components/CardRow';
import { UserLendingInfo } from './UserLendingInfo';
import { LendingDialog } from '../LendingDialog';
import LeftSection from './LeftSection';
import { ActionButton } from 'app/components/Form/ActionButton';
import { Asset } from 'types';
import { Tooltip } from '@blueprintjs/core';
import { IPromotionLinkState } from 'app/components/Promotions/components/PromotionCard/types';
import { useHistory, useLocation } from 'react-router-dom';
import { DialogType } from '../../types';

interface ICurrencyRowProps {
  lendingPool: LendingPool;
  lendingAmount: string;
  depositLocked: boolean;
  withdrawLocked: boolean;
  linkAsset?: Asset;
}

const CurrencyRow: React.FC<ICurrencyRowProps> = ({
  lendingPool,
  lendingAmount,
  depositLocked,
  withdrawLocked,
  linkAsset,
}) => {
  const connected = useIsConnected();
  const { t } = useTranslation();
  const location = useLocation<IPromotionLinkState>();
  const history = useHistory();
  const [dialog, setDialog] = useState<DialogType>(
    lendingPool.getAsset() === linkAsset ? DialogType.ADD : DialogType.NONE,
  );
  const [isEmptyBalance, setIsEmptyBalance] = useState(true);

  const onNonEmptyBalance = useCallback(() => setIsEmptyBalance(false), [
    setIsEmptyBalance,
  ]);

  const asset = lendingPool.getAsset();

  useEffect(() => {
    if (
      location.state?.promotionSelectedAsset === asset &&
      !depositLocked &&
      connected
    ) {
      setDialog(DialogType.ADD);
      history.push({
        state: undefined,
      });
    }
  }, [setDialog, history, location.state, asset, connected, depositLocked]);

  const Actions = () => {
    return (
      <div className="tw-ml-5 tw-w-full tw-max-w-36">
        {!depositLocked ? (
          <ActionButton
            text={t(translations.lendingPage.deposit)}
            onClick={() => setDialog(DialogType.ADD)}
            className="tw-block tw-w-full tw-mb-3 tw-rounded-lg tw-bg-primary-10 hover:tw-opacity-75"
            textClassName="tw-text-base"
            disabled={depositLocked || !connected}
            dataActionId={`lend-depositButton-${asset}`}
          />
        ) : (
          <Tooltip
            position="bottom"
            hoverOpenDelay={0}
            hoverCloseDelay={0}
            className="tw-block"
            interactionKind="hover"
            content={t(translations.maintenance.depositLend)}
          >
            <ActionButton
              text={t(translations.lendingPage.deposit)}
              onClick={() => setDialog(DialogType.ADD)}
              className="tw-block tw-w-full tw-mb-3 tw-rounded-lg tw-bg-primary-10 hover:tw-opacity-75"
              textClassName="tw-text-base"
              disabled={depositLocked}
            />
          </Tooltip>
        )}
        {!withdrawLocked ? (
          <ActionButton
            text={t(translations.lendingPage.withdraw)}
            onClick={() => setDialog(DialogType.REMOVE)}
            className="tw-block tw-w-full tw-rounded-lg"
            textClassName="tw-text-base"
            disabled={isEmptyBalance || withdrawLocked || !connected}
            dataActionId={`lend-withdrawalButton-${asset}`}
          />
        ) : (
          <Tooltip
            position="bottom"
            hoverOpenDelay={0}
            hoverCloseDelay={0}
            className="tw-block"
            interactionKind="hover"
            content={t(translations.maintenance.withdrawLend)}
          >
            <ActionButton
              text={t(translations.lendingPage.withdraw)}
              onClick={() => setDialog(DialogType.REMOVE)}
              className="tw-block tw-w-full tw-rounded-lg"
              textClassName="tw-text-base"
              disabled={isEmptyBalance || withdrawLocked}
            />
          </Tooltip>
        )}
      </div>
    );
  };

  return (
    <div>
      <CardRow
        LeftSection={<LeftSection asset={asset} />}
        ChartSection={
          <ChartWrapper className="tw-mr-4">
            <PoolChart pool={lendingPool} />
          </ChartWrapper>
        }
        Actions={<Actions />}
        DataSection={
          <UserLendingInfo
            lendingPool={lendingPool}
            lendingAmount={lendingAmount}
            onNonEmptyBalance={onNonEmptyBalance}
          />
        }
        leftColor={undefined}
        chartReady={true}
      />

      <LendingDialog
        currency={asset}
        showModal={dialog !== DialogType.NONE}
        onCloseModal={() => setDialog(DialogType.NONE)}
        type={dialog}
        lendingAmount={lendingAmount}
      />
    </div>
  );
};

export default CurrencyRow;

const ChartWrapper = styled.div`
  @media (max-width: 1350px) {
    display: none;
  }
  @media (min-width: 1350px) {
    max-width: 20.5rem;
  }
  @media (min-width: 1500px) {
    max-width: 30rem;
  }
`;
