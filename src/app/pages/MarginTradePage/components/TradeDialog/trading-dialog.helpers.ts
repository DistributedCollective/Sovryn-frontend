import { bignumber } from 'mathjs';
import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { toWei } from 'utils/blockchain/math-helpers';
import { contractReader } from 'utils/sovryn/contract-reader';

export const totalDeposit = async (
  collateralTokenAddress: string,
  loanTokenAddress: string,
  collateralTokenSent: string,
  loanTokenSent: string,
) => {
  let totalDeposit = loanTokenSent;

  if (collateralTokenSent !== '0') {
    const {
      rate: collateralToLoanRate,
      precision: collateralToLoanPrecision,
    } = await contractReader.call<{ rate: string; precision: string }>(
      'priceFeed',
      'queryRate',
      [collateralTokenAddress, loanTokenAddress],
    );

    if (collateralToLoanPrecision === '0' || collateralToLoanRate === '0') {
      throw new Error('invalid rate collateral token');
    }

    let loanTokenAmount = bignumber(collateralTokenSent)
      .mul(collateralToLoanRate)
      .div(collateralToLoanPrecision);

    const collateralTokenAmount = await contractReader.call<string>(
      'sovrynProtocol',
      'getSwapExpectedReturn',
      [loanTokenAddress, collateralTokenAddress, loanTokenAmount.toFixed(0)],
    );

    if (collateralTokenAmount !== collateralTokenSent) {
      loanTokenAmount = loanTokenAmount
        .mul(collateralTokenAmount)
        .div(collateralTokenSent);
    }

    totalDeposit = loanTokenAmount.add(totalDeposit).toFixed(0);
  }

  return totalDeposit;
};

export const _getMarginBorrowAmountAndRate = async (
  loanToken: Asset,
  leverage: number,
  depositAmount: string,
) => {
  const leverageAmount = toWei(leverage - 1, 'ether');
  const loanSizeBeforeInterest = bignumber(depositAmount)
    .mul(leverageAmount)
    .div(10 ** 18)
    .toFixed(0);

  const interestRate = await contractReader.call<string>(
    getLendingContractName(loanToken),
    'nextBorrowInterestRate', // we should call _nextBorrowInterestRate2 but it's not public function :(
    [loanSizeBeforeInterest],
  );
  const borrowAmount = adjustLoanSize(
    interestRate,
    28, //days
    loanSizeBeforeInterest,
  );
  return { borrowAmount, interestRate };
};

export const adjustLoanSize = (
  interestRate: string,
  maxDuration: number,
  loanSizeBeforeInterest: string,
) => {
  const interestForDuration = bignumber(interestRate).mul(maxDuration).div(365);
  const divisor = bignumber(10 ** 20).sub(interestForDuration);
  return bignumber(loanSizeBeforeInterest)
    .mul(10 ** 20)
    .div(divisor)
    .toFixed(0);
};
