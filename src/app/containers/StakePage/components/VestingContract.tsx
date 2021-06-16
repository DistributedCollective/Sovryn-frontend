import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import moment from 'moment-timezone';
import logoSvg from 'assets/images/tokens/sov.svg';
import { bignumber } from 'mathjs';
import { weiToNumberFormat } from 'utils/display-text/format';
import { contractReader } from 'utils/sovryn/contract-reader';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { ethGenesisAddress } from 'utils/classifiers';
import { Modal } from '../../../components/Modal';
import { Asset } from '../../../../types/asset';
import { getContract } from 'utils/blockchain/contract-helpers';
import { useAccount } from '../../../hooks/useAccount';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { numberToUSD } from 'utils/display-text/format';
import { LoadableValue } from '../../../components/LoadableValue';
import { AddressBadge } from '../../../components/AddressBadge';
import { WithdrawVesting } from './WithdrawVesting';
import { useCachedAssetPrice } from '../../../hooks/trading/useCachedAssetPrice';
import { useStaking_balanceOf } from '../../../hooks/staking/useStaking_balanceOf';
import { useStaking_getStakes } from '../../../hooks/staking/useStaking_getStakes';
import { useStaking_getAccumulatedFees } from '../../../hooks/staking/useStaking_getAccumulatedFees';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { Tooltip } from '@blueprintjs/core';

import {
  vesting_getEndDate,
  vesting_getStartDate,
} from 'utils/blockchain/requests/vesting';

interface Props {
  vestingAddress: string;
  type: 'genesis' | 'origin' | 'team' | 'reward';
  onDelegate: (a: number) => void;
}

