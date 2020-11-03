/**
 *
 * ActiveLoanTableContainer
 *
 */
import React, { useEffect, useState } from 'react';
import { CloseTradingPositionHandler } from '../../../../containers/CloseTradingPositionHandler';
import { TopUpTradingPositionHandler } from '../../../../containers/TopUpTradingPositionHandler';
import { CurrentMargin } from '../CurrentMargin';
import { InterestAPR } from '../InterestAPR';
import { ActiveLoanLiquidation } from '../ActiveLoanLiquidation';
import { ActiveLoanProfit } from '../ActiveLoanProfit';
import { DisplayDate } from '../DisplayDate';
import { ActiveLoanTableMobile } from '../ActiveLoanTableMobile';
import { ActiveLoanTableDesktop } from '../ActiveLoanTableDesktop';
import { useBorrowAssetPrice } from 'app/hooks/trading/useBorrowAssetPrice';
import { symbolByTokenAddress } from 'utils/blockchain/contract-helpers';
import { leverageFromMargin } from '../../../../../utils/blockchain/leverage-from-start-margin';
import styled from 'styled-components';
import { Icon } from '@blueprintjs/core';
import { Asset } from 'types/asset';
import {
  formatAsUSD,
  formatAsBTCPrice,
  formatAsBTC,
  percentTo2,
} from 'utils/display-text/format';

interface Props {
  data: any;
  activeTrades: boolean;
}

export function ActiveLoanTableContainer(props: Props) {
  const [positionCloseModalOpen, setPositionCloseModalOpen] = useState(false);
  const [positionMarginModalOpen, setPositionMarginModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(props.data[0]);
  const [expandedItem, setExpandedItem] = useState('');
  const [expandedId, setExpandedId] = useState('');
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  //TODO: Assets should not be hardcoded
  const { value: currentPrice } = useBorrowAssetPrice(Asset.BTC, Asset.DOC);

  const data = React.useMemo(() => {
    return props.data.map(item => {
      return {
        id: item.loanId,
        icon:
          symbolByTokenAddress(item.collateralToken) === 'BTC' ? (
            <Icon
              icon="circle-arrow-up"
              className="text-customTeal mx-2"
              iconSize={20}
            />
          ) : (
            <Icon
              icon="circle-arrow-down"
              className="text-Gold ml-2"
              iconSize={20}
            />
          ),
        positionSize: formatAsBTC(item.collateral, item.collateralToken),
        currentMargin: (
          <CurrentMargin
            currentMargin={item.currentMargin}
            startMargin={item.startMargin}
          />
        ),
        interestAPR: (
          <InterestAPR
            interestPerDay={item.interestOwedPerDay}
            principal={item.principal}
          />
        ),
        startPrice: formatAsBTCPrice(item.startRate, item.collateralToken),
        endDate: <DisplayDate timestamp={item.endTimestamp} />,
        leverage: `${leverageFromMargin(item.startMargin)}x`,
        profit: <ActiveLoanProfit item={item} currentPrice={currentPrice} />,
        liquidationPrice: (
          <ActiveLoanLiquidation item={item} currentPrice={currentPrice} />
        ),
        currentPrice: formatAsUSD(currentPrice),
        maintenanceMargin: percentTo2(item.maintenanceMargin),
        startMargin: percentTo2(item.startMargin),
        mobileActions: (
          <div className="d-flex flex-row flex-nowrap justify-content-around">
            <Icon
              icon="double-chevron-up"
              className="text-green mr-1 rounded-circle border border-green p-1"
              iconSize={16}
              onClick={() => {
                setPositionMarginModalOpen(true);
                setSelectedItem(item);
              }}
            />
            <Icon
              icon="cross"
              className="text-red ml-1 rounded-circle border border-red p-1"
              iconSize={16}
              onClick={() => {
                setPositionCloseModalOpen(true);
                setSelectedItem(item);
              }}
            />
          </div>
        ),
        actions: (
          <div className="d-flex flex-row flex-nowrap justify-content-between">
            <div className="mr-1">
              <TopUpButton
                onClick={() => {
                  setPositionMarginModalOpen(true);
                  setSelectedItem(item);
                }}
              >
                Top-Up
              </TopUpButton>
            </div>
            <div className="ml-1">
              <CloseButton
                onClick={() => {
                  setPositionCloseModalOpen(true);
                  setSelectedItem(item);
                }}
              >
                Close
              </CloseButton>
            </div>
          </div>
        ),
      };
    });
  }, [props.data, currentPrice]);

  useEffect(() => {
    // Resets selected item in modals if items was changed.
    if (selectedItem && selectedItem.loanId) {
      const loan = props.data.find(item => item.loanId === selectedItem.loanId);
      setSelectedItem(loan);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  useEffect(() => {
    if (!expandedId) {
      setExpandedItem('');
    }
  }, [expandedId]);

  useEffect(() => {
    window.addEventListener('resize', () => setWindowSize(window.innerWidth));
  }, []);

  return (
    <>
      {windowSize > 991 && (
        <ActiveLoanTableDesktop
          data={data}
          setExpandedId={setExpandedId}
          setExpandedItem={setExpandedItem}
          expandedId={expandedId}
          expandedItem={expandedItem}
        />
      )}
      {windowSize <= 991 && (
        <ActiveLoanTableMobile
          data={data}
          setExpandedId={setExpandedId}
          expandedId={expandedId}
        />
      )}
      <CloseTradingPositionHandler
        item={selectedItem}
        showModal={positionCloseModalOpen}
        onCloseModal={() => setPositionCloseModalOpen(false)}
      />

      {selectedItem && (
        <TopUpTradingPositionHandler
          item={selectedItem}
          showModal={positionMarginModalOpen}
          onCloseModal={() => setPositionMarginModalOpen(false)}
        />
      )}
    </>
  );
}

const TopUpButton = styled.button.attrs(_ => ({ type: 'button' }))`
  border: 2px solid var(--green);
  width: 77px;
  height: 32px;
  color: var(--green);
  background-color: var(--primary);
  border-radius: 8px;
`;

const CloseButton = styled.button.attrs(_ => ({ type: 'button' }))`
  border: 2px solid var(--red);
  width: 77px;
  height: 32px;
  color: var(--red);
  background-color: var(--primary);
  border-radius: 8px;
`;
