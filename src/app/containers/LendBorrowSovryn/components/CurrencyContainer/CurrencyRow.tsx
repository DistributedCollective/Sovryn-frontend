import React from 'react';
import '../../assets/index.scss';
import clsx from 'clsx';
import { AssetInterestRate } from '../../../../components/AssetInterestRate';
import { Asset } from '../../../../../types/asset';
import styled from 'styled-components';

type Props = {
  icon: string;
  title: string;
  lendApr: number;
  borrowApr: number;
  state: string;
  weiAmount: string;
  asset: Asset;
};

const CurrencyRow: React.FC<Props> = ({
  icon,
  title,
  state,
  weiAmount,
  asset,
}) => {
  return (
    <div
      className={clsx(
        'sovryn-border px-3 py-1 py-lg-2 d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center currency-container font-family-rowdies mb-3',
        state === title && 'currency-container__active',
      )}
    >
      <div className="d-flex flex-row justify-content-start align-items-center currency currency-title w-lg-50 mb-3 mb-lg-0">
        <StyledImage src={icon} alt="BTC Icon" />
        <h3 className="m-0">{title}</h3>
      </div>
      <div className="d-flex currency w-lg-50">
        <div className="mr-3 w-50">
          <span className="text-muted">Lend APR:</span>
          <AssetInterestRate asset={asset} weiAmount={weiAmount} />
        </div>
        <div className="w-50">
          <span className="text-muted">Borrow APR:</span>
          <p>
            <span> ...</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrencyRow;

const StyledImage = styled.img`
  width: 44px;
  height: 44px;
  // object-fit: scale-down;
  margin-right: 11px;
`;