export function VestingContract(props: Props) {
  const { t } = useTranslation();
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.DELEGATE_VESTS]: delegateLocked,
    [States.WITHDRAW_VESTS]: withdrawLocked,
  } = checkMaintenances();

  const account = useAccount();
  const getStakes = useStaking_getStakes(props.vestingAddress);
  const lockedAmount = useStaking_balanceOf(props.vestingAddress);
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
  const rbtc = useCachedAssetPrice(
    Asset[props.type === 'genesis' ? 'CSOV' : 'SOV'],
    Asset.RBTC,
  );
  const dollarValue = useMemo(() => {
    if (lockedAmount === null) return '';
    return bignumber(lockedAmount.value)
      .mul(dollars.value)
      .div(10 ** SOV.decimals)
      .toFixed(0);
  }, [dollars.value, lockedAmount, SOV.decimals]);

  const token = (props.type === 'genesis' ? 'CSOV_token' : 'SOV_token') as any;
  const tokenAddress = getContract(token).address;
  const currency = useStaking_getAccumulatedFees(
    props.vestingAddress,
    tokenAddress,
  );

  const rbtcValue = useMemo(() => {
    if (currency === null) return '';
    return bignumber(currency.value)
      .mul(rbtc.value)
      .div(10 ** (props.type === 'genesis' ? CSOV.decimals : SOV.decimals))
      .toFixed(0);
  }, [currency, CSOV.decimals, SOV.decimals, props.type, rbtc.value]);

  useEffect(() => {
    async function getVestsList() {
      try {
        setVestLoading(true);
        Promise.all([
          vesting_getStartDate(props.vestingAddress).then(res =>
            setStakingPeriodStart(res as any),
          ),
          vesting_getEndDate(props.vestingAddress).then(res =>
            setUnlockDate(res as any),
          ),
        ]).then(_ => setVestLoading(false));
        setVestLoading(false);
      } catch (e) {
        console.error(e);
        setVestLoading(false);
      }
    }
    setVestLoading(false);
    if (props.vestingAddress !== ethGenesisAddress) {
      getVestsList().catch(console.error);
    }
  }, [props.vestingAddress, account]);

  useEffect(() => {
    async function getDelegate() {
      setDelegateLoading(true);
      const datesLength = getStakes.value['dates'].length;
      try {
        await contractReader
          .call('staking', 'delegates', [
            props.vestingAddress,
            getStakes.value['dates'][datesLength - 2],
          ])
          .then(res => {
            setDelegateLoading(false);
            if (
              res.toString().toLowerCase() !==
              props.vestingAddress.toLowerCase()
            ) {
              setDelegate(res);
            }
            return false;
          });
      } catch (e) {
        console.error(e);
        setDelegateLoading(false);
      }
    }
    if (unlockDate && !vestLoading && getStakes.value['dates'].length > 0) {
      getDelegate();
      setLocked(Number(unlockDate) > Math.round(new Date().getTime() / 1e3));
    }
  }, [
    props.vestingAddress,
    vestLoading,
    unlockDate,
    delegate,
    getStakes.value,
  ]);

  return (
    <>
      {vestLoading ? (
        <tr>
          <td colSpan={7} className="skeleton" />
        </tr>
      ) : (
        weiToNumberFormat(lockedAmount.value) !== '0' && (
          <tr>
            <td>
              <div className="assetname tw-flex tw-items-center">
                <div>
                  <img src={logoSvg} className="tw-ml-3 tw-mr-3" alt="sov" />
                </div>
                <div className="tw-text-sm tw-font-normal tw-hidden xl:tw-block tw-pl-3">
                  {props.type === 'genesis' && 'Genesis SOV'}
                  {props.type === 'origin' && 'Origin SOV'}
                  {props.type === 'team' && 'Team SOV'}
                  {props.type === 'reward' && 'Reward SOV'}
                </div>
              </div>
            </td>
            <td className="tw-text-left tw-font-normal">
              <p className={`tw-m-0 ${lockedAmount.loading && 'skeleton'}`}>
                {lockedAmount.value && (
                  <>
                    {weiToNumberFormat(lockedAmount.value)}{' '}
                    {t(translations.stake.sov)}
                    <br />≈{' '}
                    <LoadableValue
                      value={numberToUSD(Number(weiToFixed(dollarValue, 4)), 4)}
                      loading={dollars.loading}
                    />
                  </>
                )}
              </p>
            </td>
            <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
              <p className={`tw-m-0 ${delegateLoading && 'skeleton'}`}>
                {delegate.length > 0 && (
                  <>
                    <AddressBadge
                      txHash={delegate}
                      startLength={6}
                      className={`tw-text-theme-blue hover:tw-underline ${
                        delegateLoading && 'skeleton'
                      }`}
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
                <p className={`tw-m-0 ${!unlockDate && 'skeleton'}`}>
                  {Math.abs(
                    moment().diff(
                      moment(new Date(parseInt(unlockDate) * 1e3)),
                      'days',
                    ),
                  )}{' '}
                  days
                </p>
              )}
            </td>
            <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
              <p className={`tw-m-0 ${!stakingPeriodStart && 'skeleton'}`}>
                {moment
                  .tz(new Date(parseInt(stakingPeriodStart) * 1e3), 'GMT')
                  .format('DD/MM/YYYY - h:mm:ss a z')}
              </p>
            </td>
            <td>
              ≈{' '}
              <LoadableValue
                value={weiToNumberFormat(rbtcValue, 4)}
                loading={rbtc.loading}
              />{' '}
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
                      className="tw-text-gold tw-tracking-normal hover:tw-text-gold hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-montserrat tw-bg-transparent hover:tw-bg-opacity-0 tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-transparent"
                    >
                      {t(translations.stake.actions.delegate)}
                    </button>
                  </Tooltip>
                ) : (
                  <button
                    className="tw-text-gold tw-tracking-normal hover:tw-text-gold hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-montserrat"
                    onClick={() => props.onDelegate(Number(unlockDate))}
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
                      className="tw-text-gold tw-tracking-normal hover:tw-text-gold hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-montserrat tw-bg-transparent hover:tw-bg-opacity-0 tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-transparent"
                    >
                      {t(translations.stake.actions.withdraw)}
                    </button>
                  </Tooltip>
                ) : (
                  <button
                    type="button"
                    className="tw-text-gold tw-tracking-normal hover:tw-text-gold hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-montserrat"
                    onClick={() => setShowWithdraw(true)}
                    disabled={
                      !props.vestingAddress ||
                      props.vestingAddress === ethGenesisAddress
                    }
                  >
                    {t(translations.stake.actions.withdraw)}
                  </button>
                )}
              </div>
            </td>
          </tr>
        )
      )}
      <Modal
        show={showWithdraw}
        content={
          <>
            <WithdrawVesting
              vesting={props.vestingAddress}
              onCloseModal={() => setShowWithdraw(false)}
            />
          </>
        }
      />
    </>
  );
}
