/**
 *
 * CloseTradingPositionForm
 *
 */
import React from 'react';
import { ActiveLoan } from '../../hooks/trading/useGetActiveLoans';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { Asset } from '../../../types/asset';

interface SwapOptions {}

interface Props {
  item: ActiveLoan;
  onCloseModal: () => void;
  onConfirmSwap: (value: SwapOptions) => void;
}

export function CloseTradingPositionForm(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const assetDetails = AssetsDictionary.get(props.item.loanToken as Asset);

  return <></>;
  // return (
  // <div className="container">
  //   <div className="d-flex flex-column align-items-center justify-content-center">
  //     <img
  //       className="mb-3"
  //       src={assetDetails.logoSvg}
  //       alt={props.asset}
  //       style={{ height: '5rem' }}
  //     />
  //   </div>
  //
  //   <div className="d-flex flex-row justify-content-between">
  //     <div className="flex-grow-1 mr-3">
  //       <InputGroup
  //         className="mb-3"
  //         value={amount}
  //         onChange={handleAmountChange}
  //       />
  //     </div>
  //     <div>
  //       <FormSelect
  //         filterable={false}
  //         items={colaratedAssets}
  //         onChange={item => setSelected(item.key)}
  //         value={selected}
  //       />
  //     </div>
  //   </div>
  //
  //   <BorrowInterestRate asset={props.asset} weiAmount={weiAmount} />
  //
  //   <AssetWalletBalance asset={selected} />
  //
  //   <div className="mb-4">
  //     <div className="d-inline text-lightGrey">Leverage</div>
  //     <div className="d-inline float-right">{props.leverage}x</div>
  //   </div>
  //
  //   {type !== 'none' && (
  //     <div className="mb-4">
  //       <SendTxProgress
  //         status={status}
  //         txHash={txHash}
  //         loading={loading}
  //         type={type}
  //       />
  //     </div>
  //   )}
  //
  //   <div className="d-flex flex-row justify-content-end align-items-center">
  //     <button className="btn btn-link ml-3 mt-0" onClick={handleCloseClick}>
  //       Cancel
  //     </button>
  //     <button
  //       className="btn btn-primary ml-3 mt-0"
  //       disabled={loading || !isConnected}
  //       onClick={() => trade()}
  //     >
  //       Leverage {props.asset}
  //     </button>
  //   </div>
  // </div>
  // );
}
