import React, { useEffect, useMemo, useState } from 'react';
import { Button, Nav, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Text, Tooltip } from '@blueprintjs/core';
import { translations } from 'locales/i18n';
import '../../assets/index.scss';
import clsx from 'clsx';
import { weiToFixed } from '../../../../../utils/blockchain/math-helpers';
import { Asset } from '../../../../../types';
import { useLending_profitOf } from '../../../../hooks/lending/useLending_profitOf';
import { bignumber } from 'mathjs';
import { useAccount } from '../../../../hooks/useAccount';
import { useLending_assetBalanceOf } from '../../../../hooks/lending/useLending_assetBalanceOf';
import { ButtonType } from '../../types';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { useLiquidityMining_getUserAccumulatedReward } from 'app/pages/LiquidityMining/hooks/useLiquidityMining_getUserAccumulatedReward';
import { getLendingContract } from '../../../../../utils/blockchain/contract-helpers';

type Props = {
  currency: Asset;
  rightButton: ButtonType;
  leftButton: ButtonType;
  setCurrentButton: (current: ButtonType) => void;
  setBorrowAmount?: (amount: string) => void;
};

const ButtonGroup: React.FC<Props> = ({
  currency,
  leftButton,
  rightButton,
  setCurrentButton,
  setBorrowAmount,
}) => {
  const [key, setKey] = useState(leftButton);
  const { t } = useTranslation();
  const asset = currency as Asset;
  const { value: profitCall } = useLending_profitOf(asset, useAccount());
  const { value: balanceCall } = useLending_assetBalanceOf(asset, useAccount());
  const { value: rewards } = useLiquidityMining_getUserAccumulatedReward(
    getLendingContract(asset).address,
  );

  const balance = useMemo(() => {
    return bignumber(balanceCall).minus(profitCall).toString();
  }, [balanceCall, profitCall]);

  useEffect(() => {
    setCurrentButton(key);
  }, [key, setCurrentButton]);

  return (
    <>
      <div className="tw-grid tw--mx-4 tw-grid-cols-12">
        <Tab.Container id="button-group" defaultActiveKey={leftButton}>
          <Nav
            onSelect={k => setKey((k as unknown) as ButtonType)}
            className="tw-col-span-12 deposit-button-group tw-w-full"
            variant="pills"
          >
            <Nav.Link eventKey={leftButton}>
              <Button
                variant="light"
                size="lg"
                className={clsx(
                  'button-deposit',
                  key === rightButton && 'disabled',
                )}
              >
                {t(translations.lendingPage.tabs[leftButton])}
              </Button>
            </Nav.Link>
            <Nav.Link eventKey={rightButton}>
              <Button
                variant="light"
                size="lg"
                className={clsx(
                  'button-deposit',
                  key === leftButton && 'disabled',
                )}
              >
                {t(translations.lendingPage.tabs[rightButton])}
              </Button>
            </Nav.Link>
          </Nav>
        </Tab.Container>
      </div>

      {(key === ButtonType.REDEEM || key === ButtonType.DEPOSIT) && (
        <div className="tw-container tw-mx-auto tw-px-4 tw-my-4">
          <div className="withdraw-content tw-py-4 tw--mx-4">
            <div className="tw-grid tw-grid-cols-2 tw-gap-8">
              <div className="tw-flex tw-flex-col tw-pl-4">
                <h4 className="tw-flex-grow">
                  <Text className="tw-break-normal">
                    {t(translations.lend.container.balance)}
                  </Text>
                </h4>
                <div>
                  <span className="tw-text-muted">
                    <AssetRenderer asset={currency} />
                  </span>{' '}
                  <strong>
                    <Tooltip
                      position="top"
                      content={<>{weiToFixed(balance, 18)}</>}
                    >
                      {weiToFixed(balance, 4)}
                    </Tooltip>
                  </strong>
                </div>
              </div>
              <div className="tw-flex tw-flex-col">
                <h4 className="tw-flex-grow">
                  <Text className="tw-text-break">
                    {t(translations.lend.container.profit)}
                  </Text>
                </h4>
                <div>
                  <span className="tw-text-muted">
                    <AssetRenderer asset={currency} />
                  </span>{' '}
                  <strong>
                    <Tooltip
                      position="top"
                      content={<>{weiToFixed(profitCall, 18)}</>}
                    >
                      {weiToFixed(profitCall, 8)}
                    </Tooltip>
                  </strong>
                </div>
              </div>
            </div>
            <div className="tw-pt-3 tw-px-4">
              <span className="tw-text-muted">
                <AssetRenderer asset={Asset.SOV} /> Rewards
              </span>{' '}
              <strong>
                <Tooltip
                  position="top"
                  content={<>{weiToFixed(rewards, 18)}</>}
                >
                  {weiToFixed(rewards, 8)}
                </Tooltip>
              </strong>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonGroup;
