import { useCallback, useMemo } from 'react';
import { BigNumber } from 'ethers';
import { useTranslation } from 'react-i18next';
import { IEarnedFee } from '../../hooks/useGetFeesEarnedClaimAmount';
import {
  ResetTxResponseInterface,
  useSendContractTx,
} from 'app/hooks/useSendContractTx';
import { useAccount } from 'app/hooks/useAccount';
import { contractReader } from 'utils/sovryn/contract-reader';
import { Asset } from 'types';
import { toastError } from 'utils/toaster';
import { gasLimit } from 'utils/classifiers';
import { TxType } from 'store/global/transactions-store/types';
import { translations } from 'locales/i18n';
import { UserCheckpoint } from './types';

const MAX_CHECKPOINTS = 150;
const MAX_NEXT_POSITIVE_CHECKPOINT = 75;

type HandleClaimAllResult = [ResetTxResponseInterface, () => void];

export const useHandleClaimAll = (fees: IEarnedFee[]): HandleClaimAllResult => {
  const { t } = useTranslation();
  const account = useAccount();
  const { send, ...tx } = useSendContractTx(
    'feeSharingProxy',
    'claimAllCollectedFees',
  );

  const claimable = useMemo(
    () => fees.filter(fee => BigNumber.from(fee.value).gt(0)),
    [fees],
  );

  const handleClaim = useCallback(async () => {
    const checkpoints = await Promise.all(
      claimable.map(fee =>
        getNextPositiveCheckpoint(account, fee).then(result => ({
          ...fee,
          startFrom: result.checkpointNum,
          hasSkippedCheckpoints: result.hasSkippedCheckpoints,
          hasFees: result.hasFees,
        })),
      ),
    ).then(result => result.filter(fee => fee.hasFees));

    if (checkpoints.length === 0) {
      toastError(
        t(translations.rewardPage.claimForm.noCheckpoints),
        'claim-all',
      );
      return;
    }

    const nonRbtcRegular = checkpoints
      .filter(
        item => !isBtcBasedToken(item.asset) && !item.hasSkippedCheckpoints,
      )
      .map(item => item.contractAddress);

    const rbtcRegular = checkpoints
      .filter(
        item => isBtcBasedToken(item.asset) && !item.hasSkippedCheckpoints,
      )
      .map(item => item.contractAddress);

    const tokensWithSkippedCheckpoints = checkpoints
      .filter(item => item.hasSkippedCheckpoints)
      .map(item => ({
        tokenAddress: item.contractAddress,
        fromCheckpoint: item.startFrom,
      }));

    send(
      [
        nonRbtcRegular,
        rbtcRegular,
        tokensWithSkippedCheckpoints,
        MAX_CHECKPOINTS,
        account,
      ],
      {
        gas: gasLimit[TxType.CLAIM_ALL_REWARDS],
      },
    );

    // withdrawStartingFromCheckpoints
  }, [claimable, send, account, t]);
  return [tx, handleClaim];
};

async function getNextPositiveCheckpoint(
  owner: string,
  fee: IEarnedFee,
): Promise<UserCheckpoint> {
  let userNextUnprocessedCheckpoint = fee.startFrom || 0;
  while (userNextUnprocessedCheckpoint < (fee.maxCheckpoints || 0)) {
    const {
      hasFees,
      checkpointNum,
      hasSkippedCheckpoints,
    } = await contractReader.call<UserCheckpoint>(
      'feeSharingProxy',
      'getNextPositiveUserCheckpoint',
      [
        owner,
        fee.contractAddress,
        userNextUnprocessedCheckpoint,
        MAX_NEXT_POSITIVE_CHECKPOINT,
      ],
    );

    userNextUnprocessedCheckpoint = Number(checkpointNum);

    if (!!hasFees) {
      return {
        asset: fee.asset,
        checkpointNum: Number(checkpointNum),
        hasFees,
        hasSkippedCheckpoints,
      };
    }
  }

  return {
    asset: fee.asset,
    checkpointNum: 0,
    hasFees: false,
    hasSkippedCheckpoints: false,
  };
}

function isBtcBasedToken(token: Asset) {
  return [Asset.RBTC, Asset.WRBTC].includes(token);
}
