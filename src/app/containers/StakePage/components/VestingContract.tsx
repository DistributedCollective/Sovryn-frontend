import { Tooltip } from '@blueprintjs/core';
import { bignumber } from 'mathjs';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useMaintenance } from 'app/hooks/useMaintenance';
import logoSvg from 'assets/images/tokens/sov.svg';
import { translations } from 'locales/i18n';
import { getContract } from 'utils/blockchain/contract-helpers';
import { weiTo4, weiTo18 } from 'utils/blockchain/math-helpers';
import {
  vesting_getEndDate,
  vesting_getStartDate,
} from 'utils/blockchain/requests/vesting';
import { ethGenesisAddress, gasLimit } from 'utils/classifiers';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { weiToUSD } from 'utils/display-text/format';
import { contractReader } from 'utils/sovryn/contract-reader';
import { Asset } from 'types';
import { AddressBadge } from 'app/components/AddressBadge';
import { LoadableValue } from 'app/components/LoadableValue';
import { Modal } from 'app/components/Modal';
import { useStaking_balanceOf } from 'app/hooks/staking/useStaking_balanceOf';
import { useStaking_getAccumulatedFees } from 'app/hooks/staking/useStaking_getAccumulatedFees';
import { useStaking_getStakes } from 'app/hooks/staking/useStaking_getStakes';
import { useCachedAssetPrice } from 'app/hooks/trading/useCachedAssetPrice';
import { useAccount } from 'app/hooks/useAccount';
import { WithdrawVesting } from './WithdrawVesting';
import { VestGroup } from 'app/components/UserAssets/Vesting/types';
import { useSendToContractAddressTx } from 'app/hooks/useSendToContractAddressTx';
import { getVestingAbi } from 'utils/blockchain/requests/vesting';
import { AbiItem } from 'web3-utils';
import { TxType } from 'store/global/transactions-store/types';
import { TransactionDialog } from 'app/components/TransactionDialog';

interface IVestingContractProps {
  vestingAddress: string;
  type: VestGroup;
  onDelegate: (a: number) => void;
  paused?: boolean;
  frozen?: boolean;
}

const getAssetByVestingType = (type: VestGroup) => {
  switch (type) {
    case 'genesis':
      return Asset.CSOV;
    case 'fish':
      return Asset.FISH;
    default:
      return Asset.SOV;
  }
};

const getTokenContractNameByVestingType = (type: VestGroup) => {
  switch (type) {
    case 'genesis':
      return 'CSOV_token';
    case 'fish':
      return 'FISH_token';
    default:
      return 'SOV_token';
  }
};

