import { useAccount } from 'app/hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { BigNumber } from 'ethers';
import { bignumber } from 'mathjs';
import { TxType } from 'store/global/transactions-store/types';
import { ethGenesisAddress, gasLimit } from 'utils/classifiers';
import { floatToABK64x64, PERPETUAL_ID } from '../utils';
import { usePerpetual_depositMarginToken } from './usePerpetual_depositMarginToken';

const MASK_MARKET_ORDER = BigNumber.from('0x40000000');
const MASK_CLOSE_ONLY = 0x80000000;

export const usePerpetual_openTrade = () => {
  const address = useAccount();

  const { deposit } = usePerpetual_depositMarginToken();
  const { send, ...rest } = useSendContractTx('perpetualManager', 'trade');

  return {
    trade: async (marginAmount: string, totalAmount: string) => {
      const isClosePositionTransaction = bignumber(totalAmount).lt(0);
      const limitPrice = isClosePositionTransaction ? -100000 : 1000000; // this is hardcoded for now but Vasili is preparing a function for this

      if (!isClosePositionTransaction) {
        await deposit(marginAmount);
      }

      const deadline = Math.round(Date.now() / 1000) + 86400; // 1 day
      const timeNow = Math.round(Date.now() / 1000);

      const order = [
        PERPETUAL_ID,
        address,
        floatToABK64x64(parseFloat(totalAmount)),
        floatToABK64x64(limitPrice),
        deadline,
        ethGenesisAddress,
        MASK_MARKET_ORDER,
        timeNow,
      ];

      await send(
        [order],
        {
          from: address,
          gas: gasLimit[TxType.OPEN_PERPETUAL_TRADE],
          gasPrice: 60,
        },
        { type: TxType.OPEN_PERPETUAL_TRADE },
      );
    },
    ...rest,
  };
};