export const VestingContract: React.FC<IVestingContractProps> = ({
  vestingAddress,
  type,
  onDelegate,
  paused,
  frozen,
}) => {
  const { t } = useTranslation();
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.DELEGATE_VESTS]: delegateLocked,
    [States.WITHDRAW_VESTS]: withdrawLocked,
  } = checkMaintenances();

  const account = useAccount();
  const getStakes = useStaking_getStakes(vestingAddress);
  const lockedAmount = useStaking_balanceOf(vestingAddress);
  const [stakingPeriodStart, setStakingPeriodStart] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [vestLoading, setVestLoading] = useState(false);
  const [locked, setLocked] = useState(true);
  const [delegate, setDelegate] = useState<any>([]);
  const [delegateLoading, setDelegateLoading] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const SOV = AssetsDictionary.get(Asset.SOV);
  const CSOV = AssetsDictionary.get(Asset.SOV);
  const dollars = useCachedAssetPrice(Asset.SOV, Asset.USDT);
  const rbtc = useCachedAssetPrice(getAssetByVestingType(type), Asset.RBTC);
  const dollarValue = useMemo(() => {
    if (lockedAmount === null) return '';
    return bignumber(lockedAmount.value)
      .mul(dollars.value)
      .div(10 ** SOV.decimals)
      .toFixed(0);
  }, [dollars.value, lockedAmount, SOV.decimals]);

  const tokenAddress = useMemo(
    () => getContract(getTokenContractNameByVestingType(type)).address,
    [type],
  );
  const currency = useStaking_getAccumulatedFees(vestingAddress, tokenAddress);

  const rbtcValue = useMemo(() => {
    if (currency === null) return '';
    return bignumber(currency.value)
      .mul(rbtc.value)
      .div(10 ** (type === 'genesis' ? CSOV.decimals : SOV.decimals))
      .toFixed(0);
  }, [currency, CSOV.decimals, SOV.decimals, type, rbtc.value]);

  useEffect(() => {
    async function getVestsList() {
      try {
        setVestLoading(true);
        Promise.all([
          vesting_getStartDate(vestingAddress, type).then(
            res => typeof res === 'string' && setStakingPeriodStart(res),
          ),
          vesting_getEndDate(vestingAddress, type).then(
            res => typeof res === 'string' && setUnlockDate(res),
          ),
        ]).then(_ => setVestLoading(false));
        setVestLoading(false);
      } catch (e) {
        console.error(e);
        setVestLoading(false);
      }
    }
    setVestLoading(false);
    if (vestingAddress !== ethGenesisAddress) {
      getVestsList().catch(console.error);
    }
  }, [vestingAddress, type, account]);

  useEffect(() => {
    async function getDelegate() {
      setDelegateLoading(true);
      const datesLength = getStakes.value['dates'].length;
      try {
        await contractReader
          .call('staking', 'delegates', [
            vestingAddress,
            getStakes.value['dates'][datesLength - 2],
          ])
          .then(res => {
            setDelegateLoading(false);
            if (res.toString().toLowerCase() !== vestingAddress.toLowerCase()) {
              setDelegate(res);
            }
            return false;
          });
      } catch (e) {
        console.error(e);
        setDelegateLoading(false);
      }
    }
    if (
      unlockDate &&
      !vestLoading &&
      stakingPeriodStart &&
      getStakes.value?.dates?.length > 0
    ) {
      getDelegate();
      setLocked(Number(unlockDate) > Math.round(new Date().getTime() / 1e3));
    }
  }, [
    vestingAddress,
    vestLoading,
    unlockDate,
    delegate,
    getStakes.value,
    stakingPeriodStart,
    type,
  ]);

  const { send, ...tx } = useSendToContractAddressTx(
    vestingAddress.toLowerCase(),
    getVestingAbi(type) as AbiItem[],
    'withdrawTokens',
  );

  const handleWithdraw = useCallback(
    (receiver: string) => {
      send([receiver], {
        gas: gasLimit[TxType.SOV_WITHDRAW_VESTING],
      });
    },
    [send],
  );

  return (
    <>
      <tr>
        <td>
          <div className="assetname tw-flex tw-items-center">
            <div>
              <img src={logoSvg} className="tw-ml-3 tw-mr-3" alt="sov" />
            </div>
            <div className="tw-text-sm tw-font-normal tw-hidden xl:tw-block tw-pl-3">
              {t(translations.stake.currentVests.assetType[type])}
            </div>
          </div>
        </td>
        <td className="tw-text-left tw-font-normal">
          <p
            className={classNames('tw-m-0', {
              'tw-skeleton': lockedAmount.loading,
            })}
          >
            {lockedAmount.value && (
              <>
                {weiTo4(lockedAmount.value)} {t(translations.stake.sov)}
                <br />≈{' '}
                <LoadableValue
                  value={weiToUSD(dollarValue)}
                  loading={dollars.loading}
                />
              </>
            )}
          </p>
        </td>
        <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
          <p
            className={classNames('tw-m-0', {
              'tw-skeleton': delegateLoading,
            })}
          >
            {delegate.length > 0 && (
              <>
                <AddressBadge
                  txHash={delegate}
                  startLength={6}
                  className={classNames(
                    'tw-text-secondary hover:tw-underline',
                    {
                      'tw-skeleton': delegateLoading,
                    },
                  )}
                />
              </>
            )}
            {!delegate.length && (
              <>{t(translations.stake.delegation.noDelegate)}</>
            )}
          </p>
        </td>
        <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
          {locked && (
            <p
              className={classNames('tw-m-0', {
                'tw-skeleton': !unlockDate,
              })}
            >
              {Math.abs(dayjs().diff(parseInt(unlockDate) * 1e3, 'days'))}{' '}
              {t(translations.stake.days)}
            </p>
          )}
        </td>
        <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
          <p
            className={classNames('tw-m-0', {
              'tw-skeleton': !stakingPeriodStart,
            })}
          >
            {dayjs
              .tz(parseInt(unlockDate) * 1e3, 'UTC')
              .tz(dayjs.tz.guess())
              .format('L - LTS Z')}
          </p>
        </td>
        <td>
          ≈{' '}
          <Tooltip
            position="bottom"
            hoverOpenDelay={0}
            hoverCloseDelay={0}
            interactionKind="hover"
            content={<>≈ {weiTo18(rbtcValue)} RBTC</>}
          >
            <LoadableValue value={weiTo4(rbtcValue)} loading={rbtc.loading} />
          </Tooltip>{' '}
          RBTC
        </td>
        <td className="md:tw-text-left tw-hidden md:tw-table-cell">
          <div className="tw-flex tw-flex-nowrap">
            {delegateLocked ? (
              <Tooltip
                position="bottom"
                hoverOpenDelay={0}
                hoverCloseDelay={0}
                interactionKind="hover"
                content={<>{t(translations.maintenance.delegateVests)}</>}
              >
                <button
                  type="button"
                  className="tw-text-primary tw-tracking-normal hover:tw-text-primary hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-montserrat tw-bg-transparent hover:tw-bg-opacity-0 tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-transparent"
                  data-action-id="staking-vest-delegateButton"
                >
                  {t(translations.stake.actions.delegate)}
                </button>
              </Tooltip>
            ) : (
              <button
                className={classNames(
                  'tw-text-primary tw-tracking-normal hover:tw-text-primary hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-montserrat',
                  paused &&
                    'tw-bg-transparent hover:tw-bg-opacity-0 tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-transparent',
                )}
                onClick={() => onDelegate(Number(unlockDate))}
                disabled={paused}
                data-action-id="staking-vest-delegateButton"
              >
                {t(translations.stake.actions.delegate)}
              </button>
            )}
            {withdrawLocked ? (
              <Tooltip
                position="bottom"
                hoverOpenDelay={0}
                hoverCloseDelay={0}
                interactionKind="hover"
                content={<>{t(translations.maintenance.withdrawVests)}</>}
              >
                <button
                  type="button"
                  className="tw-text-primary tw-tracking-normal hover:tw-text-primary hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-montserrat tw-bg-transparent hover:tw-bg-opacity-0 tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-transparent"
                  data-action-id="staking-vest-withdrawButton"
                >
                  {t(translations.stake.actions.withdraw)}
                </button>
              </Tooltip>
            ) : (
              <button
                type="button"
                className={classNames(
                  'tw-text-primary tw-tracking-normal hover:tw-text-primary hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-montserrat',
                  frozen &&
                    'tw-bg-transparent hover:tw-bg-opacity-0 tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-transparent',
                )}
                onClick={() => setShowWithdraw(true)}
                disabled={
                  !vestingAddress ||
                  vestingAddress === ethGenesisAddress ||
                  frozen
                }
                data-action-id="staking-vest-withdrawButton"
              >
                {t(translations.stake.actions.withdraw)}
              </button>
            )}
          </div>
        </td>
      </tr>
      <Modal
        show={showWithdraw}
        content={
          <>
            <WithdrawVesting
              vesting={vestingAddress}
              vestingType={type}
              onCloseModal={() => setShowWithdraw(false)}
              onWithdraw={handleWithdraw}
            />
          </>
        }
      />
      <TransactionDialog
        tx={tx}
        onUserConfirmed={() => setShowWithdraw(false)}
      />
    </>
  );
};
